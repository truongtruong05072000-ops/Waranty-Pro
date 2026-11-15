# -*- coding: utf-8 -*-
import io, os, sys, re

BASE = os.path.dirname(os.path.abspath(__file__))
TPL_FILE = os.path.join(BASE, 'app_template2.html')

with io.open(TPL_FILE, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update the Modal to include the Direct Login Tab
modal_start = text.find('<!-- Modal Bookmarklet Hướng Dẫn -->')
modal_end = text.find('<!-- Modal Chỉnh sửa Ghi chú KTV -->')
assert modal_start != -1 and modal_end != -1, "Modal markers not found"

new_sync_modal = r'''<!-- Modal Bookmarklet Hướng Dẫn & Đồng Bộ ServiceOS -->
<div id="modalBookmarklet" class="modal-overlay" hidden>
  <div class="modal-box" style="max-width:640px">
    <button class="modal-close" onclick="closeBookmarkletModal()">✕</button>
    <div class="modal-title" style="display:flex;align-items:center;gap:8px">
      <span>⚡</span> Đọc dữ liệu trực tiếp từ ServiceOS
    </div>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:14px;line-height:1.5">
      Tự động nhận diện <b>Hạng mục lỗi</b>, <b>Ghi chú KTV</b> và <b>Bảng cập nhật linh kiện (PIN/Động cơ)</b> để phân loại trạng thái: <i>Chưa check</i>, <i>Cần check lại</i>, và <i>Đã check</i>.
    </p>

    <!-- Tab chuyển đổi phương thức kết nối -->
    <div style="display:flex;gap:6px;margin-bottom:14px;border-bottom:1px solid var(--border);padding-bottom:8px">
      <button class="btn" id="tabBtnDirectLogin" onclick="switchSyncTab('login')" style="font-size:12px;padding:6px 12px">🔐 Đăng nhập trực tiếp</button>
      <button class="btn secondary" id="tabBtnTampermonkey" onclick="switchSyncTab('tamper')" style="font-size:12px;padding:6px 12px">🧩 Nút 1-Click trên ServiceOS</button>
      <button class="btn secondary" id="tabBtnConsole" onclick="switchSyncTab('console')" style="font-size:12px;padding:6px 12px">⚡ Lệnh F12 Console</button>
      <button class="btn secondary" id="tabBtnExcel" onclick="switchSyncTab('excel')" style="font-size:12px;padding:6px 12px">📁 File Excel</button>
    </div>

    <!-- TAB 1: ĐĂNG NHẬP TRỰC TIẾP TÀI KHOẢN SERVICEOS -->
    <div id="syncTabLogin" style="display:block">
      <div style="background:#f8fafc;border:1.5px solid #3b82f6;border-radius:var(--radius-md);padding:14px;margin-bottom:12px">
        <div style="font-size:13px;font-weight:700;color:#1e40af;margin-bottom:4px">
          🚀 Nhập tài khoản ServiceOS để đọc dữ liệu tự động
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">
          Hệ thống sẽ kết nối trực tiếp đến ServiceOS và tải toàn bộ xe đang trong xưởng về ngay lập tức, không cần tải hay nạp file.
        </p>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">
          <div>
            <label style="font-size:11.5px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:3px">Tài khoản (Tên đăng nhập ServiceOS):</label>
            <input type="text" id="soUsername" class="field-input" placeholder="Ví dụ: n54511_user hoặc SĐT đăng nhập" style="width:100%;font-size:13px;background:#ffffff">
          </div>
          <div>
            <label style="font-size:11.5px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:3px">Mật khẩu:</label>
            <input type="password" id="soPassword" class="field-input" placeholder="Nhập mật khẩu..." style="width:100%;font-size:13px;background:#ffffff" onkeydown="if(event.key==='Enter') loginAndFetchServiceOs()">
          </div>
        </div>
        <button class="btn primary" id="btnSoLogin" style="width:100%;font-weight:700;padding:10px;font-size:13.5px" onclick="loginAndFetchServiceOs()">
          🚀 Đăng nhập & Đọc dữ liệu xe ngay
        </button>
        <div id="soLoginMsg" style="font-size:12px;margin-top:8px;display:none"></div>
      </div>
    </div>

    <!-- TAB 2: NÚT TAMPERMONKEY 1-CLICK TRÊN SERVICEOS -->
    <div id="syncTabTamper" style="display:none">
      <div style="background:#f0fdf4;border:1.5px solid #16a34a;border-radius:var(--radius-md);padding:14px;margin-bottom:12px">
        <div style="font-size:13px;font-weight:700;color:#15803d;margin-bottom:4px">
          🧩 Cài nút tự động trên ServiceOS (Khuyên dùng - Tiện nhất)
        </div>
        <p style="font-size:12px;color:var(--text-main);margin-bottom:10px;line-height:1.5">
          Chỉ cần cài 1 lần vào tiện ích <b>Tampermonkey</b>. Khi bạn mở trang <b>att-serviceos.anthinhtech.vn/#/dashboard</b>, sẽ có sẵn nút màu xanh <b>"⚡ Lấy xe sang Bảo Hành PRO"</b> ngay góc màn hình, bấm 1 phát là nạp đủ dữ liệu trong 0.5 giây!
        </p>
        <button class="btn primary" style="width:100%;font-size:13px;padding:9px;background:#16a34a;border-color:#16a34a" onclick="copyUserscriptCode()">
          📋 Sao chép mã Tampermonkey (1 Click)
        </button>
        <div style="font-size:11.5px;color:var(--text-muted);margin-top:8px">
          👉 <i>Cách cài: Cài Tampermonkey trên Chrome/Edge ➔ Tạo script mới ➔ Dán mã vừa copy ➔ Nhấn Ctrl + S lưu lại là xong!</i>
        </div>
      </div>
    </div>

    <!-- TAB 3: LỆNH F12 CONSOLE 1-DÒNG -->
    <div id="syncTabConsole" style="display:none">
      <div style="background:#eff6ff;border:1.5px solid #2563eb;border-radius:var(--radius-md);padding:14px;margin-bottom:12px">
        <div style="font-size:13px;font-weight:700;color:#1e40af;margin-bottom:4px">
          ⚡ Chạy 1 dòng lệnh trong F12 Console của ServiceOS
        </div>
        <p style="font-size:12px;color:var(--text-main);margin-bottom:8px">
          Không cần cài tiện ích. Bấm nút bên dưới để mở ServiceOS và tự động copy mã:
        </p>
        <button class="btn primary" style="width:100%;font-size:13px;padding:9px" onclick="runOneClickSyncFlow()">
          🚀 Mở ServiceOS & Sao chép mã lấy dữ liệu
        </button>
        <div style="font-size:11.5px;color:var(--text-muted);margin-top:8px">
          👉 <i>Sang tab ServiceOS vừa mở ➔ Nhấn phím <b>F12</b> ➔ vào mục <b>Console</b> ➔ bấm <b>Ctrl + V</b> ➔ nhấn <b>Enter</b>.</i>
        </div>
        <details style="margin-top:8px">
          <summary style="font-size:11.5px;color:#2563eb;cursor:pointer">Xem mã lệnh Console chi tiết</summary>
          <textarea id="bmConsoleCodeBox" readonly style="width:100%;height:60px;font-family:monospace;font-size:11px;margin-top:4px;padding:4px"></textarea>
        </details>
      </div>
    </div>

    <!-- TAB 4: FILE EXCEL SERVICEOS -->
    <div id="syncTabExcel" style="display:none">
      <div style="background:#ffffff;border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:12px">
        <div style="font-size:13px;font-weight:700;color:var(--text-main);margin-bottom:4px">
          📁 Nhập file Excel từ ServiceOS
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">
          Hệ thống đã được nâng cấp để nhận diện chính xác toàn bộ cột: Hạng mục lỗi, Ghi chú KTV, Serial PIN, Số máy động cơ, Ngày tháo, v.v.
        </p>
        <button class="btn secondary" style="width:100%;font-size:12.5px;padding:9px" onclick="$('#serviceOsFileInput').click();closeBookmarkletModal();">
          📁 Chọn tệp Excel tải từ ServiceOS
        </button>
      </div>
    </div>

    <div style="margin-top:12px;text-align:right">
      <button class="btn secondary" onclick="closeBookmarkletModal()">Đóng</button>
    </div>
  </div>
</div>
'''

text = text[:modal_start] + new_sync_modal + text[modal_end:]

# 2. Replace the CheckXe Javascript Engine with the 4 Business Rules & Direct Fetch
checkxe_start = text.find('/* ============================ Check Xe Hàng Ngày (ServiceOS) ============================ */')
checkxe_end = text.find('/* ============================ Navigation ============================ */', checkxe_start)
assert checkxe_start != -1 and checkxe_end != -1, "CheckXe JS block not found"

new_checkxe_engine = r'''/* ============================ Check Xe Hàng Ngày (ServiceOS) ============================ */
// 12 Hạng mục lỗi chuẩn theo yêu cầu nghiệp vụ
const ISSUE_CATEGORIES = [
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
];

state.checkXe = {
  orders: [],
  filterCategory: 'all',
  filterStatus: 'all',     // 'all', 'unchecked', 'recheck', 'checked', 'normal'
  filterScope: 'issue_only', // 'issue_only' (các xe có lỗi hoặc có cập nhật bảo hành), 'all' (tất cả xe)
  filterDate: 'all',       // 'all', 'today', 'yesterday', 'last7', or 'YYYY-MM-DD'
  filterTech: '',
  searchQuery: ''
};

// 4 QUY TẮC NGHIỆP VỤ XÁC ĐỊNH TRẠNG THÁI CHECK:
// - Quy tắc 1: Nếu có hạng mục lỗi nhưng không có ghi chú KTV hay bảng cập nhật phía dưới -> Chưa check (UNCHECKED)
// - Quy tắc 2: Nếu không có hạng mục lỗi và không có ghi chú KTV mà có bảng cập nhật bên dưới -> Đã check (CHECKED)
// - Quy tắc 3: Nếu có hạng mục lỗi và ghi chú KTV (kèm bảng cập nhật) -> Đã check (CHECKED)
// - Quy tắc 4: Nếu có hạng mục lỗi nhưng không có bảng cập nhật bên dưới và đã có ghi chú KTV -> Cần check lại (RECHECK)
function evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat){
  // Quy tắc 4: Có lỗi + có ghi chú KTV nhưng chưa có bảng cập nhật phía dưới -> Cần check lại
  if(hasLoi && hasKtvNote && !hasBangCapNhat){
    return { code: 'recheck', label: '⚠️ Cần check lại', badgeClass: 'recheck', desc: 'Có ghi chú KTV nhưng chưa cập nhật bảng linh kiện/PIN' };
  }

  // Quy tắc 1: Có lỗi nhưng không có ghi chú KTV hay bảng cập nhật -> Mặc định chưa check
  if(hasLoi && !hasKtvNote && !hasBangCapNhat){
    return { code: 'unchecked', label: '🔴 Chưa check', badgeClass: 'unchecked', desc: 'Chưa có ghi chú KTV & chưa cập nhật bảng' };
  }

  // Quy tắc 2: Không có lỗi + không có ghi chú KTV mà có bảng cập nhật -> Đã check
  if(!hasLoi && !hasKtvNote && hasBangCapNhat){
    return { code: 'checked', label: '✅ Đã check', badgeClass: 'checked', desc: 'Đã cập nhật bảng linh kiện/PIN' };
  }

  // Quy tắc 3: Có lỗi + có ghi chú KTV + có bảng cập nhật -> Đã check
  if(hasLoi && hasKtvNote && hasBangCapNhat){
    return { code: 'checked', label: '✅ Đã check', badgeClass: 'checked', desc: 'Đã có ghi chú KTV và cập nhật bảng hoàn tất' };
  }

  // Trường hợp có lỗi + có bảng cập nhật (kể cả chưa có ghi chú) -> Đã check
  if(hasLoi && hasBangCapNhat){
    return { code: 'checked', label: '✅ Đã check', badgeClass: 'checked', desc: 'Đã cập nhật bảng linh kiện' };
  }

  // Trường hợp xe có ghi chú KTV -> Đã check
  if(hasKtvNote){
    return { code: 'checked', label: '✅ Đã check', badgeClass: 'checked', desc: 'Đã có ghi chú KTV' };
  }

  // Xe bảo dưỡng/sửa chữa bình thường không có lỗi hay thông tin bảo hành
  return { code: 'normal', label: '⚪ Xe bình thường', badgeClass: 'normal', desc: 'Sửa chữa/bảo dưỡng thông thường' };
}

// Kiểm tra nội dung text có phải là chuỗi hợp lệ không rỗng
function hasTextContent(val){
  const s = String(val ?? '').trim().toLowerCase();
  return Boolean(s && s !== '—' && s !== '-' && s !== 'none' && s !== 'null' && s !== 'undefined' && s !== 'chưa chọn' && s !== 'chưa có');
}

// Định dạng ngày chuẩn ISO YYYY-MM-DD
function formatIsoDate(d){
  if(!d) return '';
  const dt = (d instanceof Date) ? d : parseDateVal(d);
  if(!dt || isNaN(dt.getTime())) return '';
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Định dạng ngày hiển thị DD/MM/YYYY
function formatDisplayDate(d){
  if(!d) return '—';
  const dt = (d instanceof Date) ? d : parseDateVal(d);
  if(!dt || isNaN(dt.getTime())) return String(d);
  const day = String(dt.getDate()).padStart(2, '0');
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const y = dt.getFullYear();
  return `${day}/${m}/${y}`;
}

// Phân loại hạng mục lỗi thông minh
function categorizeIssue(issueText, partsList, updateInfo){
  const txt = (String(issueText || '') + ' ' + (Array.isArray(partsList) ? partsList.join(' ') : '') + ' ' + String(updateInfo || '')).toLowerCase();

  for(let i = 1; i < ISSUE_CATEGORIES.length - 1; i++){
    const cat = ISSUE_CATEGORIES[i];
    if(cat.keywords.some(kw => txt.includes(kw))){
      return cat;
    }
  }
  return ISSUE_CATEGORIES[ISSUE_CATEGORIES.length - 1]; // Lỗi khác
}

// Chuẩn hóa một bản ghi xe với đầy đủ 3 trường nghiệp vụ: hasLoi, hasKtvNote, hasBangCapNhat
function normalizeOrder(d, i){
  const wo = String(d.wo || d.code || d.dms_ro_code || '—').trim();
  const plate = String(d.plate || '—').trim();
  const vin = String(d.vin || '—').trim();
  const vehicle = String(d.vehicle || d.model || '—').trim();
  const customer = String(d.customer || d.customer_name || '—').trim();
  const tech = String(d.tech || d.technician_name || 'Chưa phân công').trim();
  const status = String(d.status || d.status_label || 'Trong xưởng').trim();
  const warrantyStatus = String(d.warrantyStatus || d.warranty_status || d.dms_warranty_status || '').trim();

  // 1. Hạng mục lỗi
  let issue = String(d.issue || d.content || d.diag || d.symptoms || '').trim();
  if(!issue && Array.isArray(d.faults) && d.faults.length > 0) {
    issue = d.faults.join(', ');
  }
  if(!issue && d.customer_name && d.source === 'retail') {
    issue = d.customer_name;
  }
  const hasLoi = hasTextContent(issue) && (issue.toLowerCase().includes('lỗi') || issue.toLowerCase().includes('loi') || (Array.isArray(d.faults) && d.faults.length > 0));

  // 2. Ghi chú KTV
  const note = String(d.note || d.foreman_note || '').trim();
  const hasKtvNote = hasTextContent(note);

  // 3. Phần bảng cập nhật phía dưới (PIN, Động cơ, Serial, Ngày tháo, Lệnh BH)
  const pinSerial = String(d.pinSerial || d.battery_serial_old || d.battery_serial_new || '').trim();
  const motorSerial = String(d.motorSerial || d.motor_serial_old || d.motor_serial_new || '').trim();
  const removedAt = String(d.removedAt || d.parts_removed_at || d.motor_removed_at || '').trim();
  const bhCode = String(d.bhCode || d.bh_order_code || '').trim();
  const pinType = String(d.pinType || d.battery_repair_type || '').trim();
  const extraInfo = d.warranty_extra && typeof d.warranty_extra === 'object' ? JSON.stringify(d.warranty_extra) : '';

  const updateParts = [];
  if(hasTextContent(pinSerial)) updateParts.push(`PIN: ${pinSerial}`);
  if(hasTextContent(motorSerial)) updateParts.push(`ĐC: ${motorSerial}`);
  if(hasTextContent(removedAt)) updateParts.push(`Tháo: ${formatDisplayDate(removedAt)}`);
  if(hasTextContent(bhCode)) updateParts.push(`Lệnh BH: ${bhCode}`);
  if(hasTextContent(pinType)) updateParts.push(`Loại: ${pinType}`);
  if(hasTextContent(warrantyStatus) && warrantyStatus.toLowerCase() !== 'checking' && warrantyStatus.toLowerCase() !== 'none') {
    updateParts.push(`BH: ${warrantyStatus}`);
  }

  const updateTableText = updateParts.join(' · ');
  const hasBangCapNhat = updateParts.length > 0 || hasTextContent(pinSerial) || hasTextContent(motorSerial) || hasTextContent(removedAt) || hasTextContent(bhCode) || hasTextContent(extraInfo);

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
    issue: issue || (hasBangCapNhat ? 'Bảo hành linh kiện' : 'Kiểm tra định kỳ'),
    note: note,
    status: status,
    warrantyStatus: warrantyStatus,
    pinSerial: pinSerial,
    motorSerial: motorSerial,
    removedAt: removedAt,
    bhCode: bhCode,
    updateTableText: updateTableText,
    hasLoi: hasLoi,
    hasKtvNote: hasKtvNote,
    hasBangCapNhat: hasBangCapNhat,
    checkStatus: checkStatus,
    dateStr: dispDate,
    isoDate: isoDate,
    isChecked: checkStatus.code === 'checked'
  };

  order.category = categorizeIssue(order.issue, d.parts || [], updateTableText);
  return order;
}

function loadCheckXeOrders(){
  try {
    const raw = localStorage.getItem('bh_checkxe_orders');
    if(raw) {
      const data = JSON.parse(raw);
      if(Array.isArray(data)){
        state.checkXe.orders = data.map((d, i) => normalizeOrder(d, i));
      }
    }
  } catch(e){}
}

function saveCheckXeOrders(){
  try {
    localStorage.setItem('bh_checkxe_orders', JSON.stringify(state.checkXe.orders));
  } catch(e){}
}

function isDateMatch(isoOrder, filterDate){
  if(!filterDate || filterDate === 'all') return true;
  if(!isoOrder) return true;

  const today = formatIsoDate(new Date());
  if(filterDate === 'today') return isoOrder === today;
  if(filterDate === 'yesterday'){
    const yest = new Date(); yest.setDate(yest.getDate() - 1);
    return isoOrder === formatIsoDate(yest);
  }
  if(filterDate === 'last7'){
    const limit = new Date(); limit.setDate(limit.getDate() - 7);
    return isoOrder >= formatIsoDate(limit);
  }
  return isoOrder === filterDate;
}

// Modal Handlers & Tab Switch
window.openBookmarkletModal = function(){
  const m = $('#modalBookmarklet');
  if(m) {
    m.hidden = false;
    const box = $('#bmConsoleCodeBox');
    if(box) box.value = getConsoleSnippetCode();
  }
};
window.closeBookmarkletModal = function(){
  const m = $('#modalBookmarklet');
  if(m) m.hidden = true;
};

window.switchSyncTab = function(tab){
  const tabs = ['login', 'tamper', 'console', 'excel'];
  tabs.forEach(t => {
    const el = $('#syncTab' + t.charAt(0).toUpperCase() + t.slice(1));
    const btn = $('#tabBtn' + (t === 'login' ? 'DirectLogin' : t === 'tamper' ? 'Tampermonkey' : t === 'console' ? 'Console' : 'Excel'));
    if(el) el.style.display = (t === tab) ? 'block' : 'none';
    if(btn) {
      if(t === tab) { btn.classList.remove('secondary'); }
      else { btn.classList.add('secondary'); }
    }
  });
};

// Đăng nhập trực tiếp ServiceOS và kéo dữ liệu
window.loginAndFetchServiceOs = async function(){
  const uInp = $('#soUsername');
  const pInp = $('#soPassword');
  const msgEl = $('#soLoginMsg');
  const btn = $('#btnSoLogin');

  const username = uInp ? uInp.value.trim() : '';
  const password = pInp ? pInp.value.trim() : '';

  if(!username || !password){
    alert('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu ServiceOS!');
    return;
  }

  if(msgEl){
    msgEl.style.display = 'block';
    msgEl.style.color = '#2563eb';
    msgEl.innerHTML = '⏳ Đang đăng nhập và lấy dữ liệu từ ServiceOS...';
  }
  if(btn) btn.disabled = true;

  try {
    // Thử gọi proxy Cloudflare hoặc endpoint nội bộ
    const proxyUrl = window.location.origin.includes('pages.dev') ? '/api/serviceos' : 'https://phan-tich-bao-hanh.pages.dev/api/serviceos';
    
    let loginRes = await fetch(proxyUrl + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if(!loginRes.ok){
      throw new Error('Đăng nhập không thành công (HTTP ' + loginRes.status + '). Vui lòng kiểm tra lại tài khoản hoặc sử dụng Cách 2: Tiện ích 1-Click.');
    }

    // Đăng nhập thành công, kéo danh sách xe active
    let woRes = await fetch(proxyUrl + '/work-orders?status=active&page=1&page_size=500');
    if(!woRes.ok){
      throw new Error('Lỗi tải dữ liệu lệnh sửa chữa: HTTP ' + woRes.status);
    }

    const d = await woRes.json();
    const rows = d.rows || d.items || [];
    if(!rows.length){
      alert('Đã kết nối thành công nhưng hiện tại không có xe nào trong mục "Xe đang trong xưởng"!');
      return;
    }

    const orders = rows.map((w, idx) => normalizeOrder(w, idx));
    state.checkXe.orders = orders;
    saveCheckXeOrders();
    renderCheckXe();
    closeBookmarkletModal();
    alert(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ${orders.length} XE TRỰC TIẾP TỪ SERVICEOS!`);
  } catch(err){
    if(msgEl){
      msgEl.style.display = 'block';
      msgEl.style.color = '#dc2626';
      msgEl.innerHTML = '❌ ' + err.message + '<br><small>Gợi ý: Nếu đang chạy trên máy local, bạn chỉ cần dùng <b>Cách 2 (Nút 1-Click trên ServiceOS)</b> là tiện nhất!</small>';
    }
  } finally {
    if(btn) btn.disabled = false;
  }
};

let currentEditingOrderIndex = -1;
window.openEditNoteModal = function(idx){
  currentEditingOrderIndex = idx;
  const o = state.checkXe.orders[idx];
  if(!o) return;
  const infoEl = $('#editNoteInfo');
  if(infoEl){
    infoEl.innerHTML = `
      <div style="font-weight:700;color:var(--text-main);font-size:14px;margin-bottom:4px">
        Biển số: <span style="color:#2563eb">${esc(o.plate)}</span> · Xe: ${esc(o.vehicle)} · WO: ${esc(o.wo)}
      </div>
      <div>Hạng mục: <span class="tag f1">${esc(o.category.name)}</span> · Lỗi: <i>${esc(o.issue)}</i></div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px">
        Trạng thái check: <b>${esc(o.checkStatus.label)}</b> · Ngày nhận: <b>${esc(o.dateStr)}</b>
      </div>
      ${o.updateTableText ? `<div style="font-size:11.5px;color:#15803d;margin-top:4px;background:#f0fdf4;padding:4px 8px;border-radius:4px">📦 <b>Bảng cập nhật:</b> ${esc(o.updateTableText)}</div>` : '<div style="font-size:11.5px;color:#dc2626;margin-top:4px">⚠️ <i>Chưa có bảng cập nhật linh kiện/PIN phía dưới</i></div>'}
    `;
  }
  const inp = $('#editNoteInput');
  if(inp) inp.value = o.note || '';
  const m = $('#modalEditNote');
  if(m) m.hidden = false;
};
window.closeEditNoteModal = function(){
  currentEditingOrderIndex = -1;
  const m = $('#modalEditNote');
  if(m) m.hidden = true;
};

window.setQuickNote = function(text){
  const inp = $('#editNoteInput');
  if(inp){
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    inp.value = text.replace('{time}', timeStr);
  }
};

window.saveEditedNote = function(){
  if(currentEditingOrderIndex < 0 || currentEditingOrderIndex >= state.checkXe.orders.length) return;
  const inp = $('#editNoteInput');
  const newNote = inp ? inp.value.trim() : '';
  const order = state.checkXe.orders[currentEditingOrderIndex];
  order.note = newNote;
  order.hasKtvNote = hasTextContent(newNote);
  order.checkStatus = evaluateCheckStatus(order.hasLoi, order.hasKtvNote, order.hasBangCapNhat);
  order.isChecked = order.checkStatus.code === 'checked';
  saveCheckXeOrders();
  closeEditNoteModal();
  renderCheckXe();
};

// Đánh dấu nhanh 1-Click
window.quickCheckOrder = function(idx){
  const order = state.checkXe.orders[idx];
  if(!order) return;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  order.note = `Đã kiểm tra xác nhận (${order.category.name}) - ${timeStr} ngày ${formatDisplayDate(now)}`;
  order.hasKtvNote = true;
  order.checkStatus = evaluateCheckStatus(order.hasLoi, order.hasKtvNote, order.hasBangCapNhat);
  order.isChecked = order.checkStatus.code === 'checked';
  saveCheckXeOrders();
  renderCheckXe();
};

window.clearCheckXe = function(){
  if(!confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách xe này không?')) return;
  state.checkXe.orders = [];
  saveCheckXeOrders();
  renderCheckXe();
};

window.setCheckXeScope = function(scope){
  state.checkXe.filterScope = scope;
  renderCheckXe();
};

window.setCheckXeCat = function(cid){
  state.checkXe.filterCategory = cid;
  renderCheckXe();
};

window.setCheckXeStatus = function(st){
  state.checkXe.filterStatus = st;
  renderCheckXe();
};

window.setCheckXeDate = function(dt){
  state.checkXe.filterDate = dt;
  renderCheckXe();
};

window.setCheckXeTech = function(t){
  state.checkXe.filterTech = t;
  renderCheckXe();
};

window.setCheckXeSearch = function(q){
  state.checkXe.searchQuery = q;
  renderCheckXe();
};

// Xuất Excel danh sách check lỗi xe
window.exportCheckXeExcel = function(){
  const allOrders = state.checkXe.orders || [];
  if(!allOrders.length){ alert('Không có dữ liệu để xuất Excel!'); return; }
  
  const rows = [
    ['STT', 'Biển số', 'Mã lệnh WO', 'Số khung VIN', 'Loại xe', 'KTV phụ trách', 'Hạng mục lỗi chuẩn', 'Nội dung chi tiết', 'Trạng thái check', 'Ghi chú KTV', 'Bảng cập nhật phía dưới (PIN/ĐC/Serial)', 'Trạng thái lệnh', 'Ngày nhận xe']
  ];
  
  allOrders.forEach((o, idx) => {
    rows.push([
      idx + 1,
      o.plate,
      o.wo,
      o.vin,
      o.vehicle,
      o.tech,
      o.category.name,
      o.issue,
      o.checkStatus.label,
      o.note || '—',
      o.updateTableText || '—',
      o.status,
      o.dateStr
    ]);
  });
  
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSachCheckLoi');
  XLSX.writeFile(wb, `Check_Loi_Xe_ServiceOS_${formatIsoDate(new Date())}.xlsx`);
};

// Render giao diện Check lỗi xe hàng ngày
function renderCheckXe(){
  const allOrders = state.checkXe.orders || [];
  const totalAll = allOrders.length;
  
  // Phân loại theo 4 quy tắc
  const uncheckedList = allOrders.filter(o => o.checkStatus.code === 'unchecked');
  const recheckList = allOrders.filter(o => o.checkStatus.code === 'recheck');
  const checkedList = allOrders.filter(o => o.checkStatus.code === 'checked');
  const normalList = allOrders.filter(o => o.checkStatus.code === 'normal');

  // Tổng số xe trong diện theo dõi lỗi (gồm chưa check, cần check lại, và đã check)
  const issueOrders = allOrders.filter(o => o.checkStatus.code !== 'normal');
  const totalIssue = issueOrders.length || totalAll;

  // Cập nhật Badge trên Menu Tab & Context Bar
  const bEl = $('#badgeUncheckedCount');
  if(bEl){
    const needAttention = uncheckedList.length + recheckList.length;
    bEl.textContent = needAttention;
    bEl.style.display = needAttention > 0 ? 'inline-block' : 'none';
  }
  const ctxChip = $('#ctxCheckXeChip');
  const ctxVal = $('#ctxUncheckedVal');
  if(ctxChip && ctxVal){
    if(totalAll > 0){
      ctxChip.style.display = 'inline-flex';
      ctxVal.textContent = (uncheckedList.length + recheckList.length) + ' / ' + totalIssue;
    } else {
      ctxChip.style.display = 'none';
    }
  }

  const el = $('#checkXeContent');
  if(!el) return;

  if(!totalAll){
    el.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🔍 Check lỗi xe hàng ngày — Dữ liệu ServiceOS</div>
            <div class="card-subtitle">Áp dụng chuẩn 4 quy tắc check: Hạng mục lỗi · Ghi chú KTV · Bảng cập nhật phía dưới</div>
          </div>
          <div class="toolbar-right">
            <button class="btn primary" onclick="openBookmarkletModal()">⚡ Đọc trực tiếp ServiceOS</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu (Ctrl+V)</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Nhập Excel ServiceOS</button>
            <input type="file" id="serviceOsFileInput" style="display:none" accept=".xlsx,.xls" onchange="handleServiceOsFileSelect(this.files)">
          </div>
        </div>

        <div class="empty-state">
          <div class="empty-state-icon">🛵</div>
          <h3 style="font-size:16px;color:var(--text-main);margin-bottom:6px">Chưa có dữ liệu xe từ ServiceOS</h3>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:18px;max-width:580px;margin-left:auto;margin-right:auto;line-height:1.6">
            Bạn có thể <b>kết nối trực tiếp với ServiceOS</b> (bằng tài khoản hoặc tiện ích 1-Click), hoặc tải file Excel từ mục <i>Xe đang trong xưởng</i> thả vào đây để tự động phân tích theo 4 quy tắc!
          </p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn primary" onclick="openBookmarkletModal()">⚡ Đọc dữ liệu trực tiếp ServiceOS</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu đã copy (Ctrl+V)</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Chọn file Excel ServiceOS</button>
          </div>
        </div>
      </div>`;
    return;
  }

  // Tập dữ liệu theo phạm vi lọc: 'issue_only' (mặc định) hoặc 'all'
  const scopeOrders = state.checkXe.filterScope === 'issue_only' ? (issueOrders.length > 0 ? issueOrders : allOrders) : allOrders;

  // Thống kê theo hạng mục lỗi (dựa trên scopeOrders)
  const catCounts = { all: scopeOrders.length };
  scopeOrders.forEach(o => {
    const cid = o.category.id;
    catCounts[cid] = (catCounts[cid] || 0) + 1;
  });

  // Render các pill hạng mục lỗi giống giao diện hình ảnh người dùng gửi
  const catPillsHtml = ISSUE_CATEGORIES.map(c => {
    const cnt = catCounts[c.id] || 0;
    if(c.id !== 'all' && cnt === 0) return '';
    const isActive = state.checkXe.filterCategory === c.id;
    return `
      <button class="custom-cat-pill ${isActive ? 'active' : ''}" onclick="setCheckXeCat('${c.id}')">
        ${c.name}${cnt > 0 ? ` <span class="pill-badge">${cnt}</span>` : ''}
      </button>`;
  }).join('');

  // Thống kê theo ngày nhận xe (Date Breakdown)
  const dateCounts = {};
  scopeOrders.forEach(o => {
    const k = o.isoDate || 'no_date';
    if(!dateCounts[k]) dateCounts[k] = { total: 0, checked: 0, unchecked: 0, recheck: 0, disp: o.dateStr };
    dateCounts[k].total++;
    if(o.checkStatus.code === 'checked') dateCounts[k].checked++;
    else if(o.checkStatus.code === 'recheck') dateCounts[k].recheck++;
    else dateCounts[k].unchecked++;
  });

  const sortedDates = Object.keys(dateCounts).sort().reverse();
  const todayIso = formatIsoDate(new Date());
  const yestDate = new Date(); yestDate.setDate(yestDate.getDate() - 1);
  const yestIso = formatIsoDate(yestDate);

  const todayCount = dateCounts[todayIso] ? dateCounts[todayIso].total : 0;
  const yestCount = dateCounts[yestIso] ? dateCounts[yestIso].total : 0;

  // Lọc bảng xe (Filtering)
  let filtered = scopeOrders;
  if(state.checkXe.filterCategory !== 'all'){
    filtered = filtered.filter(o => o.category.id === state.checkXe.filterCategory);
  }
  if(state.checkXe.filterStatus !== 'all'){
    filtered = filtered.filter(o => o.checkStatus.code === state.checkXe.filterStatus);
  }
  if(state.checkXe.filterDate !== 'all'){
    filtered = filtered.filter(o => isDateMatch(o.isoDate, state.checkXe.filterDate));
  }
  if(state.checkXe.filterTech){
    filtered = filtered.filter(o => o.tech === state.checkXe.filterTech);
  }
  if(state.checkXe.searchQuery){
    const q = norm(state.checkXe.searchQuery);
    filtered = filtered.filter(o => norm(o.plate + ' ' + o.wo + ' ' + o.vin + ' ' + o.tech + ' ' + o.issue + ' ' + o.note + ' ' + o.updateTableText + ' ' + o.status).includes(q));
  }

  // Danh sách KTV cho bộ lọc
  const techs = [...new Set(allOrders.map(o => o.tech).filter(Boolean))].sort();

  // Bảng các dòng xe
  const rowsHtml = filtered.map((o, idx) => {
    const originalIndex = allOrders.indexOf(o);
    const stCode = o.checkStatus.code;
    const rowClass = stCode === 'checked' ? 'row-checked' : stCode === 'recheck' ? 'row-recheck' : 'row-unchecked';
    
    return `
      <tr class="${rowClass}">
        <td class="num">${idx + 1}</td>
        <td class="l">
          <b style="font-size:14px;color:var(--text-main);letter-spacing:0.5px">${esc(o.plate)}</b>
          <div style="font-size:11px;color:var(--text-muted);font-family:monospace">${esc(o.wo)}</div>
        </td>
        <td class="l">
          <b>${esc(o.vehicle)}</b>
          <div style="font-size:11px;font-family:monospace;color:var(--text-muted)">VIN: ...${esc(String(o.vin).slice(-6))}</div>
        </td>
        <td class="l">
          <span style="font-weight:600;color:#334155">${esc(o.tech)}</span>
        </td>
        <td class="l part-name-cell">
          <div class="custom-cat-badge">${esc(o.category.name)}</div>
          <div style="font-weight:600;line-height:1.4;margin-top:3px;color:#0f172a">${esc(o.issue)}</div>
        </td>
        <td class="l part-name-cell">
          ${o.hasBangCapNhat ? 
            `<div style="font-size:11.5px;color:#15803d;background:#f0fdf4;border:1px solid #bbf7d0;padding:4px 8px;border-radius:6px;line-height:1.4">
               📦 <b>Đã cập nhật:</b> ${esc(o.updateTableText)}
             </div>` : 
            `<span style="color:#94a3b8;font-size:12px;font-style:italic">— Chưa có bảng cập nhật</span>`
          }
        </td>
        <td class="l part-name-cell">
          ${o.hasKtvNote ? 
            `<div style="font-weight:600;color:#0f172a;font-size:12.5px">${esc(o.note)}</div>` : 
            `<span style="color:#94a3b8;font-style:italic;font-size:12px">— Trống</span>`
          }
        </td>
        <td class="l">
          <div style="font-size:12px;font-weight:600">📅 ${esc(o.dateStr)}</div>
          <div style="font-size:11px;color:var(--text-muted)">${esc(o.status)}</div>
        </td>
        <td class="l">
          ${stCode === 'checked' ? 
            `<span class="status-pill checked" title="${esc(o.checkStatus.desc)}">✅ ĐÃ CHECK</span>` : 
            stCode === 'recheck' ?
            `<span class="status-pill recheck" style="background:#ffedd5;color:#c2410c;border:1px solid #fed7aa;font-weight:700" title="${esc(o.checkStatus.desc)}">⚠️ CẦN CHECK LẠI</span>` :
            `<span class="status-pill unchecked" title="${esc(o.checkStatus.desc)}">🔴 CHƯA CHECK</span>`
          }
        </td>
        <td class="l">
          <button class="btn secondary" style="padding:4px 8px;font-size:11.5px" onclick="openEditNoteModal(${originalIndex})" title="Cập nhật ghi chú hoặc kiểm tra">
            ✏️ Xem/Sửa
          </button>
        </td>
      </tr>`;
  }).join('');

  // Daily summary badges HTML
  const datePillsHtml = `
    <button class="date-chip ${state.checkXe.filterDate === 'all' ? 'active' : ''}" onclick="setCheckXeDate('all')">
      📅 Tất cả ngày (${scopeOrders.length})
    </button>
    <button class="date-chip ${state.checkXe.filterDate === 'today' ? 'active' : ''}" onclick="setCheckXeDate('today')">
      ⚡ Hôm nay (${todayCount})
    </button>
    <button class="date-chip ${state.checkXe.filterDate === 'yesterday' ? 'active' : ''}" onclick="setCheckXeDate('yesterday')">
      Hôm qua (${yestCount})
    </button>
    <button class="date-chip ${state.checkXe.filterDate === 'last7' ? 'active' : ''}" onclick="setCheckXeDate('last7')">
      7 ngày qua
    </button>
    ${sortedDates.slice(0, 5).map(iso => {
      const d = dateCounts[iso];
      const isAct = state.checkXe.filterDate === iso;
      return `
        <button class="date-chip ${isAct ? 'active' : ''}" onclick="setCheckXeDate('${iso}')">
          ${d.disp} (${d.total})
        </button>`;
    }).join('')}
  `;

  el.innerHTML = `
    <style>
      .custom-cat-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 14px 16px;
        margin-bottom: 14px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      }
      .custom-cat-header {
        font-size: 13px;
        font-weight: 700;
        color: #334155;
      }
      .custom-cat-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .custom-cat-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 14px;
        border-radius: 9999px;
        border: 1px solid #cbd5e1;
        background: #ffffff;
        color: #334155;
        font-size: 12.5px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .custom-cat-pill:hover {
        border-color: #94a3b8;
        background: #f8fafc;
      }
      .custom-cat-pill.active {
        border-color: #2563eb;
        background: #eff6ff;
        color: #1d4ed8;
        font-weight: 700;
        box-shadow: 0 0 0 1px #2563eb;
      }
      .custom-cat-pill .pill-badge {
        font-size: 11px;
        font-weight: 700;
        background: #e2e8f0;
        color: #475569;
        padding: 1px 6px;
        border-radius: 10px;
      }
      .custom-cat-pill.active .pill-badge {
        background: #2563eb;
        color: #ffffff;
      }
      .custom-cat-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        background: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
      }
      .date-filter-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 12px;
      }
      .date-chip {
        padding: 4px 10px;
        border-radius: 6px;
        border: 1px solid #cbd5e1;
        background: #ffffff;
        color: #334155;
        font-size: 12px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.15s;
      }
      .date-chip:hover {
        background: #f1f5f9;
      }
      .date-chip.active {
        background: #2563eb;
        color: #ffffff;
        border-color: #2563eb;
        font-weight: 600;
      }
      .scope-toggle-btn {
        padding: 5px 12px;
        font-size: 12px;
        font-weight: 600;
        border-radius: 6px;
        border: 1px solid #cbd5e1;
        background: #ffffff;
        color: #475569;
        cursor: pointer;
      }
      .scope-toggle-btn.active {
        background: #0f172a;
        color: #ffffff;
        border-color: #0f172a;
      }
      .row-recheck {
        background: #fffbeb !important;
      }
    </style>

    <!-- Thẻ Tiêu đề & Toolbar -->
    <div class="card" style="margin-bottom:14px">
      <div class="card-header">
        <div>
          <div class="card-title">🔍 Check lỗi xe hàng ngày — Dữ liệu ServiceOS</div>
          <div class="card-subtitle">
            Phân loại tự động 4 quy tắc: <b>Hạng mục lỗi</b> · <b>Ghi chú KTV</b> · <b>Bảng cập nhật phía dưới</b>
          </div>
        </div>
        <div class="toolbar-right">
          <button class="btn primary" onclick="openBookmarkletModal()">⚡ Đọc trực tiếp ServiceOS</button>
          <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu (Ctrl+V)</button>
          <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Nhập Excel ServiceOS</button>
          <button class="btn secondary" onclick="exportCheckXeExcel()">📥 Xuất Excel</button>
          <button class="btn danger" onclick="clearCheckXe()" title="Xóa toàn bộ dữ liệu xe hiện tại">🗑️</button>
          <input type="file" id="serviceOsFileInput" style="display:none" accept=".xlsx,.xls" onchange="handleServiceOsFileSelect(this.files)">
        </div>
      </div>

      <!-- 4 Thẻ KPI Chuẩn theo 4 Quy Tắc Nghiệp Vụ -->
      <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;padding:0 16px 16px">
        <div class="kpi-card" style="background:#fef2f2;border-color:#fecaca">
          <div class="kpi-label" style="color:#b91c1c">🔴 Chưa check (Cần xử lý)</div>
          <div class="kpi-val" style="color:#dc2626">${uncheckedList.length}</div>
          <div class="kpi-sub">Có lỗi · Chưa ghi chú · Chưa có bảng</div>
        </div>
        <div class="kpi-card" style="background:#fff7ed;border-color:#fed7aa">
          <div class="kpi-label" style="color:#c2410c">⚠️ Cần check lại</div>
          <div class="kpi-val" style="color:#ea580c">${recheckList.length}</div>
          <div class="kpi-sub">Có lỗi + Có ghi chú · Chưa có bảng</div>
        </div>
        <div class="kpi-card" style="background:#f0fdf4;border-color:#bbf7d0">
          <div class="kpi-label" style="color:#15803d">✅ Đã check xong</div>
          <div class="kpi-val" style="color:#16a34a">${checkedList.length}</div>
          <div class="kpi-sub">Đã có bảng cập nhật linh kiện/PIN</div>
        </div>
        <div class="kpi-card" style="background:#f8fafc;border-color:#e2e8f0">
          <div class="kpi-label" style="color:#475569">📋 Tổng trong xưởng</div>
          <div class="kpi-val" style="color:#0f172a">${totalAll}</div>
          <div class="kpi-sub">Theo dõi: ${totalIssue} xe phát sinh</div>
        </div>
      </div>
    </div>

    <!-- Hạng mục lỗi (UI pills giống y hệt ảnh người dùng gửi) -->
    <div class="custom-cat-container">
      <div class="custom-cat-header">Hạng mục lỗi</div>
      <div class="custom-cat-list">
        ${catPillsHtml}
      </div>
    </div>

    <!-- Thanh lọc theo ngày & Phạm vi -->
    <div class="date-filter-bar">
      <div style="font-size:12px;font-weight:700;color:var(--text-muted);display:flex;align-items:center;gap:4px">
        <span>📅</span> Lọc theo ngày:
      </div>
      ${datePillsHtml}
      <div style="margin-left:auto;display:flex;align-items:center;gap:8px">
        <span style="font-size:12px;color:var(--text-muted)">Phạm vi:</span>
        <button class="scope-toggle-btn ${state.checkXe.filterScope === 'issue_only' ? 'active' : ''}" onclick="setCheckXeScope('issue_only')">
          🔥 Xe diện bảo hành (${totalIssue})
        </button>
        <button class="scope-toggle-btn ${state.checkXe.filterScope === 'all' ? 'active' : ''}" onclick="setCheckXeScope('all')">
          Tất cả xe trong xưởng (${totalAll})
        </button>
      </div>
    </div>

    <!-- Bộ lọc trạng thái check theo 4 quy tắc, KTV và Tìm kiếm -->
    <div class="card" style="margin-bottom:14px;padding:12px 16px">
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <div style="display:flex;gap:4px">
          <button class="btn ${state.checkXe.filterStatus === 'all' ? '' : 'secondary'}" style="padding:4px 10px;font-size:12px" onclick="setCheckXeStatus('all')">
            Tất cả (${filtered.length})
          </button>
          <button class="btn ${state.checkXe.filterStatus === 'unchecked' ? '' : 'secondary'}" style="padding:4px 10px;font-size:12px;color:#dc2626;font-weight:600" onclick="setCheckXeStatus('unchecked')">
            🔴 Chưa check (${uncheckedList.length})
          </button>
          <button class="btn ${state.checkXe.filterStatus === 'recheck' ? '' : 'secondary'}" style="padding:4px 10px;font-size:12px;color:#ea580c;font-weight:600" onclick="setCheckXeStatus('recheck')">
            ⚠️ Cần check lại (${recheckList.length})
          </button>
          <button class="btn ${state.checkXe.filterStatus === 'checked' ? '' : 'secondary'}" style="padding:4px 10px;font-size:12px;color:#16a34a;font-weight:600" onclick="setCheckXeStatus('checked')">
            ✅ Đã check (${checkedList.length})
          </button>
        </div>

        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-size:12px;color:var(--text-muted)">KTV:</span>
          <select class="field-select" style="font-size:12px;padding:4px 8px;min-width:140px" onchange="setCheckXeTech(this.value)">
            <option value="">-- Tất cả KTV (${techs.length}) --</option>
            ${techs.map(t => `<option value="${esc(t)}" ${state.checkXe.filterTech === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}
          </select>
        </div>

        <div style="flex:1;min-width:200px">
          <input type="text" class="field-input" placeholder="🔍 Tìm biển số, VIN, mã WO, lỗi, ghi chú, serial..." style="width:100%;font-size:12px;padding:5px 10px" value="${esc(state.checkXe.searchQuery)}" oninput="setCheckXeSearch(this.value)">
        </div>
      </div>
    </div>

    <!-- Bảng danh sách xe -->
    <div class="card">
      <div class="card-header" style="padding:10px 16px">
        <div style="font-size:13px;font-weight:600;color:var(--text-muted)">
          Hiển thị <b>${filtered.length}</b> xe ${state.checkXe.filterDate !== 'all' ? `(Ngày: ${state.checkXe.filterDate})` : ''}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="width:40px">STT</th>
              <th style="width:130px">Biển số / Mã WO</th>
              <th style="width:130px">Dòng xe / VIN</th>
              <th style="width:130px">KTV phụ trách</th>
              <th style="min-width:180px">Hạng mục & Lỗi</th>
              <th style="min-width:200px">Bảng cập nhật phía dưới</th>
              <th style="min-width:180px">Ghi chú KTV</th>
              <th style="width:100px">Ngày nhận</th>
              <th style="width:120px">Trạng thái Check</th>
              <th style="width:80px">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--text-muted)">Không tìm thấy xe nào phù hợp với bộ lọc hiện tại.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Bóc tách Excel ServiceOS thông minh hỗ trợ đầy đủ 4 quy tắc
function parseServiceOsWorkbook(wb){
  let targetWs = null;
  for(const sn of wb.SheetNames){
    const normSn = norm(sn);
    if(normSn.includes('lenh sua chua') || normSn.includes('phieu sua chua') || normSn.includes('work order')){
      targetWs = wb.Sheets[sn];
      break;
    }
  }
  if(!targetWs) targetWs = wb.Sheets[wb.SheetNames[0]];
  const rows = sheetRows(targetWs);
  const hi = findHeaderRow(rows);
  if(hi < 0) return [];
  const H = rows[hi], map = buildColMap(H);
  
  const orders = [];
  for(let r = hi + 1; r < rows.length; r++){
    const row = rows[r]; if(!row || row.length === 0) continue;
    const plate = String(pickCol(map, row, ['bien so', 'bien so xe', 'bsx', 'bien']) || '').trim();
    const wo = String(pickCol(map, row, ['ma lenh sua chua', 'lenh sua chua', 'ma phieu', 'wo', 'dms_ro_code', 'code']) || '').trim();
    if(!plate && !wo) continue;
    
    const vin = String(pickCol(map, row, ['vin', 'so khung']) || '').trim();
    const vehicle = String(pickCol(map, row, ['dong xe', 'loai xe', 'model']) || '').trim();
    const customer = String(pickCol(map, row, ['khach hang', 'khach']) || '').trim();
    const tech = String(pickCol(map, row, ['ktv sua chua, bao hanh', 'ktv sua chua', 'ky thuat vien', 'ktv', 'tho']) || '').trim();
    
    // Hạng mục lỗi
    const issue = String(pickCol(map, row, ['hang muc loi', 'hang muc', 'noi dung kiem tra', 'noi dung sua chua', 'noi dung', 'loi', 'yeu cau khach hang', 'ly do vao xuong', 'trieu chung', 'chan doan']) || '').trim();
    
    // Ghi chú KTV
    const note = String(pickCol(map, row, ['ghi chu cua ky thuat vien', 'ghi chu cua quan doc & ky thuat vien', 'ghi chu cua quan doc', 'ghi chu ktv', 'ghi chu', 'chan doan cua ktv']) || '').trim();
    
    // Bảng cập nhật phía dưới
    const pinSerial = String(pickCol(map, row, ['serial pin', 'so serial pin', 'pin serial', 'pin_serial', 'battery_serial']) || '').trim();
    const motorSerial = String(pickCol(map, row, ['so may dong co', 'so may', 'serial dong co', 'motor_serial']) || '').trim();
    const removedAt = String(pickCol(map, row, ['ngay thao pin/dong co', 'ngay thao pin', 'ngay thao', 'removed_at']) || '').trim();
    const bhCode = String(pickCol(map, row, ['lenh bao hanh', 'ma lenh bao hanh', 'lenh bh', 'bh_code', 'bh_order_code']) || '').trim();
    const pinType = String(pickCol(map, row, ['loai sua chua pin', 'loai pin', 'pin_type']) || '').trim();
    
    const status = String(pickCol(map, row, ['trang thai', 'tinh trang', 'status']) || 'Trong xưởng').trim();
    const warrantyStatus = String(pickCol(map, row, ['trang thai bao hanh', 'tinh trang bao hanh', 'bao hanh', 'warranty']) || '').trim();
    const dateVal = parseDateVal(pickCol(map, row, ['ngay nhan xe', 'ngay nhan xe cho sc', 'ngay tao', 'ngay sua chua/bao hanh', 'ngay'])) || new Date();
    
    const o = normalizeOrder({
      id: 'ord_' + (wo || plate).replace(/[^a-zA-Z0-9]/g, '') + '_' + r,
      wo: wo || '—',
      plate: plate || '—',
      vin: vin || '—',
      vehicle: vehicle || '—',
      customer: customer || '—',
      tech: tech || 'Chưa phân công',
      issue: issue,
      note: note,
      status: status,
      warrantyStatus: warrantyStatus,
      pinSerial: pinSerial,
      motorSerial: motorSerial,
      removedAt: removedAt,
      bhCode: bhCode,
      pinType: pinType,
      dateStr: dateVal
    }, r);
    orders.push(o);
  }
  return orders;
}

function handleServiceOsFileSelect(files){
  if(!files || !files.length) return;
  const f = files[0];
  const reader = new FileReader();
  reader.onload = function(e){
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array' });
      const orders = parseServiceOsWorkbook(wb);
      if(!orders || !orders.length){
        alert('⚠️ Không nhận diện được dữ liệu xe từ file Excel này!');
        return;
      }
      state.checkXe.orders = orders;
      saveCheckXeOrders();
      renderCheckXe();
      alert(`🎉 ĐÃ NHẬP THÀNH CÔNG ${orders.length} XE TỪ FILE EXCEL SERVICEOS!`);
    } catch(err){
      alert('Lỗi đọc file Excel: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(f);
}
window.handleServiceOsFileSelect = handleServiceOsFileSelect;
window.parseServiceOsWorkbook = parseServiceOsWorkbook;

// URL Hash Auto-Import khi mở từ ServiceOS
function checkUrlImport(){
  const hash = window.location.hash;
  if(hash && hash.includes('serviceos=')){
    try {
      const idx = hash.indexOf('serviceos=');
      const raw = hash.slice(idx + 10);
      const jsonStr = decodeURIComponent(raw);
      const data = JSON.parse(jsonStr);
      if(Array.isArray(data) && data.length > 0){
        const orders = data.map((d, i) => normalizeOrder(d, i));
        state.checkXe.orders = orders;
        saveCheckXeOrders();
        if(typeof window.switchTab === 'function') window.switchTab('checkxe');
        try { history.replaceState(null, '', location.pathname); } catch(e){}
        setTimeout(() => {
          alert(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ${orders.length} XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!`);
        }, 120);
      }
    } catch(err){
      console.error('Error importing serviceos from URL hash:', err);
    }
  }
}

// Generate the 1-Click Console script for ServiceOS
function getConsoleSnippetCode(targetUrl){
  const cleanTarget = (targetUrl || window.location.href).split('#')[0];
  return `fetch('/api/work-orders?status=active&page=1&page_size=500',{credentials:'same-origin'}).then(r=>r.json()).then(d=>{const rows=d.rows||d.items||[];if(!rows.length){alert('⚠️ Không tìm thấy xe nào trong mục "Xe đang trong xưởng"!');return;}const orders=rows.map((w,i)=>({id:'ord_'+(w.code||i),wo:w.code||w.dms_ro_code||'—',plate:w.plate||'—',vin:w.vin||'—',vehicle:w.model||'—',customer:w.customer_name||'—',tech:w.technician_name||'Chưa phân công',issue:[w.source==='retail'?w.customer_name:'',w.faults&&w.faults.length?w.faults.join(', '):w.symptoms||''].filter(Boolean).join(' · ')||w.content||w.diag||'Kiểm tra',note:(w.foreman_note||'').trim(),status:w.status_label||w.status||'Trong xưởng',warrantyStatus:w.warranty_status||w.dms_warranty_status||'',pinSerial:w.battery_serial_old||w.battery_serial_new||'',motorSerial:w.motor_serial_old||w.motor_serial_new||'',removedAt:w.parts_removed_at||w.motor_removed_at||'',bhCode:w.bh_order_code||'',dateStr:(w.received_at||w.created_at||'').slice(0,10)||new Date().toISOString().slice(0,10)}));const json=JSON.stringify(orders);try{navigator.clipboard.writeText(json)}catch(e){}const targetUrl='${cleanTarget}#serviceos='+encodeURIComponent(json);const win=window.open(targetUrl,'_blank');let toast=document.getElementById('bh-toast');if(!toast){toast=document.createElement('div');toast.id='bh-toast';toast.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:#059669;color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;font-weight:bold;box-shadow:0 8px 24px rgba(0,0,0,0.3);font-family:sans-serif;';document.body.appendChild(toast);}toast.innerHTML='✅ Đã lấy '+orders.length+' xe trong xưởng! Đang mở tab Bảo Hành PRO...';setTimeout(()=>toast.remove(),4000);if(!win){alert('⚡ Đã lấy '+orders.length+' xe! Vui lòng mở lại tab Bảo Hành PRO và bấm "📋 Dán từ ServiceOS (Ctrl+V)".');}}).catch(err=>alert('Lỗi: '+err.message));`;
}

// Generate Userscript for Tampermonkey
function getUserscriptCode(targetUrl){
  const cleanTarget = (targetUrl || window.location.href).split('#')[0];
  return `// ==UserScript==
// @name         Bảo Hành PRO - Đồng bộ ServiceOS
// @namespace    https://phan-tich-bao-hanh.pages.dev/
// @version      2.0
// @description  Tự động thêm nút lấy xe trực tiếp từ ServiceOS Dashboard sang Bảo Hành PRO
// @match        https://att-serviceos.anthinhtech.vn/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  function injectBtn() {
    if (document.getElementById('btn-sync-baohanhpro')) return;
    const btn = document.createElement('button');
    btn.id = 'btn-sync-baohanhpro';
    btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;padding:12px 22px;border-radius:50px;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 20px rgba(37,99,235,0.45);display:flex;align-items:center;gap:8px;transition:all 0.2s;font-family:sans-serif;';
    btn.onmouseover = () => btn.style.transform = 'translateY(-2px) scale(1.03)';
    btn.onmouseout = () => btn.style.transform = 'translateY(0) scale(1)';
    btn.onclick = async function() {
      btn.innerHTML = '⏳ Đang đọc trực tiếp ServiceOS...';
      try {
        const res = await fetch('/api/work-orders?status=active&page=1&page_size=500', { credentials: 'same-origin' });
        const d = await res.json();
        const rows = d.rows || d.items || [];
        if (!rows.length) { alert('⚠️ Không có xe nào trong mục "Xe đang trong xưởng"!'); btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO'; return; }
        const orders = rows.map((w, i) => ({
          id: 'ord_' + (w.code || i),
          wo: w.code || w.dms_ro_code || '—',
          plate: w.plate || '—',
          vin: w.vin || '—',
          vehicle: w.model || '—',
          customer: w.customer_name || '—',
          tech: w.technician_name || 'Chưa phân công',
          issue: [w.source === 'retail' ? w.customer_name : '', (w.faults && w.faults.length) ? w.faults.join(', ') : (w.symptoms || '')].filter(Boolean).join(' · ') || w.content || w.diag || 'Kiểm tra',
          note: (w.foreman_note || '').trim(),
          status: w.status_label || w.status || 'Trong xưởng',
          warrantyStatus: w.warranty_status || w.dms_warranty_status || '',
          pinSerial: w.battery_serial_old || w.battery_serial_new || '',
          motorSerial: w.motor_serial_old || w.motor_serial_new || '',
          removedAt: w.parts_removed_at || w.motor_removed_at || '',
          bhCode: w.bh_order_code || '',
          dateStr: (w.received_at || w.created_at || '').slice(0, 10) || new Date().toISOString().slice(0, 10)
        }));
        const json = JSON.stringify(orders);
        try { navigator.clipboard.writeText(json); } catch(e){}
        const targetUrl = '${cleanTarget}#serviceos=' + encodeURIComponent(json);
        window.open(targetUrl, '_blank');
        btn.innerHTML = '✅ Đã gửi ' + orders.length + ' xe!';
        setTimeout(() => btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO', 3500);
      } catch(e) {
        alert('Lỗi: ' + e.message);
        btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO';
      }
    };
    document.body.appendChild(btn);
  }
  setInterval(injectBtn, 1500);
})();`;
}

// 1-Click Sync flow: Copies code and opens ServiceOS
window.runOneClickSyncFlow = function(){
  const targetUrl = window.location.href.split('#')[0];
  const code = getConsoleSnippetCode(targetUrl);
  
  const finish = () => {
    window.open('https://att-serviceos.anthinhtech.vn/#/dashboard', '_blank');
    alert('📋 ĐÃ TỰ ĐỘNG COPY MÃ LẤY XE VÀO BỘ NHỚ TẠM & MỞ SERVICEOS Ở TAB MỚI!\n\n👉 Bạn chỉ cần:\n1. Sang tab ServiceOS vừa mở.\n2. Nhấn phím F12 (Console) -> Nhấn Ctrl+V -> Nhấn Enter.\n⚡ Danh sách xe đang trong xưởng sẽ tự động mở ra ở tab Bảo Hành PRO!');
  };

  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(finish).catch(finish);
  } else {
    finish();
  }
};

window.copyConsoleSnippetCode = function(){
  const targetUrl = window.location.href.split('#')[0];
  const code = getConsoleSnippetCode(targetUrl);
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(() => {
      alert('📋 Đã sao chép mã Console vào bộ nhớ tạm!\nSang tab ServiceOS -> Nhấn F12 (Console) -> Dán (Ctrl+V) -> Enter.');
    });
  } else {
    prompt('Sao chép mã Console dưới đây:', code);
  }
};

window.showUserscriptGuide = function(){
  const targetUrl = window.location.href.split('#')[0];
  const box = $('#userscriptCodeBox');
  if(box) box.value = getUserscriptCode(targetUrl);
  const m = $('#modalUserscript');
  if(m) m.hidden = false;
};

window.copyUserscriptCode = function(){
  const targetUrl = window.location.href.split('#')[0];
  const code = getUserscriptCode(targetUrl);
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(() => {
      alert('📋 Đã sao chép mã Userscript! Hãy mở Tampermonkey và dán vào script mới.');
    });
  } else {
    prompt('Sao chép mã Userscript dưới đây:', code);
  }
};

function parseServiceOsText(rawText){
  if(!rawText || !rawText.trim()) return null;
  const str = rawText.trim();
  
  // 1. Try JSON
  if(str.startsWith('[') || str.startsWith('{')){
    try {
      const parsed = JSON.parse(str);
      const arr = Array.isArray(parsed) ? parsed : (parsed.rows || parsed.items || []);
      if(arr.length > 0) return arr;
    } catch(e){}
  }
  
  // 2. Try Tab-Separated or Line-Separated Table Text
  const lines = str.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if(lines.length >= 2){
    let headerIdx = -1;
    let colMap = {};
    for(let i = 0; i < Math.min(lines.length, 5); i++){
      const parts = lines[i].split('\t').map(p => p.trim().toLowerCase());
      if(parts.some(p => p.includes('biển') || p.includes('phiếu') || p.includes('lệnh') || p.includes('plate') || p.includes('code') || p.includes('ktv'))){
        headerIdx = i;
        parts.forEach((p, cIdx) => {
          if(p.includes('biển') || p.includes('plate')) colMap.plate = cIdx;
          else if(p.includes('mã') || p.includes('lệnh') || p.includes('phiếu') || p.includes('code') || p.includes('ro')) colMap.wo = cIdx;
          else if(p.includes('loại xe') || p.includes('dòng') || p.includes('model')) colMap.model = cIdx;
          else if(p.includes('khung') || p.includes('vin')) colMap.vin = cIdx;
          else if(p.includes('ktv') || p.includes('kỹ thuật') || p.includes('tech')) colMap.tech = cIdx;
          else if(p.includes('ghi chú') || p.includes('foreman') || p.includes('quản đốc')) colMap.note = cIdx;
          else if(p.includes('hạng mục') || p.includes('lỗi') || p.includes('nội dung') || p.includes('triệu chứng') || p.includes('diag') || p.includes('content')) colMap.issue = cIdx;
          else if(p.includes('trạng thái') || p.includes('status')) colMap.status = cIdx;
          else if(p.includes('bảo hành') || p.includes('warranty')) colMap.warranty = cIdx;
          else if(p.includes('serial pin') || p.includes('pin_serial')) colMap.pinSerial = cIdx;
          else if(p.includes('số máy') || p.includes('motor_serial')) colMap.motorSerial = cIdx;
          else if(p.includes('ngày') || p.includes('nhận') || p.includes('date')) colMap.date = cIdx;
        });
        break;
      }
    }
    
    if(headerIdx !== -1 && (colMap.plate !== undefined || colMap.wo !== undefined)){
      const result = [];
      for(let i = headerIdx + 1; i < lines.length; i++){
        const cells = lines[i].split('\t');
        const plate = colMap.plate !== undefined ? (cells[colMap.plate] || '').trim() : '';
        const wo = colMap.wo !== undefined ? (cells[colMap.wo] || '').trim() : '';
        if(!plate && !wo) continue;
        const note = colMap.note !== undefined ? (cells[colMap.note] || '').trim() : '';
        const issue = colMap.issue !== undefined ? (cells[colMap.issue] || 'Kiểm tra').trim() : 'Kiểm tra';
        const status = colMap.status !== undefined ? (cells[colMap.status] || 'Trong xưởng').trim() : 'Trong xưởng';
        const warranty = colMap.warranty !== undefined ? (cells[colMap.warranty] || '').trim() : '';
        const pinSerial = colMap.pinSerial !== undefined ? (cells[colMap.pinSerial] || '').trim() : '';
        const motorSerial = colMap.motorSerial !== undefined ? (cells[colMap.motorSerial] || '').trim() : '';
        const rawDate = colMap.date !== undefined ? (cells[colMap.date] || '').trim() : '';
        
        result.push(normalizeOrder({
          id: 'ord_' + (wo || plate || i).replace(/[^a-zA-Z0-9]/g, '') + '_' + i,
          wo: wo || '—',
          plate: plate || '—',
          vin: colMap.vin !== undefined ? (cells[colMap.vin] || '—').trim() : '—',
          vehicle: colMap.model !== undefined ? (cells[colMap.model] || '—').trim() : '—',
          customer: '—',
          tech: colMap.tech !== undefined ? (cells[colMap.tech] || 'Chưa phân công').trim() : 'Chưa phân công',
          issue: issue,
          note: note,
          status: status,
          warrantyStatus: warranty,
          pinSerial: pinSerial,
          motorSerial: motorSerial,
          dateStr: rawDate
        }, i));
      }
      if(result.length > 0) return result;
    }
  }
  return null;
}

window.importServiceOsClipboard = async function(){
  try {
    let text = '';
    if(navigator.clipboard && navigator.clipboard.readText){
      try { text = await navigator.clipboard.readText(); } catch(err){}
    }
    if(!text || (!text.trim().startsWith('[') && !text.includes('\t'))){
      text = prompt('📋 Dán (Ctrl+V) dữ liệu xe từ ServiceOS vào ô bên dưới:\n(Chấp nhận mã lấy từ Console, hoặc bảng copy từ ServiceOS)');
    }
    if(!text || !text.trim()) return;
    
    const parsed = parseServiceOsText(text);
    if(!parsed || !parsed.length){
      alert('⚠️ Không nhận diện được dữ liệu xe từ nội dung bạn vừa dán.\n\nVui lòng thử lại bằng cách chọn file Excel hoặc chạy lệnh Console!');
      return;
    }
    
    const orders = parsed.map((d, i) => normalizeOrder(d, i));
    state.checkXe.orders = orders;
    saveCheckXeOrders();
    renderCheckXe();
    if(typeof window.switchTab === 'function') window.switchTab('checkxe');
    closeBookmarkletModal();
    alert(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ${orders.length} XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!`);
  } catch(e) {
    alert('Lỗi đọc dữ liệu: ' + e.message);
  }
};

// Global paste listener on checkxe tab
window.addEventListener('paste', function(e){
  const navTab = document.querySelector('.nav-tab.active');
  const curTab = navTab ? navTab.dataset.tab : '';
  if(curTab === 'checkxe'){
    const target = e.target;
    if(target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
    const clipboardData = e.clipboardData || window.clipboardData;
    if(clipboardData){
      const text = clipboardData.getData('text');
      if(text){
        const parsed = parseServiceOsText(text);
        if(parsed && parsed.length > 0){
          e.preventDefault();
          const orders = parsed.map((d, i) => normalizeOrder(d, i));
          state.checkXe.orders = orders;
          saveCheckXeOrders();
          renderCheckXe();
          alert(`🎉 ĐÃ DÁN THÀNH CÔNG ${orders.length} XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!`);
        }
      }
    }
  }
});

function initBookmarkletCode(){
  const box = $('#bmConsoleCodeBox');
  if(box) box.value = getConsoleSnippetCode();
  const btn = $('#bookmarkletLink');
  if(btn) btn.href = 'javascript:void(0);';
}
'''

text = text[:checkxe_start] + new_checkxe_engine + text[checkxe_end:]

with io.open(TPL_FILE, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Updated app_template2.html! Total length: {len(text)}")
