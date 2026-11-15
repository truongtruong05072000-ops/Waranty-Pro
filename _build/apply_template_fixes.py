# -*- coding: utf-8 -*-
import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    template = f.read()

# 1. Update hasBangCapNhat in normalizeOrder
old_bangcapnhat = '''// Điều kiện xác định xe ĐÃ CÓ BẢNG CẬP NHẬT LINH KIỆN (ô khoanh đỏ trong ServiceOS):
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

new_bangcapnhat = '''// Điều kiện xác định xe ĐÃ CÓ BẢNG CẬP NHẬT LINH KIỆN (chuẩn xác toàn diện ServiceOS):
  // 1. Có gắn loại bảo hành (PIN, Động cơ, Giảm xóc trước/sau, TopCover, Esim, Sạc, MCU...)
  const hasWarrantyKinds = Array.isArray(d.warranty_kinds) && d.warranty_kinds.filter(Boolean).length > 0;

  // 2. Có dữ liệu trong warranty_extra của bất kỳ linh kiện nào (serial, diễn giải, ghi chú, mã bảo hành, hình thức...)
  const hasWarrantyExtra = Boolean(extra && typeof extra === 'object' && Object.keys(extra).some(k => {
    const obj = extra[k];
    if (!obj || typeof obj !== 'object') return false;
    return Boolean(
      obj.serial_old || obj.serial_new || obj.dien_giai || 
      obj.warranty_code || obj.claim_code || obj.status || 
      obj.note || obj.repair_type || obj.coc_status || 
      obj.fault_at || obj.removed_at || obj.claim_amount
    );
  }));

  // 3. Có số Serial / Số máy linh kiện cũ hoặc mới
  const hasPartSerial = Boolean(
    motorSerial || motorSerialNew || pinSerial || pinSerialNew || 
    d.battery_serial_old || d.battery_serial_new || 
    d.motor_serial_old || d.motor_serial_new
  );

  // 4. Có ngày tháo linh kiện / ngày gửi nhà máy
  const hasRemovedDate = Boolean(
    motorRemovedAt || partsRemovedAt || sentFactoryAt || removedAt || 
    d.motor_removed_at || d.parts_removed_at || d.sent_factory_at
  );

  // 5. Có Lệnh bảo hành hoặc Mã đề xuất bảo hành (WC-...)
  const hasWarrantyDoc = Boolean(
    (bhCode && bhCode !== '—' && bhCode !== '-') || 
    (claimCode && claimCode !== '—' && claimCode !== '-') ||
    d.dms_warranty_code || d.dms_claim_code || d.dms_ro_code
  );

  // 6. Có trạng thái bảo hành linh kiện, hình thức sửa chữa hoặc trạng thái xuất kho
  const hasPartStatus = Boolean(
    (warrantyStatus && warrantyStatus !== 'none' && warrantyStatus !== 'Trong xưởng' && warrantyStatus !== '—') || 
    (bhOrderStatus && bhOrderStatus !== 'none' && bhOrderStatus !== '—') ||
    d.battery_repair_type || d.motor_repair_type || d.coc_status ||
    (d.parts_status && d.parts_status !== 'pending')
  );

  // 7. Nhận diện từ file Excel / dữ liệu dán có nội dung cột Bảng cập nhật
  const rawBangCapNhatText = String(d.hasBangCapNhatText || d.bang_cap_nhat || d['Bảng cập nhật phía dưới'] || '').trim();
  const hasTableText = Boolean(rawBangCapNhatText && rawBangCapNhatText !== '—' && rawBangCapNhatText !== '-' && !rawBangCapNhatText.toLowerCase().includes('chưa có bảng'));

  // Xe ĐÃ CÓ BẢNG CẬP NHẬT nếu thỏa mãn bất kỳ dấu hiệu bảo hành nào ở trên
  const hasBangCapNhat = Boolean(
    hasWarrantyKinds ||
    hasWarrantyExtra ||
    hasPartSerial ||
    hasRemovedDate ||
    hasWarrantyDoc ||
    hasPartStatus ||
    hasTableText
  );'''

assert old_bangcapnhat in template, 'old_bangcapnhat not found'
template = template.replace(old_bangcapnhat, new_bangcapnhat)
print('1. Updated normalizeOrder with comprehensive hasBangCapNhat check')

# 2. Update upsertServiceOsOrders to accurately handle active workshop cars without accumulating stale/delivered cars
old_upsert = '''  newRawOrders.forEach(raw => {
    if (!raw) return;
    const rawId = raw.id ? 'id:' + raw.id : null;
    const rawCode = raw.code ? 'code:' + String(raw.code).trim().toUpperCase() : null;
    const rawVin = raw.vin ? 'vin:' + String(raw.vin).trim().toUpperCase() : null;

    let existingIdx = -1;
    if (rawId && orderMap.has(rawId)) existingIdx = orderMap.get(rawId);
    else if (rawCode && orderMap.has(rawCode)) existingIdx = orderMap.get(rawCode);
    else if (rawVin && orderMap.has(rawVin)) existingIdx = orderMap.get(rawVin);

    const norm = normalizeOrder(raw);

    if (existingIdx !== -1) {
      // CẬP NHẬT ĐÈ LÊN XE ĐÃ CÓ: Giữ nguyên ghi chú người dùng đã sửa nếu có
      const existing = state.checkXe.orders[existingIdx];
      const userNote = existing.userNote || existing._userEditedNote;
      Object.assign(existing, norm);
      if (userNote) existing.note = userNote;
      updatedCount++;
    } else {
      // XE MỚI: Thêm vào danh sách (đưa lên đầu)
      newItems.push(norm);
      addedCount++;
    }
  });

  if (newItems.length > 0) {
    state.checkXe.orders = [...newItems, ...state.checkXe.orders];
  }'''

new_upsert = '''  const activeIncomingKeys = new Set();

  newRawOrders.forEach(raw => {
    if (!raw) return;
    // Bỏ qua các xe đã giao hoặc hủy
    const st = String(raw.status || '').toLowerCase();
    if (st === 'delivered' || st === 'cancelled' || st === 'đã giao' || st === 'hủy') return;

    const rawId = raw.id ? 'id:' + raw.id : null;
    const rawCode = raw.code ? 'code:' + String(raw.code).trim().toUpperCase() : null;
    const rawVin = raw.vin ? 'vin:' + String(raw.vin).trim().toUpperCase() : null;

    if (rawId) activeIncomingKeys.add(rawId);
    if (rawCode) activeIncomingKeys.add(rawCode);
    if (rawVin) activeIncomingKeys.add(rawVin);

    let existingIdx = -1;
    if (rawId && orderMap.has(rawId)) existingIdx = orderMap.get(rawId);
    else if (rawCode && orderMap.has(rawCode)) existingIdx = orderMap.get(rawCode);
    else if (rawVin && orderMap.has(rawVin)) existingIdx = orderMap.get(rawVin);

    const norm = normalizeOrder(raw);

    if (existingIdx !== -1) {
      // CẬP NHẬT ĐÈ LÊN XE ĐÃ CÓ: Giữ nguyên ghi chú người dùng đã sửa nếu có
      const existing = state.checkXe.orders[existingIdx];
      const userNote = existing.userNote || existing._userEditedNote;
      Object.assign(existing, norm);
      if (userNote) existing.note = userNote;
      existing._inActiveBatch = true;
      updatedCount++;
    } else {
      // XE MỚI: Thêm vào danh sách
      norm._inActiveBatch = true;
      newItems.push(norm);
      addedCount++;
    }
  });

  // Nếu đây là đợt sync quy mô toàn xưởng (>= 50 xe):
  // Chỉ giữ đúng các xe đang thực sự có mặt trong xưởng theo đợt sync này
  if (newRawOrders.length >= 50) {
    const updatedExisting = state.checkXe.orders.filter(o => {
      const oId = o.id ? 'id:' + o.id : null;
      const oCode = o.code ? 'code:' + String(o.code).trim().toUpperCase() : null;
      const oVin = o.vin ? 'vin:' + String(o.vin).trim().toUpperCase() : null;
      return (oId && activeIncomingKeys.has(oId)) || 
             (oCode && activeIncomingKeys.has(oCode)) || 
             (oVin && activeIncomingKeys.has(oVin)) ||
             o._inActiveBatch;
    });
    state.checkXe.orders = [...newItems, ...updatedExisting];
  } else if (newItems.length > 0) {
    state.checkXe.orders = [...newItems, ...state.checkXe.orders];
  }'''

assert old_upsert in template, 'old_upsert not found'
template = template.replace(old_upsert, new_upsert)
print('2. Updated upsertServiceOsOrders to match exact in-shop active count')

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(template)
print('Saved _build/app_template2.html successfully!')
