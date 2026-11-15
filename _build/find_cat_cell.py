import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('custom-cat-badge')
print(text[idx-100:idx+400])
