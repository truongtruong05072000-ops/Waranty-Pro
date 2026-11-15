// Node test for CheckXe logic
const fs = require('fs');

const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>[\s\S]*?<script>([\s\S]*?)<\/script>[\s\S]*?<script>([\s\S]*?)<\/script>/);
const mainJs = scriptMatch[3];

// Setup mock browser environment
const window = { 
  location: { href: 'http://localhost/' },
  addEventListener: () => {}
};
const mockEl = { style: {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} }, addEventListener: () => {} };
const document = { querySelector: () => mockEl, querySelectorAll: () => [], getElementById: () => mockEl, body: mockEl };
const localStorage = { getItem: () => null, setItem: () => null };

// Eval the functions
const codeToRun = `
${mainJs}

// Let's test normalizeOrder and eligibility
const samples = [
  { wo: 'WO-01', plate: '29A-11111', issue: 'Lỗi nút TopCover', status: 'Trong xưởng', warrantyStatus: '', note: '' },
  { wo: 'WO-02', plate: '29A-22222', issue: 'Lỗi động cơ', status: 'Đang sửa', warrantyStatus: 'Chờ kiểm tra', note: 'Đã thay bạc đạn' },
  { wo: 'WO-03', plate: '29A-33333', issue: 'Lỗi giảm sóc sau', status: 'Hoàn thành', warrantyStatus: '', note: '' },
  { wo: 'WO-04', plate: '29A-44444', issue: 'Lỗi giảm xóc trước', status: 'GSM đã nghiệm thu', warrantyStatus: 'checking', note: '' },
  { wo: 'WO-05', plate: '29A-55555', issue: 'Bảo dưỡng 1000km', status: 'Trong xưởng', warrantyStatus: '', note: '' },
  { wo: 'WO-06', plate: '29A-66666', issue: 'Lỗi PIN', status: 'Trong xưởng', warrantyStatus: 'Đã duyệt BH', note: '' },
  { wo: 'WO-07', plate: '29A-77777', issue: 'Lỗi sạc', status: 'Trong xưởng', warrantyStatus: 'none', note: 'KTV check ok' },
  { wo: 'WO-08', plate: '29A-88888', issue: 'Lỗi Esim', status: 'Trong xưởng', warrantyStatus: '', note: '' },
  { wo: 'WO-09', plate: '29A-99999', issue: 'Lỗi HMI', status: 'waiting_repair', warrantyStatus: 'checking', note: '' },
  { wo: 'WO-10', plate: '50E-10101', issue: 'Lỗi MCU', status: 'Trong xưởng', warrantyStatus: '—', note: '' },
  { wo: 'WO-11', plate: '50E-12121', issue: 'Lỗi SCU', status: 'Trong xưởng', warrantyStatus: '', note: '' },
  { wo: 'WO-12', plate: '50E-13131', issue: 'Lỗi DC - DC', status: 'Trong xưởng', warrantyStatus: '', note: '' },
  { wo: 'WO-13', plate: '50E-14141', issue: 'Lỗi bộ dây điện', status: 'Trong xưởng', warrantyStatus: '', note: '' },
];

const normalized = samples.map((s, i) => normalizeOrder(s, i));

console.log('--- TEST RESULTS ---');
normalized.forEach(o => {
  console.log(\`WO: \${o.wo} | Category: \${o.category.name} | Eligible: \${o.isEligible} | Checked: \${o.isChecked}\`);
});

const eligible = normalized.filter(o => o.isEligible);
console.log(\`Total eligible: \${eligible.length} / \${normalized.length}\`);
const unchecked = eligible.filter(o => !o.isChecked);
console.log(\`Eligible but unchecked: \${unchecked.length}\`);
const checked = eligible.filter(o => o.isChecked);
console.log(\`Eligible and checked: \${checked.length}\`);
`;

const fn = new Function('window', 'document', 'localStorage', 'console', codeToRun);
fn(window, document, localStorage, console);
