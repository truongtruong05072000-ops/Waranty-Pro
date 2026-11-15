with open('_build/serviceos_raw_user_input.json', 'r', encoding='utf-8') as f:
    text = f.read()

import json
end_pos = text.rfind('}')
while end_pos > 0:
    try:
        sub = text[:end_pos+1]
        if '<USER_REQUEST>' in sub: sub = sub.split('<USER_REQUEST>')[1]
        data = json.loads(sub.strip())
        print('Parsed successfully with length:', len(sub))
        rows = data.get('rows') or []
        print('Total rows:', len(rows))
        for k in sorted(rows[0].keys()):
            val = rows[0][k]
            if any(w in k.lower() for w in ['part', 'job', 'item', 'task', 'service', 'labor', 'pay', 'cust', 'gsm', 'type', 'kind', 'fault', 'warranty', 'dms']):
                print(f'  {k}: {val}')
        break
    except Exception as e:
        end_pos = text.rfind('}', 0, end_pos)
