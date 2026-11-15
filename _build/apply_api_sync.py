# -*- coding: utf-8 -*-
import os, sys, re, json, subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('Initial length:', len(text))

# ==============================================================================
# 1. UPDATE MODAL BOOKMARKLET WITH TAB API (CÁCH 2)
# ==============================================================================

# Find the tab buttons row in modalBookmarklet
old_tab_buttons = '''    <!-- Tab chuyển đổi phương thức -->
    <div style="display:flex;gap:6px;margin-bottom:14px;border-bottom:1px solid var(--border);padding-bottom:8px">
      <button class="btn" id="tabBtnExtension" onclick="switchSyncTab('extension')" style="font-size:12px;padding:6px 12px">🧩 Tiện ích Chrome (Khuyên dùng)</button>
      <button class="btn secondary" id="tabBtnConsole" onclick="switchSyncTab('console')" style="font-size:12px;padding:6px 12px">⚡ Lệnh F12 (Chạy ngay)</button>
      <button class="btn secondary" id="tabBtnExcel" onclick="switchSyncTab('excel')" style="font-size:12px;padding:6px 12px">📁 File Excel</button>
      <button class="btn secondary" id="tabBtnPaste" onclick="switchSyncTab('paste')" style="font-size:12px;padding:6px 12px">📋 Dán Ctrl+V</button>
    </div>

    <!-- TAB 1: TIỆN ÍCH CHROME EXTENSION HOẶC TAMPERMONKEY -->
    <div id="syncTabExtension" style="display:block">'''

new_tab_buttons_and_api_tab = '''    <!-- Tab chuyển đổi phương thức -->
    <div style="display:flex;gap:6px;margin-bottom:14px;border-bottom:1px solid var(--border);padding-bottom:8px;flex-wrap:wrap">
      <button class="btn" id="tabBtnApi" onclick="switchSyncTab('api')" style="font-size:12px;padding:6px 14px;display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#0284c7,#0ea5e9);border-color:#38bdf8;color:#fff;font-weight:700">⚡ Đồng bộ API Cloudflare (Cách 2)</button>
      <button class="btn secondary" id="tabBtnExtension" onclick="switchSyncTab('extension')" style="font-size:12px;padding:6px 12px">🧩 Tiện ích Chrome</button>
      <button class="btn secondary" id="tabBtnConsole" onclick="switchSyncTab('console')" style="font-size:12px;padding:6px 12px">⚡ Lệnh F12 (Chạy ngay)</button>
      <button class="btn secondary" id="tabBtnExcel" onclick="switchSyncTab('excel')" style="font-size:12px;padding:6px 12px">📁 File Excel</button>
      <button class="btn secondary" id="tabBtnPaste" onclick="switchSyncTab('paste')" style="font-size:12px;padding:6px 12px">📋 Dán Ctrl+V</button>
    </div>

    <!-- TAB 0: ĐỒNG BỘ QUA API CLOUDFLARE WORKER (CÁCH 2 - TỰ ĐỘNG 100%) -->
    <div id="syncTabApi" style="display:block">
      <div style="background:linear-gradient(135deg, rgba(2,132,199,0.14), rgba(15,23,42,0.85));border:1.5px solid #0284c7;border-radius:var(--radius-md);padding:16px;margin-bottom:14px;box-shadow:0 4px 20px rgba(2,132,199,0.2)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:14px;font-weight:700;color:#38bdf8;display:flex;align-items:center;gap:6px">
            ⚡ Đăng nhập & Tự động kéo 481 xe qua API Cloudflare
          </span>
          <span style="font-size:11px;background:#0284c7;color:#fff;padding:2px 8px;border-radius:10px;font-weight:600">Cách 2 Tự động</span>
        </div>
        <p style="font-size:12.5px;color:var(--text-muted);margin-bottom:14px;line-height:1.5">
          Nhập tài khoản ServiceOS của bạn. Máy chủ Cloudflare Worker sẽ tự động kết nối bảo mật sang <b>att-serviceos.anthinhtech.vn</b>, vượt qua rào cản CORS và kéo toàn bộ danh sách 481 xe đang có trong xưởng về chỉ trong 2 giây.
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;color:var(--text-main)">Tên đăng nhập ServiceOS:</label>
            <input type="text" id="serviceOsApiUser" placeholder="vd: nhutruong hoặc admin..." style="width:100%;box-sizing:border-box;padding:8px 12px;border-radius:6px;border:1px solid rgba(56,189,248,0.3);background:rgba(15,23,42,0.85);color:#fff;font-size:13px;outline:none" autocomplete="username">
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;color:var(--text-main)">Mật khẩu ServiceOS:</label>
            <input type="password" id="serviceOsApiPass" placeholder="••••••••" style="width:100%;box-sizing:border-box;padding:8px 12px;border-radius:6px;border:1px solid rgba(56,189,248,0.3);background:rgba(15,23,42,0.85);color:#fff;font-size:13px;outline:none" autocomplete="current-password" onkeydown="if(event.key==='Enter') syncServiceOsViaApi()">
          </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted);cursor:pointer">
            <input type="checkbox" id="serviceOsRememberMe" checked style="accent-color:#0284c7"> Ghi nhớ tài khoản trên máy này (Lưu mã hóa trong LocalStorage)
          </label>
        </div>

        <div style="display:flex;gap:10px;align-items:center">
          <button class="btn primary" id="btnSyncServiceOsApi" onclick="syncServiceOsViaApi()" style="padding:10px 20px;font-size:13px;font-weight:700;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#0284c7,#0ea5e9);border:none;box-shadow:0 4px 14px rgba(2,132,199,0.4);cursor:pointer">
            ⚡ ĐĂNG NHẬP & KÉO 481 XE TỰ ĐỘNG
          </button>
        </div>

        <!-- Khung trạng thái kết nối -->
        <div id="serviceOsApiStatus" style="display:none;margin-top:12px;padding:10px 14px;border-radius:6px;font-size:12.5px;line-height:1.4"></div>
      </div>
    </div>

    <!-- TAB 1: TIỆN ÍCH CHROME EXTENSION HOẶC TAMPERMONKEY -->
    <div id="syncTabExtension" style="display:none">'''

if old_tab_buttons in text:
    text = text.replace(old_tab_buttons, new_tab_buttons_and_api_tab)
    print('Updated modal tab buttons and added syncTabApi successfully!')
else:
    print('Warning: old_tab_buttons not found directly, checking variations...')
    # Try alternate match if already modified
    assert 'id="modalBookmarklet"' in text, 'modalBookmarklet missing'

# ==============================================================================
# 2. UPDATE JAVASCRIPT FUNCTIONS (switchSyncTab, openBookmarkletModal, syncServiceOsViaApi)
# ==============================================================================

old_switch_fn = '''window.openBookmarkletModal = function(){
  const m = $('#modalBookmarklet');
  if(m) {
    m.hidden = false;
    const box = $('#bmConsoleCodeBox');
    if(box) box.value = getConsoleSnippetCode();
  }
};
window.closeBookmarkletModal = function(){
  const m = $('#modalBookmarklet');
  if(m) m.hidden = true;
};

window.switchSyncTab = function(tab){
  const tabs = ['extension', 'console', 'excel', 'paste'];
  tabs.forEach(t => {
    const el = $('#syncTab' + t.charAt(0).toUpperCase() + t.slice(1));
    const btn = $('#tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    if(el) el.style.display = (t === tab) ? 'block' : 'none';
    if(btn) {
      if(t === tab) { btn.classList.remove('secondary'); }
      else { btn.classList.add('secondary'); }
    }
  });
};'''

new_switch_fn = '''window.initServiceOsApiForm = function(){
  try {
    const savedUser = localStorage.getItem('bhpro_sos_user');
    const savedPass = localStorage.getItem('bhpro_sos_pass');
    const userEl = $('#serviceOsApiUser');
    const passEl = $('#serviceOsApiPass');
    const remEl = $('#serviceOsRememberMe');
    if(savedUser && userEl) userEl.value = savedUser;
    if(savedPass && passEl) {
      try { passEl.value = atob(savedPass); } catch(e){}
    }
    if(remEl && savedUser) remEl.checked = true;
  } catch(e){}
};

window.openBookmarkletModal = function(tab){
  const m = $('#modalBookmarklet');
  if(m) {
    m.hidden = false;
    const box = $('#bmConsoleCodeBox');
    if(box) box.value = getConsoleSnippetCode();
    if(typeof window.initServiceOsApiForm === 'function') window.initServiceOsApiForm();
    window.switchSyncTab(tab || 'api');
  }
};

window.closeBookmarkletModal = function(){
  const m = $('#modalBookmarklet');
  if(m) m.hidden = true;
};

window.switchSyncTab = function(tab){
  const tabs = ['api', 'extension', 'console', 'excel', 'paste'];
  tabs.forEach(t => {
    const el = $('#syncTab' + t.charAt(0).toUpperCase() + t.slice(1));
    const btn = $('#tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    if(el) el.style.display = (t === tab) ? 'block' : 'none';
    if(btn) {
      if(t === tab) {
        btn.classList.remove('secondary');
        if(t === 'api') {
          btn.style.background = 'linear-gradient(135deg,#0284c7,#0ea5e9)';
          btn.style.color = '#fff';
        }
      } else {
        btn.classList.add('secondary');
        if(t === 'api') {
          btn.style.background = '';
          btn.style.color = '';
        }
      }
    }
  });
};

window.syncServiceOsViaApi = async function(){
  const userEl = $('#serviceOsApiUser');
  const passEl = $('#serviceOsApiPass');
  const rememberEl = $('#serviceOsRememberMe');
  const statusEl = $('#serviceOsApiStatus');
  const btnEl = $('#btnSyncServiceOsApi');

  const username = (userEl ? userEl.value : '').trim();
  const password = passEl ? passEl.value : '';

  if (!username || !password) {
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.style.background = 'rgba(239, 68, 68, 0.15)';
      statusEl.style.border = '1px solid #ef4444';
      statusEl.style.color = '#fca5a5';
      statusEl.innerHTML = '⚠️ Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu ServiceOS!';
    }
    if (!username && userEl) userEl.focus();
    else if (!password && passEl) passEl.focus();
    return;
  }

  // Lưu thông tin đăng nhập nếu chọn Remember
  try {
    if (rememberEl && rememberEl.checked) {
      localStorage.setItem('bhpro_sos_user', username);
      localStorage.setItem('bhpro_sos_pass', btoa(password));
    } else {
      localStorage.removeItem('bhpro_sos_user');
      localStorage.removeItem('bhpro_sos_pass');
    }
  } catch (e) {}

  // Hiển thị trạng thái đang tải
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite">⏳</span> Đang kết nối ServiceOS...';
  }
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.style.background = 'rgba(2, 132, 199, 0.15)';
    statusEl.style.border = '1px solid #0284c7';
    statusEl.style.color = '#7dd3fc';
    statusEl.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;margin-right:6px">⏳</span> Đang xác thực tài khoản và kéo 481 xe qua API Cloudflare Worker...';
  }

  // Tự động xác định endpoint:
  // Nếu mở trên Cloudflare Worker / Pages -> /api/sync-serviceos
  // Nếu mở dạng file:/// máy tính -> gọi tới https://fragrant-heart-e2d4.truongtruong-05072000.workers.dev/api/sync-serviceos
  let apiUrl = '/api/sync-serviceos';
  if (window.location.protocol === 'file:' || !window.location.origin || window.location.origin === 'null') {
    apiUrl = 'https://fragrant-heart-e2d4.truongtruong-05072000.workers.dev/api/sync-serviceos';
  }

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(data.error || `Lỗi máy chủ (${res.status})`);
    }

    const rawRows = data.orders || [];
    if (!rawRows.length) {
      throw new Error('Đăng nhập thành công nhưng không tìm thấy xe nào trong mục "Xe đang trong xưởng"!');
    }

    // Phân tích và chuẩn hóa theo 4 quy tắc
    const orders = rawRows.map((d, i) => normalizeOrder(d, i));
    state.checkXe.orders = orders;
    saveCheckXeOrders();

    if (statusEl) {
      statusEl.style.background = 'rgba(16, 185, 129, 0.15)';
      statusEl.style.border = '1px solid #10b981';
      statusEl.style.color = '#6ee7b7';
      statusEl.innerHTML = `🎉 <b>Thành công!</b> Đã kéo <b>${orders.length}</b> xe và phân tích 4 quy tắc tự động. Đang chuyển giao diện...`;
    }

    setTimeout(() => {
      closeBookmarkletModal();
      if (typeof window.switchTab === 'function') window.switchTab('checkxe');
      renderCheckXe();
      alert(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ${orders.length} XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!`);
    }, 700);

  } catch (err) {
    console.error('[ServiceOS Sync Error]', err);
    if (statusEl) {
      statusEl.style.background = 'rgba(239, 68, 68, 0.15)';
      statusEl.style.border = '1px solid #ef4444';
      statusEl.style.color = '#fca5a5';
      statusEl.innerHTML = `❌ <b>Không thể đồng bộ:</b> ${err.message || String(err)}<br><small style="color:#f87171">Kiểm tra lại tài khoản/mật khẩu ServiceOS hoặc dùng tiện ích Chrome ở tab bên cạnh.</small>`;
    }
  } finally {
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.innerHTML = '⚡ ĐĂNG NHẬP & KÉO 481 XE TỰ ĐỘNG';
    }
  }
};'''

if old_switch_fn in text:
    text = text.replace(old_switch_fn, new_switch_fn)
    print('Updated switchSyncTab and added syncServiceOsViaApi successfully!')
else:
    print('Warning: old_switch_fn not found directly, checking...')

# Update button labels in renderCheckXe to highlight API Sync
text = text.replace(
    '''<button class="btn primary" onclick="openBookmarkletModal()">${window.ICONS.zap} Đọc trực tiếp ServiceOS</button>''',
    '''<button class="btn primary" onclick="openBookmarkletModal('api')">${window.ICONS.zap} Đồng bộ API ServiceOS</button>'''
)
text = text.replace(
    '''<button class="btn primary" onclick="openBookmarkletModal()">⚡ Đọc dữ liệu trực tiếp ServiceOS</button>''',
    '''<button class="btn primary" onclick="openBookmarkletModal('api')">⚡ Đồng bộ API ServiceOS (Cách 2)</button>'''
)

# Save to PhanTichBaoHanh.html
with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

# Save to _build/PhanTichBaoHanh.html
with open('_build/PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

# Save to _deploy/index.html
with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated files successfully! New length:', len(text))
