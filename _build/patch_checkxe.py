# -*- coding: utf-8 -*-
import io, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE, 'build_modern_template.py')

with io.open(FILE_PATH, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update switchTab
old_switch = r'''window.switchTab = function(tabId){
  state.activeTab = tabId;
  $$('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  $$('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === 'pane_' + tabId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};'''

new_switch = r'''window.switchTab = function(tabId){
  state.activeTab = tabId;
  $$('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  $$('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === 'pane_' + tabId);
  });
  if(tabId === 'checkxe'){
    renderCheckXe();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};'''

if old_switch in code:
    code = code.replace(old_switch, new_switch)
    print("switchTab updated!")
else:
    print("old_switch not found, checking...")

# 2. Add window exports and paste event listener
old_export = r'''// Generate Bookmarklet link href
function initBookmarkletCode(){'''

new_export = r'''window.handleServiceOsFileSelect = handleServiceOsFileSelect;
window.parseServiceOsWorkbook = parseServiceOsWorkbook;

// Auto-import when pasting on Check Xe tab
window.addEventListener('paste', function(e){
  if(state.activeTab !== 'checkxe') return;
  const clipText = e.clipboardData ? e.clipboardData.getData('text') : '';
  if(clipText && clipText.trim().startsWith('[')){
    try {
      const data = JSON.parse(clipText);
      if(Array.isArray(data) && data.length > 0 && (data[0].plate || data[0].wo)){
        e.preventDefault();
        const orders = data.map((d, i) => {
          const issue = d.issue || 'Kiểm tra sửa chữa';
          const parts = d.parts || [];
          const note = d.note || '';
          return {
            id: d.id || ('ord_' + Date.now() + '_' + i),
            wo: d.wo || '—',
            plate: d.plate || '—',
            vin: d.vin || '—',
            vehicle: d.vehicle || '—',
            customer: d.customer || '—',
            tech: d.tech || 'Chưa phân công',
            issue: issue,
            parts: parts,
            note: note,
            status: d.status || 'Đang xử lý',
            dateStr: d.dateStr || (new Date().toLocaleDateString('vi-VN')),
            category: categorizeIssue(issue, parts),
            isChecked: isOrderChecked(note)
          };
        });
        state.checkXe.orders = orders;
        saveCheckXeOrders();
        renderCheckXe();
        alert('⚡ Đã tự động nhận diện và nạp thành công ' + orders.length + ' xe từ ServiceOS!');
      }
    } catch(err){}
  }
});

// Generate Bookmarklet link href
function initBookmarkletCode(){'''

if old_export in code:
    code = code.replace(old_export, new_export)
    print("Exports and Paste listener added!")

# 3. Enhance handleFiles to auto-route ServiceOS files
old_hf = r'''      if(!recs.length){
        src.status = 'Lỗi: không nhận diện được dữ liệu bảo hành trong file này'; src.err = true;
      } else {'''

new_hf = r'''      const sOrders = parseServiceOsWorkbook(wb);
      if(sOrders && sOrders.length > 0){
        state.checkXe.orders = sOrders;
        saveCheckXeOrders();
        renderCheckXe();
        src.status = 'OK · Nhận diện ' + sOrders.length + ' lệnh sửa chữa ServiceOS (Đã nạp vào mục Check lỗi)';
        src.rows = sOrders.length;
        src.format = 4;
      } else if(!recs.length){
        src.status = 'Lỗi: không nhận diện được dữ liệu bảo hành trong file này'; src.err = true;
      } else {'''

if old_hf in code:
    code = code.replace(old_hf, new_hf)
    print("handleFiles auto-route added!")

# 4. In allActiveRecords skip format 4
old_aar = r'''    if(settings.disabledSrc.has(s.id)) continue;'''
new_aar = r'''    if(settings.disabledSrc.has(s.id) || s.format === 4) continue;'''
if old_aar in code:
    code = code.replace(old_aar, new_aar)
    print("allActiveRecords skip format 4 added!")

with io.open(FILE_PATH, 'w', encoding='utf-8') as f:
    f.write(code)

print("Patching complete!")
