import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_deploy/functions/api/sync-serviceos.js', 'r', encoding='utf-8', errors='ignore') as f:
    print(f.read())
