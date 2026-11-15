const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf8');

const scripts = [];
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = scriptRegex.exec(html)) !== null) {
  scripts.push(m[1]);
}

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
    querySelectorAll: () => [],
    createElement: () => mockElem(),
    body: mockElem()
  },
  console: console,
  location: { href: 'http://localhost' },
  navigator: { userAgent: 'node' },
  localStorage: {
    getItem: (k) => null, // empty localstorage
    setItem: (k, v) => {},
    removeItem: (k) => {}
  },
  setTimeout: () => {},
  clearTimeout: () => {}
};
context.window = context;
context.addEventListener = () => {};

vm.createContext(context);
scripts.forEach(s => vm.runInContext(s, context));

vm.runInContext('loadCheckXeOrders()', context);
const orders = vm.runInContext('state.checkXe.orders', context);
console.log('Total orders loaded:', orders.length);

const target = orders.find(o => o.plate === '79NA-14793');
if (target) {
  console.log('Found 79NA-14793:');
  console.log('checkStatus:', target.checkStatus);
  console.log('hasLoi:', target.hasLoi);
  console.log('hasKtvNote:', target.hasKtvNote);
  console.log('hasBangCapNhat:', target.hasBangCapNhat);
  console.log('kinds:', target.kinds);
  console.log('bhCode:', target.bhCode);
  console.log('claimCode:', target.claimCode);
  console.log('status:', target.status);
} else {
  console.log('79NA-14793 not found!');
}
