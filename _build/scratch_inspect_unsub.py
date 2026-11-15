import sys, re
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Search for "Danh sách Lệnh sửa chữa Bảo hành đã Quyết toán CHƯA LÀM ĐỀ XUẤT"
pos = text.find('CHƯA LÀM ĐỀ XUẤT')
if pos != -1:
    print(text[pos-200:pos+1500])
else:
    print('Not found exact phrase')
