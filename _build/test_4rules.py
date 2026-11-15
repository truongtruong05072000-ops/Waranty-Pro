# -*- coding: utf-8 -*-
import sys, io
sys.stdout.reconfigure(encoding='utf-8')

def evaluate_check_status(has_loi, has_ktv_note, has_bang_cap_nhat):
    # Rule 4: Nếu có hạng mục lỗi nhưng không có bảng cập nhật bên dưới và đã có ghi chú KTV là cần check lại.
    if has_loi and has_ktv_note and not has_bang_cap_nhat:
        return 'RECHECK', 'Cần check lại'
    
    # Rule 1: Nếu có hạng mục lỗi nhưng không có ghi chú KTV hay phần bảng cập nhật phía dưới là mặc định chưa check.
    if has_loi and not has_ktv_note and not has_bang_cap_nhat:
        return 'UNCHECKED', 'Chưa check'
        
    # Rule 2: Nếu không có hạng mục lỗi và không có phần ghi chú KTV mà có bảng cập nhật bên dưới là đã check.
    if not has_loi and not has_ktv_note and has_bang_cap_nhat:
        return 'CHECKED', 'Đã check'
        
    # Rule 3: Nếu có phần hạng mục lỗi và ghi chú KTV thì là đã check (khi có bảng cập nhật).
    if has_loi and has_ktv_note and has_bang_cap_nhat:
        return 'CHECKED', 'Đã check'
        
    # Other cases:
    # Có lỗi + có bảng cập nhật (dù chưa có ghi chú) -> đã check
    if has_loi and has_bang_cap_nhat:
        return 'CHECKED', 'Đã check'
        
    # Không có lỗi + có ghi chú KTV -> đã check
    if has_ktv_note:
        return 'CHECKED', 'Đã check'
        
    return 'NORMAL', 'Xe bình thường'

# Test matrix
cases = [
    # (has_loi, has_ktv_note, has_bang, expected_code)
    (True, False, False, 'UNCHECKED'),   # Rule 1
    (False, False, True, 'CHECKED'),     # Rule 2
    (True, True, True, 'CHECKED'),       # Rule 3
    (True, True, False, 'RECHECKED'),    # Rule 4
]

print("=== EVALUATION TEST ===")
for has_l, has_n, has_b, exp in cases:
    code, label = evaluate_check_status(has_l, has_n, has_b)
    print(f"Lỗi={has_l} | Note={has_n} | Bảng={has_b} => {code} ({label})")
