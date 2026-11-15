# -*- coding: utf-8 -*-
import io, sys
sys.stdout.reconfigure(encoding='utf-8')

with io.open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

keywords = ["code: 'checked'", "code === 'checked'", "ĐÃ CHECK", "Đã check", "statusBadge", "evaluateCheckStatus"]
for i, l in enumerate(lines):
    if any(k in l for k in keywords):
        print(f'{i+1}: {l.strip()[:110]}')
