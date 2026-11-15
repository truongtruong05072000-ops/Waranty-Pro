const fs = require('fs');

const userJson = {
    "work_order": {
        "id": 6264,
        "code": "N54511-260506-072",
        "branch_id": 2,
        "customer_id": 1,
        "vehicle_id": 12510,
        "service_type": "repair",
        "priority": "normal",
        "status": "in_progress",
        "odometer": 74606,
        "battery_level": 39,
        "symptoms": "29Y5-89945 trả hộ lưu kho caron2",
        "diagnosis": "29Y5-89945 trả hộ lưu kho caron2\nnhờ vf check lsbd\nXe không tài xế.\nKTV (AppSheet): Cao Trần Tấn Phú",
        "technician_id": 27,
        "received_at": "2026-05-06 00:00:00",
        "started_at": "2026-05-30 00:00:00",
        "source": "gsm",
        "sla_due_at": "2026-05-09",
        "warranty_status": "waiting_motor",
        "faults": [
            "Lỗi động cơ"
        ],
        "quote_amount": 3845513,
        "motor_serial_old": "VFHCEAD231009D0024",
        "dms_ro_code": "N54511-WO-26-05-29-001",
        "dms_warranty_code": "N54511-WO-26-05-28-008",
        "dms_claim_code": "CHƯA PHÊ DUYỆT",
        "foreman_note": "Lỗi động cơ 27/5; HÒA; trung",
        "advisor_note": "đã in 29/5",
        "warranty_kinds": [
            "motor"
        ],
        "warranty_extra": {
            "motor": {
                "status": "waiting_motor",
                "warranty_code": "N54511-WO-261014-0034"
            }
        },
        "customer_name": "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM",
        "model": "Evo 200",
        "vin": "RPXP1LHHVPE057523",
        "plate": "29Y5-89945",
        "technician_name": "Cao Trần Tấn Phú"
    }
};

const html = fs.readFileSync('PhanTichBaoHanh.html', 'utf-8');
const s1 = html.indexOf('function matchCategoryFromFaults(');
const s2 = html.indexOf('function loadCheckXeOrders(){');
const fnCode = html.substring(s1, s2);

const ISSUE_CATEGORIES = [
  { id: 'all', name: 'Tất cả hạng mục', icon: '📋' },
  { id: 'no_fault', name: 'Không lỗi', icon: '✅', keywords: [] },
  { id: 'esim', name: 'Lỗi Esim', icon: '📶', keywords: ['esim', 'e-sim', 'sim', 'mất sóng', 'mat song', '4g'] },
  { id: 'pin', name: 'Lỗi PIN', icon: '🔋', keywords: ['pin', 'battery', 'bms', 'cell', 'lắp pin', 'tháo pin'] },
  { id: 'motor', name: 'Lỗi động cơ', icon: '⚡', keywords: ['động cơ', 'dong co', 'motor', 'số máy', 'so may'] },
  { id: 'charger', name: 'Lỗi sạc', icon: '🔌', keywords: ['sạc', 'sac', 'charger', 'củ sạc', 'bộ sạc'] },
  { id: 'other', name: 'Lỗi khác', icon: '🛠️', keywords: [] }
];

function hasTextContent(str){ return !!(str && String(str).trim() && String(str).trim() !== '—'); }
function esc(s){ return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function formatDisplayDate(d){ return d; }
function formatIsoDate(d){ return '2026-05-06'; }
function numf(n){ return n; }
function evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat){
  if(hasLoi && hasKtvNote && !hasBangCapNhat) return { code: 'recheck', label: 'Cần check lại' };
  if(hasLoi && !hasKtvNote && !hasBangCapNhat) return { code: 'unchecked', label: 'Chưa check' };
  if(hasLoi && hasBangCapNhat) return { code: 'checked', label: 'Đã check' };
  return { code: 'normal', label: 'Bình thường' };
}

eval(fnCode);

// Test unpack
const rawObj = userJson.work_order ? userJson.work_order : userJson;
const o = normalizeOrder(rawObj, 0);

console.log('=== TEST RESULT FOR USER WORK ORDER ===');
console.log('Biển số (plate):', o.plate);
console.log('Mã phiếu (wo):', o.wo);
console.log('Dòng xe (vehicle):', o.vehicle);
console.log('VIN:', o.vin);
console.log('KTV (tech):', o.tech);
console.log('Hạng mục lỗi (faultList):', o.faultList);
console.log('Category:', o.category.name);
console.log('Ghi chú KTV (note):', o.note);
console.log('Has Bang Cap Nhat:', o.hasBangCapNhat);
console.log('Check Status:', o.checkStatus.label);
console.log('\n--- BẢNG CẬP NHẬT RENDERED ---');
console.log(formatBangCapNhatHtml(o));
