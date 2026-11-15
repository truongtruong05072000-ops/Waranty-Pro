import sys, re
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/serviceos_raw_user_input.json', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'N54511-WO' in line:
        start = max(0, i - 15)
        end = min(len(lines), i + 15)
        print(f"--- MATCH AT LINE {i+1} ---")
        for j in range(start, end):
            print(f"{j+1}: {lines[j].rstrip()}")
        break
