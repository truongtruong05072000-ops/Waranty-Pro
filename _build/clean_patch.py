# -*- coding: utf-8 -*-
with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

target_str = 'window.copyExtensionPath = function(){'
idx_target = text.find(target_str)
assert idx_target != -1, 'copyExtensionPath not found'

idx_start = text.find('window.syncServiceOsViaApi = async function(){')
assert idx_start != -1, 'syncServiceOsViaApi not found'

new_fn = '''window.syncServiceOsViaApi = async function(){
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
    statusEl.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;margin-right:6px">⏳</span> Đang xác thực tài khoản và kéo 481 xe qua API...';
  }

  // Danh sách các cổng API kết nối thông minh (ưu tiên local proxy trên máy -> Cloudflare Worker)
  const candidateUrls = [
    'http://127.0.0.1:8787/api/sync-serviceos',
    window.location.protocol === 'file:' ? 'https://fragrant-heart-e2d4.truongtruong-05072000.workers.dev/api/sync-serviceos' : '/api/sync-serviceos',
    'https://fragrant-heart-e2d4.truongtruong-05072000.workers.dev/api/sync-serviceos'
  ];
  const apiUrls = [...new Set(candidateUrls)];

  let lastErr = null;
  let successData = null;

  for (const url of apiUrls) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 25000);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        signal: ctrl.signal
      });
      clearTimeout(timer);

      if (res.status === 404) {
        lastErr = new Error(`Máy chủ tại ${url} chưa cấu hình API (404)`);
        continue;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Lỗi máy chủ (${res.status})`);
      }

      successData = data;
      break; // Thành công!
    } catch(err) {
      lastErr = err;
      if (err.message && (err.message.includes('không đúng') || err.message.includes('401'))) {
        break;
      }
    }
  }

  try {
    if (!successData) {
      throw lastErr || new Error('Không thể kết nối đến máy chủ API!');
    }

    const rawRows = successData.orders || [];
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
};

'''

text = text[:idx_start] + new_fn + text[idx_target:]

with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_build/PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Cleaned up PhanTichBaoHanh.html and _deploy/index.html!')
