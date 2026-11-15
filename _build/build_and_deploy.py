# -*- coding: utf-8 -*-
import io, hashlib, os, sys, subprocess
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(BASE, '..')

def djb2(s):
    h = 5381
    for ch in s:
        h = ((h * 33) + ord(ch)) & 0xFFFFFFFF
    return format(h, 'x')

PASS = 'n54511'
sha = hashlib.sha256(PASS.encode('utf-8')).hexdigest()
fb = djb2(PASS)

tpl = io.open(os.path.join(BASE, 'app_template2.html'), encoding='utf-8').read()
lib = io.open(os.path.join(BASE, 'xlsx.full.min.js'), encoding='utf-8').read()

assert '<!--SHEETJS-->' in tpl, 'marker missing'
# pass placeholders removed

out = tpl.replace('<!--SHEETJS-->', '<script>\n' + lib + '\n</script>')
out = out.replace('__PASS_SHA__', sha).replace('__PASS_FB__', fb)

# pass check removed
assert out.count('<script>') == 2, f'script count: {out.count("<script>")}'

# 1. Write to _build/PhanTichBaoHanh.html
build_html = os.path.join(BASE, 'PhanTichBaoHanh.html')
io.open(build_html, 'w', encoding='utf-8').write(out)

# 2. Write to root PhanTichBaoHanh.html
root_html = os.path.join(ROOT, 'PhanTichBaoHanh.html')
io.open(root_html, 'w', encoding='utf-8').write(out)

# 3. Write to _deploy/index.html
deploy_html = os.path.join(ROOT, '_deploy', 'index.html')
io.open(deploy_html, 'w', encoding='utf-8').write(out)

# 4. Write serviceos_sync.user.js for Tampermonkey
userjs_content = r'''// ==UserScript==
// @name         Bảo Hành PRO - Đồng bộ ServiceOS
// @namespace    https://phan-tich-bao-hanh.pages.dev/
// @version      2.0
// @description  Tự động thêm nút lấy xe trực tiếp từ ServiceOS Dashboard sang Bảo Hành PRO
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
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;padding:12px 22px;border-radius:50px;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 20px rgba(37,99,235,0.45);display:flex;align-items:center;gap:8px;transition:all 0.2s;font-family:sans-serif;';
    btn.onmouseover = () => btn.style.transform = 'translateY(-2px) scale(1.03)';
    btn.onmouseout = () => btn.style.transform = 'translateY(0) scale(1)';
    btn.onclick = async function() {
      btn.innerHTML = '⏳ Đang đọc trực tiếp ServiceOS...';
      try {
        const res = await fetch('/api/work-orders?status=active&page=1&page_size=500', { credentials: 'same-origin' });
        const d = await res.json();
        const rows = d.rows || d.items || [];
        if (!rows.length) { alert('⚠️ Không có xe nào trong mục "Xe đang trong xưởng"!'); btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO'; return; }
        const orders = rows.map((w, i) => ({
          ...w,
          id: 'ord_' + (w.code || i),
          wo: w.code || w.dms_ro_code || '—',
          plate: w.plate || '—',
          vin: w.vin || '—',
          vehicle: w.model || '—',
          customer: w.customer_name || '—',
          tech: w.technician_name || 'Chưa phân công',
          diagnosis: w.diagnosis || w.symptoms || w.content || '',
          faults: w.faults || [],
          note: (w.foreman_note || w.advisor_note || '').trim(),
          status: w.status_label || w.status || 'Trong xưởng',
          warrantyStatus: w.warranty_status || w.dms_warranty_status || '',
          pinSerial: w.battery_serial_old || w.battery_serial_new || '',
          motorSerial: w.motor_serial_old || w.motor_serial_new || '',
          chargerSerial: w.charger_serial || '',
          removedAt: w.parts_removed_at || w.motor_removed_at || '',
          bhCode: w.dms_warranty_code || w.bh_order_code || '',
          claimCode: w.dms_claim_code || '',
          warranty_kinds: w.warranty_kinds || [],
          warranty_extra: w.warranty_extra || {},
          dateStr: (w.received_at || w.created_at || '').slice(0, 10) || new Date().toISOString().slice(0, 10)
        }));
        const json = JSON.stringify(orders);
        try { navigator.clipboard.writeText(json); } catch(e){}
        const targetUrl = 'https://phan-tich-bao-hanh.pages.dev/#serviceos=' + encodeURIComponent(json);
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
})();
'''
io.open(os.path.join(ROOT, '_deploy', 'serviceos_sync.user.js'), 'w', encoding='utf-8').write(userjs_content)
io.open(os.path.join(ROOT, 'serviceos_sync.user.js'), 'w', encoding='utf-8').write(userjs_content)

print(f"BUILD OK! Length: {len(out)}")
print(f"Updated: {root_html}")
print(f"Updated: {deploy_html}")
