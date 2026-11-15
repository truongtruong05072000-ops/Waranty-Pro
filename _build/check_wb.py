import sys, io
sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function parseServiceOsWorkbook')
if idx != -1:
    print('Found parseServiceOsWorkbook:')
    print(text[idx:idx+1500])
else:
    print('parseServiceOsWorkbook not found')
