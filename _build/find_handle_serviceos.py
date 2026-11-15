import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    c = f.read()

m = re.search(r'function handleServiceOsRealtimeOrders\([^\)]*\)\s*\{([\s\S]*?)(?=\nfunction |\nwindow\.|\nconst |\nlet )', c)
if m:
    print('Found handleServiceOsRealtimeOrders:')
    print(m.group(0))
else:
    print('handleServiceOsRealtimeOrders NOT found!')
