# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

s1 = text.find('<style')
e1 = text.find('</style>', s1)
b1 = text[s1:e1]

# Let's see all selectors in Block 1
import re
selectors = re.findall(r'([^{}]+)\s*\{', b1)
print(f"Total selectors: {len(selectors)}")
print("First 25 selectors:")
for s in selectors[:25]:
    clean = s.strip().replace('\n', ' ')
    if not clean.startswith('@'):
        print(' -', clean[:60])
