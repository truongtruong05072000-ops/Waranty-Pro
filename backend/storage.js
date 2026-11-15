// backend/storage.js
import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';

class Storage {
  constructor() {
    this.authCache = {
      serviceos: { cookie: '', lastLogin: 0 },
      dealerPortal: { accessToken: '', refreshToken: '', expiresAt: 0, user: null }
    };
    this.mergedOrders = new Map(); // key: VIN or orderId -> merged order
    this.userEdits = new Map();    // key: VIN or orderId -> { userNote, internalDispatch, customTimer, userEditedAt }
    this.lastSync = {
      serviceos: { timestamp: 0, count: 0, status: 'IDLE', total: 0 },
      dealerPortal: { timestamp: 0, count: 0, status: 'IDLE', streamA: 0, streamB: 0 }
    };

    this.loadAuthCache();
    this.loadDataCache();
  }

  loadAuthCache() {
    try {
      if (fs.existsSync(CONFIG.PATHS.AUTH_CACHE)) {
        const raw = fs.readFileSync(CONFIG.PATHS.AUTH_CACHE, 'utf-8');
        const data = JSON.parse(raw);
        if (data.serviceos) this.authCache.serviceos = data.serviceos;
        if (data.dealerPortal) this.authCache.dealerPortal = data.dealerPortal;
        console.log('[Storage] Đã nạp Auth Cache từ disk.');
      }
    } catch (err) {
      console.warn('[Storage] Không thể đọc .auth-cache.json:', err.message);
    }
  }

  saveAuthCache() {
    try {
      fs.writeFileSync(CONFIG.PATHS.AUTH_CACHE, JSON.stringify(this.authCache, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Storage] Lỗi lưu .auth-cache.json:', err.message);
    }
  }

  loadDataCache() {
    try {
      if (fs.existsSync(CONFIG.PATHS.DB_CACHE)) {
        const raw = fs.readFileSync(CONFIG.PATHS.DB_CACHE, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data.orders)) {
          for (const o of data.orders) {
            const key = o.vin ? o.vin.toUpperCase() : (o.id || o.code);
            this.mergedOrders.set(key, o);
          }
        }
        if (data.userEdits && typeof data.userEdits === 'object') {
          for (const [k, v] of Object.entries(data.userEdits)) {
            this.userEdits.set(k, v);
          }
        }
        if (data.lastSync) this.lastSync = data.lastSync;
        console.log(`[Storage] Đã nạp ${this.mergedOrders.size} xe từ Data Cache.`);
      }
    } catch (err) {
      console.warn('[Storage] Không thể đọc .data-cache.json:', err.message);
    }
  }

  saveDataCache() {
    try {
      const payload = {
        savedAt: new Date().toISOString(),
        totalOrders: this.mergedOrders.size,
        orders: Array.from(this.mergedOrders.values()),
        userEdits: Object.fromEntries(this.userEdits.entries()),
        lastSync: this.lastSync
      };
      fs.writeFileSync(CONFIG.PATHS.DB_CACHE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Storage] Lỗi lưu .data-cache.json:', err.message);
    }
  }

  // Quản lý Token Dealer Portal
  getDealerPortalToken() {
    return this.authCache.dealerPortal;
  }

  setDealerPortalTokens(accessToken, refreshToken, user = null, expiresInSec = 900) {
    this.authCache.dealerPortal.accessToken = accessToken || this.authCache.dealerPortal.accessToken;
    if (refreshToken) this.authCache.dealerPortal.refreshToken = refreshToken;
    this.authCache.dealerPortal.expiresAt = Date.now() + (expiresInSec * 1000);
    if (user) this.authCache.dealerPortal.user = user;
    this.saveAuthCache();

    // 1. Tự động ghi đè token mới vào file .env trên Server để khởi động lại vẫn đọc được
    if (refreshToken) {
      this.updateEnvFile('DEALER_PORTAL_REFRESH_TOKEN', refreshToken);
      if (accessToken) {
        this.updateEnvFile('DEALER_PORTAL_ACCESS_TOKEN', accessToken);
      }
      // 2. Ghi vào Cloudflare KV / Google Sheets Webhook nếu được cấu hình
      this.syncTokenToRemoteStore(refreshToken, accessToken);
    }
  }

  updateEnvFile(key, value) {
    try {
      const envPath = path.join(CONFIG.PATHS.ROOT, '.env');
      if (fs.existsSync(envPath)) {
        let content = fs.readFileSync(envPath, 'utf-8');
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(content)) {
          content = content.replace(regex, `${key}=${value}`);
        } else {
          content += `\n${key}=${value}`;
        }
        fs.writeFileSync(envPath, content, 'utf-8');
      }
    } catch (e) {
      // Bỏ qua nếu môi trường container không cấp quyền ghi .env
    }
  }

  async syncTokenToRemoteStore(refreshToken, accessToken) {
    const remoteUrl = process.env.TOKEN_STORAGE_WEBHOOK_URL || process.env.CF_KV_REST_API_URL;
    if (!remoteUrl) return;

    try {
      await fetch(remoteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.CF_KV_API_TOKEN ? { 'Authorization': `Bearer ${process.env.CF_KV_API_TOKEN}` } : {})
        },
        body: JSON.stringify({
          key: 'DEALER_PORTAL_REFRESH_TOKEN',
          refreshToken,
          accessToken,
          dealerCode: CONFIG.DEALER_CODE,
          updatedAt: new Date().toISOString()
        })
      });
      console.log('[Storage] Đã đồng bộ refreshToken mới lên Cloud/KV thành công.');
    } catch (err) {
      console.warn('[Storage] Không thể đồng bộ token lên Remote Store:', err.message);
    }
  }

  // Quản lý Cookie ServiceOS
  getServiceOsCookie() {
    return this.authCache.serviceos.cookie;
  }

  setServiceOsCookie(cookieStr) {
    this.authCache.serviceos.cookie = cookieStr;
    this.authCache.serviceos.lastLogin = Date.now();
    this.saveAuthCache();
  }

  // Ghi nhận thao tác người dùng (Ghi chú KTV nội bộ, điều phối, timer...)
  recordUserEdit(vinOrId, editData) {
    if (!vinOrId) return;
    const key = String(vinOrId).trim().toUpperCase();
    const existing = this.userEdits.get(key) || {};
    const updated = {
      ...existing,
      ...editData,
      userEditedAt: Date.now()
    };
    this.userEdits.set(key, updated);

    // Áp dụng ngay vào xe trong bộ nhớ
    const ord = this.mergedOrders.get(key);
    if (ord) {
      if (editData.userNote !== undefined) ord.userNote = editData.userNote;
      if (editData.internalDispatch !== undefined) ord.internalDispatch = editData.internalDispatch;
      if (editData.customTimer !== undefined) ord.customTimer = editData.customTimer;
    }
    this.saveDataCache();
  }

  getUserEdit(vinOrId) {
    if (!vinOrId) return null;
    return this.userEdits.get(String(vinOrId).trim().toUpperCase()) || null;
  }

  getAllUserEdits() {
    return Object.fromEntries(this.userEdits.entries());
  }

  getDataCache() {
    return {
      orders: Array.from(this.mergedOrders.values()),
      userEdits: Object.fromEntries(this.userEdits.entries()),
      lastSync: this.lastSync,
      total: this.mergedOrders.size
    };
  }
}

export const storage = new Storage();
