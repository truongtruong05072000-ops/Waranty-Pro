import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('data-col="foreman_note"')
if idx != -1:
    print('Found data-col="foreman_note":')
    print(text[idx-300:idx+300])
else:
    print('data-col="foreman_note" not found, searching foreman_note:')
    for m in re.finditer(r'foreman_note', text):
        i = m.start()
        print(text[i-100:i+150])
        print('-'*30)
