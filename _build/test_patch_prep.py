import sys, re
sys.stdout.reconfigure(encoding='utf-8')

# Read current app_template2.html
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    code = f.read()

print(f"Original template length: {len(code)}")

# Check where newRecord() is
idx_nr = code.find('function newRecord(){')
print(f"Found newRecord at {idx_nr}")
