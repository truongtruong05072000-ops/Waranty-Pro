with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('return order;\n}\n\nconst DEALER_PORTAL_PRELOAD_CLAIMS', 'return order;\n}\nwindow.normalizeOrder = normalizeOrder;\n\nconst DEALER_PORTAL_PRELOAD_CLAIMS')

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Exported window.normalizeOrder')
