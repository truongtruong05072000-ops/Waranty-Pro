import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'SERVICEOS_PRELOAD_ORDERS\s*=\s*(\[.*?\]);', content, re.DOTALL)
orders = json.loads(m.group(1))

sos_groups = {}
for o in orders:
    cust = o.get('customer') or ''
    s = cust.lower()
    if 'gsm' in s or 'xanh sm' in s or 'di chuyen xanh va thong minh' in s:
        grp = 'GSM'
    elif 'bship' in s or 'b-ship' in s or 'van tai bship' in s:
        grp = 'Bship'
    elif 'cong ty' in s or 'cp' in s or 'tnhh' in s:
        grp = 'Doanh nghiệp khác'
    else:
        grp = 'Khách lẻ'
    sos_groups[grp] = sos_groups.get(grp, 0) + 1

print("Customer groups in ServiceOS orders:", sos_groups)
