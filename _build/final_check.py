# -*- coding: utf-8 -*-
with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

assert 'id="gateLock"' not in text, "gateLock should not be in text"
assert 'id="gatePass"' not in text, "gatePass should not be in text"
assert 'id="gateBtn"' not in text, "gateBtn should not be in text"
assert 'sessionStorage.getItem(\'bh_gate\')' not in text, "bh_gate check should not be in text"
assert 'id="appShell"' in text, "appShell must be present"
assert '<div class="brand-emblem-wrap"' in text, "brand-emblem-wrap must be present"
assert 'data:image/jpeg;base64,' in text, "Logo base64 must be present"

print("All safety and accessibility checks PASSED!")
