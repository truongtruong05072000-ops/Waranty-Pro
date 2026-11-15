# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\nhu truong\OneDrive\Tài liệu\bảo hành\_build\app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

for k in ['gateLock', 'gateTry', 'gateOpen', 'gateOut', '__PASS_SHA__', 'bh_gate']:
    print(f"=== Occurrences of {k} ===")
    start = 0
    while True:
        pos = text.find(k, start)
        if pos == -1: break
        print(f"At {pos}: {text[max(0, pos-40):min(len(text), pos+80)]}")
        start = pos + len(k)
