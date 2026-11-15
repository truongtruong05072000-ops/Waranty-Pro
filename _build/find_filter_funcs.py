import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

for m in re.finditer(r'function (setCheckXe\w+|resetCheckXe\w+)\(', content):
    print(m.group(0))
    start = m.start()
    print(content[start:start+400])
    print("="*50)
