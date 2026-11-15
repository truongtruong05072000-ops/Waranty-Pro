import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx_norm = content.find('function normalizeOrder(')
print(f"normalizeOrder at {idx_norm}")

idx_comp = content.find('function computeAll(')
print(f"computeAll at {idx_comp}")
