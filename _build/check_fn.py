import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

for fname in ['_build/update_template_with_checkxe.py', '_build/patch_checkxe.py', '_build/patch_advanced_bookmarklet.py']:
    with open(fname, 'r', encoding='utf-8') as f:
        text = f.read()
    print(fname, 'has importServiceOsClipboard:', 'importServiceOsClipboard' in text)
