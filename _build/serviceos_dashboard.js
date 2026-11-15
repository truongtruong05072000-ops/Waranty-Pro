'use strict';
/* global S, api, qs, esc, icon, can, fmtDT, fmtD, fmtTime, today, NF, numf, initials, statusBadge, apptBadge, svcLabel, plateHtml, barChart,
   chartLegend, hbars, on, setQuery, weekdayLabel, select, slaBadge, sourceBadge, warrantyBadge, staffList */

const STATUS_COLORS = { sky: '#0ea5e9', purple: '#a855f7', slate: '#94a3b8', amber: '#f59e0b', blue: '#1d6fd8', orange: '#f97316', violet: '#0369a1', green: '#22c55e', teal: '#0ea5e9', red: '#ef4444', cyan: '#06b6d4', pink: '#ec4899', indigo: '#6366f1' };

function woMiniRow(w) {
  return `<a class="list-item" href="#/work-orders/${w.id}">
    <div class="grow"><div class="row" style="gap:6px">${sourceBadge(w.source)}<span class="strong">${esc(w.code)}</span>${w.priority === 'urgent' ? '<span class="tag urgent">Gấp</span>' : ''}${plateHtml(w.plate)}</div>
    <div class="small muted">${w.source === 'gsm' ? '' : `${esc(w.customer_name)} · `}${esc(w.model)} · ${esc(svcLabel(w.service_type))}${w.warranty_status ? ` · ${esc((S.meta.warranty_statuses[w.warranty_status] || {}).label || w.warranty_status)}` : ''}</div></div>
    <div class="right small">${statusBadge(w.status, w.source)}<div style="margin-top:4px">${slaBadge(w.sla)}</div></div></a>`;
}

function branchNameOf(id) {
  const b = S.meta.branches.find((x) => String(x.id) === String(id));
  return b ? b.name : '';
}

// ---------------------------------------------------------------------------
// Tổng quan
// ---------------------------------------------------------------------------
// Thứ tự luồng xưởng, gom theo giai đoạn (trạng thái lạ ngoài danh sách → thêm vào cuối nhóm "Sửa chữa")
const DASH_STAGES = [
  { label: 'Kiểm tra & báo giá', color: '#64748b', statuses: ['inspecting', 'awaiting_open', 'waiting_order'] },
  { label: 'Chờ xác nhận', color: '#f59e0b', statuses: ['waiting_approval', 'gsm_rejected'] },
  { label: 'Sửa chữa', color: '#1d6fd8', statuses: ['waiting_repair', 'in_progress', 'extra_cost', 'repair_done'] },
  { label: 'Bàn giao', color: '#16a34a', statuses: ['done', 'awaiting_handover', 'gsm_received'] },
];

function dashSkeleton() {
  const box = (h) => `<div class="dash-skel" style="height:${h}px"></div>`;
  return `<div class="dash is-skeleton"><div class="page-head"><div class="titles"><h2>Tổng quan</h2><div class="sub">Đang tải dữ liệu…</div></div></div>
    <div class="dash-hero">${box(118).repeat(5)}</div>${box(210)}<div class="dash-cols">${box(320)}${box(320)}</div></div>`;
}

async function pageDashboard(ctx) {
  const mainEl = document.getElementById('main');
  if (mainEl && !mainEl.querySelector('.dash')) ctx.setMain(dashSkeleton());
  const d = await api('GET', `/api/dashboard${qs({ branch_id: S.branch })}`);
  if (ctx.stale()) return;
  const k = d.kpi;
  const kk = d.kpi_kind || { repair: {}, warranty: {} };
  const isGsm = S.me.role === 'gsm';
  const n = (v) => NF.format(Number(v) || 0);
  const toWarranty = (href) => href.replace('#/work-orders', '#/warranty-orders');
  // Số KPI tính mọi nguồn xe → mở Phiếu SC kèm src=all (mặc định danh sách chỉ GSM)
  const allSrc = (href) => href.replace(/^#\/work-orders(\?|$)/, (m, qm) => `#/work-orders?src=all${qm ? '&' : ''}`);
  // Tách "Sửa chữa · Bảo hành": mỗi phần mở đúng danh sách của nó; số tổng mở danh sách gồm cả 2 loại (kind=all)
  const split = (r, w, href) => ({ main: r && w ? `${allSrc(href)}&kind=all` : w > r ? toWarranty(href) : allSrc(href),
    kinds: `<a href="${allSrc(href)}">SC <b>${n(r)}</b></a><a href="${toWarranty(href)}">BH <b>${n(w)}</b></a>` });
  const kpiSplit = (key, href) => split(Number((kk.repair || {})[key]) || 0, Number((kk.warranty || {})[key]) || 0, href);
  const pipe = (s) => d.pipeline[s] || { gsm: 0, retail: 0, repair: 0, warranty: 0 };
  const pipeTotal = (s) => (pipe(s).gsm || 0) + (pipe(s).retail || 0);
  const pipeSplit = (s) => split(pipe(s).repair || 0, pipe(s).warranty || 0, `#/work-orders?status=${s}`);

  const hero = ({ label, value, href, kinds, extra, tone, hue }) => `<div class="dash-card sc-${tone || hue || 'blue'}${tone ? ` tone-${tone}` : ''}">
      <a class="dash-card-main" href="${href}"><span class="dash-card-l">${esc(label)}</span><span class="dash-card-v">${n(value)}</span></a>
      ${kinds ? `<div class="dash-kinds">${kinds}</div>` : ''}${extra ? `<div class="dash-card-x">${extra}</div>` : ''}</div>`;

  const inShop = kpiSplit('in_shop', '#/work-orders?status=active');
  const overdue = kpiSplit('sla_overdue', '#/work-orders?sla=overdue&order=sla');
  const warning = kpiSplit('sla_warning', '#/work-orders?sla=warning&order=sla');
  const gsmConfirm = kpiSplit('waiting_gsm_confirm', '#/work-orders?status=waiting_approval&source=gsm');
  const handover = pipeSplit('awaiting_handover');
  const received = pipeSplit('gsm_received');
  const doneSplit = pipeSplit('done');
  const recToday = kpiSplit('received_today', `#/work-orders${qs({ from: today(), to: today() })}`);
  const delToday = kpiSplit('delivered_today', `#/work-orders${qs({ status: 'delivered', dfrom: today(), dto: today(), order: 'newest' })}`);
  const readyTotal = pipeTotal('awaiting_handover') + pipeTotal('done') + pipeTotal('gsm_received');
  const heroes = [
    hero({ label: 'Xe đang trong xưởng', value: k.in_shop, href: inShop.main, kinds: inShop.kinds, hue: 'blue',
      extra: isGsm ? '' : `GSM ${n(k.gsm_in_shop)} · Khách lẻ ${n(k.retail_in_shop)}` }),
    hero({ label: 'Quá hạn SLA', value: k.sla_overdue, href: overdue.main, kinds: overdue.kinds, tone: k.sla_overdue ? 'red' : '', hue: 'slate',
      extra: `<a href="${warning.main}">Sắp quá hạn <b>${n(k.sla_warning)}</b></a>` }),
    hero({ label: 'Chờ GSM xác nhận', value: k.waiting_gsm_confirm, href: gsmConfirm.main, kinds: gsmConfirm.kinds, tone: k.waiting_gsm_confirm ? 'amber' : '', hue: 'orange' }),
    hero({ label: 'Xong, chờ giao xe', value: readyTotal,
      href: pipeTotal('done') > pipeTotal('awaiting_handover') ? doneSplit.main : handover.main,
      kinds: `<a href="${handover.main}">Chờ nghiệm thu <b>${n(pipeTotal('awaiting_handover'))}</b></a><a href="${received.main}">Đã nghiệm thu <b>${n(pipeTotal('gsm_received'))}</b></a><a href="${doneSplit.main}">Chưa giao <b>${n(pipeTotal('done'))}</b></a>`,
      tone: readyTotal ? 'green' : '', hue: 'green' }),
    `<div class="dash-card dash-today sc-violet"><span class="dash-card-l">Hôm nay</span><div class="dash-today-row">
        <div><a href="${recToday.main}"><span class="dash-card-v">${n(k.received_today)}</span><span class="dash-today-l">Tiếp nhận</span></a>
          <div class="dash-kinds">${recToday.kinds}</div></div>
        <div><a href="${delToday.main}"><span class="dash-card-v">${n(k.delivered_today)}</span><span class="dash-today-l">Đã giao</span></a>
          <div class="dash-kinds">${delToday.kinds}</div></div></div></div>`,
  ];

  // Hàng phụ: chỉ số ít khi cần, số 0 mờ đi
  const chip = (label, v, href, kinds) => `<div class="dash-chip${Number(v) ? '' : ' is-zero'}"><a href="${href}">${esc(label)} <b>${n(v)}</b></a>${kinds && Number(v) ? `<span class="dash-kinds">${kinds}</span>` : ''}</div>`;
  const bat = kpiSplit('waiting_battery', '#/work-orders?warranty=waiting_battery&status=active&order=sla');
  const mot = kpiSplit('waiting_motor', '#/work-orders?warranty=waiting_motor&status=active&order=sla');
  const chips = [
    chip('Chờ lắp PIN', k.waiting_battery, bat.main, bat.kinds),
    chip('Chờ lắp động cơ', k.waiting_motor, mot.main, mot.kinds),
    can('appt.view') && !isGsm ? chip('Lịch hẹn hôm nay', k.appointments_today, '#/appointments') : '',
    can('care.view') && !isGsm ? chip('CSKH cần liên hệ', k.care_due, '#/care') : '',
  ].join('');

  // Tiến độ: 1 thanh xếp chồng theo giai đoạn + từng bước theo thứ tự luồng
  const known = new Set(DASH_STAGES.flatMap((g) => g.statuses));
  const stages = DASH_STAGES.map((g, i) => ({ ...g, statuses: [...g.statuses,
    ...(i === 2 ? S.meta.active_statuses.filter((s) => !known.has(s)) : [])].filter((s) => S.meta.wo_statuses[s]) }));
  stages.forEach((g) => { g.total = g.statuses.reduce((a, s) => a + pipeTotal(s), 0); });
  const pipeSum = stages.reduce((a, g) => a + g.total, 0);
  const pipeline = `<div class="dash-pipe-bar" role="img" aria-label="Phân bổ xe theo giai đoạn">${pipeSum ? stages.filter((g) => g.total)
    .map((g) => `<span style="flex:${g.total};background:${g.color}" title="${esc(g.label)}: ${g.total}"></span>`).join('') : '<span class="is-empty"></span>'}</div>
    <div class="dash-stages">${stages.map((g) => `<div class="dash-stage">
      <div class="dash-stage-h"><span class="dot" style="background:${g.color}"></span>${esc(g.label)}<b>${n(g.total)}</b></div>
      ${g.statuses.map((s) => {
        const c = pipeTotal(s);
        const sp = pipeSplit(s);
        return `<div class="dash-step${c ? '' : ' is-zero'}"><a class="dash-step-main" href="${sp.main}"><span>${esc(S.meta.wo_statuses[s].label)}</span><b>${n(c)}</b></a>
          ${c ? `<div class="dash-kinds">${sp.kinds}</div>` : ''}</div>`;
      }).join('')}</div>`).join('')}</div>`;

  const showBranch = (can('branch.all') || !!S.me.region) && !S.branch;
  const branchCode = (id) => { const b = S.meta.branches.find((x) => String(x.id) === String(id)); return b ? (b.code || b.name) : ''; };
  const overdueRow = (w) => `<a class="dash-od" href="#/work-orders/${w.id}">
      <span class="dash-od-days">${w.sla && w.sla.days ? `Trễ ${-w.sla.days} ngày` : 'Quá hạn'}</span>
      <span class="dash-od-main"><span class="dash-od-top">${plateHtml(w.plate) || ''}<span class="muted small">${esc(w.code)}</span></span>
        <span class="small muted">${esc(w.model || '')} · ${esc((S.meta.wo_statuses[w.status] || {}).label || w.status)}${showBranch && w.branch_id ? ` · ${esc(branchCode(w.branch_id))}` : ''}</span></span>
      ${sourceBadge(w.source)}</a>`;
  const maxAge = Math.max(1, ...d.ages.map((a) => a.count));
  const branches = (d.branches || []).filter((r) => S.meta.branches.some((b) => String(b.id) === String(r.branch_id)));
  const isTech = S.me.role === 'technician' || S.me.role === 'qc';
  const listCard = (title, rows, badge, empty, href) => `<div class="card"><div class="card-head"><h3>${title}</h3>${badge}${href ? `<a class="small" href="${href}">Xem tất cả</a>` : ''}</div>
    <div class="card-body flush">${rows.length ? rows.map(woMiniRow).join('') : `<div class="empty">${icon('check')}<div>${esc(empty)}</div></div>`}</div></div>`;
  const chartKeys = [{ key: 'gsm', label: 'Nhận xe GSM', color: '#1d6fd8' }, { key: 'retail', label: 'Nhận khách lẻ', color: '#0284c7' }, { key: 'delivered', label: 'Giao xe', color: '#22c55e' }];
  const scope = S.branch ? branchNameOf(S.branch) : (can('branch.all') ? 'Tất cả cơ sở' : (S.me.branch_name || ''));

  ctx.setMain(`<div class="dash">
    <div class="page-head"><div class="titles"><h2>Xin chào, ${esc(S.me.full_name)}</h2>
      <div class="sub">${esc(weekdayLabel(today()))}${scope ? ` · <span class="dash-scope">${esc(scope)}</span>` : ''}</div></div></div>
    <div class="dash-hero">${heroes.join('')}</div>
    ${chips ? `<div class="dash-chips">${chips}</div>` : ''}
    <div class="card dash-pipe"><div class="card-head"><h3>Tiến độ xe trong xưởng</h3><a href="#/board" class="small">Mở bảng điều phối →</a></div>
      <div class="card-body">${pipeline}</div></div>
    ${isTech ? `<div style="margin-bottom:16px">${listCard(`${icon('wrench')} Việc của tôi`, d.my_work, `<span class="badge b-blue plain">${d.my_work.length}</span>`, 'Bạn chưa có phiếu nào được phân công')}</div>` : ''}
    <div class="dash-cols">
      <div class="card"><div class="card-head"><h3>Xe quá hạn SLA</h3>${k.sla_overdue ? `<span class="badge b-red plain">${n(k.sla_overdue)}</span>` : ''}<a class="small" href="${overdue.main}">Xem tất cả</a></div>
        <div class="card-body flush">${d.overdue_list.length ? d.overdue_list.map(overdueRow).join('') : `<div class="empty">${icon('check')}<div>Không có xe quá hạn</div></div>`}</div></div>
      <div class="stack">
        <div class="card"><div class="card-head"><h3>Xe nằm xưởng lâu</h3></div><div class="card-body flush">
          ${d.ages.map((a) => `<a class="dash-age${a.count ? '' : ' is-zero'}" href="#/work-orders?src=all&age=${a.days}&order=age"><span>Trên ${a.days} ngày</span>
            <span class="dash-age-bar"><span style="width:${Math.round((a.count / maxAge) * 100)}%;background:${a.days >= 45 ? 'var(--red-fg)' : '#f59e0b'}"></span></span>
            <b>${n(a.count)} xe</b></a>`).join('')}</div></div>
        ${showBranch && branches.length > 1 ? `<div class="card"><div class="card-head"><h3>So sánh cơ sở</h3></div><div class="card-body flush">
          <table class="dash-branches"><thead><tr><th>Cơ sở</th><th>Trong xưởng</th><th>Quá hạn</th><th>Xong 7 ngày</th></tr></thead><tbody>
          ${branches.map((r) => `<tr data-click="dash-branch" data-id="${esc(String(r.branch_id))}" title="Xem riêng ${esc(branchNameOf(r.branch_id))}">
            <td><b>${esc(branchCode(r.branch_id))}</b><div class="small muted">${esc(branchNameOf(r.branch_id))}</div></td>
            <td>${n(r.in_shop)}</td><td class="${r.sla_overdue ? 'danger-text strong' : 'muted'}">${n(r.sla_overdue)}</td><td>${n(r.completed_7d)}</td></tr>`).join('')}
          </tbody></table></div></div>` : ''}
      </div>
    </div>
    <div class="grid g-main">
      <div class="stack">
        <div class="card"><div class="card-head"><h3>Lưu lượng xe 14 ngày gần nhất</h3>${chartLegend(chartKeys)}</div>
          <div class="card-body">${barChart(d.series, chartKeys)}</div></div>
        <div class="card"><div class="card-head"><h3>Bảo hành đang xử lý</h3></div><div class="card-body">
          ${hbars(d.warranty.map((r) => ({ label: r.label, value: r.c })), { color: '#f97316', empty: 'Không có xe chờ bảo hành' })}</div></div>
        <div class="card"><div class="card-head"><h3>Lỗi thường gặp (xe trong xưởng)</h3></div><div class="card-body">
          ${hbars(d.faults.map((r) => ({ label: r.k, value: r.c })), { color: '#ef4444' })}</div></div>
      </div>
      <div class="stack">
        <div class="card"><div class="card-head"><h3>Tải công việc kỹ thuật viên</h3></div><div class="card-body">
          ${d.tech_load.length ? d.tech_load.map((t) => `<div class="list-item" style="padding:8px 0">
            <span class="avatar sm">${esc(initials(t.full_name))}</span>
            <div class="grow"><div class="strong">${esc(t.full_name)}</div><div class="small muted">Đang sửa ${t.working || 0} · Xong hôm nay ${t.finished_today || 0}</div></div>
            <span class="badge ${t.assigned >= 6 ? 'b-orange' : t.assigned ? 'b-blue' : 'b-slate'} plain">${t.assigned || 0} phiếu</span></div>`).join('') : '<div class="empty">Chưa có kỹ thuật viên</div>'}
        </div></div>
        ${can('appt.view') && d.appointments_today.length ? `<div class="card"><div class="card-head"><h3>Lịch hẹn hôm nay</h3><a href="#/appointments" class="small">Xem tất cả</a></div>
          <div class="card-body flush">${d.appointments_today.length ? d.appointments_today.map((a) => `<div class="list-item">
            <div class="time-pill">${fmtTime(a.scheduled_at)}</div>
            <div class="grow"><div class="strong">${esc(a.customer_name)}</div><div class="small muted">${esc(a.model || '')} ${a.plate ? `· ${esc(a.plate)}` : ''}</div></div>
            ${apptBadge(a.status)}</div>`).join('') : '<div class="empty">Không có lịch hẹn</div>'}</div></div>` : ''}
        ${d.csat.count ? `<div class="card"><div class="card-body row" style="gap:14px"><div class="kpi-icon t-amber">${icon('star')}</div>
          <div><div class="small muted">Hài lòng khách lẻ (30 ngày)</div><div style="font-size:22px;font-weight:700">${numf(d.csat.avg, 2)} / 5</div>
          <div class="small muted">${NF.format(d.csat.count)} lượt đánh giá</div></div></div></div>` : ''}
      </div>
    </div></div>`);

  on('click', 'dash-branch', (el) => {
    const sel = document.querySelector('select[data-change="branch"]');
    if (!sel) return;
    sel.value = el.dataset.id;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

// ---------------------------------------------------------------------------
// Bảng điều phối xưởng (Kanban)
// ---------------------------------------------------------------------------
async function pageBoard(ctx) {
  const q = ctx.query;
  const [d, techs] = await Promise.all([
    api('GET', `/api/work-orders/board${qs({ branch_id: S.branch, technician_id: q.get('tech'), mine: q.get('mine'), source: q.get('source') })}`),
    staffList(S.branch),
  ]);
  if (ctx.stale()) return;
  if (d.truncated && !pageBoard.warned) { pageBoard.warned = true; toast(`Chỉ hiện ${d.rows.length} phiếu đầu – hãy lọc theo cơ sở hoặc KTV`, 'info'); }
  const showBranch = (can('branch.all') || !!S.me.region) && !S.branch;
  const byStatus = Object.fromEntries(S.meta.active_statuses.map((s) => [s, []]));
  d.rows.forEach((w) => { if (byStatus[w.status]) byStatus[w.status].push(w); });
  const lateCount = d.rows.filter((w) => w.sla.code === 'overdue').length;

  const card = (w) => `<a class="wo-card ${w.priority === 'urgent' || w.sla.code === 'overdue' ? 'urgent' : ''}" href="#/work-orders/${w.id}">
      <div class="top">${sourceBadge(w.source)}<span class="code">${esc(w.code)}</span>${w.priority === 'urgent' ? '<span class="tag urgent">Gấp</span>' : ''}
        ${showBranch ? `<span class="tag">${esc(w.branch_code)}</span>` : ''}<span style="margin-left:auto">${plateHtml(w.plate)}</span></div>
      <div class="cust">${w.source === 'gsm' ? esc(w.model) : `${esc(w.customer_name)} <span class="muted small">· ${esc(w.model)}</span>`}</div>
      ${w.faults.length ? `<div class="meta">${esc(w.faults.join(', '))}</div>` : `<div class="meta">${esc(String(w.symptoms || '').slice(0, 70))}</div>`}
      ${w.warranty_status ? `<div>${warrantyBadge(w.warranty_status)}</div>` : ''}
      <div class="foot">${w.technician_name ? `<span class="avatar sm">${esc(initials(w.technician_name))}</span><span>${esc(w.technician_name)}</span>` : '<span class="muted">Chưa phân công</span>'}
        <span style="margin-left:auto">${slaBadge(w.sla)}</span></div></a>`;

  ctx.setMain(`
    <div class="page-head"><div class="titles"><h2>Bảng điều phối xưởng</h2>
      <div class="sub">${d.rows.length} xe trong xưởng${lateCount ? ` · <span class="danger-text strong">${lateCount} xe quá hạn SLA</span>` : ''} · Tự làm mới mỗi 60 giây</div></div>
      <div class="actions">
        <div class="seg">${[['', 'Tất cả'], ['gsm', 'GSM'], ['bship', 'BShip'], ['retail', 'Khách lẻ']].map(([v, l]) => `<button class="${(q.get('source') || '') === v ? 'on' : ''}" data-click="board-source" data-v="${v}">${l}</button>`).join('')}</div>
        ${select('', techs.map((t) => [t.id, t.full_name]), q.get('tech'), 'data-change="board-tech" style="width:auto"', 'Tất cả kỹ thuật viên')}
        <label class="check btn"><input type="checkbox" data-change="board-mine" ${q.get('mine') ? 'checked' : ''}><span>Việc của tôi</span></label>
        <button class="btn btn-icon" data-click="board-refresh" title="Làm mới">${icon('refresh')}</button>
      </div></div>
    <div class="board">${S.meta.active_statuses.filter((s) => {
      // Chỉ hiện cột của luồng đang xem; cột khác chỉ hiện khi có xe
      const core = {
        gsm: ['inspecting', 'awaiting_open', 'waiting_order', 'waiting_approval', 'gsm_rejected', 'waiting_repair', 'in_progress', 'done', 'awaiting_handover', 'gsm_received'],
        retail: ['waiting_order', 'waiting_approval', 'waiting_repair', 'in_progress', 'done'],
      };
      const want = q.get('source') ? core[q.get('source')] : [...new Set([...core.gsm, ...core.retail])];
      return byStatus[s].length || want.includes(s);
    }).map((s) => {
      const st = S.meta.wo_statuses[s];
      return `<div class="col"><div class="col-head"><span class="dot" style="background:${STATUS_COLORS[st.color]}"></span>${esc(st.label)}<span class="n">${byStatus[s].length}</span></div>
        <div class="col-body">${byStatus[s].map(card).join('') || '<div class="small muted center" style="padding:14px 0">Trống</div>'}</div></div>`;
    }).join('')}</div>`);

  on('click', 'board-source', (el) => setQuery({ source: el.dataset.v }));
  on('change', 'board-tech', (el) => setQuery({ tech: el.value }));
  on('change', 'board-mine', (el) => setQuery({ mine: el.checked ? '1' : '' }));
  on('click', 'board-refresh', () => ctx.reload());
  ctx.every(() => ctx.reload(), 60000);
}
