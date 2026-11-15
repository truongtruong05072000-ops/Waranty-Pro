with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('<div class="header-actions">')
idx2 = text.find('</header>')
print(text[idx:idx2].encode('ascii', errors='replace').decode('ascii'))
