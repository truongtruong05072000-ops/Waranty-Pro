with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if "addEventListener('message'" in l or 'addEventListener("message"' in l:
        print(f'Line {i+1}: {l.strip()[:100]}')
        for j in range(i, min(i+25, len(lines))):
            print(f'  {j+1}: {lines[j].strip()[:100]}')
