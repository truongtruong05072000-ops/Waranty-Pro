with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

sc_start = text.find('function svgChart(')
sc_end = text.find('\nfunction exportExcel()', sc_start)
print('svgChart ends before exportExcel:', sc_end)
print(text[sc_start:sc_end].encode('ascii', errors='replace').decode('ascii'))
