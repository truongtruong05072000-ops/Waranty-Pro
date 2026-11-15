import sys

with open('baohanh_realtime_extension/content_dealerportal.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "if (ev.data && ev.data.source === 'BH_PAGE_INTERCEPT' && ev.data.type === 'DEALER_PORTAL_DATA') {"
replacement = '''if (ev.data && ev.data.source === 'BH_PAGE_INTERCEPT') {
      if (ev.data.type === 'DEALER_PORTAL_LINE_ITEMS') {
        try { chrome.runtime.sendMessage(ev.data); } catch(e){}
        if (bc) { try { bc.postMessage(ev.data); } catch(e){} }
        return;
      }
      if (ev.data.type === 'DEALER_PORTAL_DATA') {'''

if target in text:
    text = text.replace(target, replacement)
    # close the extra brace
    text = text.replace("broadcastDealerClaims(claims);\n      }\n    }\n  });", "broadcastDealerClaims(claims);\n      }\n    }\n    }\n  });")
    with open('baohanh_realtime_extension/content_dealerportal.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated content_dealerportal.js')
else:
    print('Target not found in content_dealerportal.js')
