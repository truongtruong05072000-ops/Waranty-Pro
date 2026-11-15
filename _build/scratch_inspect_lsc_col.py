import sys, re
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Search for places rendering wo or MÃ LSC
matches = re.finditer(r'MÃ LSC|Mã LSC|Mã phiếu sửa chữa WO', text)
for m in matches:
    p = m.start()
    print(f"--- MATCH AT {p} ---")
    print(text[max(0, p-100):min(len(text), p+300)])
