// ==UserScript / Chrome Extension Content Script for ServiceOS Dashboard==
(function () {
  'use strict';

  function initSyncButton() {
    if (document.getElementById('btn-sync-baohanh')) return;

    const btn = document.createElement('button');
    btn.id = 'btn-sync-baohanh';
    btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO';
    btn.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      background: linear-gradient(135deg, #0ea5e9, #2563eb);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 12px 20px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 700;
      box-shadow: 0 8px 24px rgba(14,165,233,0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      transition: all 0.2s ease;
    `;

    btn.onmouseenter = () => btn.style.transform = 'translateY(-2px) scale(1.02)';
    btn.onmouseleave = () => btn.style.transform = 'none';

    btn.onclick = async () => {
      const targetBase = localStorage.getItem('bh_pro_target_url') || 'http://localhost:8787/PhanTichBaoHanh.html';
      const newWin = window.open('about:blank', '_blank');

      try {
        btn.innerHTML = '⏳ Đang kéo danh sách xe...';
        btn.disabled = true;

        let allRows = [];
        let page = 1;
        const pageSize = 200;
        let totalCount = 0;

        while (true) {
          const res = await fetch(`https://att-serviceos.anthinhtech.vn/api/work-orders?status=active&page=${page}&page_size=${pageSize}`);
          if (!res.ok) throw new Error(`Lỗi tải API trang ${page}: HTTP ${res.status}`);
          const d = await res.json();
          const rows = d.rows || d.items || [];
          if (!rows.length) break;
          allRows = allRows.concat(rows);
          totalCount = d.total || d.count || rows.length;
          if (allRows.length >= totalCount || rows.length < pageSize) break;
          page++;
          if (page > 50) break;
        }

        if (!allRows.length) {
          alert('⚠️ Không tìm thấy xe nào trong mục "Xe đang trong xưởng"!');
          btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO';
          btn.disabled = false;
          return;
        }

        // Tự động kéo chi tiết phiếu (warranty_extra + Dealer Portal claims) cho các xe có bảo hành
        const warrantyRows = allRows.filter(w => (w.warranty_kinds && w.warranty_kinds.length > 0) || w.warranty_status || w.battery_serial_old || w.motor_serial_old || (w.faults && w.faults.length > 0) || w.dms_warranty_code);
        if (warrantyRows.length > 0) {
          btn.innerHTML = `⏳ Đang kéo Lệnh BH & ĐXBH (${warrantyRows.length} xe)...`;
          await Promise.all(warrantyRows.map(async (w) => {
            try {
              const [detailRes, dpRes] = await Promise.all([
                fetch(`https://att-serviceos.anthinhtech.vn/api/work-orders/${w.id}`).catch(() => null),
                fetch(`https://att-serviceos.anthinhtech.vn/api/dealer-portal/work-orders/${w.id}`).catch(() => null)
              ]);
              if (detailRes && detailRes.ok) {
                const dt = await detailRes.json();
                const wo = dt.work_order || dt;
                if (wo.warranty_extra) w.warranty_extra = wo.warranty_extra;
                if (wo.dms_warranty_code) w.dms_warranty_code = wo.dms_warranty_code;
                if (wo.dms_claim_code) w.dms_claim_code = wo.dms_claim_code;
                if (wo.dms_ro_code) w.dms_ro_code = wo.dms_ro_code;
                if (wo.inspection_notes) w.inspection_notes = wo.inspection_notes;
              }
              if (dpRes && dpRes.ok) {
                const dp = await dpRes.json();
                const dpClaims = dp.claims || [];
                if (dpClaims.length > 0) {
                  w.dealer_claims = dpClaims;
                  const extra = { ...(w.warranty_extra || {}) };
                  const kinds = w.warranty_kinds || Object.keys(extra) || ['pin'];
                  for (const c of dpClaims) {
                    const wRo = (c.work_order || '').trim();
                    if (wRo && !w.dms_warranty_code) w.dms_warranty_code = wRo;
                    const cNum = (c.number || c.claim_code || '').trim();
                    if (cNum && !w.dms_claim_code) w.dms_claim_code = cNum;
                    let mk = kinds.find(k => {
                      const row = extra[k] || {};
                      const rw = (row.warranty_code || '').trim();
                      return (rw && wRo && rw.toUpperCase() === wRo.toUpperCase());
                    }) || (kinds.length === 1 ? kinds[0] : null) || kinds[0];
                    if (mk) {
                      const row = { ...(extra[mk] || {}) };
                      if (!row.warranty_code && wRo) row.warranty_code = wRo;
                      if (!row.claim_code && cNum) row.claim_code = cNum;
                      if (row.claim_amount == null && c.amount != null) row.claim_amount = c.amount;
                      if (!row.claim_submitted_at && (c.submitted_at || c.created_at)) row.claim_submitted_at = c.submitted_at || c.created_at;
                      if (!row.claim_approved_at && c.approved_at) row.claim_approved_at = c.approved_at;
                      if (c.status && !row.claim_status) row.claim_status = c.status;
                      if (!row.serial_old && c.serial_old) row.serial_old = c.serial_old;
                      if (!row.serial_new && c.serial_new) row.serial_new = c.serial_new;
                      if (!row.dien_giai && c.dien_giai) row.dien_giai = c.dien_giai;
                      extra[mk] = row;
                    }
                  }
                  w.warranty_extra = extra;
                }
              }
            } catch(e){}
          }));
        }

        // Chuẩn hóa toàn bộ danh sách xe đầy đủ trường từ ServiceOS
        const orders = allRows.map((w, i) => ({
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
          chargerSerial: '',
          removedAt: w.parts_removed_at || w.motor_removed_at || '',
          bhCode: w.dms_warranty_code || w.bh_order_code || '',
          claimCode: w.dms_claim_code || '',
          warranty_kinds: w.warranty_kinds || [],
          warranty_extra: w.warranty_extra || {},
          dealer_claims: w.dealer_claims || [],
          dateStr: (w.received_at || w.created_at || '').slice(0, 10) || new Date().toISOString().slice(0, 10)
        }));

        const json = JSON.stringify(orders);
        try { navigator.clipboard.writeText(json); } catch(e){}

        const targetUrl = targetBase.split('#')[0] + '#serviceos=' + encodeURIComponent(json);

        if (newWin && !newWin.closed) {
          newWin.location.href = targetUrl;
          try {
            newWin.postMessage({ type: 'SERVICEOS_DATA', orders: orders }, '*');
          } catch(e){}
        } else {
          window.open(targetUrl, '_blank');
        }

        let toast = document.getElementById('bh-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'bh-toast';
          toast.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;background:#10b981;color:#fff;padding:12px 20px;border-radius:8px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
          document.body.appendChild(toast);
        }
        toast.innerText = `✅ Đã kéo thành công ${orders.length} xe kèm đầy đủ Lệnh BH & ĐXBH!`;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);

      } catch (err) {
        alert('Lỗi đồng bộ: ' + err.message);
        if (newWin && !newWin.closed) newWin.close();
      } finally {
        btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO';
        btn.disabled = false;
      }
    };

    document.body.appendChild(btn);
  }

  setInterval(initSyncButton, 1000);
})();
