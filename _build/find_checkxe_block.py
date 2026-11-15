import sys, io
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = text.find('/* ============================ Check Xe Hàng Ngày (ServiceOS) ============================ */')
end_marker = text.find('/* ============================ Navigation ============================ */', start_marker)
print(f"CheckXe block: from {start_marker} to {end_marker} (length: {end_marker - start_marker})")
