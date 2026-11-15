const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('_build/app_template2.html', 'utf8');

const mockLocalStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; }
};

const domMock = {
  innerHTML: '',
  textContent: '',
  value: '',
  style: {},
  classList: { add: ()=>{}, remove: ()=>{}, contains: ()=>false, toggle: ()=>false },
  setAttribute: ()=>{},
  getAttribute: ()=>null,
  addEventListener: ()=>{}
};

const windowMock = {
  location: { href: 'http://localhost/' },
  addEventListener: ()=>{},
  localStorage: mockLocalStorage,
  DEALER_CLAIMS_MAP: new Map(),
  ICONS: {
    target: '', checkCircle: '', calendar: '', zap: '', clipboard: '', chart: '', trending: ''
  },
  document: {
    documentElement: { getAttribute: ()=>null, style: {} },
    querySelector: () => domMock,
    querySelectorAll: () => [],
    getElementById: () => domMock,
    createElement: () => domMock
  },
  navigator: { userAgent: 'node' }
};

const context = vm.createContext({
  window: windowMock,
  document: windowMock.document,
  location: windowMock.location,
  localStorage: mockLocalStorage,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Math: Math,
  Date: Date,
  Number: Number,
  String: String,
  Array: Array,
  Map: Map,
  Set: Set,
  JSON: JSON
});

const scripts = [];
const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  scripts.push(match[1]);
}

console.log('Found', scripts.length, 'script tags in HTML');

try {
  for (let i = 0; i < scripts.length; i++) {
    vm.runInContext(scripts[i], context);
  }
  console.log('Scripts executed successfully');
} catch (e) {
  console.error('Script exec error:', e.message);
  process.exit(1);
}

const res = vm.runInContext(`
  initDealerClaimsMap();
  const C = computeAll();
  const tYm = settings.targetMonth;
  const t = C.target;
  const targetConf = t.conf;
  const targetPipe = t.pipe;
  const expected = C.expectedPlan;
  
  const mList = [...C.months.entries()].map(([m, data]) => ({
    m,
    conf: data.conf,
    cnt: data.cnt,
    pipe: data.pipe,
    pCnt: data.pCnt
  }));
  
  JSON.stringify({
    targetMonth: tYm,
    cut: settings.cut,
    cycle22: settings.cycle22,
    targetConf,
    targetCnt: t.cnt,
    targetPipe,
    targetPCnt: t.pCnt,
    expected,
    months: mList,
    claimsCount: C.recs.length,
    planPartsCount: C.plan.length,
    parts3Count: C.parts3.length,
    propsNeed: C.propsNeed
  }, null, 2);
`, context);

console.log('Result from in-memory app:\n', res);
