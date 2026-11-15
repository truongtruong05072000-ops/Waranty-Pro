# -*- coding: utf-8 -*-
"""Tinh done-in-month (ky chot 23/09-22/10/2026) + nhịp ngày cho đối chiếu app v1.5."""
import openpyxl, json, sys
from collections import defaultdict
from datetime import datetime, date
sys.stdout.reconfigure(encoding='utf-8')

def in_cycle(dt):
    return dt and date(2026, 9, 23) <= dt.date() <= date(2026, 10, 22)

def parse2(s):
    if not s: return None
    if isinstance(s, datetime): return s
    s = str(s).strip()
    for fmt in ('%d/%m/%Y %H:%M', '%d/%m/%Y %H:%M:%S', '%d/%m/%Y', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d'):
        try: return datetime.strptime(s, fmt)
        except ValueError: pass
    return None

def kind(st):
    s = str(st or '').strip().lower()
    if 'hoàn thành' in s or 'đã phê duyệt' in s: return 'confirmed'
    if 'huỷ' in s or 'hủy' in s or 'từ chối' in s: return 'excluded'
    return 'pipeline'

path1 = r'C:\Users\nhu truong\Downloads\[New 2024] Active warranty claim  2026-10-06 8-33-16 PM.xlsx'
wb = openpyxl.load_workbook(path1, read_only=True, data_only=True)
ws = wb.worksheets[0]
rows = list(ws.iter_rows(values_only=True))
hdr = rows[0]
done = defaultdict(lambda: {'qty': 0.0, 'money': 0.0})
cnt = 0; labor = 0.0; parts_m = 0.0; total = 0.0
pipe = 0.0
for r in rows[1:]:
    if not r or not r[9]: continue
    d = dict(zip(hdr, r))
    k = kind(d.get('Trạng thái'))
    dt = d.get('Ngày phê duyệt')
    if not in_cycle(dt): continue
    if k == 'confirmed':
        cnt += 1
        labor += float(d.get('Tiền công yêu cầu') or 0)
        total += float(d.get('Tổng tiền yêu cầu bảo hành') or 0)
        code = str(d.get('Phụ tùng chính') or '').strip()
        pm = float(d.get('Số tiền bảo hành phụ tùng') or 0)
        if code:
            done[code]['qty'] += 1
            done[code]['money'] += pm
            parts_m += pm
    elif k == 'pipeline':
        pipe += float(d.get('Tổng tiền yêu cầu bảo hành') or 0)
wb.close()

# file 2: Đã phê duyệt trong kỳ
path2 = r'C:\Users\nhu truong\Downloads\DeXuatBaoHanh_PhuTung_20261006_2036.xlsx'
wb = openpyxl.load_workbook(path2, read_only=True, data_only=True)
def sd(name):
    w = wb[name]; rr = list(w.iter_rows(values_only=True)); h = rr[0]
    return [dict(zip(h, x)) for x in rr[1:] if x and any(v is not None and str(v).strip() for v in x)]
dx = sd('De xuat bao hanh'); pt = sd('Phu tung theo DXBH'); nc = sd('Nhan cong theo DXBH')
f2cnt = 0; f2labor = 0.0; f2total = 0.0; f2pipe = 0.0
for d in dx:
    dt = parse2(d.get('Ngày phê duyệt')) or parse2(d.get('Ngày tạo'))
    if not in_cycle(dt): continue
    k = kind(d.get('Trạng thái'))
    amt = float(d.get('Số tiền phê duyệt') or 0)
    pid = d.get('Đề xuất bảo hành')
    if k == 'confirmed':
        f2cnt += 1; f2total += amt
        for p in pt:
            if p.get('Đề xuất bảo hành') == pid:
                c = str(p.get('Mã phụ tùng') or '').strip()
                if c:
                    done[c]['qty'] += float(p.get('Số lượng') or 0)
                    done[c]['money'] += float(p.get('Tiền gồm thuế') or 0)
                    parts_m += float(p.get('Tiền gồm thuế') or 0)
        for n in nc:
            if n.get('Đề xuất bảo hành') == pid:
                f2labor += float(n.get('Tiền gồm thuế') or 0)
    elif k == 'pipeline':
        f2pipe += amt
wb.close()

labor += f2labor; cnt += f2cnt; total += f2total; pipe += f2pipe

print('=== DA LAM TRONG KY 23/09-22/10 (confirmed = Hoan thanh + Da phe duyet) ===')
print(f'so de xung confirmed: {cnt} (file2: {f2cnt}) | labor={labor:,.0f} | parts_money={parts_m:,.0f} | total={total:,.0f} | pipe={pipe:,.0f}')
for c, v in sorted(done.items(), key=lambda kv: -kv[1]['money']):
    if v['qty'] > 0:
        print(f'  {c:<18} qty={v["qty"]:<5g} money={v["money"]:,.0f}')

# nhịp ngày
total3 = 1168904809
cyc = {'2026-07': (date(2026,6,23), date(2026,7,22)), '2026-08': (date(2026,7,23), date(2026,8,22)), '2026-09': (date(2026,8,23), date(2026,9,22))}
hist_days = sum((b - a).days for a, b in cyc.values())
print(f'\n=== NHIP NGAY === histCycleDays={hist_days} histDaily={total3/hist_days:,.0f}')
cyc_days = (date(2026,10,22) - date(2026,9,23)).days
today = date(2026,10,8)
elapsed = min(cyc_days, max(1, (today - date(2026,9,23)).days + 1))
expected = total + pipe
cur = expected / elapsed
print(f'cycleDays={cyc_days} elapsed(to {today})={elapsed} expected={expected:,.0f} curDaily={cur:,.0f} ratio={cur/(total3/hist_days):.4f} projection={cur*cyc_days:,.0f}')

# kế hoạch trừ đã làm (không có prepared)
share = 1052220547 / total3
pt_t = 4e8 * share
pool_money = 1052220547  # không prepared
s2 = pt_t / (pool_money / 3)
import math
ce = lambda x: math.ceil(round(x + 1e-9, 6))
print(f'\n=== KE HOACH (base) === share={share:.6f} partsTarget={pt_t:,.0f} scale2={s2:.6f}')
for code, qavg in [('DRT00011190AA', 73.6666667), ('BDP12006000AC', 59.0), ('CNI00009360', 17.0), ('SUS00008613', 37.6666667), ('DRT00009725', 7.3333333)]:
    qb = ce(qavg * s2)
    dq = done.get(code, {'qty': 0})
    dq_i = ce(dq['qty']) if dq['qty'] > 0 else 0
    print(f'  {code:<18} qBase={qb:<4} done={dq_i:<4} conLai={max(0, qb - dq_i)}')
