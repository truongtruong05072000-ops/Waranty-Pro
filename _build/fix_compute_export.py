with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('window.compute = compute;', 'window.computeAll = computeAll;\nwindow.compute = computeAll;')

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated window.computeAll')
