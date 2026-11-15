import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/serviceos_raw_user_input.json', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for j in range(740, 770):
    print(f"{j+1}: {lines[j].rstrip()}")
