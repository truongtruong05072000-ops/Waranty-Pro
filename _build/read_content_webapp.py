import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('baohanh_realtime_extension/content_webapp.js', 'r', encoding='utf-8', errors='ignore') as f:
    print(f.read())
