import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('baohanh_realtime_extension/injected_interceptor.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Update handleCapturedData
old_handle = '''  function handleCapturedData(url, json) {
    if (!json) return;
    
    // ServiceOS Work Orders
    if (url.includes('work-orders') || (json.rows && Array.isArray(json.rows) && json.rows[0] && json.rows[0].vin !== undefined)) {
      const orders = Array.isArray(json) ? json : (json.rows || json.items || json.data || []);
      const total = json.total || json.count || orders.length;
      if (orders.length > 0) {
        window.postMessage({
          source: 'BH_PAGE_INTERCEPT',
          type: 'SERVICEOS_DATA',
          orders: orders,
          total: total,
          url: url,
          timestamp: Date.now()
        }, '*');
      }
    }

    // VinFast Dealer Portal Warranty Claims
    const isDealerClaims = url.includes('warranty') || 
                           url.includes('claim') || 
                           (json.data && Array.isArray(json.data) && json.data[0] && (json.data[0].warrantyClaimNumber || json.data[0].workOrderNumber)) ||
                           (Array.isArray(json) && json[0] && (json[0].warrantyClaimNumber || json[0].workOrderNumber));

    if (isDealerClaims) {
      const claims = Array.isArray(json) ? json : (json.data || json.rows || json.items || []);
      const total = json.total || json.count || claims.length;
      if (claims.length > 0 && (claims[0].warrantyClaimNumber || claims[0].workOrderNumber || claims[0].claimTo || claims[0].claim_code)) {
        window.postMessage({
          source: 'BH_PAGE_INTERCEPT',
          type: 'DEALER_PORTAL_DATA',
          claims: claims,
          total: total,
          url: url,
          timestamp: Date.now()
        }, '*');
      }
    }
  }'''

new_handle = '''  function handleCapturedData(url, json) {
    if (!json) return;
    const hostname = window.location.hostname || '';
    const isDealerPortal = hostname.includes('vinfast.com') || hostname.includes('dealer-portal');
    
    // ServiceOS Work Orders (Chỉ bắt khi ở trên domain ServiceOS)
    if (!isDealerPortal && (url.includes('work-orders') || (json.rows && Array.isArray(json.rows) && json.rows[0] && json.rows[0].vin !== undefined))) {
      const orders = Array.isArray(json) ? json : (json.rows || json.items || json.data || []);
      const total = json.total || json.count || orders.length;
      if (orders.length > 0) {
        window.postMessage({
          source: 'BH_PAGE_INTERCEPT',
          type: 'SERVICEOS_DATA',
          orders: orders,
          total: total,
          url: url,
          timestamp: Date.now()
        }, '*');
      }
      return;
    }

    // VinFast Dealer Portal Warranty Claims & Work Orders
    const isDealerData = isDealerPortal || 
                         url.includes('warranty') || 
                         url.includes('claim') || 
                         url.includes('work-order') ||
                         (json.data && Array.isArray(json.data) && json.data[0] && (json.data[0].warrantyClaimNumber || json.data[0].workOrderNumber)) ||
                         (Array.isArray(json) && json[0] && (json[0].warrantyClaimNumber || json[0].workOrderNumber));

    if (isDealerData) {
      const claims = Array.isArray(json) ? json : (json.data || json.rows || json.items || []);
      const total = json.total || json.count || claims.length;
      if (claims.length > 0) {
        window.postMessage({
          source: 'BH_PAGE_INTERCEPT',
          type: 'DEALER_PORTAL_DATA',
          claims: claims,
          total: total,
          url: url,
          timestamp: Date.now()
        }, '*');
      }
    }
  }'''

if old_handle in js:
    js = js.replace(old_handle, new_handle)
    with open('baohanh_realtime_extension/injected_interceptor.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print('Updated injected_interceptor.js')
else:
    print('Could not find old_handle in injected_interceptor.js')
