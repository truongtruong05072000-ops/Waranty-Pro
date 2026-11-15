import json

with open('_build/serviceos_50_cars.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

rows = data.get('rows', [])

with open('_build/test_output.txt', 'w', encoding='utf-8') as out:
    out.write(f"Testing {len(rows)} cars with updated logic:\n")
    for i, r in enumerate(rows[:25]):
        plate = r.get('plate') or '—'
        wo = r.get('code') or '—'
        faults = r.get('faults') or []
        kinds = r.get('warranty_kinds') or []
        motor_serial = r.get('motor_serial_old') or ''
        pin_serial = r.get('battery_serial_old') or ''
        
        # Fault category
        if len(faults) == 0:
            cat_name = 'Không lỗi'
            has_loi = False
        else:
            cat_name = faults[0]
            has_loi = True
            
        # Card type: Only show if there is real component data
        has_card = bool(kinds or motor_serial or pin_serial or r.get('dms_warranty_code'))
        card_type = '—'
        if has_card:
            if 'motor' in kinds or motor_serial or 'động cơ' in str(faults).lower():
                card_type = 'Động cơ (Violet Card)'
            elif 'pin' in kinds or pin_serial or 'pin' in str(faults).lower():
                card_type = 'PIN (Emerald Card)'
            elif 'esim' in kinds or 'esim' in str(faults).lower():
                card_type = 'Esim (Amber Card)'
            elif kinds:
                card_type = f"{kinds[0]} (Card)"
                
        out.write(f"[{i+1:02d}] Biển: {plate:<12} | WO: {wo:<18} | Hạng mục: {cat_name:<20} | Card: {card_type}\n")

print("Done")
