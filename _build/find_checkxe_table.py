with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(3350, min(3500, len(lines))):
    l = lines[i]
    if '<table' in l or '<tbody' in l or 'tbody' in l or 'table-container' in l or 'checkXe' in l:
        print(f'{i+1}: {l.strip()[:100]}')
