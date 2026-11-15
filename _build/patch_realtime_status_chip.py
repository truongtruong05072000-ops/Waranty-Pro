# -*- coding: utf-8 -*-
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = """function handleServiceOsRealtimeOrders(orders, isSilent = true) {
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
}"""

replacement = """let lastServiceOsSyncTime = null;
let lastDealerPortalSyncTime = null;

function updateRealtimeStatusChip() {
  const stEl = document.getElementById('ctxRealtimeStatus');
  if (!stEl) return;
  
  // Kiểm tra xem đã có đề xuất Dealer Portal chưa (kể cả nạp sẵn hoặc qua mạng)
  const hasClaimsData = (window.DEALER_CLAIMS_MAP && window.DEALER_CLAIMS_MAP.size > 0) || 
                        state.sources.some(s => s.name.includes('Dealer Portal'));
  const hasServiceOs = Boolean(lastServiceOsSyncTime);
  const hasDealer = Boolean(lastDealerPortalSyncTime) || hasClaimsData;

  if (hasServiceOs && hasDealer) {
    stEl.innerHTML = `<span style="color:#34d399">ServiceOS & Dealer Portal</span> <span style="font-size:10.5px;color:#94a3b8">(Đã đồng bộ cả 2)</span>`;
  } else if (hasServiceOs) {
    stEl.innerHTML = `<span style="color:#38bdf8">ServiceOS đã cập nhật</span> · <span style="color:#f59e0b">Chờ mở tab Dealer Portal</span>`;
  } else if (hasDealer) {
    stEl.innerHTML = `<span style="color:#f59e0b">Dealer Portal đã cập nhật</span> · <span style="color:#38bdf8">Chờ ServiceOS</span>`;
  } else {
    stEl.textContent = 'Tự động 100%';
  }
}

function handleServiceOsRealtimeOrders(orders, isSilent = true) {
  if (!Array.isArray(orders) || orders.length === 0) return;
  lastServiceOsSyncTime = Date.now();
  const prevCount = state.checkXe.orders ? state.checkXe.orders.length : 0;
  const normalized = orders.map((d, i) => normalizeOrder(d, i));
  state.checkXe.orders = normalized;
  saveCheckXeOrders();
  if (typeof renderCheckXe === 'function') renderCheckXe();
  
  const diff = normalized.length - prevCount;
  const diffTxt = diff > 0 ? ` (+${diff} xe mới)` : '';
  showRealtimeToast(`Đã tự động cập nhật ${normalized.length} xe từ ServiceOS!${diffTxt}`, '🚗');
  updateRealtimeStatusChip();
}

function handleDealerPortalRealtimeClaims(claims) {
  if (!claims) return;
  const list = Array.isArray(claims) ? claims : (claims.data || claims.rows || claims.items || []);
  if (!Array.isArray(list) || list.length === 0) return;
  
  lastDealerPortalSyncTime = Date.now();
  const count = window.parseDealerPortalJson(list, 'VinFast Dealer Portal (Real-time)', false);
  rebuildCheckXeOrders();
  renderAll();
  showRealtimeToast(`Đã tự động cập nhật ${count} đề xuất bảo hành từ Dealer Portal!`, '💼');
  updateRealtimeStatusChip();
}"""

if target in c:
    c = c.replace(target, replacement)
    print("Replaced realtime handler with dual-status indicator!")
else:
    print("Target not found!")

# Call updateRealtimeStatusChip() on init
init_call = "updateRealtimeStatusChip();"
if "updateRealtimeStatusChip();" not in c:
    c = c.replace("renderAll();", "renderAll();\n  updateRealtimeStatusChip();")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(c)
