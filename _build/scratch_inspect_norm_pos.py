import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function normalizeOrder(raw, i){')
print(f"normalizeOrder found at {pos}")
print(text[pos:pos+350])
