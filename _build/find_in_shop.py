import glob, re, sys
sys.stdout.reconfigure(encoding='utf-8')

for f in glob.glob('_build/*.*'):
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    if 'in_shop' in c:
        matches = re.findall(r'.{0,50}in_shop.{0,50}', c)
        print(f'=== {f} ===')
        for m in matches[:5]:
            print('  ', m.strip())
