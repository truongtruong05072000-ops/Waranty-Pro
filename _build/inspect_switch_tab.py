with open('PhanTichBaoHanh.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('function switchSyncTab(')
if idx != -1:
    print('Found switchSyncTab:')
    print(text[idx:idx+800])
else:
    print('switchSyncTab not found!')
