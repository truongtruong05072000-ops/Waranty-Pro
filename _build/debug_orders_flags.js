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

const orders = window.state.checkXe.orders;
console.log('Orders length:', orders.length);

orders.forEach((o, idx) => {
  if (idx < 10 || o.isSettled || o.isWarrantyPayment) {
    console.log(`[${idx+1}] WO: ${o.wo} | Plate: ${o.plate} | Status: "${o.status}" | phanLoaiTt: "${o.phanLoaiTt}" | isSettled: ${o.isSettled} | isWarrantyPayment: ${o.isWarrantyPayment} | claimCode: "${o.claimCode}" | isUnsubmittedWarranty: ${o.isUnsubmittedWarranty}`);
  }
});
