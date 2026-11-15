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

    // 2. Kéo danh sách toàn bộ xe đang trong xưởng
    let allOrders = [];
    let page = 1;
    const pageSize = 200;
    let totalCount = 0;

    const commonHeaders = {
      'Accept': 'application/json',
      'Cookie': cookieHeader,
      'Origin': 'https://att-serviceos.anthinhtech.vn',
      'Referer': 'https://att-serviceos.anthinhtech.vn/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    while (page <= 25) {
      const woRes = await fetch(`https://att-serviceos.anthinhtech.vn/api/work-orders?status=active&page=${page}&page_size=${pageSize}`, {
        method: 'GET',
        headers: commonHeaders
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

    // 3. Kéo chi tiết Lệnh BH & ĐXBH (Dealer Portal) cho các xe có bảo hành
    const warrantyOrders = allOrders.filter(w =>
      (w.warranty_kinds && w.warranty_kinds.length > 0) ||
      (w.faults && w.faults.length > 0) ||
      w.warranty_status ||
      w.battery_serial_old ||
      w.motor_serial_old ||
      w.dms_warranty_code
    );

    if (warrantyOrders.length > 0) {
      // Fetch in parallel chunks of 10
      const chunkSize = 10;
      for (let i = 0; i < warrantyOrders.length; i += chunkSize) {
        const chunk = warrantyOrders.slice(i, i + chunkSize);
        await Promise.all(chunk.map(async (w) => {
          try {
            const [detailRes, dpRes] = await Promise.all([
              fetch(`https://att-serviceos.anthinhtech.vn/api/work-orders/${w.id}`, { headers: commonHeaders }).catch(() => null),
              fetch(`https://att-serviceos.anthinhtech.vn/api/dealer-portal/work-orders/${w.id}`, { headers: commonHeaders }).catch(() => null)
            ]);

            if (detailRes && detailRes.ok) {
              const dt = await detailRes.json();
              const wo = dt.work_order || dt;
              if (wo.warranty_extra) w.warranty_extra = wo.warranty_extra;
              if (wo.dms_warranty_code) w.dms_warranty_code = wo.dms_warranty_code;
              if (wo.dms_claim_code) w.dms_claim_code = wo.dms_claim_code;
              if (wo.dms_ro_code) w.dms_ro_code = wo.dms_ro_code;
              if (wo.inspection_notes) w.inspection_notes = wo.inspection_notes;
              if (wo.reception_check) w.reception_check = wo.reception_check;
            }

            if (dpRes && dpRes.ok) {
              const dp = await dpRes.json();
              const dpClaims = dp.claims || [];
              if (dpClaims.length > 0) {
                w.dealer_claims = dpClaims;

                const extra = { ...(w.warranty_extra || {}) };
                const kinds = w.warranty_kinds || Object.keys(extra) || ['pin'];

                for (const claim of dpClaims) {
                  const wRo = (claim.work_order || '').trim();
                  if (wRo && !w.dms_warranty_code) w.dms_warranty_code = wRo;
                  const cNum = (claim.number || claim.claim_code || '').trim();
                  if (cNum && !w.dms_claim_code) w.dms_claim_code = cNum;

                  let matchedKind = kinds.find(k => {
                    const row = extra[k] || {};
                    const rowWCode = (row.warranty_code || '').trim();
                    return (rowWCode && wRo && rowWCode.toUpperCase() === wRo.toUpperCase());
                  }) || (kinds.length === 1 ? kinds[0] : null) || kinds[0];

                  if (matchedKind) {
                    const row = { ...(extra[matchedKind] || {}) };
                    if (!row.warranty_code && wRo) row.warranty_code = wRo;
                    if (!row.claim_code && cNum) row.claim_code = cNum;
                    if (row.claim_amount == null && claim.amount != null) row.claim_amount = claim.amount;
                    if (!row.claim_submitted_at && (claim.submitted_at || claim.created_at)) row.claim_submitted_at = claim.submitted_at || claim.created_at;
                    if (!row.claim_approved_at && claim.approved_at) row.claim_approved_at = claim.approved_at;
                    if (claim.status && !row.claim_status) row.claim_status = claim.status;
                    if (!row.serial_old && claim.serial_old) row.serial_old = claim.serial_old;
                    if (!row.serial_new && claim.serial_new) row.serial_new = claim.serial_new;
                    if (!row.dien_giai && claim.dien_giai) row.dien_giai = claim.dien_giai;
                    extra[matchedKind] = row;
                  }
                }
                w.warranty_extra = extra;
              }
            }
          } catch(e) {}
        }));
      }
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
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie'
    }
  });
}
