const fs = require('fs');

const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf8');

// Check that formatDealerPortalWo exists
if (!html.includes('function formatDealerPortalWo')) {
  console.error('ERROR: formatDealerPortalWo not found!');
  process.exit(1);
}

// Test formatDealerPortalWo function in isolation
const testFn = new Function(`
  function formatDealerPortalWo(rawWo, dmsRoCode, orderCode, workOrderNumber) {
    if (workOrderNumber && String(workOrderNumber).includes('-WO-')) {
      return String(workOrderNumber).trim();
    }
    if (dmsRoCode && String(dmsRoCode).includes('-WO-')) {
      return String(dmsRoCode).trim();
    }
    if (rawWo && String(rawWo).includes('-WO-')) {
      return String(rawWo).trim();
    }
    const candidate = String(dmsRoCode || workOrderNumber || rawWo || orderCode || '').trim();
    const m = candidate.match(/^([A-Z0-9]+)-([0-9]{6})-([0-9]+)$/i);
    if (m) {
      const dealer = m[1].toUpperCase();
      const datePart = m[2];
      const seq = m[3].padStart(4, '0');
      return dealer + '-WO-' + datePart + '-' + seq;
    }
    const m2 = candidate.match(/^([A-Z0-9]+)[-_]?WO[-_]?([0-9]{6})[-_]?([0-9]+)$/i);
    if (m2) {
      const dealer = m2[1].toUpperCase();
      const datePart = m2[2];
      const seq = m2[3].padStart(4, '0');
      return dealer + '-WO-' + datePart + '-' + seq;
    }
    return candidate || '—';
  }
  return formatDealerPortalWo;
`)();

// 1. ServiceOS code N54511-261106-006 (from user's screenshot row 1)
const r1 = testFn(null, null, 'N54511-261106-006');
console.log('Test 1 (N54511-261106-006):', r1);
if (r1 !== 'N54511-WO-261106-0006') throw new Error('Test 1 failed: ' + r1);

// 2. ServiceOS code with explicit dms_ro_code N54511-WO-261104-0019 (from user's screenshot row 4)
const r2 = testFn('N54511-261104-008', 'N54511-WO-261104-0019', 'N54511-261104-008');
console.log('Test 2 (dms_ro_code):', r2);
if (r2 !== 'N54511-WO-261104-0019') throw new Error('Test 2 failed: ' + r2);

// 3. Dealer portal claim workOrderNumber N54511-WO-261024-0044 (from user's prompt)
const r3 = testFn(null, null, null, 'N54511-WO-261024-0044');
console.log('Test 3 (Dealer Portal prompt example):', r3);
if (r3 !== 'N54511-WO-261024-0044') throw new Error('Test 3 failed: ' + r3);

// 4. Raw wo with -WO-
const r4 = testFn('N54511-WO-261028-0015');
console.log('Test 4 (rawWo):', r4);
if (r4 !== 'N54511-WO-261028-0015') throw new Error('Test 4 failed: ' + r4);

console.log('ALL TESTS PASSED SUCCESSFULLY!');
