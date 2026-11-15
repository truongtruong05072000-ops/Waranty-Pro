# -*- coding: utf-8 -*-
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

categories = [
  { 'id': 'all', 'name': 'Tất cả hạng mục', 'icon': '📋' },
  { 'id': 'topcover', 'name': 'Lỗi nút TopCover', 'icon': '🔘', 'keywords': ['topcover', 'top cover', 'nút top', 'nut top'] },
  { 'id': 'motor', 'name': 'Lỗi động cơ', 'icon': '⚡', 'keywords': ['động cơ', 'dong co', 'motor', 'số máy', 'so may'] },
  { 'id': 'rear_shock', 'name': 'Lỗi giảm sóc sau', 'icon': '🛞', 'keywords': ['giảm sóc sau', 'giảm xóc sau', 'giam soc sau', 'giam xoc sau', 'phuộc sau', 'nhún sau'] },
  { 'id': 'front_shock', 'name': 'Lỗi giảm xóc trước', 'icon': '🚲', 'keywords': ['giảm xóc trước', 'giảm sóc trước', 'giam xoc truoc', 'giam soc truoc', 'phuộc trước', 'nhún trước'] },
  { 'id': 'pin', 'name': 'Lỗi PIN', 'icon': '🔋', 'keywords': ['pin', 'battery', 'bms', 'cell', 'lắp pin', 'tháo pin'] },
  { 'id': 'charger', 'name': 'Lỗi sạc', 'icon': '🔌', 'keywords': ['sạc', 'sac', 'charger', 'củ sạc', 'bộ sạc'] },
  { 'id': 'esim', 'name': 'Lỗi Esim', 'icon': '📶', 'keywords': ['esim', 'e-sim', 'sim', 'mất sóng', 'mat song', '4g'] },
  { 'id': 'hmi', 'name': 'Lỗi HMI', 'icon': '🖥️', 'keywords': ['hmi', 'màn hình', 'man hinh', 'đồng hồ', 'dong ho', 'display'] },
  { 'id': 'mcu', 'name': 'Lỗi MCU', 'icon': '🎛️', 'keywords': ['mcu', 'điều khiển động cơ', 'dieu khien dong co', 'motor controller'] },
  { 'id': 'scu', 'name': 'Lỗi SCU', 'icon': '🔑', 'keywords': ['scu', 'smartkey', 'smart key', 'chìa khóa', 'chia khoa', 'khóa thông minh'] },
  { 'id': 'dcdc', 'name': 'Lỗi DC - DC', 'icon': '⚡', 'keywords': ['dc - dc', 'dc-dc', 'dcdc', 'hạ áp', 'ha ap', '12v'] },
  { 'id': 'harness', 'name': 'Lỗi bộ dây điện', 'icon': '🧵', 'keywords': ['bộ dây điện', 'bo day dien', 'dây điện', 'day dien', 'dây sườn', 'giắc điện', 'chập điện', 'harness'] },
  { 'id': 'other', 'name': 'Lỗi khác', 'icon': '🛠️', 'keywords': [] }
]

def match_fault(fault_str, fallback_txt=''):
    f = (fault_str or '').strip().lower()
    if f:
        # Check against categories
        for cat in categories[1:-1]:
            if any(kw in f for kw in cat['keywords']) or cat['name'].lower() in f or f in cat['name'].lower():
                return cat
        return {'id': 'custom_' + f[:10], 'name': fault_str.strip(), 'icon': '🛠️'}
    
    # Fallback to text
    txt = (fallback_txt or '').strip().lower()
    for cat in categories[1:-1]:
        if any(kw in txt for kw in cat['keywords']):
            return cat
    return categories[-1]

# Test cases
test_cases = [
    ("Lỗi Esim", "% PIN: 80% LỖI ĐV"),
    ("Lỗi động cơ", "Ngoại quan thay bạc đạn"),
    ("Lỗi PIN", "sụt pin nhanh"),
    ("Lỗi sạc", "không vào điện"),
    ("Lỗi nút TopCover", ""),
    ("", "% PIN: 74%"),
    ("", "kêu động cơ")
]

for ft, fb in test_cases:
    res = match_fault(ft, fb)
    print(f"Fault: '{ft}' | Fallback: '{fb}' -> Result: {res['name']} ({res['id']})")
