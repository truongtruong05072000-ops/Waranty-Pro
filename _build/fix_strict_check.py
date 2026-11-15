# -*- coding: utf-8 -*-
import io, sys
sys.stdout.reconfigure(encoding='utf-8')

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix: Do NOT hijack dms_ro_code into bhCode!
# dms_ro_code is Repair Order, NOT Warranty Code!
old_hijack = '''  // Tách Lệnh BH (WO-) và Mã ĐXBH (WC-) nếu bị tráo vào wo hoặc status
  let bhCode = String(d.bhCode || d.dms_warranty_code || d.bh_order_code || '').trim();
  let claimCode = String(d.claimCode || d.dms_claim_code || '').trim();

  if (wo.includes('-WO-') && !bhCode) {
    bhCode = wo;
    wo = '—';
  }
  if (status.startsWith('WC-') || warrantyStatus.startsWith('WC-')) {
    if (!claimCode) claimCode = status.startsWith('WC-') ? status : warrantyStatus;
    status = 'Đã phê duyệt';
    warrantyStatus = 'approved';
  }
  if (status.includes('-WO-') || warrantyStatus.includes('-WO-')) {
    if (!bhCode) bhCode = status.includes('-WO-') ? status : warrantyStatus;
    status = 'Trong xưởng';
    warrantyStatus = '';
  }'''

new_hijack = '''  // Lấy chính xác Lệnh bảo hành (dms_warranty_code) và Mã đề xuất (dms_claim_code)
  // LƯU Ý QUAN TRỌNG: dms_ro_code (lệnh sửa chữa WO) KHÔNG PHẢI là Lệnh bảo hành!
  let bhCode = String(d.bhCode || d.dms_warranty_code || d.bh_order_code || '').trim();
  let claimCode = String(d.claimCode || d.dms_claim_code || '').trim();

  // Chỉ nhận claimCode nếu có tiền tố WC- (mã đề xuất bảo hành)
  if (status.startsWith('WC-') || warrantyStatus.startsWith('WC-')) {
    if (!claimCode) claimCode = status.startsWith('WC-') ? status : warrantyStatus;
    status = 'Đã phê duyệt';
    warrantyStatus = 'approved';
  }'''

if old_hijack in content:
    content = content.replace(old_hijack, new_hijack, 1)
    print("Fixed bhCode hijacking!")
else:
    print("Warning: old_hijack not matched exactly, checking normalized...")
    norm_old = old_hijack.replace('\r\n', '\n')
    norm_content = content.replace('\r\n', '\n')
    if norm_old in norm_content:
        norm_content = norm_content.replace(norm_old, new_hijack.replace('\r\n', '\n'), 1)
        content = norm_content
        print("Fixed bhCode hijacking (normalized)!")
    else:
        print("ERROR: old_hijack not found!")

# 2. Fix hasBangCapNhat strict check
# Bảng cập nhật linh kiện (ô khoanh đỏ) CHỈ CÓ KHI có ít nhất 1 dữ liệu linh kiện thực tế:
# - Số máy ĐC / Serial PIN / Serial sạc
# - Ngày tháo ĐC/PIN
# - Lệnh bảo hành thực tế (dms_warranty_code) hoặc Mã ĐXBH (dms_claim_code)
# - Trạng thái linh kiện bảo hành (waiting_motor, waiting_battery...)
old_bang_check = '''  // Điều kiện xác định xe ĐÃ CÓ BẢNG CẬP NHẬT:
  const hasComponentKind = kinds.some(k => ['motor', 'pin', 'esim', 'charger', 'topcover', 'rear_shock', 'front_shock'].includes(k));
  const hasBangCapNhat = Boolean(
    bhCode || 
    claimCode || 
    pinSerial || 
    motorSerial || 
    chargerSerial || 
    removedAt || 
    motorRemovedAt ||
    (kinds.length > 0 && hasComponentKind && (bhCode || claimCode || pinSerial || motorSerial || removedAt || motorRemovedAt || kinds.includes('motor') || kinds.includes('pin') || kinds.includes('esim')))
  );'''

new_bang_check = '''  // Điều kiện xác định xe ĐÃ CÓ BẢNG CẬP NHẬT LINH KIỆN (ô khoanh đỏ trong ServiceOS):
  // Bảng này CHỈ CÓ THỰC SỰ khi có dữ liệu linh kiện được cập nhật:
  // 1. Có Số máy động cơ hoặc Serial PIN hoặc Serial sạc
  // 2. Có Ngày tháo linh kiện
  // 3. Có Lệnh bảo hành (dms_warranty_code) hoặc Mã đề xuất bảo hành (WC-...)
  // 4. Có Trạng thái bảo hành linh kiện cụ thể (waiting_motor, waiting_battery, approved...)
  const hasPartSerial = Boolean(motorSerial || pinSerial || chargerSerial);
  const hasRemovedDate = Boolean(motorRemovedAt || partsRemovedAt || removedAt);
  const hasWarrantyDoc = Boolean(bhCode || claimCode);
  const hasSpecificPartStatus = Boolean(
    warrantyStatus === 'waiting_motor' || 
    warrantyStatus === 'waiting_battery' || 
    bhOrderStatus === 'waiting_motor' || 
    bhOrderStatus === 'waiting_battery' ||
    ((extra.motor && (extra.motor.serial_old || extra.motor.warranty_code)) ||
     (extra.pin && (extra.pin.serial_old || extra.pin.warranty_code)) ||
     (extra.esim && (extra.esim.warranty_code || extra.esim.claim_code)))
  );

  const hasBangCapNhat = Boolean(
    hasPartSerial || 
    hasRemovedDate || 
    hasWarrantyDoc || 
    hasSpecificPartStatus
  );'''

if old_bang_check in content:
    content = content.replace(old_bang_check, new_bang_check, 1)
    print("Fixed hasBangCapNhat strict check!")
else:
    norm_old = old_bang_check.replace('\r\n', '\n')
    norm_content = content.replace('\r\n', '\n')
    if norm_old in norm_content:
        norm_content = norm_content.replace(norm_old, new_bang_check.replace('\r\n', '\n'), 1)
        content = norm_content
        print("Fixed hasBangCapNhat strict check (normalized)!")
    else:
        print("ERROR: old_bang_check not found!")

# 3. Ensure order object in normalizeOrder has all column fields
old_order_obj = '''    hasLoi: hasLoi,
    hasKtvNote: hasKtvNote,
    hasBangCapNhat: hasBangCapNhat,
    checkStatus: checkStatus,
    category: category,
    dateStr: dispDate,
    isoDate: isoDate,
    isChecked: checkStatus.code === 'checked'
  };'''

new_order_obj = '''    hasLoi: hasLoi,
    hasKtvNote: hasKtvNote,
    hasBangCapNhat: hasBangCapNhat,
    checkStatus: checkStatus,
    category: category,
    dateStr: dispDate,
    isoDate: isoDate,
    isChecked: checkStatus.code === 'checked',
    // Các trường dữ liệu chi tiết cho chế độ Cột chi tiết:
    partStatusText: hasBangCapNhat ? formatPartStatusText(bhOrderStatus || warrantyStatus, (kinds && kinds[0]) || '') : '—',
    partSerialText: (motorSerial || pinSerial || chargerSerial) || '—',
    partRemovedDateText: motorRemovedAt ? formatDisplayDate(motorRemovedAt) : (partsRemovedAt ? formatDisplayDate(partsRemovedAt) : (removedAt ? formatDisplayDate(removedAt) : '—')),
    bhCodeText: bhCode || '—',
    claimCodeText: claimCode || '—'
  };'''

if old_order_obj in content:
    content = content.replace(old_order_obj, new_order_obj, 1)
    print("Added column text fields to order object!")
else:
    norm_old = old_order_obj.replace('\r\n', '\n')
    norm_content = content.replace('\r\n', '\n')
    if norm_old in norm_content:
        norm_content = norm_content.replace(norm_old, new_order_obj.replace('\r\n', '\n'), 1)
        content = norm_content
        print("Added column text fields to order object (normalized)!")
    else:
        print("ERROR: old_order_obj not found!")

with io.open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved _build/app_template2.html successfully!")
