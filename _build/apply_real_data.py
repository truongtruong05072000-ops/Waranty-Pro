# -*- coding: utf-8 -*-
import json
import re

with open('_build/serviceos_50_cars.json', 'r', encoding='utf-8') as f:
    sample_data = json.load(f)

rows = sample_data.get('rows', [])
print(f"Loaded {len(rows)} real cars from serviceos_50_cars.json")

# Read PhanTichBaoHanh.html
with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update loadCheckXeOrders to prefill with real cars if empty or invalid
real_cars_json_str = json.dumps(rows, ensure_ascii=False)

# Let's inspect loadCheckXeOrders in html
load_fn_regex = r'function loadCheckXeOrders\(\)\{[\s\S]*?function saveCheckXeOrders\(\)'

replacement_load_fn = f'''const SERVICEOS_PRELOAD_ORDERS = {real_cars_json_str};

function loadCheckXeOrders(){{
  try {{
    const raw = localStorage.getItem('bh_checkxe_orders');
    if(raw) {{
      const data = JSON.parse(raw);
      if(Array.isArray(data) && data.length > 0){{
        // Filter out corrupted rows without plate
        const valid = data.filter(d => {{
          const p = d.plate || (d.work_order && d.work_order.plate);
          return p && p !== '—' && p !== '-';
        }});
        if (valid.length > 0) {{
          state.checkXe.orders = valid.map((d, i) => normalizeOrder(d, i));
          return;
        }}
      }}
    }}
  }} catch(e){{}}
  
  // Default to 50 real cars from ServiceOS if storage is empty or invalid
  if (Array.isArray(SERVICEOS_PRELOAD_ORDERS) && SERVICEOS_PRELOAD_ORDERS.length > 0) {{
    state.checkXe.orders = SERVICEOS_PRELOAD_ORDERS.map((d, i) => normalizeOrder(d, i));
  }}
}}

function saveCheckXeOrders()'''

if re.search(load_fn_regex, html):
    html = re.sub(load_fn_regex, replacement_load_fn, html, count=1)
    print("Replaced loadCheckXeOrders with real cars preload!")
else:
    print("Could not find loadCheckXeOrders regex match!")

# 2. Refine normalizeOrder to clean up noisy diagnosis and strict faults
# Let's find normalizeOrder issueDesc logic
issue_desc_regex = r'const rawDiag = String\(d\.diagnosis[\s\S]*?const issue = hasLoi \? faultList\.join\(\', \'\) : \'Không lỗi\';'
issue_desc_replace = '''const rawDiag = String(d.diagnosis || d.symptoms || d.content || d.diag || '').trim();
  // Strip out full metadata strings that clutter the table
  const isNoisyDiag = rawDiag.includes('Biển số:') || rawDiag.includes('Số khung:') || rawDiag.includes('Số điện thoại:') || rawDiag.includes('Tài xế:') || rawDiag.includes('Họ và tên:');
  const issueDesc = isNoisyDiag ? '' : rawDiag;
  const issue = hasLoi ? faultList.join(', ') : 'Không lỗi';'''

if re.search(issue_desc_regex, html):
    html = re.sub(issue_desc_regex, issue_desc_replace, html, count=1)
    print("Replaced issueDesc clean logic!")

# 3. Refine hasBangCapNhat in normalizeOrder
bang_cap_nhat_regex = r'const hasBangCapNhat = Boolean\([\s\S]*?kinds\.length > 0[\s\S]*?\);'
bang_cap_nhat_replace = '''const hasComponentKind = kinds.some(k => ['motor', 'pin', 'esim', 'charger', 'topcover', 'rear_shock', 'front_shock'].includes(k));
  const hasBangCapNhat = Boolean(
    bhCode || 
    claimCode || 
    pinSerial || 
    motorSerial || 
    chargerSerial || 
    removedAt || 
    motorRemovedAt ||
    (kinds.length > 0 && hasComponentKind && (bhCode || claimCode || pinSerial || motorSerial || removedAt || motorRemovedAt || kinds.includes('motor') || kinds.includes('pin') || kinds.includes('esim')))
  );'''

if re.search(bang_cap_nhat_regex, html):
    html = re.sub(bang_cap_nhat_regex, bang_cap_nhat_replace, html, count=1)
    print("Replaced hasBangCapNhat logic!")

# 4. Save updated PhanTichBaoHanh.html
with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated PhanTichBaoHanh.html successfully!")

# Also copy to _deploy/index.html
with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated _deploy/index.html successfully!")
