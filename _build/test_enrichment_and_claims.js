const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

// Read app_template2.html
const html = fs.readFileSync('_build/app_template2.html', 'utf8');

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
  localStorage: {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = v; }
  },
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

vm.createContext(sandbox);
vm.runInContext(code, sandbox);

console.log('Script initialized successfully!');
console.log('DEALER_CLAIMS_MAP size:', sandbox.window.DEALER_CLAIMS_MAP.size);

// TEST 1: Car 65 (Row 65 from user screenshot Image 7)
const testCar65 = {
  id: 8400,
  code: "N54511-261028-006",
  plate: "65MA-153.23",
  vin: "RPXN4LHHVRE028738",
  model: "Feliz S",
  customer_name: "KHÁCH LẺ BSHIP",
  technician_name: "Nguyễn Thành Trung",
  symptoms: "LỖI PIN",
  faults: [], // Empty faults in raw ServiceOS
  warranty_kinds: ["pin"],
  battery_serial_old: "BAT12006000120003094240822D00066",
  parts_removed_at: "2026-10-28",
  sent_factory_at: "2026-10-30",
  status: "done"
};

const o65 = vm.runInContext(`normalizeOrder(${JSON.stringify(testCar65)}, 65)`, sandbox);
console.log('\n--- TEST 1: Car 65 (Feliz S, VIN 028738) ---');
console.log('hasLoi:', o65.hasLoi);
console.log('faultList:', o65.faultList);
console.log('category:', o65.category.id, o65.category.name);
console.log('checkStatus:', o65.checkStatus.code, o65.checkStatus.label);
console.log('bhCode:', o65.bhCode);
console.log('claimCode:', o65.claimCode);
console.log('claimAmount:', o65.claimAmount);

assert.strictEqual(o65.hasLoi, true, 'Car 65 must have hasLoi = true');
assert.strictEqual(o65.category.id, 'pin', 'Car 65 category must be pin');
assert.strictEqual(o65.checkStatus.code, 'checked', 'Car 65 must be checked, not no_fault!');
assert.strictEqual(o65.bhCode, 'N54511-WO-261028-0015', 'Car 65 must match Lệnh BH');
assert.strictEqual(o65.claimCode, 'WC-N54511-26-11-05-41-0001', 'Car 65 must match ĐXBH');
assert.strictEqual(o65.claimAmount, 191269, 'Car 65 claimAmount must be 191269');

const cardHtml65 = vm.runInContext(`formatBangCapNhatHtml(${JSON.stringify(o65)})`, sandbox);
assert(cardHtml65.includes('WC-N54511-26-11-05-41-0001'), 'Card must show WC-N54511-26-11-05-41-0001');
assert(cardHtml65.includes('N54511-WO-261028-0015'), 'Card must show N54511-WO-261028-0015');
assert(cardHtml65.includes('191.269'), 'Card must show 191.269 d');
console.log('Card HTML for car 65 verified successfully!');

// TEST 2: Car 79NA-14793 (From user screenshot Image 3, 4, 5)
const testCar79 = {
  plate: '79NA-14793',
  code: 'N54511-261104-004',
  faults: ['Lỗi giảm xóc trước', 'Lỗi Esim'],
  technician_name: null,
  foreman_note: null,
  advisor_note: null,
  symptoms: 'đổi xe khác',
  battery_serial_old: null,
  motor_serial_old: null,
  parts_removed_at: null,
  motor_removed_at: null
};

const o79 = vm.runInContext(`normalizeOrder(${JSON.stringify(testCar79)}, 0)`, sandbox);
console.log('\n--- TEST 2: Car 79NA-14793 ---');
console.log('hasLoi:', o79.hasLoi);
console.log('hasBangCapNhat:', o79.hasBangCapNhat);
console.log('checkStatus:', o79.checkStatus.code, o79.checkStatus.label);

assert.strictEqual(o79.hasLoi, true, 'Car 79NA must have faults');
assert.strictEqual(o79.hasBangCapNhat, false, 'Car 79NA must NOT have update table');
assert.strictEqual(o79.checkStatus.code, 'unchecked', 'Car 79NA must be unchecked, NOT checked!');

// TEST 3: Preloaded revenue sources
console.log('\n--- TEST 3: Dealer Portal Revenue Source ---');
const sources = vm.runInContext('state.sources', sandbox);
console.log('Total sources:', sources.length);
if (sources.length > 0) {
  const dpSrc = sources[0];
  console.log('Source name:', dpSrc.name);
  console.log('Total claims rows:', dpSrc.rows);
  const totalInc = dpSrc.recs.reduce((sum, r) => sum + r.totalInc, 0);
  const totalEx = dpSrc.recs.reduce((sum, r) => sum + r.totalEx, 0);
  console.log('Total Inc VAT:', totalInc.toLocaleString('vi-VN'), 'VND');
  console.log('Total Ex VAT:', totalEx.toLocaleString('vi-VN'), 'VND');
  assert.strictEqual(dpSrc.rows, 100, 'Must have 100 claims');
}

console.log('\nALL 3 TESTS PASSED PERFECTLY!');
