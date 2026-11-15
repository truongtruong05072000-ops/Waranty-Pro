const fs = require('fs');

const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf8');

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

const elements = {};
function getEl(id) {
  if (!elements[id]) elements[id] = makeEl();
  return elements[id];
}

global.window = global;
global.window.location = { href: 'http://localhost/test', pathname: '/' };
global.window.addEventListener = () => {};
global.document = {
  documentElement: makeEl(),
  getElementById: (id) => getEl(id),
  querySelector: (sel) => getEl(sel.replace('#', '')),
  querySelectorAll: () => []
};
global.$ = (sel) => getEl(sel.replace('#', ''));
global.$$ = () => [];
global.localStorage = { getItem: () => null, setItem: () => {} };

const scriptMatches = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
eval(scriptMatches[1][1]);

console.log('window.state.checkXe.orders.length:', window.state.checkXe.orders.length);
if (window.state.checkXe.orders.length > 0) {
  const o0 = window.state.checkXe.orders[0];
  console.log('o0:', o0.wo, '| isSettled:', o0.isSettled, '| isWarrantyPayment:', o0.isWarrantyPayment, '| isUnsubmittedWarranty:', o0.isUnsubmittedWarranty);
  const settledOrders = window.state.checkXe.orders.filter(o => o.isSettled);
  console.log('Total settled orders:', settledOrders.length);
  const warrantyOrders = window.state.checkXe.orders.filter(o => o.isWarrantyPayment);
  console.log('Total warranty orders:', warrantyOrders.length);
  const both = window.state.checkXe.orders.filter(o => o.isSettled && o.isWarrantyPayment);
  console.log('Total settled + warranty orders:', both.length);
  both.forEach(o => console.log('  Both:', o.wo, '| claimCode:', o.claimCode));
}
