import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

print('Searching AppSheet columns / detail columns in workorders.js...')
for kw in ['pin_serial', 'motor_serial', 'removed_at', 'repair_at', 'f_pin', 'f_motor', 'battery']:
    matches = list(re.finditer(kw, text))
    print(f"{kw}: {len(matches)} matches")
    if matches:
        idx = matches[0].start()
        print(f"  Context: {text[max(0, idx-60):min(len(text), idx+150)]}")
