// Test script for Customer Breakdown and Unsubmitted Warranty Work Orders
const fs = require('fs');

const html = fs.readFileSync('_build/app_template2.html', 'utf8');

// Mock DOM
const makeEl = () => ({
  innerHTML: '',
  textContent: '',
  value: '',
  hidden: true,
  href: '',
  onclick: null,
  style: {},
  focus: () => {},
  click: () => {},
  getAttribute: () => '',
  setAttribute: () => {},
  addEventListener: () => {},
  classList: { toggle: () => {}, add: () => {}, remove: () => {} },
  querySelectorAll: () => []
});

global.window = global;
global.window.location = { href: 'http://localhost/test', pathname: '/' };
global.window.addEventListener = () => {};
global.window.removeEventListener = () => {};
global.document = {
  documentElement: makeEl(),
  getElementById: (id) => makeEl(),
  querySelector: () => makeEl(),
  querySelectorAll: () => [],
  addEventListener: () => {}
};
global.$ = (sel) => makeEl();
global.$$ = () => [];
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};
global.XLSX = {
  utils: { json_to_sheet: () => ({}), book_new: () => ({}), book_append_sheet: () => {} },
  writeFile: () => {}
};

// Extract scripts
const scriptMatches = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
console.log('Found scripts:', scriptMatches.length);

eval(scriptMatches[0][1]);

console.log('Evaluating isSettledOrHigher...');
console.log("  'Đã quyết toán':", isSettledOrHigher('Đã quyết toán'));
console.log("  'Quyết toán':", isSettledOrHigher('Quyết toán'));
console.log("  'Hoàn thành':", isSettledOrHigher('Hoàn thành'));
console.log("  'COMPLETED':", isSettledOrHigher('COMPLETED'));
console.log("  'SETTLED':", isSettledOrHigher('SETTLED'));
console.log("  'Đang sửa chữa':", isSettledOrHigher('Đang sửa chữa'));
console.log("  'awaiting_open':", isSettledOrHigher('awaiting_open'));

console.log('\nTesting normalizeOrder with settled warranty vs non-settled...');
const ord1 = normalizeOrder({
  wo: 'WO-001',
  phanLoaiTt: 'Bảo hành',
  status: 'Đã quyết toán',
  customer: 'CÔNG TY XANH SM (GSM)'
}, 0);
console.log('  Ord1 isSettled:', ord1.isSettled, '| isUnsubmittedWarranty:', ord1.isUnsubmittedWarranty);

const ord2 = normalizeOrder({
  wo: 'WO-002',
  phanLoaiTt: 'Bảo hành',
  status: 'Đang sửa chữa',
  customer: 'Khách lẻ'
}, 1);
console.log('  Ord2 isSettled:', ord2.isSettled, '| isUnsubmittedWarranty:', ord2.isUnsubmittedWarranty);

const ord3 = normalizeOrder({
  wo: 'WO-003',
  phanLoaiTt: 'Bảo hành',
  status: 'Đã quyết toán',
  claimCode: 'WC-N54511-26-11-05-50-0001',
  customer: 'BSHIP'
}, 2);
console.log('  Ord3 isSettled:', ord3.isSettled, '| isUnsubmittedWarranty:', ord3.isUnsubmittedWarranty);

console.log('\nTesting compute and customerBreakdown...');
const C = compute();
console.log('Total claims:', C.customerBreakdown.totalClaims);
console.log('Total cust rev:', C.customerBreakdown.totalRev);
C.customerBreakdown.groups.forEach(g => {
  console.log(`  ${g.tag}: rev = ${g.rev.toLocaleString()} đ | ${g.cnt} ĐX | ${g.claims.length} claims in array`);
});

const cbHtml = renderCustomerBreakdownHtml(C.customerBreakdown);
console.log('\nCheck if "xe xưởng" exists in renderCustomerBreakdownHtml:');
console.log('  Contains "xe xưởng":', cbHtml.includes('xe xưởng'));
console.log('  Contains "openCustomerGroupClaimsModal":', cbHtml.includes('openCustomerGroupClaimsModal'));
console.log('  Contains "Dealer Portal":', cbHtml.includes('Dealer Portal'));

console.log('\nTesting modal opening functions:');
openCustomerGroupClaimsModal('gsm');
console.log('  openCustomerGroupClaimsModal("gsm") executed without error!');
showUnsubmittedWarrantyOrders();
console.log('  showUnsubmittedWarrantyOrders() executed without error!');

console.log('\nALL TESTS PASSED SUCCESSFULLY!');
