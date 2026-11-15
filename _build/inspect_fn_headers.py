import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('foreman_note')
while idx != -1:
    print(text[max(0, idx-50):min(len(text), idx+150)])
    print('-'*40)
    idx = text.find('foreman_note', idx+1)
