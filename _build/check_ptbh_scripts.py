# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = [m.start() for m in re.finditer(r'<script', text)]
print("Total script tags in PhanTichBaoHanh.html:", len(scripts))
for idx, p in enumerate(scripts):
    print(f"Script {idx+1} at {p}: {text[p:p+80]}")
