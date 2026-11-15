import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('const [d, techs, bhSum, alertSum, walkinSum]')
if idx != -1:
    print(text[idx+100:idx+1500])
