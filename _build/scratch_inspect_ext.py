import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('baohanh_realtime_extension/background.js', 'r', encoding='utf-8') as f:
    print('=== background.js ===')
    print(f.read())

with open('baohanh_realtime_extension/content_webapp.js', 'r', encoding='utf-8') as f:
    print('=== content_webapp.js ===')
    print(f.read())
