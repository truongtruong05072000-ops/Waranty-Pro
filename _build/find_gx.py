# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_50_cars.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for i, car in enumerate(data['rows']):
    faults = car.get('faults') or []
    if 'Lỗi giảm xóc trước' in faults:
        print(f"[{i+1}] Plate: {car.get('plate')} | Code: {car.get('code')} | Faults: {faults} | Kinds: {car.get('warranty_kinds')} | Status: {car.get('status')} | Ro: {car.get('dms_ro_code')}")
