with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove orphan </canvas>
text = text.replace('<body>\n</canvas>', '<body>')

with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Removed orphan canvas tag.')
