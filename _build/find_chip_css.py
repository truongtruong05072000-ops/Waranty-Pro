import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('.chip {')
if idx != -1:
    print(content[idx:idx+500])

idx_header = content.find('id="ctxExpectedVal"')
if idx_header != -1:
    print(content[idx_header-600:idx_header+400])
