# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

s2 = text.find('<style>', text.find('</style>') + 8)
e2 = text.find('</style>', s2)
print(text[s2:e2+8])
