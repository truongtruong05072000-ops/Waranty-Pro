import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = r'''  // Tra cứu tự động từ bộ nhớ đề xuất Dealer Portal (window.DEALER_CLAIMS_MAP) qua VIN và Lệnh sửa chữa
  if (window.DEALER_CLAIMS_MAP && window.DEALER_CLAIMS_MAP.size > 0) {
    const cVin = String(vin).trim().toUpperCase();
    const cWo = String(wo).trim().toUpperCase();
    const cRo = String(d.dms_ro_code || '').trim().toUpperCase();
    const matchedClaim = window.DEALER_CLAIMS_MAP.get(cVin) ||'''

new_block = r'''  // Tra cứu tự động từ bộ nhớ đề xuất Dealer Portal (window.DEALER_CLAIMS_MAP) qua VIN và Lệnh sửa chữa
  let matchedClaim = null;
  if (window.DEALER_CLAIMS_MAP && window.DEALER_CLAIMS_MAP.size > 0) {
    const cVin = String(vin).trim().toUpperCase();
    const cWo = String(wo).trim().toUpperCase();
    const cRo = String(d.dms_ro_code || '').trim().toUpperCase();
    matchedClaim = window.DEALER_CLAIMS_MAP.get(cVin) ||'''

if old_block in content:
    content = content.replace(old_block, new_block, 1)
    print("Fixed matchedClaim scoping.")
else:
    print("Error: old_block not found!")
    sys.exit(1)

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved app_template2.html.")
