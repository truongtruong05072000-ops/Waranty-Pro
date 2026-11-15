import sys

with open('baohanh_realtime_extension/injected_interceptor.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Expand fetch/xhr check to include line-items and part-line-items
old_check = "if (url.includes('work-orders') || url.includes('warranty') || url.includes('claim') || url.includes('dealer'))"
new_check = "if (url.includes('work-orders') || url.includes('warranty') || url.includes('claim') || url.includes('dealer') || url.includes('line-items') || url.includes('parts'))"

text = text.replace(old_check, new_check)

# 2. Add handling for line-items and part-line-items
old_data_handle = '''    // VinFast Dealer Portal Warranty Claims & Work Orders
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
    }'''

new_data_handle = '''    // VinFast Dealer Portal Line Items & Part Line Items (Mục Công việc & Mục Phụ tùng)
    if (isDealerPortal && (url.includes('line-items') || url.includes('part-line-items'))) {
      const items = Array.isArray(json) ? json : (json.data || json.rows || json.items || []);
      window.postMessage({
        source: 'BH_PAGE_INTERCEPT',
        type: 'DEALER_PORTAL_LINE_ITEMS',
        items: items,
        url: url,
        timestamp: Date.now()
      }, '*');
      return;
    }

    // VinFast Dealer Portal Warranty Claims & Work Orders
    const isDealerData = isDealerPortal || 
                         url.includes('warranty') || 
                         url.includes('claim') || 
                         url.includes('work-order') ||
                         url.includes('escooter-work-orders') ||
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
    }'''

text = text.replace(old_data_handle, new_data_handle)

with open('baohanh_realtime_extension/injected_interceptor.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated injected_interceptor.js successfully')
