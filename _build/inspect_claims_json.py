import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('DEALER_PORTAL_PRELOAD_CLAIMS = [')
if idx != -1:
    end_idx = content.find('];', idx) + 1
    json_str = content[idx + len('DEALER_PORTAL_PRELOAD_CLAIMS = '):end_idx]
    claims = json.loads(json_str)
    print(f"Total claims in preload: {len(claims)}")
    
    statuses = set()
    approval_seqs = set()
    customers = set()
    for c in claims:
        statuses.add(c.get('status'))
        approval_seqs.add(c.get('approvalSequence'))
        cust = c.get('customer')
        if cust and isinstance(cust, dict):
            customers.add(cust.get('customerName'))
    print("Statuses:", statuses)
    print("Approval Sequences:", approval_seqs)
    print("Sample customers:", list(customers)[:10])
