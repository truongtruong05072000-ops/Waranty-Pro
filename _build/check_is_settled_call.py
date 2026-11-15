with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'isSettled = isSettledOrHigher' in line:
        print(f'line {i+1}: {line.strip()}')
        for j in range(max(0, i-10), min(len(lines), i+10)):
            print(f'  {j+1}: {lines[j].strip()}')
        break
