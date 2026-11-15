# -*- coding: utf-8 -*-
import json
from datetime import datetime

with open('_build/user_dealer_claims.json', encoding='utf-8') as f:
    claims = json.load(f)['data']

def parse_date(s):
    if not s: return None
    s = s.replace('Z', '+00:00')
    return datetime.fromisoformat(s)

def cycle_month(dt, cut=22):
    if not dt: return 'no_date'
    y, m, d = dt.year, dt.month, dt.day
    if d > cut:
        m += 1
        if m > 12:
            m = 1
            y += 1
    return f'{y}-{m:02d}'

months = {}
for c in claims:
    d_str = c.get('approvedDate') or c.get('createdAt')
    dt = parse_date(d_str)
    cm = cycle_month(dt, 22)
    st = c.get('status')
    amt = c.get('totalRequestedAmountInclTax', 0)
    
    if cm not in months:
        months[cm] = {'conf': 0, 'conf_cnt': 0, 'pipe': 0, 'pipe_cnt': 0, 'cancel': 0, 'cancel_cnt': 0}
        
    if st == 'APPROVED':
        months[cm]['conf'] += amt
        months[cm]['conf_cnt'] += 1
    elif 'PENDING' in (st or ''):
        months[cm]['pipe'] += amt
        months[cm]['pipe_cnt'] += 1
    elif 'CANCEL' in (st or ''):
        months[cm]['cancel'] += amt
        months[cm]['cancel_cnt'] += 1

print("=== PHAN TICH DOANH THU THEO KY CHOT NGAY 22 ===")
for m in sorted(months.keys()):
    v = months[m]
    print(f"Ky {m} (Chot ngay 22):")
    print(f"  - Chot (Da duyet): {v['conf_cnt']} DX = {v['conf']} VND")
    print(f"  - Du tru (Cho cap 1 va 2): {v['pipe_cnt']} DX = {v['pipe']} VND")
    print(f"  - Tu choi / Huy: {v['cancel_cnt']} DX = {v['cancel']} VND")
    print(f"  - TONG DU KIEN: {v['conf'] + v['pipe']} VND")
