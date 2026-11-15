import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('tab-checkxe')
if idx != -1:
    print('Found tab-checkxe at idx:', idx)
    print(text[idx:idx+1500])
else:
    print('tab-checkxe not found')
