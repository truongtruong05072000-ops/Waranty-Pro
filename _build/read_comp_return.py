import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('function computeAll(')
idx_ret = content.find('return state.computed;', idx)
print(content[idx_ret-600:idx_ret+50])
