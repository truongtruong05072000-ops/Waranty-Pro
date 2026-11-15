'use strict';
/* global S, $, $$, api, esc, icon, can, LOGO, initials, roleLabel, toast, onGlobal, resetPageHandlers, closeModal, currentModal, field, input,
   passwordFormHtml, submitPasswordChange, openPasswordModal, pageDashboard, pageBoard, pageWoList, pageWoNew, pageWoDetail, pageAppointments,
   pageCustomers, pageCustomerDetail, pageVehicles, pageCare, pageReports, pageUsers, pageRoles, pageBranches, pageAudit, localStorage,
   pageCampaigns, pageSchedule, pageSettings, pageAppsheetSync, pageCheckins, pageWarrantyTickets, pageWarrantyTicketDetail, pageHelp, pageInventory, pageInventoryCentral, pageWorkshopMap, pageDpPendingWarranty, WSM_LAYOUT_BRANCHES, enableTableColResize, watchTableColResize */

const NAV = [
  // Thứ tự theo luồng việc ở xưởng: tiếp nhận → phiếu sửa chữa → bảo hành → xưởng & kho → khách hàng.
  // Mục đầu tiên có quyền là trang mở mặc định sau đăng nhập.
  { group: 'Chung', items: [
    { href: '/dashboard', icon: 'layout', label: 'Tổng quan', perm: 'dashboard.view' },
    { href: '/chat', icon: 'chatCall', label: 'Tin nhắn & Cuộc gọi', show: () => true, badge: 'nav-chat-n' },
    { href: '/reports', icon: 'barChart', label: 'Báo cáo', perm: 'report.view' },
  ] },
  { group: 'Tiếp nhận', items: [
    { href: '/appointments', icon: 'calClock', label: 'Lịch hẹn', perm: 'appt.view' },
    { href: '/checkins', icon: 'clipCheck', label: 'Đăng ký tiếp nhận', perm: ['wo.create', 'wo.inspect'] },
    { href: '/work-orders/new?source=gsm', icon: 'plusCircle', label: 'Nhận xe mới', perm: ['wo.create', 'wo.inspect'], exact: true },
  ] },
  { group: 'Phiếu sửa chữa', items: [
    { href: '/work-orders-overview', icon: 'sheet', label: 'Danh sách tổng quan', perm: 'wo.view' },
    { href: '/work-orders', icon: 'tool', label: 'Phiếu sửa chữa GSM', perm: 'wo.view' },
    { href: '/bship-orders', icon: 'truck', label: 'Phiếu sửa chữa BShip', perm: 'wo.view', show: () => can('wo.view') && S.me.role !== 'gsm' },
    { href: '/retail-orders', icon: 'userCircle', label: 'Phiếu sửa chữa khách lẻ', perm: 'wo.view', show: () => can('wo.view') && S.me.role !== 'gsm' },
  ] },
  { group: 'Bảo hành', items: [
    { href: '/retail-warranty', icon: 'shieldCheck', label: 'Phiếu bảo hành khách lẻ', perm: 'wo.view', show: () => can('wo.view') && S.me.role !== 'gsm' },
    { href: '/warranty-orders', icon: 'badgeCheck', label: 'Bảo hành tổng hợp', perm: 'wo.view' },
    { href: '/lsc-cho-dxbh', icon: 'clipboard', label: 'LSC chưa tạo ĐXBH', perm: 'wo.view', show: () => can('wo.view') && S.me.role !== 'gsm' },
  ] },
  { group: 'Xưởng & kho', items: [
    { href: '/board', icon: 'kanban', label: 'Điều phối xưởng', perm: 'wo.view' },
    { href: '/workshop-map', icon: 'map', label: 'Sơ đồ xưởng 3D', perm: 'wo.view',
      show: () => can('wo.view') && (can('branch.all') || !S.me.branch_code || WSM_LAYOUT_BRANCHES.includes(S.me.branch_code)) },
    { href: '/schedule', icon: 'calDays', label: 'Lịch làm việc', perm: 'schedule.view' },
    { href: '/inventory', icon: 'package', label: 'Tồn kho miền Nam', perm: 'inventory.view' },
    { href: '/inventory-central', icon: 'package', label: 'Tồn kho miền Trung', perm: 'inventory.view' },
  ] },
  { group: 'Khách hàng & xe', items: [
    { href: '/customers', icon: 'users', label: 'Khách hàng', perm: 'customer.view' },
    { href: '/vehicles', icon: 'scooter', label: 'Thông tin xe', perm: 'customer.view' },
    { href: '/care', icon: 'headset2', label: 'Chăm sóc khách hàng', perm: 'care.view' },
    { href: '/campaigns', icon: 'megaphone2', label: 'Chiến dịch', perm: 'campaign.view' },
    { href: '/calls', icon: 'phoneCall', label: 'Lịch sử cuộc gọi', perm: 'wo.view' },
  ] },
  { group: 'Quản trị', items: [
    { href: '/admin/users', icon: 'userCog', label: 'Tài khoản', perm: 'admin.users' },
    { href: '/admin/roles', icon: 'keyRound', label: 'Phân quyền', perm: 'admin.users' },
    { href: '/admin/branches', icon: 'building2', label: 'Cơ sở', perm: 'admin.branches' },
    { href: '/admin/settings', icon: 'sliders', label: 'Cấu hình', perm: 'admin.settings' },
    { href: '/admin/audit', icon: 'scrollText', label: 'Nhật ký hệ thống', perm: 'audit.view' },
  ] },
  // Trang cài PWA (ngoài SPA) – ẩn khi đang mở bằng app đã cài
  { group: 'Ứng dụng', items: [
    { href: '/help', icon: 'bookOpen', label: 'Hướng dẫn', show: () => true },
    { ext: '/tai-app.html', click: 'install-app', icon: 'download', label: 'Tải ứng dụng', show: () => !isStandalonePwa() },
  ] },
];

const ROUTES = [
  { re: /^\/dashboard$/, perm: 'dashboard.view', title: 'Tổng quan', render: pageDashboard },
  { re: /^\/board$/, perm: 'wo.view', title: 'Điều phối xưởng', render: pageBoard },
  { re: /^\/workshop-map$/, perm: 'wo.view', title: 'Sơ đồ xưởng 3D', render: pageWorkshopMap },
  { re: /^\/work-orders$/, perm: 'wo.view', title: 'Phiếu sửa chữa GSM', render: pageWoList },
  { re: /^\/warranty-orders$/, perm: 'wo.view', title: 'Bảo hành tổng hợp', render: pageWoList },
  { re: /^\/retail-orders$/, perm: 'wo.view', title: 'Phiếu sửa chữa khách lẻ', render: pageWoList },
  { re: /^\/bship-orders$/, perm: 'wo.view', title: 'Phiếu sửa chữa BShip', render: pageWoList },
  { re: /^\/retail-warranty$/, perm: 'wo.view', title: 'Phiếu bảo hành khách lẻ', render: pageWoList },
  { re: /^\/work-orders-overview$/, perm: 'wo.view', title: 'Danh sách tổng quan', render: pageWoList },
  { re: /^\/warranty-tickets$/, perm: 'wo.view', title: 'Phiếu bảo hành', render: pageWarrantyTickets },
  { re: /^\/lsc-cho-dxbh$/, perm: 'wo.view', title: 'LSC chưa tạo ĐXBH', render: pageDpPendingWarranty },
  { re: /^\/checkins$/, perm: ['wo.create', 'wo.inspect'], title: 'Đăng ký tiếp nhận', render: pageCheckins },
  { re: /^\/work-orders\/new$/, perm: ['wo.create', 'wo.inspect'], title: 'Nhận xe mới', docTitle: 'Tiếp nhận xe mới', render: pageWoNew },
  { drawer: '#/work-orders', re: /^\/work-orders\/(\d+)$/, perm: 'wo.view', title: 'Chi tiết phiếu sửa chữa', render: pageWoDetail },
  // Mở phiếu từ trang Phiếu bảo hành: giữ mục menu + nút quay lại về danh sách bảo hành
  { drawer: '#/warranty-orders', re: /^\/warranty-orders\/(\d+)$/, perm: 'wo.view', title: 'Chi tiết phiếu bảo hành', render: pageWoDetail },
  { drawer: '#/retail-orders', re: /^\/retail-orders\/(\d+)$/, perm: 'wo.view', title: 'Chi tiết phiếu sửa chữa', render: pageWoDetail },
  { drawer: '#/bship-orders', re: /^\/bship-orders\/(\d+)$/, perm: 'wo.view', title: 'Chi tiết phiếu sửa chữa', render: pageWoDetail },
  { drawer: '#/retail-warranty', re: /^\/retail-warranty\/(\d+)$/, perm: 'wo.view', title: 'Chi tiết phiếu bảo hành', render: pageWoDetail },
  { drawer: '#/warranty-tickets', re: /^\/warranty-tickets\/(\d+)$/, perm: 'wo.view', title: 'Chi tiết phiếu bảo hành', render: pageWarrantyTicketDetail },
  { re: /^\/campaigns$/, perm: 'campaign.view', title: 'Chiến dịch', render: pageCampaigns },
  { re: /^\/schedule$/, perm: 'schedule.view', title: 'Lịch làm việc', render: pageSchedule },
  { re: /^\/admin\/settings$/, perm: 'admin.settings', title: 'Cấu hình', render: pageSettings },
  { re: /^\/admin\/appsheet$/, perm: 'admin.settings', title: 'Đồng bộ AppSheet', render: pageAppsheetSync },
  { re: /^\/appointments$/, perm: 'appt.view', title: 'Lịch hẹn', render: pageAppointments },
  { re: /^\/customers$/, perm: 'customer.view', title: 'Khách hàng', render: pageCustomers },
  { re: /^\/customers\/(\d+)$/, perm: 'customer.view', title: 'Hồ sơ khách hàng', render: pageCustomerDetail },
  { re: /^\/vehicles$/, perm: 'customer.view', title: 'Thông tin xe', render: pageVehicles },
  { re: /^\/care$/, perm: 'care.view', title: 'Chăm sóc khách hàng', render: pageCare },
  { re: /^\/reports$/, perm: 'report.view', title: 'Báo cáo', render: pageReports },
  { re: /^\/admin\/users$/, perm: 'admin.users', title: 'Tài khoản', render: pageUsers },
  { re: /^\/admin\/roles$/, perm: 'admin.users', title: 'Phân quyền', render: pageRoles },
  { re: /^\/admin\/branches$/, perm: 'admin.branches', title: 'Cơ sở', render: pageBranches },
  { re: /^\/admin\/audit$/, perm: 'audit.view', title: 'Nhật ký hệ thống', render: pageAudit },
  { re: /^\/calls$/, perm: 'wo.view', title: 'Lịch sử cuộc gọi', render: pageCalls },
  { re: /^\/help$/, title: 'Hướng dẫn sử dụng', render: pageHelp },
  { re: /^\/chat$/, title: 'Chat nội bộ', render: pageChat },
  { re: /^\/inventory$/, perm: 'inventory.view', title: 'Tồn kho miền Nam', render: pageInventory },
  { re: /^\/inventory-central$/, perm: 'inventory.view', title: 'Tồn kho miền Trung', render: pageInventoryCentral },
];

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  return { path, query: new URLSearchParams(query) };
}

function setQuery(updates, { resetPage = true } = {}) {
  const { path, query } = parseHash();
  Object.entries(updates).forEach(([k, v]) => {
    if (v === '' || v === null || v === undefined || v === false) query.delete(k);
    else query.set(k, v);
  });
  if (resetPage && !('page' in updates)) query.delete('page');
  const s = query.toString();
  window.location.hash = `#${path}${s ? `?${s}` : ''}`;
}

async function loadMeta(fromMe) {
  S.meta = (fromMe && fromMe.meta) ? fromMe.meta : await api('GET', '/api/meta');
  syncMenuColor();
}
function syncMenuColor() {
  const mc = window.ATTMenuColor;
  const st = S.meta && S.meta.settings;
  if (mc && st && 'menu_color' in st) mc.sync(st.menu_color);
}

// ---------------------------------------------------------------------------
// Đăng nhập
// ---------------------------------------------------------------------------
// Bánh xe quay đè lên ảnh người lái (login-rider.png 320x295): tâm/bán kính đo từ ảnh; khuôn login-rider-w*.png chỉ hở
// chỗ bánh tối màu nên thân xe trắng, phuộc bạc vẫn nằm trên bánh
const riderWheel = (cls, size, cx, cy, r) => {
  const spokes = [0, 72, 144, 216, 288].map((a) => [-7, 7].map((o) => {
    const t = ((a + o) * Math.PI) / 180;
    const p = (k) => `${(cx + Math.sin(t) * r * k).toFixed(2)} ${(cy - Math.cos(t) * r * k).toFixed(2)}`;
    return `<path d="M${p(0.16)} L${p(0.64)}"/>`;
  }).join('')).join('');
  const c = (k, attrs) => `<circle cx="${cx}" cy="${cy}" r="${(r * k).toFixed(2)}" ${attrs}/>`;
  // Lốp + vành + chấu, giữa các chấu để hở (nền nhìn xuyên qua như mâm thật)
  return `<div class="sc-w ${cls}"><svg viewBox="0 0 ${size} ${size}" style="transform-origin:${((cx / size) * 100).toFixed(2)}% ${((cy / size) * 100).toFixed(2)}%"><g class="sc-spin">
    ${c(0.86, `fill="none" stroke="#0d1117" stroke-width="${(r * 0.28).toFixed(2)}"`)}
    ${c(0.9, `fill="none" stroke="#232a35" stroke-width="${(r * 0.035).toFixed(2)}"`)}
    ${c(0.67, `fill="none" stroke="#1a2029" stroke-width="${(r * 0.1).toFixed(2)}"`)}
    ${c(0.72, 'fill="none" stroke="#3b4453" stroke-width="1"')}
    <g stroke="#1d232d" stroke-width="${(r * 0.1).toFixed(2)}" stroke-linecap="round">${spokes}</g>
    ${c(0.18, 'fill="#1d232d"')}${c(0.11, 'fill="#8b96a3"')}${c(0.045, 'fill="#d6dde5"')}
  </g></svg></div>`;
};
const LOGIN_RIDER = `<img src="/img/login-rider-body.png" alt="" width="320" height="295" decoding="async">
  ${riderWheel('sc-wr', 84, 42.3, 42, 40)}${riderWheel('sc-wf', 83, 41.1, 41.5, 39.5)}`;

// Bong bóng kính trôi trên nền đăng nhập: [khóa nhãn, left %, top %, cỡ px]; khóa rỗng = bong bóng nhỏ trang trí
const LOGIN_BUBBLES = [
  ['recv', 4, 9, 96], ['dispatch', 21, 5, 88], ['repair', 39, 11, 84], ['warranty', 3, 43, 92],
  ['parts', 42, 58, 86], ['reports', 90, 13, 80], ['care', 91, 38, 78], ['appt', 24, 62, 80],
  ['', 33, 52, 18], ['', 53, 27, 22], ['', 5, 25, 14], ['', 88, 26, 16],
];
// Các cặp bong bóng lao vào nhau (kiểu cổng VinFast): [a, b, thời điểm chạm trong vòng 20s (0..1)]
const LOGIN_BUBBLE_HITS = [['recv', 'dispatch', 0.10], ['reports', 'care', 0.25], ['dispatch', 'repair', 0.35],
  ['warranty', 'appt', 0.55], ['appt', 'parts', 0.80]];
const BUBBLE_CYCLE = 20000;
// Tính quãng lao theo vị trí thật trên màn hình: 2 bong bóng đi về phía nhau, chạm mép thì bóp méo + vòng sáng rồi nảy về
function startBubbleHits() {
  const box = $('.login-v2 .la-bubbles');
  if (!box || !box.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = {};
  box.querySelectorAll('.la-bubble[data-k]').forEach((el) => {
    el.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    const r = el.getBoundingClientRect();
    els[el.dataset.k] = { el, x: r.left + r.width / 2, y: r.top + r.height / 2, rad: r.width / 2, hits: [] };
  });
  if (!Object.keys(els).length || !els.recv || !els.recv.rad) return;
  for (const [a, b, t] of LOGIN_BUBBLE_HITS) {
    const A = els[a]; const B = els[b];
    if (!A || !B) continue;
    const dx = B.x - A.x; const dy = B.y - A.y; const d = Math.hypot(dx, dy) || 1;
    const travel = Math.max(0, (d - A.rad - B.rad) / 2);
    const ux = dx / d; const uy = dy / d;
    const horiz = Math.abs(ux) >= Math.abs(uy);
    A.hits.push({ t, x: ux * travel, y: uy * travel, horiz });
    B.hits.push({ t, x: -ux * travel, y: -uy * travel, horiz });
  }
  const EASE_IN = 'cubic-bezier(.55,0,.85,.45)'; const EASE_OUT = 'cubic-bezier(.15,.55,.45,1)';
  for (const B of Object.values(els)) {
    if (!B.hits.length) continue;
    B.hits.sort((p, q) => p.t - q.t);
    const move = [{ offset: 0, translate: '0px 0px', easing: 'linear' }];
    const squash = [{ offset: 0, scale: '1 1' }];
    const ring = [{ offset: 0, opacity: 0, transform: 'scale(1)' }];
    for (const h of B.hits) {
      const at = `${h.x.toFixed(1)}px ${h.y.toFixed(1)}px`;
      move.push({ offset: h.t - 0.10, translate: '0px 0px', easing: EASE_IN }, { offset: h.t, translate: at, easing: 'linear' },
        { offset: h.t + 0.008, translate: at, easing: EASE_OUT }, { offset: h.t + 0.11, translate: '0px 0px', easing: 'linear' });
      const sq = h.horiz ? ['0.9 1.07', '1.03 0.98'] : ['1.07 0.9', '0.98 1.03'];
      squash.push({ offset: h.t, scale: '1 1' }, { offset: h.t + 0.007, scale: sq[0] }, { offset: h.t + 0.018, scale: sq[1] }, { offset: h.t + 0.03, scale: '1 1' });
      ring.push({ offset: h.t - 0.001, opacity: 0, transform: 'scale(1)' }, { offset: h.t + 0.003, opacity: 0.85, transform: 'scale(1)' },
        { offset: h.t + 0.06, opacity: 0, transform: 'scale(1.6)' });
    }
    move.push({ offset: 1, translate: '0px 0px' });
    squash.push({ offset: 1, scale: '1 1' });
    ring.push({ offset: 1, opacity: 0, transform: 'scale(1)' });
    const opt = { duration: BUBBLE_CYCLE, iterations: Infinity };
    B.el.animate(move, opt);
    B.el.animate(squash, { ...opt, easing: 'ease-out' });
    try { B.el.animate(ring, { ...opt, pseudoElement: '::before' }); } catch { /* trình duyệt cũ: bỏ vòng sáng */ }
  }
}
window.addEventListener('resize', () => {
  clearTimeout(startBubbleHits._t);
  startBubbleHits._t = setTimeout(() => { if ($('.login-v2 .la-bubbles')) startBubbleHits(); }, 250);
});
// Chữ màn hình đăng nhập theo ngôn ngữ (chỉ màn hình này có tiếng Anh; trong app vẫn tiếng Việt)
const LOGIN_TEXT = {
  vi: {
    recv: 'Tiếp nhận', dispatch: 'Điều phối', repair: 'Sửa chữa', warranty: 'Bảo hành', parts: 'Kho phụ tùng',
    reports: 'Báo cáo', care: 'CSKH', appt: 'Lịch hẹn',
    h1: 'Hệ thống quản trị và<br>Điều phối xưởng dịch vụ',
    greet: 'Đăng nhập để truy cập', title: 'Hệ thống quản lý xưởng dịch vụ',
    user: 'Tên đăng nhập', pass: 'Mật khẩu', show: 'Hiện mật khẩu', hide: 'Ẩn mật khẩu',
    forgot: 'Quên mật khẩu?', forgotMsg: 'Vui lòng liên hệ quản trị viên hệ thống để được cấp lại mật khẩu.',
    submit: 'Đăng nhập', or: 'hoặc cài ứng dụng lên điện thoại', app: 'Tải ứng dụng', appTitle: 'Tải ứng dụng cho Android / iPhone',
    foot: 'Hệ thống nội bộ', tab: 'Đăng nhập', company: 'An Thịnh Tech',
  },
  en: {
    recv: 'Reception', dispatch: 'Dispatch', repair: 'Repair', warranty: 'Warranty', parts: 'Parts',
    reports: 'Reports', care: 'Customer care', appt: 'Appointments',
    h1: 'Service Workshop<br>Management &amp; Dispatch',
    greet: 'Please log in to access', title: 'Service Workshop Management System',
    user: 'Username', pass: 'Password', show: 'Show password', hide: 'Hide password',
    forgot: 'Forgot your password?', forgotMsg: 'Please contact your system administrator to reset your password.',
    submit: 'Log in', or: 'or install the app on your phone', app: 'Get the app', appTitle: 'Install the app on Android / iPhone',
    foot: 'Internal system', tab: 'Login', company: 'An Thinh Tech',
  },
};
const loginLang = () => { try { return localStorage.getItem('loginLang') === 'en' ? 'en' : 'vi'; } catch { return 'vi'; } };
// Cờ vẽ SVG (Windows không hiện emoji cờ); uid để clipPath không trùng id khi cờ xuất hiện 2 lần
const LOGIN_FLAGS = {
  vi: () => '<svg class="la-flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#DA251D"/><polygon fill="#FFFF00" points="15,4 16.76,9.42 22.47,9.42 17.86,12.77 19.62,18.19 15,14.84 10.38,18.19 12.14,12.77 7.53,9.42 13.24,9.42"/></svg>',
  en: (uid) => `<svg class="la-flag" viewBox="0 0 60 30" aria-hidden="true"><clipPath id="ukc${uid}"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath><path d="M0,0v30h60v-30z" fill="#012169"/><path d="M0,0 60,30M60,0 0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 60,30M60,0 0,30" clip-path="url(#ukc${uid})" stroke="#C8102E" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>`,
};
const LOGIN_LANG_NAMES = { vi: 'Tiếng Việt', en: 'English' };
const langPillHtml = () => `${LOGIN_FLAGS[loginLang()]('t')}<span>${loginLang() === 'en' ? 'EN' : 'VI'}</span>`;

function renderLogin() {
  S.me = null;
  closeModal();
  if (typeof pushGateClose === 'function') pushGateClose();
  // Lần mở app sau: thanh giờ/pin iPhone kiểu black + navy (early.js đọc dấu này)
  try { localStorage.removeItem('att_logged_in'); } catch { /* ignore */ }
  document.documentElement.classList.remove('att-logged');
  const lang = loginLang();
  const T = LOGIN_TEXT[lang];
  document.documentElement.lang = lang;
  document.title = `${S.meta?.app_name || 'ATT ServiceOS'} - ${T.tab}`;
  const iosApp = document.documentElement.classList.contains('pwa-ios');
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', iosApp ? '#123a6b' : '#0a1430'));
  const sb = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (sb) sb.setAttribute('content', 'black');
  const bubbles = LOGIN_BUBBLES.map(([k, x, y, s], i) => (k
    ? `<span class="la-bubble" data-k="${k}" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px"><b>${esc(T[k])}</b></span>`
    : `<span class="la-bubble la-bubble-sm" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;animation-delay:${(-i * 1.7).toFixed(1)}s;animation-duration:${8 + (i % 3)}s"></span>`)).join('');
  const langOpt = (code) => `<button type="button" role="option" data-click="login-lang" data-lang="${code}" class="${lang === code ? 'on' : ''}" aria-selected="${lang === code}">${LOGIN_FLAGS[code](`m${code}`)}<span>${LOGIN_LANG_NAMES[code]}</span>${lang === code ? icon('check') : ''}</button>`;
  const appBtn = (cls) => `<a class="${cls}" href="/tai-app.html" data-click="install-app" title="${esc(T.appTitle)}">${icon('download')} ${esc(T.app)}</a>`;
  $('#app').innerHTML = `<div class="login login-v2">
    ${isStandalonePwa() ? '' : appBtn('la-app-top')}
    <div class="la-lang">
      <button type="button" class="la-lang-btn" data-click="login-lang-menu" aria-haspopup="listbox" aria-expanded="false" aria-label="Ngôn ngữ / Language">
        ${LOGIN_FLAGS[lang]('b')}<span>${LOGIN_LANG_NAMES[lang]}</span>${icon('chevronDown')}</button>
      <div class="la-lang-menu" role="listbox" hidden>${langOpt('vi')}${langOpt('en')}</div>
    </div>
    <div class="la-bubbles" aria-hidden="true">${bubbles}</div>
    <div class="login-art">
      <div class="la-hero">
        <div class="la-brand"><span class="la-pill"><i></i><span class="la-pill-t">Service Workshop Management Portal</span></span></div>
        <h1>${T.h1}</h1>
        <div class="la-dots">${['recv', 'repair', 'warranty', 'parts', 'care'].map((k) => `<span>${esc(T[k])}</span>`).join('')}</div>
        <div class="la-bars" aria-hidden="true"><i></i><i></i><i></i></div>
      </div>
    </div>
    <div class="la-ribbon" aria-hidden="true"></div>
    <div class="la-scooter" aria-hidden="true">${LOGIN_RIDER}</div>
    <div class="login-form-wrap">
      <div class="lf-ribbon" aria-hidden="true"></div>
      <form class="login-form" data-submit="login">
        <div class="lf-brand"><div class="brand-logo">${LOGO}</div><span class="lf-word">ATT ServiceOS</span></div>
        <div class="lf-head">
          <div class="lf-greet">${esc(T.greet)}</div>
          <h2 class="lf-title${lang === 'en' ? ' lf-title-en' : ''}">${esc(T.title)}</h2>
        </div>
        <div id="login-error" role="alert" aria-live="assertive"></div>
        <div class="lf-input"><span class="lf-ic">${icon('user')}</span>${input('username', '', `id="lg-user" required autocomplete="username" autocapitalize="off" placeholder="${esc(T.user)}" aria-label="${esc(T.user)}"`)}</div>
        <div class="lf-input"><span class="lf-ic">${icon('lock')}</span>${input('password', '', `id="lg-pass" type="password" required autocomplete="current-password" placeholder="${esc(T.pass)}" aria-label="${esc(T.pass)}"`)}
          <button type="button" class="lf-eye" data-click="login-pw" aria-label="${esc(T.show)}" aria-pressed="false">${icon('eye')}</button></div>
        <div class="lf-hint"><button type="button" class="lf-forgot" data-click="login-forgot">${esc(T.forgot)}</button></div>
        <button class="btn lf-submit" type="submit">${esc(T.submit)}</button>
        ${isStandalonePwa() ? '' : `<div class="lf-or"><span>${esc(T.or)}</span></div>${appBtn('btn lf-app')}`}
        <div class="lf-power">Powered by <b>${esc(T.company)}</b></div>
      </form>
    </div>
    <div class="la-foot">© ${esc(T.company)} ${new Date().getFullYear()} · ${esc(T.foot)}</div>
  </div>`;
  const u = $('input[name="username"]');
  if (u) u.focus();
  if (window.heroDots) window.heroDots($('.login-v2'));
  requestAnimationFrame(startBubbleHits);
}

onGlobal('click', 'login-lang-menu', (el) => {
  const menu = el.parentElement.querySelector('.la-lang-menu');
  const open = menu.hidden;
  menu.hidden = !open;
  el.setAttribute('aria-expanded', String(open));
  if (!open) return;
  // Bấm ra ngoài / Esc thì đóng
  const close = (e) => {
    if (e.type === 'keydown' && e.key !== 'Escape') return;
    if (e.type === 'click' && el.parentElement.contains(e.target)) return;
    menu.hidden = true;
    el.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', close, true);
    document.removeEventListener('keydown', close, true);
  };
  setTimeout(() => { document.addEventListener('click', close, true); document.addEventListener('keydown', close, true); });
});
onGlobal('click', 'login-lang', (el) => {
  const keepUser = ($('#lg-user') || {}).value || '';
  const want = el.dataset.lang === 'en' ? 'en' : 'vi';
  // Dùng chung lựa chọn cho cả app (i18n.js): EN bật dịch ngay, quay về VI thì tải lại trang
  if (window.I18N) window.I18N.setLang(want);
  else try { localStorage.setItem('loginLang', want); } catch { /* ignore */ }
  renderLogin();
  const u = $('#lg-user');
  if (u && keepUser) { u.value = keepUser; $('#lg-pass')?.focus(); }
});
onGlobal('click', 'login-forgot', () => toast(LOGIN_TEXT[loginLang()].forgotMsg, 'info'));
onGlobal('click', 'login-pw', (el) => {
  const pw = $('#lg-pass');
  if (!pw) return;
  const T = LOGIN_TEXT[loginLang()];
  const show = pw.type === 'password';
  pw.type = show ? 'text' : 'password';
  el.setAttribute('aria-pressed', String(show));
  el.setAttribute('aria-label', show ? T.hide : T.show);
  el.innerHTML = icon(show ? 'eyeOff' : 'eye');
  pw.focus();
});
onGlobal('submit', 'login', async (form, data) => {
  const box = $('#login-error');
  box.innerHTML = '';
  try {
    const session = await api('POST', '/api/auth/login', { username: data.username.trim(), password: data.password });
    await start(session);
  } catch (e) {
    box.innerHTML = `<div class="alert alert-danger">${icon('alert')}<div>${esc(e.message)}</div></div>`;
    form.password.value = '';
    form.password.focus();
  }
});

function renderForcePassword() {
  $('#app').innerHTML = `<div class="login"><div class="login-art"><div class="row" style="gap:12px"><div class="brand-logo">${LOGO}</div><div class="strong">ATT ServiceOS</div></div>
    <div><h1>Bảo mật tài khoản</h1><p>Vì an toàn, bạn cần đặt mật khẩu mới trước khi sử dụng hệ thống.</p></div><div></div></div>
    <div class="login-form-wrap"><div class="login-form">
      <div><h2>Đổi mật khẩu</h2><div class="muted" style="margin-top:4px">Xin chào <b>${esc(S.me.full_name)}</b> (${esc(S.me.username)})</div></div>
      ${passwordFormHtml('pw-force').replace('<SUBMIT>', '<button class="btn btn-primary" type="submit">Lưu mật khẩu mới</button><button class="btn btn-ghost" type="button" data-click="logout">Đăng xuất</button>')}
    </div></div></div>`;
}
onGlobal('submit', 'pw-force', async (form, data) => {
  await submitPasswordChange(data);
  toast('Đã đổi mật khẩu thành công', 'success');
  await start();
});

// ---------------------------------------------------------------------------
// Khung ứng dụng
// ---------------------------------------------------------------------------
function renderShell() {
  const me = S.me;
  // Lần mở app sau: thanh giờ/pin iPhone kiểu default + trắng (early.js đọc dấu này)
  try { localStorage.setItem('att_logged_in', '1'); } catch { /* ignore */ }
  document.documentElement.classList.add('att-logged');
  const sb = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (sb) sb.setAttribute('content', 'default');
  if (window.ATTMenuColor) window.ATTMenuColor.apply();
  const nav = NAV.map((g) => {
    const items = g.items.filter((it) => (it.show ? it.show() : [].concat(it.perm).some((p) => can(p))));
    if (!items.length) return '';
    return `<div class="nav-group"><div class="nav-group-title">${esc(g.group)}</div>${items.map((it) => {
      const label = typeof it.label === 'function' ? it.label() : it.label;
      if (it.ext) return `<a href="${it.ext}"${it.click ? ` data-click="${it.click}"` : ''} title="${esc(label)}">${icon(it.icon)}<span>${esc(label)}</span></a>`;
      return `<a href="#${it.href}" data-nav="${it.href}" title="${esc(label)}">${icon(it.icon)}<span>${esc(label)}</span>${it.badge ? `<b class="nav-badge hidden" id="${it.badge}" aria-label="tin chưa đọc"></b>` : ''}</a>`;
    }).join('')}</div>`;
  }).join('');
  const dark = (() => { try { return localStorage.getItem('theme') === 'dark'; } catch { return false; } })();
  if (dark) document.body.classList.add('theme-dark');
  else document.body.classList.remove('theme-dark');
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const sideCollapsed = !isMobile && sidebarPrefCollapsed();
  document.body.classList.toggle('sidebar-collapsed', sideCollapsed);
  document.body.classList.remove('sidebar-peek', 'nav-open');
  const selectedBr = S.meta.branches.find((b) => String(b.id) === String(S.branch));
  const canPickBranch = can('branch.all') || !!me.region;
  // Tro ly / Quan ly vung: loc theo region (meta phai co cot region) hoac region_branch_ids
  const pickBranches = (S.meta.branches || []).filter((b) => {
    if (!b.active) return false;
    if (can('branch.all')) return true;
    if (!me.region) return false;
    if (b.region) return b.region === me.region;
    const ids = Array.isArray(me.region_branch_ids) ? me.region_branch_ids : [];
    return ids.map(Number).includes(Number(b.id));
  });
  const allLabel = me.region ? `Tất cả · ${me.region_label || 'vùng'}` : 'Tất cả cơ sở';
  const branchTitle = selectedBr ? `${selectedBr.code} – ${selectedBr.name}` : (me.region ? allLabel : 'Lọc theo cơ sở');
  const branchCtl = canPickBranch
    ? `<label class="branch-pick" title="${esc(branchTitle)}"${branchUseNative() ? '' : ' tabindex="0" role="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Cơ sở"'}>${icon('building')}<span class="branch-pick-text">${esc(selectedBr ? branchPickLabel(selectedBr, branchCompact()) : allLabel)}</span>${icon('chevronDown', 'branch-pick-caret')}<select class="select branch-select" data-change="branch" aria-label="Cơ sở"${branchUseNative() ? '' : ' tabindex="-1" aria-hidden="true"'}><option value="">${esc(allLabel)}</option>${pickBranches.map((b) => `<option value="${b.id}" ${String(b.id) === String(S.branch) ? 'selected' : ''}>${esc(b.code)} – ${esc(b.name)}</option>`).join('')}</select></label>`
    : (me.branch_name ? `<span class="branch-pick branch-label" title="${esc(me.branch_code ? `${me.branch_code} – ${me.branch_name}` : me.branch_name)}">${icon('building')}<span class="branch-pick-text">${esc(me.branch_code || me.branch_name)}</span></span>` : '');
  const appName = S.meta.app_name || 'ATT ServiceOS';
  // Dọn menu tài khoản + header đã portal (tránh trùng khi re-render)
  document.querySelectorAll('body > #user-dd, body > .app-header').forEach((el) => el.remove());
  closeBranchPop();
  document.body.classList.remove('pwa-header-ported');
  // Header ngoài .shell (overflow:hidden) — tránh WebKit PWA raster nhòe cả header
  // Khung trang theo ATT DealerOS: thanh bên navy chạy suốt trái, thanh tiêu đề nằm trong vùng nội dung
  $('#app').innerHTML = `
    <div class="app ds-app">
      <aside class="sidebar" id="sidebar" aria-label="Menu chính">
        <div class="sidebar-head">
          <div class="brand-mark brand-with-logo">
            <div class="brand-logo">${LOGO}</div>
            <span class="brand-text">
              <span class="brand-name">${esc(appName.replace(/\s+APP$/i, ''))}</span>
              <span class="brand-sub">Quản lý xưởng dịch vụ</span>
            </span>
          </div>
          <button type="button" class="icon-btn sidebar-collapse-btn" data-click="toggle-menu"
            title="Thu gọn menu" aria-label="Thu gọn menu" aria-expanded="true">${icon('chevronLeft')}</button>
        </div>
        <nav class="nav" id="nav">${nav}</nav>
      </aside>
      <div class="app-stage">
        <div class="shell">
          <main>
            <header class="app-header topbar">
              <button type="button" class="icon-btn menu-btn" data-click="toggle-menu" title="Mở menu" aria-label="Mở menu">${icon('menu')}</button>
              <div class="title-wrap">
                <h1 id="page-title" class="app-page-title"></h1>
              </div>
              <div class="spacer"></div>
              <div class="topbar-tools top-actions">
                ${branchCtl}
                <button type="button" class="tool-icon" data-click="app-refresh" title="Làm mới (F5)" aria-label="Làm mới">${icon('refresh')}</button>
                <button type="button" class="tool-icon" data-click="toggle-theme" title="${dark ? 'Giao diện sáng' : 'Giao diện tối'}" aria-label="Đổi giao diện">${icon(dark ? 'sun' : 'moon')}</button>
                <button type="button" class="tool-icon notif-btn" id="work-btn" data-click="work-menu" title="Cần xử lý" aria-label="Cần xử lý" aria-haspopup="menu">${icon('alert')}<span class="notif-n work-n hidden" id="work-n" aria-hidden="true"></span></button>
                <button type="button" class="tool-icon notif-btn" id="notif-btn" data-click="notif-menu" title="Thông báo" aria-label="Thông báo" aria-haspopup="menu">${icon('bell')}<span class="notif-n hidden" id="notif-n" aria-hidden="true"></span></button>
                <span class="topbar-sep" aria-hidden="true"></span>
                <button type="button" class="lang-pill" data-click="lang-info" title="Ngôn ngữ / Language" aria-label="Ngôn ngữ / Language" translate="no">${langPillHtml()}</button>
                <div class="user-wrap">
                  <button type="button" class="user-chip" data-click="user-menu" aria-haspopup="menu" aria-expanded="false" aria-controls="user-dd" aria-label="${esc(me.full_name)}" title="${esc(me.full_name)}">
                    ${userAvatarHtml(me)}<span class="user-dot hidden" id="user-dot" aria-hidden="true"></span>
                  </button>
                  <div class="dropdown user-dropdown hidden" id="user-dd" role="menu" aria-hidden="true">
                    <div class="dd-user"><button type="button" class="dd-av" data-click="change-avatar" title="Đổi ảnh đại diện" aria-label="Đổi ảnh đại diện">${userAvatarHtml(me)}<span class="dd-av-cam" aria-hidden="true">${icon('camera')}</span></button>
                      <div><div class="strong">${esc(me.full_name)}</div><div class="small muted mono">${esc(me.username)}</div>
                      <div class="small muted">${esc(me.title || roleLabel(me.role))}${me.branch_code ? ` · ${esc(me.branch_code)}` : ''}</div></div>
                    </div><hr>
                    <button type="button" role="menuitem" class="dd-mobile-extra" data-click="app-refresh">${icon('refresh')} Làm mới</button>
                    <button type="button" role="menuitem" class="dd-mobile-extra" data-click="toggle-theme">${icon(dark ? 'sun' : 'moon')} ${dark ? 'Giao diện sáng' : 'Giao diện tối'}</button>
                    <button type="button" role="menuitem" class="dd-mobile-extra" data-click="notif-menu">${icon('bell')} Thông báo<span class="dd-count hidden" id="notif-n-m"></span></button>
                    <button type="button" role="menuitem" class="dd-mobile-extra" data-click="work-menu">${icon('alert')} Cần xử lý</button>
                    <hr class="dd-mobile-extra">
                    <button type="button" role="menuitem" class="dd-lang dd-mobile-extra" data-click="lang-info">${LOGIN_FLAGS[loginLang()]('d')} ${loginLang() === 'en' ? 'Language: English' : 'Ngôn ngữ: Tiếng Việt'}</button>
                    <button type="button" role="menuitem" id="push-menu-btn" data-click="push-toggle" data-on="0">${icon('bell')} Bật thông báo đẩy</button>
                    <button type="button" role="menuitem" data-click="change-pw">${icon('key')} Đổi mật khẩu</button>
                    <button type="button" role="menuitem" data-click="logout">${icon('logout')} Đăng xuất</button>
                  </div>
                </div>
              </div>
            </header>
            <section class="content" id="main"></section>
          </main>
        </div>
      </div>
    </div>
    <div class="drawer-backdrop hidden" id="drawerBackdrop" data-click="drawer-close"></div>
    <aside class="drawer hidden" id="drawer" aria-label="Chi tiết">
      <div class="drawer-head">
        <div class="drawer-head-main">
          <div class="eyebrow hidden" id="drawerEyebrow"></div>
          <div class="drawer-title-row"><h2 id="drawerTitle"></h2><span class="drawer-status hidden" id="drawerStatus"></span></div>
          <div class="drawer-actions hidden" id="drawerActions"></div>
          <div class="drawer-sub hidden" id="drawerSub"></div>
        </div>
        <button type="button" class="icon-btn drawer-x" id="drawerClose" data-click="drawer-close" aria-label="Đóng">×</button>
      </div>
      <div class="drawer-body" id="drawerBody"></div>
    </aside>`;
  mountHeaderForIosPwa();
  syncSidebarChrome();
  closeUserMenu();
  startNotifPoll();
}

/** Nhãn nút chọn cơ sở: "N54502 – VinFast CarOn Tân Tạo" (đủ tên); điện thoại chỉ mã. */
const branchCompact = () => window.matchMedia('(max-width: 640px)').matches;
function branchPickLabel(b, compact) {
  if (!b) return compact ? 'Tất cả' : 'Tất cả cơ sở';
  if (compact || !b.name) return b.code;
  return `${b.code} – ${b.name}`;
}

// ----- Chọn cơ sở trên máy tính: hộp chọn tự vẽ (select gốc của Windows lệch và tràn mép cửa sổ) -----
// Điện thoại / màn cảm ứng vẫn dùng hộp chọn của hệ điều hành.
const BRANCH_NATIVE_MQ = '(max-width: 640px), (pointer: coarse)';
const branchUseNative = () => window.matchMedia(BRANCH_NATIVE_MQ).matches;

function closeBranchPop(focusPill) {
  const pop = document.getElementById('branch-pop');
  if (!pop) return;
  pop.remove();
  const pill = document.querySelector('label.branch-pick');
  if (pill) {
    pill.setAttribute('aria-expanded', 'false');
    if (focusPill) pill.focus();
  }
}

function positionBranchPop(pop, pill) {
  const r = pill.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const m = 8;
  const w = Math.min(Math.max(pop.offsetWidth, r.width), vw - 2 * m);
  pop.style.width = `${w}px`;
  const left = Math.min(Math.max(r.right - w, m), vw - w - m);
  const below = vh - r.bottom - m - 6;
  const above = r.top - m - 6;
  const h = pop.scrollHeight;
  const up = h > below && above > below;
  pop.style.maxHeight = `${Math.max(120, up ? above : below)}px`;
  pop.style.left = `${left}px`;
  pop.style.top = up ? `${Math.max(m, r.top - 6 - Math.min(h, above))}px` : `${r.bottom + 6}px`;
}

function openBranchPop(pill) {
  const sel = pill.querySelector('select.branch-select');
  if (!sel) return;
  closeBranchPop();
  const pop = document.createElement('div');
  pop.id = 'branch-pop';
  pop.className = 'branch-pop';
  pop.setAttribute('role', 'listbox');
  pop.setAttribute('aria-label', 'Chọn cơ sở');
  pop.innerHTML = Array.from(sel.options).map((o) => {
    const b = S.meta.branches.find((x) => String(x.id) === o.value);
    const on = o.value === sel.value;
    const body = b
      ? `<b>${esc(b.code)}</b> – ${esc(b.name)}`
      : '<b>Tất cả cơ sở</b>';
    return `<div class="branch-pop-opt${on ? ' on' : ''}" role="option" tabindex="-1" aria-selected="${on}" data-value="${esc(o.value)}" title="${esc(b ? `${b.code} – ${b.name}` : 'Tất cả cơ sở')}"><span class="branch-pop-txt">${body}</span>${icon('check')}</div>`;
  }).join('');
  document.body.appendChild(pop);
  positionBranchPop(pop, pill);
  pill.setAttribute('aria-expanded', 'true');
  (pop.querySelector('.on') || pop.firstElementChild).focus();
}

function pickBranchOption(opt) {
  const pill = document.querySelector('label.branch-pick');
  const sel = pill && pill.querySelector('select.branch-select');
  closeBranchPop(true);
  if (!sel || sel.value === opt.dataset.value) return;
  sel.value = opt.dataset.value;
  sel.dispatchEvent(new Event('change', { bubbles: true }));
}

document.addEventListener('click', (e) => {
  const opt = e.target.closest('#branch-pop .branch-pop-opt');
  if (opt) { pickBranchOption(opt); return; }
  const pill = e.target.closest('label.branch-pick');
  if (pill && !branchUseNative()) {
    e.preventDefault();
    if (document.getElementById('branch-pop')) closeBranchPop(true);
    else openBranchPop(pill);
    return;
  }
  if (!e.target.closest('#branch-pop')) closeBranchPop();
}, true);

document.addEventListener('keydown', (e) => {
  const pop = document.getElementById('branch-pop');
  const pill = e.target.closest && e.target.closest('label.branch-pick');
  if (!pop) {
    if (pill && !branchUseNative() && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      openBranchPop(pill);
    }
    return;
  }
  const opts = Array.from(pop.querySelectorAll('.branch-pop-opt'));
  const i = opts.indexOf(document.activeElement);
  const go = (n) => { e.preventDefault(); opts[(n + opts.length) % opts.length].focus(); };
  if (e.key === 'ArrowDown') go(i + 1);
  else if (e.key === 'ArrowUp') go(i < 0 ? opts.length - 1 : i - 1);
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(opts.length - 1);
  else if ((e.key === 'Enter' || e.key === ' ') && i >= 0) { e.preventDefault(); pickBranchOption(opts[i]); }
  else if (e.key === 'Escape') { e.preventDefault(); closeBranchPop(true); }
  else if (e.key === 'Tab') closeBranchPop();
}, true);

window.addEventListener('resize', () => closeBranchPop());
document.addEventListener('scroll', (e) => {
  if (!(e.target.closest && e.target.closest('#branch-pop'))) closeBranchPop();
}, true);

/** iOS PWA: đưa header ra trực tiếp dưới body — thoát mọi overflow/compositor của #app/.shell */
function mountHeaderForIosPwa() {
  document.body.classList.remove('pwa-header-ported');
  const header = document.querySelector('#app > .app-header');
  if (!header) return;
  if (!(isIosDevice() && isStandalonePwa())) return;
  document.body.insertBefore(header, document.getElementById('app'));
  document.body.classList.add('pwa-header-ported');
}

/** sticky-foot: để trong form (cuối trang), không dock/cố định đáy màn hình. */
function clearStickyFootPortal() {
  document.querySelectorAll('body > .sticky-foot-portal').forEach((el) => el.remove());
  const host = document.getElementById('page-actions');
  if (host) {
    const stray = host.querySelector('.sticky-foot');
    const form = document.getElementById('wo-form') || document.querySelector('#main form');
    if (stray && form) {
      stray.classList.remove('sticky-foot-portal');
      form.appendChild(stray);
    }
    host.innerHTML = '';
    host.hidden = true;
  }
  document.body.classList.remove('has-sticky-foot-portal');
}

function mountStickyFootPortal() {
  // Không portal / không fixed — nút nằm cuối form, kéo xuống mới thấy.
  clearStickyFootPortal();
}

function isUserMenuOpen() {
  const dd = $('#user-dd');
  return !!(dd && !dd.classList.contains('hidden'));
}

function positionUserMenu() {
  const dd = $('#user-dd');
  const chip = $('.user-chip[data-click="user-menu"]');
  if (!dd || !chip || dd.classList.contains('hidden')) return;
  const r = chip.getBoundingClientRect();
  const pad = 8;
  dd.style.position = 'fixed';
  dd.style.top = `${Math.round(r.bottom + 6)}px`;
  dd.style.right = `${Math.round(Math.max(pad, window.innerWidth - r.right))}px`;
  dd.style.left = 'auto';
  dd.style.bottom = 'auto';
  dd.style.zIndex = '300';
  requestAnimationFrame(() => {
    if (!dd.isConnected || dd.classList.contains('hidden')) return;
    const dr = dd.getBoundingClientRect();
    if (dr.bottom > window.innerHeight - pad) {
      dd.style.top = `${Math.max(pad, Math.round(r.top - dr.height - 6))}px`;
    }
    if (dr.left < pad) {
      dd.style.right = `${Math.max(pad, window.innerWidth - pad - dr.width)}px`;
    }
  });
}

function closeUserMenu() {
  const dd = $('#user-dd');
  const chip = $('.user-chip[data-click="user-menu"]');
  if (dd) {
    dd.classList.add('hidden');
    dd.setAttribute('aria-hidden', 'true');
    dd.style.top = '';
    dd.style.right = '';
    dd.style.left = '';
    dd.style.bottom = '';
    const wrap = $('.user-wrap');
    if (wrap && dd.parentElement !== wrap) wrap.appendChild(dd);
  }
  if (chip) chip.setAttribute('aria-expanded', 'false');
}

function openUserMenu() {
  const dd = $('#user-dd');
  const chip = $('.user-chip[data-click="user-menu"]');
  if (!dd || !chip) return;
  // Portal ra body để không bị app-header overflow:hidden cắt
  if (dd.parentElement !== document.body) document.body.appendChild(dd);
  dd.classList.remove('hidden');
  dd.setAttribute('aria-hidden', 'false');
  chip.setAttribute('aria-expanded', 'true');
  positionUserMenu();
  if (typeof refreshPushMenu === 'function') refreshPushMenu();
}

function toggleUserMenu() {
  if (isUserMenuOpen()) closeUserMenu();
  else openUserMenu();
}

/** Chưa tự chọn thì màn 901–1279px (iPad ngang, laptop nhỏ) thu gọn menu để bảng đủ chỗ. */
function sidebarPrefCollapsed() {
  let v = null;
  try { v = localStorage.getItem('sidebar'); } catch { /* ignore */ }
  return v ? v === 'collapsed' : window.innerWidth < 1280;
}

function syncSidebarChrome() {
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const collapsed = document.body.classList.contains('sidebar-collapsed');
  const brandToggle = $('.sidebar-toggle');
  if (brandToggle) {
    brandToggle.title = 'Thu gọn menu';
    brandToggle.setAttribute('aria-label', 'Thu gọn menu');
    brandToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  }
  const collapseBtn = $('.sidebar-collapse-btn');
  if (collapseBtn) {
    const label = collapsed && !isMobile ? 'Mở rộng menu' : 'Thu gọn menu';
    collapseBtn.title = label;
    collapseBtn.setAttribute('aria-label', label);
    collapseBtn.setAttribute('aria-expanded', collapsed && !isMobile ? 'false' : 'true');
  }
  const railToggle = $('.sidebar-rail-toggle');
  if (railToggle) {
    railToggle.title = 'Mở rộng menu';
    railToggle.setAttribute('aria-label', 'Mở rộng menu');
    railToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  }
  const menuBtn = $('.menu-btn');
  if (menuBtn) {
    menuBtn.title = isMobile ? (document.body.classList.contains('nav-open') ? 'Đóng menu' : 'Mở menu') : 'Mở rộng menu';
    menuBtn.setAttribute('aria-label', menuBtn.title);
  }
}

function setSidebarCollapsed(next) {
  document.body.classList.toggle('sidebar-collapsed', next);
  document.body.classList.remove('sidebar-peek');
  try { localStorage.setItem('sidebar', next ? 'collapsed' : 'open'); } catch { /* ignore */ }
  syncSidebarChrome();
}

onGlobal('click', 'toggle-menu', () => {
  if (window.matchMedia('(max-width: 900px)').matches) {
    document.body.classList.toggle('nav-open');
    syncSidebarChrome();
    return;
  }
  setSidebarCollapsed(!document.body.classList.contains('sidebar-collapsed'));
});

onGlobal('click', 'toggle-nav', () => {
  document.body.classList.toggle('nav-open');
  syncSidebarChrome();
});

document.addEventListener('click', (e) => {
  if (!document.body.classList.contains('nav-open')) return;
  if (e.target.closest('.sidebar') || e.target.closest('[data-click="toggle-menu"]') || e.target.closest('[data-click="toggle-nav"]')) return;
  if (e.target === document.body || e.target.classList.contains('content') || e.target.closest('.content') || e.target.closest('.app-header')) {
    if (!e.target.closest('.sidebar') && !e.target.closest('.menu-btn')) {
      document.body.classList.remove('nav-open');
      syncSidebarChrome();
    }
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
    document.body.classList.remove('nav-open');
    syncSidebarChrome();
  }
});

onGlobal('click', 'toggle-sidebar', () => {
  if (window.matchMedia('(max-width: 900px)').matches) return;
  setSidebarCollapsed(!document.body.classList.contains('sidebar-collapsed'));
});

let sidebarResizeTimer = null;
let lastShellIsMobile = window.matchMedia('(max-width: 900px)').matches;
window.addEventListener('resize', () => {
  clearTimeout(sidebarResizeTimer);
  sidebarResizeTimer = setTimeout(() => {
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    if (isMobile) {
      document.body.classList.remove('sidebar-collapsed');
    } else {
      document.body.classList.remove('nav-open');
      document.body.classList.toggle('sidebar-collapsed', sidebarPrefCollapsed());
    }
    syncSidebarChrome();
    mountStickyFootPortal();
    // Cross breakpoint: làm mới nhãn branch + menu mobile extras mà không mất trang
    if (S.me && lastShellIsMobile !== isMobile) {
      const mainEl = $('#main');
      const titleEl = $('#page-title');
      // Chuyển nguyên nút DOM (không chép innerHTML) để giữ listener, giá trị đang nhập và trạng thái trang
      const keepMain = document.createDocumentFragment();
      if (mainEl) while (mainEl.firstChild) keepMain.appendChild(mainEl.firstChild);
      const keepTitle = titleEl ? titleEl.textContent : '';
      const keepActive = ($$('.nav a.active').map((a) => a.dataset.nav))[0];
      renderShell();
      if (keepMain.childNodes.length) {
        const m = $('#main');
        if (m) m.replaceChildren(keepMain);
      }
      if (keepTitle && $('#page-title')) $('#page-title').textContent = keepTitle;
      if (keepActive) {
        $$('.nav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === keepActive));
      }
      syncSidebarChrome();
      // Khung mới không có bảng trượt → vẽ lại chi tiết đang mở
      if (drawerSeq) { drawerSeq = 0; router({ force: true }); }
    }
    lastShellIsMobile = isMobile;
  }, 120);
});

onGlobal('click', 'user-menu', (el, e) => {
  if (e) e.stopPropagation();
  toggleUserMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isUserMenuOpen()) closeUserMenu();
});

window.addEventListener('resize', () => {
  if (isUserMenuOpen()) positionUserMenu();
});

window.addEventListener('scroll', () => {
  if (isUserMenuOpen()) positionUserMenu();
}, true);

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});
window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; toast('Đã cài ATT ServiceOS', 'success'); });

function isIosDevice() {
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalonePwa() {
  try {
    // App đã cài trên máy tính (Chrome/Edge) có thể mở ở chế độ window-controls-overlay / minimal-ui
    return !!(navigator.standalone
      || window.matchMedia('(display-mode: standalone)').matches
      || window.matchMedia('(display-mode: fullscreen)').matches
      || window.matchMedia('(display-mode: window-controls-overlay)').matches
      || window.matchMedia('(display-mode: minimal-ui)').matches);
  } catch {
    return !!navigator.standalone;
  }
}

/** iOS 26/27: đồng bộ --app-height bằng px nguyên (tránh 100vh phân số → blur). */
let lastAppHeight = '';
function setAppHeight(v) {
  if (v === lastAppHeight) return;
  lastAppHeight = v;
  document.documentElement.style.setProperty('--app-height', v);
}
function syncIosAppHeight() {
  const root = document.documentElement;
  const ios = isIosDevice();
  const pwa = isStandalonePwa();
  root.classList.toggle('pwa-standalone', pwa);
  root.classList.toggle('is-ios', ios);
  root.classList.toggle('pwa-ios', pwa && ios);

  const vv = window.visualViewport;
  if (pwa && ios) {
    const keyboardOpen = !!(vv && (window.innerHeight - vv.height > 80));
    const h = keyboardOpen
      ? Math.round(vv.height)
      : Math.round(window.innerHeight || (vv && vv.height) || 0);
    setAppHeight(h > 0 ? `${h}px` : '100vh');
    return;
  }
  if (ios && vv) {
    setAppHeight(`${Math.round(vv.height)}px`);
    return;
  }
  setAppHeight('100dvh');
}

(function installIosViewportFix() {
  try {
    syncIosAppHeight();
    let t = null;
    const schedule = () => {
      clearTimeout(t);
      t = setTimeout(() => { try { syncIosAppHeight(); } catch { /* ignore */ } }, 50);
    };
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    window.addEventListener('pageshow', schedule);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') schedule();
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', schedule);
      if (isIosDevice()) {
        let raf = 0;
        window.visualViewport.addEventListener('scroll', () => {
          // iOS keyboard: chống kéo visual viewport lệch – chỉ khi đang nhập liệu, gộp theo khung hình
          if (raf || !isTextEntry(document.activeElement)) return;
          raf = requestAnimationFrame(() => { raf = 0; if (window.scrollY) window.scrollTo(0, 0); });
        }, { passive: true });
      }
    }
    document.addEventListener('focusin', (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (!isIosDevice() || !/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      setTimeout(() => {
        try { syncIosAppHeight(); } catch { /* ignore */ }
        if (window.scrollY) window.scrollTo(0, 0);
      }, 80);
    });
    document.addEventListener('focusout', () => setTimeout(() => {
      try { syncIosAppHeight(); } catch { /* ignore */ }
    }, 120));
  } catch { /* không được chặn start()/boot */ }
})();

const isPhoneOrTablet = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Máy tính không có hộp cài tự động (đã cài rồi / Firefox / Safari) → hướng dẫn ngắn thay vì trang cho điện thoại
function desktopInstallHelp() {
  const ua = navigator.userAgent;
  const edge = /Edg\//.test(ua);
  const chromium = edge || (/Chrome\//.test(ua) && !/OPR\//.test(ua));
  const body = chromium
    ? `<ol class="dl-steps">
        <li>Bấm biểu tượng ${icon('download')} cuối thanh địa chỉ → <b>Cài đặt</b>.</li>
        <li>Không thấy biểu tượng: ${edge ? '<b>⋯</b> → <b>Ứng dụng</b> → <b>Cài đặt trang web này dưới dạng ứng dụng</b>' : '<b>⋮</b> → <b>Truyền, lưu và chia sẻ</b> → <b>Cài đặt trang này làm ứng dụng</b>'}.</li>
        <li>Đã cài rồi: mở <b>ATT ServiceOS</b> từ Desktop hoặc Start.</li>
      </ol>`
    : '<p>Mở bằng <b>Chrome</b> hoặc <b>Edge</b> để cài.</p>';
  openModal({ title: 'Cài trên máy tính', size: 'sm', body: `<div class="dl-help">${body}</div>` });
}

onGlobal('click', 'install-app', async () => {
  closeUserMenu();
  if (isStandalonePwa()) {
    toast('Ứng dụng đã được cài trên thiết bị này', 'info');
    return;
  }
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    try { await deferredInstallPrompt.userChoice; } catch { /* ignore */ }
    deferredInstallPrompt = null;
    return;
  }
  if (!isPhoneOrTablet()) { desktopInstallHelp(); return; }
  // Điện thoại: APK (Android) / hồ sơ cấu hình (iPhone)
  window.location.href = '/tai-app.html';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        try { reg.update(); } catch { /* ignore */ }
      })
      .catch(() => {});
    navigator.serviceWorker.addEventListener('message', (ev) => {
      if (ev && ev.data && ev.data.type === 'SW_ACTIVATED') {
        // SW mới đã claim — nếu vẫn còn boot splash (bản cũ), buộc reload 1 lần
        try {
          if (document.querySelector('#app .boot') && !sessionStorage.getItem('sw-reloaded')) {
            sessionStorage.setItem('sw-reloaded', '1');
            location.reload();
          }
        } catch { /* ignore */ }
      }
    });
  });
}

onGlobal('click', 'app-refresh', () => { window.location.reload(); });

// ----- Phiên bản mới: so các file ?v= trong index.html trên máy chủ với trang đang chạy (khi quay lại app + mỗi 2 phút).
// Khác nhau → nếu không đang làm dở (không gõ chữ, không mở hộp thoại, không trong cuộc gọi) thì tự tải lại; không thì hiện thanh báo.
(() => {
  let barShown = false;
  const sigOf = (html) => (String(html).match(/\/(?:js\/[\w-]+\.js|app\.css)\?v=[\w.-]+/g) || []).sort().join('|');
  const mine = () => sigOf([...document.querySelectorAll('script[src], link[rel="stylesheet"][href]')]
    .map((el) => new URL(el.getAttribute('src') || el.getAttribute('href'), location.href).pathname + new URL(el.getAttribute('src') || el.getAttribute('href'), location.href).search).join(' '));
  const busy = () => {
    const a = document.activeElement;
    if (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && String(a.value || '').trim()) return true;
    if (document.querySelector('#call-ov, .modal-backdrop:not(.hidden), #chat-sheet, #drawer.open')) return true;
    return false;
  };
  const check = async () => {
    if (document.hidden) return;
    try {
      const r = await fetch(`/?vcheck=${Date.now()}`, { cache: 'no-store' });
      if (!r.ok) return;
      const remote = sigOf(await r.text());
      const local = mine();
      if (!remote || !local || remote === local) return;
      // Đã tự tải lại cho đúng bản này mà vẫn lệch (bộ nhớ đệm lạ) → không tải lại vòng lặp, chỉ báo
      let tried = '';
      try { tried = sessionStorage.getItem('auto-update-to') || ''; } catch { /* ignore */ }
      if (!busy() && tried !== remote) {
        try { sessionStorage.setItem('auto-update-to', remote); } catch { /* ignore */ }
        location.reload();
        return;
      }
      if (!barShown) {
        barShown = true;
        const bar = document.createElement('div');
        bar.className = 'update-bar';
        bar.setAttribute('role', 'status');
        bar.innerHTML = `<span>Đã có phiên bản mới của ứng dụng.</span>
          <button type="button" class="btn btn-sm btn-primary" data-click="app-refresh">Tải lại</button>
          <button type="button" class="btn btn-sm btn-ghost" aria-label="Để sau" data-update-close>Để sau</button>`;
        bar.querySelector('[data-update-close]').addEventListener('click', () => bar.remove());
        document.body.appendChild(bar);
      }
    } catch { /* mất mạng — thử lại lần sau */ }
  };
  setTimeout(check, 15e3);
  setInterval(check, 2 * 60e3);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
})();
onGlobal('click', 'toggle-theme', (el) => {
  const next = !document.body.classList.contains('theme-dark');
  document.body.classList.toggle('theme-dark', next);
  try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* ignore */ }
  if (window.ATTMenuColor) window.ATTMenuColor.apply();
  const tool = document.querySelector('.tool-icon[data-click="toggle-theme"]');
  if (tool) {
    tool.innerHTML = icon(next ? 'sun' : 'moon');
    tool.title = next ? 'Giao diện sáng' : 'Giao diện tối';
    tool.setAttribute('aria-label', 'Đổi giao diện');
  }
  const menuItem = document.querySelector('#user-dd [data-click="toggle-theme"]');
  if (menuItem) menuItem.innerHTML = `${icon(next ? 'sun' : 'moon')} ${next ? 'Giao diện sáng' : 'Giao diện tối'}`;
  if (el && el.closest && el.closest('#user-dd')) closeUserMenu();
});
// "Cần xử lý": đếm việc đang chờ (GSM: chờ xác nhận / nghiệm thu; xưởng: cảnh báo + phiếu BH quá hạn).
// Chuông: tin báo từng việc (giao phiếu, GSM duyệt / trả về, phụ tùng về, cuộc gọi nhỡ…) – chưa đọc / đã đọc.
let notifData = null;
let feedData = null;
let notifTimer = null;
function setBadge(badgeId, btnId, n, label, unit) {
  if (window.I18N && window.I18N.lang() === 'en') { label = window.I18N.t(label); unit = window.I18N.t(unit); }
  const badge = document.getElementById(badgeId);
  const btn = document.getElementById(btnId);
  if (badge) {
    badge.textContent = n > 99 ? '99+' : String(n);
    badge.classList.toggle('hidden', !n);
  }
  if (btn) btn.setAttribute('aria-label', n ? `${label} (${n} ${unit})` : label);
}
async function refreshNotif() {
  if (!S.me) return;
  const [counts, feed] = await Promise.all([
    api('GET', `/api/notifications${qs({ branch_id: S.branch })}`).catch(() => null),
    api('GET', '/api/notifications/feed').catch(() => null),
  ]);
  if (counts) {
    notifData = counts;
    setBadge('work-n', 'work-btn', counts.total || 0, 'Cần xử lý', 'việc');
  }
  if (feed) {
    feedData = feed;
    const n = feed.unread || 0;
    setBadge('notif-n', 'notif-btn', n, 'Thông báo', 'chưa đọc');
    // Điện thoại: chuông nằm trong menu tài khoản → số trong menu + chấm đỏ ở ảnh đại diện
    const m = document.getElementById('notif-n-m');
    if (m) { m.textContent = n > 99 ? '99+' : String(n); m.classList.toggle('hidden', !n); }
    document.getElementById('user-dot')?.classList.toggle('hidden', !n);
  }
}
// Màu tiêu đề tin theo loại việc
const feedTone = (t) => {
  const s = String(t || '').toLowerCase();
  if (/trả phiếu|trả về|nhỡ|chuyển người khác|từ chối/.test(s)) return 'red';
  if (/đã xác nhận|đã nghiệm thu|đã có phụ tùng|đủ phụ tùng|đã nhận phiếu/.test(s)) return 'green';
  if (/^chờ|chờ gsm|xe sửa xong/.test(s)) return 'amber';
  return 'blue';
};
const timeAgo = (s) => {
  const t = Date.parse(String(s || '').replace(' ', 'T') + '+07:00');
  if (!Number.isFinite(t)) return '';
  const m = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (m < 1) return 'Vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.round(h / 24);
  return d < 7 ? `${d} ngày trước` : String(s).slice(0, 10).split('-').reverse().join('/');
};
function startNotifPoll() {
  clearInterval(notifTimer);
  refreshNotif();
  if (typeof startChatBadgePoll === 'function') startChatBadgePoll();
  if (typeof PUSH !== 'undefined') PUSH.sync();
  if (typeof pushGate === 'function') pushGate();
  notifTimer = setInterval(() => { if (!document.hidden) refreshNotif(); }, 60e3);
}
// Quay lại tab: chỉ làm mới nếu lần trước đã quá 60 giây (đổi tab liên tục không gọi API mỗi lần)
let notifVisAt = 0;
document.addEventListener('visibilitychange', () => {
  if (document.hidden || !S.me || Date.now() - notifVisAt < 60e3) return;
  notifVisAt = Date.now();
  refreshNotif();
});
onGlobal('click', 'work-menu', async (el) => {
  const fromUserMenu = !!(el && el.closest && el.closest('#user-dd'));
  if (fromUserMenu) closeUserMenu();
  const anchor = fromUserMenu ? document.getElementById('work-btn') || el : el;
  if (gmToggleOff(anchor)) return;
  await refreshNotif();
  const items = (notifData && notifData.items) || [];
  const list = items.length
    ? items.map((i) => `<a class="gm-item notif-item" role="menuitem" tabindex="-1" href="${esc(i.href)}">
        <span class="gm-lab">${esc(i.label)}</span><span class="notif-c notif-${esc(i.tone || 'amber')}">${NF.format(i.count)}</span></a>`).join('')
    : '<div class="muted small" style="padding:14px 16px">Không có việc nào đang chờ.</div>';
  const cur = gmPopup(anchor, `<div class="gm-sheet-head"><b>Cần xử lý</b><button type="button" class="gm-x" data-act="close" aria-label="Đóng">${icon('x')}</button></div>
    <div class="gm-list" role="menu" aria-label="Cần xử lý">${list}</div>`, { cls: 'gm-menu notif-pop', label: 'Cần xử lý' });
  gmMenuKeys(cur);
  const first = cur.el.querySelector('.gm-item');
  if (first) first.focus({ preventScroll: true });
  cur.el.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="close"]')) gmClose(true);
    else if (e.target.closest('a.notif-item')) gmClose();
  });
});
onGlobal('click', 'notif-menu', async (el) => {
  const fromUserMenu = !!(el && el.closest && el.closest('#user-dd'));
  if (fromUserMenu) closeUserMenu();
  const anchor = fromUserMenu ? document.getElementById('notif-btn') || el : el;
  if (gmToggleOff(anchor)) return;
  await refreshNotif();
  const items = (feedData && feedData.items) || [];
  const unread = (feedData && feedData.unread) || 0;
  const list = items.length
    ? items.map((i) => `<a class="gm-item feed-item${i.read_at ? '' : ' unread'}" role="menuitem" tabindex="-1" href="${esc(i.url || '#/dashboard')}" data-id="${i.id}">
        <span class="feed-dot" aria-hidden="true"></span>
        <span class="feed-txt"><b class="ft-${feedTone(i.title)}">${esc(i.title)}</b>${i.body ? `<span class="feed-body">${esc(i.body)}</span>` : ''}<span class="feed-time">${esc(timeAgo(i.created_at))}</span></span></a>`).join('')
    : '<div class="muted small" style="padding:14px 16px">Chưa có thông báo.</div>';
  const cur = gmPopup(anchor, `<div class="gm-sheet-head"><b>Thông báo</b>
      ${unread ? '<button type="button" class="feed-all" data-act="read-all">Đọc hết</button>' : ''}
      <button type="button" class="gm-x" data-act="close" aria-label="Đóng">${icon('x')}</button></div>
    <div class="gm-list feed-list" role="menu" aria-label="Thông báo">${list}</div>`, { cls: 'gm-menu notif-pop feed-pop', label: 'Thông báo' });
  gmMenuKeys(cur);
  const first = cur.el.querySelector('.gm-item');
  if (first) first.focus({ preventScroll: true });
  cur.el.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="close"]')) { gmClose(true); return; }
    if (e.target.closest('[data-act="read-all"]')) {
      e.preventDefault();
      api('POST', '/api/notifications/read', { all: true }).then(refreshNotif).catch(() => {});
      cur.el.querySelectorAll('.feed-item.unread').forEach((a) => a.classList.remove('unread'));
      e.target.closest('[data-act="read-all"]').remove();
      setBadge('notif-n', 'notif-btn', 0, 'Thông báo', 'chưa đọc');
      return;
    }
    const a = e.target.closest('a.feed-item');
    if (!a) return;
    if (a.classList.contains('unread')) api('POST', '/api/notifications/read', { ids: [Number(a.dataset.id)] }).then(refreshNotif).catch(() => {});
    gmClose();
  });
});
onGlobal('click', 'lang-info', (el) => {
  const fromUserMenu = !!(el && el.closest && el.closest('#user-dd'));
  if (fromUserMenu) closeUserMenu();
  const anchor = fromUserMenu ? document.querySelector('.topbar-tools .lang-pill') || el : el;
  if (gmToggleOff(anchor)) return;
  const cur = loginLang();
  const opt = (code) => `<button type="button" class="gm-item lang-opt${cur === code ? ' on' : ''}" role="menuitemradio" aria-checked="${cur === code}" data-lang="${code}" translate="no">
      ${LOGIN_FLAGS[code](`p${code}`)}<span>${LOGIN_LANG_NAMES[code]}</span>${cur === code ? icon('check') : ''}</button>`;
  const pop = gmPopup(anchor, `<div class="gm-list" role="menu" aria-label="Ngôn ngữ / Language">${opt('vi')}${opt('en')}</div>`, { cls: 'gm-menu lang-pop', label: 'Ngôn ngữ / Language' });
  gmMenuKeys(pop);
  pop.el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    gmClose();
    if (b.dataset.lang === cur) return;
    if (window.I18N) window.I18N.setLang(b.dataset.lang);
    document.querySelectorAll('.lang-pill').forEach((p) => { p.innerHTML = langPillHtml(); });
  });
});
onGlobal('click', 'change-pw', () => { closeUserMenu(); openPasswordModal(); });

// ----- Ảnh đại diện -----
function userAvatarHtml(u, cls = '') {
  return u && u.avatar
    ? `<span class="avatar avatar-img ${cls}"><img src="${esc(u.avatar)}" alt=""></span>`
    : `<span class="avatar ${cls}">${esc(initials(u ? u.full_name : ''))}</span>`;
}
function refreshUserAvatars() {
  $$('.user-chip .avatar, #user-dd .dd-user .avatar').forEach((el) => { el.outerHTML = userAvatarHtml(S.me); });
}
// Cắt vuông giữa ảnh, thu nhỏ 256px → JPEG (~15–30 KB)
async function avatarDataUrl(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () => reject(new Error('Không đọc được ảnh'));
      im.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const size = Math.min(256, side);
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
    return c.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}
onGlobal('click', 'change-avatar', () => {
  closeUserMenu();
  let picked = null;
  const preview = () => userAvatarHtml(picked ? { ...S.me, avatar: picked } : S.me, 'avatar-xl');
  openModal({
    title: 'Ảnh đại diện',
    size: 'sm',
    body: `<div class="modal-body avatar-edit">
        <div id="avatar-preview">${preview()}</div>
        <div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap">
          <label class="btn">${icon('camera')} Chọn ảnh<input type="file" accept="image/*" hidden data-change="avatar-pick"></label>
          ${S.me.avatar ? `<button type="button" class="btn btn-ghost" data-click="avatar-remove">${icon('trash')} Xóa ảnh</button>` : ''}
        </div>
        <div class="small muted" style="text-align:center">Ảnh được cắt vuông ở giữa và thu nhỏ trước khi lưu.</div>
      </div>${modalFoot('Lưu', {}).replace('type="submit"', 'type="button" data-click="avatar-save"')}`,
    handlers: {
      change: {
        'avatar-pick': async (el) => {
          const f = el.files && el.files[0];
          if (!f) return;
          try { picked = await avatarDataUrl(f); $('#avatar-preview').innerHTML = preview(); } catch (e) { toast(e.message, 'error'); }
        },
      },
      click: {
        'avatar-save': async () => {
          if (!picked) { toast('Bạn chưa chọn ảnh', 'error'); return; }
          await api('PUT', '/api/me/avatar', { data: picked });
          S.me.avatar = picked;
          refreshUserAvatars();
          closeModal();
          toast('Đã cập nhật ảnh đại diện', 'success');
        },
        'avatar-remove': async () => {
          await api('DELETE', '/api/me/avatar');
          S.me.avatar = null;
          refreshUserAvatars();
          closeModal();
          toast('Đã xóa ảnh đại diện', 'success');
        },
      },
    },
  });
});
onGlobal('click', 'logout', async () => {
  closeUserMenu();
  try { if (typeof PUSH !== 'undefined') await PUSH.detach(); } catch { /* ignore */ }
  try { await api('POST', '/api/auth/logout'); } catch { /* ignore */ }
  window.location.hash = '';
  renderLogin();
});
// Đóng bảng trượt: quay về đúng trang đang nằm phía sau (Tổng quan, Điều phối, danh sách đã lọc…)
onGlobal('click', 'drawer-close', () => {
  const back = drawerBackHash();
  closeDrawer();
  // Mở thẳng từ trang phía sau (1 bước) → lùi lịch sử, tránh chồng thêm mục khi bấm Back
  if (drawerSteps === 1 && back === mainHash && drawerFromHash === mainHash) {
    window.history.back();
    return;
  }
  window.location.hash = back;
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || currentModal || !drawerIsOpen() || !drawerSeq) return;
  const btn = document.getElementById('drawerClose');
  if (btn) btn.click();
});

onGlobal('click', 'go', (el) => {
  // Đang bôi đen chữ (copy mã phiếu, biển số…) thì không mở chi tiết
  const sel = window.getSelection && window.getSelection();
  if (sel && !sel.isCollapsed && String(sel).trim() && el.contains(sel.anchorNode)) return;
  window.location.hash = el.dataset.href;
});
onGlobal('change', 'branch', (el) => {
  S.branch = el.value;
  try { localStorage.setItem('branch', S.branch); } catch { /* ignore */ }
  const pick = el.closest('.branch-pick');
  if (pick) {
    const b = S.meta.branches.find((x) => String(x.id) === String(S.branch));
    pick.querySelector('.branch-pick-text').textContent = branchPickLabel(b, branchCompact());
    pick.title = b ? `${b.code} – ${b.name}` : 'Lọc theo cơ sở';
  }
  mainStale = true;
  router({ force: true });
  refreshNotif();
});

// ---------------------------------------------------------------------------
// Bộ định tuyến
// ---------------------------------------------------------------------------
// Trang chính (vùng nội dung) và bảng trượt chi tiết có vòng đời riêng: mở/đóng bảng trượt không
// xóa nút bấm, bộ hẹn giờ hay dữ liệu của trang phía sau.
let renderSeq = 0;
let mainSeq = 0; // lần vẽ trang chính đang hiệu lực (0 = cần vẽ lại)
let drawerSeq = 0; // lần vẽ bảng trượt đang hiệu lực (0 = đóng)
const mainTimers = [];
const drawerTimers = [];
let mainAbort = null;
let drawerAbort = null;
let mainLoading = false;
let mainPath = null;
// Địa chỉ đang hiển thị ở vùng nội dung – để đóng bảng trượt không vẽ lại danh sách (tránh chớp)
let mainHash = null;
// S.mutations lúc vẽ trang chính: có ghi dữ liệu (trong bảng trượt) thì làm mới tại chỗ khi đóng
let mainMut = -1;
let mainStale = false;
let lastHash = null;
let drawerPath = null;
let drawerSteps = 0;
let drawerFromHash = null;

const newAbort = () => (typeof AbortController !== 'undefined' ? new AbortController() : null);
const clearTimers = (list) => { list.forEach(clearInterval); list.length = 0; };

/** Địa chỉ quay về khi đóng bảng trượt: trang đang nằm phía sau, không có thì danh sách phiếu đã xem. */
function drawerBackHash() {
  if (mainHash && !/^#\/work-orders\/new(\?|$)/.test(mainHash)) return mainHash;
  const p = window.location.hash.replace(/^#/, '');
  const root = /^\/warranty-orders\//.test(p) ? '#/warranty-orders' : /^\/warranty-tickets\//.test(p) ? '#/warranty-tickets'
    : /^\/retail-orders\//.test(p) ? '#/retail-orders' : /^\/retail-warranty\//.test(p) ? '#/retail-warranty'
    : /^\/bship-orders\//.test(p) ? '#/bship-orders' : '#/work-orders';
  try {
    const h = sessionStorage.getItem(`woListHash:${root}`);
    return h && h.startsWith(root) ? h : root;
  } catch { return root; }
}

function dropDrawer() {
  drawerSeq = 0;
  drawerPath = null;
  drawerSteps = 0;
  if (drawerAbort) { drawerAbort.abort(); drawerAbort = null; }
  clearTimers(drawerTimers);
  resetDrawerHandlers();
  setHandlerLayer('page');
  closeDrawer();
}

function invalidateMain() {
  mainSeq = 0;
  mainHash = null;
  mainLoading = false;
  if (mainAbort) { mainAbort.abort(); mainAbort = null; }
  clearTimers(mainTimers);
  const main = $('#main');
  if (main) main.classList.remove('is-loading');
}

const DRAWER_SKELETON = `<div class="drawer-skel" role="status" aria-live="polite" aria-busy="true">
  <span class="sr-only">Đang tải…</span>
  <div class="skel skel-bar"></div><div class="skel skel-line w70"></div><div class="skel skel-line w45"></div>
  <div class="skel skel-block"></div><div class="skel skel-line w80"></div><div class="skel skel-line w60"></div><div class="skel skel-block"></div></div>`;

async function router({ force = false } = {}) {
  if (!S.me) return;
  const { path, query } = parseHash();
  if (path === '/' || path === '') {
    const first = NAV.flatMap((g) => g.items).find((it) => [].concat(it.perm).some((p) => can(p)));
    window.location.replace(`#${first ? first.href : '/dashboard'}`);
    return;
  }
  const hash = window.location.hash || '';
  const prevHash = lastHash;
  lastHash = hash;
  closeModal();
  closeUserMenu();
  document.body.classList.remove('nav-open');
  const seq = ++renderSeq;
  const main = $('#main');
  const route = ROUTES.map((r) => ({ r, m: r.re.exec(path) })).find((x) => x.m);

  // Tô sáng mục menu khớp dài nhất (VD: /work-orders/new ưu tiên hơn /work-orders); bảng trượt giữ mục của trang phía sau
  const navPath = route && route.r.drawer && mainPath ? mainPath : path;
  let best = null;
  $$('.nav a[data-nav]').forEach((a) => {
    const href = a.dataset.nav.split('?')[0];
    if ((navPath === href || navPath.startsWith(`${href}/`)) && (!best || href.length > best.href.length)) best = { a, href };
  });
  $$('.nav a').forEach((a) => a.classList.toggle('active', !!best && a === best.a));

  if (!route) {
    dropDrawer();
    invalidateMain();
    resetPageHandlers();
    clearStickyFootPortal();
    mainPath = path;
    $('#page-title').textContent = 'Không tìm thấy';
    document.title = S.meta?.app_name || 'ATT ServiceOS';
    main.innerHTML = `<div class="card"><div class="empty">${icon('alert')}<div>Trang không tồn tại</div><a href="#/">Về trang chủ</a></div></div>`;
    return;
  }
  const { r, m } = route;
  const denied = r.perm && ![].concat(r.perm).some((p) => can(p));
  const deniedHtml = `<div class="card"><div class="empty">${icon('lock')}<div class="strong">Bạn không có quyền truy cập chức năng này</div>
      <div>Liên hệ quản trị viên nếu cần được cấp quyền.</div></div></div>`;
  const errorHtml = (e) => `<div class="card"><div class="empty">${icon('alert')}<div class="strong">${esc(e.message)}</div>
      <div style="margin-top:10px"><button class="btn" data-click="retry">Thử lại</button></div></div></div>`;

  // ----- Trang chi tiết: đổ vào bảng trượt bên phải, trang phía sau giữ nguyên -----
  if (r.drawer) {
    // Trang chính chưa vẽ xong → bỏ, vẽ lại khi đóng bảng trượt
    if (mainLoading) invalidateMain();
    if (hash !== prevHash) {
      if (drawerSeq) drawerSteps++;
      else { drawerSteps = 1; drawerFromHash = prevHash; }
    }
    const wasShowing = !!drawerSeq && drawerIsOpen() && drawerPath === path;
    if (drawerAbort) drawerAbort.abort();
    drawerAbort = newAbort();
    clearTimers(drawerTimers);
    resetDrawerHandlers();
    setHandlerLayer('drawer');
    drawerSeq = seq;
    drawerPath = path;
    if (!mainSeq && !main.children.length) $('#page-title').textContent = r.title || '';
    if (denied) { openDrawer(r.title || '', '', deniedHtml); return; }
    // Mở bảng trượt ngay (khung chờ), dữ liệu về sau
    if (!wasShowing) openDrawer(r.title || '', '', DRAWER_SKELETON);
    let shown = wasShowing;
    const ctx = {
      params: m.slice(1),
      query,
      path,
      inDrawer: true,
      signal: drawerAbort ? drawerAbort.signal : undefined,
      stale: () => seq !== drawerSeq,
      setMain: (html) => {
        if (seq !== drawerSeq) return;
        // Vẽ lại sau khi lưu: giữ vị trí đang cuộn trong bảng trượt
        openDrawer(r.title || '', '', html, { keepScroll: shown });
        shown = true;
        requestAnimationFrame(() => { try { enableTableColResize(document.getElementById('drawerBody')); } catch { /* ignore */ } });
      },
      every: (fn, ms) => { drawerTimers.push(setInterval(() => { if (seq === drawerSeq && !currentModal && !document.hidden) fn(); }, ms)); },
      reload: () => (seq === drawerSeq ? router({ force: true }) : undefined),
    };
    try {
      await r.render(ctx);
    } catch (e) {
      if (seq !== drawerSeq || e.aborted || e.status === 401) return;
      openDrawer(r.title || '', '', errorHtml(e));
    }
    return;
  }

  // ----- Trang chính -----
  dropDrawer();
  clearStickyFootPortal();
  $('#page-title').textContent = r.title || '';
  document.title = S.meta.app_name || 'ATT ServiceOS';
  // Đóng bảng trượt / Back quay về đúng trang đang hiện phía sau → chỉ cần ẩn bảng trượt
  const keepMain = !force && !mainStale && !!mainSeq && !mainLoading && mainHash === hash && main.children.length > 0;
  if (keepMain && S.mutations === mainMut) {
    mainPath = path;
    return;
  }
  // keepMain mà dữ liệu đã đổi → vẽ lại tại chỗ (không xóa trắng, giữ vị trí cuộn)
  const samePath = keepMain || mainPath === path;
  mainStale = false;
  invalidateMain();
  resetPageHandlers();
  setHandlerLayer('page');
  mainPath = path;
  if (denied) {
    main.innerHTML = deniedHtml;
    return;
  }
  if (!samePath) main.innerHTML = '<div class="empty">Đang tải dữ liệu…</div>';
  else main.classList.add('is-loading');
  mainSeq = seq;
  mainLoading = true;
  mainAbort = newAbort();

  const ctx = {
    params: m.slice(1),
    query,
    path,
    inDrawer: false,
    signal: mainAbort ? mainAbort.signal : undefined,
    stale: () => seq !== mainSeq,
    setMain: (html) => {
      if (seq !== mainSeq) return;
      main.innerHTML = html;
      mainHash = hash;
      mainMut = S.mutations;
      requestAnimationFrame(() => {
        mountStickyFootPortal();
        try {
          if (typeof enableTableColResize === 'function') enableTableColResize(main);
        } catch { /* ignore */ }
      });
    },
    // Tạm dừng khi ẩn tab, có hộp thoại hoặc đang mở bảng trượt
    every: (fn, ms) => { mainTimers.push(setInterval(() => { if (seq === mainSeq && !drawerSeq && !currentModal && !document.hidden) fn(); }, ms)); },
    reload: () => {
      if (seq !== mainSeq) return undefined;
      if (drawerSeq) { mainStale = true; return undefined; }
      return router({ force: true });
    },
  };
  try {
    const scrollY = window.scrollY;
    await r.render(ctx);
    if (seq === mainSeq) {
      mountStickyFootPortal();
      try {
        if (typeof enableTableColResize === 'function') enableTableColResize(main);
      } catch { /* ignore */ }
      window.scrollTo(0, samePath ? scrollY : 0);
    }
  } catch (e) {
    if (seq !== mainSeq || e.aborted) return;
    if (e.status === 401) return;
    main.innerHTML = errorHtml(e);
    mainHash = null;
  } finally {
    if (seq === mainSeq) {
      mainLoading = false;
      main.classList.remove('is-loading');
    }
  }
}
onGlobal('click', 'retry', () => router({ force: true }));
onGlobal('click', 'reload-page', () => window.location.reload());

async function start(boot) {
  const me = (boot && boot.user) ? boot : await api('GET', '/api/me');
  document.documentElement.lang = 'vi';
  S.me = me.user;
  S.perms = new Set(me.perms);
  if (S.me.must_change_pw) {
    renderForcePassword();
    return;
  }
  try {
    await loadMeta(me);
  } catch (e) {
    // Meta lỗi không được chặn đăng nhập — dùng tối thiểu để vào app
    console.error('[start] loadMeta', e);
    S.meta = S.meta || {
      app_name: 'ATT ServiceOS',
      company_name: 'An Thịnh Tech',
      branches: [],
      roles: {},
      settings: { faults: [], warranty_kinds: [], sla: {}, qc: {} },
      wo_statuses: {},
      active_statuses: [],
      service_types: {},
      priorities: {},
      models: [],
      customer_types: {},
      appt_statuses: {},
      care_statuses: {},
    };
    try { toast(e.message || 'Không tải đủ cấu hình — một số chức năng có thể thiếu', 'error'); } catch { /* ignore */ }
  }
  if (!S.meta.branches) S.meta.branches = [];
  if (S.branch && !S.meta.branches.some((b) => String(b.id) === String(S.branch))) S.branch = '';
  renderShell();
  invalidateMain();
  dropDrawer();
  resetPageHandlers();
  mainPath = null;
  lastHash = null;
  try {
    if (typeof watchTableColResize === 'function') watchTableColResize();
  } catch { /* ignore — không được kẹt boot/shell */ }
  await router();
  try { maybeShowWhatsNew(); } catch { /* ignore */ }
}

// ----- Thông báo tính năng mới: đổi WHATS_NEW.id mỗi lần phát hành để hiện lại 1 lần cho mỗi người -----
const WHATS_NEW = {
  id: '2026-10-20c',
  title: 'Có gì mới trong bản cập nhật',
  items: [
    ['phone', 'Gọi thoại và video', 'Trong chat riêng, bấm biểu tượng điện thoại hoặc camera. Người kia đang mở app sẽ thấy cuộc gọi đến. Cần cho phép micro/camera. Mạng công ty có thể cần máy chủ TURN (VPS).'],
    ['smile', 'Cảm xúc, file và clip', 'Thả cảm xúc cạnh tin nhắn. Kẹp giấy để gửi ảnh, video MP4, PDF, Word, Excel. Trên web hiện tại tệp tối đa ~2 MB; VPS sẽ gửi được clip dài hơn.'],
  ],
};
const WHATS_NEW_KEY = 'xdv_whats_new_seen';
function openWhatsNew() {
  openModal({
    title: WHATS_NEW.title,
    size: 'sm',
    body: `<div class="modal-body whats-new">
        ${WHATS_NEW.items.map(([ic, h, d]) => `<div class="wn-item"><span class="wn-ic">${icon(ic)}</span><div><b>${esc(h)}</b><div class="small muted">${esc(d)}</div></div></div>`).join('')}
      </div>
      <div class="modal-foot"><button type="button" class="btn btn-primary" data-click="modal-close">Đã hiểu</button></div>`,
  });
}
function maybeShowWhatsNew() {
  let seen = '';
  try { seen = localStorage.getItem(WHATS_NEW_KEY) || ''; } catch { /* ignore */ }
  if (seen === WHATS_NEW.id) return;
  try { localStorage.setItem(WHATS_NEW_KEY, WHATS_NEW.id); } catch { /* ignore */ }
  setTimeout(() => { if (!document.querySelector('#modal-root .modal')) openWhatsNew(); }, 600);
}
onGlobal('click', 'whats-new', () => { closeUserMenu(); openWhatsNew(); });
onGlobal('click', 'open-help', () => { closeUserMenu(); location.hash = '#/help'; });

onUnauthorized = () => {
  toast('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại', 'error');
  renderLogin();
};

window.addEventListener('hashchange', () => router());

function safeBootFallback(err) {
  const msg = (err && err.message) ? String(err.message) : 'Không tải được ứng dụng';
  const isAuth = err && (err.status === 401 || /đăng nhập|hết hạn|401/i.test(msg));
  // 401 /api/me lúc boot = chưa đăng nhập (trạng thái bình thường với khách) → hiện login lặng lẽ, chỉ log lỗi thật
  if (!isAuth) {
    try {
      if (typeof console !== 'undefined' && console.error) console.error('[boot]', err);
    } catch { /* ignore */ }
  }
  try {
    renderLogin();
    if (!isAuth) {
      const box = $('#login-error');
      if (box) {
        box.innerHTML = `<div class="alert alert-danger">${icon('alert')}<div>${esc(msg)}
          <div class="small" style="margin-top:6px">Nếu vẫn lỗi: tải lại trang hoặc xóa dữ liệu site / Service Worker.</div></div></div>`;
      }
      try { toast(msg, 'error'); } catch { /* ignore */ }
    }
  } catch (e2) {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `<div class="login"><div class="login-form-wrap"><div class="login-form">
        <h2>Không tải được ứng dụng</h2>
        <div class="muted">${esc(msg)}</div>
        <div class="muted" style="margin-top:8px">Vui lòng tải lại trang. Nếu vẫn treo, xóa dữ liệu site / Service Worker rồi mở lại.</div>
        <button class="btn btn-primary" type="button" data-click="reload-page">Tải lại</button>
      </div></div></div>`;
    }
  }
}

// Failsafe: không bao giờ để user kẹt mãi ở "Đang tải…"
const bootFailsafe = setTimeout(() => {
  if (document.querySelector('#app .boot')) {
    safeBootFallback(new Error('Máy chủ phản hồi quá chậm khi khởi động. Vui lòng thử lại.'));
  }
}, 12000);

start()
  .catch((err) => safeBootFallback(err))
  .finally(() => clearTimeout(bootFailsafe));
