import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'function renderCheckXe(options = {}){' in l:
        print(f"renderCheckXe starts at line {i+1}")
    if 'function parseServiceOsWorkbook' in l:
        print(f"parseServiceOsWorkbook starts at line {i+1}")
        break
