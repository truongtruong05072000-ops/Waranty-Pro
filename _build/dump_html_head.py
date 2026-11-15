with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
body_idx = text.find('<body')
script_idx = text.find("<script>\n'use strict'")
if script_idx == -1:
    script_idx = text.find("<script>\n")
    # let's find the main script
    idx_list = [m.start() for m in re.finditer(r'<script>', text)]
    script_idx = idx_list[-1]

html_structure = text[body_idx:script_idx]
print('HTML structure length:', len(html_structure))
with open('_build/html_structure_sample.html', 'w', encoding='utf-8') as out:
    out.write(html_structure[:5000])

print('Saved first 5000 chars to _build/html_structure_sample.html')
