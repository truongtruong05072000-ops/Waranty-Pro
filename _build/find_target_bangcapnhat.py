import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    c = f.read()

m = re.search(r'// Điều kiện xác định xe ĐÃ CÓ BẢNG CẬP NHẬT LINH KIỆN[\s\S]*?const hasBangCapNhat = Boolean\([\s\S]*?\);', c)
if m:
    print('Found target block:')
    print(m.group(0))
else:
    print('Target block NOT found!')
