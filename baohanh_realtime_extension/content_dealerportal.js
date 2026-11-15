// Content script chạy trên VinFast Dealer Portal: https://*.vinfast.com/*
(function() {
  console.log('[Bảo Hành PRO] Đã kích hoạt VinFast Dealer Portal Realtime Sync!');

  // 1. Inject interceptor vào MAIN world
  try {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('injected_interceptor.js');
    s.onload = function() { this.remove(); };
    (document.head || document.documentElement).appendChild(s);
  } catch(e){}

  const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('BAOHANH_REALTIME_SYNC') : null;
  let allCapturedClaims = [];

  function broadcastDealerClaims(claims) {
    if (!claims) return;
    const list = Array.isArray(claims) ? claims : (claims.data || claims.rows || claims.items || []);
    if (!Array.isArray(list) || list.length === 0) return;

    // Hợp nhất vào bộ nhớ tạm
    const map = new Map();
    allCapturedClaims.forEach(c => {
      const k = c.warrantyClaimNumber || c.id || c.workOrderNumber || JSON.stringify(c);
      map.set(k, c);
    });
    list.forEach(c => {
      const k = c.warrantyClaimNumber || c.id || c.workOrderNumber || JSON.stringify(c);
      map.set(k, c);
    });
    allCapturedClaims = Array.from(map.values());

    console.log(`[Bảo Hành PRO] ⚡ Đang đồng bộ ${allCapturedClaims.length} đề xuất từ Dealer Portal sang Web...`);
    updateFloatingWidget(allCapturedClaims.length);

    // A. Gửi qua Chrome Extension Background
    try {
      chrome.runtime.sendMessage({
        type: 'DEALER_PORTAL_REALTIME',
        claims: allCapturedClaims,
        timestamp: Date.now()
      });
    } catch(e){}

    // B. Gửi qua BroadcastChannel
    if (bc) {
      try {
        bc.postMessage({
          type: 'DEALER_PORTAL_REALTIME',
          claims: allCapturedClaims,
          timestamp: Date.now()
        });
      } catch(e){}
    }

    // C. Lưu vào localStorage
    try {
      localStorage.setItem('bh_realtime_dealer_event', JSON.stringify({
        claims: allCapturedClaims,
        timestamp: Date.now()
      }));
    } catch(e){}
  }

  // 2. Kéo full đề xuất nếu có phân trang
  let lastCapturedClaimsUrl = '';
  let isFetchingAllClaims = false;

  async function fetchAllDealerClaims(baseApiUrl, totalCount = 0) {
    if (isFetchingAllClaims || !baseApiUrl) return;
    isFetchingAllClaims = true;
    try {
      let urlObj;
      try {
        urlObj = new URL(baseApiUrl, location.origin);
      } catch(e){
        urlObj = new URL(location.origin + baseApiUrl);
      }
      urlObj.searchParams.set('limit', '100');
      urlObj.searchParams.set('page', '1');

      const res1 = await fetch(urlObj.toString(), {
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      });
      if (!res1.ok) { isFetchingAllClaims = false; return; }
      const json1 = await res1.json();
      const list1 = json1.data || json1.rows || json1.items || (Array.isArray(json1) ? json1 : []);
      const total = json1.total || totalCount || list1.length;

      let allClaims = [...list1];
      if (total > list1.length) {
        const totalPages = Math.ceil(total / 100);
        const promises = [];
        for (let p = 2; p <= Math.min(totalPages, 20); p++) {
          const nextUrl = new URL(urlObj.toString());
          nextUrl.searchParams.set('page', String(p));
          promises.push(
            fetch(nextUrl.toString(), { headers: { 'Accept': 'application/json' }, credentials: 'include' })
              .then(r => r.ok ? r.json() : null)
              .then(d => d ? (d.data || d.rows || d.items || []) : [])
              .catch(() => [])
          );
        }
        const others = await Promise.all(promises);
        for (const pClaims of others) {
          if (Array.isArray(pClaims) && pClaims.length > 0) {
            allClaims = allClaims.concat(pClaims);
          }
        }
      }

      console.log(`[Bảo Hành PRO] Đã kéo trọn vẹn ${allClaims.length} / ${total} đề xuất Dealer Portal!`);
      if (allClaims.length > 0) {
        broadcastDealerClaims(allClaims);
      }
    } catch(e) {
      console.error('[Bảo Hành PRO] Lỗi kéo full đề xuất Dealer Portal:', e);
    } finally {
      isFetchingAllClaims = false;
    }
  }

  // 3. Nhận dữ liệu được bắt bởi Injected Interceptor
  window.addEventListener('message', function(ev) {
    if (ev.data && ev.data.source === 'BH_PAGE_INTERCEPT') {
      if (ev.data.type === 'DEALER_PORTAL_LINE_ITEMS') {
        try { chrome.runtime.sendMessage(ev.data); } catch(e){}
        if (bc) { try { bc.postMessage(ev.data); } catch(e){} }
        return;
      }
      if (ev.data.type === 'DEALER_PORTAL_DATA') {
        const claims = ev.data.claims;
        const total = ev.data.total || 0;
        lastCapturedClaimsUrl = ev.data.url || lastCapturedClaimsUrl;
        
        // ⚡ Bắn ngay trang đầu tiên lập tức để giao diện Web cập nhật với độ trễ 0ms!
        broadcastDealerClaims(claims);

        // Sau đó nếu còn trang sau thì tự động kéo ngầm mượt mà
        if (total > claims.length && lastCapturedClaimsUrl && !lastCapturedClaimsUrl.includes('__NEXT_DATA__')) {
          fetchAllDealerClaims(lastCapturedClaimsUrl, total);
        }
      }
    }
  });

  // 4. Quét bảng HTML (DOM Scraper) dự phòng trực tiếp trên màn hình Dealer Portal
  function scrapeDomClaims() {
    try {
      const rows = document.querySelectorAll('table tbody tr, .ant-table-tbody tr');
      if (!rows || rows.length === 0) return;

      const domClaims = [];
      rows.forEach(tr => {
        const text = tr.innerText || '';
        // Tìm mã đề xuất WC-...
        const wcMatch = text.match(/WC-[A-Z0-9_\-]+/i);
        // Tìm mã WO: N54511-WO-... hoặc ...-WO-...
        const woMatch = text.match(/[A-Z0-9]+-WO-[A-Z0-9_\-]+/i) || text.match(/[A-Z0-9]+-[0-9]{6}-[0-9]{3,4}/i);
        // Tìm biển số xe
        const plateMatch = text.match(/[0-9]{2}[A-Z][0-9A-Z]?-[0-9]{4,5}/i);
        // Tìm VIN
        const vinMatch = text.match(/RPX[A-Z0-9]{14}/i) || text.match(/[A-HJ-NPR-Z0-9]{17}/i);

        if (wcMatch || woMatch) {
          // Trích xuất số tiền
          const amounts = (text.match(/([0-9]{1,3}(?:\.[0-9]{3})+)/g) || []).map(s => Number(s.replace(/\./g, '')));
          
          let status = 'Đã phê duyệt';
          if (/từ chối|reject/i.test(text)) status = 'Từ chối';
          else if (/cấp 1 trả về|trả về c1|return.*1/i.test(text)) status = 'Cấp 1 trả về';
          else if (/cấp 2 trả về|trả về c2|return.*2/i.test(text)) status = 'Cấp 2 trả về';
          else if (/chờ duyệt|pending|waiting/i.test(text)) status = 'Chờ duyệt';
          else if (/hủy|cancel/i.test(text)) status = 'Đã hủy';

          domClaims.push({
            warrantyClaimNumber: wcMatch ? wcMatch[0].trim() : '',
            workOrderNumber: woMatch ? woMatch[0].trim() : '',
            plate: plateMatch ? plateMatch[0].trim().toUpperCase() : '',
            vin: vinMatch ? vinMatch[0].trim().toUpperCase() : '',
            status: status,
            totalRequestedAmountInclTax: amounts[0] || null,
            totalApprovedAmountInclTax: amounts[1] || amounts[0] || null,
            _fromDom: true
          });
        }
      });

      if (domClaims.length > 0) {
        broadcastDealerClaims(domClaims);
      }
    } catch(e){}
  }

  // 5. Widget hiển thị trực quan trạng thái đồng bộ trên Dealer Portal
  function initFloatingWidget() {
    if (document.getElementById('bh-portal-sync-widget')) return;
    const div = document.createElement('div');
    div.id = 'bh-portal-sync-widget';
    div.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;background:linear-gradient(135deg,#0f172a,#1e293b);color:#f8fafc;padding:10px 16px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.5);border:1px solid rgba(56,189,248,0.4);font-family:sans-serif;font-size:13px;display:flex;align-items:center;gap:10px;backdrop-filter:blur(8px);';
    
    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:16px">⚡</span>
        <div>
          <div style="font-weight:700;color:#38bdf8">Bảo Hành PRO Sync</div>
          <div id="bh-widget-count" style="font-size:11px;color:#94a3b8">Đang lắng nghe dữ liệu...</div>
        </div>
      </div>
      <button id="bh-widget-btn" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s">Gửi sang Web</button>
    `;

    document.body.appendChild(div);

    const btn = document.getElementById('bh-widget-btn');
    if (btn) {
      btn.onclick = () => {
        scrapeDomClaims();
        if (allCapturedClaims.length > 0) {
          broadcastDealerClaims(allCapturedClaims);
          // Copy vào clipboard để người dùng có thể Ctrl+V sang tab Web nếu muốn
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(JSON.stringify(allCapturedClaims));
          }
          btn.textContent = '✅ Đã gửi!';
          setTimeout(() => { btn.textContent = 'Gửi sang Web'; }, 2000);
        } else {
          alert('Chưa tìm thấy đề xuất trên trang này. Hãy chắc chắn bạn đang mở mục Quản lý đề xuất bảo hành!');
        }
      };
    }
  }

  function updateFloatingWidget(count) {
    const el = document.getElementById('bh-widget-count');
    if (el) {
      el.textContent = `Đã kết nối: ${count} đề xuất`;
      el.style.color = '#4ade80';
    }
  }

  setTimeout(() => {
    initFloatingWidget();
    scrapeDomClaims();
  }, 2000);

  setInterval(scrapeDomClaims, 5000);

  // Thăm dò định kỳ nếu có URL đã bắt
  setInterval(() => {
    if (lastCapturedClaimsUrl && !lastCapturedClaimsUrl.includes('__NEXT_DATA__')) {
      fetchAllDealerClaims(lastCapturedClaimsUrl);
    }
  }, 25000);
})();
