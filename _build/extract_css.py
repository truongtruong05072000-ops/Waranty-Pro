# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

s1 = text.find('<style>')
e1 = text.find('</style>', s1)
with open('_build/extracted_block1.css', 'w', encoding='utf-8') as f:
    f.write(text[s1+7:e1])

print('Saved extracted_block1.css, length:', e1 - s1)
