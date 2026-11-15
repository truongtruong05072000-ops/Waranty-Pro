import os

size_root = os.path.getsize('PhanTichBaoHanh.html')
size_deploy = os.path.getsize('_deploy/index.html')
size_tpl2 = os.path.getsize('_build/app_template2.html')
size_build_ptbh = os.path.getsize('_build/PhanTichBaoHanh.html')

print('Root PhanTichBaoHanh.html:', size_root)
print('_deploy/index.html:', size_deploy)
print('_build/app_template2.html:', size_tpl2)
print('_build/PhanTichBaoHanh.html:', size_build_ptbh)
