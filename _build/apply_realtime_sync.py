# -*- coding: utf-8 -*-
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update header context chips
old_chip = """      <span class="chip" id="ctxCheckXeChip" style="display:none"><svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg> Xe cần check: <b id="ctxUncheckedVal" style="color:var(--rose-glow)">0</b></span>
    </div>"""

new_chip = """      <span class="chip" id="ctxCheckXeChip" style="display:none"><svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg> Xe cần check: <b id="ctxUncheckedVal" style="color:var(--rose-glow)">0</b></span>
      <span class="chip" id="ctxRealtimeChip" style="background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.35);color:#34d399;cursor:pointer;display:inline-flex;align-items:center;gap:6px" onclick="openRealtimeModal()" title="Bấm xem hướng dẫn & trạng thái Real-time"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #34d399;animation:pulse 1.5s infinite"></span> Real-time: <b id="ctxRealtimeStatus">Tự động 100%</b></span>
    </div>"""

if old_chip in c:
    c = c.replace(old_chip, new_chip)
    print("Added ctxRealtimeChip to context bar")
else:
    print("old_chip not found")

# 2. Update realtime listener
old_listener = """window.addEventListener('message', function(ev){
  if(ev.data && ev.data.type === 'SERVICEOS_DATA' && Array.isArray(ev.data.orders)){
    const orders = ev.data.orders.map((d, i) => normalizeOrder(d, i));
    state.checkXe.orders = orders;
    saveCheckXeOrders();
    if(typeof window.switchTab === 'function') window.switchTab('checkxe');
    setTimeout(() => {
      alert('🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ' + orders.length + ' XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!');
    }, 120);
  }
});"""

new_listener = """/* ==================== REAL-TIME SYNCHRONIZATION SYSTEM ==================== */
function showRealtimeToast(msg, icon = '⚡') {
  let t = document.getElementById('bhRealtimeToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'bhRealtimeToast';
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.95));border:1.5px solid #10b981;box-shadow:0 10px 30px rgba(16,185,129,0.35);color:#fff;padding:12px 18px;border-radius:10px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;transition:all 0.3s ease;transform:translateY(100px);opacity:0;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.innerHTML = `<span style="font-size:18px">${icon}</span> <span>${msg}</span>`;
  t.style.transform = 'translateY(0)';
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.style.transform = 'translateY(100px)';
    t.style.opacity = '0';
  }, 4000);
}

function handleServiceOsRealtimeOrders(orders, isSilent = true) {
  if (!Array.isArray(orders) || orders.length === 0) return;
  const prevCount = state.checkXe.orders ? state.checkXe.orders.length : 0;
  const normalized = orders.map((d, i) => normalizeOrder(d, i));
  state.checkXe.orders = normalized;
  saveCheckXeOrders();
  if (typeof renderCheckXe === 'function') renderCheckXe();
  
  const diff = normalized.length - prevCount;
  const diffTxt = diff > 0 ? ` (+${diff} xe mới)` : '';
  showRealtimeToast(`Đã tự động cập nhật ${normalized.length} xe từ ServiceOS!${diffTxt}`, '🚗');
  const stEl = document.getElementById('ctxRealtimeStatus');
  if (stEl) stEl.textContent = 'ServiceOS vừa cập nhật';
}

function handleDealerPortalRealtimeClaims(claims) {
  if (!claims) return;
  const list = Array.isArray(claims) ? claims : (claims.data || claims.rows || claims.items || []);
  if (!Array.isArray(list) || list.length === 0) return;
  
  const count = window.parseDealerPortalJson(list, 'VinFast Dealer Portal (Real-time)', false);
  rebuildCheckXeOrders();
  renderAll();
  showRealtimeToast(`Đã tự động cập nhật ${count} đề xuất bảo hành từ Dealer Portal!`, '💼');
  const stEl = document.getElementById('ctxRealtimeStatus');
  if (stEl) stEl.textContent = 'Dealer Portal vừa cập nhật';
}

// 1. Lắng nghe BroadcastChannel (kết nối chéo tab trong cùng trình duyệt)
let realtimeChannel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    realtimeChannel = new BroadcastChannel('BAOHANH_REALTIME_SYNC');
    realtimeChannel.onmessage = function(ev) {
      const data = ev.data;
      if (!data) return;
      if (data.type === 'SERVICEOS_REALTIME' || data.type === 'SERVICEOS_DATA') {
        handleServiceOsRealtimeOrders(data.orders || data.data);
      } else if (data.type === 'DEALER_PORTAL_REALTIME' || data.type === 'DEALER_PORTAL_DATA') {
        handleDealerPortalRealtimeClaims(data.claims || data.data);
      }
    };
  }
} catch(e){}

// 2. Lắng nghe window.postMessage (từ Extension hoặc Tiện ích)
window.addEventListener('message', function(ev){
  const data = ev.data;
  if (!data || typeof data !== 'object') return;
  if (data.type === 'SERVICEOS_REALTIME') {
    handleServiceOsRealtimeOrders(data.orders);
  } else if (data.type === 'SERVICEOS_DATA' && Array.isArray(data.orders)) {
    handleServiceOsRealtimeOrders(data.orders, false);
  } else if (data.type === 'DEALER_PORTAL_REALTIME' || data.type === 'DEALER_PORTAL_DATA') {
    handleDealerPortalRealtimeClaims(data.claims);
  }
});

// 3. Lắng nghe storage event (fallback đồng bộ chéo tab khi có tab khác cập nhật)
window.addEventListener('storage', function(ev){
  if (ev.key === 'bh_realtime_serviceos_event' && ev.newValue) {
    try {
      const p = JSON.parse(ev.newValue);
      if (p && p.orders) handleServiceOsRealtimeOrders(p.orders);
    } catch(e){}
  } else if (ev.key === 'bh_realtime_dealer_event' && ev.newValue) {
    try {
      const p = JSON.parse(ev.newValue);
      if (p && p.claims) handleDealerPortalRealtimeClaims(p.claims);
    } catch(e){}
  }
});"""

if old_listener in c:
    c = c.replace(old_listener, new_listener)
    print("Updated realtime listener")
else:
    print("old_listener not found")

# 3. Add Modal Realtime Info
modal_realtime_html = """<!-- Modal Hướng dẫn Đồng Bộ Realtime -->
<div id="modalRealtime" class="modal-overlay" hidden>
  <div class="modal-box" style="max-width:580px;background:#0f172a;border:1.5px solid #10b981">
    <button class="modal-close" onclick="closeRealtimeModal()">✕</button>
    <div class="modal-title" style="color:#34d399;display:flex;align-items:center;gap:8px">
      <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#34d399;box-shadow:0 0 10px #34d399"></span>
      Cơ chế Tự Động Real-time (Zero-Click)
    </div>
    <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px;line-height:1.6">
      Trang web đã được kích hoạt cổng nhận <b>BroadcastChannel</b> và <b>Chrome Extension Bridge</b>. Dữ liệu từ ServiceOS và Dealer Portal sẽ tự động nhảy vào web mà bạn không cần bấm bất kỳ nút nào!
    </div>

    <div style="background:rgba(30,41,59,0.8);border:1px solid rgba(16,185,129,0.3);border-radius:8px;padding:14px;margin-bottom:14px">
      <div style="font-size:13.5px;font-weight:700;color:#38bdf8;margin-bottom:6px">
        🧩 Cách kích hoạt Tiện ích Chrome (Khuyên dùng - 100% tự động):
      </div>
      <ol style="font-size:12.5px;color:#cbd5e1;padding-left:18px;margin:0;line-height:1.7">
        <li>Mở trình duyệt Chrome, vào địa chỉ: <code style="background:#1e293b;padding:2px 6px;border-radius:4px;color:#38bdf8">chrome://extensions</code></li>
        <li>Bật công tắc <b>"Chế độ dành cho nhà phát triển" (Developer mode)</b> ở góc trên bên phải.</li>
        <li>Bấm nút <b>"Tải tiện ích đã giải nén" (Load unpacked)</b>.</li>
        <li>Chọn thư mục: <code style="background:#1e293b;padding:2px 6px;border-radius:4px;color:#38bdf8">baohanh_realtime_extension</code> trong thư mục dự án của bạn.</li>
      </ol>
      <div style="margin-top:10px;font-size:12px;color:#34d399;font-weight:600">
        ✅ Xong! Từ nay mỗi khi ServiceOS có thêm xe hoặc Dealer Portal có đề xuất mới, web của bạn sẽ tự động nhảy số tức thì!
      </div>
    </div>

    <div style="text-align:right">
      <button class="btn secondary" onclick="closeRealtimeModal()">Đóng</button>
    </div>
  </div>
</div>
"""

# Place modal before </body>
if "modalRealtime" not in c:
    c = c.replace("</body>", modal_realtime_html + "\n</body>")
    print("Added modalRealtime to HTML")

# Add helper functions for opening/closing realtime modal
helpers = """
window.openRealtimeModal = function(){
  const m = document.getElementById('modalRealtime');
  if (m) m.hidden = false;
};
window.closeRealtimeModal = function(){
  const m = document.getElementById('modalRealtime');
  if (m) m.hidden = true;
};
"""
if "window.openRealtimeModal" not in c:
    c = c.replace("</script>\n<script>\n/* ==================== 1. SheetJS", helpers + "\n</script>\n<script>\n/* ==================== 1. SheetJS")
    print("Added openRealtimeModal helpers")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("Realtime sync applied to app_template2.html successfully!")
