import json
import re

with open('_build/serviceos_raw_user_input.json', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract from first { to matching }
start = text.find('{')
end = text.rfind('}', 0, text.find('đây đúng không'))
clean_json = text[start:end+1]

with open('_build/serviceos_50_cars.json', 'w', encoding='utf-8') as out:
    out.write(clean_json)

data = json.loads(clean_json)
rows = data.get('rows', [])
print(f"Total cars in this batch: {len(rows)}")
print(f"Total reported: {data.get('total')}")

with open('_build/summary_cars.txt', 'w', encoding='utf-8') as f_out:
    for i, r in enumerate(rows):
        plate = r.get('plate') or '—'
        code = r.get('code') or '—'
        model = r.get('model') or '—'
        faults = r.get('faults') or []
        kinds = r.get('warranty_kinds') or []
        motor_old = r.get('motor_serial_old')
        bat_old = r.get('battery_serial_old')
        bh_code = r.get('dms_warranty_code')
        f_out.write(f"[{i+1:02d}] Biển: {plate:<12} | WO: {code:<18} | Xe: {model:<12} | Faults: {str(faults):<20} | Kinds: {str(kinds):<15} | Motor: {str(motor_old):<20} | Bat: {str(bat_old):<32} | BH: {str(bh_code)}\n")

print("Wrote summary to _build/summary_cars.txt")
