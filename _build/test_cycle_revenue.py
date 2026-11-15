import json
import datetime

with open('_build/user_dealer_claims.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

claims = raw['data'] if isinstance(raw, dict) and 'data' in raw else raw
print(f'Total claims: {len(claims)}')

def cycle_month(dt_str):
    if not dt_str:
        return None
    dt = datetime.datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
    y = dt.year
    m = dt.month
    if dt.day > 22:
        m += 1
        if m > 12:
            m = 1
            y += 1
    return f'{y}-{m:02d}'

months = {}
for c in claims:
    st = c.get('status')
    d_val = c.get('approvedDate') or c.get('createdAt')
    cm = cycle_month(d_val)
    amt_inc = c.get('totalRequestedAmountInclTax', 0) or 0
    amt_ex = round(amt_inc / 1.1)
    
    if cm not in months:
        months[cm] = {
            'approved_cnt': 0, 'approved_inc': 0, 'approved_ex': 0,
            'pending_cnt': 0, 'pending_inc': 0, 'pending_ex': 0,
            'cancelled_cnt': 0, 'cancelled_inc': 0, 'cancelled_ex': 0
        }
    
    if st == 'APPROVED':
        months[cm]['approved_cnt'] += 1
        months[cm]['approved_inc'] += amt_inc
        months[cm]['approved_ex'] += amt_ex
    elif 'PENDING' in st or 'WAITING' in st:
        months[cm]['pending_cnt'] += 1
        months[cm]['pending_inc'] += amt_inc
        months[cm]['pending_ex'] += amt_ex
    else:
        months[cm]['cancelled_cnt'] += 1
        months[cm]['cancelled_inc'] += amt_inc
        months[cm]['cancelled_ex'] += amt_ex

for m in sorted(months.keys()):
    d = months[m]
    print(f'=== KY {m} (chot ngay 22) ===')
    print(f'  - Doanh thu chot (APPROVED): {d["approved_cnt"]} DX, {d["approved_inc"]:,} VND (Truoc VAT: {d["approved_ex"]:,} VND)')
    print(f'  - Doanh thu du tru (PENDING): {d["pending_cnt"]} DX, {d["pending_inc"]:,} VND (Truoc VAT: {d["pending_ex"]:,} VND)')
    print(f'  - Loai tru (CANCELLED): {d["cancelled_cnt"]} DX, {d["cancelled_inc"]:,} VND')
    tot_inc = d['approved_inc'] + d['pending_inc']
    print(f'  => TONG DU KIEN KY {m}: {tot_inc:,} VND (Truoc VAT: {round(tot_inc/1.1):,} VND)')
