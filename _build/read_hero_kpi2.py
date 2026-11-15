import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('const heroKpiHtml =')
idx2 = content.find("$('#overviewContent').innerHTML = `")
print(content[idx:idx2])
