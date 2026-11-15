# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\nhu truong\OneDrive\Tài liệu\bảo hành\_build\app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'gate' in l.lower() or 'password' in l.lower() or 'n54511' in l.lower():
        print(f"{i+1}: {l.strip()[:100]}")
