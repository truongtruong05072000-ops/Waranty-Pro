import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/serviceos_raw_user_input.json', 'r', encoding='utf-8') as f:
    text = f.read()
matches = re.findall(r'N54511-WO[^\",\s]+', text)
print('Found matches in raw user input:', len(matches))
print('Sample matches:', matches[:10])
try:
    data = json.loads(text)
    print('Type of data:', type(data))
    if isinstance(data, list):
        print('List length:', len(data))
        for item in data[:5]:
            for k, v in item.items():
                if 'WO' in str(v):
                    print(f'Key {k} has WO: {v}')
    elif isinstance(data, dict):
        print('Dict keys:', list(data.keys()))
except Exception as e:
    print('JSON error:', e)
