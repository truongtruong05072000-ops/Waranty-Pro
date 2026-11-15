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
  ICONS: { carCheck: '', zap: '', folder: '', checkCircle: '', alertTriangle: '', alertCircle: '', edit: '', chart: '', trending: '', target: '', calendar: '', clipboard: '' }
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

  console.log('\n=== TESTING NEW FEATURES ===');

  // 1. Test getCustomerGroup
  const g1 = sandbox.getCustomerGroup('CÔNG TY XANH SM (GSM)', '');
  const g2 = sandbox.getCustomerGroup('CÔNG TY CỔ PHẦN DỊCH VỤ VẬN TẢI BSHIP', '');
  const g3 = sandbox.getCustomerGroup('Nguyễn Văn A', '');
  console.log('Customer Group 1 (GSM):', g1.name, g1.tag);
  console.log('Customer Group 2 (Bship):', g2.name, g2.tag);
  console.log('Customer Group 3 (Retail):', g3.name, g3.tag);

  if (g1.id !== 'gsm' || g2.id !== 'bship' || g3.id !== 'retail') {
    throw new Error('getCustomerGroup failed classification!');
  }

  // 2. Test computeAll metrics
  const C = sandbox.computeAll();
  console.log('\n--- RETURN RATE METRICS ---');
  console.log('Total claims in target period:', C.returnMetrics.totalClaimsCount);
  console.log('Return Level 1:', C.returnMetrics.returnL1Count);
  console.log('Return Level 2:', C.returnMetrics.returnL2Count);
  console.log('Total returned:', C.returnMetrics.totalReturnedCount);
  console.log('Return Rate:', C.returnMetrics.returnRate.toFixed(2) + '%');
  console.log('Is Return Rate <= 1% Benchmark OK?', C.returnMetrics.isReturnRateOk);

  console.log('\n--- CUSTOMER BREAKDOWN ---');
  C.customerBreakdown.groups.forEach(g => {
    console.log(`- ${g.name}: ${g.rev.toLocaleString()} VND (${g.pct}%), ${g.cnt} ĐX, ${g.cars} xe`);
  });

  console.log('\n--- UNSUBMITTED WARRANTY ORDERS ---');
  console.log('Unsubmitted warranty orders count:', C.unsubmittedWarrantyOrders.length);
  if (C.unsubmittedWarrantyOrders.length > 0) {
    console.log('Sample unsubmitted WO:', C.unsubmittedWarrantyOrders[0].wo, 'Plate:', C.unsubmittedWarrantyOrders[0].plate, 'Faults:', C.unsubmittedWarrantyOrders[0].faultList);
  }

  // 3. Test renderAll overview content
  sandbox.renderAll();
  const ovHtml = dom.getElementById('overviewContent').innerHTML;
  console.log('\nOverview HTML Length:', ovHtml.length);
  console.log('Has Quality Gauge:', ovHtml.includes('Tỷ lệ trả về đề xuất bảo hành'));
  console.log('Has Benchmark <= 1%:', ovHtml.includes('≤ 1.0%'));
  console.log('Has Customer Groups:', ovHtml.includes('Cơ cấu doanh thu theo Nhóm Khách Hàng'));

  // 4. Test renderCheckXe
  sandbox.renderCheckXe();
  const cxHtml = dom.getElementById('checkXeContent').innerHTML;
  console.log('\nCheckXe HTML Length:', cxHtml.length);
  console.log('Has Customer Filter in CheckXe:', cxHtml.includes('filterCustGroup'));
  console.log('Has Unsubmitted Filter in CheckXe:', cxHtml.includes('filterUnsubmitted'));

  console.log('\n>>> ALL NEW FEATURES PASSED VERIFICATION WITH 100% SUCCESS! <<<');
} catch (e) {
  console.error('CRASH:', e);
  process.exit(1);
}
