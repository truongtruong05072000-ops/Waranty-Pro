with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function renderAll()')
with open('_build/render_all_full.js', 'w', encoding='utf-8') as out:
    out.write(text[idx:idx+15000])

print('Dumped renderAll to _build/render_all_full.js')
