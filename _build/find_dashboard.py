import glob, re, sys
sys.stdout.reconfigure(encoding='utf-8')

for f in glob.glob('_build/*.*'):
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    if 'đang trong xưởng' in c.lower() or 'dang trong xuong' in c.lower() or 'dashboard' in c.lower():
        matches = re.findall(r'.{0,40}(?:đang trong xưởng|dang trong xuong|dashboard).{0,40}', c, re.IGNORECASE)
        print(f'=== {f} ===')
        for m in matches[:5]:
            print('  ', m.strip())
