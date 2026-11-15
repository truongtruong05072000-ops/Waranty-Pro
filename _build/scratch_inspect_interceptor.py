import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('baohanh_realtime_extension/injected_interceptor.js', 'r', encoding='utf-8') as f:
    print(f.read())
