import json, gzip

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

escaped = json.dumps(text)
js = 'const HTML_CONTENT = ' + escaped + ';\nexport default { async fetch() {} };'
gz = gzip.compress(js.encode('utf-8'))
print('JS raw size:', f'{len(js):,} bytes ({len(js)/1024/1024:.2f} MB)')
print('JS gzipped size:', f'{len(gz):,} bytes ({len(gz)/1024:.2f} KB)')
