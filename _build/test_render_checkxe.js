const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf8');

const dom = {
  documentElement: { getAttribute: ()=>null, style: {} },
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id,
        innerHTML: '',
        innerText: '',
        textContent: '',
        style: {},
        classList: { add: ()=>{}, remove: ()=>{}, toggle: ()=>{} },
        addEventListener: ()=>{},
        appendChild: ()=>{},
        querySelectorAll: ()=>[]
      };
    }
    return this.elements[id];
  },
  querySelector(sel) {
    return this.getElementById(sel.replace('#', ''));
  },
  querySelectorAll(sel) {
    return [];
  }
};

const window = {
  document: dom,
  location: { href: 'http://localhost' },
  localStorage: { getItem: ()=>null, setItem: ()=>{} },
  addEventListener: ()=>{},
  ICONS: { carCheck: '', zap: '', folder: '', checkCircle: '', alertTriangle: '', alertCircle: '', edit: '' }
};

const scriptMatches = html.match(/<script[\s\S]*?<\/script>/gi) || [];
const code = scriptMatches.map(s => s.replace(/<\/?script[^>]*>/gi, '')).join('\n');

const sandbox = {
  window,
  document: dom,
  location: window.location,
  console,
  setTimeout: ()=>{},
  setInterval: ()=>{},
  localStorage: window.localStorage,
  XLSX: { read: ()=>({ SheetNames: [] }) }
};

try {
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  const out = vm.runInContext('renderCheckXe(); ({ orders: state.checkXe.orders.length, htmlLen: document.getElementById("checkXeContent").innerHTML.length })', sandbox);
  console.log('Result:', out);
} catch (e) {
  console.error('CRASH:', e);
}
