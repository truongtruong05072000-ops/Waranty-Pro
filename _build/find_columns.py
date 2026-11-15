import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

idx = c.find('raw: (w) => w.battery_serial_old')
print(c[idx-500:idx+3500])
