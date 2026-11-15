# -*- coding: utf-8 -*-
import sys, re, subprocess

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all inline scripts with content
scripts = re.findall(r'<script(?![^>]*src=)[^>]*>([\s\S]*?)</script>', html)
print(f"Total inline scripts: {len(scripts)}")
for idx, s in enumerate(scripts):
    print(f"Inline script {idx+1} length: {len(s)}")

# The last inline script is the main app script
main_js = scripts[-1]
with open('_build/temp_main_test.js', 'w', encoding='utf-8') as f:
    f.write(main_js)

res = subprocess.run(['node', '--check', '_build/temp_main_test.js'], capture_output=True, text=True)
print("Node syntax check exit code:", res.returncode)
if res.returncode != 0:
    print("STDOUT:", res.stdout)
    print("STDERR:", res.stderr)
    sys.exit(1)
else:
    print("JavaScript syntax check PASSED with 0 errors!")
