import sys, io
sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('PhanTichBaoHanh.html has importServiceOsClipboard:', 'importServiceOsClipboard' in text)
print('PhanTichBaoHanh.html has renderCheckXe:', 'renderCheckXe' in text)
print('PhanTichBaoHanh.html has checkUrlImport:', 'checkUrlImport' in text)
