# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

s1 = text.find('<style>')
e1 = text.find('</style>', s1)
print(f"Total Block 1 length: {e1 - s1}")
print("End of Block 1 (last 300 chars):")
print(text[e1-300:e1])
