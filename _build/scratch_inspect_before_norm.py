import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function normalizeOrder(raw, i){')
print(text[pos-400:pos])
