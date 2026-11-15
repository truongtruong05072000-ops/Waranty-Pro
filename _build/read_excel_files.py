import sys
sys.stdout.reconfigure(encoding='utf-8')
import openpyxl

for fname in ['[New 2024] Active warranty claim  2026-10-22 9-34-02 PM.xlsx', 'warranty-claims_2026-07-23_2026-10-22_20261022143423.xlsx']:
    try:
        wb = openpyxl.load_workbook(fname, read_only=True)
        print(f"=== {fname} ===")
        print("Sheets:", wb.sheetnames)
        for sname in wb.sheetnames[:3]:
            ws = wb[sname]
            rows = list(ws.iter_rows(max_row=5, values_only=True))
            print(f"Sheet '{sname}' first row:", rows[0] if rows else "empty")
            if len(rows) > 1:
                print(f"Sheet '{sname}' second row:", rows[1])
    except Exception as e:
        print(f"Error reading {fname}: {e}")
