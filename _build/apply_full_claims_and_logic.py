# -*- coding: utf-8 -*-
import sys

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

helper_code = """
// ==================== QUẢN LÝ DỮ LIỆU ĐỀ XUẤT BẢO HÀNH DEALER PORTAL ====================
window.DEALER_CLAIMS_MAP = new Map();

function initDealerClaimsMap(){
  if (!window.DEALER_CLAIMS_MAP) window.DEALER_CLAIMS_MAP = new Map();
  
  // Nạp 100 đề xuất thực tế từ Dealer Portal
  const preloaded = (typeof DEALER_PORTAL_PRELOAD_CLAIMS !== 'undefined' && Array.isArray(DEALER_PORTAL_PRELOAD_CLAIMS)) 
    ? DEALER_PORTAL_PRELOAD_CLAIMS : [];
    
  let stored = [];
  try {
    const raw = localStorage.getItem('bh_dealer_claims');
    if (raw) stored = JSON.parse(raw);
  } catch(e){}

  const allClaims = [...preloaded, ...(Array.isArray(stored) ? stored : [])];
  allClaims.forEach(c => {
    if (!c) return;
    if (c.vin) {
      const v = String(c.vin).trim().toUpperCase();
      window.DEALER_CLAIMS_MAP.set(v, c);
      if (v.length >= 6) window.DEALER_CLAIMS_MAP.set(v.slice(-6), c);
    }
    if (c.workOrderNumber) {
      window.DEALER_CLAIMS_MAP.set(String(c.workOrderNumber).trim().toUpperCase(), c);
    }
    if (c.warrantyClaimNumber) {
      window.DEALER_CLAIMS_MAP.set(String(c.warrantyClaimNumber).trim().toUpperCase(), c);
    }
  });

  // Tự động khởi tạo nguồn dữ liệu Doanh thu bảo hành nếu chưa có
  if (state.sources.length === 0 && preloaded.length > 0) {
    window.parseDealerPortalJson(preloaded, 'VinFast Dealer Portal (100 đề xuất đã duyệt)', false);
  }
}

window.parseDealerPortalJson = function(jsonData, srcName = 'Dealer Portal API (100 đề xuất)', triggerRender = true){
  let claims = [];
  if (typeof jsonData === 'string') {
    try { jsonData = JSON.parse(jsonData); } catch(e){ alert('Lỗi định dạng JSON: ' + e.message); return 0; }
  }
  if (Array.isArray(jsonData)) {
    claims = jsonData;
  } else if (jsonData && Array.isArray(jsonData.data)) {
    claims = jsonData.data;
  } else if (jsonData && Array.isArray(jsonData.rows)) {
    claims = jsonData.rows;
  } else if (jsonData && Array.isArray(jsonData.items)) {
    claims = jsonData.items;
  }
  if (!claims.length) {
    if (triggerRender) alert('Không tìm thấy danh sách đề xuất trong dữ liệu!');
    return 0;
  }

  // Cập nhật Map tra cứu
  if (!window.DEALER_CLAIMS_MAP) window.DEALER_CLAIMS_MAP = new Map();
  claims.forEach(c => {
    if (!c) return;
    if (c.vin) {
      const v = String(c.vin).trim().toUpperCase();
      window.DEALER_CLAIMS_MAP.set(v, c);
      if (v.length >= 6) window.DEALER_CLAIMS_MAP.set(v.slice(-6), c);
    }
    if (c.workOrderNumber) {
      window.DEALER_CLAIMS_MAP.set(String(c.workOrderNumber).trim().toUpperCase(), c);
    }
    if (c.warrantyClaimNumber) {
      window.DEALER_CLAIMS_MAP.set(String(c.warrantyClaimNumber).trim().toUpperCase(), c);
    }
  });

  // Lưu trữ cục bộ
  try {
    localStorage.setItem('bh_dealer_claims', JSON.stringify(claims));
  } catch(e){}

  // Tạo Nguồn dữ liệu Định dạng 2 (Format 2: Dealer Portal)
  const src = {
    id: 'src_dp_' + Date.now(),
    name: srcName,
    status: 'OK',
    rows: claims.length,
    range: '',
    format: 2,
    recs: [],
    warn: []
  };

  const dates = [];
  const recs = claims.map(c => {
    const rec = newRecord();
    rec.id = String(c.warrantyClaimNumber || c.number || c.claim_code || c.id || '').trim();
    rec.wo = String(c.workOrderNumber || c.work_order || '').trim();
    rec.vin = String(c.vin || '').trim();
    rec.vehicle = String(c.model || c.vehicle || '').trim();
    rec.format = 2;
    rec.srcId = src.id;
    rec.srcName = src.name;

    const rawSt = String(c.status || '').toUpperCase();
    if (rawSt === 'APPROVED' || rawSt.includes('DUYỆT') || rawSt.includes('PAID')) {
      rec.status = 'Đã phê duyệt';
    } else if (rawSt.includes('PENDING_LEVEL_2') || rawSt.includes('WAITING_LEVEL_2')) {
      rec.status = 'Chờ duyệt cấp 2';
    } else if (rawSt.includes('PENDING') || rawSt.includes('WAITING') || rawSt.includes('SUBMIT')) {
      rec.status = 'Chờ duyệt';
    } else if (rawSt.includes('CANCEL') || rawSt.includes('REJECT') || rawSt.includes('TỪ CHỐI')) {
      rec.status = 'Từ chối / Hủy';
    } else {
      rec.status = c.status || 'Chờ duyệt';
    }

    const dVal = c.approvedDate || c.approved_at || c.createdAt || c.created_at || c.submitted_at;
    rec.date = parseDateVal(dVal);
    if (rec.date) dates.push(rec.date);

    const inc = Number(c.totalRequestedAmountInclTax || c.amount || 0) || 0;
    rec.totalInc = inc;
    rec.totalEx = Math.round(inc / 1.1);
    rec.total = inc;

    rec.parts = [{
      code: c.warrantyType || 'STANDARD',
      name: (c.customer && c.customer.customerName) ? c.customer.customerName : 'Bảo hành xe điện',
      qty: 1,
      priceInc: inc,
      priceEx: rec.totalEx,
      amountInc: inc,
      amountEx: rec.totalEx
    }];

    return rec;
  });

  src.recs = recs;
  if (dates.length) {
    const sorted = dates.slice().sort((a,b) => a - b);
    src.range = formatDisplayDate(sorted[0]) + ' - ' + formatDisplayDate(sorted[sorted.length - 1]);
  }

  state.sources = state.sources.filter(s => s.name !== srcName);
  state.sources.push(src);

  // Tự động cập nhật lại danh sách xe trong xưởng với Lệnh BH & ĐXBH vừa nạp
  rebuildCheckXeOrders();

  if (triggerRender) {
    saveSources();
    renderSources();
    renderAll();
    if (typeof window.switchTab === 'function') window.switchTab('overview');
    alert(`🎉 ĐÃ NẠP THÀNH CÔNG ${claims.length} ĐỀ XUẤT DEALER PORTAL VÀO DOANH THU & CHECK LỖI XE!`);
  }

  return claims.length;
};

// Hàm chuẩn hóa lại toàn bộ xe trong Check lỗi xe
function rebuildCheckXeOrders(){
  try {
    let rawList = [];
    const raw = localStorage.getItem('bh_checkxe_orders') || localStorage.getItem('serviceos_cached_orders');
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) rawList = p;
    }
    if (!rawList.length && typeof SERVICEOS_PRELOAD_ORDERS !== 'undefined') {
      rawList = SERVICEOS_PRELOAD_ORDERS;
    }
    if (rawList.length > 0) {
      state.checkXe.orders = rawList.map((d, i) => normalizeOrder(d, i));
      if (typeof renderCheckXe === 'function') renderCheckXe();
    }
  } catch(e){}
}
"""

target = 'function loadCheckXeOrders(){'
replacement = helper_code + '\nfunction loadCheckXeOrders(){\n  initDealerClaimsMap();'

if 'window.parseDealerPortalJson =' not in content:
    if target in content:
        content = content.replace(target, replacement, 1)
        print("Replaced target with helper_code and initDealerClaimsMap call!")
        with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
            f.write(content)
    else:
        print("Error: target not found!")
else:
    print("helper_code already present.")
