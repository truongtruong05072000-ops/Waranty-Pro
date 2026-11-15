# -*- coding: utf-8 -*-
import sys
import re

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add importDealerPortalClipboard function
dp_clip_fn = """
window.importDealerPortalClipboard = async function(){
  try {
    let text = '';
    if(navigator.clipboard && navigator.clipboard.readText){
      try { text = await navigator.clipboard.readText(); } catch(err){}
    }
    if(!text || (!text.includes('warrantyClaimNumber') && !text.includes('totalRequestedAmountInclTax') && !text.includes('WARRANTY_CLAIMS'))){
      text = prompt('📋 Dán chuỗi JSON hoặc mảng đề xuất bảo hành từ VinFast Dealer Portal vào ô bên dưới:');
    }
    if(!text || !text.trim()) return;
    
    window.parseDealerPortalJson(text, 'VinFast Dealer Portal (Nhập từ Clipboard)', true);
  } catch(e){
    alert('Lỗi: ' + e.message);
  }
};
"""

if 'window.importDealerPortalClipboard =' not in content:
    content = content.replace('window.importServiceOsClipboard = async function(){', dp_clip_fn + '\nwindow.importServiceOsClipboard = async function(){')
    print("Added importDealerPortalClipboard function.")

# 2. Update paste event listener
new_paste = """window.addEventListener('paste', function(e){
  const target = e.target;
  if(target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
  const clipboardData = e.clipboardData || window.clipboardData;
  if(!clipboardData) return;
  const text = clipboardData.getData('text');
  if(!text) return;

  // 1. Nhận diện tự động dữ liệu Đề xuất bảo hành VinFast Dealer Portal
  if(text.includes('warrantyClaimNumber') || text.includes('totalRequestedAmountInclTax') || text.includes('WARRANTY_CLAIMS')){
    e.preventDefault();
    window.parseDealerPortalJson(text, 'VinFast Dealer Portal (Dán Ctrl+V)', true);
    return;
  }

  // 2. Nhận diện dữ liệu xe xưởng ServiceOS khi ở tab checkxe
  const navTab = document.querySelector('.nav-tab.active');
  const curTab = navTab ? navTab.dataset.tab : '';
  if(curTab === 'checkxe'){
    const parsed = parseServiceOsText(text);
    if(parsed && parsed.length > 0){
      e.preventDefault();
      const orders = parsed.map((d, i) => normalizeOrder(d, i));
      state.checkXe.orders = orders;
      saveCheckXeOrders();
      renderCheckXe();
      alert(`🎉 ĐÃ DÁN THÀNH CÔNG ${orders.length} XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!`);
    }
  }
});"""

content = re.sub(
    r"window\.addEventListener\('paste', function\(e\)\{.*?\}\);\n",
    new_paste + "\n",
    content,
    flags=re.DOTALL
)
print("Updated paste event listener.")

# 3. Add button in Tab 6 (Settings) dropzone area
old_dropzone = """        <div>
          <div class="dropzone" id="dz1">"""
new_dropzone = """        <div>
          <div style="margin-bottom:12px;display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn primary" onclick="importDealerPortalClipboard()" style="font-size:12.5px;padding:8px 14px">
              📋 Dán JSON Dealer Portal (Ctrl+V)
            </button>
            <button class="btn secondary" onclick="openBookmarkletModal('api')" style="font-size:12.5px;padding:8px 14px">
              ⚡ Đồng bộ API ServiceOS
            </button>
          </div>
          <div class="dropzone" id="dz1">"""

if old_dropzone in content:
    content = content.replace(old_dropzone, new_dropzone, 1)
    print("Added Dealer Portal paste button to Tab 6.")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved app_template2.html successfully.")
