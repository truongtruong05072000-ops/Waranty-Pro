// Injected Interceptor - Chạy trực tiếp trong ngữ cảnh trang web (MAIN world)
(function() {
  if (window.__BH_INTERCEPTOR_INJECTED__) return;
  window.__BH_INTERCEPTOR_INJECTED__ = true;

  // Helper trích xuất mảng dữ liệu từ mọi cấu trúc API trả về (Next.js, Ant Design, Spring Boot, FastAPI, GraphQL...)
  function extractListFromPayload(json) {
    if (!json) return [];
    if (Array.isArray(json)) return json;
    if (json.data && Array.isArray(json.data)) return json.data;
    if (json.data && typeof json.data === 'object') {
      if (Array.isArray(json.data.items)) return json.data.items;
      if (Array.isArray(json.data.content)) return json.data.content;
      if (Array.isArray(json.data.rows)) return json.data.rows;
      if (Array.isArray(json.data.records)) return json.data.records;
      if (Array.isArray(json.data.claims)) return json.data.claims;
      if (Array.isArray(json.data.data)) return json.data.data;
      if (Array.isArray(json.data.orders)) return json.data.orders;
    }
    if (Array.isArray(json.rows)) return json.rows;
    if (Array.isArray(json.items)) return json.items;
    if (Array.isArray(json.content)) return json.content;
    if (Array.isArray(json.records)) return json.records;
    if (Array.isArray(json.claims)) return json.claims;
    if (Array.isArray(json.orders)) return json.orders;
    return [];
  }

  // Nhận diện dữ liệu Đề xuất Bảo hành / Lệnh sửa chữa Dealer Portal
  function isDealerClaimList(list) {
    if (!Array.isArray(list) || list.length === 0) return false;
    const sample = list.slice(0, 10);
    return sample.some(item => Boolean(
      item && (
        item.warrantyClaimNumber || 
        item.claimNumber || 
        item.warranty_claim_number ||
        (item.workOrderNumber && String(item.workOrderNumber).includes('WO')) ||
        (item.work_order_number && String(item.work_order_number).includes('WO')) ||
        (item.claimTo && item.claimType) ||
        (item.totalRequestedAmountInclTax !== undefined) ||
        (item.totalApprovedAmountInclTax !== undefined) ||
        item.claimStatus || 
        item.claim_status ||
        (item.claimCode && String(item.claimCode).startsWith('WC-'))
      )
    ));
  }

  function handleCapturedData(url, json) {
    if (!json || typeof json !== 'object') return;
    const hostname = window.location.hostname || '';
    const isDealerPortal = hostname.includes('vinfast.com') || hostname.includes('dealer-portal');
    const isServiceOs = hostname.includes('anthinhtech.vn') || hostname.includes('serviceos');

    // 1. ServiceOS: Work Orders
    if (isServiceOs || (!isDealerPortal && (url.includes('work-orders') || (json.rows && Array.isArray(json.rows) && json.rows[0] && json.rows[0].vin !== undefined)))) {
      const orders = extractListFromPayload(json);
      const total = json.total || json.count || (json.data && json.data.total) || orders.length;
      
      let branchId = '';
      try {
        branchId = (window.S && window.S.branch) || localStorage.getItem('branch') || '';
      } catch(e){}

      if (orders.length > 0 && orders[0] && (orders[0].plate !== undefined || orders[0].vin !== undefined || orders[0].code !== undefined)) {
        window.postMessage({
          source: 'BH_PAGE_INTERCEPT',
          type: 'SERVICEOS_DATA',
          orders: orders,
          total: total,
          url: url,
          branch_id: branchId,
          timestamp: Date.now()
        }, '*');
      }
      return;
    }

    // 2. VinFast Dealer Portal: Line Items & Part Line Items (Mục Công việc & Mục Phụ tùng)
    if (isDealerPortal && (url.includes('line-items') || url.includes('part-line-items'))) {
      const items = extractListFromPayload(json);
      if (items.length > 0) {
        window.postMessage({
          source: 'BH_PAGE_INTERCEPT',
          type: 'DEALER_PORTAL_LINE_ITEMS',
          items: items,
          url: url,
          timestamp: Date.now()
        }, '*');
      }
      return;
    }

    // 3. VinFast Dealer Portal: Đề xuất bảo hành & Lệnh sửa chữa (Bắt toàn diện mọi API)
    if (isDealerPortal) {
      const list = extractListFromPayload(json);
      if (isDealerClaimList(list)) {
        const total = json.total || json.count || (json.data && (json.data.total || json.data.count)) || list.length;
        window.postMessage({
          source: 'BH_PAGE_INTERCEPT',
          type: 'DEALER_PORTAL_DATA',
          claims: list,
          total: total,
          url: url,
          timestamp: Date.now()
        }, '*');
      }
    }
  }

  // 1. Intercept Fetch API
  const origFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await origFetch.apply(this, args);
    try {
      const clone = response.clone();
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
      
      clone.text().then(text => {
        try {
          const json = JSON.parse(text);
          handleCapturedData(url, json);
        } catch(e){}
      }).catch(()=>{});
    } catch(err){}
    return response;
  };

  // 2. Intercept XMLHttpRequest
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this._reqUrl = url;
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function() {
    this.addEventListener('load', function() {
      try {
        const url = this._reqUrl || '';
        const text = this.responseText;
        if (text) {
          const json = JSON.parse(text);
          handleCapturedData(url, json);
        }
      } catch(e){}
    });
    return origSend.apply(this, arguments);
  };

  // 3. Quét nhanh DOM Next.js / React nếu trang đã tải sẵn dữ liệu trong bộ nhớ
  function scanDom() {
    try {
      const el = document.getElementById('__NEXT_DATA__');
      if (el && el.textContent) {
        const d = JSON.parse(el.textContent);
        if (d && d.props && d.props.pageProps) {
          const pp = d.props.pageProps;
          const claims = pp.claims || pp.data || (pp.dehydratedState && pp.dehydratedState.queries ? extractFromQueries(pp.dehydratedState.queries) : null);
          if (claims && claims.length > 0) {
            handleCapturedData('__NEXT_DATA__', claims);
          }
        }
      }
    } catch(e){}
  }

  function extractFromQueries(queries) {
    if (!Array.isArray(queries)) return null;
    for (const q of queries) {
      if (q.state && q.state.data) {
        const list = extractListFromPayload(q.state.data);
        if (isDealerClaimList(list)) return list;
      }
    }
    return null;
  }

  setTimeout(scanDom, 1500);
  window.addEventListener('load', scanDom);

  console.log('[Bảo Hành PRO] Đã kích hoạt Realtime Interceptor trên trang web!');
})();
