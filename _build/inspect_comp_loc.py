import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect around state.computed = {
idx = content.find('state.computed = {')
print("Before state.computed:")
print(content[idx-400:idx])
print("Inside state.computed:")
print(content[idx:idx+1200])
