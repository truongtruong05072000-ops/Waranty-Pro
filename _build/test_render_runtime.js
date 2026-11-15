const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf8');

const scripts = [];
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = scriptRegex.exec(html)) !== null) {
  scripts.push(m[1]);
}
console.log('Total scripts found:', scripts.length);

const mockElem = () => ({
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

const context = {
  window: {},
  document: {
    getElementById: (id) => mockElem(),
    querySelector: (sel) => mockElem(),
    querySelectorAll: (sel) => [],
    createElement: (tag) => mockElem(),
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
  scripts.forEach((s, idx) => {
    console.log(`Executing script ${idx}...`);
    vm.runInContext(s, context);
  });
  console.log('All scripts executed without parse error!');

  console.log('Testing renderCheckXe()...');
  const result = vm.runInContext('renderCheckXe()', context);
  console.log('renderCheckXe SUCCESS! Output length:', (result || '').length);
} catch (e) {
  console.error('CAUGHT RUNTIME ERROR:', e);
}
