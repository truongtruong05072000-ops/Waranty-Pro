// backend/routes/apiRoutes.js
import { CONFIG } from '../config.js';
import { smartMerger } from '../sync/smartMerger.js';
import { syncEngine } from '../sync/syncEngine.js';
import { serviceosSync } from '../sync/serviceosSync.js';
import { dealerPortalSync } from '../sync/dealerPortalSync.js';
import { storage } from '../storage.js';
import { serviceosAuth } from '../auth/serviceosAuth.js';
import { dealerPortalAuth } from '../auth/dealerPortalAuth.js';

export async function handleApiRoute(req, res, pathname, query, body) {
  // Common CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }

  const jsonResponse = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return true;
  };

  try {
    // 0. GET /api/health (Endpoint Keep-Alive & Health Check chống ngủ)
    if (req.method === 'GET' && (pathname === '/api/health' || pathname === '/health')) {
      const allOrders = smartMerger.getAllRecords();
      const soStats = serviceosSync.getStats();
      const dpStats = dealerPortalSync.getStats();
      const dpAuth = dealerPortalAuth.getStatus();

      const tokenStatus = dpAuth.hasAccessToken && dpAuth.status === 'ACTIVE'
        ? 'valid'
        : (dpAuth.hasRefreshToken ? (dpAuth.status === 'EXPIRED' ? 'refresh_needed' : 'valid') : 'missing');

      return jsonResponse(200, {
        ok: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        dealerCode: CONFIG.DEALER_CODE,
        branchId: CONFIG.BRANCH_ID,
        lastSyncAt: syncEngine.status.lastSyncTime || soStats.lastRun || new Date().toISOString(),
        totalServiceOS: soStats.totalInWorkshop || allOrders.length,
        totalDealerPortal: dpStats.streamATotalOpen || dpStats.trackedOrderCount || 0,
        totalMergedVehicles: allOrders.length,
        tokenStatus: tokenStatus,
        serviceosStatus: soStats.status,
        dealerPortalStatus: dpStats.lastError ? 'error' : 'ok'
      });
    }

    // 0.1 POST /api/sync-serviceos (Đồng bộ 1-Click ServiceOS từ Frontend)
    if (req.method === 'POST' && pathname === '/api/sync-serviceos') {
      const { username, password } = body || {};
      if (username && password) {
        await serviceosAuth.login(username, password);
      } else if (!serviceosAuth.hasValidSession()) {
        await serviceosAuth.login();
      }

      // Kéo danh sách xe ServiceOS
      await serviceosSync.syncOnce();
      const allOrders = smartMerger.getAllRecords().map(r => r.serviceosRaw || r);
      const totalCount = serviceosSync.getStats().totalInWorkshop || allOrders.length;

      return jsonResponse(200, {
        success: true,
        ok: true,
        count: allOrders.length,
        total: totalCount,
        orders: allOrders
      });
    }

    // 0.2 POST /api/sync-dealer-portal (Đồng bộ 1-Click Dealer Portal từ Frontend)
    if (req.method === 'POST' && pathname === '/api/sync-dealer-portal') {
      const { username, password, refreshToken, accessToken, tokenInput, user } = body || {};

      // 1. Nếu người dùng dán chuỗi token hoặc nguyên đoạn JSON
      if (tokenInput && typeof tokenInput === 'string') {
        const trimmed = tokenInput.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          try {
            const parsed = JSON.parse(trimmed);
            dealerPortalAuth.updateTokens({
              accessToken: parsed.accessToken,
              refreshToken: parsed.refreshToken,
              user: parsed.user,
              expiresInSec: 900
            });
          } catch (e) {}
        } else if (trimmed.startsWith('eyJ')) {
          dealerPortalAuth.updateTokens({
            refreshToken: trimmed,
            accessToken: accessToken || trimmed
          });
        }
      } else if (accessToken || refreshToken) {
        dealerPortalAuth.updateTokens({
          accessToken,
          refreshToken,
          user,
          expiresInSec: 900
        });
      }

      // 2. Nếu người dùng nhập tên tài khoản và mật khẩu Dealer Portal
      if (username && password) {
        try {
          await dealerPortalAuth.login(username, password);
        } catch (loginErr) {
          console.warn('[Dealer Portal Auth] Login error:', loginErr.message);
          // Nếu login bằng mật khẩu không thành công nhưng có accessToken trong cache thì vẫn tiếp tục
          if (!dealerPortalAuth.getStatus().hasAccessToken) {
            return jsonResponse(401, {
              success: false,
              ok: false,
              error: loginErr.message
            });
          }
        }
      }

      // 3. Đảm bảo có token hợp lệ
      const tokenValid = await dealerPortalAuth.ensureValidToken();
      if (!tokenValid) {
        return jsonResponse(401, {
          success: false,
          ok: false,
          error: 'Chưa có thông tin đăng nhập hoặc Token Dealer Portal đã hết hạn! Vui lòng nhập tài khoản/mật khẩu hoặc dán Token mới.'
        });
      }

      // 4. Kéo toàn diện cả Work Orders VÀ Warranty Claims (WC-...) từ Dealer Portal
      const [woResult, claimsResult] = await Promise.allSettled([
        dealerPortalSync.fetchAllWorkOrders(),
        dealerPortalSync.fetchAllClaims()
      ]);

      const allRecords = smartMerger.getAllRecords();
      const allClaims = dealerPortalSync.getAllClaims();

      return jsonResponse(200, {
        success: true,
        ok: true,
        count: allRecords.length,
        totalOrders: woResult.status === 'fulfilled' ? woResult.value.length : 0,
        totalClaims: allClaims.length,
        claims: allClaims,
        orders: allRecords
      });
    }

    // 0.25 GET /api/warranty/claims (Lấy toàn bộ danh sách đề xuất bảo hành đã làm giàu)
    if (req.method === 'GET' && (pathname === '/api/warranty/claims' || pathname === '/api/claims')) {
      let claims = dealerPortalSync.getAllClaims();
      if (!claims || !claims.length) {
        const cachePath = path.join(CONFIG.PATHS.ROOT, '.claims-cache.json');
        if (fs.existsSync(cachePath)) {
          try {
            const raw = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
            claims = Object.values(raw);
          } catch (e) {}
        }
      }
      return jsonResponse(200, { ok: true, success: true, count: (claims || []).length, data: claims || [] });
    }

    // 0.3 POST /api/sync/all (Đồng bộ đồng thời cả ServiceOS và Dealer Portal)
    if (req.method === 'POST' && (pathname === '/api/sync/all' || pathname === '/api/sync-all')) {
      const summary = await syncEngine.triggerManualSync();
      const allRecords = smartMerger.getAllRecords();
      return jsonResponse(200, {
        success: true,
        ok: true,
        message: 'Đã hoàn thành đồng bộ cả ServiceOS và Dealer Portal!',
        totalVehicles: allRecords.length,
        summary: summary,
        orders: allRecords
      });
    }
    // 1. GET /api/orders
    if (req.method === 'GET' && pathname === '/api/orders') {
      const allOrders = smartMerger.getAllRecords();
      return jsonResponse(200, {
        ok: true,
        total: allOrders.length,
        data: allOrders,
        summary: syncEngine.getSummary()
      });
    }

    // 2. GET /api/orders/:id
    if (req.method === 'GET' && pathname.startsWith('/api/orders/')) {
      const id = pathname.replace('/api/orders/', '');
      const order = smartMerger.getRecordById(id);
      if (!order) {
        return jsonResponse(404, { ok: false, message: 'Order not found' });
      }
      return jsonResponse(200, { ok: true, data: order });
    }

    // 3. POST /api/user-edits
    if (req.method === 'POST' && pathname === '/api/user-edits') {
      const { orderId, patch } = body || {};
      if (!orderId || !patch) {
        return jsonResponse(400, { ok: false, message: 'Missing orderId or patch' });
      }
      storage.recordUserEdit(orderId, patch);
      const record = smartMerger.getRecordById(orderId);
      if (record) {
        Object.assign(record, patch);
      }
      return jsonResponse(200, { ok: true, message: 'Saved', order: record });
    }

    // 4. GET /api/user-edits
    if (req.method === 'GET' && pathname === '/api/user-edits') {
      return jsonResponse(200, { ok: true, data: storage.getAllUserEdits() });
    }

    // 5. GET /api/sync/status
    if (req.method === 'GET' && pathname === '/api/sync/status') {
      return jsonResponse(200, { ok: true, data: syncEngine.getSummary() });
    }

    // 6. POST /api/sync/trigger
    if (req.method === 'POST' && pathname === '/api/sync/trigger') {
      const summary = await syncEngine.triggerManualSync();
      return jsonResponse(200, { ok: true, message: 'Sync completed', summary });
    }

    // 7. GET /api/auth/status
    if (req.method === 'GET' && pathname === '/api/auth/status') {
      return jsonResponse(200, {
        ok: true,
        serviceos: {
          hasCookie: serviceosAuth.hasValidSession(),
          username: serviceosAuth.username
        },
        dealerPortal: dealerPortalAuth.getStatus()
      });
    }

    // 8. POST /api/auth/serviceos/login
    if (req.method === 'POST' && pathname === '/api/auth/serviceos/login') {
      const { username, password } = body || {};
      const success = await serviceosAuth.login(username, password);
      return jsonResponse(success ? 200 : 401, {
        ok: success,
        message: success ? 'Logged in to ServiceOS' : 'ServiceOS login failed'
      });
    }

    // 9. POST /api/auth/dealer-portal/token
    if (req.method === 'POST' && pathname === '/api/auth/dealer-portal/token') {
      const { accessToken, refreshToken, user } = body || {};
      if (accessToken || refreshToken) {
        dealerPortalAuth.updateTokens({ accessToken, refreshToken, user });
        return jsonResponse(200, { ok: true, message: 'Dealer Portal tokens updated' });
      }
      return jsonResponse(400, { ok: false, message: 'No tokens provided' });
    }

    return false; // Not handled by API router
  } catch (err) {
    console.error(`[ApiRoutes] Error handling ${pathname}:`, err);
    return jsonResponse(500, { ok: false, error: err.message });
  }
}
