with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('const state = {')
print(text[pos:pos+300])
