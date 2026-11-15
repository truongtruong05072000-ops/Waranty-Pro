# -*- coding: utf-8 -*-
import os, sys, json, hashlib

PASS = 'n54511'
sha = hashlib.sha256(PASS.encode('utf-8')).hexdigest()

def djb2(s):
    h = 5381
    for c in s:
        h = (((h << 5) + h) + ord(c)) & 0xFFFFFFFF
    return hex(h)[2:]

fb = djb2(PASS)

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    tpl = f.read()

# Replace sheetjs marker with CDN script so worker.js stays under 1MB limit for Cloudflare Worker Free plan
tpl = tpl.replace('<!--SHEETJS-->', '<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>')
tpl = tpl.replace('__PASS_SHA__', sha).replace('__PASS_FB__', fb)

escaped_html = json.dumps(tpl)

prefix = '''// ===================================================================
// Cloudflare Worker: Hybrid Realtime Tunnel & Direct Sync Engine for VinFast CarOn Thới An
// Domain: https://fragrant-heart-e2d4.truongtruong-05072000.workers.dev/
// Hỗ trợ: Đồng bộ trực tiếp 2 bên (ServiceOS + Dealer Portal), Reverse Proxy & Phục vụ Web
// ===================================================================

const HTML_CONTENT = ''' + escaped_html + ''';

// Mặc định Render URL (hoặc cấu hình qua Cloudflare Worker Environment Variable: BACKEND_URL)
const DEFAULT_BACKEND_URL = "https://baohanh-pro-realtime.onrender.com";

// Default credentials nếu frontend không truyền vào
const DEFAULT_SERVICEOS_USER = "truongtnn";
const DEFAULT_SERVICEOS_PASS = "Truongnhutruong123@";
const DEFAULT_DEALER_CODE = "N54511";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const backendBase = (env && env.BACKEND_URL) ? env.BACKEND_URL.replace(/\\/+$/, '') : '';

    // 1. CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie, Upgrade',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    // 2. Chuyển tiếp WebSocket (Upgrade: websocket) sang Backend Real-time (nếu có cấu hình)
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader && upgradeHeader.toLowerCase() === 'websocket' && backendBase) {
      const backendWsUrl = new URL(url.pathname + url.search, backendBase);
      try {
        return await fetch(backendWsUrl.toString(), request);
      } catch(e) {
        // Fallback: tiếp tục xử lý
      }
    }

    // 3. Endpoint Health Check
    if (reqPath(url, ['/api/health', '/health'])) {
      return jsonRes({
        ok: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        engine: 'Cloudflare Worker Native & Realtime Proxy',
        dealerCode: DEFAULT_DEALER_CODE,
        backendConfigured: Boolean(backendBase)
      });
    }

    // 4. Native ServiceOS Sync API: POST /api/sync-serviceos
    if (url.pathname === '/api/sync-serviceos' && request.method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        const username = (body.username || env?.SERVICEOS_USERNAME || DEFAULT_SERVICEOS_USER).trim();
        const password = body.password || env?.SERVICEOS_PASSWORD || DEFAULT_SERVICEOS_PASS;

        return await handleNativeServiceOsSync(username, password);
      } catch (err) {
        return jsonRes({ success: false, ok: false, error: 'Lỗi đồng bộ ServiceOS: ' + err.message }, 500);
      }
    }

    // 5. Native Dealer Portal Sync API: POST /api/sync-dealer-portal
    if (url.pathname === '/api/sync-dealer-portal' && request.method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        const refreshToken = body.refreshToken || env?.DEALER_PORTAL_REFRESH_TOKEN;
        return await handleNativeDealerPortalSync(refreshToken);
      } catch (err) {
        return jsonRes({ success: false, ok: false, error: 'Lỗi đồng bộ Dealer Portal: ' + err.message }, 500);
      }
    }

    // 6. Chuyển tiếp các API khác sang Backend Real-time nếu được cấu hình
    if (backendBase && (url.pathname.startsWith('/api/') || url.pathname.startsWith('/ws'))) {
      const targetApiUrl = new URL(url.pathname + url.search, backendBase);
      const fwdHeaders = new Headers(request.headers);
      fwdHeaders.set('Origin', backendBase);
      fwdHeaders.delete('host');

      try {
        const response = await fetch(targetApiUrl.toString(), {
          method: request.method,
          headers: fwdHeaders,
          body: (request.method !== 'GET' && request.method !== 'HEAD') ? request.body : undefined
        });

        const resHeaders = new Headers(response.headers);
        resHeaders.set('Access-Control-Allow-Origin', '*');
        resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        resHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');

        return new Response(response.body, {
          status: response.status,
          headers: resHeaders
        });
      } catch (err) {
        // Nếu backend lỗi, báo lỗi thân thiện
        return jsonRes({
          ok: false,
          error: 'Backend proxy error: ' + err.message,
          hint: 'Hệ thống đang chạy chế độ dự phòng trực tiếp trên Cloudflare.'
        }, 502);
      }
    }

    // 7. Phục vụ Giao diện Web (HTML) kèm tiêm cấu hình BACKEND_URL tự động
    let html = HTML_CONTENT;
    const injection = `<script>window.NEXT_PUBLIC_BACKEND_URL="${backendBase}";window.VITE_BACKEND_URL="${backendBase}";window.BACKEND_REALTIME_URL="${backendBase}";</script>`;
    if (html.includes('<head>')) {
      html = html.replace('<head>', '<head>\\n' + injection);
    } else {
      html = injection + html;
    }

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
};

function reqPath(url, paths) {
  return paths.includes(url.pathname);
}

function jsonRes(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie'
    }
  });
}

// ===================================================================
// NATIVE SERVICEOS SYNC TRỰC TIẾP TRÊN CLOUDFLARE WORKER
// ===================================================================
async function handleNativeServiceOsSync(username, password) {
  if (!username || !password) {
    return jsonRes({ success: false, ok: false, error: 'Thiếu tên đăng nhập hoặc mật khẩu ServiceOS!' }, 400);
  }

  // 1. Đăng nhập ServiceOS
  const loginRes = await fetch('https://att-serviceos.anthinhtech.vn/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://att-serviceos.anthinhtech.vn',
      'Referer': 'https://att-serviceos.anthinhtech.vn/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify({ username, password })
  });

  if (!loginRes.ok) {
    const errData = await loginRes.json().catch(() => ({}));
    const msg = errData.error || (loginRes.status === 401 ? 'Tài khoản hoặc mật khẩu ServiceOS không đúng!' : `Lỗi đăng nhập (${loginRes.status})`);
    return jsonRes({ success: false, ok: false, error: msg }, loginRes.status === 401 ? 401 : 502);
  }

  // Lấy Cookie
  let cookieHeader = '';
  if (typeof loginRes.headers.getSetCookie === 'function') {
    cookieHeader = loginRes.headers.getSetCookie().map(c => c.split(';')[0].trim()).join('; ');
  } else {
    const raw = loginRes.headers.get('set-cookie') || '';
    cookieHeader = raw.split(/,(?=[^;]+=[^;]+)/).map(c => c.split(';')[0].trim()).join('; ');
  }

  // 2. Kéo danh sách xe đang trong xưởng (branch 2)
  let allOrders = [];
  let page = 1;
  const pageSize = 200;
  let totalCount = 0;

  while (page <= 20) {
    const woRes = await fetch(`https://att-serviceos.anthinhtech.vn/api/work-orders?status=active&branch_id=2&page=${page}&page_size=${pageSize}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': cookieHeader,
        'Origin': 'https://att-serviceos.anthinhtech.vn',
        'Referer': 'https://att-serviceos.anthinhtech.vn/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!woRes.ok) {
      throw new Error(`Lỗi tải trang ${page}: HTTP ${woRes.status}`);
    }

    const woData = await woRes.json();
    const rows = woData.rows || woData.items || [];
    if (!rows.length) break;

    allOrders.push(...rows);
    totalCount = woData.total || allOrders.length;

    if (allOrders.length >= totalCount || rows.length < pageSize) break;
    page++;
  }

  // Lọc chỉ giữ xe đang hoạt động (không phải delivered hay cancelled)
  const activeOrders = allOrders.filter(w => {
    const st = String(w.status || '').toLowerCase();
    return st !== 'delivered' && st !== 'cancelled' && st !== 'đã giao' && st !== 'hủy';
  });

  return jsonRes({
    success: true,
    ok: true,
    count: activeOrders.length,
    total: totalCount || activeOrders.length,
    orders: activeOrders
  });
}

// ===================================================================
// NATIVE DEALER PORTAL SYNC TRỰC TIẾP TRÊN CLOUDFLARE WORKER
// ===================================================================
async function handleNativeDealerPortalSync(refreshToken) {
  if (!refreshToken) {
    return jsonRes({
      success: false,
      ok: false,
      error: 'Vui lòng cung cấp Refresh Token của VinFast Dealer Portal!'
    }, 400);
  }

  // 1. Refresh Token
  const refRes = await fetch('https://dealer-portal-api.vinfast.com/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://dealer-portal.vinfast.com',
      'Referer': 'https://dealer-portal.vinfast.com/'
    },
    body: JSON.stringify({ refreshToken })
  });

  if (!refRes.ok) {
    return jsonRes({
      success: false,
      ok: false,
      error: `Lỗi làm mới Token Dealer Portal (HTTP ${refRes.status}). Vui lòng cập nhật Refresh Token mới!`
    }, refRes.status === 401 ? 401 : 502);
  }

  const tokenData = await refRes.json();
  const accessToken = tokenData.accessToken;

  // 2. Kéo danh sách Lệnh sửa chữa Dealer Portal
  const woRes = await fetch('https://dealer-portal-api.vinfast.com/api/escooter-work-orders?dealerCode=N54511&pageSize=100', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Origin': 'https://dealer-portal.vinfast.com',
      'Referer': 'https://dealer-portal.vinfast.com/'
    }
  });

  let orders = [];
  if (woRes.ok) {
    const woData = await woRes.json();
    orders = woData.data || woData.rows || [];
  }

  // 3. Kéo danh sách Đề xuất Bảo hành (Claims)
  const claimsRes = await fetch('https://dealer-portal-api.vinfast.com/api/warranty-claims?dealerCode=N54511&pageSize=100', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Origin': 'https://dealer-portal.vinfast.com',
      'Referer': 'https://dealer-portal.vinfast.com/'
    }
  }).catch(() => null);

  let claims = [];
  if (claimsRes && claimsRes.ok) {
    const claimsData = await claimsRes.json();
    claims = claimsData.data || claimsData.rows || [];
  }

  return jsonRes({
    success: true,
    ok: true,
    newAccessToken: accessToken,
    newRefreshToken: tokenData.refreshToken || refreshToken,
    count: orders.length,
    totalClaims: claims.length,
    orders: orders,
    claims: claims
  });
}
'''

with open('_deploy/worker.js', 'w', encoding='utf-8') as f:
    f.write(prefix)

with open('worker.js', 'w', encoding='utf-8') as f:
    f.write(prefix)

import zlib
gz = zlib.compress(prefix.encode('utf-8'))
print('Successfully generated _deploy/worker.js and worker.js!')
print('Raw size:', len(prefix), f'bytes ({len(prefix)/1024/1024:.2f} MB)')
print('Gzipped size:', len(gz), f'bytes ({len(gz)/1024:.1f} KB - Chuẩn Cloudflare < 1MB!)')
