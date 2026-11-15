with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Find renderCheckXe definition
m = re.search(r'function renderCheckXe\(\)\s*\{([\s\S]*?)(?=\nfunction [a-zA-Z0-9_]+\()', text)
if m:
    with open('_build/renderCheckXe.js', 'w', encoding='utf-8') as out:
        out.write('function renderCheckXe() {' + m.group(1))
    print('Found renderCheckXe, length:', len(m.group(1)))
else:
    print('renderCheckXe not found via regex')
