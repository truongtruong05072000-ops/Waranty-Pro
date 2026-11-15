import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_wodetail.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

idx = c.find('Nội dung kiểm tra')
print(c[idx-100:idx+800])
