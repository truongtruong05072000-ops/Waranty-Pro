import base64, gzip

with open('PhanTichBaoHanh.html', 'rb') as f:
    data = f.read()

b64 = base64.b64encode(data).decode('ascii')
js = 'const HTML_B64 = "' + b64 + '";\nexport default { async fetch() {} };'
gz = gzip.compress(js.encode('utf-8'))
print('JS raw size:', f'{len(js):,} bytes ({len(js)/1024/1024:.2f} MB)')
print('JS gzipped size:', f'{len(gz):,} bytes ({len(gz)/1024:.2f} KB)')
