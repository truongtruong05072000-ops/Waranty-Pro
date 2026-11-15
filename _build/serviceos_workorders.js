'use strict';
/* global S, $, $$, api, qs, esc, icon, can, fmtDT, fmtD, fmtTime, today, draftStore, preparePhoto, statusBadge, svcLabel, plateHtml, warrantyHtml, money, numf, on, setQuery,
   pager, field, input, textarea, select, checkbox, branchOptions, emptyRow, toast, toastSheetPush, pad, slaBadge, sourceBadge, warrantyBadge, chipSelect,
   parseChips, uploadAttachment, NF, addDays, scanInput, confirmBox, isBusinessCustomer, customerTypeBadge, inspectNqInputs, inspectNqFromData, InspectText,
   batterySerialInputs, applyPinSerials, pinSerialsFromData, staffList, cachedApi, ICONS, drawerIsOpen,
   GM_GRANS, gmParseFilters, gmStringify, gmFilterText, gmDateBucket, gmBucketLabel, gmOpenColMenu, gmOpenFilter, gmOpenPicker, gmToggleOff,
   gmPopup, gmClose, gmItem, gmMenuKeys */

Object.assign(ICONS, {
  tbCols: 'M3 4h18v16H3zM9 4v16M15 4v16',
  moreH: ['M4 12a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0', 'M10.5 12a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0', 'M17 12a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0'],
  chevronUp: 'M18 15l-6-6-6 6',
});
// Esc đóng bảng "Chỉnh sửa cột" / "Chỉnh sửa bộ lọc" (menu cột đang mở tự chặn Esc trước)
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  const side = document.querySelector('.wo-side:not(.hidden)');
  const x = side && side.querySelector('.drawer-x');
  if (x) { e.preventDefault(); x.click(); }
});

// ---------------------------------------------------------------------------
// Danh sách phiếu sửa chữa
// ---------------------------------------------------------------------------
// ----- Số phiếu/trang theo chiều cao cửa sổ -----
// Máy tính: thẻ danh sách cao hết cửa sổ, mặc định 50 dòng/trang (bảng cuộn bên trong);
// người dùng chọn 30/100 hoặc "Tự động" (số dòng vừa khung bảng). Điện thoại: 20 thẻ, trang cuộn tự nhiên.
const woIsDesktop = () => window.innerWidth > 900;
const WO_PS_CHOICES = [30, 50, 100];
const WO_PS_DEFAULT = 50;
const WO_FIT_MIN = 15;
const WO_FIT_MAX = 100;
const woPsKey = () => `woPageSize2:u${S.me.id}`;
/** Số dòng đã chọn; 0 = "Tự động" (chỉ khi người dùng chọn rõ), chưa chọn = 50. */
function woPsPref() {
  const raw = woGridLoad(woPsKey(), null);
  if (raw === 'auto') return 0;
  const v = Number(raw);
  return WO_PS_CHOICES.includes(v) ? v : WO_PS_DEFAULT;
}
const woFitClamp = (n) => Math.max(WO_FIT_MIN, Math.min(WO_FIT_MAX, n));
/** Đo khung bảng đang hiện: chiều cao dành cho dòng (trừ tiêu đề + hàng ô lọc) và chiều cao 1 dòng. */
function woFitMeasure(base) {
  const card = document.querySelector(`#main .wo-list-card[data-base="${base}"]`);
  const wrap = card && card.querySelector('.wo-grid-wrap');
  if (!wrap || !wrap.offsetHeight) return null;
  const head = wrap.querySelector('thead');
  const chips = card.querySelector('.gm-chips');
  const row = wrap.querySelector('tbody tr.clickable:not([hidden])');
  const chipsH = chips ? chips.offsetHeight : 0;
  return {
    avail: wrap.clientHeight - (head ? head.offsetHeight : 0),
    chipsH,
    rowH: row && row.offsetHeight > 20 ? row.offsetHeight : 0,
  };
}
function woFitSave(base, m) {
  const prev = woGridLoad(`woFit:${base}`, {}) || {};
  woGridSave(`woFit:${base}`, {
    chrome: Math.round(window.innerHeight - m.avail - m.chipsH),
    chipsH: m.chipsH || prev.chipsH || 0,
    rowH: m.rowH || prev.rowH || 45,
  });
}
/** Số dòng vừa khung; hasChips = sẽ có hàng ô bộ lọc (chiếm chỗ trong thẻ). */
function woFitPageSize(base, hasChips) {
  if (!woIsDesktop()) return 20;
  const pref = woPsPref();
  if (pref) return pref;
  const c = woGridLoad(`woFit:${base}`, null);
  const chrome = c && c.chrome > 0 ? c.chrome : 420;
  const rowH = c && c.rowH > 20 ? c.rowH : 45;
  const chipsH = hasChips ? (c && c.chipsH) || 44 : 0;
  return woFitClamp(Math.floor((window.innerHeight - chrome - chipsH) / rowH));
}
/** Đổi số dòng/trang mà vẫn giữ dòng đầu đang xem. */
const woKeepPage = (page, oldSize, newSize) => Math.floor(((page - 1) * oldSize) / newSize) + 1;

const WO_FILTER_KEYS = ['status', 'sla', 'warranty', 'age', 'source', 'fault', 'tech', 'from', 'to', 'dfrom', 'dto', 'q', 'service_type', 'parts', 'order', 'mine', 'alert', 'pin_type', 'motor_type', 'coc', 'bh_order_status',
  'f_pin_serial', 'f_motor_serial', 'f_motor_new', 'f_bh_code', 'f_claim', 'f_missing', 'f_diag', 'f_advisor_note', 'f_foreman_note',
  'f_pin_serial_op', 'f_motor_serial_op', 'f_motor_new_op', 'f_bh_code_op', 'f_claim_op', 'f_missing_op', 'f_diag_op', 'f_advisor_note_op', 'f_foreman_note_op',
  'f_removed_at', 'f_factory_at', 'f_repair_at', 'f_handover', 'f_sla_due', 'f_parts',
  'f_code', 'f_ro', 'f_plate', 'f_vin', 'f_content', 'f_code_op', 'f_ro_op', 'f_plate_op', 'f_vin_op', 'f_content_op', 'model', 'f_quote', 'f_recv', 'sort', 'dir', 'group', 'filters', 'fleet'];

// ----- Bảng phiếu kiểu lưới dữ liệu: chọn cột, kéo độ rộng, lọc + sắp xếp theo cột -----
const WO_GRID_VIS_KEY = 'woGridCols3';
const WO_GRID_W_KEY = 'woGridWidths';
const WO_OVERVIEW_VIS_KEY = 'woOverviewCols11';
const WO_OVERVIEW_W_KEY = 'woOverviewWidths4';
// Thứ tự + tên cột 'Tổng hợp' theo chủ xưởng chốt 17/10/2026
const WO_OVERVIEW_VIEWS = {
  summary: {
    label: 'Tổng hợp',
    freeze: 6,
    // 6 cột cố định thu gọn để vùng cuộn còn rộng
    widths: { code: 122, received: 96, vin: 150, plate: 106, model: 76, status: 172 },
    // 18/10: bỏ nhóm cột bảo hành / PIN / động cơ (Trạng thái BH → Ngày gửi nhà máy)
    cols: ['code', 'received', 'vin', 'plate', 'model', 'status', 'diag', 'quote', 'quote_link', 'ro', 'advisor_note', 'handover',
      'repair_at', 'tech', 'foreman_note', 'parts', 'missing', 'sla_due', 'sla'],
    labels: {
      received: 'Ngày nhận xe chờ SC', bh_order_status: 'Trạng thái Lệnh bảo hành',
      foreman_note: 'Ghi chú của Quản đốc & Kỹ thuật viên', advisor_note: 'Ghi chú của CVDV', sla: 'Tình trạng SLA',
      repair_at: 'Ngày sửa chữa', tech: 'KTV sửa chữa',
    },
  },
  warranty: { label: 'Bảo hành', cols: ['received', 'vehicle', 'status', 'warranty', 'pin_serial', 'pin_type', 'motor_serial', 'motor_type', 'bh_code', 'claim', 'bh_order_status', 'parts'] },
  full: { label: 'Đầy đủ', cols: ['received', 'vin', 'plate', 'model', 'status', 'warranty', 'pin_serial', 'pin_type', 'motor_serial',
  'motor_type', 'motor_new', 'coc', 'removed_at', 'bh_code', 'claim', 'bh_order_status', 'factory_at', 'parts', 'missing',
  'repair_at', 'tech', 'diag', 'quote', 'content', 'code', 'ro'] },
};
const woShortDate = (v) => esc(fmtD(v));
// Nhãn đầu dòng "Nội dung kiểm tra" (tên đầy đủ hoặc viết tắt AppSheet) → in đậm, mỗi loại 1 màu
const NQ_LABEL_RE = /^(\s*[-•+]?\s*)(Ngoại quan (?:thay|sơn|kiểm tra|bảo hành|bỏ qua)|Nq thay ngoài|Nq kỹ thuật(?: \(Nqkt\))?|Nq kiểm tra|NQKTRA|NQKT|NQBH|NQBQ|NQT|NQS|Yêu cầu KH)(\s*:)/i;
const NQ_LABEL_CLS = [[/thay ngoài/i, 'nq-out'], [/thay|^nqt$/i, 'nq-rep'], [/sơn|^nqs$/i, 'nq-paint'], [/kiểm tra|^nqktra$/i, 'nq-check'],
  [/bảo hành|^nqbh$/i, 'nq-bh'], [/bỏ qua|^nqbq$/i, 'nq-bq'], [/kỹ thuật|^nqkt$/i, 'nq-tech']];
const NQ_INFO_CLS = { 'Biển số': 'nq-plate', BS: 'nq-plate', 'Số khung': 'nq-vin', SK: 'nq-vin', ODO: 'nq-odo', '% PIN': 'nq-pin',
  'Phụ kiện': 'nq-acc', 'QR ngoài': 'nq-qr', 'QR trong': 'nq-qr', 'Tài xế lấy lại phụ tùng cũ': 'nq-old',
  'Họ và tên tài xế': 'nq-driver', 'Tên TX': 'nq-driver', 'Số điện thoại': 'nq-phone', SĐT: 'nq-phone' };
const NQ_INFO_RE = /(^|\| )(Biển số|BS|Số khung|SK|ODO|% PIN|Phụ kiện|QR ngoài|QR trong|Tài xế lấy lại phụ tùng cũ|Họ và tên tài xế|Tên TX|Số điện thoại|SĐT):/g;
function inspectHtml(t) {
  return String(t).split(/\r?\n/).map((line) => {
    const m = line.match(NQ_LABEL_RE);
    if (!m) return esc(line).replace(NQ_INFO_RE, (_, pre, k) => `${pre}<b class="wo-nq ${NQ_INFO_CLS[k]}">${k}:</b>`);
    const cls = (NQ_LABEL_CLS.find(([re]) => re.test(m[2])) || [0, 'nq-kh'])[1];
    return `${esc(m[1])}<b class="wo-nq ${cls}">${esc(m[2])}${esc(m[3])}</b>${esc(line.slice(m[0].length))}`;
  }).join('\n');
}
const woCellTitle = (v) => (v ? ` title="${esc(v)}"` : '');
/** Cột của bảng phiếu. filter: kiểu ô lọc dưới tiêu đề; sort: khóa sắp xếp phía server. */
const WO_ALERT_OPTS = [
  ['overdue', 'Quá hạn SLA'], ['no_tech', 'Chưa phân KTV'], ['no_handover', 'Chưa có ngày GSM bàn giao'],
  ['wait_approval', 'Chờ duyệt báo giá'], ['no_ro', 'Thiếu lệnh sửa chữa'], ['no_cpsc', 'Chưa có CPSC'],
  ['missing_parts', 'Thiếu phụ tùng'], ['warranty_slow', 'Bảo hành chờ lâu'], ['repair_done_wait', 'Sửa xong – chờ BH'],
  ['done_wait', 'Xong chưa giao'], ['handover_wait', 'Chờ GSM nghiệm thu'],
];
// Bộ cột: Gọn (việc hằng ngày) / Đầy đủ (giống AppSheet)
const WO_COLS_SLIM = ['alert', 'branch', 'code', 'received', 'ro', 'plate', 'model', 'status', 'sla', 'quote', 'tech', 'content', 'warranty'];
// Mẫu chuẩn danh sách Phiếu sửa chữa (chủ xưởng chốt 07/10/2026); Bảo hành tổng hợp giữ bộ cột riêng (WO_COLS_SLIM)
const WO_REPAIR_COLS = ['branch', 'code', 'received', 'plate', 'vin', 'model', 'ro', 'quote', 'status', 'warranty', 'repair_at', 'tech', 'parts', 'handover', 'sla'];
const WO_REPAIR_VIS_KEY = 'woRepairCols1';
const WO_RETAIL_BH_COLS = ['branch', 'code', 'received', 'walkin', 'who', 'plate', 'model', 'status', 'warranty', 'bh_code', 'claim', 'tech', 'repair_at', 'sla'];
const WO_RETAIL_BH_VIS_KEY = 'woRetailBhCols1';
// Phiếu khách lẻ: đối tượng theo đội xe của xe (xe đội GSM / BShip = tài xế tự mang đến)
const WALKIN_LABELS = { retail: 'Khách cá nhân', gsm: 'Tài xế GSM', bship: 'Tài xế BShip' };
const woIsWalkin = (w) => w.source === 'retail' && (w.fleet === 'gsm' || w.fleet === 'bship');
const woWhoName = (w) => (woIsWalkin(w) ? (w.driver_name || '') : (w.customer_name || ''));
const woWhoPhone = (w) => (woIsWalkin(w) ? (w.driver_phone || '') : (w.customer_phone || ''));

/** Lựa chọn [mã, nhãn] từ từ điển meta (nhãn chuỗi hoặc { label }). */
const woDictOpts = (dict) => Object.entries(dict || {}).map(([k, v]) => [k, v && typeof v === 'object' ? v.label : v]);
function woGridColumns(techs) {
  // ff: kiểu lọc ở menu cột (text | enum | date | number | sla | alert); raw: giá trị gốc để nhóm; glabel: nhãn nhóm
  const T = { type: 'text' };
  const D = { type: 'date' };
  const en = (dict) => ({ ff: { type: 'enum', opts: woDictOpts(dict) }, glabel: (k) => dictLabel(dict, k) });
  const statusOpts = Object.entries(S.meta.wo_statuses).filter(([k]) => k !== 'qc').map(([k, v]) => [k, v.label]);
  const models = [...new Set([...(S.meta.models || []), ...(S.meta.gsm_models || [])])].map((m) => [m, m]);
  const svcDict = Object.fromEntries(Object.entries(S.meta.service_types).filter(([k]) => k !== 'warranty' || /^#\/warranty-orders/.test(window.location.hash)));
  return [
    { id: 'stt', label: 'STT', w: 48, optional: true,
      cell: (w) => `<span class="wo-stt">${w._stt || ''}</span>` },
    { id: 'alert', label: 'Cảnh báo', w: 190,
      ff: { type: 'alert', opts: WO_ALERT_OPTS, noEmpty: true },
      cell: (w) => ((w.alerts || []).length
        ? (w.alerts || []).map((a) => `<span class="wo-alert t-${a.tone}"${woCellTitle(a.hint)}>${esc(a.label)}</span>`).join(' ')
        : '<span class="muted">—</span>') },
    { id: 'branch', label: 'Cơ sở', w: 80, sort: 'branch', ff: { type: 'enum', opts: (S.meta.branches || []).map((b) => [b.code, `${b.code} – ${b.name}`]), noEmpty: true },
      raw: (w) => w.branch_code, cell: (w) => esc(w.branch_code || '') },
    { id: 'code', label: 'Mã phiếu', w: 158, sort: 'code', ff: T, raw: (w) => w.code,
      cell: (w) => `<span class="t-title">${esc(w.code)}</span>${w.priority === 'urgent' ? ' <span class="tag urgent">Gấp</span>' : ''}` },
    { id: 'received', label: 'Ngày nhận xe', w: 122, sort: 'received', kind: 'date', ff: D, raw: (w) => w.received_at,
      cell: (w) => `<span${woCellTitle(fmtDT(w.received_at))}>${woShortDate(w.received_at)}</span>` },
    { id: 'ro', label: 'Lệnh sửa chữa', w: 200, sort: 'ro', ff: T, raw: (w) => w.dms_ro_code,
      cell: (w) => (w.dms_ro_code ? `<span class="mono small">${esc(w.dms_ro_code)}</span>` : '<span class="muted">—</span>') },
    { id: 'plate', label: 'Biển số', w: 128, sort: 'plate', ff: T, raw: (w) => w.plate, cell: (w) => plateHtml(w.plate) },
    { id: 'vin', label: 'Số khung', w: 180, sort: 'vin', ff: T, raw: (w) => w.vin, cell: (w) => `<span class="mono small">${esc(w.vin || '')}</span>` },
    { id: 'model', label: 'Loại xe', w: 90, sort: 'model', ff: { type: 'enum', opts: models }, raw: (w) => w.model, cell: (w) => esc(w.model || '') },
    { id: 'walkin', label: 'Đối tượng', w: 125, optional: true, raw: (w) => w.fleet,
      cell: (w) => (w.source === 'retail' ? `<span class="badge plain ${woIsWalkin(w) ? 'b-blue' : 'b-violet'}">${esc(WALKIN_LABELS[w.fleet] || WALKIN_LABELS.retail)}</span>` : '<span class="muted">—</span>') },
    { id: 'who', label: 'Khách hàng / tài xế', w: 190, optional: true,
      cell: (w) => { const nm = woWhoName(w); const ph = woWhoPhone(w); return nm || ph ? `<div class="wo-who"><span class="wo-who-n"${woCellTitle(nm)}>${esc(nm || '—')}</span>${ph ? `<span class="wo-who-p">${esc(ph)}</span>` : ''}</div>` : '<span class="muted">—</span>'; } },
    { id: 'vehicle', label: 'Xe', w: 255, sort: 'plate', ff: T, raw: (w) => w.plate, optional: true,
      cell: (w) => `<span class="wo-vehicle-main">${plateHtml(w.plate)}<span class="wo-vehicle-model">${esc(w.model || '')}</span></span><span class="wo-vehicle-vin mono"${woCellTitle(w.vin)}>${esc(w.vin || 'Chưa có số khung')}</span>` },
    { id: 'status', label: 'Trạng thái', w: 185, sort: 'status', ff: { type: 'enum', opts: statusOpts, noEmpty: true },
      raw: (w) => w.status, glabel: (k) => dictLabel(S.meta.wo_statuses, k), cell: (w) => statusBadge(w.status, w.source) },
    { id: 'sla', label: 'SLA', w: 175, sort: 'sla', kind: 'date', raw: (w) => w.sla_due_at,
      ff: { type: 'sla', opts: [['overdue', 'Quá hạn'], ['warning', 'Sắp quá hạn'], ['ok', 'Trong hạn'], ['not_counted', 'Chưa bàn giao']], noEmpty: true },
      cell: (w) => slaBadge(w.sla) },
    { id: 'quote', label: 'CPSC', w: 110, sort: 'quote', align: 'right', kind: 'number', ff: { type: 'number' },
      raw: (w) => w.quote_amount, glabel: (k) => (k ? money(k) : ''),
      cell: (w) => (w.quote_amount ? money(w.quote_amount) : w.quote_amount === 0 ? '<span class="muted">Không phát sinh</span>' : '<span class="muted">—</span>') },
    // Xe GSM / BShip chia thanh toán khách + GSM
    { id: 'cust_pay_ro', label: 'Lệnh SC khách hàng', w: 170, ff: T, raw: (w) => w.cust_pay_ro, optional: true,
      cell: (w) => (w.cust_pay_ro ? `<span class="mono">${esc(w.cust_pay_ro)}</span>` : '<span class="muted">—</span>') },
    { id: 'cust_pay_note', label: 'Nội dung khách hàng thanh toán', w: 200, ff: T, raw: (w) => w.cust_pay_note, optional: true,
      cell: (w) => (w.cust_pay_note ? `<span class="t-sub"${woCellTitle(w.cust_pay_note)}>${esc(w.cust_pay_note)}</span>` : '<span class="muted">—</span>') },
    { id: 'cust_pay', label: 'Khách hàng thanh toán', w: 120, align: 'right', kind: 'number', raw: (w) => w.cust_pay_amount, optional: true,
      cell: (w) => (w.cust_pay_amount != null ? money(w.cust_pay_amount) : '<span class="muted">—</span>') },
    { id: 'gsm_pay_note', label: 'Nội dung công ty thanh toán', w: 200, ff: T, raw: (w) => w.gsm_pay_note, optional: true,
      cell: (w) => (w.gsm_pay_note ? `<span class="t-sub"${woCellTitle(w.gsm_pay_note)}>${esc(w.gsm_pay_note)}</span>` : '<span class="muted">—</span>') },
    { id: 'gsm_pay', label: 'Công ty thanh toán', w: 120, align: 'right', kind: 'number', raw: (w) => w.gsm_pay_amount, optional: true,
      cell: (w) => (w.gsm_pay_amount != null ? money(w.gsm_pay_amount) : '<span class="muted">—</span>') },
    { id: 'service', label: 'Loại sửa chữa', w: 120, sort: 'service', ...en(svcDict), raw: (w) => w.service_type, glabel: (k) => (k ? svcLabel(k) : ''),
      cell: (w) => esc(svcLabel(w.service_type)) },
    { id: 'advisor_note', label: 'Ghi chú CVDV', w: 180, sort: 'advisor_note', ff: T, raw: (w) => w.advisor_note,
      cell: (w) => (w.advisor_note ? `<span class="t-sub"${woCellTitle(w.advisor_note)}>${esc(w.advisor_note)}</span>` : '<span class="muted">—</span>') },
    { id: 'foreman_note', label: 'Ghi chú KTV', w: 180, sort: 'foreman_note', ff: T, raw: (w) => w.foreman_note,
      cell: (w) => (w.foreman_note ? `<span class="t-sub"${woCellTitle(w.foreman_note)}>${esc(w.foreman_note)}</span>` : '<span class="muted">—</span>') },
    { id: 'tech', label: 'KTV sửa chữa, bảo hành', w: 170, sort: 'tech', ff: { type: 'enum', opts: techs.map((t) => [t.id, t.full_name]) }, raw: (w) => w.technician_name,
      cell: (w) => (w.technician_name ? esc(w.technician_name) : '<span class="muted">—</span>') },
    { id: 'content', label: 'Hạng mục lỗi', w: 220, ff: T,
      cell: (w) => { const t = [w.source === 'retail' ? w.customer_name : '', w.faults.length ? w.faults.join(', ') : (w.symptoms || '')].filter(Boolean).join(' · '); return `<span class="t-sub"${woCellTitle(t)}>${esc(t)}</span>`; } },
    { id: 'warranty', label: 'Trạng thái bảo hành', w: 170, sort: 'warranty', ...en(S.meta.warranty_statuses), raw: (w) => w.warranty_status,
      cell: (w) => (w.warranty_status && S.meta.warranty_statuses[w.warranty_status] ? warrantyBadge(w.warranty_status) : '') },
    // ----- Cột theo AppSheet "Thông tin sửa chữa" -----
    { id: 'pin_serial', label: 'Serial PIN', w: 200, sort: 'pin_serial', ff: T, raw: (w) => w.battery_serial_old, cell: (w) => txtCell(w.battery_serial_old, 'mono small') },
    { id: 'pin_type', label: 'Loại sửa chữa PIN', w: 160, sort: 'pin_type', ...en(S.meta.battery_repair_types), raw: (w) => w.battery_repair_type, cell: (w) => txtCell(dictLabel(S.meta.battery_repair_types, w.battery_repair_type)) },
    { id: 'motor_serial', label: 'Số máy động cơ', w: 170, sort: 'motor_serial', ff: T, raw: (w) => w.motor_serial_old, cell: (w) => txtCell(w.motor_serial_old, 'mono small') },
    { id: 'motor_type', label: 'Loại sửa chữa động cơ', w: 170, sort: 'motor_type', ...en(S.meta.motor_repair_types), raw: (w) => w.motor_repair_type, cell: (w) => txtCell(dictLabel(S.meta.motor_repair_types, w.motor_repair_type)) },
    { id: 'motor_new', label: 'Số máy động cơ mới', w: 170, sort: 'motor_new', ff: T, raw: (w) => w.motor_serial_new, cell: (w) => txtCell(w.motor_serial_new, 'mono small') },
    { id: 'coc', label: 'Trạng thái COC', w: 120, sort: 'coc', ...en(S.meta.coc_statuses), raw: (w) => w.coc_status, cell: (w) => txtCell(dictLabel(S.meta.coc_statuses, w.coc_status)) },
    { id: 'removed_at', label: 'Ngày tháo PIN/Động cơ', w: 150, sort: 'removed_at', kind: 'date', ff: D, raw: (w) => w.parts_removed_at || w.motor_removed_at, cell: (w) => txtCell(woShortDate(w.parts_removed_at || w.motor_removed_at)) },
    { id: 'bh_code', label: 'Lệnh bảo hành', w: 200, sort: 'bh_code', ff: T, raw: (w) => w.dms_warranty_code, cell: (w) => txtCell(w.dms_warranty_code, 'mono small') },
    { id: 'claim', label: 'Số ĐXBH', w: 150, sort: 'claim', ff: T, raw: (w) => w.dms_claim_code, cell: (w) => txtCell(w.dms_claim_code, 'mono small') },
    { id: 'bh_order_status', label: 'Trạng thái lệnh bảo hành', w: 170, sort: 'bh_order_status', ...en(S.meta.dms_warranty_statuses), raw: (w) => w.dms_warranty_status, cell: (w) => txtCell(dictLabel(S.meta.dms_warranty_statuses, w.dms_warranty_status)) },
    { id: 'factory_at', label: 'Ngày gửi nhà máy', w: 130, sort: 'factory_at', kind: 'date', ff: D, raw: (w) => w.sent_factory_at, cell: (w) => txtCell(woShortDate(w.sent_factory_at)) },
    { id: 'parts', label: 'Trạng thái xuất kho', w: 160, sort: 'parts', ...en(S.meta.parts_statuses), raw: (w) => w.parts_status,
      cell: (w) => { const p = (S.meta.parts_statuses || {})[w.parts_status]; return p ? `<span class="badge b-${p.color}">${esc(p.label)}</span>` : txtCell(''); } },
    { id: 'missing', label: 'Mã phụ tùng thiếu', w: 170, sort: 'missing', ff: T, raw: (w) => w.missing_parts, cell: (w) => txtCell(w.missing_parts) },
    { id: 'repair_at', label: 'Ngày sửa chữa/Bảo hành', w: 150, sort: 'repair_at', kind: 'date', ff: D, raw: (w) => w.repair_done_at || w.completed_at || w.started_at, cell: (w) => txtCell(woShortDate(w.repair_done_at || w.completed_at || w.started_at)) },
    // Nội dung kiểm tra (như cột trên Google Sheet): ngoại quan, ghi chú, yêu cầu KH, chẩn đoán; tối đa 3 dòng, di chuột xem đủ
    { id: 'diag', label: 'Nội dung kiểm tra', w: 320, sort: 'diag', ff: T, raw: (w) => w.inspect_summary || w.diagnosis,
      cell: (w) => { const t = w.inspect_summary || w.diagnosis; return t ? `<div class="wo-nq-text">${inspectHtml(t)}</div>` : '<span class="muted">—</span>'; } },
    { id: 'handover', label: 'Ngày GSM bàn giao SC', w: 150, sort: 'handover', kind: 'date', ff: D, raw: (w) => w.gsm_handover_at, cell: (w) => txtCell(woShortDate(w.gsm_handover_at)) },
    { id: 'updated', label: 'Update', w: 140, sort: 'updated', kind: 'date', ff: D, raw: (w) => w.updated_at, cell: (w) => txtCell(w.updated_at ? fmtDT(w.updated_at) : '') },
    { id: 'sla_due', label: 'Hạn chót SLA (Dự kiến)', w: 150, sort: 'sla_due', kind: 'date', ff: D, raw: (w) => w.sla_due_at, cell: (w) => txtCell(woShortDate(w.sla_due_at)) },
    { id: 'promised', label: 'Hẹn trả lại xe', w: 120, sort: 'promised', kind: 'date', ff: D, raw: (w) => w.promised_at, optional: true,
      cell: (w) => txtCell(woShortDate(w.promised_at)) },
    { id: 'phone', label: 'Số điện thoại', w: 120, ff: T, raw: (w) => w.driver_phone || w.customer_phone, optional: true,
      cell: (w) => { const p = w.driver_phone || w.customer_phone; return p ? telLink(p, { e: 'work_order', id: w.id, name: w.driver_name || w.customer_name }, 'wo-sheet-a') : '<span class="muted">—</span>'; } },
    { id: 'odo', label: 'ODO', w: 72, sort: 'odo', align: 'right', kind: 'number', ff: { type: 'number' }, raw: (w) => w.odometer, optional: true,
      cell: (w) => (w.odometer || w.odometer === 0 ? esc(String(w.odometer)) : '<span class="muted">—</span>') },
    { id: 'pin', label: '% PIN', w: 80, sort: 'pin', align: 'right', optional: true,
      cell: (w) => txtCell(w.pin_text) },
    { id: 'charger', label: 'Serial sạc', w: 160, ff: T, raw: (w) => w.charger_serial, optional: true,
      cell: (w) => txtCell(w.charger_serial, 'mono small') },
    { id: 'inspect', label: 'Nội dung kiểm tra (kèm tài xế, xe)', w: 420, ff: T, optional: true,
      cell: (w) => (w.inspect_summary ? `<div class="wo-sheet-wrap">${inspectHtml(w.inspect_summary)}</div>` : '<span class="muted">—</span>') },
    { id: 'quote_link', label: 'Link báo giá', w: 200, optional: true,
      cell: (w) => (w.quote_url ? `<a class="wo-sheet-a" href="${esc(safeUrl(w.quote_url))}" target="_blank" rel="noopener">${esc(w.quote_url)}</a>` : '<span class="muted">—</span>') },
    { id: 'recv_by', label: 'Người tiếp nhận', w: 150, optional: true,
      cell: (w) => txtCell(w.created_by_name || w.advisor_name) },
    { id: 'last_by', label: 'Người thay đổi cuối cùng', w: 170, optional: true,
      cell: (w) => txtCell(w.last_changed_by_name || w.created_by_name) },
  ];
}
// Ô chữ thường: rỗng → "—", dài → rút gọn, rê chuột xem đủ
function txtCell(v, cls = '') {
  const t = v === null || v === undefined ? '' : String(v);
  return t ? `<span class="${cls}"${woCellTitle(t)}>${esc(t)}</span>` : '<span class="muted">—</span>';
}
function dictLabel(dict, k) {
  if (!k) return '';
  const v = (dict || {})[k];
  return v ? (typeof v === 'object' ? v.label : v) : k;
}
function woGridLoad(key, def) {
  try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v || def; } catch { return def; }
}
function woGridSave(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
}
/** Khoảng ngày nhận theo lựa chọn nhanh ở cột "Ngày nhận xe". */
function woRecvRange(v) {
  const t = today();
  if (v === 'today') return { from: t, to: t };
  if (v === '7') return { from: addDays(t, -6), to: t };
  if (v === '30') return { from: addDays(t, -29), to: t };
  if (v === 'month') return { from: `${t.slice(0, 8)}01`, to: t };
  return { from: '', to: '' };
}

// Nhóm đang thu gọn (theo danh sách + cách nhóm) — giữ trong phiên khi đổi trang / lọc
const WO_COLLAPSED = new Map();
/**
 * Chia các phiếu của trang thành nhóm liền nhau theo cột nhóm.
 * grp: { col, gran, counts: Map(khóa → số phiếu toàn bộ kết quả), collapsed: Set }
 */
function woGroupRows(rows, grp) {
  const keyOf = (w) => {
    const v = grp.col.raw ? grp.col.raw(w) : '';
    if (grp.col.kind === 'date') return gmDateBucket(v, grp.gran);
    return v === null || v === undefined ? '' : String(v);
  };
  const label = (k) => {
    if (grp.col.kind === 'date') return gmBucketLabel(k, grp.gran);
    return (k && (grp.col.glabel ? grp.col.glabel(k) : k)) || '(Trống)';
  };
  const groups = [];
  rows.forEach((w) => {
    const k = keyOf(w);
    const last = groups[groups.length - 1];
    if (last && last.k === k) last.rows.push(w); else groups.push({ k, rows: [w] });
  });
  return groups.map((g, i) => ({ ...g, i, label: label(g.k), total: grp.counts.has(g.k) ? grp.counts.get(g.k) : g.rows.length, closed: grp.collapsed.has(g.k) }));
}
/** Dòng dữ liệu; khi nhóm theo 1 cột thì chèn dòng tiêu đề nhóm (bấm để thu gọn / mở). */
function woGridBody(rows, cols, grp, base = '#/work-orders', start = 1) {
  const rowHtml = (w, g, n) => `<tr class="clickable" data-click="go" data-href="${base}/${w.id}"${g ? ` data-gi="${g.i}"${g.closed ? ' hidden' : ''}` : ''}>
    ${cols.map((c) => `<td class="${[c.align === 'right' ? 'num' : '', c.id === 'inspect' ? 'wo-inspect' : '', c.id === 'stt' ? 'wo-stt-td' : ''].filter(Boolean).join(' ')}" data-col="${c.id}">${c.cell({ ...w, _stt: n })}</td>`).join('')}</tr>`;
  let n = start;
  if (!grp) return rows.map((w) => rowHtml(w, null, n++)).join('');
  return woGroupRows(rows, grp).map((g) => `<tr class="grid-group-row${g.closed ? ' closed' : ''}" data-click="wo-grp" data-gi="${g.i}" data-k="${esc(g.k)}" tabindex="0" aria-expanded="${!g.closed}">
    <td colspan="${cols.length}"><span class="gm-grp-caret">${icon('chevronDown')}</span><span class="gm-grp-col">${esc(grp.col.label)}:</span> <b>${esc(g.label)}</b> <span class="gm-grp-n">${NF.format(g.total)}</span></td></tr>${g.rows.map((w) => rowHtml(w, g, n++)).join('')}`).join('');
}

function woQuickTabs() {
  return [
    ...(can('wo.work') || can('wo.inspect') ? [['Việc của tôi', { mine: 1, status: 'active' }]] : []),
    ...(can('wo.approve') ? [
      ['Chờ GSM xác nhận', { status: 'waiting_approval', source: 'gsm' }],
      ['Chờ nghiệm thu', { status: 'awaiting_handover' }],
      ['Đã nghiệm thu', { status: 'gsm_received' }],
    ] : []),
    ['Trong xưởng', { status: 'active' }],
    ['GSM trả về', { status: 'gsm_rejected' }],
    ['Quá hạn', { sla: 'overdue', order: 'sla' }],
    ['Chờ sửa', { status: 'waiting_repair' }],
    ['Đang sửa', { status: 'in_progress' }],
    ['Sửa xong – chờ BH', { status: 'repair_done' }],
    ['Hoàn thành', { status: 'done' }],
    ['Tất cả', {}],
  ];
}

let woLastListHash = null;
/** Biểu tượng từng loại cảnh báo trên thanh "Cần xử lý ngay" (khóa trùng ALERT_DEFS ở server). */
const WO_ALERT_ICONS = {
  overdue: 'clock', parts_ready: 'package', parts_transfer: 'truck', no_tech: 'userPlus', no_handover: 'calendar',
  wait_approval: 'clipCheck', no_ro: 'file', no_cpsc: 'sheet', missing_parts: 'box', warranty_slow: 'shield',
  repair_done_wait: 'wrench', done_wait: 'badgeCheck', handover_wait: 'users',
};

async function pageWoList(ctx) {
  const q = ctx.query;
  // Cùng 1 bảng cho "Phiếu sửa chữa" và "Phiếu bảo hành" (chỉ phiếu bảo hành)
  const isWarrantyList = ctx.path === '/warranty-orders';
  const isOverview = ctx.path === '/work-orders-overview';
  const isRetailList = ctx.path === '/retail-orders';
  const isBshipList = ctx.path === '/bship-orders';
  const isRetailBh = ctx.path === '/retail-warranty';
  // Phiếu sửa chữa = chỉ xe Green SM; khách lẻ có danh sách riêng. Danh sách tổng quan = đúng tập Phiếu sửa chữa GSM.
  // ?src=all (link từ Tổng quan): Phiếu SC mọi nguồn để số khớp thẻ KPI
  const allSrc = ctx.path === '/work-orders' && q.get('src') === 'all';
  const lockSrc = isRetailList || isRetailBh ? 'retail' : isBshipList ? 'bship' : (!isWarrantyList && !allSrc ? 'gsm' : '');
  const overviewView = isOverview && Object.hasOwn(WO_OVERVIEW_VIEWS, q.get('view')) ? q.get('view') : 'summary';
  const base = isOverview ? '#/work-orders-overview' : isWarrantyList ? '#/warranty-orders' : isRetailList ? '#/retail-orders'
    : isRetailBh ? '#/retail-warranty' : isBshipList ? '#/bship-orders' : '#/work-orders';
  // ?src=all&kind=all: số tổng của thẻ KPI (cả phiếu SC + BH) → không lọc loại phiếu
  const allKind = allSrc && q.get('kind') === 'all';
  const listKind = isWarrantyList ? 'warranty' : isRetailBh ? 'bh' : allKind ? '' : 'repair';
  const detailBase = isOverview ? '#/work-orders' : base;
  // Cột / độ rộng / nhóm lưu theo từng tài khoản + từng danh sách (khóa cũ không có :u<id> dùng làm mặc định)
  const userKey = (k) => `${k}:u${S.me.id}`;
  const legacyVisKey = isOverview ? `${WO_OVERVIEW_VIS_KEY}:${overviewView}` : isWarrantyList ? WO_GRID_VIS_KEY : isRetailBh ? WO_RETAIL_BH_VIS_KEY : WO_REPAIR_VIS_KEY;
  const legacyWidthKey = isOverview ? `${WO_OVERVIEW_W_KEY}:${overviewView}` : WO_GRID_W_KEY;
  const visKey = userKey(legacyVisKey);
  const widthKey = userKey(legacyWidthKey);
  const groupKey = userKey(`woGroup:${isOverview ? `overview:${overviewView}` : base.slice(2)}`);
  [[visKey, legacyVisKey], [widthKey, legacyWidthKey]].forEach(([k, old]) => {
    try {
      const v = localStorage.getItem(old);
      if (v === null) return;
      if (localStorage.getItem(k) === null) localStorage.setItem(k, v);
      localStorage.removeItem(old);
    } catch { /* ignore */ }
  });
  // Nhớ tab / bộ lọc / trang đang xem → nút ← trong chi tiết phiếu quay về đúng chỗ
  try { sessionStorage.setItem(`woListHash:${detailBase}`, window.location.hash || base); } catch { /* ignore */ }
  const f = Object.fromEntries(WO_FILTER_KEYS.map((k) => [k, q.get(k) || '']));
  f.status = (S.meta.legacy_wo_statuses || {})[f.status] || f.status;
  if (lockSrc) f.source = lockSrc;
  // Nhóm theo: trong URL (Back / tải lại giữ nguyên); không có thì dùng cách nhóm đã lưu của danh sách này
  if (!q.has('group')) f.group = woGridLoad(groupKey, '') || '';
  // Bộ lọc theo cột: chỉ giữ cột có trong bảng
  const filterIds = new Set(woGridColumns([]).filter((c) => c.ff).map((c) => c.id));
  const flt = gmParseFilters(f.filters).filter((x) => filterIds.has(x.col));
  f.filters = gmStringify(flt);
  const page = Number(q.get('page')) || 1;
  const hasChips = !!(flt.length || f.group || f.fault || f.from || f.to || f.dfrom || f.dto || (f.source && !lockSrc && f.status !== 'waiting_approval'));
  const pageSize = woFitPageSize(base, hasChips);
  // Sắp xếp / lọc / đổi trang chỉ gọi lại danh sách; nhân viên, cảnh báo, tổng hợp BH lấy từ bộ đệm
  // (cảnh báo/tổng hợp tự làm mới sau 60 giây hoặc ngay khi có thao tác ghi dữ liệu)
  const listQs = qs({ ...f, technician_id: f.tech, tech: '', f_recv: '', branch_id: S.branch, kind: listKind, fleet: isRetailBh ? f.fleet : '' });
  const [d, techs, bhSum, alertSum, walkinSum] = await Promise.all([
    api('GET', `/api/work-orders${qs({ ...f, technician_id: f.tech, tech: '', f_recv: '', branch_id: S.branch, page, page_size: pageSize, kind: listKind, fleet: isRetailBh ? f.fleet : '' })}`, null, { signal: ctx.signal }),
    staffList(S.branch),
    isWarrantyList ? cachedApi(`/api/warranty-summary${qs({ branch_id: S.branch })}`).catch(() => null) : Promise.resolve(null),
    // Danh sách tổng quan không có thanh "Cần xử lý ngay" (chủ xưởng bỏ 18/10)
    isOverview ? Promise.resolve(null) : cachedApi(`/api/work-orders/alerts${qs({ branch_id: S.branch, kind: allKind ? '' : listKind || 'repair', source: lockSrc })}`).catch(() => null),
    isRetailBh ? cachedApi(`/api/work-orders/walkin-summary${qs({ branch_id: S.branch })}`).catch(() => null) : Promise.resolve(null),
  ]);
  if (ctx.stale()) return;
  const showBranch = can('branch.all') && !S.branch;
  if (!drawerIsOpen()) document.body.classList.remove('drawer-open');
  // Dạng xem (thay hàng tab): cùng tham số URL như các tab cũ → link cũ / chip cảnh báo vẫn đúng
  const viewKeys = ['status', 'sla', 'age', 'order', 'mine', 'source'];
  const views = isOverview
    ? Object.entries(WO_OVERVIEW_VIEWS).map(([id, v]) => ({ label: v.label, id, cur: id === overviewView }))
    : woQuickTabs().filter(([, params]) => !(isRetailList || isRetailBh) || !['waiting_approval', 'awaiting_handover', 'gsm_received', 'gsm_rejected'].includes(params.status)).map(([label, params]) => {
      const p = { source: f.source, ...params, ...(lockSrc ? { source: lockSrc } : {}), ...(isRetailBh && f.fleet ? { fleet: f.fleet } : {}) };
      if (isBshipList) label = label.replace('GSM', 'BShip');
      return { label, params, href: `${base}${qs(p)}`, cur: viewKeys.every((k) => String(p[k] || '') === String(f[k] || '')) };
    });
  const curView = views.find((v) => v.cur) || null;
  const viewTitle = curView ? (curView.label === 'Tất cả' ? 'Tất cả phiếu' : curView.label)
    : f.status ? dictLabel(S.meta.wo_statuses, f.status) : 'Phiếu đã lọc';
  const srcInView = !!(curView && curView.params && Object.hasOwn(curView.params, 'source'));
  const cardHtml = (w, g) => `<a class="m-card" href="${detailBase}/${w.id}"${g ? ` data-gi="${g.i}"${g.closed ? ' hidden' : ''}` : ''}>
      <div class="m-card-top">
        <div class="m-card-title mono">${esc(w.code)}</div>
        <div class="m-card-meta">${statusBadge(w.status, w.source)}</div>
      </div>
      <div class="m-card-line">${plateHtml(w.plate)}${w.model ? ` · ${esc(w.model)}` : ''}${w.priority === 'urgent' ? ' <span class="tag urgent">Gấp</span>' : ''}</div>
      ${w.source === 'retail' && woWhoName(w) ? `<div class="m-card-line">${woIsWalkin(w) ? `<span class="badge plain b-blue">${esc(WALKIN_LABELS[w.fleet])}</span> ` : ''}${esc(woWhoName(w))}</div>` : ''}
      <div class="m-card-line muted">${esc(String(w.faults.length ? w.faults.join(', ') : (w.symptoms || '—')).slice(0, 80))}</div>
      <div class="m-card-foot">
        <div class="m-card-foot-meta">
          ${showBranch ? `<span>${esc(w.branch_code || '')}</span>` : ''}
          <span>${w.technician_name ? esc(w.technician_name) : 'Chưa KTV'}</span>
          <span>${fmtD(w.received_at)}</span>
        </div>
        <div>${slaBadge(w.sla)}</div>
      </div>
    </a>`;

  // Cột hiển thị (lưu theo trình duyệt) + độ rộng đã kéo
  const viewLabels = (isOverview && WO_OVERVIEW_VIEWS[overviewView].labels) || {};
  const viewWidths = (isOverview && WO_OVERVIEW_VIEWS[overviewView].widths) || {};
  const allCols = woGridColumns(techs).map((c) => (viewLabels[c.id] || viewWidths[c.id]
    ? { ...c, label: viewLabels[c.id] || c.label, w: viewWidths[c.id] || c.w } : c));
  const defVisible = (isOverview ? WO_OVERVIEW_VIEWS[overviewView].cols : isWarrantyList ? WO_COLS_SLIM : isRetailBh ? WO_RETAIL_BH_COLS : WO_REPAIR_COLS).filter((id) => allCols.some((c) => c.id === id));
  let visIds = woGridLoad(visKey, defVisible).filter((id) => allCols.some((c) => c.id === id));
  if (!visIds.length) visIds = defVisible;
  // Bảo hành tổng hợp: cột mặc định mới thêm sau này tự hiện (kể cả với người đã lưu cách chọn cột cũ)
  const seen = isWarrantyList ? woGridLoad('woGridSeen', null) : null;
  if (isWarrantyList && seen) {
    const fresh = defVisible.filter((id) => !seen.includes(id) && !visIds.includes(id));
    if (fresh.length) { visIds = [...visIds, ...fresh]; woGridSave(visKey, visIds); }
  } else if (isWarrantyList && localStorage.getItem(visKey)) {
    // Lần đầu có danh sách "đã thấy": coi các cột trước bản ghi chú là đã thấy
    const fresh = ['advisor_note', 'foreman_note'].filter((id) => !visIds.includes(id));
    if (fresh.length) { visIds = [...visIds, ...fresh]; woGridSave(visKey, visIds); }
  }
  if (isWarrantyList) woGridSave('woGridSeen', allCols.map((c) => c.id));
  // visIds giữ cả thứ tự cột (di chuyển trái/phải)
  const cols = visIds.map((id) => allCols.find((c) => c.id === id)).filter(Boolean);
  // Nhóm: "<khóa sắp xếp>" hoặc "<khóa>:day|week|month|year" (cột ngày)
  const [groupSort, groupGran] = String(f.group || '').split(':');
  const groupCol = (groupSort && (cols.find((c) => c.sort === groupSort) || allCols.find((c) => c.sort === groupSort))) || null;
  const gran = groupCol && groupCol.kind === 'date' ? (GM_GRANS.some(([g]) => g === groupGran) ? groupGran : 'day') : '1';
  const collapseKey = `${groupKey}|${f.group}`;
  if (!WO_COLLAPSED.has(collapseKey)) WO_COLLAPSED.set(collapseKey, new Set());
  let grp = null;
  if (groupCol) {
    const counts = new Map();
    (d.groups || []).forEach((r) => {
      const k = groupCol.kind === 'date' ? gmDateBucket(r.k, gran) : (r.k === null || r.k === undefined ? '' : String(r.k));
      counts.set(k, (counts.get(k) || 0) + Number(r.c || 0));
    });
    grp = { col: groupCol, gran, counts, collapsed: WO_COLLAPSED.get(collapseKey) };
  }
  const cards = !d.rows.length ? '<div class="muted small" style="padding:16px;text-align:center">Không tìm thấy phiếu phù hợp</div>'
    : grp ? woGroupRows(d.rows, grp).map((g) => `<div class="m-group-head${g.closed ? ' closed' : ''}" data-click="wo-grp" data-gi="${g.i}" data-k="${esc(g.k)}" role="button" tabindex="0" aria-expanded="${!g.closed}">
        <span class="gm-grp-caret">${icon('chevronDown')}</span><span class="gm-grp-col">${esc(groupCol.label)}:</span> <b>${esc(g.label)}</b> <span class="gm-grp-n">${NF.format(g.total)}</span></div>${g.rows.map((w) => cardHtml(w, g)).join('')}`).join('')
      : d.rows.map((w) => cardHtml(w)).join('');
  const widths = woGridLoad(widthKey, {});
  const colW = (c) => Math.max(50, Number(widths[c.id]) || c.w);
  const tableW = cols.reduce((a, c) => a + colW(c), 0);
  // Vẽ lại cùng trang (đổi trang / lọc / sắp xếp): dùng sẵn bề rộng khung cũ để cột không nhảy,
  // và giữ vị trí đang kéo ngang
  const preWrap = document.querySelector('.wo-grid-wrap');
  const preAvail = preWrap ? preWrap.clientWidth : 0;
  const preLeft = preWrap ? preWrap.scrollLeft : 0;
  // Vẽ lại đúng danh sách đang xem (VD đóng bảng trượt sau khi lưu phiếu): giữ cả vị trí cuộn dọc.
  // Đổi lọc / sắp xếp / trang (địa chỉ khác) thì về đầu bảng như bình thường.
  const sameView = woLastListHash === window.location.hash;
  woLastListHash = window.location.hash;
  const preTop = sameView && preWrap ? preWrap.scrollTop : 0;
  const mainEl = document.getElementById('main');
  const preMainTop = sameView && preWrap && mainEl ? mainEl.scrollTop : 0;
  const preScale = (!isOverview && preAvail) ? Math.max(1, preAvail / tableW) : 1;
  const sortDirOf = (c) => (c.sort && f.sort === c.sort ? (f.dir === 'desc' ? 'desc' : 'asc') : '');
  const fltOf = (c) => flt.find((x) => x.col === c.id) || null;
  // Ô bộ lọc đang áp dụng (bấm để sửa, × để bỏ) + nhóm đang dùng
  const quick = [];
  if (f.source && !srcInView && !lockSrc) quick.push(['source', `Nguồn xe: ${dictLabel(S.meta.sources, f.source)}`]);
  if (f.fault) quick.push(['fault', `Hạng mục lỗi: ${f.fault}`]);
  if (f.from || f.to) quick.push(['date', `Ngày nhận xe: ${f.from && f.to ? `${fmtD(f.from)} – ${fmtD(f.to)}` : f.from ? `từ ${fmtD(f.from)}` : `đến ${fmtD(f.to)}`}`]);
  if (f.dfrom || f.dto) quick.push(['ddate', `Ngày giao xe: ${f.dfrom && f.dto ? (f.dfrom === f.dto ? fmtD(f.dfrom) : `${fmtD(f.dfrom)} – ${fmtD(f.dto)}`) : f.dfrom ? `từ ${fmtD(f.dfrom)}` : `đến ${fmtD(f.dto)}`}`]);
  const nActive = quick.length + flt.length;
  const chips = quick.map(([k, t]) => `<span class="gm-chip" role="listitem"><button type="button" class="gm-chip-main" data-click="wo-flt" title="Sửa bộ lọc">${icon('funnel')}<span>${esc(t)}</span></button><button type="button" class="gm-chip-x" data-click="wo-qchip-x" data-k="${k}" aria-label="Bỏ lọc: ${esc(t)}">${icon('x')}</button></span>`);
  chips.push(...flt.map((x, i) => {
    const c = allCols.find((cc) => cc.id === x.col);
    const t = gmFilterText(c, x);
    return `<span class="gm-chip" role="listitem"><button type="button" class="gm-chip-main" data-click="wo-chip-edit" data-col="${esc(x.col)}" title="Sửa bộ lọc">${icon('funnel')}<span>${esc(t)}</span></button><button type="button" class="gm-chip-x" data-click="wo-chip-x" data-i="${i}" aria-label="Bỏ lọc: ${esc(t)}">${icon('x')}</button></span>`;
  }));
  if (groupCol) {
    const t = `Nhóm theo: ${groupCol.label}${groupCol.kind === 'date' ? ` (${(GM_GRANS.find(([g]) => g === gran) || ['', ''])[1].toLowerCase()})` : ''}`;
    chips.push(`<span class="gm-chip gm-chip-group" role="listitem"><span class="gm-chip-main">${icon('groupBy')}<span>${esc(t)}</span></span><button type="button" class="gm-chip-x" data-click="wo-chip-ungroup" aria-label="Bỏ nhóm">${icon('x')}</button></span>`);
  }
  const chipBar = chips.length ? `<div class="gm-chips" role="list" aria-label="Bộ lọc đang áp dụng">${chips.join('')}
    <button type="button" class="btn btn-ghost btn-sm gm-chips-clear" data-click="wo-chip-clear">Xóa tất cả</button></div>` : '';
  const thHtml = (c) => {
    if (c.id === 'stt') return `<th class="wo-stt-h">STT</th>`;
    const dir = sortDirOf(c);
    const filtered = !!fltOf(c);
    const grouped = !!(groupCol && groupCol.id === c.id);
    return `<th class="sortable${c.align === 'right' ? ' num' : ''}${grouped ? ' grouped' : ''}${filtered ? ' filtered' : ''}${dir ? ' sorted' : ''}" data-click="wo-colmenu" data-col="${c.id}" tabindex="0" aria-haspopup="menu" aria-sort="${dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none'}" title="${esc(c.label)} – bấm để sắp xếp / nhóm / lọc">
      <span class="th-in"><span class="th-label">${esc(c.label)}</span>${dir ? `<span class="th-sort" aria-hidden="true">${icon(dir === 'asc' ? 'arrowUp' : 'arrowDown')}</span>` : ''}${filtered ? `<span class="th-flt" aria-label="Đang lọc">${icon('funnel')}</span>` : ''}</span><span class="th-caret">${icon('chevronDown')}</span><span class="grid-resize" data-col="${c.id}" title="Kéo để đổi độ rộng · bấm đúp để về mặc định"></span></th>`;
  };


  // "Cần xử lý ngay": chỉ hiện loại cảnh báo đang có phiếu, bấm để lọc
  let alertHead = '';
  if (alertSum && alertSum.rows.some((r) => r.count)) {
    // Khẩn (đỏ) trước, rồi việc làm được ngay (xanh), sau cùng việc cần nhắc (vàng); cùng mức giữ thứ tự gốc
    const rank = { red: 0, green: 1, blue: 2, amber: 3 };
    const hot = alertSum.rows.map((r, i) => ({ ...r, i })).filter((r) => r.count)
      .sort((a, b) => (rank[a.tone] ?? 9) - (rank[b.tone] ?? 9) || a.i - b.i);
    const total = hot.reduce((s, r) => s + r.count, 0);
    alertHead = `<div class="wo-alertbar">
      <div class="wo-alertbar-head"><span class="wa-head-ic">${icon('alert')}</span><b>Cần xử lý ngay</b><span class="wa-head-n">${NF.format(total)} việc</span></div>
      <div class="wo-alertbar-list">${hot.map((r) => `<a class="wo-alert-chip t-${r.tone}${f.alert === r.key || (r.key === 'overdue' && f.sla === 'overdue') ? ' active' : ''}"
        href="${base}${qs({ ...(allSrc ? { src: 'all' } : {}), ...(allKind ? { kind: 'all' } : {}), ...(r.key === 'overdue' ? { sla: f.sla === 'overdue' ? '' : 'overdue', order: 'sla' } : { alert: f.alert === r.key ? '' : r.key }) })}">
        <span class="wa-ic">${icon(WO_ALERT_ICONS[r.key] || 'alert')}</span><span class="wa-t">${esc(r.label)}</span><span class="wa-n">${NF.format(r.count)}</span></a>`).join('')}</div>
    </div>`;
  }

  // Bảo hành tổng hợp: tab nguồn xe (Tất cả / Green SM / Khách lẻ) + ô số theo tình trạng bảo hành
  let bhHead = '';
  if (isWarrantyList && bhSum) {
    const cnt = (keys, src) => bhSum.rows.filter((r) => keys.includes(r.ws) && (!src || r.source === src)).reduce((a, r) => a + r.c, 0);
    const buckets = [
      ['none', 'Chưa cập nhật BH', ['none'], 'slate'],
      ['checking', 'Chờ kiểm tra', ['checking'], 'amber'],
      ['waiting_battery', 'Chờ lắp PIN', ['waiting_battery'], 'orange'],
      ['waiting_motor', 'Chờ lắp động cơ', ['waiting_motor'], 'orange'],
      ['waiting_battery_motor', 'Chờ PIN & động cơ', ['waiting_battery_motor'], 'orange'],
      ['completed', 'Bảo hành xong', ['completed'], 'green'],
      ['rejected', 'Từ chối BH', ['rejected_battery', 'rejected_motor', 'rejected_charger', 'rejected_battery_motor'], 'red'],
    ];
    const srcTabs = [['', 'Tất cả'], ['gsm', 'Green SM'], ['bship', 'BShip'], ['retail', 'Khách lẻ']];
    const srcTotal = (src) => bhSum.rows.filter((r) => !src || r.source === src).reduce((a, r) => a + r.c, 0);
    bhHead = `<div class="bh-sum">
      <div class="bh-src">${srcTabs.map(([k, l]) => `<a class="${(f.source || '') === k ? 'active' : ''}" href="${base}${qs({ source: k, warranty: f.warranty })}">${esc(l)} <span>${NF.format(srcTotal(k))}</span></a>`).join('')}</div>
      <div class="bh-tiles">${buckets.map(([k, l, keys, tone]) => {
        const tot = cnt(keys, f.source);
        return `<a class="bh-tile t-${tone} sc-${tone}${f.warranty === k ? ' active' : ''}" href="${base}${qs({ source: f.source, warranty: f.warranty === k ? '' : k })}">
          <div class="v">${NF.format(tot)}</div><div class="l">${esc(l)}</div>
          ${f.source ? '' : `<div class="s">GSM ${NF.format(cnt(keys, 'gsm'))}${cnt(keys, 'bship') ? ` · BShip ${NF.format(cnt(keys, 'bship'))}` : ''} · Lẻ ${NF.format(cnt(keys, 'retail'))}</div>`}</a>`;
      }).join('')}</div>
    </div>`;
  }

  // Phiếu bảo hành khách lẻ: tab theo đối tượng mang xe tới
  if (isRetailBh) {
    const cnt = (k) => (walkinSum && walkinSum.rows ? walkinSum.rows.filter((r) => !k || r.fleet === k).reduce((a, r) => a + Number(r.c || 0), 0) : null);
    const tabs = [['', 'Tất cả'], ['retail', WALKIN_LABELS.retail], ['gsm', WALKIN_LABELS.gsm], ['bship', WALKIN_LABELS.bship]];
    const keep = Object.fromEntries(['status', 'sla', 'mine', 'order', 'warranty'].map((k) => [k, f[k]]));
    bhHead = `<div class="bh-sum walkin-head">
      <div class="bh-src">${tabs.map(([k, l]) => `<a class="${(f.fleet || '') === k ? 'active' : ''}" href="${base}${qs({ ...keep, fleet: k })}">${esc(l)}${cnt(k) !== null ? ` <span>${NF.format(cnt(k))}</span>` : ''}</a>`).join('')}</div>
      ${can('wo.create') ? `<a class="btn btn-primary btn-sm" href="#/work-orders/new${qs({ source: 'retail', svc: 'warranty', ...(f.fleet && f.fleet !== 'retail' ? { walkin: f.fleet } : {}) })}">${icon('plus')} Tạo phiếu bảo hành</a>` : ''}
    </div>`;
  }

  // Bảng "Chỉnh sửa bộ lọc": sắp xếp / nhóm (điện thoại không có tiêu đề cột) + menu ⋯
  const sortCols = allCols.filter((c, i) => c.sort && c.id !== 'vehicle' && allCols.findIndex((x) => x.sort === c.sort) === i);
  const groupOpts = sortCols.flatMap((c) => (c.kind === 'date'
    ? GM_GRANS.map(([g, l]) => [`${c.sort}:${g}`, `${c.label} – theo ${l.toLowerCase()}`]) : [[c.sort, c.label]]));
  const groupVal = groupCol ? (groupCol.kind === 'date' ? `${groupCol.sort}:${gran}` : groupCol.sort) : '';
  const canBulk = !isOverview && ['wo.deliver', 'wo.edit', 'wo.approve'].some((x) => can(x));
  const anyFilter = WO_FILTER_KEYS.some((k) => f[k] && !['sort', 'dir', 'group'].includes(k));
  const moreItems = [(can('report.export') || can('wo.export')) && ['export', 'download', 'Xuất Excel'],
    anyFilter && ['reset', 'refresh', 'Bỏ mọi lọc, về mặc định']].filter(Boolean);
  const psPref = woPsPref();
  const psSelect = `<label class="wo-ps mobile-hide">Số dòng <select class="select" data-change="wo-ps" aria-label="Số dòng mỗi trang">
    <option value="">Tự động${psPref ? '' : ` (${d.page_size})`}</option>${WO_PS_CHOICES.map((n) => `<option value="${n}"${psPref === n ? ' selected' : ''}>${n}</option>`).join('')}</select></label>`;

  ctx.setMain(`
    ${alertHead}
    ${bhHead}
    <div class="card wo-list-card${isOverview ? ' wo-overview' : ''}" data-base="${base}">
      <div class="wo-tb">
        <button type="button" class="wo-view-btn" data-click="wo-view" aria-haspopup="menu" title="Chọn dạng xem"><span class="wo-view-t">${esc(viewTitle)}</span>${icon('chevronDown')}</button>
        <span class="wo-tb-count">${NF.format(d.total)} phiếu</span>
        <span class="wo-tb-sp"></span>
        <button type="button" class="wo-tb-btn" data-click="wo-cols" title="Chỉnh sửa cột" aria-label="Chỉnh sửa cột">${icon('tbCols')}<span class="wo-tb-l">Chỉnh sửa cột</span></button>
        <button type="button" class="wo-tb-btn${nActive ? ' on' : ''}" data-click="wo-flt" title="Chỉnh sửa bộ lọc" aria-label="Chỉnh sửa bộ lọc${nActive ? ` (${nActive} đang lọc)` : ''}">${icon('funnel')}<span class="wo-tb-l">Chỉnh sửa bộ lọc</span>${nActive ? `<span class="wo-tb-n">${nActive}</span>` : ''}</button>
        <form class="wo-search${f.q ? ' open' : ''}" data-submit="wo-filter" id="wo-filter-form" role="search">
          <button type="button" class="wo-search-ic" data-click="wo-search-open" aria-label="Lọc theo từ khóa">${icon('search')}</button>
          <input name="q" value="${esc(f.q)}" placeholder="Lọc theo từ khóa" autocomplete="off" enterkeyhint="search" data-scan-submit aria-label="Lọc theo từ khóa: mã phiếu, biển số, số khung, lệnh, SĐT, serial PIN / động cơ / sạc" title="Mã phiếu, biển số, số khung, lệnh, SĐT, serial PIN / động cơ / sạc – Enter để tìm">
          <button type="button" class="wo-search-x" data-click="wo-search-clear" aria-label="Xóa từ khóa">${icon('x')}</button>
          <button type="button" class="wo-search-scan" data-click="scan-code" data-target="q" data-modes="qr,barcode" title="Quét mã QR / mã vạch để tìm phiếu" aria-label="Quét mã để tìm phiếu">${icon('scan')}</button>
        </form>
        ${canBulk ? `<button type="button" class="wo-tb-btn wo-tb-action" data-click="wo-bulk" title="Chuyển trạng thái nhiều xe cùng lúc theo số khung" aria-label="Chuyển hàng loạt">${icon('swap')}<span class="wo-tb-l">Chuyển hàng loạt</span></button>` : ''}
        ${moreItems.length ? `<button type="button" class="wo-tb-btn wo-tb-more" data-click="wo-more" aria-haspopup="menu" aria-label="Thao tác khác" title="Thao tác khác">${icon('moreH')}</button>` : ''}
      </div>
      ${chipBar}
      <div class="m-card-list desktop-hide">${cards}</div>
      <div class="table-wrap mobile-hide wo-grid-wrap"><table class="table table-compact wo-grid no-col-resize" style="width:${Math.max(tableW, preAvail)}px">
        <colgroup>${cols.map((c) => `<col data-col="${c.id}" style="width:${(colW(c) * preScale).toFixed(2)}px">`).join('')}</colgroup>
        <thead>
          <tr>${cols.map(thHtml).join('')}</tr>
        </thead>
        <tbody>${d.rows.length ? woGridBody(d.rows, cols, grp, detailBase, (d.page - 1) * d.page_size + 1) : emptyRow(cols.length, 'Không tìm thấy phiếu phù hợp')}</tbody>
      </table></div>
      ${pager(d.total, d.page, d.page_size).replace('<span class="spacer"></span>', `<span class="spacer"></span>${psSelect}`)}
    </div>
    <div class="drawer-backdrop hidden" id="wo-side-backdrop" data-click="wo-side-close"></div>
    <aside class="drawer wo-side hidden" id="wo-cols-menu" role="dialog" aria-modal="true" aria-labelledby="wo-cols-h">
      <div class="drawer-head">
        <div class="drawer-head-main">
          <h2 id="wo-cols-h">Chỉnh sửa cột</h2>
          <div class="drawer-actions">
            <button type="button" class="btn btn-sm" data-click="wo-cols-reset">${icon('refresh')} Khôi phục mặc định</button>
            ${isOverview || isWarrantyList ? '<button type="button" class="btn btn-sm btn-ghost" data-click="wo-cols-preset" data-preset="slim">Gọn</button>' : ''}
          </div>
        </div>
        <button type="button" class="icon-btn drawer-x" data-click="wo-side-close" aria-label="Đóng">×</button>
      </div>
      <div class="drawer-body"><ul class="wo-cp-list" id="wo-cp-list"></ul></div>
      <div class="drawer-foot">
        <span class="small muted" id="wo-cols-count"></span>
        <span class="wo-side-btns"><button type="button" class="btn" data-click="wo-side-close">Hủy</button><button type="button" class="btn btn-primary" data-click="wo-cols-apply">Áp dụng</button></span>
      </div>
    </aside>
    <aside class="drawer wo-side hidden" id="wo-flt-panel" role="dialog" aria-modal="true" aria-labelledby="wo-flt-h">
      <div class="drawer-head">
        <div class="drawer-head-main"><h2 id="wo-flt-h">Chỉnh sửa bộ lọc</h2></div>
        <button type="button" class="icon-btn drawer-x" data-click="wo-side-close" aria-label="Đóng">×</button>
      </div>
      <form class="drawer-body" id="wo-fp-form" data-submit="wo-fp-apply" autocomplete="off">
        <section class="wo-fp-sec">
          <h3>Bộ lọc nhanh</h3>
          <label class="wo-fp-field"${lockSrc ? ' hidden' : ''}><span>Nguồn xe</span>${select('fp_source', Object.entries(S.meta.sources).map(([k, v]) => [k, v.label]), f.source, '', 'Tất cả nguồn xe')}</label>
          <label class="wo-fp-field"><span>Hạng mục lỗi</span>${select('fp_fault', S.meta.settings.faults.map((x) => [x, x]), f.fault, '', 'Tất cả hạng mục')}</label>
          <div class="wo-fp-field"><span>Ngày nhận xe</span>
            <div class="wo-fp-range"><input class="input" type="date" name="fp_from" value="${esc(f.from)}" aria-label="Nhận từ ngày"><span class="muted">–</span><input class="input" type="date" name="fp_to" value="${esc(f.to)}" aria-label="Nhận đến ngày"></div></div>
        </section>
        <section class="wo-fp-sec">
          <h3>Lọc theo cột</h3>
          <div id="wo-fp-list"></div>
          <button type="button" class="wo-fp-add" data-click="wo-fp-add">${icon('plus')} Thêm bộ lọc</button>
        </section>
        <section class="wo-fp-sec">
          <h3>Sắp xếp &amp; nhóm</h3>
          <div class="wo-fp-field"><span>Sắp xếp theo</span>
            <div class="wo-fp-two">${select('fp_sort', sortCols.map((c) => [c.sort, c.label]), f.sort, 'aria-label="Sắp xếp theo"', 'Mặc định')}${select('fp_dir', [['asc', 'Tăng dần'], ['desc', 'Giảm dần']], f.dir === 'desc' ? 'desc' : 'asc', 'aria-label="Chiều sắp xếp"')}</div></div>
          <label class="wo-fp-field"><span>Nhóm theo</span>${select('fp_group', groupOpts, groupVal, '', 'Không nhóm')}</label>
        </section>
      </form>
      <div class="drawer-foot">
        <button type="button" class="btn btn-ghost" data-click="wo-fp-clear">Xóa tất cả</button>
        <span class="wo-side-btns"><button type="button" class="btn" data-click="wo-side-close">Hủy</button><button type="submit" form="wo-fp-form" class="btn btn-primary">Áp dụng</button></span>
      </div>
    </aside>
`);

  // ----- Bảng vừa khít khung (không cuộn ngang): chia độ rộng theo tỉ lệ đã lưu -----
  const table = $('.wo-grid');
  let gridScale = 1;
  const fitGrid = () => {
    if (!table || !table.isConnected) return;
    const avail = table.parentElement.clientWidth;
    if (!avail) return;
    // Đủ chỗ: giãn đều cho kín khung. Thiếu chỗ: giữ nguyên độ rộng (không cắt chữ) → chỉ bảng cuộn ngang.
    // Danh sách tổng quan giữ độ rộng Sheet, không giãn ô.
    gridScale = isOverview ? 1 : Math.max(1, avail / tableW);
    const ws = cols.map((c) => colW(c) * gridScale);
    $$('col', table).forEach((col, i) => { col.style.width = `${ws[i].toFixed(2)}px`; });
    table.style.width = `${Math.max(avail, tableW)}px`;
    freezeCols();
    if (isOverview && table.tHead) table.parentElement.style.setProperty('--wo-hh', `${table.tHead.getBoundingClientRect().height}px`);
  };
  // Cố định N cột đầu như Google Sheet (độ rộng lấy từ <col>, đổi khi kéo cột)
  const freezeN = isOverview ? Math.min(WO_OVERVIEW_VIEWS[overviewView].freeze || 0, cols.length) : 0;
  function freezeCols() {
    if (!freezeN || !table) return;
    const lefts = [];
    let x = 0;
    $$('col', table).slice(0, freezeN).forEach((col) => { lefts.push(x); x += parseFloat(col.style.width) || col.getBoundingClientRect().width; });
    table.querySelectorAll('tr').forEach((tr) => {
      if (tr.children.length !== cols.length) return;
      for (let i = 0; i < freezeN; i++) {
        const cell = tr.children[i];
        cell.classList.add('wo-frz');
        cell.style.left = `${lefts[i]}px`;
      }
    });
  }
  fitGrid();
  if (preLeft && table) table.parentElement.scrollLeft = preLeft;
  if (preTop && table) table.parentElement.scrollTop = preTop;
  if (preMainTop && mainEl) mainEl.scrollTop = preMainTop;

  // ----- Số dòng tự vừa khung: đo lại sau khi vẽ; chỉ tải lại khi số dòng vừa khung thực sự khác -----
  const reloadWithSize = (newSize) => {
    const np = woKeepPage(d.page, d.page_size, newSize);
    if (np !== page) setQuery({ page: np }, { resetPage: false });
    else ctx.reload();
  };
  const fitTarget = () => {
    if (!woIsDesktop()) return 20;
    if (woPsPref()) return woPsPref();
    const m = woFitMeasure(base);
    if (!m) return d.page_size;
    woFitSave(base, m);
    const rowH = m.rowH || (woGridLoad(`woFit:${base}`, {}) || {}).rowH || 45;
    return woFitClamp(Math.floor(m.avail / rowH));
  };
  if (!ctx.inDrawer && woIsDesktop() && !woPsPref()) {
    const want = fitTarget();
    // Lần đầu trên máy này (chưa có số đo) hoặc ước lượng lệch: tải lại 1 lần, không lặp
    if (want !== d.page_size && !pageWoList._refit) { pageWoList._refit = true; reloadWithSize(want); return; }
  }
  pageWoList._refit = false;
  const checkSize = () => {
    if (ctx.stale() || !table || !table.isConnected || drawerIsOpen()) return;
    const want = fitTarget();
    if (want !== d.page_size) reloadWithSize(want);
  };
  window.removeEventListener('resize', pageWoList._fit || (() => {}));
  pageWoList._fit = () => {
    clearTimeout(pageWoList._fitT);
    pageWoList._fitT = setTimeout(() => { fitGrid(); checkSize(); }, 200);
  };
  window.addEventListener('resize', pageWoList._fit);
  on('change', 'wo-ps', (el) => {
    const v = Number(el.value) || 0;
    woGridSave(woPsKey(), v || 'auto');
    const want = v || fitTarget();
    if (want !== d.page_size) reloadWithSize(want);
    else ctx.reload();
  });

  // ----- Kéo đổi độ rộng cột -----
  if (table) {
    $$('.wo-grid .grid-resize').forEach((h) => {
      h.addEventListener('click', (e) => e.stopPropagation());
      h.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const cur = woGridLoad(widthKey, {});
        delete cur[h.dataset.col];
        woGridSave(widthKey, cur);
        ctx.reload();
      });
      h.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const col = table.querySelector(`col[data-col="${h.dataset.col}"]`);
        const startX = e.clientX;
        const startW = parseFloat(col.style.width) || 100;
        const startT = parseFloat(table.style.width) || table.getBoundingClientRect().width;
        document.body.classList.add('col-resizing');
        const move = (ev) => {
          const nw = Math.max(50, startW + ev.clientX - startX);
          col.style.width = `${nw}px`;
          table.style.width = `${startT + nw - startW}px`;
          freezeCols();
        };
        const up = () => {
          document.removeEventListener('pointermove', move);
          document.removeEventListener('pointerup', up);
          document.body.classList.remove('col-resizing');
          // Lưu độ rộng "gốc" (bỏ hệ số co giãn) rồi chia lại cho vừa khung
          const cur = woGridLoad(widthKey, {});
          cur[h.dataset.col] = Math.max(50, Math.round(parseFloat(col.style.width) / (gridScale || 1)));
          woGridSave(widthKey, cur);
        };
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up);
      });
    });
  }

  const apply = (form, changed) => {
    const v = Object.fromEntries(new FormData(form));
    if (changed === 'f_recv') Object.assign(v, woRecvRange(v.f_recv));
    if ((changed === 'from' || changed === 'to') && v.f_recv) v.f_recv = '';
    // Bộ lọc cột (đặt trong menu cột) không nằm trong form → giữ nguyên giá trị đang lọc
    setQuery(Object.fromEntries(WO_FILTER_KEYS.map((k) => [k, (k in v ? v[k] : f[k]) || ''])));
  };
  on('submit', 'wo-filter', (form) => apply(form));
  on('change', 'wo-filter', (el) => apply(el.form || $('#wo-filter-form'), el.name));
  // ----- Menu cột: sắp xếp, nhóm, lọc, độ rộng, di chuyển -----
  // Đổi URL; nếu URL không đổi (VD: bỏ nhóm đang lấy từ cách nhóm đã lưu) thì vẽ lại tại chỗ
  const nav = (updates) => {
    const before = window.location.hash;
    setQuery(updates);
    if (window.location.hash === before) ctx.reload();
  };
  const setFilters = (list) => nav({ filters: gmStringify(list) });
  const setGroup = (g) => { woGridSave(groupKey, g); nav({ group: g }); };
  const openColMenu = (anchor, c, inTable) => gmOpenColMenu(anchor, c, {
    sort: sortDirOf(c),
    canSort: !!c.sort,
    canGroup: !!c.sort,
    group: groupCol && groupCol.id === c.id ? gran : '',
    filter: fltOf(c),
    canFilter: !!c.ff,
    canMove: inTable,
    idx: visIds.indexOf(c.id),
    count: visIds.length,
    width: colW(c) * (inTable ? gridScale : 1),
    onSort: (dir) => nav({ sort: dir ? c.sort : '', dir, order: '' }),
    onGroup: (g) => setGroup(g ? (c.kind === 'date' ? `${c.sort}:${g}` : c.sort) : ''),
    onFilter: (nf) => setFilters([...flt.filter((x) => x.col !== c.id), ...(nf ? [nf] : [])]),
    onWidth: (px) => {
      const cur = woGridLoad(widthKey, {});
      if (px === null) delete cur[c.id];
      else cur[c.id] = Math.max(50, Math.min(800, Math.round(px / (gridScale || 1))));
      woGridSave(widthKey, cur);
      ctx.reload();
    },
    onMove: (delta) => {
      const ids = [...visIds];
      const i = ids.indexOf(c.id);
      const j = i + delta;
      if (j < 0 || j >= ids.length) return;
      [ids[i], ids[j]] = [ids[j], ids[i]];
      woGridSave(visKey, ids);
      ctx.reload();
    },
  });
  on('click', 'wo-colmenu', (el, ev) => {
    if (ev && ev.target && ev.target.closest && ev.target.closest('.grid-resize')) return;
    if (gmToggleOff(el)) return;
    const c = cols.find((x) => x.id === el.dataset.col);
    if (c) openColMenu(el, c, true);
  });
  // Bàn phím trên tiêu đề cột: Enter / Space / ↓ mở menu; trên dòng nhóm: Enter / Space thu gọn
  $$('.wo-grid thead th[data-click="wo-colmenu"]').forEach((th) => th.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); th.click(); }
  }));
  $$('.grid-group-row, .m-group-head').forEach((g) => g.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); g.click(); }
  }));
  on('click', 'wo-chip-edit', (el) => {
    const c = allCols.find((x) => x.id === el.dataset.col);
    if (c) gmOpenFilter(el, c, fltOf(c), (nf) => setFilters([...flt.filter((x) => x.col !== c.id), ...(nf ? [nf] : [])]));
  });
  on('click', 'wo-chip-x', (el) => setFilters(flt.filter((_, i) => i !== Number(el.dataset.i))));
  on('click', 'wo-chip-ungroup', () => setGroup(''));
  const clearAll = () => {
    woGridSave(groupKey, '');
    nav({ filters: '', group: '', fault: '', from: '', to: '', dfrom: '', dto: '', f_recv: '', ...(srcInView ? {} : { source: '' }) });
  };
  on('click', 'wo-chip-clear', clearAll);
  on('click', 'wo-qchip-x', (el) => nav(({ source: { source: '' }, fault: { fault: '' }, date: { from: '', to: '', f_recv: '' }, ddate: { dfrom: '', dto: '' } })[el.dataset.k] || {}));
  // Thu gọn / mở một nhóm (cả bảng và thẻ điện thoại), không gọi lại API
  on('click', 'wo-grp', (el) => {
    const set = WO_COLLAPSED.get(collapseKey);
    const k = el.dataset.k;
    const closed = !set.has(k);
    if (closed) set.add(k); else set.delete(k);
    $$(`[data-click="wo-grp"][data-gi="${el.dataset.gi}"]`).forEach((h) => { h.classList.toggle('closed', closed); h.setAttribute('aria-expanded', String(!closed)); });
    $$(`.wo-grid tbody tr[data-gi="${el.dataset.gi}"]:not(.grid-group-row), .m-card-list .m-card[data-gi="${el.dataset.gi}"]`).forEach((r) => { r.hidden = closed; });
  });
  // ----- Thanh công cụ: chọn dạng xem, ⋯, ô từ khóa -----
  const menuPop = (anchor, title, items, onPick) => {
    if (gmToggleOff(anchor)) return;
    const cur = gmPopup(anchor, `<div class="gm-sheet-head"><b>${esc(title)}</b><button type="button" class="gm-x" data-act="close" aria-label="Đóng">${icon('x')}</button></div>
      <div class="gm-list" role="menu" aria-label="${esc(title)}">${items.join('')}</div>`, { cls: 'gm-menu wo-tb-menu', label: title });
    gmMenuKeys(cur);
    const first = cur.el.querySelector('.gm-item[aria-checked="true"]') || cur.el.querySelector('.gm-item');
    if (first) first.focus({ preventScroll: true });
    cur.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      e.stopPropagation();
      gmClose(b.dataset.act === 'close');
      if (b.dataset.act !== 'close') onPick(b);
    });
  };
  on('click', 'wo-view', (el) => menuPop(el, 'Dạng xem', views.map((v, i) => gmItem('view', '', v.label, { checked: v.cur, extra: ` data-i="${i}"` })), (b) => {
    const v = views[Number(b.dataset.i)];
    if (!v) return;
    if (isOverview) setQuery({ view: v.id === 'summary' ? '' : v.id, page: '' });
    else window.location.hash = v.href;
  }));
  on('click', 'wo-bulk', () => openBulkTransition(ctx));
  on('click', 'wo-more', (el) => menuPop(el, 'Thao tác khác', moreItems.map(([act, ic, label]) => gmItem(act, ic, label)), (b) => {
    if (b.dataset.act === 'export') {
      // File ra đúng dạng xem hiện tại: cùng bộ lọc + cột đang hiện (thứ tự, tên cột, độ rộng)
      const xq = new URLSearchParams(listQs.replace(/^\?/, ''));
      xq.set('cols', cols.map((c) => c.id).join(','));
      xq.set('heads', cols.map((c) => String(c.label).replace(/\|/g, '/')).join('|'));
      xq.set('widths', cols.map((c) => Math.round(colW(c))).join(','));
      xq.set('title', [$('#page-title').textContent.trim(), isOverview ? WO_OVERVIEW_VIEWS[overviewView].label : ''].filter(Boolean).join(' – '));
      window.location.href = `/api/work-orders.xlsx?${xq}`;
      return;
    }
    if (b.dataset.act === 'reset') window.location.hash = base + (isOverview && overviewView !== 'summary' ? qs({ view: overviewView }) : '');
  }));
  const searchForm = $('#wo-filter-form');
  on('click', 'wo-search-open', () => {
    searchForm.classList.add('open');
    searchForm.q.focus();
  });
  on('click', 'wo-search-clear', () => {
    searchForm.q.value = '';
    if (f.q) apply(searchForm); else searchForm.q.focus();
  });
  if (searchForm) searchForm.q.addEventListener('blur', () => { if (!searchForm.q.value && !f.q) searchForm.classList.remove('open'); });

  // ----- Bảng bên phải (máy tính) / bảng trượt từ đáy (điện thoại) -----
  let sideFrom = null;
  const openSide = (id, from) => {
    gmClose();
    sideFrom = from || null;
    $$('.wo-side').forEach((el) => el.classList.toggle('hidden', el.id !== id));
    $('#wo-side-backdrop').classList.remove('hidden');
    document.body.classList.add('drawer-open');
    const x = $(`#${id} .drawer-x`);
    if (x) x.focus({ preventScroll: true });
  };
  const closeSide = () => {
    gmClose();
    $$('.wo-side, #wo-side-backdrop').forEach((el) => el.classList.add('hidden'));
    if (!drawerIsOpen()) document.body.classList.remove('drawer-open');
    if (sideFrom && sideFrom.isConnected) sideFrom.focus({ preventScroll: true });
  };
  on('click', 'wo-side-close', closeSide);

  // Chỉnh sửa cột: bật/tắt + đổi thứ tự, lưu khi bấm Áp dụng (1 lần tải lại)
  let cp = [];
  const cpRender = () => {
    const on1 = cp.filter((x) => x.on);
    const row = (x, i) => `<li class="wo-cp-row"><label class="check"><input type="checkbox" data-change="wo-cp-toggle" value="${x.id}"${x.on ? ' checked' : ''}><span>${esc(x.label)}</span></label>${x.on
      ? `<button type="button" class="wo-cp-mv" data-click="wo-cp-mv" data-id="${x.id}" data-d="-1" aria-label="Đưa ${esc(x.label)} lên"${i === 0 ? ' disabled' : ''}>${icon('chevronUp')}</button><button type="button" class="wo-cp-mv" data-click="wo-cp-mv" data-id="${x.id}" data-d="1" aria-label="Đưa ${esc(x.label)} xuống"${i === on1.length - 1 ? ' disabled' : ''}>${icon('chevronDown')}</button>` : ''}</li>`;
    const off = cp.filter((x) => !x.on);
    $('#wo-cp-list').innerHTML = on1.map(row).join('') + (off.length ? `<li class="wo-cp-sep" aria-hidden="true">Cột đang ẩn</li>${off.map(row).join('')}` : '');
    $('#wo-cols-count').textContent = `${on1.length} cột đang hiện`;
  };
  on('click', 'wo-cols', (el) => {
    cp = [...visIds.map((id) => allCols.find((c) => c.id === id)), ...allCols.filter((c) => !visIds.includes(c.id))].filter(Boolean)
      .map((c) => ({ id: c.id, label: c.label, on: visIds.includes(c.id) }));
    cpRender();
    openSide('wo-cols-menu', el);
  });
  on('change', 'wo-cp-toggle', (el) => {
    const i = cp.findIndex((x) => x.id === el.value);
    if (i < 0) return;
    const [x] = cp.splice(i, 1);
    x.on = el.checked;
    // Bật: thêm vào cuối nhóm đang hiện · Tắt: chuyển xuống nhóm ẩn
    cp.splice(x.on ? cp.filter((y) => y.on).length : cp.length, 0, x);
    cpRender();
    const again = $(`#wo-cp-list input[value="${x.id}"]`);
    if (again) again.focus({ preventScroll: true });
  });
  on('click', 'wo-cp-mv', (el) => {
    const on1 = cp.filter((x) => x.on);
    const i = on1.findIndex((x) => x.id === el.dataset.id);
    const j = i + Number(el.dataset.d);
    if (i < 0 || j < 0 || j >= on1.length) return;
    [on1[i], on1[j]] = [on1[j], on1[i]];
    cp = [...on1, ...cp.filter((x) => !x.on)];
    cpRender();
    const again = $(`#wo-cp-list [data-id="${el.dataset.id}"][data-d="${el.dataset.d}"]:not([disabled])`)
      || $(`#wo-cp-list [data-id="${el.dataset.id}"]:not([disabled])`);
    if (again) again.focus({ preventScroll: true });
  });
  on('click', 'wo-cols-apply', () => {
    const ids = cp.filter((x) => x.on).map((x) => x.id);
    if (!ids.length) { toast('Chọn ít nhất 1 cột', 'error'); return; }
    closeSide();
    woGridSave(visKey, ids);
    ctx.reload();
  });

  // Chỉnh sửa bộ lọc: lọc nhanh + lọc theo cột + sắp xếp/nhóm, áp dụng 1 lần
  let fp = [];
  const fltCols = allCols.filter((c) => c.ff && c.id !== 'vehicle');
  const fpRender = () => {
    $('#wo-fp-list').innerHTML = fp.length ? fp.map((x, i) => {
      const t = gmFilterText(allCols.find((c) => c.id === x.col), x);
      return `<div class="wo-fp-row"><button type="button" class="wo-fp-edit" data-click="wo-fp-edit" data-i="${i}" title="Sửa bộ lọc">${icon('funnel')}<span>${esc(t)}</span>${icon('edit')}</button><button type="button" class="wo-fp-x" data-click="wo-fp-x" data-i="${i}" aria-label="Bỏ lọc: ${esc(t)}">${icon('x')}</button></div>`;
    }).join('') : '<div class="wo-fp-empty">Chưa lọc theo cột nào</div>';
  };
  const fpSet = (c, nf) => {
    const i = fp.findIndex((x) => x.col === c.id);
    if (nf && i >= 0) fp[i] = nf;
    else if (nf) fp.push(nf);
    else if (i >= 0) fp.splice(i, 1);
    fpRender();
  };
  on('click', 'wo-flt', (el) => {
    fp = flt.map((x) => ({ ...x }));
    const form = $('#wo-fp-form');
    form.reset();
    form.fp_source.value = f.source;
    form.fp_fault.value = f.fault;
    form.fp_from.value = f.from;
    form.fp_to.value = f.to;
    form.fp_sort.value = f.sort;
    form.fp_dir.value = f.dir === 'desc' ? 'desc' : 'asc';
    form.fp_group.value = groupVal;
    fpRender();
    openSide('wo-flt-panel', el.closest('.wo-tb') ? el : $('.wo-tb [data-click="wo-flt"]'));
  });
  on('click', 'wo-fp-edit', (el) => {
    const x = fp[Number(el.dataset.i)];
    const c = x && allCols.find((cc) => cc.id === x.col);
    if (c) gmOpenFilter(el, c, x, (nf) => fpSet(c, nf));
  });
  on('click', 'wo-fp-x', (el) => { fp.splice(Number(el.dataset.i), 1); fpRender(); });
  on('click', 'wo-fp-add', (el) => {
    if (gmToggleOff(el)) return;
    gmOpenPicker(el, 'Thêm bộ lọc theo cột', fltCols.map((c) => ({ id: c.id, label: c.label, active: fp.some((x) => x.col === c.id) })), (id) => {
      const c = fltCols.find((x) => x.id === id);
      if (c) gmOpenFilter(el, c, fp.find((x) => x.col === id) || null, (nf) => fpSet(c, nf));
    });
  });
  on('submit', 'wo-fp-apply', (form) => {
    const from = form.fp_from.value;
    const to = form.fp_to.value;
    if (from && to && from > to) { toast('"Từ ngày" phải trước hoặc bằng "Đến ngày"', 'error'); return; }
    const u = { source: form.fp_source.value, fault: form.fp_fault.value, from, to, filters: gmStringify(fp) };
    if (from !== f.from || to !== f.to) u.f_recv = '';
    const sort = form.fp_sort.value;
    const dir = sort ? form.fp_dir.value : '';
    if (sort !== f.sort || (sort && dir !== (f.dir === 'desc' ? 'desc' : 'asc'))) Object.assign(u, { sort, dir, order: '' });
    if (form.fp_group.value !== groupVal) { u.group = form.fp_group.value; woGridSave(groupKey, u.group); }
    closeSide();
    nav(u);
  });
  on('click', 'wo-fp-clear', () => { closeSide(); clearAll(); });
  on('click', 'wo-cols-preset', (el) => {
    const all = woGridColumns([]).map((c) => c.id);
    closeSide();
    woGridSave(visKey, el.dataset.preset === 'full' ? all : WO_COLS_SLIM.filter((id) => all.includes(id)));
    ctx.reload();
  });
  on('click', 'wo-cols-reset', () => {
    closeSide();
    try { localStorage.removeItem(visKey); localStorage.removeItem(widthKey); } catch { /* ignore */ }
    ctx.reload();
  });
  on('click', 'wo-clear', () => { window.location.hash = base + (isOverview && overviewView !== 'summary' ? qs({ view: overviewView }) : ''); });
  on('click', 'page', (el) => setQuery({ page: el.dataset.page }, { resetPage: false }));
}

// ---------------------------------------------------------------------------
// Form xe dùng chung (khách lẻ)
// ---------------------------------------------------------------------------
function vehicleFieldsHtml(v = {}, p = '') {
  return `
    ${field('Biển số', input(`${p}plate`, v.plate, 'placeholder="VD: 59TA-12345" autocomplete="off"'))}
    ${field('Số khung xe', input(`${p}vin`, v.vin, 'autocomplete="off"', 'mono'))}
    ${field('Loại xe', modelInput(`${p}model`, v.model, 'required'), { req: true })}
    ${field('Màu xe', input(`${p}color`, v.color))}
    ${field('Số máy động cơ', scanInput(`${p}motor_serial`, v.motor_serial, '', 'mono', 'qr,barcode'))}
    ${field('Serial PIN 1', scanInput(`${p}battery_serial`, v.battery_serial, '', 'mono', 'qr'))}
    ${field('Serial PIN 2', scanInput(`${p}battery_serial_2`, v.battery_serial_2, '', 'mono', 'qr'))}
    ${field('Số km hiện tại', input(`${p}odometer`, v.odometer, 'type="number" min="0"'))}
    ${field('Ngày mua xe', input(`${p}purchase_date`, v.purchase_date, 'type="date"'))}
    ${field('Bảo hành đến', input(`${p}warranty_until`, v.warranty_until, 'type="date"'), { hint: 'Theo sổ bảo hành của hãng' })}`;
}
function vehicleFromData(data, p = '') {
  const keys = ['model', 'plate', 'vin', 'color', 'battery_serial', 'battery_serial_2', 'motor_serial', 'odometer', 'purchase_date', 'warranty_until'];
  return Object.fromEntries(keys.filter((k) => `${p}${k}` in data).map((k) => [k, data[`${p}${k}`]]));
}

function defaultPromise() {
  const d = new Date(Date.now() + 4 * 3600e3);
  d.setMinutes(d.getMinutes() < 30 ? 30 : 60, 0, 0);
  if (d.getHours() >= 18 || d.getHours() < 8) {
    if (d.getHours() >= 18) d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
  }
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ---------------------------------------------------------------------------
// Tiếp nhận xe – tạo phiếu (GSM / khách lẻ)
// ---------------------------------------------------------------------------
async function pageWoNew(ctx) {
  const q = ctx.query;
  const apptId = q.get('appointment');
  const custId = q.get('customer');
  const cvId = q.get('campaign_vehicle');
  const checkinId = q.get('checkin');
  const [techs, appt, custDetail, cvDetail, checkin] = await Promise.all([
    can('wo.assign') ? staffList(S.branch) : Promise.resolve([]),
    apptId ? api('GET', `/api/appointments/${apptId}`) : Promise.resolve(null),
    custId ? api('GET', `/api/customers/${custId}`) : Promise.resolve(null),
    cvId ? api('GET', `/api/campaign-vehicles/${cvId}`) : Promise.resolve(null),
    checkinId ? api('GET', `/api/checkins/${checkinId}`) : Promise.resolve(null),
  ]);
  if (ctx.stale()) return;
  // Đăng ký đã được người khác tiếp nhận (2 người mở cùng lúc / bấm Back) → không tạo phiếu thứ hai
  if (checkin && checkin.status !== 'new') {
    toast(checkin.status === 'done' ? 'Đăng ký này đã được tiếp nhận rồi' : 'Đăng ký này đã hủy', 'error');
    window.location.hash = checkin.work_order_id ? `#/work-orders/${checkin.work_order_id}` : '#/checkins';
    return;
  }

  const st = {
    source: q.get('source') === 'retail' || appt || custDetail ? 'retail' : q.get('source') === 'bship' ? 'bship' : 'gsm',
    mode: 'search', customer: null, vehicleId: '', gsmVehicle: null, forceNewDespiteOpen: false, prefill: {}, files: [],
    // Bảo hành khách lẻ: tài xế GSM / BShip tự mang xe đội tới ('' = khách cá nhân)
    walkin: ['gsm', 'bship'].includes(q.get('walkin')) ? q.get('walkin') : '',
  };
  if (st.walkin) st.source = 'retail';
  const defaultBranch = (checkin && checkin.branch_id) || S.me.branch_id || (appt && appt.branch_id) || (cvDetail && cvDetail.vehicle.branch_id) || S.branch || '';
  const rc = S.meta.reception_checks;
  const inspectOnly = !can('wo.create') && can('wo.inspect');
  if (inspectOnly && st.source === 'retail') st.source = 'gsm';
  const isFleet = () => st.source === 'gsm' || st.source === 'bship';
  const isWalkin = () => st.source === 'retail' && !!st.walkin;
  const fleetSrc = () => (isFleet() ? st.source : st.walkin);
  const useFleetVeh = () => isFleet() || isWalkin();
  const fleetName = () => (fleetSrc() === 'bship' ? 'BShip' : 'GSM');
  const sub = appt ? `Theo lịch hẹn ${fmtDT(appt.scheduled_at)} của <b>${esc(appt.customer_name)}</b>`
    : cvDetail ? `Xe thuộc chiến dịch <b>${esc(cvDetail.vehicle.campaign_name)}</b>`
    : checkin ? `Theo đăng ký tiếp nhận lúc ${esc(String(checkin.created_at).slice(11, 16))} – <b>${esc(checkin.driver_name)}</b>`
    : '';
  const countPick = (name, opts, label) => `<div class="seg-count" role="radiogroup" aria-label="${esc(label)}" aria-required="true">${opts.map(([v, lab]) => `
    <label class="seg-opt"><input type="radio" name="${name}" value="${v}" data-change="acc-count"><span>${esc(lab)}</span></label>`).join('')}</div>`;
  const accLab = (text, hint) => `<div class="acc-cell-lab">${esc(text)} <span class="req">*</span></div>
    <div class="acc-miss-hint" hidden>${esc(hint)}</div>`;

  ctx.setMain(`
    <div class="page-head">
      <div class="titles">
        <h2>Tiếp nhận xe mới</h2>
        ${sub ? `<div class="sub">${sub}</div>` : ''}
      </div>
      <div class="actions"><div class="seg">
        <button type="button" data-click="src" data-v="gsm" class="${st.source === 'gsm' ? 'on' : ''}">${icon('scooter')} Xe Green SM</button>
        <button type="button" data-click="src" data-v="bship" class="${st.source === 'bship' ? 'on' : ''}">${icon('scooter')} Xe BShip</button>
        <button type="button" data-click="src" data-v="retail" class="${st.source === 'retail' ? 'on' : ''}"${inspectOnly ? ' hidden' : ''} title="Khách cá nhân, tài xế tự mang xe riêng, xe doanh nghiệp / đối tác">${icon('user')} Khách lẻ</button>
      </div></div></div>
    <form data-submit="wo-create" id="wo-form" autocomplete="off">
      <div class="stack">
        <div class="card"><div class="card-head"><span class="section-num">1</span><h3 id="sec1-title">Thông tin khách hàng và xe</h3>
          <button type="button" class="btn btn-sm gsm-only" data-click="gsm-new" id="btn-gsm-new">${icon('plus')} Thêm xe mới</button>
        </div><div class="card-body">
          <div class="retail-only walkin-bar">
            <span class="walkin-bar-l">Người mang xe đến</span>
            <div class="seg seg-sm" role="group" aria-label="Người mang xe đến">
              <button type="button" data-click="walkin" data-v="" class="${st.walkin ? '' : 'on'}">${icon('user')} Khách cá nhân</button>
              <button type="button" data-click="walkin" data-v="gsm" class="${st.walkin === 'gsm' ? 'on' : ''}" title="Tài xế tự mang xe Green SM tới bảo hành">${icon('scooter')} Tài xế GSM</button>
              <button type="button" data-click="walkin" data-v="bship" class="${st.walkin === 'bship' ? 'on' : ''}" title="Tài xế tự mang xe BShip tới bảo hành">${icon('scooter')} Tài xế BShip</button>
            </div>
          </div>
          <div id="cust-sec"></div>
          <div class="form-grid cols-4 retail-only walkin-only" style="margin-top:14px" hidden>
            ${field('Họ tên tài xế', input('w_driver_name', '', 'required'), { req: true })}
            ${field('SĐT tài xế', input('w_driver_phone', '', 'required type="tel"'), { req: true })}
          </div>
          <div class="form-grid cols-4 gsm-only" id="gsm-driver" style="margin-top:14px">
            ${field('Họ và tên', input('driver_name', (cvDetail && cvDetail.vehicle.contact_name) || '', 'required'), { req: true })}
            ${field('Số điện thoại', input('driver_phone', (cvDetail && cvDetail.vehicle.contact_phone) || '', 'required type="tel"'), { req: true })}
            ${field('Email', input('driver_email', '', 'type="email"'))}
            ${field('Yêu cầu khách hàng', input('customer_request', '', 'required'), { req: true })}
          </div>
        </div></div>

        <div class="card gsm-only"><div class="card-head"><span class="section-num">2</span><h3>Thông số khi nhận xe</h3></div><div class="card-body">
          <div class="form-grid gsm-params">
            ${can('branch.all') ? field('Cơ sở', select('branch_id', branchOptions(), defaultBranch || (branchOptions()[0] || [])[0] || '', 'required data-change="wo-branch"', '— Chọn cơ sở —'), { req: true }) : ''}
            ${field('Loại dịch vụ', `<span id="svc-sel"></span>`, { req: true })}
            ${field('Số Km', input('odometer', '', 'required type="number" min="0"'), { req: true })}
            ${field('% PIN', input('battery_level', '', 'required type="number" min="0" max="100"'), { req: true })}
            ${field('% PIN 2', input('battery_level_2', '', 'type="number" min="0" max="100" placeholder="0–100"'), { cls: 'pin2-field hidden', hint: 'Xe 2 PIN (Feliz II / Evo Max)' })}
          </div>
          ${insuranceFields()}
          <div class="label" style="margin:16px 0 8px">Phụ kiện</div>
          <div class="acc-grid">
            <div class="acc-cell acc-cell-charger" data-acc="charger">
              ${accLab('Sạc', 'Tick "Có sạc" hoặc "Không sạc"')}
              <div class="acc-cell-ctl" role="group" aria-label="Sạc" aria-required="true">
                <label class="check"><input type="checkbox" name="acc_charger" data-change="acc-charger"><span>Có sạc</span></label>
                <label class="check"><input type="checkbox" name="acc_no_charger" data-change="acc-charger"><span>Không sạc</span></label>
                <div id="charger-scan" class="acc-charger-scan" hidden>
                  ${chargerQrInputs()}
                </div>
              </div>
            </div>
            <div class="acc-cell acc-cell-pins" data-acc="pins">
              ${accLab('PIN trên xe', 'Chọn số PIN trên xe (kể cả "Không")')}
              <div class="acc-cell-ctl">${countPick('acc_pins', [['0', 'Không'], ['1', '1 PIN'], ['2', '2 PIN']], 'PIN trên xe')}
                ${batterySerialInputs()}
              </div>
            </div>
            <div class="acc-cell" data-acc="mirrors">
              ${accLab('Gương', 'Chọn số gương (kể cả "Không")')}
              <div class="acc-cell-ctl">${countPick('acc_mirrors', [['0', 'Không'], ['1', '1 gương'], ['2', '2 gương']], 'Gương')}</div>
            </div>
            <div class="acc-cell">
              <div class="acc-cell-lab">Khác</div>
              <div class="acc-cell-ctl acc-row-checks">
                <label class="check"><input type="checkbox" name="acc_key"><span>Chìa khóa</span></label>
                <label class="check"><input type="checkbox" name="acc_remote"><span>Remote</span></label>
                <label class="check"><input type="checkbox" name="acc_spare_seat"><span>Yên phụ</span></label>
              </div>
            </div>
          </div>
        </div></div>

        <div class="card gsm-only"><div class="card-head"><span class="section-num">3</span><h3>Kiểm tra xe</h3></div><div class="card-body">
          ${inspectNqInputs({}, 3)}
          <div class="old-parts-row">${checkbox('old_parts_return', false, 'Tài xế lấy lại phụ tùng cũ')}</div>
          ${(can('wo.attach') || can('wo.edit') || can('wo.inspect')) ? `
          <div class="label" style="margin:14px 0 8px">Hình ảnh</div>
          <div class="upload-bar">
            <label class="btn btn-primary">${icon('camera')} Chụp ảnh<input type="file" accept="image/*" capture="environment" multiple data-change="pick-photos"></label>
          </div>
          <div id="pending-files"></div>` : '<div class="muted" style="margin-top:12px">Bạn không có quyền tải ảnh.</div>'}
        </div></div>

        <div class="card retail-only"><div class="card-head"><span class="section-num">2</span><h3>Thông tin tiếp nhận</h3></div><div class="card-body">
          <div class="form-grid cols-4">
            ${can('branch.all') ? field('Cơ sở', select('branch_id', branchOptions(), defaultBranch, 'required data-change="wo-branch"', '— Chọn cơ sở —'), { req: true }) : ''}
            ${field('Loại dịch vụ', `<span id="svc-sel-retail"></span>`, { req: true })}
            ${field('Mức ưu tiên', select('priority', S.meta.priorities, 'normal'))}
            ${field('Số km (ODO)', input('odometer', '', 'type="number" min="0" placeholder="VD: 52300"'))}
            ${field('% pin khi nhận', input('battery_level', '', 'type="number" min="0" max="100" placeholder="0–100"'))}
            <div class="field"><label>Hẹn trả xe</label>${input('promised_at', defaultPromise(), 'type="datetime-local"')}</div>
            ${can('wo.assign') ? field('KTV kiểm tra / sửa chữa', `<span id="tech-sel-retail"></span>`) : ''}
            <div class="field quote-only"><label>Chi phí dự kiến (VNĐ)</label>${costInput('quote_amount', '', 'placeholder="Có thể nhập sau"')}</div>
            ${field('Tình trạng xe / yêu cầu', textarea('symptoms', (appt && appt.note) || (cvDetail ? `Xe chiến dịch ${cvDetail.vehicle.campaign_name}` : ''), 'required rows="3" placeholder="Mô tả lỗi, hiện tượng, yêu cầu…"'), { req: true, cls: 'span-all' })}
            ${field('Hạng mục lỗi', chipSelect('faults', S.meta.settings.faults, []), { cls: 'span-all' })}
            ${field('Ghi chú của Cố vấn dịch vụ', textarea('advisor_note', '', 'rows="2" style="min-height:56px" placeholder="Ghi chú của cố vấn dịch vụ…"'), { cls: 'span-all' })}
          </div>
          ${insuranceFields()}</div></div>

        <div class="card retail-only"><div class="card-head"><span class="section-num">3</span><h3>Kiểm tra khi nhận xe & hình ảnh</h3>
          <button type="button" class="btn btn-sm btn-ghost" data-click="rc-all">Đánh dấu tất cả</button></div><div class="card-body">
          <div class="checks">${rc.map((c) => checkbox(`rc_${c.key}`, false, c.label)).join('')}</div>
          <div style="margin-top:14px">${field('Ghi chú ngoại quan', input('belongings', ''))}</div>
          ${can('wo.attach') || can('wo.edit') ? `<div class="label" style="margin:16px 0 8px">Ảnh nhận xe<span class="quote-only"> & báo giá</span></div>
          <div class="upload-bar">
            <label class="btn">${icon('camera')} Chụp / chọn ảnh<input type="file" accept="image/*,image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" multiple data-change="pick-photos"></label>
            <label class="btn quote-only">${icon('file')} Báo giá PDF<input type="file" accept="application/pdf,.pdf" data-change="pick-pdf"></label>
          </div>
          <div id="pending-files-retail"></div>` : ''}
        </div></div>
      </div>
      <div class="sticky-foot"><a class="btn" href="#/work-orders">Hủy</a><button type="submit" class="btn btn-primary">${icon('check')} ${inspectOnly ? 'Lưu phiếu kiểm tra' : 'Tạo phiếu'}</button></div>
    </form>`);

  // ----- Nguồn xe -----
  const applySource = () => {
    $$('#wo-form .gsm-only').forEach((el) => { el.hidden = !isFleet(); });
    $$('#wo-form .retail-only').forEach((el) => { el.hidden = st.source !== 'retail'; });
    // Tránh submit field trùng khi ẩn section
    $$('#wo-form .gsm-only input, #wo-form .gsm-only select, #wo-form .gsm-only textarea').forEach((el) => {
      el.disabled = !isFleet();
    });
    $$('#wo-form .retail-only input, #wo-form .retail-only select, #wo-form .retail-only textarea').forEach((el) => {
      el.disabled = st.source !== 'retail';
    });
    $$('[data-click="src"]').forEach((b) => b.classList.toggle('on', b.dataset.v === st.source));
    if (st.source !== 'retail') st.walkin = '';
    $$('[data-click="walkin"]').forEach((b) => b.classList.toggle('on', b.dataset.v === st.walkin));
    $$('#wo-form .walkin-only').forEach((el) => {
      el.hidden = !isWalkin();
      el.querySelectorAll('input').forEach((inp) => { inp.disabled = !isWalkin(); });
    });
    $('#sec1-title').textContent = isWalkin() ? `Thông tin xe ${fleetName()} và tài xế` : 'Thông tin khách hàng và xe';
    const btnNew = $('#btn-gsm-new');
    if (btnNew) btnNew.hidden = !useFleetVeh();
    // Chỉ hiện các loại dịch vụ hợp với nguồn xe → chọn nhanh, ít nhầm; tài xế đội tự mang tới = chỉ bảo hành
    const allow = isWalkin() ? ['warranty'] : (S.meta.service_types_by_source || {})[st.source];
    const types = allow
      ? allow.filter((k) => S.meta.service_types[k]).map((k) => [k, S.meta.service_types[k]])
      : Object.entries(S.meta.service_types);
    // Đăng ký tiếp nhận: mang loại dịch vụ nhân viên đã chọn sang phiếu
    const fromCheckin = checkin && checkin.service ? ({ maintenance: 'maintenance', repair: 'repair', liquidation: 'liquidation' })[checkin.service] : null;
    const retailSel = $('#svc-sel-retail select');
    const keepSvc = st.source === 'retail' && retailSel && !retailSel.disabled ? retailSel.value : null;
    const wanted = isWalkin() ? 'warranty' : keepSvc || fromCheckin || (isFleet() ? 'liquidation' : (q.get('svc') || (appt ? appt.service_type : 'repair')));
    const svcHtml = select('service_type', types, types.some(([k]) => k === wanted) ? wanted : types[0][0], 'required data-change="svc-type"');
    if ($('#svc-sel')) $('#svc-sel').innerHTML = svcHtml;
    if ($('#svc-sel-retail')) $('#svc-sel-retail').innerHTML = svcHtml;
    // Select vừa chèn vào phần đang ẩn cũng phải disabled, nếu không form gửi 2 giá trị service_type
    $$('#wo-form .gsm-only select[name="service_type"]').forEach((el) => { el.disabled = !isFleet(); });
    $$('#wo-form .retail-only select[name="service_type"]').forEach((el) => { el.disabled = st.source !== 'retail'; });
    renderCust();
    renderTechSelect();
    toggleInsurance();
  };
  // Ô bảo hiểm chỉ hiện khi Loại dịch vụ = Bảo hiểm (trong phần đang hiển thị)
  const toggleInsurance = () => {
    $$('#wo-form .ins-fields').forEach((box) => {
      const sec = box.closest('.gsm-only, .retail-only');
      const sel = sec && sec.querySelector('select[name="service_type"]');
      box.hidden = !(sel && sel.value === 'insurance');
    });
    // Bảo hành khách lẻ: hãng chi trả, không báo giá / chi phí
    const rSel = $('#svc-sel-retail select');
    const noQuote = st.source === 'retail' && !!rSel && rSel.value === 'warranty';
    $$('#wo-form .retail-only .quote-only').forEach((el) => {
      el.hidden = noQuote;
      el.querySelectorAll('input').forEach((inp) => {
        inp.disabled = noQuote;
        if (!noQuote) return;
        if (inp.type === 'checkbox') inp.checked = false;
        else if (inp.type !== 'file') inp.value = '';
      });
    });
  };
  const setAccMissing = (cell, missing) => {
    if (!cell) return;
    cell.classList.toggle('acc-missing', missing);
    const hint = cell.querySelector('.acc-miss-hint');
    if (hint) hint.hidden = !missing;
  };
  // "Có sạc" / "Không sạc" loại trừ nhau; bỏ tick cả hai = chưa kiểm
  on('change', 'acc-charger', (el) => {
    const other = $(`#wo-form [name="${el.name === 'acc_charger' ? 'acc_no_charger' : 'acc_charger'}"]`);
    if (el.checked && other) other.checked = false;
    if (el.checked) setAccMissing(el.closest('.acc-cell'), false);
    const has = !!($('#wo-form [name="acc_charger"]') || {}).checked;
    const box = $('#charger-scan');
    if (!box) return;
    box.hidden = !has;
    if (!has) box.querySelectorAll('input').forEach((inp) => { inp.value = ''; });
  });
  // "% PIN 2": xe Feliz II / Evo Max, hoặc chọn "2 PIN" trên xe
  const updatePin2 = () => {
    const box = $('#wo-form .pin2-field');
    if (!box) return;
    const v = st.gsmVehicle;
    const model = v ? (v.id ? v.model : (($('#wo-form [name="g_model"]') || {}).value || '')) : '';
    const twoPins = (($('#wo-form [name="acc_pins"]:checked') || {}).value || '') === '2';
    const show = isFleet() && (InspectText.twoPinModel(model) || twoPins);
    box.classList.toggle('hidden', !show);
    const inp = box.querySelector('input');
    if (inp && !show) inp.value = '';
  };
  // Serial trên hồ sơ xe chỉ làm gợi ý — phiếu ghi đúng mã quét / nhập lúc nhận xe
  const pinSerialHints = () => {
    const v = st.gsmVehicle && st.gsmVehicle.id ? st.gsmVehicle : {};
    [['acc_battery_serial', v.battery_serial], ['acc_battery_serial_2', v.battery_serial_2]].forEach(([name, val]) => {
      const inp = $(`#wo-form [name="${name}"]`);
      if (inp) inp.placeholder = val ? `Hồ sơ xe: ${val}` : 'Quét hoặc nhập mã BAT…';
    });
  };
  on('change', 'acc-count', (el) => {
    el.closest('.seg-count')?.querySelectorAll('.seg-opt').forEach((lab) => {
      lab.classList.toggle('on', lab.querySelector('input')?.checked);
    });
    setAccMissing(el.closest('.acc-cell'), false);
    if (el.name === 'acc_pins') {
      updatePin2();
      applyPinSerials(el.closest('.acc-cell'), el.value);
      el.closest('.acc-cell').querySelectorAll('.pin-serial-item').forEach((it) => it.classList.remove('pin-serial-missing'));
      el.closest('.acc-cell').querySelectorAll('.pin-serial-req').forEach((r) => { r.hidden = el.value !== '2'; });
    }
  });
  on('change', 'g-model', () => updatePin2());
  on('change', 'stage', () => {
    const v = ($('#wo-form [name="stage"]:checked') || {}).value;
    $$('[data-change="stage"]').forEach((r) => r.closest('.choice')?.classList.toggle('selected', r.checked));
    const dms = $('#dms-block');
    if (dms) dms.hidden = v !== 'dms';
    const ro = $('#wo-form [name="dms_ro_code"]');
    if (ro) ro.required = v === 'dms';
  });
  on('click', 'src', (el) => {
    if (st.source === el.dataset.v) return;
    st.source = el.dataset.v; st.mode = 'search'; st.customer = null; st.vehicleId = ''; st.gsmVehicle = null; st.forceNewDespiteOpen = false;
    applySource();
  });
  on('click', 'walkin', (el) => {
    if (st.walkin === el.dataset.v) return;
    st.walkin = el.dataset.v; st.mode = 'search'; st.customer = null; st.vehicleId = ''; st.gsmVehicle = null; st.forceNewDespiteOpen = false;
    applySource();
  });

  // ----- Khối 1: xe / khách hàng -----
  const renderCust = () => {
    const sec = $('#cust-sec');
    if (useFleetVeh()) {
      renderGsm(sec);
      updatePin2();
      pinSerialHints();
      return undefined;
    }
    if (st.mode === 'search') {
      sec.innerHTML = `<div class="search-box">${icon('search')}<input class="input" id="lookup" placeholder="Nhập SĐT, tên khách hàng, biển số hoặc số khung để tìm…" data-input="lookup" data-debounce="300" data-noenter></div>
        <div id="lookup-results"></div>
        <div class="row" style="margin-top:12px"><span class="muted">Khách hàng chưa có trong hệ thống?</span>
        ${can('customer.edit') ? '<button type="button" class="btn btn-sm" data-click="cust-new">+ Tạo khách hàng mới</button>' : ''}</div>`;
      $('#lookup').focus();
    } else if (st.mode === 'existing') {
      const c = st.customer;
      sec.innerHTML = `<div class="selected-customer"><span class="avatar">${esc((String(c.name || '').trim().split(/\s+/).pop() || '?')[0] || '?')}</span>
        <div class="grow"><div class="strong">${esc(c.name)} ${customerTypeBadge(c.type || 'individual')}</div><div class="small muted">${esc(c.phone)}${c.contact_name ? ` · LH: ${esc(c.contact_name)}` : ''}${c.tax_code ? ` · MST ${esc(c.tax_code)}` : ''}${c.address ? ` · ${esc(c.address)}` : ''}</div></div>
        <button type="button" class="btn btn-sm" data-click="cust-change">Đổi khách hàng</button></div>
        <div class="label" style="margin:16px 0 8px">Chọn xe tiếp nhận <span class="req">*</span></div>
        <div class="choice-grid">${c.vehicles.map((v) => `<label class="choice ${String(st.vehicleId) === String(v.id) ? 'selected' : ''}">
          <input type="radio" name="vehicle_pick" value="${v.id}" data-change="veh-pick" ${String(st.vehicleId) === String(v.id) ? 'checked' : ''}>
          <div><div class="strong">${esc(v.model)} ${plateHtml(v.plate)}</div><div class="small muted mono">${esc(v.vin || 'Chưa có số khung')}</div>
          <div class="small">${warrantyHtml(v.warranty_until)}</div></div></label>`).join('')}
          ${can('customer.edit') ? `<label class="choice ${st.vehicleId === 'new' ? 'selected' : ''}"><input type="radio" name="vehicle_pick" value="new" data-change="veh-pick" ${st.vehicleId === 'new' ? 'checked' : ''}>
          <div><div class="strong">+ Xe khác của khách</div><div class="small muted">Thêm xe mới vào hồ sơ</div></div></label>` : ''}</div>
        <div id="veh-new"></div>`;
      renderVehNew();
    } else {
      const p = st.prefill;
      const ctype = isBusinessCustomer(p.type) ? 'business' : (p.type || 'individual');
      const biz = ctype === 'business';
      sec.innerHTML = `<div class="row" style="margin-bottom:12px"><span class="badge b-violet plain">Khách hàng mới</span><span style="flex:1"></span>
        <button type="button" class="btn btn-sm btn-ghost" data-click="cust-change">← Tìm khách hàng có sẵn</button></div>
        <div class="form-grid cols-4">
          ${field('Loại khách hàng', select('c_type', [['individual', 'Cá nhân'], ['business', 'Doanh nghiệp / Đối tác']], ctype, 'required data-change="c-type"'), { req: true })}
          ${field(biz ? 'Tên công ty' : 'Họ tên khách hàng', input('c_name', p.name, 'required data-c-name'), { req: true })}
          ${field('Số điện thoại', input('c_phone', p.phone, 'required type="tel"'), { req: true })}
          ${field('Mã số thuế (MST)', input('c_tax_code', p.tax_code || '', '', 'mono'), { cls: `biz-field${biz ? '' : ' hidden'}` })}
          ${field('Người liên hệ', input('c_contact_name', p.contact_name || ''), { cls: `biz-field${biz ? '' : ' hidden'}` })}
          ${field('Email', input('c_email', p.email || '', 'type="email"'))}
          ${field('Địa chỉ', input('c_address', p.address || ''), { cls: 'span-all' })}
        </div>
        <div class="label" style="margin:18px 0 8px">Thông tin xe</div>
        <div class="form-grid cols-4">${vehicleFieldsHtml({ model: p.model, plate: p.plate }, 'v_')}</div>`;
      on('change', 'c-type', (el) => {
        const form = el.closest('form') || el.closest('#cust-sec') || document;
        const t = el.value;
        st.prefill = { ...st.prefill, type: t };
        const b = t === 'business';
        const nameLab = document.querySelector('[data-c-name]')?.closest('.field')?.querySelector('label');
        if (nameLab) nameLab.innerHTML = `${b ? 'Tên công ty' : 'Họ tên khách hàng'} <span class="req">*</span>`;
        document.querySelectorAll('#cust-sec .biz-field').forEach((f) => f.classList.toggle('hidden', !b));
      });
    }
    return undefined;
  };

  const openOrdersHtml = (v) => {
    const list = Array.isArray(v.open_orders) ? v.open_orders : (v.open_code ? [{ id: v.open_id, code: v.open_code, dms_ro_code: v.open_dms_ro }] : []);
    if (!list.length) return '';
    const links = list.map((o) => `<a href="#/work-orders/${o.id}">${esc(o.code)}</a>`).join(', ');
    const label = list.length > 1 ? `Đang có ${list.length} phiếu` : 'Đang có phiếu';
    return `<span class="selected-open-inline">${icon('alert')} ${label} ${links}</span>`;
  };

  const renderGsm = (sec) => {
    const v = st.gsmVehicle;
    if (v && v.id) {
      sec.innerHTML = `<div class="selected-customer selected-customer-side selected-customer-compact">
        ${icon('scooter')}
        <div class="grow">
          <div class="strong">${esc(v.plate || '—')}</div>
          <div class="small mono">${esc(v.vin || '—')}</div>
          <div class="small">${esc(v.model || '—')}</div>
        </div>
        <div class="selected-side">
          ${openOrdersHtml(v)}
          <span class="small muted selected-side-meta">${v.visits ? `${v.visits} lần vào xưởng` : 'Chưa vào xưởng'}${v.odometer != null ? ` · ODO ${esc(String(v.odometer).replace(/\D/g, '') || v.odometer)} km` : ''}</span>
          <button type="button" class="btn btn-sm selected-change" data-click="gsm-change">Đổi xe</button>
        </div>
      </div>`;
      return;
    }
    if (v && v.isNew) {
      sec.innerHTML = `<div class="row" style="margin-bottom:12px"><span class="badge b-blue plain">Xe ${fleetName()} mới</span><span style="flex:1"></span>
        <button type="button" class="btn btn-sm btn-ghost" data-click="gsm-change">← Tìm xe có sẵn</button></div>
        <div class="form-grid cols-4">
          ${field('Biển số', input('g_plate', v.plate, ''))}
          ${field('Số khung xe', input('g_vin', v.vin, 'required', 'mono'), { req: true })}
          ${field('Loại xe', select('g_model', (S.meta.gsm_models || ['Evo 200', 'Feliz S', 'Evo Max', 'Feliz II']).map((m) => [m, m]), v.model || '', 'required data-change="g-model"', '— Chọn loại xe —'), { req: true })}
          ${field('Màu xe', select('g_color', (S.meta.gsm_colors || ['Xanh Aqua', 'Đỏ', 'Trắng', 'Đen']).map((c) => [c, c]), v.color || '', '', '— Chọn màu —'))}
          ${field('Số máy động cơ', scanInput('g_motor_serial', v.motor_serial || '', '', 'mono', 'qr,barcode'), { hint: 'Quét QR hoặc mã vạch' })}
        </div>
        <div class="small muted" style="margin-top:8px">Serial PIN nhập ở mục Phụ kiện → PIN trên xe.</div>`;
      return;
    }
    sec.innerHTML = `<div class="search-box">${icon('search')}<input class="input" id="fleet-lookup" placeholder="Nhập biển số hoặc số khung xe…" data-input="fleet-lookup" data-debounce="300" data-noenter></div>
      <div id="fleet-results"></div>`;
    $('#fleet-lookup').focus();
  };

  let fleetResults = [];
  on('input', 'fleet-lookup', async (el) => {
    const term = el.value.trim();
    const box = $('#fleet-results');
    if (term.length < 3) { box.innerHTML = ''; return; }
    fleetResults = await api('GET', `/api/fleet/lookup${qs({ q: term, fleet: fleetSrc() })}`);
    if (!$('#fleet-results')) return;
    box.innerHTML = fleetResults.length ? `<div class="lookup-results">${fleetResults.map((v, i) => {
      const opens = Array.isArray(v.open_orders) ? v.open_orders : [];
      const openBadge = opens.length
        ? `<span class="badge b-red plain fleet-hit-open">${opens.length > 1 ? `Đang có ${opens.length} phiếu` : 'Đang có phiếu'} ${esc(opens.map((o) => o.code).join(', '))}</span>`
        : '';
      return `<button type="button" class="fleet-hit" data-click="fleet-pick" data-i="${i}">
      ${icon('scooter')}
      <div class="grow">
        <div class="strong">${esc(v.plate || '—')}</div>
        <div class="small mono">${esc(v.vin || '—')}</div>
        <div class="small">${esc(v.model || '')}</div>
        ${!opens.length ? `<div class="small muted">${v.visits || 0} lần vào xưởng</div>` : ''}
      </div>
      ${openBadge}
    </button>`;
    }).join('')}</div>`
      : `<div class="small muted" style="margin-top:8px">Không tìm thấy xe trong danh sách ${fleetName()}.</div>`;
  });
  const pickGsm = async (v) => {
    const opens = Array.isArray(v.open_orders) ? v.open_orders : (v.open_id ? [{ id: v.open_id, code: v.open_code }] : []);
    if (opens.length) {
      const codes = opens.map((o) => o.code).join(', ');
      const ok = await confirmBox(
        opens.length > 1
          ? `Xe đang có ${opens.length} phiếu chưa đóng: ${codes}. Bạn vẫn muốn mở phiếu mới?`
          : `Xe đang có phiếu chưa đóng ${codes}. Bạn vẫn muốn mở phiếu mới?`,
        { title: 'Xe đã có phiếu', okLabel: 'Mở phiếu mới', danger: true },
      );
      if (!ok) return;
      st.forceNewDespiteOpen = true;
    } else {
      st.forceNewDespiteOpen = false;
    }
    st.gsmVehicle = v;
    renderCust();
    const f = $('#wo-form');
    if (v.odometer) f.odometer.placeholder = `Lần trước: ${numf(v.odometer)} km`;
  };
  on('click', 'fleet-pick', (el) => { pickGsm(fleetResults[Number(el.dataset.i)]); });
  on('click', 'gsm-new', () => {
    const term = ($('#fleet-lookup') || {}).value || '';
    const t = term.trim().toUpperCase();
    st.gsmVehicle = { isNew: true, ...(/^[A-Z0-9]{10,}$/.test(t) ? { vin: t } : { plate: t }) };
    st.forceNewDespiteOpen = false;
    renderCust();
  });
  on('click', 'gsm-change', () => { st.gsmVehicle = null; st.forceNewDespiteOpen = false; renderCust(); });

  let lookupResults = [];
  on('input', 'lookup', async (el) => {
    const term = el.value.trim();
    const box = $('#lookup-results');
    if (term.length < 2) { box.innerHTML = ''; return; }
    lookupResults = await api('GET', `/api/lookup${qs({ q: term })}`);
    if (!$('#lookup-results')) return;
    box.innerHTML = lookupResults.length ? `<div class="lookup-results">${lookupResults.map((c, i) => `<button type="button" data-click="lookup-pick" data-i="${i}">
      <span class="avatar sm">${esc((String(c.name || '').trim().split(/\s+/).pop() || '?')[0] || '?')}</span>
      <div class="grow"><div class="strong">${esc(c.name)} · ${esc(c.phone)}</div>
      <div class="small muted">${c.vehicles.map((v) => `${esc(v.model)}${v.plate ? ` (${esc(v.plate)})` : ''}`).join(', ') || 'Chưa có xe'}</div></div></button>`).join('')}</div>`
      : '<div class="small muted" style="margin-top:8px">Không tìm thấy khách hàng phù hợp.</div>';
  });
  const selectCustomer = (c, vehicleId) => {
    st.mode = 'existing';
    st.customer = c;
    st.vehicleId = vehicleId || (c.vehicles.length === 1 ? String(c.vehicles[0].id) : '');
    renderCust();
  };
  on('click', 'lookup-pick', (el) => selectCustomer(lookupResults[Number(el.dataset.i)]));
  on('click', 'cust-new', () => {
    const term = ($('#lookup') || {}).value || '';
    st.prefill = /^[\d\s+.]+$/.test(term) ? { phone: term.trim() } : { name: term.trim() };
    st.mode = 'new';
    renderCust();
  });
  on('click', 'cust-change', () => { st.mode = 'search'; st.customer = null; st.vehicleId = ''; renderCust(); });
  const renderVehNew = () => {
    const box = $('#veh-new');
    if (box) box.innerHTML = st.vehicleId === 'new' ? `<div class="form-grid cols-4" style="margin-top:14px">${vehicleFieldsHtml({}, 'v_')}</div>` : '';
  };
  on('change', 'veh-pick', (el) => {
    st.vehicleId = el.value;
    $$('#cust-sec .choice').forEach((c) => c.classList.toggle('selected', c.querySelector('input').checked));
    renderVehNew();
  });

  // ----- Kỹ thuật viên -----
  const renderTechSelect = () => {
    const branchSel = $('#wo-form [name="branch_id"]:not([disabled])') || $('#wo-form [name="branch_id"]');
    const bid = branchSel ? branchSel.value : S.me.branch_id;
    const list = techs.filter((t) => !bid || String(t.branch_id) === String(bid));
    const defaultTech = list.some((t) => String(t.id) === String(S.me.id)) ? S.me.id : '';
    const html = select('technician_id', list.map((t) => [t.id, t.full_name]), defaultTech, '', '— Chưa phân công —');
    if ($('#tech-sel-retail')) $('#tech-sel-retail').innerHTML = html;
  };
  on('change', 'wo-branch', () => renderTechSelect());
  on('change', 'svc-type', () => toggleInsurance());
  on('click', 'rc-all', () => $$('#wo-form input[name^="rc_"]').forEach((c) => { c.checked = true; }));

  // ----- File chờ tải lên -----
  const renderFiles = () => {
    const boxes = [$('#pending-files'), $('#pending-files-retail')].filter(Boolean);
    const html = st.files.length ? `<div class="gallery">${st.files.map((f, i) => `<div class="att">
      <a class="thumb">${f.preview ? `<img src="${f.preview}" alt="">` : icon('file')}</a>
      <div class="meta"><div class="nm">${esc(f.file.name)}</div><div class="muted">${esc(S.meta.attachment_kinds[f.kind] || f.kind)}</div></div>
      <button type="button" class="btn btn-ghost btn-icon btn-sm del" data-click="file-remove" data-i="${i}" title="Bỏ">${icon('x')}</button></div>`).join('')}</div>` : '';
    boxes.forEach((box) => { box.innerHTML = html; });
  };
  on('change', 'pick-photos', async (el) => {
    const picked = Array.from(el.files || []);
    el.value = '';
    const form = el.closest('form');
    const firstVal = (sel) => (form ? [...form.querySelectorAll(sel)].map((i) => String(i.value || '').trim()).find(Boolean) : '') || '';
    const stampCtx = { branchId: firstVal('select[name="branch_id"]') || undefined, plate: firstVal('input[name$="plate"]').toUpperCase() };
    // Nén từng ảnh ngay khi chụp → ít bộ nhớ, không bị văng khi chụp nhiều ảnh
    for (const file of picked) {
      const p = await preparePhoto(file, stampCtx);
      st.files.push({ kind: 'photo_in', ...p });
      renderFiles();
    }
    saveDraftSoon();
  });
  on('change', 'pick-pdf', (el) => {
    Array.from(el.files || []).forEach((file) => st.files.push({ kind: 'quote', file }));
    el.value = '';
    renderFiles();
    saveDraftSoon();
  });
  on('click', 'file-remove', (el) => { st.files.splice(Number(el.dataset.i), 1); renderFiles(); saveDraftSoon(); });

  // ----- Lưu -----
  on('submit', 'wo-create', async (form, data) => {
    const insurance = data.service_type === 'insurance' ? {
      company: String(data.ins_company || '').trim(),
      claim_no: String(data.ins_claim_no || '').trim(),
      adjuster: String(data.ins_adjuster || '').trim(),
    } : null;
    const payload = {
      source: st.source, branch_id: data.branch_id, service_type: data.service_type, priority: data.priority || 'normal', odometer: data.odometer,
      battery_level: data.battery_level, technician_id: data.technician_id, belongings: data.belongings,
      advisor_note: data.advisor_note, faults: parseChips(data.faults), appointment_id: appt ? appt.id : null,
      reception_check: Object.fromEntries(rc.map((c) => [c.key, !!data[`rc_${c.key}`]])),
      items: [],
    };
    if (isFleet()) {
      payload.stage = 'inspecting';
      payload.priority = 'normal';
      payload.belongings = null;
      payload.technician_id = null; // Người kiểm tra = tài khoản tạo phiếu (inspector)
      if (st.forceNewDespiteOpen) payload.force_new = true;
      payload.battery_level_2 = data.battery_level_2 || null;
      const hasCharger = !!data.acc_charger;
      const accMissing = [
        ['charger', !hasCharger && !data.acc_no_charger, 'Sạc (Có sạc / Không sạc)'],
        ['pins', data.acc_pins === undefined || data.acc_pins === '', 'PIN trên xe'],
        ['mirrors', data.acc_mirrors === undefined || data.acc_mirrors === '', 'Gương'],
      ];
      accMissing.forEach(([key, miss]) => setAccMissing($(`#wo-form .acc-cell[data-acc="${key}"]`), miss));
      const missing = accMissing.filter(([, miss]) => miss);
      // 2 PIN → bắt buộc cả Serial PIN 1 và 2 (1 PIN: Serial PIN 1 không bắt buộc)
      const serialMissing = data.acc_pins === '2'
        ? [['acc_battery_serial', 'Serial PIN 1'], ['acc_battery_serial_2', 'Serial PIN 2']].filter(([name]) => !InspectText.normBatSerial(data[name]))
        : [];
      $$('#wo-form .pin-serial-item').forEach((it) => {
        const name = (it.querySelector('input') || {}).name;
        it.classList.toggle('pin-serial-missing', serialMissing.some(([n]) => n === name));
      });
      if (missing.length || serialMissing.length) {
        const cell = missing.length ? $(`#wo-form .acc-cell[data-acc="${missing[0][0]}"]`) : null;
        const first = cell ? cell.querySelector('input') : $(`#wo-form [name="${serialMissing[0][0]}"]`);
        (cell || first)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (first) first.focus({ preventScroll: true });
        const parts = [
          missing.length && `vui lòng chọn: ${missing.map(([, , lab]) => lab).join(', ')}`,
          serialMissing.length && `vui lòng nhập: ${serialMissing.map(([, lab]) => lab).join(', ')}`,
        ].filter(Boolean);
        throw new Error(`Phụ kiện – ${parts.join('; ')}`);
      }
      const pins = Number(data.acc_pins);
      const mirrors = Number(data.acc_mirrors);
      const qrOuter = hasCharger ? String(data.charger_serial || '').trim() : '';
      const qrInner = hasCharger ? String(data.charger_serial_inner || '').trim() : '';
      if (hasCharger && !qrOuter && !qrInner) {
        throw new Error('Có sạc – vui lòng quét / nhập ít nhất một mã QR sạc (bên ngoài hoặc bên trong)');
      }
      const pinSerials = pinSerialsFromData(data, pins);
      payload.inspection_notes = {
        driver_name: String(data.driver_name || '').trim(),
        driver_phone: String(data.driver_phone || '').trim(),
        driver_email: String(data.driver_email || '').trim(),
        customer_request: String(data.customer_request || '').trim(),
        accessories: {
          charger: hasCharger,
          charger_serial: qrOuter,
          charger_serial_inner: qrInner,
          pins,
          ...pinSerials,
          mirrors,
          spare_seat: !!data.acc_spare_seat,
          key: !!data.acc_key,
          remote: !!data.acc_remote,
        },
        old_parts_return: !!data.old_parts_return,
        ...inspectNqFromData(data),
      };
      if (!payload.inspection_notes.driver_name) throw new Error('Vui lòng nhập họ và tên tài xế');
      if (!payload.inspection_notes.driver_phone) throw new Error('Vui lòng nhập số điện thoại tài xế');
      if (!payload.inspection_notes.customer_request) throw new Error('Vui lòng nhập yêu cầu khách hàng');
      payload.reception_check = {
        charger: hasCharger,
        key: !!data.acc_key,
        mirrors: mirrors >= 2,
        battery: pins >= 1,
        remote: !!data.acc_remote,
        body: false,
        lights: false,
        brakes: false,
        tires: false,
        display: false,
      };
      payload.symptoms = payload.inspection_notes.customer_request;
      payload.diagnosis = '';
      payload.faults = [];
      payload.advisor_note = null;
      const v = st.gsmVehicle;
      if (!v) throw new Error(`Vui lòng tìm và chọn xe ${fleetName()}, hoặc nhập xe ${fleetName()} mới`);
      if (v.id) payload.vehicle_id = v.id;
      else payload.vehicle = {
        model: data.g_model,
        plate: data.g_plate,
        vin: data.g_vin,
        color: data.g_color,
        motor_serial: data.g_motor_serial,
        battery_serial: pinSerials.battery_serial,
        battery_serial_2: pinSerials.battery_serial_2,
      };
    } else if (isWalkin()) {
      payload.symptoms = data.symptoms;
      payload.promised_at = data.promised_at;
      payload.quote_amount = data.quote_amount;
      payload.walkin = st.walkin;
      payload.service_type = 'warranty';
      if (st.forceNewDespiteOpen) payload.force_new = true;
      payload.inspection_notes = {
        driver_name: String(data.w_driver_name || '').trim(),
        driver_phone: String(data.w_driver_phone || '').trim(),
      };
      if (!payload.inspection_notes.driver_name) throw new Error('Vui lòng nhập họ tên tài xế');
      if (!payload.inspection_notes.driver_phone) throw new Error('Vui lòng nhập số điện thoại tài xế');
      const v = st.gsmVehicle;
      if (!v) throw new Error(`Vui lòng tìm và chọn xe ${fleetName()}, hoặc nhập xe ${fleetName()} mới`);
      if (v.id) payload.vehicle_id = v.id;
      else payload.vehicle = { model: data.g_model, plate: data.g_plate, vin: data.g_vin, color: data.g_color, motor_serial: data.g_motor_serial };
    } else {
      payload.symptoms = data.symptoms;
      payload.promised_at = data.promised_at;
      payload.quote_amount = data.quote_amount;
      if (st.mode === 'search') throw new Error('Vui lòng chọn khách hàng hoặc tạo khách hàng mới');
      if (st.mode === 'existing') {
        payload.customer_id = st.customer.id;
        if (!st.vehicleId) throw new Error('Vui lòng chọn xe tiếp nhận');
        if (st.vehicleId === 'new') payload.vehicle = vehicleFromData(data, 'v_');
        else payload.vehicle_id = st.vehicleId;
      } else {
        payload.customer = {
          name: data.c_name,
          phone: data.c_phone,
          email: data.c_email,
          address: data.c_address,
          type: data.c_type === 'business' ? 'business' : 'individual',
          tax_code: data.c_tax_code,
          contact_name: data.c_contact_name,
        };
        payload.vehicle = vehicleFromData(data, 'v_');
      }
    }
    if (insurance) payload.inspection_notes = { ...(payload.inspection_notes || {}), insurance };
    if (checkin) payload.checkin_id = checkin.id;
    const r = await api('POST', '/api/work-orders', payload);
    draftOff = true;
    clearTimeout(draftTimer);
    await delDraft();
    toast(`Đã tạo phiếu ${r.code}`, 'success');
    if (r.warning) toast(r.warning, 'error');
    else if (r.sheet) toastSheetPush(r.sheet, { silentUnchanged: true });
    if (cvDetail) { try { await api('POST', `/api/campaign-vehicles/${cvDetail.vehicle.id}/link`, { work_order_id: r.id }); } catch (e) { toast(e.message, 'error'); } }
    if (st.files.length) {
      const btn = form.querySelector('button[type=submit]');
      let okCount = 0;
      for (const [i, f] of st.files.entries()) {
        if (btn) btn.textContent = `Đang tải file ${i + 1}/${st.files.length}…`;
        try { await uploadAttachment(r.id, f.kind, f.file); okCount++; } catch (e) { toast(`${f.file.name}: ${e.message}`, 'error'); }
      }
      if (okCount) toast(`Đã tải lên ${okCount} file`, 'success');
    }
    window.location.hash = st.source === 'retail' && payload.service_type === 'warranty' ? `#/retail-warranty/${r.id}` : `#/work-orders/${r.id}`;
  });

  // ----- Bản nháp tự lưu (IndexedDB): văng app / tải lại / hết phiên vẫn khôi phục được -----
  const draftKey = `wo-new:${S.me.id}`;
  let draftTimer = null;
  let draftOff = false; // tắt khi đang hỏi khôi phục hoặc đã tạo phiếu
  const formFields = () => $$('#wo-form [name]').filter((el) => !el.disabled && el.type !== 'file' && el.type !== 'submit' && el.type !== 'button');
  const hasContent = () => st.files.length || st.gsmVehicle || st.customer || st.mode === 'new'
    || formFields().some((el) => {
      if (el.tagName === 'SELECT' || el.type === 'hidden') return false; // ô chọn có giá trị mặc định – không tính
      if (el.type === 'checkbox' || el.type === 'radio') return el.checked !== el.defaultChecked;
      return String(el.value || '').trim() !== String(el.defaultValue || '').trim();
    });
  // Ảnh lưu ở khóa riêng, chỉ ghi lại khi danh sách ảnh đổi – gõ chữ chỉ ghi phần chữ (nhẹ)
  const draftFilesKey = `${draftKey}:files`;
  let savedFilesSig = null;
  const filesSig = () => st.files.map((f) => `${f.kind}|${f.file.name}|${f.file.size}|${f.file.lastModified || ''}`).join('\n');
  const delDraft = () => Promise.all([draftStore.del(draftKey), draftStore.del(draftFilesKey)]).then(() => { savedFilesSig = null; });
  const saveDraft = async () => {
    if (draftOff || ctx.stale() || !$('#wo-form')) return;
    if (!hasContent()) return;
    const fields = formFields().map((el) => [el.name, el.type, (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value, el.value]);
    const v = st.gsmVehicle || {};
    const label = v.plate || v.vin || (st.customer && st.customer.name) || ($('#wo-form [name="driver_name"]') || {}).value || '';
    const sig = filesSig();
    if (sig !== savedFilesSig) {
      await draftStore.set(draftFilesKey, st.files.map((f) => ({ kind: f.kind, name: f.file.name, type: f.file.type, blob: f.file })));
      savedFilesSig = sig;
    }
    await draftStore.set(draftKey, {
      at: Date.now(), hash: window.location.hash, label,
      st: { source: st.source, walkin: st.walkin, mode: st.mode, customer: st.customer, vehicleId: st.vehicleId, gsmVehicle: st.gsmVehicle, forceNewDespiteOpen: st.forceNewDespiteOpen, prefill: st.prefill },
      fields,
      nFiles: st.files.length,
      nPhotos: st.files.filter((f) => f.kind === 'photo_in').length,
    });
  };
  const saveDraftSoon = () => { clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 800); };
  const formEl = $('#wo-form');
  if (formEl) {
    formEl.addEventListener('input', saveDraftSoon);
    formEl.addEventListener('change', saveDraftSoon);
    formEl.addEventListener('click', () => setTimeout(saveDraftSoon, 50)); // chọn xe / khách bằng nút
  }
  // Lưu ngay khi rời app (chuyển ứng dụng, khóa máy) – lúc điện thoại hay đóng trang nhất
  const flush = () => {
    if (ctx.stale()) { document.removeEventListener('visibilitychange', flush); return; }
    if (document.hidden) { clearTimeout(draftTimer); saveDraft(); }
  };
  document.addEventListener('visibilitychange', flush);
  window.addEventListener('pagehide', flush, { once: true });
  const restoreDraft = async (d) => {
    Object.assign(st, d.st || {});
    applySource();
    if (st.mode === 'existing' && typeof renderVehNew === 'function') renderVehNew();
    const setAll = () => {
      (d.fields || []).forEach(([name, type, val, raw]) => {
        const els = $$(`#wo-form [name="${CSS.escape(name)}"]`).filter((el) => !el.disabled);
        if (type === 'radio') { const el = els.find((x) => x.value === raw); if (el) el.checked = !!val; return; }
        if (type === 'checkbox') { els.forEach((el) => { el.checked = !!val; }); return; }
        els.forEach((el) => { el.value = val; });
      });
    };
    setAll();
    renderTechSelect();
    setAll();
    // Cập nhật giao diện phụ thuộc (ô bảo hiểm, sạc, số PIN, giai đoạn…)
    $$('#wo-form [data-change]').forEach((el) => {
      if (!['acc-charger', 'acc-count', 'stage', 'g-model', 'svc-type'].includes(el.dataset.change)) return;
      if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) return;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    toggleInsurance();
    // Bản nháp cũ để ảnh chung trong d.files; bản mới để ở khóa riêng
    const savedFiles = d.files || (await draftStore.get(draftFilesKey)) || [];
    st.files = savedFiles.filter((f) => f.blob).map((f) => {
      const file = new File([f.blob], f.name, { type: f.type });
      return { kind: f.kind, file, preview: f.kind === 'photo_in' ? URL.createObjectURL(file) : null };
    });
    savedFilesSig = d.files ? null : filesSig();
    renderFiles();
  };
  const offerDraft = async () => {
    const d = await draftStore.get(draftKey);
    if (!d || ctx.stale() || !$('#wo-form')) return;
    if (Date.now() - d.at > 3 * 24 * 3600e3) { await delDraft(); return; }
    let auto = null;
    try { auto = sessionStorage.getItem('wo-draft-autorestore'); sessionStorage.removeItem('wo-draft-autorestore'); } catch { /* ignore */ }
    if (auto && auto === d.hash && auto === window.location.hash) {
      await restoreDraft(d);
      toast('Đã mở lại phiếu đang làm dở – mời bạn làm tiếp', 'success');
      saveDraftSoon();
      return;
    }
    draftOff = true;
    const bar = document.createElement('div');
    bar.className = 'alert alert-warn draft-bar';
    const t = new Date(d.at);
    const hm = fmtTime(t);
    const dayDiff = Math.round((new Date().setHours(0, 0, 0, 0) - new Date(t).setHours(0, 0, 0, 0)) / 864e5);
    const when = dayDiff === 0 ? `${hm} hôm nay` : dayDiff === 1 ? `${hm} hôm qua` : `${hm} ngày ${fmtD(t)}`;
    const nPhotos = d.files ? d.files.filter((f) => f.kind === 'photo_in').length : (d.nPhotos || 0);
    const what = d.label ? `xe <b>${esc(d.label)}</b>` : 'một chiếc xe';
    bar.innerHTML = `${icon('history')}<div class="grow"><div class="draft-title">Phiếu nhận xe chưa hoàn tất</div>
      <div class="draft-sub">Bạn đang nhận ${what} dở dang lúc ${esc(when)}${nPhotos ? `, kèm ${nPhotos} ảnh đã chụp` : ''}. Tiếp tục để không phải nhập lại từ đầu.</div></div>
      <button type="button" class="btn btn-sm btn-primary" data-draft="restore">Tiếp tục làm</button>
      <button type="button" class="btn btn-sm btn-ghost" data-draft="discard">Làm phiếu mới</button>`;
    formEl.parentElement.insertBefore(bar, formEl);
    bar.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-draft]');
      if (!b) return;
      bar.remove();
      // Nháp làm từ đăng ký / lịch hẹn / chiến dịch khác: về đúng trang đó rồi khôi phục (liên kết đúng xe)
      if (b.dataset.draft === 'restore' && d.hash && d.hash !== window.location.hash) {
        try { sessionStorage.setItem('wo-draft-autorestore', d.hash); } catch { /* ignore */ }
        window.location.hash = d.hash;
        return;
      }
      if (b.dataset.draft === 'restore') { await restoreDraft(d); toast('Đã mở lại phiếu đang làm dở – mời bạn làm tiếp', 'success'); } else { await delDraft(); toast('Đã bỏ bản cũ, bắt đầu phiếu mới', 'info'); }
      draftOff = false;
      saveDraftSoon();
    });
  };

  // ----- Khởi tạo -----
  applySource();
  renderTechSelect();
  if (cvDetail) {
    const v = cvDetail.vehicle;
    if (v.vehicle_id) {
      const found = await api('GET', `/api/fleet/lookup${qs({ q: v.vin })}`);
      const hit = found.find((x) => x.id === v.vehicle_id);
      if (hit) pickGsm(hit);
    } else {
      st.gsmVehicle = { isNew: true, vin: v.vin, plate: v.plate, model: v.model };
      renderCust();
    }
  } else if (custDetail) {
    selectCustomer({ ...custDetail.customer, vehicles: custDetail.vehicles }, q.get('vehicle'));
  } else if (appt) {
    let found = null;
    if (appt.customer_id) {
      const res = await api('GET', `/api/lookup${qs({ q: appt.phone })}`);
      found = res.find((c) => c.id === appt.customer_id);
    }
    if (ctx.stale()) return;
    if (found) selectCustomer(found, appt.vehicle_id ? String(appt.vehicle_id) : '');
    else if (can('customer.edit')) {
      st.prefill = { name: appt.customer_name, phone: appt.phone, model: appt.model, plate: appt.plate };
      st.mode = 'new';
      renderCust();
    }
  } else if (checkin) {
    const ckPlateKey = (v) => String(v || '').toUpperCase().replace(/[^A-Z0-9Đ]/g, '');
    // Điền sẵn thông tin tài xế tự khai (QR)
    const setVal = (sel, v) => $$(sel).forEach((el) => { if (!el.disabled && v != null && v !== '') el.value = v; });
    const fillDriver = () => {
      setVal('#wo-form [name="driver_name"]', checkin.driver_name);
      setVal('#wo-form [name="driver_phone"]', checkin.phone);
      setVal('#wo-form [name="customer_request"]', checkin.request);
      setVal('#wo-form [name="symptoms"]', checkin.request);
      setVal('#wo-form [name="odometer"]', checkin.odometer);
    };
    fillDriver();
    if (isFleet()) {
      const found = await api('GET', `/api/fleet/lookup${qs({ q: checkin.plate, fleet: st.source })}`);
      if (ctx.stale()) return;
      // Chỉ tự chọn khi khớp đúng biển số (không lấy kết quả "chứa" đầu tiên)
      const exact = found.find((v) => ckPlateKey(v.plate) === ckPlateKey(checkin.plate)) || (found.length === 1 ? found[0] : null);
      if (exact) pickGsm(exact);
      else {
        renderCust();
        const box = $('#fleet-lookup');
        if (box) { box.value = checkin.plate; box.dispatchEvent(new Event('input', { bubbles: true })); }
      }
    } else if (can('customer.edit')) {
      // Ưu tiên xe khớp biển số (đúng chủ xe), sau đó mới tới khách trùng SĐT
      const byPlate = await api('GET', `/api/lookup${qs({ q: checkin.plate })}`);
      if (ctx.stale()) return;
      let hitCust = null;
      let hitVeh = '';
      for (const c of byPlate) {
        const v = (c.vehicles || []).find((x) => ckPlateKey(x.plate) === ckPlateKey(checkin.plate));
        if (v) { hitCust = c; hitVeh = String(v.id); break; }
      }
      if (!hitCust) {
        const res = await api('GET', `/api/lookup${qs({ q: checkin.phone })}`);
        if (ctx.stale()) return;
        const tel = String(checkin.phone || '').replace(/\D/g, '');
        hitCust = res.find((c) => String(c.phone || '').replace(/\D/g, '') === tel) || null;
      }
      if (hitCust) selectCustomer(hitCust, hitVeh);
      else {
        st.prefill = { name: checkin.driver_name, phone: checkin.phone, plate: checkin.plate };
        st.mode = 'new';
        renderCust();
      }
    }
    fillDriver();
  } else if (isFleet() && q.get('q')) {
    const term = q.get('q').trim();
    if (term.length >= 3) {
      const found = await api('GET', `/api/fleet/lookup${qs({ q: term, fleet: st.source })}`);
      if (ctx.stale()) return;
      const hit = found[0];
      if (hit) pickGsm(hit);
      else {
        renderCust();
        const box = $('#fleet-lookup');
        if (box) {
          box.value = term;
          box.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  }
  await offerDraft();
}

// ---------------------------------------------------------------------------
// Chuyển trạng thái hàng loạt theo số khung (VIN) – GSM bàn giao qua email nên bỏ qua từng bước quy trình.
// Chỉ 2 đích: Chờ sửa chữa (ghi ngày GSM bàn giao sửa chữa) / Đã giao xe (ghi ngày bàn giao xe cho GSM).
// ---------------------------------------------------------------------------
const BULK_PRE_REPAIR = ['inspecting', 'awaiting_open', 'waiting_order', 'waiting_approval', 'gsm_rejected', 'waiting_repair'];
const BULK_TARGETS = {
  waiting_repair: { label: 'Chờ sửa chữa', sub: 'GSM đã bàn giao sửa chữa (qua email)', date: 'Ngày GSM bàn giao sửa chữa', perms: ['wo.edit', 'wo.approve'] },
  delivered: { label: 'Đã giao xe', sub: 'Xe đã rời xưởng', date: 'Ngày xe rời xưởng', perms: ['wo.edit', 'wo.approve', 'wo.deliver'] },
};
const BULK_DELIVER_FROM = ['done', 'awaiting_handover', 'gsm_received'];
/** Dòng dán từ Excel: "SỐ KHUNG [tab] ngày" – ngày dd/mm/yyyy hoặc yyyy-mm-dd (có thể kèm giờ). */
function parseBulkLines(text) {
  const out = [];
  for (const line of String(text || '').split(/\r?\n/)) {
    const cells = line.split(/[\t,;]+|\s{2,}|\s+(?=\d{1,4}[/.-]\d)/).map((c) => c.trim()).filter(Boolean);
    if (!cells.length) continue;
    const vin = cells[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (vin.length < 6) continue;
    let date = '';
    for (const c of cells.slice(1)) {
      const d = c.split(/\s+/)[0];
      date = /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : parseDmy(d);
      if (date) break;
    }
    out.push({ vin, date });
  }
  return out;
}
function openBulkTransition(ctx) {
  const targets = Object.entries(BULK_TARGETS).filter(([, t]) => t.perms.some((p) => can(p)));
  if (!targets.length) { toast('Bạn không có quyền chuyển hàng loạt', 'error'); return; }
  let to = targets[0][0];
  let common = today();
  let preview = [];
  const okFor = (w) => !w.missing && (to === 'delivered' ? BULK_DELIVER_FROM.includes(w.status) : BULK_PRE_REPAIR.includes(w.status));
  const why = (w) => (w.missing ? 'Không có phiếu đang mở'
    : okFor(w) ? '' : to === 'delivered' ? 'Chưa sửa xong' : 'Đã vào sửa chữa / hoàn thành');
  const rowErr = (x) => {
    if (!x.date) return 'Thiếu ngày';
    if (x.date > today()) return 'Sau hôm nay';
    if (x.received_at && x.date < String(x.received_at).slice(0, 10)) return 'Trước ngày nhận xe';
    return '';
  };
  const $m = (id) => document.getElementById(id);
  const sync = () => {
    const t = BULK_TARGETS[to];
    const ok = preview.filter((x) => x.ok);
    const bad = ok.filter((x) => rowErr(x)).length;
    const lab = $m('bulk-date-lab');
    if (lab) lab.textContent = t.date;
    const go = $m('bulk-go-btn');
    if (go) { go.disabled = !ok.length || bad > 0; go.textContent = ok.length ? `Chuyển ${ok.length} xe sang "${t.label}"` : 'Chuyển trạng thái'; }
    const sum = $m('bulk-sum');
    if (sum) {
      sum.innerHTML = preview.length
        ? `<b>${ok.length}</b> / ${preview.length} xe chuyển được${bad ? ` · <span class="bulk-bad">${bad} xe ngày chưa hợp lệ</span>` : ''}`
        : '';
    }
  };
  const renderPreview = () => {
    const t = BULK_TARGETS[to];
    preview.forEach((x) => { x.ok = okFor(x); x.why = why(x); });
    $m('bulk-preview').innerHTML = preview.length ? `<div class="table-wrap bulk-table"><table class="table table-compact no-col-resize"><thead><tr>
        <th>#</th><th>Số khung</th><th>Biển số</th><th>Phiếu</th><th>Trạng thái hiện tại</th><th>${esc(t.date)}</th><th>Kết quả</th></tr></thead><tbody>
      ${preview.map((x, i) => {
        const err = x.ok ? rowErr(x) : '';
        return `<tr class="${x.ok ? '' : 'bulk-off'}"><td class="small">${i + 1}</td><td class="mono small">${esc(x.vin || x.input)}</td>
          <td>${esc(x.plate || '')}</td><td>${x.code ? esc(x.code) : '—'}</td><td>${x.status ? statusBadge(x.status) : '—'}</td>
          <td>${x.ok ? `<input type="date" class="input input-sm${err ? ' is-invalid' : ''}" data-i="${i}" data-change="bulk-row-date" value="${esc(x.date || '')}" max="${today()}" aria-label="${esc(t.date)} ${esc(x.vin || '')}">` : ''}</td>
          <td class="small">${!x.ok ? `<span class="bulk-bad">✗ ${esc(x.why)}</span>` : x.fail ? `<span class="bulk-bad">✗ ${esc(x.fail)}</span>` : err ? `<span class="bulk-bad">${esc(err)}</span>` : '<span class="bulk-good">✓ Được</span>'}</td></tr>`;
      }).join('')}</tbody></table></div>` : '';
    sync();
  };
  const reset = () => { preview = []; $m('bulk-preview').innerHTML = ''; sync(); };
  openModal({
    title: 'Chuyển trạng thái hàng loạt',
    size: 'bulk-modal',
    body: `<form data-submit="bulk-go"><div class="modal-body">
      <div class="bulk-targets" role="radiogroup" aria-label="Chuyển sang">
        ${targets.map(([k, t]) => `<label class="bulk-target"><input type="radio" name="to" value="${k}" data-change="bulk-to" ${k === to ? 'checked' : ''}>
          ${statusBadge(k)}</label>`).join('')}
      </div>
      <div class="bulk-grid">
        ${field('Số khung (VIN)', '<textarea class="textarea mono" name="vins" rows="7" placeholder="Mỗi dòng 1 số khung" data-change="bulk-reset"></textarea>', { req: true })}
        <div>
          <div class="field"><label><span id="bulk-date-lab">${esc(BULK_TARGETS[to].date)}</span> <span class="req">*</span></label>
            <input type="date" class="input" name="common_date" value="${common}" max="${today()}" data-change="bulk-common"></div>
          ${field('Ghi chú', '<textarea class="textarea" name="note" rows="3"></textarea>')}
        </div>
      </div>
      <div id="bulk-preview"></div>
    </div><div class="modal-foot"><span class="small bulk-sum" id="bulk-sum"></span>
      <button type="button" class="btn" data-click="modal-close">Đóng</button>
      <button type="button" class="btn" data-click="bulk-check">Kiểm tra</button>
      <button type="submit" class="btn btn-primary" id="bulk-go-btn" disabled>Chuyển trạng thái</button></div></form>`,
    handlers: {
      change: {
        'bulk-reset': reset,
        'bulk-to': (el) => { to = el.value; if (preview.length) renderPreview(); else sync(); },
        'bulk-common': (el) => {
          common = el.value;
          preview.forEach((x) => { if (!x.own) x.date = common; });
          if (preview.length) renderPreview();
        },
        'bulk-row-date': (el) => {
          const x = preview[Number(el.dataset.i)];
          if (!x) return;
          x.date = el.value; x.own = true; x.fail = '';
          renderPreview();
        },
      },
      click: {
        'bulk-check': async (el) => {
          const lines = parseBulkLines(el.closest('form').vins.value);
          if (!lines.length) { toast('Vui lòng nhập ít nhất 1 số khung', 'error'); return; }
          const dates = new Map(lines.map((l) => [l.vin, l.date]));
          const label = el.textContent;
          el.disabled = true; el.textContent = 'Đang kiểm tra…';
          let r;
          try { r = await api('POST', '/api/work-orders/by-vins', { vins: lines.map((l) => l.vin), branch_id: S.branch }); } finally { el.disabled = false; el.textContent = label; }
          preview = r.rows.map((w) => {
            const own = dates.get(w.input) || '';
            const prev = to === 'waiting_repair' && !own && w.gsm_handover_at ? String(w.gsm_handover_at).slice(0, 10) : '';
            return { ...w, date: own || prev || common, own: !!(own || prev) };
          });
          renderPreview();
        },
      },
      submit: {
        'bulk-go': async (form, data) => {
          const t = BULK_TARGETS[to];
          const list = preview.filter((x) => x.ok);
          if (!list.length) return;
          if (list.some((x) => rowErr(x))) { toast('Còn xe chưa có ngày hợp lệ', 'error'); return; }
          if (!(await confirmBox(`Chuyển ${list.length} phiếu sang "${t.label}"?`, { okLabel: 'Chuyển' }))) return;
          const btn = $m('bulk-go-btn');
          if (btn) { btn.disabled = true; btn.textContent = 'Đang chuyển…'; }
          let ok = 0;
          const fails = [];
          let i = 0;
          try {
            for (; i < list.length; i += 100) {
              const r = await api('POST', '/api/work-orders/bulk-status', {
                to, note: String(data.note || '').trim() || undefined,
                items: list.slice(i, i + 100).map((x) => ({ id: x.id, date: x.date })),
              });
              ok += r.ok;
              fails.push(...r.errors);
            }
          } catch (e) {
            fails.push(...list.slice(i).map((x) => ({ id: x.id, code: x.code, error: e.message })));
          }
          if (btn) { btn.disabled = false; btn.textContent = 'Chuyển trạng thái'; }
          if (fails.length) {
            const byId = new Map(fails.map((f) => [f.id, f.error]));
            preview = preview.filter((x) => byId.has(x.id));
            preview.forEach((x) => { x.fail = byId.get(x.id); });
            renderPreview();
            $m('bulk-sum').innerHTML = `Đã chuyển <b>${ok}</b> phiếu · <span class="bulk-bad">${fails.length} phiếu lỗi: ${esc(fails.map((f) => `${f.code || f.id}: ${f.error}`).slice(0, 5).join('; '))}</span>`;
            toast(`Đã chuyển ${ok}/${list.length} phiếu – lỗi ${fails.length}`, 'error');
          } else {
            closeModal();
            toast(`Đã chuyển ${ok} phiếu sang "${t.label}"`, 'success');
          }
          if (ok) ctx.reload();
        },
      },
    },
  });
}

