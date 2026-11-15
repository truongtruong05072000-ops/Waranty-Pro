import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/scratch_inspect_dp_apis.py', 'r', encoding='utf-8', errors='ignore') as f:
    print(f.read())
