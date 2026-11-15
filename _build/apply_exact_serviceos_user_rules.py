# -*- coding: utf-8 -*-
import sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update ISSUE_CATEGORIES to include 'no_fault'
old_issue_cats = '''const ISSUE_CATEGORIES = [
  { id: 'all', name: 'Tất cả hạng mục', icon: '📋' },
  { id: 'topcover', name: 'Lỗi nút TopCover', icon: '🔘', keywords: ['topcover', 'top cover', 'nút top', 'nut top'] },
  { id: 'motor', name: 'Lỗi động cơ', icon: '⚡', keywords: ['động cơ', 'dong co', 'motor', 'số máy', 'so may'] },
  { id: 'rear_shock', name: 'Lỗi giảm sóc sau', icon: '🛞', keywords: ['giảm sóc sau', 'giảm xóc sau', 'giam soc sau', 'giam xoc sau', 'phuộc sau', 'nhún sau'] },
  { id: 'front_shock', name: 'Lỗi giảm xóc trước', icon: '🚲', keywords: ['giảm xóc trước', 'giảm sóc trước', 'giam xoc truoc', 'giam soc truoc', 'phuộc trước', 'nhún trước'] },
  { id: 'pin', name: 'Lỗi PIN', icon: '🔋', keywords: ['pin', 'battery', 'bms', 'cell', 'lắp pin', 'tháo pin'] },
  { id: 'charger', name: 'Lỗi sạc', icon: '🔌', keywords: ['sạc', 'sac', 'charger', 'củ sạc', 'bộ sạc'] },
  { id: 'esim', name: 'Lỗi Esim', icon: '📶', keywords: ['esim', 'e-sim', 'sim', 'mất sóng', 'mat song', '4g'] },
  { id: 'hmi', name: 'Lỗi HMI', icon: '🖥️', keywords: ['hmi', 'màn hình', 'man hinh', 'đồng hồ', 'dong ho', 'display'] },
  { id: 'mcu', name: 'Lỗi MCU', icon: '🎛️', keywords: ['mcu', 'điều khiển động cơ', 'dieu khien dong co', 'motor controller'] },
  { id: 'scu', name: 'Lỗi SCU', icon: '🔑', keywords: ['scu', 'smartkey', 'smart key', 'chìa khóa', 'chia khoa', 'khóa thông minh'] },
  { id: 'dcdc', name: 'Lỗi DC - DC', icon: '⚡', keywords: ['dc - dc', 'dc-dc', 'dcdc', 'hạ áp', 'ha ap', '12v'] },
  { id: 'harness', name: 'Lỗi bộ dây điện', icon: '🧵', keywords: ['bộ dây điện', 'bo day dien', 'dây điện', 'day dien', 'dây sườn', 'giắc điện', 'chập điện', 'harness'] },
  { id: 'other', name: 'Lỗi khác', icon: '🛠️', keywords: [] }
];'''

new_issue_cats = '''const ISSUE_CATEGORIES = [
  { id: 'all', name: 'Tất cả hạng mục', icon: '📋' },
  { id: 'no_fault', name: 'Không lỗi', icon: '✅', keywords: [] },
  { id: 'esim', name: 'Lỗi Esim', icon: '📶', keywords: ['esim', 'e-sim', 'sim', 'mất sóng', 'mat song', '4g'] },
  { id: 'pin', name: 'Lỗi PIN', icon: '🔋', keywords: ['pin', 'battery', 'bms', 'cell', 'lắp pin', 'tháo pin'] },
  { id: 'motor', name: 'Lỗi động cơ', icon: '⚡', keywords: ['động cơ', 'dong co', 'motor', 'số máy', 'so may'] },
  { id: 'charger', name: 'Lỗi sạc', icon: '🔌', keywords: ['sạc', 'sac', 'charger', 'củ sạc', 'bộ sạc'] },
  { id: 'topcover', name: 'Lỗi nút TopCover', icon: '🔘', keywords: ['topcover', 'top cover', 'nút top', 'nut top'] },
  { id: 'rear_shock', name: 'Lỗi giảm sóc sau', icon: '🛞', keywords: ['giảm sóc sau', 'giảm xóc sau', 'giam soc sau', 'giam xoc sau', 'phuộc sau', 'nhún sau'] },
  { id: 'front_shock', name: 'Lỗi giảm xóc trước', icon: '🚲', keywords: ['giảm xóc trước', 'giảm sóc trước', 'giam xoc truoc', 'giam soc truoc', 'phuộc trước', 'nhún trước'] },
  { id: 'hmi', name: 'Lỗi HMI', icon: '🖥️', keywords: ['hmi', 'màn hình', 'man hinh', 'đồng hồ', 'dong ho', 'display'] },
  { id: 'mcu', name: 'Lỗi MCU', icon: '🎛️', keywords: ['mcu', 'điều khiển động cơ', 'dieu khien dong co', 'motor controller'] },
  { id: 'scu', name: 'Lỗi SCU', icon: '🔑', keywords: ['scu', 'smartkey', 'smart key', 'chìa khóa', 'chia khoa', 'khóa thông minh'] },
  { id: 'dcdc', name: 'Lỗi DC - DC', icon: '⚡', keywords: ['dc - dc', 'dc-dc', 'dcdc', 'hạ áp', 'ha ap', '12v'] },
  { id: 'harness', name: 'Lỗi bộ dây điện', icon: '🧵', keywords: ['bộ dây điện', 'bo day dien', 'dây điện', 'day dien', 'dây sườn', 'giắc điện', 'chập điện', 'harness'] },
  { id: 'other', name: 'Lỗi khác', icon: '🛠️', keywords: [] }
];'''

if old_issue_cats in text:
    text = text.replace(old_issue_cats, new_issue_cats, 1)
    print('Updated ISSUE_CATEGORIES successfully!')
else:
    print('ISSUE_CATEGORIES not matched exactly, checking...')

# 2. Replace matchCategoryFromFaults, formatBangCapNhatHtml, and normalizeOrder
s1 = text.find('function matchCategoryFromFaults(')
s2 = text.find('function loadCheckXeOrders(){')
assert s1 != -1 and s2 != -1, f'indices not found: {s1}, {s2}'

new_block = '''function matchCategoryFromFaults(faults){
  const faultList = Array.isArray(faults) 
    ? faults.filter(Boolean) 
    : (typeof faults === 'string' && faults.trim() ? [faults.trim()] : []);

  // QUY TẮC BẮT BUỘC TỪ NGƯỜI DÙNG:
  // "Chỉ lấy hạng mục lỗi trong hạng mục lỗi của app ServiceOS. Nếu không có hạng mục lỗi thì mặc định xe đó không lỗi"
  if (faultList.length === 0) {
    return { 
      id: 'no_fault', 
      name: 'Không lỗi', 
      icon: '✅',
      isNoFault: true
    };
  }

  const fCombined = faultList.join(' ').toLowerCase();
  for (let i = 2; i < ISSUE_CATEGORIES.length - 1; i++) {
    const cat = ISSUE_CATEGORIES[i];
    if (cat.keywords && cat.keywords.some(kw => fCombined.includes(kw))) {
      return cat;
    }
    if (cat.name.toLowerCase() === fCombined || fCombined.includes(cat.name.toLowerCase()) || cat.name.toLowerCase().includes(fCombined)) {
      return cat;
    }
  }

  // Tên lỗi cụ thể từ ServiceOS
  const cleanName = faultList[0].trim();
  return { 
    id: 'custom_' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_'), 
    name: cleanName, 
    icon: '⚠️' 
  };
}

// Bảng cập nhật phía dưới: Hiển thị y chang bảng ServiceOS khoanh đỏ, nếu không có thì không hiển thị
function formatBangCapNhatHtml(o){
  // NẾU KHÔNG CÓ THÌ KHÔNG HIỂN THỊ (THEO ĐÚNG YÊU CẦU NGƯỜI DÙNG)
  if (!o.hasBangCapNhat) {
    return '<span style="color:var(--text-muted);opacity:0.35">—</span>';
  }

  const fmtStatus = (st) => {
    if (!st) return '• Chờ kiểm tra';
    const s = String(st).toLowerCase().replace(/\\s+/g, '_');
    if (s === 'checking' || s.includes('cho_kiem_tra')) return '• Chờ kiểm tra';
    if (s === 'waiting_battery' || s.includes('cho_pin')) return '• Chờ PIN';
    if (s === 'waiting_motor' || s.includes('cho_dong_co')) return '• Chờ Động cơ';
    if (s.includes('rejected') || s.includes('tu_choi')) return '• Từ chối';
    if (s === 'completed' || s === 'done' || s.includes('hoan_thanh')) return '• Hoàn thành';
    if (s === 'approved' || s === 'paid' || s.includes('da_duyet')) return '• Đã duyệt';
    if (s.includes('cap_2') || s.includes('l2')) return '• Chờ cấp 2';
    if (s.includes('cap_1') || s.includes('l1')) return '• Chờ cấp 1';
    if (s.includes('waiting_approval')) return '• Chờ duyệt';
    return '• ' + st;
  };

  const fList = o.faultList || [];
  const fLower = fList.join(' ').toLowerCase();

  // Xác định tiêu đề thẻ: Esim / PIN / Động cơ / Bộ sạc / Bảo hành
  let cardTitle = 'Bảo hành';
  if (o.kinds && o.kinds.includes('esim')) { cardTitle = 'Esim'; }
  else if (fLower.includes('esim') || (o.category && o.category.id === 'esim')) { cardTitle = 'Esim'; }
  else if (o.kinds && o.kinds.includes('pin')) { cardTitle = 'PIN'; }
  else if (o.pinSerial || fLower.includes('pin') || (o.category && o.category.id === 'pin')) { cardTitle = 'PIN'; }
  else if (o.kinds && o.kinds.includes('motor')) { cardTitle = 'Động cơ'; }
  else if (o.motorSerial || fLower.includes('động cơ') || fLower.includes('dong co') || (o.category && o.category.id === 'motor')) { cardTitle = 'Động cơ'; }
  else if (o.kinds && o.kinds.includes('charger') || o.chargerSerial || fLower.includes('sạc')) { cardTitle = 'Bộ sạc'; }
  else if (fList.length > 0) { cardTitle = fList[0].replace(/^Lỗi\\s+/i, ''); }

  const statusText = fmtStatus(o.bhOrderStatus || o.warrantyStatus);
  const dateVal = o.dateStr || '—';
  const procDateVal = o.removedAt ? formatDisplayDate(o.removedAt) : '—';
  const oldSerialVal = o.pinSerial || o.motorSerial || o.chargerSerial || '—';
  const newSerialVal = '—';
  const dienGiaiVal = o.issueDesc || '—';
  const noteVal = o.note || '—';
  const bhCodeVal = o.bhCode || '—';
  const claimCodeVal = o.claimCode || '—';
  const amountVal = '—';
  const submittedVal = '—';
  const approvedVal = '—';

  return `
    <div class="sos-warranty-card">
      <div class="sos-card-head">
        <div class="sos-card-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 12l10 10 10-10L12 2z"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          <span>${esc(cardTitle)}</span>
        </div>
        <div class="sos-card-action">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
          <span>Cập nhật</span>
        </div>
      </div>
      <div class="sos-card-grid">
        <div class="sos-cell">
          <span class="k">Trạng thái</span>
          <span class="v v-status">${esc(statusText)}</span>
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
          <span class="v ${newSerialVal === '—' ? 'v-empty' : ''}">${esc(newSerialVal)}</span>
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
          <span class="v ${bhCodeVal === '—' ? 'v-empty' : 'v-mono-bh'}">${esc(bhCodeVal)}</span>
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
  const wo = String(d.wo || d.code || d.dms_ro_code || '—').trim();
  const plate = String(d.plate || '—').trim();
  const vin = String(d.vin || '—').trim();
  const vehicle = String(d.vehicle || d.model || '—').trim();
  const customer = String(d.customer || d.customer_name || '—').trim();
  const tech = String(d.tech || d.technician_name || 'Chưa phân công').trim();
  const status = String(d.status || d.status_label || 'Trong xưởng').trim();
  const warrantyStatus = String(d.warrantyStatus || d.warranty_status || d.dms_warranty_status || '').trim();

  // 1. HẠNG MỤC LỖI (CHỈ LẤY TRONG HẠNG MỤC LỖI w.faults CỦA SERVICEOS)
  // Quy tắc người dùng: Nếu không có hạng mục lỗi thì MẶC ĐỊNH xe đó KHÔNG LỖI!
  const faultList = Array.isArray(d.faults) 
    ? d.faults.filter(Boolean) 
    : (typeof d.faults === 'string' && d.faults.trim() ? [d.faults.trim()] : []);
  
  const hasLoi = faultList.length > 0;
  const category = matchCategoryFromFaults(faultList);

  // Nội dung kiểm tra tự do (lọc bỏ chuỗi checklist dài nếu có)
  const rawDiag = String(d.diagnosis || d.symptoms || d.content || d.diag || '').trim();
  const cleanDiag = rawDiag.startsWith('Biển số:') ? '' : rawDiag;
  const issueDesc = cleanDiag;
  const issue = hasLoi ? faultList.join(', ') : 'Không lỗi';

  // 2. GHI CHÚ KTV
  const note = String(d.note || d.foreman_note || d.advisor_note || '').trim();
  const hasKtvNote = hasTextContent(note);

  // 3. BẢNG CẬP NHẬT PHÍA DƯỚI (Lấy đúng ô khoanh đỏ từ ServiceOS)
  const pinSerial = String(d.pinSerial || d.battery_serial_old || d.battery_serial_new || '').trim();
  const motorSerial = String(d.motorSerial || d.motor_serial_old || d.motor_serial_new || '').trim();
  const chargerSerial = String(d.chargerSerial || d.charger_serial || '').trim();
  const removedAt = String(d.removedAt || d.parts_removed_at || d.motor_removed_at || '').trim();
  const bhCode = String(d.bhCode || d.dms_warranty_code || d.bh_order_code || '').trim();
  const claimCode = String(d.claimCode || d.dms_claim_code || '').trim();
  const bhOrderStatus = String(d.bhOrderStatus || d.dms_warranty_status || '').trim();
  const pinType = String(d.pinType || d.battery_repair_type || '').trim();
  const motorType = String(d.motorType || d.motor_repair_type || '').trim();
  const kinds = Array.isArray(d.warranty_kinds) ? d.warranty_kinds.filter(Boolean) : [];
  const extra = (d.warranty_extra && typeof d.warranty_extra === 'object') ? d.warranty_extra : {};

  // Điều kiện xác định xe ĐÃ CÓ BẢNG CẬP NHẬT:
  const hasBangCapNhat = Boolean(
    bhCode || 
    claimCode || 
    pinSerial || 
    motorSerial || 
    chargerSerial || 
    removedAt || 
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
    motorSerial: motorSerial,
    chargerSerial: chargerSerial,
    removedAt: removedAt,
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

text = text[:s1] + new_block + text[s2:]

# 3. Add CSS for ServiceOS badges and ServiceOS warranty card
css_block = '''
      /* ServiceOS Fault Badges & Exact Warranty Card */
      .sos-fault-badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 11px;
        border-radius: 9999px;
        font-size: 11.5px;
        font-weight: 600;
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
        letter-spacing: 0.2px;
      }
      [data-theme="dark"] .sos-fault-badge {
        background: rgba(239, 68, 68, 0.16);
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.45);
      }
      .sos-no-fault-badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 11px;
        border-radius: 9999px;
        font-size: 11.5px;
        font-weight: 600;
        background: rgba(16, 185, 129, 0.12);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.35);
        letter-spacing: 0.2px;
      }
      [data-theme="dark"] .sos-no-fault-badge {
        background: rgba(16, 185, 129, 0.18);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.45);
      }

      .sos-warranty-card {
        background: rgba(254, 252, 247, 0.98);
        border: 1px solid #fed7aa;
        border-radius: 10px;
        padding: 9px 13px;
        min-width: 275px;
        max-width: 350px;
        box-shadow: 0 1px 4px rgba(245, 158, 11, 0.08);
        transition: all 0.2s ease;
      }
      .sos-warranty-card:hover {
        box-shadow: 0 4px 14px rgba(245, 158, 11, 0.18);
        transform: translateY(-1px);
      }
      [data-theme="dark"] .sos-warranty-card {
        background: rgba(28, 25, 23, 0.85);
        border: 1px solid rgba(245, 158, 11, 0.35);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
      }
      .sos-card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 7px;
        padding-bottom: 5px;
        border-bottom: 1px dashed rgba(245, 158, 11, 0.25);
      }
      .sos-card-title {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 13px;
        font-weight: 700;
        color: #d97706;
      }
      [data-theme="dark"] .sos-card-title {
        color: #fbbf24;
      }
      .sos-card-action {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 10.5px;
        font-weight: 600;
        color: #d97706;
        background: rgba(254, 243, 199, 0.6);
        border: 1px solid #fde68a;
        border-radius: 6px;
        padding: 2px 8px;
        cursor: default;
      }
      [data-theme="dark"] .sos-card-action {
        background: rgba(245, 158, 11, 0.15);
        border-color: rgba(245, 158, 11, 0.35);
        color: #fde047;
      }
      .sos-card-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px 10px;
      }
      .sos-cell {
        display: flex;
        flex-direction: column;
      }
      .sos-cell .k {
        font-size: 9.5px;
        color: #94a3b8;
        font-weight: 500;
        margin-bottom: 2px;
      }
      [data-theme="dark"] .sos-cell .k {
        color: #94a3b8;
      }
      .sos-cell .v {
        font-size: 11px;
        font-weight: 500;
        color: #1e293b;
        line-height: 1.3;
      }
      [data-theme="dark"] .sos-cell .v {
        color: #f1f5f9;
      }
      .sos-cell .v-empty {
        color: #94a3b8;
        opacity: 0.6;
      }
      .sos-cell .v-status {
        font-weight: 700;
        color: #d97706;
      }
      [data-theme="dark"] .sos-cell .v-status {
        color: #fbbf24;
      }
      .sos-cell .v-mono-bh {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 700;
        font-size: 11px;
        color: #b45309;
      }
      [data-theme="dark"] .sos-cell .v-mono-bh {
        color: #fde047;
      }
      .sos-cell .v-mono-claim {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 700;
        font-size: 11px;
        color: #0284c7;
      }
      [data-theme="dark"] .sos-cell .v-mono-claim {
        color: #38bdf8;
      }
      .sos-cell .v-money {
        color: #15803d;
        font-weight: 700;
      }
      [data-theme="dark"] .sos-cell .v-money {
        color: #4ade80;
      }
'''

# Insert css before </style>
last_style = text.rfind('</style>')
if last_style != -1:
    text = text[:last_style] + css_block + text[last_style:]
    print('Inserted ServiceOS card CSS!')

# 4. Update the table row in renderCheckXe
old_row_cells = '''        <td class="l part-name-cell">
          <div class="custom-cat-badge">${esc(o.category.name)}</div>
          <div style="font-weight:600;line-height:1.4;margin-top:4px;color:#f8fafc;font-size:12.5px">${esc(o.issueDesc || o.issue)}</div>
        </td>
        <td class="l part-name-cell" style="vertical-align:middle;min-width:205px">
          ${formatBangCapNhatHtml(o)}
        </td>'''

new_row_cells = '''        <td class="l part-name-cell">
          ${o.hasLoi ? `
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:3px">
              ${o.faultList.map(f => `<span class="sos-fault-badge">${esc(f)}</span>`).join('')}
            </div>
            ${o.issueDesc ? `<div style="font-weight:600;line-height:1.4;margin-top:3px;color:var(--text-main);font-size:12px">${esc(o.issueDesc)}</div>` : ''}
          ` : `
            <span class="sos-no-fault-badge">Không lỗi</span>
            ${o.issueDesc ? `<div style="color:var(--text-muted);font-size:11.5px;margin-top:3px">${esc(o.issueDesc)}</div>` : ''}
          `}
        </td>
        <td class="l part-name-cell" style="vertical-align:middle;min-width:280px">
          ${formatBangCapNhatHtml(o)}
        </td>'''

if old_row_cells in text:
    text = text.replace(old_row_cells, new_row_cells, 1)
    print('Updated table row cells successfully!')
else:
    print('Table row cells not found, looking for alternative...')
    # Let's search by formatBangCapNhatHtml(o)
    idx_fmt = text.find('${formatBangCapNhatHtml(o)}')
    if idx_fmt != -1:
        s_td = text.rfind('<td class="l part-name-cell">', 0, idx_fmt)
        e_td = text.find('</td>', idx_fmt) + 5
        print('Found table slice around formatBangCapNhatHtml:', s_td, e_td)
        text = text[:s_td] + new_row_cells + text[e_td:]
        print('Replaced table cells by slice!')

# 5. Update filter logic for 'no_fault' in filterCheckXe
old_filter_code = '''  // 1. Lọc Hạng mục
  if(state.checkXe.filterCategory !== 'all'){
    filtered = filtered.filter(o => o.category.id === state.checkXe.filterCategory);
  }'''

new_filter_code = '''  // 1. Lọc Hạng mục
  if(state.checkXe.filterCategory !== 'all'){
    if(state.checkXe.filterCategory === 'no_fault'){
      filtered = filtered.filter(o => !o.hasLoi);
    } else {
      filtered = filtered.filter(o => {
        if (!o.hasLoi) return false;
        if (o.category.id === state.checkXe.filterCategory) return true;
        const catObj = ISSUE_CATEGORIES.find(c => c.id === state.checkXe.filterCategory);
        if (catObj && catObj.keywords) {
          const flStr = (o.faultList || []).join(' ').toLowerCase();
          return catObj.keywords.some(kw => flStr.includes(kw));
        }
        return false;
      });
    }
  }'''

if old_filter_code in text:
    text = text.replace(old_filter_code, new_filter_code, 1)
    print('Updated filterCheckXe for no_fault successfully!')

with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_build/PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated PhanTichBaoHanh.html, _deploy/index.html, _build/PhanTichBaoHanh.html successfully!')
