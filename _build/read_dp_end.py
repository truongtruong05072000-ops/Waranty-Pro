import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('window.parseDealerPortalJson = function')
idx_end = content.find('// 4 QUY TẮC NGHIỆP VỤ', idx)
print(content[idx:idx_end])
