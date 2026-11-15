# -*- coding: utf-8 -*-
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Update getConsoleSnippetCode targetUrl
old_part = """function getConsoleSnippetCode(targetUrl){
  const cleanTarget = (targetUrl || window.location.href).split('#')[0];"""

new_part = """function getConsoleSnippetCode(targetUrl){
  let t = targetUrl || window.location.href;
  if(!t || t.startsWith('file:')) t = 'https://fragrant-heart-e2d4.truongtruong-05072000.workers.dev/';
  const cleanTarget = t.split('#')[0];"""

if old_part in text:
    text = text.replace(old_part, new_part)
    print("Updated cleanTarget in getConsoleSnippetCode!")
else:
    print("Warning: old_part not found in getConsoleSnippetCode")

# Add postMessage listener
if "window.addEventListener('message'" not in text:
    target_pos = text.find('function checkUrlImport(){')
    postMessage_code = """// Nhận dữ liệu qua window.postMessage từ ServiceOS
window.addEventListener('message', function(ev){
  if(ev.data && ev.data.type === 'SERVICEOS_DATA' && Array.isArray(ev.data.orders)){
    const orders = ev.data.orders.map((d, i) => normalizeOrder(d, i));
    state.checkXe.orders = orders;
    saveCheckXeOrders();
    if(typeof window.switchTab === 'function') window.switchTab('checkxe');
    setTimeout(() => {
      alert('🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ' + orders.length + ' XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!');
    }, 120);
  }
});

"""
    text = text[:target_pos] + postMessage_code + text[target_pos:]
    print("Added postMessage listener!")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated app_template2.html successfully!")
