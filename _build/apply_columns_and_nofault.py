# -*- coding: utf-8 -*-
import io, re, sys
sys.stdout.reconfigure(encoding='utf-8')

with io.open('_build/app_template2.html', encoding='utf-8') as f:
    html = f.read()

# 1. Update KPI Card block
kpi_target = r'<!-- 4 Thẻ KPI Chuẩn theo 4 Quy Tắc Nghiệp Vụ -->[\s\S]*?<!-- Hạng mục lỗi'
kpi_replacement = '''<!-- 5 Thẻ KPI Chuẩn theo Nghiệp Vụ -->
      <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;padding:0 20px 20px">
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(16,185,129,0.14), rgba(15,23,42,0.7));border:1px solid rgba(16,185,129,0.38);box-shadow:0 0 15px rgba(16,185,129,0.15)" onclick="setCheckXeColFilter('filterStatus', 'no_fault')" title="Bấm để lọc danh sách xe không lỗi">
          <div class="kpi-label" style="color:#34d399">${window.ICONS.checkCircle} Xe không lỗi</div>
          <div class="kpi-val" style="color:#34d399;text-shadow:0 0 12px rgba(16,185,129,0.4)">${noFaultList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Bình thường · Không có lỗi</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,23,42,0.7));border:1px solid rgba(239,68,68,0.35);box-shadow:0 0 15px rgba(239,68,68,0.15)" onclick="setCheckXeColFilter('filterStatus', 'unchecked')" title="Bấm để lọc xe chưa check">
          <div class="kpi-label" style="color:var(--rose-glow)">${window.ICONS.alertCircle} Chưa check (Cần xử lý)</div>
          <div class="kpi-val" style="color:#f87171;text-shadow:0 0 12px rgba(239,68,68,0.4)">${uncheckedList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Có lỗi · Chưa ghi chú/bảng</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(56,189,248,0.12), rgba(15,23,42,0.7));border:1px solid rgba(56,189,248,0.35);box-shadow:0 0 15px rgba(56,189,248,0.15)" onclick="setCheckXeColFilter('filterStatus', 'checked')" title="Bấm để lọc xe đã check">
          <div class="kpi-label" style="color:#38bdf8">${window.ICONS.checkCircle} Đã check xong</div>
          <div class="kpi-val" style="color:#38bdf8;text-shadow:0 0 12px rgba(56,189,248,0.4)">${checkedList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Đã có bảng linh kiện / ghi chú</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(245,158,11,0.12), rgba(15,23,42,0.7));border:1px solid rgba(245,158,11,0.35);box-shadow:0 0 15px rgba(245,158,11,0.15)" onclick="setCheckXeColFilter('filterStatus', 'recheck')" title="Bấm để lọc xe cần check lại">
          <div class="kpi-label" style="color:var(--amber-glow)">${window.ICONS.alertTriangle} Cần check lại</div>
          <div class="kpi-val" style="color:#fbbf24;text-shadow:0 0 12px rgba(245,158,11,0.4)">${recheckList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Có ghi chú nhưng chưa có bảng</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(148,163,184,0.12), rgba(15,23,42,0.7));border:1px solid rgba(148,163,184,0.35);box-shadow:0 0 15px rgba(148,163,184,0.15)" onclick="setCheckXeColFilter('filterStatus', 'all')" title="Bấm để xem tất cả xe">
          <div class="kpi-label" style="color:#e2e8f0">${window.ICONS.carCheck} Tổng trong xưởng</div>
          <div class="kpi-val" style="color:#f8fafc;text-shadow:0 0 12px rgba(255,255,255,0.4)">${totalAll}</div>
          <div class="kpi-sub" style="color:#94a3b8">Toàn bộ xe đang theo dõi</div>
        </div>
      </div>
    </div></div>

    <!-- Hạng mục lỗi'''

html = re.sub(kpi_target, kpi_replacement, html, count=1)
print("Updated KPI cards to 5 boxes including Xe không lỗi!")

# 2. Update Table toolbar to add View Mode toggle button
toolbar_target = r'<!-- NÚT XUẤT EXCEL ĐƯỢC KHOANH ĐỎ YÊU CẦU -->[\s\S]*?<button class="btn secondary" style="font-size:12px;padding:6px 10px"'
toolbar_replacement = '''<!-- NÚT XUẤT EXCEL & CHUYỂN CHẾ ĐỘ XEM CỘT -->
          <div style="display:inline-flex;background:rgba(15,23,42,0.9);padding:3px;border-radius:8px;border:1px solid var(--border-light);margin-right:4px">
            <button class="btn ${state.checkXe.viewMode !== 'card' ? 'primary' : 'secondary'}" style="padding:4px 10px;font-size:11.5px;border:none" onclick="setCheckXeViewMode('table')" title="Hiển thị từng mục thành các cột riêng để lọc">
              📊 Cột chi tiết
            </button>
            <button class="btn ${state.checkXe.viewMode === 'card' ? 'primary' : 'secondary'}" style="padding:4px 10px;font-size:11.5px;border:none" onclick="setCheckXeViewMode('card')" title="Hiển thị dạng thẻ linh kiện ServiceOS">
              📇 Thẻ ServiceOS
            </button>
          </div>
          <button class="btn primary" style="background:#15803d;border-color:#16a34a;color:#fff;font-weight:700;font-size:13px;padding:6px 14px;box-shadow:0 2px 8px rgba(22,163,74,0.3);display:inline-flex;align-items:center;gap:6px" onclick="exportCheckXeExcel('filtered')">
            ${window.ICONS.download} Xuất Excel (${filtered.length} xe)
          </button>
          <button class="btn secondary" style="font-size:12px;padding:6px 10px"'''

html = re.sub(toolbar_target, toolbar_replacement, html, count=1)
print("Updated table toolbar with View Mode toggle!")

# 3. Update Table rendering and rows
table_regex = r'<div class="table-wrap">[\s\S]*?</table>\s*</div>\s*</div>\s*`;\s*\}'

new_table_code = '''<div class="table-wrap">
        <table>
          <thead>
            ${state.checkXe.viewMode === 'card' ? `
              <!-- CHẾ ĐỘ XEM THẺ CARD SERVICEOS -->
              <tr>
                <th style="width:45px;text-align:center" class="sortable-th" onclick="setCheckXeSort('stt')">STT ${getSortIcon('stt')}</th>
                <th style="width:130px" class="sortable-th" onclick="setCheckXeSort('plate')">BIỂN SỐ / MÃ WO ${getSortIcon('plate')}</th>
                <th style="width:130px" class="sortable-th" onclick="setCheckXeSort('vehicle')">DÒNG XE / VIN ${getSortIcon('vehicle')}</th>
                <th style="width:130px" class="sortable-th" onclick="setCheckXeSort('tech')">KTV PHỤ TRÁCH ${getSortIcon('tech')}</th>
                <th style="width:150px" class="sortable-th" onclick="setCheckXeSort('category')">HẠNG MỤC & LỖI ${getSortIcon('category')}</th>
                <th style="min-width:320px" class="sortable-th" onclick="setCheckXeSort('bang')">BẢNG CẬP NHẬT PHÍA DƯỚI ${getSortIcon('bang')}</th>
                <th style="width:140px" class="sortable-th" onclick="setCheckXeSort('note')">GHI CHÚ KTV ${getSortIcon('note')}</th>
                <th style="width:115px" class="sortable-th" onclick="setCheckXeSort('date')">NGÀY NHẬN ${getSortIcon('date')}</th>
                <th style="width:135px" class="sortable-th" onclick="setCheckXeSort('status')">TRẠNG THÁI CHECK ${getSortIcon('status')}</th>
                <th style="width:80px;text-align:center">THAO TÁC</th>
              </tr>
              <tr class="filter-header-row">
                <th style="text-align:center"><span style="font-size:11px;color:var(--text-muted)">Lọc:</span></th>
                <th><input type="text" class="col-filter-input" placeholder="🔍 Biển / WO..." value="${esc(state.checkXe.searchPlate || '')}" oninput="setCheckXeColFilter('searchPlate', this.value)"></th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterVehicle', this.value)">
                    <option value="">-- Tất cả xe --</option>
                    ${vehicles.map(v => `<option value="${esc(v)}" ${state.checkXe.filterVehicle === v ? 'selected' : ''}>${esc(v)}</option>`).join('')}
                  </select>
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterTech', this.value)">
                    <option value="">-- Tất cả KTV --</option>
                    ${techs.map(t => `<option value="${esc(t)}" ${state.checkXe.filterTech === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}
                  </select>
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterCategory', this.value)">
                    <option value="all">-- Tất cả mục --</option>
                    ${ISSUE_CATEGORIES.map(c => `<option value="${c.id}" ${state.checkXe.filterCategory === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                  </select>
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterPartStatus', this.value)">
                    <option value="all">-- Tất cả TT linh kiện --</option>
                    <option value="waiting_motor" ${state.checkXe.filterPartStatus === 'waiting_motor' ? 'selected' : ''}>⚡ Chờ Động cơ</option>
                    <option value="waiting_battery" ${state.checkXe.filterPartStatus === 'waiting_battery' ? 'selected' : ''}>🔋 Chờ PIN</option>
                    <option value="checking" ${state.checkXe.filterPartStatus === 'checking' ? 'selected' : ''}>⏳ Chờ kiểm tra</option>
                    <option value="has_part" ${state.checkXe.filterPartStatus === 'has_part' ? 'selected' : ''}>📦 Có cập nhật</option>
                    <option value="none" ${state.checkXe.filterPartStatus === 'none' ? 'selected' : ''}>⚪ Chưa có cập nhật</option>
                  </select>
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterHasNote', this.value)">
                    <option value="all">-- Tất cả --</option>
                    <option value="yes" ${state.checkXe.filterHasNote === 'yes' ? 'selected' : ''}>📝 Đã có ghi chú</option>
                    <option value="no" ${state.checkXe.filterHasNote === 'no' ? 'selected' : ''}>⚪ Chưa có ghi chú</option>
                  </select>
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterDate', this.value)">
                    <option value="all">-- Tất cả ngày --</option>
                    <option value="today" ${state.checkXe.filterDate === 'today' ? 'selected' : ''}>Hôm nay</option>
                    <option value="yesterday" ${state.checkXe.filterDate === 'yesterday' ? 'selected' : ''}>Hôm qua</option>
                    <option value="last7" ${state.checkXe.filterDate === 'last7' ? 'selected' : ''}>7 ngày qua</option>
                    ${sortedDates.map(iso => `<option value="${iso}" ${state.checkXe.filterDate === iso ? 'selected' : ''}>${dateCounts[iso].disp}</option>`).join('')}
                  </select>
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterStatus', this.value)">
                    <option value="all">-- Tất cả trạng thái --</option>
                    <option value="no_fault" ${state.checkXe.filterStatus === 'no_fault' ? 'selected' : ''}>✅ Xe không lỗi (${noFaultList.length})</option>
                    <option value="unchecked" ${state.checkXe.filterStatus === 'unchecked' ? 'selected' : ''}>🔴 Chưa check (${uncheckedList.length})</option>
                    <option value="checked" ${state.checkXe.filterStatus === 'checked' ? 'selected' : ''}>✅ Đã check (${checkedList.length})</option>
                    <option value="recheck" ${state.checkXe.filterStatus === 'recheck' ? 'selected' : ''}>⚠️ Cần check lại (${recheckList.length})</option>
                  </select>
                </th>
                <th style="text-align:center">
                  <button class="btn secondary" style="width:100%;padding:3px 4px;font-size:11px" onclick="resetCheckXeFilters()">🔄 Xóa</button>
                </th>
              </tr>
            ` : `
              <!-- CHẾ ĐỘ XEM CỘT CHI TIẾT (TÁCH CÁC MỤC TRONG THẺ THÀNH CỘT ĐỂ LỌC) -->
              <tr>
                <th style="width:40px;text-align:center" class="sortable-th" onclick="setCheckXeSort('stt')">STT ${getSortIcon('stt')}</th>
                <th style="width:120px" class="sortable-th" onclick="setCheckXeSort('plate')">BIỂN SỐ / WO ${getSortIcon('plate')}</th>
                <th style="width:110px" class="sortable-th" onclick="setCheckXeSort('vehicle')">DÒNG XE / VIN ${getSortIcon('vehicle')}</th>
                <th style="width:115px" class="sortable-th" onclick="setCheckXeSort('tech')">KTV PHỤ TRÁCH ${getSortIcon('tech')}</th>
                <th style="width:125px" class="sortable-th" onclick="setCheckXeSort('category')">HẠNG MỤC LỖI ${getSortIcon('category')}</th>
                <th style="width:125px" class="sortable-th" onclick="setCheckXeSort('part_status')">TRẠNG THÁI LK ${getSortIcon('part_status')}</th>
                <th style="width:145px" class="sortable-th" onclick="setCheckXeSort('part_serial')">SỐ MÁY / SERIAL ${getSortIcon('part_serial')}</th>
                <th style="width:105px" class="sortable-th" onclick="setCheckXeSort('part_removed')">NGÀY THÁO LK ${getSortIcon('part_removed')}</th>
                <th style="width:130px" class="sortable-th" onclick="setCheckXeSort('bh_code')">LỆNH BH / ĐXBH ${getSortIcon('bh_code')}</th>
                <th style="min-width:120px" class="sortable-th" onclick="setCheckXeSort('note')">GHI CHÚ KTV ${getSortIcon('note')}</th>
                <th style="width:105px" class="sortable-th" onclick="setCheckXeSort('date')">NGÀY NHẬN ${getSortIcon('date')}</th>
                <th style="width:130px" class="sortable-th" onclick="setCheckXeSort('status')">TRẠNG THÁI CHECK ${getSortIcon('status')}</th>
                <th style="width:75px;text-align:center">THAO TÁC</th>
              </tr>
              <tr class="filter-header-row">
                <th style="text-align:center"><span style="font-size:11px;color:var(--text-muted)">Lọc:</span></th>
                <th><input type="text" class="col-filter-input" placeholder="🔍 Biển / WO..." value="${esc(state.checkXe.searchPlate || '')}" oninput="setCheckXeColFilter('searchPlate', this.value)"></th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterVehicle', this.value)">
                    <option value="">-- Xe --</option>
                    ${vehicles.map(v => `<option value="${esc(v)}" ${state.checkXe.filterVehicle === v ? 'selected' : ''}>${esc(v)}</option>`).join('')}
                  </select>
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterTech', this.value)">
                    <option value="">-- KTV --</option>
                    ${techs.map(t => `<option value="${esc(t)}" ${state.checkXe.filterTech === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}
                  </select>
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterCategory', this.value)">
                    <option value="all">-- Mục lỗi --</option>
                    ${ISSUE_CATEGORIES.map(c => `<option value="${c.id}" ${state.checkXe.filterCategory === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                  </select>
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterPartStatus', this.value)">
                    <option value="all">-- TT LK --</option>
                    <option value="waiting_motor" ${state.checkXe.filterPartStatus === 'waiting_motor' ? 'selected' : ''}>⚡ Chờ Động cơ</option>
                    <option value="waiting_battery" ${state.checkXe.filterPartStatus === 'waiting_battery' ? 'selected' : ''}>🔋 Chờ PIN</option>
                    <option value="checking" ${state.checkXe.filterPartStatus === 'checking' ? 'selected' : ''}>⏳ Chờ kiểm tra</option>
                    <option value="has_part" ${state.checkXe.filterPartStatus === 'has_part' ? 'selected' : ''}>📦 Có LK</option>
                    <option value="none" ${state.checkXe.filterPartStatus === 'none' ? 'selected' : ''}>⚪ Không LK</option>
                  </select>
                </th>
                <th>
                  <input type="text" class="col-filter-input" placeholder="🔍 Số máy/Serial..." value="${esc(state.checkXe.searchPartSerial || '')}" oninput="setCheckXeColFilter('searchPartSerial', this.value)">
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterRemovedDate', this.value)">
                    <option value="all">-- Tháo --</option>
                    <option value="has_date" ${state.checkXe.filterRemovedDate === 'has_date' ? 'selected' : ''}>Đã tháo</option>
                    <option value="no_date" ${state.checkXe.filterRemovedDate === 'no_date' ? 'selected' : ''}>Chưa tháo</option>
                  </select>
                </th>
                <th>
                  <input type="text" class="col-filter-input" placeholder="🔍 Lệnh BH / ĐX..." value="${esc(state.checkXe.searchBhCode || '')}" oninput="setCheckXeColFilter('searchBhCode', this.value)">
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterHasNote', this.value)">
                    <option value="all">-- Ghi chú --</option>
                    <option value="yes" ${state.checkXe.filterHasNote === 'yes' ? 'selected' : ''}>📝 Có ghi chú</option>
                    <option value="no" ${state.checkXe.filterHasNote === 'no' ? 'selected' : ''}>⚪ Chưa có</option>
                  </select>
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterDate', this.value)">
                    <option value="all">-- Ngày --</option>
                    <option value="today" ${state.checkXe.filterDate === 'today' ? 'selected' : ''}>Hôm nay</option>
                    <option value="yesterday" ${state.checkXe.filterDate === 'yesterday' ? 'selected' : ''}>Hôm qua</option>
                    <option value="last7" ${state.checkXe.filterDate === 'last7' ? 'selected' : ''}>7 ngày</option>
                    ${sortedDates.map(iso => `<option value="${iso}" ${state.checkXe.filterDate === iso ? 'selected' : ''}>${dateCounts[iso].disp}</option>`).join('')}
                  </select>
                </th>
                <th>
                  <select class="col-filter-select" onchange="setCheckXeColFilter('filterStatus', this.value)">
                    <option value="all">-- Trạng thái --</option>
                    <option value="no_fault" ${state.checkXe.filterStatus === 'no_fault' ? 'selected' : ''}>✅ Xe không lỗi (${noFaultList.length})</option>
                    <option value="unchecked" ${state.checkXe.filterStatus === 'unchecked' ? 'selected' : ''}>🔴 Chưa check (${uncheckedList.length})</option>
                    <option value="checked" ${state.checkXe.filterStatus === 'checked' ? 'selected' : ''}>✅ Đã check (${checkedList.length})</option>
                    <option value="recheck" ${state.checkXe.filterStatus === 'recheck' ? 'selected' : ''}>⚠️ Cần check lại (${recheckList.length})</option>
                  </select>
                </th>
                <th style="text-align:center">
                  <button class="btn secondary" style="width:100%;padding:3px 4px;font-size:11px" onclick="resetCheckXeFilters()">🔄 Xóa</button>
                </th>
              </tr>
            `}
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="${state.checkXe.viewMode === 'card' ? 10 : 13}" style="text-align:center;padding:36px;color:var(--text-muted);font-size:13px">Không tìm thấy xe nào phù hợp với bộ lọc hiện tại.<br><button class="btn secondary" style="margin-top:10px;font-size:12px" onclick="resetCheckXeFilters()">🔄 Xóa các bộ lọc để xem lại danh sách</button></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}'''

html = re.sub(table_regex, new_table_code, html, count=1)
print("Updated table header, filter header row, and view mode toggle logic!")

# 4. Update row rendering inside filtered.map
old_row_regex = r'const rowsHtml = filtered\.map\(\(o, idx\) => \{[\s\S]*?return `\s*<tr class="\$\{rowClass\}">[\s\S]*?</tr>`;\s*\}\)\.join\(\'\'\);'

new_row_code = '''const rowsHtml = filtered.map((o, idx) => {
    const originalIndex = allOrders.indexOf(o);
    const stCode = o.checkStatus.code;
    const rowClass = stCode === 'no_fault' ? 'row-no-fault' : stCode === 'checked' ? 'row-checked' : stCode === 'recheck' ? 'row-recheck' : 'row-unchecked';
    
    // Check status badge HTML
    const checkStatusBadge = stCode === 'no_fault' ? 
      `<span class="status-pill no_fault" title="${esc(o.checkStatus.desc)}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> XE KHÔNG LỖI</span>` :
      stCode === 'checked' ? 
      `<span class="status-pill checked" title="${esc(o.checkStatus.desc)}">${window.ICONS.checkCircle} ĐÃ CHECK</span>` : 
      stCode === 'recheck' ?
      `<span class="status-pill recheck" title="${esc(o.checkStatus.desc)}">${window.ICONS.alertTriangle} CẦN CHECK LẠI</span>` :
      `<span class="status-pill unchecked" title="${esc(o.checkStatus.desc)}">${window.ICONS.alertCircle} CHƯA CHECK</span>`;

    // Part status badge
    const isMotor = (o.category && o.category.id === 'motor') || (o.partStatusText && o.partStatusText.includes('Động cơ'));
    const isPin = (o.category && o.category.id === 'pin') || (o.partStatusText && o.partStatusText.includes('PIN'));
    const partStatusClass = isMotor ? 'badge-motor' : isPin ? 'badge-pin' : 'badge-esim';
    
    if(state.checkXe.viewMode === 'card') {
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
            <span style="font-weight:600;color:#e2e8f0">${esc(o.tech)}</span>
          </td>
          <td class="l part-name-cell">
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
          <td class="l part-name-cell" style="vertical-align:middle;min-width:300px">
            ${formatBangCapNhatHtml(o)}
          </td>
          <td class="l part-name-cell">
            ${o.hasKtvNote ? 
              `<div style="font-weight:600;color:#f8fafc;font-size:12.5px">${esc(o.note)}</div>` : 
              `<span style="color:#94a3b8;font-style:italic;font-size:12px">— Trống</span>`
            }
          </td>
          <td class="l">
            <div style="font-size:12px;font-weight:600">📅 ${esc(o.dateStr)}</div>
            <div style="font-size:11px;color:var(--text-muted)">${esc(o.status)}</div>
          </td>
          <td class="l">
            ${checkStatusBadge}
          </td>
          <td class="l">
            <button class="btn secondary" style="padding:4px 8px;font-size:11.5px" onclick="openEditNoteModal(${originalIndex})" title="Cập nhật ghi chú hoặc kiểm tra">
              ${window.ICONS.edit} Xem/Sửa
            </button>
          </td>
        </tr>`;
    }

    // MẶC ĐỊNH: CHẾ ĐỘ XEM CỘT CHI TIẾT
    return `
      <tr class="${rowClass}">
        <td class="num">${idx + 1}</td>
        <td class="l">
          <b style="font-size:13.5px;color:var(--text-main);letter-spacing:0.5px">${esc(o.plate)}</b>
          <div style="font-size:11px;color:var(--text-muted);font-family:monospace">${esc(o.wo)}</div>
        </td>
        <td class="l">
          <b style="font-size:12.5px">${esc(o.vehicle)}</b>
          <div style="font-size:11px;font-family:monospace;color:var(--text-muted)">VIN: ...${esc(String(o.vin).slice(-6))}</div>
        </td>
        <td class="l">
          <span style="font-weight:600;font-size:12px;color:#e2e8f0">${esc(o.tech)}</span>
        </td>
        <td class="l part-name-cell">
          ${o.hasLoi ? `
            <div style="display:flex;gap:4px;flex-wrap:wrap">
              ${o.faultList.map(f => `<span class="sos-fault-badge">${esc(f)}</span>`).join('')}
            </div>
          ` : `
            <span class="sos-no-fault-badge">Không lỗi</span>
          `}
        </td>
        <td class="l">
          ${o.partStatusText && o.partStatusText !== '—' ? 
            `<span class="part-status-badge ${partStatusClass}">${esc(o.partStatusText)}</span>` : 
            `<span style="color:var(--text-muted);opacity:0.35">—</span>`
          }
        </td>
        <td class="l">
          ${o.partSerialText && o.partSerialText !== '—' ? 
            `<span class="font-mono" style="font-size:11.5px;font-weight:600;color:#38bdf8">${esc(o.partSerialText)}</span>` : 
            `<span style="color:var(--text-muted);opacity:0.35">—</span>`
          }
        </td>
        <td class="l">
          ${o.partRemovedDateText && o.partRemovedDateText !== '—' ? 
            `<span style="font-size:11.5px;font-weight:600;color:#f8fafc">${esc(o.partRemovedDateText)}</span>` : 
            `<span style="color:var(--text-muted);opacity:0.35">—</span>`
          }
        </td>
        <td class="l">
          ${o.bhCodeText && o.bhCodeText !== '—' ? 
            `<div style="font-size:11.5px;font-weight:600;font-family:monospace;color:#c084fc">${esc(o.bhCodeText)}</div>` : 
            (o.claimCodeText && o.claimCodeText !== '—' ? 
              `<div style="font-size:11px;font-family:monospace;color:#fbbf24">${esc(o.claimCodeText)}</div>` : 
              `<span style="color:var(--text-muted);opacity:0.35">—</span>`)
          }
        </td>
        <td class="l part-name-cell">
          ${o.hasKtvNote ? 
            `<div style="font-weight:600;color:#f8fafc;font-size:12px">${esc(o.note)}</div>` : 
            `<span style="color:#94a3b8;font-style:italic;font-size:11.5px">— Trống</span>`
          }
        </td>
        <td class="l">
          <div style="font-size:11.5px;font-weight:600">📅 ${esc(o.dateStr)}</div>
          <div style="font-size:10.5px;color:var(--text-muted)">${esc(o.status)}</div>
        </td>
        <td class="l">
          ${checkStatusBadge}
        </td>
        <td class="l" style="text-align:center">
          <button class="btn secondary" style="padding:3px 7px;font-size:11px" onclick="openEditNoteModal(${originalIndex})" title="Cập nhật ghi chú hoặc kiểm tra">
            ${window.ICONS.edit} Xem/Sửa
          </button>
        </td>
      </tr>`;
  }).join('');'''

html = re.sub(old_row_regex, new_row_code, html, count=1)
print("Updated table rows mapping for both Table mode and Card mode!")

# 5. Add CSS for .status-pill.no_fault, .row-no-fault, .part-status-badge
css_target = r'/* ServiceOS Fault Badges & Exact Warranty Card */'
css_new = '''/* ServiceOS Fault Badges & Exact Warranty Card */
      .status-pill.no_fault {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        background: rgba(16, 185, 129, 0.16);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.45);
        letter-spacing: 0.3px;
      }
      [data-theme="light"] .status-pill.no_fault {
        background: #ecfdf5;
        color: #059669;
        border: 1px solid #6ee7b7;
      }
      .row-no-fault {
        background: rgba(15, 23, 42, 0.35);
      }
      .part-status-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
      }
      .part-status-badge.badge-motor {
        background: rgba(168, 85, 247, 0.15);
        color: #c084fc;
        border: 1px solid rgba(168, 85, 247, 0.35);
      }
      .part-status-badge.badge-pin {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.35);
      }
      .part-status-badge.badge-esim {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.35);
      }
'''

html = html.replace(css_target, css_new, 1)
print("Added CSS for no_fault status and part status badges!")

# 6. Save back to _build/app_template2.html
with io.open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("SUCCESS: Updated _build/app_template2.html!")
