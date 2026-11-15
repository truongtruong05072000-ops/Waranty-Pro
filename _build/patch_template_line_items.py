import sys

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

handler_code = '''
function handleDealerPortalLineItems(items, url) {
  if (!Array.isArray(items) || items.length === 0 || !url) return;
  const m = url.match(/escooter-work-orders\\/([a-zA-Z0-9_\\-]+)/i) || url.match(/work-orders\\/([a-zA-Z0-9_\\-]+)/i);
  if (!m) return;
  const woKey = m[1];

  if (state.checkXe && Array.isArray(state.checkXe.orders)) {
    let updated = false;
    state.checkXe.orders.forEach(o => {
      const match = (o.id && String(o.id).includes(woKey)) || 
                    (o.wo && String(o.wo).includes(woKey)) || 
                    (o._raw && (String(o._raw.id).includes(woKey) || String(o._raw.code).includes(woKey)));
      if (match) {
        if (url.includes('part-line-items')) {
          o.part_line_items = items;
          if (o._raw) o._raw.part_line_items = items;
        } else {
          o.line_items = items;
          if (o._raw) o._raw.line_items = items;
        }
        const reNorm = normalizeOrder(o._raw || o);
        Object.assign(o, reNorm);
        updated = true;
      }
    });
    if (updated) {
      computeAll();
      renderAll();
      if (typeof renderCheckXe === 'function') renderCheckXe({ inPlace: true });
    }
  }
}
window.handleDealerPortalLineItems = handleDealerPortalLineItems;
'''

if 'function handleDealerPortalLineItems' not in text:
    target = 'function handleDealerPortalRealtimeClaims('
    text = text.replace(target, handler_code + '\n' + target)
    print('Added handleDealerPortalLineItems')

# Also register in message listener
old_msg = "handleDealerPortalRealtimeClaims(data.claims || data.data);\n      }"
new_msg = "handleDealerPortalRealtimeClaims(data.claims || data.data);\n      } else if (data.type === 'DEALER_PORTAL_LINE_ITEMS') {\n        handleDealerPortalLineItems(data.items, data.url);\n      }"

if old_msg in text:
    text = text.replace(old_msg, new_msg)
    print('Registered DEALER_PORTAL_LINE_ITEMS in broadcast listener')

old_post = "handleDealerPortalRealtimeClaims(data.claims);\n  }"
new_post = "handleDealerPortalRealtimeClaims(data.claims);\n  } else if (data.type === 'DEALER_PORTAL_LINE_ITEMS') {\n    handleDealerPortalLineItems(data.items, data.url);\n  }"

if old_post in text:
    text = text.replace(old_post, new_post)
    print('Registered DEALER_PORTAL_LINE_ITEMS in window.postMessage listener')

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Saved _build/app_template2.html')
