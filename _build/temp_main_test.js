
'use strict';

/* =====================================================================
   MODERN LUCIDE VECTOR SVG ICONS
   Ultra-crisp, lightweight, pixel-perfect modern SVG icons
   ===================================================================== */
window.ICONS = {
  chart: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  target: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
  package: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  claims: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  carCheck: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>`,
  settings: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  download: `<svg class="sc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  sun: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  moon: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  zap: `<svg class="sc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  clipboard: `<svg class="sc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
  calendar: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  search: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  checkCircle: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  alertTriangle: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  alertCircle: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  edit: `<svg class="sc-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  trash: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  refresh: `<svg class="sc-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  folder: `<svg class="sc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
  trending: `<svg class="sc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`
};

/* =====================================================================
   THEME MANAGER (DARK / LIGHT TOGGLE)
   Persisted in localStorage with instant responsive switching
   ===================================================================== */
window.initTheme = function() {
  const saved = localStorage.getItem('bh_theme') || 'dark';
  window.setTheme(saved, false);
};

window.setTheme = function(mode, save = true) {
  document.documentElement.setAttribute('data-theme', mode);
  if (save) {
    try { localStorage.setItem('bh_theme', mode); } catch(e){}
  }
  const btnDark = $('#btnThemeDark');
  const btnLight = $('#btnThemeLight');
  if (btnDark) btnDark.classList.toggle('active', mode === 'dark');
  if (btnLight) btnLight.classList.toggle('active', mode === 'light');

  // Trigger re-render of components that use theme-aware SVGs
  if (window.renderAll && typeof state !== 'undefined' && state && state.sources) {
    try { renderAll(); } catch(e){}
  }
};

window.toggleTheme = function() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  window.setTheme(cur === 'dark' ? 'light' : 'dark');
};


/* ============================ Helpers ============================ */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const norm = s => (s == null ? '' : String(s)).replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_\s]+/g, ' ').trim();
const ceilInt = x => Math.ceil(Math.round((+x || 0) * 1e6) / 1e6);
const fmtVND = n => Math.round(+n || 0).toLocaleString('vi-VN');
const fmtT = n => ((+n || 0) / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 });
const fmtN = (n, d = 2) => (+n || 0).toLocaleString('vi-VN', { maximumFractionDigits: d });
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const monthLabel = ym => { if (!ym) return '—'; const [y, m] = ym.split('-'); return `T${+m}/${y}`; };
const monthLong = ym => { if (!ym) return '—'; const [y, m] = ym.split('-'); return `tháng ${+m}/${y}`; };
const DAY = 86400000;

function parseNum(v){
  if(v == null || v === '') return 0;
  if(typeof v === 'number') return v;
  let s = String(v).trim().replace(/\s|₫|VND|vnd/g, '');
  if(!s) return 0;
  const neg = /^\(.*\)$/.test(s); s = s.replace(/[()]/g, '');
  s = s.replace(/[^\d.,\-]/g, '');
  if(s.includes(',') && s.includes('.')){
    if(s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if(s.includes(',')){
    const p = s.split(',');
    if(p.length === 2 && p[1].length !== 3) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if(s.includes('.')){
    const p = s.split('.');
    if(p.length > 2 || (p.length === 2 && p[1].length === 3 && p[0] !== '0')) s = s.replace(/\./g, '');
  }
  const n = parseFloat(s);
  return neg ? -n : (isNaN(n) ? 0 : n);
}

function parseDateVal(v){
  if(v == null || v === '') return null;
  if(v instanceof Date) return isNaN(v) ? null : v;
  if(typeof v === 'number'){
    const d = new Date(Math.round((v - 25569) * 86400000));
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes());
  }
  const s = String(v).trim();
  let m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})(?:[ T,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if(m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?[,\s]+(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
  if(m) return new Date(+m[6], +m[5] - 1, +m[4], +m[1], +m[2], +(m[3] || 0));
  m = s.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})(?:[ T,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if(m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

function fmtDate(d){
  if(!d) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/* ============================ Phân loại trạng thái ============================ */
const KIND_META = {
  confirmed: { k: 'confirmed', badge: 'b-ok', name: 'Chốt — Doanh thu' },
  pipeline:  { k: 'pipeline',  badge: 'b-pipe', name: 'Dự trù (Chờ duyệt / Mở)' },
  excluded:  { k: 'excluded',  badge: 'b-ex', name: 'Loại (Huỷ / Từ chối)' }
};
let statusRules = {};
try { statusRules = JSON.parse(localStorage.getItem('bh_statusrules') || '{}') || {}; } catch(e){ statusRules = {}; }

window.setRule = (ns, k) => {
  if(!KIND_META[k]) return;
  statusRules[ns] = k;
  try { localStorage.setItem('bh_statusrules', JSON.stringify(statusRules)); } catch(e){}
  renderAll();
};
window.resetRules = () => {
  statusRules = {};
  try { localStorage.removeItem('bh_statusrules'); } catch(e){}
  renderAll();
};

function statusKind(st){
  const s = norm(st);
  const label = String(st || '').trim() || '(Trống)';
  if(statusRules[s] && KIND_META[statusRules[s]]) return { ...KIND_META[statusRules[s]], label };
  if(!s) return { k: 'excluded', label, badge: 'b-ex' };
  if(s.includes('hoan thanh') || s.includes('da phe duyet') || s.includes('da duyet') || s === 'phe duyet' || s === 'approved' || s === 'completed' || s === 'paid') return { k: 'confirmed', label, badge: 'b-ok' };
  if(s.includes('tu choi') || s.includes('reject')) return { k: 'excluded', label, badge: 'b-ex' };
  if(s.includes('huy') || s.includes('cancel')) return { k: 'excluded', label, badge: 'b-ex' };
  if(s.includes('cho phe duyet') || s.includes('cho duyet') || s.includes('cap 1') || s.includes('cap 2') || s.includes('level 1') || s.includes('level 2') || s.includes('pending') || s.includes('waiting') || s === 'mo' || s.startsWith('mo ') || s === 'open' || s === 'draft' || s === 'new' || s.includes('san sang gui') || s.includes('ready') || s === 'da in' || s === 'printed' || s.includes('tra ve') || s.includes('return') || s === 'submitted') return { k: 'pipeline', label, badge: 'b-pipe' };
  return { k: 'unknown', label, badge: 'b-ex' };
}

function cycleMonth(d, cut, shift){
  if(!d) return null;
  let y = d.getFullYear(), m = d.getMonth() + 1;
  if(shift && d.getDate() > cut){ m++; if(m > 12){ m = 1; y++; } }
  return `${y}-${String(m).padStart(2, '0')}`;
}
function prevMonths(ym, n){
  if(!ym) return [];
  let [y, m] = ym.split('-').map(Number); const out = [];
  for(let i = 0; i < n; i++){ m--; if(m === 0){ m = 12; y--; } out.unshift(`${y}-${String(m).padStart(2, '0')}`); }
  return out;
}
function cycleRangeText(ym, cut){
  const [y, m] = ym.split('-').map(Number);
  const py = m === 1 ? y - 1 : y, pm = m === 1 ? 12 : m - 1;
  return cut >= 28 ? `01/${String(m).padStart(2, '0')}–end/${String(m).padStart(2, '0')}/${y}` : `23/${String(pm).padStart(2, '0')}–${String(cut).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}
function cycleDaysOf(ym, cut){
  const [y, m] = ym.split('-').map(Number);
  return Math.max(1, Math.round((new Date(y, m - 1, cut) - new Date(y, m - 2, 23)) / DAY));
}

/* ============================ Parsing ============================ */
const KNOWN_PART_NAME_MAP = {
  'battery charger 1000w': 'DRT00011190AA',
  'top case comp': 'BDP12006000AC',
  'giam xoc sau': 'SUS00008613',
  'giam soc sau': 'SUS00007999',
  'motor in wheel 72v 1500w 12xmt2.15': 'DRT00009706BAR',
  'motor in wheel 72v 1800w 35hx14xmt3.5 bl': 'DRT00008966BAR',
  'bearing 6205 25x52x15': 'DRT00006059',
  'bearing 6204 20x47x14': 'DRT00006395',
  'dc-dc 1 dau ra 60v-12v/10a': 'DRT00007831',
  'bo dieu khien dong co 72v max 40a vanh 1': 'DRT00009394',
  'dong ho dien tu': 'CNI00009359',
  'bo chuyen doi dien ap 1 chieu': 'DRT00001717',
  'bo chuyen doi dien dcdc': 'DRT00011185AA',
  'wheel mt3.5x14': 'DRT00006046BAR',
  '96eel 260 50h mt12x2.15': 'DRT00007658BAR',
  'cover glue 1 bottle 600ml': 'SVC00009780AA',
  'van sau': 'RWH00002941',
  'giam xoc truoc phai': 'SUS00009587',
  'giam xoc truoc trai': 'SUS00009589',
  'battery pack lfp assy': 'BAT12006000',
  'den truoc, led': 'LID00005092',
  'brake side cover combination 260': 'DRT00006048BAR',
  'brake side cover combination': 'DRT00006577BAR',
  'seal 25x40x7 hmsa10': 'DRT00006397',
  'cong tac den': 'ELE00000022',
  'hex socket head cap screws m5x14 with lo': 'DRT00006061'
};

function inferPartCode(name, snNew, snOld, pMoney){
  const nn = norm(name).replace(/\.+$/, '').trim();
  const s1 = String(snNew || '').trim().toUpperCase();
  const s2 = String(snOld || '').trim().toUpperCase();
  if(nn.startsWith('battery charger 1000w')) return 'DRT00011190AA';
  if(nn === 'cum mo-dun ket noi thong minh 4g mini'){
    if(s1.startsWith('CNI00008608') || s2.startsWith('CNI00008608')) return 'CNI00008608';
    return 'CNI00009360';
  }
  if(nn === 'stator assy'){
    if(s1.startsWith('DRT00009040BAR') || s2.startsWith('DRT00009040BAR') || pMoney >= 5000000) return 'DRT00008967BAR';
    return 'DRT00009725';
  }
  if(nn === 'bo dieu khien dong co 72v/50a 14c'){
    return (pMoney > 0 && pMoney < 1400000) ? 'DRT00010066' : 'DRT00009885';
  }
  if(KNOWN_PART_NAME_MAP[nn]) return KNOWN_PART_NAME_MAP[nn];
  for(const s of [s1, s2]){
    const m = s.match(/^([A-Z]{3}\d{8}(?:AA|AC|AB|BAR)?)/);
    if(m) return m[1];
  }
  return '';
}

function sheetRows(ws){ try { return XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null }); } catch(e){ return []; } }
function findHeaderRow(rows){
  for(let i = 0; i < Math.min(rows.length, 10); i++){
    const r = rows[i] || [];
    if(r.filter(c => c != null && String(c).trim() !== '').length >= 4) return i;
  }
  return -1;
}
function buildColMap(header){
  const map = {};
  header.forEach((h, i) => { const n = norm(h); if(n && map[n] == null) map[n] = i; });
  return map;
}
function pickCol(map, row, cands){
  for(const c of cands){ if(map[c] != null && row[map[c]] != null && String(row[map[c]]).trim() !== '') return row[map[c]]; }
  for(const c of cands){
    for(const n in map){
      if(n !== c && n.includes(c) && map[n] != null && row[map[n]] != null && String(row[map[n]]).trim() !== '') return row[map[n]];
    }
  }
  return null;
}

// ==================== QUẢN TRỊ CHẤT LƯỢNG & NHÓM KHÁCH HÀNG ====================
// Phân loại nhóm khách hàng: GSM (Xanh SM), Bship, Khách lẻ, Doanh nghiệp khác
function getCustomerGroup(name, companyName, extra = {}) {
  const source = typeof extra === 'string' ? extra : (extra.source || '');
  const fleet = typeof extra === 'object' ? (extra.fleet || '') : '';
  const note = typeof extra === 'object' ? (extra.note || extra.advisor_note || extra.foreman_note || '') : '';
  const rawCombined = `${name || ''} ${companyName || ''} ${source} ${fleet} ${note}`;
  const fullStr = norm(rawCombined);

  // 1. Kiểm tra BSHIP trước (nguồn, đội xe, ghi chú KTV hoặc tên khách)
  if (fullStr.includes('bship') || fullStr.includes('b-ship') || fullStr.includes('van tai bship') || fullStr.includes('b ship') || source === 'bship' || fleet === 'bship') {
    return { id: 'bship', name: 'Bship', tag: 'BSHIP', badgeClass: 'cust-bship', color: '#10b981' };
  }

  // 2. Kiểm tra GSM (Xanh SM) - Ưu tiên hàng đầu (chiếm đa số đội xe tại xưởng)
  // Nhận diện qua: source=gsm, fleet=gsm, ghi chú có gsm/xanh sm, tên công ty hoặc tên khách chứa di chuyển xanh/thông minh
  const isGsmSource = source === 'gsm' || fleet === 'gsm';
  const hasGsmKeyword = fullStr.includes('gsm') || fullStr.includes('xanh sm') || 
                        fullStr.includes('di chuyen xanh') || fullStr.includes('thong minh') || 
                        fullStr.includes('taxi xanh') || fullStr.includes('cp dcm') ||
                        fullStr.includes('green sm');

  if (isGsmSource || hasGsmKeyword) {
    return { id: 'gsm', name: 'GSM (Xanh SM)', tag: 'GSM', badgeClass: 'cust-gsm', color: '#06b6d4' };
  }

  // 3. Đội xe đối tác công nghệ khác
  if (fullStr.includes('ahamove') || fullStr.includes('lalamove') || fullStr.includes('grab') || fullStr.includes('be group') || fullStr.includes('gojek')) {
    return { id: 'fleet', name: 'Đội xe đối tác', tag: 'Đối tác', badgeClass: 'cust-fleet', color: '#f59e0b' };
  }

  // 4. Doanh nghiệp khác (có tên công ty, chi nhánh, pháp nhân)
  if (fullStr.includes('cong ty') || fullStr.includes('cp ') || fullStr.includes('tnhh') || fullStr.includes('chi nhanh') || fullStr.includes('corp') || fullStr.includes('doanh nghiep')) {
    return { id: 'corp', name: 'Doanh nghiệp khác', tag: 'Doanh nghiệp', badgeClass: 'cust-corp', color: '#a855f7' };
  }

  // 5. Khách lẻ (Chỉ khi thực sự không thuộc GSM, BSHIP hay doanh nghiệp nào)
  return { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8' };
}
window.getCustomerGroup = getCustomerGroup;

// Đánh giá trạng thái trả về (Cấp 1 trả về / Cấp 2 trả về)
function evaluateClaimReturnStatus(c, rawStatus, seq, reason, retL1, retL2) {
  const normSt = norm(String(rawStatus || (c && c.status) || ''));
  const rawStUpper = String(rawStatus || (c && c.status) || '').toUpperCase();

  // QUY TẮC NGHIỆP VỤ QUAN TRỌNG:
  // Lệnh ĐXBH trả về nhưng hiện tại đang ở trạng thái hủy thì KHÔNG tính vào tỷ lệ trả về!
  const isCancelled = normSt.includes('cancel') || 
                      normSt.includes('da huy') || 
                      normSt === 'huy' || 
                      rawStUpper === 'CANCELLED' ||
                      rawStUpper.includes('CANCEL');

  if (isCancelled) {
    return {
      isReturnLevel1: false,
      isReturnLevel2: false,
      isReturned: false,
      returnLevelLabel: 'Đã hủy',
      isCancelled: true,
      l1Count: 0,
      l2Count: 0
    };
  }

  const normReason = norm(String(reason || (c && c.reason) || ''));
  const l1Count = Number(retL1 || (c && (c.returnLevel1Count || c['Số lần trả về cấp 1'])) || 0) || 0;
  const l2Count = Number(retL2 || (c && (c.returnLevel2Count || c['Số lần trả về cấp 2'] || c['Số lần từ chối cấp 2'])) || 0) || 0;
  const sequence = Number(seq || (c && (c.approvalSequence || c['Cấp phê duyệt'])) || 0) || 0;

  let isReturnLevel1 = false;
  let isReturnLevel2 = false;

  if (l1Count > 0) isReturnLevel1 = true;
  if (l2Count > 0) isReturnLevel2 = true;

  if (normSt.includes('cap 1 tra ve') || normSt.includes('tra ve cap 1') || normSt.includes('c1 tra ve') || normSt.includes('rejected_level_1') || normSt.includes('rejected_l1')) {
    isReturnLevel1 = true;
  }
  if (normSt.includes('cap 2 tra ve') || normSt.includes('tra ve cap 2') || normSt.includes('c2 tra ve') || normSt.includes('rejected_level_2') || normSt.includes('rejected_l2')) {
    isReturnLevel2 = true;
  }
  if (normSt.includes('tu choi') || normSt.includes('tra ve') || normSt.includes('reject') || normSt.includes('returned')) {
    if (sequence === 1 || normSt.includes('cap 1') || normSt.includes('c1')) {
      isReturnLevel1 = true;
    } else if (sequence >= 2 || normSt.includes('cap 2') || normSt.includes('c2')) {
      isReturnLevel2 = true;
    } else {
      isReturnLevel2 = true;
    }
  }

  if ((!isReturnLevel1 && !isReturnLevel2) && normReason && (normReason.includes('tra ve') || normReason.includes('sai') || normReason.includes('bo sung') || normReason.includes('thieu') || normReason.includes('chua dat'))) {
    if (sequence >= 2) isReturnLevel2 = true;
    else isReturnLevel1 = true;
  }

  const isReturned = isReturnLevel1 || isReturnLevel2;
  const returnLevelLabel = isReturnLevel1 ? 'Cấp 1 trả về' : (isReturnLevel2 ? 'Cấp 2 trả về' : '');
  return { isReturnLevel1, isReturnLevel2, isReturned, returnLevelLabel, l1Count, l2Count, isCancelled: false };
}
window.evaluateClaimReturnStatus = evaluateClaimReturnStatus;

// Sơ đồ thước đo Benchmark tỷ lệ trả về (Mức cho phép <= 1.0%)

// Điều khiển bộ lọc ngày Cơ cấu nhóm khách hàng
window.setCustomerDatePreset = function(preset){
  if(!state.customerDateFilter) state.customerDateFilter = { from: '', to: '', preset: 'all' };
  const now = new Date();
  state.customerDateFilter.preset = preset;
  
  if(preset === 'all'){
    state.customerDateFilter.from = '';
    state.customerDateFilter.to = '';
  } else if(preset === 'this_month'){
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    state.customerDateFilter.from = `${y}-${m}-01`;
    const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
    state.customerDateFilter.to = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
  } else if(preset === 'last_month'){
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const y = prev.getFullYear();
    const m = String(prev.getMonth() + 1).padStart(2, '0');
    state.customerDateFilter.from = `${y}-${m}-01`;
    const lastDay = new Date(y, prev.getMonth() + 1, 0).getDate();
    state.customerDateFilter.to = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
  } else if(preset === '30days'){
    const d30 = new Date(now.getTime() - 30 * 86400000);
    state.customerDateFilter.from = d30.toISOString().slice(0, 10);
    state.customerDateFilter.to = now.toISOString().slice(0, 10);
  } else if(preset === '7days'){
    const d7 = new Date(now.getTime() - 7 * 86400000);
    state.customerDateFilter.from = d7.toISOString().slice(0, 10);
    state.customerDateFilter.to = now.toISOString().slice(0, 10);
  }
  computeAll();
  renderAll();
};

window.setCustomerCustomDate = function(from, to){
  if(!state.customerDateFilter) state.customerDateFilter = { from: '', to: '', preset: 'custom' };
  state.customerDateFilter.from = from || '';
  state.customerDateFilter.to = to || '';
  state.customerDateFilter.preset = (from || to) ? 'custom' : 'all';
  computeAll();
  renderAll();
};

// Render cơ cấu nhóm khách hàng thuần Dealer Portal (GSM, Bship, Khách lẻ)
function renderCustomerBreakdownHtml(cb) {
  if (!cb || !cb.groups) return '';
  const totalRev = cb.totalRev || 1;
  const groups = cb.groups;
  const filter = cb.activeFilter || (state.customerDateFilter) || { from: '', to: '', preset: 'all' };

  return `
    <div>
      <!-- Thanh bộ lọc Từ ngày đến ngày & Phím chọn nhanh -->
      <div style="background:rgba(15,23,42,0.7);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:8px 12px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-size:12px;font-weight:700;color:#94a3b8;display:flex;align-items:center;gap:4px">
            📅 Thời gian:
          </span>
          <button class="btn secondary ${filter.preset === 'all' ? 'active' : ''}" style="padding:2px 8px;font-size:11px;${filter.preset === 'all' ? 'background:#0284c7;color:#fff;border-color:#38bdf8' : ''}" onclick="setCustomerDatePreset('all')">Toàn bộ</button>
          <button class="btn secondary ${filter.preset === 'this_month' ? 'active' : ''}" style="padding:2px 8px;font-size:11px;${filter.preset === 'this_month' ? 'background:#0284c7;color:#fff;border-color:#38bdf8' : ''}" onclick="setCustomerDatePreset('this_month')">Tháng này</button>
          <button class="btn secondary ${filter.preset === 'last_month' ? 'active' : ''}" style="padding:2px 8px;font-size:11px;${filter.preset === 'last_month' ? 'background:#0284c7;color:#fff;border-color:#38bdf8' : ''}" onclick="setCustomerDatePreset('last_month')">Tháng trước</button>
          <button class="btn secondary ${filter.preset === '30days' ? 'active' : ''}" style="padding:2px 8px;font-size:11px;${filter.preset === '30days' ? 'background:#0284c7;color:#fff;border-color:#38bdf8' : ''}" onclick="setCustomerDatePreset('30days')">30 ngày</button>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-size:11.5px;color:#94a3b8">Từ:</span>
          <input type="date" id="custDateFrom" value="${filter.from || ''}" style="padding:3px 8px;font-size:11.5px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:#0f172a;color:#f8fafc" onchange="setCustomerCustomDate(this.value, document.getElementById('custDateTo')?.value)">
          <span style="font-size:11.5px;color:#94a3b8">Đến:</span>
          <input type="date" id="custDateTo" value="${filter.to || ''}" style="padding:3px 8px;font-size:11.5px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:#0f172a;color:#f8fafc" onchange="setCustomerCustomDate(document.getElementById('custDateFrom')?.value, this.value)">
          ${(filter.from || filter.to || filter.preset !== 'all') ? `<button class="btn secondary" style="padding:3px 8px;font-size:11px;color:#f87171;border-color:rgba(239,68,68,0.3)" onclick="setCustomerDatePreset('all')" title="Đặt lại bộ lọc ngày">✕ Đặt lại</button>` : ''}
        </div>
      </div>

      <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
        <span style="display:flex;align-items:center;gap:5px">
          <span style="color:#10b981">●</span> Dữ liệu trích xuất từ <b>Dealer Portal VinFast</b> (${cb.totalClaims || 0} đề xuất)
        </span>
        <span style="font-size:11.5px;color:#38bdf8;font-weight:600">💡 Bấm vào từng nhóm để xem danh sách toàn bộ lệnh</span>
      </div>

      <!-- Thanh tỷ trọng phân bổ Stacked Bar -->
      <div style="height:14px;border-radius:7px;background:rgba(15,23,42,0.8);overflow:hidden;display:flex;margin-bottom:14px;border:1px solid rgba(255,255,255,0.1)">
        ${groups.map(g => `
          <div style="width:${g.pct}%;background:${g.color};height:100%;cursor:pointer;transition:opacity 0.15s" 
               title="${g.name}: ${fmtT(g.rev)} tr (${g.pct}%) · Bấm để xem ${g.cnt} lệnh"
               onmouseover="this.style.opacity='0.8'"
               onmouseout="this.style.opacity='1'"
               onclick="openCustomerGroupClaimsModal('${g.id}')"></div>
        `).join('')}
      </div>

      <!-- 4 Thẻ nhóm khách hàng tương tác -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:12px">
        ${groups.map(g => `
          <div class="cust-group-card" 
               style="background:rgba(15,23,42,0.65);border:1.5px solid ${g.color}45;border-radius:12px;padding:12px 14px;cursor:pointer;transition:all 0.2s cubic-bezier(0.16,1,0.3,1);box-shadow:0 4px 14px rgba(0,0,0,0.25)"
               onmouseover="this.style.borderColor='${g.color}';this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 22px ${g.color}35'"
               onmouseout="this.style.borderColor='${g.color}45';this.style.transform='none';this.style.boxShadow='0 4px 14px rgba(0,0,0,0.25)'"
               onclick="openCustomerGroupClaimsModal('${g.id}')">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:12.5px;font-weight:800;color:${g.color};display:flex;align-items:center;gap:5px">
                <span style="width:7px;height:7px;border-radius:50%;background:${g.color}"></span>
                ${g.tag}
              </span>
              <span style="font-size:11.5px;font-weight:700;color:#cbd5e1;background:rgba(255,255,255,0.06);padding:1px 6px;border-radius:4px">${g.pct}%</span>
            </div>
            <div style="font-size:18px;font-weight:800;color:#f8fafc;margin-bottom:3px">
              ${fmtT(g.rev)} <span style="font-size:12px;color:#94a3b8;font-weight:600">tr</span>
            </div>
            <div style="font-size:11.5px;color:#94a3b8;margin-bottom:8px">
              <b style="color:#e2e8f0">${g.cnt}</b> ĐX Dealer Portal
            </div>
            <button class="btn secondary" style="width:100%;font-size:11px;padding:4px 6px;border-color:${g.color}60;color:${g.color};background:${g.color}15;border-radius:6px;display:flex;align-items:center;justify-content:center;gap:4px"
                    onclick="event.stopPropagation();openCustomerGroupClaimsModal('${g.id}')">
              📋 Xem ${g.cnt} lệnh
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
window.renderCustomerBreakdownHtml = renderCustomerBreakdownHtml;

// Helper sao chép chuỗi vào Clipboard với thông báo mượt mà
function copyTextToClipboard(text, el){
  if(!text) return;
  navigator.clipboard.writeText(text).then(() => {
    if(el){
      const origText = el.innerHTML;
      el.innerHTML = '✓ Đã chép!';
      el.style.color = '#34d399';
      setTimeout(() => { el.innerHTML = origText; el.style.color = ''; }, 1200);
    }
  }).catch(()=>{});
}
window.copyTextToClipboard = copyTextToClipboard;

// 1. MODAL XEM CHI TIẾT DANH SÁCH LỆNH CỦA TỪNG NHÓM KHÁCH HÀNG
let currentCustGroupModalId = '';
window.openCustomerGroupClaimsModal = function(groupId, filterStatus = 'all'){
  currentCustGroupModalId = groupId;
  const C = state.computed;
  if(!C || !C.customerBreakdown) return;
  const group = C.customerBreakdown.groups.find(g => g.id === groupId);
  if(!group) return;

  const modal = $('#modalCustomerGroupClaims');
  if(!modal) return;
  
  $('#custGroupModalTitle').innerHTML = `👥 Danh sách Đề xuất &amp; Lệnh Bảo Hành — Nhóm: <span style="color:${group.color}">${esc(group.name)}</span>`;
  $('#custGroupModalSubtitle').innerHTML = `Nguồn dữ liệu: <b>https://dealer-portal.vinfast.com/</b> · Tổng doanh thu: <b>${fmtVND(group.rev)}</b> (${group.cnt} đề xuất)`;
  
  // Set badge stats
  $('#custGroupStats').innerHTML = `
    <span class="tag" style="background:rgba(255,255,255,0.06);color:#cbd5e1;padding:4px 10px;font-size:12px">Tổng số: <b>${group.cnt} ĐX</b></span>
    <span class="tag" style="background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);padding:4px 10px;font-size:12px">Đã duyệt: <b>${group.approvedCnt} ĐX</b> (${fmtT(group.approvedRev)} tr)</span>
    <span class="tag" style="background:rgba(217,119,6,0.15);color:#fbbf24;border:1px solid rgba(217,119,6,0.3);padding:4px 10px;font-size:12px">Chờ duyệt: <b>${group.pendingCnt} ĐX</b> (${fmtT(group.pendingRev)} tr)</span>
    ${group.rejectedCnt > 0 ? `<span class="tag" style="background:rgba(239,68,68,0.15);color:#fca5a5;border:1px solid rgba(239,68,68,0.3);padding:4px 10px;font-size:12px">Bị trả về / Từ chối: <b>${group.rejectedCnt} ĐX</b></span>` : ''}
  `;

  renderCustGroupClaimsTable(group, '', filterStatus);
  modal.hidden = false;
};

function renderCustGroupClaimsTable(group, searchKeyword = '', filterStatus = 'all'){
  const tbody = $('#custGroupClaimsTbody');
  if(!tbody) return;

  let claims = group.claims || [];
  if(filterStatus === 'approved') {
    claims = claims.filter(r => r.status === 'Đã phê duyệt' || r.status === 'APPROVED');
  } else if(filterStatus === 'pending') {
    claims = claims.filter(r => r.status !== 'Đã phê duyệt' && r.status !== 'APPROVED' && !r.isReturned);
  } else if(filterStatus === 'returned') {
    claims = claims.filter(r => r.isReturned || r.status === 'Từ chối / Hủy');
  }

  if(searchKeyword){
    const q = norm(searchKeyword);
    claims = claims.filter(r => 
      norm(r.id).includes(q) || 
      norm(r.wo).includes(q) || 
      norm(r.vin).includes(q) || 
      norm(r.customerName).includes(q) ||
      norm(r.customerCompanyName).includes(q)
    );
  }

  $('#custGroupResultCount').textContent = `${claims.length} đề xuất / lệnh`;

  if(!claims.length){
    tbody.innerHTML = '<tr><td colspan="9" class="empty-state" style="text-align:center;padding:24px;color:var(--text-muted)">Không tìm thấy đề xuất / lệnh nào khớp điều kiện tìm kiếm.</td></tr>';
    return;
  }

  tbody.innerHTML = claims.map((r, idx) => {
    const isApp = r.status === 'Đã phê duyệt' || r.status === 'APPROVED';
    const stBadge = isApp 
      ? '<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(16,185,129,0.18);color:#34d399;border:1px solid rgba(16,185,129,0.4)">Đã phê duyệt</span>'
      : (r.isReturned 
         ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.4)">${esc(r.returnLevelLabel || 'Bị trả về')}</span>`
         : `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(217,119,6,0.18);color:#fbbf24;border:1px solid rgba(217,119,6,0.4)">${esc(r.status || 'Chờ duyệt')}</span>`);

    return `
      <tr>
        <td style="text-align:center;color:#94a3b8;font-size:12px">${idx + 1}</td>
        <td>
          <div style="font-weight:700;color:#f8fafc;display:flex;align-items:center;gap:6px">
            <span>${esc(r.id)}</span>
            <button class="btn secondary" style="padding:1px 5px;font-size:10px" title="Sao chép mã ĐX" onclick="copyTextToClipboard('${r.id}', this)">📋</button>
          </div>
        </td>
        <td>
          <div style="font-family:monospace;font-size:12px;color:#cbd5e1;display:flex;align-items:center;gap:6px">
            <span>${esc(r.wo) || '—'}</span>
            ${r.wo && r.wo !== '—' ? `<button class="btn secondary" style="padding:1px 5px;font-size:10px" title="Sao chép mã WO" onclick="copyTextToClipboard('${r.wo}', this)">📋</button>` : ''}
          </div>
        </td>
        <td style="font-family:monospace;font-size:11.5px;color:#94a3b8">${esc(r.vin) || '—'}</td>
        <td style="font-size:12px;font-weight:600;color:#f1f5f9">${esc(r.customerName || r.customerCompanyName || '—')}</td>
        <td style="text-align:right;font-weight:700;color:var(--primary);font-size:13px">${fmtVND(r.total)}</td>
        <td style="text-align:center;font-size:12px;color:#cbd5e1">${fmtDate(r.date) || '—'}</td>
        <td style="text-align:center">${stBadge}</td>
        <td style="font-size:11.5px;color:#94a3b8;max-width:180px;white-space:normal">${esc(r.rejectReason || '—')}</td>
      </tr>
    `;
  }).join('');
}

window.filterCustGroupModal = function(){
  const C = state.computed;
  if(!C || !C.customerBreakdown || !currentCustGroupModalId) return;
  const group = C.customerBreakdown.groups.find(g => g.id === currentCustGroupModalId);
  if(!group) return;
  const q = ($('#custGroupSearchInput')?.value || '').trim();
  const st = $('#custGroupStatusFilter')?.value || 'all';
  renderCustGroupClaimsTable(group, q, st);
};

window.exportCustGroupClaimsExcel = function(){
  const C = state.computed;
  if(!C || !C.customerBreakdown || !currentCustGroupModalId) return;
  const group = C.customerBreakdown.groups.find(g => g.id === currentCustGroupModalId);
  if(!group || !group.claims || !group.claims.length) {
    alert('Không có dữ liệu để xuất Excel!');
    return;
  }
  const rows = group.claims.map((r, i) => ({
    'STT': i + 1,
    'Mã Đề Xuất (WC)': r.id,
    'Lệnh Sửa Chữa (WO)': r.wo || '',
    'Số Khung (VIN)': r.vin || '',
    'Khách Hàng': r.customerName || '',
    'Công Ty': r.customerCompanyName || '',
    'Nhóm Khách': group.name,
    'Số Tiền (VND)': r.total || 0,
    'Ngày Duyệt / Gửi': fmtDate(r.date) || '',
    'Kỳ Doanh Thu': r.cm ? monthLabel(r.cm) : '',
    'Trạng Thái': r.status || '',
    'Lý Do Trả Về / Từ Chối': r.rejectReason || ''
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, group.tag);
  XLSX.writeFile(wb, `DealerPortal_${group.tag}_${settings.targetMonth}.xlsx`);
};

window.closeCustomerGroupClaimsModal = function(){
  const m = $('#modalCustomerGroupClaims');
  if(m) m.hidden = true;
};

// 2. MODAL XEM DANH SÁCH LỆNH BẢO HÀNH CHƯA LÀM ĐỀ XUẤT (ở mức quyết toán trở lên)
window.showUnsubmittedWarrantyOrders = function(){
  const C = state.computed;
  const orders = (C && C.unsubmittedWarrantyOrders) || [];
  renderUnsubmittedOrdersModal(orders);
  const modal = $('#modalUnsubmittedOrders');
  if(modal) modal.hidden = false;
};

function renderUnsubmittedOrdersModal(orders, keyword = ''){
  const tbody = $('#unsubmittedOrdersTbody');
  if(!tbody) return;

  let list = orders || [];
  if(keyword){
    const q = norm(keyword);
    list = list.filter(o => 
      norm(o.wo).includes(q) || 
      norm(o.plate).includes(q) || 
      norm(o.vin).includes(q) || 
      norm(o.customer).includes(q) ||
      norm(o.vehicle).includes(q)
    );
  }

  $('#unsubmittedResultCount').textContent = `${list.length} lệnh sửa chữa`;

  // Quick groups count
  const gsmCount = list.filter(o => o.customerGroup?.id === 'gsm').length;
  const bshipCount = list.filter(o => o.customerGroup?.id === 'bship').length;
  const retailCount = list.filter(o => o.customerGroup?.id === 'retail').length;

  $('#unsubmittedGroupStats').innerHTML = `
    <span class="tag" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.4);font-size:12px;padding:3px 10px">Tổng chưa làm ĐX: <b>${list.length} lệnh</b></span>
    <span class="tag" style="background:rgba(6,182,212,0.15);color:#22d3ee;font-size:12px;padding:3px 10px">GSM: <b>${gsmCount} lệnh</b></span>
    <span class="tag" style="background:rgba(16,185,129,0.15);color:#34d399;font-size:12px;padding:3px 10px">BSHIP: <b>${bshipCount} lệnh</b></span>
    <span class="tag" style="background:rgba(56,189,248,0.15);color:#38bdf8;font-size:12px;padding:3px 10px">Khách lẻ: <b>${retailCount} lệnh</b></span>
  `;

  if(!list.length){
    tbody.innerHTML = '<tr><td colspan="9" class="empty-state" style="text-align:center;padding:24px;color:var(--text-muted)">Không có lệnh sửa chữa bảo hành nào chưa làm đề xuất.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((o, idx) => {
    const custTag = o.customerGroup 
      ? `<span style="font-size:10px;padding:1px 6px;border-radius:4px;font-weight:700;margin-left:4px;background:${o.customerGroup.color}22;color:${o.customerGroup.color};border:1px solid ${o.customerGroup.color}50">${o.customerGroup.tag}</span>` 
      : '';

    return `
      <tr>
        <td style="text-align:center;color:#94a3b8;font-size:12px">${idx + 1}</td>
        <td>
          <div style="font-weight:800;color:#f8fafc;font-family:monospace;font-size:13px;display:flex;align-items:center;gap:6px">
            <span>${esc(o.wo)}</span>
            <button class="btn secondary" style="padding:1px 5px;font-size:10px" title="Sao chép mã LSC" onclick="copyTextToClipboard('${o.wo}', this)">📋</button>
          </div>
        </td>
        <td style="font-weight:700;color:#38bdf8;font-size:12.5px">${esc(o.plate) || '—'}</td>
        <td style="font-family:monospace;font-size:11.5px;color:#94a3b8">${esc(o.vin) || '—'}</td>
        <td style="font-size:12px;color:#cbd5e1">${esc(o.vehicle) || '—'}</td>
        <td>
          <div style="font-size:12px;font-weight:600;color:#f1f5f9">
            ${esc(o.customer || '—')} ${custTag}
          </div>
        </td>
        <td style="text-align:center">
          ${o.isWarrantyPayment 
            ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(239,68,68,0.18);color:#fca5a5;border:1px solid rgba(239,68,68,0.4)">Bảo hành</span>`
            : `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(59,130,246,0.18);color:#93c5fd;border:1px solid rgba(59,130,246,0.4)">Khách hàng</span>`}
        </td>
        <td style="text-align:center">
          <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(16,185,129,0.18);color:#34d399;border:1px solid rgba(16,185,129,0.4)">${esc(o.status || 'Đã quyết toán')}</span>
        </td>
        <td style="font-size:11.5px;color:#94a3b8;max-width:200px;white-space:normal">
          ${esc(o.faultStr || o.issue || o.note || 'Lỗi linh kiện bảo hành')}
        </td>
      </tr>
    `;
  }).join('');
}

window.filterUnsubmittedModal = function(){
  const C = state.computed;
  const list = (C && C.unsubmittedWarrantyOrders) || [];
  const q = ($('#unsubmittedSearchInput')?.value || '').trim();
  renderUnsubmittedOrdersModal(list, q);
};

window.copyAllUnsubmittedWo = function(btn){
  const C = state.computed;
  const list = (C && C.unsubmittedWarrantyOrders) || [];
  const wos = list.map(o => o.wo).filter(w => w && w !== '—');
  if(!wos.length){ alert('Không có mã lệnh sửa chữa nào để sao chép!'); return; }
  const text = wos.join(String.fromCharCode(10));
  copyTextToClipboard(text, btn);
};

window.exportUnsubmittedWarrantyExcel = function(){
  const C = state.computed;
  const list = (C && C.unsubmittedWarrantyOrders) || [];
  if(!list.length){ alert('Không có dữ liệu để xuất Excel!'); return; }
  const rows = list.map((o, idx) => ({
    'STT': idx + 1,
    'Mã LSC (WO)': o.wo,
    'Biển Số': o.plate,
    'Số Khung (VIN)': o.vin,
    'Dòng Xe': o.vehicle,
    'Khách Hàng': o.customer,
    'Nhóm Khách': o.customerGroup?.name || 'Khách lẻ',
    'Phân Loại TT': o.phanLoaiTt,
    'Trạng Thái LSC': o.status,
    'Ngày Nhận / Quyết Toán': o.dateStr,
    'Hạng Mục Lỗi / Phụ Tùng': o.faultStr || o.issue || o.note || ''
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ChuaLamDXBH');
  XLSX.writeFile(wb, `LenhChuaLamDXBH_${new Date().toISOString().slice(0,10)}.xlsx`);
};

window.closeUnsubmittedWarrantyModal = function(){
  const m = $('#modalUnsubmittedOrders');
  if(m) m.hidden = true;
};

window.viewReturnedClaims = function(){
  if (typeof window.switchTab === 'function') window.switchTab('claims');
  if (state.filters) {
    state.filters.returnStatus = 'all_returned';
    if (typeof renderAll === 'function') renderAll();
  }
};


function svgReturnRateGauge(rate, isOk, l1Cnt, l2Cnt, totalCnt) {
  const maxScale = Math.max(3.0, Math.ceil(rate + 1.2));
  const pinX = Math.min(380, Math.max(20, 20 + (rate / maxScale) * 360));
  const benchX = 20 + (1.0 / maxScale) * 360;
  const statusColor = isOk ? '#10b981' : '#ef4444';

  return `
    <div style="background:rgba(15,23,42,0.7);border:1px solid rgba(56,189,248,0.2);border-radius:12px;padding:16px;box-shadow:0 4px 16px rgba(0,0,0,0.25)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:26px;font-weight:800;color:${statusColor}">${rate.toFixed(2)}%</span>
          <span style="font-size:11.5px;padding:3px 10px;border-radius:9999px;font-weight:700;background:${isOk ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)'};color:${isOk ? '#34d399' : '#fca5a5'};border:1px solid ${isOk ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}">
            ${isOk ? '✅ ĐẠT CHUẨN (≤ 1.0%)' : '⚠️ VƯỢT NGƯỠNG CHO PHÉP (> 1.0%)'}
          </span>
        </div>
        <div style="font-size:12px;color:#94a3b8">
          Mức trần VinFast cho phép: <b style="color:#f87171;font-size:13px">≤ 1.0%</b>
        </div>
      </div>

      <!-- Sơ đồ thanh đo Benchmark SVG -->
      <svg viewBox="0 0 400 68" style="width:100%;height:auto;display:block;margin:6px 0">
        <!-- Vùng An toàn 0 -> 1% -->
        <rect x="20" y="20" width="${benchX - 20}" height="14" rx="7" fill="rgba(16,185,129,0.35)" stroke="#10b981" stroke-width="1.5"/>
        <!-- Vùng Vượt ngưỡng 1% -> max -->
        <rect x="${benchX}" y="20" width="${380 - benchX}" height="14" rx="7" fill="rgba(239,68,68,0.22)" stroke="#ef4444" stroke-width="1.5"/>
        
        <!-- Vạch mức trần 1.0% -->
        <line x1="${benchX}" y1="12" x2="${benchX}" y2="44" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3,3"/>
        <text x="${benchX}" y="10" fill="#f87171" font-size="9" font-weight="700" text-anchor="middle">MỨC TRẦN 1.0%</text>

        <!-- Điểm kim chỉ tỷ lệ thực tế -->
        <circle cx="${pinX}" cy="27" r="7" fill="${statusColor}" stroke="#ffffff" stroke-width="2"/>
        <text x="${pinX}" y="58" fill="${statusColor}" font-size="11" font-weight="800" text-anchor="middle">Thực tế: ${rate.toFixed(2)}%</text>
      </svg>

      <!-- Chi tiết Cấp 1 & Cấp 2 trả về -->
      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;margin-top:10px;padding-top:10px;border-top:1px dashed rgba(255,255,255,0.1);text-align:center">
        <div>
          <div style="font-size:11px;color:#94a3b8">Cấp 1 trả về</div>
          <div style="font-size:15px;font-weight:700;color:#fbbf24">${l1Cnt} ĐX</div>
        </div>
        <div>
          <div style="font-size:11px;color:#94a3b8">Cấp 2 trả về</div>
          <div style="font-size:15px;font-weight:700;color:#f87171">${l2Cnt} ĐX</div>
        </div>
        <div>
          <div style="font-size:11px;color:#94a3b8">Tổng ĐX phát sinh</div>
          <div style="font-size:15px;font-weight:700;color:#38bdf8">${totalCnt} ĐX</div>
        </div>
      </div>
    </div>
  `;
}
window.svgReturnRateGauge = svgReturnRateGauge;

function newRecord(){
  return { 
    id: '', status: '', rawStatus: '', date: null, wo: '', vin: '', vehicle: '', 
    customerName: '', customerCompanyName: '', customerGroup: null,
    approvalSequence: null, returnLevel1Count: 0, returnLevel2Count: 0,
    isReturnLevel1: false, isReturnLevel2: false, isReturned: false, isCancelled: false, returnLevelLabel: '', rejectReason: '',
    total: 0, totalInc: 0, totalEx: 0, labor: 0, laborInc: 0, laborEx: 0, outsource: 0, parts: [], srcId: null, srcName: '', format: 0 
  };
}

function parseFile1Sheet(rows, src){
  const hi = findHeaderRow(rows);
  if(hi < 0) return [];
  const H = rows[hi], map = buildColMap(H);
  const idCol = map['so yeu cau bao hanh'] ?? map['so de xuat bao hanh'];
  if(idCol == null) return null;
  const isPortal = map['so de xuat bao hanh'] != null && map['so yeu cau bao hanh'] == null;
  const recs = [];
  for(let r = hi + 1; r < rows.length; r++){
    const row = rows[r]; if(!row || row.length === 0) continue;
    const idRaw = row[idCol];
    if(idRaw == null || String(idRaw).trim() === '') continue;
    const rec = newRecord();
    rec.id = String(idRaw).trim(); rec.format = isPortal ? 2 : 1; rec.srcId = src.id; rec.srcName = src.name;
    rec.status = String(pickCol(map, row, ['trang thai']) ?? '').trim();
    rec.date = parseDateVal(pickCol(map, row, ['ngay phe duyet 2', 'ngay phe duyet cap 2', 'ngay phe duyet cap 1', 'ngay phe duyet']))
      || parseDateVal(pickCol(map, row, ['ngay gui de xuat bao hanh', 'ngay gui']))
      || parseDateVal(pickCol(map, row, ['ngay tao']))
      || parseDateVal(pickCol(map, row, ['ngay chinh sua', 'ngay dxbh']))
      || parseDateVal(pickCol(map, row, ['ngay mo lsc', 'ngay mo lenh sua chua', 'ngay tao lenh sua chua']));
    rec.wo = String(pickCol(map, row, ['lenh sua chua']) ?? '').trim();
    rec.vin = String(pickCol(map, row, ['so khung', 'vin']) ?? '').trim();
    rec.vehicle = String(pickCol(map, row, ['ten xe', 'model xe']) ?? '').trim();
    rec.customerName = String(pickCol(map, row, ['ten khach hang', 'khach hang']) || '').trim();
    rec.customerCompanyName = String(pickCol(map, row, ['ten cong ty khach hang', 'cong ty']) || '').trim();
    rec.customerGroup = getCustomerGroup(rec.customerName, rec.customerCompanyName);

    const f1RawSt = String(pickCol(map, row, ['trang thai']) ?? '').trim();
    const f1Seq = pickCol(map, row, ['cap phe duyet']);
    const f1Reason = String(pickCol(map, row, ['ly do tra ve / tu choi', 'ly do tu choi', 'ly do tra ve', 'ly do huy']) || '').trim();
    const f1L1 = pickCol(map, row, ['so lan tra ve cap 1', 'tra ve cap 1']);
    const f1L2 = pickCol(map, row, ['so lan tra ve cap 2', 'tra ve cap 2', 'so lan tu choi cap 2']);
    const f1RetStat = evaluateClaimReturnStatus(row, f1RawSt, f1Seq, f1Reason, f1L1, f1L2);
    rec.isReturnLevel1 = f1RetStat.isReturnLevel1;
    rec.isReturnLevel2 = f1RetStat.isReturnLevel2;
    rec.isReturned = f1RetStat.isReturned;
    rec.isCancelled = Boolean(f1RetStat.isCancelled);
    rec.returnLevelLabel = f1RetStat.returnLevelLabel;
    rec.rejectReason = f1Reason;
    const outsource = parseNum(pickCol(map, row, ['total outsource amount']));
    rec.outsource = outsource;
    const pMoneyInc = parseNum(pickCol(map, row, ['so tien bao hanh phu tung', 'tien vat tu yeu cau (sau vat)']));
    const pMoneyEx = parseNum(pickCol(map, row, ['tien vat tu yeu cau (truoc vat)'])) || pMoneyInc;
    const laborInc = parseNum(pickCol(map, row, ['tien cong yeu cau (sau vat)', 'tien cong yeu cau']));
    const laborEx = parseNum(pickCol(map, row, ['tien cong yeu cau (truoc vat)'])) || laborInc;
    const totalInc = parseNum(pickCol(map, row, ['tong tien yeu cau bao hanh', 'tong tien yeu cau (sau vat)'])) || (pMoneyInc + laborInc + outsource);
    const totalEx = parseNum(pickCol(map, row, ['tong tien yeu cau (truoc vat)'])) || (pMoneyEx + laborEx + outsource);

    rec.pMoneyInc = pMoneyInc; rec.pMoneyEx = pMoneyEx;
    rec.laborInc = laborInc; rec.laborEx = laborEx;
    rec.totalInc = totalInc; rec.totalEx = totalEx;
    rec.labor = (settings.vatMode === 'ex') ? laborEx : laborInc;
    rec.total = (settings.vatMode === 'ex') ? totalEx : totalInc;

    const rawCode = String(pickCol(map, row, ['ma phu tung chinh', 'phu tung chinh', 'ma phu tung', 'ma vat tu chinh']) ?? '').trim();
    const pName = String(pickCol(map, row, ['ten phu tung chinh', 'ten vat tu chinh']) ?? '').trim();
    const snNew = pickCol(map, row, ['so serial vat tu moi', 'serial phu tung moi']);
    const snOld = pickCol(map, row, ['so serial vat tu cu', 'serial phu tung cu']);
    const pMoneyVal = (settings.vatMode === 'ex') ? pMoneyEx : pMoneyInc;
    const code = rawCode || inferPartCode(pName, snNew, snOld, pMoneyVal);
    if(code || pName || pMoneyVal) rec.parts = [{ code: code || pName || '(KHÔNG MÃ)', name: pName, qty: 1, moneyInc: pMoneyInc, moneyEx: pMoneyEx, money: pMoneyVal, inferred: !rawCode }];
    recs.push(rec);
  }
  return recs;
}

function parseFile2Workbook(wb, src){
  const nameOf = wb.SheetNames.map(n => norm(n));
  const idx = pred => wb.SheetNames[nameOf.findIndex(n => pred(n))];
  const dxName = idx(n => n.startsWith('de xuat bao hanh'));
  if(!dxName) return null;
  const ptName = idx(n => n.startsWith('phu tung theo dxbh'));
  const ncName = idx(n => n.startsWith('nhan cong theo dxbh'));
  const ctName = idx(n => n.startsWith('chi tiet dxbh'));
  const proposals = new Map();
  const dxRows = sheetRows(wb.Sheets[dxName]);
  const hi = findHeaderRow(dxRows), map = buildColMap(dxRows[hi] || []);
  for(let r = hi + 1; r < dxRows.length; r++){
    const row = dxRows[r]; if(!row) continue;
    const idRaw = pickCol(map, row, ['de xuat bao hanh']);
    if(idRaw == null || String(idRaw).trim() === '') continue;
    const rec = newRecord();
    rec.id = String(idRaw).trim(); rec.format = 2; rec.srcId = src.id; rec.srcName = src.name;
    rec.status = String(pickCol(map, row, ['trang thai']) ?? '').trim();
    rec.date = parseDateVal(pickCol(map, row, ['ngay phe duyet'])) || parseDateVal(pickCol(map, row, ['ngay tao'])) || parseDateVal(pickCol(map, row, ['ngay chinh sua']));
    rec.wo = String(pickCol(map, row, ['ma lsc']) ?? '').trim();
    rec.vin = String(pickCol(map, row, ['vin']) ?? '').trim();
    rec.total = parseNum(pickCol(map, row, ['so tien phe duyet', 'tong tien phe duyet']));
    proposals.set(rec.id, rec);
  }
  if(ctName){
    const ctRows = sheetRows(wb.Sheets[ctName]), hi2 = findHeaderRow(ctRows), m2 = buildColMap(ctRows[hi2] || []);
    for(let r = hi2 + 1; r < ctRows.length; r++){
      const row = ctRows[r]; if(!row) continue;
      const id = String(pickCol(m2, row, ['de xuat bao hanh']) ?? '').trim();
      const rec = proposals.get(id);
      if(rec && !rec.total) rec.total = parseNum(pickCol(m2, row, ['tong (gom thue)', 'tong gom thue']));
    }
  }
  if(ptName){
    const ptRows = sheetRows(wb.Sheets[ptName]), hi2 = findHeaderRow(ptRows), m2 = buildColMap(ptRows[hi2] || []);
    for(let r = hi2 + 1; r < ptRows.length; r++){
      const row = ptRows[r]; if(!row) continue;
      const id = String(pickCol(m2, row, ['de xuat bao hanh']) ?? '').trim();
      const rec = proposals.get(id); if(!rec) continue;
      const code = String(pickCol(m2, row, ['ma phu tung']) ?? '').trim();
      const money = parseNum(pickCol(m2, row, ['tien gom thue'])) || parseNum(pickCol(m2, row, ['thanh tien sau km']));
      if(!code && !money) continue;
      rec.parts.push({ code: code || '(KHÔNG MÃ)', name: String(pickCol(m2, row, ['ten phu tung']) ?? '').trim(), qty: parseNum(pickCol(m2, row, ['so luong'])), money });
    }
  }
  if(ncName){
    const ncRows = sheetRows(wb.Sheets[ncName]), hi2 = findHeaderRow(ncRows), m2 = buildColMap(ncRows[hi2] || []);
    for(let r = hi2 + 1; r < ncRows.length; r++){
      const row = ncRows[r]; if(!row) continue;
      const id = String(pickCol(m2, row, ['de xuat bao hanh']) ?? '').trim();
      const rec = proposals.get(id); if(!rec) continue;
      rec.labor += parseNum(pickCol(m2, row, ['tien gom thue'])) || parseNum(pickCol(m2, row, ['thanh tien sau km']));
    }
  }
  for(const rec of proposals.values()){
    if(!rec.total) rec.total = rec.parts.reduce((s, p) => s + p.money, 0) + rec.labor + rec.outsource;
    rec.totalInc = rec.total; rec.totalEx = rec.total;
    rec.laborInc = rec.labor; rec.laborEx = rec.labor;
    for(const p of rec.parts){ p.moneyInc = p.money; p.moneyEx = p.money; }
  }
  return [...proposals.values()];
}

/* ============================ State ============================ */
const state = {
  activeTab: 'overview',
  sources: [],
  computed: null,
  filters: { cm: '', kind: '', q: '' },
  inventory: new Map(),
  invFileName: ''
};
window.state = state;

function defaultTargetMonth(){
  const now = new Date();
  let y = now.getFullYear(), m = now.getMonth() + 1;
  if(now.getDate() > 22){ m++; if(m > 12){ m = 1; y++; } }
  return `${y}-${String(m).padStart(2, '0')}`;
}

const settings = {
  targetMonth: defaultTargetMonth(),
  target: 400000000,
  cut: 22,
  cycle22: true,
  vatMode: 'inc',
  disabledSrc: new Set()
};
try {
  const vm = localStorage.getItem('bh_vatmode');
  if(vm === 'ex' || vm === 'inc') settings.vatMode = vm;
} catch(e){}

/* ---- Phụ tùng dự tính ---- */
state.prepared = [{ code: '', qty: '' }];
const preparedKey = () => 'bh_prepared_' + settings.targetMonth;
function loadPrepared(){
  let l = null;
  try { l = JSON.parse(localStorage.getItem(preparedKey()) || 'null'); } catch(e){}
  state.prepared = Array.isArray(l) ? l.filter(r => r && typeof r === 'object') : [];
  if(!state.prepared.length) state.prepared = [{ code: '', qty: '' }];
}
function savePrepared(){
  try { localStorage.setItem(preparedKey(), JSON.stringify(state.prepared.filter(r => (r.code || '').trim() || (+r.qty || 0) > 0))); } catch(e){}
}
let prepTimer = null;
window.prepSet = (i, k, v) => {
  const row = state.prepared[i]; if(!row) return;
  if(k === 'qty'){ const n = Math.floor(+String(v).replace(/[^\d]/g, '') || 0); row.qty = n > 0 ? n : ''; }
  else row.code = String(v).trim().toUpperCase();
  savePrepared();
  const pid = (k === 'qty' ? 'pqty' : 'pcode') + i;
  clearTimeout(prepTimer);
  prepTimer = setTimeout(() => {
    renderAll();
    const el = document.querySelector('[data-pid="' + pid + '"]');
    if(el){ el.focus(); try { el.setSelectionRange(el.value.length, el.value.length); } catch(e){} }
  }, 350);
};
window.prepAdd = () => {
  state.prepared.push({ code: '', qty: '' });
  savePrepared();
  renderAll();
  setTimeout(() => { const els = document.querySelectorAll('[data-pid^="pcode"]'); if(els.length) els[els.length - 1].focus(); }, 60);
};
window.prepDel = i => {
  state.prepared.splice(i, 1);
  if(!state.prepared.length) state.prepared = [{ code: '', qty: '' }];
  savePrepared();
  renderAll();
};


/* ============================ Check Xe Hàng Ngày (ServiceOS) ============================ */
// 12 Hạng mục lỗi chuẩn theo yêu cầu nghiệp vụ
const ISSUE_CATEGORIES = [
  { id: 'all', name: 'Tất cả hạng mục', icon: '📋' },
  { id: 'no_fault', name: 'Không lỗi', icon: '✅', keywords: [] },
  { id: 'esim', name: 'Lỗi Esim', icon: '📶', keywords: ['esim', 'e-sim', 'sim', 'mất sóng', 'mat song', '4g'] },
  { id: 'pin', name: 'Lỗi PIN', icon: '🔋', keywords: ['pin', 'battery', 'bms', 'cell', 'lắp pin', 'tháo pin'] },
  { id: 'motor', name: 'Lỗi động cơ', icon: '⚡', keywords: ['động cơ', 'dong co', 'motor', 'số máy', 'so may'] },
  { id: 'charger', name: 'Lỗi sạc', icon: '🔌', keywords: ['sạc', 'sac', 'charger', 'củ sạc', 'bộ sạc'] },
  { id: 'topcover', name: 'Lỗi nút TopCover', icon: '🔘', keywords: ['topcover', 'top cover', 'nút top', 'nut top'] },
  { id: 'rear_shock', name: 'Lỗi giảm sóc sau', icon: '🛞', keywords: ['giảm sóc sau', 'giảm xóc sau', 'giam soc sau', 'giam xoc sau', 'phuộc sau', 'nhún sau'] },
  { id: 'front_shock', name: 'Lỗi giảm xóc trước', icon: '🚲', keywords: ['giảm xóc trước', 'giảm sóc trước', 'giam xoc truoc', 'giam soc truoc', 'phuộc trước', 'nhún trước'] },
  { id: 'hmi', name: 'Lỗi HMI', icon: '🖥️', keywords: ['hmi', 'màn hình', 'man hinh', 'đồng hồ', 'dong ho', 'display'] },
  { id: 'mcu', name: 'Lỗi MCU', icon: '🎛️', keywords: ['mcu', 'điều khiển động cơ', 'dieu khien dong co', 'motor controller'] },
  { id: 'scu', name: 'Lỗi SCU', icon: '🔑', keywords: ['scu', 'smartkey', 'smart key', 'chìa khóa', 'chia khoa', 'khóa thông minh'] },
  { id: 'dcdc', name: 'Lỗi DC - DC', icon: '⚡', keywords: ['dc - dc', 'dc-dc', 'dcdc', 'hạ áp', 'ha ap', '12v'] },
  { id: 'harness', name: 'Lỗi bộ dây điện', icon: '🧵', keywords: ['bộ dây điện', 'bo day dien', 'dây điện', 'day dien', 'dây sườn', 'giắc điện', 'chập điện', 'harness'] },
  { id: 'other', name: 'Lỗi khác', icon: '🛠️', keywords: [] }
];

state.checkXe = {
  orders: [],
  viewMode: 'card',        // Mặc định 'card' (Thẻ ServiceOS thông minh)
  filterCategory: 'all',
  filterStatus: 'all',     // 'all', 'unchecked', 'recheck', 'checked', 'normal'
  filterScope: 'all',      // Mặc định hiển thị đầy đủ xe trong xưởng
  filterDate: 'all',       // 'all', 'today', 'yesterday', 'last7', or 'YYYY-MM-DD'
  filterTech: '',
  filterVehicle: '',       // Lọc theo Dòng xe
  filterHasTable: 'all',   // 'all', 'yes', 'no' (Bảng cập nhật phía dưới)
  filterHasNote: 'all',    // 'all', 'yes', 'no' (Ghi chú KTV)
  searchPlate: '',         // Lọc riêng Biển số / Mã WO
  searchQuery: '',         // Tìm kiếm tự do
  sortBy: 'stt',           // Cột sắp xếp: 'stt', 'plate', 'vehicle', 'tech', 'category', 'bang', 'note', 'date', 'status'
  sortDir: 'asc'           // 'asc' hoặc 'desc'
};

// 4 QUY TẮC NGHIỆP VỤ XÁC ĐỊNH TRẠNG THÁI CHECK:
// - Quy tắc 1: Nếu có hạng mục lỗi nhưng không có ghi chú KTV hay bảng cập nhật phía dưới -> Chưa check (UNCHECKED)
// - Quy tắc 2: Nếu không có hạng mục lỗi và không có ghi chú KTV mà có bảng cập nhật bên dưới -> Đã check (CHECKED)
// - Quy tắc 3: Nếu có hạng mục lỗi và ghi chú KTV (kèm bảng cập nhật) -> Đã check (CHECKED)
// - Quy tắc 4: Nếu có hạng mục lỗi nhưng không có bảng cập nhật bên dưới và đã có ghi chú KTV -> Cần check lại (RECHECK)

// Kiểm tra lệnh sửa chữa đang ở mức quyết toán trở lên
function isSettledOrHigher(st, raw) {
  if (raw && typeof raw === 'object') {
    if (raw.completed_at || raw.settlement_date || raw.settled_at || raw.repair_done_at || raw.delivered_at || raw.ngay_quyet_toan || raw.ngay_hoan_thanh || raw.completedDate) {
      return true;
    }
  }
  if (!st) return false;
  const rawStr = String(st).toLowerCase();
  const s = norm(String(st));
  return s.includes('quyet toan') || 
         s.includes('hoan thanh') || 
         s.includes('giao xe') || 
         s.includes('thanh toan') || 
         s.includes('nghiem thu') || 
         s.includes('waiting approval') || 
         rawStr.includes('waiting_approval') || 
         s.includes('settled') || 
         s.includes('settlement') || 
         s.includes('completed') || 
         s.includes('closed') || 
         s.includes('paid') || 
         s.includes('waiting payment') || 
         rawStr.includes('waiting_payment') || 
         s.includes('delivered') ||
         s.includes('repair done') ||
         rawStr.includes('repair_done');
}
window.isSettledOrHigher = isSettledOrHigher;

function evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat){
  // QUY TẮC MỚI THEO YÊU CẦU NGƯỜI DÙNG:
  // "xe không lỗi thì tính là trạng thái check là xe không lỗi"
  if(!hasLoi){
    return { 
      code: 'no_fault', 
      label: '✅ Xe không lỗi', 
      badgeClass: 'no_fault', 
      desc: 'Xe bình thường, không có hạng mục lỗi' 
    };
  }

  // Nếu CÓ LỖI:
  // 1. Có lỗi + có bảng cập nhật phía dưới (hoặc đã có ghi chú KTV hoàn tất) -> Đã check
  if(hasBangCapNhat || hasKtvNote){
    return { 
      code: 'checked', 
      label: '✅ Đã check', 
      badgeClass: 'checked', 
      desc: hasBangCapNhat ? 'Đã cập nhật bảng linh kiện/PIN/Động cơ' : 'Đã có ghi chú kiểm tra KTV' 
    };
  }

  // 2. Có lỗi nhưng CHƯA có ghi chú KTV VÀ CHƯA có bảng cập nhật -> Mặc định Chưa check
  return { 
    code: 'unchecked', 
    label: '🔴 Chưa check', 
    badgeClass: 'unchecked', 
    desc: 'Có lỗi nhưng chưa kiểm tra & chưa cập nhật bảng linh kiện' 
  };
}

function formatPartStatusText(st, kind){
  if(!st || st === '—' || st === '-') return '—';
  const s = String(st).toLowerCase().replace(/\s+/g, '_');
  if(s.includes('cho_lap_dong_co') || s.includes('cho_lap_dc')) return 'Chờ lắp động cơ';
  if(s === 'waiting_motor' || s.includes('cho_dong_co')) return 'Chờ Động cơ';
  if(s === 'waiting_battery' || s.includes('cho_pin')) return 'Chờ PIN';
  if(s === 'checking' || s.includes('cho_kiem_tra')) return 'Chờ kiểm tra';
  if(s.includes('rejected') || s.includes('tu_choi')) return 'Từ chối';
  if(s.includes('completed') || s.includes('done') || s.includes('hoan_thanh')) return 'Hoàn thành';
  if(s.includes('approved') || s.includes('paid') || s.includes('da_duyet') || s.includes('phe_duyet')) return 'Đã phê duyệt';
  if(s.includes('waiting_approval') || s.includes('cho_duyet')) return 'Chờ duyệt';
  return String(st);
}

// Kiểm tra nội dung text có phải là chuỗi hợp lệ không rỗng
function hasTextContent(val){
  const s = String(val ?? '').trim().toLowerCase();
  return Boolean(s && s !== '—' && s !== '-' && s !== 'none' && s !== 'null' && s !== 'undefined' && s !== 'chưa chọn' && s !== 'chưa có');
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
  return day + '/' + m + '/' + y;
}

function formatDisplayDateTime(d){
  if(!d) return '—';
  const dt = (d instanceof Date) ? d : parseDateVal(d);
  if(!dt || isNaN(dt.getTime())) return String(d);
  const day = String(dt.getDate()).padStart(2, '0');
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const y = dt.getFullYear();
  const s = String(d).trim();
  if (!s.includes(':') && s.length <= 10) {
    return day + '/' + m + '/' + y;
  }
  const hh = String(dt.getHours()).padStart(2, '0');
  const mm = String(dt.getMinutes()).padStart(2, '0');
  return day + '/' + m + '/' + y + ' ' + hh + ':' + mm;
}

// Phân loại hạng mục lỗi thông minh
function matchCategoryFromFaults(faults){
  const faultList = Array.isArray(faults) 
    ? faults.filter(Boolean) 
    : (typeof faults === 'string' && faults.trim() ? [faults.trim()] : []);

  // QUY TẮC BẮT BUỘC TỪ NGƯỜI DÙNG:
  // "Chỉ lấy hạng mục lỗi trong hạng mục lỗi của app ServiceOS. Nếu không có hạng mục lỗi thì mặc định xe đó không lỗi"
  if (faultList.length === 0) {
    return { 
      id: 'no_fault', 
      name: 'Không lỗi', 
      icon: '✅',
      isNoFault: true
    };
  }

  const fCombined = faultList.join(' ').toLowerCase();
  for (let i = 2; i < ISSUE_CATEGORIES.length - 1; i++) {
    const cat = ISSUE_CATEGORIES[i];
    if (cat.keywords && cat.keywords.some(kw => fCombined.includes(kw))) {
      return cat;
    }
    if (cat.name.toLowerCase() === fCombined || fCombined.includes(cat.name.toLowerCase()) || cat.name.toLowerCase().includes(fCombined)) {
      return cat;
    }
  }

  // Tên lỗi cụ thể từ ServiceOS
  const cleanName = faultList[0].trim();
  return { 
    id: 'custom_' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_'), 
    name: cleanName, 
    icon: '⚠️' 
  };
}

// Bảng cập nhật phía dưới: Hiển thị y chang bảng ServiceOS khoanh đỏ, nếu không có thì không hiển thị
function formatBangCapNhatHtml(o){
  // NẾU KHÔNG CÓ THÌ KHÔNG HIỂN THỊ (THEO ĐÚNG YÊU CẦU NGƯỜI DÙNG)
  if (!o.hasBangCapNhat) {
    return '<span style="color:var(--text-muted);opacity:0.35">—</span>';
  }

  const fmtStatus = (st) => {
    if (!st || String(st).startsWith('WC-') || String(st).startsWith('N54511-')) return '• Chờ kiểm tra';
    const s = String(st).toLowerCase().replace(/\s+/g, '_');
    if (s.includes('cho_lap_dong_co') || s.includes('cho_lap_dc') || s.includes('cho_lap')) return '• Chờ lắp động cơ';
    if (s.includes('waiting_battery') || s.includes('cho_pin')) return '• Chờ PIN';
    if (s.includes('waiting_motor') || s.includes('cho_dong_co')) return '• Chờ Động cơ';
    if (s.includes('rejected') || s.includes('tu_choi')) return '• Từ chối';
    if (s.includes('completed') || s.includes('done') || s.includes('hoan_thanh')) return '• Hoàn thành';
    if (s.includes('approved') || s.includes('paid') || s.includes('da_duyet') || s.includes('phe_duyet')) return '• Đã phê duyệt';
    if (s.includes('cap_2') || s.includes('l2')) return '• Chờ cấp 2';
    if (s.includes('cap_1') || s.includes('l1')) return '• Chờ cấp 1';
    if (s.includes('waiting_approval') || s.includes('cho_duyet')) return '• Chờ duyệt';
    if (s === 'checking' || s.includes('cho_kiem_tra')) return '• Chờ kiểm tra';
    return '• ' + st;
  };

  const fList = o.faultList || [];
  const fLower = fList.join(' ').toLowerCase();
  const catId = o.category ? o.category.id : '';

  // 1. Phân loại loại thẻ: 'motor', 'pin', 'esim', 'other'
  let kind = 'other';
  if (catId === 'motor' || fLower.includes('động cơ') || fLower.includes('dong co') || fLower.includes('motor') || o.motorSerial || (o.kinds && o.kinds.includes('motor'))) {
    kind = 'motor';
  } else if (catId === 'pin' || fLower.includes('pin') || o.pinSerial || (o.kinds && o.kinds.includes('pin'))) {
    kind = 'pin';
  } else if (catId === 'esim' || fLower.includes('esim') || (o.kinds && o.kinds.includes('esim'))) {
    kind = 'esim';
  } else if (catId === 'charger' || fLower.includes('sạc') || o.chargerSerial) {
    kind = 'charger';
  }

  const statusText = fmtStatus(o.bhOrderStatus || o.warrantyStatus);
  const dateVal = o.dateStr || '—';
  const bhCodeVal = o.bhCode || '—';
  const claimCodeVal = o.claimCode || '—';
  const dienGiaiVal = o.issueDesc || '—';
  const noteVal = o.note || '—';
  const amountVal = o.claimAmount ? (typeof numf === 'function' ? numf(o.claimAmount) : String(o.claimAmount).replace(/\B(?=(\d{3})+(?!\d))/g, '.')) + ' đ' : '—';
  const submittedVal = o.claimSubmittedAt ? formatDisplayDateTime(o.claimSubmittedAt) : '—';
  const approvedVal = o.claimApprovedAt ? formatDisplayDateTime(o.claimApprovedAt) : '—';
  const fmtClaimStatus = (st) => {
    if (!st) return '';
    const s = String(st).toUpperCase();
    if (s.includes('APPROV') || s.includes('DUYỆT') || s.includes('DUYET') || s.includes('PAID')) return 'Đã phê duyệt';
    if (s.includes('SUBMIT') || s.includes('PEND') || s.includes('WAIT')) return 'Chờ duyệt';
    if (s.includes('REJECT') || s.includes('TỪ CHỐI') || s.includes('TU_CHOI')) return 'Từ chối';
    return st;
  };
  const claimStLabel = fmtClaimStatus(o.claimStatus);

  // ========== THẺ ĐỘNG CƠ (Y HỆT HÌNH ẢNH SERVICEOS THỰC TẾ) ==========
  if (kind === 'motor') {
    const motorSerialVal = o.motorSerial || '—';
    const motorNewSerialVal = o.motorSerialNew || '—';
    const removedDateVal = o.motorRemovedAt ? formatDisplayDate(o.motorRemovedAt) : (o.removedAt ? formatDisplayDate(o.removedAt) : dateVal);
    const motorTypeVal = o.motorType || '—';
    const cocVal = o.cocStatus || '—';

    return `
      <div class="sos-warranty-card card-theme-motor">
        <div class="sos-card-head head-motor">
          <div class="sos-card-title title-motor">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span>Động cơ</span>
          </div>
          <div class="sos-card-action action-motor">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
            <span>Cập nhật</span>
          </div>
        </div>
        <div class="sos-card-grid">
          <div class="sos-cell">
            <span class="k">Trạng thái</span>
            <span class="v v-status-motor">${esc(statusText)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày phát sinh</span>
            <span class="v">${esc(dateVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày tháo ĐC</span>
            <span class="v ${removedDateVal === '—' ? 'v-empty' : ''}">${esc(removedDateVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">Số máy</span>
            <span class="v ${motorSerialVal === '—' ? 'v-empty' : 'v-mono-motor'}">${esc(motorSerialVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Số máy mới</span>
            <span class="v ${motorNewSerialVal === '—' ? 'v-empty' : ''}">${esc(motorNewSerialVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Loại SC ĐC</span>
            <span class="v ${motorTypeVal === '—' ? 'v-empty' : ''}">${esc(motorTypeVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">COC</span>
            <span class="v ${cocVal === '—' ? 'v-empty' : ''}">${esc(cocVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Diễn giải</span>
            <span class="v ${dienGiaiVal === '—' ? 'v-empty' : ''}">${esc(dienGiaiVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Lệnh BH</span>
            <span class="v ${bhCodeVal === '—' ? 'v-empty' : 'v-mono-motor'}">${esc(bhCodeVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">ĐXBH ${claimStLabel ? `<span style="color:#10b981;font-weight:700">· ${esc(claimStLabel)}</span>` : ''}</span>
            <span class="v ${claimCodeVal === '—' ? 'v-empty' : 'v-mono-claim'}" style="color:#10b981;font-weight:700">${esc(claimCodeVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Số tiền</span>
            <span class="v ${amountVal === '—' ? 'v-empty' : 'v-money'}">${esc(amountVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày đề xuất</span>
            <span class="v ${submittedVal === '—' ? 'v-empty' : ''}">${esc(submittedVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">Ngày duyệt</span>
            <span class="v ${approvedVal === '—' ? 'v-empty' : ''}">${esc(approvedVal)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ========== THẺ PIN (Y HỆT HÌNH ẢNH SERVICEOS THỰC TẾ) ==========
  if (kind === 'pin') {
    const pinSerialVal = o.pinSerial || '—';
    const pinNewSerialVal = o.pinSerialNew || '—';
    const removedDateVal = o.partsRemovedAt ? formatDisplayDate(o.partsRemovedAt) : (o.removedAt ? formatDisplayDate(o.removedAt) : dateVal);
    const pinTypeVal = o.pinType || '—';
    const sentFactoryVal = o.sentFactoryAt ? formatDisplayDate(o.sentFactoryAt) : '—';

    return `
      <div class="sos-warranty-card card-theme-pin">
        <div class="sos-card-head head-pin">
          <div class="sos-card-title title-pin">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="6" width="18" height="12" rx="2"></rect>
              <line x1="23" y1="11" x2="23" y2="13"></line>
            </svg>
            <span>PIN</span>
          </div>
          <div class="sos-card-action action-pin">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
            <span>Cập nhật</span>
          </div>
        </div>
        <div class="sos-card-grid">
          <div class="sos-cell">
            <span class="k">Trạng thái</span>
            <span class="v v-status-pin">${esc(statusText)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày phát sinh</span>
            <span class="v">${esc(dateVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày tháo PIN</span>
            <span class="v ${removedDateVal === '—' ? 'v-empty' : ''}">${esc(removedDateVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">Serial PIN</span>
            <span class="v ${pinSerialVal === '—' ? 'v-empty' : 'v-mono-pin'}">${esc(pinSerialVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Serial PIN mới</span>
            <span class="v ${pinNewSerialVal === '—' ? 'v-empty' : ''}">${esc(pinNewSerialVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Loại SC PIN</span>
            <span class="v ${pinTypeVal === '—' ? 'v-empty' : ''}">${esc(pinTypeVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">Ngày gửi NM</span>
            <span class="v ${sentFactoryVal === '—' ? 'v-empty' : ''}">${esc(sentFactoryVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Diễn giải</span>
            <span class="v ${dienGiaiVal === '—' ? 'v-empty' : ''}">${esc(dienGiaiVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Lệnh BH</span>
            <span class="v ${bhCodeVal === '—' ? 'v-empty' : 'v-mono-pin'}">${esc(bhCodeVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">ĐXBH ${claimStLabel ? `<span style="color:#10b981;font-weight:700">· ${esc(claimStLabel)}</span>` : ''}</span>
            <span class="v ${claimCodeVal === '—' ? 'v-empty' : 'v-mono-claim'}" style="color:#10b981;font-weight:700">${esc(claimCodeVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Số tiền</span>
            <span class="v ${amountVal === '—' ? 'v-empty' : 'v-money'}">${esc(amountVal)}</span>
          </div>
          <div class="sos-cell">
            <span class="k">Ngày đề xuất</span>
            <span class="v ${submittedVal === '—' ? 'v-empty' : ''}">${esc(submittedVal)}</span>
          </div>

          <div class="sos-cell">
            <span class="k">Ngày duyệt</span>
            <span class="v ${approvedVal === '—' ? 'v-empty' : ''}">${esc(approvedVal)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ========== THẺ ESIM / KHÁC (Y HỆT HÌNH ẢNH SERVICEOS THỰC TẾ) ==========
  const cardTitle = kind === 'esim' ? 'Esim' : kind === 'charger' ? 'Bộ sạc' : (fList[0] ? fList[0].replace(/^Lỗi\s+/i, '') : 'Bảo hành');
  const oldSerialVal = (o.pinSerial || o.motorSerial) && !String(o.pinSerial || o.motorSerial).includes('QR ngoài') ? (o.pinSerial || o.motorSerial) : '—';
  const procDateVal = o.removedAt ? formatDisplayDate(o.removedAt) : '—';

  return `
    <div class="sos-warranty-card card-theme-esim">
      <div class="sos-card-head head-esim">
        <div class="sos-card-title title-esim">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 12l10 10 10-10L12 2z"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          <span>${esc(cardTitle)}</span>
        </div>
        <div class="sos-card-action action-esim">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
          <span>Cập nhật</span>
        </div>
      </div>
      <div class="sos-card-grid">
        <div class="sos-cell">
          <span class="k">Trạng thái</span>
          <span class="v v-status-esim">${esc(statusText)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Ngày phát sinh</span>
          <span class="v">${esc(dateVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Ngày xử lý</span>
          <span class="v ${procDateVal === '—' ? 'v-empty' : ''}">${esc(procDateVal)}</span>
        </div>

        <div class="sos-cell">
          <span class="k">Serial cũ</span>
          <span class="v ${oldSerialVal === '—' ? 'v-empty' : ''}">${esc(oldSerialVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Serial mới</span>
          <span class="v v-empty">—</span>
        </div>
        <div class="sos-cell">
          <span class="k">Diễn giải</span>
          <span class="v ${dienGiaiVal === '—' ? 'v-empty' : ''}">${esc(dienGiaiVal)}</span>
        </div>

        <div class="sos-cell">
          <span class="k">Ghi chú</span>
          <span class="v ${noteVal === '—' ? 'v-empty' : ''}">${esc(noteVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Lệnh BH</span>
          <span class="v ${bhCodeVal === '—' ? 'v-empty' : 'v-mono-esim'}">${esc(bhCodeVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">ĐXBH</span>
          <span class="v ${claimCodeVal === '—' ? 'v-empty' : 'v-mono-claim'}">${esc(claimCodeVal)}</span>
        </div>

        <div class="sos-cell">
          <span class="k">Số tiền</span>
          <span class="v ${amountVal === '—' ? 'v-empty' : 'v-money'}">${esc(amountVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Ngày đề xuất</span>
          <span class="v ${submittedVal === '—' ? 'v-empty' : ''}">${esc(submittedVal)}</span>
        </div>
        <div class="sos-cell">
          <span class="k">Ngày duyệt</span>
          <span class="v ${approvedVal === '—' ? 'v-empty' : ''}">${esc(approvedVal)}</span>
        </div>
      </div>
    </div>
  `;
}

// Chuẩn hóa Mã Lệnh sửa chữa (Work Order) sang đúng chuẩn VinFast Dealer Portal (ví dụ: N54511-WO-261024-0044)
function formatDealerPortalWo(rawWo, dmsRoCode, orderCode, workOrderNumber) {
  // 1. Explicit workOrderNumber từ Dealer Portal API
  if (workOrderNumber && String(workOrderNumber).includes('-WO-')) {
    return String(workOrderNumber).trim();
  }
  // 2. Explicit dms_ro_code (mã LSC Dealer Portal chính thức)
  if (dmsRoCode && String(dmsRoCode).includes('-WO-')) {
    return String(dmsRoCode).trim();
  }
  // 3. rawWo đã có -WO-
  if (rawWo && String(rawWo).includes('-WO-')) {
    return String(rawWo).trim();
  }
  // 4. Nếu mã ServiceOS dạng DEALER-YYMMDD-SEQ (ví dụ: N54511-261106-006 hoặc N54511-261104-008)
  // Chuyển đổi chính xác sang chuẩn VinFast Dealer Portal: DEALER-WO-YYMMDD-0000 (ví dụ: N54511-WO-261106-0006)
  const candidate = String(dmsRoCode || workOrderNumber || rawWo || orderCode || '').trim();
  const m = candidate.match(/^([A-Z0-9]+)-([0-9]{6})-([0-9]+)$/i);
  if (m) {
    const dealer = m[1].toUpperCase();
    const datePart = m[2];
    const seq = m[3].padStart(4, '0');
    return `${dealer}-WO-${datePart}-${seq}`;
  }
  const m2 = candidate.match(/^([A-Z0-9]+)[-_]?WO[-_]?([0-9]{6})[-_]?([0-9]+)$/i);
  if (m2) {
    const dealer = m2[1].toUpperCase();
    const datePart = m2[2];
    const seq = m2[3].padStart(4, '0');
    return `${dealer}-WO-${datePart}-${seq}`;
  }
  return candidate || '—';
}
window.formatDealerPortalWo = formatDealerPortalWo;

// Chuẩn hóa một bản ghi xe theo đúng chuẩn ServiceOS
function normalizeOrder(raw, i){
  const d = (raw && raw.work_order) ? raw.work_order : (raw || {});
  let rawWo = String(d.workOrderNumber || d.work_order_number || d.dms_ro_code || d.wo || d.code || d.work_order_code || '—').trim();
  let wo = formatDealerPortalWo(d.wo, d.dms_ro_code, d.code || d.work_order_code, d.workOrderNumber || d.work_order_number);
  const serviceOsCode = String(d.code || d.work_order_code || '').trim();
  let plate = String(d.plate || d.license_plate || d.licensePlate || d.bien_so || d.bienSo || '—').trim();
  let vin = String(d.vin || d.chassis_number || d.so_khung || '—').trim();
  let vehicle = String(d.vehicle || d.model || d.dong_xe || '—').trim();
  const customer = String(d.customer || d.customer_name || '—').trim();
  const tech = String(d.tech || d.technician_name || 'Chưa phân công').trim();
  let status = String(d.status || d.status_label || 'Trong xưởng').trim();
  let warrantyStatus = String(d.warrantyStatus || d.warranty_status || d.dms_warranty_status || '').trim();

  // Khôi phục Biển số nếu bị gán nhầm hoặc trống
  const plateRegex = /[0-9]{2}[A-Z][0-9A-Z]?[-.\s]?[0-9]{4,5}/i;
  if (plate === '—' || !plate) {
    const searchStr = `${wo} ${vin} ${customer} ${JSON.stringify(d)}`;
    const m = searchStr.match(plateRegex);
    if (m) plate = m[0].toUpperCase().replace(/\s+/g, '-');
  }

  // Lấy chính xác Lệnh bảo hành (dms_warranty_code) và Mã đề xuất (dms_claim_code)
  // LƯU Ý QUAN TRỌNG: dms_ro_code (lệnh sửa chữa WO) KHÔNG PHẢI là Lệnh bảo hành!
  let bhCode = String(d.bhCode || d.dms_warranty_code || d.bh_order_code || '').trim();
  let claimCode = String(d.claimCode || d.dms_claim_code || '').trim();

  // Chỉ nhận claimCode nếu có tiền tố WC- (mã đề xuất bảo hành)
  if (status.startsWith('WC-') || warrantyStatus.startsWith('WC-')) {
    if (!claimCode) claimCode = status.startsWith('WC-') ? status : warrantyStatus;
    status = 'Đã phê duyệt';
    warrantyStatus = 'approved';
  }

  // 1. HẠNG MỤC LỖI: Lấy chuẩn xác từ faults, warranty_kinds, linh kiện tháo thay hoặc chẩn đoán
  let faultList = Array.isArray(d.faults) 
    ? d.faults.filter(Boolean) 
    : (typeof d.faults === 'string' && d.faults.trim() ? [d.faults.trim()] : []);
  
  // Tự động bổ sung lỗi nếu ServiceOS chỉ tích warranty_kinds hoặc nhập serial linh kiện
  const kindsRaw = Array.isArray(d.warranty_kinds) ? d.warranty_kinds.filter(Boolean) : [];
  if (faultList.length === 0) {
    kindsRaw.forEach(k => {
      const kl = String(k).toLowerCase();
      if (kl === 'pin' || kl.includes('battery')) { if (!faultList.includes('Lỗi PIN')) faultList.push('Lỗi PIN'); }
      else if (kl === 'motor' || kl.includes('dong_co') || kl.includes('động cơ')) { if (!faultList.includes('Lỗi động cơ')) faultList.push('Lỗi động cơ'); }
      else if (kl === 'esim' || kl.includes('sim')) { if (!faultList.includes('Lỗi Esim')) faultList.push('Lỗi Esim'); }
      else if (kl.includes('front_shock') || kl.includes('giam_xoc_truoc')) { if (!faultList.includes('Lỗi giảm xóc trước')) faultList.push('Lỗi giảm xóc trước'); }
      else if (kl.includes('rear_shock') || kl.includes('giam_xoc_sau')) { if (!faultList.includes('Lỗi giảm xóc sau')) faultList.push('Lỗi giảm xóc sau'); }
      else if (kl.includes('topcover')) { if (!faultList.includes('Lỗi nút TopCover')) faultList.push('Lỗi nút TopCover'); }
      else if (kl) { faultList.push('Lỗi ' + k); }
    });
    
    // Kiểm tra serial PIN / ĐC hoặc trạng thái bảo hành linh kiện
    const hasBatInfo = Boolean(d.battery_serial_old || d.battery_serial || d.battery_repair_type || d.parts_removed_at || d.warranty_status === 'waiting_battery');
    const hasMotInfo = Boolean(d.motor_serial_old || d.motor_serial || d.motor_repair_type || d.motor_removed_at || d.warranty_status === 'waiting_motor');
    if (hasBatInfo && !faultList.some(f => f.toLowerCase().includes('pin'))) faultList.push('Lỗi PIN');
    if (hasMotInfo && !faultList.some(f => f.toLowerCase().includes('động cơ') || f.toLowerCase().includes('motor'))) faultList.push('Lỗi động cơ');

    // Kiểm tra diễn giải / triệu chứng (symptoms / diagnosis)
    const symLower = String(d.symptoms || d.diagnosis || '').toLowerCase();
    if (symLower.includes('lỗi pin') || symLower.includes('loi pin') || symLower.includes('thay pin')) {
      if (!faultList.some(f => f.toLowerCase().includes('pin'))) faultList.push('Lỗi PIN');
    }
    if (symLower.includes('lỗi động cơ') || symLower.includes('loi dong co') || symLower.includes('lỗi đc')) {
      if (!faultList.some(f => f.toLowerCase().includes('động cơ') || f.toLowerCase().includes('motor'))) faultList.push('Lỗi động cơ');
    }
    if (symLower.includes('lỗi esim') || symLower.includes('loi esim') || symLower.includes('mất sóng')) {
      if (!faultList.some(f => f.toLowerCase().includes('esim'))) faultList.push('Lỗi Esim');
    }
    if (symLower.includes('giảm xóc') || symLower.includes('phuộc')) {
      if (!faultList.some(f => f.toLowerCase().includes('giảm xóc'))) faultList.push('Lỗi giảm xóc trước');
    }
  }

  const hasLoi = faultList.length > 0;
  const category = matchCategoryFromFaults(faultList);

  // Nội dung kiểm tra (chẩn đoán)
  const rawDiag = String(d.diagnosis || d.symptoms || d.content || d.diag || '').trim();
  // Strip out full metadata strings that clutter the table
  const isNoisyDiag = rawDiag.includes('Biển số:') || rawDiag.includes('Số khung:') || rawDiag.includes('Số điện thoại:') || rawDiag.includes('Tài xế:') || rawDiag.includes('Họ và tên:');
  const issueDesc = isNoisyDiag ? '' : rawDiag;
  const issue = hasLoi ? faultList.join(', ') : 'Không lỗi';

  // 2. GHI CHÚ KTV
  const note = String(d.note || d.foreman_note || d.advisor_note || '').trim();
  const hasKtvNote = hasTextContent(note);

  // 3. BẢNG CẬP NHẬT PHÍA DƯỚI (LẤY ĐẦY ĐỦ LỆNH BẢO HÀNH, ĐXBH, CHI TIẾT ĐỀ XUẤT)
  let pinSerial = String(d.pinSerial || d.battery_serial_old || d.battery_serial || '').trim();
  const pinSerialNew = String(d.pinSerialNew || d.battery_serial_new || '').trim();
  let motorSerial = String(d.motorSerial || d.motor_serial_old || d.motor_serial || '').trim();
  const motorSerialNew = String(d.motorSerialNew || d.motor_serial_new || '').trim();
  const chargerSerial = '';
  
  if (pinSerial.includes('QR ngoài') || pinSerial.includes('DRT00011190')) pinSerial = '';
  if (motorSerial.includes('QR ngoài') || motorSerial.includes('DRT00011190')) motorSerial = '';

  const removedAt = String(d.removedAt || d.parts_removed_at || '').trim();
  const partsRemovedAt = String(d.parts_removed_at || '').trim();
  const motorRemovedAt = String(d.motor_removed_at || d.motorRemovedAt || '').trim();
  
  const bhOrderStatus = String(d.bhOrderStatus || d.dms_warranty_status || '').trim();
  const pinType = String(d.pinType || d.battery_repair_type || '').trim();
  const motorType = String(d.motorType || d.motor_repair_type || '').trim();
  const cocStatus = String(d.coc_status || d.cocStatus || '').trim();
  const sentFactoryAt = String(d.sent_factory_at || d.sentFactoryAt || '').trim();
  
  const kinds = Array.isArray(d.warranty_kinds) ? d.warranty_kinds.filter(Boolean) : [];
  const extra = (d.warranty_extra && typeof d.warranty_extra === 'object') ? d.warranty_extra : {};

  // Chi tiết phê duyệt ĐXBH (Dealer Portal Claims)
  let claimAmount = d.claimAmount || d.claim_amount || null;
  let claimSubmittedAt = d.claimSubmittedAt || d.claim_submitted_at || null;
  let claimApprovedAt = d.claimApprovedAt || d.claim_approved_at || null;
  let claimStatus = d.claimStatus || d.claim_status || '';

  // Trích xuất từ warranty_extra của từng loại linh kiện (pin, motor, esim...)
  ['pin', 'motor', 'esim', 'charger', 'topcover', 'rear_shock', 'front_shock'].forEach(k => {
    const row = extra[k];
    if (row && typeof row === 'object') {
      if (!motorSerial && (k === 'motor') && row.serial_old) motorSerial = row.serial_old;
      if (!pinSerial && (k === 'pin') && row.serial_old) pinSerial = row.serial_old;
      if (!bhCode && row.warranty_code) bhCode = String(row.warranty_code).trim();
      if (!claimCode && row.claim_code) claimCode = String(row.claim_code).trim();
      if (!claimAmount && row.claim_amount) claimAmount = row.claim_amount;
      if (!claimSubmittedAt && row.claim_submitted_at) claimSubmittedAt = row.claim_submitted_at;
      if (!claimApprovedAt && row.claim_approved_at) claimApprovedAt = row.claim_approved_at;
      if (!claimStatus && row.claim_status) claimStatus = row.claim_status;
    }
  });

  // Trích xuất từ mảng claims của Dealer Portal nếu có
  const dealerClaims = Array.isArray(d.dealer_claims) ? d.dealer_claims : (Array.isArray(d.claims) ? d.claims : []);
  if (dealerClaims.length > 0) {
    const c0 = dealerClaims[0];
    if (!bhCode && c0.work_order) bhCode = String(c0.work_order).trim();
    if (!claimCode && (c0.number || c0.claim_code || c0.code)) claimCode = String(c0.number || c0.claim_code || c0.code).trim();
    if (!claimAmount && c0.amount != null) claimAmount = c0.amount;
    if (!claimSubmittedAt && (c0.submitted_at || c0.created_at)) claimSubmittedAt = c0.submitted_at || c0.created_at;
    if (!claimApprovedAt && c0.approved_at) claimApprovedAt = c0.approved_at;
    if (!claimStatus && c0.status) claimStatus = c0.status;
  }

  // Tra cứu tự động từ bộ nhớ đề xuất Dealer Portal (window.DEALER_CLAIMS_MAP) qua VIN và Lệnh sửa chữa
  let matchedClaim = null;
  if (window.DEALER_CLAIMS_MAP && window.DEALER_CLAIMS_MAP.size > 0) {
    const cVin = String(vin).trim().toUpperCase();
    const cWo = String(wo).trim().toUpperCase();
    const cRo = String(d.dms_ro_code || '').trim().toUpperCase();
    const cCode = String(d.code || '').trim().toUpperCase();
    matchedClaim = window.DEALER_CLAIMS_MAP.get(cVin) ||
                         (cVin.length >= 6 ? window.DEALER_CLAIMS_MAP.get(cVin.slice(-6)) : null) ||
                         (cRo ? window.DEALER_CLAIMS_MAP.get(cRo) : null) ||
                         window.DEALER_CLAIMS_MAP.get(cWo) ||
                         (cCode ? window.DEALER_CLAIMS_MAP.get(cCode) : null);
    if (matchedClaim) {
      if (matchedClaim.workOrderNumber) {
        wo = formatDealerPortalWo(matchedClaim.workOrderNumber, d.dms_ro_code, d.code);
      }
      if (!bhCode || bhCode === '—') bhCode = String(matchedClaim.workOrderNumber || matchedClaim.work_order || '').trim();
      if (!claimCode || claimCode === '—') claimCode = String(matchedClaim.warrantyClaimNumber || matchedClaim.number || matchedClaim.claim_code || '').trim();
      if (!claimAmount && matchedClaim.totalRequestedAmountInclTax != null) claimAmount = matchedClaim.totalRequestedAmountInclTax;
      if (!claimSubmittedAt && (matchedClaim.createdAt || matchedClaim.submitted_at)) claimSubmittedAt = matchedClaim.createdAt || matchedClaim.submitted_at;
      if (!claimApprovedAt && (matchedClaim.approvedDate || matchedClaim.approved_at)) claimApprovedAt = matchedClaim.approvedDate || matchedClaim.approved_at;
      if (!claimStatus && matchedClaim.status) claimStatus = matchedClaim.status;
    }
  }

  // Điều kiện xác định xe ĐÃ CÓ BẢNG CẬP NHẬT LINH KIỆN (chuẩn xác toàn diện ServiceOS):
  // 1. Có gắn loại bảo hành (PIN, Động cơ, Giảm xóc trước/sau, TopCover, Esim, Sạc, MCU...)
  const hasWarrantyKinds = Array.isArray(d.warranty_kinds) && d.warranty_kinds.filter(Boolean).length > 0;

  // 2. Có dữ liệu trong warranty_extra của bất kỳ linh kiện nào (serial, diễn giải, ghi chú, mã bảo hành, hình thức...)
  const hasWarrantyExtra = Boolean(extra && typeof extra === 'object' && Object.keys(extra).some(k => {
    const obj = extra[k];
    if (!obj || typeof obj !== 'object') return false;
    return Boolean(
      obj.serial_old || obj.serial_new || obj.dien_giai || 
      obj.warranty_code || obj.claim_code || obj.status || 
      obj.note || obj.repair_type || obj.coc_status || 
      obj.fault_at || obj.removed_at || obj.claim_amount
    );
  }));

  // 3. Có số Serial / Số máy linh kiện cũ hoặc mới
  const hasPartSerial = Boolean(
    motorSerial || motorSerialNew || pinSerial || pinSerialNew || 
    d.battery_serial_old || d.battery_serial_new || 
    d.motor_serial_old || d.motor_serial_new
  );

  // 4. Có ngày tháo linh kiện / ngày gửi nhà máy
  const hasRemovedDate = Boolean(
    motorRemovedAt || partsRemovedAt || sentFactoryAt || removedAt || 
    d.motor_removed_at || d.parts_removed_at || d.sent_factory_at
  );

  // 5. Có Lệnh bảo hành hoặc Mã đề xuất bảo hành (WC-...)
  const hasWarrantyDoc = Boolean(
    (bhCode && bhCode !== '—' && bhCode !== '-') || 
    (claimCode && claimCode !== '—' && claimCode !== '-') ||
    d.dms_warranty_code || d.dms_claim_code || d.dms_ro_code
  );

  // 6. Có trạng thái bảo hành linh kiện, hình thức sửa chữa hoặc trạng thái xuất kho
  const hasPartStatus = Boolean(
    (warrantyStatus && warrantyStatus !== 'none' && warrantyStatus !== 'Trong xưởng' && warrantyStatus !== '—') || 
    (bhOrderStatus && bhOrderStatus !== 'none' && bhOrderStatus !== '—') ||
    d.battery_repair_type || d.motor_repair_type || d.coc_status ||
    (d.parts_status && d.parts_status !== 'pending')
  );

  // 7. Nhận diện từ file Excel / dữ liệu dán có nội dung cột Bảng cập nhật
  const rawBangCapNhatText = String(d.hasBangCapNhatText || d.bang_cap_nhat || d['Bảng cập nhật phía dưới'] || '').trim();
  const hasTableText = Boolean(rawBangCapNhatText && rawBangCapNhatText !== '—' && rawBangCapNhatText !== '-' && !rawBangCapNhatText.toLowerCase().includes('chưa có bảng'));

  // Xe ĐÃ CÓ BẢNG CẬP NHẬT nếu thỏa mãn bất kỳ dấu hiệu bảo hành nào ở trên
  const hasBangCapNhat = Boolean(
    hasWarrantyKinds ||
    hasWarrantyExtra ||
    hasPartSerial ||
    hasRemovedDate ||
    hasWarrantyDoc ||
    hasPartStatus ||
    hasTableText
  );

  // Tính trạng thái Check theo 4 quy tắc
  const checkStatus = evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat);

  // ĐÁNH GIÁ CHÍNH XÁC PHÂN LOẠI THANH TOÁN (Từ Mục Công việc, Mục Vật tư/Phụ tùng của Lệnh sửa chữa)
  // Quy chuẩn Dealer Portal & ServiceOS: Một lệnh sửa chữa CHỈ LÀ BẢO HÀNH khi CÓ ÍT NHẤT MỘT MỤC CÔNG VIỆC hoặc PHỤ TÙNG
  // có Phân loại thanh toán là "BẢO HÀNH". Nếu toàn bộ là Khách hàng -> 100% là lệnh Khách hàng!
  const lineItems = Array.isArray(d.line_items) ? d.line_items : (Array.isArray(d.lineItems) ? d.lineItems : (Array.isArray(d.jobs) ? d.jobs : (Array.isArray(d.laborLineItems) ? d.laborLineItems : [])));
  const partItems = Array.isArray(d.part_line_items) ? d.part_line_items : (Array.isArray(d.partLineItems) ? d.partLineItems : (Array.isArray(d.parts) ? d.parts : (Array.isArray(d.partItems) ? d.partItems : [])));
  
  let hasWarrantyLineItem = false;
  let hasCustomerLineItem = false;
  const allSubItems = [...lineItems, ...partItems];
  
  allSubItems.forEach(item => {
    if (!item) return;
    const pt = norm(String(
      item.paymentClassification || item.payment_classification ||
      item.paymentType || item.payment_type ||
      item.settlementType || item.settlement_type ||
      item.classification || item.type || ''
    ));
    if (pt.includes('bao hanh') || pt === 'bh' || pt.includes('warranty') || pt.includes('vinfast') || pt.includes('factory')) {
      hasWarrantyLineItem = true;
    } else if (pt.includes('khach') || pt.includes('customer') || pt.includes('retail') || pt.includes('paid') || pt.includes('tu tra')) {
      hasCustomerLineItem = true;
    }
  });

  let isWarrantyPayment = false;
  let phanLoaiTt = 'Khách hàng';

  // 1. Nếu đã có chi tiết dòng công việc hoặc vật tư: Căn cứ 100% vào phân loại thanh toán của các dòng đó
  if (allSubItems.length > 0) {
    if (hasWarrantyLineItem) {
      isWarrantyPayment = true;
      phanLoaiTt = 'Bảo hành';
    } else {
      isWarrantyPayment = false;
      phanLoaiTt = 'Khách hàng';
    }
  } else {
    // 2. Khi chưa tải chi tiết từng dòng công việc/vật tư:
    // TUYỆT ĐỐI KHÔNG tự tiện coi là Bảo hành nếu chỉ dựa vào service_type!
    // Hầu hết các lệnh tại xưởng là Khách hàng. Chỉ coi là Bảo hành khi có hồ sơ bảo hành rõ ràng:
    const hasCustPay = Number(d.cust_pay_amount || d.custPayAmount || 0) > 0 || Boolean(d.cust_pay_ro);
    const hasExplicitWarrantyCode = Boolean(
      (bhCode && bhCode !== '—' && !bhCode.includes('WO-')) || 
      (d.dms_warranty_code && !d.dms_warranty_code.includes('WO-')) ||
      (claimCode && claimCode.startsWith('WC-'))
    );

    // Nếu có thanh toán khách hàng (cust_pay_amount) hoặc ghi chú Khách trả -> 100% Khách hàng
    if (hasCustPay) {
      isWarrantyPayment = false;
      phanLoaiTt = 'Khách hàng';
    } else if (hasExplicitWarrantyCode) {
      isWarrantyPayment = true;
      phanLoaiTt = 'Bảo hành';
    } else {
      isWarrantyPayment = false;
      phanLoaiTt = 'Khách hàng';
    }
  }

  // ĐIỀU KIỆN CHÍNH XÁC: Xe PHẢI có lỗi hoặc linh kiện tháo thay bảo hành thực tế
  // Tuyệt đối KHÔNG tính các xe "Không lỗi" (chỉ trả cọc, thanh lý, bảo dưỡng)
  const hasActualWarrantyWork = Boolean(
    (hasLoi && faultList.length > 0) || 
    hasBangCapNhat || 
    Boolean(bhCode && bhCode !== '—') ||
    kindsRaw.length > 0
  );

  // Nếu xe "Không lỗi" hoặc không có bảo hành -> Không phát sinh đề xuất
  if (!hasActualWarrantyWork || !isWarrantyPayment) {
    if (!hasActualWarrantyWork) phanLoaiTt = 'Không phát sinh BH';
    isWarrantyPayment = false;
  }

  const isSettled = isSettledOrHigher(status, d);
  // Lệnh chưa làm ĐXBH: Phải ĐÍCH THỰC có Phân loại TT là Bảo hành VÀ từ Quyết toán trở lên VÀ chưa có mã ĐX (WC-...)
  const isUnsubmittedWarranty = isWarrantyPayment && hasActualWarrantyWork && isSettled && (!claimCode || claimCode === '—' || !claimCode.startsWith('WC-'));

  // Nhóm khách hàng (Ưu tiên GSM, BSHIP từ source/fleet/note của ServiceOS & Dealer Portal)
  const matchedCustName = (matchedClaim && matchedClaim.customer && matchedClaim.customer.customerName) || '';
  const matchedCompName = (matchedClaim && matchedClaim.customer && matchedClaim.customer.customerCompanyName) || '';
  const custGroup = getCustomerGroup(
    customer || matchedCustName, 
    d.customerCompanyName || matchedCompName, 
    { source: d.source, fleet: d.fleet, note: d.advisor_note || d.foreman_note || d.symptoms }
  );

  // Chuẩn hóa ngày nhận xe
  const rawDate = d.dateStr || d.received_at || d.created_at || new Date().toISOString().slice(0, 10);
  const isoDate = formatIsoDate(rawDate) || new Date().toISOString().slice(0, 10);
  const dispDate = formatDisplayDate(isoDate);

  const order = {
    customerCompanyName: d.customerCompanyName || matchedCompName,
    customerGroup: custGroup,
    phanLoaiTt: phanLoaiTt,
    isWarrantyPayment: isWarrantyPayment,
    isSettled: isSettled,
    isUnsubmittedWarranty: isUnsubmittedWarranty,
    id: (d && d.id) || ('ord_' + (wo || plate || i).replace(/[^a-zA-Z0-9]/g, '') + '_' + i),
    wo: wo,
    dealerWo: wo,
    serviceOsCode: serviceOsCode,
    plate: plate,
    vin: vin,
    vehicle: vehicle,
    customer: customer,
    tech: tech,
    issue: issue,
    issueDesc: issueDesc,
    faultList: faultList,
    faultStr: faultList.join(', '),
    note: note,
    status: status,
    warrantyStatus: warrantyStatus,
    pinSerial: pinSerial,
    pinSerialNew: pinSerialNew,
    motorSerial: motorSerial,
    motorSerialNew: motorSerialNew,
    chargerSerial: chargerSerial,
    removedAt: removedAt,
    partsRemovedAt: partsRemovedAt,
    motorRemovedAt: motorRemovedAt,
    pinType: pinType,
    motorType: motorType,
    cocStatus: cocStatus,
    sentFactoryAt: sentFactoryAt,
    bhCode: bhCode,
    claimCode: claimCode,
    bhOrderStatus: bhOrderStatus,
    kinds: kinds,
    extra: extra,
    hasLoi: hasLoi,
    hasKtvNote: hasKtvNote,
    hasBangCapNhat: hasBangCapNhat,
    checkStatus: checkStatus,
    category: category,
    dateStr: dispDate,
    isoDate: isoDate,
    isChecked: checkStatus.code === 'checked',
    // Các trường dữ liệu chi tiết cho chế độ Cột chi tiết:
    // Nếu KHÔNG CÓ BẢNG CẬP NHẬT thì không điền gì vào đó hết (để trống '—')
    partStatusText: hasBangCapNhat ? formatPartStatusText(bhOrderStatus || warrantyStatus, (kinds && kinds[0]) || '') : '—',
    partSerialText: hasBangCapNhat ? ((motorSerial || pinSerial) || '—') : '—',
    partRemovedDateText: hasBangCapNhat ? (motorRemovedAt ? formatDisplayDate(motorRemovedAt) : (partsRemovedAt ? formatDisplayDate(partsRemovedAt) : '—')) : '—',
    bhCodeText: hasBangCapNhat ? (bhCode || '—') : '—',
    claimCodeText: hasBangCapNhat ? (claimCode || '—') : '—',
    claimAmount: claimAmount,
    claimSubmittedAt: claimSubmittedAt,
    claimApprovedAt: claimApprovedAt,
    claimStatus: claimStatus
  };

  return order;
}
window.normalizeOrder = normalizeOrder;

const DEALER_PORTAL_PRELOAD_CLAIMS = [{"id": "324b7a94-eb14-4f35-a7e8-6bbde42f36ff", "warrantyClaimNumber": "WC-N54511-26-11-05-50-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-05T11:40:50.336Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-05T11:45:05.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261024-0044", "approvedDate": "2026-11-05T11:45:04.915Z", "totalRequestedAmountInclTax": 191269, "vin": "RPXN4LHHVRE028708", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "ef1f8271-c0c7-4bd1-a22e-11b09f0d5869", "warrantyClaimNumber": "WC-N54511-26-11-05-41-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-05T11:31:41.879Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-05T11:45:06.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261028-0015", "approvedDate": "2026-11-05T11:45:05.571Z", "totalRequestedAmountInclTax": 191269, "vin": "RPXN4LHHVRE028738", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "bed896ca-b72e-4429-af4b-104f097b2045", "warrantyClaimNumber": "WC-N54511-26-11-05-46-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-05T11:27:46.235Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-05T11:45:07.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261028-0016", "approvedDate": "2026-11-05T11:45:06.649Z", "totalRequestedAmountInclTax": 191269, "vin": "RPXN4LHHVPE020083", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "415741f5-d727-4820-9c74-759c0aec1e7e", "warrantyClaimNumber": "WC-N54511-26-11-05-55-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-05T11:18:55.453Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-05T11:45:08.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261028-0008", "approvedDate": "2026-11-05T11:45:07.797Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVSE011599", "customer": {"customerId": "7098fb42-cfd4-43f1-b6ab-f71f138b5b81", "customerName": "Nguyễn Thị Ngọc Hiếu", "customerCompanyName": null, "customerPhone": "0907443119", "customerEmail": "NULL@GMAIL.COM", "customerAddress": "27 NGUYỄN THỊ KIỂU"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "889f6101-38a2-477c-8908-babdfef348af", "warrantyClaimNumber": "WC-N54511-26-11-05-45-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-05T08:10:45.196Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-05T11:45:41.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261027-0018", "approvedDate": "2026-11-05T11:45:40.559Z", "totalRequestedAmountInclTax": 191269, "vin": "RPXN4LHHVRE033623", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "31237493-f39b-4d8d-932e-a2e214eed1da", "warrantyClaimNumber": "WC-N54511-26-11-05-30-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "N54511-XDV Vinfast 2S CarOn Thới An", "createdAt": "2026-11-05T07:34:30.713Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-05T11:45:19.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261024-0015", "approvedDate": "2026-11-05T11:45:18.580Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVSE035586", "customer": {"customerId": "64617637-a823-4d39-ab8b-6f9999f6044d", "customerName": "Nhan Mộng Sương", "customerCompanyName": null, "customerPhone": "0937555209", "customerEmail": "duysky939005@gmail.com", "customerAddress": "25/4 ấp 21 xã đông thạnh"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "c9349109-b014-49a9-8c21-3f53943010f6", "warrantyClaimNumber": "WC-N54511-26-11-04-45-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-04T10:03:45.950Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-04T10:05:34.000Z", "status": "PENDING_LEVEL_2_APPROVAL", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0046", "approvedDate": null, "totalRequestedAmountInclTax": 1883919, "vin": "RPXN4LHHVPE042163", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "e5d2dee7-64bf-436c-a466-0021bc1a048c", "warrantyClaimNumber": "WC-N54511-26-11-04-31-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-04T10:00:31.249Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-04T10:05:39.000Z", "status": "PENDING_LEVEL_2_APPROVAL", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0045", "approvedDate": null, "totalRequestedAmountInclTax": 1883919, "vin": "RPXN4LHHVPE039339", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "7d9f8362-3d68-481d-8702-d9f8872f8b4d", "warrantyClaimNumber": "WC-N54511-26-11-04-28-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-04T09:28:28.924Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-04T09:36:36.000Z", "status": "PENDING_LEVEL_2_APPROVAL", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261104-0016", "approvedDate": null, "totalRequestedAmountInclTax": 2504469, "vin": "RPXN4LHHVRE028938", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "967dc222-7c41-490f-9817-738c5a24c641", "warrantyClaimNumber": "WC-N54511-26-11-04-39-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-04T03:22:39.374Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-04T09:36:38.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261006-0037", "approvedDate": "2026-11-04T09:36:38.274Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVPE064629", "customer": {"customerId": "ad07fe35-0a75-4331-8536-f4295c4e5df0", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "0bb95edf-ef3f-49c8-add3-0e3ade7db3c0", "warrantyClaimNumber": "WC-N54511-26-11-04-47-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-04T03:17:47.826Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-04T09:36:39.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261006-0035", "approvedDate": "2026-11-04T09:36:38.806Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVPE056732", "customer": {"customerId": "ad07fe35-0a75-4331-8536-f4295c4e5df0", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "21feaeeb-bf09-4a25-947b-ff5fa957a2bc", "warrantyClaimNumber": "WC-N54511-26-11-04-03-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-04T03:13:03.705Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-04T03:16:04.000Z", "status": "PENDING_LEVEL_2_APPROVAL", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261104-0004", "approvedDate": null, "totalRequestedAmountInclTax": 2504469, "vin": "RPXN4LHHVRE024604", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "f6038669-4744-422e-b516-52f645a71005", "warrantyClaimNumber": "WC-N54511-26-11-04-26-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-04T02:26:26.529Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-04T03:11:58.000Z", "status": "PENDING_LEVEL_2_APPROVAL", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0043", "approvedDate": null, "totalRequestedAmountInclTax": 1883919, "vin": "RPXN4LHHVPE037692", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "fb592a3c-de0f-4371-8724-748123d71ebc", "warrantyClaimNumber": "WC-N54511-26-11-04-46-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-04T01:41:46.667Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-04T02:07:37.000Z", "status": "PENDING_LEVEL_2_APPROVAL", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0041", "approvedDate": null, "totalRequestedAmountInclTax": 1883919, "vin": "RPXN4LHHVPE039470", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "fa6a6ad1-4ab3-4b2c-aae8-504f02e5efaf", "warrantyClaimNumber": "WC-N54511-26-11-03-52-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-03T10:17:52.179Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-05T08:25:24.428Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0037", "approvedDate": "2026-11-05T08:25:24.417Z", "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE052034", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "8762db4b-fbe5-40d3-853e-efa80f8631ab", "warrantyClaimNumber": "WC-N54511-26-11-03-50-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-03T10:03:50.661Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-05T08:25:24.157Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0042", "approvedDate": "2026-11-05T08:25:24.141Z", "totalRequestedAmountInclTax": 1883919, "vin": "RPXN4LHHVPE037976", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "65af6203-f522-415e-a345-2c7f69a20d67", "warrantyClaimNumber": "WC-N54511-26-11-03-59-0002", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-03T09:15:59.859Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-05T08:25:24.248Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261023-0018", "approvedDate": "2026-11-05T08:25:24.239Z", "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE061560", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "a3d2b45f-db05-4d88-9af0-70ae867539d9", "warrantyClaimNumber": "WC-N54511-26-11-03-37-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-03T08:57:37.593Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-03T10:09:15.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261102-0016", "approvedDate": "2026-11-03T10:09:14.665Z", "totalRequestedAmountInclTax": 667176, "vin": "RPXP1LHHVPE061760", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "71dfa279-fe83-4045-97f9-9c309f5210eb", "warrantyClaimNumber": "WC-N54511-26-11-03-22-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-03T08:39:22.650Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-05T08:25:24.330Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261103-0014", "approvedDate": "2026-11-05T08:25:24.324Z", "totalRequestedAmountInclTax": 2504469, "vin": "RPXP1LHHVPE058907", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "96a4aa86-90a6-4a53-a8da-ea883e8fd8c5", "warrantyClaimNumber": "WC-N54511-26-11-03-20-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-03T08:16:20.884Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-05T08:25:23.499Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261023-0023", "approvedDate": "2026-11-05T08:25:23.481Z", "totalRequestedAmountInclTax": 1883919, "vin": "RPXN4LHHVPE031757", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "a774516f-0868-449d-8731-a213a44d0c03", "warrantyClaimNumber": "WC-N54511-26-11-03-25-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-03T06:19:25.594Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-05T08:25:23.626Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0044", "approvedDate": "2026-11-05T08:25:23.585Z", "totalRequestedAmountInclTax": 1883919, "vin": "RPXN4LHHVPE037504", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "791bd700-5849-4ce9-9744-a9589fbf9d7c", "warrantyClaimNumber": "WC-N54511-26-11-03-02-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-03T06:13:02.327Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-05T08:25:23.744Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261023-0019", "approvedDate": "2026-11-05T08:25:23.714Z", "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE040972", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "9a65240a-5e08-4122-86ef-a12b79d50d91", "warrantyClaimNumber": "WC-N54511-26-11-03-57-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-03T06:07:57.464Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-05T08:25:23.868Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261023-0020", "approvedDate": "2026-11-05T08:25:23.838Z", "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE049343", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "4fb5f42e-0bab-490f-bf59-fdedcccc4035", "warrantyClaimNumber": "WC-N54511-26-11-03-59-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-03T03:00:59.999Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-03T08:46:18.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261006-0034", "approvedDate": "2026-11-03T08:46:17.571Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVRE007433", "customer": {"customerId": "ad07fe35-0a75-4331-8536-f4295c4e5df0", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "a5d4baf4-d933-4e44-bcb8-1ab3f6ce1e8c", "warrantyClaimNumber": "WC-N54511-26-11-03-45-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-03T02:54:45.199Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-03T08:46:25.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261026-0007", "approvedDate": "2026-11-03T08:46:24.621Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP2LHLVRE021714", "customer": {"customerId": "c8506484-f6f7-4606-8a5c-b88ec98e7cea", "customerName": "Lâm Thanh Trúc Phương", "customerCompanyName": null, "customerPhone": "0779780092", "customerEmail": "null@gmail.com.vn", "customerAddress": "PHƯỜNG THỚI AN"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "725801d4-01e4-4066-8168-b3ce015db584", "warrantyClaimNumber": "WC-N54511-26-11-02-55-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-02T11:24:55.076Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-04T09:04:04.616Z", "status": "CANCELLED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": "Ktra lại số km, lần BD gần nhất ghi nhận 100K", "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0046", "approvedDate": null, "totalRequestedAmountInclTax": 1883919, "vin": "RPXN4LHHVPE042163", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "1ccda65a-be92-4f5e-b427-e5303627784d", "warrantyClaimNumber": "WC-N54511-26-11-02-27-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 5, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-02T11:17:27.693Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-04T09:58:54.000Z", "status": "CANCELLED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": ",", "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0045", "approvedDate": null, "totalRequestedAmountInclTax": 1883919, "vin": "RPXN4LHHVPE039339", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "f365d759-9d0f-4fa8-8061-df360dfc107f", "warrantyClaimNumber": "WC-N54511-26-11-02-33-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-02T10:59:33.096Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-04T09:01:32.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261102-0005", "approvedDate": "2026-11-04T09:01:32.366Z", "totalRequestedAmountInclTax": 2504469, "vin": "RPXN4LHHVRE035369", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "9c321bc2-6687-49e4-97a2-ea068a692c26", "warrantyClaimNumber": "WC-N54511-26-11-02-15-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-02T10:51:15.715Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-02T11:29:22.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261102-0006", "approvedDate": "2026-11-02T11:29:22.206Z", "totalRequestedAmountInclTax": 1069836, "vin": "RPXP1LHHVPE060588", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "e01cb380-be0f-4db2-accd-9b443c69ce47", "warrantyClaimNumber": "WC-N54511-26-11-02-12-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-02T07:15:12.936Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-02T11:29:22.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261023-0014", "approvedDate": "2026-11-02T11:29:22.211Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVPE040349", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "2ab672f7-ef86-4bf2-98fb-39524fd7e14c", "warrantyClaimNumber": "WC-N54511-26-11-01-17-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-01T10:18:17.668Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-01T10:21:55.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261028-0017", "approvedDate": "2026-11-01T10:21:55.289Z", "totalRequestedAmountInclTax": 1273770, "vin": "RPXN4LHHVRE024008", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "4d7719da-c7dd-4ef2-8330-2bd56ae91d16", "warrantyClaimNumber": "WC-N54511-26-11-01-38-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-01T10:15:38.311Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-01T10:21:56.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261021-0051", "approvedDate": "2026-11-01T10:21:56.163Z", "totalRequestedAmountInclTax": 1232783, "vin": "RPXP1LHHVPE057596", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "d50a5d47-3ce0-41a4-b96c-02c83ca0d3a0", "warrantyClaimNumber": "WC-N54511-26-11-01-29-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-01T09:20:29.857Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-01T10:21:57.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261021-0052", "approvedDate": "2026-11-01T10:21:56.733Z", "totalRequestedAmountInclTax": 1232783, "vin": "RPXP1LHHVPE059731", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "d67d7521-a769-4a0e-a307-275189fb8e2d", "warrantyClaimNumber": "WC-N54511-26-11-01-08-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-01T09:16:08.309Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-01T10:21:58.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261021-0050", "approvedDate": "2026-11-01T10:21:57.772Z", "totalRequestedAmountInclTax": 1232783, "vin": "RPXP1LHHVPE064856", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "10d5d991-c865-4e9d-ade6-bd477ccab56d", "warrantyClaimNumber": "WC-N54511-26-11-01-40-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-11-01T09:03:40.954Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-01T10:21:59.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261030-0003", "approvedDate": "2026-11-01T10:21:59.078Z", "totalRequestedAmountInclTax": 1266268, "vin": "RPXU2LHHVTE130958", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0926223232", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "8e6e12b5-358c-400c-acdf-3c3e54e0194e", "warrantyClaimNumber": "WC-N54511-26-10-31-56-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-31T14:07:56.326Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-31T14:12:55.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261015-0013", "approvedDate": "2026-10-31T14:12:54.865Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVPE063334", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "2a4086db-60ae-483b-bc6b-42704eadc0d8", "warrantyClaimNumber": "WC-N54511-26-10-31-15-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-31T14:05:15.826Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-31T14:12:56.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261015-0012", "approvedDate": "2026-10-31T14:12:55.866Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVPE065567", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "6dcc606a-fb3a-4891-a896-deafae461230", "warrantyClaimNumber": "WC-N54511-26-10-31-17-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-31T14:02:17.787Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-31T14:13:00.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261015-0011", "approvedDate": "2026-10-31T14:12:59.809Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVPE057263", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "37324b2c-5a78-4595-b894-2c024e977ffd", "warrantyClaimNumber": "WC-N54511-26-10-31-58-0002", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-31T13:55:58.397Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-31T14:13:01.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261015-0009", "approvedDate": "2026-10-31T14:13:00.571Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVPE064685", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "b8e4e8c8-7ef8-49aa-aa6b-85ff4e8faf06", "warrantyClaimNumber": "WC-N54511-26-10-31-30-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-31T13:46:30.781Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-03T07:54:34.665Z", "status": "CANCELLED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": "xe có LS reset ODO, XDV điền lại số km", "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0037", "approvedDate": null, "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE052034", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "66590716-fb01-4f37-a474-71e4d6c9bd0a", "warrantyClaimNumber": "WC-N54511-26-10-31-49-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-31T13:43:49.290Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-03T07:48:36.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0035", "approvedDate": "2026-11-03T07:48:36.419Z", "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE049740", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "48e1e9b6-d024-4f1c-b28b-1e8f4937dfda", "warrantyClaimNumber": "WC-N54511-26-10-31-58-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-31T13:40:58.081Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-03T07:48:37.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0034", "approvedDate": "2026-11-03T07:48:36.501Z", "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE054681", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "1e65b9d9-d527-42c8-91ea-13f8b4b8d7a9", "warrantyClaimNumber": "WC-N54511-26-10-31-16-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-31T13:38:16.381Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-03T07:48:37.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0033", "approvedDate": "2026-11-03T07:48:36.595Z", "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE065924", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "61b4763f-9178-4020-b8c7-c75db4778648", "warrantyClaimNumber": "WC-N54511-26-10-31-39-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-31T13:35:39.816Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-03T07:48:37.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0032", "approvedDate": "2026-11-03T07:48:36.674Z", "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE037738", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "c62a77d3-9c68-4a32-9eea-d536a5b6b002", "warrantyClaimNumber": "WC-N54511-26-10-31-32-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 5, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-31T13:32:32.323Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-11-04T02:07:39.000Z", "status": "PENDING_LEVEL_2_APPROVAL", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0030", "approvedDate": null, "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE038132", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "7587b092-e2e1-4643-9b49-5578d3b392f2", "warrantyClaimNumber": "WC-N54511-26-10-31-11-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-31T13:23:11.524Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-03T07:48:37.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0029", "approvedDate": "2026-11-03T07:48:36.764Z", "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE062181", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "913aed17-0607-4032-a6a9-bf6a52b7a92f", "warrantyClaimNumber": "WC-N54511-26-10-30-40-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T10:07:40.572Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-01T09:11:13.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0036", "approvedDate": "2026-11-01T09:11:12.661Z", "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE058385", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "b6f8bbe6-642f-4cdb-b1ad-2b7ffc0c76a4", "warrantyClaimNumber": "WC-N54511-26-10-30-50-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T10:01:50.149Z", "approverName": "TUNGVD9", "updatedAt": "2026-11-01T09:11:13.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261019-0031", "approvedDate": "2026-11-01T09:11:12.735Z", "totalRequestedAmountInclTax": 1851478, "vin": "RPXP1LHHVPE065447", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "764d3c57-a4d5-4ea3-a2cd-ded3178e4e47", "warrantyClaimNumber": "WC-N54511-26-10-30-02-0002", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T09:53:02.573Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-30T10:12:47.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261021-0049", "approvedDate": "2026-10-30T10:12:46.731Z", "totalRequestedAmountInclTax": 1232783, "vin": "RPXP1LHHVPE051556", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "6ec41761-01b0-4f7a-b6de-630069fdfb9d", "warrantyClaimNumber": "WC-N54511-26-10-30-33-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T07:33:33.704Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-30T10:12:48.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0013", "approvedDate": "2026-10-30T10:12:47.498Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE048388", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "d1ac741c-b372-4fa0-9fda-3364deddda6c", "warrantyClaimNumber": "WC-N54511-26-10-30-31-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T06:46:31.635Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-30T10:12:49.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261015-0035", "approvedDate": "2026-10-30T10:12:48.505Z", "totalRequestedAmountInclTax": 191268, "vin": "RPXN4LHHVRE031147", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY CỔ PHẦNCÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "e3da75e2-73ec-4674-8a63-18659871a838", "warrantyClaimNumber": "WC-N54511-26-10-30-02-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T04:28:02.927Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-30T10:12:50.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0037", "approvedDate": "2026-10-30T10:12:50.215Z", "totalRequestedAmountInclTax": 191268, "vin": "RPXN4LHHVPE068335", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY CỔ PHẦNCÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "7a084cbf-dcce-44d6-926e-b9d95645fdd9", "warrantyClaimNumber": "WC-N54511-26-10-30-54-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T01:37:54.937Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-30T01:43:13.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0031", "approvedDate": "2026-10-30T01:43:12.942Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE049509", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "03151016-623f-4013-8f24-dcf7899d1ae9", "warrantyClaimNumber": "WC-N54511-26-10-30-13-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T01:33:13.270Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-30T01:43:15.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0023", "approvedDate": "2026-10-30T01:43:15.007Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE048114", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "79db9184-260d-4723-a30d-86a1839480a0", "warrantyClaimNumber": "WC-N54511-26-10-30-34-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T01:28:34.798Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-30T01:43:15.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0024", "approvedDate": "2026-10-30T01:43:15.372Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE057302", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "53598c58-4031-43c3-ad6c-deb1bc72e322", "warrantyClaimNumber": "WC-N54511-26-10-30-32-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T01:24:32.502Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-30T01:43:16.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0027", "approvedDate": "2026-10-30T01:43:15.895Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE063208", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "153b9d28-f9f8-4155-88bb-dd3cbb60fb65", "warrantyClaimNumber": "WC-N54511-26-10-30-29-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T01:20:29.624Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-30T01:43:47.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0014", "approvedDate": "2026-10-30T01:43:46.880Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE065026", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "65708ef7-3d99-4e0c-af4f-0fb657e32dc6", "warrantyClaimNumber": "WC-N54511-26-10-30-14-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T00:56:14.268Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-30T01:43:16.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0015", "approvedDate": "2026-10-30T01:43:16.320Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE050340", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "83a44efb-9b5e-494c-9e12-4f7f1d493f54", "warrantyClaimNumber": "WC-N54511-26-10-30-21-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-30T00:52:21.956Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-30T01:43:17.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0011", "approvedDate": "2026-10-30T01:43:17.060Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE062485", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "a68425e0-83ea-462e-81ab-f394a14694b1", "warrantyClaimNumber": "WC-N54511-26-10-29-39-0002", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T11:43:39.863Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:23.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0026", "approvedDate": "2026-10-29T12:00:23.471Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE059351", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "2e0ac984-7c40-4d6c-a257-9d5dadb73de1", "warrantyClaimNumber": "WC-N54511-26-10-29-27-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T11:38:27.666Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:26.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0025", "approvedDate": "2026-10-29T12:00:26.482Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE061153", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "43e5e348-67e6-4408-9b6d-7085237f330f", "warrantyClaimNumber": "WC-N54511-26-10-29-29-0002", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T11:33:29.297Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:29.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0017", "approvedDate": "2026-10-29T12:00:29.162Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE055183", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "c65d515e-b4f3-4e13-b645-1a639539743d", "warrantyClaimNumber": "WC-N54511-26-10-29-20-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T11:20:20.442Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:30.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0028", "approvedDate": "2026-10-29T12:00:30.072Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE054895", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "b7b04a94-ecc6-43db-bf0b-b4fe01cf004a", "warrantyClaimNumber": "WC-N54511-26-10-29-21-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T11:16:21.576Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:30.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0029", "approvedDate": "2026-10-29T12:00:30.221Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE054534", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "17e94a79-fd16-434b-bee1-c64f43a59014", "warrantyClaimNumber": "WC-N54511-26-10-29-39-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T11:12:39.643Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:31.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0030", "approvedDate": "2026-10-29T12:00:31.096Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE050683", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "d0eb9cca-b17a-4749-9491-744e302064c5", "warrantyClaimNumber": "WC-N54511-26-10-29-47-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T11:08:47.310Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:31.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0016", "approvedDate": "2026-10-29T12:00:31.062Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE062269", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "edd17b7e-96dc-4908-bf3c-5adcb9959a6c", "warrantyClaimNumber": "WC-N54511-26-10-29-24-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T11:02:24.850Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:32.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0018", "approvedDate": "2026-10-29T12:00:31.941Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE057172", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "45de4154-685e-4f2b-9091-3b7cb01607e5", "warrantyClaimNumber": "WC-N54511-26-10-29-22-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T10:45:22.355Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:32.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0019", "approvedDate": "2026-10-29T12:00:32.210Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE061303", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "fd5a6075-7858-4d9d-84b5-05836758b8e4", "warrantyClaimNumber": "WC-N54511-26-10-29-29-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T10:26:29.093Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:49.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0020", "approvedDate": "2026-10-29T12:00:49.461Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE046264", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "42481213-2ff8-4bdc-817e-2a143f32f871", "warrantyClaimNumber": "WC-N54511-26-10-29-44-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T10:17:44.087Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:52.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0012", "approvedDate": "2026-10-29T12:00:52.354Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE060752", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "05dab352-1dad-4f78-b488-767599eca93f", "warrantyClaimNumber": "WC-N54511-26-10-29-50-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T10:03:50.756Z", "approverName": "TUNGVD9", "updatedAt": "2026-10-31T04:11:00.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261029-0012", "approvedDate": "2026-10-31T04:10:59.500Z", "totalRequestedAmountInclTax": 2504469, "vin": "RPXP1LHHVPE058900", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "2063f0bc-c0cc-4b61-89f0-de3dd1b06cd4", "warrantyClaimNumber": "WC-N54511-26-10-29-04-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T10:00:04.774Z", "approverName": "TUNGVD9", "updatedAt": "2026-10-31T04:11:00.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261029-0008", "approvedDate": "2026-10-31T04:10:59.652Z", "totalRequestedAmountInclTax": 2504469, "vin": "RPXN4LHHVRE023067", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "782e3921-a373-4cf3-921b-f4735a00bc8a", "warrantyClaimNumber": "WC-N54511-26-10-29-55-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 4, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T01:49:55.423Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T10:10:16.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0009", "approvedDate": "2026-10-29T10:10:15.649Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE065804", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "c874f5e5-a1f9-4356-9faa-2ad9126b0f52", "warrantyClaimNumber": "WC-N54511-26-10-29-19-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T01:45:19.443Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T10:10:16.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0023", "approvedDate": "2026-10-29T10:10:16.099Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE056819", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "2b6a8317-39eb-4819-a98c-3c0f31335d66", "warrantyClaimNumber": "WC-N54511-26-10-29-37-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-29T01:37:38.037Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T10:10:17.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0021", "approvedDate": "2026-10-29T10:10:16.833Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE049092", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "7d7e9030-16a0-4b34-bae6-ab298de1f800", "warrantyClaimNumber": "WC-N54511-26-10-28-04-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 4, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T12:35:04.354Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:55.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0022", "approvedDate": "2026-10-29T12:00:54.882Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE051527", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "69ed2e1d-e473-466b-94a7-fb9bbb2fb7f0", "warrantyClaimNumber": "WC-N54511-26-10-28-16-0002", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T12:28:16.634Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T10:10:18.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0018", "approvedDate": "2026-10-29T10:10:17.780Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE065902", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "5e9905ea-473d-4c52-af7b-8ee0d7a56c5a", "warrantyClaimNumber": "WC-N54511-26-10-28-52-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 4, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T12:03:52.261Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-29T12:00:56.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0010", "approvedDate": "2026-10-29T12:00:56.128Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE058002", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "f4fdc52a-f596-429c-bc47-7dad47fd4461", "warrantyClaimNumber": "WC-N54511-26-10-28-43-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T10:50:43.576Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-28T11:08:09.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0008", "approvedDate": "2026-10-28T11:08:09.202Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE061591", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "d3f66f33-9fa5-4be9-abf6-a8dadbe017c0", "warrantyClaimNumber": "WC-N54511-26-10-28-09-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T10:46:09.146Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-28T11:08:11.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0019", "approvedDate": "2026-10-28T11:08:10.963Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVRE004978", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "b7639ce0-2cfa-48ff-be49-f6c0034e2412", "warrantyClaimNumber": "WC-N54511-26-10-28-59-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T09:55:59.279Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-28T11:08:15.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0007", "approvedDate": "2026-10-28T11:08:14.874Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE065148", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "6fc75b37-08c4-4d46-902b-65354877679c", "warrantyClaimNumber": "WC-N54511-26-10-28-16-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T09:50:16.657Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-28T11:08:16.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0006", "approvedDate": "2026-10-28T11:08:16.240Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE043921", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "4c746996-2e9f-4696-89eb-147614e737f3", "warrantyClaimNumber": "WC-N54511-26-10-28-36-0002", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T09:32:36.809Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-28T11:08:18.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261014-0003", "approvedDate": "2026-10-28T11:08:17.604Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE043952", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "8134d58e-c703-4635-801b-baaa3121a882", "warrantyClaimNumber": "WC-N54511-26-10-28-48-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T09:22:48.105Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-28T11:08:18.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0020", "approvedDate": "2026-10-28T11:08:18.217Z", "totalRequestedAmountInclTax": 478853, "vin": "RPXP1LHHVPE058483", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "1f2d660d-d3f3-4e5c-b721-0c51555cf059", "warrantyClaimNumber": "WC-N54511-26-10-28-07-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T09:19:07.166Z", "approverName": null, "updatedAt": "2026-10-30T00:29:13.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261028-0022", "approvedDate": "2026-10-30T00:29:13.074Z", "totalRequestedAmountInclTax": 2504469, "vin": "RPXN4LHHVPE069572", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "280a68cc-5de1-47b7-8e40-fa55525a1c56", "warrantyClaimNumber": "WC-N54511-26-10-28-54-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T08:30:54.565Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-28T11:08:20.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261028-0004", "approvedDate": "2026-10-28T11:08:20.157Z", "totalRequestedAmountInclTax": 681426, "vin": "RPXP1LHHVPE058907", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "1f0003b8-17a8-4e65-86db-51facd5a3b9c", "warrantyClaimNumber": "WC-N54511-26-10-28-36-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T03:33:36.199Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-28T06:33:48.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0006", "approvedDate": "2026-10-28T06:33:47.515Z", "totalRequestedAmountInclTax": 191268, "vin": "RPXN4LHHVRE029756", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦNCÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "0a299aa1-88c2-40d3-99be-11dda2a96c14", "warrantyClaimNumber": "WC-N54511-26-10-28-06-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T03:30:06.131Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-28T06:33:49.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0005", "approvedDate": "2026-10-28T06:33:48.488Z", "totalRequestedAmountInclTax": 191268, "vin": "RPXN4LHHVRE028725", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "a222ffde-9109-468e-8adc-fcc5516fdb7a", "warrantyClaimNumber": "WC-N54511-26-10-28-01-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": null, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T03:16:01.791Z", "approverName": null, "updatedAt": "2026-10-28T03:29:43.000Z", "status": "CANCELLED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0005", "approvedDate": null, "totalRequestedAmountInclTax": 191268, "vin": "RPXN4LHHVRE028725", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "f4cc8fdd-03e1-413f-8b29-ab37da26fb39", "warrantyClaimNumber": "WC-N54511-26-10-28-50-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T01:55:50.400Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-28T06:33:50.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261006-0033", "approvedDate": "2026-10-28T06:33:49.747Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVPE064733", "customer": {"customerId": "ad07fe35-0a75-4331-8536-f4295c4e5df0", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "657c55eb-0401-4b7d-8557-38bf69a7d506", "warrantyClaimNumber": "WC-N54511-26-10-28-40-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-28T01:50:40.036Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-28T06:34:03.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0026", "approvedDate": "2026-10-28T06:34:02.982Z", "totalRequestedAmountInclTax": 150282, "vin": "RPXP1LHHVPE048688", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "85beffa7-3483-4474-a6a9-9247d60c4b9f", "warrantyClaimNumber": "WC-N54511-26-10-27-38-0003", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 6, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-27T10:10:38.490Z", "approverName": "TUNGVD9", "updatedAt": "2026-10-31T04:11:00.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": "Video hoàn thiện quay trước cả khi chụp ảnh vành mới, XDV kiểm tra bổ|sung lại đúng thông tin", "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0016", "approvedDate": "2026-10-31T04:10:59.830Z", "totalRequestedAmountInclTax": 4797018, "vin": "RPXN4LHHVPE039836", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "a0abcd97-565e-456f-b885-d95148257162", "warrantyClaimNumber": "WC-N54511-26-10-27-12-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-27T10:02:12.136Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-27T10:53:41.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0024", "approvedDate": "2026-10-27T10:53:40.639Z", "totalRequestedAmountInclTax": 191268, "vin": "RPXN4LHHVPE068283", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY CỔ PHẦNCÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "f1af360b-7595-4504-813b-35df1df4ab50", "warrantyClaimNumber": "WC-N54511-26-10-27-24-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-27T09:17:24.761Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-27T10:53:41.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0017", "approvedDate": "2026-10-27T10:53:41.049Z", "totalRequestedAmountInclTax": 441308, "vin": "RPXN4LHHVPE042146", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "f8765093-94fd-45a5-8cfa-963886426535", "warrantyClaimNumber": "WC-N54511-26-10-27-09-0002", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-27T07:15:09.215Z", "approverName": null, "updatedAt": "2026-10-29T08:29:06.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261026-0008", "approvedDate": "2026-10-29T08:29:05.651Z", "totalRequestedAmountInclTax": 2504469, "vin": "RPXP1LHHVPE052139", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "72796d64-9635-4938-b085-fe52603cc90f", "warrantyClaimNumber": "WC-N54511-26-10-27-41-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 2, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-27T07:01:41.720Z", "approverName": "N54511-XDV Vinfast 2S CarOn Thới An", "updatedAt": "2026-10-27T07:23:48.000Z", "status": "APPROVED", "warrantyType": "RETAIL_PARTS_ACCESSORIES", "requestType": "PARTS", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261027-0008", "approvedDate": "2026-10-27T07:23:48.408Z", "totalRequestedAmountInclTax": 479873, "vin": "RPXP1LHHVPE041378", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CÔNG TY XANH SM (GSM)", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "ketoan-gsm@gsm.net.vn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "63f23ee8-5bd5-4865-91b0-4d73bda3a928", "warrantyClaimNumber": "WC-N54511-26-10-27-38-0002", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-27T06:55:38.589Z", "approverName": null, "updatedAt": "2026-10-29T08:29:06.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261027-0005", "approvedDate": "2026-10-29T08:29:05.560Z", "totalRequestedAmountInclTax": 2504469, "vin": "RPXP1LHHVPE047311", "customer": {"customerId": "9edf8193-1e03-4c70-974b-eff7de8af931", "customerName": "CHI NHÁNH THÀNH PHỐ HỒ CHÍ MINH - CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "61c485ca-923c-426f-b5f7-812ebfacedf5", "warrantyClaimNumber": "WC-N54511-26-10-27-38-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": null, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-27T06:54:38.080Z", "approverName": null, "updatedAt": "2026-10-27T10:54:03.000Z", "status": "CANCELLED", "warrantyType": null, "requestType": null, "claimTo": null, "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261013-0005", "approvedDate": null, "totalRequestedAmountInclTax": 191268, "vin": "RPXN4LHHVRE028725", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0963030974", "customerEmail": "kt@bship.vn", "customerAddress": "Số 20H2 đường DN7"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "eec1dfb5-15f0-4829-8784-03055b68e619", "warrantyClaimNumber": "WC-N54511-26-10-27-44-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-27T02:21:44.313Z", "approverName": null, "updatedAt": "2026-10-29T08:29:06.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261022-0022", "approvedDate": "2026-10-29T08:29:06.137Z", "totalRequestedAmountInclTax": 2504469, "vin": "RPXN4LHHVRE024418", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}, {"id": "8be34abe-1fe6-4d1b-99ad-b32a7c6c3bb6", "warrantyClaimNumber": "WC-N54511-26-10-27-09-0001", "dealerId": "83aaff6f-8e56-4384-9cab-eeb333aa1b91", "dealerCode": "N54511", "dealerName": "VinFast Caron Thới An", "approvalSequence": 3, "createdByName": "Cao Lê Mỹ Linh", "createdAt": "2026-10-27T02:15:09.336Z", "approverName": null, "updatedAt": "2026-10-29T08:29:06.000Z", "status": "APPROVED", "warrantyType": "STANDARD", "requestType": "CUSTOMER_VEHICLE", "claimTo": "VFVN", "reason": null, "deletedAt": null, "isResubmissionLocked": 0, "workOrderNumber": "N54511-WO-261022-0026", "approvedDate": "2026-10-29T08:29:06.213Z", "totalRequestedAmountInclTax": 2504469, "vin": "RPXN4LHHVPE068146", "customer": {"customerId": "0bb1b3a3-4f02-4681-b311-f0eab84a39bd", "customerName": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customerCompanyName": null, "customerPhone": "0904770788", "customerEmail": "ketoan-gsm@gsm.net.vn", "customerAddress": "Lầu 20A, Vincom Đồng Khởi, 72 Lê Thánh Tôn"}, "linkedWcsId": null, "linkedWcsNumber": null}];
const SERVICEOS_PRELOAD_ORDERS = [{"id": 8669, "code": "N54511-261105-009", "status": "awaiting_open", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-05 16:21:22", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txe trả co2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": "checking", "faults": [], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 16:41:55", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": ["front_shock_left"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-11162", "vin": "RPXP1LHHVPE062553", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Phạm Thanh Vũ", "inspector_name": "Phạm Thanh Vũ", "fleet": "gsm", "odometer": 89894, "battery_level": 36, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Huỳnh Phan Bảo Trân", "driver_phone": "0932919275", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 0}, {"id": 8664, "code": "N54511-261105-008", "status": "awaiting_open", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-05 15:48:25", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txe trả co2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 15:48:28", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29F1-69362", "vin": "RPXP1LHHVPE046155", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Phạm Thanh Vũ", "inspector_name": "Phạm Thanh Vũ", "fleet": "gsm", "odometer": 63198, "battery_level": 64, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Văn Trọng Nhân", "driver_phone": "0938552294", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 0}, {"id": 8659, "code": "N54511-261105-006", "status": "waiting_repair", "source": "retail", "priority": "normal", "service_type": "warranty", "received_at": "2026-11-05 15:05:44", "promised_at": "2026-11-06 10:00:00", "completed_at": null, "delivered_at": null, "bay": null, "technician_id": 16, "advisor_id": 17, "symptoms": "lỗi động cơ", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": "2026-11-06", "warranty_status": "waiting_motor", "faults": ["Lỗi động cơ"], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": "khách lẻ xe nhà", "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": "VFHCEAD230609D0030", "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": "2026-11-05", "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 16:37:16", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": ["motor"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "Trịnh Thị Thu Thảo", "customer_phone": "0979423393", "model": "Evo 200", "plate": "79MD-02531", "vin": "RPXP1LHHVPE022208", "branch_code": "N54511", "technician_name": "Nguyễn Thành Trung", "advisor_name": "Cao Lê Mỹ Linh", "created_by_name": "Cao Lê Mỹ Linh", "inspector_name": "Nguyễn Thành Trung", "fleet": "retail", "odometer": null, "battery_level": null, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Trịnh Thị Thu Thảo", "driver_phone": "0979423393", "alerts": [{"key": "warning", "label": "Sắp quá hạn (1 ngày)", "tone": "amber", "hint": "Sắp đến hạn giao xe"}], "alert_level": "amber", "vf_category": "Sửa chữa thay thế động cơ", "sla": {"code": "warning", "label": "Sắp quá hạn (1 ngày)", "days": 1}, "days_in_shop": 0}, {"id": 8653, "code": "N54511-261105-005", "status": "awaiting_open", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-05 14:35:21", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txe trả co2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 14:35:24", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-11659", "vin": "RPXP1LHHVPE060355", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Phạm Thanh Vũ", "inspector_name": "Phạm Thanh Vũ", "fleet": "gsm", "odometer": 54990, "battery_level": 68, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Ngô Nguyễn Quốc Huy", "driver_phone": "0909943046", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 0}, {"id": 8650, "code": "N54511-261105-004", "status": "awaiting_open", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-05 14:14:16", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txe trả co2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 14:14:18", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-10611", "vin": "RPXP1LHHVPE065540", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Phạm Thanh Vũ", "inspector_name": "Phạm Thanh Vũ", "fleet": "gsm", "odometer": 73515, "battery_level": 31, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Ngô Văn Đạt", "driver_phone": "0378660857", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 0}, {"id": 8648, "code": "N54511-261105-003", "status": "awaiting_open", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-05 13:56:07", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txe trả co2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 13:56:10", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29Y5-89173", "vin": "RPXP1LHHVPE062517", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Phạm Thanh Vũ", "inspector_name": "Phạm Thanh Vũ", "fleet": "gsm", "odometer": 11338, "battery_level": 97, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Võ Hoàng Châu Long", "driver_phone": "0901489851", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 0}, {"id": 8639, "code": "N54511-261105-002", "status": "awaiting_open", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-05 10:53:37", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txe trả co2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 10:53:40", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29F1-69518", "vin": "RPXP1LHHVPE045331", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Phạm Thanh Vũ", "inspector_name": "Phạm Thanh Vũ", "fleet": "gsm", "odometer": 17092, "battery_level": 86, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Chu Minh Trí", "driver_phone": "0918512929", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 0}, {"id": 8625, "code": "N54511-261105-001", "status": "inspecting", "source": "retail", "priority": "normal", "service_type": "warranty", "received_at": "2026-11-05 08:34:59", "promised_at": "2026-11-05 13:00:00", "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": 5, "symptoms": "lỗi đv", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": "2026-11-05", "warranty_status": "checking", "faults": ["Lỗi Esim"], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": "KHÁCH LẺ GSM", "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 11:50:01", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": ["esim"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-10276", "vin": "RPXP1LHHVPE052941", "branch_code": "N54511", "technician_name": null, "advisor_name": "Trương Nguyễn Như Trường", "created_by_name": "Trương Nguyễn Như Trường", "inspector_name": null, "fleet": "gsm", "odometer": null, "battery_level": null, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Bùi Công Phụng", "driver_phone": "0788883217", "alerts": [{"key": "warning", "label": "Đến hạn hôm nay", "tone": "amber", "hint": "Sắp đến hạn giao xe"}], "alert_level": "amber", "vf_category": "Sửa chữa chung", "sla": {"code": "warning", "label": "Đến hạn hôm nay", "days": 0}, "days_in_shop": 0}, {"id": 8602, "code": "N54511-261104-009", "status": "inspecting", "source": "retail", "priority": "normal", "service_type": "warranty", "received_at": "2026-11-04 15:11:22", "promised_at": "2026-11-05 10:00:00", "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": 17, "symptoms": "LỖI ĐV", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": "2026-11-05", "warranty_status": "checking", "faults": ["Lỗi Esim"], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": "KHÁCH LẺ GSM", "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 15:21:37", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": ["esim"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29C2-07744", "vin": "RPXP1LHHVPE060424", "branch_code": "N54511", "technician_name": null, "advisor_name": "Cao Lê Mỹ Linh", "created_by_name": "Cao Lê Mỹ Linh", "inspector_name": null, "fleet": "gsm", "odometer": null, "battery_level": null, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Y Đa Wik Kbuôr", "driver_phone": "0886074790", "alerts": [{"key": "warning", "label": "Đến hạn hôm nay", "tone": "amber", "hint": "Sắp đến hạn giao xe"}], "alert_level": "amber", "vf_category": "Sửa chữa chung", "sla": {"code": "warning", "label": "Đến hạn hôm nay", "days": 0}, "days_in_shop": 1}, {"id": 8594, "code": "N54511-261104-008", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-04 14:09:29", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "chuyển RTO", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": ["Lỗi động cơ"], "quote_amount": 10095305, "dms_ro_code": "N54511-WO-261104-0019", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 19:36:29", "repair_done_at": null, "quoted_at": "2026-11-04 19:36:29", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-16116", "vin": "RPXP1LHHVPE066173", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 80240, "battery_level": 74, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Phạm Đăng Vương", "driver_phone": "0983430930", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 1}, {"id": 8590, "code": "N54511-261104-007", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-04 13:21:45", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "chuyển RTO", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": ["Lỗi PIN"], "quote_amount": 0, "dms_ro_code": null, "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 19:07:27", "repair_done_at": null, "quoted_at": "2026-11-04 19:07:27", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "50AA-07602", "vin": "RPXP1LHHVSE067070", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 40679, "battery_level": 83, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Văn Mùi", "driver_phone": "0919262312", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 1}, {"id": 8584, "code": "N54511-261104-005", "status": "gsm_rejected", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-04 11:37:42", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "đổi xe khác", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 4753917, "dms_ro_code": "N54511-WO-261104-0020", "parts_status": null, "advisor_note": "XE ĐÃ LÊN ĐV 4/11/2026", "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 18:26:02", "repair_done_at": null, "quoted_at": "2026-11-04 20:30:49", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "50AC-33967", "vin": "RPXP1LHHVSE050592", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 11318, "battery_level": 74, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Nhật Hiếu", "driver_phone": "0934099006", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 1}, {"id": 8565, "code": "N54511-261104-004", "status": "gsm_rejected", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-04 10:11:47", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "đổi xe khác", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": ["Lỗi giảm xóc trước", "Lỗi Esim"], "quote_amount": 5424635, "dms_ro_code": "N54511-WO-261104-0006", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 18:23:28", "repair_done_at": null, "quoted_at": "2026-11-04 20:19:38", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "79NA-14793", "vin": "RPXP1LHHVPE054781", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 2060, "battery_level": 23, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Hà Đăng", "driver_phone": "0979949237", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 1}, {"id": 8563, "code": "N54511-261104-003", "status": "waiting_repair", "source": "retail", "priority": "normal", "service_type": "warranty", "received_at": "2026-11-04 09:50:34", "promised_at": "2026-11-04 14:00:00", "completed_at": null, "delivered_at": null, "bay": null, "technician_id": 16, "advisor_id": 17, "symptoms": "LỖI PIN", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": "2026-11-04", "warranty_status": "waiting_battery", "faults": ["Lỗi PIN"], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": "KHÁCH LẺ GSM", "foreman_note": null, "branch_id": 2, "battery_serial_old": "BAT12006000070003094230807N00353", "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": "2026-11-04", "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 10:05:27", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": ["pin"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Feliz S", "plate": "59T2-66554", "vin": "RPXN4LHHVPE037868", "branch_code": "N54511", "technician_name": "Nguyễn Thành Trung", "advisor_name": "Cao Lê Mỹ Linh", "created_by_name": "Cao Lê Mỹ Linh", "inspector_name": "Nguyễn Thành Trung", "fleet": "gsm", "odometer": null, "battery_level": null, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Phan Nguyễn An", "driver_phone": "0934962657", "alerts": [{"key": "overdue", "label": "Quá hạn 1 ngày", "tone": "red", "hint": "Ưu tiên xử lý và báo GSM / khách"}], "alert_level": "red", "vf_category": "Sửa chữa thay thế Pin", "sla": {"code": "overdue", "label": "Quá hạn 1 ngày", "days": -1}, "days_in_shop": 1}, {"id": 8562, "code": "N54511-261104-002", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-04 09:40:37", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "chuyển qua flas form", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": ["Lỗi nút TopCover"], "quote_amount": 5544507, "dms_ro_code": "N54511-WO-261104-0021", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 20:32:29", "repair_done_at": null, "quoted_at": "2026-11-04 20:32:29", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-26819", "vin": "RPXP1LHHVSE033939", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 66467, "battery_level": 37, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Ngọc Mạnh", "driver_phone": "0385304609", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 1}, {"id": 8559, "code": "N54511-261104-001", "status": "gsm_rejected", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-04 09:11:04", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "thanh lý hợp đồng", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 6328787, "dms_ro_code": "N54511-WO-261104-0022", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 18:18:09", "repair_done_at": null, "quoted_at": "2026-11-04 20:48:29", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Feliz S", "plate": "59TA-04953", "vin": "RPXN4LHHVPE031517", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 73732, "battery_level": 60, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Trần Hoài Phong", "driver_phone": "0862594267", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 1}, {"id": 8554, "code": "N54511-261103-010", "status": "inspecting", "source": "retail", "priority": "normal", "service_type": "warranty", "received_at": "2026-11-03 16:42:13", "promised_at": "2026-11-04 10:00:00", "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": 17, "symptoms": "LỖI ĐỘNG CƠ", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": "2026-11-04", "warranty_status": "checking", "faults": ["Lỗi động cơ"], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": "KHÁCH LẺ GSM", "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-03 16:46:26", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": ["motor"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-13345", "vin": "RPXP1LHHVPE066085", "branch_code": "N54511", "technician_name": null, "advisor_name": "Cao Lê Mỹ Linh", "created_by_name": "Cao Lê Mỹ Linh", "inspector_name": null, "fleet": "gsm", "odometer": null, "battery_level": null, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Đại Long", "driver_phone": "0846917986", "alerts": [{"key": "overdue", "label": "Quá hạn 1 ngày", "tone": "red", "hint": "Ưu tiên xử lý và báo GSM / khách"}], "alert_level": "red", "vf_category": "Sửa chữa thay thế động cơ", "sla": {"code": "overdue", "label": "Quá hạn 1 ngày", "days": -1}, "days_in_shop": 2}, {"id": 8539, "code": "N54511-261103-009", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-03 14:02:18", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "thanh lý hợp đồng", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 6149231, "dms_ro_code": "N54511-WO-261103-0023", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-03 15:16:11", "repair_done_at": null, "quoted_at": "2026-11-03 15:16:11", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Feliz S", "plate": "59TA-05096", "vin": "RPXN4LHHVPE038106", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 82370, "battery_level": 66, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Sơn Hải Hân", "driver_phone": "0393631746", "alerts": [{"key": "wait_approval", "label": "Chờ duyệt 2 ngày", "tone": "amber", "hint": "Nhắc GSM / khách xác nhận báo giá"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 2}, {"id": 8531, "code": "N54511-261103-008", "status": "gsm_rejected", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-03 11:47:59", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "VHB TH Ko Phí", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 10552803, "dms_ro_code": "N54511-WO-261103-0015", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 18:06:26", "repair_done_at": null, "quoted_at": "2026-11-03 13:45:14", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-09003", "vin": "RPXP1LHHVPE050412", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 9055, "battery_level": 53, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 2}, {"id": 8527, "code": "N54511-261103-007", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-03 10:40:12", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "chuyển RTO", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 0, "dms_ro_code": null, "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-03 10:46:50", "repair_done_at": null, "quoted_at": "2026-11-03 10:46:50", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29F1-69673", "vin": "RPXP1LHHVPE063555", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 63738, "battery_level": 88, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Lê Quang Vinh", "driver_phone": "0377720271", "alerts": [{"key": "wait_approval", "label": "Chờ duyệt 2 ngày", "tone": "amber", "hint": "Nhắc GSM / khách xác nhận báo giá"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 2}, {"id": 8523, "code": "N54511-261103-006", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-03 10:17:39", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "thanh lý hợp đồng", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": ["Lỗi giảm xóc trước"], "quote_amount": 3060726, "dms_ro_code": "N54511-WO-261103-0010", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-03 10:55:48", "repair_done_at": null, "quoted_at": "2026-11-03 10:55:48", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29H2-54551", "vin": "RPXP1LHHVPE040749", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 3890, "battery_level": 86, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Mỹ Linh", "driver_phone": "0366971076", "alerts": [{"key": "wait_approval", "label": "Chờ duyệt 2 ngày", "tone": "amber", "hint": "Nhắc GSM / khách xác nhận báo giá"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 2}, {"id": 8518, "code": "N54511-261103-005", "status": "gsm_rejected", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-03 09:47:00", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "chuyển flast form", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 3673610, "dms_ro_code": "N54511-WO-261103-0008", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 16:13:08", "repair_done_at": null, "quoted_at": "2026-11-03 10:45:24", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29G2-16486", "vin": "RPXP1LHHVPE048677", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 74828, "battery_level": 99, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Văn Thuỷ", "driver_phone": "0917595654", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 2}, {"id": 8514, "code": "N54511-261103-003", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-03 09:11:49", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "Chuyển RTO", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 0, "dms_ro_code": null, "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-03 10:07:53", "repair_done_at": null, "quoted_at": "2026-11-03 10:07:53", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-12870", "vin": "RPXP1LHHVPE058204", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 61808, "battery_level": 94, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Lê Phú Dương", "driver_phone": "0812331842", "alerts": [{"key": "wait_approval", "label": "Chờ duyệt 2 ngày", "tone": "amber", "hint": "Nhắc GSM / khách xác nhận báo giá"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 2}, {"id": 8512, "code": "N54511-261103-002", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-03 08:45:58", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "ttth+500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": "checking", "faults": ["Lỗi giảm sóc sau"], "quote_amount": 5590288, "dms_ro_code": "N54511-WO-261103-0011", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-03 11:13:39", "repair_done_at": null, "quoted_at": "2026-11-03 11:13:39", "vinfast_category": null, "warranty_kinds": ["rear_shock"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29C2-09634", "vin": "RPXP1LHHVPE057330", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 39387, "battery_level": 42, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "wait_approval", "label": "Chờ duyệt 2 ngày", "tone": "amber", "hint": "Nhắc GSM / khách xác nhận báo giá"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 2}, {"id": 8510, "code": "N54511-261103-001", "status": "gsm_rejected", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-03 08:22:26", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "ttth+500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": "checking", "faults": [], "quote_amount": 11743962, "dms_ro_code": "N54511-WO-261103-0012", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 16:20:34", "repair_done_at": null, "quoted_at": "2026-11-03 13:15:50", "vinfast_category": null, "warranty_kinds": ["topcover"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-17607", "vin": "RPXP1LHHVRE005102", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 55927, "battery_level": 92, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [], "alert_level": "", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 2}, {"id": 8507, "code": "N54511-261102-016", "status": "gsm_rejected", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 16:54:48", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "ttth ko phí CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 3198893, "dms_ro_code": "N54511-WO-261102-0030", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 15:57:57", "repair_done_at": null, "quoted_at": "2026-11-04 18:09:35", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "99AA-05511", "vin": "RPXP1LHHVPE051573", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 77976, "battery_level": 52, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Lê Tuấn Hùng", "driver_phone": "0362408680", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8506, "code": "N54511-261102-015", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 16:17:35", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txtl th +500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": "checking", "faults": ["Lỗi động cơ", "Lỗi giảm sóc sau"], "quote_amount": 8121690, "dms_ro_code": "N54511-WO-261102-0038", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 14:34:05", "repair_done_at": null, "quoted_at": "2026-11-04 14:34:05", "vinfast_category": null, "warranty_kinds": ["rear_shock"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Feliz S", "plate": "59T2-67557", "vin": "RPXN4LHHVPE034061", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 98680, "battery_level": 36, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8505, "code": "N54511-261102-014", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 15:53:34", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": 3, "symptoms": "txtl TH + 500K", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": "checking", "faults": ["Lỗi giảm sóc sau"], "quote_amount": 9880686, "dms_ro_code": "N54511-WO-261104-0023", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 13:53:57", "repair_done_at": null, "quoted_at": "2026-11-05 13:53:57", "vinfast_category": null, "warranty_kinds": ["rear_shock"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-18909", "vin": "RPXP1LHHVRE004882", "branch_code": "N54511", "technician_name": null, "advisor_name": "Trương Duy Nhật Linh", "created_by_name": "Trương Duy Nhật Linh", "inspector_name": "Trương Duy Nhật Linh", "fleet": "gsm", "odometer": 76117, "battery_level": 45, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "k tx", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8504, "code": "N54511-261102-013", "status": "gsm_rejected", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 15:50:03", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": 3, "symptoms": "tx bỏ xe tại xdv", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 1780521, "dms_ro_code": "N54511-WO-261102-0020", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 15:45:54", "repair_done_at": null, "quoted_at": "2026-11-04 18:12:25", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "50AC-02097", "vin": "RPXP1LHHVSE034763", "branch_code": "N54511", "technician_name": null, "advisor_name": "Trương Duy Nhật Linh", "created_by_name": "Trương Duy Nhật Linh", "inspector_name": "Trương Duy Nhật Linh", "fleet": "gsm", "odometer": 6371, "battery_level": 39, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8503, "code": "N54511-261102-012", "status": "waiting_repair", "source": "retail", "priority": "normal", "service_type": "warranty", "received_at": "2026-11-02 15:17:53", "promised_at": "2026-11-03 10:00:00", "completed_at": null, "delivered_at": null, "bay": null, "technician_id": 16, "advisor_id": 17, "symptoms": "LỖI PIN", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": "2026-11-03", "warranty_status": "waiting_battery", "faults": ["Lỗi PIN"], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": "KHÁCH LẺ BSHIP", "foreman_note": null, "branch_id": 2, "battery_serial_old": "BAT12006000090003094231023N00509", "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": "2026-11-04", "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 10:06:07", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": ["pin"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customer_phone": "0393369139", "model": "Feliz S", "plate": "65MA-044.92", "vin": "RPXN4LHHVPE067780", "branch_code": "N54511", "technician_name": "Nguyễn Thành Trung", "advisor_name": "Cao Lê Mỹ Linh", "created_by_name": "Cao Lê Mỹ Linh", "inspector_name": "Nguyễn Thành Trung", "fleet": "bship", "odometer": null, "battery_level": null, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Bạch Văn Tiền", "driver_phone": "0906530047", "alerts": [{"key": "overdue", "label": "Quá hạn 2 ngày", "tone": "red", "hint": "Ưu tiên xử lý và báo GSM / khách"}], "alert_level": "red", "vf_category": "Sửa chữa thay thế Pin", "sla": {"code": "overdue", "label": "Quá hạn 2 ngày", "days": -2}, "days_in_shop": 3}, {"id": 8502, "code": "N54511-261102-011", "status": "gsm_rejected", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 15:08:14", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txtl th +500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 3871716, "dms_ro_code": "N54511-WO-261102-0040", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 15:40:52", "repair_done_at": null, "quoted_at": "2026-11-04 18:06:53", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "50AA-12035", "vin": "RPXP1LHHVSE071480", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 18662, "battery_level": 20, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8500, "code": "N54511-261102-010", "status": "waiting_repair", "source": "retail", "priority": "normal", "service_type": "warranty", "received_at": "2026-11-02 15:05:54", "promised_at": "2026-11-03 10:00:00", "completed_at": null, "delivered_at": null, "bay": null, "technician_id": 16, "advisor_id": 17, "symptoms": "LỖI PIN", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": "2026-11-03", "warranty_status": "waiting_battery", "faults": ["Lỗi PIN"], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": "KHÁCH LẺ BSHIP", "foreman_note": null, "branch_id": 2, "battery_serial_old": "BAT12006000100003094240328N00388", "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": "2026-11-04", "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 10:27:51", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": ["pin"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customer_phone": "0393369139", "model": "Feliz S", "plate": "65MA-132.55", "vin": "RPXN4LHHVPE020048", "branch_code": "N54511", "technician_name": "Nguyễn Thành Trung", "advisor_name": "Cao Lê Mỹ Linh", "created_by_name": "Cao Lê Mỹ Linh", "inspector_name": "Nguyễn Thành Trung", "fleet": "bship", "odometer": null, "battery_level": null, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Hải Sơn", "driver_phone": "0938895406", "alerts": [{"key": "overdue", "label": "Quá hạn 2 ngày", "tone": "red", "hint": "Ưu tiên xử lý và báo GSM / khách"}], "alert_level": "red", "vf_category": "Sửa chữa thay thế Pin", "sla": {"code": "overdue", "label": "Quá hạn 2 ngày", "days": -2}, "days_in_shop": 3}, {"id": 8496, "code": "N54511-261102-009", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 13:56:09", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "ttth+500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 4566068, "dms_ro_code": "N54511-WO-261102-0041", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 18:16:33", "repair_done_at": null, "quoted_at": "2026-11-04 18:16:33", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-16633", "vin": "RPXP1LHHVRE003840", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 88789, "battery_level": 27, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8494, "code": "N54511-261102-008", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 13:28:20", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txtl th +500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 11290315, "dms_ro_code": "N54511-WO-261102-0043", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 14:37:19", "repair_done_at": null, "quoted_at": "2026-11-04 14:37:19", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-07773", "vin": "RPXP1LHHVPE049809", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 60268, "battery_level": 58, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8491, "code": "N54511-261102-007", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 12:04:17", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "thanh lý hợp đồng", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 4981518, "dms_ro_code": "N54511-WO-261102-0039", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-02 21:49:46", "repair_done_at": null, "quoted_at": "2026-11-02 21:49:46", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29Y5-88880", "vin": "RPXP1LHHVPE057391", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 3712, "battery_level": 72, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Lưu Hoàng Phúc", "driver_phone": "0789550947", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}, {"key": "wait_approval", "label": "Chờ duyệt 3 ngày", "tone": "amber", "hint": "Nhắc GSM / khách xác nhận báo giá"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8490, "code": "N54511-261102-006", "status": "inspecting", "source": "retail", "priority": "normal", "service_type": "warranty", "received_at": "2026-11-02 11:45:26", "promised_at": "2026-11-02 16:00:00", "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": 17, "symptoms": "LỖI CLE 13", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": "2026-11-02", "warranty_status": "checking", "faults": [], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": "NV BSHIP", "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-02 15:33:20", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": ["other"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customer_phone": "0393369139", "model": "Feliz S", "plate": "65MA-142.26", "vin": "RPXN4LHHVRE024774", "branch_code": "N54511", "technician_name": null, "advisor_name": "Cao Lê Mỹ Linh", "created_by_name": "Cao Lê Mỹ Linh", "inspector_name": null, "fleet": "bship", "odometer": null, "battery_level": null, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Phan Thanh Hậu", "driver_phone": "0818818681", "alerts": [{"key": "overdue", "label": "Quá hạn 3 ngày", "tone": "red", "hint": "Ưu tiên xử lý và báo GSM / khách"}], "alert_level": "red", "vf_category": "Sửa chữa chung", "sla": {"code": "overdue", "label": "Quá hạn 3 ngày", "days": -3}, "days_in_shop": 3}, {"id": 8487, "code": "N54511-261102-005", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 11:11:41", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "thanh lý hợp đồng", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 6310989, "dms_ro_code": "N54511-WO-261103-0003", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 14:39:33", "repair_done_at": null, "quoted_at": "2026-11-04 14:39:33", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29X7-73582", "vin": "RPXP1LHHVPE063821", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 9296, "battery_level": 60, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Cao Văn Thanh", "driver_phone": "0389484724", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8482, "code": "N54511-261102-004", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 10:38:18", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "thanh lý hợp đồng", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 438588, "dms_ro_code": "N54511-WO-261102-0037", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 18:18:20", "repair_done_at": null, "quoted_at": "2026-11-04 18:18:20", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29F1-70449", "vin": "RPXP1LHHVPE060916", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 78489, "battery_level": 43, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Quốc Cường", "driver_phone": "0767799529", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8480, "code": "N54511-261102-003", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 10:07:30", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "chuyển lên oto", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 733988, "dms_ro_code": "N54511-WO-261104-0018", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 18:44:33", "repair_done_at": null, "quoted_at": "2026-11-04 18:44:33", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-17657", "vin": "RPXP1LHHVRE006925", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 60879, "battery_level": 88, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Trần Hoàng Hiệp", "driver_phone": "0398818996", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8476, "code": "N54511-261102-002", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 09:29:37", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "chuyển lên oto", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 9852312, "dms_ro_code": "N54511-WO-261102-0036", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 18:48:00", "repair_done_at": null, "quoted_at": "2026-11-04 18:48:00", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Feliz S", "plate": "59TA-04879", "vin": "RPXN4LHHVPE031547", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 99085, "battery_level": 100, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Vũ Mạnh Hải", "driver_phone": "0396595758", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8474, "code": "N54511-261102-001", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-11-02 08:54:51", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "chuyển RTO", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 3058529, "dms_ro_code": "N54511-WO-261102-0035", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 18:58:29", "repair_done_at": null, "quoted_at": "2026-11-04 18:58:29", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "50AA-38562", "vin": "RPXP1LHHVSE051693", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 95794, "battery_level": 53, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Thị Bình", "driver_phone": "0703664528", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (3 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 3}, {"id": 8471, "code": "N54511-261101-002", "status": "inspecting", "source": "retail", "priority": "normal", "service_type": "warranty", "received_at": "2026-11-01 08:14:10", "promised_at": "2026-11-01 12:30:00", "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": 17, "symptoms": "lỗi pin", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": "2026-11-01", "warranty_status": "checking", "faults": ["Lỗi PIN"], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": "khách lẻ bship", "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-02 11:08:44", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": ["pin"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP", "customer_phone": "0393369139", "model": "Feliz S", "plate": "65MA-088.36", "vin": "RPXN4LHHVRE009605", "branch_code": "N54511", "technician_name": null, "advisor_name": "Cao Lê Mỹ Linh", "created_by_name": "Cao Lê Mỹ Linh", "inspector_name": null, "fleet": "bship", "odometer": null, "battery_level": null, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Ong Vĩnh Trung", "driver_phone": "0972527363", "alerts": [{"key": "overdue", "label": "Quá hạn 4 ngày", "tone": "red", "hint": "Ưu tiên xử lý và báo GSM / khách"}], "alert_level": "red", "vf_category": "Sửa chữa thay thế Pin", "sla": {"code": "overdue", "label": "Quá hạn 4 ngày", "days": -4}, "days_in_shop": 4}, {"id": 8470, "code": "N54511-261101-001", "status": "waiting_repair", "source": "retail", "priority": "normal", "service_type": "warranty", "received_at": "2026-11-01 08:04:42", "promised_at": "2026-11-01 12:30:00", "completed_at": null, "delivered_at": null, "bay": null, "technician_id": 27, "advisor_id": 17, "symptoms": "lỗi pin", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": "2026-11-01", "warranty_status": "waiting_battery", "faults": ["Lỗi PIN"], "quote_amount": null, "dms_ro_code": null, "parts_status": null, "advisor_note": "khách lẻ xe nhà", "foreman_note": "Phú tháo pin 1-11", "branch_id": 2, "battery_serial_old": "BAT12006000110003094240522D00038", "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": "2026-11-01", "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": "2026-11-02", "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-02 15:50:09", "repair_done_at": null, "quoted_at": null, "vinfast_category": null, "warranty_kinds": ["pin"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "Nguyễn Hoàng Đức", "customer_phone": "0908521178", "model": "Evo 200", "plate": "59GA-16706", "vin": "RPXP2LHLVRE008983", "branch_code": "N54511", "technician_name": "Cao Trần Tấn Phú", "advisor_name": "Cao Lê Mỹ Linh", "created_by_name": "Cao Lê Mỹ Linh", "inspector_name": "Nguyễn Thành Trung", "fleet": "retail", "odometer": null, "battery_level": null, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "Nguyễn Hoàng Đức", "driver_phone": "0908521178", "alerts": [{"key": "overdue", "label": "Quá hạn 4 ngày", "tone": "red", "hint": "Ưu tiên xử lý và báo GSM / khách"}], "alert_level": "red", "vf_category": "Sửa chữa thay thế Pin", "sla": {"code": "overdue", "label": "Quá hạn 4 ngày", "days": -4}, "days_in_shop": 4}, {"id": 8449, "code": "N54511-261030-010", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-10-30 14:46:57", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txtl th +500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": "checking", "faults": ["Lỗi nút TopCover"], "quote_amount": 7380785, "dms_ro_code": "N54511-WO-261102-0034", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 08:55:54", "repair_done_at": null, "quoted_at": "2026-11-04 08:55:54", "vinfast_category": null, "warranty_kinds": ["topcover"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "50AA-12282", "vin": "RPXP1LHHVSE067540", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 32699, "battery_level": 66, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (6 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 6}, {"id": 8447, "code": "N54511-261030-009", "status": "gsm_rejected", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-10-30 14:22:08", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "ttth+500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 5557541, "dms_ro_code": "N54511-WO-261102-0033", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-05 15:04:28", "repair_done_at": null, "quoted_at": "2026-11-05 14:05:31", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-12718", "vin": "RPXP1LHHVPE065892", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 80635, "battery_level": 99, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (6 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 6}, {"id": 8443, "code": "N54511-261030-008", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-10-30 13:13:58", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txtl th +500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 13489030, "dms_ro_code": "N54511-WO-261102-0032", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 08:34:25", "repair_done_at": null, "quoted_at": "2026-11-04 08:34:25", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "50AA-38654", "vin": "RPXP1LHHVSE067370", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 38821, "battery_level": 89, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (6 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 6}, {"id": 8441, "code": "N54511-261030-007", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-10-30 11:36:38", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txtl th +500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": ["Lỗi giảm xóc trước"], "quote_amount": 10300338, "dms_ro_code": "N54511-WO-261102-0031", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 08:37:43", "repair_done_at": null, "quoted_at": "2026-11-04 08:37:43", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "29L1-99579", "vin": "RPXP1LHHVPE058688", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 1, "battery_level": 1, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (6 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 6}, {"id": 8439, "code": "N54511-261030-006", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-10-30 10:43:36", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txtl th +500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": null, "faults": [], "quote_amount": 4568321, "dms_ro_code": "N54511-WO-261102-0029", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 19:16:26", "repair_done_at": null, "quoted_at": "2026-11-04 19:16:26", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "50AC-19152", "vin": "RPXP1LHHVSE036044", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 39629, "battery_level": 94, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (6 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 6}, {"id": 8437, "code": "N54511-261030-005", "status": "waiting_repair", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-10-30 10:19:51", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txtl th +500CO2", "qc_fail_count": 0, "gsm_handover_at": "2026-11-04", "sla_due_at": "2026-11-07", "warranty_status": null, "faults": [], "quote_amount": 1533379, "dms_ro_code": "N54511-WO-261101-0021", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 09:23:56", "repair_done_at": null, "quoted_at": "2026-11-03 13:01:11", "vinfast_category": null, "warranty_kinds": [], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Evo 200", "plate": "59TA-11648", "vin": "RPXP1LHHVPE051570", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 59506, "battery_level": 90, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_tech", "label": "Chưa phân KTV", "tone": "amber", "hint": "Phân công kỹ thuật viên để bắt đầu sửa"}], "alert_level": "amber", "vf_category": "Sửa chữa chung", "sla": {"code": "ok", "label": "Trong hạn (2 ngày)", "days": 2}, "days_in_shop": 6}, {"id": 8434, "code": "N54511-261030-004", "status": "waiting_approval", "source": "gsm", "priority": "normal", "service_type": "liquidation", "received_at": "2026-10-30 09:58:52", "promised_at": null, "completed_at": null, "delivered_at": null, "bay": null, "technician_id": null, "advisor_id": null, "symptoms": "txtl th+500CO2", "qc_fail_count": 0, "gsm_handover_at": null, "sla_due_at": null, "warranty_status": "checking", "faults": ["Lỗi SCU"], "quote_amount": 13005000, "dms_ro_code": "N54511-WO-261102-0027", "parts_status": null, "advisor_note": null, "foreman_note": null, "branch_id": 2, "battery_serial_old": null, "battery_repair_type": null, "motor_serial_old": null, "motor_repair_type": null, "motor_serial_new": null, "coc_status": null, "parts_removed_at": null, "motor_removed_at": null, "dms_warranty_code": null, "dms_claim_code": null, "dms_warranty_status": null, "sent_factory_at": null, "missing_parts": null, "diagnosis": null, "started_at": null, "updated_at": "2026-11-04 19:18:15", "repair_done_at": null, "quoted_at": "2026-11-04 19:18:15", "vinfast_category": null, "warranty_kinds": ["esim"], "cust_pay_ro": null, "cust_pay_note": null, "cust_pay_amount": null, "gsm_pay_note": null, "gsm_pay_amount": null, "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", "customer_phone": "02439756699", "model": "Feliz S", "plate": "59TA-05144", "vin": "RPXN4LHHVPE038245", "branch_code": "N54511", "technician_name": null, "advisor_name": null, "created_by_name": "Ngũ Cẩm Ngọc", "inspector_name": "Ngũ Cẩm Ngọc", "fleet": "gsm", "odometer": 1, "battery_level": 1, "battery_level_2": null, "campaign_count": 0, "quote_url": null, "last_changed_by_name": null, "driver_name": "ko txe", "driver_phone": "0926223232", "alerts": [{"key": "no_handover", "label": "Chưa có ngày GSM bàn giao (6 ngày)", "tone": "amber", "hint": "Chưa tính SLA – nhắc GSM xác nhận"}], "alert_level": "amber", "vf_category": "Xe GSM chưa bàn giao sửa chữa", "sla": {"code": "not_counted", "label": "Chờ GSM bàn giao"}, "days_in_shop": 6}];


// ==================== QUẢN LÝ DỮ LIỆU ĐỀ XUẤT BẢO HÀNH DEALER PORTAL ====================
window.DEALER_CLAIMS_MAP = new Map();

function initDealerClaimsMap(){
  if (!window.DEALER_CLAIMS_MAP) window.DEALER_CLAIMS_MAP = new Map();
  
  // Nạp 100 đề xuất thực tế từ Dealer Portal
  const preloaded = (typeof DEALER_PORTAL_PRELOAD_CLAIMS !== 'undefined' && Array.isArray(DEALER_PORTAL_PRELOAD_CLAIMS)) 
    ? DEALER_PORTAL_PRELOAD_CLAIMS : [];
    
  let stored = [];
  try {
    const raw = localStorage.getItem('bh_dealer_claims');
    if (raw) stored = JSON.parse(raw);
  } catch(e){}

  const allClaims = [...preloaded, ...(Array.isArray(stored) ? stored : [])];
  allClaims.forEach(c => {
    if (!c) return;
    if (c.vin) {
      const v = String(c.vin).trim().toUpperCase();
      window.DEALER_CLAIMS_MAP.set(v, c);
      if (v.length >= 6) window.DEALER_CLAIMS_MAP.set(v.slice(-6), c);
    }
    if (c.workOrderNumber) {
      const woStr = String(c.workOrderNumber).trim().toUpperCase();
      window.DEALER_CLAIMS_MAP.set(woStr, c);
      const noWo = woStr.replace(/-WO-/i, '-');
      window.DEALER_CLAIMS_MAP.set(noWo, c);
    }
    if (c.warrantyClaimNumber) {
      window.DEALER_CLAIMS_MAP.set(String(c.warrantyClaimNumber).trim().toUpperCase(), c);
    }
  });

  // Tự động khởi tạo nguồn dữ liệu Doanh thu bảo hành nếu chưa có
  if (state.sources.length === 0 && preloaded.length > 0) {
    window.parseDealerPortalJson(preloaded, 'VinFast Dealer Portal (100 đề xuất đã duyệt)', false);
  }
}

window.parseDealerPortalJson = function(jsonData, srcName = 'Dealer Portal API (100 đề xuất)', triggerRender = true){
  let claims = [];
  if (typeof jsonData === 'string') {
    try { jsonData = JSON.parse(jsonData); } catch(e){ alert('Lỗi định dạng JSON: ' + e.message); return 0; }
  }
  if (Array.isArray(jsonData)) {
    claims = jsonData;
  } else if (jsonData && Array.isArray(jsonData.data)) {
    claims = jsonData.data;
  } else if (jsonData && Array.isArray(jsonData.rows)) {
    claims = jsonData.rows;
  } else if (jsonData && Array.isArray(jsonData.items)) {
    claims = jsonData.items;
  }
  if (!claims.length) {
    if (triggerRender) alert('Không tìm thấy danh sách đề xuất trong dữ liệu!');
    return 0;
  }

  // Cập nhật Map tra cứu
  if (!window.DEALER_CLAIMS_MAP) window.DEALER_CLAIMS_MAP = new Map();
  claims.forEach(c => {
    if (!c) return;
    if (c.vin) {
      const v = String(c.vin).trim().toUpperCase();
      window.DEALER_CLAIMS_MAP.set(v, c);
      if (v.length >= 6) window.DEALER_CLAIMS_MAP.set(v.slice(-6), c);
    }
    if (c.workOrderNumber) {
      const woStr = String(c.workOrderNumber).trim().toUpperCase();
      window.DEALER_CLAIMS_MAP.set(woStr, c);
      const noWo = woStr.replace(/-WO-/i, '-');
      window.DEALER_CLAIMS_MAP.set(noWo, c);
    }
    if (c.warrantyClaimNumber) {
      window.DEALER_CLAIMS_MAP.set(String(c.warrantyClaimNumber).trim().toUpperCase(), c);
    }
  });

  // Lưu trữ cục bộ
  try {
    localStorage.setItem('bh_dealer_claims', JSON.stringify(claims));
  } catch(e){}

  // Tạo Nguồn dữ liệu Định dạng 2 (Format 2: Dealer Portal)
  const src = {
    id: 'src_dp_' + Date.now(),
    name: srcName,
    status: 'OK',
    rows: claims.length,
    range: '',
    format: 2,
    recs: [],
    warn: []
  };

  const dates = [];
  const recs = claims.map(c => {
    const rec = newRecord();
    rec.id = String(c.warrantyClaimNumber || c.number || c.claim_code || c.id || '').trim();
    rec.wo = String(c.workOrderNumber || c.work_order || '').trim();
    rec.vin = String(c.vin || '').trim();
    rec.vehicle = String(c.model || c.vehicle || '').trim();
    rec.format = 2;
    rec.srcId = src.id;
    rec.srcName = src.name;

    const rawSt = String(c.status || '').toUpperCase();
    const normSt = norm(rawSt);
    if (rawSt === 'APPROVED' || normSt.includes('da phe duyet') || normSt.includes('da duyet') || normSt === 'hoan thanh' || rawSt.includes('PAID')) {
      rec.status = 'Đã phê duyệt';
    } else if (rawSt.includes('PENDING_LEVEL_2') || rawSt.includes('WAITING_LEVEL_2') || normSt.includes('cap 2') || normSt.includes('level 2')) {
      rec.status = 'Chờ duyệt cấp 2';
    } else if (rawSt.includes('PENDING_LEVEL_1') || rawSt.includes('WAITING_LEVEL_1') || normSt.includes('cap 1') || normSt.includes('level 1')) {
      rec.status = 'Chờ duyệt cấp 1';
    } else if (rawSt.includes('PENDING') || rawSt.includes('WAITING') || normSt.includes('cho duyet') || rawSt.includes('SUBMIT')) {
      rec.status = 'Chờ duyệt';
    } else if (rawSt.includes('CANCEL') || rawSt.includes('REJECT') || normSt.includes('tu choi') || normSt.includes('huy')) {
      rec.status = 'Từ chối / Hủy';
    } else {
      rec.status = c.status || 'Chờ duyệt';
    }

    const dVal = c.approvedDate || c.approved_at || c.createdAt || c.created_at || c.submitted_at;
    rec.date = parseDateVal(dVal);
    if (rec.date) dates.push(rec.date);

    const inc = Number(c.totalRequestedAmountInclTax || c.amount || 0) || 0;
    rec.totalInc = inc;
    rec.totalEx = Math.round(inc / 1.1);
    rec.total = inc;

    const cust = c.customer || {};
    rec.customerName = String(cust.customerName || c.customerName || '').trim();
    rec.customerCompanyName = String(cust.customerCompanyName || c.customerCompanyName || '').trim();
    
    // Tra cứu nguồn xe từ state.checkXe.orders qua VIN hoặc WO nếu có
    let matchedOrderInfo = null;
    if (state.checkXe && Array.isArray(state.checkXe.orders)) {
      const cVin = String(c.vin || '').trim().toUpperCase();
      const cWo = String(c.workOrderNumber || '').trim().toUpperCase();
      matchedOrderInfo = state.checkXe.orders.find(o => 
        (cVin && o.vin && o.vin.toUpperCase() === cVin) ||
        (cWo && o.wo && o.wo.toUpperCase() === cWo)
      );
    }

    const extraCustInfo = {
      source: c.source || (matchedOrderInfo ? matchedOrderInfo.source : ''),
      fleet: c.fleet || (matchedOrderInfo ? matchedOrderInfo.fleet : ''),
      note: c.note || c.reason || (matchedOrderInfo ? matchedOrderInfo.note : ''),
      claimTo: c.claimTo || ''
    };

    rec.customerGroup = getCustomerGroup(rec.customerName, rec.customerCompanyName, extraCustInfo);

    const retStat = evaluateClaimReturnStatus(
      c,
      c.status,
      c.approvalSequence,
      c.reason,
      c.returnLevel1Count,
      c.returnLevel2Count
    );
    rec.isReturnLevel1 = retStat.isReturnLevel1;
    rec.isReturnLevel2 = retStat.isReturnLevel2;
    rec.isReturned = retStat.isReturned;
    rec.isCancelled = Boolean(retStat.isCancelled);
    rec.returnLevelLabel = retStat.returnLevelLabel;
    rec.rejectReason = String(c.reason || '').trim();

    rec.parts = [{
      code: c.warrantyType || 'STANDARD',
      name: (c.customer && c.customer.customerName) ? c.customer.customerName : 'Bảo hành xe điện',
      qty: 1,
      priceInc: inc,
      priceEx: rec.totalEx,
      amountInc: inc,
      amountEx: rec.totalEx
    }];

    return rec;
  });

  src.recs = recs;
  if (dates.length) {
    const sorted = dates.slice().sort((a,b) => a - b);
    src.range = formatDisplayDate(sorted[0]) + ' - ' + formatDisplayDate(sorted[sorted.length - 1]);
  }

  state.sources = state.sources.filter(s => s.name !== srcName);
  state.sources.push(src);

  // Tự động cập nhật lại danh sách xe trong xưởng với Lệnh BH & ĐXBH vừa nạp
  rebuildCheckXeOrders();

  if (triggerRender) {
    saveSources();
    renderSources();
    renderAll();
    if (typeof window.switchTab === 'function') window.switchTab('overview');
    alert(`🎉 ĐÃ NẠP THÀNH CÔNG ${claims.length} ĐỀ XUẤT DEALER PORTAL VÀO DOANH THU & CHECK LỖI XE!`);
  }

  return claims.length;
};

// Hàm chuẩn hóa lại toàn bộ xe trong Check lỗi xe
function rebuildCheckXeOrders(){
  try {
    let rawList = [];
    const raw = localStorage.getItem('bh_checkxe_orders') || localStorage.getItem('serviceos_cached_orders');
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) rawList = p;
    }
    if (!rawList.length && typeof SERVICEOS_PRELOAD_ORDERS !== 'undefined') {
      rawList = SERVICEOS_PRELOAD_ORDERS;
    }
    if (rawList.length > 0) {
      state.checkXe.orders = rawList.map((d, i) => normalizeOrder(d, i));
      if (typeof renderCheckXe === 'function') renderCheckXe();
    }
  } catch(e){}
}

function loadCheckXeOrders(){
  window.loadCheckXeOrders = loadCheckXeOrders;
  initDealerClaimsMap();
  try {
    const raw = localStorage.getItem('bh_checkxe_orders');
    if(raw) {
      const data = JSON.parse(raw);
      if(Array.isArray(data) && data.length > 0){
        // Filter out corrupted rows without plate
        const valid = data.filter(d => {
          const p = d.plate || (d.work_order && d.work_order.plate);
          return p && p !== '—' && p !== '-';
        });
        if (valid.length > 0) {
          state.checkXe.orders = valid.map((d, i) => normalizeOrder(d, i));
          return;
        }
      }
    }
  } catch(e){}
  
  // Default to 50 real cars from ServiceOS if storage is empty or invalid
  if (Array.isArray(SERVICEOS_PRELOAD_ORDERS) && SERVICEOS_PRELOAD_ORDERS.length > 0) {
    state.checkXe.orders = SERVICEOS_PRELOAD_ORDERS.map((d, i) => normalizeOrder(d, i));
  }
}

window.resetToRealServiceOsCars = function() {
  if (Array.isArray(SERVICEOS_PRELOAD_ORDERS) && SERVICEOS_PRELOAD_ORDERS.length > 0) {
    state.checkXe.orders = SERVICEOS_PRELOAD_ORDERS.map((d, i) => normalizeOrder(d, i));
    saveCheckXeOrders();
    renderCheckXe();
    alert('✅ ĐÃ NẠP THÀNH CÔNG 50 XE THỰC TẾ TỪ SERVICEOS VÀO BẢNG!');
  }
};

function saveCheckXeOrders(){
  try {
    localStorage.setItem('bh_checkxe_orders', JSON.stringify(state.checkXe.orders));
  } catch(e){}
}

function isDateMatch(isoOrder, filterDate){
  if(!filterDate || filterDate === 'all') return true;
  if(!isoOrder) return true;

  const today = formatIsoDate(new Date());
  if(filterDate === 'today') return isoOrder === today;
  if(filterDate === 'yesterday'){
    const yest = new Date(); yest.setDate(yest.getDate() - 1);
    return isoOrder === formatIsoDate(yest);
  }
  if(filterDate === 'last7'){
    const limit = new Date(); limit.setDate(limit.getDate() - 7);
    return isoOrder >= formatIsoDate(limit);
  }
  return isoOrder === filterDate;
}

// Modal Handlers & Tab Switch
window.initServiceOsApiForm = function(){
  try {
    const savedUser = localStorage.getItem('bhpro_sos_user');
    const savedPass = localStorage.getItem('bhpro_sos_pass');
    const userEl = $('#serviceOsApiUser');
    const passEl = $('#serviceOsApiPass');
    const remEl = $('#serviceOsRememberMe');
    if(savedUser && userEl) userEl.value = savedUser;
    if(savedPass && passEl) {
      try { passEl.value = atob(savedPass); } catch(e){}
    }
    if(remEl && savedUser) remEl.checked = true;
  } catch(e){}
};

window.openBookmarkletModal = function(tab){
  const m = $('#modalBookmarklet');
  if(m) {
    m.hidden = false;
    const box = $('#bmConsoleCodeBox');
    if(box) box.value = getConsoleSnippetCode();
    if(typeof window.initServiceOsApiForm === 'function') window.initServiceOsApiForm();
    window.switchSyncTab(tab || 'api');
  }
};

window.closeBookmarkletModal = function(){
  const m = $('#modalBookmarklet');
  if(m) m.hidden = true;
};

window.switchSyncTab = function(tab){
  const tabs = ['api', 'extension', 'console', 'excel', 'paste'];
  tabs.forEach(t => {
    const el = $('#syncTab' + t.charAt(0).toUpperCase() + t.slice(1));
    const btn = $('#tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    if(el) el.style.display = (t === tab) ? 'block' : 'none';
    if(btn) {
      if(t === tab) {
        btn.classList.remove('secondary');
        if(t === 'api') {
          btn.style.background = 'linear-gradient(135deg,#0284c7,#0ea5e9)';
          btn.style.color = '#fff';
        }
      } else {
        btn.classList.add('secondary');
        if(t === 'api') {
          btn.style.background = '';
          btn.style.color = '';
        }
      }
    }
  });
};

window.syncServiceOsViaApi = async function(){
  const userEl = $('#serviceOsApiUser');
  const passEl = $('#serviceOsApiPass');
  const rememberEl = $('#serviceOsRememberMe');
  const statusEl = $('#serviceOsApiStatus');
  const btnEl = $('#btnSyncServiceOsApi');

  const username = (userEl ? userEl.value : '').trim();
  const password = passEl ? passEl.value : '';

  if (!username || !password) {
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.style.background = 'rgba(239, 68, 68, 0.15)';
      statusEl.style.border = '1px solid #ef4444';
      statusEl.style.color = '#fca5a5';
      statusEl.innerHTML = '⚠️ Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu ServiceOS!';
    }
    if (!username && userEl) userEl.focus();
    else if (!password && passEl) passEl.focus();
    return;
  }

  // Lưu thông tin đăng nhập nếu chọn Remember
  try {
    if (rememberEl && rememberEl.checked) {
      localStorage.setItem('bhpro_sos_user', username);
      localStorage.setItem('bhpro_sos_pass', btoa(password));
    } else {
      localStorage.removeItem('bhpro_sos_user');
      localStorage.removeItem('bhpro_sos_pass');
    }
  } catch (e) {}

  // Hiển thị trạng thái đang tải
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite">⏳</span> Đang kết nối ServiceOS...';
  }
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.style.background = 'rgba(2, 132, 199, 0.15)';
    statusEl.style.border = '1px solid #0284c7';
    statusEl.style.color = '#7dd3fc';
    statusEl.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;margin-right:6px">⏳</span> Đang xác thực tài khoản và kéo 481 xe qua API...';
  }

  // Danh sách các cổng API kết nối thông minh (ưu tiên local proxy trên máy -> Cloudflare Worker)
  const candidateUrls = [
    'http://127.0.0.1:8787/api/sync-serviceos',
    window.location.protocol === 'file:' ? 'https://fragrant-heart-e2d4.truongtruong-05072000.workers.dev/api/sync-serviceos' : '/api/sync-serviceos',
    'https://fragrant-heart-e2d4.truongtruong-05072000.workers.dev/api/sync-serviceos'
  ];
  const apiUrls = [...new Set(candidateUrls)];

  let lastErr = null;
  let successData = null;

  for (const url of apiUrls) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 25000);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        signal: ctrl.signal
      });
      clearTimeout(timer);

      if (res.status === 404) {
        lastErr = new Error(`Máy chủ tại ${url} chưa cấu hình API (404)`);
        continue;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Lỗi máy chủ (${res.status})`);
      }

      successData = data;
      break; // Thành công!
    } catch(err) {
      lastErr = err;
      if (err.message && (err.message.includes('không đúng') || err.message.includes('401'))) {
        break;
      }
    }
  }

  try {
    if (!successData) {
      throw lastErr || new Error('Không thể kết nối đến máy chủ API!');
    }

    const rawRows = successData.orders || [];
    if (!rawRows.length) {
      throw new Error('Đăng nhập thành công nhưng không tìm thấy xe nào trong mục "Xe đang trong xưởng"!');
    }

    // Phân tích và chuẩn hóa theo 4 quy tắc
    const orders = rawRows.map((d, i) => normalizeOrder(d, i));
    state.checkXe.orders = orders;
    saveCheckXeOrders();

    if (statusEl) {
      statusEl.style.background = 'rgba(16, 185, 129, 0.15)';
      statusEl.style.border = '1px solid #10b981';
      statusEl.style.color = '#6ee7b7';
      statusEl.innerHTML = `🎉 <b>Thành công!</b> Đã kéo <b>${orders.length}</b> xe và phân tích 4 quy tắc tự động. Đang chuyển giao diện...`;
    }

    setTimeout(() => {
      closeBookmarkletModal();
      if (typeof window.switchTab === 'function') window.switchTab('checkxe');
      renderCheckXe();
      alert(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ${orders.length} XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!`);
    }, 700);

  } catch (err) {
    console.error('[ServiceOS Sync Error]', err);
    if (statusEl) {
      statusEl.style.background = 'rgba(239, 68, 68, 0.15)';
      statusEl.style.border = '1px solid #ef4444';
      statusEl.style.color = '#fca5a5';
      statusEl.innerHTML = `❌ <b>Không thể đồng bộ:</b> ${err.message || String(err)}<br><small style="color:#f87171">Kiểm tra lại tài khoản/mật khẩu ServiceOS hoặc dùng tiện ích Chrome ở tab bên cạnh.</small>`;
    }
  } finally {
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.innerHTML = '⚡ ĐĂNG NHẬP & KÉO 481 XE TỰ ĐỘNG';
    }
  }
};

window.copyExtensionPath = function(){
  const path = 'C:\\Users\\nhu truong\\OneDrive\\Tài liệu\\bảo hành\\TienIch_Chrome_ServiceOS';
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(path).then(() => {
      alert('📋 Đã sao chép đường dẫn thư mục tiện ích vào bộ nhớ tạm:\n' + path + '\n\nHãy vào chrome://extensions -> Tải tiện ích đã giải nén -> Dán đường dẫn này vào!');
    });
  } else {
    prompt('Đường dẫn thư mục tiện ích:', path);
  }
};

// Đăng nhập trực tiếp ServiceOS và kéo dữ liệu
window.loginAndFetchServiceOs = async function(){
  const uInp = $('#soUsername');
  const pInp = $('#soPassword');
  const msgEl = $('#soLoginMsg');
  const btn = $('#btnSoLogin');

  const username = uInp ? uInp.value.trim() : '';
  const password = pInp ? pInp.value.trim() : '';

  if(!username || !password){
    alert('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu ServiceOS!');
    return;
  }

  if(msgEl){
    msgEl.style.display = 'block';
    msgEl.style.color = '#2563eb';
    msgEl.innerHTML = '⏳ Đang đăng nhập và lấy dữ liệu từ ServiceOS...';
  }
  if(btn) btn.disabled = true;

  try {
    // Thử gọi proxy Cloudflare hoặc endpoint nội bộ
    const proxyUrl = window.location.origin.includes('pages.dev') ? '/api/serviceos' : 'https://phan-tich-bao-hanh.pages.dev/api/serviceos';
    
    let loginRes = await fetch(proxyUrl + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if(!loginRes.ok){
      throw new Error('Đăng nhập không thành công (HTTP ' + loginRes.status + '). Vui lòng kiểm tra lại tài khoản hoặc sử dụng Cách 2: Tiện ích 1-Click.');
    }

    // Đăng nhập thành công, kéo danh sách xe active
    let woRes = await fetch(proxyUrl + '/work-orders?status=active&page=1&page_size=500');
    if(!woRes.ok){
      throw new Error('Lỗi tải dữ liệu lệnh sửa chữa: HTTP ' + woRes.status);
    }

    const d = await woRes.json();
    const rows = d.rows || d.items || [];
    if(!rows.length){
      alert('Đã kết nối thành công nhưng hiện tại không có xe nào trong mục "Xe đang trong xưởng"!');
      return;
    }

    const orders = rows.map((w, idx) => normalizeOrder(w, idx));
    state.checkXe.orders = orders;
    saveCheckXeOrders();
    renderCheckXe();
    closeBookmarkletModal();
    alert(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ${orders.length} XE TRỰC TIẾP TỪ SERVICEOS!`);
  } catch(err){
    if(msgEl){
      msgEl.style.display = 'block';
      msgEl.style.color = '#dc2626';
      msgEl.innerHTML = '❌ ' + err.message + '<br><small>Gợi ý: Nếu đang chạy trên máy local, bạn chỉ cần dùng <b>Cách 2 (Nút 1-Click trên ServiceOS)</b> là tiện nhất!</small>';
    }
  } finally {
    if(btn) btn.disabled = false;
  }
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
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px">
        Trạng thái check: <b>${esc(o.checkStatus.label)}</b> · Ngày nhận: <b>${esc(o.dateStr)}</b>
      </div>
      ${o.updateTableText ? `<div style="font-size:11.5px;color:#15803d;margin-top:4px;background:#f0fdf4;padding:4px 8px;border-radius:4px">📦 <b>Bảng cập nhật:</b> ${esc(o.updateTableText)}</div>` : '<div style="font-size:11.5px;color:#dc2626;margin-top:4px">⚠️ <i>Chưa có bảng cập nhật linh kiện/PIN phía dưới</i></div>'}
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
  order.hasKtvNote = hasTextContent(newNote);
  order.checkStatus = evaluateCheckStatus(order.hasLoi, order.hasKtvNote, order.hasBangCapNhat);
  order.isChecked = order.checkStatus.code === 'checked';
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
  order.hasKtvNote = true;
  order.checkStatus = evaluateCheckStatus(order.hasLoi, order.hasKtvNote, order.hasBangCapNhat);
  order.isChecked = order.checkStatus.code === 'checked';
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

window.setCheckXeStatus = function(status){
  state.checkXe.filterStatus = status;
  renderCheckXe();
};

window.setCheckXeDate = function(dateStr){
  state.checkXe.filterDate = dateStr;
  renderCheckXe();
};

window.setCheckXeTech = function(t){
  state.checkXe.filterTech = t;
  renderCheckXe();
};

window.setCheckXeVehicle = function(v){
  state.checkXe.filterVehicle = v;
  renderCheckXe();
};

window.setCheckXeHasTable = function(val){
  state.checkXe.filterHasTable = val;
  renderCheckXe();
};

window.setCheckXeHasNote = function(val){
  state.checkXe.filterHasNote = val;
  renderCheckXe();
};

window.setCheckXeSearch = function(q){
  state.checkXe.searchQuery = q;
  renderCheckXe();
};

window.setCheckXeColFilter = function(key, val){
  state.checkXe[key] = val;
  renderCheckXe();
};

window.setCheckXeViewMode = function(mode){
  state.checkXe.viewMode = mode;
  renderCheckXe();
};

// Sắp xếp cột khi nhấp vào tiêu đề
window.setCheckXeSort = function(col){
  if(state.checkXe.sortBy === col){
    state.checkXe.sortDir = state.checkXe.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    state.checkXe.sortBy = col;
    state.checkXe.sortDir = 'asc';
  }
  renderCheckXe();
};

// Xóa tất cả bộ lọc về mặc định
window.resetCheckXeFilters = function(){
  state.checkXe.filterCategory = 'all';
  state.checkXe.filterStatus = 'all';
  state.checkXe.filterDate = 'all';
  state.checkXe.filterCustGroup = '';
  state.checkXe.filterUnsubmitted = 'all';
  state.checkXe.filterTech = '';
  state.checkXe.filterVehicle = '';
  state.checkXe.filterHasTable = 'all';
  state.checkXe.filterHasNote = 'all';
  state.checkXe.filterPartStatus = 'all';
  state.checkXe.searchPartSerial = '';
  state.checkXe.searchBhCode = '';
  state.checkXe.filterRemovedDate = 'all';
  state.checkXe.searchPlate = '';
  state.checkXe.searchQuery = '';
  state.checkXe.sortBy = 'stt';
  state.checkXe.sortDir = 'asc';
  renderCheckXe();
};

// Xuất Excel danh sách xe theo bộ lọc hoặc toàn bộ
window.exportCheckXeExcel = function(mode = 'filtered'){
  const allOrders = state.checkXe.orders || [];
  if(!allOrders.length){ alert('Không có dữ liệu xe để xuất Excel!'); return; }
  
  const ordersToExport = (mode === 'all') ? allOrders : (window.currentFilteredCheckXeOrders || allOrders);
  if(!ordersToExport.length){
    alert('Danh sách xe hiện tại đang trống theo bộ lọc!');
    return;
  }
  
  const rows = [
    [
      'STT',
      'Biển số xe',
      'Mã lệnh sửa chữa (WO)',
      'Dòng xe',
      'Số khung (VIN)',
      'Kỹ thuật viên phụ trách',
      'Hạng mục lỗi',
      'Nội dung kiểm tra / Lỗi chi tiết',
      'Bảng cập nhật phía dưới (PIN/Động cơ/Serial/Lệnh BH)',
      'Ghi chú KTV (Dữ liệu check)',
      'Ngày nhận xe',
      'Trạng thái Check',
      'Trạng thái xe trong xưởng'
    ]
  ];
  
  ordersToExport.forEach((o, idx) => {
    rows.push([
      idx + 1,
      o.plate || '—',
      o.wo || '—',
      o.vehicle || '—',
      o.vin || '—',
      o.tech || 'Chưa phân công',
      o.category ? o.category.name : 'Lỗi khác',
      o.issue || '—',
      o.hasBangCapNhat ? o.updateTableText : 'Chưa có bảng cập nhật',
      o.hasKtvNote ? o.note : 'Trống',
      o.dateStr || '—',
      o.checkStatus ? o.checkStatus.label.replace(/^[^\w\s]+/, '').trim() : 'Chưa check',
      o.status || 'Trong xưởng'
    ]);
  });
  
  const ws = XLSX.utils.aoa_to_sheet(rows);
  
  // Thiết lập độ rộng cột cho file Excel đẹp mắt, chuyên nghiệp
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 16 }, // Biển số
    { wch: 22 }, // Mã WO
    { wch: 14 }, // Dòng xe
    { wch: 22 }, // VIN
    { wch: 22 }, // KTV
    { wch: 20 }, // Hạng mục
    { wch: 38 }, // Nội dung lỗi
    { wch: 45 }, // Bảng cập nhật
    { wch: 30 }, // Ghi chú KTV
    { wch: 14 }, // Ngày nhận
    { wch: 18 }, // Trạng thái Check
    { wch: 16 }  // Trạng thái xưởng
  ];
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSachCheckXe');
  const nowStr = formatIsoDate(new Date());
  const modeTag = mode === 'all' ? 'TatCa' : 'DaLoc';
  const fileName = `Check_Loi_Xe_ServiceOS_${modeTag}_${nowStr}.xlsx`;
  XLSX.writeFile(wb, fileName);
  alert(`✅ ĐÃ XUẤT THÀNH CÔNG ${ordersToExport.length} XE RA FILE EXCEL:
📁 ${fileName}`);
};

// Render giao diện Check lỗi xe hàng ngày (Thiết kế hiện đại, thông minh, không bị khuất)
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

  // Lọc Chưa làm Đề xuất bảo hành (Cảnh báo lệnh có Phân loại TT là bảo hành nhưng chưa có mã WC)
  if(state.checkXe.filterUnsubmitted === 'yes'){
    filtered = filtered.filter(o => o.isUnsubmittedWarranty);
  }

  // Lọc theo Nhóm khách hàng (GSM, Bship, Khách lẻ, Doanh nghiệp)
  if(state.checkXe.filterCustGroup && state.checkXe.filterCustGroup !== 'all'){
    filtered = filtered.filter(o => o.customerGroup && o.customerGroup.id === state.checkXe.filterCustGroup);
  }

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
                      Boolean(state.checkXe.filterCustGroup && state.checkXe.filterCustGroup !== 'all') ||
                      Boolean(state.checkXe.filterUnsubmitted === 'yes') || 
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

    // Cell thông tin xe kết hợp (Biển số + Dòng xe + WO + VIN + Nhóm Khách hàng)
    const custGrp = o.customerGroup || getCustomerGroup(o.customer, o.customerCompanyName);
    const carInfoCellHtml = `
      <div class="car-info-cell">
        <div class="car-info-row1">
          <span class="car-plate">${esc(o.plate || '—')}</span>
          ${o.vehicle && o.vehicle !== '—' ? `<span class="car-vehicle-pill">${esc(o.vehicle)}</span>` : ''}
          <span class="cust-tag" style="font-size:10px;padding:1px 6px;border-radius:4px;font-weight:700;background:${custGrp.color}22;color:${custGrp.color};border:1px solid ${custGrp.color}45" title="Khách hàng: ${esc(o.customer)}">${custGrp.tag}</span>
        </div>
        <div class="car-info-row2">
          <span class="car-wo" title="Mã phiếu sửa chữa WO">${esc(o.wo || '—')}</span>
          ${o.vin ? `<span class="car-vin" title="Số khung VIN">VIN: ...${esc(String(o.vin).slice(-6))}</span>` : ''}
          ${o.isUnsubmittedWarranty ? `<span style="font-size:10px;padding:1px 5px;border-radius:3px;font-weight:700;background:rgba(239,68,68,0.22);color:#fca5a5;border:1px solid rgba(239,68,68,0.5)" title="Lệnh có Phân loại TT là Bảo hành nhưng chưa có mã ĐXBH trên Dealer Portal">⚠️ Chưa làm ĐX</span>` : ''}
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
        ${allOrders.filter(o => o.isUnsubmittedWarranty).length > 0 ? `
          <button class="scope-toggle-btn ${state.checkXe.filterUnsubmitted === 'yes' ? 'active' : ''}" style="border-color:rgba(239,68,68,0.5);color:#fca5a5;background:rgba(239,68,68,0.18);font-weight:700" onclick="setCheckXeColFilter('filterUnsubmitted', state.checkXe.filterUnsubmitted === 'yes' ? 'all' : 'yes')" title="Lọc các lệnh sửa chữa có Phân loại TT là Bảo hành nhưng chưa có mã ĐXBH">
            ⚠️ Chưa làm ĐX (${allOrders.filter(o => o.isUnsubmittedWarranty).length})
          </button>
        ` : ''}
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
        <!-- Lọc Nhóm Khách Hàng -->
        <div class="filter-select-wrapper">
          <span class="filter-label">Khách:</span>
          <select class="filter-select" onchange="setCheckXeColFilter('filterCustGroup', this.value)">
            <option value="">-- Mọi nhóm khách --</option>
            <option value="gsm" ${state.checkXe.filterCustGroup === 'gsm' ? 'selected' : ''}>🚕 GSM (Xanh SM)</option>
            <option value="bship" ${state.checkXe.filterCustGroup === 'bship' ? 'selected' : ''}>🛵 Bship</option>
            <option value="retail" ${state.checkXe.filterCustGroup === 'retail' ? 'selected' : ''}>👤 Khách lẻ</option>
            <option value="corp" ${state.checkXe.filterCustGroup === 'corp' ? 'selected' : ''}>🏢 Doanh nghiệp</option>
          </select>
        </div>

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
    const wo = String(pickCol(map, row, ['ma lenh sua chua', 'lenh sua chua', 'ma phieu', 'wo', 'dms_ro_code', 'code']) || '').trim();
    if(!plate && !wo) continue;
    
    const vin = String(pickCol(map, row, ['vin', 'so khung']) || '').trim();
    const vehicle = String(pickCol(map, row, ['dong xe', 'loai xe', 'model']) || '').trim();
    const customer = String(pickCol(map, row, ['khach hang', 'khach']) || '').trim();
    const tech = String(pickCol(map, row, ['ktv sua chua, bao hanh', 'ktv sua chua', 'ky thuat vien', 'ktv', 'tho']) || '').trim();
    
    // Hạng mục lỗi
    const issue = String(pickCol(map, row, ['hang muc loi', 'hang muc', 'noi dung kiem tra', 'noi dung sua chua', 'noi dung', 'loi', 'yeu cau khach hang', 'ly do vao xuong', 'trieu chung', 'chan doan']) || '').trim();
    
    // Ghi chú KTV
    const note = String(pickCol(map, row, ['ghi chu cua ky thuat vien', 'ghi chu cua quan doc & ky thuat vien', 'ghi chu cua quan doc', 'ghi chu ktv', 'ghi chu', 'chan doan cua ktv']) || '').trim();
    
    // Bảng cập nhật phía dưới
    const pinSerial = String(pickCol(map, row, ['serial pin', 'so serial pin', 'pin serial', 'pin_serial', 'battery_serial']) || '').trim();
    const motorSerial = String(pickCol(map, row, ['so may dong co', 'so may', 'serial dong co', 'motor_serial']) || '').trim();
    const removedAt = String(pickCol(map, row, ['ngay thao pin/dong co', 'ngay thao pin', 'ngay thao', 'removed_at']) || '').trim();
    const bhCode = String(pickCol(map, row, ['lenh bao hanh', 'ma lenh bao hanh', 'lenh bh', 'bh_code', 'bh_order_code']) || '').trim();
    const pinType = String(pickCol(map, row, ['loai sua chua pin', 'loai pin', 'pin_type']) || '').trim();
    
    const status = String(pickCol(map, row, ['trang thai', 'tinh trang', 'status']) || 'Trong xưởng').trim();
    const warrantyStatus = String(pickCol(map, row, ['trang thai bao hanh', 'tinh trang bao hanh', 'bao hanh', 'warranty']) || '').trim();
    const dateVal = parseDateVal(pickCol(map, row, ['ngay nhan xe', 'ngay nhan xe cho sc', 'ngay tao', 'ngay sua chua/bao hanh', 'ngay'])) || new Date();
    
    const o = normalizeOrder({
      id: 'ord_' + (wo || plate).replace(/[^a-zA-Z0-9]/g, '') + '_' + r,
      wo: wo || '—',
      plate: plate || '—',
      vin: vin || '—',
      vehicle: vehicle || '—',
      customer: customer || '—',
      tech: tech || 'Chưa phân công',
      issue: issue,
      note: note,
      status: status,
      warrantyStatus: warrantyStatus,
      pinSerial: pinSerial,
      motorSerial: motorSerial,
      removedAt: removedAt,
      bhCode: bhCode,
      pinType: pinType,
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
// Nhận dữ liệu qua window.postMessage từ ServiceOS
/* ==================== REAL-TIME SYNCHRONIZATION SYSTEM ==================== */
function showRealtimeToast(msg, icon = '⚡') {
  let t = document.getElementById('bhRealtimeToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'bhRealtimeToast';
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.95));border:1.5px solid #10b981;box-shadow:0 10px 30px rgba(16,185,129,0.35);color:#fff;padding:12px 18px;border-radius:10px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;transition:all 0.3s ease;transform:translateY(100px);opacity:0;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.innerHTML = `<span style="font-size:18px">${icon}</span> <span>${msg}</span>`;
  t.style.transform = 'translateY(0)';
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.style.transform = 'translateY(100px)';
    t.style.opacity = '0';
  }, 4000);
}

let lastServiceOsSyncTime = null;
let lastDealerPortalSyncTime = null;

function updateRealtimeStatusChip() {
  const stEl = document.getElementById('ctxRealtimeStatus');
  if (!stEl) return;
  
  // Kiểm tra xem đã có đề xuất Dealer Portal chưa (kể cả nạp sẵn hoặc qua mạng)
  const hasClaimsData = (window.DEALER_CLAIMS_MAP && window.DEALER_CLAIMS_MAP.size > 0) || 
                        state.sources.some(s => s.name.includes('Dealer Portal'));
  const hasServiceOs = Boolean(lastServiceOsSyncTime);
  const hasDealer = Boolean(lastDealerPortalSyncTime) || hasClaimsData;

  if (hasServiceOs && hasDealer) {
    stEl.innerHTML = `<span style="color:#34d399">ServiceOS & Dealer Portal</span> <span style="font-size:10.5px;color:#94a3b8">(Đã đồng bộ cả 2)</span>`;
  } else if (hasServiceOs) {
    stEl.innerHTML = `<span style="color:#38bdf8">ServiceOS đã cập nhật</span> · <span style="color:#f59e0b">Chờ mở tab Dealer Portal</span>`;
  } else if (hasDealer) {
    stEl.innerHTML = `<span style="color:#f59e0b">Dealer Portal đã cập nhật</span> · <span style="color:#38bdf8">Chờ ServiceOS</span>`;
  } else {
    stEl.textContent = 'Tự động 100%';
  }
}


// Hàm Cập nhật đè dữ liệu xe ServiceOS (Upsert - Không xóa dữ liệu cũ)
function upsertServiceOsOrders(newRawOrders) {
  if (!Array.isArray(newRawOrders) || newRawOrders.length === 0) return { addedCount: 0, updatedCount: 0, total: (state.checkXe.orders ? state.checkXe.orders.length : 0) };
  
  if (!state.checkXe.orders) state.checkXe.orders = [];

  // Tạo Map tra cứu xe hiện tại theo ID, Code, VIN
  const orderMap = new Map();
  state.checkXe.orders.forEach((o, idx) => {
    if (o.id) orderMap.set('id:' + o.id, idx);
    if (o.code) orderMap.set('code:' + String(o.code).trim().toUpperCase(), idx);
    if (o.vin) orderMap.set('vin:' + String(o.vin).trim().toUpperCase(), idx);
  });

  let addedCount = 0;
  let updatedCount = 0;
  const newItems = [];

  const activeIncomingKeys = new Set();

  newRawOrders.forEach(raw => {
    if (!raw) return;
    // Bỏ qua các xe đã giao hoặc hủy
    const st = String(raw.status || '').toLowerCase();
    if (st === 'delivered' || st === 'cancelled' || st === 'đã giao' || st === 'hủy') return;

    const rawId = raw.id ? 'id:' + raw.id : null;
    const rawCode = raw.code ? 'code:' + String(raw.code).trim().toUpperCase() : null;
    const rawVin = raw.vin ? 'vin:' + String(raw.vin).trim().toUpperCase() : null;

    if (rawId) activeIncomingKeys.add(rawId);
    if (rawCode) activeIncomingKeys.add(rawCode);
    if (rawVin) activeIncomingKeys.add(rawVin);

    let existingIdx = -1;
    if (rawId && orderMap.has(rawId)) existingIdx = orderMap.get(rawId);
    else if (rawCode && orderMap.has(rawCode)) existingIdx = orderMap.get(rawCode);
    else if (rawVin && orderMap.has(rawVin)) existingIdx = orderMap.get(rawVin);

    const norm = normalizeOrder(raw);

    if (existingIdx !== -1) {
      // CẬP NHẬT ĐÈ LÊN XE ĐÃ CÓ: Giữ nguyên ghi chú người dùng đã sửa nếu có
      const existing = state.checkXe.orders[existingIdx];
      const userNote = existing.userNote || existing._userEditedNote;
      Object.assign(existing, norm);
      if (userNote) existing.note = userNote;
      existing._inActiveBatch = true;
      updatedCount++;
    } else {
      // XE MỚI: Thêm vào danh sách
      norm._inActiveBatch = true;
      newItems.push(norm);
      addedCount++;
    }
  });

  // Nếu đây là đợt sync quy mô toàn xưởng (>= 50 xe):
  // Chỉ giữ đúng các xe đang thực sự có mặt trong xưởng theo đợt sync này
  if (newRawOrders.length >= 50) {
    const updatedExisting = state.checkXe.orders.filter(o => {
      const oId = o.id ? 'id:' + o.id : null;
      const oCode = o.code ? 'code:' + String(o.code).trim().toUpperCase() : null;
      const oVin = o.vin ? 'vin:' + String(o.vin).trim().toUpperCase() : null;
      return (oId && activeIncomingKeys.has(oId)) || 
             (oCode && activeIncomingKeys.has(oCode)) || 
             (oVin && activeIncomingKeys.has(oVin)) ||
             o._inActiveBatch;
    });
    state.checkXe.orders = [...newItems, ...updatedExisting];
  } else if (newItems.length > 0) {
    state.checkXe.orders = [...newItems, ...state.checkXe.orders];
  }

  // Đánh lại số thứ tự
  state.checkXe.orders.forEach((o, i) => { o._idx = i + 1; });

  // Lưu lại vào localStorage cache
  saveCheckXeOrders();

  return { addedCount, updatedCount, total: state.checkXe.orders.length };
}

// Hàm Cập nhật đè đề xuất Dealer Portal lên hệ thống
function upsertDealerPortalClaims(claims) {
  if (!claims) return 0;
  const list = Array.isArray(claims) ? claims : (claims.data || claims.rows || claims.items || []);
  if (!Array.isArray(list) || list.length === 0) return 0;

  // Cập nhật DEALER_CLAIMS_MAP đè lên
  if (!window.DEALER_CLAIMS_MAP) window.DEALER_CLAIMS_MAP = new Map();
  list.forEach(c => {
    if (!c) return;
    if (c.vin) {
      const v = String(c.vin).trim().toUpperCase();
      window.DEALER_CLAIMS_MAP.set(v, c);
      if (v.length >= 6) window.DEALER_CLAIMS_MAP.set(v.slice(-6), c);
    }
    if (c.workOrderNumber) {
      const woStr = String(c.workOrderNumber).trim().toUpperCase();
      window.DEALER_CLAIMS_MAP.set(woStr, c);
      const noWo = woStr.replace(/-WO-/i, '-');
      window.DEALER_CLAIMS_MAP.set(noWo, c);
    }
    if (c.warrantyClaimNumber) {
      window.DEALER_CLAIMS_MAP.set(String(c.warrantyClaimNumber).trim().toUpperCase(), c);
    }
  });

  // Hợp nhất vào nguồn Doanh thu (state.sources)
  window.parseDealerPortalJson(list, 'VinFast Dealer Portal (Real-time)', false);

  // Cập nhật đè Lệnh BH / ĐXBH lên các xe hiện tại mà không xóa danh sách xe
  if (state.checkXe && state.checkXe.orders) {
    state.checkXe.orders.forEach((o, i) => {
      const reNorm = normalizeOrder(o._raw || o, i);
      o.wo = reNorm.wo;
      o.dealerWo = reNorm.wo;
      if (reNorm.bhCode && reNorm.bhCode !== '—') o.bhCode = reNorm.bhCode;
      if (reNorm.claimCode && reNorm.claimCode !== '—') o.claimCode = reNorm.claimCode;
      if (reNorm.claimAmount) o.claimAmount = reNorm.claimAmount;
      if (reNorm.claimStatus) o.claimStatus = reNorm.claimStatus;
      if (reNorm.checkStatus) o.checkStatus = reNorm.checkStatus;
      if (reNorm.hasBangCapNhat !== undefined) o.hasBangCapNhat = reNorm.hasBangCapNhat;
      o.bhCodeText = reNorm.bhCodeText;
      o.claimCodeText = reNorm.claimCodeText;
    });
    saveCheckXeOrders();
  }

  return list.length;
}

function handleServiceOsRealtimeOrders(orders, isSilent = true) {
  if (!Array.isArray(orders) || orders.length === 0) return;
  lastServiceOsSyncTime = Date.now();
  
  // CẬP NHẬT ĐÈ LÊN XE ĐÃ CÓ - KHÔNG XÓA DỮ LIỆU CŨ
  const res = upsertServiceOsOrders(orders);
  
  // Cập nhật giao diện mượt mà tại chỗ (không xóa trắng hay nháy màn hình)
  if (typeof renderCheckXe === 'function') {
    renderCheckXe({ inPlace: true });
  }

  const changeTxt = res.addedCount > 0 ? ` (+${res.addedCount} xe mới)` : (res.updatedCount > 0 ? ` (cập nhật ${res.updatedCount} xe)` : '');
  showRealtimeToast(`Đã đồng bộ ${res.total} xe ServiceOS!${changeTxt}`, '🚗');
  updateRealtimeStatusChip();
}


function handleDealerPortalLineItems(items, url) {
  if (!Array.isArray(items) || items.length === 0 || !url) return;
  const m = url.match(/escooter-work-orders\/([a-zA-Z0-9_\-]+)/i) || url.match(/work-orders\/([a-zA-Z0-9_\-]+)/i);
  if (!m) return;
  const woKey = m[1];

  if (state.checkXe && Array.isArray(state.checkXe.orders)) {
    let updated = false;
    state.checkXe.orders.forEach(o => {
      const match = (o.id && String(o.id).includes(woKey)) || 
                    (o.wo && String(o.wo).includes(woKey)) || 
                    (o._raw && (String(o._raw.id).includes(woKey) || String(o._raw.code).includes(woKey)));
      if (match) {
        if (url.includes('part-line-items')) {
          o.part_line_items = items;
          if (o._raw) o._raw.part_line_items = items;
        } else {
          o.line_items = items;
          if (o._raw) o._raw.line_items = items;
        }
        const reNorm = normalizeOrder(o._raw || o);
        Object.assign(o, reNorm);
        updated = true;
      }
    });
    if (updated) {
      computeAll();
      renderAll();
      if (typeof renderCheckXe === 'function') renderCheckXe({ inPlace: true });
    }
  }
}
window.handleDealerPortalLineItems = handleDealerPortalLineItems;


function updateOverviewKpisInPlace() {
  const C = state.computed;
  if (!C) return;
  const expEl = document.getElementById('ctxExpectedVal');
  if (expEl) expEl.textContent = fmtT(C.expectedPlan) + ' tr (' + fmtN(C.expectedPlan / (settings.target || 1) * 100, 1) + '%)';
  const brkEl = document.getElementById('customerBreakdownContainer');
  if (brkEl && C.customerBreakdown && typeof renderCustomerBreakdownHtml === 'function') {
    brkEl.innerHTML = renderCustomerBreakdownHtml(C.customerBreakdown);
  }
}

function handleDealerPortalRealtimeClaims(claims) {
  if (!claims) return;
  lastDealerPortalSyncTime = Date.now();
  
  // CẬP NHẬT ĐÈ ĐỀ XUẤT DEALER PORTAL TẠI CHỖ - KHÔNG XÓA DỮ LIỆU CŨ
  const count = upsertDealerPortalClaims(claims);
  
  // Cập nhật tính toán trong bộ nhớ
  if (typeof computeAll === 'function') computeAll();

  // Xác định tab đang mở để chỉ cập nhật tại chỗ tab đó, không xóa trắng màn hình
  const activeTabEl = document.querySelector('.nav-tab.active');
  const curTab = activeTabEl ? activeTabEl.dataset.tab : '';

  if (curTab === 'checkxe' && typeof renderCheckXe === 'function') {
    renderCheckXe({ inPlace: true });
  } else if (curTab === 'overview') {
    // Chỉ cập nhật các số liệu KPI và cơ cấu mà không render lại toàn bộ container
    renderRulePanel(state.computed);
    updateOverviewKpisInPlace();
  }

  showRealtimeToast(`Đã cập nhật ${count} đề xuất bảo hành từ Dealer Portal!`, '💼');
  updateRealtimeStatusChip();
}

// 1. Lắng nghe BroadcastChannel (kết nối chéo tab trong cùng trình duyệt)
let realtimeChannel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    realtimeChannel = new BroadcastChannel('BAOHANH_REALTIME_SYNC');
    realtimeChannel.onmessage = function(ev) {
      const data = ev.data;
      if (!data) return;
      if (data.type === 'SERVICEOS_REALTIME' || data.type === 'SERVICEOS_DATA') {
        handleServiceOsRealtimeOrders(data.orders || data.data);
      } else if (data.type === 'DEALER_PORTAL_REALTIME' || data.type === 'DEALER_PORTAL_DATA') {
        handleDealerPortalRealtimeClaims(data.claims || data.data);
      } else if (data.type === 'DEALER_PORTAL_LINE_ITEMS') {
        handleDealerPortalLineItems(data.items, data.url);
      }
    };
  }
} catch(e){}

// 2. Lắng nghe window.postMessage (từ Extension hoặc Tiện ích)
window.addEventListener('message', function(ev){
  const data = ev.data;
  if (!data || typeof data !== 'object') return;
  if (data.type === 'SERVICEOS_REALTIME') {
    handleServiceOsRealtimeOrders(data.orders);
  } else if (data.type === 'SERVICEOS_DATA' && Array.isArray(data.orders)) {
    handleServiceOsRealtimeOrders(data.orders, false);
  } else if (data.type === 'DEALER_PORTAL_REALTIME' || data.type === 'DEALER_PORTAL_DATA') {
    handleDealerPortalRealtimeClaims(data.claims);
  } else if (data.type === 'DEALER_PORTAL_LINE_ITEMS') {
    handleDealerPortalLineItems(data.items, data.url);
  }
});

// 3. Lắng nghe storage event (fallback đồng bộ chéo tab khi có tab khác cập nhật)
window.addEventListener('storage', function(ev){
  if (ev.key === 'bh_realtime_serviceos_event' && ev.newValue) {
    try {
      const p = JSON.parse(ev.newValue);
      if (p && p.orders) handleServiceOsRealtimeOrders(p.orders);
    } catch(e){}
  } else if (ev.key === 'bh_realtime_dealer_event' && ev.newValue) {
    try {
      const p = JSON.parse(ev.newValue);
      if (p && p.claims) handleDealerPortalRealtimeClaims(p.claims);
    } catch(e){}
  }
});

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
  let t = targetUrl || window.location.href;
  if(!t || t.startsWith('file:')) t = 'http://localhost:8787/PhanTichBaoHanh.html';
  const cleanTarget = t.split('#')[0];
  return `(async()=>{
  let allRows=[],p=1,total=Infinity;
  while(allRows.length<total){
    const r=await fetch('/api/work-orders?status=active&page='+p+'&page_size=200',{credentials:'same-origin'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const d=await r.json();
    const rows=d.rows||d.items||[];
    if(!rows.length)break;
    allRows=allRows.concat(rows);
    total=d.total||d.count||rows.length;
    if(allRows.length>=total||rows.length<200)break;
    p++;
    if(p>50)break;
  }
  if(!allRows.length){alert('⚠️ Không tìm thấy xe nào trong mục "Xe đang trong xưởng"!');return;}

  const wRows=allRows.filter(w=>(w.warranty_kinds&&w.warranty_kinds.length>0)||w.warranty_status||w.battery_serial_old||w.motor_serial_old||(w.faults&&w.faults.length>0)||w.dms_warranty_code);
  if(wRows.length>0){
    await Promise.all(wRows.map(async(w)=>{
      try{
        const [dRes,dpRes]=await Promise.all([
          fetch('/api/work-orders/'+w.id,{credentials:'same-origin'}).catch(()=>null),
          fetch('/api/dealer-portal/work-orders/'+w.id,{credentials:'same-origin'}).catch(()=>null)
        ]);
        if(dRes&&dRes.ok){
          const dt=await dRes.json();
          const wo=dt.work_order||dt;
          if(wo.warranty_extra) w.warranty_extra=wo.warranty_extra;
          if(wo.dms_warranty_code) w.dms_warranty_code=wo.dms_warranty_code;
          if(wo.dms_claim_code) w.dms_claim_code=wo.dms_claim_code;
          if(wo.dms_ro_code) w.dms_ro_code=wo.dms_ro_code;
          if(wo.inspection_notes) w.inspection_notes=wo.inspection_notes;
        }
        if(dpRes&&dpRes.ok){
          const dp=await dpRes.json();
          if(dp&&Array.isArray(dp.claims)&&dp.claims.length>0){
            w.dealer_claims=dp.claims;
            const extra={...(w.warranty_extra||{})};
            const kinds=w.warranty_kinds||Object.keys(extra)||['pin'];
            for(const c of dp.claims){
              const wRo=(c.work_order||'').trim();
              if(wRo&&!w.dms_warranty_code) w.dms_warranty_code=wRo;
              const cNum=(c.number||c.claim_code||'').trim();
              if(cNum&&!w.dms_claim_code) w.dms_claim_code=cNum;
              let mk=kinds.find(k=>{
                const row=extra[k]||{};
                const rw=(row.warranty_code||'').trim();
                return(rw&&wRo&&rw.toUpperCase()===wRo.toUpperCase());
              })||(kinds.length===1?kinds[0]:null)||kinds[0];
              if(mk){
                const row={...(extra[mk]||{})};
                if(!row.warranty_code&&wRo) row.warranty_code=wRo;
                if(!row.claim_code&&cNum) row.claim_code=cNum;
                if(row.claim_amount==null&&c.amount!=null) row.claim_amount=c.amount;
                if(!row.claim_submitted_at&&(c.submitted_at||c.created_at)) row.claim_submitted_at=c.submitted_at||c.created_at;
                if(!row.claim_approved_at&&c.approved_at) row.claim_approved_at=c.approved_at;
                if(c.status&&!row.claim_status) row.claim_status=c.status;
                if(!row.serial_old&&c.serial_old) row.serial_old=c.serial_old;
                if(!row.serial_new&&c.serial_new) row.serial_new=c.serial_new;
                if(!row.dien_giai&&c.dien_giai) row.dien_giai=c.dien_giai;
                extra[mk]=row;
              }
            }
            w.warranty_extra=extra;
          }
        }
      }catch(e){}
    }));
  }

  const orders=allRows.map((w,i)=>({
    ...w,
    id:'ord_'+(w.code||i),
    wo:w.code||w.dms_ro_code||'—',
    plate:w.plate||'—',
    vin:w.vin||'—',
    vehicle:w.model||'—',
    customer:w.customer_name||'—',
    tech:w.technician_name||'Chưa phân công',
    diagnosis:w.diagnosis||w.symptoms||w.content||'',
    faults:w.faults||[],
    note:(w.foreman_note||w.advisor_note||'').trim(),
    status:w.status_label||w.status||'Trong xưởng',
    warrantyStatus:w.warranty_status||w.dms_warranty_status||'',
    pinSerial:w.battery_serial_old||w.battery_serial_new||'',
    motorSerial:w.motor_serial_old||w.motor_serial_new||'',
    chargerSerial:'',
    removedAt:w.parts_removed_at||w.motor_removed_at||'',
    bhCode:w.dms_warranty_code||w.bh_order_code||'',
    claimCode:w.dms_claim_code||'',
    warranty_kinds:w.warranty_kinds||[],
    warranty_extra:w.warranty_extra||{},
    dealer_claims:w.dealer_claims||[],
    dateStr:(w.received_at||w.created_at||'').slice(0,10)||new Date().toISOString().slice(0,10)
  }));

  const json=JSON.stringify(orders);
  try{navigator.clipboard.writeText(json)}catch(e){}
  const targetUrl='${cleanTarget}#serviceos='+encodeURIComponent(json);
  const win=window.open(targetUrl,'_blank');
  let toast=document.getElementById('bh-toast');
  if(!toast){
    toast=document.createElement('div');
    toast.id='bh-toast';
    toast.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:#059669;color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;font-weight:bold;box-shadow:0 8px 24px rgba(0,0,0,0.3);font-family:sans-serif;';
    document.body.appendChild(toast);
  }
  toast.innerHTML='✅ Đã kéo đầy đủ '+orders.length+' xe kèm Lệnh BH & ĐXBH! Đang mở Bảo Hành PRO...';
  setTimeout(()=>toast.remove(),4000);
  if(!win){alert('⚡ Đã lấy đầy đủ '+orders.length+' xe kèm Lệnh BH & ĐXBH! Trình duyệt đã chặn popup. Hãy quay lại Bảo Hành PRO và bấm Ctrl+V.');}
})().catch(err=>alert('Lỗi: '+err.message));`;
}

// Generate Userscript for Tampermonkey
function getUserscriptCode(targetUrl){
  const cleanTarget = (targetUrl || window.location.href).split('#')[0];
  return `// ==UserScript==
// @name         Bảo Hành PRO - Đồng bộ ServiceOS
// @namespace    https://phan-tich-bao-hanh.pages.dev/
// @version      2.5
// @description  Tự động thêm nút lấy xe kèm Lệnh BH & ĐXBH trực tiếp từ ServiceOS Dashboard sang Bảo Hành PRO
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
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;padding:12px 22px;border-radius:50px;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 20px rgba(37,99,235,0.45);display:flex;align-items:center;gap:8px;transition:all 0.2s;font-family:sans-serif;';
    btn.onmouseover = () => btn.style.transform = 'translateY(-2px) scale(1.03)';
    btn.onmouseout = () => btn.style.transform = 'translateY(0) scale(1)';
    btn.onclick = async function() {
      btn.innerHTML = '⏳ Đang kéo dữ liệu xe & Lệnh BH / ĐXBH...';
      try {
        let allRows=[],p=1,total=Infinity;
        while(allRows.length<total){
          const res = await fetch('/api/work-orders?status=active&page='+p+'&page_size=200', { credentials: 'same-origin' });
          if(!res.ok) throw new Error('HTTP ' + res.status);
          const d = await res.json();
          const rows = d.rows || d.items || [];
          if (!rows.length) break;
          allRows = allRows.concat(rows);
          total = d.total || d.count || rows.length;
          if (allRows.length >= total || rows.length < 200) break;
          p++;
          if(p>50) break;
        }
        if (!allRows.length) { alert('⚠️ Không có xe nào trong mục "Xe đang trong xưởng"!'); btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO'; return; }

        const wRows = allRows.filter(w => (w.warranty_kinds && w.warranty_kinds.length > 0) || w.warranty_status || w.battery_serial_old || w.motor_serial_old || (w.faults && w.faults.length > 0) || w.dms_warranty_code);
        if (wRows.length > 0) {
          btn.innerHTML = '⏳ Đang kéo Lệnh BH & ĐXBH (' + wRows.length + ' xe)...';
          await Promise.all(wRows.map(async (w) => {
            try {
              const [dRes, dpRes] = await Promise.all([
                fetch('/api/work-orders/' + w.id, { credentials: 'same-origin' }).catch(() => null),
                fetch('/api/dealer-portal/work-orders/' + w.id, { credentials: 'same-origin' }).catch(() => null)
              ]);
              if (dRes && dRes.ok) {
                const dt = await dRes.json();
                const wo = dt.work_order || dt;
                if (wo.warranty_extra) w.warranty_extra = wo.warranty_extra;
                if (wo.dms_warranty_code) w.dms_warranty_code = wo.dms_warranty_code;
                if (wo.dms_claim_code) w.dms_claim_code = wo.dms_claim_code;
                if (wo.dms_ro_code) w.dms_ro_code = wo.dms_ro_code;
                if (wo.inspection_notes) w.inspection_notes = wo.inspection_notes;
              }
              if (dpRes && dpRes.ok) {
                const dp = await dpRes.json();
                if (dp && Array.isArray(dp.claims) && dp.claims.length > 0) {
                  w.dealer_claims = dp.claims;
                  const extra = { ...(w.warranty_extra || {}) };
                  const kinds = w.warranty_kinds || Object.keys(extra) || ['pin'];
                  for (const c of dp.claims) {
                    const wRo = (c.work_order || '').trim();
                    if (wRo && !w.dms_warranty_code) w.dms_warranty_code = wRo;
                    const cNum = (c.number || c.claim_code || '').trim();
                    if (cNum && !w.dms_claim_code) w.dms_claim_code = cNum;
                    let mk = kinds.find(k => {
                      const row = extra[k] || {};
                      const rw = (row.warranty_code || '').trim();
                      return (rw && wRo && rw.toUpperCase() === wRo.toUpperCase());
                    }) || (kinds.length === 1 ? kinds[0] : null) || kinds[0];
                    if (mk) {
                      const row = { ...(extra[mk] || {}) };
                      if (!row.warranty_code && wRo) row.warranty_code = wRo;
                      if (!row.claim_code && cNum) row.claim_code = cNum;
                      if (row.claim_amount == null && c.amount != null) row.claim_amount = c.amount;
                      if (!row.claim_submitted_at && (c.submitted_at || c.created_at)) row.claim_submitted_at = c.submitted_at || c.created_at;
                      if (!row.claim_approved_at && c.approved_at) row.claim_approved_at = c.approved_at;
                      if (c.status && !row.claim_status) row.claim_status = c.status;
                      if (!row.serial_old && c.serial_old) row.serial_old = c.serial_old;
                      if (!row.serial_new && c.serial_new) row.serial_new = c.serial_new;
                      if (!row.dien_giai && c.dien_giai) row.dien_giai = c.dien_giai;
                      extra[mk] = row;
                    }
                  }
                  w.warranty_extra = extra;
                }
              }
            } catch(e) {}
          }));
        }

        const orders = allRows.map((w, i) => ({
          ...w,
          id: 'ord_' + (w.code || i),
          wo: w.code || w.dms_ro_code || '—',
          plate: w.plate || '—',
          vin: w.vin || '—',
          vehicle: w.model || '—',
          customer: w.customer_name || '—',
          tech: w.technician_name || 'Chưa phân công',
          diagnosis: w.diagnosis || w.symptoms || w.content || '',
          faults: w.faults || [],
          note: (w.foreman_note || w.advisor_note || '').trim(),
          status: w.status_label || w.status || 'Trong xưởng',
          warrantyStatus: w.warranty_status || w.dms_warranty_status || '',
          pinSerial: w.battery_serial_old || w.battery_serial_new || '',
          motorSerial: w.motor_serial_old || w.motor_serial_new || '',
          chargerSerial: '',
          removedAt: w.parts_removed_at || w.motor_removed_at || '',
          bhCode: w.dms_warranty_code || w.bh_order_code || '',
          claimCode: w.dms_claim_code || '',
          warranty_kinds: w.warranty_kinds || [],
          warranty_extra: w.warranty_extra || {},
          dealer_claims: w.dealer_claims || [],
          dateStr: (w.received_at || w.created_at || '').slice(0, 10) || new Date().toISOString().slice(0, 10)
        }));

        const json = JSON.stringify(orders);
        try { navigator.clipboard.writeText(json); } catch(e){}
        const targetUrl = '${cleanTarget}#serviceos=' + encodeURIComponent(json);
        window.open(targetUrl, '_blank');
        btn.innerHTML = '✅ Đã gửi ' + orders.length + ' xe kèm Lệnh BH & ĐXBH!';
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
    window.open('https://att-serviceos.anthinhtech.vn/#/dashboard', '_blank');
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
      if(parsed.work_order) return [parsed.work_order];
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
          else if(p.includes('serial pin') || p.includes('pin_serial')) colMap.pinSerial = cIdx;
          else if(p.includes('số máy') || p.includes('motor_serial')) colMap.motorSerial = cIdx;
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
        const pinSerial = colMap.pinSerial !== undefined ? (cells[colMap.pinSerial] || '').trim() : '';
        const motorSerial = colMap.motorSerial !== undefined ? (cells[colMap.motorSerial] || '').trim() : '';
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
          pinSerial: pinSerial,
          motorSerial: motorSerial,
          dateStr: rawDate
        }, i));
      }
      if(result.length > 0) return result;
    }
  }
  return null;
}


window.importDealerPortalClipboard = async function(){
  try {
    let text = '';
    if(navigator.clipboard && navigator.clipboard.readText){
      try { text = await navigator.clipboard.readText(); } catch(err){}
    }
    if(!text || (!text.includes('warrantyClaimNumber') && !text.includes('totalRequestedAmountInclTax') && !text.includes('WARRANTY_CLAIMS'))){
      text = prompt('📋 Dán chuỗi JSON hoặc mảng đề xuất bảo hành từ VinFast Dealer Portal vào ô bên dưới:');
    }
    if(!text || !text.trim()) return;
    
    window.parseDealerPortalJson(text, 'VinFast Dealer Portal (Nhập từ Clipboard)', true);
  } catch(e){
    alert('Lỗi: ' + e.message);
  }
};

window.importServiceOsClipboard = async function(){
  try {
    let text = '';
    if(navigator.clipboard && navigator.clipboard.readText){
      try { text = await navigator.clipboard.readText(); } catch(err){}
    }
    if(!text || (!text.trim().startsWith('[') && !text.includes('\t'))){
      text = prompt('${window.ICONS.clipboard} Dán (Ctrl+V) dữ liệu xe từ ServiceOS vào ô bên dưới:\n(Chấp nhận mã lấy từ Console, hoặc bảng copy từ ServiceOS)');
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
  const target = e.target;
  if(target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
  const clipboardData = e.clipboardData || window.clipboardData;
  if(!clipboardData) return;
  const text = clipboardData.getData('text');
  if(!text) return;

  // 1. Nhận diện tự động dữ liệu Đề xuất bảo hành VinFast Dealer Portal
  if(text.includes('warrantyClaimNumber') || text.includes('totalRequestedAmountInclTax') || text.includes('WARRANTY_CLAIMS')){
    e.preventDefault();
    window.parseDealerPortalJson(text, 'VinFast Dealer Portal (Dán Ctrl+V)', true);
    return;
  }

  // 2. Nhận diện dữ liệu xe xưởng ServiceOS khi ở tab checkxe
  const navTab = document.querySelector('.nav-tab.active');
  const curTab = navTab ? navTab.dataset.tab : '';
  if(curTab === 'checkxe'){
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
});

function initBookmarkletCode(){
  const box = $('#bmConsoleCodeBox');
  if(box) box.value = getConsoleSnippetCode();
  const btn = $('#bookmarkletLink');
  if(btn) btn.href = 'javascript:void(0);';
}
/* ============================ Navigation ============================ */
window.switchTab = function(tabId){
  state.activeTab = tabId;
  $$('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  $$('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === 'pane_' + tabId);
  });
  if(tabId === 'checkxe'){
    renderCheckXe();
  }
  if(typeof window.scrollTo === 'function') try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch(e){}
};

window.setVatMode = function(mode){
  if(mode !== 'inc' && mode !== 'ex') return;
  settings.vatMode = mode;
  try { localStorage.setItem('bh_vatmode', mode); } catch(e){}
  
  // update UI toggles
  const btnInc = $('#btnVatInc'), btnEx = $('#btnVatEx'), sel = $('#vatMode');
  if(btnInc) btnInc.classList.toggle('active', mode === 'inc');
  if(btnEx) btnEx.classList.toggle('active', mode === 'ex');
  if(sel) sel.value = mode;
  
  renderAll();
};

/* ============================ File handling ============================ */
async function handleFiles(fileList){
  for(const file of fileList){
    const src = { id: 'src' + Date.now() + Math.random().toString(36).slice(2, 7), name: file.name, status: 'Đang đọc…', rows: 0, range: '', format: 0, recs: [], warn: [] };
    state.sources.push(src); renderSources();
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array', cellDates: true });
      const recs = []; let sawF1 = false;
      for(const sn of wb.SheetNames){
        const rows = sheetRows(wb.Sheets[sn]);
        const f1 = parseFile1Sheet(rows, src);
        if(f1 === null) continue;
        if(f1.length) sawF1 = true;
        recs.push(...f1);
      }
      const f2 = parseFile2Workbook(wb, src);
      if(f2) recs.push(...f2);
      const sOrders = parseServiceOsWorkbook(wb);
      if(sOrders && sOrders.length > 0){
        state.checkXe.orders = sOrders;
        saveCheckXeOrders();
        renderCheckXe();
        src.status = 'OK · Nhận diện ' + sOrders.length + ' lệnh sửa chữa ServiceOS (Đã nạp vào mục Check lỗi)';
        src.rows = sOrders.length;
        src.format = 4;
      } else if(!recs.length){
        src.status = 'Lỗi: không nhận diện được dữ liệu bảo hành trong file này'; src.err = true;
      } else {
        src.recs = recs; src.rows = recs.length; src.format = f2 && !sawF1 ? 2 : (sawF1 && f2 ? 3 : (recs[0]?.format || 1));
        const dates = recs.map(r => r.date).filter(Boolean);
        src.range = dates.length ? `${fmtDate(new Date(Math.min(...dates)))} → ${fmtDate(new Date(Math.max(...dates)))}` : '(không có ngày)';
        src.status = 'OK';
      }
    } catch(e){ src.status = 'Lỗi đọc file: ' + e.message; src.err = true; console.error(e); }
    renderSources(); renderAll();
  }
}

async function handleInvFiles(fileList){
  const file = fileList[0];
  if(!file) return;
  state.invFileName = file.name;
  state.inventory.clear();
  renderInvSource('Đang đọc...');
  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = sheetRows(ws);
    
    if(rows.length < 2) throw new Error("File trống");
    let headerRow = -1, codeCol = -1, qtyCol = -1;
    for(let i = 0; i < Math.min(20, rows.length); i++){
       const r = rows[i];
       for(let j = 0; j < r.length; j++){
         const val = String(r[j] || '').toLowerCase();
         if(val.includes('mã') || val.includes('code') || val.includes('part number')) codeCol = j;
         if(val.includes('tồn') || val.includes('số lượng') || val.includes('qty')) qtyCol = j;
       }
       if(codeCol !== -1 && qtyCol !== -1) { headerRow = i; break; }
    }
    if(codeCol === -1 || qtyCol === -1) throw new Error("Không tìm thấy cột Mã phụ tùng và Tồn kho");
    
    for(let i = headerRow + 1; i < rows.length; i++){
       const r = rows[i];
       const code = String(r[codeCol] || '').trim().toUpperCase();
       if(!code) continue;
       const qty = parseFloat(r[qtyCol]) || 0;
       state.inventory.set(code, (state.inventory.get(code) || 0) + qty);
    }
    renderInvSource('OK');
    renderAll();
  } catch(e) {
    renderInvSource('Lỗi: ' + e.message, true);
  }
}

function renderInvSource(status, err = false){
  const el = $('#invSrcList');
  if(!state.invFileName) { el.innerHTML = ''; return; }


  el.innerHTML = `
    <div class="source-item">
      <div class="source-info">
        <span class="source-icon">📦</span>
        <div class="source-details">
          <div class="source-name">${esc(state.invFileName)}</div>
          <div class="source-meta">
            ${err ? '<span class="tag err">Lỗi</span>' : '<span class="tag ok">OK</span>'}
            <span>${esc(status)}</span>
            ${state.inventory.size > 0 ? `<span>· <b>${state.inventory.size}</b> mã tồn kho</span>` : ''}
          </div>
        </div>
      </div>
      <button class="source-del" onclick="clearInv()" title="Xoá file tồn kho">✕</button>
    </div>`;
}
window.clearInv = () => { state.inventory.clear(); state.invFileName = ''; renderInvSource(''); renderAll(); };

function allActiveRecords(){
  const byKey = new Map();
  const dynNameMap = new Map();
  for(const s of state.sources){
    if(settings.disabledSrc.has(s.id) || s.format === 4) continue;
    for(const r of s.recs){
      for(const p of r.parts){
        if(!p.inferred && p.code && p.code !== '(KHÔNG MÃ)' && p.name){
          const nn = norm(p.name).replace(/\.+$/, '').trim();
          if(nn && !dynNameMap.has(nn)) dynNameMap.set(nn, p.code);
        }
      }
    }
  }
  for(const s of state.sources){
    if(settings.disabledSrc.has(s.id) || s.format === 4) continue;
    const byId = new Map();
    for(const r of s.recs) byId.set(r.id, r);
    for(const r of byId.values()){
      for(const p of r.parts){
        if(p.inferred && p.name && p.code === p.name){
          const nn = norm(p.name).replace(/\.+$/, '').trim();
          if(dynNameMap.has(nn)) p.code = dynNameMap.get(nn);
        }
      }
      const key = r.format + '|' + r.id;
      if(!byKey.has(key)){
        byKey.set(key, r);
      } else {
        const prev = byKey.get(key);
        const kNew = statusKind(r.status).k, kOld = statusKind(prev.status).k;
        if(kNew === 'confirmed' || kOld !== 'confirmed'){
          if(prev.parts.length > 1 && r.parts.length <= 1) r.parts = prev.parts;
          byKey.set(key, r);
        }
      }
    }
  }
  return [...byKey.values()];
}

/* ============================ Computation ============================ */
function computeAll(){
  const recs = allActiveRecords();
  const isEx = settings.vatMode === 'ex';
  for(const r of recs){
    r.total = isEx ? (r.totalEx ?? r.total) : (r.totalInc ?? r.total);
    r.labor = isEx ? (r.laborEx ?? r.labor) : (r.laborInc ?? r.labor);
    for(const p of r.parts){
      p.money = isEx ? (p.moneyEx ?? p.money) : (p.moneyInc ?? p.money);
    }
  }
  const unknownStatus = new Map();
  let noDate = 0;
  for(const r of recs){
    const k = statusKind(r.status);
    r.kind = k.k; r.kindLabel = k.label; r.badge = k.badge;
    if(k.k === 'unknown') unknownStatus.set(k.label, (unknownStatus.get(k.label) || 0) + 1);
    r.cm = cycleMonth(r.date, settings.cut, settings.cycle22);
    if(!r.cm) noDate++;
  }
  const tYm = settings.targetMonth;
  const months3 = prevMonths(tYm, 3);
  const confirmed = recs.filter(r => r.kind === 'confirmed' && r.cm);
  const pipeline = recs.filter(r => r.kind === 'pipeline' && r.cm);

  // monthly aggregation
  const months = new Map();
  const touch = ym => { if(!months.has(ym)) months.set(ym, { conf: 0, cnt: 0, pipe: 0, pCnt: 0, labor: 0, partsMoney: 0 }); return months.get(ym); };
  for(const r of confirmed){ const o = touch(r.cm); o.conf += r.total; o.cnt++; o.labor += r.labor; for(const p of r.parts) o.partsMoney += p.money; }
  for(const r of pipeline){ const o = touch(r.cm); o.pipe += r.total; o.pCnt++; }

  // ĐÃ LÀM trong tháng kế hoạch
  const doneAgg = new Map();
  let doneCnt = 0, doneLabor = 0, doneTotal = 0, donePartsMoney = 0;
  const activeInMonth = [...confirmed, ...pipeline].filter(r => r.cm === tYm);
  for(const r of activeInMonth){
    doneCnt++; doneLabor += r.labor; doneTotal += r.total;
    for(const p of r.parts){
      if(!p.code) continue;
      donePartsMoney += p.money;
      let d = doneAgg.get(p.code);
      if(!d){ d = { qty: 0, money: 0 }; doneAgg.set(p.code, d); }
      d.qty += p.qty; d.money += p.money;
    }
  }

  // part aggregation over 3 analysis months
  const mset = new Set(months3);
  const partAgg = new Map();
  for(const r of confirmed){
    if(!mset.has(r.cm)) continue;
    for(const p of r.parts){
      if(!p.code) continue;
      let a = partAgg.get(p.code);
      if(!a){ a = { code: p.code, name: p.name || '', qty: 0, money: 0, props: new Set(), byMonth: {} }; partAgg.set(p.code, a); }
      a.qty += p.qty; a.money += p.money; if(p.name) a.name = p.name; a.props.add(r.id);
      a.byMonth[r.cm] = (a.byMonth[r.cm] || 0) + p.money;
    }
  }
  const parts3 = [...partAgg.values()].sort((a, b) => b.money - a.money);
  const rev3 = months3.map(m => months.get(m)?.conf || 0);
  const total3 = rev3.reduce((s, v) => s + v, 0);
  const cnt3 = months3.map(m => months.get(m)?.cnt || 0);
  const revAvg = total3 / 3, cntAvg = total3 ? cnt3.reduce((s, v) => s + v, 0) / 3 : 0;
  const parts3Money = parts3.reduce((s, a) => s + a.money, 0);
  const labor3 = months3.reduce((s, m) => s + (months.get(m)?.labor || 0), 0);
  const scale = revAvg > 0 ? settings.target / revAvg : 0;

  // phụ tùng dự tính & kế hoạch điều chỉnh
  const unitPrice = new Map();
  for(const a of parts3) unitPrice.set(a.code, a.qty > 0 ? a.money / a.qty : a.money);
  const pMap = new Map();
  for(const r of state.prepared){
    const c = String(r.code || '').trim().toUpperCase(), q = Math.floor(+r.qty || 0);
    if(c && q > 0) pMap.set(c, (pMap.get(c) || 0) + q);
  }
  const preparedInfo = []; let coveredParts = 0;
  for(const [code, qty] of pMap){
    const known = unitPrice.has(code), up = known ? unitPrice.get(code) : 0;
    const money = up * qty; if(known) coveredParts += money;
    const srcA = parts3.find(a => a.code === code);
    preparedInfo.push({ code, name: srcA ? srcA.name : '', qty, unit: up, money, known });
  }
  preparedInfo.sort((a, b) => b.money - a.money);
  const partsShare = total3 > 0 ? parts3Money / total3 : 0.9;
  const partsTarget = settings.target * partsShare;

  // target month progress
  const t = months.get(tYm) || { conf: 0, cnt: 0, pipe: 0, pCnt: 0, labor: 0, partsMoney: 0 };
  const expected = t.conf + t.pipe;
  const remaining = Math.max(0, settings.target - expected);
  const now = new Date();
  const [tY, tM] = tYm.split('-').map(Number);
  const cycStart = new Date(tY, tM - 2, 23, 0, 0, 0, 0);
  const cycEnd = new Date(tY, tM - 1, settings.cut, 23, 59, 59, 999);
  const cycleDays = cycleDaysOf(tYm, settings.cut);
  const inCycle = now >= cycStart && now <= cycEnd;
  const daysLeft = inCycle ? Math.max(0, Math.floor((cycEnd.getTime() - now.getTime()) / DAY)) : null;
  const elapsedDays = inCycle ? Math.min(cycleDays, Math.max(1, Math.floor((now.getTime() - cycStart.getTime()) / DAY) + 1)) : null;
  const expectedPlan = expected + coveredParts;
  const remainingPlan = Math.max(0, settings.target - expectedPlan);

  const isReached = remainingPlan === 0;
  let remainingParts = 0, scale2 = 0, plan = [], planMajor = [], planMinor = [], planMinorAgg = null;
  let planOthersMoney = 0, planPartsMoney = 0, planLabor = settings.target - partsTarget, planLaborRest = 0;
  const propsNeedBase = ceilInt(cntAvg * scale);
  const avgPerProp = cnt3.reduce((s, v) => s + v, 0) > 0 ? total3 / cnt3.reduce((s, v) => s + v, 0) : 0;
  let propsNeed = 0;

  if(!isReached){
    remainingParts = Math.max(0, Math.min(remainingPlan, partsTarget - coveredParts - donePartsMoney));
    const pool = parts3.filter(a => !pMap.has(a.code));
    const poolMoney = pool.reduce((s, a) => s + a.money, 0);
    scale2 = poolMoney > 0 ? remainingParts / (poolMoney / 3) : 0;
    plan = pool.map(a => {
      const qAvg = a.qty / 3, mAvg = a.money / 3;
      const qBase = ceilInt(qAvg * scale2);
      const d = doneAgg.get(a.code) || { qty: 0, money: 0 };
      const doneQ = ceilInt(d.qty);
      const invQty = state.inventory.has(a.code) ? state.inventory.get(a.code) : null;
      return { code: a.code, name: a.name, qAvg, qBase, doneQ, qNeed: Math.max(0, qBase - doneQ), mAvg, mBase: mAvg * scale2, mNeed: Math.max(0, mAvg * scale2 - d.money), invQty };
    }).filter(p => p.qNeed > 0);

    for(const p of plan){
      if(parts3Money > 0 && (p.mAvg * 3) / parts3Money >= 0.01) planMajor.push(p); else planMinor.push(p);
    }
    planMinor.sort((a, b) => b.mNeed - a.mNeed);
    const sumKey = (arr, k) => arr.reduce((s, p) => s + p[k], 0);
    planMinorAgg = planMinor.length ? {
      code: '(NHÓM KHÁC)', name: 'Nhóm phụ tùng khác (tỷ trọng thấp)',
      qAvg: sumKey(planMinor, 'qAvg'), qBase: sumKey(planMinor, 'qBase'), doneQ: sumKey(planMinor, 'doneQ'),
      qNeed: sumKey(planMinor, 'qNeed'), mAvg: sumKey(planMinor, 'mAvg'), mBase: sumKey(planMinor, 'mBase'),
      mNeed: sumKey(planMinor, 'mNeed'), count: planMinor.length
    } : null;

    planOthersMoney = plan.reduce((s, p) => s + p.mNeed, 0);
    planPartsMoney = coveredParts + planOthersMoney;
    planLaborRest = Math.max(0, remainingPlan - planPartsMoney);
    propsNeed = Math.min(Math.max(0, propsNeedBase - doneCnt), Math.max(1, ceilInt(remainingPlan / (avgPerProp || 1))));
  }

  // Verdict calculation
  const bestRev3 = rev3.length ? Math.max(...rev3) : 0;
  const histCycleDays = months3.reduce((s, m) => s + cycleDaysOf(m, settings.cut), 0);
  const histDaily = histCycleDays > 0 ? total3 / histCycleDays : 0;
  const curDaily = elapsedDays ? expected / elapsedDays : 0;
  const ratio = histDaily > 0 ? curDaily / histDaily : 0;
  const projection = curDaily * cycleDays;
  let verdict = '', vClass = '', vIcon = '', verdictDetail = '';

  if(expectedPlan >= settings.target){
    verdict = 'ĐỦ / VƯỢT MỤC TIÊU DOANH THU'; vClass = 'ok'; vIcon = '✅';
    const over = expectedPlan - settings.target;
    verdictDetail = `Kỳ này dự kiến đạt <b>${fmtT(expectedPlan)} triệu</b> (chốt <b>${fmtT(t.conf)} triệu</b> [${t.cnt} ĐX] · dự trù <b>${fmtT(t.pipe)} triệu</b> [${t.pCnt} ĐX]${coveredParts > 0 ? ` · chuẩn bị <b>${fmtT(coveredParts)} triệu</b>` : ''}) <b>≥ mục tiêu ${fmtT(settings.target)} triệu</b> (vượt +${fmtT(over)} triệu, đạt ${fmtN(expectedPlan / settings.target * 100, 1)}%).`;
  } else if(!inCycle){
    if(revAvg >= settings.target){ verdict = 'KHẢ NĂNG ĐẠT CAO'; vClass = 'ok'; vIcon = '🟢'; verdictDetail = `TB 3 tháng gần nhất ${fmtT(revAvg)} triệu đã vượt mục tiêu — duy trì nhịp là đạt.`; }
    else if(bestRev3 >= settings.target){ verdict = 'KHẢ NĂNG ĐẠT TRUNG BÌNH'; vClass = 'warn'; vIcon = '🟡'; verdictDetail = `TB 3 tháng ${fmtT(revAvg)} triệu thấp hơn mục tiêu nhưng tháng tốt nhất đạt ${fmtT(bestRev3)} triệu — cần bám nhịp tháng tốt nhất.`; }
    else { verdict = 'RỦI RO CAO'; vClass = 'risk'; vIcon = '🔴'; verdictDetail = `Cả 3 tháng gần nhất (tốt nhất ${fmtT(bestRev3)} triệu) đều dưới mục tiêu ${fmtT(settings.target)} triệu.`; }
  } else {
    if(ratio >= 1){
      verdict = 'KHẢ NĂNG ĐẠT CAO'; vClass = 'ok'; vIcon = '🟢';
      verdictDetail = `Nhịp 1 ngày kỳ này ≈ <b>${fmtT(curDaily)} triệu</b> (đã có ${fmtT(expected)} triệu / ${elapsedDays} ngày) <b>≥</b> TB 1 ngày 3 tháng gần nhất ≈ ${fmtT(histDaily)} triệu (${fmtN(ratio * 100, 0)}%). Giữ nhịp này dự kiến kết kỳ ≈ <b>${fmtT(projection)} triệu</b> so mục tiêu ${fmtT(settings.target)} triệu.`;
    } else if(ratio >= 0.85){
      verdict = 'KHẢ NĂNG ĐẠT TRUNG BÌNH'; vClass = 'warn'; vIcon = '🟡';
      verdictDetail = `Nhịp 1 ngày kỳ này ≈ <b>${fmtT(curDaily)} triệu</b> (đã có ${fmtT(expected)} triệu / ${elapsedDays} ngày) = <b>${fmtN(ratio * 100, 0)}%</b> TB 1 ngày 3 tháng gần nhất (≈ ${fmtT(histDaily)} triệu). Cần đẩy nhẹ: mỗi ngày thêm ≈ ${fmtT((histDaily - curDaily))} triệu là về đúng nhịp — dự kiến kết kỳ nếu giữ nhịp hiện tại ≈ ${fmtT(projection)} triệu.`;
    } else {
      verdict = 'RỦI RO CAO'; vClass = 'risk'; vIcon = '🔴';
      verdictDetail = `Nhịp 1 ngày kỳ này ≈ <b>${fmtT(curDaily)} triệu</b> (đã có ${fmtT(expected)} triệu / ${elapsedDays} ngày) chỉ = <b>${fmtN(ratio * 100, 0)}%</b> TB 1 ngày 3 tháng gần nhất (≈ ${fmtT(histDaily)} triệu). Giữ nhịp này dự kiến kết kỳ chỉ ≈ <b>${fmtT(projection)} triệu</b>, thiếu ${fmtT(Math.max(0, settings.target - projection))} triệu → cần nhịp ≈ ${fmtT(remainingPlan / Math.max(1, daysLeft || 1))} triệu/ngày trong ${daysLeft} ngày còn lại (đã gồm phụ tùng dự tính).`;
    }
  }

  // THỐNG KÊ TỶ LỆ TRẢ VỀ (CẤP 1 & CẤP 2 TRẢ VỀ)
  // Lệnh ĐXBH trả về nhưng hiện tại đang ở trạng thái hủy thì KHÔNG tính vào tỷ lệ trả về
  const monthRecs = recs.filter(r => r.cm === tYm || (!tYm && r.cm));
  const targetRecs = monthRecs.length > 0 ? monthRecs : recs;
  const totalClaimsCount = targetRecs.length;
  const returnL1List = targetRecs.filter(r => r.isReturnLevel1 && !r.isCancelled);
  const returnL2List = targetRecs.filter(r => r.isReturnLevel2 && !r.isCancelled);
  const totalReturnedList = targetRecs.filter(r => r.isReturned && !r.isCancelled);
  const returnRate = totalClaimsCount > 0 ? (totalReturnedList.length / totalClaimsCount * 100) : 0;
  const isReturnRateOk = returnRate <= 1.0;
  const returnMetrics = {
    totalClaimsCount,
    returnL1Count: returnL1List.length,
    returnL2Count: returnL2List.length,
    totalReturnedCount: totalReturnedList.length,
    returnRate,
    isReturnRateOk,
    returnL1List,
    returnL2List,
    totalReturnedList
  };

  // THỐNG KÊ PHÂN LOẠI NHÓM KHÁCH HÀNG (GSM, BSHIP, KHÁCH LẺ, DOANH NGHIỆP)
  // LẤY 100% TỪ DEALER PORTAL (https://dealer-portal.vinfast.com/) + BỘ LỌC TỪ NGÀY ĐẾN NGÀY
  const custFilter = (state.customerDateFilter) || { from: '', to: '', preset: 'all' };
  state.customerDateFilter = custFilter;

  // Thu thập toàn bộ bản ghi Dealer Portal (Format 2)
  const allDealerRecs = recs.filter(r => r.format === 2 || (r.srcName && r.srcName.includes('Dealer Portal')));
  const baseCustRecs = allDealerRecs.length > 0 ? allDealerRecs : targetRecs;

  // Lọc theo khoảng ngày người dùng chọn
  const filteredCustRecs = baseCustRecs.filter(r => {
    let dStr = r.dateStr || '';
    if (!dStr && r.date) {
      if (r.date instanceof Date) dStr = r.date.toISOString().slice(0, 10);
      else if (typeof r.date === 'string') dStr = r.date.slice(0, 10);
    }
    if (custFilter.from && dStr && dStr < custFilter.from) return false;
    if (custFilter.to && dStr && dStr > custFilter.to) return false;
    return true;
  });

  const custMap = {
    gsm: { id: 'gsm', name: 'GSM (Xanh SM)', tag: 'GSM', badgeClass: 'cust-gsm', color: '#06b6d4', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] },
    bship: { id: 'bship', name: 'Bship', tag: 'BSHIP', badgeClass: 'cust-bship', color: '#10b981', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] },
    retail: { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] },
    corp: { id: 'corp', name: 'Doanh nghiệp khác', tag: 'Doanh nghiệp', badgeClass: 'cust-corp', color: '#a855f7', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] }
  };

  for(const r of filteredCustRecs){
    const gid = (r.customerGroup && r.customerGroup.id) || 'retail';
    if(custMap[gid]){
      custMap[gid].rev += r.total;
      custMap[gid].cnt++;
      custMap[gid].claims.push(r);
      const isApproved = (r.status === 'Đã phê duyệt' || r.status === 'APPROVED' || norm(r.status).includes('da phe duyet'));
      if(isApproved){
        custMap[gid].approvedRev += r.total;
        custMap[gid].approvedCnt++;
      } else if(r.isReturned || r.status === 'Từ chối / Hủy' || r.status === 'CANCELLED' || r.status === 'REJECTED') {
        custMap[gid].rejectedCnt++;
      } else {
        custMap[gid].pendingRev += r.total;
        custMap[gid].pendingCnt++;
      }
    }
  }
  const totalCustRev = Object.values(custMap).reduce((s, g) => s + g.rev, 0) || 1;
  Object.values(custMap).forEach(g => {
    g.pct = Math.round((g.rev / totalCustRev) * 100);
  });
  const customerBreakdown = {
    groups: Object.values(custMap),
    totalRev: totalCustRev,
    totalClaims: filteredCustRecs.length,
    activeFilter: custFilter
  };

  // CẢNH BÁO LỆNH SỬA CHỮA BẢO HÀNH CHƯA LÀM ĐỀ XUẤT (ở mức quyết toán trở lên)
  const allCheckOrders = (state.checkXe && state.checkXe.orders) || [];
  const unsubmittedWarrantyOrders = allCheckOrders.filter(o => o.isUnsubmittedWarranty);

  state.computed = {
    recs, months, months3, parts3, rev3, cnt3, total3, revAvg, cntAvg, parts3Money, labor3, scale,
    plan, planMajor, planMinorAgg, planPartsMoney, planLabor, planLaborRest, propsNeed, propsNeedBase, avgPerProp,
    target: t, expected, remaining, daysLeft, dailyRate: daysLeft ? remainingPlan / daysLeft : null,
    preparedInfo, coveredParts, partsShare, partsTarget, remainingParts, scale2, planOthersMoney, expectedPlan, remainingPlan,
    doneAgg, doneCnt, doneLabor, doneTotal, donePartsMoney,
    histDaily, curDaily, elapsedDays, cycleDays, ratio, projection, inCycle,
    verdict, vClass, vIcon, verdictDetail, bestRev3: rev3.length ? Math.max(...rev3) : 0,
    returnMetrics, customerBreakdown, unsubmittedWarrantyOrders,
    unknownStatus: [...unknownStatus.entries()], noDate
  };
  return state.computed;
}
window.computeAll = computeAll;
window.compute = computeAll;

/* ============================ Rendering ============================ */
function renderSources(){
  const el = $('#srcList');
  el.innerHTML = state.sources.map(s => `
    <div class="source-item">
      <div class="source-info">
        <span class="source-icon">📋</span>
        <div class="source-details">
          <div class="source-name">${esc(s.name)}</div>
          <div class="source-meta">
            ${s.err ? '<span class="tag err">Lỗi</span>' : s.status === 'OK' ? '<span class="tag ok">OK</span>' : '<span class="tag warn">…</span>'}
            ${s.rows ? `<span><b>${s.rows}</b> đơn vị bảo hành</span> · <span>${esc(s.range)}</span>` : ''}
            ${s.format === 2 ? '<span class="tag f2">Định dạng mới</span>' : s.format === 1 ? '<span class="tag f1">Warranty Claim</span>' : s.format === 3 ? '<span class="tag f2">Cả 2 định dạng</span>' : ''}
            ${s.err ? `<b style="color:var(--rose)">${esc(s.status)}</b>` : ''}
          </div>
        </div>
      </div>
      <button class="source-del" onclick="removeSource('${s.id}')" title="Xoá file này">✕</button>
    </div>`).join('');

  const tEl = $('#srcToggle');
  tEl.innerHTML = state.sources.length ? state.sources.map(s => `
    <label style="display:flex;gap:6px;align-items:center">
      <input type="checkbox" ${settings.disabledSrc.has(s.id) ? '' : 'checked'} onchange="toggleSrc('${s.id}',this.checked)">
      <span style="overflow:hidden;text-overflow:ellipsis;max-width:200px;white-space:nowrap" title="${esc(s.name)}">${esc(s.name)}</span>
    </label>`).join('') : '<span style="color:var(--text-muted)">Chưa có file</span>';

  // update badge in tab bar
  const bFiles = $('#badgeFilesCount');
  if(bFiles) bFiles.textContent = state.sources.length;
}
window.removeSource = id => { state.sources = state.sources.filter(s => s.id !== id); settings.disabledSrc.delete(id); renderSources(); renderAll(); };
window.toggleSrc = (id, on) => { on ? settings.disabledSrc.delete(id) : settings.disabledSrc.add(id); renderAll(); };

function renderRulePanel(C){
  const el = $('#ruleBox');
  if(!el) return;
  if(!C || !C.recs.length){ el.innerHTML = ''; return; }
  const groups = new Map();
  for(const r of C.recs){
    const key = norm(r.status);
    let g = groups.get(key);
    if(!g){ g = { key, label: String(r.status || '').trim() || '(Trống)', count: 0, kind: statusKind(r.status).k }; groups.set(key, g); }
    g.count++;
  }
  const opts = k => ['confirmed', 'pipeline', 'excluded'].map(kk => `<option value="${kk}" ${k === kk ? 'selected' : ''}>${KIND_META[kk].name}</option>`).join('');


  el.innerHTML = `
    <details style="margin-top:10px">
      <summary style="cursor:pointer;color:var(--primary);font-weight:700;font-size:13px">⚙️ Bảng phân loại trạng thái bảo hành (Kiểm tra &amp; Tuỳ chỉnh)</summary>
      <div class="table-container" style="max-height:260px;margin-top:8px">
        <table>
          <thead><tr><th class="l">Trạng thái (trong file gốc)</th><th>Số dòng</th><th class="l">Được tính là</th></tr></thead>
          <tbody>${[...groups.values()].sort((a, b) => b.count - a.count).map(g => `<tr>
            <td class="l"><b>${esc(g.label)}</b></td>
            <td class="num">${g.count}</td>
            <td class="l"><select class="select-input" onchange="setRule('${esc(g.key)}',this.value)">${opts(g.kind)}</select></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:8px;display:flex;justify-content:space-between;align-items:center">
        <span>Chốt = Doanh thu; Dự trù = Chờ duyệt cấp 1/2, Mở; Loại = Huỷ/Từ chối. Lưu trữ trên máy bạn.</span>
        <button class="btn secondary" style="padding:4px 10px;font-size:11.5px" onclick="resetRules()">🔄 Về mặc định</button>
      </div>
    </details>`;
}

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

  const targetPct = Math.min(100, Math.round((C.expectedPlan / (settings.target || 1)) * 100));
  const dailyPct = Math.min(100, Math.round(C.ratio * 100));
  const propsPct = C.propsNeedBase > 0 ? Math.min(100, Math.round((C.doneCnt / C.propsNeedBase) * 100)) : 100;

  const heroKpiHtml = `
    <div class="kpi-grid">
      <div class="kpi-card blue">
        <div class="kpi-title">Mục tiêu ${monthLong(tYm)} <span>${window.ICONS.target}</span></div>
        <div class="kpi-val">${fmtT(settings.target)} <span style="font-size:16px">tr</span></div>
        <div class="kpi-sub">Bao gồm công + phụ tùng · ${settings.vatMode === 'ex' ? 'Trước VAT' : 'Sau VAT'}</div>
        <div class="kpi-progress-track">
          <div class="kpi-progress-fill" style="width:100%;background:linear-gradient(90deg, #0284c7, #38bdf8)"></div>
        </div>
      </div>
      
      <div class="kpi-card ${isReached ? 'emerald' : 'amber'}">
        <div class="kpi-title">
          <span>Dự kiến kết kỳ ${monthLabel(tYm)}</span>
          <span style="display:inline-flex;align-items:center;gap:4px">
            <span class="micro-badge ${isReached ? 'ok' : 'warn'}">${targetPct}%</span>
            ${isReached ? window.ICONS.checkCircle : window.ICONS.calendar}
          </span>
        </div>
        <div class="kpi-val">${fmtT(C.expectedPlan)} <span style="font-size:16px">tr</span></div>
        <div class="kpi-sub">
          Chốt <b>${fmtT(C.target.conf)}</b> + Dự trù <b>${fmtT(C.target.pipe)}</b>${C.coveredParts ? ` + Chuẩn bị <b>${fmtT(C.coveredParts)}</b>` : ''}
        </div>
        <div class="kpi-progress-track">
          <div class="kpi-progress-fill" style="width:${targetPct}%;background:${isReached ? 'linear-gradient(90deg, #059669, #10b981)' : 'linear-gradient(90deg, #d97706, #f59e0b)'}"></div>
        </div>
      </div>

      <div class="kpi-card ${C.ratio >= 1 ? 'emerald' : C.ratio >= 0.85 ? 'amber' : 'indigo'}">
        <div class="kpi-title">
          <span>Nhịp 1 ngày kỳ này</span>
          <span style="display:inline-flex;align-items:center;gap:4px">
            <span class="micro-badge ${C.ratio >= 1 ? 'ok' : 'warn'}">${C.elapsedDays ? fmtN(C.ratio * 100, 0) + '%' : '—'}</span>
            ${window.ICONS.zap}
          </span>
        </div>
        <div class="kpi-val">${fmtT(C.curDaily)} <span style="font-size:16px">tr/ngày</span></div>
        <div class="kpi-sub">
          ${C.elapsedDays ? `Đạt <b>${fmtN(C.ratio * 100, 0)}%</b> so TB 3 tháng (${fmtT(C.histDaily)} tr/ngày)` : 'Chưa trong kỳ'}
        </div>
        <div class="kpi-progress-track">
          <div class="kpi-progress-fill" style="width:${dailyPct}%;background:${C.ratio >= 1 ? 'linear-gradient(90deg, #059669, #10b981)' : 'linear-gradient(90deg, #6366f1, #818cf8)'}"></div>
        </div>
      </div>

      <div class="kpi-card ${isReached ? 'emerald' : 'indigo'}">
        <div class="kpi-title">
          <span>Số ĐX còn phải làm</span>
          <span style="display:inline-flex;align-items:center;gap:4px">
            <span class="micro-badge ${isReached ? 'ok' : 'info'}">${propsPct}%</span>
            ${window.ICONS.clipboard}
          </span>
        </div>
        <div class="kpi-val">${isReached ? '0' : C.propsNeed} <span style="font-size:16px">đề xuất</span></div>
        <div class="kpi-sub">
          ${isReached ? `Đã có <b>${C.target.cnt}</b> ĐX chốt + <b>${C.target.pCnt}</b> dự trù (Vượt +${fmtT(C.expectedPlan - settings.target)} tr)` : `Kế hoạch ${C.propsNeedBase} − Đã làm ${C.doneCnt} ĐX`}
        </div>
        <div class="kpi-progress-track">
          <div class="kpi-progress-fill" style="width:${propsPct}%;background:${isReached ? 'linear-gradient(90deg, #059669, #10b981)' : 'linear-gradient(90deg, #4f46e5, #6366f1)'}"></div>
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
      <tr class="${isT ? 'row-target-highlight' : ''}">
        <td class="l">
          <b>${monthLabel(m)}</b> ${isT ? '<span class="tag target-pill"><svg class="sc-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> Mục tiêu</span>' : ''}
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

  const unsubmittedAlertHtml = (C.unsubmittedWarrantyOrders && C.unsubmittedWarrantyOrders.length > 0) ? `
    <div style="background:linear-gradient(135deg, rgba(239,68,68,0.18), rgba(15,23,42,0.9));border:1.5px solid #ef4444;border-radius:12px;padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:16px;box-shadow:0 0 20px rgba(239,68,68,0.25);flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:26px">🚨</div>
        <div>
          <div style="font-size:14.5px;font-weight:800;color:#fca5a5;margin-bottom:3px">
            CẢNH BÁO: Phát hiện ${C.unsubmittedWarrantyOrders.length} Lệnh sửa chữa Bảo hành CHƯA LÀM ĐỀ XUẤT!
          </div>
          <div style="font-size:12px;color:#cbd5e1;line-height:1.4">
            Các xe này có <b>Phân loại TT là Bảo hành</b> hoặc đã thay linh kiện bảo hành nhưng <b>chưa nộp đề xuất (chưa có mã WC)</b> trên Dealer Portal.
          </div>
        </div>
      </div>
      <button class="btn primary" style="background:#dc2626;border-color:#ef4444;color:#fff;font-weight:700;padding:7px 15px;font-size:12px;box-shadow:0 0 12px rgba(239,68,68,0.4)" onclick="showUnsubmittedWarrantyOrders()">
        📋 Xem danh sách ${C.unsubmittedWarrantyOrders.length} lệnh chưa làm ĐX
      </button>
    </div>` : '';

  const qualityAndCustomerCardsHtml = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(460px, 1fr));gap:18px;margin-bottom:18px">
      <!-- Card Sơ đồ Thước đo Tỷ lệ trả về (Chuẩn <= 1%) -->
      <div class="card" style="margin-bottom:0">
        <div class="card-header">
          <div>
            <div class="card-title">🛡️ Tỷ lệ trả về đề xuất bảo hành (Cấp 1 & Cấp 2)</div>
            <div class="card-subtitle">Quy chuẩn VinFast: Mức trần cho phép <b>≤ 1.0%</b> · Kiểm soát chất lượng hồ sơ</div>
          </div>
          <button class="btn secondary" style="font-size:11.5px;padding:4px 9px" onclick="viewReturnedClaims()">
            📋 Xem ĐX bị trả về
          </button>
        </div>
        <div style="padding:14px 18px">
          ${svgReturnRateGauge(C.returnMetrics.returnRate, C.returnMetrics.isReturnRateOk, C.returnMetrics.returnL1Count, C.returnMetrics.returnL2Count, C.returnMetrics.totalClaimsCount)}
        </div>
      </div>

      <!-- Card Cơ cấu Nhóm Khách Hàng (GSM, Bship, Khách lẻ) -->
      <div class="card" style="margin-bottom:0">
        <div class="card-header">
          <div>
            <div class="card-title">👥 Cơ cấu doanh thu theo Nhóm Khách Hàng</div>
            <div class="card-subtitle">Phân bổ: <b>GSM (Xanh SM)</b> · <b>Bship</b> · <b>Khách lẻ</b> · Doanh nghiệp khác</div>
          </div>
        </div>
        <div id="customerBreakdownContainer" style="padding:14px 18px">
          ${renderCustomerBreakdownHtml(C.customerBreakdown)}
        </div>
      </div>
    </div>`;

  // Render trực tiếp Bảng Danh sách Lệnh sửa chữa Bảo hành chưa làm ĐXBH
  const unsubmittedList = C.unsubmittedWarrantyOrders || [];
  const gsmUnsub = unsubmittedList.filter(o => o.customerGroup?.id === 'gsm').length;
  const bshipUnsub = unsubmittedList.filter(o => o.customerGroup?.id === 'bship').length;
  const retailUnsub = unsubmittedList.filter(o => o.customerGroup?.id === 'retail').length;

  const unsubmittedRowsHtml = unsubmittedList.length ? unsubmittedList.map((o, idx) => {
    const custTag = o.customerGroup 
      ? `<span style="font-size:10px;padding:1px 6px;border-radius:4px;font-weight:700;margin-left:4px;background:${o.customerGroup.color}22;color:${o.customerGroup.color};border:1px solid ${o.customerGroup.color}50">${o.customerGroup.tag}</span>` 
      : '';
    return `
      <tr>
        <td style="text-align:center;color:#94a3b8;font-size:12px">${idx + 1}</td>
        <td>
          <div style="font-weight:800;color:#f8fafc;font-family:monospace;font-size:13px;display:flex;align-items:center;gap:6px">
            <span>${esc(o.wo)}</span>
            <button class="btn secondary" style="padding:1px 5px;font-size:10px" title="Sao chép mã LSC" onclick="copyTextToClipboard('${o.wo}', this)">📋</button>
          </div>
        </td>
        <td style="font-weight:700;color:#38bdf8;font-size:12.5px">${esc(o.plate) || '—'}</td>
        <td style="font-family:monospace;font-size:11.5px;color:#94a3b8">${esc(o.vin) || '—'}</td>
        <td style="font-size:12px;color:#cbd5e1">${esc(o.vehicle) || '—'}</td>
        <td>
          <div style="font-size:12px;font-weight:600;color:#f1f5f9">
            ${esc(o.customer || '—')} ${custTag}
          </div>
        </td>
        <td style="text-align:center">
          ${o.isWarrantyPayment 
            ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(239,68,68,0.18);color:#fca5a5;border:1px solid rgba(239,68,68,0.4)">Bảo hành</span>`
            : `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(59,130,246,0.18);color:#93c5fd;border:1px solid rgba(59,130,246,0.4)">Khách hàng</span>`}
        </td>
        <td style="text-align:center">
          <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(16,185,129,0.18);color:#34d399;border:1px solid rgba(16,185,129,0.4)">${esc(o.status || 'Đã quyết toán')}</span>
        </td>
        <td style="font-size:11.5px;color:#94a3b8;max-width:220px;white-space:normal">
          ${esc(o.faultStr || o.issue || o.note || 'Lỗi linh kiện bảo hành')}
        </td>
      </tr>
    `;
  }).join('') : `<tr><td colspan="9" style="text-align:center;padding:20px;color:#34d399;font-weight:600">✅ Tuyệt vời: Toàn bộ lệnh sửa chữa bảo hành đã quyết toán đều đã được tạo Đề xuất (WC-...) thành công!</td></tr>`;

  const unsubmittedWarrantyCardHtml = `
    <div class="card" style="margin-bottom:18px;border:1.5px solid ${unsubmittedList.length ? '#ef4444' : 'rgba(16,185,129,0.3)'};box-shadow:0 4px 18px rgba(0,0,0,0.3)">
      <div class="card-header" style="flex-wrap:wrap;gap:12px">
        <div>
          <div class="card-title" style="display:flex;align-items:center;gap:8px">
            <span style="font-size:18px">🚨</span>
            <span style="color:${unsubmittedList.length ? '#fca5a5' : '#34d399'}">Danh sách Lệnh sửa chữa Bảo hành đã Quyết toán CHƯA LÀM ĐỀ XUẤT</span>
            <span class="tag" style="background:${unsubmittedList.length ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'};color:${unsubmittedList.length ? '#fca5a5' : '#34d399'};border:1px solid ${unsubmittedList.length ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'};font-size:11.5px;padding:2px 8px">
              ${unsubmittedList.length} lệnh
            </span>
          </div>
          <div class="card-subtitle">
            Quy chuẩn: Lệnh có <b>Phân loại TT là Bảo hành</b> và trạng thái <b>từ Quyết toán trở lên</b> nhưng <b>chưa có mã ĐX (WC-...)</b> trên Dealer Portal. Mã LSC hiển thị chuẩn VinFast Dealer Portal (<code>N54511-WO-...</code>)
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${unsubmittedList.length ? `
            <button class="btn secondary" style="font-size:11.5px;padding:5px 10px;background:#b91c1c;border-color:#ef4444;color:#fff" onclick="copyAllUnsubmittedWo(this)">
              📋 Copy tất cả mã WO
            </button>
            <button class="btn secondary" style="font-size:11.5px;padding:5px 10px;background:#0369a1;border-color:#38bdf8;color:#fff" onclick="exportUnsubmittedWarrantyExcel()">
              📥 Xuất Excel (${unsubmittedList.length} lệnh)
            </button>
          ` : ''}
          <a href="https://dealer-portal.vinfast.com/dealer/aftersales/escooter/warranty-claim#wcDatePreset=ALL&wcLimit=20&wcPage=1&wcPendingPayment=ALL" target="_blank" class="btn" style="font-size:11.5px;padding:5px 10px;text-decoration:none;display:inline-flex;align-items:center;gap:4px">
            🌐 Dealer Portal ĐXBH
          </a>
        </div>
      </div>
      <div style="padding:14px 18px">
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          <span class="tag" style="background:rgba(239,68,68,0.15);color:#fca5a5;font-size:12px;padding:3px 10px">Tổng số: <b>${unsubmittedList.length} lệnh</b></span>
          <span class="tag" style="background:rgba(6,182,212,0.12);color:#22d3ee;font-size:12px;padding:3px 10px">GSM: <b>${gsmUnsub} lệnh</b></span>
          <span class="tag" style="background:rgba(16,185,129,0.12);color:#34d399;font-size:12px;padding:3px 10px">BSHIP: <b>${bshipUnsub} lệnh</b></span>
          <span class="tag" style="background:rgba(56,189,248,0.12);color:#38bdf8;font-size:12px;padding:3px 10px">Khách lẻ: <b>${retailUnsub} lệnh</b></span>
        </div>
        <div class="table-container scrollable" style="max-height:360px;overflow-y:auto;border:1px solid rgba(255,255,255,0.08);border-radius:8px">
          <table>
            <thead style="position:sticky;top:0;background:#1e293b;z-index:2">
              <tr>
                <th style="width:40px;text-align:center">STT</th>
                <th>MÃ LSC (WO)</th>
                <th>BIỂN SỐ XE</th>
                <th>SỐ KHUNG (VIN)</th>
                <th>DÒNG XE</th>
                <th>KHÁCH HÀNG</th>
                <th style="text-align:center">PHÂN LOẠI TT</th>
                <th style="text-align:center">TRẠNG THÁI LSC</th>
                <th>HẠNG MỤC LỖI / BẢO HÀNH</th>
              </tr>
            </thead>
            <tbody>
              ${unsubmittedRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  $('#overviewContent').innerHTML = `
    ${heroKpiHtml}
    ${verdictBannerHtml}
    ${unsubmittedAlertHtml}
    ${qualityAndCustomerCardsHtml}
    ${unsubmittedWarrantyCardHtml}
    
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(480px, 1fr));gap:20px;align-items:start">
      <div class="card" style="margin-bottom:0">
        <div class="card-header">
          <div>
            <div class="card-title">${window.ICONS.chart} Doanh thu theo tháng (Chốt ngày ${cutTxt})</div>
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
            <div class="card-title">${window.ICONS.trending} Biểu đồ xu hướng doanh thu</div>
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
        <div class="kpi-title">Tiền công còn lại</div>
        <div class="kpi-val">${isReached ? '0' : fmtT(C.planLaborRest)} <span style="font-size:16px">tr</span></div>
        <div class="kpi-sub">Đã làm ${fmtT(C.doneLabor)} triệu tiền công</div>
      </div>
      <div class="kpi-card ${isReached ? 'emerald' : 'indigo'}">
        <div class="kpi-title">Tổng còn phải tạo</div>
        <div class="kpi-val">${isReached ? '0' : fmtT(C.planPartsMoney + C.planLaborRest)} <span style="font-size:16px">tr</span></div>
        <div class="kpi-sub">${isReached ? `Vượt mục tiêu +${fmtT(C.expectedPlan - settings.target)} tr 🎯` : `Còn thiếu thực tế ${fmtT(C.remainingPlan)} tr`}</div>
      </div>
    </div>

    <!-- Phụ tùng dự tính -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">🔌 Phụ tùng dự tính sắp đến (Đã chuẩn bị sẵn / Chắc chắn làm)</div>
          <div class="card-subtitle">Nhập mã phụ tùng + số lượng để hệ thống trừ trước vào doanh thu và tự động giảm số lượng các phụ tùng khác</div>
        </div>
        <button class="btn secondary" onclick="prepAdd()">＋ Thêm dòng</button>
      </div>

      <datalist id="partCodes">${partCodeOpts}</datalist>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="l">Mã phụ tùng</th>
              <th class="l">Tên phụ tùng (tự nhận diện từ 3 tháng)</th>
              <th>Số lượng chuẩn bị</th>
              <th>Đơn giá TB</th>
              <th>Thành tiền dự tính</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${prepRows}</tbody>
        </table>
      </div>
      <div style="font-size:12.5px;color:var(--text-muted);margin-top:10px">
        Tổng tiền đã chuẩn bị: <b>${fmtVND(C.coveredParts)}</b> (${fmtN(C.partsTarget ? C.coveredParts / C.partsTarget * 100 : 0, 0)}% tiền phụ tùng) → phần còn lại <b>${fmtVND(C.remainingParts)}</b> do các phụ tùng khác gánh.
      </div>
    </div>

    <!-- Khuyến nghị hành động -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">💡 Hành động khuyến nghị cho kỳ ${monthLong(tYm)}</div>
          <div class="card-subtitle">Phân tích nhịp độ, tiến độ duyệt hồ sơ và định hướng kho phụ tùng</div>
        </div>
      </div>
      <div class="reco-card">
        ${recos.map(r => `
          <div class="reco-item">
            <span class="reco-icon">${r.icon}</span>
            <div>${r.text}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Bảng kế hoạch chi tiết -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">📋 Bảng kế hoạch phụ tùng còn phải làm — ${monthLong(tYm)}</div>
          <div class="card-subtitle">Số lượng còn phải làm = Kế hoạch cả kỳ − Số đã làm trong kỳ (khấu trừ tự động)</div>
        </div>
      </div>
      <div class="table-container scrollable">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th class="l">Mã phụ tùng</th>
              <th class="l">Tên phụ tùng</th>
              <th>SL TB/tháng</th>
              <th>Kế hoạch cả kỳ</th>
              <th>Đã làm trong kỳ</th>
              <th>Còn phải làm</th>
              <th>Tồn kho</th>
              <th>Tiền còn phải làm</th>
            </tr>
          </thead>
          <tbody>
            ${isReached ? `
              <tr>
                <td colspan="9" style="text-align:center;padding:32px 20px;color:var(--emerald);font-size:14px;font-weight:700">
                  🎯 Doanh thu kỳ ${monthLabel(tYm)} đã đạt và vượt chỉ tiêu (${fmtN(C.expectedPlan / settings.target * 100, 1)}%). Không còn phụ tùng bắt buộc phải chạy thêm.
                </td>
              </tr>` : (planRows || '<tr><td colspan="9" class="empty-state">Không có dữ liệu</td></tr>')}
            <tr class="total-row"><td colspan="8" class="l">TỔNG TIỀN PHỤ TÙNG CÒN PHẢI LÀM (gồm phần đã chuẩn bị)</td><td class="num">${fmtVND(C.planPartsMoney)}</td></tr>
            <tr class="total-row"><td colspan="8" class="l">TIỀN CÔNG CÒN LẠI (đã trừ phần đã làm)</td><td class="num">${fmtVND(C.planLaborRest)}</td></tr>
            <tr class="total-row"><td colspan="8" class="l">TỔNG DOANH THU CÒN PHẢI TẠO</td><td class="num" style="color:var(--primary);font-size:14px">${fmtVND(C.planPartsMoney + C.planLaborRest)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;

  /* ==================== 3. PARTS PANE ==================== */
  const partRows = C.parts3.map((a, i) => {
    const pct = C.parts3Money ? a.money / C.parts3Money * 100 : 0;
    return `
      <tr>
        <td class="l num">${i + 1}</td>
        <td class="l"><b>${esc(a.code)}</b></td>
        <td class="l part-name-cell">${esc(a.name)}</td>
        ${C.months3.map(m => `<td class="num">${ceilInt(qtyOfMonth(C, m, a.code))}</td>`).join('')}
        <td class="num"><b>${ceilInt(a.qty)}</b></td>
        <td class="num">${fmtN(a.qty / 3, 1)}</td>
        <td class="num"><b style="color:var(--primary)">${fmtVND(a.money)}</b></td>
        <td class="num">${fmtN(pct, 1)}%</td>
        <td class="num">${a.props.size}</td>
      </tr>`;
  }).join('');

  $('#partsContent').innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">📦 Tổng hợp phụ tùng 3 tháng gần nhất (${C.months3.map(monthLabel).join(' · ')})</div>
          <div class="card-subtitle">Chỉ tính các đề xuất đã chốt doanh thu · Tiền phụ tùng ${settings.vatMode === 'ex' ? 'Trước VAT' : 'Sau VAT'}</div>
        </div>
      </div>

      <div class="toolbar">
        <div class="toolbar-left">
          <input class="search-input" id="partSearch" placeholder="🔍 Tìm mã hoặc tên phụ tùng…" oninput="filterParts(this.value)">
          <span style="font-size:12.5px;color:var(--text-muted);font-weight:600">${C.parts3.length} mã phụ tùng</span>
        </div>
        <div class="toolbar-right">
          <button class="btn secondary" onclick="exportExcel()">⬇ Xuất Excel</button>
        </div>
      </div>

      <div class="table-container scrollable">
        <table id="partsTable">
          <thead>
            <tr>
              <th>#</th>
              <th class="l">Mã phụ tùng</th>
              <th class="l">Tên phụ tùng</th>
              ${C.months3.map(m => `<th>SL ${monthLabel(m)}</th>`).join('')}
              <th>SL 3 tháng</th>
              <th>SL TB/tháng</th>
              <th>Tiền phụ tùng 3 tháng</th>
              <th>% Tiền</th>
              <th>Số ĐX dùng</th>
            </tr>
          </thead>
          <tbody>
            ${partRows || '<tr><td colspan="10" class="empty-state">Không có dữ liệu</td></tr>'}
            <tr class="total-row">
              <td colspan="4" class="l">TỔNG CỘNG</td>
              <td class="num">${ceilInt(C.parts3.reduce((s, a) => s + a.qty, 0))}</td>
              <td class="num">${fmtN(C.parts3.reduce((s, a) => s + a.qty, 0) / 3, 1)}</td>
              <td class="num">${fmtVND(C.parts3Money)}</td>
              <td class="num">100%</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top:12px;padding:12px 14px;background:var(--primary-soft);border-radius:var(--radius-md);font-size:12.5px;color:#1e40af">
        💡 Cơ cấu 3 tháng: Tiền phụ tùng = <b>${fmtVND(C.parts3Money)}</b> (${fmtN(C.parts3Money / C.total3 * 100, 0)}% doanh thu); Tiền công = <b>${fmtVND(C.labor3)}</b> (${fmtN(100 - C.parts3Money / C.total3 * 100, 0)}%). Tổng doanh thu chốt 3 tháng = <b>${fmtVND(C.total3)}</b>.
      </div>
    </div>`;

  /* ==================== 4. CLAIMS PANE ==================== */
  const f = state.filters;
  let propRows = C.recs.filter(r => r.cm || r.kind !== 'confirmed');
  if(f.cm) propRows = propRows.filter(r => r.cm === f.cm);
  if(f.kind) propRows = propRows.filter(r => r.kind === f.kind);
  if(f.custGroup) {
    propRows = propRows.filter(r => (r.customerGroup && r.customerGroup.id === f.custGroup));
  }
  if(f.returnStatus) {
    if(f.returnStatus === 'all_returned') propRows = propRows.filter(r => r.isReturned);
    else if(f.returnStatus === 'level_1') propRows = propRows.filter(r => r.isReturnLevel1);
    else if(f.returnStatus === 'level_2') propRows = propRows.filter(r => r.isReturnLevel2);
  }
  if(f.q){
    const q = f.q.toLowerCase();
    propRows = propRows.filter(r => (r.id + ' ' + r.vin + ' ' + r.wo + ' ' + (r.customerName || '') + ' ' + (r.customerCompanyName || '') + ' ' + r.parts.map(p => p.code + ' ' + p.name).join(' ')).toLowerCase().includes(q));
  }
  propRows.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

  const propHtml = propRows.map(r => {
    const pTxt = r.parts.length ? r.parts.map(p => `${ceilInt(p.qty)}× ${esc(p.code)}`).join(' + ') : '<span style="color:var(--text-light)">—</span>';
    return `
      <tr>
        <td class="l">
          <b>${esc(r.id)}</b>
          ${r.customerGroup ? `<span style="font-size:10px;padding:1px 6px;border-radius:4px;font-weight:700;margin-left:4px;background:${r.customerGroup.color}22;color:${r.customerGroup.color};border:1px solid ${r.customerGroup.color}50">${r.customerGroup.tag}</span>` : ''}
          ${r.isReturned ? `<span style="font-size:10px;padding:1px 6px;border-radius:4px;font-weight:700;margin-left:4px;background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.4)" title="${esc(r.rejectReason || 'Bị trả về')}">${esc(r.returnLevelLabel || 'Bị trả về')}</span>` : ''}
        </td>
        <td class="l" style="font-size:11.5px;color:var(--text-muted)">${esc(r.srcName)}</td>
        <td class="l">${esc(r.wo) || '—'}</td>
        <td class="l" style="font-family:monospace;font-size:12px">${esc(r.vin) || '—'}</td>
        <td class="num">${fmtDate(r.date) || '—'}</td>
        <td class="num"><b>${r.cm ? monthLabel(r.cm) : '—'}</b></td>
        <td class="l"><span class="status-pill ${r.badge}">${esc(r.kindLabel)}</span></td>
        <td class="part-name-cell">${pTxt}</td>
        <td class="num">${fmtVND(r.parts.reduce((s, p) => s + p.money, 0))}</td>
        <td class="num">${fmtVND(r.labor)}</td>
        <td class="num"><b style="color:var(--primary)">${fmtVND(r.total)}</b></td>
      </tr>`;
  }).join('');

  const cmOpts = [...new Set(C.recs.map(r => r.cm).filter(Boolean))].sort().reverse().map(m => `<option value="${m}" ${f.cm === m ? 'selected' : ''}>${monthLabel(m)}</option>`).join('');

  $('#claimsContent').innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">📋 Tra cứu chi tiết từng đề xuất bảo hành</div>
          <div class="card-subtitle">Mỗi lệnh sửa chữa được gộp 1 dòng duy nhất · Hỗ trợ lọc theo kỳ, trạng thái và từ khoá</div>
        </div>
      </div>

      <div class="toolbar">
        <div class="toolbar-left">
          <select class="select-input" id="fCm" onchange="setFilter('cm',this.value)">
            <option value="">— Mọi kỳ doanh thu —</option>
            ${cmOpts}
          </select>
          <select class="select-input" id="fCustGroup" onchange="setFilter('custGroup',this.value)">
            <option value="">— Mọi nhóm khách —</option>
            <option value="gsm" ${f.custGroup === 'gsm' ? 'selected' : ''}>🚕 GSM (Xanh SM)</option>
            <option value="bship" ${f.custGroup === 'bship' ? 'selected' : ''}>🛵 Bship</option>
            <option value="retail" ${f.custGroup === 'retail' ? 'selected' : ''}>👤 Khách lẻ</option>
            <option value="corp" ${f.custGroup === 'corp' ? 'selected' : ''}>🏢 Doanh nghiệp</option>
          </select>
          <select class="select-input" id="fReturnStatus" onchange="setFilter('returnStatus',this.value)">
            <option value="">— Trạng thái trả về —</option>
            <option value="all_returned" ${f.returnStatus === 'all_returned' ? 'selected' : ''}>❌ Tất cả ĐX bị trả về</option>
            <option value="level_1" ${f.returnStatus === 'level_1' ? 'selected' : ''}>⚠️ Cấp 1 trả về</option>
            <option value="level_2" ${f.returnStatus === 'level_2' ? 'selected' : ''}>🚫 Cấp 2 trả về</option>
          </select>
          <select class="select-input" id="fKind" onchange="setFilter('kind',this.value)">
            <option value="">— Mọi trạng thái —</option>
            <option value="confirmed" ${f.kind === 'confirmed' ? 'selected' : ''}>Chốt — Doanh thu (Hoàn thành + Đã duyệt)</option>
            <option value="pipeline" ${f.kind === 'pipeline' ? 'selected' : ''}>Dự trù (Chờ duyệt cấp 1/2 · Mở)</option>
            <option value="excluded" ${f.kind === 'excluded' ? 'selected' : ''}>Loại bỏ (Huỷ / Từ chối)</option>
          </select>
          <input class="search-input" id="qSearch" placeholder="🔍 Tìm mã ĐX, VIN, Lệnh SC, Phụ tùng…" oninput="setFilter('q',this.value)" value="${esc(f.q)}">
        </div>
        <div class="toolbar-right">
          <span style="font-size:12.5px;color:var(--text-muted);font-weight:600">${propRows.length} đề xuất</span>
        </div>
      </div>

      <div class="table-container scrollable">
        <table>
          <thead>
            <tr>
              <th class="l">Mã ĐX</th>
              <th class="l">Nguồn file</th>
              <th class="l">Lệnh sửa chữa</th>
              <th class="l">Số VIN</th>
              <th>Ngày duyệt</th>
              <th>Kỳ</th>
              <th class="l">Trạng thái</th>
              <th class="l">Phụ tùng (SL × Mã)</th>
              <th>Tiền phụ tùng</th>
              <th>Tiền công</th>
              <th>Tổng tiền ĐX</th>
            </tr>
          </thead>
          <tbody>
            ${propHtml || '<tr><td colspan="11" class="empty-state">Không có dữ liệu khớp bộ lọc</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>`;
}

window.setFilter = (k, v) => {
  state.filters[k] = v;
  renderAll();
  const el = k === 'q' ? $('#qSearch') : (k === 'cm' ? $('#fCm') : $('#fKind'));
  if(el){ el.focus(); if(k === 'q') el.setSelectionRange(v.length, v.length); }
};

window.filterParts = q => {
  q = norm(q);
  $('#partsTable').querySelectorAll('tbody tr:not(.total-row)').forEach(tr => {
    tr.style.display = !q || norm(tr.textContent).includes(q) ? '' : 'none';
  });
};

function qtyOfMonth(C, cm, code){
  let s = 0;
  for(const r of C.recs){
    if(r.kind !== 'confirmed' || r.cm !== cm) continue;
    for(const p of r.parts) if(p.code === code) s += p.qty;
  }
  return s;
}

function svgChart(data, target){
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const W = 760, H = 230, padL = 64, padB = 44, padT = 26, barW = Math.min(52, (W - padL - 20) / data.length * 0.52);
  const maxV = Math.max(target, ...data.map(d => d.conf + d.pipe)) * 1.16 || 1;
  const y = v => padT + (H - padT - padB) * (1 - v / maxV);
  
  const gridStroke = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)';
  const axisText = isLight ? '#64748b' : '#94a3b8';
  const valText = isLight ? '#0f172a' : '#f8fafc';
  const targetLineColor = isLight ? '#e11d48' : '#f43f5e';
  
  const gradConfId = isLight ? 'gradConfLight' : 'gradConfDark';
  const gradPipeId = isLight ? 'gradPipeLight' : 'gradPipeDark';
  
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;overflow:visible">
    <defs>
      <linearGradient id="gradConfDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="gradConfLight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0ea5e9"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="gradPipeDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <linearGradient id="gradPipeLight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
    </defs>`;
    
  for(let i = 0; i <= 4; i++){
    const vv = maxV * i / 4, yy = y(vv);
    s += `<line x1="${padL}" y1="${yy}" x2="${W - 12}" y2="${yy}" stroke="${gridStroke}" stroke-dasharray="3 3"/>
          <text x="${padL - 10}" y="${yy + 4}" font-size="11" font-weight="500" fill="${axisText}" text-anchor="end" font-family="system-ui">${fmtT(vv)}tr</text>`;
  }
  
  const targetY = y(target);
  s += `<line x1="${padL}" y1="${targetY}" x2="${W - 12}" y2="${targetY}" stroke="${targetLineColor}" stroke-dasharray="6 4" stroke-width="2"/>
        <text x="${W - 14}" y="${targetY - 6}" font-size="11.5" font-weight="700" fill="${targetLineColor}" text-anchor="end" font-family="system-ui">Mục tiêu: ${fmtT(target)}tr</text>`;
        
  data.forEach((d, i) => {
    const cx = padL + (i + 0.5) * ((W - padL - 20) / data.length);
    const hConf = Math.max(2, (H - padT - padB) * (d.conf / maxV));
    const hPipe = Math.max(0, (H - padT - padB) * (d.pipe / maxV));
    
    // Confirmed revenue bar
    s += `<rect x="${cx - barW / 2}" y="${y(d.conf)}" width="${barW}" height="${hConf}" fill="url(#${gradConfId})" rx="5" style="transition:all 0.3s ease;cursor:pointer"><title>Kỳ ${monthLabel(d.m)}
Doanh thu chốt: ${fmtVND(d.conf)}</title></rect>`;
    
    // Contingency/pipeline bar
    if(d.pipe > 0){
      s += `<rect x="${cx - barW / 2}" y="${y(d.conf + d.pipe)}" width="${barW}" height="${hPipe}" fill="url(#${gradPipeId})" rx="5" opacity="0.9" style="transition:all 0.3s ease;cursor:pointer"><title>Kỳ ${monthLabel(d.m)}
Dự trù: ${fmtVND(d.pipe)}</title></rect>`;
    }
    
    // Month label
    s += `<text x="${cx}" y="${H - padB + 18}" font-size="12" fill="${axisText}" text-anchor="middle" font-weight="600" font-family="system-ui">${monthLabel(d.m)}</text>`;
    // Total value label
    s += `<text x="${cx}" y="${y(d.conf + d.pipe) - 8}" font-size="11.5" fill="${valText}" text-anchor="middle" font-weight="800" font-family="system-ui">${fmtT(d.conf + d.pipe)}tr</text>`;
  });
  
  // Legend
  s += `<rect x="${padL}" y="${H - 12}" width="12" height="12" fill="url(#${gradConfId})" rx="3"/><text x="${padL + 18}" y="${H - 2}" font-size="11.5" font-weight="600" fill="${axisText}" font-family="system-ui">Doanh thu chốt</text>`;
  s += `<rect x="${padL + 180}" y="${H - 12}" width="12" height="12" fill="url(#${gradPipeId})" rx="3"/><text x="${padL + 198}" y="${H - 2}" font-size="11.5" font-weight="600" fill="${axisText}" font-family="system-ui">Dự trù</text>`;
  return s + '</svg>';
}

/* ============================ Export ============================ */
window.exportExcel = function(){
  const C = state.computed || computeAll();
  const cutTxt = settings.cycle22 ? settings.cut : 28;
  const wb = XLSX.utils.book_new();

  // 1. Tham số
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
    ['THAM SỐ KẾ HOẠCH BẢO HÀNH'], [],
    ['Tháng kế hoạch', monthLong(settings.targetMonth)],
    ['Mục tiêu doanh thu (VND)', settings.target],
    ['Chế độ thuế', settings.vatMode === 'ex' ? 'Trước VAT' : 'Sau VAT'],
    ['Kỳ doanh thu', settings.cycle22 ? `chốt ngày ${settings.cut} (23 tháng trước – ${settings.cut} tháng này)` : 'theo tháng dương lịch'],
    ['3 tháng phân tích', C.months3.map(monthLabel).join(', ')],
    ['Doanh thu TB 3 tháng (VND)', Math.round(C.revAvg)],
    ['Hệ số quy đổi', +C.scale.toFixed(4)],
    ['Hệ số sau dự tính', +C.scale2.toFixed(4)],
    ['Phụ tùng dự tính đã chuẩn bị', C.preparedInfo.filter(p => p.known).map(p => `${p.code} x${p.qty}`).join('; ') || '(không)'],
    ['Tiền đã chuẩn bị (VND)', Math.round(C.coveredParts)],
    ['Đã làm trong kỳ', `${C.doneCnt} đề xuất · ${Math.round(C.doneTotal)} VND`],
    ['Nhịp 1 ngày 3 tháng (VND)', Math.round(C.histDaily)],
    ['Nhịp 1 ngày kỳ này (VND)', C.elapsedDays ? Math.round(C.curDaily) : ''],
    ['Tỷ lệ nhịp (%)', C.elapsedDays ? +(C.ratio * 100).toFixed(1) : ''],
    ['Khả năng đạt mục tiêu', C.verdict],
    ['Xuất lúc', new Date().toLocaleString('vi-VN')],
  ]), 'Tham so');

  // 2. Doanh thu theo tháng
  const monthsAll = [...C.months.keys()].sort().filter(m => m <= settings.targetMonth);
  if(!monthsAll.includes(settings.targetMonth)) monthsAll.push(settings.targetMonth);
  const mSheet = [['Kỳ', 'Phạm vi kỳ', 'Số ĐX hoàn thành', 'Doanh thu chốt (VND)', 'Dự trù (VND)', 'Tổng dự kiến (VND)', 'Mục tiêu (VND)', 'Chênh lệch (VND)']];
  for(const m of monthsAll){
    const o = C.months.get(m) || { conf: 0, cnt: 0, pipe: 0 };
    const exp = o.conf + o.pipe;
    mSheet.push([monthLabel(m), cycleRangeText(m, cutTxt), o.cnt, Math.round(o.conf), Math.round(o.pipe), Math.round(exp), settings.target, Math.round(exp - settings.target)]);
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(mSheet), 'Doanh thu theo thang');

  // 3. Phụ tùng 3 tháng
  const pSheet = [['Mã phụ tùng', 'Tên phụ tùng', ...C.months3.map(m => 'SL ' + monthLabel(m)), 'SL 3 tháng (làm tròn)', 'SL TB/tháng', 'Tiền phụ tùng 3 tháng', 'Số đề xuất sử dụng']];
  for(const a of C.parts3) pSheet.push([a.code, a.name, ...C.months3.map(m => ceilInt(qtyOfMonth(C, m, a.code))), ceilInt(a.qty), +(a.qty / 3).toFixed(2), Math.round(a.money), a.props.size]);
  pSheet.push(['TỔNG', '', '', '', '', '', '', '', Math.round(C.parts3Money), '']);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(pSheet), 'Tong hop phu tung 3 thang');

  // 4. Kế hoạch
  const plSheet = [
    ['KẾ HOẠCH CÒN PHẢI LÀM ' + monthLong(settings.targetMonth).toUpperCase() + ' — MỤC TIÊU ' + settings.target.toLocaleString('vi-VN') + ' VND'], [],
    ['ĐÃ LÀM TRONG KỲ (tự khấu trừ)', `${C.doneCnt} đề xuất · ${Math.round(C.doneTotal)} VND · tiền công ${Math.round(C.doneLabor)} VND`], [],
    ['PHỤ TÙNG DỰ TÍNH SẮP ĐẾN'],
    ['Mã phụ tùng', 'Số lượng', 'Đơn giá TB (VND)', 'Thành tiền (VND)']
  ];
  for(const p of C.preparedInfo) plSheet.push([p.code, p.qty, p.known ? Math.round(p.unit) : '', p.known ? Math.round(p.money) : '']);
  plSheet.push(['TỔNG ĐÃ CHUẨN BỊ', '', '', Math.round(C.coveredParts)], [],
    ['KẾ HOẠCH CÁC PHỤ TÙNG CÒN PHẢI LÀM THÊM'],
    ['Mã phụ tùng', 'Tên phụ tùng', 'SL TB/tháng', 'Kế hoạch cả kỳ', 'Đã làm trong kỳ', 'SL còn phải làm', 'Tồn kho', 'Tiền còn phải làm (VND)']);
  for(const p of C.planMajor) plSheet.push([p.code, p.name, +(p.qAvg.toFixed(2)), p.qBase, p.doneQ, p.qNeed, p.invQty !== null ? p.invQty : '', Math.round(p.mNeed)]);
  if(C.planMinorAgg) plSheet.push([`NHÓM PHỤ TÙNG KHÁC (${C.planMinorAgg.count} mã, tỷ trọng thấp)`, '', +(C.planMinorAgg.qAvg.toFixed(2)), C.planMinorAgg.qBase, C.planMinorAgg.doneQ, C.planMinorAgg.qNeed, '', Math.round(C.planMinorAgg.mNeed)]);
  plSheet.push(['TỔNG TIỀN PHỤ TÙNG CÒN PHẢI LÀM', '', '', '', '', '', '', Math.round(C.planPartsMoney)]);
  plSheet.push(['TIỀN CÔNG CÒN LẠI', '', '', '', '', '', '', Math.round(C.planLaborRest)]);
  plSheet.push(['TỔNG DOANH THU CÒN PHẢI TẠO', '', '', '', '', '', '', Math.round(C.planPartsMoney + C.planLaborRest)], [],
    ['KHẢ NĂNG ĐẠT MỤC TIÊU', C.verdict],
    ['Chi tiết', C.verdictDetail.replace(/<[^>]+>/g, '')]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(plSheet), 'Ke hoach ' + settings.targetMonth.replace('-', '_'));

  // 5. Đề xuất chi tiết
  const dSheet = [['Mã ĐX', 'Nguồn file', 'Lệnh sửa chữa', 'VIN', 'Ngày phê duyệt', 'Kỳ doanh thu', 'Trạng thái', 'Phân loại', 'Phụ tùng (SL× mã)', 'Tiền phụ tùng (VND)', 'Tiền công (VND)', 'Tổng tiền ĐX (VND)']];
  for(const r of [...C.recs].sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))){
    dSheet.push([r.id, r.srcName, r.wo, r.vin, fmtDate(r.date), r.cm ? monthLabel(r.cm) : '', r.status, r.kindLabel, r.parts.map(p => `${ceilInt(p.qty)}x ${p.code}`).join(' + '), Math.round(r.parts.reduce((s, p) => s + p.money, 0)), Math.round(r.labor), Math.round(r.total)]);
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dSheet), 'De xuat chi tiet');
  XLSX.writeFile(wb, `BaoHanhPro_${settings.targetMonth.replace('-', '')}.xlsx`);
};

// Access gate completely removed

/* ============================ Init ============================ */
function initSettingsUI(){
  $('#targetMonth').value = settings.targetMonth;
  $('#targetValue').value = settings.target;
  $('#cutDay').value = settings.cut;
  $('#cycleToggle').checked = settings.cycle22;
  const vatEl = $('#vatMode');
  if(vatEl){
    vatEl.value = settings.vatMode;
    vatEl.onchange = e => setVatMode(e.target.value);
  }
  $('#targetMonth').onchange = e => { settings.targetMonth = e.target.value || defaultTargetMonth(); initTheme();
loadPrepared();
loadCheckXeOrders();
initBookmarkletCode();
renderCheckXe();
checkUrlImport();
window.addEventListener('hashchange', checkUrlImport);
renderAll(); };
  $('#targetValue').onchange = e => { settings.target = +e.target.value || 0; renderAll(); };
  $('#cutDay').onchange = e => { settings.cut = Math.min(28, Math.max(1, +e.target.value || 22)); e.target.value = settings.cut; renderAll(); };
  $('#cycleToggle').onchange = e => { settings.cycle22 = e.target.checked; renderAll(); };
}

const dz = $('#dropZone');
dz.onclick = () => $('#fileInput').click();
$('#fileInput').onchange = e => { handleFiles([...e.target.files]); e.target.value = ''; };
['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('over'); }));
dz.addEventListener('drop', e => handleFiles([...e.dataTransfer.files]));

const idz = $('#invDropZone');
idz.onclick = () => $('#invFileInput').click();
$('#invFileInput').onchange = e => { handleInvFiles([...e.target.files]); e.target.value = ''; };
['dragenter', 'dragover'].forEach(ev => idz.addEventListener(ev, e => { e.preventDefault(); idz.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => idz.addEventListener(ev, e => { e.preventDefault(); idz.classList.remove('over'); }));
idz.addEventListener('drop', e => handleInvFiles([...e.dataTransfer.files]));

// gateBtn removed
// gate listener removed
// gate check removed

loadPrepared();
loadCheckXeOrders();
initBookmarkletCode();
renderCheckXe();
checkUrlImport();
window.addEventListener('hashchange', checkUrlImport);
initSettingsUI();
renderSources();
renderAll();
window.__handleFiles = handleFiles;

// =========================================================
// HIỆU ỨNG TƯƠNG TÁC 3D MƯỢT MÀ CHO LOGO NT (3D PERSPECTIVE)
// =========================================================
(function() {
  function setupEmblemInteraction() {
    const emblem = document.querySelector('.brand-emblem-wrap');
    if (!emblem) return;
    
    let isHovered = false;
    emblem.addEventListener('mouseenter', () => { isHovered = true; });
    emblem.addEventListener('mouseleave', () => {
      isHovered = false;
      emblem.style.transform = 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
    
    emblem.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      const rect = emblem.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / (rect.height / 2)) * 22;
      const rotY = (x / (rect.width / 2)) * 22;
      emblem.style.transform = `perspective(400px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.12)`;
    });
    
    emblem.addEventListener('click', () => {
      emblem.style.transition = 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)';
      emblem.style.transform = 'perspective(400px) rotateY(360deg) scale(1.18)';
      setTimeout(() => {
        emblem.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
        emblem.style.transform = 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)';
      }, 700);
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEmblemInteraction);
  } else {
    setupEmblemInteraction();
  }
})();

