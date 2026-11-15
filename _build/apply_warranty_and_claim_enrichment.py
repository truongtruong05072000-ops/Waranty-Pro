# -*- coding: utf-8 -*-
import io, sys
sys.stdout.reconfigure(encoding='utf-8')

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update normalizeOrder to extract full warranty and claim details
old_extract_block = '''  // 3. BẢNG CẬP NHẬT PHÍA DƯỚI (CHỈ LẤY ĐÚNG Ô KHOANH ĐỎ TỪ SERVICEOS)
  // TUYỆT ĐỐI KHÔNG LẤY MÃ QR SẠC / PHỤ KIỆN VÀO BẢNG CẬP NHẬT LINH KIỆN!
  let pinSerial = String(d.pinSerial || d.battery_serial_old || d.battery_serial || '').trim();
  const pinSerialNew = String(d.pinSerialNew || d.battery_serial_new || '').trim();
  let motorSerial = String(d.motorSerial || d.motor_serial_old || d.motor_serial || '').trim();
  const motorSerialNew = String(d.motorSerialNew || d.motor_serial_new || '').trim();
  // Bỏ qua mã QR sạc: không đưa vào bảng cập nhật hay serial linh kiện
  const chargerSerial = '';
  
  // Loại bỏ nếu serial bị nhét mã QR sạc hoặc phụ kiện ngoài
  if (pinSerial.includes('QR ngoài') || pinSerial.includes('DRT00011190')) pinSerial = '';
  if (motorSerial.includes('QR ngoài') || motorSerial.includes('DRT00011190')) motorSerial = '';

  const removedAt = String(d.removedAt || d.parts_removed_at || '').trim();
  const partsRemovedAt = String(d.parts_removed_at || '').trim();
  const motorRemovedAt = String(d.motor_removed_at || d.motorRemovedAt || '').trim();
  
  const bhOrderStatus = String(d.bhOrderStatus || d.dms_warranty_status || '').trim();
  const pinType = String(d.pinType || d.battery_repair_type || '').trim();
  const motorType = String(d.motorType || d.motor_repair_type || '').trim();
  const cocStatus = String(d.coc_status || d.cocStatus || '').trim();
  const sentFactoryAt = String(d.sent_factory_at || d.sentFactoryAt || '').trim();
  
  const kinds = Array.isArray(d.warranty_kinds) ? d.warranty_kinds.filter(Boolean) : [];
  const extra = (d.warranty_extra && typeof d.warranty_extra === 'object') ? d.warranty_extra : {};

  // Nếu có extra của motor hoặc pin hoặc esim, trích xuất thêm dữ liệu chi tiết
  if (extra.motor) {
    if (!motorSerial && extra.motor.serial_old) motorSerial = extra.motor.serial_old;
    if (!bhCode && extra.motor.warranty_code) bhCode = extra.motor.warranty_code;
    if (!claimCode && extra.motor.claim_code) claimCode = extra.motor.claim_code;
  }
  if (extra.pin) {
    if (!pinSerial && extra.pin.serial_old) pinSerial = extra.pin.serial_old;
    if (!bhCode && extra.pin.warranty_code) bhCode = extra.pin.warranty_code;
    if (!claimCode && extra.pin.claim_code) claimCode = extra.pin.claim_code;
  }
  if (extra.esim) {
    if (!bhCode && extra.esim.warranty_code) bhCode = extra.esim.warranty_code;
    if (!claimCode && extra.esim.claim_code) claimCode = extra.esim.claim_code;
  }'''

new_extract_block = '''  // 3. BẢNG CẬP NHẬT PHÍA DƯỚI (LẤY ĐẦY ĐỦ LỆNH BẢO HÀNH, ĐXBH, CHI TIẾT ĐỀ XUẤT)
  let pinSerial = String(d.pinSerial || d.battery_serial_old || d.battery_serial || '').trim();
  const pinSerialNew = String(d.pinSerialNew || d.battery_serial_new || '').trim();
  let motorSerial = String(d.motorSerial || d.motor_serial_old || d.motor_serial || '').trim();
  const motorSerialNew = String(d.motorSerialNew || d.motor_serial_new || '').trim();
  const chargerSerial = '';
  
  if (pinSerial.includes('QR ngoài') || pinSerial.includes('DRT00011190')) pinSerial = '';
  if (motorSerial.includes('QR ngoài') || motorSerial.includes('DRT00011190')) motorSerial = '';

  const removedAt = String(d.removedAt || d.parts_removed_at || '').trim();
  const partsRemovedAt = String(d.parts_removed_at || '').trim();
  const motorRemovedAt = String(d.motor_removed_at || d.motorRemovedAt || '').trim();
  
  const bhOrderStatus = String(d.bhOrderStatus || d.dms_warranty_status || '').trim();
  const pinType = String(d.pinType || d.battery_repair_type || '').trim();
  const motorType = String(d.motorType || d.motor_repair_type || '').trim();
  const cocStatus = String(d.coc_status || d.cocStatus || '').trim();
  const sentFactoryAt = String(d.sent_factory_at || d.sentFactoryAt || '').trim();
  
  const kinds = Array.isArray(d.warranty_kinds) ? d.warranty_kinds.filter(Boolean) : [];
  const extra = (d.warranty_extra && typeof d.warranty_extra === 'object') ? d.warranty_extra : {};

  // Chi tiết phê duyệt ĐXBH (Dealer Portal Claims)
  let claimAmount = d.claimAmount || d.claim_amount || null;
  let claimSubmittedAt = d.claimSubmittedAt || d.claim_submitted_at || null;
  let claimApprovedAt = d.claimApprovedAt || d.claim_approved_at || null;
  let claimStatus = d.claimStatus || d.claim_status || '';

  // Trích xuất từ warranty_extra của từng loại linh kiện (pin, motor, esim...)
  ['pin', 'motor', 'esim', 'charger', 'topcover', 'rear_shock', 'front_shock'].forEach(k => {
    const row = extra[k];
    if (row && typeof row === 'object') {
      if (!motorSerial && (k === 'motor') && row.serial_old) motorSerial = row.serial_old;
      if (!pinSerial && (k === 'pin') && row.serial_old) pinSerial = row.serial_old;
      if (!bhCode && row.warranty_code) bhCode = String(row.warranty_code).trim();
      if (!claimCode && row.claim_code) claimCode = String(row.claim_code).trim();
      if (!claimAmount && row.claim_amount) claimAmount = row.claim_amount;
      if (!claimSubmittedAt && row.claim_submitted_at) claimSubmittedAt = row.claim_submitted_at;
      if (!claimApprovedAt && row.claim_approved_at) claimApprovedAt = row.claim_approved_at;
      if (!claimStatus && row.claim_status) claimStatus = row.claim_status;
    }
  });

  // Trích xuất từ mảng claims của Dealer Portal nếu có
  const dealerClaims = Array.isArray(d.dealer_claims) ? d.dealer_claims : (Array.isArray(d.claims) ? d.claims : []);
  if (dealerClaims.length > 0) {
    const c0 = dealerClaims[0];
    if (!bhCode && c0.work_order) bhCode = String(c0.work_order).trim();
    if (!claimCode && (c0.number || c0.claim_code || c0.code)) claimCode = String(c0.number || c0.claim_code || c0.code).trim();
    if (!claimAmount && c0.amount != null) claimAmount = c0.amount;
    if (!claimSubmittedAt && (c0.submitted_at || c0.created_at)) claimSubmittedAt = c0.submitted_at || c0.created_at;
    if (!claimApprovedAt && c0.approved_at) claimApprovedAt = c0.approved_at;
    if (!claimStatus && c0.status) claimStatus = c0.status;
  }'''

if old_extract_block in content:
    content = content.replace(old_extract_block, new_extract_block, 1)
    print("Updated normalizeOrder warranty and claim extraction!")
else:
    norm_old = old_extract_block.replace('\r\n', '\n')
    norm_content = content.replace('\r\n', '\n')
    if norm_old in norm_content:
        norm_content = norm_content.replace(norm_old, new_extract_block.replace('\r\n', '\n'), 1)
        content = norm_content
        print("Updated normalizeOrder warranty and claim extraction (normalized)!")
    else:
        print("ERROR: old_extract_block not found!")

# 2. Update order return object to include claimAmount, claimSubmittedAt, claimApprovedAt, claimStatus
old_order_obj = '''    partStatusText: hasBangCapNhat ? formatPartStatusText(bhOrderStatus || warrantyStatus, (kinds && kinds[0]) || '') : '—',
    partSerialText: hasBangCapNhat ? ((motorSerial || pinSerial) || '—') : '—',
    partRemovedDateText: hasBangCapNhat ? (motorRemovedAt ? formatDisplayDate(motorRemovedAt) : (partsRemovedAt ? formatDisplayDate(partsRemovedAt) : '—')) : '—',
    bhCodeText: hasBangCapNhat ? (bhCode || '—') : '—',
    claimCodeText: hasBangCapNhat ? (claimCode || '—') : '—'
  };'''

new_order_obj = '''    partStatusText: hasBangCapNhat ? formatPartStatusText(bhOrderStatus || warrantyStatus, (kinds && kinds[0]) || '') : '—',
    partSerialText: hasBangCapNhat ? ((motorSerial || pinSerial) || '—') : '—',
    partRemovedDateText: hasBangCapNhat ? (motorRemovedAt ? formatDisplayDate(motorRemovedAt) : (partsRemovedAt ? formatDisplayDate(partsRemovedAt) : '—')) : '—',
    bhCodeText: hasBangCapNhat ? (bhCode || '—') : '—',
    claimCodeText: hasBangCapNhat ? (claimCode || '—') : '—',
    claimAmount: claimAmount,
    claimSubmittedAt: claimSubmittedAt,
    claimApprovedAt: claimApprovedAt,
    claimStatus: claimStatus
  };'''

if old_order_obj in content:
    content = content.replace(old_order_obj, new_order_obj, 1)
    print("Updated order return object with claim details!")
else:
    norm_old = old_order_obj.replace('\r\n', '\n')
    norm_content = content.replace('\r\n', '\n')
    if norm_old in norm_content:
        norm_content = norm_content.replace(norm_old, new_order_obj.replace('\r\n', '\n'), 1)
        content = norm_content
        print("Updated order return object with claim details (normalized)!")
    else:
        print("ERROR: old_order_obj not found!")

# 3. Update formatBangCapNhatHtml to display ĐXBH status pill nicely (e.g. "ĐXBH · Đã phê duyệt")
old_card_vars = '''  const amountVal = o.claimAmount ? numf(o.claimAmount) + ' đ' : '—';
  const submittedVal = o.claimSubmittedAt ? formatDisplayDate(o.claimSubmittedAt) : '—';
  const approvedVal = o.claimApprovedAt ? formatDisplayDate(o.claimApprovedAt) : '—';'''

new_card_vars = '''  const amountVal = o.claimAmount ? (typeof numf === 'function' ? numf(o.claimAmount) : String(o.claimAmount).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.')) + ' đ' : '—';
  const submittedVal = o.claimSubmittedAt ? formatDisplayDate(o.claimSubmittedAt) : '—';
  const approvedVal = o.claimApprovedAt ? formatDisplayDate(o.claimApprovedAt) : '—';
  const fmtClaimStatus = (st) => {
    if (!st) return '';
    const s = String(st).toUpperCase();
    if (s.includes('APPROV') || s.includes('DUYỆT') || s.includes('DUYET') || s.includes('PAID')) return 'Đã phê duyệt';
    if (s.includes('SUBMIT') || s.includes('PEND') || s.includes('WAIT')) return 'Chờ duyệt';
    if (s.includes('REJECT') || s.includes('TỪ CHỐI') || s.includes('TU_CHOI')) return 'Từ chối';
    return st;
  };
  const claimStLabel = fmtClaimStatus(o.claimStatus);'''

if old_card_vars in content:
    content = content.replace(old_card_vars, new_card_vars, 1)
    print("Updated card variables in formatBangCapNhatHtml!")
else:
    norm_old = old_card_vars.replace('\r\n', '\n')
    norm_content = content.replace('\r\n', '\n')
    if norm_old in norm_content:
        norm_content = norm_content.replace(norm_old, new_card_vars.replace('\r\n', '\n'), 1)
        content = norm_content
        print("Updated card variables in formatBangCapNhatHtml (normalized)!")
    else:
        print("ERROR: old_card_vars not found!")

# 4. In formatBangCapNhatHtml, update the ĐXBH label cell to match ServiceOS: "ĐXBH · Đã phê duyệt"
old_dxbh_cell = '''          <div class="sos-cell">
            <span class="k">ĐXBH</span>
            <span class="v ${claimCodeVal === '—' ? 'v-empty' : 'v-mono-claim'}">${esc(claimCodeVal)}</span>
          </div>'''

new_dxbh_cell = '''          <div class="sos-cell">
            <span class="k">ĐXBH ${claimStLabel ? `<span style="color:#10b981;font-weight:700">· ${esc(claimStLabel)}</span>` : ''}</span>
            <span class="v ${claimCodeVal === '—' ? 'v-empty' : 'v-mono-claim'}" style="color:#10b981;font-weight:700">${esc(claimCodeVal)}</span>
          </div>'''

content = content.replace(old_dxbh_cell, new_dxbh_cell)
print("Updated ĐXBH label cell across all card templates!")

with io.open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: _build/app_template2.html updated for Lệnh BH and ĐXBH!")
