import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

m = re.search(r'// Cơ cấu Doanh thu & Lệnh theo Nhóm Khách Hàng[\s\S]*?renderCustomerBreakdownHtml', c)
if m:
    print(m.group(0)[:1500])
