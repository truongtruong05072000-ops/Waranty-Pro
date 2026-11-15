import glob, re, sys
sys.stdout.reconfigure(encoding='utf-8')

for f in glob.glob('_build/*.js'):
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    if 'active_statuses' in c or 'active' in c:
        matches = re.findall(r'.{0,40}active_statuses.{0,40}', c)
        if matches:
            print(f'=== {f} ===')
            for m in matches[:5]:
                print('  ', m.strip())
