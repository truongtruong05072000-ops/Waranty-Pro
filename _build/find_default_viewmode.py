import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find("viewMode: '")
if idx != -1:
    print(content[idx-50:idx+150])
else:
    for m in re.finditer(r'viewMode', content):
        print(content[m.start()-20:m.end()+40])
