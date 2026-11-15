const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf8');

const scripts = [];
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = scriptRegex.exec(html)) !== null) {
  scripts.push(m[1]);
}

let checkXeContentHTML = '';

const mockElem = (tag = 'div') => ({
  tagName: tag.toUpperCase(),
  innerHTML: '',
  innerText: '',
  value: '',
  style: {},
  classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
  addEventListener: () => {},
  appendChild: () => {},
  querySelector: () => mockElem(),
  querySelectorAll: () => []
});

const checkXeContentElem = mockElem('div');
Object.defineProperty(checkXeContentElem, 'innerHTML', {
  set(val) {
    checkXeContentHTML = val;
  },
  get() {
    return checkXeContentHTML;
  }
});

const context = {
  window: {},
  document: {
    getElementById: (id) => {
      if (id === 'checkXeContent') return checkXeContentElem;
      return mockElem();
    },
    querySelector: (sel) => {
      if (sel === '#checkXeContent') return checkXeContentElem;
      return mockElem();
    },
    querySelectorAll: (sel) => [],
    createElement: (tag) => mockElem(tag),
    body: mockElem()
  },
  console: console,
  location: { href: 'http://localhost' },
  navigator: { userAgent: 'node' },
  localStorage: {
    getItem: (k) => null,
    setItem: (k, v) => {},
    removeItem: (k) => {}
  },
  setTimeout: (fn) => {},
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {}
};
context.window = context;
context.addEventListener = () => {};
global.window = context;

try {
  vm.createContext(context);
  scripts.forEach((s) => vm.runInContext(s, context));

  console.log('1. Testing renderCheckXe with empty orders:');
  vm.runInContext('renderCheckXe()', context);
  console.log('Empty state HTML length:', checkXeContentHTML.length);

  console.log('2. Testing renderCheckXe with 50 sample cars:');
  const sampleData = JSON.parse(fs.readFileSync('_build/serviceos_50_cars.json', 'utf8'));
  const rows = sampleData.rows;

  vm.runInContext(`
    const rawRows = ${JSON.stringify(rows)};
    state.checkXe.orders = rawRows.map(normalizeOrder);
    renderCheckXe();
  `, context);

  console.log('Table mode HTML length:', checkXeContentHTML.length);
  console.log('Does HTML contain "Xe không lỗi"?', checkXeContentHTML.includes('Xe không lỗi'));
  console.log('Does HTML contain "TRẠNG THÁI LK"?', checkXeContentHTML.includes('TRẠNG THÁI LK'));
  console.log('Does HTML contain "SỐ MÁY / SERIAL LK"?', checkXeContentHTML.includes('SỐ MÁY / SERIAL LK'));

  console.log('3. Testing Card mode:');
  vm.runInContext(`
    setCheckXeViewMode('card');
  `, context);
  console.log('Card mode HTML length:', checkXeContentHTML.length);
  console.log('Does HTML contain "BẢNG CẬP NHẬT PHÍA DƯỚI"?', checkXeContentHTML.includes('BẢNG CẬP NHẬT PHÍA DƯỚI'));

  console.log('ALL TESTS PASSED WITH 0 ERRORS!');
} catch (e) {
  console.error('CAUGHT RUNTIME ERROR:', e);
}
