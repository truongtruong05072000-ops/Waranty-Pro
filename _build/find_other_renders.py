with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
funcs = ['renderOverview', 'renderPlan', 'renderParts', 'renderClaims']
for fn in funcs:
    m = re.search(r'function ' + fn + r'\(\)\s*\{', text)
    if m:
        print(f"Found {fn} at index {m.start()}")
        # print first 200 chars of function body
        print(text[m.start():m.start()+250].encode('ascii', errors='replace').decode('ascii'))
        print('---')
