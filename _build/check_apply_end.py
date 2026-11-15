import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('_build/apply_theme_and_icons.py', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()
print(''.join(lines[-30:]))
