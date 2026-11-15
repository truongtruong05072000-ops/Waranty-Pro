# -*- coding: utf-8 -*-
import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# -----------------------------------------------------------------------------
# 1. ENHANCE getCustomerGroup TO ACCEPT source, fleet, notes AND CORRECTLY CLASSIFY GSM / BSHIP
# -----------------------------------------------------------------------------
old_cust_group = '''function getCustomerGroup(name, companyName) {
  const fullStr = norm(String(name || '') + ' ' + String(companyName || ''));
  if (!fullStr || fullStr === '—' || fullStr === 'trong' || fullStr === 'chua phan cong') {
    return { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8' };
  }
  if (fullStr.includes('gsm') || fullStr.includes('xanh sm') || fullStr.includes('di chuyen xanh va thong minh') || fullStr.includes('taxi xanh')) {
    return { id: 'gsm', name: 'GSM (Xanh SM)', tag: 'GSM', badgeClass: 'cust-gsm', color: '#06b6d4' };
  }
  if (fullStr.includes('bship') || fullStr.includes('b-ship') || fullStr.includes('van tai bship') || fullStr.includes('b ship')) {
    return { id: 'bship', name: 'Bship', tag: 'BSHIP', badgeClass: 'cust-bship', color: '#10b981' };
  }
  if (fullStr.includes('ahamove') || fullStr.includes('lalamove') || fullStr.includes('grab') || fullStr.includes('be group') || fullStr.includes('gojek')) {
    return { id: 'fleet', name: 'Đội xe đối tác', tag: 'Đối tác', badgeClass: 'cust-fleet', color: '#f59e0b' };
  }
  if (fullStr.includes('cong ty') || fullStr.includes('cp') || fullStr.includes('tnhh') || fullStr.includes('chi nhanh') || fullStr.includes('corp') || fullStr.includes('doanh nghiep')) {
    return { id: 'corp', name: 'Doanh nghiệp khác', tag: 'Doanh nghiệp', badgeClass: 'cust-corp', color: '#a855f7' };
  }
  return { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8' };
}'''

new_cust_group = '''function getCustomerGroup(name, companyName, extra = {}) {
  const source = typeof extra === 'string' ? extra : (extra.source || '');
  const fleet = typeof extra === 'object' ? (extra.fleet || '') : '';
  const note = typeof extra === 'object' ? (extra.note || extra.advisor_note || extra.foreman_note || '') : '';
  const rawCombined = `${name || ''} ${companyName || ''} ${source} ${fleet} ${note}`;
  const fullStr = norm(rawCombined);

  // 1. Kiểm tra BSHIP trước (nguồn, đội xe, ghi chú KTV hoặc tên khách)
  if (fullStr.includes('bship') || fullStr.includes('b-ship') || fullStr.includes('van tai bship') || fullStr.includes('b ship') || source === 'bship' || fleet === 'bship') {
    return { id: 'bship', name: 'Bship', tag: 'BSHIP', badgeClass: 'cust-bship', color: '#10b981' };
  }

  // 2. Kiểm tra GSM (Xanh SM) - Ưu tiên hàng đầu (chiếm đa số đội xe tại xưởng)
  // Nhận diện qua: source=gsm, fleet=gsm, ghi chú có gsm/xanh sm, tên công ty hoặc tên khách chứa di chuyển xanh/thông minh
  const isGsmSource = source === 'gsm' || fleet === 'gsm';
  const hasGsmKeyword = fullStr.includes('gsm') || fullStr.includes('xanh sm') || 
                        fullStr.includes('di chuyen xanh') || fullStr.includes('thong minh') || 
                        fullStr.includes('taxi xanh') || fullStr.includes('cp dcm') ||
                        fullStr.includes('green sm');

  if (isGsmSource || hasGsmKeyword) {
    return { id: 'gsm', name: 'GSM (Xanh SM)', tag: 'GSM', badgeClass: 'cust-gsm', color: '#06b6d4' };
  }

  // 3. Đội xe đối tác công nghệ khác
  if (fullStr.includes('ahamove') || fullStr.includes('lalamove') || fullStr.includes('grab') || fullStr.includes('be group') || fullStr.includes('gojek')) {
    return { id: 'fleet', name: 'Đội xe đối tác', tag: 'Đối tác', badgeClass: 'cust-fleet', color: '#f59e0b' };
  }

  // 4. Doanh nghiệp khác (có tên công ty, chi nhánh, pháp nhân)
  if (fullStr.includes('cong ty') || fullStr.includes('cp ') || fullStr.includes('tnhh') || fullStr.includes('chi nhanh') || fullStr.includes('corp') || fullStr.includes('doanh nghiep')) {
    return { id: 'corp', name: 'Doanh nghiệp khác', tag: 'Doanh nghiệp', badgeClass: 'cust-corp', color: '#a855f7' };
  }

  // 5. Khách lẻ (Chỉ khi thực sự không thuộc GSM, BSHIP hay doanh nghiệp nào)
  return { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8' };
}'''

assert old_cust_group in content, 'old_cust_group not found'
content = content.replace(old_cust_group, new_cust_group)
print('1. Updated getCustomerGroup with source/fleet/note multi-source recognition')

# -----------------------------------------------------------------------------
# 2. UPDATE normalizeOrder TO STRICTLY VERIFY PAYMENT CLASSIFICATION FROM LINE ITEMS
# -----------------------------------------------------------------------------
old_payment_logic = '''// ĐÁNH GIÁ CHÍNH XÁC PHÂN LOẠI THANH TOÁN (Từ Mục Công việc, Mục Vật tư/Phụ tùng hoặc dữ liệu Lệnh)
  // 1. Kiểm tra từng mục trong Mục Công việc (line_items) và Mục Vật tư/Phụ tùng (part_line_items / parts)
  const lineItems = Array.isArray(d.line_items) ? d.line_items : (Array.isArray(d.lineItems) ? d.lineItems : (Array.isArray(d.jobs) ? d.jobs : []));
  const partItems = Array.isArray(d.part_line_items) ? d.part_line_items : (Array.isArray(d.partLineItems) ? d.partLineItems : (Array.isArray(d.parts) ? d.parts : []));
  
  let hasWarrantyLineItem = false;
  let hasCustomerLineItem = false;
  const allSubItems = [...lineItems, ...partItems];
  
  allSubItems.forEach(item => {
    if (!item) return;
    const pt = norm(String(item.paymentType || item.payment_type || item.settlementType || item.classification || item.type || ''));
    if (pt.includes('bao hanh') || pt === 'bh' || pt.includes('warranty') || pt.includes('vinfast') || pt.includes('factory')) {
      hasWarrantyLineItem = true;
    } else if (pt.includes('khach') || pt.includes('customer') || pt.includes('retail') || pt.includes('paid')) {
      hasCustomerLineItem = true;
    }
  });

  // 2. Kiểm tra phân loại rõ ràng ở cấp phiếu / LSC nếu có
  const phanLoaiTtRaw = String(
    d.phanLoaiTt || d.phan_loai_tt || d.paymentType || d.payment_type || d.billing_type || d.order_type || d.loai_sua_chua || ''
  ).trim();
  const normPlRaw = norm(phanLoaiTtRaw);

  let isWarrantyPayment = false;
  let phanLoaiTt = 'Khách hàng';

  if (hasWarrantyLineItem) {
    isWarrantyPayment = true;
    phanLoaiTt = 'Bảo hành';
  } else if (hasCustomerLineItem && !hasWarrantyLineItem) {
    isWarrantyPayment = false;
    phanLoaiTt = 'Khách hàng';
  } else if (normPlRaw.includes('bao hanh') || normPlRaw === 'bh' || normPlRaw.includes('warranty')) {
    isWarrantyPayment = true;
    phanLoaiTt = 'Bảo hành';
  } else if (normPlRaw.includes('khach') || normPlRaw.includes('customer') || normPlRaw.includes('thanh ly') || normPlRaw.includes('liquidation')) {
    isWarrantyPayment = false;
    phanLoaiTt = 'Khách hàng';
  } else {
    // 3. Nghiệp vụ ServiceOS / Dealer Portal:
    const sType = norm(String(d.service_type || ''));
    const isLiquidationOrMaint = sType.includes('liquidation') || sType.includes('thanh ly') || sType.includes('maintenance') || sType.includes('bao duong');
    const hasExplicitWarrantyDoc = Boolean((bhCode && bhCode !== '—') || (d.dms_warranty_code) || (d.dms_claim_code));

    if (sType === 'warranty' || sType.includes('bao hanh') || hasExplicitWarrantyDoc) {
      isWarrantyPayment = true;
      phanLoaiTt = 'Bảo hành';
    } else {
      isWarrantyPayment = false;
      phanLoaiTt = 'Khách hàng';
    }
  }

  // ĐIỀU KIỆN CHÍNH XÁC: Xe PHẢI có lỗi hoặc linh kiện tháo thay bảo hành thực tế
  // Tuyệt đối KHÔNG tính các xe "Không lỗi" (chỉ trả cọc, thanh lý, kiểm tra định kỳ)
  const hasActualWarrantyWork = Boolean(
    (hasLoi && faultList.length > 0) || 
    hasBangCapNhat || 
    Boolean(bhCode && bhCode !== '—') ||
    kindsRaw.length > 0
  );

  // Nếu xe "Không lỗi" và không có linh kiện bảo hành -> 100% không phát sinh đề xuất BH
  if (!hasActualWarrantyWork) {
    isWarrantyPayment = false;
    phanLoaiTt = 'Không phát sinh BH';
  }

  const isSettled = isSettledOrHigher(status, d);
  // Lệnh chưa làm ĐXBH: Phải có lỗi/hạng mục BH VÀ Phân loại TT là bảo hành VÀ từ Quyết toán trở lên VÀ chưa có mã ĐX (WC-...)
  const isUnsubmittedWarranty = isWarrantyPayment && hasActualWarrantyWork && isSettled && (!claimCode || claimCode === '—' || !claimCode.startsWith('WC-'));

  // Nhóm khách hàng (GSM, Bship, Khách lẻ, Doanh nghiệp khác)
  const matchedCustName = (matchedClaim && matchedClaim.customer && matchedClaim.customer.customerName) || '';
  const matchedCompName = (matchedClaim && matchedClaim.customer && matchedClaim.customer.customerCompanyName) || '';
  const custGroup = getCustomerGroup(customer || matchedCustName, d.customerCompanyName || matchedCompName);'''

new_payment_logic = '''// ĐÁNH GIÁ CHÍNH XÁC PHÂN LOẠI THANH TOÁN (Từ Mục Công việc, Mục Vật tư/Phụ tùng của Lệnh sửa chữa)
  // Quy chuẩn Dealer Portal & ServiceOS: Một lệnh sửa chữa CHỈ LÀ BẢO HÀNH khi CÓ ÍT NHẤT MỘT MỤC CÔNG VIỆC hoặc PHỤ TÙNG
  // có Phân loại thanh toán là "BẢO HÀNH". Nếu toàn bộ là Khách hàng -> 100% là lệnh Khách hàng!
  const lineItems = Array.isArray(d.line_items) ? d.line_items : (Array.isArray(d.lineItems) ? d.lineItems : (Array.isArray(d.jobs) ? d.jobs : (Array.isArray(d.laborLineItems) ? d.laborLineItems : [])));
  const partItems = Array.isArray(d.part_line_items) ? d.part_line_items : (Array.isArray(d.partLineItems) ? d.partLineItems : (Array.isArray(d.parts) ? d.parts : (Array.isArray(d.partItems) ? d.partItems : [])));
  
  let hasWarrantyLineItem = false;
  let hasCustomerLineItem = false;
  const allSubItems = [...lineItems, ...partItems];
  
  allSubItems.forEach(item => {
    if (!item) return;
    const pt = norm(String(
      item.paymentClassification || item.payment_classification ||
      item.paymentType || item.payment_type ||
      item.settlementType || item.settlement_type ||
      item.classification || item.type || ''
    ));
    if (pt.includes('bao hanh') || pt === 'bh' || pt.includes('warranty') || pt.includes('vinfast') || pt.includes('factory')) {
      hasWarrantyLineItem = true;
    } else if (pt.includes('khach') || pt.includes('customer') || pt.includes('retail') || pt.includes('paid') || pt.includes('tu tra')) {
      hasCustomerLineItem = true;
    }
  });

  let isWarrantyPayment = false;
  let phanLoaiTt = 'Khách hàng';

  // 1. Nếu đã có chi tiết dòng công việc hoặc vật tư: Căn cứ 100% vào phân loại thanh toán của các dòng đó
  if (allSubItems.length > 0) {
    if (hasWarrantyLineItem) {
      isWarrantyPayment = true;
      phanLoaiTt = 'Bảo hành';
    } else {
      isWarrantyPayment = false;
      phanLoaiTt = 'Khách hàng';
    }
  } else {
    // 2. Khi chưa tải chi tiết từng dòng công việc/vật tư:
    // TUYỆT ĐỐI KHÔNG tự tiện coi là Bảo hành nếu chỉ dựa vào service_type!
    // Hầu hết các lệnh tại xưởng là Khách hàng. Chỉ coi là Bảo hành khi có hồ sơ bảo hành rõ ràng:
    const hasCustPay = Number(d.cust_pay_amount || d.custPayAmount || 0) > 0 || Boolean(d.cust_pay_ro);
    const hasExplicitWarrantyCode = Boolean(
      (bhCode && bhCode !== '—' && !bhCode.includes('WO-')) || 
      (d.dms_warranty_code && !d.dms_warranty_code.includes('WO-')) ||
      (claimCode && claimCode.startsWith('WC-'))
    );

    // Nếu có thanh toán khách hàng (cust_pay_amount) hoặc ghi chú Khách trả -> 100% Khách hàng
    if (hasCustPay) {
      isWarrantyPayment = false;
      phanLoaiTt = 'Khách hàng';
    } else if (hasExplicitWarrantyCode) {
      isWarrantyPayment = true;
      phanLoaiTt = 'Bảo hành';
    } else {
      isWarrantyPayment = false;
      phanLoaiTt = 'Khách hàng';
    }
  }

  // ĐIỀU KIỆN CHÍNH XÁC: Xe PHẢI có lỗi hoặc linh kiện tháo thay bảo hành thực tế
  // Tuyệt đối KHÔNG tính các xe "Không lỗi" (chỉ trả cọc, thanh lý, bảo dưỡng)
  const hasActualWarrantyWork = Boolean(
    (hasLoi && faultList.length > 0) || 
    hasBangCapNhat || 
    Boolean(bhCode && bhCode !== '—') ||
    kindsRaw.length > 0
  );

  // Nếu xe "Không lỗi" hoặc không có bảo hành -> Không phát sinh đề xuất
  if (!hasActualWarrantyWork || !isWarrantyPayment) {
    if (!hasActualWarrantyWork) phanLoaiTt = 'Không phát sinh BH';
    isWarrantyPayment = false;
  }

  const isSettled = isSettledOrHigher(status, d);
  // Lệnh chưa làm ĐXBH: Phải ĐÍCH THỰC có Phân loại TT là Bảo hành VÀ từ Quyết toán trở lên VÀ chưa có mã ĐX (WC-...)
  const isUnsubmittedWarranty = isWarrantyPayment && hasActualWarrantyWork && isSettled && (!claimCode || claimCode === '—' || !claimCode.startsWith('WC-'));

  // Nhóm khách hàng (Ưu tiên GSM, BSHIP từ source/fleet/note của ServiceOS & Dealer Portal)
  const matchedCustName = (matchedClaim && matchedClaim.customer && matchedClaim.customer.customerName) || '';
  const matchedCompName = (matchedClaim && matchedClaim.customer && matchedClaim.customer.customerCompanyName) || '';
  const custGroup = getCustomerGroup(
    customer || matchedCustName, 
    d.customerCompanyName || matchedCompName, 
    { source: d.source, fleet: d.fleet, note: d.advisor_note || d.foreman_note || d.symptoms }
  );'''

assert old_payment_logic in content, 'old_payment_logic not found'
content = content.replace(old_payment_logic, new_payment_logic)
print('2. Updated normalizeOrder payment classification logic strictly based on line items')

# -----------------------------------------------------------------------------
# 3. UPDATE parseDealerPortalJson TO PROPERLY CLASSIFY CUSTOMER FROM FLEET & CLAIMS
# -----------------------------------------------------------------------------
old_parse_cust = '''    const cust = c.customer || {};
    rec.customerName = String(cust.customerName || c.customerName || '').trim();
    rec.customerCompanyName = String(cust.customerCompanyName || c.customerCompanyName || '').trim();
    rec.customerGroup = getCustomerGroup(rec.customerName, rec.customerCompanyName);'''

new_parse_cust = '''    const cust = c.customer || {};
    rec.customerName = String(cust.customerName || c.customerName || '').trim();
    rec.customerCompanyName = String(cust.customerCompanyName || c.customerCompanyName || '').trim();
    
    // Tra cứu nguồn xe từ state.checkXe.orders qua VIN hoặc WO nếu có
    let matchedOrderInfo = null;
    if (state.checkXe && Array.isArray(state.checkXe.orders)) {
      const cVin = String(c.vin || '').trim().toUpperCase();
      const cWo = String(c.workOrderNumber || '').trim().toUpperCase();
      matchedOrderInfo = state.checkXe.orders.find(o => 
        (cVin && o.vin && o.vin.toUpperCase() === cVin) ||
        (cWo && o.wo && o.wo.toUpperCase() === cWo)
      );
    }

    const extraCustInfo = {
      source: c.source || (matchedOrderInfo ? matchedOrderInfo.source : ''),
      fleet: c.fleet || (matchedOrderInfo ? matchedOrderInfo.fleet : ''),
      note: c.note || c.reason || (matchedOrderInfo ? matchedOrderInfo.note : ''),
      claimTo: c.claimTo || ''
    };

    rec.customerGroup = getCustomerGroup(rec.customerName, rec.customerCompanyName, extraCustInfo);'''

assert old_parse_cust in content, 'old_parse_cust not found'
content = content.replace(old_parse_cust, new_parse_cust)
print('3. Updated parseDealerPortalJson customer categorization with cross-referenced fleet data')

# -----------------------------------------------------------------------------
# 4. FIX SEAMLESS IN-PLACE UPDATING (STOP DESTROYING OLD DATA AND FLASHING SCREEN)
# -----------------------------------------------------------------------------
old_handle_claims = '''function handleDealerPortalRealtimeClaims(claims) {
  if (!claims) return;
  lastDealerPortalSyncTime = Date.now();
  
  // CẬP NHẬT ĐÈ ĐỀ XUẤT DEALER PORTAL - KHÔNG XÓA DỮ LIỆU CŨ
  const count = upsertDealerPortalClaims(claims);
  
  renderAll();
  if (typeof renderCheckXe === 'function') {
    renderCheckXe({ inPlace: true });
  }
  showRealtimeToast(`Đã cập nhật ${count} đề xuất bảo hành từ Dealer Portal!`, '💼');
  updateRealtimeStatusChip();
}'''

new_handle_claims = '''function handleDealerPortalRealtimeClaims(claims) {
  if (!claims) return;
  lastDealerPortalSyncTime = Date.now();
  
  // CẬP NHẬT ĐÈ ĐỀ XUẤT DEALER PORTAL TẠI CHỖ - KHÔNG XÓA DỮ LIỆU CŨ
  const count = upsertDealerPortalClaims(claims);
  
  // Cập nhật tính toán trong bộ nhớ
  if (typeof computeAll === 'function') computeAll();

  // Xác định tab đang mở để chỉ cập nhật tại chỗ tab đó, không xóa trắng màn hình
  const activeTabEl = document.querySelector('.nav-tab.active');
  const curTab = activeTabEl ? activeTabEl.dataset.tab : '';

  if (curTab === 'checkxe' && typeof renderCheckXe === 'function') {
    renderCheckXe({ inPlace: true });
  } else if (curTab === 'overview') {
    // Chỉ cập nhật các số liệu KPI và cơ cấu mà không render lại toàn bộ container
    renderRulePanel(state.computed);
    updateOverviewKpisInPlace();
  }

  showRealtimeToast(`Đã cập nhật ${count} đề xuất bảo hành từ Dealer Portal!`, '💼');
  updateRealtimeStatusChip();
}'''

assert old_handle_claims in content, 'old_handle_claims not found'
content = content.replace(old_handle_claims, new_handle_claims)
print('4. Updated handleDealerPortalRealtimeClaims to stop wiping screen and render in-place')

# Add updateOverviewKpisInPlace helper
update_helper = '''
function updateOverviewKpisInPlace() {
  const C = state.computed;
  if (!C) return;
  const expEl = document.getElementById('ctxExpectedVal');
  if (expEl) expEl.textContent = fmtT(C.expectedPlan) + ' tr (' + fmtN(C.expectedPlan / (settings.target || 1) * 100, 1) + '%)';
  const brkEl = document.getElementById('customerBreakdownContainer');
  if (brkEl && C.customerBreakdown && typeof renderCustomerBreakdownHtml === 'function') {
    brkEl.innerHTML = renderCustomerBreakdownHtml(C.customerBreakdown);
  }
}
'''

content = content.replace('function handleDealerPortalRealtimeClaims', update_helper + '\nfunction handleDealerPortalRealtimeClaims')
print('5. Added updateOverviewKpisInPlace helper')

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Successfully saved _build/app_template2.html!')
