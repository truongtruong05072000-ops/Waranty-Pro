# -*- coding: utf-8 -*-
import sys, io
sys.stdout.reconfigure(encoding='utf-8')

categories = [
    ('topcover', 'Lỗi nút TopCover', ['topcover', 'top cover', 'nút top', 'nut top']),
    ('rear_shock', 'Lỗi giảm sóc sau', ['giảm sóc sau', 'giảm xóc sau', 'giam soc sau', 'giam xoc sau', 'phuộc sau', 'nhún sau']),
    ('front_shock', 'Lỗi giảm xóc trước', ['giảm xóc trước', 'giảm sóc trước', 'giam xoc truoc', 'giam soc truoc', 'phuộc trước', 'nhún trước']),
    ('esim', 'Lỗi Esim', ['esim', 'e-sim', 'sim', 'mất sóng', 'mat song', '4g']),
    ('hmi', 'Lỗi HMI', ['hmi', 'màn hình', 'man hinh', 'đồng hồ', 'dong ho', 'display']),
    ('mcu', 'Lỗi MCU', ['mcu', 'điều khiển động cơ', 'dieu khien dong co', 'motor controller']),
    ('scu', 'Lỗi SCU', ['scu', 'smartkey', 'smart key', 'chìa khóa', 'chia khoa', 'khóa thông minh']),
    ('dcdc', 'Lỗi DC - DC', ['dc - dc', 'dc-dc', 'dcdc', 'hạ áp', 'ha ap', '12v']),
    ('harness', 'Lỗi bộ dây điện', ['dây điện', 'day dien', 'bộ dây', 'bo day', 'dây sườn', 'giắc điện', 'chập điện', 'harness']),
    ('charger', 'Lỗi sạc', ['sạc', 'sac', 'charger', 'củ sạc', 'bộ sạc']),
    ('pin', 'Lỗi PIN', ['pin', 'battery', 'bms', 'cell']),
    ('motor', 'Lỗi động cơ', ['động cơ', 'dong co', 'motor', 'vành']),
]

def categorize(txt):
    t = (txt or '').lower()
    for cid, cname, kws in categories:
        for kw in kws:
            if kw in t:
                return cid, cname
    return 'other', 'Lỗi khác'

img_items = [
    "Lỗi nút TopCover",
    "Lỗi động cơ",
    "Lỗi giảm sóc sau",
    "Lỗi giảm xóc trước",
    "Lỗi PIN",
    "Lỗi sạc",
    "Lỗi Esim",
    "Lỗi HMI",
    "Lỗi MCU",
    "Lỗi SCU",
    "Lỗi DC - DC",
    "Lỗi bộ dây điện"
]

for item in img_items:
    cid, cname = categorize(item)
    print(f"[{'OK' if cname == item else 'FAIL'}] '{item}' => '{cname}' (id: {cid})")
