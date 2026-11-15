# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("First 40 lines of HTML:")
for l in lines[:40]:
    print(l, end='')
