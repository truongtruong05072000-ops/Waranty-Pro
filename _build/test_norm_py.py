import io, json, re

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS\s*=\s*(\[.*?\]);\s*\n', text, re.DOTALL)
orders = json.loads(m.group(1))

# Let's extract normalizeOrder and isSettledOrHigher from app_template2.html
pos_settled = text.find('function isSettledOrHigher(')
pos_eval = text.find('function evaluateCheckStatus(')
settled_js = text[pos_settled:pos_eval]

pos_norm = text.find('function normalizeOrder(')
pos_preload = text.find('const DEALER_PORTAL_PRELOAD_CLAIMS')
norm_js = text[pos_norm:pos_preload]

print('Extracted JS lengths:', len(settled_js), len(norm_js))
