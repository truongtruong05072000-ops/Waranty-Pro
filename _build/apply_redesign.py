import sys, re
sys.stdout.reconfigure(encoding='utf-8')

# Read app_template2.html
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update state.checkXe default viewMode
old_state_init = """state.checkXe = {
  orders: [],
  filterCategory: 'all',"""

new_state_init = """state.checkXe = {
  orders: [],
  viewMode: 'card',        // Mặc định 'card' (Thẻ ServiceOS thông minh)
  filterCategory: 'all',"""

if old_state_init in content:
    content = content.replace(old_state_init, new_state_init, 1)
    print("Updated state.checkXe.viewMode default to 'card'")
else:
    print("Warning: old_state_init pattern not found, checking if already updated...")

# Find boundaries of renderCheckXe
start_marker = "// Render giao diện Check lỗi xe hàng ngày (với bảng lọc trực tiếp từng cột và xuất Excel)\nfunction renderCheckXe(options = {}){"
if start_marker not in content:
    start_marker = "function renderCheckXe(options = {}){"

end_marker = "function parseServiceOsWorkbook(wb){"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error: start_idx={start_idx}, end_idx={end_idx}")
    sys.exit(1)

print(f"Found renderCheckXe from {start_idx} to {end_idx}")

# Read redesigned renderCheckXe code
new_render_code = r'''// Render giao diện Check lỗi xe hàng ngày (Thiết kế hiện đại, thông minh, không bị khuất)
function renderCheckXe(options = {}){
  const allOrders = state.checkXe.orders || [];
  const totalAll = allOrders.length;
  if (!state.checkXe.viewMode) state.checkXe.viewMode = 'card';
  
  // Phân loại theo quy tắc nghiệp vụ
  const noFaultList = allOrders.filter(o => o.checkStatus.code === 'no_fault' || o.checkStatus.code === 'normal');
  const uncheckedList = allOrders.filter(o => o.checkStatus.code === 'unchecked');
  const recheckList = allOrders.filter(o => o.checkStatus.code === 'recheck');
  const checkedList = allOrders.filter(o => o.checkStatus.code === 'checked');
  const normalList = noFaultList;

  // Tổng số xe trong diện theo dõi lỗi (loại trừ xe không lỗi)
  const issueOrders = allOrders.filter(o => o.checkStatus.code !== 'no_fault' && o.checkStatus.code !== 'normal');
  const totalIssue = issueOrders.length;

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
      ctxVal.textContent = (uncheckedList.length + recheckList.length) + ' / ' + (totalIssue || totalAll);
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
            <div class="card-title">${window.ICONS.carCheck} Check lỗi xe hàng ngày — Dữ liệu ServiceOS</div>
            <div class="card-subtitle">Áp dụng chuẩn 4 quy tắc check: Hạng mục lỗi · Ghi chú KTV · Bảng cập nhật phía dưới</div>
          </div>
          <div class="toolbar-right">
            <button class="btn primary" onclick="openBookmarkletModal('api')">${window.ICONS.zap} Đồng bộ API ServiceOS</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu (Ctrl+V)</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">${window.ICONS.folder} Nhập Excel ServiceOS</button>
            <input type="file" id="serviceOsFileInput" style="display:none" accept=".xlsx,.xls" onchange="handleServiceOsFileSelect(this.files)">
          </div>
        </div>

        <div class="empty-state">
          <div class="empty-state-icon">🛵</div>
          <h3 style="font-size:16px;color:var(--text-main);margin-bottom:6px">Chưa có dữ liệu xe từ ServiceOS</h3>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:18px;max-width:580px;margin-left:auto;margin-right:auto;line-height:1.6">
            Bạn có thể <b>đồng bộ trực tiếp từ ServiceOS</b> bằng Tiện ích 1-Click hoặc lệnh F12 để lấy đầy đủ 100% xe đang trong xưởng, tự động phân tích theo 4 quy tắc nghiệp vụ!
          </p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn primary" onclick="openBookmarkletModal('api')">⚡ Đồng bộ API ServiceOS (Cách 2)</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu đã copy (Ctrl+V)</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Chọn file Excel ServiceOS</button>
          </div>
        </div>
      </div>`;
    return;
  }

  // Tập dữ liệu theo phạm vi lọc: 'issue_only' hoặc 'all' (mặc định 'all' để xem đủ toàn bộ xe)
  const scopeOrders = state.checkXe.filterScope === 'issue_only' ? (issueOrders.length > 0 ? issueOrders : allOrders) : allOrders;

  // Thống kê theo hạng mục lỗi
  const catCounts = { all: scopeOrders.length };
  scopeOrders.forEach(o => {
    const cid = o.category.id;
    catCounts[cid] = (catCounts[cid] || 0) + 1;
  });

  // Render các pill hạng mục lỗi
  const catPillsHtml = ISSUE_CATEGORIES.map(c => {
    const cnt = catCounts[c.id] || 0;
    if(c.id !== 'all' && cnt === 0) return '';
    const isActive = state.checkXe.filterCategory === c.id;
    return `
      <button class="custom-cat-pill ${isActive ? 'active' : ''}" onclick="setCheckXeCat('${c.id}')">
        ${c.name}${cnt > 0 ? ` <span class="pill-badge">${cnt}</span>` : ''}
      </button>`;
  }).join('');

  // Thống kê theo ngày nhận xe
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

  // Danh sách các Dòng xe và KTV có trong dữ liệu để điền vào bộ lọc
  const vehicles = [...new Set(allOrders.map(o => o.vehicle).filter(v => v && v !== '—'))].sort();
  const techs = [...new Set(allOrders.map(o => o.tech).filter(Boolean))].sort();

  // BỘ LỌC DỮ LIỆU ĐA TẦNG
  let filtered = scopeOrders;

  // 1. Lọc Hạng mục
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
  }
  // 2. Lọc Trạng thái check
  if(state.checkXe.filterStatus !== 'all'){
    filtered = filtered.filter(o => o.checkStatus.code === state.checkXe.filterStatus);
  }
  // 3. Lọc Ngày nhận
  if(state.checkXe.filterDate !== 'all'){
    filtered = filtered.filter(o => isDateMatch(o.isoDate, state.checkXe.filterDate));
  }
  // 4. Lọc KTV
  if(state.checkXe.filterTech){
    filtered = filtered.filter(o => o.tech === state.checkXe.filterTech);
  }
  // 5. Lọc Dòng xe
  if(state.checkXe.filterVehicle){
    filtered = filtered.filter(o => o.vehicle === state.checkXe.filterVehicle);
  }
  // 6. Lọc Bảng cập nhật phía dưới
  if(state.checkXe.filterHasTable === 'yes'){
    filtered = filtered.filter(o => o.hasBangCapNhat);
  } else if(state.checkXe.filterHasTable === 'no'){
    filtered = filtered.filter(o => !o.hasBangCapNhat);
  }
  // 6b. Lọc theo Trạng thái linh kiện
  if(state.checkXe.filterPartStatus && state.checkXe.filterPartStatus !== 'all'){
    if(state.checkXe.filterPartStatus === 'has_part'){
      filtered = filtered.filter(o => o.hasBangCapNhat);
    } else if(state.checkXe.filterPartStatus === 'none'){
      filtered = filtered.filter(o => !o.hasBangCapNhat);
    } else {
      const qps = state.checkXe.filterPartStatus.toLowerCase();
      filtered = filtered.filter(o => {
        const rawS = String(o.warrantyStatus || o.bhOrderStatus || '').toLowerCase();
        const dispS = String(o.partStatusText || '').toLowerCase();
        return rawS.includes(qps) || dispS.includes(qps);
      });
    }
  }
  // 6c. Tìm kiếm Số máy / Serial PIN
  if(state.checkXe.searchPartSerial){
    const qSer = norm(state.checkXe.searchPartSerial);
    filtered = filtered.filter(o => norm(o.partSerialText || '').includes(qSer) || norm(o.motorSerial || '').includes(qSer) || norm(o.pinSerial || '').includes(qSer));
  }
  // 6d. Tìm kiếm Lệnh BH / ĐXBH
  if(state.checkXe.searchBhCode){
    const qBh = norm(state.checkXe.searchBhCode);
    filtered = filtered.filter(o => norm(o.bhCodeText || '').includes(qBh) || norm(o.claimCodeText || '').includes(qBh) || norm(o.bhCode || '').includes(qBh) || norm(o.claimCode || '').includes(qBh));
  }
  // 6e. Lọc Ngày tháo linh kiện
  if(state.checkXe.filterRemovedDate && state.checkXe.filterRemovedDate !== 'all'){
    if(state.checkXe.filterRemovedDate === 'has_date'){
      filtered = filtered.filter(o => o.partRemovedDateText && o.partRemovedDateText !== '—');
    } else if(state.checkXe.filterRemovedDate === 'no_date'){
      filtered = filtered.filter(o => !o.partRemovedDateText || o.partRemovedDateText === '—');
    }
  }
  // 7. Lọc Ghi chú KTV
  if(state.checkXe.filterHasNote === 'yes'){
    filtered = filtered.filter(o => o.hasKtvNote);
  } else if(state.checkXe.filterHasNote === 'no'){
    filtered = filtered.filter(o => !o.hasKtvNote);
  }
  // 8. Lọc Biển số / Mã WO riêng
  if(state.checkXe.searchPlate){
    const qp = norm(state.checkXe.searchPlate);
    filtered = filtered.filter(o => norm(o.plate + ' ' + o.wo + ' ' + o.vin).includes(qp));
  }
  // 9. Tìm kiếm tự do
  if(state.checkXe.searchQuery){
    const q = norm(state.checkXe.searchQuery);
    filtered = filtered.filter(o => norm(o.plate + ' ' + o.wo + ' ' + o.vin + ' ' + o.vehicle + ' ' + o.tech + ' ' + o.issue + ' ' + o.note + ' ' + o.updateTableText + ' ' + o.status).includes(q));
  }

  // SẮP XẾP (SORTING)
  const sortBy = state.checkXe.sortBy || 'stt';
  const sortDir = state.checkXe.sortDir || 'asc';
  if(sortBy !== 'stt'){
    filtered = [...filtered].sort((a, b) => {
      let vA = '', vB = '';
      if(sortBy === 'plate') { vA = a.plate; vB = b.plate; }
      else if(sortBy === 'vehicle') { vA = a.vehicle; vB = b.vehicle; }
      else if(sortBy === 'tech') { vA = a.tech; vB = b.tech; }
      else if(sortBy === 'category') { vA = a.category.name; vB = b.category.name; }
      else if(sortBy === 'date') { vA = a.isoDate || a.dateStr; vB = b.isoDate || b.dateStr; }
      else if(sortBy === 'status') {
        const orderMap = { unchecked: 1, recheck: 2, checked: 3, normal: 4, no_fault: 4 };
        vA = orderMap[a.checkStatus.code] || 99;
        vB = orderMap[b.checkStatus.code] || 99;
        return sortDir === 'desc' ? vB - vA : vA - vB;
      }
      else if(sortBy === 'bang') {
        vA = a.hasBangCapNhat ? 1 : 0;
        vB = b.hasBangCapNhat ? 1 : 0;
        return sortDir === 'desc' ? vB - vA : vA - vB;
      }
      else if(sortBy === 'part_status') { vA = a.partStatusText; vB = b.partStatusText; }
      else if(sortBy === 'part_serial') { vA = a.partSerialText; vB = b.partSerialText; }
      else if(sortBy === 'part_removed') { vA = a.partRemovedDateText; vB = b.partRemovedDateText; }
      else if(sortBy === 'bh_code') { vA = a.bhCodeText; vB = b.bhCodeText; }
      else if(sortBy === 'note') {
        vA = a.hasKtvNote ? 1 : 0;
        vB = b.hasKtvNote ? 1 : 0;
        return sortDir === 'desc' ? vB - vA : vA - vB;
      }
      const cmp = String(vA || '').localeCompare(String(vB || ''), 'vi');
      return sortDir === 'desc' ? -cmp : cmp;
    });
  } else if(sortDir === 'desc') {
    filtered = [...filtered].reverse();
  }

  // Lưu danh sách đang lọc để xuất Excel chính xác
  window.currentFilteredCheckXeOrders = filtered;

  // Helper render sort indicator
  const getSortIcon = (col) => {
    if(state.checkXe.sortBy !== col) return '<span style="opacity:0.35;font-size:10px;margin-left:4px">⇅</span>';
    return state.checkXe.sortDir === 'asc' ? '<span style="color:#38bdf8;font-weight:bold;margin-left:4px">▲</span>' : '<span style="color:#38bdf8;font-weight:bold;margin-left:4px">▼</span>';
  };

  // Kiểm tra có đang áp dụng bất kỳ bộ lọc nào không
  const isFiltering = state.checkXe.filterCategory !== 'all' || 
                      state.checkXe.filterStatus !== 'all' || 
                      state.checkXe.filterDate !== 'all' || 
                      Boolean(state.checkXe.filterTech) || 
                      Boolean(state.checkXe.filterVehicle) || 
                      state.checkXe.filterHasTable !== 'all' || 
                      state.checkXe.filterHasNote !== 'all' || 
                      Boolean(state.checkXe.filterPartStatus && state.checkXe.filterPartStatus !== 'all') ||
                      Boolean(state.checkXe.searchPartSerial) ||
                      Boolean(state.checkXe.searchBhCode) ||
                      Boolean(state.checkXe.searchPlate) || 
                      Boolean(state.checkXe.searchQuery);

  // Bảng các dòng xe
  const rowsHtml = filtered.map((o, idx) => {
    const originalIndex = allOrders.indexOf(o);
    const stCode = o.checkStatus.code;
    const rowClass = (stCode === 'no_fault' || stCode === 'normal') ? 'row-no-fault' : stCode === 'checked' ? 'row-checked' : stCode === 'recheck' ? 'row-recheck' : 'row-unchecked';
    
    // Status pill badge HTML - Chuẩn đẹp, không bao giờ bị cắt chữ
    const checkStatusBadge = (stCode === 'no_fault' || stCode === 'normal') ? 
      `<span class="status-pill no_fault" title="${esc(o.checkStatus.desc)}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Xe không lỗi</span>` :
      stCode === 'checked' ? 
      `<span class="status-pill checked" title="${esc(o.checkStatus.desc)}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Đã check</span>` : 
      stCode === 'recheck' ?
      `<span class="status-pill recheck" title="${esc(o.checkStatus.desc)}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Cần check lại</span>` :
      `<span class="status-pill unchecked" title="${esc(o.checkStatus.desc)}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Chưa check</span>`;

    // Part status badge
    const isMotor = (o.category && o.category.id === 'motor') || (o.partStatusText && o.partStatusText.includes('Động cơ'));
    const isPin = (o.category && o.category.id === 'pin') || (o.partStatusText && o.partStatusText.includes('PIN'));
    const partStatusClass = isMotor ? 'badge-motor' : isPin ? 'badge-pin' : 'badge-esim';

    // Cell thông tin xe kết hợp (Biển số + Dòng xe + WO + VIN) cực gọn gàng và sang trọng
    const carInfoCellHtml = `
      <div class="car-info-cell">
        <div class="car-info-row1">
          <span class="car-plate">${esc(o.plate || '—')}</span>
          ${o.vehicle && o.vehicle !== '—' ? `<span class="car-vehicle-pill">${esc(o.vehicle)}</span>` : ''}
        </div>
        <div class="car-info-row2">
          <span class="car-wo" title="Mã phiếu sửa chữa WO">${esc(o.wo || '—')}</span>
          ${o.vin ? `<span class="car-vin" title="Số khung VIN">VIN: ...${esc(String(o.vin).slice(-6))}</span>` : ''}
        </div>
      </div>
    `;
    
    // CHẾ ĐỘ THẺ GỌN SERVICEOS (MẶC ĐỊNH & KHUYÊN DÙNG)
    if(state.checkXe.viewMode === 'card') {
      return `
        <tr class="${rowClass}">
          <td class="num">${idx + 1}</td>
          <td class="l">${carInfoCellHtml}</td>
          <td class="l">
            <span style="font-weight:600;font-size:12px;color:#e2e8f0">${esc(o.tech || 'Chưa phân công')}</span>
          </td>
          <td class="l part-name-cell">
            ${o.hasLoi ? `
              <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:3px">
                ${o.faultList.map(f => `<span class="sos-fault-badge">${esc(f)}</span>`).join('')}
              </div>
              ${o.issueDesc ? `<div style="font-weight:600;line-height:1.4;margin-top:3px;color:var(--text-main);font-size:11.5px">${esc(o.issueDesc)}</div>` : ''}
            ` : `
              <span class="sos-no-fault-badge">Không lỗi</span>
              ${o.issueDesc ? `<div style="color:var(--text-muted);font-size:11px;margin-top:3px">${esc(o.issueDesc)}</div>` : ''}
            `}
          </td>
          <td class="l part-name-cell" style="vertical-align:middle;max-width:270px">
            ${formatBangCapNhatHtml(o)}
          </td>
          <td class="l part-name-cell">
            ${o.hasKtvNote ? 
              `<div style="font-weight:600;color:#f8fafc;font-size:12px">${esc(o.note)}</div>` : 
              `<span class="empty-note">— Trống</span>`
            }
          </td>
          <td class="l">
            <div style="font-size:11.5px;font-weight:600">📅 ${esc(o.dateStr)}</div>
            <div style="font-size:10.5px;color:var(--text-muted)">${esc(o.status)}</div>
          </td>
          <td class="l" style="white-space:nowrap">
            ${checkStatusBadge}
          </td>
          <td class="l sticky-action-col">
            <button class="btn secondary" style="padding:4px 8px;font-size:11.5px" onclick="openEditNoteModal(${originalIndex})" title="Cập nhật ghi chú hoặc kiểm tra">
              ${window.ICONS.edit} Xem/Sửa
            </button>
          </td>
        </tr>`;
    }

    // CHẾ ĐỘ XEM CỘT CHI TIẾT
    return `
      <tr class="${rowClass}">
        <td class="num">${idx + 1}</td>
        <td class="l">${carInfoCellHtml}</td>
        <td class="l">
          <span style="font-weight:600;font-size:12px;color:#e2e8f0">${esc(o.tech || 'Chưa phân công')}</span>
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
        <td class="l" style="text-align:center">
          ${o.partStatusText && o.partStatusText !== '—' ? 
            `<span class="part-status-badge ${partStatusClass}">${esc(o.partStatusText)}</span>` : 
            `<span class="empty-dash">—</span>`
          }
        </td>
        <td class="l" style="text-align:center">
          ${o.partSerialText && o.partSerialText !== '—' ? 
            `<span class="font-mono" style="font-size:11.5px;font-weight:600;color:#38bdf8">${esc(o.partSerialText)}</span>` : 
            `<span class="empty-dash">—</span>`
          }
        </td>
        <td class="l" style="text-align:center">
          ${o.partRemovedDateText && o.partRemovedDateText !== '—' ? 
            `<span style="font-size:11.5px;font-weight:600;color:#f8fafc">${esc(o.partRemovedDateText)}</span>` : 
            `<span class="empty-dash">—</span>`
          }
        </td>
        <td class="l" style="text-align:center">
          ${o.bhCodeText && o.bhCodeText !== '—' ? 
            `<div style="font-size:11.5px;font-weight:600;font-family:monospace;color:#c084fc">${esc(o.bhCodeText)}</div>` : 
            (o.claimCodeText && o.claimCodeText !== '—' ? 
              `<div style="font-size:11px;font-family:monospace;color:#fbbf24">${esc(o.claimCodeText)}</div>` : 
              `<span class="empty-dash">—</span>`)
          }
        </td>
        <td class="l part-name-cell">
          ${o.hasKtvNote ? 
            `<div style="font-weight:600;color:#f8fafc;font-size:12px">${esc(o.note)}</div>` : 
            `<span class="empty-note">— Trống</span>`
          }
        </td>
        <td class="l">
          <div style="font-size:11.5px;font-weight:600">📅 ${esc(o.dateStr)}</div>
          <div style="font-size:10.5px;color:var(--text-muted)">${esc(o.status)}</div>
        </td>
        <td class="l" style="white-space:nowrap">
          ${checkStatusBadge}
        </td>
        <td class="l sticky-action-col">
          <button class="btn secondary" style="padding:4px 8px;font-size:11.5px" onclick="openEditNoteModal(${originalIndex})" title="Cập nhật ghi chú hoặc kiểm tra">
            ${window.ICONS.edit} Xem/Sửa
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

  // Cập nhật đè giao diện tại chỗ (Seamless in-place update) nếu bảng đã tồn tại
  if(options && options.inPlace && document.getElementById('checkXeTbody')){
    const tb = document.getElementById('checkXeTbody');
    const nf = document.getElementById('kpiNoFaultVal');
    const uc = document.getElementById('kpiUncheckedVal');
    const ck = document.getElementById('kpiCheckedVal');
    const rc = document.getElementById('kpiRecheckVal');
    const tt = document.getElementById('kpiTotalVal');
    const cd = document.getElementById('checkXeFilterCountDisplay');
    if(nf) nf.textContent = noFaultList.length;
    if(uc) uc.textContent = uncheckedList.length;
    if(ck) ck.textContent = checkedList.length;
    if(rc) rc.textContent = recheckList.length;
    if(tt) tt.textContent = totalAll;
    if(cd) cd.textContent = `Hiển thị ${filtered.length} / ${totalAll} xe`;
    if(tb) tb.innerHTML = rowsHtml || `<tr><td colspan="${state.checkXe.viewMode === 'card' ? 9 : 12}" style="text-align:center;padding:36px;color:var(--text-muted);font-size:13px">Không tìm thấy xe nào phù hợp với bộ lọc hiện tại.</td></tr>`;
    return;
  }

  el.innerHTML = `
    <style>
      .custom-cat-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: rgba(13, 20, 36, 0.72);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(56, 189, 248, 0.16);
        border-radius: 14px;
        padding: 14px 18px;
        margin-bottom: 14px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      }
      .custom-cat-header {
        font-size: 11.5px;
        font-weight: 700;
        color: #7dd3fc;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: 6px;
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
        padding: 5px 13px;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(17, 27, 49, 0.65);
        color: #cbd5e1;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .custom-cat-pill:hover {
        border-color: #38bdf8;
        background: rgba(56, 189, 248, 0.12);
        color: #ffffff;
        transform: translateY(-1px);
        box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
      }
      .custom-cat-pill.active {
        border-color: #38bdf8;
        background: linear-gradient(135deg, #0284c7, #0ea5e9);
        color: #ffffff;
        font-weight: 700;
        box-shadow: 0 0 16px rgba(56, 189, 248, 0.5);
      }
      .custom-cat-pill .pill-badge {
        font-size: 10.5px;
        font-weight: 700;
        background: rgba(0, 0, 0, 0.35);
        color: #94a3b8;
        padding: 1px 6px;
        border-radius: 10px;
      }
      .custom-cat-pill.active .pill-badge {
        background: rgba(255, 255, 255, 0.25);
        color: #ffffff;
      }
      .date-filter-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        background: rgba(13, 20, 36, 0.72);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(56, 189, 248, 0.16);
        border-radius: 12px;
        padding: 10px 16px;
        margin-bottom: 14px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      }
      .date-chip {
        padding: 5px 12px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(17, 27, 49, 0.7);
        color: #cbd5e1;
        font-size: 12px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      }
      .date-chip:hover {
        background: rgba(56, 189, 248, 0.12);
        border-color: #38bdf8;
        color: #ffffff;
      }
      .date-chip.active {
        background: linear-gradient(135deg, #0284c7, #0ea5e9);
        color: #ffffff;
        border-color: #38bdf8;
        font-weight: 700;
        box-shadow: 0 0 12px rgba(56, 189, 248, 0.45);
      }
      .scope-toggle-btn {
        padding: 5px 12px;
        border-radius: 8px;
        font-size: 12px;
        cursor: pointer;
        border: 1px solid rgba(56, 189, 248, 0.22);
        background: rgba(17, 27, 49, 0.7);
        color: #94a3b8;
        font-weight: 600;
        transition: all 0.2s;
      }
      .scope-toggle-btn.active {
        background: linear-gradient(135deg, #1e293b, #0f172a);
        color: #38bdf8;
        border-color: #38bdf8;
        box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
      }

      /* THANH BỘ LỌC TINH GỌN (SMART FILTER BAR) */
      .checkxe-filter-bar {
        background: rgba(13, 20, 36, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(56, 189, 248, 0.18);
        border-radius: 12px;
        padding: 10px 14px;
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      }
      .filter-search-box {
        flex: 1 1 220px;
        min-width: 200px;
        position: relative;
        display: flex;
        align-items: center;
      }
      .filter-search-box svg {
        position: absolute;
        left: 10px;
        color: #64748b;
        pointer-events: none;
      }
      .filter-search-input {
        width: 100%;
        padding: 6px 12px 6px 30px;
        border-radius: 8px;
        border: 1px solid rgba(56, 189, 248, 0.22);
        background: rgba(15, 23, 42, 0.85);
        color: #f8fafc;
        font-size: 12px;
        outline: none;
        transition: all 0.2s;
      }
      .filter-search-input:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 10px rgba(56, 189, 248, 0.35);
      }
      .filter-select-group {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .filter-select-wrapper {
        display: flex;
        align-items: center;
        gap: 5px;
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(56, 189, 248, 0.18);
        border-radius: 8px;
        padding: 3px 8px;
      }
      .filter-label {
        font-size: 11px;
        color: #94a3b8;
        font-weight: 600;
        white-space: nowrap;
      }
      .filter-select {
        background: transparent;
        border: none;
        color: #f1f5f9;
        font-size: 12px;
        font-weight: 500;
        outline: none;
        cursor: pointer;
        max-width: 155px;
      }
      .filter-select option {
        background: #0f172a;
        color: #f8fafc;
      }
      .btn-clear-filter {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 5px 11px;
        border-radius: 8px;
        border: 1px solid rgba(239, 68, 68, 0.4);
        background: rgba(239, 68, 68, 0.15);
        color: #fca5a5;
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-clear-filter:hover {
        background: rgba(239, 68, 68, 0.25);
        border-color: #ef4444;
        color: #ffffff;
      }

      /* Cell thông tin xe kết hợp */
      .car-info-cell {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      .car-info-row1 {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .car-plate {
        font-size: 13.5px;
        font-weight: 700;
        color: #f8fafc;
        letter-spacing: 0.4px;
      }
      .car-vehicle-pill {
        font-size: 10.5px;
        font-weight: 600;
        padding: 1px 6px;
        border-radius: 4px;
        background: rgba(56, 189, 248, 0.12);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.25);
        white-space: nowrap;
      }
      .car-info-row2 {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #94a3b8;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }
      .car-wo {
        opacity: 0.85;
      }
      .car-vin {
        color: #64748b;
      }

      /* Sticky Right Action Column */
      .sticky-action-col {
        position: sticky;
        right: 0;
        background: #0b1220 !important;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 3;
        box-shadow: -5px 0 12px rgba(0, 0, 0, 0.45);
        text-align: center;
      }
      [data-theme="light"] .sticky-action-col {
        background: #ffffff !important;
        box-shadow: -5px 0 12px rgba(0, 0, 0, 0.08);
      }

      /* Sortable TH */
      .sortable-th {
        cursor: pointer;
        user-select: none;
        transition: background 0.15s, color 0.15s;
        padding: 10px 10px !important;
        font-size: 11px !important;
        letter-spacing: 0.04em !important;
      }
      .sortable-th:hover {
        background: rgba(56, 189, 248, 0.12) !important;
        color: #ffffff !important;
      }

      /* Empty states */
      .empty-dash {
        color: #64748b;
        opacity: 0.4;
        font-weight: 400;
        font-size: 13px;
        display: inline-block;
        width: 100%;
        text-align: center;
      }
      .empty-note {
        color: #64748b;
        font-style: italic;
        font-size: 11.5px;
        opacity: 0.6;
      }

      /* High-Tech Glassmorphic Cards for Bảng cập nhật */
      .sos-warranty-card {
        background: rgba(254, 252, 247, 0.98);
        border: 1px solid #fed7aa;
        border-radius: 8px;
        padding: 6px 10px;
        min-width: 220px;
        max-width: 260px;
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
        margin-bottom: 5px;
        padding-bottom: 4px;
        border-bottom: 1px dashed rgba(245, 158, 11, 0.25);
      }
      .sos-card-title {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
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
        font-size: 10px;
        font-weight: 600;
        color: #d97706;
        background: rgba(254, 243, 199, 0.6);
        border: 1px solid #fde68a;
        border-radius: 5px;
        padding: 1px 6px;
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
        gap: 4px 8px;
      }
      .sos-cell {
        display: flex;
        flex-direction: column;
      }
      .sos-cell .k {
        font-size: 9px;
        color: #94a3b8;
        font-weight: 500;
        margin-bottom: 1px;
      }
      .sos-cell .v {
        font-size: 10.5px;
        font-weight: 500;
        color: #1e293b;
        line-height: 1.25;
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
        font-size: 10.5px;
        color: #b45309;
      }
      [data-theme="dark"] .sos-cell .v-mono-bh {
        color: #fde047;
      }
      .sos-cell .v-mono-claim {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 700;
        font-size: 10.5px;
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

      /* Motor Theme (Violet) */
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

      /* Status Pills - Đậm nét, không bao giờ bị cắt chữ */
      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 12px;
        border-radius: 9999px;
        font-size: 11.5px;
        font-weight: 700;
        white-space: nowrap !important;
        letter-spacing: 0.2px;
      }
      .status-pill.no_fault {
        background: rgba(16, 185, 129, 0.16);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.45);
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.15);
      }
      .status-pill.unchecked {
        background: rgba(239, 68, 68, 0.16);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.45);
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.15);
      }
      .status-pill.checked {
        background: rgba(56, 189, 248, 0.16);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.45);
        box-shadow: 0 0 10px rgba(56, 189, 248, 0.15);
      }
      .status-pill.recheck {
        background: rgba(245, 158, 11, 0.16);
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.45);
        box-shadow: 0 0 10px rgba(245, 158, 11, 0.15);
      }

      .sos-fault-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 9px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 600;
        background: rgba(239, 68, 68, 0.16);
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.4);
        letter-spacing: 0.2px;
      }
      .sos-no-fault-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 9px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 600;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.4);
        letter-spacing: 0.2px;
      }
      .part-status-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 7px;
        border-radius: 5px;
        font-size: 10.5px;
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
    </style>

    <!-- Header Thông tin và Thao tác -->
    <div class="card" style="margin-bottom:14px">
      <div class="card-header">
        <div>
          <div class="card-title">${window.ICONS.carCheck} Check lỗi xe hàng ngày — Dữ liệu ServiceOS</div>
          <div class="card-subtitle">Áp dụng chuẩn 4 quy tắc nghiệp vụ: Hạng mục lỗi · Ghi chú KTV · Bảng cập nhật phía dưới</div>
        </div>
        <div class="toolbar-right" style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn primary" onclick="openBookmarkletModal('api')">${window.ICONS.zap} Đồng bộ API ServiceOS</button>
          <button class="btn secondary" onclick="importServiceOsClipboard()">${window.ICONS.clipboard} Dán xe ServiceOS (Ctrl+V)</button>
          <button class="btn secondary" onclick="importDealerPortalClipboard()">💼 Dán ĐX Dealer Portal (Ctrl+V)</button>
          <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">${window.ICONS.folder} Nhập Excel xe</button>
          <button class="btn" style="background:#15803d;color:#fff;border-color:#16a34a;font-weight:700" onclick="exportCheckXeExcel('filtered')">${window.ICONS.download} Xuất Excel</button>
          <button class="btn secondary" style="color:#dc2626" onclick="clearCheckXeData()" title="Xóa dữ liệu để nạp lại">${window.ICONS.trash}</button>
        </div>
      </div>

      <!-- 5 Thẻ KPI Chuẩn theo Nghiệp Vụ -->
      <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;padding:0 20px 20px">
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(16,185,129,0.14), rgba(15,23,42,0.7));border:1px solid rgba(16,185,129,0.38);box-shadow:0 0 15px rgba(16,185,129,0.15)" onclick="setCheckXeColFilter('filterStatus', 'no_fault')" title="Bấm để lọc danh sách xe không lỗi">
          <div class="kpi-label" style="color:#34d399">${window.ICONS.checkCircle} Xe không lỗi</div>
          <div class="kpi-val" id="kpiNoFaultVal" style="color:#34d399;text-shadow:0 0 12px rgba(16,185,129,0.4)">${noFaultList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Bình thường · Không có lỗi</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,23,42,0.7));border:1px solid rgba(239,68,68,0.35);box-shadow:0 0 15px rgba(239,68,68,0.15)" onclick="setCheckXeColFilter('filterStatus', 'unchecked')" title="Bấm để lọc xe chưa check">
          <div class="kpi-label" style="color:var(--rose-glow)">${window.ICONS.alertCircle} Chưa check (Cần xử lý)</div>
          <div class="kpi-val" id="kpiUncheckedVal" style="color:#f87171;text-shadow:0 0 12px rgba(239,68,68,0.4)">${uncheckedList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Có lỗi · Chưa ghi chú/bảng</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(56,189,248,0.12), rgba(15,23,42,0.7));border:1px solid rgba(56,189,248,0.35);box-shadow:0 0 15px rgba(56,189,248,0.15)" onclick="setCheckXeColFilter('filterStatus', 'checked')" title="Bấm để lọc xe đã check">
          <div class="kpi-label" style="color:#38bdf8">${window.ICONS.checkCircle} Đã check xong</div>
          <div class="kpi-val" id="kpiCheckedVal" style="color:#38bdf8;text-shadow:0 0 12px rgba(56,189,248,0.4)">${checkedList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Đã có bảng linh kiện / ghi chú</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(245,158,11,0.12), rgba(15,23,42,0.7));border:1px solid rgba(245,158,11,0.35);box-shadow:0 0 15px rgba(245,158,11,0.15)" onclick="setCheckXeColFilter('filterStatus', 'recheck')" title="Bấm để lọc xe cần check lại">
          <div class="kpi-label" style="color:var(--amber-glow)">${window.ICONS.alertTriangle} Cần check lại</div>
          <div class="kpi-val" id="kpiRecheckVal" style="color:#fbbf24;text-shadow:0 0 12px rgba(245,158,11,0.4)">${recheckList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Có ghi chú nhưng chưa có bảng</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(148,163,184,0.12), rgba(15,23,42,0.7));border:1px solid rgba(148,163,184,0.35);box-shadow:0 0 15px rgba(148,163,184,0.15)" onclick="setCheckXeColFilter('filterStatus', 'all')" title="Bấm để xem tất cả xe">
          <div class="kpi-label" style="color:#e2e8f0">${window.ICONS.carCheck} Tổng trong xưởng</div>
          <div class="kpi-val" id="kpiTotalVal" style="color:#f8fafc;text-shadow:0 0 12px rgba(255,255,255,0.4)">${totalAll}</div>
          <div class="kpi-sub" style="color:#94a3b8">Toàn bộ xe đang theo dõi</div>
        </div>
      </div>
    </div>

    <!-- Hạng mục lỗi (UI pills chuẩn 12 hạng mục) -->
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

    <!-- THANH BỘ LỌC TINH GỌN (SMART FILTER BAR) -->
    <div class="checkxe-filter-bar">
      <!-- Ô tìm kiếm tổng hợp -->
      <div class="filter-search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" class="filter-search-input" placeholder="🔍 Tìm nhanh biển số, WO, VIN, KTV, lỗi..." value="${esc(state.checkXe.searchPlate || state.checkXe.searchQuery || '')}" oninput="setCheckXeColFilter('searchPlate', this.value)">
      </div>

      <!-- Các bộ lọc nhanh -->
      <div class="filter-select-group">
        <!-- Lọc Xe -->
        <div class="filter-select-wrapper">
          <span class="filter-label">Xe:</span>
          <select class="filter-select" onchange="setCheckXeColFilter('filterVehicle', this.value)">
            <option value="">-- Tất cả xe --</option>
            ${vehicles.map(v => `<option value="${esc(v)}" ${state.checkXe.filterVehicle === v ? 'selected' : ''}>${esc(v)}</option>`).join('')}
          </select>
        </div>

        <!-- Lọc KTV -->
        <div class="filter-select-wrapper">
          <span class="filter-label">KTV:</span>
          <select class="filter-select" onchange="setCheckXeColFilter('filterTech', this.value)">
            <option value="">-- Tất cả KTV --</option>
            ${techs.map(t => `<option value="${esc(t)}" ${state.checkXe.filterTech === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}
          </select>
        </div>

        <!-- Lọc Trạng thái check -->
        <div class="filter-select-wrapper">
          <span class="filter-label">Trạng thái:</span>
          <select class="filter-select" onchange="setCheckXeColFilter('filterStatus', this.value)">
            <option value="all">-- Tất cả trạng thái --</option>
            <option value="no_fault" ${state.checkXe.filterStatus === 'no_fault' ? 'selected' : ''}>✅ Xe không lỗi (${noFaultList.length})</option>
            <option value="unchecked" ${state.checkXe.filterStatus === 'unchecked' ? 'selected' : ''}>🔴 Chưa check (${uncheckedList.length})</option>
            <option value="checked" ${state.checkXe.filterStatus === 'checked' ? 'selected' : ''}>✅ Đã check (${checkedList.length})</option>
            <option value="recheck" ${state.checkXe.filterStatus === 'recheck' ? 'selected' : ''}>⚠️ Cần check lại (${recheckList.length})</option>
          </select>
        </div>

        <!-- Lọc TT Linh kiện -->
        <div class="filter-select-wrapper">
          <span class="filter-label">Linh kiện:</span>
          <select class="filter-select" onchange="setCheckXeColFilter('filterPartStatus', this.value)">
            <option value="all">-- Tất cả TT LK --</option>
            <option value="waiting_motor" ${state.checkXe.filterPartStatus === 'waiting_motor' ? 'selected' : ''}>⚡ Chờ Động cơ</option>
            <option value="waiting_battery" ${state.checkXe.filterPartStatus === 'waiting_battery' ? 'selected' : ''}>🔋 Chờ PIN</option>
            <option value="checking" ${state.checkXe.filterPartStatus === 'checking' ? 'selected' : ''}>⏳ Chờ kiểm tra</option>
            <option value="has_part" ${state.checkXe.filterPartStatus === 'has_part' ? 'selected' : ''}>📦 Có cập nhật LK</option>
            <option value="none" ${state.checkXe.filterPartStatus === 'none' ? 'selected' : ''}>⚪ Chưa có cập nhật</option>
          </select>
        </div>

        <!-- Lọc Ghi chú -->
        <div class="filter-select-wrapper">
          <span class="filter-label">Ghi chú:</span>
          <select class="filter-select" onchange="setCheckXeColFilter('filterHasNote', this.value)">
            <option value="all">-- Tất cả --</option>
            <option value="yes" ${state.checkXe.filterHasNote === 'yes' ? 'selected' : ''}>📝 Có ghi chú</option>
            <option value="no" ${state.checkXe.filterHasNote === 'no' ? 'selected' : ''}>⚪ Chưa có ghi chú</option>
          </select>
        </div>

        ${isFiltering ? `
          <button class="btn-clear-filter" onclick="resetCheckXeFilters()" title="Xóa tất cả bộ lọc đang áp dụng">
            🔄 Xóa bộ lọc
          </button>
        ` : ''}
      </div>
    </div>

    <!-- BẢNG DANH SÁCH XE VỚI BỘ LỌC TINH GỌN & XUẤT EXCEL -->
    <div class="card">
      <div class="card-header" style="padding:12px 18px;background:rgba(16, 26, 48, 0.85);border-bottom:1px solid var(--border-light)">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="font-size:14px;font-weight:700;color:var(--text-main)" id="checkXeFilterCountDisplay">
            Hiển thị <span style="color:#38bdf8;font-size:16px">${filtered.length}</span> / ${totalAll} xe
            ${state.checkXe.filterDate !== 'all' ? ` <span style="font-size:12px;color:var(--text-muted);font-weight:normal">(Ngày: ${state.checkXe.filterDate})</span>` : ''}
          </div>
          ${isFiltering ? `<span style="font-size:11px;background:rgba(239,68,68,0.18);color:#fca5a5;border:1px solid rgba(239,68,68,0.4);padding:2px 8px;border-radius:12px;font-weight:600">Đang lọc dữ liệu</span>` : ''}
        </div>
        
        <div style="display:flex;align-items:center;gap:8px">
          <!-- NÚT CHUYỂN CHẾ ĐỘ XEM CỘT -->
          <div style="display:inline-flex;background:rgba(15,23,42,0.9);padding:3px;border-radius:8px;border:1px solid var(--border-light);margin-right:4px">
            <button class="btn ${state.checkXe.viewMode === 'card' ? 'primary' : 'secondary'}" style="padding:4px 10px;font-size:11.5px;border:none" onclick="setCheckXeViewMode('card')" title="Hiển thị dạng thẻ linh kiện ServiceOS">
              📇 Thẻ ServiceOS
            </button>
            <button class="btn ${state.checkXe.viewMode !== 'card' ? 'primary' : 'secondary'}" style="padding:4px 10px;font-size:11.5px;border:none" onclick="setCheckXeViewMode('table')" title="Hiển thị từng mục thành các cột riêng">
              📊 Cột chi tiết
            </button>
          </div>
          <button class="btn primary" style="background:#15803d;border-color:#16a34a;color:#fff;font-weight:700;font-size:12.5px;padding:5px 12px;box-shadow:0 2px 8px rgba(22,163,74,0.3);display:inline-flex;align-items:center;gap:5px" onclick="exportCheckXeExcel('filtered')">
            ${window.ICONS.download} Xuất Excel (${filtered.length} xe)
          </button>
          <button class="btn secondary" style="font-size:11.5px;padding:5px 10px" onclick="exportCheckXeExcel('all')" title="Xuất toàn bộ xe trong xưởng không phụ thuộc bộ lọc">
            Xuất tất cả (${totalAll} xe)
          </button>
          ${isFiltering ? `<button class="btn secondary" style="font-size:11.5px;padding:5px 9px;color:#f87171" onclick="resetCheckXeFilters()">🔄 Xóa lọc</button>` : ''}
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            ${state.checkXe.viewMode === 'card' ? `
              <!-- CHẾ ĐỘ XEM THẺ CARD SERVICEOS (CHUẨN GỌN GÀNG, KHÔNG BỊ TRÀN) -->
              <tr>
                <th style="width:42px;text-align:center" class="sortable-th" onclick="setCheckXeSort('stt')">STT ${getSortIcon('stt')}</th>
                <th style="width:175px" class="sortable-th" onclick="setCheckXeSort('plate')">THÔNG TIN XE ${getSortIcon('plate')}</th>
                <th style="width:110px" class="sortable-th" onclick="setCheckXeSort('tech')">KTV ${getSortIcon('tech')}</th>
                <th style="width:135px" class="sortable-th" onclick="setCheckXeSort('category')">HẠNG MỤC LỖI ${getSortIcon('category')}</th>
                <th style="width:250px" class="sortable-th" onclick="setCheckXeSort('bang')">BẢNG CẬP NHẬT LINH KIỆN ${getSortIcon('bang')}</th>
                <th style="width:125px" class="sortable-th" onclick="setCheckXeSort('note')">GHI CHÚ KTV ${getSortIcon('note')}</th>
                <th style="width:110px" class="sortable-th" onclick="setCheckXeSort('date')">NGÀY NHẬN ${getSortIcon('date')}</th>
                <th style="width:135px;white-space:nowrap" class="sortable-th" onclick="setCheckXeSort('status')">TRẠNG THÁI CHECK ${getSortIcon('status')}</th>
                <th style="width:75px;text-align:center" class="sticky-action-col">THAO TÁC</th>
              </tr>
            ` : `
              <!-- CHẾ ĐỘ XEM CỘT CHI TIẾT -->
              <tr>
                <th style="width:40px;text-align:center" class="sortable-th" onclick="setCheckXeSort('stt')">STT ${getSortIcon('stt')}</th>
                <th style="width:165px" class="sortable-th" onclick="setCheckXeSort('plate')">THÔNG TIN XE ${getSortIcon('plate')}</th>
                <th style="width:105px" class="sortable-th" onclick="setCheckXeSort('tech')">KTV ${getSortIcon('tech')}</th>
                <th style="width:125px" class="sortable-th" onclick="setCheckXeSort('category')">HẠNG MỤC LỖI ${getSortIcon('category')}</th>
                <th style="width:115px;text-align:center" class="sortable-th" onclick="setCheckXeSort('part_status')">TRẠNG THÁI LK ${getSortIcon('part_status')}</th>
                <th style="width:130px;text-align:center" class="sortable-th" onclick="setCheckXeSort('part_serial')">SỐ MÁY / SERIAL ${getSortIcon('part_serial')}</th>
                <th style="width:95px;text-align:center" class="sortable-th" onclick="setCheckXeSort('part_removed')">NGÀY THÁO ${getSortIcon('part_removed')}</th>
                <th style="width:125px;text-align:center" class="sortable-th" onclick="setCheckXeSort('bh_code')">LỆNH BH / ĐX ${getSortIcon('bh_code')}</th>
                <th style="width:120px" class="sortable-th" onclick="setCheckXeSort('note')">GHI CHÚ KTV ${getSortIcon('note')}</th>
                <th style="width:105px" class="sortable-th" onclick="setCheckXeSort('date')">NGÀY NHẬN ${getSortIcon('date')}</th>
                <th style="width:135px;white-space:nowrap" class="sortable-th" onclick="setCheckXeSort('status')">TRẠNG THÁI CHECK ${getSortIcon('status')}</th>
                <th style="width:75px;text-align:center" class="sticky-action-col">THAO TÁC</th>
              </tr>
            `}
          </thead>
          <tbody id="checkXeTbody">
            ${rowsHtml || `<tr><td colspan="${state.checkXe.viewMode === 'card' ? 9 : 12}" style="text-align:center;padding:36px;color:var(--text-muted);font-size:13px">Không tìm thấy xe nào phù hợp với bộ lọc hiện tại.<br><button class="btn secondary" style="margin-top:10px;font-size:12px" onclick="resetCheckXeFilters()">🔄 Xóa các bộ lọc để xem lại danh sách</button></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
'''

content = content[:start_idx] + new_render_code + "\n\n" + content[end_idx:]

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully replaced renderCheckXe in _build/app_template2.html")
