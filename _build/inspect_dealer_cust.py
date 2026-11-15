import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/user_dealer_claims.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for i, c in enumerate(data[:15]):
    cust = c.get('customer') or {}
    print(f"#{i+1} Claim:{c.get('warrantyClaimNumber')} WO:{c.get('workOrderNumber')} CustName:{cust.get('customerName')} CustCompany:{cust.get('customerCompanyName')}")
