import sys, json
sys.stdout.reconfigure(encoding='utf-8')

# Test 2: Car with "Không lỗi" vs car with "Lỗi PIN"
def check_is_unsubmitted_warranty(o):
    has_actual_work = bool(o.get('hasLoi') and len(o.get('faultList') or []) > 0) or bool(o.get('hasBangCapNhat')) or bool(o.get('bhCode') and o.get('bhCode') != '—')
    is_warranty_payment = bool(o.get('isWarrantyPayment') and has_actual_work)
    is_settled = bool(o.get('isSettled'))
    claim_code = o.get('claimCode') or ''
    has_wc = bool(claim_code and claim_code.startswith('WC-'))
    
    return is_warranty_payment and is_settled and not has_wc

car1 = {
    'plate': '29X7-75136',
    'hasLoi': False,
    'faultList': [],
    'hasBangCapNhat': False,
    'isWarrantyPayment': True, # was mistakenly true earlier
    'isSettled': True,
    'claimCode': '—'
}

car2 = {
    'plate': '29X7-99999',
    'hasLoi': True,
    'faultList': ['Lỗi PIN'],
    'hasBangCapNhat': True,
    'isWarrantyPayment': True,
    'isSettled': True,
    'claimCode': '—'
}

res1 = check_is_unsubmitted_warranty(car1)
res2 = check_is_unsubmitted_warranty(car2)

print(f"Car1 (Không lỗi): isUnsubmittedWarranty = {res1} (expected False)")
print(f"Car2 (Lỗi PIN): isUnsubmittedWarranty = {res2} (expected True)")

assert res1 is False
assert res2 is True
print("TEST PASSED: 'Không lỗi' cars are completely eliminated from unsubmitted alert!")
