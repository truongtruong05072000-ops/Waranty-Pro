# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove bg3dCanvas if present
pos = text.find('<canvas id="bg3dCanvas"')
if pos != -1:
    end = text.find('>', pos) + 1
    print('Found bg3dCanvas:', text[pos:end])
    text = text[:pos] + text[end:]
    print('Cleaned bg3dCanvas!')

# Let's inspect the brand group in text
pos_brand = text.find('<div class="brand-group">')
if pos_brand != -1:
    pos_brand_end = text.find('</div>\n    \n    <div class="header-actions">', pos_brand)
    if pos_brand_end == -1: pos_brand_end = text.find('<div class="header-actions">', pos_brand)
    print('Current brand group:')
    print(text[pos_brand:pos_brand+400])

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)
