import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('function openBookmarkletModal(')
if idx != -1:
    print('Found openBookmarkletModal at idx:', idx)
    print(text[idx:idx+800])
else:
    print('openBookmarkletModal not found!')
