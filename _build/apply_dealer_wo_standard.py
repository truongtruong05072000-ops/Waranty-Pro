import sys, re

# Read app_template2.html
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add formatDealerPortalWo right before normalizeOrder
format_func = '''// Chuẩn hóa Mã Lệnh sửa chữa (Work Order) sang đúng chuẩn VinFast Dealer Portal (ví dụ: N54511-WO-261024-0044)
function formatDealerPortalWo(rawWo, dmsRoCode, orderCode, workOrderNumber) {
  // 1. Explicit workOrderNumber từ Dealer Portal API
  if (workOrderNumber && String(workOrderNumber).includes('-WO-')) {
    return String(workOrderNumber).trim();
  }
  // 2. Explicit dms_ro_code (mã LSC Dealer Portal chính thức)
  if (dmsRoCode && String(dmsRoCode).includes('-WO-')) {
    return String(dmsRoCode).trim();
  }
  // 3. rawWo đã có -WO-
  if (rawWo && String(rawWo).includes('-WO-')) {
    return String(rawWo).trim();
  }
  // 4. Nếu mã ServiceOS dạng DEALER-YYMMDD-SEQ (ví dụ: N54511-261106-006 hoặc N54511-261104-008)
  // Chuyển đổi chính xác sang chuẩn VinFast Dealer Portal: DEALER-WO-YYMMDD-0000 (ví dụ: N54511-WO-261106-0006)
  const candidate = String(dmsRoCode || workOrderNumber || rawWo || orderCode || '').trim();
  const m = candidate.match(/^([A-Z0-9]+)-([0-9]{6})-([0-9]+)$/i);
  if (m) {
    const dealer = m[1].toUpperCase();
    const datePart = m[2];
    const seq = m[3].padStart(4, '0');
    return `${dealer}-WO-${datePart}-${seq}`;
  }
  const m2 = candidate.match(/^([A-Z0-9]+)[-_]?WO[-_]?([0-9]{6})[-_]?([0-9]+)$/i);
  if (m2) {
    const dealer = m2[1].toUpperCase();
    const datePart = m2[2];
    const seq = m2[3].padStart(4, '0');
    return `${dealer}-WO-${datePart}-${seq}`;
  }
  return candidate || '—';
}
window.formatDealerPortalWo = formatDealerPortalWo;

'''

if 'function formatDealerPortalWo' not in content:
    target = '// Chuẩn hóa một bản ghi xe theo đúng chuẩn ServiceOS\nfunction normalizeOrder(raw, i){'
    if target in content:
        content = content.replace(target, format_func + target)
        print('Added formatDealerPortalWo before normalizeOrder')
    else:
        # try without comment
        target2 = 'function normalizeOrder(raw, i){'
        content = content.replace(target2, format_func + target2, 1)
        print('Added formatDealerPortalWo before normalizeOrder (no comment match)')

# 2. Update normalizeOrder to use formatDealerPortalWo
old_norm_start = '''function normalizeOrder(raw, i){
  const d = (raw && raw.work_order) ? raw.work_order : (raw || {});
  let wo = String(d.wo || d.code || d.dms_ro_code || d.work_order_code || '—').trim();'''

new_norm_start = '''function normalizeOrder(raw, i){
  const d = (raw && raw.work_order) ? raw.work_order : (raw || {});
  let rawWo = String(d.workOrderNumber || d.work_order_number || d.dms_ro_code || d.wo || d.code || d.work_order_code || '—').trim();
  let wo = formatDealerPortalWo(d.wo, d.dms_ro_code, d.code || d.work_order_code, d.workOrderNumber || d.work_order_number);
  const serviceOsCode = String(d.code || d.work_order_code || '').trim();'''

if old_norm_start in content:
    content = content.replace(old_norm_start, new_norm_start)
    print('Updated normalizeOrder wo initialization')

# 3. Update matchedClaim block in normalizeOrder
old_matched = '''    matchedClaim = window.DEALER_CLAIMS_MAP.get(cVin) ||
                         (cVin.length >= 6 ? window.DEALER_CLAIMS_MAP.get(cVin.slice(-6)) : null) ||
                         (cRo ? window.DEALER_CLAIMS_MAP.get(cRo) : null) ||
                         window.DEALER_CLAIMS_MAP.get(cWo);
    if (matchedClaim) {
      if (!bhCode || bhCode === '—') bhCode = String(matchedClaim.workOrderNumber || matchedClaim.work_order || '').trim();'''

new_matched = '''    const cCode = String(d.code || '').trim().toUpperCase();
    matchedClaim = window.DEALER_CLAIMS_MAP.get(cVin) ||
                         (cVin.length >= 6 ? window.DEALER_CLAIMS_MAP.get(cVin.slice(-6)) : null) ||
                         (cRo ? window.DEALER_CLAIMS_MAP.get(cRo) : null) ||
                         window.DEALER_CLAIMS_MAP.get(cWo) ||
                         (cCode ? window.DEALER_CLAIMS_MAP.get(cCode) : null);
    if (matchedClaim) {
      if (matchedClaim.workOrderNumber) {
        wo = formatDealerPortalWo(matchedClaim.workOrderNumber, d.dms_ro_code, d.code);
      }
      if (!bhCode || bhCode === '—') bhCode = String(matchedClaim.workOrderNumber || matchedClaim.work_order || '').trim();'''

if old_matched in content:
    content = content.replace(old_matched, new_matched)
    print('Updated matchedClaim in normalizeOrder')

# 4. Update return object in normalizeOrder
old_ret = '''    wo: wo,
    plate: plate,
    vin: vin,'''

new_ret = '''    wo: wo,
    dealerWo: wo,
    serviceOsCode: serviceOsCode,
    plate: plate,
    vin: vin,'''

if old_ret in content:
    content = content.replace(old_ret, new_ret)
    print('Updated return object in normalizeOrder')

# 5. Update upsertDealerPortalClaims to also update o.wo and index noWo
old_upsert_map = '''    if (c.workOrderNumber) {
      window.DEALER_CLAIMS_MAP.set(String(c.workOrderNumber).trim().toUpperCase(), c);
    }'''

new_upsert_map = '''    if (c.workOrderNumber) {
      const woStr = String(c.workOrderNumber).trim().toUpperCase();
      window.DEALER_CLAIMS_MAP.set(woStr, c);
      const noWo = woStr.replace(/-WO-/i, '-');
      window.DEALER_CLAIMS_MAP.set(noWo, c);
    }'''

if old_upsert_map in content:
    content = content.replace(old_upsert_map, new_upsert_map)
    print('Updated upsertDealerPortalClaims indexing')

old_re_norm = '''      const reNorm = normalizeOrder(o._raw || o, i);
      if (reNorm.bhCode && reNorm.bhCode !== '—') o.bhCode = reNorm.bhCode;'''

new_re_norm = '''      const reNorm = normalizeOrder(o._raw || o, i);
      o.wo = reNorm.wo;
      o.dealerWo = reNorm.wo;
      if (reNorm.bhCode && reNorm.bhCode !== '—') o.bhCode = reNorm.bhCode;'''

if old_re_norm in content:
    content = content.replace(old_re_norm, new_re_norm)
    print('Updated reNorm in upsertDealerPortalClaims')

# 6. Update subtitle of unsubmitted section
old_sub = '''Quy chuẩn: Lệnh có <b>Phân loại TT là Bảo hành</b> và trạng thái <b>từ Quyết toán trở lên</b> nhưng <b>chưa có mã ĐX (WC-...)</b> trên Dealer Portal'''
new_sub = '''Quy chuẩn: Lệnh có <b>Phân loại TT là Bảo hành</b> và trạng thái <b>từ Quyết toán trở lên</b> nhưng <b>chưa có mã ĐX (WC-...)</b> trên Dealer Portal. Mã LSC hiển thị chuẩn VinFast Dealer Portal (<code>N54511-WO-...</code>)'''

if old_sub in content:
    content = content.replace(old_sub, new_sub)
    print('Updated subtitle in unsubmitted section')

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Successfully saved _build/app_template2.html')
