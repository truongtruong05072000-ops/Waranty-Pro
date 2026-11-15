import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('unsubmittedWarrantyOrders')
while pos != -1:
    print(f"--- MATCH AT {pos} ---")
    print(text[max(0, pos-150):min(len(text), pos+600)])
    pos = text.find('unsubmittedWarrantyOrders', pos+1)
