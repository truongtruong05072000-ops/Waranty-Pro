'use strict';
/* global S, $, $$, api, qs, esc, icon, can, fmtDT, fmtD, numf, money, initials, statusBadge, svcLabel, plateHtml, warrantyHtml, on, field, input,
   scanInput, textarea, select, checkbox, toast, toastSheetPush, openModal, closeModal, modalFoot, confirmBox, telLink, slaBadge, sourceBadge, warrantyBadge,
   faultTags, chipSelect, parseChips, uploadAttachment, snapshotFile, lab, fmtSize, toInputDT, today, formData,
   inspectNqFields, inspectNqInputs, inspectNqFromData, inspectText, InspectText, chargerQrInputs, chargerQrText,
   batterySerialInputs, applyPinSerials, pinSerialsFromData, staffList, drawerBackHash */

// Menu "⋯" (details) đóng khi bấm ra ngoài, chọn một mục hoặc nhấn Esc
document.addEventListener('click', (e) => {
  document.querySelectorAll('details.wd-more[open]').forEach((m) => {
    if (!m.contains(e.target) || e.target.closest('.wd-menu-item')) m.removeAttribute('open');
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('details.wd-more[open]').forEach((m) => m.removeAttribute('open'));
});
// Menu "⋯" mở ra luôn nằm trong màn hình: vị trí nút đổi theo số nút đứng trước (SLA, in, Sheets…) nên đo rồi dịch vào
document.addEventListener('toggle', (e) => {
  const d = e.target;
  if (!(d instanceof HTMLDetailsElement) || !d.classList.contains('wd-more') || !d.open) return;
  const m = d.querySelector('.wd-menu');
  if (!m) return;
  m.style.transform = '';
  const r = m.getBoundingClientRect();
  const pad = 8;
  let dx = 0;
  if (r.left < pad) dx = pad - r.left;
  else if (r.right > window.innerWidth - pad) dx = window.innerWidth - pad - r.right;
  if (dx) m.style.transform = `translateX(${Math.round(dx)}px)`;
}, true);

/** Khối "Nội dung kiểm tra" trên chi tiết phiếu: các mục ngoại quan + nội dung tự do cũ. */
function inspectDetailHtml(w) {
  const n = w.inspection_notes || {};
  const val = (k) => String(n[k] || '').trim();
  const all = S.meta.inspection_note_fields || [];
  const hasNq = all.some((f) => val(f.key));
  const free = String(w.diagnosis || '').trim();
  if (!hasNq) {
    return `<div class="pre" style="margin-top:4px">${esc(free || w.symptoms) || '<span class="muted">Chưa có</span>'}</div>`;
  }
  const rows = all.filter((f) => f.form || val(f.key)).map((f) => `<div class="nq-row"><dt>${esc(f.label)}</dt>
    <dd>${val(f.key) ? esc(val(f.key)) : '<span class="muted">—</span>'}</dd></div>`).join('');
  return `<dl class="nq-list">${rows}</dl>${free ? `<div class="pre small" style="margin-top:8px">${esc(free)}</div>` : ''}`;
}

function allowedTransitions(w) {
  const inInspection = (S.meta.inspection_statuses || ['inspecting', 'waiting_order']).includes(w.status);
  const owner = w.technician_id === S.me.id || (inInspection && (!w.inspector_id || w.inspector_id === S.me.id));
  // Còn bảo hành chưa xong → "Sửa chữa xong" (chờ BH) thay cho "Chuyển hoàn thành"; hết BH thì ngược lại
  const bhPending = typeof unfinishedWarrantyLabels === 'function' && w.warranty_kinds !== undefined ? unfinishedWarrantyLabels(w).length > 0 : false;
  return S.meta.transitions.filter((t) => t.from === w.status && (!t.sources || t.sources.includes(w.source))
    && (!t.svc || t.svc === w.service_type) && t.notSvc !== w.service_type
    && !(t.warrantyPending && !bhPending) && !(t.to === 'done' && t.from === 'in_progress' && bhPending)
    && !(t.qcStep) && t.perms.some((p) => can(p))
    && (t.perms.some((p) => !['wo.work', 'wo.inspect'].includes(p) && can(p)) || can('wo.assign') || owner))
    .map((t) => (w.source === 'bship' ? { ...t, label: fleetTxt(w, t.label) } : t));
}
const isFleetWo = (w) => w.source === 'gsm' || w.source === 'bship';
/** Phiếu khách lẻ trên xe đội GSM / BShip (tài xế tự mang tới bảo hành) – khách hiển thị là tài xế. */
const isWalkinWo = (w) => w.source === 'retail' && (w.fleet === 'gsm' || w.fleet === 'bship');
const fleetTxt = (w, s) => (w && w.source === 'bship' ? String(s).replace(/GSM/g, 'BShip') : s);

// ----- Xe GSM / BShip: khách hàng và công ty cùng thanh toán – 2 lệnh SC riêng, CPSC = khách hàng + công ty -----
// Phần công ty dùng chính "Lệnh sửa chữa" (dms_ro_code, lệnh GSM duyệt); phần khách hàng có lệnh riêng (cust_pay_ro, không bắt buộc)
const PAY_KEYS = ['cust_pay_ro', 'cust_pay_note', 'cust_pay_amount', 'gsm_pay_note', 'gsm_pay_amount'];
const payVal = (v) => v !== null && v !== undefined && v !== '';
const hasPaySplit = (w) => payVal(w.cust_pay_amount) || payVal(w.gsm_pay_amount);
/** 2 phần nhập: Khách hàng / Công ty – mỗi phần: lệnh SC + số tiền, nội dung bên dưới. Mới chia: phần công ty lấy sẵn lệnh + CPSC đang có. */
function payRowsHtml(w) {
  const start = !hasPaySplit(w);
  const fl = (lab, html) => `<label class="pay-fl"><span class="pay-lab">${esc(lab)}</span>${html}</label>`;
  const part = (who, roName, roVal, k, amt) => `<div class="pay-part">
    <div class="pay-who">${esc(who)}</div>
    <div class="pay-line">
      ${fl('Lệnh sửa chữa', input(roName, roVal || '', 'maxlength="60" autocomplete="off"', 'mono'))}
      ${fl('Chi phí sửa chữa', moneyInput(`${k}_amount`, amt, 'data-pay-amt'))}
    </div>
    ${fl('Nội dung sửa chữa', textarea(`${k}_note`, w[`${k}_note`] || '', 'rows="2" maxlength="1000" data-pay-note'))}
  </div>`;
  return `${part('Khách hàng thanh toán', 'cust_pay_ro', w.cust_pay_ro, 'cust_pay', w.cust_pay_amount)}
    ${part('Công ty thanh toán', 'dms_ro_code', w.dms_ro_code, 'gsm_pay',
    start ? (Number(w.quote_amount) > 0 ? w.quote_amount : null) : w.gsm_pay_amount)}
    <div class="pay-sum small" data-pay-sum></div>`;
}
/** Khối "Chia thanh toán" trong thẻ Kiểm tra & Báo giá – tick là dùng 2 lệnh riêng, không dùng Lệnh & chi phí phía trên. */
function payCardHtml(w, canEdit, editing) {
  const on = hasPaySplit(w);
  if (!on && !canEdit) return '';
  const head = canEdit
    ? `<label class="wd-pay-tick"><input type="checkbox" data-change="pay-toggle"${on || editing ? ' checked' : ''}> Khách hàng và Công ty cùng thanh toán</label>
      ${on && !editing ? `<button type="button" class="wd-qf-add" data-click="pay-edit">${icon('edit')} Sửa</button>` : ''}`
    : '<div class="wd-pay-tick">Khách hàng và Công ty cùng thanh toán</div>';
  let body = '';
  if (editing && canEdit) {
    body = `<form class="wd-pay-form" data-submit="pay-save" data-pay-split novalidate>
      <div class="pay-body">${payRowsHtml(w)}</div>
      <div class="wd-pay-actions"><button type="button" class="btn btn-sm" data-click="pay-cancel">Hủy</button><button type="submit" class="btn btn-sm btn-primary">Lưu</button></div>
    </form>`;
  } else if (on) {
    const col = (lbl, ro, k) => `<div class="wd-pay-col"><div class="wd-qf-k">${esc(lbl)}</div>
      <div class="pay-ro mono">${ro ? esc(ro) : '<span class="wd-empty">Chưa có lệnh SC</span>'}</div>
      <div class="pay-amt">${payVal(w[`${k}_amount`]) ? money(w[`${k}_amount`]) : '—'}</div>
      ${w[`${k}_note`] ? `<div class="pay-note">${esc(w[`${k}_note`])}</div>` : ''}</div>`;
    body = `<div class="wd-pay-grid">${col('Khách hàng thanh toán', w.cust_pay_ro, 'cust_pay')}${col('Công ty thanh toán', w.dms_ro_code, 'gsm_pay')}</div>
      <div class="pay-total">Tổng chi phí sửa chữa: <b>${money(Number(w.quote_amount) || 0)}</b></div>`;
  }
  return `<div class="wd-pay${on ? ' is-on' : ''}"><div class="wd-pay-head">${head}</div>${body}</div>`;
}
const payDigits = (el) => (el ? el.value.replace(/\D+/g, '') : '');
/** Dòng tổng dưới 2 phần: CPSC = khách hàng + công ty. */
function paySplitSync(box) {
  box.querySelectorAll('textarea[data-pay-note]').forEach(payNoteFit);
  const total = [...box.querySelectorAll('[data-pay-amt]')].reduce((s, i) => s + (Number(payDigits(i)) || 0), 0);
  const sum = box.querySelector('[data-pay-sum]');
  if (sum) sum.textContent = `Tổng chi phí sửa chữa = ${money(total)}`;
}
/** Ô nội dung tự cao theo chữ (tối đa ~6 dòng rồi cuộn). */
const payNoteFit = (ta) => { ta.style.height = 'auto'; ta.style.height = `${Math.min(ta.scrollHeight + 2, 150)}px`; };
document.addEventListener('input', (e) => {
  if (!e.target.matches) return;
  if (e.target.matches('[data-pay-amt]')) paySplitSync(e.target.closest('[data-pay-split]'));
  if (e.target.matches('textarea[data-pay-note]')) payNoteFit(e.target);
});
/** Lấy dữ liệu chia từ form trên thẻ; lỗi (thiếu số tiền / nội dung) thì trả chuỗi báo. */
function paySplitValues(data) {
  const vals = { ...Object.fromEntries(PAY_KEYS.map((k) => [k, data[k] ?? ''])), dms_ro_code: data.dms_ro_code ?? '' };
  if (!vals.cust_pay_amount && !vals.gsm_pay_amount) return { error: 'Nhập số tiền khách hàng và công ty thanh toán (hoặc bỏ tick chia thanh toán)' };
  if (vals.cust_pay_amount && !String(vals.cust_pay_note).trim()) return { error: 'Vui lòng nhập nội dung khách hàng thanh toán' };
  if (vals.gsm_pay_amount && !String(vals.gsm_pay_note).trim()) return { error: 'Vui lòng nhập nội dung công ty thanh toán' };
  return { vals };
}

// Nhóm trường được phép sửa (khớp với máy chủ)
function woEditGroups(w) {
  const g = new Set();
  const closed = ['delivered', 'cancelled'].includes(w.status);
  const insp = S.meta.inspection_statuses || ['inspecting', 'waiting_order'];
  const mineOrLead = can('wo.assign') || w.technician_id === S.me.id || w.inspector_id === S.me.id;
  if (!closed && can('wo.edit')) { g.add('edit'); g.add('work'); }
  if (insp.includes(w.status) && can('wo.inspect') && (mineOrLead || !w.inspector_id)) { g.add('inspect'); g.add('work'); }
  if (!closed && can('wo.work') && mineOrLead) g.add('work');
  if (!closed && can('wo.assign')) g.add('lead');
  const unownedInspection = insp.includes(w.status) && !w.inspector_id;
  if (can('wo.warranty') && (!closed || can('wo.edit')) && (can('wo.edit') || mineOrLead || unownedInspection)) g.add('warranty');
  if (can('wo.dms')) g.add('dms');
  return g;
}

const LOG_ACTIONS = { create: 'Tạo phiếu', assign: 'Phân công', status: 'Chuyển trạng thái', update: 'Cập nhật', note: 'Ghi chú', attach: 'Tài liệu', import: 'Cập nhật dữ liệu', call: 'Gọi điện', map: 'Sơ đồ xưởng' };

/** Loại BH đang gắn phiếu (ưu tiên warranty_kinds đã lưu). */
function warrantyKindsOf(w) {
  const saved = Array.isArray(w.warranty_kinds) ? w.warranty_kinds.filter(Boolean) : [];
  if (saved.length) return saved;
  const kinds = [];
  const ws = String(w.warranty_status || '');
  if (ws.includes('battery') || w.battery_serial_old || w.battery_serial_new || w.battery_repair_type || w.parts_removed_at) kinds.push('pin');
  if (ws.includes('motor') || w.motor_serial_old || w.motor_serial_new || w.motor_repair_type || w.coc_status || w.motor_removed_at) kinds.push('motor');
  if (ws.includes('charger')) kinds.push('charger');
  return kinds;
}

function warrantyExtraOf(w) {
  return w.warranty_extra && typeof w.warranty_extra === 'object' ? w.warranty_extra : {};
}

function bhStatusOpts(kind) {
  const all = S.meta.warranty_statuses || {};
  const keys = kind === 'pin'
    ? ['checking', 'waiting_battery', 'rejected_battery', 'completed']
    : kind === 'motor'
      ? ['checking', 'waiting_motor', 'rejected_motor', 'completed']
      : kind === 'charger'
        ? ['checking', 'rejected_charger', 'completed']
        : ['checking', 'waiting_battery', 'completed'];
  return keys.filter((k) => all[k]).map((k) => [k, all[k].label || k]);
}

function bhKindStatus(w, kind, extra) {
  const saved = (extra[kind] || {}).status;
  if (saved) return saved;
  const ws = w.warranty_status || '';
  if (kind === 'pin') {
    if (ws === 'waiting_battery' || ws === 'waiting_battery_motor') return 'waiting_battery';
    if (ws === 'rejected_battery' || ws === 'rejected_battery_motor') return 'rejected_battery';
    if (ws === 'checking' || ws === 'completed') return ws;
  }
  if (kind === 'motor') {
    if (ws === 'waiting_motor' || ws === 'waiting_battery_motor') return 'waiting_motor';
    if (ws === 'rejected_motor' || ws === 'rejected_battery_motor') return 'rejected_motor';
    if (ws === 'checking' || ws === 'completed') return ws;
  }
  if (kind === 'charger' && ws === 'rejected_charger') return 'rejected_charger';
  return '';
}

function aggregateWarrantyStatus(byKind) {
  const vals = Object.values(byKind).filter(Boolean);
  const pin = vals.includes('waiting_battery') ? 'waiting_battery' : byKind.pin;
  const motor = byKind.motor;
  if (pin === 'waiting_battery' && motor === 'waiting_motor') return 'waiting_battery_motor';
  if (pin === 'rejected_battery' && motor === 'rejected_motor') return 'rejected_battery_motor';
  if (pin === 'waiting_battery') return 'waiting_battery';
  if (motor === 'waiting_motor') return 'waiting_motor';
  if (pin === 'rejected_battery') return 'rejected_battery';
  if (motor === 'rejected_motor') return 'rejected_motor';
  if (vals.includes('rejected_charger')) return 'rejected_charger';
  if (vals.includes('checking')) return 'checking';
  if (vals.length && vals.every((s) => s === 'completed')) return 'completed';
  return pin || motor || vals[0] || null;
}

/** Loại BH chưa kết thúc (chưa Đã hoàn thành / Từ chối) – chặn chuyển hoàn thành phiếu. */
function unfinishedWarrantyLabels(w) {
  const kinds = warrantyKindsOf(w);
  if (!kinds.length) return [];
  const extra = warrantyExtraOf(w);
  const labels = S.meta.warranty_kinds || {};
  return kinds.filter((k) => { const st = String(bhKindStatus(w, k, extra) || ''); return st !== 'completed' && !st.startsWith('rejected_'); }).map((k) => labels[k] || k);
}

async function pageWoDetail(ctx) {
  const id = ctx.params[0];
  const listRoot = /^\/warranty-orders\//.test(ctx.path || '') ? '#/warranty-orders'
    : /^\/retail-orders\//.test(ctx.path || '') ? '#/retail-orders' : /^\/retail-warranty\//.test(ctx.path || '') ? '#/retail-warranty' : /^\/bship-orders\//.test(ctx.path || '') ? '#/bship-orders' : '#/work-orders';
  // Quay về đúng danh sách đã xem (giữ tab Quá hạn, bộ lọc, trang…)
  const listBase = (() => {
    try {
      const h = sessionStorage.getItem(`woListHash:${listRoot}`);
      return h && (h === listRoot || h.startsWith(`${listRoot}?`) ||
        (listRoot === '#/work-orders' && (h === '#/work-orders-overview' || h.startsWith('#/work-orders-overview?')))) ? h : listRoot;
    } catch { return listRoot; }
  })();
  let d; let techs = [];
  let loadSeq = 0;
  let payEdit = false;

  /** Áp trạng thái / lệnh / CPSC đã lưu vào state local — tránh GET cũ ghi đè làm mất giá trị vừa thấy. */
  const applyWoPatch = (patch) => {
    if (!d || !d.work_order || !patch || typeof patch !== 'object') return;
    const w = d.work_order;
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) continue;
      if (k === 'quote_amount' && v !== null && v !== '') {
        const n = Number(v);
        w[k] = Number.isFinite(n) ? Math.round(n) : v;
      } else {
        w[k] = v;
      }
    }
  };

  const load = async (opts = {}) => {
    const seq = ++loadSeq;
    const keep = opts.keepFields && d && d.work_order
      ? {
        dms_ro_code: d.work_order.dms_ro_code,
        quote_amount: d.work_order.quote_amount,
        dms_added_at: d.work_order.dms_added_at,
        quoted_at: d.work_order.quoted_at,
        status: d.work_order.status,
        gsm_handover_at: d.work_order.gsm_handover_at,
      }
      : null;
    const keepUpdatedAt = opts.keepFields && d && d.work_order ? d.work_order.updated_at : null;
    // Phiếu + danh sách KTV tải song song (KTV dùng bộ đệm cả phiên, lọc theo cơ sở của phiếu)
    const [next, allStaff] = await Promise.all([
      api('GET', `/api/work-orders/${id}`, null, { signal: ctx.signal }),
      can('wo.assign') ? staffList() : Promise.resolve(null),
    ]);
    if (seq !== loadSeq || ctx.stale()) return;
    const nextTechs = allStaff ? allStaff.filter((u) => String(u.branch_id) === String(next.work_order.branch_id)) : techs;
    // GET cũ / trễ: không để null ghi đè lệnh·CPSC vừa lưu thành công
    if (keep && next && next.work_order) {
      const w = next.work_order;
      for (const [k, v] of Object.entries(keep)) {
        if (v == null || v === '') continue;
        if (w[k] == null || w[k] === '') w[k] = v;
      }
    }
    // GET trễ không được kéo updated_at lùi về trước lần lưu vừa xong (lần lưu kế tiếp sẽ tự báo xung đột)
    if (keepUpdatedAt && next && next.work_order && String(keepUpdatedAt) > String(next.work_order.updated_at || '')) {
      next.work_order.updated_at = keepUpdatedAt;
    }
    d = next;
    techs = nextTechs;
    render();
  };
  const save = async (body, msg = 'Đã cập nhật') => {
    // Khóa lạc quan: gửi updated_at lúc tải phiếu → người khác đã sửa thì máy chủ trả 409, không ghi đè
    const expected = d && d.work_order ? d.work_order.updated_at : null;
    let r;
    try {
      r = await api('PUT', `/api/work-orders/${id}`, expected ? { ...body, expected_updated_at: expected } : body);
    } catch (e) {
      if (e.status !== 409) throw e;
      // Giữ nguyên hộp đang sửa để người dùng còn chép lại nội dung nếu chọn "Để sau"
      const reload = await confirmBox(e.message, { title: 'Phiếu đã được người khác cập nhật', okLabel: 'Tải lại' });
      if (reload) {
        closeModal();
        await load();
        toast('Đã tải lại phiếu mới nhất – vui lòng sửa lại', 'info');
      }
      return;
    }
    if (r && r.updated_at && d && d.work_order) d.work_order.updated_at = r.updated_at;
    closeModal();
    // Giữ lệnh / CPSC trên UI ngay — không chờ GET (tránh race với tải PDF nền)
    applyWoPatch(body);
    if (d && d.work_order) render();
    toast(msg, 'success');
    if (r && r.warning) toast(r.warning, 'error');
    else if (r && r.sheet) toastSheetPush(r.sheet, { silentUnchanged: true });
    await load({ keepFields: true });
  };

  const render = () => {
    const w = d.work_order;
    const g = woEditGroups(w);
    const closed = ['delivered', 'cancelled'].includes(w.status);
    const isGsm = isFleetWo(w);
    const canAttach = can('wo.attach') || can('wo.edit');
    const trans = allowedTransitions(w).sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0) || (a.danger ? 1 : 0) - (b.danger ? 1 : 0));
    const cancelT = trans.find((t) => t.to === 'cancelled');
    const mainTrans = trans.filter((t) => t !== cancelT);
    const primaryT = mainTrans.find((t) => t.primary && !t.danger) || mainTrans.find((t) => t.primary) || mainTrans.find((t) => !t.danger) || mainTrans[0] || null;
    const secondaryTrans = mainTrans.filter((t) => t !== primaryT);
    const renderTransBtn = (t, cls = '') => {
      const blockedTech = t.needTech && !w.technician_id;
      const pendingBh = t.to === 'done' ? unfinishedWarrantyLabels(w) : [];
      const blocked = blockedTech || pendingBh.length;
      const title = blockedTech
        ? 'Cần phân công kỹ thuật viên trước'
        : pendingBh.length
          ? `Bảo hành chưa hoàn thành: ${pendingBh.join(', ')}`
          : t.label;
      const kind = t.danger ? 'btn-danger' : t.primary ? 'btn-primary' : '';
      return `<button type="button" class="btn ${kind} btn-sm ${cls}" data-click="transition" data-to="${t.to}" ${blocked ? `disabled title="${esc(title)}"` : `title="${esc(title)}"`}>${esc(t.label)}</button>`;
    };

    // Bước QC đã bỏ: chỉ hiện khi phiếu cũ còn kẹt ở trạng thái QC
    const qcOn = w.status === 'qc';
    // Nhật ký cũ ghi trạng thái đã đổi tên (waiting_quote, order_opened…) → quy về tên mới để tìm người làm từng bước
    const legacySt = (s) => (S.meta.legacy_wo_statuses || {})[s] || s;
    const statusLogs = d.logs.filter((l) => l.action === 'status')
      .map((l) => ({ ...l, from_status: legacySt(l.from_status), to_status: legacySt(l.to_status) }));
    const lastLog = (pred) => {
      for (let k = statusLogs.length - 1; k >= 0; k--) if (pred(statusLogs[k])) return statusLogs[k];
      return null;
    };
    const createLog = d.logs.find((l) => l.action === 'create') || null;
    const by = (log, verb) => (log && log.user_name ? { log, verb } : null);
    const inspectDone = () => (w.inspected_at && by(lastLog((l) => l.from_status === 'inspecting'), 'Hoàn tất kiểm tra')) || by(createLog, 'Tiếp nhận');
    const repairWaitLog = lastLog((l) => l.to_status === 'waiting_repair');
    const openLog = lastLog((l) => l.from_status === 'awaiting_open' && l.to_status === 'waiting_order');
    const quoteLog = lastLog((l) => l.to_status === 'waiting_approval');
    const startLog = statusLogs.find((l) => l.to_status === 'in_progress');
    const acceptLog = lastLog((l) => l.to_status === 'gsm_received');
    const REPAIRING = ['in_progress', 'extra_cost', 'repair_done'];
    // [nhãn | (giai đoạn: before / current / done) => nhãn, thời điểm, trạng thái thuộc bước, () => người tác động]
    // Theo chủ xưởng: Kiểm tra → Mở lệnh⇄Báo giá → Chờ xác nhận⇄Đã xác nhận → Chờ sửa chữa⇄Đang sửa chữa → Đã hoàn thành → Đã giao xe
    const confirmLabel = (st) => (st === 'done' ? 'Đã xác nhận' : 'Chờ xác nhận');
    const steps = [
      ...(isGsm ? [
        ['Kiểm tra', w.inspected_at || w.received_at, ['inspecting'], inspectDone],
        [(st) => (st === 'done' || w.status === 'waiting_order' ? 'Báo giá' : 'Mở lệnh'), w.quoted_at || w.opened_at, ['awaiting_open', 'waiting_order'],
          () => by(quoteLog, 'Gửi báo giá') || by(openLog, 'Mở lệnh')],
        [confirmLabel, repairWaitLog ? repairWaitLog.created_at : w.quoted_at, ['waiting_approval', 'gsm_rejected'],
          (done) => (done ? by(repairWaitLog, 'GSM xác nhận') : by(quoteLog, 'Gửi báo giá'))],
      ] : w.service_type === 'warranty' ? [
        ['Kiểm tra', w.inspected_at || w.received_at, ['inspecting', 'waiting_order', 'waiting_approval'], inspectDone],
      ] : [
        [(st) => (st !== 'done' && w.status === 'waiting_order' ? 'Báo giá' : confirmLabel(st)), repairWaitLog ? repairWaitLog.created_at : w.quoted_at || w.received_at,
          ['waiting_order', 'waiting_approval'], (done) => (done && by(repairWaitLog, 'Khách xác nhận')) || (w.quoted_at && by(quoteLog, 'Gửi báo giá')) || by(createLog, 'Tiếp nhận')],
      ]),
      [(st) => (st === 'done' || REPAIRING.includes(w.status) ? 'Đang sửa chữa' : 'Chờ sửa chữa'), w.started_at || (repairWaitLog && repairWaitLog.created_at),
        ['waiting_repair', ...REPAIRING], () => by(startLog, 'Bắt đầu sửa') || by(repairWaitLog, isGsm ? 'GSM xác nhận' : 'Chờ sửa chữa')],
      ...(qcOn ? [['Kiểm tra QC', w.qc_at, ['qc'], () => by(lastLog((l) => l.to_status === 'qc'), 'Chuyển QC')]] : []),
      // Chờ GSM nghiệm thu: vẫn ở bước Đã hoàn thành
      ['Đã hoàn thành', w.completed_at, ['done', 'awaiting_handover'], () => by(lastLog((l) => l.to_status === 'done' && l.from_status !== 'awaiting_handover'), 'Hoàn thành')],
      // GSM đã nghiệm thu (xe còn ở xưởng) ⇄ Đã giao xe (xe rời xưởng) – chung 1 bước
      [(st) => (st === 'current' && w.status === 'gsm_received' ? 'Đã nghiệm thu' : 'Đã giao xe'), w.delivered_at || (acceptLog && acceptLog.created_at), ['gsm_received'],
        () => (w.status === 'gsm_received' ? by(acceptLog, 'GSM nghiệm thu đạt') : by(lastLog((l) => l.to_status === 'delivered'), isGsm ? 'Xe rời xưởng' : 'Giao xe'))],
    ];
    const cur = w.status === 'delivered' ? steps.length : steps.findIndex((s) => s[2].includes(w.status));
    const stepActor = (s, i) => {
      // Bước đã qua mà phiếu cũ thiếu mốc giờ (VD quoted_at) vẫn hiện người làm theo nhật ký
      const a = (s[1] || i < cur) && s[3] ? s[3](i < cur) : null;
      if (!a) return '';
      const title = `${a.verb}: ${a.log.user_name} · ${fmtDT(a.log.created_at)}`;
      return `<div class="t by" title="${esc(title)}">${esc(a.log.user_name)}</div>`;
    };
    const lastStatusLog = [...d.logs].reverse().find((l) => l.action === 'status' && l.to_status === w.status);
    const rejectNoteLog = isGsm && w.status === 'gsm_rejected'
      ? [...d.logs].reverse().find((l) => l.action === 'status' && l.to_status === 'gsm_rejected' && l.note)
      : null;

    const alerts = [];
    // KTV xem phiếu không phải của mình: nói rõ lý do không có nút thao tác
    const techOnly = can('wo.work') && !can('wo.assign') && !can('wo.edit');
    const mine = w.technician_id === S.me.id || w.inspector_id === S.me.id;
    const canClaim = techOnly && !closed && !w.technician_id && ['inspecting', 'waiting_repair'].includes(w.status);
    if (techOnly && !closed && !mine) {
      alerts.push(w.technician_id
        ? `<div class="alert alert-info">${icon('user')}<div>Phiếu này đang giao cho KTV <b>${esc(w.technician_name)}</b> – bạn chỉ xem được. Phiếu của bạn ở mục <a href="#/work-orders?mine=1&status=active">Việc của tôi</a>; cần đổi người làm thì báo Quản đốc / Tổ trưởng.</div></div>`
        : `<div class="alert alert-warn">${icon('user')}<div>Phiếu chưa phân công KTV. ${canClaim ? 'Bấm <b>Nhận phiếu này</b> để làm.' : 'Báo Quản đốc / Tổ trưởng phân công.'}</div></div>`);
    }
    if (w.status === 'repair_done') {
      const pend = unfinishedWarrantyLabels(w);
      alerts.push(`<div class="alert alert-warn">${icon('clock')}<div><b>Sửa chữa xong - chờ bảo hành</b>${pend.length ? `: ${esc(pend.join(', '))}` : ''}. Cập nhật bảo hành sang Đã hoàn thành / Từ chối → phiếu tự chuyển Hoàn thành.</div></div>`);
    }
    if (w.status === 'cancelled') alerts.push(`<div class="alert alert-danger">${icon('alert')}<div><b>Phiếu đã hủy</b> lúc ${fmtDT(w.cancelled_at)}. Lý do: ${esc(w.cancel_reason)}</div></div>`);
    const slaChip = w.sla.code === 'overdue' || w.sla.code === 'warning'
      ? `<span class="wd-sla wd-sla-${w.sla.code}" title="${esc(`${w.sla.label} – hạn ${fmtD(w.sla_due_at)}`)}">${icon('clock')}${esc(w.sla.label)} · ${fmtD(w.sla_due_at).slice(0, 5)}</span>`
      : '';
    // Gợi ý bước hiện tại: hiện cạnh nút thao tác ngay dưới thanh tiến trình
    let stepHint = '';
    if (isGsm && w.status === 'inspecting') stepHint = `${icon('wrench')}<div><b>Bước 1 — KTV.</b> Ghi kiểm tra, chụp ảnh → <b>Hoàn tất kiểm tra</b>.</div>`;
    if (isGsm && w.status === 'awaiting_open') stepHint = `${icon('clipboard')}<div><b>Bước 2 — CVDV.</b> Bấm <b>Mở lệnh</b> để chuyển sang báo giá.</div>`;
    if (isGsm && w.status === 'waiting_order') stepHint = `${icon('clipboard')}<div><b>Bước 3 — CVDV.</b> Nhập lệnh SC + CPSC → <b>Gửi báo giá</b>.</div>`;
    if (isGsm && w.status === 'waiting_approval') {
      stepHint = can('wo.approve')
        ? `${icon('clock')}<div><b>Chờ GSM xác nhận.</b></div>`
        : `${icon('clock')}<div><b>Chờ GSM duyệt chi phí.</b> Chỉ tài khoản GSM mới xác nhận hoặc từ chối bước này.</div>`;
    }
    if (isGsm && w.status === 'gsm_rejected') {
      const note = (rejectNoteLog && rejectNoteLog.note) || (lastStatusLog && lastStatusLog.note) || '';
      alerts.push(`<div class="alert alert-danger">${icon('alert')}<div><b>GSM đã trả về phiếu.</b>${note ? ` Lý do: <b>${esc(note)}</b>.` : ''} CVDV chỉnh lệnh/CPSC rồi bấm <b>Gửi lại GSM xác nhận</b>.</div></div>`);
    }
    if (isGsm && w.status === 'done') stepHint = `${icon('check')}<div><b>Sửa xong.</b> CVDV bấm <b>Bàn giao GSM</b> khi sẵn sàng giao xe.</div>`;
    if (isGsm && w.status === 'awaiting_handover') {
      stepHint = can('wo.approve')
        ? `${icon('scooter')}<div><b>Xe đã sửa xong.</b> Kiểm tra xe đạt chuẩn thì bấm <b>GSM nghiệm thu đạt</b>.</div>`
        : `${icon('scooter')}<div><b>Chờ GSM nghiệm thu.</b> Xưởng đã bàn giao — đợi GSM kiểm tra xe đạt chuẩn.</div>`;
    }
    if (isGsm && w.status === 'gsm_received') {
      stepHint = `${icon('scooter')}<div><b>GSM đã nghiệm thu – xe còn ở xưởng.</b> Khi tài xế lấy xe, CVDV bấm <b>Xe đã rời xưởng</b>.</div>`;
    }
    if (w.status === 'extra_cost' && lastStatusLog && lastStatusLog.note) {
      alerts.push(`<div class="alert alert-warn">${icon('alert')}<div><b>${esc(S.meta.wo_statuses[w.status].label)}:</b> ${esc(lastStatusLog.note)}</div></div>`);
    }
    if (w.status === 'waiting_approval' && !isGsm && lastStatusLog && lastStatusLog.note) {
      alerts.push(`<div class="alert alert-warn">${icon('alert')}<div><b>${esc(S.meta.wo_statuses[w.status].label)}:</b> ${esc(lastStatusLog.note)}</div></div>`);
    }
    if (w.status === 'in_progress' && w.qc_fail_count > 0 && w.qc_note) alerts.push(`<div class="alert alert-danger">${icon('alert')}<div><b>QC không đạt (lần ${w.qc_fail_count}):</b> ${esc(w.qc_note)}</div></div>`);

    const info = (k, v) => `<div><div class="k">${esc(k)}</div><div class="v">${v || '<span class="muted">—</span>'}</div></div>`;
    // Ghép 2 ô ngày 1 hàng — info-grid auto-fill hay đẩy Ngày xử lý xuống dòng khi drawer hẹp
    const photoBlock = (kinds, label, uploadKind) => {
      const kindList = Array.isArray(kinds) ? kinds : [kinds];
      const list = d.attachments.filter((a) => kindList.includes(a.kind) && a.mime && a.mime.startsWith('image/'));
      if (!list.length && !canAttach) return '';
      const upKind = uploadKind || kindList[0];
      return `<div>
        <div class="label" style="margin-bottom:6px">${esc(label)}${list.length ? ` (${list.length})` : ''}</div>
        ${list.length ? `<div class="gallery">${list.map((a) => `<div class="att">
          <a class="thumb" href="${esc(a.url)}" data-file="${a.id}" target="_blank" rel="noopener"><img src="${esc(a.thumb || `/api/files/${a.id}`)}" alt="" loading="lazy" decoding="async"></a>
          ${canAttach ? `<button class="btn btn-ghost btn-icon btn-sm del" data-click="att-del" data-id="${a.id}" title="Xóa">${icon('trash')}</button>` : ''}
        </div>`).join('')}</div>` : '<div class="muted small">Chưa có ảnh</div>'}
        ${canAttach ? `<div class="upload-bar" style="margin-top:8px"><label class="btn btn-sm">${icon('camera')} Thêm ảnh<input type="file" accept="image/*,image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" multiple data-change="att-upload" data-kind="${upKind}"></label></div>` : ''}
      </div>`;
    };
    const quotePdfs = d.attachments.filter((a) => a.kind === 'quote');
    const quoteFilesHtml = quotePdfs.map((a) => `<span class="quote-chip">
          <a href="${esc(a.url)}" target="_blank" rel="noopener" title="${esc(a.name)}">${icon('file')}<span class="nm">${esc(a.name)}</span></a>
          ${a.drive_url && a.drive_url !== a.url ? `<a class="quote-drive" href="${esc(safeUrl(a.drive_url))}" target="_blank" rel="noopener" title="Mở bản trên Google Drive">Drive</a>` : ''}
          ${canAttach ? `<button type="button" class="btn btn-ghost btn-icon btn-sm" data-click="att-del" data-id="${a.id}" title="Xóa">${icon('trash')}</button>` : ''}
        </span>`).join('');
    const canDms = g.has('dms');
    const canInspectEdit = g.has('warranty') || g.has('work') || g.has('edit');
    const feeNote = (w.inspection_notes || {}).fee_note;
    const qf = (k, v, cls = '') => `<div class="wd-qf${cls}"><div class="wd-qf-k">${esc(k)}</div><div class="wd-qf-v">${v}</div></div>`;
    const qEmpty = '<span class="wd-empty">—</span>';
    const hasParts = !!(w.parts_status && (S.meta.parts_statuses || {})[w.parts_status]);
    const canParts = can('wo.parts') && (S.meta.parts_edit_statuses || ['in_progress', 'extra_cost', 'repair_done', 'done', 'awaiting_handover', 'gsm_received']).includes(w.status);
    // Bảo hành khách lẻ: hãng chi trả, không có lệnh SC / chi phí / báo giá
    const noQuote = w.source === 'retail' && w.service_type === 'warranty';
    // Đang chia khách hàng / công ty: 2 lệnh + chi phí hiện trong khối chia, không lặp ở đây
    const splitOn = isGsm && hasPaySplit(w);
    const costQuoteRow = noQuote && !hasParts && !canParts && !feeNote ? '' : `<div class="wd-quote">
      ${noQuote || splitOn || (Number(w.quote_amount) === 0 && w.quote_amount !== null && !w.dms_ro_code)
        ? ''
        : qf('Lệnh sửa chữa', w.dms_ro_code ? `<span class="mono">${esc(w.dms_ro_code)}</span>` : qEmpty)}
      ${noQuote || splitOn ? '' : qf('Chi phí sửa chữa', w.quote_amount == null ? qEmpty : Number(w.quote_amount) === 0 ? 'Không phát sinh' : money(w.quote_amount))}
      ${noQuote && !quotePdfs.length ? '' : qf('Báo giá PDF', `${quoteFilesHtml || (canAttach ? '' : qEmpty)}${canAttach ? `<label class="wd-qf-add" title="Thêm báo giá PDF">${icon('plus')}${quotePdfs.length ? '' : ' Thêm PDF'}<input type="file" accept="application/pdf,.pdf" multiple data-change="att-upload" data-kind="quote"></label>` : ''}`, ' wd-qf-files')}
      ${hasParts || canParts ? qf('Xuất kho', `<div class="wd-parts-row">${hasParts ? badgeOf(S.meta.parts_statuses, w.parts_status) : '<span class="wd-empty">Chưa xuất kho</span>'}
        ${canParts ? `<button type="button" class="wd-qf-add" data-click="edit-parts" title="Cập nhật xuất kho">${icon('edit')} Cập nhật</button>` : ''}</div>
        ${w.missing_parts ? `<div class="small muted wd-parts-miss">Thiếu: ${esc(w.missing_parts)}</div>${can('inventory.view') ? `<div class="small inv-hint" data-inv-miss="${esc(w.missing_parts)}"></div>` : ''}` : ''}`, ' wd-qf-parts') : ''}
      ${feeNote ? qf('Phí / TTTH', esc(feeNote), ' wd-qf-wide') : ''}
    </div>`;

    const hasInspectContent = isGsm || w.diagnosis || (w.inspection_notes && Object.keys(w.inspection_notes).length);
    const showSheets = S.meta.settings.sheets_enabled && (can('wo.edit') || can('wo.inspect')) && hasInspectContent;
    const canDelete = can('admin.settings');
    const hasActions = !!(primaryT || canClaim || secondaryTrans.length);
    const stepActionsHtml = hasActions ? `<div class="wd-stepbar-actions">
      ${primaryT ? renderTransBtn(primaryT, 'wo-btn-primary') : ''}
      ${canClaim ? `<button type="button" class="btn btn-primary btn-sm wo-btn-primary" data-click="claim">${icon('user')} Nhận phiếu</button>` : ''}
      ${secondaryTrans.map((t) => renderTransBtn(t, 'wo-btn-more')).join('')}
    </div>` : '';
    const vehicleHtml = (() => {
      const n = w.inspection_notes || {};
      const ins = n.insurance || {};
      const empty = '<span class="wd-empty">—</span>';
      const vf = (k, v, cls = '') => `<div class="wd-vf${cls}"><div class="wd-vf-k">${esc(k)}</div><div class="wd-vf-v">${v || empty}</div></div>`;
      const copyV = (v) => (v ? `<button type="button" class="wd-copy-v mono" data-click="wd-copy" data-val="${esc(v)}" title="Chạm để sao chép">${esc(v)}</button>` : '');
      const pct = (v) => (v === null || v === undefined || v === '' ? '' : `${esc(v)}%`);
      const [s1, s2] = (n.accessories || {}).pins ? [] : InspectText.pinSerials(n.accessories, w);
      const hasBat2 = w.battery_level_2 !== null && w.battery_level_2 !== undefined && w.battery_level_2 !== '';
      const req = isGsm ? String(n.customer_request || '').trim() : '';
      const main = [
        vf('Biển số', w.plate ? `<span class="wd-plate-lg">${esc(w.plate)}</span>` : '<span class="wd-empty">Chưa có biển</span>', ' wd-vf-plate'),
        vf('Số khung', copyV(w.vin), ' wd-vf-vin'),
        vf('Loại xe', w.model ? esc(w.model) : ''),
        ...(['gsm', 'bship'].includes(w.fleet)
          ? [vf('Phân loại', badgeOf(S.meta.vehicle_ownership || {}, w.fleet === 'bship' ? 'rent' : (w.vehicle_ownership === 'rto' ? 'rto' : 'own')))] : []),
        vf('Màu xe', w.color ? esc(w.color) : ''),
        vf('Số Km', w.odometer != null ? `${numf(w.odometer)} km` : ''),
        hasBat2
          ? vf('% PIN 1 / 2', `${pct(w.battery_level) || '—'} / ${pct(w.battery_level_2) || '—'}`)
          : vf('% PIN', pct(w.battery_level)),
        (() => {
          const drv = isGsm || isWalkinWo(w);
          const own = w.customer_type !== 'fleet';
          const name = drv ? (n.driver_name || (own ? w.customer_name : '')) : w.customer_name;
          const phone = drv ? (n.driver_phone || (own ? w.customer_phone : '')) : w.customer_phone;
          const person = name || phone
            ? vf(isWalkinWo(w) ? `Tài xế ${w.fleet === 'bship' ? 'BShip' : 'GSM'} (tự mang xe tới)` : 'Khách hàng', `${name ? `<div class="wd-person-name">${esc(name)}</div>` : ''}${phone ? `<div class="wd-person-phone">${telCopy(phone)}<span class="tel-acts">${telBtn(phone, { e: 'work_order', id: w.id, name })}${smsBtn(phone)}</span></div>` : ''}`, ' wd-vf-person')
            : '';
          const reqHtml = req ? `<button type="button" class="wd-vf wd-vf-req" data-click="wd-vreq" title="${esc(req)}" aria-expanded="false"><span class="wd-vf-k">Yêu cầu khách hàng</span><span class="wd-vf-v">${esc(req)}</span></button>` : '';
          const nCalls = (d.calls || []).length;
          const histSum = [d.history.length ? `${d.history.length} lần vào xưởng` : '', nCalls ? `${nCalls}${nCalls >= 30 ? '+' : ''} cuộc gọi` : ''].filter(Boolean).join(' · ');
          const histHtml = histSum
            ? `<button type="button" class="wd-vf wd-vf-hist" data-click="wd-vhist"><span class="wd-vf-k">${icon('history')} Lịch sử</span><span class="wd-vf-v">${esc(histSum)}</span></button>`
            : vf('Lịch sử', '<span class="wd-empty">Chưa có</span>', ' wd-vf-hist');
          return `<div class="wd-vrow">${person}${reqHtml}${histHtml}</div>`;
        })(),
      ];
      const extra = [
        isGsm && n.driver_email ? vf('Email', esc(n.driver_email)) : '',
        !isGsm ? vf('Bảo hành xe', warrantyHtml(w.warranty_until)) : '',
        s1 ? vf(s2 ? 'Serial PIN 1' : 'Serial PIN', copyV(s1)) : '',
        s2 ? vf('Serial PIN 2', copyV(s2)) : '',
        ins.company ? vf('Công ty BH', esc(ins.company)) : '',
        ins.claim_no ? vf('Số hồ sơ BH', `<span class="mono">${esc(ins.claim_no)}</span>`) : '',
        ins.adjuster ? vf('Giám định viên', esc(ins.adjuster)) : '',
        !isGsm && !isWalkinWo(w) && can('customer.view') && w.customer_id ? vf('Hồ sơ khách', `<a href="#/customers/${w.customer_id}">Mở hồ sơ →</a>`) : '',
      ].filter(Boolean).join('');
      const hist = '';
      const hasMore = !!extra;
      return `<section class="card wd-vehicle" aria-label="${isGsm ? 'Thông tin xe' : 'Khách hàng và xe'}">
        <div class="wd-vhead">
          <span class="card-ico card-ico-veh" aria-hidden="true">${icon('scooter')}</span>
          <h3 class="wd-vtitle">Thông tin xe</h3>
          ${w.map_layout && typeof wsmWoLocation === 'function'
            ? `<a class="wd-vloc" href="#/workshop-map?q=${encodeURIComponent(w.plate || w.vin || w.code)}" title="${w.map_place ? `${esc(w.map_place.by)} gán vị trí` : 'Vị trí theo sơ đồ xưởng'} – bấm để xem trên sơ đồ 3D">${icon('map')}<span>${esc(wsmWoLocation(w))}</span></a>`
            : ''}
          ${hasMore ? `<button type="button" class="wd-vmore" data-click="wd-vmore" aria-expanded="false" aria-controls="wdVextra">Chi tiết <span class="wd-vmore-ic" aria-hidden="true">▾</span></button>` : ''}
        </div>
        <div class="wd-vstrip">
          <div class="wd-vitems">${main.join('')}</div>
        </div>
        ${hasMore ? `<div class="wd-vextra" id="wdVextra" hidden>${extra ? `<div class="wd-vextra-grid">${extra}</div>` : ''}${hist}</div>` : ''}
      </section>`;
    })();
    const stepbarHtml = stepHint || hasActions ? `<div class="wd-stepbar">
      <div class="wd-stepbar-hint">${fleetTxt(w, stepHint) || `<div class="muted">Thao tác tiếp theo</div>`}</div>
      ${stepActionsHtml}
    </div>` : '';

    ctx.setMain(`
      <div class="wd-toolbar">
        <a href="${ctx.inDrawer && typeof drawerBackHash === 'function' ? esc(drawerBackHash()) : listBase}" class="wo-back"${ctx.inDrawer ? ' data-click="drawer-close"' : ''} title="Quay lại" aria-label="Quay lại">${icon('arrowLeft')}</a>
        ${w.priority === 'urgent' ? '<span class="tag urgent">Gấp</span>' : ''}
        <div class="wd-tools">
          ${slaChip}
          <button type="button" class="btn btn-sm wd-tool" data-click="print" title="In phiếu" aria-label="In phiếu">${icon('printer')}<span class="wd-tool-label">In phiếu</span></button>
          ${showSheets ? `<button type="button" class="btn btn-sm wd-tool" data-click="send-sheet" title="Đẩy biên bản lên Google Sheets">${icon('upload')}<span class="wd-tool-label">Đẩy Sheets</span></button>` : ''}
          ${cancelT || canDelete ? `<details class="wd-more">
            <summary class="btn btn-sm btn-icon wd-tool" title="Thao tác khác" aria-label="Thao tác khác">⋯</summary>
            <div class="wd-menu" role="menu">
              ${cancelT ? `<button type="button" role="menuitem" class="wd-menu-item is-danger" data-click="transition" data-to="${cancelT.to}">${icon('x')} Hủy phiếu</button>` : ''}
              ${canDelete ? `<button type="button" role="menuitem" class="wd-menu-item is-danger" data-click="wo-delete" title="Xóa phiếu (quản trị)">${icon('trash')} Xóa phiếu</button>` : ''}
            </div>
          </details>` : ''}
        </div>
      </div>
      ${w.status !== 'cancelled' || stepbarHtml ? `<div class="card wd-progress">
        ${w.status !== 'cancelled' ? `<div class="stepper">${steps.map((s, i) => {
          const label = fleetTxt(w, typeof s[0] === 'function' ? s[0](i < cur ? 'done' : i === cur ? 'current' : 'before') : s[0]);
          return `
        <div class="step ${i < cur ? 'done' : i === cur ? 'current' : ''}"${i === cur ? ' aria-current="step"' : ''}><div class="dot">${i < cur ? icon('check') : i + 1}</div>
        <div class="step-label" title="${esc(label)}">${esc(label)}</div><div class="t">${s[1] ? fmtDT(s[1]) : '&nbsp;'}</div>${stepActor(s, i)}</div>`;
        }).join('')}</div>` : ''}
        ${stepbarHtml}
      </div>` : ''}
      ${alerts.length ? `<div class="stack wd-alerts">${fleetTxt(w, alerts.join(''))}</div>` : ''}
      ${vehicleHtml}
      <div class="grid g-main wd-main">
        <div class="stack wd-col">
          <div class="card card-inspect wd-o-inspect"><div class="card-head">
            <h3><span class="card-ico card-ico-inspect">${icon('clipboard')}</span> ${noQuote ? 'Kiểm tra' : 'Kiểm tra &amp; Báo giá'}</h3>
            <div class="card-head-actions">
              ${canDms && !noQuote && !(isGsm && hasPaySplit(w)) ? `<button type="button" class="btn btn-sm btn-ghost" data-click="edit-dms" title="Cập nhật lệnh sửa chữa và chi phí">${icon('edit')} Lệnh &amp; chi phí</button>` : ''}
              ${canInspectEdit ? `<button class="btn btn-sm btn-ghost" data-click="inspect-edit" title="Sửa kết quả kiểm tra">${icon('edit')} Sửa</button>` : ''}
            </div>
          </div>
            <div class="card-body stack wd-inspect-body">
              ${costQuoteRow}
              ${isGsm && !noQuote ? payCardHtml(w, g.has('edit') && !closed, payEdit) : ''}
              <div class="wd-dp" data-dp-wo="${w.id}" hidden></div>
              <div class="wd-sec wd-sec-box">
                <div class="wd-sec-title wd-sec-head"><span class="wd-sec-ico">${icon('key')}</span>Phụ kiện</div>
                ${(() => {
                  const a = (w.inspection_notes || {}).accessories;
                  const item = (ok, text, cls = '') => `<div class="acc-grid-item ${ok ? 'is-yes' : 'is-no'}${cls}">${ok ? `<span class="success-text">${icon('check')}</span>` : `<span class="muted">${icon('x')}</span>`}<span>${esc(text)}</span></div>`;
                  const op = (w.inspection_notes || {}).old_parts_return;
                  const who = isGsm ? 'Tài xế' : 'Khách';
                  const oldItem = typeof op === 'boolean' ? item(op, op ? `${who} lấy lại phụ tùng cũ` : `${who} không lấy phụ tùng cũ`, ' is-old') : '';
                  if (!a) {
                    const rows = S.meta.reception_checks.filter((c) => !c.group || c.group === 'accessory').map((c) => item(!!w.reception_check[c.key], c.label));
                    return `<div class="acc-grid">${rows.join('') + oldItem || '<span class="muted small">Chưa ghi nhận</span>'}</div>`;
                  }
                  // Phiếu nhập từ AppSheet có thể chỉ ghi nhận vài mục → mục chưa ghi nhận thì không hiện
                  const known = (k) => a[k] !== undefined && a[k] !== null;
                  const codeRow = (k, v) => (v ? `<div class="nq-row"><dt>${k}</dt><dd><button type="button" class="wd-copy-v mono" data-click="wd-copy" data-val="${esc(v)}" title="Chạm để sao chép">${esc(v)}</button></dd></div>` : '');
                  const [p1, p2] = a.pins ? InspectText.pinSerials(a, w) : [];
                  const codes = [
                    a.charger ? codeRow('QR sạc ngoài', String(a.charger_serial || '').trim()) : '',
                    a.charger ? codeRow('QR sạc trong', String(a.charger_serial_inner || '').trim()) : '',
                    codeRow(p2 ? 'Serial PIN 1' : 'Serial PIN', p1),
                    codeRow('Serial PIN 2', p2),
                  ].join('');
                  return `<div class="acc-grid">${[
                    known('charger') ? item(a.charger, a.charger ? 'Có sạc' : 'Không sạc') : '',
                    known('pins') ? item(a.pins > 0, a.pins ? `${a.pins} PIN trên xe` : 'Không PIN trên xe') : '',
                    known('mirrors') ? item(a.mirrors > 0, a.mirrors ? `${a.mirrors} gương` : 'Không gương') : '',
                    known('key') ? item(a.key, a.key ? 'Có chìa khóa' : 'Không chìa khóa') : '',
                    known('remote') ? item(a.remote, a.remote ? 'Có remote' : 'Không remote') : '',
                    known('spare_seat') ? item(a.spare_seat, a.spare_seat ? 'Có yên phụ' : 'Không yên phụ') : '',
                    oldItem,
                  ].join('')}</div>${codes ? `<dl class="nq-list wd-codes">${codes}</dl>` : ''}`;
                })()}
                ${w.belongings ? `<div class="wd-line"><span class="wd-line-k">Ghi chú phụ kiện</span><span>${esc(w.belongings)}</span></div>` : ''}
              </div>
              <div class="wd-sec wd-sec-box">
                <div class="wd-sec-title wd-sec-head"><span class="wd-sec-ico">${icon('search')}</span>Nội dung kiểm tra</div>
                ${inspectDetailHtml(w)}
              </div>
              ${photoBlock(['photo_in', 'photo_dash', 'photo_plate', 'photo_vin', 'photo_motor'], 'Hình ảnh lúc nhận xe', 'photo_in')}
              ${photoBlock('photo_repair', 'Ảnh phát sinh lỗi')}
              <div id="att-progress"></div>
          </div></div>

          <div class="card wd-o-bh"><div class="card-head"><h3><span class="card-ico card-ico-bh">${icon('shieldCheck')}</span> Bảo hành</h3>
            ${g.has('warranty') ? `<button class="btn btn-sm" data-click="add-warranty">${icon('plus')} Thêm</button>` : ''}</div>
            <div class="card-body stack" style="gap:14px">
              <div class="wd-sec wd-sec-box wd-sec-faults">
                <div class="wd-sec-title wd-sec-head"><span class="wd-sec-ico">${icon('alert')}</span>Hạng mục lỗi</div>
                ${w.faults.length ? faultTags(w.faults) : '<span class="wd-empty">Chưa chọn</span>'}
              </div>
              ${isFleetWo(w) ? (() => {
                const manual = !!(w.vinfast_category && String(w.vinfast_category).trim());
                const cat = w.vf_category || w.vinfast_category_auto || '';
                const canVf = g.has('edit');
                return `<div class="wd-sec wd-sec-box">
                  <div class="wd-sec-title wd-sec-head"><span class="wd-sec-ico">${icon('sheet')}</span>Hạng mục sửa chữa
                    ${canVf ? `<button type="button" class="btn btn-sm" data-click="edit-vf-cat" title="Chọn hạng mục báo cáo VinFast">${icon('edit')} Chọn</button>` : ''}
                  </div>
                  ${cat ? `<div class="wd-line"><span>${esc(cat)}</span>
                    <span class="badge plain ${manual ? 'b-blue' : 'b-slate'}" style="margin-left:8px">${manual ? 'Chọn tay' : 'Tự động'}</span></div>`
                    : '<span class="wd-empty">Chưa có</span>'}
                </div>`;
              })() : ''}
              ${(() => {
                const kinds = warrantyKindsOf(w);
                const extra = warrantyExtraOf(w);
                const labels = S.meta.warranty_kinds || {};
                const canEdit = g.has('warranty');
                const kindIco = { pin: 'battery', motor: 'bolt', wiring: 'swap' };
                const head = (title, kind) => `<div class="bh-section-head">
                  <div class="bh-section-title"><span class="bh-ico">${icon(kindIco[kind] || 'wrench')}</span>${esc(title)}</div>
                  ${canEdit ? `<button type="button" class="btn btn-sm" data-click="edit-bh-kind" data-kind="${esc(kind)}">${icon('edit')} Cập nhật</button>` : ''}
                </div>`;
                // Lưới 3 cột cố định: Trạng thái | Ngày phát sinh | Ngày xử lý cùng hàng
                const claimSt = (s) => {
                  if (!s) return '';
                  const u = String(s).toUpperCase().replace(/\s+/g, '_');
                  let tone = 'wait';
                  let lab = (typeof dpVi === 'function') ? dpVi(s) : String(s);
                  if (/REJECT|DECLIN|CANCEL/.test(u)) { tone = 'bad'; lab = 'Từ chối'; }
                  else if (/APPROVED|PAID|CLOSED|COMPLETED|CONFIRMED|DONE/.test(u)) { tone = 'ok'; lab = 'Đã phê duyệt'; }
                  else if (/LEVEL_?2|L2|CAP_?2|CẤP_?2|CAP2|TIER_?2/.test(u)) { tone = 'l2'; lab = 'Chờ cấp 2'; }
                  else if (/LEVEL_?1|L1|CAP_?1|CẤP_?1|CAP1|TIER_?1/.test(u)) { tone = 'l1'; lab = 'Chờ cấp 1'; }
                  else if (/SUBMIT|PEND|WAIT|REVIEW|DRAFT|QUOT/.test(u)) { tone = 'wait'; lab = 'Chờ duyệt'; }
                  return `<span class="bh-claim-st bh-claim-st-${tone}" title="${esc(s)}">${esc(lab)}</span>`;
                };
                const dmsFields = (kind) => {
                  const row = extra[kind] || {};
                  const onlyOne = kinds.length === 1;
                  const wCode = row.warranty_code || (onlyOne ? w.dms_warranty_code : '');
                  const cCode = row.claim_code || (onlyOne ? w.dms_claim_code : '');
                  const st = claimSt(row.claim_status);
                  // Trạng thái nằm cùng dòng nhãn "ĐXBH · …", mã WC ở dòng giá trị
                  const dxbhLabel = st
                    ? `<span class="bh-dxbh-lab">ĐXBH<span class="bh-dxbh-dot">·</span>${st}</span>`
                    : 'ĐXBH';
                  const dxbhField = `<div><div class="k">${dxbhLabel}</div><div class="v">${cCode ? `<span class="mono">${esc(cCode)}</span>` : '<span class="muted">—</span>'}</div></div>`;
                  return `${info('Lệnh BH', wCode ? `<span class="mono">${esc(wCode)}</span>` : '')}
                    ${dxbhField}
                    ${info('Số tiền', row.claim_amount != null && row.claim_amount !== '' ? `<span style="color:#15803d;font-weight:700">${money(row.claim_amount)}</span>` : '')}
                    ${info('Ngày đề xuất', row.claim_submitted_at ? fmtDT(row.claim_submitted_at) : '')}
                    ${info('Ngày duyệt', row.claim_approved_at ? fmtDT(row.claim_approved_at) : '')}`;
                };
                if (!kinds.length) return '';
                const pinBlock = kinds.includes('pin') ? `<div class="bh-section bh-k-pin">
                  ${head('PIN', 'pin')}
                  <div class="info-grid bh-grid">
                    ${info('Trạng thái', warrantyBadge(bhKindStatus(w, 'pin', extra)))}
                    ${info('Ngày phát sinh', (extra.pin || {}).fault_at ? fmtD(extra.pin.fault_at) : '')}
                    ${info('Ngày tháo PIN', w.parts_removed_at ? fmtD(w.parts_removed_at) : '')}
                    ${info('Serial PIN', w.battery_serial_old ? `<span class="mono">${esc(w.battery_serial_old)}</span>` : '')}
                    ${info('Serial PIN mới', w.battery_serial_new ? `<span class="mono">${esc(w.battery_serial_new)}</span>` : '')}
                    ${info('Loại SC PIN', esc(lab(S.meta.battery_repair_types, w.battery_repair_type)))}
                    ${info('Ngày gửi NM', w.sent_factory_at ? fmtD(w.sent_factory_at) : '')}
                    ${info('Diễn giải', (extra.pin || {}).dien_giai ? esc(extra.pin.dien_giai) : '')}
                    ${dmsFields('pin')}
                  </div>
                </div>` : '';
                const motorBlock = kinds.includes('motor') ? `<div class="bh-section bh-k-motor">
                  ${head('Động cơ', 'motor')}
                  <div class="info-grid bh-grid">
                    ${info('Trạng thái', warrantyBadge(bhKindStatus(w, 'motor', extra)))}
                    ${info('Ngày phát sinh', (extra.motor || {}).fault_at ? fmtD(extra.motor.fault_at) : '')}
                    ${info('Ngày tháo ĐC', w.motor_removed_at ? fmtD(w.motor_removed_at) : '')}
                    ${info('Số máy', w.motor_serial_old ? `<span class="mono">${esc(w.motor_serial_old)}</span>` : '')}
                    ${info('Số máy mới', w.motor_serial_new ? `<span class="mono">${esc(w.motor_serial_new)}</span>` : '')}
                    ${info('Loại SC ĐC', esc(lab(S.meta.motor_repair_types, w.motor_repair_type)))}
                    ${info('COC', esc(lab(S.meta.coc_statuses, w.coc_status)))}
                    ${info('Diễn giải', (extra.motor || {}).dien_giai ? esc(extra.motor.dien_giai) : '')}
                    ${dmsFields('motor')}
                  </div>
                </div>` : '';
                const extraBlocks = kinds.filter((k) => k !== 'pin' && k !== 'motor').map((k) => {
                  const row = extra[k] || {};
                  const oldSerial = row.serial_old || row.serial || '';
                  const showSerial = k !== 'wiring';
                  return `<div class="bh-section bh-k-other">
                    ${head(labels[k] || k, k)}
                    <div class="info-grid bh-grid">
                      ${info('Trạng thái', warrantyBadge(bhKindStatus(w, k, extra)))}
                      ${info('Ngày phát sinh', row.fault_at ? fmtD(row.fault_at) : '')}
                      ${info('Ngày xử lý', row.removed_at ? fmtD(row.removed_at) : '')}
                      ${showSerial ? info('Serial cũ', oldSerial ? `<span class="mono">${esc(oldSerial)}</span>` : '') : ''}
                      ${showSerial ? info('Serial mới', row.serial_new ? `<span class="mono">${esc(row.serial_new)}</span>` : '') : ''}
                      ${info('Diễn giải', row.dien_giai ? esc(row.dien_giai) : '')}
                      ${info('Ghi chú', row.note ? esc(row.note) : '')}
                      ${dmsFields(k)}
                    </div>
                  </div>`;
                }).join('');
                return `${pinBlock}${motorBlock}${extraBlocks}`;
              })()}
            </div></div>

          <div class="card wd-o-log"><div class="card-head"><h3><span class="card-ico card-ico-log">${icon('history')}</span> Nhật ký xử lý</h3></div>
            <form data-submit="add-note" class="card-body row" style="align-items:flex-start;border-bottom:1px solid var(--border)">
              <input class="input" name="note" placeholder="Thêm ghi chú nội bộ (trao đổi với GSM/khách, phụ tùng…)" style="flex:1;min-width:200px" required>
              <button class="btn" type="submit">Gửi</button></form>
            <ul class="timeline">${d.logs.map((l) => `<li class="${l.action === 'status' ? 'status' : l.action === 'note' ? 'note' : ''}">
              <div class="when">${fmtDT(l.created_at)} · <b>${esc(l.user_name || 'Hệ thống')}</b></div>
              <div class="what">${l.action === 'status' ? `${statusBadge(l.from_status, w.source)} → ${statusBadge(l.to_status, w.source)}`
                : `<span class="strong">${esc(LOG_ACTIONS[l.action] || l.action)}</span>${l.action !== 'note' && l.note ? `: ${esc(l.note)}` : ''}`}</div>
              ${(l.action === 'status' || l.action === 'note') && l.note ? `<div class="note-text">${esc(l.note)}</div>` : ''}</li>`).join('')}</ul>
          </div>
        </div>

        <div class="stack wd-col">
          <div class="card card-assign wd-o-assign"><div class="card-head"><h3><span class="card-ico card-ico-assign">${icon('users')}</span> Phân công &amp; Ghi chú</h3></div>
            <div class="card-body stack assign-body">
              <div class="assign-people">
                <div class="assign-person ap-cvdv">
                  <span class="ap-ico">${icon('user')}</span>
                  <div class="ap-main"><div class="assign-role">Cố vấn dịch vụ</div>
                  <div class="assign-name">${w.advisor_name ? `<span>${esc(w.advisor_name)}</span>` : '<span class="muted">Chưa có</span>'}</div></div>
                </div>
                <div class="assign-person ap-insp">
                  <span class="ap-ico">${icon('search')}</span>
                  <div class="ap-main"><div class="assign-role">Kỹ thuật viên QC</div>
                  <div class="assign-name">${w.inspector_name ? `<span>${esc(w.inspector_name)}</span>` : '<span class="muted">Chưa có</span>'}</div></div>
                </div>
                <div class="assign-person assign-person-tech ap-tech">
                  <span class="ap-ico">${icon('wrench')}</span>
                  <div class="ap-main"><div class="assign-role">Kỹ thuật viên sửa chữa</div>
                  <div class="assign-name">${can('wo.assign') && !closed && !['done', 'awaiting_handover', 'gsm_received'].includes(w.status)
                    ? select('', techs.map((t) => [t.id, t.full_name]), w.technician_id, 'data-change="assign"', 'Chọn KTV…')
                    : (w.technician_name ? `<span>${esc(w.technician_name)}</span>` : '<span class="muted">Chưa có</span>')}</div></div>
                </div>
                <div class="assign-person assign-person-qc ap-qc">
                  <span class="ap-ico">${icon('check')}</span>
                  <div class="ap-main"><div class="assign-role">Kiểm tra cuối</div>
                  <div class="assign-name">${w.qc_name ? `<span>${esc(w.qc_name)}</span>` : '<span class="muted">Chưa có</span>'}${w.qc_fail_count ? ` <span class="badge b-red plain">Trượt ${w.qc_fail_count}</span>` : ''}</div></div>
                </div>
              </div>
              <div class="note-block note-ktv">
                <div class="note-head">
                  <span class="note-title"><span class="note-ico">${icon('wrench')}</span>Ghi chú của Kỹ thuật viên</span>
                  ${(g.has('work') || can('wo.edit') || ((can('wo.work') || can('wo.inspect')) && (can('wo.assign') || w.technician_id === S.me.id || w.inspector_id === S.me.id))) ? `<button class="btn btn-ghost btn-icon btn-sm" data-click="edit-note-ktv" title="Sửa">${icon('edit')}</button>` : ''}
                </div>
                <div class="note-body pre">${w.foreman_note ? esc(w.foreman_note) : '<span class="note-empty">Chưa có ghi chú</span>'}</div>
              </div>
              <div class="note-block note-cvdv">
                <div class="note-head">
                  <span class="note-title"><span class="note-ico">${icon('clipboard')}</span>Ghi chú của Cố vấn dịch vụ</span>
                  ${(g.has('edit') || can('wo.edit')) ? `<button class="btn btn-ghost btn-icon btn-sm" data-click="edit-note-cvdv" title="Sửa">${icon('edit')}</button>` : ''}
                </div>
                <div class="note-body pre">${w.advisor_note ? esc(w.advisor_note) : '<span class="note-empty">Chưa có ghi chú</span>'}</div>
              </div>
            </div></div>

          <div class="card card-sla wd-o-sla"><div class="card-head"><h3><span class="card-ico card-ico-sla">${icon('clock')}</span> SLA &amp; Tiến độ</h3></div><div class="card-body">${(() => {
            const doneAt = w.completed_at || ([...d.logs].reverse().find((l) => l.action === 'status' && l.to_status === 'done') || {}).created_at;
            const steps = [
              ['Nhận xe', 'scooter', w.received_at ? `${fmtDT(w.received_at)}${closed ? '' : ` <span class="muted">· ${w.days_in_shop} ngày</span>`}` : ''],
              isGsm ? [fleetTxt(w, 'GSM bàn giao'), 'swap', w.gsm_handover_at ? fmtD(w.gsm_handover_at) : ''] : null,
              ['Bắt đầu sửa', 'wrench', w.started_at ? fmtDT(w.started_at) : ''],
              w.repair_done_at ? ['Sửa chữa xong', 'check', `${fmtDT(w.repair_done_at)}${w.repair_done_name ? ` <span class="muted">· ${esc(w.repair_done_name)}</span>` : ''}`] : null,
              ['Hoàn thành', 'star', doneAt ? fmtDT(doneAt) : ''],
              ['Giao xe', 'key', w.delivered_at ? fmtDT(w.delivered_at) : ''],
            ].filter(Boolean);
            const tone = { overdue: 'bad', warning: 'warn', ok: 'ok' }[w.sla.code] || 'idle';
            return `<div class="sla-sum">
                <div class="sla-tile"><span class="sla-tile-ico">${icon('bell')}</span><div><div class="sla-k">Tình trạng</div>${slaBadge(w.sla)}</div></div>
                <div class="sla-tile sla-due-${tone}"><span class="sla-tile-ico">${icon('calendar')}</span><div><div class="sla-k">Hạn SLA</div><div class="sla-v">${w.sla_due_at ? fmtD(w.sla_due_at) : '<span class="muted">Chưa tính</span>'}</div></div></div>
                ${isGsm ? '' : `<div class="sla-tile"><span class="sla-tile-ico">${icon('clock')}</span><div><div class="sla-k">Hẹn trả xe</div><div class="sla-v">${w.promised_at ? fmtDT(w.promised_at) : '<span class="muted">Chưa hẹn</span>'}</div></div></div>`}
              </div>
              <ol class="sla-tl">${steps.map(([k, ic, v]) => `<li class="${v ? 'is-done' : ''}"><span class="sla-dot">${icon(ic)}</span><div class="sla-tl-k">${k}</div><div class="sla-tl-v">${v || '<span class="muted">Chưa có</span>'}</div></li>`).join('')}</ol>`;
          })()}</div></div>

          <div class="card wd-o-chat"><div class="card-head"><h3><span class="card-ico card-ico-chat">${icon('message')}</span> Trao đổi nội bộ</h3></div>
            <div class="card-body" id="wd-chat"></div></div>

          
        </div>
      </div>`);
    if (typeof mountChat === 'function') mountChat(document.getElementById('wd-chat'), `wo:${w.id}`, { compact: true });
    if (w.missing_parts && typeof fillInventoryHints === 'function') fillInventoryHints(document.getElementById(ctx.inDrawer ? 'drawerBody' : 'main'));
    fillDealerPortal(document.querySelector(`[data-dp-wo="${w.id}"]`)).then((dp) => {
      if (dp && g.has('warranty')) syncBhFromDealerClaims(w, dp, { applyWoPatch, render, expected: w.updated_at });
    });
    const curStep = document.querySelector('#drawerBody .wd-progress .step.current, #main .wd-progress .step.current');
    if (curStep) {
      const bar = curStep.parentElement;
      bar.scrollLeft = Math.max(0, curStep.offsetLeft - (bar.clientWidth - curStep.offsetWidth) / 2);
    }
    if (ctx.inDrawer && !ctx.stale()) {
      const st = document.getElementById('drawerStatus');
      const sub = document.getElementById('drawerSub');
      if (st) { st.innerHTML = statusBadge(w.status, w.source); st.classList.remove('hidden'); }
      if (sub) {
        sub.innerHTML = `<span class="wd-code mono">${esc(w.code)}</span>`;
        sub.classList.remove('hidden');
      }
    }
  };

  // ----- Chuyển trạng thái -----
  const doTransition = async (to, extra = {}) => {
    const r = await api('POST', `/api/work-orders/${id}/status`, { to, ...extra });
    closeModal();
    // Merge lệnh SC + CPSC / trạng thái ngay sau khi DB OK — trước GET (PDF nền không được xóa)
    applyWoPatch({
      status: to,
      ...(extra.fields || {}),
      ...(r && r.work_order ? r.work_order : {}),
    });
    if (d && d.work_order) render();
    toast(`Đã chuyển sang "${S.meta.wo_statuses[to].label}"`, 'success');
    if (r && r.warning) toast(r.warning, 'error');
    else if (r && r.sheet) toastSheetPush(r.sheet, { silentUnchanged: true });
    await load({ keepFields: true });
  };

  on('click', 'transition', async (el) => {
    const w = d.work_order;
    const t = allowedTransitions(w).find((x) => x.to === el.dataset.to);
    if (!t) return;
    if (t.to === 'done') {
      const pendingBh = unfinishedWarrantyLabels(w);
      if (pendingBh.length) {
        toast(`Chưa thể hoàn thành: bảo hành ${pendingBh.join(', ')} chưa ở trạng thái Đã hoàn thành`, 'error');
        return;
      }
    }
    if (!t.note && !(t.fields || []).length) {
      const startRepair = t.to === 'in_progress' && t.needTech;
      const msg = startRepair
        ? `Xác nhận đã bàn giao xe ${w.plate || '—'} và phụ tùng cho KTV: ${w.technician_name || '—'} sửa chữa theo Lệnh sửa chữa: ${w.dms_ro_code || '—'}`
        : `Xác nhận: ${t.label}?`;
      if (await confirmBox(msg, { okLabel: startRepair ? 'Xác nhận' : t.label })) await doTransition(t.to);
      return;
    }
    const hints = {
      delivered: isFleetWo(w) ? 'Xác nhận xe đã rời xưởng (tài xế đã lấy xe) — kết thúc quy trình.' : 'Xác nhận đã bàn giao xe. Hệ thống sẽ tự tạo lịch CSKH hỏi thăm và nhắc bảo dưỡng.',
      cancelled: 'Phiếu hủy sẽ không thể mở lại.',
      in_progress: t.needTech ? `Bàn giao xe ${w.plate || '—'} và phụ tùng cho KTV: ${w.technician_name || '—'} sửa chữa theo Lệnh sửa chữa: ${w.dms_ro_code || '—'}` : '',
      extra_cost: 'Ghi rõ phát sinh và chi phí để gửi GSM / khách duyệt.',
      awaiting_open: 'Kết quả kiểm tra sẽ chuyển cho CVDV mở lệnh.',
      waiting_order: 'Kết quả kiểm tra sẽ chuyển cho CVDV báo giá.',
      waiting_approval: isFleetWo(w)
        ? (w.status === 'gsm_rejected' ? 'Đã chỉnh theo ghi chú GSM. Gửi lại để GSM xác nhận.' : (w.status === 'waiting_order' ? 'Nhập lệnh SC và CPSC đã báo giá trên DMS VinFast.' : 'Nhập ngày GSM bàn giao xe vào xưởng (tính SLA).'))
        : 'Nhập chi phí báo giá và gửi khách xác nhận.',
      waiting_repair: isFleetWo(w) && w.status === 'waiting_approval' ? 'Nhập ngày GSM bàn giao xe vào xưởng để tính SLA.' : '',
      gsm_rejected: 'Bắt buộc ghi rõ lý do từ chối để CVDV chỉnh lệnh / CPSC.',
      awaiting_handover: 'Xác nhận xưởng đã sẵn sàng bàn giao xe cho GSM / tài xế.',
      gsm_received: 'GSM nghiệm thu: xe đã sửa đạt chuẩn. Xe vẫn ở xưởng đến khi tài xế lấy.',
      inspecting: 'Phiếu quay lại bước kiểm tra xe.',
      done: isFleetWo(w) && w.status === 'awaiting_handover' ? 'Thu hồi bước bàn giao — phiếu về hoàn thành.' : 'Xác nhận xe đã sửa xong, sẵn sàng bàn giao.',
    };
    const isGsmW = isFleetWo(w);
    const reqd = (k) => (t.require || []).includes(k);
    const noCost = w.quote_amount !== null && w.quote_amount !== undefined && Number(w.quote_amount) === 0;
    // Đang chia khách hàng / công ty: lệnh SC + CPSC lấy từ phần chia trên phiếu, không hỏi lại
    const splitW = isGsmW && hasPaySplit(w);
    const fieldHtml = (t.fields || []).map((k) => {
      if (splitW && (k === 'dms_ro_code' || k === 'quote_amount')) {
        return `<input type="hidden" name="f_${k}" value="${esc(String(w[k] ?? ''))}">${k === 'quote_amount' ? `<div class="pay-summary span-2">
          <div class="pay-summary-t">Khách hàng và Công ty cùng thanh toán</div>
          <div>Khách hàng: <span class="mono">${esc(w.cust_pay_ro || 'chưa có lệnh SC')}</span> · <b>${money(Number(w.cust_pay_amount) || 0)}</b></div>
          <div>Công ty: <span class="mono">${esc(w.dms_ro_code || 'chưa có lệnh SC')}</span> · <b>${money(Number(w.gsm_pay_amount) || 0)}</b></div>
          <div>Tổng chi phí sửa chữa: <b>${money(Number(w.quote_amount) || 0)}</b></div>
          <div class="small muted">Sửa ở phần chia thanh toán trên phiếu</div></div>` : ''}`;
      }
      if (k === 'dms_ro_code') return `<div data-cost-ro${noCost ? ' class="hidden"' : ''}>${field(isGsmW ? 'Lệnh sửa chữa' : 'Lệnh hãng (lệnh SC trên DMS)', input('f_dms_ro_code', noCost ? '' : w.dms_ro_code, `${reqd(k) && !noCost ? 'required ' : reqd(k) ? 'data-req="1" ' : ''}placeholder="N545-WO-…" data-vi-required="Vui lòng nhập lệnh sửa chữa"`, 'mono'), { req: reqd(k) })}</div>`;      if (k === 'quote_amount') return field(isGsmW ? 'Chi phí sửa chữa' : 'Chi phí báo giá (VNĐ)', costInput('f_quote_amount', w.quote_amount, `${reqd(k) ? 'required' : ''} data-vi-required="Vui lòng nhập chi phí hoặc tick Không phát sinh chi phí" data-vi-number="Vui lòng nhập số tiền hợp lệ"`), { req: reqd(k), hint: isGsmW || reqd(k) ? '' : 'Có thể bổ sung sau' });
      if (k === 'parts_status') {
        const opts = Object.entries(S.meta.parts_statuses || {}).filter(([v]) => v !== 'pending').map(([v, o]) => [v, o.label || o]);
        return field('Trạng thái xuất kho', select('f_parts_status', opts, w.parts_status && w.parts_status !== 'pending' ? w.parts_status : 'issued', 'required data-change="tp-st" data-vi-required="Vui lòng chọn trạng thái xuất kho"'), { req: true });
      }
      if (k === 'missing_parts') {
        const on = w.parts_status === 'partial';
        return `<div id="tp-missing" class="${on ? '' : 'hidden'}">${field('Mã phụ tùng thiếu', input('f_missing_parts', w.missing_parts || '', `placeholder="VD: mã phụ tùng còn thiếu"${on ? ' required' : ''}`), { req: true })}</div>`;
      }
      if (k === 'gsm_handover_at') return field(fleetTxt(w, 'Ngày GSM bàn giao SC'), input('f_gsm_handover_at', w.gsm_handover_at || (w.status === 'waiting_approval' ? today() : ''), `type="date" ${reqd(k) ? 'required' : ''}`), { req: reqd(k) });
      return '';
    }).join('');
    const openHtml = !t.openOrder ? '' : `<div class="small"><div class="label">Kiểm tra ngoại quan → CVDV báo giá trên DMS VinFast</div>
      ${inspectText(w) ? `<div class="pre" style="margin-top:6px">${esc(inspectText(w))}</div>` : '<div class="muted">Chưa có nội dung kiểm tra</div>'}</div>`;
    const hasQuoteFile = d.attachments.some((a) => a.kind === 'quote');
    const uploadHtml = t.quoteUpload && (can('wo.attach') || can('wo.edit'))
      ? field('File báo giá (PDF)', `<div class="upload-bar" style="margin:0"><label class="btn">${icon('file')} Chọn file PDF<input type="file" accept="application/pdf,.pdf" name="f_quote_file" data-change="quote-file-pick"></label><span class="small muted" data-role="quote-file-name">${hasQuoteFile ? 'Đã có file trên phiếu' : 'Chưa chọn file'}</span></div>`) : '';
    const inspectHtml = !t.requireInspection ? '' : (inspectText(w)
      ? `<div class="small"><div class="label">Nội dung kiểm tra</div><div class="pre" style="margin-top:6px">${esc(inspectText(w))}</div></div>`
      : `<div class="alert alert-warn">${icon('alert')}<div>Chưa có nội dung kiểm tra ngoại quan. Cập nhật trước khi chuyển CVDV.</div></div>`);
    const saveCloseDms = isGsmW && t.to === 'waiting_approval' && (t.fields || []).includes('dms_ro_code');
    const saveGsmConfirm = isGsmW && t.to === 'waiting_repair' && (t.fields || []).includes('gsm_handover_at');
    const submitLabel = saveCloseDms ? fleetTxt(w, 'Lưu và gửi GSM') : saveGsmConfirm ? 'Xác nhận' : t.label;
    const noteLabel = t.to === 'gsm_rejected' ? 'Lý do từ chối (bắt buộc)' : (t.noteRequired ? 'Lý do / ghi chú' : 'Ghi chú');
    openModal({
      title: t.label,
      body: `<form data-submit="trans-note"><div class="modal-body">
        ${hints[t.to] ? `<div class="alert ${t.danger ? 'alert-danger' : 'alert-info'}">${icon('alert')}<div>${esc(fleetTxt(w, hints[t.to]))}</div></div>` : ''}
        ${inspectHtml}
        ${openHtml}
        ${fieldHtml ? `<div class="form-grid">${fieldHtml}</div>` : ''}
        ${uploadHtml}
        ${field(noteLabel, textarea('note', '', `rows="3" ${t.noteRequired ? 'required' : ''} ${t.to === 'gsm_rejected' ? 'placeholder="VD: Sai mã lệnh, thiếu CPSC, sai hạng mục…"' : ''}`), { req: t.noteRequired })}
      </div>${modalFoot(submitLabel, { danger: t.danger })}</form>`,
      handlers: {
        change: {
          'tp-st': (el) => {
            const box = document.getElementById('tp-missing');
            if (!box) return;
            box.classList.toggle('hidden', el.value !== 'partial');
            const inp = box.querySelector('[name="f_missing_parts"]');
            if (inp) inp.required = el.value === 'partial';
          },
          'quote-file-pick': (el) => {
            const nameEl = el.closest('.field')?.querySelector('[data-role="quote-file-name"]');
            if (!nameEl) return;
            const f = el.files && el.files[0];
            nameEl.textContent = f ? f.name : (hasQuoteFile ? 'Đã có file trên phiếu' : 'Chưa chọn file');
          },
        },
        submit: {
          'trans-note': async (form, data) => {
            const fields = Object.fromEntries((t.fields || []).map((k) => [k, data[`f_${k}`]]));
            // iOS: đọc PDF vào RAM TRƯỚC closeModal — File từ <input> chết khi input bị gỡ
            const fileEl = form.querySelector('[name="f_quote_file"]');
            const rawFile = fileEl && fileEl.files && fileEl.files[0] ? fileEl.files[0] : null;
            let quoteFile = null;
            if (rawFile) {
              try {
                quoteFile = await snapshotFile(rawFile);
              } catch (e) {
                toast(e.message || 'Không đọc được file PDF trên thiết bị', 'error');
                return;
              }
            }
            // Lưu mã lệnh + CPSC / chuyển trạng thái trước — PDF Drive chậm, chạy nền
            await doTransition(t.to, { note: data.note, fields });
            if (quoteFile) {
              toast('Đang tải file báo giá…', 'info');
              uploadAttachment(id, 'quote', quoteFile)
                .then((saved) => {
                  toast(saved && saved.pending === 'drive_sheet' ? 'Đã tải file báo giá – Drive và Google Sheets tự cập nhật trong ít phút' : 'Đã tải file báo giá', 'success');
                  // Chỉ gắn PDF vào state — không GET lại cả phiếu (tránh ghi đè lệnh/CPSC)
                  if (ctx.stale() || !d) return;
                  if (saved && saved.id) {
                    const rest = (d.attachments || []).filter((a) => a.id !== saved.id);
                    d.attachments = [...rest, saved];
                    render();
                    return;
                  }
                  return load();
                })
                .catch((e) => toast(e.message || 'Tải file báo giá thất bại', 'error'));
            }
          },
        },
      },
    });
    if (typeof watchInventoryHint === 'function') watchInventoryHint(document.querySelector('#tp-missing [name="f_missing_parts"]'));
  });

  // ----- Cập nhật thông tin -----
  on('submit', 'add-note', async (form, data) => {
    await api('POST', `/api/work-orders/${id}/notes`, { note: data.note });
    await load();
  });
  on('change', 'assign', async (el) => {
    await api('POST', `/api/work-orders/${id}/assign`, { technician_id: el.value || null });
    toast('Đã cập nhật phân công', 'success');
    await load();
  });
  on('click', 'edit-note-ktv', () => {
    openModal({
      title: 'Ghi chú của Kỹ thuật viên',
      size: 'sm',
      body: `<form data-submit="n-ktv"><div class="modal-body">${textarea('foreman_note', d.work_order.foreman_note || '', 'rows="4" placeholder="Ghi chú của kỹ thuật viên…"')}</div>${modalFoot('Lưu')}</form>`,
      handlers: { submit: { 'n-ktv': (form, data) => save({ foreman_note: data.foreman_note }, 'Đã cập nhật ghi chú KTV') } },
    });
  });
  on('click', 'edit-note-cvdv', () => {
    openModal({
      title: 'Ghi chú của Cố vấn dịch vụ',
      size: 'sm',
      body: `<form data-submit="n-cvdv"><div class="modal-body">${textarea('advisor_note', d.work_order.advisor_note || '', 'rows="4" placeholder="Ghi chú của cố vấn dịch vụ…"')}</div>${modalFoot('Lưu')}</form>`,
      handlers: { submit: { 'n-cvdv': (form, data) => save({ advisor_note: data.advisor_note }, 'Đã cập nhật ghi chú CVDV') } },
    });
  });
  // Hạng mục sửa chữa VinFast (báo cáo tồn xe): chọn tay hoặc để trống = app tự đoán
  on('click', 'edit-vf-cat', () => {
    const w = d.work_order;
    const cats = S.meta.vinfast_categories || [];
    const cur = w.vinfast_category || '';
    const auto = w.vinfast_category_auto || w.vf_category || '';
    openModal({
      title: 'Hạng mục sửa chữa',
      size: 'sm',
      body: `<form data-submit="vf-cat"><div class="modal-body stack" style="gap:10px">
        <p class="muted small" style="margin:0">Báo cáo tồn xe VinFast. Tự động: chưa ngày GSM bàn giao → « Xe GSM chưa bàn giao… »; có BH PIN → thay Pin; BH động cơ → thay động cơ; ngoại quan thay (nắm mâm / nắn…) → nắn khung; ngoại quan sơn → đồng sơn; còn lại → sửa chữa chung. « Ngưng SC… » chỉ chọn tay.</p>
        ${field('Hạng mục', select('vinfast_category', cats.map((c) => [c, c]), cur, '', `Tự động${auto ? ` (${auto})` : ''}`))}
      </div>${modalFoot('Lưu')}</form>`,
      handlers: {
        submit: {
          'vf-cat': (form, data) => save({ vinfast_category: data.vinfast_category || null }, data.vinfast_category ? 'Đã chọn hạng mục sửa chữa' : 'Đã để hạng mục tự động'),
        },
      },
    });
  });

  on('click', 'inspect-edit', () => {
    const w = d.work_order;
    const g = woEditGroups(w);
    const n = w.inspection_notes || {};
    const a = n.accessories || {};
    const canAdmin = g.has('edit');
    const canInspect = g.has('work') || canAdmin;
    const isGsmW = isFleetWo(w);
    const pin2Shown = (pins) => isGsmW && (InspectText.twoPinModel(w.model) || String(pins) === '2' || w.battery_level_2 != null);
    openModal({
      title: `Sửa phiếu – ${w.code}`,
      size: 'lg',
      body: `<form data-submit="i-save"><div class="modal-body">
        <div class="form-grid cols-3">
          ${isFleetWo(w) || isWalkinWo(w) ? field(isWalkinWo(w) ? 'Họ tên tài xế' : 'Họ và tên', input('driver_name', n.driver_name || '', '')) : ''}
          ${isFleetWo(w) || isWalkinWo(w) ? field(isWalkinWo(w) ? 'SĐT tài xế' : 'Số điện thoại', input('driver_phone', n.driver_phone || '', 'type="tel"')) : ''}
          ${isFleetWo(w) ? field('Email', input('driver_email', n.driver_email || '', 'type="email"')) : ''}
          ${isFleetWo(w) ? field('Yêu cầu khách hàng', input('customer_request', n.customer_request || w.symptoms || '', '')) : ''}
          ${canAdmin ? field('Loại dịch vụ', select('service_type', S.meta.service_types, w.service_type)) : ''}
          ${w.service_type === 'insurance' ? `<div class="span-all">${insuranceFields(n.insurance || {}, false)}</div>` : ''}
          ${canAdmin ? field('Mức ưu tiên', select('priority', S.meta.priorities, w.priority)) : ''}
          ${canAdmin ? (isFleetWo(w)
            ? field(fleetTxt(w, 'Ngày GSM bàn giao sửa chữa'), input('gsm_handover_at', w.gsm_handover_at, 'type="date"'))
            : field('Hẹn trả xe', input('promised_at', toInputDT(w.promised_at), 'type="datetime-local"'))
          ) : ''}
          ${field('Số Km', input('odometer', w.odometer, 'type="number" min="0"'))}
          ${field('% PIN hiện tại', input('battery_level', w.battery_level, 'type="number" min="0" max="100"'))}
          ${isGsmW ? field('% PIN 2', input('battery_level_2', w.battery_level_2, 'type="number" min="0" max="100" placeholder="0–100"'), { cls: `pin2-field${pin2Shown(a.pins ?? '') ? '' : ' hidden'}` }) : ''}
          ${canAdmin ? field('Chi phí sửa chữa', moneyInput('quote_amount', w.quote_amount)) : ''}
          ${canInspect && !isGsmW ? field('Nội dung kiểm tra', textarea('inspection_content', w.diagnosis || '', 'rows="5" style="min-height:120px" placeholder="Ghi chú thêm nếu cần…"'), { cls: 'span-all' }) : ''}
        </div>
        ${canInspect && isGsmW ? `<div class="label" style="margin:4px 0 8px">Kiểm tra xe</div>
        ${inspectNqInputs(n, 3)}
        <div class="old-parts-row">${checkbox('old_parts_return', n.old_parts_return === true, 'Tài xế lấy lại phụ tùng cũ')}</div>
        ${String(w.diagnosis || '').trim() ? `<div style="margin-top:12px">${field('Nội dung kiểm tra (cũ)', textarea('inspection_content', w.diagnosis || '', 'rows="3"'))}</div>` : ''}
        <div style="height:12px"></div>` : ''}
        <div class="label" style="margin-top:8px">Phụ kiện</div>
        <div class="checks" style="margin-bottom:12px">
          ${checkbox('acc_charger', a.charger === true, 'Có sạc', 'data-change="i-charger"')}
          ${checkbox('acc_no_charger', a.charger === false, 'Không sạc', 'data-change="i-charger"')}
          ${checkbox('acc_key', !!a.key, 'Chìa khóa')}
          ${checkbox('acc_remote', !!a.remote, 'Remote')}
          ${checkbox('acc_spare_seat', !!a.spare_seat, 'Yên phụ')}
        </div>
        ${field('QR sạc', chargerQrInputs(a), { cls: `charger-qr-field${a.charger === true ? '' : ' hidden'}` })}
        <div class="form-grid cols-2" style="margin-top:8px">
          ${field('Số PIN', select('acc_pins', [['0', 'Không'], ['1', '1 PIN'], ['2', '2 PIN']], a.pins ?? '', 'data-change="i-pins"', '— Chưa ghi nhận —'))}
          ${field('Số gương', select('acc_mirrors', [['0', 'Không'], ['1', '1 gương'], ['2', '2 gương']], a.mirrors ?? '', '', '— Chưa ghi nhận —'))}
        </div>
        <div class="acc-pin-serials-modal">${(() => {
          const [s1, s2] = InspectText.pinSerials(a, w);
          return batterySerialInputs({ battery_serial: s1, battery_serial_2: s2 }, a.pins ?? '', { showUnknown: true });
        })()}</div>
        ${(g.has('work') || g.has('warranty') || canAdmin) ? field('Hạng mục lỗi', chipSelect('faults', S.meta.settings.faults, w.faults)) : ''}
      </div>${modalFoot('Lưu')}</form>`,
      handlers: {
        change: {
          'i-pins': (el) => {
            const box = el.closest('form').querySelector('.pin2-field');
            if (box) box.classList.toggle('hidden', !pin2Shown(el.value));
            applyPinSerials(el.closest('form'), el.value, { showUnknown: true });
          },
          'i-charger': (el) => {
            const form = el.closest('form');
            const other = form.querySelector(`[name="${el.name === 'acc_charger' ? 'acc_no_charger' : 'acc_charger'}"]`);
            if (el.checked && other) other.checked = false;
            const has = !!form.querySelector('[name="acc_charger"]').checked;
            const box = form.querySelector('.charger-qr-field');
            if (box) box.classList.toggle('hidden', !has);
            if (!has && box) box.querySelectorAll('input').forEach((inp) => { inp.value = ''; });
          },
        },
        submit: {
          'i-save': (form, data) => {
            const pins = data.acc_pins === '' || data.acc_pins === undefined ? null : Number(data.acc_pins);
            const mirrors = data.acc_mirrors === '' || data.acc_mirrors === undefined ? null : Number(data.acc_mirrors);
            const content = String(data.inspection_content || '').trim();
            const faults = (g.has('work') || g.has('warranty') || canAdmin) ? parseChips(data.faults) : w.faults;
            const kept = { ...n };
            if (canInspect && isGsmW) inspectNqFields().forEach((f) => { delete kept[f.key]; });
            const notes = {
              ...kept,
              ...(canInspect && isGsmW ? inspectNqFromData(data) : {}),
              ...(canInspect && isGsmW ? { old_parts_return: !!data.old_parts_return } : {}),
              driver_name: String(data.driver_name || n.driver_name || '').trim(),
              driver_phone: String(data.driver_phone || n.driver_phone || '').trim(),
              driver_email: String(data.driver_email || n.driver_email || '').trim(),
              customer_request: String(data.customer_request || n.customer_request || '').trim(),
              ...(w.service_type === 'insurance' ? { insurance: {
                company: String(data.ins_company || '').trim(),
                claim_no: String(data.ins_claim_no || '').trim(),
                adjuster: String(data.ins_adjuster || '').trim(),
              } } : {}),
              accessories: {
                charger: data.acc_charger ? true : data.acc_no_charger ? false : null,
                charger_serial: data.acc_charger ? String(data.charger_serial || '').trim() : '',
                charger_serial_inner: data.acc_charger ? String(data.charger_serial_inner || '').trim() : '',
                pins,
                ...pinSerialsFromData(data, pins),
                mirrors,
                key: !!data.acc_key,
                remote: !!data.acc_remote,
                spare_seat: !!data.acc_spare_seat,
              },
            };
            const body = {
              odometer: data.odometer,
              battery_level: data.battery_level,
              ...(isGsmW ? { battery_level_2: data.battery_level_2 } : {}),
              inspection_notes: notes,
              reception_check: {
                charger: !!data.acc_charger,
                key: !!data.acc_key,
                remote: !!data.acc_remote,
                mirrors: mirrors >= 2,
                battery: pins >= 1,
                body: false, lights: false, brakes: false, tires: false, display: false,
              },
            };
            if (g.has('work') || g.has('warranty') || canAdmin) body.faults = faults;
            if (g.has('work') || canAdmin) body.diagnosis = content;
            // 'symptoms' chỉ nhóm edit (CVDV/QĐ) được sửa – KTV gửi kèm sẽ bị 403.
            // Xe lẻ: giữ nguyên yêu cầu khách, không lấy nội dung kiểm tra đè lên.
            if (canAdmin && isGsmW) body.symptoms = notes.customer_request || content || (faults.length ? faults.join(', ') : w.symptoms);
            if (canAdmin) {
              body.service_type = data.service_type;
              body.priority = data.priority;
              body.quote_amount = data.quote_amount;
              if (isFleetWo(w)) body.gsm_handover_at = data.gsm_handover_at;
              else body.promised_at = data.promised_at;
            }
            return save(body, 'Đã lưu');
          },
        },
      },
    });
  });

  const openBhKindModal = (kind, { isNew = false } = {}) => {
    const w = d.work_order;
    const labels = S.meta.warranty_kinds || {};
    const label = labels[kind] || kind;
    const extra = warrantyExtraOf(w);
    const row = extra[kind] || {};
    const kinds = warrantyKindsOf(w);
    const st = bhKindStatus(w, kind, extra) || 'checking';
    const onlyOne = kinds.length <= (isNew ? 0 : 1);
    const wCode = row.warranty_code || (onlyOne && !isNew ? (w.dms_warranty_code || '') : '');
    const cCode = row.claim_code || (onlyOne && !isNew ? (w.dms_claim_code || '') : '');
    const faultAt = row.fault_at || (isNew ? today() : '');
    const dmsFields = `
      ${field('Lệnh BH', input('warranty_code', wCode, `placeholder="N545-WO-…" data-vi-required="Vui lòng bổ sung Lệnh bảo hành"${st === 'completed' ? ' required' : ''}`, 'mono'), { req: st === 'completed' })}
      ${field('ĐXBH', input('claim_code', cCode, 'placeholder="N545-WC-…"', 'mono'))}`;

    let fields = '';
    if (kind === 'pin') {
      fields = `<div class="form-grid cols-3">
        ${field('Trạng thái', select('status', bhStatusOpts('pin'), st, 'data-change="bh-st"', '—'))}
        ${field('Ngày phát sinh', input('fault_at', faultAt, 'type="date"'))}
        ${field('Serial PIN', scanInput('battery_serial_old', w.battery_serial_old, '', 'mono', 'qr'))}
        ${field('Loại SC PIN', select('battery_repair_type', S.meta.battery_repair_types, w.battery_repair_type, '', '—'))}
        ${field('Serial PIN mới', scanInput('battery_serial_new', w.battery_serial_new, '', 'mono', 'qr'))}
        ${field('Ngày tháo PIN', input('parts_removed_at', w.parts_removed_at, 'type="date"'))}
        ${field('Ngày gửi NM', input('sent_factory_at', w.sent_factory_at, 'type="date"'))}
        ${field('Diễn giải', textarea('dien_giai', row.dien_giai || '', 'rows="2" placeholder="Diễn giải từ ĐXBH…"'), { cls: 'span-2' })}
        ${dmsFields}
      </div>`;
    } else if (kind === 'motor') {
      fields = `<div class="form-grid cols-3">
        ${field('Trạng thái', select('status', bhStatusOpts('motor'), st, 'data-change="bh-st"', '—'))}
        ${field('Ngày phát sinh', input('fault_at', faultAt, 'type="date"'))}
        ${field('Số máy', scanInput('motor_serial_old', w.motor_serial_old, '', 'mono', 'qr,barcode'))}
        ${field('Loại SC ĐC', select('motor_repair_type', S.meta.motor_repair_types, w.motor_repair_type, '', '—'))}
        ${field('Số máy mới', scanInput('motor_serial_new', w.motor_serial_new, '', 'mono', 'qr,barcode'))}
        ${field('COC', select('coc_status', S.meta.coc_statuses, w.coc_status, '', '—'))}
        ${field('Ngày tháo ĐC', input('motor_removed_at', w.motor_removed_at, 'type="date"'))}
        ${field('Diễn giải', textarea('dien_giai', row.dien_giai || '', 'rows="2" placeholder="Diễn giải từ ĐXBH…"'), { cls: 'span-2' })}
        ${dmsFields}
      </div>`;
    } else {
      const oldSerial = row.serial_old || row.serial || '';
      const showSerial = kind !== 'wiring';
      fields = `<div class="form-grid cols-3">
        ${field('Trạng thái', select('status', bhStatusOpts(kind), st, 'data-change="bh-st"', '—'))}
        <div class="bh-date-row">
          ${field('Ngày phát sinh', input('fault_at', faultAt, 'type="date"'))}
          ${field('Ngày xử lý', input('removed_at', row.removed_at || '', 'type="date"'))}
        </div>
        ${showSerial ? field('Serial cũ', scanInput('serial_old', oldSerial, '', 'mono', 'qr,barcode')) : ''}
        ${showSerial ? field('Serial mới', scanInput('serial_new', row.serial_new || '', '', 'mono', 'qr,barcode')) : ''}
        ${field('Diễn giải', textarea('dien_giai', row.dien_giai || '', 'rows="2" placeholder="Diễn giải từ ĐXBH…"'), { cls: 'span-2' })}
        ${field('Ghi chú', input('note', row.note || '', 'placeholder="Ghi chú nội bộ…"'), { cls: showSerial ? '' : 'span-2' })}
        ${dmsFields}
      </div>`;
    }

    const removeBtn = (!isNew && kinds.includes(kind))
      ? `<button type="button" class="btn btn-ghost" data-click="bh-remove-kind" data-kind="${esc(kind)}" style="margin-right:auto">Gỡ loại này</button>`
      : '';

    openModal({
      title: isNew ? `Thêm bảo hành – ${label}` : `Sửa bảo hành – ${label}`,
      size: 'lg',
      body: `<form data-submit="bh-kind-save"><div class="modal-body">${fields}</div>
        <div class="modal-foot">${removeBtn}<button type="button" class="btn" data-click="modal-close">Hủy</button>
        <button type="submit" class="btn btn-primary">Lưu</button></div></form>`,
      handlers: {
        change: {
          'bh-st': (el) => {
            const form = el.closest('form');
            const inp = form && form.querySelector('[name="warranty_code"]');
            if (!inp) return;
            const need = el.value === 'completed';
            inp.required = need;
            const wrap = inp.closest('.field');
            const lab = wrap && wrap.querySelector('label');
            if (lab) {
              const star = lab.querySelector('.req');
              if (need && !star) lab.insertAdjacentHTML('beforeend', ' <span class="req">*</span>');
              else if (!need && star) star.remove();
            }
          },
        },
        click: {
          'bh-remove-kind': async () => {
            if (!(await confirmBox(`Gỡ loại bảo hành “${label}” khỏi phiếu?`))) return;
            const nextKinds = kinds.filter((k) => k !== kind);
            const nextExtra = { ...extra };
            delete nextExtra[kind];
            const byKind = {};
            nextKinds.forEach((k) => {
              const s = bhKindStatus(w, k, nextExtra);
              if (s) byKind[k] = s;
            });
            const payload = {
              warranty_kinds: nextKinds.length ? nextKinds : null,
              warranty_extra: nextExtra,
              warranty_status: aggregateWarrantyStatus(byKind),
            };
            if (kind === 'pin') {
              Object.assign(payload, {
                battery_serial_old: null, battery_serial_new: null, battery_repair_type: null,
                parts_removed_at: null, sent_factory_at: null,
              });
            }
            if (kind === 'motor') {
              Object.assign(payload, {
                motor_serial_old: null, motor_serial_new: null, motor_repair_type: null,
                motor_removed_at: null, coc_status: null,
              });
            }
            closeModal();
            return save(payload, 'Đã gỡ loại bảo hành');
          },
        },
        submit: {
          'bh-kind-save': (form, data) => {
            // Không để trống trạng thái: phiếu có loại BH phải hiện ở Bảo hành tổng hợp (lọc theo warranty_status)
            data.status = data.status || 'checking';
            const nextKinds = isNew
              ? [...new Set([...kinds, kind])]
              : (kinds.includes(kind) ? kinds : [...kinds, kind]);
            const code = String(data.warranty_code || '').trim()
              || (nextKinds.length === 1 ? String(w.dms_warranty_code || '').trim() : '');
            if (data.status === 'completed' && !code) {
              throw new Error('Vui lòng bổ sung Lệnh bảo hành');
            }
            const nextExtra = { ...extra };
            const entry = {};
            if (data.status) entry.status = data.status;
            if (data.warranty_code) entry.warranty_code = data.warranty_code;
            else if (data.status === 'completed' && code) entry.warranty_code = code;
            if (data.claim_code) entry.claim_code = data.claim_code;
            const faultVal = data.fault_at || (isNew ? today() : '');
            if (faultVal) entry.fault_at = faultVal;
            if (kind !== 'pin' && kind !== 'motor') {
              if (kind !== 'wiring') {
                if (data.serial_old) entry.serial_old = data.serial_old;
                if (data.serial_new) entry.serial_new = data.serial_new;
              }
              if (data.removed_at) entry.removed_at = data.removed_at;
              if (data.note) entry.note = data.note;
            }
            if (data.dien_giai) entry.dien_giai = data.dien_giai;
            // Giữ field kéo từ Dealer Portal (không có trên form sửa một số loại)
            ['claim_amount', 'claim_submitted_at', 'claim_approved_at', 'claim_status'].forEach((k) => {
              if (row[k] != null && row[k] !== '') entry[k] = row[k];
            });
            if (!entry.dien_giai && row.dien_giai) entry.dien_giai = row.dien_giai;
            nextExtra[kind] = entry;
            const byKind = {};
            nextKinds.forEach((k) => {
              const s = k === kind ? (data.status || null) : bhKindStatus(w, k, nextExtra);
              if (s) byKind[k] = s;
            });
            const payload = {
              warranty_kinds: nextKinds,
              warranty_extra: nextExtra,
              warranty_status: aggregateWarrantyStatus(byKind),
            };
            if (kind === 'pin') {
              Object.assign(payload, {
                battery_serial_old: data.battery_serial_old || null,
                battery_serial_new: data.battery_serial_new || null,
                battery_repair_type: data.battery_repair_type || null,
                parts_removed_at: data.parts_removed_at || null,
                sent_factory_at: data.sent_factory_at || null,
              });
            }
            if (kind === 'motor') {
              Object.assign(payload, {
                motor_serial_old: data.motor_serial_old || null,
                motor_serial_new: data.motor_serial_new || null,
                motor_repair_type: data.motor_repair_type || null,
                motor_removed_at: data.motor_removed_at || null,
                coc_status: data.coc_status || null,
              });
            }
            return save(payload, isNew ? 'Đã thêm bảo hành' : 'Đã cập nhật bảo hành');
          },
        },
      },
    });
  };

  on('click', 'add-warranty', () => {
    const w = d.work_order;
    const kindCatalog = Object.entries(S.meta.warranty_kinds || { pin: 'PIN', motor: 'Động cơ' });
    const active = new Set(warrantyKindsOf(w));
    // front_shock = loại gộp cũ (chỉ để hiện phiếu đã lưu), không cho chọn thêm
    const left = kindCatalog.filter(([k]) => !active.has(k) && k !== 'front_shock');
    if (!left.length) {
      toast('Đã thêm đủ các loại bảo hành trong cấu hình', 'error');
      return;
    }
    // Danh sách radio trong modal (không dùng <select> – nhiều loại → bung ngược che tiêu đề)
    const pickList = left.map(([k, lab]) => `<label class="choice bh-kind-opt"><input type="radio" name="kind" value="${esc(k)}" required><span>${esc(lab)}</span></label>`).join('');
    openModal({
      title: 'Thêm loại bảo hành',
      size: 'sm',
      body: `<form data-submit="bh-pick"><div class="modal-body">
        <div class="field"><label class="label">Loại bảo hành <span class="req">*</span></label>
          <div class="bh-kind-pick">${pickList}</div></div>
      </div>${modalFoot('Tiếp tục')}</form>`,
      handlers: {
        submit: {
          'bh-pick': (form, data) => {
            const kind = data.kind;
            if (!kind) throw new Error('Chọn loại bảo hành');
            closeModal();
            openBhKindModal(kind, { isNew: true });
          },
        },
      },
    });
  });

  on('click', 'edit-bh-kind', (el) => {
    const kind = el.dataset.kind;
    if (!kind) return;
    openBhKindModal(kind, { isNew: false });
  });

  // Kho: cập nhật trạng thái xuất kho phụ tùng
  on('click', 'edit-parts', () => {
    const w = d.work_order;
    const opts = Object.entries(S.meta.parts_statuses || {}).map(([k, v]) => [k, v.label || v]);
    openModal({
      title: 'Cập nhật xuất kho',
      body: `<form data-submit="p-save"><div class="modal-body">
        ${field('Trạng thái xuất kho', select('parts_status', [['', '— Chưa xuất kho —'], ...opts], w.parts_status || 'issued', 'data-change="p-st"'))}
        <div id="p-missing" class="${(w.parts_status || 'issued') === 'partial' ? '' : 'hidden'}">
          ${field('Mã phụ tùng thiếu', input('missing_parts', w.missing_parts || '', `placeholder="VD: mã phụ tùng còn thiếu"${(w.parts_status || 'issued') === 'partial' ? ' required' : ''}`), { req: true })}
        </div>
      </div>${modalFoot('Lưu')}</form>`,
      handlers: {
        // Chỉ "Xuất kho thiếu phụ tùng" mới cần ghi mã phụ tùng thiếu
        change: { 'p-st': (el) => {
          const box = document.getElementById('p-missing');
          if (!box) return;
          box.classList.toggle('hidden', el.value !== 'partial');
          const inp = box.querySelector('[name="missing_parts"]');
          if (inp) inp.required = el.value === 'partial';
        } },
        submit: { 'p-save': (form, data) => (data.parts_status === 'partial' && !String(data.missing_parts || '').trim()
          ? toast('Vui lòng nhập mã phụ tùng thiếu', 'error') : save({ parts_status: data.parts_status || null, missing_parts: data.parts_status === 'partial' ? (data.missing_parts || null) : null }, 'Đã cập nhật xuất kho')) },
      },
    });
    if (typeof watchInventoryHint === 'function') watchInventoryHint(document.querySelector('#p-missing [name="missing_parts"]'));
  });

  // ----- Chia thanh toán khách + GSM ngay trên thẻ Kiểm tra & Báo giá -----
  const payOpen = () => {
    payEdit = true;
    render();
    const f = document.querySelector('.wd-pay-form');
    if (f) { paySplitSync(f); f.querySelector('[data-pay-note]').focus({ preventScroll: true }); }
  };
  on('change', 'pay-toggle', async (el) => {
    const w = d.work_order;
    if (el.checked) return payOpen();
    if (!hasPaySplit(w)) { payEdit = false; render(); return; }
    if (!(await confirmBox(`Bỏ chia thanh toán khách hàng / công ty? Chi phí sửa chữa giữ tổng ${money(Number(w.quote_amount) || 0)}, lệnh sửa chữa giữ lệnh công ty${w.dms_ro_code ? ` (${w.dms_ro_code})` : ''}; phần khách hàng bị xoá.`, { okLabel: 'Bỏ chia' }))) { el.checked = true; return; }
    payEdit = false;
    await save(Object.fromEntries(PAY_KEYS.map((k) => [k, ''])), 'Đã bỏ chia thanh toán');
  });
  on('click', 'pay-edit', () => payOpen());
  on('click', 'pay-cancel', () => { payEdit = false; render(); });
  on('submit', 'pay-save', async (form, data) => {
    const w = d.work_order;
    const pay = paySplitValues(data);
    if (pay.error) return toast(fleetTxt(w, pay.error), 'error');
    payEdit = false;
    try {
      await save(pay.vals, 'Đã lưu chia thanh toán');
    } catch (e) {
      payOpen();
      throw e;
    }
  });

  on('click', 'edit-dms', () => {
    const w = d.work_order;
    const noCostW = w.quote_amount !== null && w.quote_amount !== undefined && Number(w.quote_amount) === 0;
    openModal({
      title: 'Cập nhật lệnh sửa chữa',
      body: `<form data-submit="d-save"><div class="modal-body">
        ${woEditGroups(w).has('edit') ? field('Chi phí sửa chữa (VNĐ)', costInput('quote_amount', w.quote_amount, 'placeholder="VD: 1.500.000"')) : ''}
        <div data-cost-ro${noCostW ? ' class="hidden"' : ''}>${field('Lệnh sửa chữa', input('dms_ro_code', noCostW ? '' : w.dms_ro_code, 'placeholder="N545 - WO"', 'mono'))}</div>
      </div>${modalFoot('Lưu')}</form>`,
      handlers: { submit: { 'd-save': (form, data) => save(data, 'Đã cập nhật lệnh sửa chữa') } },
    });
  });

  // ----- Đính kèm -----
  on('change', 'att-upload', async (el) => {
    const files = Array.from(el.files || []);
    el.value = '';
    if (!files.length) return;
    // Thanh tiến trình hiện ngay chỗ bấm (ô Báo giá PDF / nút Thêm ảnh)
    const qfBox = el.closest('.wd-qf');
    const bar = !qfBox && el.closest('.upload-bar');
    let box = $('#att-progress');
    if (qfBox || bar) {
      box = (qfBox || bar.parentElement).querySelector('.att-progress-inline') || document.createElement('div');
      box.className = 'att-progress-inline';
      if (qfBox) qfBox.append(box); else bar.after(box);
    }
    let okCount = 0;
    for (const [i, f] of files.entries()) {
      if (box) box.innerHTML = `<div class="small muted">Đang tải ${i + 1}/${files.length}: ${esc(f.name)}</div><div class="progress-line"><div></div></div>`;
      const w = d && d.work_order;
      const stampCtx = w ? { branchName: [w.branch_code, w.branch_name].filter(Boolean).join(' – '), address: w.branch_address, plate: w.plate, code: w.code } : {};
      try { await uploadAttachment(id, el.dataset.kind, f, stampCtx); okCount++; } catch (e) { toast(`${f.name}: ${e.message}`, 'error'); }
    }
    if (okCount) toast(`Đã tải lên ${okCount} file`, 'success');
    await load();
  });
  on('click', 'att-del', async (el) => {
    if (!(await confirmBox('Xóa file này khỏi phiếu?', { okLabel: 'Xóa', danger: true }))) return;
    await api('DELETE', `/api/attachments/${el.dataset.id}`);
    toast('Đã xóa file', 'success');
    await load();
  });

  on('click', 'claim', async () => {
    await api('POST', `/api/work-orders/${id}/claim`);
    toast('Đã nhận phiếu', 'success');
    await load();
  });
  on('click', 'send-sheet', async () => {
    try {
      const r = await api('POST', `/api/work-orders/${id}/send-sheet`);
      toastSheetPush(r);
    } catch (e) {
      toast(e.message || 'Đẩy Sheets thất bại', 'error');
    }
  });
  on('click', 'wo-delete', async () => {
    if (!(await confirmBox(`Xóa phiếu ${d.work_order.code}? Nhật ký, hạng mục, file đính kèm của phiếu cũng bị xóa. Không khôi phục được.`, { title: 'Xóa phiếu', okLabel: 'Xóa phiếu', danger: true }))) return;
    await api('DELETE', `/api/work-orders/${id}`);
    toast(`Đã xóa phiếu ${d.work_order.code}`, 'success');
    window.location.hash = ctx.inDrawer && typeof drawerBackHash === 'function' ? drawerBackHash() : listBase;
  });
  on('click', 'print', () => { printWorkOrder(d).catch((err) => toast(err.message || 'Không in được phiếu', 'error')); });
  on('click', 'wd-copy', async (el) => {
    try {
      await navigator.clipboard.writeText(el.dataset.val || '');
      toast('Đã sao chép', 'success');
    } catch {
      toast('Không sao chép được', 'error');
    }
  });
  on('click', 'wd-vreq', (el) => {
    el.setAttribute('aria-expanded', String(el.classList.toggle('is-open')));
  });
  on('click', 'wd-vhist', () => {
    const entLabel = (typeof CALL_ENTITY_LABELS !== 'undefined' && CALL_ENTITY_LABELS) || {};
    const visits = d.history.length
      ? d.history.map((h) => `<a class="list-item wd-hist-item" href="#/work-orders/${h.id}" data-click="hist-go"><div class="grow"><div class="small strong">${esc(h.code)} · ${fmtD(h.received_at)}</div>
        <div class="small muted">${esc(h.faults.length ? h.faults.join(', ') : svcLabel(h.service_type))}</div></div>${statusBadge(h.status)}</a>`).join('')
      : '<div class="small muted">Chưa có lần vào xưởng nào khác.</div>';
    const calls = (d.calls || []).length
      ? d.calls.map((c) => {
        const [phone, name] = String(c.detail || '').split(' · ');
        const from = c.entity === 'work_order' && Number(c.entity_id) === Number(d.work_order.id) ? 'Phiếu này' : (entLabel[c.entity] || '');
        return `<div class="list-item wd-hist-item"><div class="grow"><div class="small strong">${esc(c.full_name || c.username || '—')} <span class="muted" style="font-weight:400">gọi ${esc(phone || '')}${name ? ` (${esc(name)})` : ''}</span></div>
          <div class="small muted">${fmtDT(c.created_at)}${from ? ` · ${esc(from)}` : ''}</div></div></div>`;
      }).join('')
      : '<div class="small muted">Chưa có cuộc gọi nào được ghi lại.</div>';
    openModal({
      title: 'Lịch sử',
      body: `<div class="modal-body wd-hist-modal">
        <h4 class="wd-hist-h">${icon('history')} Lịch sử vào xưởng (${d.history.length})</h4>${visits}
        <h4 class="wd-hist-h">${icon('phone')} Lịch sử cuộc gọi (${(d.calls || []).length})</h4>${calls}
      </div>`,
      handlers: { click: { 'hist-go': (el) => { const href = el.getAttribute('href'); closeModal(); location.hash = href; } } },
    });
  });
  on('click', 'wd-vmore', (el) => {
    const box = el.closest('.wd-vehicle')?.querySelector('.wd-vextra');
    if (!box) return;
    box.hidden = !box.hidden;
    el.setAttribute('aria-expanded', String(!box.hidden));
  });
  await load();
}

async function printWorkOrder(d) {
  const w = d.work_order;
  const isGsm = isFleetWo(w);
  const txt = (x) => (x == null || x === '' ? '' : String(x));
  const notesRaw = w.inspection_notes;
  const notes = typeof notesRaw === 'string'
    ? (() => { try { return JSON.parse(notesRaw) || {}; } catch { return {}; } })()
    : (notesRaw || {});
  const driverName = txt(notes.driver_name);
  const driverPhone = txt(notes.driver_phone);
  const driverEmail = txt(notes.driver_email);

  const jobs = [];
  const reqText = isGsm
    ? (txt(notes.customer_request) || txt(w.symptoms))
    : txt(w.symptoms);
  const faultsText = w.faults?.length ? w.faults.join(', ') : '';
  const displayReq = reqText || faultsText;
  const model = txt(w.model);
  const plate = txt(w.plate);
  // VD: "Bảo dưỡng xe evo 200 biển số 51A-12345" — không kèm phụ kiện/kiểm tra
  const workParts = [];
  if (displayReq) workParts.push(displayReq);
  if (model) workParts.push(`xe ${model}`);
  if (plate) workParts.push(`biển số ${plate}`);
  const workText = workParts.join(' ');
  if (displayReq || workText) {
    jobs.push({ req: displayReq, work: workText, note: '' });
  }

  const branch =
    (typeof S !== 'undefined' && S.meta && Array.isArray(S.meta.branches)
      ? S.meta.branches.find((b) => String(b.id) === String(w.branch_id))
      : null) || {};
  const branchName = txt(w.branch_name || branch.name);
  const branchAddress = txt(w.branch_address || branch.address);
  const rawPhone = txt(w.branch_phone || branch.phone);
  const branchPhone = (() => {
    const d = rawPhone.replace(/\D/g, '');
    if (d.length === 10) return `${d.slice(0, 4)}.${d.slice(4, 7)}.${d.slice(7)}`;
    if (d.length === 11) return `${d.slice(0, 4)}.${d.slice(4, 7)}.${d.slice(7)}`;
    return rawPhone;
  })();

  const payload = {
    fields: {
      customer_name_lbl: isGsm ? 'Họ và tên' : 'Tên khách hàng',
      customer_name: isGsm ? (driverName || txt(w.customer_name) || (w.source === 'bship' ? 'BShip' : 'Xanh SM (GSM)')) : txt(w.customer_name),
      customer_address: isGsm ? '' : txt(w.customer_address),
      received_at: w.received_at ? fmtDT(w.received_at) : '',
      battery_level: InspectText.pinText(w.battery_level, w.battery_level_2),
      customer_phone: isGsm ? driverPhone : txt(w.customer_phone),
      customer_email: isGsm ? driverEmail : txt(w.customer_email),
      promised_at: isGsm
        ? (w.sla_due_at ? fmtD(w.sla_due_at) : '')
        : (w.promised_at ? fmtDT(w.promised_at) : ''),
      model: txt(w.model),
      vin: txt(w.vin),
      delivered_at: (w.delivered_at || w.completed_at) ? fmtDT(w.delivered_at || w.completed_at) : '',
      odometer: w.odometer != null ? String(numf(w.odometer)) : '',
      plate: txt(w.plate),
      motor_serial: txt(w.motor_serial_old || w.motor_serial),
      purchase_date: w.purchase_date ? fmtD(w.purchase_date) : '',
      wo_code: txt(w.code),
      technician_name: txt(w.technician_name),
      advisor_name: txt(w.advisor_name),
      branch_name: branchName,
      branch_address: branchAddress,
      branch_phone: branchPhone,
      ...nextCheckFields(w.received_at, w.odometer),
    },
    jobs,
  };

  await openPrintSlip(payload);
}

// Chi tiết phiếu: lệnh sửa chữa + đề xuất bảo hành đọc trực tiếp từ VinFast Dealer Portal (cơ sở đã kết nối ở Cấu hình)
const DP_WO_FIELDS = [['status', 'Trạng thái LSC'], ['warehouse_status', 'Trạng thái kho'], ['advisor', 'CVDV trên DMS'],
  ['amount', 'Tổng tiền'], ['settlement', 'Số quyết toán'],
  // repairCommittedEndTime = ngày+giờ DMS cam kết hoàn thành sửa (xanh → cam <24h → đỏ quá hạn)
  ['committed_end', 'Ngày cam kết hoàn thành'],
  // deliveredDate trên portal = ngày kích hoạt BH (trùng warrantyStartDate), KHÔNG phải ngày trả xe sau sửa
  ['delivered_at', 'Ngày kích hoạt bảo hành'], ['invoiced_at', 'Ngày xuất HĐ']];
const DP_DONE = new Set(['INVOICED', 'DELIVERED', 'CLOSED', 'CANCELLED', 'CANCELED', 'DONE', 'COMPLETED', 'REPAIR_COMPLETED']);
// Portal trả mã ENUM tiếng Anh (QUOTATION, PENDING_ISSUE…) — hiện tiếng Việt, title giữ mã gốc
const DP_VI = {
  DRAFT: 'Nháp', CREATED: 'Mới tạo', NEW: 'Mới', OPEN: 'Đang mở',
  QUOTATION: 'Báo giá', QUOTING: 'Đang báo giá', WAITING_QUOTATION: 'Chờ báo giá',
  WAITING_APPROVAL: 'Chờ duyệt', PENDING_APPROVAL: 'Chờ duyệt', WAITING_FOR_APPROVAL: 'Chờ duyệt',
  APPROVED: 'Đã phê duyệt', CONFIRMED: 'Đã phê duyệt', REJECTED: 'Từ chối', DECLINED: 'Từ chối',
  IN_PROGRESS: 'Đang sửa chữa', IN_REPAIR: 'Đang sửa chữa', REPAIRING: 'Đang sửa chữa',
  WAITING_PARTS: 'Chờ phụ tùng', WAITING_FOR_PARTS: 'Chờ phụ tùng', ON_HOLD: 'Tạm dừng',
  REPAIR_COMPLETED: 'Sửa chữa xong', REPAIR_DONE: 'Sửa chữa xong', COMPLETED: 'Hoàn thành', DONE: 'Hoàn thành',
  QC: 'Kiểm tra chất lượng', QUALITY_CHECK: 'Kiểm tra chất lượng',
  READY_FOR_DELIVERY: 'Chờ giao xe', WAITING_DELIVERY: 'Chờ giao xe',
  READY_FOR_INVOICING: 'Chờ xuất hóa đơn', WAITING_INVOICE: 'Chờ xuất hóa đơn', TO_INVOICE: 'Chờ xuất hóa đơn',
  DELIVERED: 'Đã giao xe', INVOICED: 'Đã xuất hóa đơn', CLOSED: 'Đã đóng',
  CANCELLED: 'Đã hủy', CANCELED: 'Đã hủy',
  PENDING_ISSUE: 'Chờ xuất kho', WAITING_ISSUE: 'Chờ xuất kho', TO_ISSUE: 'Chờ xuất kho',
  PARTIAL_ISSUE: 'Xuất kho thiếu', PARTIALLY_ISSUED: 'Xuất kho thiếu',
  ISSUED: 'Đã xuất kho', FULLY_ISSUED: 'Đã xuất kho', COMPLETE_ISSUE: 'Đã xuất kho', ISSUE_COMPLETED: 'Đã xuất kho',
  PENDING_RETURN: 'Chờ nhập trả', RETURNED: 'Đã nhập trả', NO_PARTS: 'Không có phụ tùng',
  NOT_REQUIRED: 'Không cần xuất', NO_NEED: 'Không cần xuất', NONE: 'Không có',
  // overdueProcessingWarning: chỉ hiện khi thật sự có vấn đề (ON_TIME = đúng hạn → ẩn)
  INSUFFICIENT_DATA: 'Thiếu dữ liệu để tính hạn xử lý', MISSING_DATA: 'Thiếu dữ liệu', DATA_INCOMPLETE: 'Thiếu dữ liệu',
  OVERDUE: 'Quá hạn', LATE: 'Trễ hạn', WARNING: 'Cảnh báo', ON_TIME: 'Đúng hạn',
  SUBMITTED: 'Chờ duyệt', UNDER_REVIEW: 'Chờ duyệt', PENDING: 'Chờ duyệt',
  WAITING_LEVEL_1: 'Chờ cấp 1', PENDING_LEVEL_1: 'Chờ cấp 1', LEVEL_1: 'Chờ cấp 1',
  APPROVAL_LEVEL_1: 'Chờ cấp 1', L1: 'Chờ cấp 1', CAP_1: 'Chờ cấp 1',
  WAITING_LEVEL_2: 'Chờ cấp 2', PENDING_LEVEL_2: 'Chờ cấp 2', LEVEL_2: 'Chờ cấp 2',
  APPROVAL_LEVEL_2: 'Chờ cấp 2', L2: 'Chờ cấp 2', CAP_2: 'Chờ cấp 2',
  PAID: 'Đã thanh toán',
  WARRANTY: 'Bảo hành', SERVICE: 'Sửa chữa', MAINTENANCE: 'Bảo dưỡng',
};
const DP_WARN_HIDE = new Set(['ON_TIME', 'OK', 'NONE', 'NORMAL']);
const dpDate = (v) => (/^\d{4}-\d\d-\d\d/.test(String(v || '')) ? fmtDT(String(v).replace('T', ' ').slice(0, 19)) : v);
const dpVi = (v) => {
  if (v == null || v === '') return '';
  const s = String(v).trim();
  if (!s) return '';
  const hit = DP_VI[s] || DP_VI[s.toUpperCase().replace(/\s+/g, '_')];
  return hit || s;
};
const dpCommitHtml = (v, status) => {
  const text = dpDate(v);
  if (!v) return '';
  const t = Date.parse(String(v).includes('T') ? String(v) : String(v).replace(' ', 'T'));
  if (!Number.isFinite(t) || DP_DONE.has(String(status || '').toUpperCase())) return esc(text);
  const left = t - Date.now();
  // Còn hạn: xanh; dưới 24 giờ: cam; quá hạn: đỏ (cùng ngưỡng cảnh báo SLA app)
  const tone = left < 0 ? '#b42318' : left < 864e5 ? '#b26a00' : '#16a34a';
  const tip = left < 0 ? 'Đã quá hạn cam kết' : left < 864e5 ? 'Sắp tới hạn cam kết' : 'Còn trong hạn cam kết';
  return `<span style="color:${tone};font-weight:600" title="${esc(tip)}">${esc(text)}</span>`;
};
const dpFieldHtml = (k, v, o) => {
  if (k === 'status' || k === 'warehouse_status') {
    const lab = dpVi(v);
    return lab === String(v) ? esc(lab) : `<span title="${esc(v)}">${esc(lab)}</span>`;
  }
  if (k === 'committed_end') return dpCommitHtml(v, o && o.status);
  if (k === 'amount') {
    const tip = [o && o.labor_amount != null ? `Nhân công ${money(o.labor_amount)}` : '',
      o && o.parts_amount != null ? `Phụ tùng ${money(o.parts_amount)}` : ''].filter(Boolean).join(' · ');
    return `<span style="color:#15803d;font-weight:700"${tip ? ` title="${esc(tip)}"` : ''}>${money(v)}</span>`;
  }
  return esc(dpDate(v));
};
/** Ngày ISO / chuỗi → YYYY-MM-DD (ô date trên form BH). */
const dpDay = (v) => {
  const s = String(v || '');
  return /^\d{4}-\d\d-\d\d/.test(s) ? s.slice(0, 10) : '';
};
const dpRoKey = (s) => String(s || '').trim().toUpperCase();
const bhEmpty = (v) => v == null || v === '';

/**
 * Có Lệnh bảo hành → kéo DXBH từ Dealer Portal vào ô trống (không ghi đè tay).
 * claims_by_ro: { 'N54502-WO-…': { number, amount, status, app_status, submitted_at, approved_at, serial_*, note } }
 */
const BH_DP_SYNCING = new Set();
/** Đã kéo xong trong phiên mở phiếu này — tránh sync → load → render → sync lặp toast */
const BH_DP_DONE = new Set();
async function syncBhFromDealerClaims(w, dp, ctx) {
  const byRo = (dp && dp.claims_by_ro) || {};
  if (!w || !Object.keys(byRo).length) return;
  if (BH_DP_SYNCING.has(w.id) || BH_DP_DONE.has(w.id)) return;
  const kinds = warrantyKindsOf(w);
  if (!kinds.length) return;
  const extra = { ...warrantyExtraOf(w) };
  let changed = 0;
  const fill = (row, key, val) => {
    if (bhEmpty(val)) return;
    if (!bhEmpty(row[key])) return;
    row[key] = val;
    changed += 1;
  };
  for (const kind of kinds) {
    const row = { ...(extra[kind] || {}) };
    const wCode = row.warranty_code || (kinds.length === 1 ? (w.dms_warranty_code || '') : '');
    if (!wCode) continue;
    const c = byRo[dpRoKey(wCode)];
    if (!c) continue;
    fill(row, 'claim_code', c.number);
    fill(row, 'claim_amount', c.amount);
    fill(row, 'claim_submitted_at', c.submitted_at || c.created_at);
    fill(row, 'claim_approved_at', c.approved_at);
    // Trạng thái phê duyệt ĐXBH: luôn cập nhật theo portal (có thể đổi SUBMITTED → APPROVED)
    if (c.status && row.claim_status !== c.status) {
      row.claim_status = c.status;
      changed += 1;
    }
    fill(row, 'serial_old', c.serial_old);
    fill(row, 'serial_new', c.serial_new);
    fill(row, 'dien_giai', c.dien_giai);
    // Bản cũ từng nhét diễn giải vào note — chuyển sang dien_giai, xóa khỏi ghi chú
    if (c.dien_giai && row.note && String(row.note).trim() === String(c.dien_giai).trim()) {
      delete row.note;
      changed += 1;
    }
    // Trạng thái: trống hoặc còn "Đang kiểm tra" mà DXBH đã duyệt → Đã hoàn thành
    if (c.app_status === 'completed' && (bhEmpty(row.status) || row.status === 'checking')) {
      row.status = 'completed';
      changed += 1;
    } else if (c.app_status && bhEmpty(row.status)) {
      row.status = c.app_status;
      changed += 1;
    }
    // Ngày xử lý ≈ ngày duyệt nếu trống
    fill(row, 'removed_at', dpDay(c.approved_at));
    extra[kind] = row;
  }
  if (!changed) {
    BH_DP_DONE.add(w.id);
    return;
  }
  const byKind = {};
  kinds.forEach((k) => {
    const s = bhKindStatus(w, k, extra);
    if (s) byKind[k] = s;
  });
  const body = {
    warranty_extra: extra,
    warranty_status: aggregateWarrantyStatus(byKind),
  };
  if (ctx && ctx.expected) body.expected_updated_at = ctx.expected;
  BH_DP_SYNCING.add(w.id);
  try {
    const r = await api('PUT', `/api/work-orders/${w.id}`, body);
    // Cập nhật state trước DONE + render — render gọi lại fillDealerPortal nhưng BH_DP_DONE chặn sync
    if (ctx && typeof ctx.applyWoPatch === 'function') {
      ctx.applyWoPatch(body);
      if (r && r.updated_at) ctx.applyWoPatch({ updated_at: r.updated_at });
    }
    BH_DP_DONE.add(w.id);
    toast('Đã kéo đề xuất bảo hành từ Dealer Portal', 'success');
    if (ctx && typeof ctx.render === 'function') ctx.render();
  } catch (e) {
    if (e.status !== 409) toast(e.message || 'Không kéo được DXBH từ Dealer Portal', 'error');
  } finally {
    BH_DP_SYNCING.delete(w.id);
  }
}

async function fillDealerPortal(el) {
  if (!el || !el.dataset.dpWo) return null;
  let d;
  try { d = await api('GET', `/api/dealer-portal/work-orders/${el.dataset.dpWo}`); } catch { return null; }
  if (!el.isConnected || !d.connected) return d;
  el.hidden = false;
  const head = `<div class="wd-sec-title wd-sec-head"><span class="wd-sec-ico wd-dp-vf" title="VinFast"><img src="/img/vinfast-logo.svg?v=1" alt="VinFast" width="18" height="18" decoding="async"></span>Dealer Portal VinFast
    <span class="t-sub wd-dp-at" style="margin-left:auto">${d.at ? `${icon('refreshCw')}Cập nhật ${fmtDT(d.at)}` : ''}</span></div>`;
  if (d.error) { el.innerHTML = `${head}<div class="small" style="color:var(--danger,#b42318)">${esc(d.error)}</div>`; return d; }
  const wos = d.work_orders || [];
  const woEmpty = d.no_ro
    ? '<div class="small muted">Phiếu không gắn lệnh sửa chữa trên DMS (Không phát sinh / chưa nhập lệnh SC).</div>'
    : '<div class="small muted">Chưa thấy lệnh sửa chữa này trên Dealer Portal.</div>';
  const woHtml = wos.length ? wos.map((o) => `<div class="wd-dp-wo">
      <div class="wd-dp-num mono">${esc(o.number || '')}</div>
      <div class="wd-dp-grid">${DP_WO_FIELDS.filter(([k]) => o[k] != null && o[k] !== '').map(([k, lab]) => `<div><div class="wd-qf-k">${esc(lab)}</div><div class="wd-qf-v">${dpFieldHtml(k, o[k], o)}</div></div>`).join('')}</div>
      ${o.campaigns && o.campaigns.length ? `<div class="small">Chiến dịch áp dụng: ${o.campaigns.map((c) => esc(typeof c === 'string' ? c : (c.code || c.name || ''))).join(', ')}</div>` : ''}
      ${o.overdue && !DP_WARN_HIDE.has(String(o.overdue).toUpperCase())
        ? `<div class="small" style="color:#b26a00" title="${esc(o.overdue)}">Cảnh báo DMS: ${esc(dpVi(o.overdue))}</div>` : ''}
    </div>`).join('') : woEmpty;
  const claims = (d.claims || []).filter((c) => c.number);
  const claimHtml = claims.length ? `<div class="wd-dp-claims"><div class="wd-qf-k">Đề xuất bảo hành</div>${claims.map((c) => `<div class="small"><b class="mono">${esc(c.number)}</b> · ${esc(dpVi(c.status || ''))}${c.amount != null ? ` · <span style="color:#15803d;font-weight:600">${money(c.amount)}</span>` : ''}${c.work_order ? ` · LSC ${esc(c.work_order)}` : ''}${c.submitted_at || c.created_at ? ` · ${esc(dpDate(c.submitted_at || c.created_at))}` : ''}</div>`).join('')}</div>` : '';
  el.innerHTML = `${head}${woHtml}${claimHtml}`;
  return d;
}

// Ô "Hạng mục kiểm tra lần tới" trên phiếu in: mọi xe hẹn bảo dưỡng sau 30 ngày hoặc 5.000 km tính từ lúc nhận xe
const NEXT_CHECK_ITEM = 'Bảo dưỡng & Kiểm tra xe định kỳ: Phanh trước/sau, lốp & áp suất lốp, hệ thống điện, PIN, giảm xóc, '
  + 'cập nhật phần mềm (nếu có).';
const NEXT_CHECK_DAYS = 30;
const NEXT_CHECK_KM = 5000;
function nextCheckFields(receivedAt, odometer) {
  const day = /^\d{4}-\d\d-\d\d/.test(String(receivedAt || '')) ? new Date(`${String(receivedAt).slice(0, 10)}T00:00:00`) : new Date();
  day.setDate(day.getDate() + NEXT_CHECK_DAYS);
  const km = Number(odometer);
  return {
    next_item: NEXT_CHECK_ITEM,
    next_date: `${pad(day.getDate())}/${pad(day.getMonth() + 1)}/${day.getFullYear()}`,
    next_km: Number.isFinite(km) && odometer !== null && odometer !== '' ? `${numf(km + NEXT_CHECK_KM)} km` : `Sau ${numf(NEXT_CHECK_KM)} km`,
  };
}

/** Mở mẫu "Phiếu tiếp nhận sửa chữa" (print-template/phieu-in.html), điền payload rồi in. Dùng chung cho phiếu và Đăng ký tiếp nhận. */
async function openPrintSlip(payload, { autoPrint = true } = {}) {
  const res = await fetch(`/print-template/phieu-in.html?t=${Date.now()}`);
  if (!res.ok) throw new Error('Không tải được mẫu in');
  const html = await res.text();
  await openPrintPreview({
    html,
    title: 'Xem trước phiếu in',
    readyFlag: '__PSC_READY__',
    apply: (win) => {
      if (typeof win.__PSC_APPLY__ === 'function') win.__PSC_APPLY__(payload);
      const own = win.document.getElementById('btnPrint');
      if (own && own.parentElement) own.parentElement.style.display = 'none';
    },
    autoPrint,
  });
}

