import sys, io
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_shell.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('/api/auth/login')
print(text[idx-200:idx+800])
