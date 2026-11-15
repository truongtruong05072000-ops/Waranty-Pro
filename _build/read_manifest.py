import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('baohanh_realtime_extension/manifest.json', 'r', encoding='utf-8', errors='ignore') as f:
    print(f.read())
