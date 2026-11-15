import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('DEALER_PORTAL_PRELOAD_CLAIMS = [')
end_idx = content.find('];', idx) + 1
json_str = content[idx + len('DEALER_PORTAL_PRELOAD_CLAIMS = '):end_idx]
claims = json.loads(json_str)

print(f"Loaded {len(claims)} preload claims.")

# Test customer grouping
groups = {}
for c in claims:
    cust = c.get('customer') or {}
    name = cust.get('customerName') or ''
    company = cust.get('customerCompanyName') or ''
    s = (name + ' ' + company).lower()
    if 'gsm' in s or 'xanh sm' in s or 'di chuyen xanh va thong minh' in s:
        grp = 'GSM'
    elif 'bship' in s or 'b-ship' in s or 'van tai bship' in s:
        grp = 'Bship'
    elif 'cong ty' in s or 'cp' in s or 'tnhh' in s:
        grp = 'Doanh nghiệp khác'
    else:
        grp = 'Khách lẻ'
    groups[grp] = groups.get(grp, 0) + 1

print("Customer Groups in Preload Claims:", groups)

# Test return statuses
ret_l1 = 0
ret_l2 = 0
for c in claims:
    st = str(c.get('status') or '').upper()
    seq = c.get('approvalSequence')
    reason = str(c.get('reason') or '')
    if 'REJECT' in st or 'CANCEL' in st or 'RETURN' in st:
        if seq == 1 or 'CAP 1' in st or 'C1' in st:
            ret_l1 += 1
        else:
            ret_l2 += 1

print(f"Returns in Preload: L1={ret_l1}, L2={ret_l2}, Total={ret_l1 + ret_l2} / {len(claims)}")
rate = (ret_l1 + ret_l2) / len(claims) * 100
print(f"Return Rate: {rate:.2f}% (Benchmark <= 1.0%: {'PASSED' if rate <= 1.0 else 'EXCEEDED'})")
