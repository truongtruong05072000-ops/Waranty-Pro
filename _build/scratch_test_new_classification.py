import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS = (\[.*?\]);', text, re.DOTALL)
orders = json.loads(m.group(1))

def evaluate_payment_classification(d):
    # 1. Check line items and parts if available
    line_items = d.get('line_items') or d.get('lineItems') or d.get('jobs') or d.get('labors') or []
    part_items = d.get('part_line_items') or d.get('partLineItems') or d.get('parts') or []
    
    has_warranty_item = False
    has_customer_item = False
    
    all_items = list(line_items) + list(part_items)
    for it in all_items:
        pt = str(it.get('paymentType') or it.get('payment_type') or it.get('type') or '').upper()
        if 'WARRANTY' in pt or 'BẢO HÀNH' in pt or 'BH' in pt:
            has_warranty_item = True
        elif 'CUSTOMER' in pt or 'KHÁCH' in pt:
            has_customer_item = True
            
    if has_warranty_item:
        return 'Bảo hành', True
    if has_customer_item and not has_warranty_item:
        return 'Khách hàng', False
        
    # 2. Check explicit order fields
    raw_pt = str(d.get('phanLoaiTt') or d.get('phan_loai_tt') or d.get('paymentType') or d.get('payment_type') or '').lower()
    if 'bao hanh' in raw_pt or 'warranty' in raw_pt or raw_pt == 'bh':
        return 'Bảo hành', True
    if 'khach' in raw_pt or 'customer' in raw_pt:
        return 'Khách hàng', False

    # 3. Check ServiceOS service_type
    stype = str(d.get('service_type') or '').lower()
    if stype == 'warranty':
        return 'Bảo hành', True
    if stype in ['liquidation', 'maintenance', 'repair']:
        # If liquidation or customer paid repair without explicit warranty code
        if not d.get('dms_warranty_code') and not d.get('dms_claim_code'):
            return 'Khách hàng', False

    # 4. Check explicit warranty documents
    if d.get('dms_warranty_code') or d.get('dms_claim_code'):
        return 'Bảo hành', True

    # 5. Check warranty kinds only if explicitly confirmed
    kinds = d.get('warranty_kinds') or []
    has_real_bh_parts = any(k in ['pin', 'motor', 'esim'] for k in kinds) and (d.get('battery_serial_old') or d.get('motor_serial_old') or d.get('parts_removed_at'))
    if has_real_bh_parts:
        return 'Bảo hành', True

    # Default to Khách hàng
    return 'Khách hàng', False

bh_count = 0
kh_count = 0

for i, o in enumerate(orders):
    pl, is_bh = evaluate_payment_classification(o)
    if is_bh: bh_count += 1
    else: kh_count += 1
    if i < 15:
        print(f"[{i+1}] {o.get('code')} ({o.get('service_type')}) -> Phân loại TT: {pl}")

print(f"\nSummary: Total = {len(orders)} | Bảo hành = {bh_count} | Khách hàng = {kh_count}")
