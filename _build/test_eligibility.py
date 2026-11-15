# -*- coding: utf-8 -*-
import sys, io
sys.stdout.reconfigure(encoding='utf-8')

# Test eligibility logic
def is_eligible(issue, status, warranty_status):
    issue_lower = (issue or '').lower()
    has_loi = ('lỗi' in issue_lower) or ('loi' in issue_lower)
    if not has_loi:
        return False, "Không chứa từ 'lỗi'"
    
    st_lower = (status or '').lower().strip()
    is_completed = any(x in st_lower for x in ['hoàn thành', 'done', 'completed'])
    is_gsm = any(x in st_lower for x in ['gsm đã nghiệm thu', 'đã nghiệm thu', 'gsm_received'])
    if is_completed or is_gsm:
        return False, f"Trạng thái là hoàn thành/nghiệm thu ({status})"
    
    ws_lower = (warranty_status or '').lower().strip()
    is_empty_ws = not ws_lower or ws_lower in ['—', '-', 'none', 'null', 'trống', 'chưa cập nhật bh']
    is_checking = any(x in ws_lower for x in ['chờ kiểm tra', 'checking'])
    if not (is_empty_ws or is_checking):
        return False, f"Trạng thái BH không phải trống/chờ kiểm tra ({warranty_status})"
        
    return True, "Hợp lệ"

test_cases = [
    ("Lỗi PIN không sạc", "Trong xưởng", "", True),
    ("Lỗi động cơ", "Đang sửa", "Chờ kiểm tra", True),
    ("Lỗi HMI", "Hoàn thành", "", False),
    ("Lỗi SCU", "Trong xưởng", "Đã duyệt", False),
    ("Bảo dưỡng định kỳ", "Trong xưởng", "", False),
    ("Lỗi nút TopCover", "waiting_repair", "checking", True),
    ("Lỗi giảm sóc sau", "gsm_received", "checking", False),
    ("Lỗi bộ dây điện", "Đang xử lý", "—", True),
]

for issue, st, ws, expected in test_cases:
    res, reason = is_eligible(issue, st, ws)
    print(f"[{'PASS' if res == expected else 'FAIL'}] Issue='{issue}' | St='{st}' | WS='{ws}' => {res} ({reason})")
