# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

# We can run node to test PhanTichBaoHanh.html directly
import subprocess
res = subprocess.run(['node', '-e', """
const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf8');

const scripts = [];
const scriptRegex = /<script\\b[^>]*>([\\s\\S]*?)<\\/script>/gi;
let m;
while ((m = scriptRegex.exec(html)) !== null) { scripts.push(m[1]); }

const mockElem = () => ({
  innerHTML: '', innerText: '', value: '', style: {},
  classList: { add: () => {}, remove: () => {}, toggle: () => {} },
  addEventListener: () => {}, querySelector: () => mockElem(), querySelectorAll: () => []
});

const context = {
  window: {},
  document: { getElementById: () => mockElem(), querySelector: () => mockElem(), querySelectorAll: () => [], createElement: () => mockElem() },
  console: console, location: { href: 'http://localhost' }, navigator: { userAgent: 'node' },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  setTimeout: () => {}, clearTimeout: () => {}
};
context.window = context; context.addEventListener = () => {};
vm.createContext(context);
scripts.forEach(s => vm.runInContext(s, context));

vm.runInContext('loadCheckXeOrders()', context);
const orders = vm.runInContext('state.checkXe.orders', context);

console.log('Total orders:', orders.length);
const counts = { no_fault: 0, checked: 0, unchecked: 0, recheck: 0 };
orders.forEach((o, i) => {
  counts[o.checkStatus.code] = (counts[o.checkStatus.code] || 0) + 1;
  if (o.checkStatus.code === 'checked' || o.plate === '79NA-14793') {
    console.log(`[${i+1}] ${o.plate} | faults: ${o.faultStr} | TT LK: ${o.partStatusText} | Serial: ${o.partSerialText} | Thao: ${o.partRemovedDateText} | BH: ${o.bhCodeText} | Note: ${o.note || '— Trống'} | Status: ${o.checkStatus.label}`);
  }
});
console.log('Summary counts:', counts);
"""], capture_output=True, text=True, encoding='utf-8')

print(res.stdout)
if res.stderr:
    print("STDERR:", res.stderr)
