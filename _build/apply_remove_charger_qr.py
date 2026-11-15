# -*- coding: utf-8 -*-
import io, sys
sys.stdout.reconfigure(encoding='utf-8')

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update normalizeOrder to remove chargerSerial from partSerial and hasBangCapNhat
old_norm_serials = '''  // 3. BẢNG CẬP NHẬT PHÍA DƯỚI (Lấy đúng ô khoanh đỏ từ ServiceOS)
  let pinSerial = String(d.pinSerial || d.battery_serial_old || d.battery_serial || '').trim();
  const pinSerialNew = String(d.pinSerialNew || d.battery_serial_new || '').trim();
  let motorSerial = String(d.motorSerial || d.motor_serial_old || d.motor_serial || '').trim();
  const motorSerialNew = String(d.motorSerialNew || d.motor_serial_new || '').trim();
  const chargerSerial = String(d.chargerSerial || d.charger_serial || '').trim();
  
  const removedAt = String(d.removedAt || d.parts_removed_at || '').trim();
  const partsRemovedAt = String(d.parts_removed_at || '').trim();
  const motorRemovedAt = String(d.motor_removed_at || d.motorRemovedAt || '').trim();'''

new_norm_serials = '''  // 3. BẢNG CẬP NHẬT PHÍA DƯỚI (CHỈ LẤY ĐÚNG Ô KHOANH ĐỎ TỪ SERVICEOS)
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
  const motorRemovedAt = String(d.motor_removed_at || d.motorRemovedAt || '').trim();'''

if old_norm_serials in content:
    content = content.replace(old_norm_serials, new_norm_serials, 1)
    print("Fixed normalizeOrder serial extraction (removed charger QR)!")
else:
    norm_old = old_norm_serials.replace('\r\n', '\n')
    norm_content = content.replace('\r\n', '\n')
    if norm_old in norm_content:
        norm_content = norm_content.replace(norm_old, new_norm_serials.replace('\r\n', '\n'), 1)
        content = norm_content
        print("Fixed normalizeOrder serial extraction (normalized)!")
    else:
        print("ERROR: old_norm_serials not found!")

# 2. Update hasBangCapNhat in normalizeOrder
old_has_bang = '''  // Điều kiện xác định xe ĐÃ CÓ BẢNG CẬP NHẬT LINH KIỆN (ô khoanh đỏ trong ServiceOS):
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

new_has_bang = '''  // Điều kiện xác định xe ĐÃ CÓ BẢNG CẬP NHẬT LINH KIỆN (ô khoanh đỏ trong ServiceOS):
  // CHỈ CÓ BẢNG CẬP NHẬT KHI THỰC SỰ CÓ DỮ LIỆU BẢO HÀNH LINH KIỆN:
  // 1. Có Số máy ĐC hoặc Serial PIN (Không tính sạc)
  // 2. Có Ngày tháo ĐC hoặc Ngày tháo PIN
  // 3. Có Lệnh bảo hành (dms_warranty_code) hoặc Mã đề xuất duyệt (WC-...)
  // 4. Có Trạng thái bảo hành linh kiện cụ thể (waiting_motor, waiting_battery)
  // 5. Có warranty_extra của motor, pin, esim thực tế
  const hasPartSerial = Boolean(motorSerial || pinSerial);
  const hasRemovedDate = Boolean(motorRemovedAt || partsRemovedAt);
  const hasWarrantyDoc = Boolean(bhCode || (claimCode && claimCode !== '—' && claimCode !== '-'));
  const hasSpecificPartStatus = Boolean(
    warrantyStatus === 'waiting_motor' || 
    warrantyStatus === 'waiting_battery' || 
    bhOrderStatus === 'waiting_motor' || 
    bhOrderStatus === 'waiting_battery' ||
    ((extra.motor && (extra.motor.serial_old || extra.motor.warranty_code)) ||
     (extra.pin && (extra.pin.serial_old || extra.pin.warranty_code)) ||
     (extra.esim && (extra.esim.warranty_code || extra.esim.claim_code)))
  );

  // Xe CHỈ có bảng cập nhật khi có ít nhất một thông tin bảo hành thực tế
  const hasBangCapNhat = Boolean(
    hasPartSerial || 
    hasRemovedDate || 
    hasWarrantyDoc || 
    hasSpecificPartStatus
  );'''

if old_has_bang in content:
    content = content.replace(old_has_bang, new_has_bang, 1)
    print("Fixed hasBangCapNhat calculation!")
else:
    norm_old = old_has_bang.replace('\r\n', '\n')
    norm_content = content.replace('\r\n', '\n')
    if norm_old in norm_content:
        norm_content = norm_content.replace(norm_old, new_has_bang.replace('\r\n', '\n'), 1)
        content = norm_content
        print("Fixed hasBangCapNhat calculation (normalized)!")
    else:
        print("ERROR: old_has_bang not found!")

# 3. Update order object returned in normalizeOrder
old_order_fields = '''    partStatusText: hasBangCapNhat ? formatPartStatusText(bhOrderStatus || warrantyStatus, (kinds && kinds[0]) || '') : '—',
    partSerialText: (motorSerial || pinSerial || chargerSerial) || '—',
    partRemovedDateText: motorRemovedAt ? formatDisplayDate(motorRemovedAt) : (partsRemovedAt ? formatDisplayDate(partsRemovedAt) : (removedAt ? formatDisplayDate(removedAt) : '—')),
    bhCodeText: bhCode || '—',
    claimCodeText: claimCode || '—'
  };'''

new_order_fields = '''    // Nếu KHÔNG CÓ BẢNG CẬP NHẬT thì không điền gì vào đó hết (để trống '—')
    partStatusText: hasBangCapNhat ? formatPartStatusText(bhOrderStatus || warrantyStatus, (kinds && kinds[0]) || '') : '—',
    partSerialText: hasBangCapNhat ? ((motorSerial || pinSerial) || '—') : '—',
    partRemovedDateText: hasBangCapNhat ? (motorRemovedAt ? formatDisplayDate(motorRemovedAt) : (partsRemovedAt ? formatDisplayDate(partsRemovedAt) : '—')) : '—',
    bhCodeText: hasBangCapNhat ? (bhCode || '—') : '—',
    claimCodeText: hasBangCapNhat ? (claimCode || '—') : '—'
  };'''

if old_order_fields in content:
    content = content.replace(old_order_fields, new_order_fields, 1)
    print("Fixed order object fields: empty '—' when hasBangCapNhat is false!")
else:
    norm_old = old_order_fields.replace('\r\n', '\n')
    norm_content = content.replace('\r\n', '\n')
    if norm_old in norm_content:
        norm_content = norm_content.replace(norm_old, new_order_fields.replace('\r\n', '\n'), 1)
        content = norm_content
        print("Fixed order object fields (normalized)!")
    else:
        print("ERROR: old_order_fields not found!")

# 4. In formatBangCapNhatHtml:
# Remove charger card and make sure oldSerialVal ONLY uses pinSerial or motorSerial (never chargerSerial)
old_esim_serial = "const oldSerialVal = o.pinSerial || o.motorSerial || o.chargerSerial || '—';"
new_esim_serial = "const oldSerialVal = (o.pinSerial || o.motorSerial) && !String(o.pinSerial || o.motorSerial).includes('QR ngoài') ? (o.pinSerial || o.motorSerial) : '—';"

if old_esim_serial in content:
    content = content.replace(old_esim_serial, new_esim_serial)
    print("Fixed oldSerialVal in formatBangCapNhatHtml!")

with io.open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: _build/app_template2.html updated cleanly!")
