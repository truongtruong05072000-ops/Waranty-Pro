# -*- coding: utf-8 -*-
import io, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(BASE, 'build_modern_template.py')

# We will read the existing build_modern_template.py and inject the new tab, styles, html, and js functions.
with io.open(OUT_PATH, 'r', encoding='utf-8') as f:
    orig = f.read()

# 1. CSS Injection
css_to_find = r'/* ================= Verdict Banner ================= */'
css_checkxe = r'''/* ================= Check Xe Hàng Ngày ================= */
.category-chip-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: 14px;
  scrollbar-width: thin;
}
.cat-chip {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 12.5px;
  font-weight: 600;
  border: 1px solid var(--border);
  background: #ffffff;
  color: var(--text-main);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.15s ease;
}
.cat-chip:hover {
  background: var(--surface-alt);
  border-color: #cbd5e1;
}
.cat-chip.active {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
  box-shadow: 0 2px 5px rgba(15,23,42,0.25);
}
.cat-chip .chip-count {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  background: #f1f5f9;
  color: var(--text-muted);
}
.cat-chip.active .chip-count {
  background: rgba(255,255,255,0.2);
  color: #ffffff;
}

.status-pill.unchecked {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  font-weight: 700;
  padding: 3px 10px;
}
.status-pill.checked {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
  font-weight: 700;
  padding: 3px 10px;
}

tr.row-unchecked td {
  background: #fffdfd;
}
tr.row-unchecked:hover td {
  background: #fff5f5;
}
tr.row-unchecked td:first-child {
  border-left: 4px solid #ef4444;
}
tr.row-checked td:first-child {
  border-left: 4px solid #22c55e;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal-overlay[hidden] { display: none !important; }
.modal-box {
  background: #ffffff;
  border-radius: var(--radius-lg);
  padding: 24px;
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  position: relative;
}
.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-muted);
  cursor: pointer;
}
.modal-close:hover { color: var(--text-main); }
.bookmarklet-btn {
  display: inline-block;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: #ffffff !important;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  text-decoration: none;
  cursor: grab;
  box-shadow: 0 4px 12px rgba(37,99,235,0.3);
  margin: 12px 0;
}
.bookmarklet-btn:active { cursor: grabbing; }

'''
orig = orig.replace(css_to_find, css_checkxe + css_to_find)

# 2. Nav Tab Injection
nav_old = r'''    <button class="nav-tab" data-tab="claims" onclick="switchTab('claims')">
      <span>📋</span> Tra cứu đề xuất
      <span class="tab-badge" id="badgeClaimsCount">0</span>
    </button>
    <button class="nav-tab" data-tab="settings" onclick="switchTab('settings')">'''

nav_new = r'''    <button class="nav-tab" data-tab="claims" onclick="switchTab('claims')">
      <span>📋</span> Tra cứu đề xuất
      <span class="tab-badge" id="badgeClaimsCount">0</span>
    </button>
    <button class="nav-tab" data-tab="checkxe" onclick="switchTab('checkxe')">
      <span>🔍</span> Check lỗi xe hàng ngày
      <span class="tab-badge" id="badgeUncheckedCount" style="background:#fee2e2;color:#dc2626;font-weight:700">0</span>
    </button>
    <button class="nav-tab" data-tab="settings" onclick="switchTab('settings')">'''
orig = orig.replace(nav_old, nav_new)

# 3. Context Strip Chip
ctx_old = r'''      <span class="chip">📁 Nguồn: <b id="ctxSourcesVal">—</b></span>
    </div>'''
ctx_new = r'''      <span class="chip">📁 Nguồn: <b id="ctxSourcesVal">—</b></span>
      <span class="chip" id="ctxCheckXeChip" style="display:none">🔍 Xe cần check: <b id="ctxUncheckedVal" style="color:#dc2626">0</b></span>
    </div>'''
orig = orig.replace(ctx_old, ctx_new)

# 4. Tab Pane Injection
pane_old = r'''  <!-- TAB 4: TRA CỨU ĐỀ XUẤT -->
  <div class="tab-pane" id="pane_claims">
    <div id="claimsContent"></div>
  </div>

  <!-- TAB 5: TỆP & CÀI ĐẶT -->'''

pane_new = r'''  <!-- TAB 4: TRA CỨU ĐỀ XUẤT -->
  <div class="tab-pane" id="pane_claims">
    <div id="claimsContent"></div>
  </div>

  <!-- TAB 5: CHECK LỖI XE HÀNG NGÀY (SERVICEOS) -->
  <div class="tab-pane" id="pane_checkxe">
    <div id="checkXeContent"></div>
  </div>

  <!-- TAB 6: TỆP & CÀI ĐẶT -->'''
orig = orig.replace(pane_old, pane_new)

# 5. Modals Injection before </body>
modal_html = r'''
<!-- Modal Bookmarklet Hướng Dẫn -->
<div id="modalBookmarklet" class="modal-overlay" hidden>
  <div class="modal-box">
    <button class="modal-close" onclick="closeBookmarkletModal()">✕</button>
    <div class="modal-title">⚡ Dấu trang 1-Click: Lấy dữ liệu từ ServiceOS</div>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:14px">
      Không cần tải file rồi upload thủ công! Chỉ cần 1 cú click khi đang mở trang ServiceOS để gom toàn bộ danh sách xe.
    </p>

    <div style="background:#f8fafc;border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:14px;text-align:center">
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">👇 <b>KÉO NÚT NÀY THẢ LÊN THANH DẤU TRANG (BOOKMARK BAR)</b> CỦA TRÌNH DUYỆT:</div>
      <a class="bookmarklet-btn" id="bookmarkletLink" href="#" onclick="alert('Hãy KÉO nút này thả lên thanh Dấu trang (Bookmarks Bar) của trình duyệt Chrome/Edge!');return false;">
        ⚡ Lấy dữ liệu ServiceOS
      </a>
      <div style="font-size:11.5px;color:var(--text-light);margin-top:4px">(Nếu không thấy thanh Dấu trang, nhấn phím <b>Ctrl + Shift + B</b> trên bàn phím)</div>
    </div>

    <h4 style="font-size:13.5px;margin:10px 0 6px">Cách sử dụng mỗi ngày:</h4>
    <ol style="padding-left:20px;font-size:12.5px;line-height:1.6;color:var(--text-main)">
      <li>Mở trang Lệnh sửa chữa trên ServiceOS: <br><code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;color:#2563eb">att-serviceos.anthinhtech.vn/#/work-orders</code></li>
      <li>Bấm vào nút <b>"⚡ Lấy dữ liệu ServiceOS"</b> trên thanh Dấu trang. Trình duyệt sẽ tự động gom toàn bộ các xe đang hiển thị và sao chép.</li>
      <li>Quay lại trang <b>BẢO HÀNH PRO</b> này, vào mục <b>"Check lỗi xe hàng ngày"</b> rồi bấm nút <b>"📋 Dán từ ServiceOS"</b> (hoặc phím Ctrl+V) là xong!</li>
    </ol>

    <div style="margin-top:16px;text-align:right">
      <button class="btn secondary" onclick="closeBookmarkletModal()">Đóng</button>
    </div>
  </div>
</div>

<!-- Modal Chỉnh sửa Ghi chú KTV -->
<div id="modalEditNote" class="modal-overlay" hidden>
  <div class="modal-box" style="max-width:500px">
    <button class="modal-close" onclick="closeEditNoteModal()">✕</button>
    <div class="modal-title">✏️ Cập nhật Ghi chú KTV</div>
    <div id="editNoteInfo" style="font-size:13px;color:var(--text-muted);margin-bottom:12px"></div>
    
    <div style="margin-bottom:12px">
      <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Nội dung ghi chú KTV (nhập nội dung = đã check):</label>
      <textarea id="editNoteInput" class="field-input" rows="3" style="width:100%;font-size:13px;resize:vertical" placeholder="Nhập tình trạng kiểm tra xe, lỗi xác định..."></textarea>
    </div>

    <div style="font-size:11.5px;color:var(--text-muted);margin-bottom:12px">
      Gợi ý nhanh:
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">
        <button type="button" class="btn secondary" style="padding:2px 8px;font-size:11px" onclick="setQuickNote('Đã test động cơ, hoạt động bình thường')">Đã test động cơ</button>
        <button type="button" class="btn secondary" style="padding:2px 8px;font-size:11px" onclick="setQuickNote('Pin sụt nguồn, cần thay pin bảo hành')">Pin sụt nguồn</button>
        <button type="button" class="btn secondary" style="padding:2px 8px;font-size:11px" onclick="setQuickNote('Hỏng cảm biến Hall động cơ')">Hỏng cảm biến Hall</button>
        <button type="button" class="btn secondary" style="padding:2px 8px;font-size:11px" onclick="setQuickNote('Đã kiểm tra phanh và cổ phốt')">Đã KT phanh/cổ</button>
        <button type="button" class="btn secondary" style="padding:2px 8px;font-size:11px" onclick="setQuickNote('Không có phụ tùng thay thế')">Không có phụ tùng</button>
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:8px">
      <button class="btn secondary" onclick="closeEditNoteModal()">Huỷ</button>
      <button class="btn" onclick="saveEditedNote()">Lưu ghi chú</button>
    </div>
  </div>
</div>
'''
orig = orig.replace('</body>', modal_html + '\n</body>')

# 6. JS Additions
js_target = r'/* ============================ Navigation ============================ */'
js_checkxe_code = r'''
/* ============================ Check Xe Hàng Ngày (ServiceOS) ============================ */
state.checkXe = {
  orders: [],
  filterCategory: 'all',
  filterStatus: 'all', // 'all', 'unchecked', 'checked'
  filterTech: '',
  searchQuery: ''
};

function loadCheckXeOrders(){
  try {
    const raw = localStorage.getItem('bh_checkxe_orders');
    if(raw) {
      const data = JSON.parse(raw);
      if(Array.isArray(data)) state.checkXe.orders = data;
    }
  } catch(e){}
}
function saveCheckXeOrders(){
  try {
    localStorage.setItem('bh_checkxe_orders', JSON.stringify(state.checkXe.orders));
  } catch(e){}
}

function isOrderChecked(note){
  const s = String(note ?? '').trim();
  return Boolean(s && s.toLowerCase() !== 'none' && s !== '-' && s !== 'null' && s !== 'undefined');
}

function categorizeIssue(issue, parts){
  const txt = (String(issue || '') + ' ' + (Array.isArray(parts) ? parts.join(' ') : '')).toLowerCase();
  if (txt.includes('pin') || txt.includes('battery') || txt.includes('bms') || txt.includes('sụt nguồn') || txt.includes('mất nguồn')) {
    return { id: 'pin', name: 'Pin & Nguồn', icon: '🔋', color: '#059669', badgeBg: '#ecfdf5', badgeText: '#047857' };
  }
  if (txt.includes('động cơ') || txt.includes('dong co') || txt.includes('motor') || txt.includes('stator') || txt.includes('kẹt bánh') || txt.includes('vành') || txt.includes('hall') || txt.includes('bạc đạn') || txt.includes('bearing') || txt.includes('seal')) {
    return { id: 'motor', name: 'Động cơ & Vành', icon: '⚡', color: '#2563eb', badgeBg: '#eff6ff', badgeText: '#1d4ed8' };
  }
  if (txt.includes('sạc') || txt.includes('sac') || txt.includes('charger') || txt.includes('dcdc') || txt.includes('dc-dc')) {
    return { id: 'charger', name: 'Bộ sạc & DCDC', icon: '🔌', color: '#d97706', badgeBg: '#fffbeb', badgeText: '#b45309' };
  }
  if (txt.includes('giảm xóc') || txt.includes('giam xoc') || txt.includes('giảm sóc') || txt.includes('chảng ba') || txt.includes('phuộc') || txt.includes('cụp') || txt.includes('xì dầu')) {
    return { id: 'suspension', name: 'Giảm xóc & Phuộc', icon: '🛞', color: '#7c3aed', badgeBg: '#f5f3ff', badgeText: '#6d28d9' };
  }
  if (txt.includes('phanh') || txt.includes('thắng') || txt.includes('heo dầu') || txt.includes('bố') || txt.includes('đĩa')) {
    return { id: 'brake', name: 'Hệ thống Phanh', icon: '🛑', color: '#dc2626', badgeBg: '#fef2f2', badgeText: '#b91c1c' };
  }
  if (txt.includes('điện') || txt.includes('đồng hồ') || txt.includes('mcu') || txt.includes('còi') || txt.includes('đèn') || txt.includes('xi nhan') || txt.includes('4g') || txt.includes('khoá') || txt.includes('smartkey')) {
    return { id: 'electrical', name: 'Điện, Đèn & Đồng hồ', icon: '💡', color: '#0891b2', badgeBg: '#ecfeff', badgeText: '#0e7490' };
  }
  if (txt.includes('vỏ') || txt.includes('nhựa') || txt.includes('gương') || txt.includes('tay nắm') || txt.includes('ốp') || txt.includes('tem') || txt.includes('chân chống')) {
    return { id: 'body', name: 'Thân vỏ & Gương', icon: '🛵', color: '#475569', badgeBg: '#f1f5f9', badgeText: '#334155' };
  }
  return { id: 'other', name: 'Sửa chữa chung / Khác', icon: '🛠️', color: '#64748b', badgeBg: '#f8fafc', badgeText: '#475569' };
}

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
  
  const partsByWo = new Map();
  for(const sn of wb.SheetNames){
    if(norm(sn).includes('phu tung theo lenh')){
      const pRows = sheetRows(wb.Sheets[sn]);
      const phi = findHeaderRow(pRows);
      if(phi >= 0){
        const pMap = buildColMap(pRows[phi]);
        for(let r = phi + 1; r < pRows.length; r++){
          const pr = pRows[r]; if(!pr) continue;
          const wo = String(pickCol(pMap, pr, ['ma lenh sua chua', 'lenh sua chua', 'wo']) || '').trim();
          const pName = String(pickCol(pMap, pr, ['ten phu tung', 'phu tung', 'ten vat tu']) || '').trim();
          const pQty = parseNum(pickCol(pMap, pr, ['so luong', 'qty'])) || 1;
          if(wo && pName){
            if(!partsByWo.has(wo)) partsByWo.set(wo, []);
            partsByWo.get(wo).push(`${pQty}× ${pName}`);
          }
        }
      }
    }
  }

  const orders = [];
  for(let r = hi + 1; r < rows.length; r++){
    const row = rows[r]; if(!row || row.length === 0) continue;
    const plate = String(pickCol(map, row, ['bien so', 'bien so xe', 'bsx', 'bien']) || '').trim();
    const wo = String(pickCol(map, row, ['ma lenh sua chua', 'lenh sua chua', 'ma phieu', 'wo']) || '').trim();
    if(!plate && !wo) continue;
    
    const vin = String(pickCol(map, row, ['vin', 'so khung']) || '').trim();
    const vehicle = String(pickCol(map, row, ['dong xe', 'loai xe', 'model']) || '').trim();
    const customer = String(pickCol(map, row, ['khach hang', 'khach']) || '').trim();
    const tech = String(pickCol(map, row, ['ky thuat vien', 'ktv sua chua, bao hanh', 'ktv', 'tho']) || '').trim();
    const issue = String(pickCol(map, row, ['yeu cau khach hang', 'hang muc', 'noi dung sua chua', 'ly do vao xuong', 'trang thai bao hanh', 'mo ta']) || '').trim();
    const note = String(pickCol(map, row, ['ghi chu', 'ghi chu ktv', 'chan doan']) || '').trim();
    const status = String(pickCol(map, row, ['trang thai', 'tinh trang']) || 'Đang xử lý').trim();
    const dateVal = parseDateVal(pickCol(map, row, ['ngay tao', 'ngay nhan xe', 'ngay sua chua/bao hanh', 'ngay'])) || new Date();
    
    const parts = partsByWo.get(wo) || [];
    const cat = categorizeIssue(issue, parts);
    const checked = isOrderChecked(note);
    
    orders.push({
      id: 'ord_' + (wo || plate).replace(/[^a-zA-Z0-9]/g, '') + '_' + r,
      wo: wo || '—',
      plate: plate || '—',
      vin: vin || '—',
      vehicle: vehicle || '—',
      customer: customer || '—',
      tech: tech || 'Chưa phân công',
      issue: issue || 'Kiểm tra & sửa chữa theo yêu cầu',
      parts: parts,
      note: note,
      status: status,
      dateStr: fmtDate(dateVal),
      category: cat,
      isChecked: checked
    });
  }
  return orders;
}

window.openBookmarkletModal = () => { $('#modalBookmarklet').hidden = false; };
window.closeBookmarkletModal = () => { $('#modalBookmarklet').hidden = true; };

let editingOrderIndex = -1;
window.openEditNoteModal = idx => {
  editingOrderIndex = idx;
  const ord = state.checkXe.orders[idx];
  if(!ord) return;
  $('#editNoteInfo').innerHTML = `Xe: <b>${esc(ord.plate)}</b> (${esc(ord.vehicle)}) · KTV: <b>${esc(ord.tech)}</b><br>Lỗi/Yêu cầu: <i>${esc(ord.issue)}</i>`;
  $('#editNoteInput').value = ord.note || '';
  $('#modalEditNote').hidden = false;
  setTimeout(() => $('#editNoteInput').focus(), 50);
};
window.closeEditNoteModal = () => { $('#modalEditNote').hidden = true; editingOrderIndex = -1; };
window.setQuickNote = txt => { $('#editNoteInput').value = txt; };
window.saveEditedNote = () => {
  if(editingOrderIndex < 0 || editingOrderIndex >= state.checkXe.orders.length) return;
  const val = $('#editNoteInput').value.trim();
  const ord = state.checkXe.orders[editingOrderIndex];
  ord.note = val;
  ord.isChecked = isOrderChecked(val);
  saveCheckXeOrders();
  closeEditNoteModal();
  renderCheckXe();
};

window.importServiceOsClipboard = async function(){
  try {
    let text = '';
    if(navigator.clipboard && navigator.clipboard.readText){
      try { text = await navigator.clipboard.readText(); } catch(err){}
    }
    if(!text || !text.trim().startsWith('[')){
      text = prompt('Dán (Ctrl+V) dữ liệu xe đã lấy từ ServiceOS vào ô bên dưới:');
    }
    if(!text) return;
    const data = JSON.parse(text);
    if(!Array.isArray(data)){
      alert('Dữ liệu không đúng định dạng danh sách xe!');
      return;
    }
    
    const orders = data.map((d, i) => {
      const issue = d.issue || 'Kiểm tra sửa chữa';
      const parts = d.parts || [];
      const note = d.note || '';
      return {
        id: d.id || ('ord_' + Date.now() + '_' + i),
        wo: d.wo || '—',
        plate: d.plate || '—',
        vin: d.vin || '—',
        vehicle: d.vehicle || '—',
        customer: d.customer || '—',
        tech: d.tech || 'Chưa phân công',
        issue: issue,
        parts: parts,
        note: note,
        status: d.status || 'Đang xử lý',
        dateStr: d.dateStr || (new Date().toLocaleDateString('vi-VN')),
        category: categorizeIssue(issue, parts),
        isChecked: isOrderChecked(note)
      };
    });
    
    state.checkXe.orders = orders;
    saveCheckXeOrders();
    renderCheckXe();
    alert(`✅ Đã nhập thành công ${orders.length} xe từ ServiceOS!`);
  } catch(e) {
    alert('Lỗi đọc dữ liệu: ' + e.message);
  }
};

window.clearCheckXe = function(){
  if(!confirm('Bạn có chắc chắn muốn xoá danh sách xe kiểm tra hiện tại?')) return;
  state.checkXe.orders = [];
  saveCheckXeOrders();
  renderCheckXe();
};

window.exportCheckXeExcel = function(){
  if(!state.checkXe.orders.length){
    alert('Chưa có danh sách xe để xuất file!');
    return;
  }
  const wb = XLSX.utils.book_new();
  const rows = [
    ['DANH SÁCH KIỂM TRA LỖI XE HÀNG NGÀY (SERVICEOS)'],
    ['Xuất lúc: ' + new Date().toLocaleString('vi-VN')],
    [],
    ['STT', 'Biển số', 'Mã lệnh sửa chữa', 'VIN', 'Dòng xe', 'Kỹ thuật viên', 'Hạng mục lỗi', 'Trạng thái Check', 'Ghi chú KTV', 'Trạng thái lệnh', 'Ngày nhận']
  ];
  state.checkXe.orders.forEach((o, i) => {
    rows.push([
      i + 1,
      o.plate,
      o.wo,
      o.vin,
      o.vehicle,
      o.tech,
      o.category.name + ' - ' + o.issue,
      o.isChecked ? 'ĐÃ CHECK' : 'CHƯA CHECK',
      o.note || '',
      o.status,
      o.dateStr
    ]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), 'Check Loi Xe');
  XLSX.writeFile(wb, `CheckLoiXe_ServiceOS_${new Date().toISOString().slice(0,10)}.xlsx`);
};

window.setCheckXeCat = catId => {
  state.checkXe.filterCategory = catId;
  renderCheckXe();
};
window.setCheckXeStatus = st => {
  state.checkXe.filterStatus = st;
  renderCheckXe();
};
window.setCheckXeTech = tech => {
  state.checkXe.filterTech = tech;
  renderCheckXe();
};
window.setCheckXeSearch = q => {
  state.checkXe.searchQuery = q;
  renderCheckXe();
  const el = $('#checkXeSearch');
  if(el){ el.focus(); el.setSelectionRange(q.length, q.length); }
};

function renderCheckXe(){
  const allOrders = state.checkXe.orders || [];
  const total = allOrders.length;
  const unchecked = allOrders.filter(o => !o.isChecked).length;
  const checked = total - unchecked;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  // Update Badges
  const bEl = $('#badgeUncheckedCount');
  if(bEl){
    bEl.textContent = unchecked;
    bEl.style.display = unchecked > 0 ? 'inline-block' : 'none';
  }
  const ctxChip = $('#ctxCheckXeChip');
  const ctxVal = $('#ctxUncheckedVal');
  if(ctxChip && ctxVal){
    if(total > 0){
      ctxChip.style.display = 'inline-flex';
      ctxVal.textContent = unchecked + ' / ' + total;
    } else {
      ctxChip.style.display = 'none';
    }
  }

  const el = $('#checkXeContent');
  if(!el) return;

  if(!total){
    el.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🔍 Check lỗi xe hàng ngày — Dữ liệu ServiceOS</div>
            <div class="card-subtitle">Lọc xe theo hạng mục lỗi hàng ngày · Kiểm tra trạng thái đã check / chưa check theo Ghi chú KTV</div>
          </div>
          <div class="toolbar-right">
            <button class="btn" onclick="openBookmarkletModal()">⚡ Dấu trang 1-Click ServiceOS</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán từ ServiceOS</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Nhập file Excel</button>
            <input type="file" id="serviceOsFileInput" style="display:none" accept=".xlsx,.xls" onchange="handleServiceOsFileSelect(this.files)">
          </div>
        </div>

        <div class="empty-state">
          <div class="empty-state-icon">🛵</div>
          <h3 style="font-size:16px;color:var(--text-main);margin-bottom:6px">Chưa có dữ liệu xe từ ServiceOS</h3>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:18px;max-width:540px;margin-left:auto;margin-right:auto">
            Bạn có thể lấy dữ liệu trực tiếp từ <b>att-serviceos.anthinhtech.vn/#/work-orders</b> chỉ bằng 1 cú click (dùng Dấu trang Bookmarklet), hoặc kéo thả file Excel Lệnh sửa chữa vào đây.
          </p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn" onclick="openBookmarkletModal()">⚡ Cài đặt Dấu trang 1-Click</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu đã copy</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Chọn file Excel Lệnh Sửa Chữa</button>
          </div>
        </div>
      </div>`;
    return;
  }

  // Categories count
  const catCounts = { all: total };
  allOrders.forEach(o => {
    const cid = o.category.id;
    catCounts[cid] = (catCounts[cid] || 0) + 1;
  });

  const CATEGORIES = [
    { id: 'all', name: 'Tất cả hạng mục', icon: '📋' },
    { id: 'pin', name: 'Pin & Nguồn', icon: '🔋' },
    { id: 'motor', name: 'Động cơ & Vành', icon: '⚡' },
    { id: 'charger', name: 'Bộ sạc & DCDC', icon: '🔌' },
    { id: 'suspension', name: 'Giảm xóc & Phuộc', icon: '🛞' },
    { id: 'brake', name: 'Hệ thống Phanh', icon: '🛑' },
    { id: 'electrical', name: 'Điện, Đèn & Đồng hồ', icon: '💡' },
    { id: 'body', name: 'Thân vỏ & Gương', icon: '🛵' },
    { id: 'other', name: 'Sửa chữa khác', icon: '🛠️' }
  ];

  const catChipsHtml = CATEGORIES.map(c => {
    const cnt = catCounts[c.id] || 0;
    if(c.id !== 'all' && cnt === 0) return '';
    const isActive = state.checkXe.filterCategory === c.id;
    return `
      <button class="cat-chip ${isActive ? 'active' : ''}" onclick="setCheckXeCat('${c.id}')">
        <span>${c.icon}</span> ${c.name}
        <span class="chip-count">${cnt}</span>
      </button>`;
  }).join('');

  // Filtering
  let filtered = allOrders;
  if(state.checkXe.filterCategory !== 'all'){
    filtered = filtered.filter(o => o.category.id === state.checkXe.filterCategory);
  }
  if(state.checkXe.filterStatus === 'unchecked'){
    filtered = filtered.filter(o => !o.isChecked);
  } else if(state.checkXe.filterStatus === 'checked'){
    filtered = filtered.filter(o => o.isChecked);
  }
  if(state.checkXe.filterTech){
    filtered = filtered.filter(o => o.tech === state.checkXe.filterTech);
  }
  if(state.checkXe.searchQuery){
    const q = norm(state.checkXe.searchQuery);
    filtered = filtered.filter(o => norm(o.plate + ' ' + o.wo + ' ' + o.vin + ' ' + o.tech + ' ' + o.issue + ' ' + o.note).includes(q));
  }

  // Tech list for dropdown
  const techs = [...new Set(allOrders.map(o => o.tech).filter(Boolean))].sort();

  const rowsHtml = filtered.map((o, idx) => {
    const pTxt = o.parts && o.parts.length ? `<div style="font-size:11.5px;color:var(--text-muted);margin-top:2px">Phụ tùng: ${esc(o.parts.slice(0, 3).join(', '))}${o.parts.length > 3 ? ` (+${o.parts.length - 3})` : ''}</div>` : '';
    const originalIndex = allOrders.indexOf(o);
    return `
      <tr class="${o.isChecked ? 'row-checked' : 'row-unchecked'}">
        <td class="num">${idx + 1}</td>
        <td class="l">
          <b style="font-size:14px;color:var(--text-main);letter-spacing:0.5px">${esc(o.plate)}</b>
          <div style="font-size:11px;color:var(--text-muted)">${esc(o.wo)}</div>
        </td>
        <td class="l">
          <b>${esc(o.vehicle)}</b>
          <div style="font-size:11.5px;font-family:monospace;color:var(--text-muted)">VIN: ...${esc(String(o.vin).slice(-6))}</div>
        </td>
        <td class="l">
          <span style="font-weight:600;color:#334155">${esc(o.tech)}</span>
        </td>
        <td class="l part-name-cell">
          <span class="tag" style="background:${o.category.badgeBg};color:${o.category.badgeText};margin-bottom:3px">
            ${o.category.icon} ${o.category.name}
          </span>
          <div style="font-weight:500;line-height:1.4">${esc(o.issue)}</div>
          ${pTxt}
        </td>
        <td class="l">
          ${o.isChecked ? 
            `<span class="status-pill checked">✅ Đã check</span>` : 
            `<span class="status-pill unchecked">🔴 Chưa check lỗi</span>`
          }
        </td>
        <td class="l part-name-cell">
          ${o.isChecked ? 
            `<div style="font-weight:600;color:#15803d">${esc(o.note)}</div>` : 
            `<span style="color:#94a3b8;font-style:italic">Chưa có ghi chú kiểm tra</span>`
          }
        </td>
        <td class="l">
          <span class="tag f1">${esc(o.status)}</span>
          <div style="font-size:11px;color:var(--text-muted)">${esc(o.dateStr)}</div>
        </td>
        <td class="l">
          <button class="btn secondary" style="padding:4px 8px;font-size:11.5px" onclick="openEditNoteModal(${originalIndex})" title="Cập nhật ghi chú kiểm tra">
            ✏️ Ghi chú
          </button>
        </td>
      </tr>`;
  }).join('');

  el.innerHTML = `
    <!-- Top KPI Bar -->
    <div class="kpi-grid">
      <div class="kpi-card indigo">
        <div class="kpi-title">Tổng xe đang kiểm tra <span>🚗</span></div>
        <div class="kpi-val">${total} <span style="font-size:16px">xe</span></div>
        <div class="kpi-sub">Dữ liệu từ ServiceOS</div>
      </div>
      
      <div class="kpi-card ${unchecked > 0 ? 'rose' : 'emerald'}">
        <div class="kpi-title" style="${unchecked > 0 ? 'color:#dc2626' : ''}">CẦN CHECK LỖI (Chưa check) <span>${unchecked > 0 ? '🔴' : '✅'}</span></div>
        <div class="kpi-val" style="${unchecked > 0 ? 'color:#dc2626' : 'color:#16a34a'}">${unchecked} <span style="font-size:16px">xe</span></div>
        <div class="kpi-sub">${unchecked > 0 ? 'Ghi chú KTV còn trống — Cần kiểm tra' : 'Tất cả xe đã được kiểm tra!'}</div>
      </div>

      <div class="kpi-card emerald">
        <div class="kpi-title">Đã hoàn thành check <span>✅</span></div>
        <div class="kpi-val" style="color:#16a34a">${checked} <span style="font-size:16px">xe</span></div>
        <div class="kpi-sub">Đã có ghi chú KTV chẩn đoán lỗi</div>
      </div>

      <div class="kpi-card blue">
        <div class="kpi-title">Tiến độ kiểm tra <span>📊</span></div>
        <div class="kpi-val">${pct} <span style="font-size:16px">%</span></div>
        <div class="kpi-sub">${checked} / ${total} xe đã hoàn tất check</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">🔍 Danh sách xe cần check lỗi hàng ngày</div>
          <div class="card-subtitle">Lọc theo hạng mục lỗi (Pin, Động cơ, Sạc, Giảm xóc, Phanh...) để phân công KTV kiểm tra</div>
        </div>
        <div class="toolbar-right">
          <button class="btn" onclick="openBookmarkletModal()">⚡ Dấu trang ServiceOS</button>
          <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán từ ServiceOS</button>
          <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Nhập Excel</button>
          <button class="btn secondary" onclick="exportCheckXeExcel()">⬇ Xuất Excel</button>
          <button class="source-del" onclick="clearCheckXe()" title="Xoá danh sách hiện tại">✕</button>
          <input type="file" id="serviceOsFileInput" style="display:none" accept=".xlsx,.xls" onchange="handleServiceOsFileSelect(this.files)">
        </div>
      </div>

      <!-- Category Filter Chips -->
      <div class="category-chip-bar">
        ${catChipsHtml}
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="toolbar">
        <div class="toolbar-left">
          <select class="select-input" onchange="setCheckXeStatus(this.value)">
            <option value="all" ${state.checkXe.filterStatus === 'all' ? 'selected' : ''}>— Mọi trạng thái check (${total}) —</option>
            <option value="unchecked" ${state.checkXe.filterStatus === 'unchecked' ? 'selected' : ''}>🔴 CHƯA CHECK LỖI (${unchecked} xe)</option>
            <option value="checked" ${state.checkXe.filterStatus === 'checked' ? 'selected' : ''}>✅ ĐÃ CHECK (${checked} xe)</option>
          </select>

          <select class="select-input" onchange="setCheckXeTech(this.value)">
            <option value="">— Mọi Kỹ thuật viên (${techs.length} KTV) —</option>
            ${techs.map(t => `<option value="${esc(t)}" ${state.checkXe.filterTech === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}
          </select>

          <input class="search-input" id="checkXeSearch" placeholder="🔍 Tìm biển số xe, VIN, lỗi, tên KTV…" oninput="setCheckXeSearch(this.value)" value="${esc(state.checkXe.searchQuery)}">
        </div>
        <div class="toolbar-right">
          <span style="font-size:12.5px;color:var(--text-muted);font-weight:600">Đang hiển thị ${filtered.length} / ${total} xe</span>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-container scrollable">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th class="l">Biển số &amp; Mã lệnh</th>
              <th class="l">Dòng xe &amp; VIN</th>
              <th class="l">Kỹ thuật viên</th>
              <th class="l">Hạng mục lỗi / Yêu cầu</th>
              <th class="l">Trạng thái Check</th>
              <th class="l">Ghi chú KTV</th>
              <th class="l">Tình trạng lệnh</th>
              <th class="l">Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="9" class="empty-state">Không có xe nào khớp bộ lọc</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>`;
}

async function handleServiceOsFileSelect(fileList){
  const file = fileList[0];
  if(!file) return;
  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array', cellDates: true });
    const orders = parseServiceOsWorkbook(wb);
    if(!orders.length){
      alert('Không nhận diện được danh sách lệnh sửa chữa từ file này! Hãy chắc chắn file có cột Biển số, Kỹ thuật viên, Ghi chú...');
      return;
    }
    state.checkXe.orders = orders;
    saveCheckXeOrders();
    renderCheckXe();
    alert(`✅ Đã nhập thành công ${orders.length} xe từ file ${file.name}!`);
  } catch(e){
    alert('Lỗi đọc file: ' + e.message);
  }
}

// Generate Bookmarklet link href
function initBookmarkletCode(){
  const code = `javascript:(function(){try{const rows=document.querySelectorAll('table tbody tr');if(!rows||!rows.length){alert('⚠️ Không tìm thấy bảng dữ liệu Lệnh Sửa Chữa trên trang này!\\nVui lòng mở trang danh sách Work Orders trên ServiceOS rồi bấm lại bookmarklet.');return;}const ths=Array.from(document.querySelectorAll('table thead th, table thead tr:first-child td')).map(th=>th.innerText.trim().toLowerCase());const findIdx=(keys)=>ths.findIndex(h=>keys.some(k=>h.includes(k)));const woIdx=findIdx(['mã lệnh','lệnh','wo','phiếu']);const plateIdx=findIdx(['biển số','bs','biển']);const vinIdx=findIdx(['vin','khung']);const modelIdx=findIdx(['dòng xe','loại xe','model','tên xe']);const techIdx=findIdx(['kỹ thuật viên','ktv','thợ']);const issueIdx=findIdx(['yêu cầu','hạng mục','lỗi','mô tả','nội dung','lý do']);const noteIdx=findIdx(['ghi chú ktv','ghi chú','chẩn đoán']);const statusIdx=findIdx(['trạng thái','tình trạng']);const dateIdx=findIdx(['ngày tạo','ngày nhận','ngày']);const orders=[];rows.forEach((tr,rIdx)=>{const tds=tr.querySelectorAll('td');if(!tds.length)return;const getVal=(idx)=>{if(idx<0||idx>=tds.length)return '';const td=tds[idx];const inp=td.querySelector('input, textarea, select');return (inp?inp.value:td.innerText).trim();};const plate=getVal(plateIdx);const wo=getVal(woIdx);if(!plate&&!wo)return;const note=getVal(noteIdx);orders.push({id:'ord_'+(wo||plate)+'_'+rIdx,wo:wo||'—',plate:plate||'—',vin:getVal(vinIdx)||'—',vehicle:getVal(modelIdx)||'—',tech:getVal(techIdx)||'Chưa phân công',issue:getVal(issueIdx)||'Kiểm tra & sửa chữa theo yêu cầu',note:note,status:getVal(statusIdx)||'Đang xử lý',dateStr:getVal(dateIdx)||(new Date().toLocaleDateString('vi-VN'))});});if(!orders.length){alert('Không đọc được dòng nào. Vui lòng kiểm tra lại cấu trúc bảng trên ServiceOS.');return;}const payload=JSON.stringify(orders);if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(payload).then(()=>{alert('⚡ ĐÃ LẤY THÀNH CÔNG '+orders.length+' XE TỪ SERVICEOS!\\n\\nDữ liệu đã được lưu vào bộ nhớ tạm (Clipboard).\\nBây giờ hãy chuyển sang trang BẢO HÀNH PRO, vào mục \"Check lỗi xe hàng ngày\" và bấm nút \"📋 Dán từ ServiceOS\".');}).catch(()=>{prompt('⚡ Đã lấy '+orders.length+' xe! Nhấn Ctrl+C để copy dữ liệu:',payload);});}else{prompt('⚡ Đã lấy '+orders.length+' xe! Nhấn Ctrl+C để copy dữ liệu:',payload);}}catch(e){alert('Lỗi: '+e.message);}})();`;
  const btn = $('#bookmarkletLink');
  if(btn) btn.href = code;
}

'''
orig = orig.replace(js_target, js_checkxe_code + js_target)

# 7. Add init calls in initSettingsUI / load
init_to_find = r'loadPrepared();'
init_checkxe = r'''loadPrepared();
loadCheckXeOrders();
initBookmarkletCode();
renderCheckXe();
'''
orig = orig.replace(init_to_find, init_checkxe)

# Write out the modified template script
with io.open(OUT_PATH, 'w', encoding='utf-8') as f:
    f.write(orig)

print("build_modern_template.py successfully updated with Check Xe module!")
