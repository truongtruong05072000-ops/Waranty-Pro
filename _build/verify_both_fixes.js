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
console.log('Total orders in state.checkXe.orders:', orders.length);

const unsubmitted = orders.filter(o => o.isUnsubmittedWarranty);
console.log('Total unsubmitted warranty orders:', unsubmitted.length);

unsubmitted.forEach((o, i) => {
  console.log(`  [${i+1}] WO: ${o.wo} | Plate: ${o.plate} | VIN: ${o.vin} | Status: ${o.status} | Cust: ${o.customer}`);
});

const C = window.computeAll();
console.log('\n--- COMPUTED RESULTS ---');
console.log('C.unsubmittedWarrantyOrders count in computeAll:', C.unsubmittedWarrantyOrders.length);
console.log('Total claims in Dealer Portal:', C.recs.length);
console.log('Cancelled claims in Dealer Portal:', C.recs.filter(r => r.isCancelled).length);
console.log('Return Level 1 count:', C.returnMetrics.returnL1Count);
console.log('Return Level 2 count:', C.returnMetrics.returnL2Count);
console.log('Total returned count:', C.returnMetrics.totalReturnedCount);
console.log('Return rate:', C.returnMetrics.returnRate.toFixed(2), '%');
console.log('Is Return Rate <= 1.0% OK?:', C.returnMetrics.isReturnRateOk);
