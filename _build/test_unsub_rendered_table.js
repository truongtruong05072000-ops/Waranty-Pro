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
console.log('Script count in file:', scriptMatches.length);
// Evaluate main app script (the second one)
eval(scriptMatches[1][1]);

const C = window.computeAll();

console.log('Unsubmitted warranty orders count:', C.unsubmittedWarrantyOrders.length);
C.unsubmittedWarrantyOrders.forEach((o, i) => {
  console.log(`  [${i+1}] WO: ${o.wo} | Plate: ${o.plate} | Status: ${o.status} | Customer: ${o.customer} | isWarrantyPayment: ${o.isWarrantyPayment}`);
});

window.renderAll();
const overviewHtml = getEl('overviewContent').innerHTML;

console.log('Overview HTML has unsubmitted card:', overviewHtml.includes('Danh sách Lệnh sửa chữa Bảo hành đã Quyết toán CHƯA LÀM ĐỀ XUẤT'));
console.log('Overview HTML has unsubmitted orders count:', overviewHtml.includes(`${C.unsubmittedWarrantyOrders.length} lệnh`));

console.log('TEST COMPLETED SUCCESSFULLY!');
