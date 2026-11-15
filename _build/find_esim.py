# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_50_cars.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for i, c in enumerate(data['rows']):
    faults = c.get('faults') or []
    if any('esim' in f.lower() for f in faults):
        print(f"[{i+1}] {c.get('plate')} | Faults: {faults} | KTV: {c.get('technician_name')} | Note: {c.get('foreman_note')} | Kinds: {c.get('warranty_kinds')} | Status: {c.get('status')}")
