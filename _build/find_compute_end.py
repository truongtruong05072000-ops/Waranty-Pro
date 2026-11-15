with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'return state.computed;' in line:
        safe_line = line.strip()[:100].encode('ascii', 'replace').decode('ascii')
        print(f'{i+1}: {safe_line}')
