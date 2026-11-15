with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'function normalizeOrder' in line:
        for j in range(i, i+30):
            safe = lines[j].strip().encode('ascii', 'replace').decode('ascii')
            print(f'{j+1}: {safe}')
        break
