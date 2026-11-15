# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

# The user's JSON snippet
with open('_build/user_dealer_portal_snippet.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

claims = data.get('data', [])
print(f'Total claims in snippet: {len(claims)}')

total_inc = sum(c.get('totalRequestedAmountInclTax', 0) for c in claims)
print(f'Total amount (incl tax): {total_inc:,} VND')

status_counts = {}
for c in claims:
    st = c.get('status', 'UNKNOWN')
    status_counts[st] = status_counts.get(st, 0) + 1

print('Status breakdown:', status_counts)
