# -*- coding: utf-8 -*-
import io, os, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE = os.path.dirname(os.path.abspath(__file__))
TPL_PATH = os.path.join(BASE, 'app_template2.html')

tpl = io.open(TPL_PATH, 'r', encoding='utf-8').read()

# 1. CSS for Realtime Status Pill
css_target = ".header-btn.excel-btn:hover {"
css_inject = """/* 24/7 Realtime Status Indicator */
.realtime-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: var(--radius-full);
  padding: 5px 13px;
  font-size: 11.5px;
  font-weight: 600;
  color: #34d399;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}
.realtime-status-pill:hover {
  background: rgba(16, 185, 129, 0.22);
  border-color: #34d399;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
}
.realtime-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  flex-shrink: 0;
}
.realtime-dot.pulse {
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: realtimePulse 2s infinite;
}
.realtime-dot.warning {
  background: #f59e0b;
  box-shadow: none;
  animation: none;
}
.realtime-dot.syncing {
  background: #38bdf8;
  animation: realtimeSpin 1s infinite linear;
}
@keyframes realtimePulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
@keyframes realtimeSpin {
  0% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0.4; transform: scale(0.8); }
}

"""

if css_inject not in tpl and css_target in tpl:
    tpl = tpl.replace(css_target, css_inject + css_target, 1)
    print("Injected Realtime CSS.")

# 2. HTML Badge in header-actions
header_target = '<div class="header-actions">'
badge_html = """<div class="header-actions">
      <!-- Realtime 24/7 Status Indicator -->
      <div id="realtimeStatusBadge" class="realtime-status-pill" onclick="window.triggerBackendSync()" title="Hệ thống Real-time 24/7 đang chạy ngầm: Tự động đồng bộ 100% dữ liệu xe không cần bấm nút. Bấm để kích hoạt quét ngay!">
        <span class="realtime-dot pulse"></span>
        <span class="realtime-text" id="realtimeStatusText">Realtime 24/7: Đang kết nối...</span>
      </div>"""

if 'id="realtimeStatusBadge"' not in tpl and header_target in tpl:
    tpl = tpl.replace(header_target, badge_html, 1)
    print("Injected Realtime HTML Badge in Header.")

# 3. Augment saveCheckXeOrders
save_fn_target = """function saveCheckXeOrders(){
  try {
    localStorage.setItem('bh_checkxe_orders', JSON.stringify(state.checkXe.orders));
  } catch(e){}
}"""

save_fn_replacement = """function saveCheckXeOrders(){
  try {
    localStorage.setItem('bh_checkxe_orders', JSON.stringify(state.checkXe.orders));
    if (typeof window.syncUserEditsToBackend === 'function') {
      window.syncUserEditsToBackend();
    }
  } catch(e){}
}"""

if save_fn_target in tpl:
    tpl = tpl.replace(save_fn_target, save_fn_replacement, 1)
    print("Augmented saveCheckXeOrders with syncUserEditsToBackend.")

# 4. In-Place support in renderCheckXe
# Ensure renderCheckXe({ inPlace: true }) preserves active focus and scroll
render_fn_target = "function renderCheckXe(options = {}){"
render_fn_support = """function renderCheckXe(options = {}){
  const scrollY = (options && options.inPlace) ? window.scrollY : null;
  const activeElId = (options && options.inPlace && document.activeElement) ? document.activeElement.id : null;
"""
if render_fn_target in tpl and "const scrollY = (options && options.inPlace)" not in tpl:
    tpl = tpl.replace(render_fn_target, render_fn_support, 1)
    print("Added inPlace option support to renderCheckXe.")

# 5. Inject Realtime Client Script right before </script>
script_close_target = "setupEmblemInteraction();\n  }\n})();\n\n</script>"
if script_close_target not in tpl:
    script_close_target = "setupEmblemInteraction();\r\n  }\r\n})();\r\n\r\n</script>"

realtime_client_js = """
// ==================== REALTIME 24/7 BACKGROUND SYNC CLIENT ====================
(function initRealtimeClient() {
  let ws = null;
  let reconnectTimer = null;
  let sseSource = null;
  let isConnecting = false;

  function updateStatusUi(status, text, count) {
    const badge = document.getElementById('realtimeStatusBadge');
    const label = document.getElementById('realtimeStatusText');
    const dot = badge ? badge.querySelector('.realtime-dot') : null;
    if (!badge || !label) return;

    if (status === 'connected') {
      badge.style.background = 'rgba(16, 185, 129, 0.12)';
      badge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      badge.style.color = '#34d399';
      if (dot) {
        dot.className = 'realtime-dot pulse';
        dot.style.background = '#10b981';
      }
      const numCars = count !== undefined && count !== null ? count : ((state.checkXe && state.checkXe.orders) ? state.checkXe.orders.length : 0);
      label.textContent = text || `Realtime 24/7: ${numCars} xe`;
    } else if (status === 'syncing') {
      badge.style.background = 'rgba(56, 189, 248, 0.15)';
      badge.style.borderColor = 'rgba(56, 189, 248, 0.5)';
      badge.style.color = '#38bdf8';
      if (dot) {
        dot.className = 'realtime-dot syncing';
        dot.style.background = '#38bdf8';
      }
      label.textContent = text || 'Đang quét dữ liệu...';
    } else {
      badge.style.background = 'rgba(245, 158, 11, 0.12)';
      badge.style.borderColor = 'rgba(245, 158, 11, 0.35)';
      badge.style.color = '#fbbf24';
      if (dot) {
        dot.className = 'realtime-dot warning';
        dot.style.background = '#f59e0b';
      }
      label.textContent = text || 'Offline / Đang thử lại...';
    }
  }

  window.triggerBackendSync = function() {
    updateStatusUi('syncing', 'Đang kích hoạt quét ngầm...', null);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'TRIGGER_SYNC' }));
    } else {
      fetch('/api/sync/trigger', { method: 'POST' })
        .then(r => r.json())
        .then(() => updateStatusUi('connected', 'Đã quét xong', null))
        .catch(() => updateStatusUi('offline', 'Lỗi kết nối', null));
    }
  };

  // Zero-Flicker in-place merge of orders
  function mergeOrdersInPlace(newOrders) {
    if (!Array.isArray(newOrders) || newOrders.length === 0) return;
    if (!state.checkXe) state.checkXe = { orders: [] };
    if (!Array.isArray(state.checkXe.orders)) state.checkXe.orders = [];

    const existingMap = new Map();
    state.checkXe.orders.forEach((ord, idx) => {
      const key = ord.vin ? ord.vin.toUpperCase() : (ord.plate || ord.id || String(idx));
      existingMap.set(key, { ord, idx });
    });

    let hasChange = false;
    newOrders.forEach(rawItem => {
      const norm = (typeof normalizeOrder === 'function') ? normalizeOrder(rawItem) : rawItem;
      const key = norm.vin ? norm.vin.toUpperCase() : (norm.plate || norm.id);
      if (existingMap.has(key)) {
        const { ord } = existingMap.get(key);
        // Preserve user local edits
        const preservedUserNote = ord.userNote || ord.ghiChuKtv;
        const preservedDispatch = ord.internalDispatch;
        const preservedTimer = ord.customTimer;
        
        Object.assign(ord, norm);
        if (preservedUserNote) ord.userNote = preservedUserNote;
        if (preservedDispatch) ord.internalDispatch = preservedDispatch;
        if (preservedTimer) ord.customTimer = preservedTimer;
        hasChange = true;
      } else {
        state.checkXe.orders.push(norm);
        existingMap.set(key, { ord: norm, idx: state.checkXe.orders.length - 1 });
        hasChange = true;
      }
    });

    if (hasChange) {
      try {
        localStorage.setItem('bh_checkxe_orders', JSON.stringify(state.checkXe.orders));
      } catch(e){}
      if (typeof renderCheckXe === 'function') {
        renderCheckXe({ inPlace: true });
      }
    }
  }

  function connectWs() {
    if (isConnecting) return;
    isConnecting = true;

    let wsHost = window.location.host;
    if (!wsHost || wsHost.startsWith('127.0.0.1:5500') || window.location.protocol === 'file:') {
      wsHost = 'localhost:8787';
    }
    const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProto}//${wsHost}/ws`;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = function() {
        isConnecting = false;
        console.log('[Realtime Client] ⚡ Đã kết nối WebSocket:', wsUrl);
        updateStatusUi('connected', null, (state.checkXe && state.checkXe.orders) ? state.checkXe.orders.length : 0);
      };

      ws.onmessage = function(event) {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'INIT_SNAPSHOT') {
            console.log(`[Realtime Client] Snapshot nhận ${msg.total} xe.`);
            if (Array.isArray(msg.orders) && msg.orders.length > 0) {
              mergeOrdersInPlace(msg.orders);
            }
            updateStatusUi('connected', null, (state.checkXe && state.checkXe.orders) ? state.checkXe.orders.length : msg.total);
          } else if (msg.type === 'ORDER_DELTA') {
            console.log(`[Realtime Client] ⚡ Delta Update (${msg.source}): ${msg.items ? msg.items.length : 0} xe`);
            if (Array.isArray(msg.items) && msg.items.length > 0) {
              mergeOrdersInPlace(msg.items);
            }
            updateStatusUi('connected', null, (state.checkXe && state.checkXe.orders) ? state.checkXe.orders.length : 0);
          } else if (msg.type === 'SYNC_STATUS') {
            if (msg.status && msg.status.isSyncing) {
              updateStatusUi('syncing', 'Đang quét ngầm 24/7...', null);
            } else {
              updateStatusUi('connected', null, (state.checkXe && state.checkXe.orders) ? state.checkXe.orders.length : 0);
            }
          }
        } catch (err) {
          console.warn('[Realtime Client] Lỗi parse WS payload:', err);
        }
      };

      ws.onclose = function() {
        isConnecting = false;
        updateStatusUi('offline', 'Mất kết nối - Thử lại sau 3s...', null);
        if (reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(connectWs, 3000);
      };

      ws.onerror = function() {
        isConnecting = false;
        startSseFallback();
      };
    } catch (e) {
      isConnecting = false;
      startSseFallback();
    }
  }

  function startSseFallback() {
    if (sseSource) return;
    try {
      const sseUrl = '/api/realtime/sse';
      sseSource = new EventSource(sseUrl);
      sseSource.addEventListener('INIT_SNAPSHOT', function(e) {
        const msg = JSON.parse(e.data);
        if (Array.isArray(msg.orders)) mergeOrdersInPlace(msg.orders);
        updateStatusUi('connected', null, msg.total);
      });
      sseSource.addEventListener('ORDER_DELTA', function(e) {
        const msg = JSON.parse(e.data);
        if (Array.isArray(msg.items)) mergeOrdersInPlace(msg.items);
        updateStatusUi('connected', null, (state.checkXe && state.checkXe.orders) ? state.checkXe.orders.length : 0);
      });
      sseSource.onerror = function() {
        sseSource.close();
        sseSource = null;
      };
    } catch(err){}
  }

  window.saveUserEditToBackend = function(orderId, patch) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'SAVE_USER_EDIT',
        orderId,
        patch
      }));
    } else {
      fetch('/api/user-edits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, patch })
      }).catch(() => {});
    }
  };

  window.syncUserEditsToBackend = function() {
    // Optionally sync all notes
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', connectWs);
  } else {
    connectWs();
  }
})();
"""

script_end_target = "})();\n\n</script>"
if script_end_target not in tpl:
    script_end_target = "})();\r\n\r\n</script>"

if "initRealtimeClient" not in tpl:
    tpl = tpl.replace(script_end_target, "})();\n" + realtime_client_js + "\n</script>", 1)
    print("Injected Realtime Client JS.")

io.open(TPL_PATH, 'w', encoding='utf-8').write(tpl)
print("Updated _build/app_template2.html successfully.")
