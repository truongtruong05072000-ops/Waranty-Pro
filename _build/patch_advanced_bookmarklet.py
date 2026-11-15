# -*- coding: utf-8 -*-
import io, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE, 'build_modern_template.py')

with io.open(FILE_PATH, 'r', encoding='utf-8') as f:
    code = f.read()

# Let's inspect where modalBookmarklet is defined
old_modal_start = code.find('<!-- Modal Bookmarklet Hướng Dẫn -->')
old_modal_end = code.find('<!-- Modal Chỉnh sửa Ghi chú KTV -->')

new_modal_bookmarklet = r'''<!-- Modal Bookmarklet Hướng Dẫn -->
<div id="modalBookmarklet" class="modal-overlay" hidden>
  <div class="modal-box">
    <button class="modal-close" onclick="closeBookmarkletModal()">✕</button>
    <div class="modal-title">⚡ Dấu trang 1-Click: Lấy dữ liệu "Xe đang trong xưởng" từ ServiceOS</div>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px">
      Bấm dấu trang này khi đang ở ServiceOS để <b>tự động lấy danh sách xe đang trong xưởng và mở trang Bảo Hành PRO ở tab mới</b> (giữ nguyên trang ServiceOS gốc, không bị văng).
    </p>

    <div style="background:#f8fafc;border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:14px">
      <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px">1. Đường link trang Bảo Hành PRO của bạn:</div>
      <input type="text" id="bmTargetUrlInput" class="field-input" style="width:100%;font-size:13px;font-family:monospace;background:#ffffff;margin-bottom:10px" oninput="updateBookmarkletHref()">
      
      <div style="text-align:center;padding:10px;background:#ffffff;border:1.5px dashed #cbd5e1;border-radius:var(--radius-md)">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">👉 <b>KÉO NÚT NÀY THẢ LÊN THANH DẤU TRANG (BOOKMARK BAR)</b>:</div>
        <a class="bookmarklet-btn" id="bookmarkletLink" href="javascript:void(0);" onclick="alert('Hãy KÉO nút này thả lên thanh Dấu trang của trình duyệt!');return false;">
          ⚡ Lấy xe trong xưởng ServiceOS
        </a>
        <div style="margin-top:6px">
          <button class="btn secondary" style="font-size:12px;padding:4px 10px" onclick="copyBookmarkletCode()">📋 Hoặc Copy toàn bộ mã Dấu trang</button>
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

if old_modal_start != -1 and old_modal_end != -1:
    code = code[:old_modal_start] + new_modal_bookmarklet + code[old_modal_end:]
    print("Modal updated successfully!")
else:
    print("Modal markers not found, please check.")

# Now update the bookmarklet generation logic and URL hash detection
js_bm_old_start = code.find('// Generate Bookmarklet link href')
assert js_bm_old_start != -1, "Bookmarklet JS section not found"

new_bm_js = r'''// URL Hash Auto-Import when opened from ServiceOS bookmarklet
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
        switchTab('checkxe');
        try { history.replaceState(null, '', location.pathname); } catch(e){}
        setTimeout(() => {
          alert(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ${orders.length} XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!`);
        }, 100);
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

code = code[:js_bm_old_start] + new_bm_js

# In gateOpen also call checkUrlImport()
old_gate_open = r'''function gateOpen(){
  $('#gateLock').hidden = true;
  $('#appShell').style.display = '';
  document.body.classList.remove('locked');
}'''

new_gate_open = r'''function gateOpen(){
  $('#gateLock').hidden = true;
  $('#appShell').style.display = '';
  document.body.classList.remove('locked');
  checkUrlImport();
}'''
code = code.replace(old_gate_open, new_gate_open)

# In init script call checkUrlImport()
old_init_calls = r'''loadPrepared();
loadCheckXeOrders();
initBookmarkletCode();
renderCheckXe();'''

new_init_calls = r'''loadPrepared();
loadCheckXeOrders();
initBookmarkletCode();
renderCheckXe();
checkUrlImport();
window.addEventListener('hashchange', checkUrlImport);'''

code = code.replace(old_init_calls, new_init_calls)

with io.open(FILE_PATH, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated build_modern_template.py with advanced bookmarklet and URL auto-import!")
