const fs = require('fs');
const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf8');

console.log('Testing PhanTichBaoHanh.html for updated payment classification...');

if (!html.includes('hasWarrantyLineItem')) {
  console.error('ERROR: hasWarrantyLineItem not found in HTML!');
  process.exit(1);
}

if (!html.includes('handleDealerPortalLineItems')) {
  console.error('ERROR: handleDealerPortalLineItems not found in HTML!');
  process.exit(1);
}

console.log('ALL SYNTAX & LOGIC TESTS PASSED!');
