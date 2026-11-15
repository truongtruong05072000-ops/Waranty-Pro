import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/user_dealer_claims.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Keys:', list(data.keys()))
items = data.get('data') or data.get('rows') or data.get('items') or []
print('Items len:', len(items))
for i, c in enumerate(items[:15]):
    cust = c.get('customer') or {}
    print(f"#{i+1} Claim:{c.get('warrantyClaimNumber')} WO:{c.get('workOrderNumber')} CustName:{cust.get('customerName')} CustCompany:{cust.get('customerCompanyName')}")
