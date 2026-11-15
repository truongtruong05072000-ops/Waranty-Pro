# -*- coding: utf-8 -*-
import io, os, sys, re

BASE = os.path.dirname(os.path.abspath(__file__))
TPL_FILE = os.path.join(BASE, 'app_template2.html')

with io.open(TPL_FILE, 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = '/* ============================ Check Xe Hàng Ngày (ServiceOS) ============================ */'
end_marker = '/* ============================ Navigation ============================ */'

idx_start = text.find(start_marker)
idx_end = text.find(end_marker, idx_start)

assert idx_start != -1 and idx_end != -1, "CheckXe markers not found in template"

new_full_checkxe_code = r'''/* ============================ Check Xe Hàng Ngày (ServiceOS) ============================ */
// 12 Hạng mục lỗi chuẩn theo yêu cầu nghiệp vụ
const ISSUE_CATEGORIES = [
  { id: 'all', name: 'Tất cả hạng mục', icon: '📋' },
  { id: 'topcover', name: 'Lỗi nút TopCover', icon: '🔘', keywords: ['topcover', 'top cover', 'nút top', 'nut top'] },
  { id: 'motor', name: 'Lỗi động cơ', icon: '⚡', keywords: ['động cơ', 'dong co', 'motor'] },
  { id: 'rear_shock', name: 'Lỗi giảm sóc sau', icon: '🛞', keywords: ['giảm sóc sau', 'giảm xóc sau', 'giam soc sau', 'giam xoc sau', 'phuộc sau', 'nhún sau'] },
  { id: 'front_shock', name: 'Lỗi giảm xóc trước', icon: '🚲', keywords: ['giảm xóc trước', 'giảm sóc trước', 'giam xoc truoc', 'giam soc truoc', 'phuộc trước', 'nhún trước'] },
  { id: 'pin', name: 'Lỗi PIN', icon: '🔋', keywords: ['pin', 'battery', 'bms', 'cell'] },
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
  filterStatus: 'all',     // 'all', 'unchecked', 'checked'
  filterScope: 'eligible', // 'eligible' (mặc định: chỉ xe cần check lỗi), 'all' (tất cả xe trong xưởng)
  filterDate: 'all',       // 'all', 'today', 'yesterday', 'last7', or 'YYYY-MM-DD'
  filterTech: '',
  searchQuery: ''
};

// Đánh giá xe có thuộc diện "Xe cần check lỗi" hay không:
// 1. Hạng mục lỗi có chứa từ "lỗi"
// 2. Trạng thái KHÔNG PHẢI là "đã hoàn thành" và "GSM đã nghiệm thu"
// 3. Trạng thái bảo hành phải là dữ liệu trống hoặc "chờ kiểm tra"
function isOrderEligible(o){
  // 1. Hạng mục lỗi có chứa từ "lỗi"
  const issueText = String(o.issue || '').toLowerCase();
  const partsText = Array.isArray(o.parts) ? o.parts.join(' ').toLowerCase() : '';
  const fullText = (issueText + ' ' + partsText).trim();
  const hasLoi = fullText.includes('lỗi') || fullText.includes('loi');
  if(!hasLoi) return false;

  // 2. Trạng thái không phải là đã hoàn thành và GSM đã nghiệm thu
  const st = String(o.status || '').toLowerCase().trim();
  const isCompleted = st === 'hoàn thành' || st === 'đã hoàn thành' || st === 'done' || st === 'completed';
  const isGsmAccepted = st === 'gsm đã nghiệm thu' || st === 'đã nghiệm thu' || st === 'gsm_received' || st.includes('nghiệm thu');
  if(isCompleted || isGsmAccepted) return false;

  // 3. Trạng thái bảo hành phải là dữ liệu trống và chờ kiểm tra
  const ws = String(o.warrantyStatus || '').toLowerCase().trim();
  const isEmptyWs = !ws || ws === '—' || ws === '-' || ws === 'none' || ws === 'null' || ws === 'undefined' || ws === 'trống' || ws.includes('chưa cập nhật');
  const isCheckingWs = ws === 'checking' || ws === 'chờ kiểm tra' || ws.includes('chờ kiểm tra');
  if(!isEmptyWs && !isCheckingWs) return false;

  return true;
}

// Kiểm tra xe đã check hay chưa theo Ghi chú KTV
function isOrderChecked(note){
  const s = String(note ?? '').trim().toLowerCase();
  if(!s || s === '—' || s === '-' || s === 'none' || s === 'null' || s === 'undefined' || s === 'chưa' || s === 'chưa check' || s === 'chưa kiểm tra') return false;
  return true;
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
function categorizeIssue(issueText, partsList){
  const txt = (String(issueText || '') + ' ' + (Array.isArray(partsList) ? partsList.join(' ') : '')).toLowerCase();

  for(let i = 1; i < ISSUE_CATEGORIES.length - 1; i++){
    const cat = ISSUE_CATEGORIES[i];
    if(cat.keywords.some(kw => txt.includes(kw))){
      return cat;
    }
  }
  return ISSUE_CATEGORIES[ISSUE_CATEGORIES.length - 1]; // Lỗi khác
}

function normalizeOrder(d, i){
  let wo, plate, vin, vehicle, customer, tech, issue, parts, note, status, warrantyStatus, dateStr;
  if(Array.isArray(d)){
    [wo, plate, vin, vehicle, tech, issue, note, status, dateStr, warrantyStatus] = d;
    customer = '—';
    parts = [];
  } else {
    wo = d.wo; plate = d.plate; vin = d.vin; vehicle = d.vehicle;
    customer = d.customer; tech = d.tech; issue = d.issue; parts = d.parts || [];
    note = d.note; status = d.status; warrantyStatus = d.warrantyStatus; dateStr = d.dateStr;
  }
  note = String(note || '').trim();
  issue = String(issue || 'Kiểm tra sửa chữa').trim();
  status = String(status || 'Trong xưởng').trim();
  warrantyStatus = String(warrantyStatus || '').trim();
  
  const rawDate = dateStr || new Date().toISOString().slice(0, 10);
  const isoDate = formatIsoDate(rawDate) || new Date().toISOString().slice(0, 10);
  const dispDate = formatDisplayDate(isoDate);

  const order = {
    id: (d && d.id) || ('ord_' + (wo || plate || i).replace(/[^a-zA-Z0-9]/g, '') + '_' + i),
    wo: wo || '—',
    plate: plate || '—',
    vin: vin || '—',
    vehicle: vehicle || '—',
    customer: customer || '—',
    tech: tech || 'Chưa phân công',
    issue: issue,
    parts: parts,
    note: note,
    status: status,
    warrantyStatus: warrantyStatus,
    dateStr: dispDate,
    isoDate: isoDate,
    isChecked: isOrderChecked(note)
  };
  order.category = categorizeIssue(issue, parts);
  order.isEligible = isOrderEligible(order);
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

// Kiểm tra ngày lọc
function isDateMatch(isoOrder, filterDate){
  if(!filterDate || filterDate === 'all') return true;
  if(!isoOrder) return true;

  const today = formatIsoDate(new Date());
  if(filterDate === 'today'){
    return isoOrder === today;
  }
  if(filterDate === 'yesterday'){
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    return isoOrder === formatIsoDate(yest);
  }
  if(filterDate === 'last7'){
    const limit = new Date();
    limit.setDate(limit.getDate() - 7);
    return isoOrder >= formatIsoDate(limit);
  }
  return isoOrder === filterDate;
}

// Modal Handlers
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
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Trạng thái: <b>${esc(o.status)}</b> · Bảo hành: <b>${esc(o.warrantyStatus || 'Trống')}</b> · Ngày: ${esc(o.dateStr)}</div>
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
  order.isChecked = isOrderChecked(newNote);
  order.isEligible = isOrderEligible(order);
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
  order.isChecked = true;
  order.isEligible = isOrderEligible(order);
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
    ['STT', 'Biển số', 'Mã lệnh WO', 'Số khung VIN', 'Loại xe', 'KTV phụ trách', 'Hạng mục lỗi chuẩn', 'Nội dung lỗi chi tiết', 'Trạng thái lệnh', 'Trạng thái bảo hành', 'Ngày nhận xe', 'Trạng thái check', 'Ghi chú KTV', 'Trong diện cần check lỗi']
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
      o.status,
      o.warrantyStatus || '—',
      o.dateStr,
      o.isChecked ? 'ĐÃ CHECK' : 'CHƯA CHECK',
      o.note || '—',
      o.isEligible ? 'ĐỦ ĐIỀU KIỆN (CẦN CHECK)' : 'KHÔNG'
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
  
  // Xe trong diện cần check lỗi theo 3 tiêu chí:
  const eligibleOrders = allOrders.filter(o => o.isEligible);
  const totalEligible = eligibleOrders.length;
  const uncheckedEligible = eligibleOrders.filter(o => !o.isChecked).length;
  const checkedEligible = totalEligible - uncheckedEligible;
  const pctEligible = totalEligible > 0 ? Math.round((checkedEligible / totalEligible) * 100) : 0;

  // Cập nhật Badge trên Menu Tab & Context Bar
  const bEl = $('#badgeUncheckedCount');
  if(bEl){
    bEl.textContent = uncheckedEligible;
    bEl.style.display = uncheckedEligible > 0 ? 'inline-block' : 'none';
  }
  const ctxChip = $('#ctxCheckXeChip');
  const ctxVal = $('#ctxUncheckedVal');
  if(ctxChip && ctxVal){
    if(totalAll > 0){
      ctxChip.style.display = 'inline-flex';
      ctxVal.textContent = uncheckedEligible + ' / ' + totalEligible;
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
            <div class="card-subtitle">Lọc xe theo 12 hạng mục lỗi chuẩn · Quản lý trạng thái check theo Ghi chú KTV & theo ngày</div>
          </div>
          <div class="toolbar-right">
            <button class="btn primary" onclick="openBookmarkletModal()">⚡ Lấy xe trong xưởng (ServiceOS)</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu (Ctrl+V)</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Nhập Excel ServiceOS</button>
            <input type="file" id="serviceOsFileInput" style="display:none" accept=".xlsx,.xls" onchange="handleServiceOsFileSelect(this.files)">
          </div>
        </div>

        <div class="empty-state">
          <div class="empty-state-icon">🛵</div>
          <h3 style="font-size:16px;color:var(--text-main);margin-bottom:6px">Chưa có dữ liệu xe từ ServiceOS</h3>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:18px;max-width:560px;margin-left:auto;margin-right:auto;line-height:1.5">
            Bấm nút <b>"⚡ Lấy xe trong xưởng (ServiceOS)"</b> để nạp xe chỉ với 1 thao tác F12 Console, dán trực tiếp phím <b>Ctrl + V</b>, hoặc tải file Excel từ ServiceOS thả vào đây.
          </p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn primary" onclick="openBookmarkletModal()">⚡ Lấy xe trong xưởng ServiceOS</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu đã copy (Ctrl+V)</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Chọn file Excel Lệnh Sửa Chữa</button>
          </div>
        </div>
      </div>`;
    return;
  }

  // Tập dữ liệu theo phạm vi lọc: 'eligible' (mặc định) hoặc 'all'
  const scopeOrders = state.checkXe.filterScope === 'eligible' ? eligibleOrders : allOrders;

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
    if(!dateCounts[k]) dateCounts[k] = { total: 0, checked: 0, unchecked: 0, disp: o.dateStr };
    dateCounts[k].total++;
    if(o.isChecked) dateCounts[k].checked++;
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
  if(state.checkXe.filterStatus === 'unchecked'){
    filtered = filtered.filter(o => !o.isChecked);
  } else if(state.checkXe.filterStatus === 'checked'){
    filtered = filtered.filter(o => o.isChecked);
  }
  if(state.checkXe.filterDate !== 'all'){
    filtered = filtered.filter(o => isDateMatch(o.isoDate, state.checkXe.filterDate));
  }
  if(state.checkXe.filterTech){
    filtered = filtered.filter(o => o.tech === state.checkXe.filterTech);
  }
  if(state.checkXe.searchQuery){
    const q = norm(state.checkXe.searchQuery);
    filtered = filtered.filter(o => norm(o.plate + ' ' + o.wo + ' ' + o.vin + ' ' + o.tech + ' ' + o.issue + ' ' + o.note + ' ' + o.status + ' ' + o.warrantyStatus).includes(q));
  }

  // Danh sách KTV cho bộ lọc
  const techs = [...new Set(allOrders.map(o => o.tech).filter(Boolean))].sort();

  // Bảng các dòng xe
  const rowsHtml = filtered.map((o, idx) => {
    const originalIndex = allOrders.indexOf(o);
    const isElig = o.isEligible;
    return `
      <tr class="${o.isChecked ? 'row-checked' : 'row-unchecked'}" style="${!isElig ? 'opacity:0.75;background:#f8fafc' : ''}">
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
        <td class="l">
          <div style="font-weight:600;font-size:12px;color:#1e293b">${esc(o.status)}</div>
          <div style="font-size:11px;color:var(--text-muted)">BH: <b style="color:${o.warrantyStatus ? '#2563eb' : '#64748b'}">${esc(o.warrantyStatus || 'Trống')}</b></div>
        </td>
        <td class="l">
          <div style="font-size:12.5px;font-weight:600;color:var(--text-main)">📅 ${esc(o.dateStr)}</div>
        </td>
        <td class="l">
          ${o.isChecked ? 
            `<span class="status-pill checked">✅ ĐÃ CHECK</span>` : 
            `<span class="status-pill unchecked">🔴 CHƯA CHECK</span>`
          }
        </td>
        <td class="l part-name-cell">
          ${o.isChecked ? 
            `<div style="font-weight:600;color:#15803d;font-size:12.5px">${esc(o.note)}</div>` : 
            `<div style="display:flex;align-items:center;gap:6px">
               <span style="color:#94a3b8;font-style:italic;font-size:12px">Chưa có ghi chú KTV</span>
               <button class="btn primary" style="padding:2px 8px;font-size:11px" onclick="quickCheckOrder(${originalIndex})" title="Đánh dấu đã check ngay">⚡ Check</button>
             </div>`
          }
        </td>
        <td class="l">
          <button class="btn secondary" style="padding:4px 8px;font-size:11.5px" onclick="openEditNoteModal(${originalIndex})" title="Cập nhật ghi chú kiểm tra">
            ✏️ Ghi chú
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
        <button class="date-chip ${isAct ? 'active' : ''}" onclick="setCheckXeDate('${iso}')" title="${d.checked} đã check, ${d.unchecked} chưa check">
          ${d.disp} (${d.total})${d.unchecked > 0 ? ` <span style="color:#dc2626;font-weight:700">· 🔴${d.unchecked}</span>` : ' · ✅'}
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
    </style>

    <!-- Thẻ Tiêu đề & Toolbar -->
    <div class="card" style="margin-bottom:14px">
      <div class="card-header">
        <div>
          <div class="card-title">🔍 Check lỗi xe hàng ngày — Dữ liệu ServiceOS</div>
          <div class="card-subtitle">
            Tiêu chuẩn xe cần check: <b>Chứa từ "lỗi"</b> · <b>Chưa hoàn thành / chưa nghiệm thu GSM</b> · <b>Bảo hành trống / chờ kiểm tra</b>
          </div>
        </div>
        <div class="toolbar-right">
          <button class="btn primary" onclick="openBookmarkletModal()">⚡ Lấy xe trong xưởng (ServiceOS)</button>
          <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu (Ctrl+V)</button>
          <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Nhập Excel ServiceOS</button>
          <button class="btn secondary" onclick="exportCheckXeExcel()">📥 Xuất Excel</button>
          <button class="btn danger" onclick="clearCheckXe()" title="Xóa toàn bộ dữ liệu xe hiện tại">🗑️</button>
          <input type="file" id="serviceOsFileInput" style="display:none" accept=".xlsx,.xls" onchange="handleServiceOsFileSelect(this.files)">
        </div>
      </div>

      <!-- Thống kê tổng quan -->
      <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;padding:0 16px 16px">
        <div class="kpi-card" style="background:#fff7ed;border-color:#fed7aa">
          <div class="kpi-label" style="color:#c2410c">🔴 Xe cần check lỗi</div>
          <div class="kpi-val" style="color:#ea580c">${totalEligible}</div>
          <div class="kpi-sub">Đủ 3 điều kiện nghiệp vụ</div>
        </div>
        <div class="kpi-card" style="background:#fef2f2;border-color:#fecaca">
          <div class="kpi-label" style="color:#b91c1c">⏳ Chưa check (cần xử lý)</div>
          <div class="kpi-val" style="color:#dc2626">${uncheckedEligible}</div>
          <div class="kpi-sub">Ghi chú KTV đang để trống</div>
        </div>
        <div class="kpi-card" style="background:#f0fdf4;border-color:#bbf7d0">
          <div class="kpi-label" style="color:#15803d">✅ Đã check xong</div>
          <div class="kpi-val" style="color:#16a34a">${checkedEligible}</div>
          <div class="kpi-sub">Đã có nội dung ghi chú KTV</div>
        </div>
        <div class="kpi-card" style="background:#eff6ff;border-color:#bfdbfe">
          <div class="kpi-label" style="color:#1d4ed8">📊 Tiến độ check lỗi</div>
          <div class="kpi-val" style="color:#2563eb">${pctEligible}%</div>
          <div class="kpi-sub">Tổng trong xưởng: ${totalAll} xe</div>
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
        <button class="scope-toggle-btn ${state.checkXe.filterScope === 'eligible' ? 'active' : ''}" onclick="setCheckXeScope('eligible')">
          🔥 Chỉ xe cần check (${totalEligible})
        </button>
        <button class="scope-toggle-btn ${state.checkXe.filterScope === 'all' ? 'active' : ''}" onclick="setCheckXeScope('all')">
          Tất cả xe trong xưởng (${totalAll})
        </button>
      </div>
    </div>

    <!-- Bộ lọc trạng thái check, KTV và Tìm kiếm -->
    <div class="card" style="margin-bottom:14px;padding:12px 16px">
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <div style="display:flex;gap:4px">
          <button class="btn ${state.checkXe.filterStatus === 'all' ? '' : 'secondary'}" style="padding:4px 10px;font-size:12px" onclick="setCheckXeStatus('all')">
            Tất cả (${filtered.length})
          </button>
          <button class="btn ${state.checkXe.filterStatus === 'unchecked' ? '' : 'secondary'}" style="padding:4px 10px;font-size:12px;color:#dc2626;font-weight:600" onclick="setCheckXeStatus('unchecked')">
            🔴 Chưa check
          </button>
          <button class="btn ${state.checkXe.filterStatus === 'checked' ? '' : 'secondary'}" style="padding:4px 10px;font-size:12px;color:#16a34a;font-weight:600" onclick="setCheckXeStatus('checked')">
            ✅ Đã check
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
          <input type="text" class="field-input" placeholder="🔍 Tìm biển số, VIN, mã WO, lỗi, ghi chú..." style="width:100%;font-size:12px;padding:5px 10px" value="${esc(state.checkXe.searchQuery)}" oninput="setCheckXeSearch(this.value)">
        </div>
      </div>
    </div>

    <!-- Bảng danh sách xe -->
    <div class="card">
      <div class="card-header" style="padding:10px 16px">
        <div style="font-size:13px;font-weight:600;color:var(--text-muted)">
          Hiển thị <b>${filtered.length}</b> xe ${state.checkXe.filterDate !== 'all' ? `(Ngày: ${state.checkXe.filterDate})` : ''} · ${state.checkXe.filterScope === 'eligible' ? '<span style="color:#ea580c">Chỉ xe trong diện cần check</span>' : 'Toàn bộ xe trong xưởng'}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="width:40px">STT</th>
              <th style="width:130px">Biển số / Mã WO</th>
              <th style="width:140px">Dòng xe / VIN</th>
              <th style="width:140px">KTV phụ trách</th>
              <th style="min-width:220px">Hạng mục & Lỗi</th>
              <th style="width:140px">Trạng thái / Bảo hành</th>
              <th style="width:110px">Ngày nhận xe</th>
              <th style="width:120px">Trạng thái Check</th>
              <th style="min-width:220px">Ghi chú KTV (Dữ liệu check)</th>
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

// Bóc tách Excel ServiceOS
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
    const wo = String(pickCol(map, row, ['ma lenh sua chua', 'lenh sua chua', 'ma phieu', 'wo', 'dms_ro_code']) || '').trim();
    if(!plate && !wo) continue;
    
    const vin = String(pickCol(map, row, ['vin', 'so khung']) || '').trim();
    const vehicle = String(pickCol(map, row, ['dong xe', 'loai xe', 'model']) || '').trim();
    const customer = String(pickCol(map, row, ['khach hang', 'khach']) || '').trim();
    const tech = String(pickCol(map, row, ['ktv sua chua, bao hanh', 'ktv sua chua', 'ky thuat vien', 'ktv', 'tho']) || '').trim();
    const issue = String(pickCol(map, row, ['hang muc loi', 'hang muc', 'noi dung sua chua', 'yeu cau khach hang', 'ly do vao xuong', 'trieu chung', 'mo ta']) || '').trim();
    const note = String(pickCol(map, row, ['ghi chu cua quan doc & ky thuat vien', 'ghi chu cua quan doc', 'ghi chu ktv', 'ghi chu', 'chan doan']) || '').trim();
    const status = String(pickCol(map, row, ['trang thai', 'tinh trang', 'status']) || 'Trong xưởng').trim();
    const warrantyStatus = String(pickCol(map, row, ['trang thai bao hanh', 'tinh trang bao hanh', 'bao hanh', 'warranty', 'bh_order_status']) || '').trim();
    const dateVal = parseDateVal(pickCol(map, row, ['ngay nhan xe', 'ngay nhan xe cho sc', 'ngay tao', 'ngay sua chua/bao hanh', 'ngay'])) || new Date();
    
    const o = normalizeOrder({
      id: 'ord_' + (wo || plate).replace(/[^a-zA-Z0-9]/g, '') + '_' + r,
      wo: wo || '—',
      plate: plate || '—',
      vin: vin || '—',
      vehicle: vehicle || '—',
      customer: customer || '—',
      tech: tech || 'Chưa phân công',
      issue: issue || 'Kiểm tra sửa chữa',
      parts: [],
      note: note,
      status: status,
      warrantyStatus: warrantyStatus,
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
  return `fetch('/api/work-orders?status=active&page=1&page_size=250',{credentials:'same-origin'}).then(r=>r.json()).then(d=>{const rows=d.rows||d.items||[];if(!rows.length){alert('⚠️ Không tìm thấy xe nào trong mục "Xe đang trong xưởng"!');return;}const orders=rows.map((w,i)=>({id:'ord_'+(w.code||i),wo:w.code||w.dms_ro_code||'—',plate:w.plate||'—',vin:w.vin||'—',vehicle:w.model||'—',customer:w.customer_name||'—',tech:w.technician_name||'Chưa phân công',issue:[w.source==='retail'?w.customer_name:'',w.faults&&w.faults.length?w.faults.join(', '):w.symptoms||''].filter(Boolean).join(' · ')||w.content||w.diag||'Kiểm tra',note:(w.foreman_note||'').trim(),status:w.status_label||w.status||'Trong xưởng',warrantyStatus:w.warranty_status||w.dms_warranty_status||'',dateStr:(w.received_at||w.created_at||'').slice(0,10)||new Date().toISOString().slice(0,10)}));const json=JSON.stringify(orders);try{navigator.clipboard.writeText(json)}catch(e){}const targetUrl='${cleanTarget}#serviceos='+encodeURIComponent(json);const win=window.open(targetUrl,'_blank');let toast=document.getElementById('bh-toast');if(!toast){toast=document.createElement('div');toast.id='bh-toast';toast.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:#059669;color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;font-weight:bold;box-shadow:0 8px 24px rgba(0,0,0,0.3);font-family:sans-serif;';document.body.appendChild(toast);}toast.innerHTML='✅ Đã lấy '+orders.length+' xe trong xưởng! Đang mở tab Bảo Hành PRO...';setTimeout(()=>toast.remove(),4000);if(!win){alert('⚡ Đã lấy '+orders.length+' xe! Vui lòng mở lại tab Bảo Hành PRO và bấm "📋 Dán từ ServiceOS (Ctrl+V)".');}}).catch(err=>alert('Lỗi: '+err.message));`;
}

// Generate Userscript for Tampermonkey
function getUserscriptCode(targetUrl){
  const cleanTarget = (targetUrl || window.location.href).split('#')[0];
  return `// ==UserScript==
// @name         Bảo Hành PRO - Đồng bộ ServiceOS
// @namespace    https://phan-tich-bao-hanh.pages.dev/
// @version      1.1
// @description  Tự động thêm nút lấy danh sách xe đang trong xưởng từ ServiceOS sang Bảo Hành PRO
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
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;padding:12px 20px;border-radius:50px;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 20px rgba(37,99,235,0.45);display:flex;align-items:center;gap:8px;transition:all 0.2s;font-family:sans-serif;';
    btn.onmouseover = () => btn.style.transform = 'translateY(-2px) scale(1.03)';
    btn.onmouseout = () => btn.style.transform = 'translateY(0) scale(1)';
    btn.onclick = async function() {
      btn.innerHTML = '⏳ Đang quét danh sách xe...';
      try {
        const res = await fetch('/api/work-orders?status=active&page=1&page_size=250', { credentials: 'same-origin' });
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
    window.open('https://att-serviceos.anthinhtech.vn/#/work-orders?src=all&status=active&kind=all&page=1', '_blank');
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

text = text[:idx_start] + new_full_checkxe_code + text[idx_end:]

with io.open(TPL_FILE, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Updated app_template2.html! Total length: {len(text)}")
