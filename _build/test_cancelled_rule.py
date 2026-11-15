import io, json, re

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const DEALER_PORTAL_PRELOAD_CLAIMS\s*=\s*(\[.*?\]);\s*\n', text, re.DOTALL)
claims = json.loads(m.group(1))

print(f'Total preloaded claims: {len(claims)}')

def norm(s):
    if not s: return ''
    import unicodedata
    s = unicodedata.normalize('NFD', str(s))
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return s.lower().strip()

def eval_claim(c):
    raw_status = c.get('status') or ''
    norm_st = norm(raw_status)
    is_cancelled = 'cancel' in norm_st or 'da huy' in norm_st or norm_st == 'huy' or raw_status.upper() == 'CANCELLED'
    
    # RULE: Lệnh ĐXBH trả về nhưng hiện tại đang ở trạng thái hủy thì không tính vào tỷ lệ trả về
    if is_cancelled:
        return {'isReturned': False, 'status': raw_status, 'label': 'Đã hủy', 'isCancelled': True}

    l1 = c.get('returnLevel1Count') or 0
    l2 = c.get('returnLevel2Count') or 0
    seq = c.get('approvalSequence') or 0
    reason = norm(c.get('reason') or '')

    is_l1 = False
    is_l2 = False
    if l1 > 0: is_l1 = True
    if l2 > 0: is_l2 = True
    if 'cap 1 tra ve' in norm_st or 'tra ve cap 1' in norm_st: is_l1 = True
    if 'cap 2 tra ve' in norm_st or 'tra ve cap 2' in norm_st: is_l2 = True
    if 'tu choi' in norm_st or 'tra ve' in norm_st or 'reject' in norm_st or 'returned' in norm_st:
        if seq == 1 or 'cap 1' in norm_st: is_l1 = True
        else: is_l2 = True

    if not is_l1 and not is_l2 and reason and any(k in reason for k in ['tra ve', 'sai', 'bo sung', 'thieu', 'chua dat']):
        if seq >= 2: is_l2 = True
        else: is_l1 = True

    return {'isReturned': is_l1 or is_l2, 'isReturnLevel1': is_l1, 'isReturnLevel2': is_l2, 'status': raw_status}

cancelled_count = 0
returned_count = 0
for c in claims:
    res = eval_claim(c)
    if res.get('isCancelled'): cancelled_count += 1
    if res.get('isReturned'): returned_count += 1

print(f'Results: cancelled = {cancelled_count}, returned = {returned_count}')
print(f'Return rate: {returned_count / len(claims) * 100:.2f}%')
