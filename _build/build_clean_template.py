# -*- coding: utf-8 -*-
import io, os, sys, re

BASE = os.path.dirname(os.path.abspath(__file__))
DEPLOY_HTML = os.path.join(BASE, '..', '_deploy', 'index.html')
OUT_TPL = os.path.join(BASE, 'app_template2.html')

with io.open(DEPLOY_HTML, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Replace the large SheetJS script block with <!--SHEETJS-->
# In index.html, scripts are:
# script 1: gate check
# script 2: xlsx.full.min.js
# script 3: main app code
script_tags = list(re.finditer(r'<script>([\s\S]*?)</script>', html))
print(f"Found {len(script_tags)} script tags in index.html")
assert len(script_tags) >= 3, "Expected at least 3 script tags"

# The second script is SheetJS (around 700KB)
sheetjs_match = script_tags[1]
print("SheetJS script length:", len(sheetjs_match.group(1)))
html = html[:sheetjs_match.start()] + '<!--SHEETJS-->' + html[sheetjs_match.end():]

# 2. Replace password hashes back to placeholders
PASS_SHA = '6907afc7b4a6690b3db425aea974e58e8bbeb19744d94d32d47a2aaea126ff2a'
PASS_FB = 'c52f853'

assert PASS_SHA in html, "PASS_SHA not found in html"
assert PASS_FB in html, "PASS_FB not found in html"
html = html.replace(PASS_SHA, '__PASS_SHA__').replace(PASS_FB, '__PASS_FB__')

# 3. Replace the Bookmarklet Modal with the advanced 1-Click modal
modal_old_start = html.find('<!-- Modal Bookmarklet Hướng Dẫn -->')
modal_old_end = html.find('<!-- Modal Chỉnh sửa Ghi chú KTV -->')
assert modal_old_start != -1 and modal_old_end != -1, "Modal markers not found"

new_modal_bookmarklet = r'''<!-- Modal Bookmarklet Hướng Dẫn -->
<div id="modalBookmarklet" class="modal-overlay" hidden>
  <div class="modal-box">
    <button class="modal-close" onclick="closeBookmarkletModal()">✕</button>
    <div class="modal-title">⚡ Dấu trang 1-Click: Lấy "Xe đang trong xưởng" từ ServiceOS</div>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px">
      Bấm dấu trang này khi đang ở ServiceOS để <b>tự động lấy danh sách xe đang trong xưởng và mở trang Bảo Hành PRO ở tab mới</b> (trang ServiceOS gốc vẫn giữ nguyên, không bị văng).
    </p>

    <div style="background:#f8fafc;border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:14px">
      <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px">1. Đường link trang Bảo Hành PRO của bạn:</div>
      <input type="text" id="bmTargetUrlInput" class="field-input" style="width:100%;font-size:13px;font-family:monospace;background:#ffffff;margin-bottom:10px" oninput="updateBookmarkletHref()">
      
      <div style="text-align:center;padding:12px;background:#ffffff;border:1.5px dashed #cbd5e1;border-radius:var(--radius-md)">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">👉 <b>KÉO NÚT NÀY THẢ LÊN THANH DẤU TRANG (BOOKMARK BAR)</b>:</div>
        <a class="bookmarklet-btn" id="bookmarkletLink" href="javascript:void(0);" onclick="alert('Hãy KÉO nút này thả lên thanh Dấu trang của trình duyệt!');return false;">
          ⚡ Lấy xe trong xưởng ServiceOS
        </a>
        <div style="margin-top:8px">
          <button class="btn secondary" style="font-size:12px;padding:4px 10px" onclick="copyBookmarkletCode()">📋 Hoặc Copy mã Dấu trang (nhập thủ công)</button>
        </div>
      </div>
      <div style="font-size:11.5px;color:var(--text-light);margin-top:8px;text-align:center">(Nếu chưa thấy thanh Dấu trang, nhấn phím <b>Ctrl + Shift + B</b> trên bàn phím Chrome/Edge)</div>
    </div>

    <h4 style="font-size:13.5px;margin:8px 0 6px">Quy trình sử dụng:</h4>
    <ol style="padding-left:20px;font-size:12.5px;line-height:1.6;color:var(--text-main)">
      <li>Mở trang Lệnh sửa chữa trên ServiceOS: <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;color:#2563eb">att-serviceos.anthinhtech.vn/#/work-orders</code> (mục <b>Trong xưởng</b>).</li>
      <li>Bấm vào Dấu trang <b>"⚡ Lấy xe trong xưởng ServiceOS"</b> vừa tạo.</li>
      <li>Trang ServiceOS sẽ hiện thông báo thành công và <b>tự động mở trang Bảo Hành PRO ở 1 TAB MỚI</b> với đầy đủ xe, phân loại hạng mục lỗi và trạng thái check!</li>
    </ol>

    <div style="margin-top:16px;text-align:right">
      <button class="btn secondary" onclick="closeBookmarkletModal()">Đóng</button>
    </div>
  </div>
</div>
'''

html = html[:modal_old_start] + new_modal_bookmarklet + html[modal_old_end:]

# 4. Replace the old bookmarklet code generator with the new URL hash + new tab opener
old_bm_code_marker = html.find('// Generate Bookmarklet link href')
assert old_bm_code_marker != -1, "old_bm_code_marker not found"

# Find end of initBookmarkletCode function
end_of_bm = html.find('/* ============================ Navigation ============================ */', old_bm_code_marker)
assert end_of_bm != -1, "end_of_bm not found"

new_bm_script = r'''// URL Hash Auto-Import when opened from ServiceOS bookmarklet
function checkUrlImport(){
  const hash = window.location.hash;
  if(hash && hash.includes('serviceos=')){
    try {
      const idx = hash.indexOf('serviceos=');
      const raw = hash.slice(idx + 10);
      const jsonStr = decodeURIComponent(raw);
      const data = JSON.parse(jsonStr);
      if(Array.isArray(data) && data.length > 0){
        const orders = data.map((d, i) => {
          const issue = d.issue || 'Kiểm tra sửa chữa';
          const parts = d.parts || [];
          const note = (d.note || '').trim();
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
            status: d.status || 'Trong xưởng',
            dateStr: d.dateStr || (new Date().toLocaleDateString('vi-VN')),
            category: categorizeIssue(issue, parts),
            isChecked: isOrderChecked(note)
          };
        });
        state.checkXe.orders = orders;
        saveCheckXeOrders();
        if(typeof window.switchTab === 'function') window.switchTab('checkxe');
        try { history.replaceState(null, '', location.pathname); } catch(e){}
        setTimeout(() => {
          alert(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ${orders.length} XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!`);
        }, 120);
      }
    } catch(err){
      console.error('Error importing serviceos from URL hash:', err);
    }
  }
}

// Generate Bookmarklet link href
function getBookmarkletCode(targetUrl){
  const cleanTarget = (targetUrl || window.location.href).split('#')[0];
  return `javascript:(async function(){try{let orders=[];if(typeof window.api==='function'&&window.S&&window.S.branch){try{const res=await window.api('GET','/api/work-orders?status=active&branch_id='+window.S.branch+'&page=1&page_size=200');const items=res&&(res.items||res.rows||res.work_orders||(Array.isArray(res)?res:[]));if(items&&items.length>0){orders=items.map((w,idx)=>({id:'ord_'+(w.code||w.id||idx),wo:w.code||w.ro||'—',plate:w.plate||'—',vin:w.vin||'—',vehicle:w.model||'—',customer:w.customer_name||'—',tech:w.technician_name||'Chưa phân công',issue:w.content||w.diag||'Kiểm tra theo yêu cầu',note:(w.foreman_note||'').trim(),status:w.status_label||w.status||'Trong xưởng',dateStr:w.received_at?w.received_at.slice(0,10):(w.created_at?w.created_at.slice(0,10):(new Date().toLocaleDateString('vi-VN'))),isChecked:Boolean((w.foreman_note||'').trim()&&(w.foreman_note||'').trim().toLowerCase()!=='none'&&(w.foreman_note||'').trim()!=='-')}));}}catch(apiErr){console.warn('API fallback to DOM:',apiErr);}}if(!orders.length){const rows=document.querySelectorAll('table tbody tr');if(rows&&rows.length>0){rows.forEach((tr,rIdx)=>{const getCol=(colName)=>{const td=tr.querySelector('td[data-col=\"'+colName+'\"]');if(!td)return '';const inp=td.querySelector('input, textarea');return (inp?inp.value:td.innerText).trim();};const plate=getCol('plate');const code=getCol('code');if(!plate&&!code)return;const foremanNote=getCol('foreman_note');const content=getCol('content')||getCol('diag');const tech=getCol('tech');const model=getCol('model');const vin=getCol('vin');const status=getCol('status');const received=getCol('received')||getCol('repair_at');orders.push({id:'ord_'+(code||plate||rIdx),wo:code||'—',plate:plate||'—',vin:vin||'—',vehicle:model||'—',tech:tech||'Chưa phân công',issue:content||'Kiểm tra sửa chữa',note:foremanNote,status:status||'Trong xưởng',dateStr:received||(new Date().toLocaleDateString('vi-VN')),isChecked:Boolean(foremanNote&&foremanNote!=='—'&&foremanNote.toLowerCase()!=='none')});});}}if(!orders.length){alert('⚠️ Không tìm thấy xe nào trong mục \"Xe đang trong xưởng\".\\nHãy chắc chắn bạn đang ở tab \"Trong xưởng\" trên ServiceOS!');return;}const targetBase='${cleanTarget}';const jsonStr=JSON.stringify(orders);if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(jsonStr).catch(()=>{});}const targetUrl=targetBase+'#serviceos='+encodeURIComponent(jsonStr);const newWin=window.open(targetUrl,'_blank');let toast=document.getElementById('att-sync-toast');if(!toast){toast=document.createElement('div');toast.id='att-sync-toast';toast.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:#059669;color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:bold;box-shadow:0 8px 24px rgba(0,0,0,0.25);font-family:sans-serif;';document.body.appendChild(toast);}toast.innerHTML='✅ Đã lấy thành công <b>'+orders.length+' xe trong xưởng</b>! Đang mở tab Bảo Hành PRO...';setTimeout(()=>{if(toast)toast.remove();},3500);if(!newWin){alert('⚡ Đã lấy '+orders.length+' xe! Trình duyệt đã chặn popup tab mới. Vui lòng mở trang Bảo Hành PRO và bấm \"📋 Dán từ ServiceOS\".');}}catch(e){alert('Lỗi: '+e.message);}})();void 0;`;
}

function updateBookmarkletHref(){
  const inp = $('#bmTargetUrlInput');
  const targetUrl = inp ? inp.value.trim() : window.location.href;
  const code = getBookmarkletCode(targetUrl);
  const btn = $('#bookmarkletLink');
  if(btn) btn.href = code;
}

window.copyBookmarkletCode = function(){
  const inp = $('#bmTargetUrlInput');
  const targetUrl = inp ? inp.value.trim() : window.location.href;
  const code = getBookmarkletCode(targetUrl);
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(() => {
      alert('📋 Đã sao chép mã Dấu trang vào bộ nhớ tạm!\n\nCách dán vào trình duyệt:\n1. Chuột phải lên thanh Dấu trang -> Chọn \"Thêm trang\" (Add Page)\n2. Tên: ⚡ Lấy xe ServiceOS\n3. URL: Dán (Ctrl+V) mã vừa copy vào.');
    });
  } else {
    prompt('Copy mã Dấu trang bên dưới:', code);
  }
};

function initBookmarkletCode(){
  const inp = $('#bmTargetUrlInput');
  if(inp && !inp.value){
    inp.value = window.location.href.split('#')[0];
  }
  updateBookmarkletHref();
}
'''

html = html[:old_bm_code_marker] + new_bm_script + html[end_of_bm:]

# 5. In gateOpen, ensure checkUrlImport() is called
html = html.replace(
r'''function gateOpen(){
  $('#gateLock').hidden = true;
  $('#appShell').style.display = '';
  document.body.classList.remove('locked');
}''',
r'''function gateOpen(){
  $('#gateLock').hidden = true;
  $('#appShell').style.display = '';
  document.body.classList.remove('locked');
  checkUrlImport();
}''')

html = html.replace("window.scrollTo({ top: 0, behavior: 'smooth' });", "if(typeof window.scrollTo === 'function') try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch(e){}")

# 6. In init calls, add checkUrlImport() and hashchange listener
html = html.replace(
r'''loadPrepared();
loadCheckXeOrders();
initBookmarkletCode();
renderCheckXe();''',
r'''loadPrepared();
loadCheckXeOrders();
initBookmarkletCode();
renderCheckXe();
checkUrlImport();
window.addEventListener('hashchange', checkUrlImport);''')

with io.open(OUT_TPL, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Clean app_template2.html written! Length: {len(html)}")
