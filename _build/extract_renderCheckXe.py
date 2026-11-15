import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_line = 0
end_line = 0
for i, l in enumerate(lines):
    if 'function renderCheckXe(' in l:
        start_line = i
    if start_line > 0 and i > start_line and 'function parseServiceOsWorkbook' in l:
        end_line = i
        break

print(f"renderCheckXe is from line {start_line+1} to {end_line+1}")

with open('_build/renderCheckXe_full.js', 'w', encoding='utf-8') as out:
    out.writelines(lines[start_line:end_line])

print("Wrote renderCheckXe_full.js")
