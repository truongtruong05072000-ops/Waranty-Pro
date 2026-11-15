import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

# Test 1: Date Range Filter for Customer Breakdown
recs = [
    {'customerGroup': {'id': 'gsm'}, 'total': 1000000, 'dateStr': '2026-10-15', 'date': '2026-10-15', 'status': 'Đã phê duyệt'},
    {'customerGroup': {'id': 'gsm'}, 'total': 2000000, 'dateStr': '2026-11-02', 'date': '2026-11-02', 'status': 'Đã phê duyệt'},
    {'customerGroup': {'id': 'bship'}, 'total': 1500000, 'dateStr': '2026-11-05', 'date': '2026-11-05', 'status': 'Đã phê duyệt'},
    {'customerGroup': {'id': 'retail'}, 'total': 500000, 'dateStr': '2026-11-06', 'date': '2026-11-06', 'status': 'Đã phê duyệt'},
]

def filter_by_date_range(records, from_date, to_date):
    filtered = []
    for r in records:
        d = r.get('dateStr') or r.get('date') or ''
        if from_date and d < from_date: continue
        if to_date and d > to_date: continue
        filtered.append(r)
    return filtered

print("Test Date Filter:")
nov_recs = filter_by_date_range(recs, '2026-11-01', '2026-11-30')
print(f"November records: {len(nov_recs)} (expected 3)")
assert len(nov_recs) == 3

oct_recs = filter_by_date_range(recs, '2026-10-01', '2026-10-31')
print(f"October records: {len(oct_recs)} (expected 1)")
assert len(oct_recs) == 1

print("ALL DATE RANGE LOGIC OK!")
