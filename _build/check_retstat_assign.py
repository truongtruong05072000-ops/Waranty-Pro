with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('rec.isReturnLevel1 = retStat.isReturnLevel1;')
print(text[pos:pos+300])
