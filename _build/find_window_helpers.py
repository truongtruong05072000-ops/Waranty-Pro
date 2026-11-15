import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

for fn in ['setCheckXeCat', 'setCheckXeDate', 'setCheckXeScope', 'setCheckXeColFilter', 'setCheckXeViewMode', 'setCheckXeSort', 'resetCheckXeFilters']:
    for m in re.finditer(rf'window\.{fn}\s*=', content):
        print(f"Found {fn}: {content[m.start():m.start()+250]}")
        print("-" * 40)
