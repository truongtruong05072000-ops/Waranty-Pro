with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the broken newline with String.fromCharCode(10)
text = text.replace("const text = wos.join('\n');", "const text = wos.join(String.fromCharCode(10));")
text = text.replace("const text = wos.join('\\n');", "const text = wos.join(String.fromCharCode(10));")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Fixed wos.join in app_template2.html')
