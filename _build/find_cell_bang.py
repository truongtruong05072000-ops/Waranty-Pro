import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('📦 <b>Đã cập nhật:</b>')
print('Found at idx:', idx)
print(text[idx-200:idx+400])
