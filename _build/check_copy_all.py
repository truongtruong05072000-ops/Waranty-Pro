with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'copyAllUnsubmittedWo' in line:
        print(f'{i+1}: {line.strip()[:100]}')
        for j in range(max(0, i-2), min(len(lines), i+8)):
            safe = lines[j].strip().encode('ascii', 'replace').decode('ascii')
            print(f'  {j+1}: {safe}')
