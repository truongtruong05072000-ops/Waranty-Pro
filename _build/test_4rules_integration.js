const fs = require('fs');

const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>[\s\S]*?<script>([\s\S]*?)<\/script>[\s\S]*?<script>([\s\S]*?)<\/script>/);
const mainJs = scriptMatch[3];

const mockEl = { style: {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} }, addEventListener: () => {} };
const window = { location: { href: 'http://localhost/' }, addEventListener: () => {} };
const document = { querySelector: () => mockEl, querySelectorAll: () => [], getElementById: () => mockEl, body: mockEl };
const localStorage = { getItem: () => null, setItem: () => null };

const codeToRun = `
${mainJs}

const samples = [
  // Image 2 Case: Has Lỗi PIN + Has Bảng PIN BAT... + Has Ghi chú KTV
  { wo: 'WO-IMG2', plate: '29A-12345', issue: 'Lỗi PIN', pinSerial: 'BAT12006000110003094240522D00038', note: 'Phú tháo pin 1-11' },
  // Rule 1: Có lỗi nhưng không có ghi chú KTV và không có bảng cập nhật
  { wo: 'WO-R1', plate: '29A-11111', issue: 'Lỗi động cơ', note: '' },
  // Rule 4: Có lỗi nhưng chưa có bảng cập nhật dù đã có ghi chú KTV
  { wo: 'WO-R4', plate: '29A-44444', issue: 'Lỗi nút TopCover', note: 'Đã kiểm tra nút' },
  // Rule 2: Không có lỗi và không có ghi chú nhưng có bảng cập nhật
  { wo: 'WO-R2', plate: '29A-22222', issue: '', pinSerial: 'BAT999999', note: '' },
  // Rule 3: Có lỗi + có ghi chú + có bảng cập nhật
  { wo: 'WO-R3', plate: '29A-33333', issue: 'Lỗi SCU', motorSerial: 'MOT1234', note: 'Đã thay SCU' }
];

const normalized = samples.map((s, i) => normalizeOrder(s, i));

console.log('--- 4 RULES VERIFICATION ---');
normalized.forEach(o => {
  console.log(\`WO: \${o.wo} | Category: \${o.category.name} | Status: \${o.checkStatus.label} (\${o.checkStatus.code}) | UpdateTable: "\${o.updateTableText}"\`);
});
`;

const fn = new Function('window', 'document', 'localStorage', 'console', codeToRun);
fn(window, document, localStorage, console);
