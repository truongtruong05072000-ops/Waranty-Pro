import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

print('Searching /api/work-orders...')
for m in re.finditer(r'/api/work-orders[^\s"\'`]*', text):
    print(m.group(0))

print('Searching render function or table structure in workorders.js...')
for m in re.finditer(r'function render[a-zA-Z0-9_]*', text):
    print(m.group(0))

# Search for foreman_note or ghi chú
for m in re.finditer(r'foreman_note', text):
    idx = m.start()
    print('Foreman note context:', text[max(0, idx-100):min(len(text), idx+200)])
    break
