// Content script chạy trên ServiceOS: https://att-serviceos.anthinhtech.vn/*
(function() {
  console.log('[Bảo Hành PRO] Đã kích hoạt ServiceOS Realtime Sync (Đồng bộ chính xác xe trong xưởng)!');

  // 1. Inject interceptor vào MAIN world
  try {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('injected_interceptor.js');
    s.onload = function() { this.remove(); };
    (document.head || document.documentElement).appendChild(s);
  } catch(e){}

  const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('BAOHANH_REALTIME_SYNC') : null;

  function broadcastServiceOsOrders(orders) {
    if (!Array.isArray(orders) || orders.length === 0) return;

    // Lọc bỏ các xe đã giao hoặc hủy
    const activeOrders = orders.filter(w => {
      const st = String(w.status || '').toLowerCase();
      return st !== 'delivered' && st !== 'cancelled' && st !== 'đã giao' && st !== 'hủy';
    });

    console.log(`[Bảo Hành PRO] ⚡ Đang phát sóng ${activeOrders.length} xe đang trong xưởng sang Web...`);

    // A. Gửi qua Chrome Extension Background tới các tab Web Bảo Hành
    try {
      chrome.runtime.sendMessage({
        type: 'SERVICEOS_REALTIME',
        orders: activeOrders,
        timestamp: Date.now()
      });
    } catch(e){}

    // B. Gửi qua BroadcastChannel
    if (bc) {
      try {
        bc.postMessage({
          type: 'SERVICEOS_REALTIME',
          orders: activeOrders,
          timestamp: Date.now()
        });
      } catch(e){}
    }

    // C. Lưu vào localStorage để kích hoạt storage event
    try {
      localStorage.setItem('bh_realtime_serviceos_event', JSON.stringify({
        orders: activeOrders,
        timestamp: Date.now()
      }));
    } catch(e){}
  }

  // 2. Hàm kéo TRỌN VẸN toàn bộ xe theo đúng chi nhánh đang chọn (khớp chuẩn 535 xe)
  let isFetchingAll = false;
  let lastCapturedBranchId = '';

  async function fetchAllActiveOrders(knownTotal = 0, targetBranchId = '') {
    if (isFetchingAll) return;
    isFetchingAll = true;
    try {
      // Xác định branch_id hiện tại của xưởng (VD: VinFast CarOn Thới An = branch_id 2)
      let branchId = targetBranchId || lastCapturedBranchId;
      if (!branchId) {
        try {
          branchId = (window.S && window.S.branch) || localStorage.getItem('branch') || '';
        } catch(e){}
      }
      const branchParam = branchId ? `&branch_id=${branchId}` : '';

      // Kéo Trang 1 (200 xe)
      const res1 = await fetch(`/api/work-orders?status=active${branchParam}&page=1&page_size=200`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      });
      if (!res1.ok) { isFetchingAll = false; return; }
      const data1 = await res1.json();
      const rows1 = data1.rows || data1.items || data1.data || (Array.isArray(data1) ? data1 : []);
      const totalCount = data1.total || knownTotal || rows1.length;

      let allOrders = [...rows1];

      // Kéo song song các trang còn lại nếu có nhiều hơn 200 xe
      if (totalCount > rows1.length) {
        const pageSize = 200;
        const totalPages = Math.ceil(totalCount / pageSize);
        const pagePromises = [];

        for (let p = 2; p <= Math.min(totalPages, 20); p++) {
          pagePromises.push(
            fetch(`/api/work-orders?status=active${branchParam}&page=${p}&page_size=${pageSize}`, {
              headers: { 'Accept': 'application/json' },
              credentials: 'include'
            }).then(r => r.ok ? r.json() : null)
              .then(d => d ? (d.rows || d.items || d.data || []) : [])
              .catch(() => [])
          );
        }

        const otherPages = await Promise.all(pagePromises);
        for (const pRows of otherPages) {
          if (Array.isArray(pRows) && pRows.length > 0) {
            allOrders = allOrders.concat(pRows);
          }
        }
      }

      console.log(`[Bảo Hành PRO] Đã kéo trọn vẹn ${allOrders.length} xe đúng chi nhánh xưởng!`);
      if (allOrders.length > 0) {
        broadcastServiceOsOrders(allOrders);
      }
    } catch(err) {
      console.error('[Bảo Hành PRO] Lỗi kéo xe ServiceOS:', err);
    } finally {
      isFetchingAll = false;
    }
  }

  // 3. Nhận dữ liệu được bắt bởi Injected Interceptor
  window.addEventListener('message', function(ev) {
    if (ev.data && ev.data.source === 'BH_PAGE_INTERCEPT' && ev.data.type === 'SERVICEOS_DATA') {
      const orders = ev.data.orders;
      const total = ev.data.total || 0;
      if (ev.data.branch_id) lastCapturedBranchId = ev.data.branch_id;

      // Nếu bắt được URL có branch_id thì lưu lại
      if (ev.data.url) {
        try {
          const u = new URL(ev.data.url, location.origin);
          const b = u.searchParams.get('branch_id');
          if (b) lastCapturedBranchId = b;
        } catch(e){}
      }

      if (total > orders.length) {
        fetchAllActiveOrders(total, lastCapturedBranchId);
      } else {
        broadcastServiceOsOrders(orders);
      }
    }
  });

  // 4. Tự động thăm dò định kỳ danh sách xe đúng chi nhánh (Mỗi 15 giây)
  setTimeout(() => fetchAllActiveOrders(), 1500);
  setInterval(() => fetchAllActiveOrders(), 15000);
})();
