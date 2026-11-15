// Cloudflare Pages Function: /api/sync-serviceos
export async function onRequest(context) {
  const { request } = context;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
        'Access-Control-Max-Age': '86400',
      }
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return jsonRes({ success: false, error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu ServiceOS!' }, 400);
    }

    // 1. Gửi yêu cầu đăng nhập ServiceOS
    const loginRes = await fetch('https://att-serviceos.anthinhtech.vn/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://att-serviceos.anthinhtech.vn',
        'Referer': 'https://att-serviceos.anthinhtech.vn/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({ username: String(username).trim(), password: String(password) })
    });

    if (!loginRes.ok) {
      const errData = await loginRes.json().catch(() => ({}));
      const msg = errData.error || (loginRes.status === 401 ? 'Tên đăng nhập hoặc mật khẩu ServiceOS không đúng!' : `Lỗi ServiceOS (${loginRes.status})`);
      return jsonRes({ success: false, error: msg }, loginRes.status === 401 ? 401 : 502);
    }

    // Lấy cookie xác thực phiên
    let cookieHeader = '';
    if (typeof loginRes.headers.getSetCookie === 'function') {
      cookieHeader = loginRes.headers.getSetCookie().map(c => c.split(';')[0].trim()).join('; ');
    } else {
      const raw = loginRes.headers.get('set-cookie') || '';
      cookieHeader = raw.split(/,(?=[^;]+=[^;]+)/).map(c => c.split(';')[0].trim()).join('; ');
    }

    // 2. Kéo danh sách toàn bộ xe đang trong xưởng (lặp qua các trang, mỗi trang tối đa 200 xe)
    let allOrders = [];
    let page = 1;
    const pageSize = 200;
    let totalCount = 0;

    while (page <= 20) {
      const woRes = await fetch(`https://att-serviceos.anthinhtech.vn/api/work-orders?status=active&page=${page}&page_size=${pageSize}`, {
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
        throw new Error(`Lỗi tải danh sách xe trang ${page}: HTTP ${woRes.status}`);
      }

      const woData = await woRes.json();
      const rows = woData.rows || woData.items || [];
      if (!rows.length) break;

      allOrders.push(...rows);
      totalCount = woData.total || allOrders.length;

      if (allOrders.length >= totalCount || rows.length < pageSize) break;
      page++;
    }

    return jsonRes({
      success: true,
      count: allOrders.length,
      total: totalCount,
      orders: allOrders
    });

  } catch (err) {
    return jsonRes({ success: false, error: 'Lỗi đồng bộ: ' + (err.message || String(err)) }, 500);
  }
}

function jsonRes(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie'
    }
  });
}
