import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_wodetail.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's search for "công việc" or "phụ tùng" or "vật tư"
for term in ['công việc', 'phụ tùng', 'vật tư', 'bảo hành', 'khách hàng']:
    matches = [m.start() for m in re.finditer(re.escape(term), text, re.I)]
    print(f"Term '{term}': {len(matches)} matches")
    for pos in matches[:3]:
        print(f"  [{pos}]: {text[max(0, pos-60):min(len(text), pos+120)].strip()}")
