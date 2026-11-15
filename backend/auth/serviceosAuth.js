// backend/auth/serviceosAuth.js
import { CONFIG } from '../config.js';
import { storage } from '../storage.js';

class ServiceOsAuth {
  constructor() {
    this.isLoggingIn = false;
    this.loginWaiters = [];
  }

  async login(username = CONFIG.SERVICEOS.USERNAME, password = CONFIG.SERVICEOS.PASSWORD) {
    if (this.isLoggingIn) {
      return new Promise((resolve, reject) => {
        this.loginWaiters.push({ resolve, reject });
      });
    }

    this.isLoggingIn = true;
    try {
      console.log(`[ServiceOS Auth] Đang đăng nhập tài khoản "${username}"...`);
      const loginUrl = `${CONFIG.SERVICEOS.BASE_URL}/api/auth/login`;
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': CONFIG.SERVICEOS.BASE_URL,
          'Referer': `${CONFIG.SERVICEOS.BASE_URL}/`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({ username: String(username).trim(), password: String(password) })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const msg = errJson.error || `HTTP ${res.status}`;
        throw new Error(`Đăng nhập ServiceOS thất bại: ${msg}`);
      }

      // Trích xuất Session Cookies từ headers
      let cookieHeader = '';
      if (typeof res.headers.getSetCookie === 'function') {
        cookieHeader = res.headers.getSetCookie().map(c => c.split(';')[0].trim()).join('; ');
      } else {
        const raw = res.headers.get('set-cookie') || '';
        cookieHeader = raw.split(/,(?=[^;]+=[^;]+)/).map(c => c.split(';')[0].trim()).join('; ');
      }

      if (!cookieHeader) {
        throw new Error('ServiceOS không trả về Session Cookie!');
      }

      storage.setServiceOsCookie(cookieHeader);
      console.log('[ServiceOS Auth] ✅ Đăng nhập thành công, đã lưu Session Cookie.');

      // Báo cho các request đang chờ
      this.loginWaiters.forEach(w => w.resolve(cookieHeader));
      this.loginWaiters = [];
      return cookieHeader;
    } catch (err) {
      console.error('[ServiceOS Auth] ❌ Lỗi đăng nhập:', err.message);
      this.loginWaiters.forEach(w => w.reject(err));
      this.loginWaiters = [];
      throw err;
    } finally {
      this.isLoggingIn = false;
    }
  }

  // Wrapper tự động đính kèm Cookie và tự động re-login nếu gặp 401/403
  async fetchWithAuth(endpointOrUrl, options = {}) {
    const url = endpointOrUrl.startsWith('http') ? endpointOrUrl : `${CONFIG.SERVICEOS.BASE_URL}${endpointOrUrl}`;
    let cookie = storage.getServiceOsCookie();

    // Nếu chưa có Cookie thì đăng nhập trước
    if (!cookie) {
      if (CONFIG.SERVICEOS.USERNAME && CONFIG.SERVICEOS.PASSWORD) {
        cookie = await this.login();
      } else {
        throw new Error('Chưa có Cookie ServiceOS và chưa cấu hình mật khẩu!');
      }
    }

    const headers = {
      'Accept': 'application/json',
      'Cookie': cookie,
      'Origin': CONFIG.SERVICEOS.BASE_URL,
      'Referer': `${CONFIG.SERVICEOS.BASE_URL}/`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ...(options.headers || {})
    };

    let res = await fetch(url, { ...options, headers });

    // Nếu hết hạn phiên (401 hoặc 403) -> Tự động re-login và retry 1 lần
    if (res.status === 401 || res.status === 403) {
      console.warn(`[ServiceOS Auth] Phiên hết hạn (HTTP ${res.status}), tự động re-login...`);
      if (CONFIG.SERVICEOS.USERNAME && CONFIG.SERVICEOS.PASSWORD) {
        cookie = await this.login();
        headers['Cookie'] = cookie;
        res = await fetch(url, { ...options, headers });
      }
    }

    return res;
  }

  hasValidSession() {
    return Boolean(storage.getServiceOsCookie());
  }

  getStatus() {
    const cookie = storage.getServiceOsCookie();
    return {
      hasCookie: Boolean(cookie),
      lastLogin: storage.authCache?.serviceos?.lastLogin || 0,
      username: CONFIG.SERVICEOS.USERNAME
    };
  }
}

export const serviceosAuth = new ServiceOsAuth();
