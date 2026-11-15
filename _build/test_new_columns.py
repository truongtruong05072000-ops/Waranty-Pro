# -*- coding: utf-8 -*-
import json

with open('_build/serviceos_50_cars.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

rows = data.get('rows', [])

def fmt_part_status(st, kind):
    if not st or st in ['—', '-']:
        return '—'
    s = str(st).lower().replace(' ', '_')
    if 'cho_lap_dong_co' in s or 'cho_lap_dc' in s:
        return 'Chờ lắp động cơ'
    if s == 'waiting_motor' or 'cho_dong_co' in s:
        return 'Chờ Động cơ'
    if s == 'waiting_battery' or 'cho_pin' in s:
        return 'Chờ PIN'
    if s == 'checking' or 'cho_kiem_tra' in s:
        return 'Chờ kiểm tra'
    if 'rejected' in s:
        return 'Từ chối'
    if 'completed' in s or 'done' in s:
        return 'Hoàn thành'
    if 'approved' in s or 'paid' in s:
        return 'Đã duyệt'
    return str(st)

with open('_build/test_new_columns_result.txt', 'w', encoding='utf-8') as out:
    out.write(f"Total cars: {len(rows)}\n")

    no_fault_count = 0
    checked_count = 0
    unchecked_count = 0

    for i, r in enumerate(rows):
        plate = r.get('plate') or '—'
        wo = r.get('code') or '—'
        faults = r.get('faults') or []
        has_loi = len(faults) > 0
        kinds = r.get('warranty_kinds') or []
        motor_serial = r.get('motor_serial_old') or ''
        pin_serial = r.get('battery_serial_old') or ''
        bh_code = r.get('dms_warranty_code') or ''
        claim_code = r.get('dms_claim_code') or ''
        note = (r.get('foreman_note') or r.get('advisor_note') or '').strip()
        has_note = bool(note and note not in ['—', '-'])
        
        has_card = bool(bh_code or claim_code or pin_serial or motor_serial or (kinds and any(k in ['motor', 'pin', 'esim'] for k in kinds)))
        
        # Check status rule:
        # "xe không lỗi thì tính là trạng thái check là xe không lỗi"
        if not has_loi:
            st_code = 'no_fault'
            st_label = 'Xe không lỗi'
            no_fault_count += 1
        elif has_card or has_note:
            st_code = 'checked'
            st_label = 'Đã check'
            checked_count += 1
        else:
            st_code = 'unchecked'
            st_label = 'Chưa check'
            unchecked_count += 1
            
        part_st = fmt_part_status(r.get('warranty_status'), kinds[0] if kinds else '')
        serial = motor_serial or pin_serial or '—'
        removed = r.get('motor_removed_at') or r.get('parts_removed_at') or '—'
        
        out.write(f"[{i+1:02d}] {plate:<12} | {str(faults):<20} | TT LK: {part_st:<16} | Serial: {serial:<34} | Tháo: {removed:<10} | Check: {st_label}\n")

    out.write(f"\nSummary counts: Xe không lỗi: {no_fault_count}, Đã check: {checked_count}, Chưa check: {unchecked_count}, Tổng: {len(rows)}\n")

print("Done writing _build/test_new_columns_result.txt")
