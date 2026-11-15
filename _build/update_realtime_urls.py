# -*- coding: utf-8 -*-
import io, os

BASE = os.path.dirname(os.path.abspath(__file__))
TPL_PATH = os.path.join(BASE, 'app_template2.html')

tpl = io.open(TPL_PATH, 'r', encoding='utf-8').read()

old_trigger = """  window.triggerBackendSync = function() {
    updateStatusUi('syncing', 'Đang kích hoạt quét ngầm...', null);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'TRIGGER_SYNC' }));
    } else {
      fetch('/api/sync/trigger', { method: 'POST' })
        .then(r => r.json())
        .then(() => updateStatusUi('connected', 'Đã quét xong', null))
        .catch(() => updateStatusUi('offline', 'Lỗi kết nối', null));
    }
  };"""

new_trigger = """  function getBackendBaseUrl() {
    const custom = window.NEXT_PUBLIC_BACKEND_URL || window.VITE_BACKEND_URL || window.BACKEND_REALTIME_URL || '';
    if (custom && custom.startsWith('http')) return custom.replace(/\\/+$/, '');
    return '';
  }

  window.triggerBackendSync = function() {
    updateStatusUi('syncing', 'Đang kích hoạt quét ngầm...', null);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'TRIGGER_SYNC' }));
    } else {
      const base = getBackendBaseUrl();
      const triggerUrl = base ? `${base}/api/sync/trigger` : '/api/sync/trigger';
      fetch(triggerUrl, { method: 'POST' })
        .then(r => r.json())
        .then(() => updateStatusUi('connected', 'Đã quét xong', null))
        .catch(() => updateStatusUi('offline', 'Lỗi kết nối', null));
    }
  };"""

old_connect = """    let wsHost = window.location.host;
    if (!wsHost || wsHost.startsWith('127.0.0.1:5500') || window.location.protocol === 'file:') {
      wsHost = 'localhost:8787';
    }
    const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProto}//${wsHost}/ws`;"""

new_connect = """    const backendBase = getBackendBaseUrl();
    let wsUrl = '';
    if (backendBase) {
      const clean = backendBase.replace(/^http/, 'ws');
      wsUrl = `${clean}/ws`;
    } else {
      let wsHost = window.location.host;
      if (!wsHost || wsHost.startsWith('127.0.0.1:5500') || window.location.protocol === 'file:') {
        wsHost = 'localhost:3001';
      }
      const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${wsProto}//${wsHost}/ws`;
    }"""

old_sse = """    try {
      const sseUrl = '/api/realtime/sse';
      sseSource = new EventSource(sseUrl);"""

new_sse = """    try {
      const base = getBackendBaseUrl();
      const sseUrl = base ? `${base}/api/realtime/sse` : '/api/realtime/sse';
      sseSource = new EventSource(sseUrl);"""

old_save = """    } else {
      fetch('/api/user-edits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, patch })
      }).catch(() => {});
    }"""

new_save = """    } else {
      const base = getBackendBaseUrl();
      const editUrl = base ? `${base}/api/user-edits` : '/api/user-edits';
      fetch(editUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, patch })
      }).catch(() => {});
    }"""

if old_trigger in tpl:
    tpl = tpl.replace(old_trigger, new_trigger, 1)
    print("Updated triggerBackendSync with dynamic Backend URL.")

if old_connect in tpl:
    tpl = tpl.replace(old_connect, new_connect, 1)
    print("Updated connectWs with dynamic Backend URL.")

if old_sse in tpl:
    tpl = tpl.replace(old_sse, new_sse, 1)
    print("Updated startSseFallback with dynamic Backend URL.")

if old_save in tpl:
    tpl = tpl.replace(old_save, new_save, 1)
    print("Updated saveUserEditToBackend with dynamic Backend URL.")

io.open(TPL_PATH, 'w', encoding='utf-8').write(tpl)
print("Finished updating _build/app_template2.html.")
