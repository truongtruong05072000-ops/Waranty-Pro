const fs = require('fs');

const html = fs.readFileSync('_build/app_template2.html', 'utf8');

const makeEl = () => ({ 
  innerHTML: '', 
  textContent: '', 
  value: '', 
  style: {}, 
  classList: { toggle: ()=>{}, add: ()=>{}, remove: ()=>{} },
  addEventListener: () => {},
  getAttribute: () => '',
  querySelectorAll: () => []
});
global.window = global;
global.window.location = { href: 'http://localhost/test', pathname: '/' };
global.window.addEventListener = () => {};
global.document = {
  documentElement: makeEl(),
  getElementById: () => makeEl(),
  querySelector: () => makeEl(),
  querySelectorAll: () => []
};
global.$ = () => makeEl();
global.$$ = () => [];
global.localStorage = { getItem: () => null, setItem: () => {} };

const scriptMatches = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
eval(scriptMatches[0][1]);

console.log('Total preloaded orders:', SERVICEOS_PRELOAD_ORDERS.length);

const normOrders = SERVICEOS_PRELOAD_ORDERS.map((d, i) => normalizeOrder(d, i));

console.log('Orders breakdown:');
let warrantyCount = 0;
let settledCount = 0;
let unsubCount = 0;

normOrders.forEach((o, i) => {
  if (o.isWarrantyPayment) warrantyCount++;
  if (o.isSettled) settledCount++;
  if (o.isUnsubmittedWarranty) {
    unsubCount++;
    console.log(`  Unsub #${unsubCount}: WO=${o.wo}, Plate=${o.plate}, Status=${o.status}, PhanLoai=${o.phanLoaiTt}`);
  }
});

console.log(`Summary: isWarrantyPayment=${warrantyCount}, isSettled=${settledCount}, isUnsubmittedWarranty=${unsubCount}`);
