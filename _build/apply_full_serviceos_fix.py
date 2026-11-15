# -*- coding: utf-8 -*-
import io, os, sys, re, hashlib

BASE = os.path.dirname(os.path.abspath(__file__))
DEPLOY_HTML = os.path.join(BASE, '..', '_deploy', 'index.html')
OUT_TPL = os.path.join(BASE, 'app_template2.html')

with io.open(DEPLOY_HTML, 'r', encoding='utf-8') as f:
    html = f.read()

print("Original index.html length:", len(html))

# 1. Clean up duplicated checkUrlImport / listeners if any
html = re.sub(r'(checkUrlImport\(\);\s*window\.addEventListener\(\'hashchange\',\s*checkUrlImport\);\s*)+',
              'checkUrlImport();\nwindow.addEventListener(\'hashchange\', checkUrlImport);\n', html)

# 2. SheetJS replacement marker
script_tags = list(re.finditer(r'<script>([\s\S]*?)</script>', html))
assert len(script_tags) >= 3, "Expected at least 3 script tags"
sheetjs_match = script_tags[1]
html = html[:sheetjs_match.start()] + '<!--SHEETJS-->' + html[sheetjs_match.end():]

# 3. Password placeholders
PASS_SHA = '6907afc7b4a6690b3db425aea974e58e8bbeb19744d94d32d47a2aaea126ff2a'
PASS_FB = 'c52f853'
html = html.replace(PASS_SHA, '__PASS_SHA__').replace(PASS_FB, '__PASS_FB__')

# 4. Replace Modal Bookmarklet with our new Interactive ServiceOS Sync Modal
modal_start = html.find('<!-- Modal Bookmarklet Hướng Dẫn -->')
modal_end = html.find('<!-- Modal Chỉnh sửa Ghi chú KTV -->')
assert modal_start != -1 and modal_end != -1, "Modal markers not found"

new_modal_serviceos = r'''<!-- Modal Bookmarklet Hướng Dẫn -->
<div id="modalBookmarklet" class="modal-overlay" hidden>
  <div class="modal-box" style="max-width:620px">
    <button class="modal-close" onclick="closeBookmarkletModal()">✕</button>
    <div class="modal-title" style="display:flex;align-items:center;gap:8px">
      <span>⚡</span> Lấy dữ liệu "Xe đang trong xưởng" từ ServiceOS
    </div>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;line-height:1.5">
      Hệ thống sẽ tự động quét danh sách xe đang trong xưởng, phân loại lỗi và kiểm tra trạng thái theo <b>Ghi chú KTV</b> (có ghi chú = đã check, trống = chưa check).
    </p>

    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
      <!-- CÁCH 1: Nút tự động mở ServiceOS và copy mã -->
      <div style="background:linear-gradient(135deg,#eff6ff,#f0fdf4);border:1.5px solid #3b82f6;border-radius:var(--radius-md);padding:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:13.5px;font-weight:700;color:#1e40af">🚀 Cách 1: Tự động mở ServiceOS & Lấy xe (Nhanh nhất)</span>
          <span style="font-size:11px;background:#2563eb;color:#fff;padding:2px 8px;border-radius:12px;font-weight:600">Khuyên dùng</span>
        </div>
        <p style="font-size:12.5px;color:var(--text-main);margin-bottom:10px;line-height:1.5">
          Bấm nút bên dưới: Hệ thống sẽ <b>tự động copy mã đồng bộ</b> và <b>mở trang ServiceOS ở tab mới</b> (trang Bảo Hành PRO vẫn giữ nguyên).
        </p>
        <button class="btn primary" style="width:100%;font-size:13.5px;padding:10px 16px;font-weight:700" onclick="runOneClickSyncFlow()">
          ⚡ Mở ServiceOS & Sao chép mã lấy dữ liệu
        </button>
        <div style="font-size:11.5px;color:var(--text-muted);margin-top:8px;line-height:1.5">
          👉 <i>Sau khi tab ServiceOS mở ra: Nhấn <b>F12</b> (hoặc chuột phải chọn Kiểm tra) ➔ vào mục <b>Console</b> ➔ bấm <b>Ctrl + V</b> ➔ nhấn <b>Enter</b> là xong ngay!</i>
        </div>
      </div>

      <!-- CÁCH 2: Dán trực tiếp từ bộ nhớ tạm -->
      <div style="background:#ffffff;border:1px solid var(--border);border-radius:var(--radius-md);padding:12px 14px">
        <div style="font-size:13px;font-weight:700;color:var(--text-main);margin-bottom:4px">📋 Cách 2: Dán trực tiếp từ ServiceOS (Ctrl + V)</div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px">
          Bạn có thể bôi đen copy bảng dữ liệu trên ServiceOS hoặc dán mã JSON bất kỳ vào đây.
        </p>
        <button class="btn secondary" style="width:100%;font-size:12.5px;padding:8px 12px" onclick="importServiceOsClipboard()">
          📋 Dán dữ liệu từ bộ nhớ tạm (Ctrl + V)
        </button>
      </div>

      <!-- CÁCH 3: Nhập file Excel từ ServiceOS -->
      <div style="background:#ffffff;border:1px solid var(--border);border-radius:var(--radius-md);padding:12px 14px">
        <div style="font-size:13px;font-weight:700;color:var(--text-main);margin-bottom:4px">📁 Cách 3: Nhập file Excel từ ServiceOS</div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px">
          Trên trang ServiceOS đã có sẵn nút <b>"Xuất Excel"</b> (góc trên bên phải). Tải về và chọn file tại đây:
        </p>
        <button class="btn secondary" style="width:100%;font-size:12.5px;padding:8px 12px" onclick="$('#serviceOsFileInput').click();closeBookmarkletModal();">
          📁 Chọn tệp Excel Lệnh sửa chữa tải từ ServiceOS
        </button>
      </div>

      <!-- CÁCH 4: Tiện ích mở rộng Tampermonkey -->
      <div style="background:#ffffff;border:1px solid var(--border);border-radius:var(--radius-md);padding:12px 14px">
        <div style="font-size:13px;font-weight:700;color:var(--text-main);margin-bottom:4px">🧩 Cách 4: Tự động gắn nút bấm trên ServiceOS (Tampermonkey)</div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px">
          Cài tiện ích 1 lần duy nhất để mỗi khi mở ServiceOS sẽ có nút <b>"⚡ Gửi xe sang Bảo Hành PRO"</b> xuất hiện sẵn ở góc màn hình.
        </p>
        <button class="btn secondary" style="width:100%;font-size:12.5px;padding:8px 12px" onclick="showUserscriptGuide()">
          🧩 Xem hướng dẫn cài nút tự động (1 phút)
        </button>
      </div>
    </div>

    <!-- Hướng dẫn chi tiết / mã Console ẩn hiện -->
    <details style="margin-top:8px;background:#f8fafc;padding:10px;border-radius:var(--radius-sm);border:1px solid var(--border)">
      <summary style="font-size:12px;font-weight:600;color:var(--text-muted);cursor:pointer">Xem mã lệnh Console / Dấu trang (Dành cho người dùng nâng cao)</summary>
      <div style="margin-top:8px">
        <textarea id="bmConsoleCodeBox" readonly style="width:100%;height:75px;font-family:monospace;font-size:11px;padding:6px;border:1px solid var(--border);border-radius:4px;resize:none"></textarea>
        <div style="margin-top:6px;display:flex;gap:8px">
          <button class="btn secondary" style="font-size:11.5px;padding:4px 8px" onclick="copyConsoleSnippetCode()">📋 Copy mã Console</button>
          <a class="btn secondary" id="bookmarkletLink" href="javascript:void(0);" onclick="copyConsoleSnippetCode();return false;" style="font-size:11.5px;padding:4px 8px;text-decoration:none">📌 Kéo lên Bookmark</a>
        </div>
      </div>
    </details>

    <div style="margin-top:16px;text-align:right">
      <button class="btn secondary" onclick="closeBookmarkletModal()">Đóng</button>
    </div>
  </div>
</div>

<!-- Modal Hướng dẫn Userscript Tampermonkey -->
<div id="modalUserscript" class="modal-overlay" hidden>
  <div class="modal-box" style="max-width:580px">
    <button class="modal-close" onclick="$('#modalUserscript').hidden = true">✕</button>
    <div class="modal-title">🧩 Cài nút tự động trên ServiceOS (Tampermonkey)</div>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;line-height:1.5">
      Sau khi cài đặt, mỗi lần vào ServiceOS sẽ có sẵn nút màu xanh <b>"⚡ Gửi xe sang Bảo Hành PRO"</b> ngay góc phải màn hình, bấm 1 cái là tự mở tab Bảo Hành PRO với đầy đủ xe!
    </p>

    <ol style="padding-left:20px;font-size:12.5px;line-height:1.6;color:var(--text-main);margin-bottom:14px">
      <li>Cài tiện ích <b>Tampermonkey</b> từ Chrome Web Store (miễn phí).</li>
      <li>Mở Tampermonkey ➔ Chọn <b>"Tạo mã mới" (Create a new script)</b>.</li>
      <li>Xóa hết nội dung cũ và dán mã script bên dưới vào, sau đó nhấn <b>Ctrl + S</b> để lưu.</li>
      <li>Xong! Mở lại trang <b>att-serviceos.anthinhtech.vn</b> sẽ thấy ngay nút gửi xe!</li>
    </ol>

    <div style="margin-bottom:12px">
      <textarea id="userscriptCodeBox" readonly style="width:100%;height:130px;font-family:monospace;font-size:11.5px;padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:#f8fafc"></textarea>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center">
      <button class="btn primary" onclick="copyUserscriptCode()">📋 Sao chép mã Tampermonkey</button>
      <button class="btn secondary" onclick="$('#modalUserscript').hidden = true">Đóng</button>
    </div>
  </div>
</div>
'''

html = html[:modal_start] + new_modal_serviceos + html[modal_end:]

# 5. Replace Bookmarklet / URL import script logic
old_bm_marker = html.find('// URL Hash Auto-Import when opened from ServiceOS bookmarklet')
if old_bm_marker == -1:
    old_bm_marker = html.find('// Generate Bookmarklet link href')
assert old_bm_marker != -1, "old_bm_marker not found"

end_of_bm = html.find('/* ============================ Navigation ============================ */', old_bm_marker)
assert end_of_bm != -1, "end_of_bm not found"

new_sync_script = r'''// URL Hash Auto-Import when opened from ServiceOS
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
          let wo, plate, vin, vehicle, customer, tech, issue, parts, note, status, dateStr;
          if(Array.isArray(d)){
            [wo, plate, vin, vehicle, tech, issue, note, status, dateStr] = d;
            customer = '—';
            parts = [];
          } else {
            wo = d.wo; plate = d.plate; vin = d.vin; vehicle = d.vehicle;
            customer = d.customer; tech = d.tech; issue = d.issue; parts = d.parts || [];
            note = d.note; status = d.status; dateStr = d.dateStr;
          }
          note = (note || '').trim();
          issue = issue || 'Kiểm tra sửa chữa';
          return {
            id: 'ord_' + (wo || plate || i).replace(/[^a-zA-Z0-9]/g, '') + '_' + i,
            wo: wo || '—',
            plate: plate || '—',
            vin: vin || '—',
            vehicle: vehicle || '—',
            customer: customer || '—',
            tech: tech || 'Chưa phân công',
            issue: issue,
            parts: parts,
            note: note,
            status: status || 'Trong xưởng',
            dateStr: dateStr || (new Date().toLocaleDateString('vi-VN')),
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

// Generate the 1-Click Console script for ServiceOS
function getConsoleSnippetCode(targetUrl){
  const cleanTarget = (targetUrl || window.location.href).split('#')[0];
  return `fetch('/api/work-orders?status=active&page=1&page_size=250',{credentials:'same-origin'}).then(r=>r.json()).then(d=>{const rows=d.rows||d.items||[];if(!rows.length){alert('⚠️ Không tìm thấy xe nào trong mục "Xe đang trong xưởng"!');return;}const orders=rows.map((w,i)=>({id:'ord_'+(w.code||i),wo:w.code||w.dms_ro_code||'—',plate:w.plate||'—',vin:w.vin||'—',vehicle:w.model||'—',customer:w.customer_name||'—',tech:w.technician_name||'Chưa phân công',issue:[w.source==='retail'?w.customer_name:'',w.faults&&w.faults.length?w.faults.join(', '):w.symptoms||''].filter(Boolean).join(' · ')||w.content||w.diag||'Kiểm tra',note:(w.foreman_note||'').trim(),status:w.status_label||w.status||'Trong xưởng',dateStr:(w.received_at||w.created_at||'').slice(0,10)||new Date().toLocaleDateString('vi-VN'),isChecked:Boolean((w.foreman_note||'').trim()&&(w.foreman_note||'').trim()!=='—'&&(w.foreman_note||'').trim()!=='-'&&(w.foreman_note||'').trim().toLowerCase()!=='none')}));const json=JSON.stringify(orders);try{navigator.clipboard.writeText(json)}catch(e){}const targetUrl='${cleanTarget}#serviceos='+encodeURIComponent(json);const win=window.open(targetUrl,'_blank');let toast=document.getElementById('bh-toast');if(!toast){toast=document.createElement('div');toast.id='bh-toast';toast.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:#059669;color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;font-weight:bold;box-shadow:0 8px 24px rgba(0,0,0,0.3);font-family:sans-serif;';document.body.appendChild(toast);}toast.innerHTML='✅ Đã lấy '+orders.length+' xe trong xưởng! Đang mở tab Bảo Hành PRO...';setTimeout(()=>toast.remove(),4000);if(!win){alert('⚡ Đã lấy '+orders.length+' xe! Vui lòng mở lại tab Bảo Hành PRO và bấm "📋 Dán từ ServiceOS (Ctrl+V)".');}}).catch(err=>alert('Lỗi: '+err.message));`;
}

// Generate Userscript for Tampermonkey
function getUserscriptCode(targetUrl){
  const cleanTarget = (targetUrl || window.location.href).split('#')[0];
  return `// ==UserScript==
// @name         Bảo Hành PRO - Đồng bộ ServiceOS
// @namespace    https://phan-tich-bao-hanh.pages.dev/
// @version      1.0
// @description  Tự động thêm nút lấy danh sách xe đang trong xưởng từ ServiceOS sang Bảo Hành PRO
// @match        https://att-serviceos.anthinhtech.vn/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  function injectBtn() {
    if (document.getElementById('btn-sync-baohanhpro')) return;
    const btn = document.createElement('button');
    btn.id = 'btn-sync-baohanhpro';
    btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;padding:12px 20px;border-radius:50px;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 20px rgba(37,99,235,0.45);display:flex;align-items:center;gap:8px;transition:all 0.2s;font-family:sans-serif;';
    btn.onmouseover = () => btn.style.transform = 'translateY(-2px) scale(1.03)';
    btn.onmouseout = () => btn.style.transform = 'translateY(0) scale(1)';
    btn.onclick = async function() {
      btn.innerHTML = '⏳ Đang quét danh sách xe...';
      try {
        const res = await fetch('/api/work-orders?status=active&page=1&page_size=250', { credentials: 'same-origin' });
        const d = await res.json();
        const rows = d.rows || d.items || [];
        if (!rows.length) { alert('⚠️ Không có xe nào trong mục "Xe đang trong xưởng"!'); btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO'; return; }
        const orders = rows.map((w, i) => ({
          id: 'ord_' + (w.code || i),
          wo: w.code || w.dms_ro_code || '—',
          plate: w.plate || '—',
          vin: w.vin || '—',
          vehicle: w.model || '—',
          customer: w.customer_name || '—',
          tech: w.technician_name || 'Chưa phân công',
          issue: [w.source === 'retail' ? w.customer_name : '', (w.faults && w.faults.length) ? w.faults.join(', ') : (w.symptoms || '')].filter(Boolean).join(' · ') || w.content || w.diag || 'Kiểm tra',
          note: (w.foreman_note || '').trim(),
          status: w.status_label || w.status || 'Trong xưởng',
          dateStr: (w.received_at || w.created_at || '').slice(0, 10) || new Date().toLocaleDateString('vi-VN'),
          isChecked: Boolean((w.foreman_note || '').trim() && (w.foreman_note || '').trim() !== '—' && (w.foreman_note || '').trim() !== '-' && (w.foreman_note || '').trim().toLowerCase() !== 'none')
        }));
        const json = JSON.stringify(orders);
        try { navigator.clipboard.writeText(json); } catch(e){}
        const targetUrl = '${cleanTarget}#serviceos=' + encodeURIComponent(json);
        window.open(targetUrl, '_blank');
        btn.innerHTML = '✅ Đã gửi ' + orders.length + ' xe!';
        setTimeout(() => btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO', 3500);
      } catch(e) {
        alert('Lỗi: ' + e.message);
        btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO';
      }
    };
    document.body.appendChild(btn);
  }
  setInterval(injectBtn, 1500);
})();`;
}

// 1-Click Sync flow: Copies code and opens ServiceOS
window.runOneClickSyncFlow = function(){
  const targetUrl = window.location.href.split('#')[0];
  const code = getConsoleSnippetCode(targetUrl);
  
  const finish = () => {
    window.open('https://att-serviceos.anthinhtech.vn/#/work-orders?src=all&status=active&kind=all&page=1', '_blank');
    alert('📋 ĐÃ TỰ ĐỘNG COPY MÃ LẤY XE VÀO BỘ NHỚ TẠM & MỞ SERVICEOS Ở TAB MỚI!\n\n👉 Bạn chỉ cần:\n1. Sang tab ServiceOS vừa mở.\n2. Nhấn phím F12 (Console) -> Nhấn Ctrl+V -> Nhấn Enter.\n⚡ Danh sách xe đang trong xưởng sẽ tự động mở ra ở tab Bảo Hành PRO!');
  };

  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(finish).catch(finish);
  } else {
    finish();
  }
};

window.copyConsoleSnippetCode = function(){
  const targetUrl = window.location.href.split('#')[0];
  const code = getConsoleSnippetCode(targetUrl);
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(() => {
      alert('📋 Đã sao chép mã Console vào bộ nhớ tạm!\nSang tab ServiceOS -> Nhấn F12 (Console) -> Dán (Ctrl+V) -> Enter.');
    });
  } else {
    prompt('Sao chép mã Console dưới đây:', code);
  }
};

window.showUserscriptGuide = function(){
  const targetUrl = window.location.href.split('#')[0];
  const box = $('#userscriptCodeBox');
  if(box) box.value = getUserscriptCode(targetUrl);
  const m = $('#modalUserscript');
  if(m) m.hidden = false;
};

window.copyUserscriptCode = function(){
  const targetUrl = window.location.href.split('#')[0];
  const code = getUserscriptCode(targetUrl);
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(() => {
      alert('📋 Đã sao chép mã Userscript! Hãy mở Tampermonkey và dán vào script mới.');
    });
  } else {
    prompt('Sao chép mã Userscript dưới đây:', code);
  }
};

function parseServiceOsText(rawText){
  if(!rawText || !rawText.trim()) return null;
  const str = rawText.trim();
  
  // 1. Try JSON
  if(str.startsWith('[') || str.startsWith('{')){
    try {
      const parsed = JSON.parse(str);
      const arr = Array.isArray(parsed) ? parsed : (parsed.rows || parsed.items || []);
      if(arr.length > 0) return arr;
    } catch(e){}
  }
  
  // 2. Try Tab-Separated or Line-Separated Table Text
  const lines = str.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if(lines.length >= 2){
    let headerIdx = -1;
    let colMap = {};
    for(let i = 0; i < Math.min(lines.length, 5); i++){
      const parts = lines[i].split('\t').map(p => p.trim().toLowerCase());
      if(parts.some(p => p.includes('biển') || p.includes('phiếu') || p.includes('lệnh') || p.includes('plate') || p.includes('code') || p.includes('ktv'))){
        headerIdx = i;
        parts.forEach((p, cIdx) => {
          if(p.includes('biển') || p.includes('plate')) colMap.plate = cIdx;
          else if(p.includes('mã') || p.includes('lệnh') || p.includes('phiếu') || p.includes('code') || p.includes('ro')) colMap.wo = cIdx;
          else if(p.includes('loại xe') || p.includes('dòng') || p.includes('model')) colMap.model = cIdx;
          else if(p.includes('khung') || p.includes('vin')) colMap.vin = cIdx;
          else if(p.includes('ktv') || p.includes('kỹ thuật') || p.includes('tech')) colMap.tech = cIdx;
          else if(p.includes('ghi chú') || p.includes('foreman') || p.includes('quản đốc')) colMap.note = cIdx;
          else if(p.includes('hạng mục') || p.includes('lỗi') || p.includes('nội dung') || p.includes('triệu chứng') || p.includes('diag') || p.includes('content')) colMap.issue = cIdx;
          else if(p.includes('trạng thái') || p.includes('status')) colMap.status = cIdx;
          else if(p.includes('ngày') || p.includes('nhận') || p.includes('date')) colMap.date = cIdx;
        });
        break;
      }
    }
    
    if(headerIdx !== -1 && (colMap.plate !== undefined || colMap.wo !== undefined)){
      const result = [];
      for(let i = headerIdx + 1; i < lines.length; i++){
        const cells = lines[i].split('\t');
        const plate = colMap.plate !== undefined ? (cells[colMap.plate] || '').trim() : '';
        const wo = colMap.wo !== undefined ? (cells[colMap.wo] || '').trim() : '';
        if(!plate && !wo) continue;
        const note = colMap.note !== undefined ? (cells[colMap.note] || '').trim() : '';
        result.push({
          id: 'ord_' + (wo || plate || i).replace(/[^a-zA-Z0-9]/g, '') + '_' + i,
          wo: wo || '—',
          plate: plate || '—',
          vin: colMap.vin !== undefined ? (cells[colMap.vin] || '—').trim() : '—',
          vehicle: colMap.model !== undefined ? (cells[colMap.model] || '—').trim() : '—',
          customer: '—',
          tech: colMap.tech !== undefined ? (cells[colMap.tech] || 'Chưa phân công').trim() : 'Chưa phân công',
          issue: colMap.issue !== undefined ? (cells[colMap.issue] || 'Kiểm tra').trim() : 'Kiểm tra',
          note: note,
          status: colMap.status !== undefined ? (cells[colMap.status] || 'Trong xưởng').trim() : 'Trong xưởng',
          dateStr: colMap.date !== undefined ? (cells[colMap.date] || '').trim() : new Date().toLocaleDateString('vi-VN'),
          isChecked: isOrderChecked(note)
        });
      }
      if(result.length > 0) return result;
    }
  }
  return null;
}

window.importServiceOsClipboard = async function(){
  try {
    let text = '';
    if(navigator.clipboard && navigator.clipboard.readText){
      try { text = await navigator.clipboard.readText(); } catch(err){}
    }
    if(!text || (!text.trim().startsWith('[') && !text.includes('\t'))){
      text = prompt('📋 Dán (Ctrl+V) dữ liệu xe từ ServiceOS vào ô bên dưới:\n(Chấp nhận mã lấy từ Console, hoặc bảng copy từ ServiceOS)');
    }
    if(!text || !text.trim()) return;
    
    const parsed = parseServiceOsText(text);
    if(!parsed || !parsed.length){
      alert('⚠️ Không nhận diện được dữ liệu xe từ nội dung bạn vừa dán.\n\nVui lòng thử lại bằng cách chọn file Excel hoặc chạy lệnh Console!');
      return;
    }
    
    const orders = parsed.map((d, i) => {
      let wo, plate, vin, vehicle, customer, tech, issue, parts, note, status, dateStr;
      if(Array.isArray(d)){
        [wo, plate, vin, vehicle, tech, issue, note, status, dateStr] = d;
        customer = '—';
        parts = [];
      } else {
        wo = d.wo; plate = d.plate; vin = d.vin; vehicle = d.vehicle;
        customer = d.customer; tech = d.tech; issue = d.issue; parts = d.parts || [];
        note = d.note; status = d.status; dateStr = d.dateStr;
      }
      note = (note || '').trim();
      issue = issue || 'Kiểm tra sửa chữa';
      return {
        id: 'ord_' + (wo || plate || i).replace(/[^a-zA-Z0-9]/g, '') + '_' + i,
        wo: wo || '—',
        plate: plate || '—',
        vin: vin || '—',
        vehicle: vehicle || '—',
        customer: customer || '—',
        tech: tech || 'Chưa phân công',
        issue: issue,
        parts: parts,
        note: note,
        status: status || 'Trong xưởng',
        dateStr: dateStr || (new Date().toLocaleDateString('vi-VN')),
        category: categorizeIssue(issue, parts),
        isChecked: isOrderChecked(note)
      };
    });
    
    state.checkXe.orders = orders;
    saveCheckXeOrders();
    renderCheckXe();
    if(typeof window.switchTab === 'function') window.switchTab('checkxe');
    closeBookmarkletModal();
    alert(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ${orders.length} XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!`);
  } catch(e) {
    alert('Lỗi đọc dữ liệu: ' + e.message);
  }
};

// Global paste listener on checkxe tab
window.addEventListener('paste', function(e){
  const navTab = document.querySelector('.nav-tab.active');
  const curTab = navTab ? navTab.dataset.tab : '';
  if(curTab === 'checkxe'){
    const target = e.target;
    if(target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
    const clipboardData = e.clipboardData || window.clipboardData;
    if(clipboardData){
      const text = clipboardData.getData('text');
      if(text){
        const parsed = parseServiceOsText(text);
        if(parsed && parsed.length > 0){
          e.preventDefault();
          const orders = parsed.map((d, i) => {
            const issue = d.issue || 'Kiểm tra sửa chữa';
            const parts = d.parts || [];
            const note = (d.note || '').trim();
            return {
              id: 'ord_' + (d.wo || d.plate || i).replace(/[^a-zA-Z0-9]/g, '') + '_' + i,
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
          renderCheckXe();
          alert(`🎉 ĐÃ DÁN THÀNH CÔNG ${orders.length} XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!`);
        }
      }
    }
  }
});

function initBookmarkletCode(){
  const box = $('#bmConsoleCodeBox');
  if(box) box.value = getConsoleSnippetCode();
  const btn = $('#bookmarkletLink');
  if(btn) btn.href = 'javascript:void(0);';
}
'''

html = html[:old_bm_marker] + new_sync_script + html[end_of_bm:]

# 6. Update Toolbar buttons in renderCheckXe to be clear and prominent
html = html.replace(
r'''          <div class="toolbar-right">
            <button class="btn" onclick="openBookmarkletModal()">⚡ Dấu trang 1-Click ServiceOS</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán từ ServiceOS</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Nhập file Excel</button>
            <input type="file" id="serviceOsFileInput" style="display:none" accept=".xlsx,.xls" onchange="handleServiceOsFileSelect(this.files)">
          </div>''',
r'''          <div class="toolbar-right">
            <button class="btn primary" onclick="openBookmarkletModal()">⚡ Lấy xe trong xưởng (ServiceOS)</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu (Ctrl+V)</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Nhập Excel ServiceOS</button>
            <input type="file" id="serviceOsFileInput" style="display:none" accept=".xlsx,.xls" onchange="handleServiceOsFileSelect(this.files)">
          </div>''')

html = html.replace(
r'''          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn" onclick="openBookmarkletModal()">⚡ Cài đặt Dấu trang 1-Click</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu đã copy</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Chọn file Excel Lệnh Sửa Chữa</button>
          </div>''',
r'''          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn primary" onclick="openBookmarkletModal()">⚡ Lấy xe trong xưởng ServiceOS</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu đã copy (Ctrl+V)</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Chọn file Excel Lệnh Sửa Chữa</button>
          </div>''')

with io.open(OUT_TPL, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated app_template2.html! Length:", len(html))
