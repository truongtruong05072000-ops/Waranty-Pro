# -*- coding: utf-8 -*-
import sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace formatBangCapNhatHtml and normalizeOrder
s1 = text.find('function formatBangCapNhatHtml(')
s2 = text.find('function loadCheckXeOrders(){')
assert s1 != -1 and s2 != -1, f'indices not found: {s1}, {s2}'

new_functions = r'''function formatBangCapNhatHtml(o){
  // NẾU KHÔNG CÓ THÌ KHÔNG HIỂN THỊ (THEO ĐÚNG YÊU CẦU NGƯỜI DÙNG)
  if (!o.hasBangCapNhat) {
    return '<span style="color:var(--text-muted);opacity:0.35">—</span>';
  }

  const fmtStatus = (st) => {
    if (!st || String(st).startsWith('WC-') || String(st).startsWith('N54511-')) return '• Chờ kiểm tra';
    const s = String(st).toLowerCase().replace(/\s+/g, '_');
    if (s.includes('cho_lap_dong_co') || s.includes('cho_lap_dc') || s.includes('cho_lap')) return '• Chờ lắp động cơ';
    if (s.includes('waiting_battery') || s.includes('cho_pin')) return '• Chờ PIN';
    if (s.includes('waiting_motor') || s.includes('cho_dong_co')) return '• Chờ Động cơ';
    if (s.includes('rejected') || s.includes('tu_choi')) return '• Từ chối';
    if (s.includes('completed') || s.includes('done') || s.includes('hoan_thanh')) return '• Hoàn thành';
    if (s.includes('approved') || s.includes('paid') || s.includes('da_duyet') || s.includes('phe_duyet')) return '• Đã phê duyệt';
    if (s.includes('cap_2') || s.includes('l2')) return '• Chờ cấp 2';
    if (s.includes('cap_1') || s.includes('l1')) return '• Chờ cấp 1';
    if (s.includes('waiting_approval') || s.includes('cho_duyet')) return '• Chờ duyệt';
    if (s === 'checking' || s.includes('cho_kiem_tra')) return '• Chờ kiểm tra';
    return '• ' + st;
  };

  const fList = o.faultList || [];
  const fLower = fList.join(' ').toLowerCase();
  const catId = o.category ? o.category.id : '';

  // 1. Phân loại loại thẻ: 'motor', 'pin', 'esim', 'other'
  let kind = 'other';
  if (catId === 'motor' || fLower.includes('động cơ') || fLower.includes('dong co') || fLower.includes('motor') || o.motorSerial || (o.kinds && o.kinds.includes('motor'))) {
    kind = 'motor';
  } else if (catId === 'pin' || fLower.includes('pin') || o.pinSerial || (o.kinds && o.kinds.includes('pin'))) {
    kind = 'pin';
  } else if (catId === 'esim' || fLower.includes('esim') || (o.kinds && o.kinds.includes('esim'))) {
    kind = 'esim';
  } else if (catId === 'charger' || fLower.includes('sạc') || o.chargerSerial) {
    kind = 'charger';
  }

  const statusText = fmtStatus(o.bhOrderStatus || o.warrantyStatus);
  const dateVal = o.dateStr || '—';
  const bhCodeVal = o.bhCode || '—';
  const claimCodeVal = o.claimCode || '—';
  const dienGiaiVal = o.issueDesc || '—';
  const noteVal = o.note || '—';
  const amountVal = o.claimAmount ? numf(o.claimAmount) + ' đ' : '—';
  const submittedVal = o.claimSubmittedAt ? formatDisplayDate(o.claimSubmittedAt) : '—';
  const approvedVal = o.claimApprovedAt ? formatDisplayDate(o.claimApprovedAt) : '—';

  // ========== THẺ ĐỘNG CƠ (Y HỆT HÌNH ẢNH SERVICEOS THỰC TẾ) ==========
  if (kind === 'motor') {
    const motorSerialVal = o.motorSerial || '—';
    const motorNewSerialVal = o.motorSerialNew || '—';
    const removedDateVal = o.motorRemovedAt ? formatDisplayDate(o.motorRemovedAt) : (o.removedAt ? formatDisplayDate(o.removedAt) : dateVal);
    const motorTypeVal = o.motorType || '—';
    const cocVal = o.cocStatus || '—';

    return `
      <div class="sos-warranty-card card-theme-motor">
        <div class="sos-card-head head-motor">
          <div class="sos-card-title title-motor">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span>Động cơ</span>
          </div>
          <div class="sos-card-action action-motor">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
            <span>Cập nhật</span>
          </div>
        </div>
        <div class="sos-card-grid">
          <div class="sos-cell">
            <span class="k">Trạng thái</span>
            <span class="v v-status-motor">${esc(statusText)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày phát sinh</span>
            <span class="v">${esc(dateVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày tháo ĐC</span>
            <span class="v ${removedDateVal === '—' ? 'v-empty' : ''}">${esc(removedDateVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">Số máy</span>
            <span class="v ${motorSerialVal === '—' ? 'v-empty' : 'v-mono-motor'}">${esc(motorSerialVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Số máy mới</span>
            <span class="v ${motorNewSerialVal === '—' ? 'v-empty' : ''}">${esc(motorNewSerialVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Loại SC ĐC</span>
            <span class="v ${motorTypeVal === '—' ? 'v-empty' : ''}">${esc(motorTypeVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">COC</span>
            <span class="v ${cocVal === '—' ? 'v-empty' : ''}">${esc(cocVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Diễn giải</span>
            <span class="v ${dienGiaiVal === '—' ? 'v-empty' : ''}">${esc(dienGiaiVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Lệnh BH</span>
            <span class="v ${bhCodeVal === '—' ? 'v-empty' : 'v-mono-motor'}">${esc(bhCodeVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">ĐXBH</span>
            <span class="v ${claimCodeVal === '—' ? 'v-empty' : 'v-mono-claim'}">${esc(claimCodeVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Số tiền</span>
            <span class="v ${amountVal === '—' ? 'v-empty' : 'v-money'}">${esc(amountVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày đề xuất</span>
            <span class="v ${submittedVal === '—' ? 'v-empty' : ''}">${esc(submittedVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">Ngày duyệt</span>
            <span class="v ${approvedVal === '—' ? 'v-empty' : ''}">${esc(approvedVal)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ========== THẺ PIN (Y HỆT HÌNH ẢNH SERVICEOS THỰC TẾ) ==========
  if (kind === 'pin') {
    const pinSerialVal = o.pinSerial || '—';
    const pinNewSerialVal = o.pinSerialNew || '—';
    const removedDateVal = o.partsRemovedAt ? formatDisplayDate(o.partsRemovedAt) : (o.removedAt ? formatDisplayDate(o.removedAt) : dateVal);
    const pinTypeVal = o.pinType || '—';
    const sentFactoryVal = o.sentFactoryAt ? formatDisplayDate(o.sentFactoryAt) : '—';

    return `
      <div class="sos-warranty-card card-theme-pin">
        <div class="sos-card-head head-pin">
          <div class="sos-card-title title-pin">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="6" width="18" height="12" rx="2"></rect>
              <line x1="23" y1="11" x2="23" y2="13"></line>
            </svg>
            <span>PIN</span>
          </div>
          <div class="sos-card-action action-pin">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
            <span>Cập nhật</span>
          </div>
        </div>
        <div class="sos-card-grid">
          <div class="sos-cell">
            <span class="k">Trạng thái</span>
            <span class="v v-status-pin">${esc(statusText)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày phát sinh</span>
            <span class="v">${esc(dateVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày tháo PIN</span>
            <span class="v ${removedDateVal === '—' ? 'v-empty' : ''}">${esc(removedDateVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">Serial PIN</span>
            <span class="v ${pinSerialVal === '—' ? 'v-empty' : 'v-mono-pin'}">${esc(pinSerialVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Serial PIN mới</span>
            <span class="v ${pinNewSerialVal === '—' ? 'v-empty' : ''}">${esc(pinNewSerialVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Loại SC PIN</span>
            <span class="v ${pinTypeVal === '—' ? 'v-empty' : ''}">${esc(pinTypeVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">Ngày gửi NM</span>
            <span class="v ${sentFactoryVal === '—' ? 'v-empty' : ''}">${esc(sentFactoryVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Diễn giải</span>
            <span class="v ${dienGiaiVal === '—' ? 'v-empty' : ''}">${esc(dienGiaiVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Lệnh BH</span>
            <span class="v ${bhCodeVal === '—' ? 'v-empty' : 'v-mono-pin'}">${esc(bhCodeVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">ĐXBH</span>
            <span class="v ${claimCodeVal === '—' ? 'v-empty' : 'v-mono-claim'}">${esc(claimCodeVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Số tiền</span>
            <span class="v ${amountVal === '—' ? 'v-empty' : 'v-money'}">${esc(amountVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày đề xuất</span>
            <span class="v ${submittedVal === '—' ? 'v-empty' : ''}">${esc(submittedVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">Ngày duyệt</span>
            <span class="v ${approvedVal === '—' ? 'v-empty' : ''}">${esc(approvedVal)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ========== THẺ ESIM / KHÁC (Y HỆT HÌNH ẢNH SERVICEOS THỰC TẾ) ==========
  const cardTitle = kind === 'esim' ? 'Esim' : kind === 'charger' ? 'Bộ sạc' : (fList[0] ? fList[0].replace(/^Lỗi\s+/i, '') : 'Bảo hành');
  const oldSerialVal = o.pinSerial || o.motorSerial || o.chargerSerial || '—';
  const procDateVal = o.removedAt ? formatDisplayDate(o.removedAt) : '—';

  return `
    <div class="sos-warranty-card card-theme-esim">
      <div class="sos-card-head head-esim">
        <div class="sos-card-title title-esim">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 12l10 10 10-10L12 2z"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          <span>${esc(cardTitle)}</span>
        </div>
        <div class="sos-card-action action-esim">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
          <span>Cập nhật</span>
        </div>
      </div>
      <div class="sos-card-grid">
        <div class="sos-cell">
          <span class="k">Trạng thái</span>
          <span class="v v-status-esim">${esc(statusText)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Ngày phát sinh</span>
          <span class="v">${esc(dateVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Ngày xử lý</span>
          <span class="v ${procDateVal === '—' ? 'v-empty' : ''}">${esc(procDateVal)}</span>
        </div>

        <div class="sos-cell">
          <span class="k">Serial cũ</span>
          <span class="v ${oldSerialVal === '—' ? 'v-empty' : ''}">${esc(oldSerialVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Serial mới</span>
          <span class="v v-empty">—</span>
        </div>
        <div class="sos-cell">
          <span class="k">Diễn giải</span>
          <span class="v ${dienGiaiVal === '—' ? 'v-empty' : ''}">${esc(dienGiaiVal)}</span>
        </div>

        <div class="sos-cell">
          <span class="k">Ghi chú</span>
          <span class="v ${noteVal === '—' ? 'v-empty' : ''}">${esc(noteVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Lệnh BH</span>
          <span class="v ${bhCodeVal === '—' ? 'v-empty' : 'v-mono-esim'}">${esc(bhCodeVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">ĐXBH</span>
          <span class="v ${claimCodeVal === '—' ? 'v-empty' : 'v-mono-claim'}">${esc(claimCodeVal)}</span>
        </div>

        <div class="sos-cell">
          <span class="k">Số tiền</span>
          <span class="v ${amountVal === '—' ? 'v-empty' : 'v-money'}">${esc(amountVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Ngày đề xuất</span>
          <span class="v ${submittedVal === '—' ? 'v-empty' : ''}">${esc(submittedVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Ngày duyệt</span>
          <span class="v ${approvedVal === '—' ? 'v-empty' : ''}">${esc(approvedVal)}</span>
        </div>
      </div>
    </div>
  `;
}

// Chuẩn hóa một bản ghi xe theo đúng chuẩn ServiceOS
function normalizeOrder(d, i){
  let wo = String(d.wo || d.code || d.dms_ro_code || d.work_order_code || '—').trim();
  let plate = String(d.plate || d.license_plate || d.licensePlate || d.bien_so || d.bienSo || '—').trim();
  let vin = String(d.vin || d.chassis_number || d.so_khung || '—').trim();
  let vehicle = String(d.vehicle || d.model || d.dong_xe || '—').trim();
  const customer = String(d.customer || d.customer_name || '—').trim();
  const tech = String(d.tech || d.technician_name || 'Chưa phân công').trim();
  let status = String(d.status || d.status_label || 'Trong xưởng').trim();
  let warrantyStatus = String(d.warrantyStatus || d.warranty_status || d.dms_warranty_status || '').trim();

  // Khôi phục Biển số nếu bị gán nhầm hoặc trống
  const plateRegex = /[0-9]{2}[A-Z][0-9A-Z]?[-.\s]?[0-9]{4,5}/i;
  if (plate === '—' || !plate) {
    const searchStr = `${wo} ${vin} ${customer} ${JSON.stringify(d)}`;
    const m = searchStr.match(plateRegex);
    if (m) plate = m[0].toUpperCase().replace(/\s+/g, '-');
  }

  // Tách Lệnh BH (WO-) và Mã ĐXBH (WC-) nếu bị tráo vào wo hoặc status
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
  }

  // 1. HẠNG MỤC LỖI (CHỈ LẤY TRONG HẠNG MỤC LỖI w.faults CỦA SERVICEOS)
  const faultList = Array.isArray(d.faults) 
    ? d.faults.filter(Boolean) 
    : (typeof d.faults === 'string' && d.faults.trim() ? [d.faults.trim()] : []);
  
  const hasLoi = faultList.length > 0;
  const category = matchCategoryFromFaults(faultList);

  // Nội dung kiểm tra (chẩn đoán)
  const rawDiag = String(d.diagnosis || d.symptoms || d.content || d.diag || '').trim();
  const cleanDiag = rawDiag.startsWith('Biển số:') ? '' : rawDiag;
  const issueDesc = cleanDiag;
  const issue = hasLoi ? faultList.join(', ') : 'Không lỗi';

  // 2. GHI CHÚ KTV
  const note = String(d.note || d.foreman_note || d.advisor_note || '').trim();
  const hasKtvNote = hasTextContent(note);

  // 3. BẢNG CẬP NHẬT PHÍA DƯỚI (Lấy đúng ô khoanh đỏ từ ServiceOS)
  let pinSerial = String(d.pinSerial || d.battery_serial_old || d.battery_serial || '').trim();
  const pinSerialNew = String(d.pinSerialNew || d.battery_serial_new || '').trim();
  let motorSerial = String(d.motorSerial || d.motor_serial_old || d.motor_serial || '').trim();
  const motorSerialNew = String(d.motorSerialNew || d.motor_serial_new || '').trim();
  const chargerSerial = String(d.chargerSerial || d.charger_serial || '').trim();
  
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
  }

  // Điều kiện xác định xe ĐÃ CÓ BẢNG CẬP NHẬT:
  const hasBangCapNhat = Boolean(
    bhCode || 
    claimCode || 
    pinSerial || 
    motorSerial || 
    chargerSerial || 
    removedAt || 
    motorRemovedAt ||
    kinds.length > 0 || 
    Object.keys(extra).length > 0 ||
    (warrantyStatus && warrantyStatus.toLowerCase() !== 'none' && warrantyStatus.toLowerCase() !== '')
  );

  // Tính trạng thái Check theo 4 quy tắc
  const checkStatus = evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat);

  // Chuẩn hóa ngày nhận xe
  const rawDate = d.dateStr || d.received_at || d.created_at || new Date().toISOString().slice(0, 10);
  const isoDate = formatIsoDate(rawDate) || new Date().toISOString().slice(0, 10);
  const dispDate = formatDisplayDate(isoDate);

  const order = {
    id: (d && d.id) || ('ord_' + (wo || plate || i).replace(/[^a-zA-Z0-9]/g, '') + '_' + i),
    wo: wo,
    plate: plate,
    vin: vin,
    vehicle: vehicle,
    customer: customer,
    tech: tech,
    issue: issue,
    issueDesc: issueDesc,
    faultList: faultList,
    faultStr: faultList.join(', '),
    note: note,
    status: status,
    warrantyStatus: warrantyStatus,
    pinSerial: pinSerial,
    pinSerialNew: pinSerialNew,
    motorSerial: motorSerial,
    motorSerialNew: motorSerialNew,
    chargerSerial: chargerSerial,
    removedAt: removedAt,
    partsRemovedAt: partsRemovedAt,
    motorRemovedAt: motorRemovedAt,
    pinType: pinType,
    motorType: motorType,
    cocStatus: cocStatus,
    sentFactoryAt: sentFactoryAt,
    bhCode: bhCode,
    claimCode: claimCode,
    bhOrderStatus: bhOrderStatus,
    kinds: kinds,
    extra: extra,
    hasLoi: hasLoi,
    hasKtvNote: hasKtvNote,
    hasBangCapNhat: hasBangCapNhat,
    checkStatus: checkStatus,
    category: category,
    dateStr: dispDate,
    isoDate: isoDate,
    isChecked: checkStatus.code === 'checked'
  };

  return order;
}

'''

text = text[:s1] + new_functions + text[s2:]

# Update CSS for themes: motor (violet), pin (emerald), esim (amber)
css_card_themes = '''
      /* Motor Theme (Violet) matching ServiceOS Image 1 */
      .card-theme-motor {
        background: rgba(245, 243, 255, 0.98);
        border: 1px solid #c4b5fd;
      }
      [data-theme="dark"] .card-theme-motor {
        background: rgba(29, 21, 48, 0.85);
        border: 1px solid rgba(167, 139, 250, 0.4);
      }
      .head-motor {
        border-bottom: 1px dashed rgba(167, 139, 250, 0.35);
      }
      .title-motor {
        color: #7c3aed;
      }
      [data-theme="dark"] .title-motor {
        color: #c084fc;
      }
      .action-motor {
        color: #7c3aed;
        background: rgba(237, 233, 254, 0.7);
        border: 1px solid #ddd6fe;
      }
      [data-theme="dark"] .action-motor {
        background: rgba(124, 58, 237, 0.2);
        border-color: rgba(167, 139, 250, 0.4);
        color: #e9d5ff;
      }
      .v-status-motor {
        font-weight: 700;
        color: #d97706;
      }
      [data-theme="dark"] .v-status-motor {
        color: #fde047;
      }
      .v-mono-motor {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 700;
        font-size: 11px;
        color: #6d28d9;
      }
      [data-theme="dark"] .v-mono-motor {
        color: #c084fc;
      }

      /* PIN Theme (Emerald) */
      .card-theme-pin {
        background: rgba(236, 253, 245, 0.98);
        border: 1px solid #a7f3d0;
      }
      [data-theme="dark"] .card-theme-pin {
        background: rgba(16, 36, 28, 0.85);
        border: 1px solid rgba(52, 211, 153, 0.4);
      }
      .head-pin {
        border-bottom: 1px dashed rgba(52, 211, 153, 0.35);
      }
      .title-pin {
        color: #059669;
      }
      [data-theme="dark"] .title-pin {
        color: #34d399;
      }
      .action-pin {
        color: #059669;
        background: rgba(209, 250, 229, 0.7);
        border: 1px solid #a7f3d0;
      }
      [data-theme="dark"] .action-pin {
        background: rgba(5, 150, 105, 0.2);
        border-color: rgba(52, 211, 153, 0.4);
        color: #a7f3d0;
      }
      .v-status-pin {
        font-weight: 700;
        color: #059669;
      }
      [data-theme="dark"] .v-status-pin {
        color: #34d399;
      }
      .v-mono-pin {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 700;
        font-size: 11px;
        color: #047857;
      }
      [data-theme="dark"] .v-mono-pin {
        color: #34d399;
      }

      /* Esim Theme (Amber) */
      .card-theme-esim {
        background: rgba(254, 252, 247, 0.98);
        border: 1px solid #fed7aa;
      }
      [data-theme="dark"] .card-theme-esim {
        background: rgba(28, 25, 23, 0.85);
        border: 1px solid rgba(245, 158, 11, 0.35);
      }
      .head-esim {
        border-bottom: 1px dashed rgba(245, 158, 11, 0.25);
      }
      .title-esim {
        color: #d97706;
      }
      [data-theme="dark"] .title-esim {
        color: #fbbf24;
      }
      .action-esim {
        color: #d97706;
        background: rgba(254, 243, 199, 0.6);
        border: 1px solid #fde68a;
      }
      [data-theme="dark"] .action-esim {
        background: rgba(245, 158, 11, 0.15);
        border-color: rgba(245, 158, 11, 0.35);
        color: #fde047;
      }
      .v-status-esim {
        font-weight: 700;
        color: #d97706;
      }
      [data-theme="dark"] .v-status-esim {
        color: #fbbf24;
      }
      .v-mono-esim {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 700;
        font-size: 11px;
        color: #b45309;
      }
      [data-theme="dark"] .v-mono-esim {
        color: #fde047;
      }
'''

last_style = text.rfind('</style>')
if last_style != -1:
    text = text[:last_style] + css_card_themes + text[last_style:]

with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_build/PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated PhanTichBaoHanh.html with exact Motor, PIN, Esim cards and Plate recovery!')
