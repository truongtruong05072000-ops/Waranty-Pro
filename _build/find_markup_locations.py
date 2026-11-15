with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Check between body start (148707) and Script 1 (293026)
p1 = text[148707:293026]
print('Length between body and script 1:', len(p1))
# Check between script 1 end and script 2 start (1002347)
s1_end = text.find('</script>', 293026) + 9
p2 = text[s1_end:1002347]
print('Length between script 1 end and script 2:', len(p2))

# Also check after script 2 end
s2_end = text.find('</script>', 1002347) + 9
p3 = text[s2_end:]
print('Length after script 2 end:', len(p3))
