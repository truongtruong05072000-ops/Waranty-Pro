function renderAll(){
  const hasData = state.sources.some(s => s.recs.length && !settings.disabledSrc.has(s.id));
  const tYm = settings.targetMonth;
  const cutTxt = settings.cycle22 ? settings.cut : 28;

  // Context bar updates
  $('#ctxTargetMonth').textContent = monthLabel(tYm) + ` (chốt ngày ${cutTxt})`;
  $('#ctxTargetVal').textContent = fmtT(settings.target) + ' tr';
  $('#ctxVatNote').innerHTML = settings.vatMode === 'ex' ? '<span class="tag warn">Đang xem: TRƯỚC VAT</span>' : '<span class="tag ok">Đang xem: SAU VAT</span>';

  // Toggle active button on top bar
  const btnInc = $('#btnVatInc'), btnEx = $('#btnVatEx');
  if(btnInc) btnInc.classList.toggle('active', settings.vatMode === 'inc');
  if(btnEx) btnEx.classList.toggle('active', settings.vatMode === 'ex');

  if(!hasData){
    renderRulePanel(null);
    $('#ctxExpectedVal').textContent = '—';
    $('#ctxSourcesVal').textContent = '0 file';
    $('#badgePartsCount').textContent = '0';
    $('#badgeClaimsCount').textContent = '0';

    const emptyHtml = `
      <div class="card">
        <div class="empty-state">
          <div class="empty-state-icon">📂</div>
          <h3 style="font-size:16px;color:var(--text-main);margin-bottom:6px">Chưa có dữ liệu bảo hành</h3>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px">Hãy chuyển sang tab <b>"Tệp &amp; Cài đặt"</b> để kéo thả file Excel vào hệ thống.</p>
          <button class="btn" onclick="switchTab('settings')">⚙️ Đi tới Tệp &amp; Cài đặt</button>
        </div>
      </div>`;
    $('#overviewContent').innerHTML = emptyHtml;
    $('#planContent').innerHTML = emptyHtml;
    $('#partsContent').innerHTML = emptyHtml;
    $('#claimsContent').innerHTML = emptyHtml;
    return;
  }

  const C = computeAll();
  renderRulePanel(C);

  // Update context bar with real numbers
  $('#ctxExpectedVal').textContent = fmtT(C.expectedPlan) + ' tr (' + fmtN(C.expectedPlan / settings.target * 100, 1) + '%)';
  $('#ctxSourcesVal').textContent = state.sources.filter(s => !settings.disabledSrc.has(s.id)).length + ' file (' + C.recs.length + ' ĐX)';
  $('#badgePartsCount').textContent = C.parts3.length;
  $('#badgeClaimsCount').textContent = C.recs.length;

  const isReached = C.remainingPlan === 0;

  /* ==================== 1. OVERVIEW PANE ==================== */
  const allMonths = [...C.months.keys()].sort();
  const showMonths = allMonths.filter(m => m <= tYm);
  if(!showMonths.includes(tYm)) showMonths.push(tYm);
  const chartMonths = showMonths.slice(-6);

  const heroKpiHtml = `
    <div class="kpi-grid">
      <div class="kpi-card blue">
        <div class="kpi-title">Mục tiêu ${monthLong(tYm)} <span>🎯</span></div>
        <div class="kpi-val">${fmtT(settings.target)} <span style="font-size:16px">tr</span></div>
        <div class="kpi-sub">Bao gồm công + phụ tùng · ${settings.vatMode === 'ex' ? 'Trước VAT' : 'Sau VAT'}</div>
      </div>
      
      <div class="kpi-card ${isReached ? 'emerald' : 'amber'}">
        <div class="kpi-title">Dự kiến kết kỳ ${monthLabel(tYm)} <span>${isReached ? '🎉' : '⏳'}</span></div>
        <div class="kpi-val">${fmtT(C.expectedPlan)} <span style="font-size:16px">tr</span></div>
        <div class="kpi-sub">
          Chốt <b>${fmtT(C.target.conf)}</b> + Dự trù <b>${fmtT(C.target.pipe)}</b>${C.coveredParts ? ` + Chuẩn bị <b>${fmtT(C.coveredParts)}</b>` : ''}
        </div>
      </div>

      <div class="kpi-card ${C.ratio >= 1 ? 'emerald' : C.ratio >= 0.85 ? 'amber' : 'indigo'}">
        <div class="kpi-title">Nhịp 1 ngày kỳ này <span>⚡</span></div>
        <div class="kpi-val">${fmtT(C.curDaily)} <span style="font-size:16px">tr/ngày</span></div>
        <div class="kpi-sub">
          ${C.elapsedDays ? `Đạt <b>${fmtN(C.ratio * 100, 0)}%</b> so TB 3 tháng (${fmtT(C.histDaily)} tr/ngày)` : 'Chưa trong kỳ'}
        </div>
      </div>

      <div class="kpi-card ${isReached ? 'emerald' : 'indigo'}">
        <div class="kpi-title">Số ĐX còn phải làm <span>📋</span></div>
        <div class="kpi-val">${isReached ? '0' : C.propsNeed} <span style="font-size:16px">đề xuất</span></div>
        <div class="kpi-sub">
          ${isReached ? `Đã có <b>${C.target.cnt}</b> ĐX chốt + <b>${C.target.pCnt}</b> dự trù (Vượt +${fmtT(C.expectedPlan - settings.target)} tr)` : `Kế hoạch ${C.propsNeedBase} − Đã làm ${C.doneCnt} ĐX`}
        </div>
      </div>
    </div>`;

  const verdictBannerHtml = `
    <div class="verdict-banner ${C.vClass}">
      <div class="verdict-icon">${C.vIcon}</div>
      <div class="verdict-content">
        <h4>Khả năng đạt mục tiêu ${monthLong(tYm)}: ${C.verdict}</h4>
        <p>${C.verdictDetail}</p>
      </div>
    </div>`;

  const rowsM = showMonths.map(m => {
    const o = C.months.get(m) || { conf: 0, cnt: 0, pipe: 0, pCnt: 0 };
    const exp = o.conf + o.pipe;
    const d = exp - settings.target;
    const isT = m === tYm;
    return `
      <tr style="${isT ? 'background:#fffbeb;font-weight:700' : ''}">
        <td class="l">
          <b>${monthLabel(m)}</b> ${isT ? '<span class="tag warn">Mục tiêu 🎯</span>' : ''}
          <div style="font-size:11.5px;color:var(--text-muted);font-weight:normal">${cycleRangeText(m, cutTxt)}</div>
        </td>
        <td class="num">${o.cnt || '0'}</td>
        <td class="num"><b>${fmtVND(o.conf)}</b></td>
        <td class="num" style="color:#d97706">${o.pCnt ? `${o.pCnt} ĐX · ` : ''}${fmtVND(o.pipe)}</td>
        <td class="num"><b style="color:var(--primary)">${fmtVND(exp)}</b></td>
        <td class="num" style="color:${d >= 0 ? 'var(--emerald)' : 'var(--rose)'}">${d >= 0 ? '+' : ''}${fmtVND(d)}</td>
        <td class="num">${settings.target ? fmtN(exp / settings.target * 100, 0) + '%' : ''}</td>
      </tr>`;
  }).join('');

  const chart = svgChart(chartMonths.map(m => ({ m, conf: C.months.get(m)?.conf || 0, pipe: (C.months.get(m)?.pipe || 0) })), settings.target);

  $('#overviewContent').innerHTML = `
    ${heroKpiHtml}
    ${verdictBannerHtml}
    
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(480px, 1fr));gap:20px;align-items:start">
      <div class="card" style="margin-bottom:0">
        <div class="card-header">
          <div>
            <div class="card-title">📊 Doanh thu theo tháng (Chốt ngày ${cutTxt})</div>
            <div class="card-subtitle">Chốt = Hoàn thành + Đã duyệt · Dự trù = Chờ duyệt cấp 1/2, Mở</div>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="l">Kỳ doanh thu</th>
                <th>Số ĐX chốt</th>
                <th>Doanh thu chốt</th>
                <th>Dự trù</th>
                <th>Tổng dự kiến</th>
                <th>Chênh lệch</th>
                <th>% Đạt</th>
              </tr>
            </thead>
            <tbody>${rowsM}</tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-bottom:0">
        <div class="card-header">
          <div>
            <div class="card-title">📈 Biểu đồ xu hướng doanh thu</div>
            <div class="card-subtitle">Cột xanh = Doanh thu chốt · Cột cam = Dự trù · Đường đứt đỏ = Mục tiêu</div>
          </div>
        </div>
        <div class="chart-container">
          ${chart}
        </div>
      </div>
    </div>`;

  /* ==================== 2. PLAN PANE ==================== */
  const partCodeOpts = C.parts3.map(a => `<option value="${esc(a.code)}">${esc(a.name)}</option>`).join('');
  const partMeta = new Map(); C.parts3.forEach(a => partMeta.set(a.code, a));
  const prepRows = state.prepared.map((r, i) => {
    const code = String(r.code || '').trim().toUpperCase();
    const meta = code ? partMeta.get(code) : null;
    const qty = Math.floor(+r.qty || 0);
    const unit = meta ? (meta.qty > 0 ? meta.money / meta.qty : meta.money) : 0;
    return `
      <tr>
        <td class="l">
          <input data-pid="pcode${i}" class="field-input" list="partCodes" value="${esc(r.code || '')}" placeholder="VD: SUS00007999" style="width:200px;font-weight:600" oninput="prepSet(${i},'code',this.value)">
        </td>
        <td class="l part-name-cell">
          ${meta ? esc(meta.name) : (code ? '<span class="tag warn">Không có trong 3 tháng</span>' : '<span style="color:var(--text-muted)">—</span>')}
        </td>
        <td class="num">
          <input data-pid="pqty${i}" class="field-input num" type="number" min="0" step="1" value="${r.qty || ''}" style="width:90px" oninput="prepSet(${i},'qty',this.value)">
        </td>
        <td class="num">${meta ? fmtVND(unit) : '—'}</td>
        <td class="num"><b style="color:var(--primary)">${meta && qty > 0 ? fmtVND(unit * qty) : '—'}</b></td>
        <td class="l">
          <button class="source-del" onclick="prepDel(${i})" title="Xoá dòng này">✕</button>
        </td>
      </tr>`;
  }).join('');

  const prepDone = code => { const d = C.doneAgg.get(String(code || '').trim().toUpperCase()); return d ? ceilInt(d.qty) : 0; };
  const planRows = C.preparedInfo.map(p => `
    <tr style="background:#fffbeb">
      <td class="l num">—</td>
      <td class="l"><b>${esc(p.code)}</b> <span class="tag warn">DỰ TÍNH</span></td>
      <td class="l part-name-cell">${esc(p.name) || '—'}${p.known ? '' : ' <span class="tag err">Không có trong 3 tháng</span>'}</td>
      <td class="num">—</td>
      <td class="num">—</td>
      <td class="num" style="color:var(--emerald)">${prepDone(p.code) || '—'}</td>
      <td class="num"><b>${p.qty}</b></td>
      <td class="num">—</td>
      <td class="num"><b style="color:var(--primary)">${p.known ? fmtVND(p.money) : '—'}</b></td>
    </tr>`).join('')
    + C.planMajor.map((p, i) => {
      const invTxt = p.invQty !== null ? p.invQty : '—';
      const warn = p.invQty !== null && p.invQty < p.qNeed ? 'background:#fff1f2;color:var(--rose);font-weight:700' : '';
      return `
        <tr>
          <td class="l num">${i + 1}</td>
          <td class="l"><b>${esc(p.code)}</b></td>
          <td class="l part-name-cell">${esc(p.name)}</td>
          <td class="num">${fmtN(p.qAvg, 1)}</td>
          <td class="num">${p.qBase}</td>
          <td class="num" style="color:var(--emerald);font-weight:600">${p.doneQ || '—'}</td>
          <td class="num"><b style="color:var(--primary);font-size:14px">${p.qNeed}</b></td>
          <td class="num" style="${warn}">${invTxt}</td>
          <td class="num"><b>${fmtVND(p.mNeed)}</b></td>
        </tr>`;
    }).join('')
    + (C.planMinorAgg ? `
      <tr style="background:#f8fafc">
        <td class="l num">Σ</td>
        <td class="l"><b>Nhóm phụ tùng khác</b> <span class="tag f1">${C.planMinorAgg.count} mã</span></td>
        <td class="l part-name-cell" style="color:var(--text-muted)">Các mã phụ tùng chiếm dưới 1% tổng tiền</td>
        <td class="num">${fmtN(C.planMinorAgg.qAvg, 1)}</td>
        <td class="num">${C.planMinorAgg.qBase}</td>
        <td class="num" style="color:var(--emerald);font-weight:600">${C.planMinorAgg.doneQ || '—'}</td>
        <td class="num"><b>${C.planMinorAgg.qNeed}</b></td>
        <td class="num">—</td>
        <td class="num"><b>${fmtVND(C.planMinorAgg.mNeed)}</b></td>
      </tr>` : '');

  // Recommendations
  const recos = [];
  recos.push({ icon: '🎯', text: `Kỳ này đã chốt <b>${C.target.cnt} đề xuất</b> (${fmtT(C.target.conf)} triệu; phụ tùng ${fmtT(C.target.partsMoney)} + tiền công ${fmtT(C.target.labor)})${C.target.pCnt > 0 ? ` cùng <b>${C.target.pCnt} đề xuất dự trù</b> (${fmtT(C.target.pipe)} triệu)` : ''} — tổng dự kiến <b>${fmtT(C.expected)} triệu</b> (${fmtN(C.expected / settings.target * 100, 1)}% mục tiêu). ${isReached ? '<b style="color:var(--emerald)">Đã đạt và vượt mục tiêu kỳ này!</b>' : '<b>Tự động khấu trừ phần đã làm</b> vào kế hoạch còn lại.'}` });
  if(C.preparedInfo.length){
    recos.push({ icon: '📦', text: `Đã tính <b>${fmtT(C.coveredParts)} triệu</b> từ phụ tùng dự tính sắp đến (${C.preparedInfo.filter(p => p.known).map(p => `<b>${esc(p.code)}</b> ×${p.qty}`).join(', ') || '—'}) → các phụ tùng khác chỉ cần gánh <b>${fmtT(C.remainingParts)} triệu</b> phụ tùng (hệ số điều chỉnh ${fmtN(C.scale2, 3)} thay vì ${fmtN(C.scale, 3)}).` });
  }
  if(C.inCycle){
    const dayTxt = C.daysLeft === 0 ? 'Hôm nay là ngày chốt sổ kỳ này' : `còn <b>${C.daysLeft} ngày</b> đến ngày chốt ${settings.cut}/${tYm.split('-')[1]}`;
    recos.push({ icon: '⏱️', text: `Nhịp chạy: kỳ này đang <b>${fmtT(C.curDaily)} triệu/ngày</b> so TB 3 tháng <b>${fmtT(C.histDaily)} triệu/ngày</b> (${fmtN(C.ratio * 100, 0)}%) — ${dayTxt}${isReached ? ' (Đã đủ chỉ tiêu kết kỳ)' : `, mỗi ngày cần <b>≈ ${fmtT(C.remainingPlan / Math.max(1, C.daysLeft))} triệu</b> để đủ mục tiêu`}.` });
  }
  if(C.target.pipe > 0){
    recos.push({ icon: '⚡', text: `Đang có <b>${fmtT(C.target.pipe)} triệu</b> (${C.target.pCnt} đề xuất) chờ phê duyệt cấp 1/cấp 2 hoặc đang mở — <b>đẩy phê duyệt &amp; hoàn thành trước ngày chốt ${settings.cut}</b> để chính thức chốt vào doanh thu kỳ này.` });
  }
  if(!isReached){
    const top3 = C.planMajor.slice(0, 3);
    recos.push({ icon: '🛠️', text: `Ưu tiên chuẩn bị tồn kho theo bảng bên dưới — top phụ tùng cần làm: ${top3.map(p => `<b>${esc(p.code)}</b> ×${p.qNeed}`).join(', ')}${C.planMinorAgg ? `; nhóm ${C.planMinorAgg.count} mã tỷ trọng thấp cần ≈ <b>${C.planMinorAgg.qNeed}</b> món (~${fmtT(C.planMinorAgg.mNeed)} triệu)` : ''}.` });
  }

  $('#planContent').innerHTML = `
    ${isReached ? `
      <div class="verdict-banner ok">
        <div class="verdict-icon">🏆</div>
        <div class="verdict-content">
          <h4>Kỳ ${monthLong(tYm)} ĐÃ ĐẠT VÀ VƯỢT CHỈ TIÊU DOANH THU!</h4>
          <p>Dự kiến đạt <b>${fmtT(C.expectedPlan)} triệu</b> / mục tiêu <b>${fmtT(settings.target)} triệu</b> (vượt +${fmtT(C.expectedPlan - settings.target)} triệu, đạt ${fmtN(C.expectedPlan / settings.target * 100, 1)}%). Đã chốt ${C.target.cnt} đề xuất và có ${C.target.pCnt} đề xuất dự trù. Không còn áp lực doanh thu bắt buộc phải chạy thêm trong kỳ này.</p>
        </div>
      </div>` : ''}

    <div class="kpi-grid">
      <div class="kpi-card ${isReached ? 'emerald' : 'indigo'}">
        <div class="kpi-title">Đề xuất còn lại</div>
        <div class="kpi-val">${isReached ? '0' : C.propsNeed} <span style="font-size:16px">ĐX</span></div>
        <div class="kpi-sub">${isReached ? `Đã có ${C.target.cnt} ĐX chốt` : `Cả kỳ ${C.propsNeedBase} − Đã làm ${C.doneCnt}`}</div>
      </div>
      <div class="kpi-card ${isReached ? 'emerald' : 'blue'}">
        <div class="kpi-title">Tiền PT cần làm</div>
        <div class="kpi-val">${isReached ? '0' : fmtT(C.planPartsMoney)} <span style="font-size:16px">tr</span></div>
        <div class="kpi-sub">${isReached ? `Đã làm ${fmtT(C.donePartsMoney)} tr` : (C.coveredParts > 0 ? `Chuẩn bị ${fmtT(C.coveredParts)} tr + làm thêm` : 'Đã khấu trừ phần đã làm')}</div>
      </div>
      <div class="kpi-card ${isReached ? 'emerald' : 'amber'}">
        <div class="kpi-title">Tiền công còn lại<