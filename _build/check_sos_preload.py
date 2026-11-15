import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Check if there are preload ServiceOS orders
m = re.search(r'SERVICEOS_PRELOAD_ORDERS\s*=\s*(\[.*?\]);', content, re.DOTALL)
if m:
    orders = json.loads(m.group(1))
    print(f"Loaded {len(orders)} preload ServiceOS orders.")
else:
    print("No SERVICEOS_PRELOAD_ORDERS found, checking sample orders...")
