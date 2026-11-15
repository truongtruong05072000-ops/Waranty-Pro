# -*- coding: utf-8 -*-
with open('_build/build_modern_template.py', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('<!--SHEETJS-->')
print(text[pos-100:pos+150])
