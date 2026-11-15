with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function renderAll()')
if idx != -1:
    print(text[idx+1400:idx+4500].encode('ascii', errors='replace').decode('ascii'))
