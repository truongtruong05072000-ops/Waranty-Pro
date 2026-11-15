import glob, re, sys
sys.stdout.reconfigure(encoding='utf-8')

for f in glob.glob('_build/*.*') + glob.glob('baohanh_realtime_extension/*.*'):
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    if 'warranty-claim' in c or 'warrantyClaim' in c or 'aftersales' in c:
        matches = re.findall(r'.{0,60}(?:warranty-claim|warrantyClaim|aftersales).{0,60}', c)
        print(f'=== {f} ===')
        for m in matches[:5]:
            print('  ', m.strip())
