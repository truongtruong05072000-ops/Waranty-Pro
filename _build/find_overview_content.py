import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

for m in re.finditer(r'overviewContent', content):
    start = max(0, m.start() - 100)
    end = min(len(content), m.end() + 500)
    print(content[start:end])
    print('='*50)
