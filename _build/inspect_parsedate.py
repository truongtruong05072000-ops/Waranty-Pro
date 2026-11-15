import sys, io
sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('parseDateVal')
if idx != -1:
    print(text[idx-50:idx+400])
