'use strict';
/* global document, window, location, localStorage, fetch, InspectText */

// ---------------------------------------------------------------------------
// Trạng thái & tiện ích chung
// ---------------------------------------------------------------------------
// mutations: tăng sau mỗi lần ghi (POST/PUT/DELETE) thành công → danh sách / bộ đệm biết dữ liệu đã đổi
const S = { me: null, perms: new Set(), meta: null, branch: '', mutations: 0 };
try { S.branch = localStorage.getItem('branch') || ''; } catch { /* ignore */ }

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (v) => (v === null || v === undefined ? '' : String(v).replace(/[&<>"']/g, (c) => ESC_MAP[c]));
const can = (p) => S.perms.has(p);

const ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  board: 'M4 4h4v16H4zM10 4h4v11h-4zM16 4h4v7h-4z',
  clipboard: 'M9 3h6v4H9zM7 5H5v16h14V5h-2M8 12h8M8 16h5',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
  users: 'M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 20v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  scooter: 'M5 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM19 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM7.5 16.5h7l3.5-8h-3M14 4h3l1 4.5M3 14l2.5-4H12',
  headset: 'M3 14v-2a9 9 0 0 1 18 0v2M3 14h3v6H4a1 1 0 0 1-1-1zM21 14h-3v6h2a1 1 0 0 0 1-1z',
  chart: 'M4 20V11M10 20V4M16 20v-6M21 20H3',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  shieldCheck: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M8.5 12l2.5 2.5 4.5-5'],
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  eyeOff: 'M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2',
  building: 'M4 21V6l8-3v18M12 21h8V10l-8-3M7.5 9v.01M7.5 13v.01M7.5 17v.01M16 13v.01M16 17v.01',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 3',
  plus: 'M12 5v14M5 12h14',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  menu: 'M3 6h18M3 12h18M3 18h18',
  pin: [
    'M12 17v5',
    'M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z',
  ],
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  chevronDown: 'M6 9l6 6 6-6',
  moon: 'M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z',
  sun: 'M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  bell: 'M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9M10 21a2 2 0 0 0 4 0',
  bellOff: 'M8.7 3.3A6 6 0 0 1 18 9c0 2 .2 3.5.6 4.6M17 18H3c0-2 3-2 3-9c0-.6.1-1.2.3-1.8M10 21a2 2 0 0 0 4 0M3 3l18 18',
  x: 'M18 6 6 18M6 6l12 12',
  printer: 'M6 9V3h12v6M6 18H4v-7h16v7h-2M6 14h12v7H6z',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  check: 'M20 6 9 17l-5-5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  alert: 'M12 3 2 21h20zM12 10v4M12 17h.01',
  wrench: 'M14.7 6.3a4 4 0 0 0 5 5L22 14l-8 8-2.3-2.3M14.7 6.3 12 3.6 3.6 12l2.7 2.7',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  download: 'M12 3v12M7 10l5 5 5-5M5 21h14',
  refresh: 'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5',
  swap: 'M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z',
  trash: 'M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  key: 'M14.5 9.5a4.5 4.5 0 1 0-4 4.5l1.5 1.5H14v2h2v2h3v-3l-4.2-4.2a4.5 4.5 0 0 0-.3-2.8zM8 8h.01',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  battery: 'M3 7h15v10H3zM21 10v4M6 10v4M9 10v4',
  camera: 'M3 8h4l2-3h6l2 3h4v12H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  message: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  calendarPlus: 'M8 2v4M16 2v4M21 12V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8M3 10h18M16 19h6M19 16v6',
  squarePen: 'M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.4 2.6a1.4 1.4 0 0 1 3 3l-9 9a2 2 0 0 1-.85.5l-2.9.85a.5.5 0 0 1-.6-.6l.85-2.9a2 2 0 0 1 .5-.85z',
  printer2: 'M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6zM17.5 12h.01',
  // Hai lớp: path đầu là mảng tô nhạt (CSS .duo path:first-child), các path sau là nét
  calPlusDuo: ['M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4zM17.5 13a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9z',
    'M8 2v4M16 2v4M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6.5M3 10h18',
    'M17.5 13a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9zM17.5 15.6v3.8M15.6 17.5h3.8'],
  penDuo: ['M18.4 2.6a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z',
    'M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
    'M18.4 2.6a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4zM16 5l3 3'],
  printDuo: ['M4 9h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z',
    'M6 14h12v7H6z',
    'M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M17.5 12h.01M9 17.5h6'],
  userX: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8a4 4 0 0 0 0-8M17 8l5 5M22 8l-5 5',
  chatCall: ['M7.9 20A9 9 0 1 0 4 16.1L2 22z', 'M8 9.5h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z', 'M14 11.25l3-1.5v4.5l-3-1.5'],
  send: 'm22 2-7 20-4-9-9-4zM22 2 11 13',
  image: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M8.5 9.5h.01',
  video: 'M15 10l4.55-2.27A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.45.9L15 14M5 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
  mic: ['M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z', 'M5 11a7 7 0 0 0 14 0', 'M12 18v3'],
  paperclip: 'm21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48',
  smile: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M8 10h.01', 'M16 10h.01', 'M8 15s1.5 2 4 2 4-2 4-2'],
  userPlus: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M19 8v6', 'M22 11h-6'],
  panelRight: ['M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z', 'M15 4v16'],
  chevronUp: 'm18 15-6-6-6 6',
  mapPin: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  quote: ['M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .01-1 1.03V20c0 1 0 1 1 1z', 'M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z'],
  forward: ['m15 17 5-5-5-5', 'M4 18v-2a4 4 0 0 1 4-4h12'],
  moreH: ['M12 12h.01', 'M19 12h.01', 'M5 12h.01'],
  copy: ['M8 8h12v12H8z', 'M16 8V4H4v12h4'],
  undo: ['M9 14 4 9l5-5', 'M4 9h10.5a5.5 5.5 0 0 1 0 11H11'],
  thumbs: ['M7 10v12', 'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 16v-4M12 8h.01'],
  scan: 'M4 7V5a1 1 0 0 1 1-1h2M4 17v2a1 1 0 0 0 1 1h2M20 7V5a1 1 0 0 0-1-1h-2M20 17v2a1 1 0 0 1-1 1h-2M8 12h8',
  file: 'M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6',
  upload: 'M12 16V4M7 9l5-5 5 5M5 20h14',
  megaphone: 'M3 11v2a1 1 0 0 0 1 1h3l6 5V5L7 10H4a1 1 0 0 0-1 1zM17 8a5 5 0 0 1 0 8M20 5a9 9 0 0 1 0 14',
  grid: 'M3 4h18v17H3zM3 9h18M3 14h18M9 9v12M15 9v12M8 2v4M16 2v4',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  drive: 'M8 3h8l6 10-4 7H6l-4-7zM8 3l6 10h8M2 13h12l4 7',
  box: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  // Bộ icon menu trái (nét theo Lucide, giấy phép ISC)
  layout: ['M4 3h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', 'M15 3h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z',
    'M15 12h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z', 'M4 16h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z'],
  clipCheck: ['M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z', 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'm9 14 2 2 4-4'],
  plusCircle: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M8 12h8', 'M12 8v8'],
  kanban: ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M8 7v7', 'M12 7v4', 'M16 7v9'],
  map: ['M14.1 5.55a2 2 0 0 0 1.8 0l3.65-1.83A1 1 0 0 1 21 4.62v12.76a1 1 0 0 1-.55.9l-4.55 2.27a2 2 0 0 1-1.8 0l-4.2-2.1a2 2 0 0 0-1.8 0l-3.65 1.83A1 1 0 0 1 3 19.38V6.62a1 1 0 0 1 .55-.9L8.1 3.45a2 2 0 0 1 1.8 0z', 'M15 5.76v15', 'M9 3.24v15'],
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  truck: ['M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', 'M15 18H9', 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14',
    'M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  userCircle: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M7 20.66V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.66'],
  badgeCheck: ['M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z', 'm9 12 2 2 4-4'],
  sheet: ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M3 9h18', 'M3 15h18', 'M9 9v12'],
  calClock: ['M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5', 'M16 2v4', 'M8 2v4', 'M3 10h5', 'M16 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M16 14v2.2l1.5 1.3'],
  calDays: ['M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M8 2v4', 'M16 2v4', 'M3 10h18', 'M8 14h.01', 'M12 14h.01', 'M16 14h.01', 'M8 18h.01', 'M12 18h.01', 'M16 18h.01'],
  package: ['M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z', 'M12 22V12', 'm3.3 7 8.7 5 8.7-5', 'm7.5 4.27 9 5.15'],
  megaphone2: ['m3 11 18-5v12L3 14v-3z', 'M11.6 16.8a3 3 0 1 1-5.8-1.6'],
  headset2: ['M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z', 'M21 16v2a4 4 0 0 1-4 4h-5'],
  phoneCall: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
    'M14.05 2a9 9 0 0 1 8 7.94', 'M14.05 6A5 5 0 0 1 18 10'],
  barChart: ['M3 3v16a2 2 0 0 0 2 2h16', 'M18 17V9', 'M13 17V5', 'M8 17v-3'],
  keyRound: ['M2.59 17.41A2 2 0 0 0 2 18.83V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.17a2 2 0 0 0 1.42-.59l.81-.81a6.5 6.5 0 1 0-4-4z', 'M16.5 7.5h.01'],
  sliders: ['M20 7h-9', 'M14 17H5', 'M17 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  refreshCw: ['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16', 'M8 16H3v5'],
  scrollText: ['M15 12h-5', 'M15 8h-5', 'M19 17V5a2 2 0 0 0-2-2H4', 'M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3'],
  bookOpen: ['M12 7v14', 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'],
  smartphone: ['M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z', 'M12 18h.01'],
  userCog: ['M10 15H6a4 4 0 0 0-4 4v2', 'M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M18 13.5V15', 'M18 21v1.5', 'M21.5 16l-1.3.75', 'M15.8 19.25l-1.3.75', 'M21.5 20l-1.3-.75', 'M15.8 16.75 14.5 16'],
  building2: ['M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18z', 'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2', 'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2', 'M10 6h4', 'M10 10h4', 'M10 14h4', 'M10 18h4'],
};
const icon = (name, cls = '') => {
  const d = ICONS[name] || '';
  const paths = Array.isArray(d) ? d : [d];
  return `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths.map((p) => `<path d="${p}"/>`).join('')}</svg>`;
};
const LOGO = '<img src="/brand.png?v=2" alt="An Thịnh" width="40" height="40" decoding="async">';

// ---------- Định dạng ----------
const pad = (n) => String(n).padStart(2, '0');
// Ngày giờ hiển thị luôn dd/mm/yyyy và HH:mm (24 giờ) theo giờ Việt Nam, không theo ngôn ngữ trình duyệt.
// DB lưu chuỗi giờ VN 'YYYY-MM-DD HH:MM:SS'; chuỗi có múi giờ (Z, +07:00) / Date / số ms được đổi sang giờ VN.
const VN_TZ = 'Asia/Ho_Chi_Minh';
let _vnFmt = null;
function vnDateStr(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  try {
    _vnFmt = _vnFmt || new Intl.DateTimeFormat('en-GB', { timeZone: VN_TZ, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    const p = {};
    _vnFmt.formatToParts(dt).forEach((x) => { p[x.type] = x.value; });
    return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`;
  } catch {
    return localNow(dt);
  }
}
function vnStr(v) {
  if (v === null || v === undefined || v === '') return '';
  if (v instanceof Date || typeof v === 'number') return vnDateStr(v);
  const s = String(v).trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(s)) return null;
  if (/[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/i.test(s)) return vnDateStr(s);
  return s.replace('T', ' ');
}
/** → 'dd/mm/yyyy'. */
function fmtDate(v, empty = '—') {
  const s = vnStr(v);
  if (s === null) return String(v);
  return s ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : empty;
}
/** → 'dd/mm/yyyy HH:mm' (chỉ có ngày thì 'dd/mm/yyyy'). */
function fmtDateTime(v, empty = '—') {
  const s = vnStr(v);
  if (s === null) return String(v);
  if (!s) return empty;
  const t = s.slice(11, 16);
  return `${fmtDate(s)}${/^\d{2}:\d{2}$/.test(t) ? ` ${t}` : ''}`;
}
const fmtDT = (s) => fmtDateTime(s);
const fmtD = (s) => fmtDate(s);
const fmtTime = (s) => { const v = vnStr(s); return v ? v.slice(11, 16) : ''; };
/** 'dd/mm/yyyy' (cho phép d/m/yyyy) → 'YYYY-MM-DD' hoặc '' nếu sai. */
function parseDmy(s) {
  const m = String(s || '').trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (!m) return '';
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (y < 1900 || y > 2100 || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return '';
  return `${y}-${pad(mo)}-${pad(d)}`;
}
const NF = new Intl.NumberFormat('vi-VN', { useGrouping: false });
// Tiền: có dấu phân cách hàng nghìn (8.350.000 ₫)
const MONEY_NF = new Intl.NumberFormat('vi-VN');
const money = (n) => `${MONEY_NF.format(Math.round(n || 0))} ₫`;
/** Tiền gọn cho thẻ số liệu: 3,43 tỷ ₫ / 125,4 tr ₫; dưới 1 triệu giữ nguyên. */
const moneyShort = (n) => {
  const v = Math.round(n || 0);
  const a = Math.abs(v);
  if (a >= 1e9) return `${numf(v / 1e9, 2)} tỷ ₫`;
  if (a >= 1e6) return `${numf(v / 1e6, 1)} tr ₫`;
  return money(v);
};
const numf = (n, digits = 0) => (n === null || n === undefined || Number.isNaN(Number(n)) ? '—'
  : new Intl.NumberFormat('vi-VN', { useGrouping: false, maximumFractionDigits: digits }).format(n));
const pct = (a, b) => (b ? `${numf((a / b) * 100, 1)}%` : '—');
function localNow(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
const today = () => (vnDateStr(new Date()) || localNow()).slice(0, 10);
function addDays(ds, n) {
  const d = new Date(`${ds}T00:00:00`);
  d.setDate(d.getDate() + n);
  return localNow(d).slice(0, 10);
}
const toInputDT = (s) => (s ? String(s).slice(0, 16).replace(' ', 'T') : '');
const parseDT = (s) => new Date(String(s).replace(' ', 'T'));
function durationText(hours) {
  if (hours === null || hours === undefined || Number.isNaN(hours)) return '—';
  const h = Math.abs(hours);
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} phút`;
  if (h < 48) return `${numf(h, 1)} giờ`;
  return `${Math.round(h / 24)} ngày`;
}
const initials = (name) => String(name || '?').trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase();
const VN_WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
function weekdayLabel(ds) {
  const d = String(ds || '').slice(0, 10);
  return `${VN_WEEKDAYS[new Date(`${d}T00:00:00Z`).getUTCDay()] || ''}, ${fmtDate(d)}`;
}
// ---------- Nhãn & huy hiệu ----------
const badgeOf = (dict, key) => {
  const x = dict[key];
  return x ? `<span class="badge b-${x.color}">${esc(x.label)}</span>` : esc(key);
};
// "Chờ GSM / khách xác nhận" ghi rõ theo nguồn phiếu (có truyền source)
const APPROVAL_BY_SOURCE = { gsm: 'Chờ GSM xác nhận', bship: 'Chờ BShip xác nhận', retail: 'Chờ khách xác nhận' };
const statusBadge = (s, source) => {
  const key = (S.meta.legacy_wo_statuses || {})[s] || s;
  const x = S.meta.wo_statuses[key];
  if (x && key === 'waiting_approval' && APPROVAL_BY_SOURCE[source]) return `<span class="badge b-${x.color}">${esc(APPROVAL_BY_SOURCE[source])}</span>`;
  return badgeOf(S.meta.wo_statuses, key);
};
const apptBadge = (s) => badgeOf(S.meta.appt_statuses, s);
const careBadge = (s) => badgeOf(S.meta.care_statuses, s);
/** 3 ô thông tin bảo hiểm (không bắt buộc) — hiện khi Loại dịch vụ = Bảo hiểm. */
const insuranceFields = (ins = {}, hidden = true) => `<div class="form-grid cols-3 ins-fields" style="margin-top:14px"${hidden ? ' hidden' : ''}>
  ${field('Công ty bảo hiểm', input('ins_company', ins.company || '', 'placeholder="VD: Bảo Việt, PVI…"'))}
  ${field('Số hồ sơ bồi thường', input('ins_claim_no', ins.claim_no || '', ''))}
  ${field('Giám định viên', input('ins_adjuster', ins.adjuster || '', 'placeholder="Tên – SĐT"'))}
</div>`;
const svcLabel = (k) => S.meta.service_types[k] || k || '—';
const plateHtml = (p) => (p ? `<span class="plate">${esc(p)}</span>` : '<span class="muted small">Chưa có biển</span>');
const roleLabel = (r) => (S.meta.roles[r] ? S.meta.roles[r].label : (r === 'qc' ? 'Tổ trưởng / QC' : r));
const customerTypeLabel = (t) => (S.meta.customer_types && S.meta.customer_types[t]) || ({ individual: 'Cá nhân', business: 'Doanh nghiệp', fleet: 'Doanh nghiệp' }[t] || t || '—');
const isBusinessCustomer = (t) => t === 'business' || t === 'fleet';
const customerTypeBadge = (t) => {
  if (!t) return '';
  const biz = isBusinessCustomer(t);
  return `<span class="badge ${biz ? 'b-blue' : 'b-slate'} plain">${esc(customerTypeLabel(t))}</span>${t === 'fleet' ? ' <span class="badge b-violet plain">GSM</span>' : ''}`;
};
const branchName = (id) => { const b = S.meta.branches.find((x) => x.id === Number(id)); return b ? b.name : '—'; };
function warrantyHtml(until) {
  if (!until) return '<span class="warranty-no">Chưa có thông tin</span>';
  return until >= today() ? `<span class="warranty-ok">Còn BH đến ${fmtD(until)}</span>` : `<span class="warranty-no">Hết BH (${fmtD(until)})</span>`;
}
const starsView = (n) => (n ? `<span class="stars-view" title="${n}/5">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>` : '—');
/** Số điện thoại bấm để gọi; ref = { e: loại đối tượng, id, name } → ghi lịch sử cuộc gọi (ai gọi, lúc nào). */
const telLink = (p, ref = {}, cls = '') => (p ? `<a href="tel:${esc(String(p).replace(/[^\d+]/g, ''))}"${cls ? ` class="${cls}"` : ''}${ref.e ? ` data-call-e="${esc(ref.e)}" data-call-id="${esc(ref.id || '')}"` : ''}${ref.name ? ` data-call-name="${esc(ref.name)}"` : ''}>${esc(p)}</a>` : '—');
/* Âm báo tự soạn (WebAudio, không cần file): mỗi nốt = cơ bản + họa âm theo nhạc cụ, tắt dần; kalimba/marimba có vang nhẹ.
   Trình duyệt chỉ cho phát sau khi người dùng đã chạm / bấm vào trang. */
const SFX = (() => {
  let ctx = null;
  let wet = null;
  let dry = null;
  const ac = () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor();
      comp.connect(ctx.destination);
      dry = ctx.createGain();
      dry.gain.value = 0.9;
      dry.connect(comp);
      wet = ctx.createGain();
      wet.gain.value = 0.9;
      wet.connect(comp);
      const echo = ctx.createDelay(1);
      echo.delayTime.value = 0.19;
      const fb = ctx.createGain();
      fb.gain.value = 0.28;
      const send = ctx.createGain();
      send.gain.value = 0.22;
      wet.connect(echo);
      echo.connect(fb).connect(echo);
      echo.connect(send).connect(comp);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  };
  // p: [tỉ lệ tần số, biên độ, hệ số thời gian ngân]; flat = giữ đều rồi tắt (tiếng tút tổng đài)
  const INS = {
    kalimba: { p: [[1, 1, 1], [5.9, 0.18, 0.15], [2, 0.05, 0.5]], type: 'sine', atk: 0.003, bus: 'wet' },
    marimba: { p: [[1, 1, 1], [3.93, 0.28, 0.18], [9.2, 0.06, 0.06]], type: 'sine', atk: 0.004, bus: 'wet' },
    tone: { p: [[1, 1, 1]], type: 'sine', atk: 0.02, bus: 'dry', flat: true },
  };
  const voice = (ins, f, at, dur, vol) => {
    const c = ac();
    const I = INS[ins];
    const t = c.currentTime + at;
    for (const [r, a, d] of I.p) {
      const o = c.createOscillator();
      const g = c.createGain();
      const end = t + dur * d;
      o.type = I.type;
      o.frequency.value = f * r;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol * a, t + I.atk);
      if (I.flat) {
        g.gain.setValueAtTime(vol * a, end - 0.03);
        g.gain.linearRampToValueAtTime(0.0001, end);
      } else g.gain.exponentialRampToValueAtTime(0.0001, end);
      o.connect(g).connect(I.bus === 'wet' ? wet : dry);
      o.start(t);
      o.stop(end + 0.05);
    }
  };
  // notes: [tần số, lúc bắt đầu (giây), thời gian ngân]
  const play = (ins, notes, vol) => {
    try { notes.forEach(([f, at, dur]) => voice(ins, f, at, dur, vol)); } catch { /* không có âm thanh */ }
  };
  // Son5 Đô6 Mi6 Son6 | Mi6 Đô6 Rê6 Mi6 | Son5 Đô6 Mi6 La6 | Son6 Mi6 Rê6 Đô6 – mỗi nốt 0,14 giây
  const RING = [784, 1047, 1319, 1568, 1319, 1047, 1175, 1319, 784, 1047, 1319, 1760, 1568, 1319, 1175, 1047];
  return {
    /** Tin nhắn mới: kalimba 2 nốt gảy mềm (La5 → Mi6). */
    message: () => play('kalimba', [[880, 0, 1], [1319, 0.11, 1.1]], 0.22),
    /** Cuộc gọi đến (~2,3 giây, gọi lặp mỗi 3 giây): marimba 16 nốt rộn ràng, nốt cuối ngân. */
    ring: () => play('marimba', RING.map((f, i) => [f, i * 0.14, i === RING.length - 1 ? 0.9 : 0.45]), 0.22),
    /** Đang gọi đi chờ bắt máy: tút 425 Hz dài 1 giây như tổng đài (gọi lặp mỗi 4 giây). */
    ringback: () => play('tone', [[425, 0, 1]], 0.12),
  };
})();
/** Nút gọi tròn (cùng thẻ a tel: nên vẫn ghi lịch sử cuộc gọi như telLink). */
const telBtn = (p, ref = {}) => (p ? `<a class="tel-btn" href="tel:${esc(String(p).replace(/[^\d+]/g, ''))}"${ref.e ? ` data-call-e="${esc(ref.e)}" data-call-id="${esc(ref.id || '')}"` : ''}${ref.name ? ` data-call-name="${esc(ref.name)}"` : ''} title="Gọi ${esc(p)}" aria-label="Gọi ${esc(p)}">${icon('phone')}</a>` : '');
/** Nút nhắn SMS tròn (mở ứng dụng tin nhắn của điện thoại với sẵn số). */
const smsBtn = (p) => (p ? `<a class="tel-btn sms-btn" href="sms:${esc(String(p).replace(/[^\d+]/g, ''))}" title="Nhắn tin ${esc(p)}" aria-label="Nhắn tin ${esc(p)}">${icon('message')}</a>` : '');
/** Số điện thoại bấm để sao chép (đi kèm telBtn để gọi). */
const telCopy = (p) => (p ? `<button type="button" class="tel-copy" data-copy-tel="${esc(String(p).replace(/[^\d+]/g, ''))}" title="Bấm để sao chép số">${esc(p)}</button>` : '');
async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* trình duyệt chặn → cách cũ */ }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  ta.remove();
  return ok;
}
document.addEventListener('click', async (e) => {
  const b = e.target.closest && e.target.closest('[data-copy-tel]');
  if (!b) return;
  e.preventDefault();
  const num = b.dataset.copyTel;
  if (await copyToClipboard(num)) {
    b.classList.add('copied');
    setTimeout(() => b.classList.remove('copied'), 1400);
    toast(`Đã sao chép số ${num}`, 'success');
  } else toast(num, 'info');
});
const safeUrl = (u) => (/^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '#');
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[href^="tel:"]');
  if (!a || !S.me) return;
  const body = { phone: a.getAttribute('href').slice(4), entity: a.dataset.callE || null, entity_id: a.dataset.callId || null, name: a.dataset.callName || null };
  try {
    fetch('/api/calls', { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) }).catch(() => {});
  } catch { /* ignore */ }
}, true);
const emptyRow = (cols, text = 'Không có dữ liệu') => `<tr><td colspan="${cols}"><div class="empty">${icon('list')}<div>${esc(text)}</div></div></td></tr>`;

function qs(obj) {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '' && v !== false) p.set(k, v); });
  const s = p.toString();
  return s ? `?${s}` : '';
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
let onUnauthorized = () => {};
/** signal: hủy yêu cầu cũ khi người dùng đã chuyển trang / đổi bộ lọc (lỗi trả về có err.aborted). */
async function api(method, url, body, { timeoutMs = 15000, signal, cache } = {}) {
  const httpKey = method === 'GET' ? httpCachedKey(url) : null;
  const opt = { method, headers: { Accept: 'application/json' }, credentials: 'same-origin',
    cache: cache || (httpKey ? (_httpBust.has(httpKey) ? 'reload' : 'default') : 'no-store') };
  // Tránh treo boot splash nếu /api/me|meta không bao giờ trả lời
  let timedOut = false;
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => { timedOut = true; ctrl.abort(); }, timeoutMs) : null;
  const onAbort = () => { if (ctrl) ctrl.abort(); };
  if (signal) {
    if (signal.aborted) onAbort();
    else signal.addEventListener('abort', onAbort, { once: true });
  }
  if (ctrl) opt.signal = ctrl.signal;
  if (method !== 'GET') {
    opt.headers['Content-Type'] = 'application/json';
    opt.body = JSON.stringify(body || {});
  }
  let res;
  try {
    res = await fetch(url, opt);
  } catch (e) {
    if (e && (e.name === 'TimeoutError' || e.name === 'AbortError')) {
      if (!timedOut && signal && signal.aborted) {
        const err = new Error('Đã hủy');
        err.aborted = true;
        throw err;
      }
      throw new Error('Máy chủ phản hồi quá chậm. Vui lòng thử lại.');
    }
    throw new Error('Không kết nối được máy chủ. Kiểm tra mạng và thử lại.');
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener('abort', onAbort);
  }
  let data = null;
  try { data = await res.json(); } catch { /* ignore */ }
  if (!res.ok) {
    const err = new Error((data && data.error) || `Lỗi ${res.status}`);
    err.status = res.status;
    if (res.status === 401 && S.me) onUnauthorized();
    throw err;
  }
  if (httpKey) _httpBust.delete(httpKey);
  if (method !== 'GET') apiMutated(url);
  return data;
}

// /api/meta, /api/staff: máy chủ trả `private, max-age=300` + ETag → để trình duyệt giữ/304.
// Sau khi quản trị sửa tài khoản / cơ sở / cấu hình thì lần lấy kế tiếp bỏ qua bộ đệm (cache: 'reload').
const _httpBust = new Set();
function httpCachedKey(url) {
  const m = /^\/api\/(meta|staff)(?:\?|$)/.exec(String(url));
  return m ? m[1] : null;
}

// ----- Bộ đệm GET ngắn hạn (nhân viên, cảnh báo, tổng hợp BH): không gọi lại mỗi lần đổi trang/lọc -----
const _apiCache = new Map();
function apiMutated(url) {
  S.mutations++;
  // Đổi người đăng nhập cũng phải lấy mới: danh sách nhân viên lọc theo cơ sở của tài khoản
  if (/^\/api\/(admin\/(users|branches|settings|catalog|roles)|auth\/)/.test(String(url))) { _httpBust.add('meta'); _httpBust.add('staff'); }
  _apiCache.forEach((v, k) => { if (!v.dropOn || v.dropOn.test(url)) _apiCache.delete(k); });
}
/** ttlMs: thời gian giữ; dropOn: chỉ xóa khi ghi vào URL khớp (mặc định: mọi lần ghi). */
function cachedApi(url, { ttlMs = 60e3, dropOn = null, force = false } = {}) {
  const hit = _apiCache.get(url);
  if (!force && hit && Date.now() - hit.at < ttlMs) return hit.p;
  const p = api('GET', url, null, force ? { cache: 'reload' } : {});
  const entry = { at: Date.now(), p, dropOn };
  _apiCache.set(url, entry);
  p.catch(() => { if (_apiCache.get(url) === entry) _apiCache.delete(url); });
  return p;
}
/** KTV / quản đốc (mọi cơ sở trong phạm vi tài khoản) – tải 1 lần mỗi phiên, lọc cơ sở phía trình duyệt. */
const STAFF_ROLES = 'technician,manager,center_manager';
async function staffList(branchId, { force = false } = {}) {
  const rows = await cachedApi(`/api/staff${qs({ roles: STAFF_ROLES })}`, { ttlMs: 10 * 60e3, dropOn: /\/api\/(users|staff|branches|admin)/, force });
  return branchId ? rows.filter((u) => String(u.branch_id) === String(branchId)) : rows.slice();
}

// ---------------------------------------------------------------------------
// Bắt sự kiện theo data-* (không dùng inline handler vì CSP)
// ---------------------------------------------------------------------------
// page: trang chính (danh sách…) · drawer: trang mở trong bảng trượt – tách riêng để đóng bảng trượt
// không làm mất nút bấm của danh sách phía sau
const emptyHandlers = () => ({ click: {}, submit: {}, change: {}, input: {} });
const H = { page: emptyHandlers(), drawer: emptyHandlers(), global: emptyHandlers(), layer: 'page' };
let currentModal = null;
const modalStack = [];
const on = (type, name, fn) => { H[H.layer][type][name] = fn; };
const onGlobal = (type, name, fn) => { H.global[type][name] = fn; };
const resetPageHandlers = () => { H.page = emptyHandlers(); };
const resetDrawerHandlers = () => { H.drawer = emptyHandlers(); };
const setHandlerLayer = (layer) => { H.layer = layer === 'drawer' ? 'drawer' : 'page'; };
const drawerIsOpen = () => { const d = document.getElementById('drawer'); return !!(d && !d.classList.contains('hidden')); };

function findHandler(type, el, name) {
  if (el.closest('.modal-backdrop') && currentModal && currentModal.handlers[type] && currentModal.handlers[type][name]) {
    return currentModal.handlers[type][name];
  }
  return (drawerIsOpen() && H.drawer[type][name]) || H.page[type][name] || H.global[type][name];
}
const runSafe = (fn, ...args) => Promise.resolve().then(() => fn(...args)).catch((e) => toast(e.message, 'error'));

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-click]');
  // Đóng menu tài khoản khi click ngoài (kể cả dropdown đã portal ra body)
  if (!e.target.closest('.dropdown, [data-click="user-menu"], .user-wrap')) {
    if (typeof closeUserMenu === 'function') closeUserMenu();
    else $$('.dropdown').forEach((d) => d.classList.add('hidden'));
  }
  if (!el) return;
  // Phần tử tương tác nằm trong hàng có data-click (VD: link trong dòng bảng) giữ hành vi mặc định
  const inner = e.target.closest('a, button, input, select, textarea, label');
  if (inner && inner !== el && el.contains(inner)) return;
  const fn = findHandler('click', el, el.dataset.click);
  if (!fn) return;
  e.preventDefault();
  runSafe(fn, el, e);
});

document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-submit]');
  if (!form) return;
  e.preventDefault();
  const fn = findHandler('submit', form, form.dataset.submit);
  if (!fn) return;
  const buttons = $$('button[type="submit"]', form);
  buttons.forEach((b) => { b.disabled = true; });
  Promise.resolve().then(() => fn(form, formData(form), e))
    .catch((err) => toast(err.message, 'error'))
    .finally(() => buttons.forEach((b) => { b.disabled = false; }));
});

document.addEventListener('invalid', (e) => {
  const el = e.target;
  if (!el || !el.validity) return;
  let msg = '';
  if (el.validity.valueMissing) msg = el.dataset.viRequired || 'Vui lòng nhập thông tin này';
  else if (el.validity.badInput || el.validity.stepMismatch || el.validity.rangeUnderflow || el.validity.rangeOverflow) {
    msg = el.dataset.viNumber || 'Vui lòng nhập số hợp lệ';
  } else if (el.validity.typeMismatch) msg = el.dataset.viType || 'Giá trị không đúng định dạng';
  if (msg) el.setCustomValidity(msg);
}, true);

document.addEventListener('input', (e) => {
  const el = e.target;
  if (el && typeof el.setCustomValidity === 'function') el.setCustomValidity('');
}, true);

document.addEventListener('change', (e) => {
  const el = e.target.closest('[data-change]');
  if (!el) return;
  const fn = findHandler('change', el, el.dataset.change);
  if (fn) runSafe(fn, el, e);
});

const debounceTimers = new WeakMap();
document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-input]');
  if (!el) return;
  const fn = findHandler('input', el, el.dataset.input);
  if (!fn) return;
  if (el.dataset.debounce) {
    clearTimeout(debounceTimers.get(el));
    debounceTimers.set(el, setTimeout(() => runSafe(fn, el, e), Number(el.dataset.debounce) || 300));
  } else runSafe(fn, el, e);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('print-preview')) { closePrintPreview(); e.preventDefault(); e.stopImmediatePropagation(); return; }
  if (e.key === 'Escape' && currentModal && !e.defaultPrevented) {
    e.preventDefault();
    e.stopImmediatePropagation();
    closeModalAsk();
    return;
  }
  if (e.key === 'Tab') trapFocus(e);
  if (e.key === 'Enter' && e.target.matches('[data-noenter]')) e.preventDefault();
  // Dòng bảng bấm được: Enter / Space như bấm chuột
  if ((e.key === 'Enter' || e.key === ' ') && !e.defaultPrevented && e.target.matches && e.target.matches('tr[data-click]')) {
    e.preventDefault();
    e.target.click();
  }
});
// Dòng bảng có data-click nhận được focus bằng Tab
new MutationObserver((muts) => {
  for (const m of muts) {
    for (const n of m.addedNodes) {
      if (n.nodeType !== 1) continue;
      if (n.matches('tr[data-click]:not([tabindex])')) n.tabIndex = 0;
      n.querySelectorAll('tr[data-click]:not([tabindex])').forEach((tr) => { tr.tabIndex = 0; });
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });

// ---------------------------------------------------------------------------
// Xem trước & in ngay trong app (iframe about:blank cùng origin) – không mở cửa sổ trình duyệt mới.
// iframe about:blank không chịu X-Frame-Options / frame-ancestors; script mẫu in phải là src tuyệt đối cùng origin.
// ---------------------------------------------------------------------------
const PP_IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function closePrintPreview() {
  const ov = document.getElementById('print-preview');
  if (ov) ov.remove();
  const fb = document.getElementById('print-fallback');
  if (fb) fb.remove();
  document.documentElement.classList.remove('pp-fallback');
  if (!document.getElementById('print-preview') && !currentModal) document.body.classList.remove('modal-open');
}

/** In bằng cửa sổ chính: chép nội dung phiếu vào khung chỉ hiện khi in (iOS / khi in iframe lỗi). */
function printViaMainWindow(doc) {
  let box = document.getElementById('print-fallback');
  if (!box) { box = document.createElement('div'); box.id = 'print-fallback'; document.body.appendChild(box); }
  box.innerHTML = [...doc.querySelectorAll('style, link[rel="stylesheet"]')].map((n) => n.outerHTML).join('') + doc.body.innerHTML;
  document.documentElement.classList.add('pp-fallback');
  const done = () => {
    window.removeEventListener('afterprint', done);
    document.documentElement.classList.remove('pp-fallback');
    box.remove();
  };
  window.addEventListener('afterprint', done);
  window.print();
}

/**
 * Mở lớp "Xem trước phiếu in" với tài liệu html (đầy đủ <html>), gọi apply(win) sau khi nạp xong.
 * readyFlag: tên biến window trong mẫu báo đã sẵn sàng. autoPrint: tự mở hộp thoại in.
 */
async function openPrintPreview({ html, title = 'Xem trước phiếu in', apply, readyFlag = '', autoPrint = false } = {}) {
  closePrintPreview();
  const ov = document.createElement('div');
  ov.id = 'print-preview';
  ov.className = 'pp-backdrop';
  ov.innerHTML = `<div class="pp-box" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="pp-head"><h3>${esc(title)}</h3>
        <button type="button" class="btn btn-primary btn-sm" data-pp="print" disabled>${icon('printer')} In</button>
        <button type="button" class="btn btn-sm" data-pp="close">Đóng</button></div>
      <div class="pp-body"><iframe class="pp-frame" title="${esc(title)}"></iframe></div>
    </div>`;
  document.body.appendChild(ov);
  document.body.classList.add('modal-open');
  const frame = ov.querySelector('iframe');
  const btn = ov.querySelector('[data-pp="print"]');
  const doPrint = () => {
    const doc = frame.contentDocument;
    if (PP_IOS) { printViaMainWindow(doc); return; }
    try {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } catch {
      printViaMainWindow(doc);
    }
  };
  let ppDownOnBg = false;
  ov.addEventListener('pointerdown', (e) => { ppDownOnBg = e.target === ov; });
  ov.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pp]');
    if (b && b.dataset.pp === 'close') closePrintPreview();
    else if (b && b.dataset.pp === 'print') doPrint();
    else if (e.target === ov && ppDownOnBg) closePrintPreview();
    ppDownOnBg = false;
  });

  const src = String(html)
    .replace(/(src|href)=(["'])\/(?!\/)/g, `$1=$2${location.origin}/`);
  const doc0 = frame.contentDocument;
  doc0.open();
  doc0.write(src);
  doc0.close();
  const win = frame.contentWindow;
  const t0 = Date.now();
  await new Promise((resolve) => {
    const tick = () => {
      const d = frame.contentDocument;
      if ((d && d.readyState === 'complete' && (!readyFlag || win[readyFlag])) || Date.now() - t0 > 5000) resolve();
      else setTimeout(tick, 40);
    };
    tick();
  });
  if (!document.body.contains(frame)) return;
  if (typeof apply === 'function') apply(win);
  const doc = frame.contentDocument;
  try { await doc.fonts.ready; } catch { /* ignore */ }
  await Promise.all([...doc.images].map((img) => (img.complete ? null
    : new Promise((r) => { img.addEventListener('load', r); img.addEventListener('error', r); setTimeout(r, 4000); }))));
  if (!document.body.contains(frame)) return;
  btn.disabled = false;
  if (autoPrint) setTimeout(doPrint, 120);
}

function formData(form) {
  const o = {};
  for (const el of form.elements) {
    if (!el.name || el.disabled) continue;
    if (el.type === 'checkbox') o[el.name] = el.checked;
    else if (el.type === 'radio') { if (el.checked) o[el.name] = el.value; } else if (el.hasAttribute('data-money')) o[el.name] = el.value.replace(/\D+/g, '');
    else o[el.name] = el.value;
  }
  return o;
}

// ---------------------------------------------------------------------------
// Modal, hộp xác nhận, thông báo
// ---------------------------------------------------------------------------
function runModalOnClose(m) {
  if (!m || !m.onClose) return;
  const fn = m.onClose;
  m.onClose = null;
  try { fn(); } catch { /* ignore */ }
}
function openModal({ title, body, size = '', handlers = {}, stack = false, backdropClass = '', onClose = null } = {}) {
  const root = $('#modal-root');
  let returnFocus = document.activeElement;
  if (currentModal && stack) {
    modalStack.push(currentModal);
  } else if (currentModal) {
    returnFocus = (modalStack[0] || currentModal).returnFocus;
    [...modalStack, currentModal].forEach(runModalOnClose);
    modalStack.length = 0;
    root.innerHTML = '';
    currentModal = null;
  }
  const backdrop = document.createElement('div');
  backdrop.className = `modal-backdrop${backdropClass ? ` ${backdropClass}` : ''}`;
  backdrop.innerHTML = `<div class="modal ${size}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="modal-head"><h3>${esc(title)}</h3><button type="button" class="btn btn-ghost btn-icon btn-sm" data-click="modal-close" aria-label="Đóng">${icon('x')}</button></div>
    ${body}</div>`;
  root.appendChild(backdrop);
  currentModal = { handlers: { click: {}, submit: {}, change: {}, input: {}, ...handlers }, el: backdrop, onClose, returnFocus };
  document.body.classList.add('modal-open');
  // click (không mousedown): iOS/touch không “dính” khi kéo scroll modal.
  // Chỉ đóng khi nhấn cũng ở nền: bôi đen chữ trong ô rồi kéo thả ra ngoài không được tính là bấm nền
  let downOnBackdrop = false;
  backdrop.addEventListener('pointerdown', (e) => { downOnBackdrop = e.target === backdrop; });
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop && downOnBackdrop) closeModalAsk();
    downOnBackdrop = false;
  });
  const first = backdrop.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([readonly]), select, textarea');
  // Mobile: không auto-focus (mở bàn phím đè modal / lệch viewport iOS)
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    || (navigator.maxTouchPoints || 0) > 0;
  if (first && !isTouch) setTimeout(() => first.focus(), 30);
  requestAnimationFrame(() => {
    try {
      if (typeof enableTableColResize === 'function') enableTableColResize(backdrop);
    } catch { /* ignore */ }
  });
  const opened = currentModal;
  setTimeout(() => { if (opened.el.isConnected) opened.snap = modalFormState(backdrop); }, 400);
  return backdrop;
}
function closeModal() {
  stopScanStream();
  const closing = currentModal;
  const root = $('#modal-root');
  const top = root.lastElementChild;
  if (top) top.remove();
  const prev = modalStack.pop();
  const focusBack = closing && closing.returnFocus;
  if (prev && document.body.contains(prev.el)) {
    currentModal = prev;
    runModalOnClose(closing);
    if (focusBack && document.body.contains(focusBack)) try { focusBack.focus({ preventScroll: true }); } catch { /* ignore */ }
    return;
  }
  modalStack.length = 0;
  root.innerHTML = '';
  currentModal = null;
  document.body.classList.remove('modal-open');
  runModalOnClose(closing);
  if (focusBack && focusBack !== document.body && document.body.contains(focusBack)) try { focusBack.focus({ preventScroll: true }); } catch { /* ignore */ }
}
onGlobal('click', 'modal-close', () => closeModal());

function modalFormState(el) {
  return [...el.querySelectorAll('form input[name], form select[name], form textarea[name]')]
    .filter((f) => f.type !== 'hidden' && f.type !== 'file')
    .map((f) => (f.type === 'checkbox' || f.type === 'radio' ? (f.checked ? 1 : 0) : f.value)).join('\u0001');
}
/** Esc / bấm ra ngoài: hỏi lại nếu form đang nhập dở (so với lúc mở). */
function closeModalAsk() {
  if (!currentModal) return;
  const m = currentModal;
  if (m.snap !== undefined && modalFormState(m.el) !== m.snap && !window.confirm('Bỏ các thông tin đang nhập?')) return;
  closeModal();
}
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
/** Tab / Shift+Tab chỉ chạy trong hộp thoại (hoặc bảng trượt) đang mở. */
function trapFocus(e) {
  const box = currentModal ? currentModal.el.querySelector('.modal')
    : (document.body.classList.contains('drawer-open') ? document.getElementById('drawer') : null);
  if (!box) return;
  const items = [...box.querySelectorAll(FOCUSABLE)].filter((x) => x.offsetParent !== null || x === document.activeElement);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (!box.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

// ---------------------------------------------------------------------------
// Bàn phím ảo (iOS/Android): modal co theo visualViewport, ô đang nhập luôn nằm trên bàn phím
// ---------------------------------------------------------------------------
const TEXT_ENTRY_SEL = 'input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=button]):not([type=submit]):not([type=reset]):not([type=color]):not([type=hidden]):not([readonly]), textarea:not([readonly]), select, [contenteditable="true"]';
const isTextEntry = (el) => !!(el && el.matches && el.matches(TEXT_ENTRY_SEL));
const isTouchUi = () => window.matchMedia('(hover: none), (pointer: coarse)').matches || (navigator.maxTouchPoints || 0) > 0;

const _vvBase = { w: 0, h: 0 };
// Giá trị đã ghi lần trước: chỉ ghi lại biến CSS khi thật sự đổi (ghi biến gốc = tính lại style cả trang)
const _vvLast = { vvh: '', top: '', kb: null };
function syncVisualViewportVars() {
  const vv = window.visualViewport;
  const root = document.documentElement;
  if (!vv || vv.scale > 1.05) {
    if (_vvLast.vvh || _vvLast.top || _vvLast.kb) {
      root.style.removeProperty('--vvh');
      root.style.removeProperty('--vv-top');
      root.classList.remove('kb-open');
      _vvLast.vvh = ''; _vvLast.top = ''; _vvLast.kb = false;
    }
    return;
  }
  // Chiều cao "không bàn phím" theo từng chiều rộng (xoay màn hình thì đo lại)
  const w = Math.round(window.innerWidth);
  if (w !== _vvBase.w) { _vvBase.w = w; _vvBase.h = 0; }
  _vvBase.h = Math.max(_vvBase.h, Math.round(window.innerHeight), Math.round(vv.height));
  const vvh = `${Math.round(vv.height)}px`;
  const top = `${Math.max(0, Math.round(vv.offsetTop))}px`;
  const kb = _vvBase.h - vv.height > 120 && isTextEntry(document.activeElement);
  if (vvh !== _vvLast.vvh) { root.style.setProperty('--vvh', vvh); _vvLast.vvh = vvh; }
  if (top !== _vvLast.top) { root.style.setProperty('--vv-top', top); _vvLast.top = top; }
  if (kb !== _vvLast.kb) { root.classList.toggle('kb-open', kb); _vvLast.kb = kb; }
}

/** Cuộn các khung cuộn chứa ô đang focus để ô nằm trong vùng nhìn thấy (trên bàn phím). */
function ensureFieldVisible(el) {
  if (!el || !el.isConnected || document.activeElement !== el) return;
  const vv = window.visualViewport;
  const visTop = vv ? vv.offsetTop : 0;
  const visBottom = vv ? vv.offsetTop + vv.height : window.innerHeight;
  const margin = 16;
  for (let node = el.parentElement; node && node !== document.documentElement; node = node.parentElement) {
    if (node.scrollHeight <= node.clientHeight + 1) continue;
    const oy = getComputedStyle(node).overflowY;
    if (oy !== 'auto' && oy !== 'scroll') continue;
    const r = el.getBoundingClientRect();
    const cr = node.getBoundingClientRect();
    const top = Math.max(cr.top, visTop) + margin;
    const bottom = Math.min(cr.bottom, visBottom) - margin;
    if (bottom - top < 40) continue;
    let delta = 0;
    if (r.bottom > bottom) delta = Math.min(r.bottom - bottom, r.top - top);
    else if (r.top < top) delta = r.top - top;
    if (Math.abs(delta) > 1) node.scrollTop += delta;
  }
}

(function installKeyboardAvoidance() {
  try {
    syncVisualViewportVars();
    let focusTimers = [];
    let vvTimer = null;
    let raf = 0;
    const syncSoon = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; syncVisualViewportVars(); });
    };
    const onViewportChange = () => {
      syncSoon();
      const el = document.activeElement;
      if (!isTextEntry(el) || !isTouchUi()) return;
      clearTimeout(vvTimer);
      vvTimer = setTimeout(() => { syncVisualViewportVars(); ensureFieldVisible(el); }, 60);
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onViewportChange);
      // Cuộn trang thường không đổi bàn phím → chỉ đo khi đang nhập liệu
      window.visualViewport.addEventListener('scroll', () => {
        if (_vvLast.kb || isTextEntry(document.activeElement)) syncSoon();
      }, { passive: true });
    }
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('orientationchange', () => setTimeout(onViewportChange, 250));
    document.addEventListener('focusin', (e) => {
      const el = e.target;
      if (!isTextEntry(el) || !isTouchUi()) return;
      focusTimers.forEach(clearTimeout);
      // Bàn phím trượt lên mất ~250–400ms; đo lại vài lần cho chắc
      focusTimers = [60, 320, 650].map((ms) => setTimeout(() => {
        syncVisualViewportVars();
        ensureFieldVisible(el);
      }, ms));
    });
    document.addEventListener('focusout', () => setTimeout(syncVisualViewportVars, 150));
  } catch { /* không được chặn boot */ }
}());

const modalFoot = (submitLabel = 'Lưu', { danger = false, cancel = 'Hủy', cancelClick = 'modal-close' } = {}) => `<div class="modal-foot">
  <button type="button" class="btn" data-click="${esc(cancelClick)}">${esc(cancel)}</button>
  <button type="submit" class="btn ${danger ? 'btn-danger' : 'btn-primary'}">${esc(submitLabel)}</button></div>`;

function confirmBox(message, { title = 'Xác nhận', okLabel = 'Đồng ý', danger = false } = {}) {
  return new Promise((resolve) => {
    let done = false;
    openModal({
      title,
      size: 'sm',
      stack: true,
      body: `<form data-submit="ok"><div class="modal-body"><div>${esc(message)}</div></div>${modalFoot(okLabel, { danger })}</form>`,
      handlers: {
        submit: { ok: () => { done = true; closeModal(); resolve(true); } },
        click: { 'modal-close': () => closeModal() },
      },
      onClose: () => { if (!done) resolve(false); },
    });
  });
}

function toast(message, type = 'info', opts = {}) {
  const el = document.createElement('div');
  el.className = `toast ${type}${opts.onClick ? ' toast-link' : ''}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = `${icon(opts.icon || (type === 'error' ? 'alert' : 'check'))}<div>${esc(message)}</div>`;
  if (opts.onClick) el.addEventListener('click', () => { el.remove(); opts.onClick(); });
  $('#toast-root').appendChild(el);
  setTimeout(() => el.remove(), opts.ms || (type === 'error' ? 5000 : 3000));
}

/** Toast kết quả đẩy Google Sheets: created | updated | unchanged */
function toastSheetPush(sheet, { silentUnchanged = false } = {}) {
  if (!sheet || !sheet.status) return;
  if (sheet.status === 'unchanged') {
    if (!silentUnchanged) toast('Số phiếu này đã tồn tại', 'error');
    return;
  }
  if (sheet.status === 'updated') {
    const f = Array.isArray(sheet.filled) ? sheet.filled.filter(Boolean) : [];
    toast(f.length ? `Đã cập nhật thêm ${f.join(' / ')}` : 'Đã cập nhật thêm trên Google Sheets', 'success');
    return;
  }
  toast('Đã đẩy lên Google Sheets', 'success');
}

// ---------------------------------------------------------------------------
// Phần tử form
// ---------------------------------------------------------------------------
let fieldSeq = 0;
function field(label, control, { req = false, hint = '', cls = '' } = {}) {
  let forAttr = '';
  const m = /<(input|select|textarea)\b([^>]*)>/.exec(control);
  if (m && !/\stype="(checkbox|radio|hidden)"/.test(m[2])) {
    const idm = /\sid="([^"]+)"/.exec(m[2]);
    const id = idm ? idm[1] : `fld-${++fieldSeq}`;
    if (!idm) control = control.slice(0, m.index) + `<${m[1]} id="${id}"${m[2]}>` + control.slice(m.index + m[0].length);
    forAttr = ` for="${id}"`;
  }
  return `<div class="field ${cls}"><label${forAttr}>${esc(label)}${req ? ' <span class="req">*</span>' : ''}</label>${control}${hint ? `<div class="hint">${esc(hint)}</div>` : ''}</div>`;
}
const input = (name, value, attrs = '', cls = '') => `<input class="input ${cls}" name="${name}" value="${esc(value)}" ${attrs}>`;
/** Số tiền hiển thị có chấm hàng nghìn: 1895999 → "1.895.999" (giá trị từ CSDL có thể là "1895999.00"). */
function moneyFmt(v) {
  if (v === null || v === undefined || v === '') return '';
  const s = String(v);
  const digits = typeof v === 'number' || /^\d+(\.\d+)?$/.test(s) ? String(Math.round(Number(v))) : s.replace(/\D+/g, '');
  return digits.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
/** Ô tiền VNĐ: ô chữ có chấm hàng nghìn, formData() gửi chữ số. */
const moneyInput = (name, value, attrs = '') => input(name, moneyFmt(value), `inputmode="numeric" autocomplete="off" data-money ${attrs}`);
/** Ô chi phí + tick "Không phát sinh chi phí" (tick → lưu 0, khóa ô nhập). */
function costInput(name, value, attrs = '') {
  const none = value !== null && value !== undefined && value !== '' && Number(value) === 0;
  return `<div class="cost-box">${moneyInput(name, none ? 0 : value, `${attrs}${none ? ' readonly' : ''}`)}
    <label class="cost-none"><input type="checkbox" data-no-cost${none ? ' checked' : ''}> Không phát sinh chi phí</label></div>`;
}
// Gõ / dán vào ô tiền: chỉ giữ chữ số, tự chèn chấm hàng nghìn, giữ con trỏ sau đúng chữ số đang gõ
document.addEventListener('input', (e) => {
  const el = e.target;
  if (!el.matches || !el.matches('input[data-money]')) return;
  const caret = el.selectionStart ?? el.value.length;
  const before = el.value.slice(0, caret).replace(/\D+/g, '').length;
  const next = moneyFmt(el.value.replace(/\D+/g, ''));
  if (next === el.value) return;
  el.value = next;
  let pos = 0;
  for (let seen = 0; pos < next.length && seen < before; pos++) if (/\d/.test(next[pos])) seen++;
  try { el.setSelectionRange(pos, pos); } catch { /* ô không hỗ trợ chọn */ }
});
document.addEventListener('change', (e) => {
  const cb = e.target;
  if (!cb.matches || !cb.matches('[data-no-cost]')) return;
  const inp = cb.closest('.cost-box').querySelector('input[data-money]');
  if (cb.checked) {
    if (inp.value !== '0') inp.dataset.prev = inp.value;
    inp.value = '0';
    inp.readOnly = true;
  } else {
    inp.readOnly = false;
    inp.value = inp.dataset.prev || '';
    inp.focus();
  }
  costToggleOrder(cb.closest('form') || document, cb.checked);
});
// Ô số nguyên (tiền VNĐ, km…): dán "1.895.999 đ" / "1,895,999" → chỉ giữ chữ số (ô number hiểu dấu chấm đầu là thập phân)
document.addEventListener('paste', (e) => {
  const el = e.target;
  if (!el.matches || !el.matches('input[type=number][step="1"]') || el.readOnly || el.disabled) return;
  const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
  const digits = text.replace(/\D+/g, '');
  if (!digits || digits === text.trim()) return;
  e.preventDefault();
  el.value = digits.replace(/^0+(?=\d)/, '');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
});
/** Không phát sinh chi phí = không có lệnh sửa chữa (ẩn + xóa). */
function costToggleOrder(root, none) {
  root.querySelectorAll('[data-cost-ro]').forEach((box) => {
    box.classList.toggle('hidden', none);
    box.querySelectorAll('input').forEach((el) => {
      if (none) {
        if (el.value) el.dataset.prev = el.value;
        el.value = '';
        if (el.required) { el.dataset.req = '1'; el.required = false; }
      } else {
        if (!el.value && el.dataset.prev) el.value = el.dataset.prev;
        if (el.dataset.req) el.required = true;
      }
    });
  });
}
/** Ô loại xe: gõ để gợi ý (không sổ cả danh sách). extra = mẫu thêm (VD xe GSM). */
function modelInput(name, value, attrs = '', extra = []) {
  const list = [...new Set([...(S.meta.models || []), ...extra])];
  return `<div class="ta"><input class="input" name="${name}" value="${esc(value || '')}" autocomplete="off"
    data-ta="${esc(JSON.stringify(list))}" role="combobox" aria-autocomplete="list" aria-expanded="false" ${attrs}>
    <button type="button" class="ta-btn" tabindex="-1" aria-label="Chọn loại xe" title="Chọn từ danh sách">${icon('chevronDown')}</button><div class="ta-list" role="listbox" hidden></div></div>`;
}
const taNorm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();
function taShow(inp, all = false) {
  const box = inp.parentElement.querySelector('.ta-list');
  const q = taNorm(inp.value);
  let opts = [];
  try { opts = JSON.parse(inp.dataset.ta); } catch { /* ignore */ }
  const hits = all ? opts : q ? opts.filter((o) => taNorm(o).includes(q))
    .sort((a, b) => Number(!taNorm(a).startsWith(q)) - Number(!taNorm(b).startsWith(q)) || a.length - b.length).slice(0, 8) : [];
  if (!hits.length || (!all && hits.length === 1 && taNorm(hits[0]) === q)) { box.hidden = true; inp.setAttribute('aria-expanded', 'false'); return; }
  const cur = all ? hits.findIndex((o) => taNorm(o) === q) : 0;
  box.innerHTML = hits.map((o, i) => `<div class="ta-item${i === Math.max(cur, 0) ? ' on' : ''}" role="option" data-v="${esc(o)}">${esc(o)}</div>`).join('');
  // Thẻ cha có overflow:hidden → đặt danh sách theo màn hình để không bị cắt
  const r = inp.getBoundingClientRect();
  const below = window.innerHeight - r.bottom;
  Object.assign(box.style, { left: `${r.left}px`, width: `${r.width}px`, top: below < 200 && r.top > below ? '' : `${r.bottom + 4}px`,
    bottom: below < 200 && r.top > below ? `${window.innerHeight - r.top + 4}px` : '' });
  box.hidden = false;
  inp.setAttribute('aria-expanded', 'true');
}
function taPick(inp, v) {
  inp.value = v;
  const box = inp.parentElement.querySelector('.ta-list');
  box.hidden = true;
  inp.setAttribute('aria-expanded', 'false');
  inp.dispatchEvent(new Event('change', { bubbles: true }));
}
document.addEventListener('input', (e) => { if (e.target.matches && e.target.matches('input[data-ta]')) taShow(e.target); });
document.addEventListener('keydown', (e) => {
  const inp = e.target;
  if (!inp.matches || !inp.matches('input[data-ta]')) return;
  const box = inp.parentElement.querySelector('.ta-list');
  if (box.hidden) return;
  const items = [...box.querySelectorAll('.ta-item')];
  const cur = items.findIndex((x) => x.classList.contains('on'));
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const n = (cur + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items.forEach((x, i) => x.classList.toggle('on', i === n));
  } else if (e.key === 'Enter' && cur >= 0) {
    e.preventDefault();
    taPick(inp, items[cur].dataset.v);
  } else if (e.key === 'Escape') {
    e.stopPropagation();
    box.hidden = true;
  }
}, true);
document.addEventListener('mousedown', (e) => {
  const it = e.target.closest && e.target.closest('.ta-item');
  if (it) { e.preventDefault(); taPick(it.closest('.ta').querySelector('input'), it.dataset.v); return; }
  const tb = e.target.closest && e.target.closest('.ta-btn');
  if (tb) {
    e.preventDefault();
    const inp = tb.parentElement.querySelector('input[data-ta]');
    const box = tb.parentElement.querySelector('.ta-list');
    if (!box.hidden) { box.hidden = true; inp.setAttribute('aria-expanded', 'false'); } else { inp.focus(); taShow(inp, true); }
    return;
  }
  document.querySelectorAll('.ta-list:not([hidden])').forEach((b) => { if (!b.parentElement.contains(e.target)) b.hidden = true; });
});
document.addEventListener('scroll', (e) => {
  if (e.target.closest && e.target.closest('.ta-list')) return;
  document.querySelectorAll('.ta-list:not([hidden])').forEach((b) => { b.hidden = true; });
}, true);
document.addEventListener('focusout', (e) => {
  const inp = e.target;
  if (!inp.matches || !inp.matches('input[data-ta]')) return;
  inp.parentElement.querySelector('.ta-list').hidden = true;
  let opts = [];
  try { opts = JSON.parse(inp.dataset.ta); } catch { /* ignore */ }
  const exact = opts.find((o) => taNorm(o) === taNorm(inp.value));
  if (exact && exact !== inp.value) inp.value = exact;
});
/** Ô nhập kèm nút quét QR / mã vạch (modes: qr | barcode | qr,barcode) */
function scanInput(name, value, attrs = '', cls = '', modes = 'qr,barcode') {
  return `<div class="input-scan">
    <input class="input ${cls}" name="${name}" value="${esc(value)}" autocomplete="off" ${attrs}>
    <button type="button" class="btn btn-ghost btn-icon btn-sm scan-btn" data-click="scan-code" data-target="${esc(name)}" data-modes="${esc(modes)}" title="Quét mã">${icon('scan')}</button>
  </div>`;
}
/** Sạc có 2 QR: bên ngoài (charger_serial — giữ tên cũ) và bên trong (charger_serial_inner). */
function chargerQrInputs(a = {}) {
  return `<div class="charger-qr-grid">
    <div class="charger-qr-item"><span class="charger-qr-lab">QR bên ngoài</span>${scanInput('charger_serial', a.charger_serial || '', 'placeholder="Quét hoặc nhập mã" aria-label="QR sạc bên ngoài"', 'mono', 'qr')}</div>
    <div class="charger-qr-item"><span class="charger-qr-lab">QR bên trong</span>${scanInput('charger_serial_inner', a.charger_serial_inner || '', 'placeholder="Quét hoặc nhập mã" aria-label="QR sạc bên trong"', 'mono', 'qr')}</div>
  </div>`;
}
/** Ô Serial PIN n có hiện không: pins '' / null = chưa chọn (showUnknown → hiện cả hai). */
function pinSerialShown(idx, pins, showUnknown = false) {
  const n = pins === '' || pins === null || pins === undefined ? null : Number(pins);
  return n === null ? showUnknown : idx <= n;
}
/** Serial PIN 1 / PIN 2 (QR BAT…) trong nhóm "PIN trên xe": acc_battery_serial / acc_battery_serial_2. */
function batterySerialInputs(vals = {}, pins = '', { showUnknown = false } = {}) {
  const item = (idx, name, val) => `<div class="pin-serial-item" data-pin-serial="${idx}" ${pinSerialShown(idx, pins, showUnknown) ? '' : 'hidden'}>
    <span class="charger-qr-lab">Serial PIN ${idx} <span class="req pin-serial-req" hidden>*</span></span>
    ${scanInput(name, val || '', `placeholder="Quét hoặc nhập mã BAT…" aria-label="Serial PIN ${idx}" maxlength="60" spellcheck="false" autocapitalize="characters" data-input="bat-serial" data-change="bat-serial"`, 'mono pin-serial-input', 'qr')}
    <div class="pin-serial-warn" role="status" hidden></div>
  </div>`;
  const any = pinSerialShown(1, pins, showUnknown) || pinSerialShown(2, pins, showUnknown);
  return `<div class="acc-pin-serials" ${any ? '' : 'hidden'}><div class="pin-serial-grid">
    ${item(1, 'acc_battery_serial', vals.battery_serial)}${item(2, 'acc_battery_serial_2', vals.battery_serial_2)}
  </div></div>`;
}
/** Cảnh báo mềm: không bắt đầu bằng BAT; PIN 2 trùng PIN 1 (chặn khi lưu ở pinSerialsFromData). */
function checkPinSerials(scope) {
  if (!scope) return;
  const items = $$('.pin-serial-item', scope);
  const vals = items.map((it) => {
    const inp = it.querySelector('input');
    return it.hidden || !inp ? '' : InspectText.normBatSerial(inp.value);
  });
  items.forEach((it, i) => {
    const v = vals[i];
    let msg = '';
    if (v && i === 1 && v === vals[0]) msg = 'Trùng Serial PIN 1';
    else if (v && !InspectText.batSerialLooksOk(v)) msg = 'Mã PIN thường bắt đầu bằng "BAT" — kiểm tra lại';
    const warn = it.querySelector('.pin-serial-warn');
    if (warn) { warn.textContent = msg; warn.hidden = !msg; }
    it.classList.toggle('pin-serial-bad', !!msg);
  });
}
/** Đổi số PIN: 0 → ẩn + xóa cả hai; 1 → chỉ PIN 1 (xóa PIN 2); 2 → cả hai. */
function applyPinSerials(scope, pins, { showUnknown = false } = {}) {
  const box = scope && scope.querySelector('.acc-pin-serials');
  if (!box) return;
  const known = !(pins === '' || pins === null || pins === undefined);
  let any = false;
  $$('.pin-serial-item', box).forEach((it) => {
    const show = pinSerialShown(Number(it.dataset.pinSerial), pins, showUnknown);
    it.hidden = !show;
    if (show) any = true;
    else if (known) { const inp = it.querySelector('input'); if (inp) inp.value = ''; }
  });
  box.hidden = !any;
  checkPinSerials(box);
}
/** Serial PIN từ form (đã chuẩn hóa) theo số PIN; trùng nhau → lỗi. */
function pinSerialsFromData(data, pins) {
  const n = pins === '' || pins === null || pins === undefined || Number.isNaN(Number(pins)) ? null : Number(pins);
  const s1 = n === 0 ? '' : InspectText.normBatSerial(data.acc_battery_serial);
  const s2 = n === 0 || n === 1 ? '' : InspectText.normBatSerial(data.acc_battery_serial_2);
  if (s1 && s2 && s1 === s2) throw new Error('Serial PIN 1 và Serial PIN 2 không được trùng nhau');
  return { battery_serial: s1, battery_serial_2: s2 };
}
onGlobal('input', 'bat-serial', (el) => {
  if (el.value.trim()) el.closest('.pin-serial-item')?.classList.remove('pin-serial-missing');
  checkPinSerials(el.closest('.pin-serial-grid'));
});
onGlobal('change', 'bat-serial', (el) => {
  const v = InspectText.normBatSerial(el.value);
  if (el.value !== v) el.value = v;
  checkPinSerials(el.closest('.pin-serial-grid'));
});
function chargerQrText(a = {}) {
  return [
    String(a.charger_serial || '').trim() ? `QR ngoài: ${String(a.charger_serial).trim()}` : '',
    String(a.charger_serial_inner || '').trim() ? `QR trong: ${String(a.charger_serial_inner).trim()}` : '',
  ].filter(Boolean).join(', ');
}
const textarea = (name, value, attrs = '') => `<textarea class="textarea" name="${name}" ${attrs}>${esc(value)}</textarea>`;
function select(name, options, value, attrs = '', placeholder) {
  let opts = Array.isArray(options) ? options.slice() : Object.entries(options).map(([k, v]) => [k, typeof v === 'object' ? v.label : v]);
  const val = value === null || value === undefined ? '' : String(value);
  if (val && !opts.some(([v]) => String(v) === val)) opts = opts.concat([[val, val]]);
  return `<select class="select" ${name ? `name="${name}"` : ''} ${attrs}>${placeholder !== undefined ? `<option value="">${esc(placeholder)}</option>` : ''}${
    opts.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === val ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
}
const checkbox = (name, checked, label, attrs = '') => `<label class="check"><input type="checkbox" name="${name}" ${checked ? 'checked' : ''} ${attrs}><span>${esc(label)}</span></label>`;

// ----- Kiểm tra ngoại quan (NQT / NQS / NQBH…) -----
const inspectNqFields = () => ((S.meta && S.meta.inspection_note_fields) || []).filter((f) => f.form);
/** Các ô ngoại quan (tên input "nqf_<key>"), giá trị lấy từ inspection_notes. */
function inspectNqInputs(notes = {}, rows = 3) {
  const n = inspectNqFields().length;
  const cols = n === 5 ? 5 : n % 3 === 0 ? 3 : 2;
  return `<div class="nq-grid nq-cols-${cols}">${inspectNqFields().map((f) => field(f.label,
    textarea(`nqf_${f.key}`, notes[f.key] || '', `rows="${rows}" placeholder="${esc(f.placeholder || '')}"`))).join('')}</div>`;
}
/** Đọc lại các ô ngoại quan từ formData → { nq_replace: '…', … } (bỏ trống). */
function inspectNqFromData(data) {
  const out = {};
  inspectNqFields().forEach((f) => {
    const v = String(data[`nqf_${f.key}`] || '').trim();
    if (v) out[f.key] = v;
  });
  return out;
}
/** Nội dung kiểm tra hiển thị: dòng ngoại quan + nội dung tự do cũ (diagnosis). */
function inspectText(w) {
  const n = (w && w.inspection_notes) || {};
  const lines = ((S.meta && S.meta.inspection_note_fields) || [])
    .filter((f) => String(n[f.key] || '').trim())
    .map((f) => `${f.label}: ${String(n[f.key]).trim()}`);
  const free = String((w && w.diagnosis) || '').trim();
  if (free) lines.push(free);
  return lines.join('\n');
}
const branchOptions = () => S.meta.branches.filter((b) => b.active).map((b) => [b.id, `${b.code} – ${b.name}`]);

function pager(total, page, pageSize) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = total ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(total, page * pageSize);
  return `<div class="pagination"><span>Hiển thị ${start}–${end} / ${NF.format(total)}</span><span class="spacer"></span>
    <button class="btn btn-sm" data-click="page" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>‹ Trước</button>
    <span>Trang ${page}/${pages}</span>
    <button class="btn btn-sm" data-click="page" data-page="${page + 1}" ${page >= pages ? 'disabled' : ''}>Sau ›</button></div>`;
}

function randomPassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const buf = new Uint32Array(10);
  window.crypto.getRandomValues(buf);
  const letters = Array.from(buf.slice(0, 7), (x) => chars[x % chars.length]).join('');
  const nums = Array.from(buf.slice(7), (x) => digits[x % digits.length]).join('');
  return `${letters}@${nums}`;
}

// ---------------------------------------------------------------------------
// Biểu đồ SVG
// ---------------------------------------------------------------------------
function barChart(series, keys, { height = 230 } = {}) {
  const W = 760; const H = height; const L = 34; const B = 26; const T = 10; const R = 6;
  const max = Math.max(1, ...series.flatMap((s) => keys.map((k) => s[k.key] || 0)));
  const top = Math.ceil(max / 4) * 4;
  const cw = (W - L - R) / Math.max(1, series.length);
  const gap = 2;
  const bw = Math.max(3, Math.min(16, (cw * 0.7 - gap * (keys.length - 1)) / keys.length));
  const ih = H - T - B;
  let g = '';
  for (let i = 0; i <= 4; i++) {
    const y = T + ih - (ih * i) / 4;
    g += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="#e8edf3" stroke-width="1"/><text x="${L - 6}" y="${y + 4}" text-anchor="end">${Math.round((top * i) / 4)}</text>`;
  }
  const step = Math.ceil(series.length / 12);
  series.forEach((s, i) => {
    const groupW = bw * keys.length + gap * (keys.length - 1);
    const x0 = L + i * cw + (cw - groupW) / 2;
    keys.forEach((k, j) => {
      const v = s[k.key] || 0;
      const h = (v / top) * ih;
      g += `<rect x="${x0 + j * (bw + gap)}" y="${T + ih - h}" width="${bw}" height="${Math.max(h, v ? 1 : 0)}" rx="2" fill="${k.color}"><title>${esc(fmtD(s.date))} – ${esc(k.label)}: ${v}</title></rect>`;
    });
    if (i % step === 0) g += `<text x="${L + i * cw + cw / 2}" y="${H - 8}" text-anchor="middle">${s.date.slice(8, 10)}/${s.date.slice(5, 7)}</text>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">${g}</svg>`;
}
const chartLegend = (keys) => `<div class="legend">${keys.map((k) => `<span><i style="background:${k.color}"></i>${esc(k.label)}</span>`).join('')}</div>`;

function hbars(rows, { color = 'var(--primary)', empty = 'Chưa có dữ liệu' } = {}) {
  if (!rows.length) return `<div class="empty">${esc(empty)}</div>`;
  const max = Math.max(1, ...rows.map((r) => r.value));
  return rows.map((r) => `<div class="hbar"><div class="name" title="${esc(r.label)}">${esc(r.label)}</div>
    <div class="track"><div class="fill" style="width:${(r.value / max) * 100}%;background:${r.color || color}"></div></div>
    <div class="right strong">${NF.format(r.value)}</div></div>`).join('');
}

// ---------------------------------------------------------------------------
// v2: SLA, nguồn xe, bảo hành, chọn nhiều, file & ảnh
// ---------------------------------------------------------------------------
const lab = (dict, k) => (k && dict && dict[k] ? (typeof dict[k] === 'object' ? dict[k].label : dict[k]) : '');
const slaBadge = (sla) => (sla ? `<span class="sla sla-${esc(sla.code)}">${esc(sla.label)}</span>` : '');
const sourceBadge = (s) => (s ? `<span class="src src-${esc(s)}">${esc(lab(S.meta.sources, s))}</span>` : '');
const warrantyBadge = (s) => (s ? badgeOf(S.meta.warranty_statuses, s) : '');
const faultTags = (list) => ((list || []).length ? `<span class="chips">${list.map((f) => `<span class="chip chip-static">${esc(f)}</span>`).join('')}</span>` : '');

// Chọn nhiều bằng chip; giá trị lưu trong input ẩn dạng JSON
function chipSelect(name, options, selected = []) {
  const set = new Set(selected || []);
  const extra = [...set].filter((v) => !options.includes(v));
  return `<div class="chips" data-chips="${esc(name)}"><input type="hidden" name="${esc(name)}" value="${esc(JSON.stringify([...set]))}">
    ${options.concat(extra).map((o) => `<span class="chip ${set.has(o) ? 'on' : ''}" data-click="chip" data-v="${esc(o)}">${esc(o)}</span>`).join('')}</div>`;
}
onGlobal('click', 'chip', (el) => {
  const box = el.closest('[data-chips]');
  const hidden = box.querySelector('input[type=hidden]');
  el.classList.toggle('on');
  hidden.value = JSON.stringify($$('.chip.on', box).map((c) => c.dataset.v));
  hidden.dispatchEvent(new Event('change', { bubbles: true }));
});
const parseChips = (v) => { try { return JSON.parse(v || '[]'); } catch { return []; } };

let _scanStop = null;
function stopScanStream() {
  if (typeof _scanStop === 'function') {
    try { _scanStop(); } catch { /* ignore */ }
  }
  _scanStop = null;
}

let _jsQRPromise = null;
function loadJsQR() {
  if (typeof jsQR === 'function') return Promise.resolve(jsQR);
  if (_jsQRPromise) return _jsQRPromise;
  _jsQRPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = '/vendor/jsQR.min.js';
    s.async = true;
    s.onload = () => (typeof jsQR === 'function' ? resolve(jsQR) : reject(new Error('jsQR không sẵn sàng')));
    s.onerror = () => reject(new Error('Không tải được thư viện quét QR'));
    document.head.appendChild(s);
  }).catch((e) => {
    _jsQRPromise = null;
    throw e;
  });
  return _jsQRPromise;
}

// ZXing-C++ (WebAssembly) – bộ giải mã mạnh như app quét chuyên dụng (Zalo…): mã nhỏ, mờ, nghiêng, cả mã vạch trên iPhone
let _zxingPromise = null;
function loadZXing() {
  if (_zxingPromise) return _zxingPromise;
  _zxingPromise = new Promise((resolve, reject) => {
    const done = () => {
      try {
        const Z = window.ZXingWASM;
        Z.prepareZXingModule({ overrides: { locateFile: (path, prefix) => (path.endsWith('.wasm') ? '/vendor/zxing/zxing_reader.wasm?v=1' : prefix + path) }, fireImmediately: true })
          .then(() => resolve(Z), reject);
      } catch (e) { reject(e); }
    };
    if (window.ZXingWASM) { done(); return; }
    const s = document.createElement('script');
    s.src = '/vendor/zxing/zxing-reader.js?v=1';
    s.async = true;
    s.onload = done;
    s.onerror = () => reject(new Error('Không tải được bộ quét'));
    document.head.appendChild(s);
  }).catch((e) => { _zxingPromise = null; throw e; });
  return _zxingPromise;
}
async function zxingDecode(canvas, formats) {
  if (!canvas) return '';
  const Z = await loadZXing();
  const img = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height);
  const res = await Z.readBarcodes(img, { tryHarder: true, maxNumberOfSymbols: 1, formats: formats && formats.length ? formats : [] });
  const hit = (res || []).find((r) => r.isValid && r.text);
  return hit ? String(hit.text).trim() : '';
}

function decodeQrFromImageData(imageData) {
  if (typeof jsQR !== 'function' || !imageData) return '';
  const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
  return (code && code.data) ? String(code.data).trim() : '';
}

/** Vẽ 1 vùng (tỉ lệ 0–1) của ảnh/video ra canvas, cạnh dài tối đa maxSide (vùng nhỏ → được phóng to). */
function scanCanvas(source, rect = [0, 0, 1, 1], maxSide = 1280, minSide = 0) {
  const w = source.naturalWidth || source.videoWidth || source.width;
  const h = source.naturalHeight || source.videoHeight || source.height;
  if (!w || !h) return null;
  const [fx, fy, fw, fh] = rect;
  const sx = w * fx; const sy = h * fy; const sw = w * fw; const sh = h * fh;
  let scale = Math.min(1, maxSide / Math.max(sw, sh));
  if (minSide && Math.max(sw, sh) * scale < minSide) scale = minSide / Math.max(sw, sh);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(sw * scale));
  canvas.height = Math.max(1, Math.round(sh * scale));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas;
}
async function decodeQrFromBitmapSource(source, rect, maxSide = 1280, minSide = 0) {
  await loadJsQR();
  const c = scanCanvas(source, rect, maxSide, minSide);
  if (!c) return '';
  return decodeQrFromImageData(c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height));
}
// Vùng giữa khung ngắm (mã nhỏ – sạc, PIN): đọc vùng này ở độ phân giải gốc/phóng to
const SCAN_CENTER = [0.2, 0.15, 0.6, 0.7];
// jsQR đọc trượt ở một số kích thước → mỗi khung hình camera thử 1 cách, xoay vòng: [vùng, cạnh dài tối đa, cạnh tối thiểu]
const SCAN_LIVE_VARIANTS = [[[0, 0, 1, 1], 1280, 0], [SCAN_CENTER, 1100, 900], [[0, 0, 1, 1], 800, 0], [SCAN_CENTER, 640, 0], [[0, 0, 1, 1], 1600, 0], [SCAN_CENTER, 1400, 1200]];
// Ảnh chụp: thử cả ảnh rồi từng ô chồng lấn (mã nhỏ trong ảnh lớn)
const SCAN_TILES = [[0, 0, 1, 1], [0.25, 0.2, 0.5, 0.6], [0, 0, 0.55, 0.55], [0.45, 0, 0.55, 0.55], [0, 0.45, 0.55, 0.55], [0.45, 0.45, 0.55, 0.55], [0.2, 0, 0.6, 0.55], [0.2, 0.45, 0.6, 0.55]];

onGlobal('click', 'scan-code', async (el) => {
  const targetName = el.dataset.target;
  const modes = String(el.dataset.modes || 'qr,barcode').split(',').map((s) => s.trim()).filter(Boolean);
  const wantQr = modes.includes('qr');
  const wantBarcode = modes.includes('barcode');
  const formats = [];
  if (wantQr) formats.push('qr_code');
  if (wantBarcode) formats.push('code_128', 'code_39', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'codabar', 'itf');

  stopScanStream();
  openModal({
    title: wantQr && wantBarcode ? 'Quét mã QR / mã vạch' : (wantQr ? 'Quét mã QR' : 'Quét mã vạch'),
    size: 'sm scan-modal',
    backdropClass: 'scan-backdrop',
    body: `<div class="modal-body scan-body">
      <div class="scan-viewport"><video id="scan-video" playsinline muted></video><div class="scan-frame"></div>
        <div class="scan-tools" id="scan-tools" hidden></div></div>
      <div class="small muted scan-hint" id="scan-hint">Đang mở camera…</div>
      <div class="scan-actions">
        <label class="btn">${icon('upload')} Chọn ảnh mã<input type="file" accept="image/*" capture="environment" hidden data-change="scan-file" data-target="${esc(targetName)}"></label>
        <button type="button" class="btn" data-click="modal-close">Đóng</button>
      </div>
    </div>`,
    handlers: {
      change: {
        'scan-file': async (fileEl) => {
          const file = fileEl.files && fileEl.files[0];
          if (!file) return;
          await decodeScanImage(file, formats, targetName, wantQr);
        },
      },
    },
  });

  const video = $('#scan-video');
  if (!video) return;
  if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    $('#scan-hint').textContent = 'Máy này không mở được camera — dùng nút Chọn ảnh mã, hoặc nhập tay.';
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
    });
    const stopStream = () => { stream.getTracks().forEach((t) => t.stop()); video.srcObject = null; };
    if (!video.isConnected) { stopStream(); return; }
    _scanStop = stopStream;
    video.srcObject = stream;
    await video.play();
    if (!video.isConnected) { stopStream(); return; }
    // Học theo Zalo: lấy nét liên tục, chạm để lấy nét, tự phóng to khi chưa đọc được, nút 1x/2x/3x + đèn
    let setZoom = null;
    let autoZoom = true;
    let zoomLevels = [];
    try {
      const track = stream.getVideoTracks()[0];
      const caps = (track && track.getCapabilities) ? track.getCapabilities() : {};
      if (Array.isArray(caps.focusMode) && caps.focusMode.includes('continuous')) {
        track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }).catch(() => {});
      }
      const tools = $('#scan-tools');
      const btns = [];
      if (caps.zoom && caps.zoom.max > 1) {
        zoomLevels = [1, 2, 3].filter((z) => z >= (caps.zoom.min || 1) && z <= caps.zoom.max);
        zoomLevels.forEach((z) => btns.push(`<button type="button" class="scan-tool${z === 1 ? ' on' : ''}" data-zoom="${z}">${z}x</button>`));
        setZoom = (z) => {
          track.applyConstraints({ advanced: [{ zoom: z }] }).catch(() => {});
          if (tools) tools.querySelectorAll('[data-zoom]').forEach((x) => x.classList.toggle('on', Number(x.dataset.zoom) === z));
        };
      }
      if (caps.torch) btns.push(`<button type="button" class="scan-tool" data-torch="1" title="Đèn">${icon('bolt')}</button>`);
      if (tools && btns.length) {
        tools.innerHTML = btns.join('');
        tools.hidden = false;
        let torchOn = false;
        tools.addEventListener('click', (ev) => {
          const b = ev.target.closest('.scan-tool');
          if (!b) return;
          ev.stopPropagation();
          if (b.dataset.zoom) { autoZoom = false; setZoom(Number(b.dataset.zoom)); } else if (b.dataset.torch) {
            torchOn = !torchOn;
            track.applyConstraints({ advanced: [{ torch: torchOn }] }).catch(() => {});
            b.classList.toggle('on', torchOn);
          }
        });
      }
      // Chạm vào khung hình để lấy nét điểm đó (máy hỗ trợ pointsOfInterest)
      video.addEventListener('click', (ev) => {
        const r = video.getBoundingClientRect();
        const pt = { x: (ev.clientX - r.left) / r.width, y: (ev.clientY - r.top) / r.height };
        track.applyConstraints({ advanced: [{ pointsOfInterest: [pt], focusMode: 'single-shot' }] })
          .then(() => setTimeout(() => track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }).catch(() => {}), 1500))
          .catch(() => {});
      });
    } catch { /* camera không hỗ trợ – bỏ qua */ }
    let alive = true;
    const prevStop = _scanStop;
    _scanStop = () => { alive = false; prevStop(); };

    // Bộ giải mã: có sẵn của máy (Android – ML Kit) → ZXing (WebAssembly) → jsQR (dự phòng)
    let detector = null;
    if (typeof BarcodeDetector !== 'undefined') {
      try { detector = new BarcodeDetector({ formats: formats.length ? formats : undefined }); } catch { detector = null; }
    }
    let zx = false;
    if (!detector) {
      $('#scan-hint').textContent = 'Đang chuẩn bị bộ quét…';
      try { await loadZXing(); zx = true; } catch { zx = false; }
      if (!zx) {
        if (!wantQr) { $('#scan-hint').textContent = 'Không tải được bộ quét — dùng Chọn ảnh mã hoặc nhập tay.'; return; }
        try { await loadJsQR(); } catch (e) {
          $('#scan-hint').textContent = `${e.message || 'Không tải được bộ quét QR'}. Dùng Chọn ảnh mã hoặc nhập tay.`;
          return;
        }
      }
    }
    if (!alive) return;

    $('#scan-hint').textContent = 'Đưa mã vào khung hình…';

    const started = Date.now();
    let frameNo = 0;
    const tick = async () => {
      if (!alive || !video.isConnected) return;
      try {
        // Tự phóng to như Zalo: 2,5 giây chưa đọc được → 2x, 5 giây → 3x
        if (autoZoom && setZoom) {
          const t = Date.now() - started;
          const want = t > 5000 && zoomLevels.includes(3) ? 3 : t > 2500 && zoomLevels.includes(2) ? 2 : 1;
          if (want !== tick.zoom) { tick.zoom = want; setZoom(want); }
        }
        if (video.readyState >= 2) {
          // Xen kẽ: cả khung hình ↔ vùng giữa khung ngắm phóng to (mã nhỏ)
          const center = (frameNo++ % 2) === 1;
          let val = '';
          if (detector) {
            const codes = await detector.detect(center ? scanCanvas(video, SCAN_CENTER, 1600, 1200) : video);
            val = codes && codes[0] && codes[0].rawValue;
          } else if (zx) {
            val = await zxingDecode(center ? scanCanvas(video, SCAN_CENTER, 1200, 900) : scanCanvas(video, [0, 0, 1, 1], 1280), formats);
          } else if (wantQr) {
            const [rect, mx, mn] = SCAN_LIVE_VARIANTS[frameNo % SCAN_LIVE_VARIANTS.length];
            val = await decodeQrFromBitmapSource(video, rect, mx, mn);
          }
          if (val) { applyScanValue(targetName, val); return; }
        }
      } catch { /* continue */ }
      requestAnimationFrame(() => { setTimeout(tick, zx ? 60 : 160); });
    };
    tick();
  } catch (e) {
    $('#scan-hint').textContent = `Không mở được camera (${e.message}). Dùng Chọn ảnh mã hoặc nhập tay.`;
  }
});

function applyScanValue(targetName, raw) {
  const val = String(raw || '').trim();
  if (!val) return;
  const sel = `input[name="${CSS.escape(targetName)}"]`;
  const inputEl = document.querySelector(`${sel}[data-scan-submit]`) || document.querySelector(sel);
  if (inputEl) {
    inputEl.value = val;
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
    if (inputEl.hasAttribute('data-scan-submit') && inputEl.form) setTimeout(() => inputEl.form.requestSubmit(), 0);
  }
  try { if (navigator.vibrate) navigator.vibrate(60); } catch { /* ignore */ }
  stopScanStream();
  closeModal();
  toast('Đã quét mã', 'success');
}

async function decodeScanImage(file, formats, targetName, wantQr = true) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();

    if (typeof BarcodeDetector !== 'undefined') {
      try {
        const detector = new BarcodeDetector({ formats: formats.length ? formats : undefined });
        const codes = await detector.detect(img);
        if (codes && codes[0] && codes[0].rawValue) {
          applyScanValue(targetName, codes[0].rawValue);
          return;
        }
      } catch { /* fall through to jsQR */ }
    }

    // ZXing: cả ảnh (giới hạn 2400px) rồi vùng giữa
    try {
      for (const [rect, mx] of [[[0, 0, 1, 1], 2400], [SCAN_TILES[1], 1600]]) {
        const v = await zxingDecode(scanCanvas(img, rect, mx), formats);
        if (v) { applyScanValue(targetName, v); return; }
      }
    } catch { /* thử jsQR */ }
    if (wantQr) {
      const hint = $('#scan-hint');
      if (hint) hint.textContent = 'Đang đọc mã trong ảnh…';
      // Mỗi vùng thử vài cỡ (jsQR nhạy với kích thước)
      for (const [i, rect] of SCAN_TILES.entries()) {
        for (const [mx, mn] of (i === 0 ? [[2000, 0], [1280, 0], [800, 0]] : [[1400, 900], [800, 0]])) {
          const val = await decodeQrFromBitmapSource(img, rect, mx, mn);
          if (val) {
            applyScanValue(targetName, val);
            return;
          }
        }
      }
      if (hint) hint.textContent = 'Đưa mã vào khung hình…';
    }
    throw new Error('Không đọc được mã trong ảnh – chụp gần hơn, rõ nét, tránh lóa');
  } catch (e) {
    toast(e.message || 'Không đọc được mã', 'error');
  } finally {
    URL.revokeObjectURL(url);
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('Không đọc được file'));
    r.readAsDataURL(file);
  });
}

/**
 * Sao chép File vào bộ nhớ trước khi đóng modal / gỡ input.
 * iOS Safari thường làm File từ <input type=file> không đọc được sau khi input bị destroy.
 */
async function snapshotFile(file) {
  if (!file) return null;
  const buf = await file.arrayBuffer();
  let type = file.type || '';
  if (!type && /\.pdf$/i.test(file.name || '')) type = 'application/pdf';
  if (!type && /\.(jpe?g|png|webp|gif)$/i.test(file.name || '')) {
    const ext = String(file.name).split('.').pop().toLowerCase();
    type = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
  }
  try {
    return new File([buf], file.name || 'file', { type, lastModified: file.lastModified || Date.now() });
  } catch {
    const blob = new Blob([buf], { type });
    blob.name = file.name || 'file';
    return blob;
  }
}

/** Bản nháp form lưu trong IndexedDB của trình duyệt (giữ được cả ảnh) – mất mạng / văng app vẫn còn. */
const draftStore = (() => {
  let dbp = null;
  const open = () => {
    if (!dbp) {
      dbp = new Promise((resolve, reject) => {
        const r = indexedDB.open('att-drafts', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('drafts');
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
      });
    }
    return dbp;
  };
  const run = async (mode, fn) => {
    try {
      const db = await open();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction('drafts', mode);
        const req = fn(tx.objectStore('drafts'));
        tx.oncomplete = () => resolve(req && req.result);
        tx.onerror = () => reject(tx.error);
      });
    } catch { return undefined; }
  };
  return {
    get: (key) => run('readonly', (s) => s.get(key)),
    set: (key, val) => run('readwrite', (s) => s.put(val, key)),
    del: (key) => run('readwrite', (s) => s.delete(key)),
  };
})();
const dataUrlToBlob = (u) => {
  const [head, b64] = String(u).split(',');
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: (head.match(/data:([^;]+)/) || [])[1] || 'image/jpeg' });
};
// ---------- Dấu thời gian trên ảnh (kiểu Timemark): giờ, ngày, người chụp, vị trí, logo ----------
const STAMP_DOW = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const stampCfg = () => (S.meta && S.meta.settings && S.meta.settings.photo_stamp) || {};
let stampLogoP = null;
let stampLogoSrc = '';
function stampLogo() {
  const src = stampCfg().logo || '/brand.png?v=2';
  if (stampLogoP && stampLogoSrc === src) return stampLogoP;
  stampLogoSrc = src;
  return (stampLogoP = new Promise((resolve) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => resolve(null);
    i.src = src;
  }));
}
let stampGeoCache = null;
let stampGeoWatch = null;
let stampGeoDenied = false;
const stampGeoOk = () => window.isSecureContext && navigator.geolocation && !stampGeoDenied;
/** Theo dõi GPS liên tục khi đang chụp ảnh – chụp xong là có toạ độ ngay; tắt khi rời app cho đỡ tốn pin. */
function stampGeoStart() {
  if (stampGeoWatch !== null || !stampGeoOk() || stampCfg().enabled === false) return;
  stampGeoWatch = navigator.geolocation.watchPosition((p) => {
    stampGeoCache = { at: Date.now(), pos: { lat: p.coords.latitude, lng: p.coords.longitude } };
  }, (e) => {
    if (e && e.code === 1) { stampGeoDenied = true; stampGeoStop(); }
  }, { enableHighAccuracy: true, maximumAge: 30000 });
}
function stampGeoStop() {
  if (stampGeoWatch !== null) navigator.geolocation.clearWatch(stampGeoWatch);
  stampGeoWatch = null;
}
document.addEventListener('click', (e) => {
  const t = e.target && e.target.closest && e.target.closest('input[type=file], label');
  const inp = t && (t.matches('input') ? t : t.querySelector('input[type=file]') || (t.htmlFor && document.getElementById(t.htmlFor)));
  if (inp && inp.type === 'file' && /image|^$/.test(inp.accept || '')) stampGeoStart();
}, true);
document.addEventListener('visibilitychange', () => { if (document.hidden) stampGeoStop(); });
/** Toạ độ GPS (nếu điện thoại cho phép) – dùng vị trí đang theo dõi (≤ 2 phút), chưa có thì hỏi 1 lần. */
function stampGeo() {
  if (!stampGeoOk()) return Promise.resolve(null);
  stampGeoStart();
  if (stampGeoCache && Date.now() - stampGeoCache.at < 120000) return Promise.resolve(stampGeoCache.pos);
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 6000);
    navigator.geolocation.getCurrentPosition((p) => {
      clearTimeout(timer);
      const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
      stampGeoCache = { at: Date.now(), pos };
      resolve(pos);
    }, (e) => { if (e && e.code === 1) stampGeoDenied = true; clearTimeout(timer); resolve(null); }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 120000 });
  });
}
/** ctx: { branchId, branchName, address, plate, code } – thiếu thì lấy cơ sở đang chọn / của tài khoản. */
async function photoStampInfo(ctx = {}) {
  if (stampCfg().enabled === false) return null;
  const bid = ctx.branchId || S.branch || (S.me && S.me.branch_id);
  const br = (S.meta && S.meta.branches || []).find((b) => String(b.id) === String(bid)) || {};
  const [logo, geo] = await Promise.all([stampLogo(), stampGeo()]);
  return {
    name: (S.me && S.me.full_name) || '',
    place: ctx.branchName || [br.code, br.name].filter(Boolean).join(' – '),
    address: ctx.address || br.address || '',
    vehicle: [ctx.plate, ctx.code].filter(Boolean).join(' · '),
    logo, geo,
  };
}
function stampWrap(g, text, maxW) {
  const out = [];
  let line = '';
  for (const word of String(text).split(/\s+/)) {
    const t = line ? `${line} ${word}` : word;
    if (line && g.measureText(t).width > maxW) { out.push(line); line = word; } else line = t;
  }
  if (line) out.push(line);
  return out.slice(0, 3);
}
function drawPhotoStamp(g, w, h, info, when) {
  const s = Math.min(w, h) / 90;
  const m = 3 * s;
  const font = (px, bold) => `${bold ? '700' : '500'} ${Math.round(px)}px "Be Vietnam Pro", Inter, Arial, sans-serif`;
  const lines = [];
  g.font = font(2.5 * s);
  const maxW = w - m * 2;
  if (info.name) lines.push(...stampWrap(g, `Người chụp: ${info.name}`, maxW));
  if (info.place) lines.push(...stampWrap(g, `Vị trí: ${info.place}`, maxW));
  if (info.address) lines.push(...stampWrap(g, `Địa chỉ: ${info.address}`, maxW));
  if (info.geo) lines.push(`GPS: ${info.geo.lat.toFixed(6)}, ${info.geo.lng.toFixed(6)}`);
  if (info.vehicle) lines.push(...stampWrap(g, `Xe: ${info.vehicle}`, maxW));
  const lineH = 3.4 * s;
  const timeH = 7.5 * s;
  const blockH = timeH + 1.5 * s + lines.length * lineH;
  const top = h - m - blockH;
  const grad = g.createLinearGradient(0, top - 6 * s, 0, h);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,.62)');
  g.fillStyle = grad;
  g.fillRect(0, top - 6 * s, w, h - top + 6 * s);
  g.save();
  g.shadowColor = 'rgba(0,0,0,.55)';
  g.shadowBlur = s * 0.8;
  g.textBaseline = 'alphabetic';
  g.fillStyle = '#fff';
  g.font = font(7.5 * s, true);
  const hm = `${pad(when.getHours())}:${pad(when.getMinutes())}`;
  const timeBase = top + timeH * 0.86;
  g.fillText(hm, m, timeBase);
  const tw = g.measureText(hm).width;
  const barX = m + tw + 1.6 * s;
  g.fillStyle = '#ffc400';
  g.fillRect(barX, top + 0.6 * s, 0.6 * s, timeH - 0.6 * s);
  g.fillStyle = '#fff';
  g.font = font(2.7 * s, true);
  g.fillText(`${pad(when.getDate())}/${pad(when.getMonth() + 1)}/${when.getFullYear()}`, barX + 1.6 * s, top + 3.2 * s);
  g.font = font(2.5 * s);
  g.fillText(STAMP_DOW[when.getDay()], barX + 1.6 * s, top + 6.6 * s);
  g.font = font(2.5 * s);
  lines.forEach((t, i) => g.fillText(t, m, top + timeH + 1.5 * s + (i + 0.8) * lineH));
  g.restore();
  if (info.logo && info.logo.naturalWidth) {
    const lh = 8 * s;
    const lw = lh * (info.logo.naturalWidth / info.logo.naturalHeight);
    const bx = w - m - lw - 1.6 * s;
    const by = m;
    g.save();
    g.globalAlpha = 0.92;
    g.fillStyle = '#fff';
    g.beginPath();
    if (g.roundRect) g.roundRect(bx, by, lw + 1.6 * s, lh + 1.6 * s, 1.4 * s); else g.rect(bx, by, lw + 1.6 * s, lh + 1.6 * s);
    g.fill();
    g.globalAlpha = 1;
    g.drawImage(info.logo, bx + 0.8 * s, by + 0.8 * s, lw, lh);
    g.restore();
  }
}
/** Nén ảnh ngay khi chọn/chụp (giữ ít bộ nhớ – tránh điện thoại đóng trang khi chụp nhiều ảnh). */
async function preparePhoto(file, stampCtx) {
  try {
    const stamp = stampCtx ? await photoStampInfo(stampCtx) : null;
    const { dataUrl, thumb } = await compressImage(file, PHOTO_MAX_SIDE, PHOTO_QUALITY, stamp);
    const out = new File([dataUrlToBlob(dataUrl)], `${(file.name || 'anh').replace(/\.[^.]+$/, '')}.jpg`, { type: 'image/jpeg' });
    out.__pre = { dataUrl, thumb };
    return { file: out, preview: thumb };
  } catch {
    return { file, preview: URL.createObjectURL(file) };
  }
}

const PHOTO_MAX_SIDE = 2560;
const PHOTO_QUALITY = 0.9;
// Nén ảnh trên trình duyệt trước khi tải lên (giảm dung lượng, tạo ảnh thu nhỏ)
async function compressImage(file, maxSide = PHOTO_MAX_SIDE, quality = PHOTO_QUALITY, stamp = null) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error(`Không đọc được ảnh ${file.name}`));
      i.src = url;
    });
    const draw = (src, sw, sh, side) => {
      const scale = Math.min(1, side / Math.max(sw, sh));
      const c = document.createElement('canvas');
      c.width = Math.round(sw * scale);
      c.height = Math.round(sh * scale);
      const g = c.getContext('2d');
      g.imageSmoothingQuality = 'high';
      g.drawImage(src, 0, 0, c.width, c.height);
      return c;
    };
    const big = draw(img, img.naturalWidth, img.naturalHeight, maxSide);
    if (stamp) drawPhotoStamp(big.getContext('2d'), big.width, big.height, stamp, new Date(file.lastModified || Date.now()));
    const thumb = draw(big, big.width, big.height, 320);
    // base64 dài hơn file ~4/3: giữ dưới giới hạn tải lên MAX_UPLOAD_MB
    const limit = MAX_UPLOAD_MB * 1024 * 1024 * 4 / 3;
    let q = quality;
    let dataUrl = big.toDataURL('image/jpeg', q);
    while (dataUrl.length > limit && q > 0.6) {
      q -= 0.1;
      dataUrl = big.toDataURL('image/jpeg', q);
    }
    // Ảnh nhỏ lưu trong DB (gói miễn phí 500 MB): WebP nhẹ hơn JPEG ~2 lần; máy không mã hóa được WebP thì JPEG
    const webp = thumb.toDataURL('image/webp', 0.62);
    return { dataUrl, thumb: webp.startsWith('data:image/webp') ? webp : thumb.toDataURL('image/jpeg', 0.6) };
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Vercel nhận tối đa 4,5 MB/request; base64 làm file to thêm ~1/3 → giới hạn 3 MB
const MAX_UPLOAD_MB = 3;
async function uploadAttachment(woId, kind, file, stampCtx = null) {
  const name = file.name || 'file';
  const type = file.type || '';
  if (!file.__pre && (/heic|heif/i.test(type) || /\.heic$/i.test(name) || /\.heif$/i.test(name))) {
    throw new Error('Ảnh HEIC chưa hỗ trợ trên điện thoại — chọn JPG/PNG (hoặc Đổi định dạng trong Ảnh) rồi tải lại');
  }
  const isImage = /^image\//.test(type) || /\.(jpe?g|png|webp|gif)$/i.test(name);
  const isPdf = type === 'application/pdf' || /\.pdf$/i.test(name);
  let payload;
  if (isImage) {
    const stamp = !file.__pre && stampCtx && /^photo/.test(kind) ? await photoStampInfo(stampCtx) : null;
    const { dataUrl, thumb } = file.__pre || await compressImage(file, PHOTO_MAX_SIDE, PHOTO_QUALITY, stamp);
    payload = { kind, name: name.replace(/\.[^.]+$/, '') + '.jpg', mime: 'image/jpeg', data: dataUrl, thumb };
  } else {
    if (!isPdf && !MIME_OK_CLIENT(type)) throw new Error(`Định dạng file không hỗ trợ: ${name}`);
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) throw new Error(`File ${name} vượt quá ${MAX_UPLOAD_MB} MB`);
    payload = { kind, name, mime: isPdf ? 'application/pdf' : type, data: await readFileAsDataUrl(file) };
  }
  // File tới 3 MB qua 4G yếu: 15 giây mặc định không đủ
  const saved = await api('POST', `/api/work-orders/${woId}/attachments`, payload, { timeoutMs: 90000 });
  if (saved && saved.warning) toast(saved.warning, 'error');
  else if (saved && saved.sheet) toastSheetPush(saved.sheet, { silentUnchanged: true });
  return saved;
}
const MIME_OK_CLIENT = (t) => !t || /^(application\/(pdf|msword|vnd\.(ms-excel|openxmlformats)))/i.test(t);
const fmtSize = (b) => (b > 1048576 ? `${numf(b / 1048576, 1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

// ---------------------------------------------------------------------------
// Chỉnh độ rộng cột bảng (kéo mép phải header) — lưu theo trang
// ---------------------------------------------------------------------------
function tableColStorageKey(table) {
  const path = (location.hash || '#/').split('?')[0];
  const heads = [...table.querySelectorAll('thead th')].map((th) => th.textContent.replace(/\s+/g, ' ').trim()).join('|');
  return `colw:${path}:${heads}`;
}

function ensureTableColgroup(table, count) {
  let cg = table.querySelector('colgroup');
  if (!cg) {
    cg = document.createElement('colgroup');
    table.insertBefore(cg, table.firstChild);
  }
  while (cg.children.length < count) cg.appendChild(document.createElement('col'));
  while (cg.children.length > count) cg.lastChild.remove();
  return cg;
}

function applyTableColWidth(table, index, px) {
  const w = Math.max(40, Math.round(px));
  const cg = table.querySelector('colgroup');
  const col = cg && cg.children[index];
  if (col) {
    col.style.width = `${w}px`;
    col.style.minWidth = `${w}px`;
  }
  const th = table.querySelectorAll('thead th')[index];
  if (th) {
    th.style.width = `${w}px`;
    th.style.minWidth = `${w}px`;
    th.style.maxWidth = `${w}px`;
  }
}

function syncTableMinWidth(table) {
  const cols = [...(table.querySelectorAll('colgroup col') || [])];
  let sum = 0;
  cols.forEach((c) => {
    const n = parseFloat(c.style.width) || c.getBoundingClientRect().width || 80;
    sum += n;
  });
  if (sum > 0) table.style.minWidth = `${Math.ceil(sum)}px`;
}

function saveTableColWidths(table) {
  try {
    const cols = [...table.querySelectorAll('colgroup col')];
    const widths = cols.map((c, i) => {
      const n = parseFloat(c.style.width);
      if (n) return Math.round(n);
      const th = table.querySelectorAll('thead th')[i];
      return th ? Math.round(th.getBoundingClientRect().width) : 80;
    });
    localStorage.setItem(tableColStorageKey(table), JSON.stringify(widths));
  } catch { /* ignore */ }
}

function loadTableColWidths(table) {
  try {
    const raw = localStorage.getItem(tableColStorageKey(table));
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch { return null; }
}

function isNarrowLayout() {
  try { return window.matchMedia('(max-width: 900px)').matches; } catch { return false; }
}

/** Mobile: không khóa table-layout:fixed theo bề rộng đã bị ép — gây chữ đè nhau. */
function prepareTableForNarrow(table) {
  if (!table) return;
  const ths = [...table.querySelectorAll('thead th')];
  if (ths.length < 2) return;
  table.classList.remove('table-col-resize');
  table.style.tableLayout = 'auto';
  table.style.minWidth = `${Math.max(ths.length * 120, 560)}px`;
  table.querySelectorAll('thead th').forEach((th) => {
    th.style.width = '';
    th.style.minWidth = '';
    th.style.maxWidth = '';
  });
  table.querySelectorAll('colgroup col').forEach((col) => {
    col.style.width = '';
    col.style.minWidth = '';
  });
}

function enhanceTableColResize(table) {
  if (!table || table.dataset.colResize === '1') return;
  // Bảng tự đặt độ rộng cột bằng CSS (VD danh sách phiếu gọn) — không đo / kéo cột
  if (table.classList.contains('no-col-resize')) return;
  if (table.closest('.print-root, #print-root, .login')) return;
  const ths = [...table.querySelectorAll('thead th')];
  if (ths.length < 2) return;

  // Điện thoại / hẹp: cuộn ngang, không đo cột khi đã bị ép vào viewport
  if (isNarrowLayout()) {
    prepareTableForNarrow(table);
    return;
  }

  table.dataset.colResize = '1';
  table.classList.add('table-col-resize');
  table.style.tableLayout = 'fixed';

  const cg = ensureTableColgroup(table, ths.length);
  const saved = loadTableColWidths(table);

  ths.forEach((th, i) => {
    const measured = Math.max(80, Math.round(th.getBoundingClientRect().width) || 100);
    const w = (saved && saved[i]) ? saved[i] : measured;
    applyTableColWidth(table, i, w);

    if (th.querySelector('.col-resize-handle')) return;
    th.classList.add('th-resizable');
    const handle = document.createElement('span');
    handle.className = 'col-resize-handle';
    handle.title = 'Kéo để chỉnh độ rộng cột · double-click để reset';
    handle.setAttribute('aria-hidden', 'true');
    th.appendChild(handle);

    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startW = th.getBoundingClientRect().width;
      th.classList.add('is-resizing');
      document.body.classList.add('col-resizing');
      handle.setPointerCapture?.(e.pointerId);

      const onMove = (ev) => {
        applyTableColWidth(table, i, startW + (ev.clientX - startX));
        syncTableMinWidth(table);
      };
      const onUp = () => {
        th.classList.remove('is-resizing');
        document.body.classList.remove('col-resizing');
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointercancel', onUp);
        syncTableMinWidth(table);
        saveTableColWidths(table);
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
      document.addEventListener('pointercancel', onUp);
    });

    handle.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      applyTableColWidth(table, i, 120);
      syncTableMinWidth(table);
      saveTableColWidths(table);
    });
  });

  // bỏ style width rỗng trên col thừa
  void cg;
  syncTableMinWidth(table);
}

function enableTableColResize(root) {
  const scope = root || document;
  scope.querySelectorAll('.table-wrap table.table, .table-fill table.table, table.table').forEach((t) => {
    if (!t.closest('.table-wrap, .table-fill, .card, .modal')) return;
    // Cho phép re-init khi đổi desktop ↔ mobile
    if (isNarrowLayout() && t.dataset.colResize === '1') {
      t.dataset.colResize = '';
      t.querySelectorAll('.col-resize-handle').forEach((h) => h.remove());
    }
    enhanceTableColResize(t);
  });
}

let _colResizeObs = null;
function watchTableColResize() {
  enableTableColResize(document.getElementById('app') || document);
  enableTableColResize(document.getElementById('modal-root'));
  if (_colResizeObs || typeof MutationObserver === 'undefined') return;
  _colResizeObs = new MutationObserver(() => {
    clearTimeout(watchTableColResize._t);
    watchTableColResize._t = setTimeout(() => {
      enableTableColResize(document.getElementById('app') || document);
      enableTableColResize(document.getElementById('modal-root'));
    }, 40);
  });
  const app = document.getElementById('app');
  const modal = document.getElementById('modal-root');
  if (app) _colResizeObs.observe(app, { childList: true, subtree: true });
  if (modal) _colResizeObs.observe(modal, { childList: true, subtree: true });
}

// ----- Bảng trượt bên phải (drawer) – xem chi tiết mà không rời danh sách (kiểu ATT DealerOS) -----
function openDrawer(title, eyebrow, html, opts = {}) {
  const el = document.getElementById('drawer');
  if (!el) return;
  const set = (id, val, isHtml) => {
    const n = document.getElementById(id);
    if (!n) return;
    if (isHtml) n.innerHTML = val || ''; else n.textContent = val || '';
    n.classList.toggle('hidden', !val);
  };
  const t = document.getElementById('drawerTitle');
  if (t) t.textContent = title || '';
  set('drawerEyebrow', eyebrow);
  set('drawerStatus', opts.statusHtml, true);
  set('drawerActions', opts.actionsHtml, true);
  set('drawerSub', opts.sub);
  const body = document.getElementById('drawerBody');
  const keepTop = opts.keepScroll && body ? body.scrollTop : 0;
  if (body) body.innerHTML = html || '';
  el.querySelector('.drawer-head > .wd-tools')?.remove();
  const tools = body && body.querySelector('.wd-toolbar .wd-tools');
  const closeBtn = document.getElementById('drawerClose');
  if (tools && closeBtn) closeBtn.before(tools);
  const wasHidden = el.classList.contains('hidden');
  el.classList.remove('hidden');
  const bd = document.getElementById('drawerBackdrop');
  if (bd) bd.classList.remove('hidden');
  document.body.classList.add('drawer-open');
  if (body) body.scrollTop = keepTop;
  if (wasHidden) {
    drawerReturnFocus = document.activeElement;
    if (closeBtn && !isTouchUi()) setTimeout(() => closeBtn.focus({ preventScroll: true }), 30);
  }
}
let drawerReturnFocus = null;
function closeDrawer() {
  const el = document.getElementById('drawer');
  const wasOpen = el && !el.classList.contains('hidden');
  el?.classList.add('hidden');
  document.getElementById('drawerBackdrop')?.classList.add('hidden');
  document.body.classList.remove('drawer-open');
  const back = drawerReturnFocus;
  drawerReturnFocus = null;
  if (wasOpen && back && back !== document.body && document.body.contains(back)) try { back.focus({ preventScroll: true }); } catch { /* ignore */ }
}

/* ---------- Xem ảnh ngay trong app (ảnh trong .gallery): ‹ › / phím mũi tên / vuốt, chạm ảnh để phóng to, Esc đóng ---------- */
// Link Google Drive (trang xem HTML) → ảnh trực tiếp; ảnh lỗi (chưa đăng nhập Google / không có quyền) thì dùng ảnh thu nhỏ đã lưu
function lbDirectUrl(href) {
  try {
    const u = new URL(href, window.location.href);
    if (!/(^|\.)drive\.google\.com$/.test(u.hostname)) return href;
    const id = (u.pathname.match(/\/d\/([\w-]{10,})/) || [])[1] || u.searchParams.get('id');
    return id ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w2000` : href;
  } catch { return href; }
}
function openLightbox(items, start = 0) {
  if (!items.length) return;
  const list = items.map((it) => (typeof it === 'string' ? { url: it } : it));
  const urls = list.map((it) => it.url);
  let i = Math.max(0, Math.min(start, urls.length - 1));
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Xem ảnh');
  const multi = urls.length > 1;
  lb.innerHTML = `<div class="lb-top"><span class="lb-count"></span>
      <a class="lb-btn lb-open" target="_blank" rel="noopener" title="Mở ảnh gốc" aria-label="Mở ảnh gốc">${icon('download')}</a>
      <button type="button" class="lb-btn lb-close" title="Đóng (Esc)" aria-label="Đóng">${icon('x')}</button></div>
    <div class="lb-stage"><img class="lb-img" alt=""></div>
    ${multi ? `<button type="button" class="lb-btn lb-nav lb-prev" aria-label="Ảnh trước">${icon('chevronLeft')}</button>
    <button type="button" class="lb-btn lb-nav lb-next" aria-label="Ảnh sau">${icon('chevronRight')}</button>` : ''}`;
  const img = lb.querySelector('.lb-img');
  const stage = lb.querySelector('.lb-stage');
  // Ảnh nhỏ chỉ rộng ~320px: giãn vừa khung thay vì hiện đúng cỡ gốc
  const setSrc = (src, small) => {
    img.src = src;
    img.style.width = small ? '100%' : '';
    img.style.height = small ? '100%' : '';
  };
  img.addEventListener('error', () => {
    const fb = list[i].thumb;
    if (fb && img.getAttribute('src') !== fb) setSrc(fb, true);
  });
  // Ảnh Drive: hiện ảnh nhỏ ngay, thử ảnh thu nhỏ cỡ lớn của Drive (trình duyệt tự tải, chỉ được khi đã đăng nhập
  // Google công ty) — không đọc qua Apps Script vì tốn hạn mức Drive của tài khoản GAS
  const show = () => {
    lb.classList.remove('zoom');
    const k = i;
    const it = list[k];
    if (!/drive\.google\.com/i.test(urls[k]) || !it.thumb) { setSrc(lbDirectUrl(urls[k]), false); }
    else {
      setSrc(it.thumb, true);
      const hi = new Image();
      hi.onload = () => { if (i === k && hi.naturalWidth > 400) setSrc(hi.src, false); };
      hi.src = lbDirectUrl(urls[k]);
    }
    lb.querySelector('.lb-open').href = urls[i];
    lb.querySelector('.lb-count').textContent = multi ? `${i + 1} / ${urls.length}` : '';
  };
  const go = (d) => { if (multi) { i = (i + d + urls.length) % urls.length; show(); } };
  const prevFocus = document.activeElement;
  const close = () => {
    window.removeEventListener('keydown', onKey, true);
    lb.remove();
    if (prevFocus && prevFocus.focus) prevFocus.focus();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
    else return;
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  lb.addEventListener('click', (e) => {
    if (e.target.closest('.lb-close')) close();
    else if (e.target.closest('.lb-prev')) go(-1);
    else if (e.target.closest('.lb-next')) go(1);
    else if (e.target === img) lb.classList.toggle('zoom');
    else if (e.target === stage || e.target === lb) close();
  });
  let x0 = null;
  stage.addEventListener('touchstart', (e) => { x0 = e.touches.length === 1 && !lb.classList.contains('zoom') ? e.touches[0].clientX : null; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  });
  window.addEventListener('keydown', onKey, true);
  document.body.appendChild(lb);
  show();
  lb.querySelector('.lb-close').focus();
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('.gallery a.thumb[href]');
  if (!a || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
  e.preventDefault();
  const links = [...a.closest('.gallery').querySelectorAll('a.thumb[href]')];
  openLightbox(links.map((l) => ({ url: l.href, thumb: l.querySelector('img')?.src || '' })), links.indexOf(a));
}, true);

