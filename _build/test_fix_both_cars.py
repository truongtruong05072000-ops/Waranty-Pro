# -*- coding: utf-8 -*-
import sys, json

car1_sample = {
    "code": "N54511-261104-009",
    "plate": "29C2-07744",
    "vin": "RPXP1LHHVPE060424",
    "model": "Evo 200",
    "inspect_summary": "LỖI ĐV",
    "faults": ["Lỗi Esim"],
    "dms_warranty_code": "N54511-WO-261104-0012",
    "dms_warranty_status": "checking",
    "created_at": "2026-11-04T16:18:00"
}

car6_sample = {
    "code": "N54511-261104-003",
    "plate": "59T2-66554",
    "vin": "VIN037868",
    "model": "Feliz S",
    "faults": ["Lỗi PIN"],
    "battery_serial_old": "BAT12006000070003094230807N00353",
    "parts_removed_at": "2026-11-04",
    "warranty_status": "waiting_battery"
}

print("Both cars defined successfully.")
