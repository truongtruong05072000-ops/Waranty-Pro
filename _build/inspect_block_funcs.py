import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

block = text[49260:90687]
for m in re.finditer(r'(function\s+[a-zA-Z0-9_]+|window\.[a-zA-Z0-9_]+\s*=)', block):
    print(m.group(0))
