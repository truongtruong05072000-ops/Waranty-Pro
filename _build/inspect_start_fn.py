with open(r'_build\serviceos_shell.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('async function start(')
if idx == -1:
    idx = text.find('function start(')

print('start index:', idx)
print(text[idx:idx+1200].encode('ascii', errors='replace').decode('ascii'))
