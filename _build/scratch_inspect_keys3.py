import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_raw_user_input.json', 'r', encoding='utf-8') as f:
    text = f.read()

end_pos = text.rfind('}')
while end_pos > 0:
    try:
        sub = text[:end_pos+1]
        if '<USER_REQUEST>' in sub: sub = sub.split('<USER_REQUEST>')[1]
        data = json.loads(sub.strip())
        rows = data.get('rows') or []
        for k in sorted(rows[0].keys()):
            print(f"  {k}: {rows[0][k]}")
        break
    except Exception as e:
        end_pos = text.rfind('}', 0, end_pos)
