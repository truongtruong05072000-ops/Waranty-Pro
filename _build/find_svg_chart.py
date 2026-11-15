with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function svgChart(')
if idx != -1:
    print(text[idx:idx+1500].encode('ascii', errors='replace').decode('ascii'))
