function renderCheckXe(options = {}){
  const allOrders = state.checkXe.orders || [];
  const totalAll = allOrders.length;
  
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

  // Danh sách các Dòng xe và KTV có trong dữ liệu để điền vào bộ lọc từng cột
  const vehicles = [...new Set(allOrders.map(o => o.vehicle).filter(v => v && v !== '—'))].sort();
  const techs = [...new Set(allOrders.map(o => o.tech).filter(Boolean))].sort();

  // BỘ LỌC DỮ LIỆU ĐA TẦNG (Từng cột trong bảng)
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
    if(tb) tb.innerHTML = rowsHtml || `<tr><td colspan="${state.checkXe.viewMode === 'card' ? 10 : 13}" style="text-align:center;padding:36px;color:var(--text-muted);font-size:13px">Không tìm thấy xe nào phù hợp với bộ lọc hiện tại.</td></tr>`;
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
        padding: 16px 18px;
        margin-bottom: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      }
      .custom-cat-header {
        font-size: 12px;
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
        padding: 6px 14px;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(17, 27, 49, 0.65);
        color: #cbd5e1;
        font-size: 12.5px;
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
        font-size: 11px;
        font-weight: 700;
        background: rgba(0, 0, 0, 0.35);
        color: #94a3b8;
        padding: 1px 7px;
        border-radius: 10px;
      }
      .custom-cat-pill.active .pill-badge {
        background: rgba(255, 255, 255, 0.25);
        color: #ffffff;
      }
      .custom-cat-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.35);
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
        margin-bottom: 16px;
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
      .filter-header-row th {
        background: rgba(11, 18, 33, 0.98) !important;
        padding: 8px 6px !important;
        border-bottom: 2px solid rgba(56, 189, 248, 0.22) !important;
      }
      .col-filter-input, .col-filter-select {
        width: 100%;
        box-sizing: border-box;
        font-size: 11.5px;
        padding: 5px 8px;
        border: 1px solid rgba(56, 189, 248, 0.22);
        border-radius: 6px;
        background: rgba(15, 23, 42, 0.9);
        color: #f8fafc;
        outline: none;
        transition: all 0.2s;
      }
      .col-filter-input:focus, .col-filter-select:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
      }
      .sortable-th {
        cursor: pointer;
        user-select: none;
        transition: background 0.15s, color 0.15s;
      }
      .sortable-th:hover {
        background: rgba(56, 189, 248, 0.12) !important;
        color: #ffffff !important;
      }
    
      /* High-Tech Glassmorphic Cards for Bảng cập nhật */
      .update-card {
        border-radius: 8px;
        padding: 7px 10px;
        margin-bottom: 4px;
        font-size: 11.5px;
        line-height: 1.4;
        transition: transform 0.15s, box-shadow 0.15s;
      }
      .update-card:hover {
        transform: translateY(-1px);
        filter: brightness(1.08);
      }
      .update-card:last-child {
        margin-bottom: 0;
      }
      .update-card-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 7px;
        border-radius: 5px;
        font-weight: 700;
        font-size: 10.5px;
        letter-spacing: 0.3px;
        text-transform: uppercase;
      }
      .update-status-pill {
        font-size: 10px;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 10px;
        white-space: nowrap;
      }
      .update-code-row, .update-serial-row {
        display: flex;
        align-items: baseline;
        gap: 5px;
        margin-top: 3px;
      }
      .update-label {
        font-size: 10px;
        font-weight: 600;
        opacity: 0.75;
        color: var(--text-muted);
        text-transform: uppercase;
      }
      .update-mono-code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 700;
        font-size: 11.5px;
        color: #fde047;
        letter-spacing: 0.4px;
      }
      .update-mono-claim {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 600;
        font-size: 11px;
        color: #93c5fd;
      }
      .update-mono-serial {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 11px;
        color: #67e8f9;
        word-break: break-all;
        letter-spacing: 0.2px;
      }
      .update-date-row {
        font-size: 10.5px;
        color: #94a3b8;
        margin-top: 3px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .no-update-badge {
        color: #64748b;
        font-style: italic;
        font-size: 11.5px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 8px;
        border-radius: 6px;
        background: rgba(15, 23, 42, 0.45);
        border: 1px dashed rgba(100, 116, 139, 0.3);
      }

      /* ServiceOS Fault Badges & Exact Warranty Card */
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
    </div></div>

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
      <div class="card-header" style="padding:14px 20px;background:rgba(16, 26, 48, 0.85);border-bottom:1px solid var(--border-light)">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="font-size:14px;font-weight:700;color:var(--text-main)">
            Hiển thị <span style="color:#2563eb;font-size:16px">${filtered.length}</span> / ${totalAll} xe
            ${state.checkXe.filterDate !== 'all' ? ` <span style="font-size:12px;color:var(--text-muted);font-weight:normal">(Ngày: ${state.checkXe.filterDate})</span>` : ''}
          </div>
          ${isFiltering ? `<span style="font-size:11.5px;background:#fee2e2;color:#b91c1c;padding:2px 8px;border-radius:12px;font-weight:600">Đang lọc dữ liệu</span>` : ''}
        </div>
        
        <div style="display:flex;align-items:center;gap:8px">
          <!-- NÚT XUẤT EXCEL & CHUYỂN CHẾ ĐỘ XEM CỘT -->
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
          <button class="btn secondary" style="font-size:12px;padding:6px 10px" onclick="exportCheckXeExcel('all')" title="Xuất toàn bộ xe trong xưởng không phụ thuộc bộ lọc">
            Xuất tất cả (${totalAll} xe)
          </button>
          ${isFiltering ? `<button class="btn secondary" style="font-size:12px;padding:6px 10px;color:#dc2626" onclick="resetCheckXeFilters()">🔄 Xóa bộ lọc</button>` : ''}
        </div>
      </div>

      <div class="table-wrap">
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
          <tbody id="checkXeTbody">
            ${rowsHtml || `<tr><td colspan="${state.checkXe.viewMode === 'card' ? 10 : 13}" style="text-align:center;padding:36px;color:var(--text-muted);font-size:13px">Không tìm thấy xe nào phù hợp với bộ lọc hiện tại.<br><button class="btn secondary" style="margin-top:10px;font-size:12px" onclick="resetCheckXeFilters()">🔄 Xóa các bộ lọc để xem lại danh sách</button></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Bóc tách Excel ServiceOS thông minh hỗ trợ đầy đủ 4 quy tắc
