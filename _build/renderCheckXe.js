function renderCheckXe() {
  const allOrders = state.checkXe.orders || [];
  const totalAll = allOrders.length;
  
  // Phân loại theo 4 quy tắc
  const uncheckedList = allOrders.filter(o => o.checkStatus.code === 'unchecked');
  const recheckList = allOrders.filter(o => o.checkStatus.code === 'recheck');
  const checkedList = allOrders.filter(o => o.checkStatus.code === 'checked');
  const normalList = allOrders.filter(o => o.checkStatus.code === 'normal');

  // Tổng số xe trong diện theo dõi lỗi
  const issueOrders = allOrders.filter(o => o.checkStatus.code !== 'normal');
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
            Bạn có thể <b>đồng bộ trực tiếp từ ServiceOS</b> bằng Tiện ích 1-Click hoặc lệnh F12 để lấy đầy đủ 100% xe đang trong xưởng, tự động phân tích theo 4 quy tắc nghiệp vụ!
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

  // Danh sách các Dòng xe và KTV có trong dữ liệu để điền vào bộ lọc từng cột
  const vehicles = [...new Set(allOrders.map(o => o.vehicle).filter(v => v && v !== '—'))].sort();
  const techs = [...new Set(allOrders.map(o => o.tech).filter(Boolean))].sort();

  // BỘ LỌC DỮ LIỆU ĐA TẦNG (Từng cột trong bảng)
  let filtered = scopeOrders;

  // 1. Lọc Hạng mục
  if(state.checkXe.filterCategory !== 'all'){
    filtered = filtered.filter(o => o.category.id === state.checkXe.filterCategory);
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
  // 7. Lọc Ghi chú KTV
  if(state.checkXe.filterHasNote === 'yes'){
    filtered = filtered.filter(o => o.hasKtvNote);
  } else if(state.checkXe.filterHasNote === 'no'){
    filtered = filtered.filter(o => !o.hasKtvNote);
  }
  // 8. Lọc Biển số / Mã WO riêng
  if(state.checkXe.searchPlate){
    const qp = norm(state.checkXe.searchPlate);
    filtered = filtered.filter(o => norm(o.plate + ' ' + o.wo).includes(qp));
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
        const orderMap = { unchecked: 1, recheck: 2, checked: 3, normal: 4 };
        vA = orderMap[a.checkStatus.code] || 99;
        vB = orderMap[b.checkStatus.code] || 99;
        return sortDir === 'desc' ? vB - vA : vA - vB;
      }
      else if(sortBy === 'bang') {
        vA = a.hasBangCapNhat ? 1 : 0;
        vB = b.hasBangCapNhat ? 1 : 0;
        return sortDir === 'desc' ? vB - vA : vA - vB;
      }
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
    return state.checkXe.sortDir === 'asc' ? '<span style="color:#2563eb;font-weight:bold;margin-left:4px">▲</span>' : '<span style="color:#2563eb;font-weight:bold;margin-left:4px">▼</span>';
  };

  // Kiểm tra có đang áp dụng bất kỳ bộ lọc nào không
  const isFiltering = state.checkXe.filterCategory !== 'all' || 
                      state.checkXe.filterStatus !== 'all' || 
                      state.checkXe.filterDate !== 'all' || 
                      Boolean(state.checkXe.filterTech) || 
                      Boolean(state.checkXe.filterVehicle) || 
                      state.checkXe.filterHasTable !== 'all' || 
                      state.checkXe.filterHasNote !== 'all' || 
                      Boolean(state.checkXe.searchPlate) || 
                      Boolean(state.checkXe.searchQuery);

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
        font-weight: 700;
      }
      .scope-toggle-btn {
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        border: 1px solid #cbd5e1;
        background: #ffffff;
        color: #475569;
        font-weight: 600;
      }
      .scope-toggle-btn.active {
        background: #1e293b;
        color: #ffffff;
        border-color: #0f172a;
      }
      /* Hàng lọc trực tiếp từng cột */
      .filter-header-row th {
        background: #f8fafc !important;
        padding: 6px 4px !important;
        border-bottom: 2px solid #cbd5e1 !important;
      }
      .col-filter-input, .col-filter-select {
        width: 100%;
        box-sizing: border-box;
        font-size: 11.5px;
        padding: 4px 6px;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        background: #ffffff;
        color: #1e293b;
        outline: none;
      }
      .col-filter-input:focus, .col-filter-select:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 1px #2563eb;
      }
      .sortable-th {
        cursor: pointer;
        user-select: none;
        transition: background 0.15s;
      }
      .sortable-th:hover {
        background: #e2e8f0;
      }
    </style>

    <!-- Header Thông tin và Thao tác -->
    <div class="card" style="margin-bottom:14px">
      <div class="card-header">
        <div>
          <div class="card-title">🔍 Check lỗi xe hàng ngày — Dữ liệu ServiceOS</div>
          <div class="card-subtitle">Áp dụng chuẩn 4 quy tắc nghiệp vụ: Hạng mục lỗi · Ghi chú KTV · Bảng cập nhật phía dưới</div>
        </div>
        <div class="toolbar-right" style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn primary" onclick="openBookmarkletModal()">⚡ Đọc trực tiếp ServiceOS</button>
          <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán (Ctrl+V)</button>
          <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Nhập Excel</button>
          <button class="btn" style="background:#15803d;color:#fff;border-color:#16a34a;font-weight:700" onclick="exportCheckXeExcel('filtered')">📥 Xuất Excel danh sách</button>
          <button class="btn secondary" style="color:#dc2626" onclick="clearCheckXeData()" title="Xóa dữ liệu để nạp lại">🗑️</button>
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

    <!-- BẢNG DANH SÁCH XE VỚI BỘ LỌC TRỰC TIẾP TỪNG CỘT & XUẤT EXCEL -->
    <div class="card">
      <div class="card-header" style="padding:12px 16px;background:#f8fafc;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="font-size:14px;font-weight:700;color:var(--text-main)">
            Hiển thị <span style="color:#2563eb;font-size:16px">${filtered.length}</span> / ${totalAll} xe
            ${state.checkXe.filterDate !== 'all' ? ` <span style="font-size:12px;color:var(--text-muted);font-weight:normal">(Ngày: ${state.checkXe.filterDate})</span>` : ''}
          </div>
          ${isFiltering ? `<span style="font-size:11.5px;background:#fee2e2;color:#b91c1c;padding:2px 8px;border-radius:12px;font-weight:600">Đang lọc dữ liệu</span>` : ''}
        </div>
        
        <div style="display:flex;align-items:center;gap:8px">
          <!-- NÚT XUẤT EXCEL ĐƯỢC KHOANH ĐỎ YÊU CẦU -->
          <button class="btn primary" style="background:#15803d;border-color:#16a34a;color:#fff;font-weight:700;font-size:13px;padding:6px 14px;box-shadow:0 2px 8px rgba(22,163,74,0.3);display:inline-flex;align-items:center;gap:6px" onclick="exportCheckXeExcel('filtered')">
            📥 Xuất file Excel (${filtered.length} xe)
          </button>
          <button class="btn secondary" style="font-size:12px;padding:6px 10px" onclick="exportCheckXeExcel('all')" title="Xuất toàn bộ xe trong xưởng không phụ thuộc bộ lọc">
            Xuất tất cả (${totalAll} xe)
          </button>
          ${isFiltering ? `<button class="btn secondary" style="font-size:12px;padding:6px 10px;color:#dc2626" onclick="resetCheckXeFilters()">🔄 Xóa bộ lọc</button>` : ''}
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <!-- HÀNG TIÊU ĐỀ CHÍNH (CLICK VÀO ĐỂ SẮP XẾP TĂNG / GIẢM) -->
            <tr>
              <th style="width:45px;text-align:center" class="sortable-th" onclick="setCheckXeSort('stt')" title="Click để sắp xếp theo STT">
                STT ${getSortIcon('stt')}
              </th>
              <th style="width:130px" class="sortable-th" onclick="setCheckXeSort('plate')" title="Click để sắp xếp theo Biển số">
                BIỂN SỐ / MÃ WO ${getSortIcon('plate')}
              </th>
              <th style="width:130px" class="sortable-th" onclick="setCheckXeSort('vehicle')" title="Click để sắp xếp theo Dòng xe">
                DÒNG XE / VIN ${getSortIcon('vehicle')}
              </th>
              <th style="width:130px" class="sortable-th" onclick="setCheckXeSort('tech')" title="Click để sắp xếp theo KTV">
                KTV PHỤ TRÁCH ${getSortIcon('tech')}
              </th>
              <th style="min-width:180px" class="sortable-th" onclick="setCheckXeSort('category')" title="Click để sắp xếp theo Hạng mục lỗi">
                HẠNG MỤC & LỖI ${getSortIcon('category')}
              </th>
              <th style="min-width:200px" class="sortable-th" onclick="setCheckXeSort('bang')" title="Click để sắp xếp theo Bảng cập nhật">
                BẢNG CẬP NHẬT PHÍA DƯỚI ${getSortIcon('bang')}
              </th>
              <th style="min-width:180px" class="sortable-th" onclick="setCheckXeSort('note')" title="Click để sắp xếp theo Ghi chú KTV">
                GHI CHÚ KTV ${getSortIcon('note')}
              </th>
              <th style="width:105px" class="sortable-th" onclick="setCheckXeSort('date')" title="Click để sắp xếp theo Ngày nhận">
                NGÀY NHẬN ${getSortIcon('date')}
              </th>
              <th style="width:125px" class="sortable-th" onclick="setCheckXeSort('status')" title="Click để sắp xếp theo Trạng thái Check">
                TRẠNG THÁI CHECK ${getSortIcon('status')}
              </th>
              <th style="width:80px;text-align:center">
                THAO TÁC
              </th>
            </tr>

            <!-- HÀNG BỘ LỌC TRỰC TIẾP TỪNG CỘT (ĐÁP ỨNG CHÍNH XÁC YÊU CẦU KHOANH ĐỎ) -->
            <tr class="filter-header-row">
              <th style="text-align:center">
                <span style="font-size:11px;color:var(--text-muted)">Lọc:</span>
              </th>
              <th>
                <input type="text" class="col-filter-input" placeholder="🔍 Biển / WO..." value="${esc(state.checkXe.searchPlate || '')}" oninput="setCheckXeColFilter('searchPlate', this.value)">
              </th>
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
                <select class="col-filter-select" onchange="setCheckXeColFilter('filterHasTable', this.value)">
                  <option value="all">-- Tất cả --</option>
                  <option value="yes" ${state.checkXe.filterHasTable === 'yes' ? 'selected' : ''}>✅ Đã có bảng</option>
                  <option value="no" ${state.checkXe.filterHasTable === 'no' ? 'selected' : ''}>❌ Chưa có bảng</option>
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
                  <option value="unchecked" ${state.checkXe.filterStatus === 'unchecked' ? 'selected' : ''}>🔴 Chưa check (${uncheckedList.length})</option>
                  <option value="recheck" ${state.checkXe.filterStatus === 'recheck' ? 'selected' : ''}>⚠️ Cần check lại (${recheckList.length})</option>
                  <option value="checked" ${state.checkXe.filterStatus === 'checked' ? 'selected' : ''}>✅ Đã check (${checkedList.length})</option>
                </select>
              </th>
              <th style="text-align:center">
                <button class="btn secondary" style="width:100%;padding:3px 4px;font-size:11px" onclick="resetCheckXeFilters()" title="Xóa tất cả các bộ lọc">🔄 Xóa lọc</button>
              </th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="10" style="text-align:center;padding:36px;color:var(--text-muted);font-size:13px">Không tìm thấy xe nào phù hợp với bộ lọc hiện tại.<br><button class="btn secondary" style="margin-top:10px;font-size:12px" onclick="resetCheckXeFilters()">🔄 Xóa các bộ lọc để xem lại danh sách</button></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Bóc tách Excel ServiceOS thông minh hỗ trợ đầy đủ 4 quy tắc