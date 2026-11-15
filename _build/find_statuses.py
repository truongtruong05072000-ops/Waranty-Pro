import glob, re

statuses = set()
for f in glob.glob('_build/*.*') + glob.glob('baohanh_realtime_extension/*.*'):
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    for m in re.findall(r'status(?:_code)?\s*===?\s*[\'\"]([a-zA-Z0-9_\-]+)[\'\"]', c):
        statuses.add((f, m))
for s in sorted(statuses):
    print(s)
