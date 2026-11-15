import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('matchedClaim')
while pos != -1:
    print(f"--- MATCH AT {pos} ---")
    print(text[max(0, pos-100):min(len(text), pos+400)])
    pos = text.find('matchedClaim', pos+1)
