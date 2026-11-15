with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('return state.computed;\n}\n\n/* ============================ Rendering ============================ */', 'return state.computed;\n}\nwindow.compute = compute;\n\n/* ============================ Rendering ============================ */')

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Exported window.compute')
