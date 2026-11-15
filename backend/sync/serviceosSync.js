// backend/sync/serviceosSync.js
import { EventEmitter } from 'events';
import { CONFIG } from '../config.js';
import { serviceosAuth } from '../auth/serviceosAuth.js';
import { SmartMerger, smartMerger } from './smartMerger.js';
import { storage } from '../storage.js';

export class ServiceOsSync extends EventEmitter {
  constructor() {
    super();
    this.ramCache = new Map(); // Map<id, updated_at>
    this.isPolling = false;
    this.timer = null;
    this.stats = {
      lastRun: null,
      totalInWorkshop: 0,
      lastUpdatedCount: 0,
      status: 'IDLE',
      lastError: null
    };
  }

  start() {
    console.log(`[ServiceOS Sync] Khởi động luồng quét ServiceOS (chu kỳ ${CONFIG.SERVICEOS.POLL_INTERVAL_MS}ms, chi nhánh ${CONFIG.BRANCH_ID})...`);
    this.syncOnce();
    this.timer = setInterval(() => this.syncOnce(), CONFIG.SERVICEOS.POLL_INTERVAL_MS);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  async poll() {
    return this.syncOnce();
  }

  async syncOnce() {
    if (this.isPolling) return;
    this.isPolling = true;

    try {
      this.stats.status = 'SYNCING';
      storage.lastSync.serviceos.status = 'SYNCING';

      // 1. Quét trang 1 (page_size = 200)
      const urlPage1 = `/api/work-orders?status=active&branch_id=${CONFIG.BRANCH_ID}&page=1&page_size=200`;
      const res1 = await serviceosAuth.fetchWithAuth(urlPage1);
      if (!res1.ok) {
        throw new Error(`HTTP ${res1.status}`);
      }

      const data1 = await res1.json();
      const rows1 = data1.rows || data1.items || data1.data || (Array.isArray(data1) ? data1 : []);
      const total = data1.total || rows1.length;
      let allOrders = [...rows1];

      // 2. Thuật toán chống sót: Kéo song song toàn bộ các trang còn lại
      if (total > rows1.length) {
        const pageSize = 200;
        const totalPages = Math.ceil(total / pageSize);
        const promises = [];

        for (let p = 2; p <= Math.min(totalPages, 20); p++) {
          const pageUrl = `/api/work-orders?status=active&branch_id=${CONFIG.BRANCH_ID}&page=${p}&page_size=${pageSize}`;
          promises.push(
            serviceosAuth.fetchWithAuth(pageUrl)
              .then(r => r.ok ? r.json() : null)
              .then(d => d ? (d.rows || d.items || d.data || []) : [])
              .catch(err => {
                console.warn(`[ServiceOS Sync] Lỗi tải trang ${p}:`, err.message);
                return [];
              })
          );
        }

        const otherPages = await Promise.all(promises);
        for (const pRows of otherPages) {
          if (Array.isArray(pRows) && pRows.length > 0) {
            allOrders = allOrders.concat(pRows);
          }
        }
      }

      // Lọc các xe không còn hoạt động (đã giao hoặc hủy)
      const activeOrders = allOrders.filter(w => {
        const st = String(w.status || '').toLowerCase();
        return st !== 'delivered' && st !== 'cancelled' && st !== 'đã giao' && st !== 'hủy';
      });

      this.stats.totalInWorkshop = activeOrders.length;
      this.stats.lastRun = new Date().toISOString();
      this.stats.status = 'OK';

      storage.lastSync.serviceos.total = total;
      storage.lastSync.serviceos.count = activeOrders.length;
      storage.lastSync.serviceos.timestamp = Date.now();
      storage.lastSync.serviceos.status = 'OK';

      // 3. So khớp RAM: Chỉ xử lý xe mới hoặc có updated_at thay đổi
      const updatedList = [];
      const currentActiveIds = new Set();

      for (const raw of activeOrders) {
        currentActiveIds.add(raw.id);
        const lastUpdated = this.ramCache.get(raw.id);
        const currentUpdated = raw.updated_at || raw.received_at || 'initial';

        if (!lastUpdated || lastUpdated !== currentUpdated) {
          this.ramCache.set(raw.id, currentUpdated);
          const merged = SmartMerger.mergeServiceOsOrder(raw, null);
          if (merged) {
            updatedList.push(merged);
          }
        }
      }

      // Xóa các xe đã hoàn thành khỏi RAM cache
      for (const id of this.ramCache.keys()) {
        if (!currentActiveIds.has(id)) {
          this.ramCache.delete(id);
        }
      }

      // Đảm bảo storage.mergedOrders chỉ lưu đúng các lệnh active từ ServiceOS theo mã lệnh (chống đội số lượng xe trong xưởng)
      const activeCodes = new Set();
      for (const raw of activeOrders) {
        if (raw.code) activeCodes.add(raw.code.trim().toUpperCase());
      }
      for (const [key, ord] of storage.mergedOrders.entries()) {
        const oCode = (ord.code || ord.serviceOsCode || '').trim().toUpperCase();
        const isValid = activeCodes.has(key) && (oCode === key);
        if (!isValid) {
          storage.mergedOrders.delete(key);
        }
      }

      storage.saveDataCache();

      this.stats.lastUpdatedCount = updatedList.length;

      // 5. Nếu có xe thay đổi, bắn sự kiện Real-time
      if (updatedList.length > 0) {
        console.log(`[ServiceOS Sync] ⚡ Phát hiện ${updatedList.length} xe mới / cập nhật (Tổng trong xưởng: ${activeOrders.length})`);
        this.emit('delta_updated', updatedList);
      }

      this.emit('full_sync_completed', {
        totalInWorkshop: activeOrders.length,
        updatedCount: updatedList.length,
        timestamp: Date.now()
      });

    } catch (err) {
      this.stats.status = 'ERROR';
      this.stats.lastError = err.message;
      storage.lastSync.serviceos.status = 'ERROR';
      storage.lastSync.serviceos.lastError = err.message;
      console.warn('[ServiceOS Sync] Lỗi chu kỳ quét:', err.message);
    } finally {
      this.isPolling = false;
    }
  }

  getStats() {
    return {
      ...this.stats,
      cachedInRam: this.ramCache.size
    };
  }
}

export const serviceosSync = new ServiceOsSync();
