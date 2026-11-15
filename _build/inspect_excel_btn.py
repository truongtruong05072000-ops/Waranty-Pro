import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('work-orders.xlsx')
if idx != -1:
    print('Found work-orders.xlsx:')
    print(text[idx-200:idx+400])
