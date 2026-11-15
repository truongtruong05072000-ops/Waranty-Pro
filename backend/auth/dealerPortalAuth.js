// backend/auth/dealerPortalAuth.js
import { CONFIG } from '../config.js';
import { storage } from '../storage.js';

class DealerPortalAuth {
  constructor() {
    this.isRefreshing = false;
    this.refreshWaiters = [];
    this.refreshTimer = null;
    this.invalidTokenReported = false;

    // Load from CONFIG if storage doesn't have it yet
    const stored = storage.getDealerPortalToken();
    if (CONFIG.DEALER_PORTAL.REFRESH_TOKEN && (!stored || !stored.refreshToken)) {
      storage.setDealerPortalTokens(null, CONFIG.DEALER_PORTAL.REFRESH_TOKEN);
    }
    this.initAutoRefresh();
  }

  initAutoRefresh() {
    // Thiết lập timer định kỳ làm mới token trước khi hết hạn
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.refreshTimer = setInterval(async () => {
      try {
        const tokenData = storage.getDealerPortalToken();
        if (tokenData && tokenData.refreshToken) {
          console.log('[Dealer Portal Auth] ⏰ Timer: Tự động làm mới accessToken (chu kỳ 12 phút)...');
          await this.refreshToken();
        }
      } catch (err) {
        console.warn('[Dealer Portal Auth] Timer refresh thất bại:', err.message);
      }
    }, CONFIG.DEALER_PORTAL.REFRESH_INTERVAL_MS);
  }

  async login(username, password) {
    const userToUse = (username || CONFIG.DEALER_PORTAL.USERNAME || '').trim();
    const passToUse = password || CONFIG.DEALER_PORTAL.PASSWORD;

    if (!userToUse || !passToUse) {
      throw new Error('Vui lòng nhập tên đăng nhập và mật khẩu Dealer Portal!');
    }

    console.log(`[Dealer Portal Auth] Đang đăng nhập tài khoản "${userToUse}"...`);
    const loginUrl = `${CONFIG.DEALER_PORTAL.BASE_URL}/api/auth/login`;
    const res = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': CONFIG.DEALER_PORTAL.PORTAL_WEB_URL,
        'Referer': `${CONFIG.DEALER_PORTAL.PORTAL_WEB_URL}/`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({ username: userToUse, password: passToUse })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson.message || errJson.error || `HTTP ${res.status}`;
      throw new Error(`Đăng nhập Dealer Portal thất bại: ${msg}`);
    }

    const data = await res.json();
    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;
    const user = data.user || null;

    if (!accessToken) {
      throw new Error('Đăng nhập thành công nhưng không tìm thấy token trong phản hồi!');
    }

    storage.setDealerPortalTokens(accessToken, refreshToken, user, 900);
    this.invalidTokenReported = false;
    this.initAutoRefresh();
    console.log(`[Dealer Portal Auth] ✅ Đăng nhập Dealer Portal thành công! (User: ${user?.displayName || userToUse})`);
    return { accessToken, refreshToken, user };
  }

  async refreshToken(customRefreshToken = null) {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.refreshWaiters.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;
    try {
      const currentTokenData = storage.getDealerPortalToken();
      const tokenToUse = customRefreshToken || currentTokenData.refreshToken;

      if (!tokenToUse) {
        throw new Error('Chưa có refreshToken của Dealer Portal! Vui lòng nạp token qua cài đặt hoặc tiện ích.');
      }

      console.log('[Dealer Portal Auth] Đang gửi yêu cầu POST /api/auth/refresh...');
      const refreshUrl = `${CONFIG.DEALER_PORTAL.BASE_URL}/api/auth/refresh`;
      const res = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `refreshToken=${tokenToUse}; refresh_token=${tokenToUse}`,
          'x-market': 'VN',
          'Origin': CONFIG.DEALER_PORTAL.PORTAL_WEB_URL,
          'Referer': `${CONFIG.DEALER_PORTAL.PORTAL_WEB_URL}/`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({ refreshToken: tokenToUse })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const msg = errJson.message || errJson.error || `HTTP ${res.status}`;
        throw new Error(`Refresh token Dealer Portal thất bại: ${msg}`);
      }

      const data = await res.json();
      const accessToken = data.accessToken || data.token;
      const newRefreshToken = data.refreshToken || tokenToUse;
      const user = data.user || currentTokenData.user || null;

      if (!accessToken) {
        throw new Error('Phản hồi không chứa accessToken!');
      }

      // Lưu trữ cặp token mới
      storage.setDealerPortalTokens(accessToken, newRefreshToken, user, 900);
      this.invalidTokenReported = false;
      console.log(`[Dealer Portal Auth] ✅ Làm mới Token thành công! (User: ${user?.username || 'KTV'}, NPP: ${CONFIG.DEALER_CODE})`);

      this.refreshWaiters.forEach(w => w.resolve(accessToken));
      this.refreshWaiters = [];
      return accessToken;
    } catch (err) {
      if (!this.invalidTokenReported) {
        console.warn('[Dealer Portal Auth] ⚠️ Chưa thể kết nối Dealer Portal:', err.message);
        this.invalidTokenReported = true;
      }
      this.refreshWaiters.forEach(w => w.reject(err));
      this.refreshWaiters = [];
      throw err;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Wrapper tự động đính kèm Bearer token và tự động refresh nếu gặp 401
  async fetchWithAuth(endpointOrUrl, options = {}) {
    const url = endpointOrUrl.startsWith('http') ? endpointOrUrl : `${CONFIG.DEALER_PORTAL.BASE_URL}${endpointOrUrl}`;
    let tokenData = storage.getDealerPortalToken();

    // Nếu token sắp hết hạn (còn dưới 60 giây) hoặc chưa có accessToken, thử refresh trước
    const now = Date.now();
    if (!this.invalidTokenReported && (!tokenData.accessToken || (tokenData.expiresAt && tokenData.expiresAt - now < 60000))) {
      if (tokenData.refreshToken) {
        try {
          await this.refreshToken();
          tokenData = storage.getDealerPortalToken();
        } catch (e) {
          // Handled in refreshToken
        }
      }
    }

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${tokenData.accessToken || ''}`,
      'Origin': CONFIG.DEALER_PORTAL.PORTAL_WEB_URL,
      'Referer': `${CONFIG.DEALER_PORTAL.PORTAL_WEB_URL}/`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ...(options.headers || {})
    };

    let res = await fetch(url, { ...options, headers });

    // Nếu gặp 401 Unauthorized -> Tự động refresh token và thử lại 1 lần duy nhất
    if (res.status === 401 && !this.invalidTokenReported) {
      try {
        const newAccessToken = await this.refreshToken();
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        res = await fetch(url, { ...options, headers });
      } catch (refreshErr) {
        // Handled in refreshToken
      }
    }

    return res;
  }

  async ensureValidToken() {
    const status = this.getStatus();
    if (status.hasAccessToken && status.status === 'ACTIVE') {
      return true;
    }
    const tokenData = storage.getDealerPortalToken();
    if (tokenData && tokenData.refreshToken) {
      try {
        await this.refreshToken();
        return true;
      } catch (err) {
        if (tokenData.accessToken) {
          return true;
        }
        return false;
      }
    }
    if (tokenData && tokenData.accessToken) {
      return true;
    }
    return false;
  }

  getStatus() {
    const tokenData = storage.getDealerPortalToken();
    const now = Date.now();
    const hasToken = Boolean(tokenData && tokenData.accessToken);
    const isExpired = tokenData && tokenData.expiresAt ? (tokenData.expiresAt <= now) : !hasToken;
    return {
      status: hasToken ? (isExpired ? 'EXPIRED' : 'ACTIVE') : 'NO_TOKEN',
      hasAccessToken: Boolean(tokenData && tokenData.accessToken),
      hasRefreshToken: Boolean(tokenData && tokenData.refreshToken),
      expiresAt: tokenData ? tokenData.expiresAt : 0,
      user: tokenData ? tokenData.user : null
    };
  }

  updateTokens({ accessToken, refreshToken, user, expiresInSec = 900 }) {
    this.invalidTokenReported = false;
    storage.setDealerPortalTokens(accessToken, refreshToken, user, expiresInSec);
    this.initAutoRefresh();
  }
}

export const dealerPortalAuth = new DealerPortalAuth();
