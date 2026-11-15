const fs = require('fs');
const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf-8');

const s1 = html.indexOf('function matchCategoryFromFaults(');
const s2 = html.indexOf('function loadCheckXeOrders(){');
const fnCode = html.substring(s1, s2);

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

function hasTextContent(str){ return !!(str && String(str).trim() && String(str).trim() !== '—'); }
function esc(s){ return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function formatDisplayDate(d){ return d; }
function formatIsoDate(d){ return '2026-11-05'; }
function numf(n){ return n; }
function evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat){
  if(hasLoi && hasKtvNote && !hasBangCapNhat) return { code: 'recheck', label: 'Cần check lại' };
  if(hasLoi && !hasKtvNote && !hasBangCapNhat) return { code: 'unchecked', label: 'Chưa check' };
  if(hasLoi && hasBangCapNhat) return { code: 'checked', label: 'Đã check' };
  return { code: 'normal', label: 'Bình thường' };
}

eval(fnCode);

console.log('=== TEST MOTOR CAR (HÌNH ẢNH 1 SERVICEOS) ===');
const motorCar = normalizeOrder({
  code: 'N54511-261105-0023',
  plate: '59TA-12345',
  vin: 'RPXP1LHHVPE...',
  model: 'Evo 200',
  diagnosis: 'Lỗi động cơ',
  faults: ['Lỗi động cơ'],
  dms_warranty_code: 'N54511-WO-261105-0023',
  dms_warranty_status: 'Chờ lắp động cơ',
  motor_serial_old: 'VFHCEAD230609D0030',
  motor_removed_at: '05/11/2026',
  received_at: '05/11/2026'
}, 0);

console.log('Plate:', motorCar.plate);
console.log('Category:', motorCar.category.name);
console.log('IssueDesc:', motorCar.issueDesc);
console.log('HasBangCapNhat:', motorCar.hasBangCapNhat);
console.log('CheckStatus:', motorCar.checkStatus.label);
console.log('HTML Bang Cap Nhat:');
console.log(formatBangCapNhatHtml(motorCar).trim());
