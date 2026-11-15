import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/serviceos_raw_user_input.json', 'r', encoding='utf-8') as f:
    text = f.read()
print('Length of raw user input:', len(text))
print(text[:2000])
