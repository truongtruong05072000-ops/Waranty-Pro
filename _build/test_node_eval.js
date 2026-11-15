const fs = require('fs');
const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf-8');

// Extract normalizeOrder and formatBangCapNhatHtml
const s1 = html.indexOf('function matchCategoryFromFaults(');
const s2 = html.indexOf('function loadCheckXeOrders(){');
if (s1 === -1 || s2 === -1) {
  console.error("Functions not found!", s1, s2);
  process.exit(1);
}
const fnCode = html.substring(s1, s2);

const ISSUE_CATEGORIES = [
  { id: 'all', name: 'Tất cả hạng mục', icon: '📋' },
  { id: 'topcover', name: 'Lỗi nút TopCover', icon: '🔘', keywords: ['topcover', 'top cover', 'nút top', 'nut top'] },
  { id: 'motor', name: 'Lỗi động cơ', icon: '⚡', keywords: ['động cơ', 'dong co', 'motor', 'số máy', 'so may'] },
  { id: 'rear_shock', name: 'Lỗi giảm sóc sau', icon: '🛞', keywords: ['giảm sóc sau', 'giảm xóc sau', 'giam soc sau', 'giam xoc sau', 'phuộc sau', 'nhún sau'] },
  { id: 'front_shock', name: 'Lỗi giảm xóc trước', icon: '🚲', keywords: ['giảm xóc trước', 'giảm sóc trước', 'giam xoc truoc', 'giam soc truoc', 'phuộc trước', 'nhún trước'] },
  { id: 'pin', name: 'Lỗi PIN', icon: '🔋', keywords: ['pin', 'battery', 'bms', 'cell', 'lắp pin', 'tháo pin'] },
  { id: 'charger', name: 'Lỗi sạc', icon: '🔌', keywords: ['sạc', 'sac', 'charger', 'củ sạc', 'bộ sạc'] },
  { id: 'esim', name: 'Lỗi Esim', icon: '📶', keywords: ['esim', 'e-sim', 'sim', 'mất sóng', 'mat song', '4g'] },
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
function formatIsoDate(d){ return '2026-11-04'; }
function evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat){
  if(hasLoi && hasKtvNote && !hasBangCapNhat) return { code: 'recheck', label: 'Cần check lại' };
  if(hasLoi && !hasKtvNote && !hasBangCapNhat) return { code: 'unchecked', label: 'Chưa check' };
  if(hasLoi && hasBangCapNhat) return { code: 'checked', label: 'Đã check' };
  return { code: 'normal', label: 'Bình thường' };
}

eval(fnCode);

// Test Car 1: 29C2-07744 (exact data from ServiceOS screenshot)
const car1 = {
  code: 'N54511-261104-009',
  plate: '29C2-07744',
  vin: 'RPXP1LHHVPE060424',
  model: 'Evo 200',
  diagnosis: 'LỖI ĐV',
  faults: ['Lỗi Esim'],
  dms_warranty_code: 'N54511-WO-261104-0012',
  dms_warranty_status: 'Chờ kiểm tra',
  warranty_kinds: ['esim'],
  created_at: '2026-11-04'
};

const normalized1 = normalizeOrder(car1, 0);
console.log('--- CAR 1 EVALUATION ---');
console.log('Plate:', normalized1.plate);
console.log('Category:', normalized1.category.name, normalized1.category.icon);
console.log('Issue (raw):', normalized1.issue);
console.log('IssueDesc:', normalized1.issueDesc);
console.log('Has Bang Cap Nhat:', normalized1.hasBangCapNhat);
console.log('Check Status:', normalized1.checkStatus.label);
console.log('Cards HTML:');
console.log(formatBangCapNhatHtml(normalized1));

// Test Car 2: 59TA-16116 (Lỗi động cơ)
const car2 = {
  code: 'N54511-261104-008',
  plate: '59TA-16116',
  vin: 'RPXP1LHHVPE066173',
  model: 'Evo 200',
  diagnosis: 'chuyển RTO Ngoại quan thay: Bạc Đạn Động Cơ (bg), xinhanh sau phải, mâm sau vênh',
  faults: ['Lỗi động cơ'],
  created_at: '2026-11-04'
};

const normalized2 = normalizeOrder(car2, 1);
console.log('\n--- CAR 2 EVALUATION ---');
console.log('Plate:', normalized2.plate);
console.log('Category:', normalized2.category.name, normalized2.category.icon);
console.log('IssueDesc:', normalized2.issueDesc);
console.log('Has Bang Cap Nhat:', normalized2.hasBangCapNhat);
console.log('Check Status:', normalized2.checkStatus.label);
