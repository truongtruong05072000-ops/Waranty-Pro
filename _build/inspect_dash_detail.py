import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_dashboard.js', 'r', encoding='utf-8') as f:
    dash = f.read()

print('=== Dashboard API calls ===')
for m in re.finditer(r'/api/[a-zA-Z0-9_\-\/]+', dash):
    print(m.group(0))

with open('_build/serviceos_wodetail.js', 'r', encoding='utf-8') as f:
    detail = f.read()

print('=== wo-detail.js: search for "Cập nhật" or "Bảo hành" or PIN ===')
for kw in ['bảng cập nhật', 'Chờ lắp PIN', 'battery_serial', 'motor_serial', 'Hạng mục lỗi']:
    matches = list(re.finditer(kw, detail, re.I))
    print(f"{kw}: {len(matches)} matches")
    if matches:
        idx = matches[0].start()
        print(f"  Context: {detail[max(0, idx-50):min(len(detail), idx+150)]}")
