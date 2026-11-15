with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

sc_start = text.find('function svgChart(')
print(text[sc_start:sc_start+1500].encode('ascii', errors='replace').decode('ascii'))
