import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_wodetail.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

# Search for warranty form or parts table or warranty_extra or fields
for m in re.finditer(r'(?:warranty_extra|warranty_kinds|battery_serial|motor_serial|dien_giai|parts_removed)', c):
    start = max(0, m.start() - 100)
    end = min(len(c), m.end() + 100)
    print(c[start:end])
    print('-'*50)
