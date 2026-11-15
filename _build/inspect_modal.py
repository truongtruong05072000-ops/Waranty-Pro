import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('id="modalBookmarklet"')
if idx != -1:
    print('Modal found at idx:', idx)
    print(text[idx-50:idx+2500])
else:
    print('Modal not found')
