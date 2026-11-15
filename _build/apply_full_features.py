import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("Initial template size:", len(content))

# 1. Add getCustomerGroup and evaluateClaimReturnStatus helper functions before newRecord
helper_funcs = r'''
// ==================== QUẢN TRỊ CHẤT LƯỢNG & NHÓM KHÁCH HÀNG ====================
// Phân loại nhóm khách hàng: GSM (Xanh SM), Bship, Khách lẻ, Doanh nghiệp khác
function getCustomerGroup(name, companyName) {
  const fullStr = norm(String(name || '') + ' ' + String(companyName || ''));
  if (!fullStr || fullStr === '—' || fullStr === 'trong' || fullStr === 'chua phan cong') {
    return { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8' };
  }
  if (fullStr.includes('gsm') || fullStr.includes('xanh sm') || fullStr.includes('di chuyen xanh va thong minh') || fullStr.includes('taxi xanh')) {
    return { id: 'gsm', name: 'GSM (Xanh SM)', tag: 'GSM', badgeClass: 'cust-gsm', color: '#06b6d4' };
  }
  if (fullStr.includes('bship') || fullStr.includes('b-ship') || fullStr.includes('van tai bship') || fullStr.includes('b ship')) {
    return { id: 'bship', name: 'Bship', tag: 'BSHIP', badgeClass: 'cust-bship', color: '#10b981' };
  }
  if (fullStr.includes('ahamove') || fullStr.includes('lalamove') || fullStr.includes('grab') || fullStr.includes('be group') || fullStr.includes('gojek')) {
    return { id: 'fleet', name: 'Đội xe đối tác', tag: 'Đối tác', badgeClass: 'cust-fleet', color: '#f59e0b' };
  }
  if (fullStr.includes('cong ty') || fullStr.includes('cp') || fullStr.includes('tnhh') || fullStr.includes('chi nhanh') || fullStr.includes('corp') || fullStr.includes('doanh nghiep')) {
    return { id: 'corp', name: 'Doanh nghiệp khác', tag: 'Doanh nghiệp', badgeClass: 'cust-corp', color: '#a855f7' };
  }
  return { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8' };
}
window.getCustomerGroup = getCustomerGroup;

// Đánh giá trạng thái trả về (Cấp 1 trả về / Cấp 2 trả về)
function evaluateClaimReturnStatus(c, rawStatus, seq, reason, retL1, retL2) {
  const normSt = norm(String(rawStatus || (c && c.status) || ''));
  const normReason = norm(String(reason || (c && c.reason) || ''));
  const l1Count = Number(retL1 || (c && (c.returnLevel1Count || c['Số lần trả về cấp 1'])) || 0) || 0;
  const l2Count = Number(retL2 || (c && (c.returnLevel2Count || c['Số lần trả về cấp 2'] || c['Số lần từ chối cấp 2'])) || 0) || 0;
  const sequence = Number(seq || (c && (c.approvalSequence || c['Cấp phê duyệt'])) || 0) || 0;

  let isReturnLevel1 = false;
  let isReturnLevel2 = false;

  if (l1Count > 0) isReturnLevel1 = true;
  if (l2Count > 0) isReturnLevel2 = true;

  if (normSt.includes('cap 1 tra ve') || normSt.includes('tra ve cap 1') || normSt.includes('c1 tra ve') || normSt.includes('rejected_level_1') || normSt.includes('rejected_l1')) {
    isReturnLevel1 = true;
  }
  if (normSt.includes('cap 2 tra ve') || normSt.includes('tra ve cap 2') || normSt.includes('c2 tra ve') || normSt.includes('rejected_level_2') || normSt.includes('rejected_l2')) {
    isReturnLevel2 = true;
  }
  if (normSt.includes('tu choi') || normSt.includes('tra ve') || normSt.includes('reject') || normSt.includes('returned') || normSt.includes('cancel')) {
    if (sequence === 1 || normSt.includes('cap 1') || normSt.includes('c1')) {
      isReturnLevel1 = true;
    } else if (sequence >= 2 || normSt.includes('cap 2') || normSt.includes('c2')) {
      isReturnLevel2 = true;
    } else {
      isReturnLevel2 = true;
    }
  }

  if ((!isReturnLevel1 && !isReturnLevel2) && normReason && (normReason.includes('tra ve') || normReason.includes('sai') || normReason.includes('bo sung') || normReason.includes('thieu') || normReason.includes('chua dat'))) {
    if (sequence >= 2) isReturnLevel2 = true;
    else isReturnLevel1 = true;
  }

  const isReturned = isReturnLevel1 || isReturnLevel2;
  const returnLevelLabel = isReturnLevel1 ? 'Cấp 1 trả về' : (isReturnLevel2 ? 'Cấp 2 trả về' : '');
  return { isReturnLevel1, isReturnLevel2, isReturned, returnLevelLabel, l1Count, l2Count };
}
window.evaluateClaimReturnStatus = evaluateClaimReturnStatus;

// Sơ đồ thước đo Benchmark tỷ lệ trả về (Mức cho phép <= 1.0%)
function svgReturnRateGauge(rate, isOk, l1Cnt, l2Cnt, totalCnt) {
  const maxScale = Math.max(3.0, Math.ceil(rate + 1.2));
  const pinX = Math.min(380, Math.max(20, 20 + (rate / maxScale) * 360));
  const benchX = 20 + (1.0 / maxScale) * 360;
  const statusColor = isOk ? '#10b981' : '#ef4444';

  return `
    <div style="background:rgba(15,23,42,0.7);border:1px solid rgba(56,189,248,0.2);border-radius:12px;padding:16px;box-shadow:0 4px 16px rgba(0,0,0,0.25)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:26px;font-weight:800;color:${statusColor}">${rate.toFixed(2)}%</span>
          <span style="font-size:11.5px;padding:3px 10px;border-radius:9999px;font-weight:700;background:${isOk ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)'};color:${isOk ? '#34d399' : '#fca5a5'};border:1px solid ${isOk ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}">
            ${isOk ? '✅ ĐẠT CHUẨN (≤ 1.0%)' : '⚠️ VƯỢT NGƯỠNG CHO PHÉP (> 1.0%)'}
          </span>
        </div>
        <div style="font-size:12px;color:#94a3b8">
          Mức trần VinFast cho phép: <b style="color:#f87171;font-size:13px">≤ 1.0%</b>
        </div>
      </div>

      <!-- Sơ đồ thanh đo Benchmark SVG -->
      <svg viewBox="0 0 400 68" style="width:100%;height:auto;display:block;margin:6px 0">
        <!-- Vùng An toàn 0 -> 1% -->
        <rect x="20" y="20" width="${benchX - 20}" height="14" rx="7" fill="rgba(16,185,129,0.35)" stroke="#10b981" stroke-width="1.5"/>
        <!-- Vùng Vượt ngưỡng 1% -> max -->
        <rect x="${benchX}" y="20" width="${380 - benchX}" height="14" rx="7" fill="rgba(239,68,68,0.22)" stroke="#ef4444" stroke-width="1.5"/>
        
        <!-- Vạch mức trần 1.0% -->
        <line x1="${benchX}" y1="12" x2="${benchX}" y2="44" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3,3"/>
        <text x="${benchX}" y="10" fill="#f87171" font-size="9" font-weight="700" text-anchor="middle">MỨC TRẦN 1.0%</text>

        <!-- Điểm kim chỉ tỷ lệ thực tế -->
        <circle cx="${pinX}" cy="27" r="7" fill="${statusColor}" stroke="#ffffff" stroke-width="2"/>
        <text x="${pinX}" y="58" fill="${statusColor}" font-size="11" font-weight="800" text-anchor="middle">Thực tế: ${rate.toFixed(2)}%</text>
      </svg>

      <!-- Chi tiết Cấp 1 & Cấp 2 trả về -->
      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;margin-top:10px;padding-top:10px;border-top:1px dashed rgba(255,255,255,0.1);text-align:center">
        <div>
          <div style="font-size:11px;color:#94a3b8">Cấp 1 trả về</div>
          <div style="font-size:15px;font-weight:700;color:#fbbf24">${l1Cnt} ĐX</div>
        </div>
        <div>
          <div style="font-size:11px;color:#94a3b8">Cấp 2 trả về</div>
          <div style="font-size:15px;font-weight:700;color:#f87171">${l2Cnt} ĐX</div>
        </div>
        <div>
          <div style="font-size:11px;color:#94a3b8">Tổng ĐX phát sinh</div>
          <div style="font-size:15px;font-weight:700;color:#38bdf8">${totalCnt} ĐX</div>
        </div>
      </div>
    </div>
  `;
}
window.svgReturnRateGauge = svgReturnRateGauge;
'''

if 'function getCustomerGroup' not in content:
    idx_insert = content.find('function newRecord(){')
    content = content[:idx_insert] + helper_funcs + '\n' + content[idx_insert:]
    print("Inserted getCustomerGroup and evaluateClaimReturnStatus helper functions.")

# 2. Update newRecord to include customer and return fields
old_newRecord = r'''function newRecord(){
  return { id: '', status: '', date: null, wo: '', vin: '', vehicle: '', total: 0, totalInc: 0, totalEx: 0, labor: 0, laborInc: 0, laborEx: 0, outsource: 0, parts: [], srcId: null, srcName: '', format: 0 };
}'''

new_newRecord = r'''function newRecord(){
  return { 
    id: '', status: '', rawStatus: '', date: null, wo: '', vin: '', vehicle: '', 
    customerName: '', customerCompanyName: '', customerGroup: null,
    approvalSequence: null, returnLevel1Count: 0, returnLevel2Count: 0,
    isReturnLevel1: false, isReturnLevel2: false, isReturned: false, returnLevelLabel: '', rejectReason: '',
    total: 0, totalInc: 0, totalEx: 0, labor: 0, laborInc: 0, laborEx: 0, outsource: 0, parts: [], srcId: null, srcName: '', format: 0 
  };
}'''

if old_newRecord in content:
    content = content.replace(old_newRecord, new_newRecord, 1)
    print("Updated newRecord definition.")

# 3. Update parseDealerPortalJson to extract customer and return status
old_dp_rec_end = r'''    rec.parts = [{
      code: c.warrantyType || 'STANDARD',
      name: (c.customer && c.customer.customerName) ? c.customer.customerName : 'Bảo hành xe điện',
      qty: 1,
      priceInc: inc,
      priceEx: rec.totalEx,
      amountInc: inc,
      amountEx: rec.totalEx
    }];

    return rec;'''

new_dp_rec_end = r'''    const cust = c.customer || {};
    rec.customerName = String(cust.customerName || c.customerName || '').trim();
    rec.customerCompanyName = String(cust.customerCompanyName || c.customerCompanyName || '').trim();
    rec.customerGroup = getCustomerGroup(rec.customerName, rec.customerCompanyName);

    const retStat = evaluateClaimReturnStatus(
      c,
      c.status,
      c.approvalSequence,
      c.reason,
      c.returnLevel1Count,
      c.returnLevel2Count
    );
    rec.isReturnLevel1 = retStat.isReturnLevel1;
    rec.isReturnLevel2 = retStat.isReturnLevel2;
    rec.isReturned = retStat.isReturned;
    rec.returnLevelLabel = retStat.returnLevelLabel;
    rec.rejectReason = String(c.reason || '').trim();

    rec.parts = [{
      code: c.warrantyType || 'STANDARD',
      name: (c.customer && c.customer.customerName) ? c.customer.customerName : 'Bảo hành xe điện',
      qty: 1,
      priceInc: inc,
      priceEx: rec.totalEx,
      amountInc: inc,
      amountEx: rec.totalEx
    }];

    return rec;'''

if old_dp_rec_end in content:
    content = content.replace(old_dp_rec_end, new_dp_rec_end, 1)
    print("Updated parseDealerPortalJson with customer and return status.")

# 4. Update parseFile1Sheet to extract customer and return status
old_f1_rec = r'''    rec.wo = String(pickCol(map, row, ['lenh sua chua']) ?? '').trim();
    rec.vin = String(pickCol(map, row, ['so khung', 'vin']) ?? '').trim();
    rec.vehicle = String(pickCol(map, row, ['ten xe', 'model xe']) ?? '').trim();'''

new_f1_rec = r'''    rec.wo = String(pickCol(map, row, ['lenh sua chua']) ?? '').trim();
    rec.vin = String(pickCol(map, row, ['so khung', 'vin']) ?? '').trim();
    rec.vehicle = String(pickCol(map, row, ['ten xe', 'model xe']) ?? '').trim();
    rec.customerName = String(pickCol(map, row, ['ten khach hang', 'khach hang']) || '').trim();
    rec.customerCompanyName = String(pickCol(map, row, ['ten cong ty khach hang', 'cong ty']) || '').trim();
    rec.customerGroup = getCustomerGroup(rec.customerName, rec.customerCompanyName);

    const f1RawSt = String(pickCol(map, row, ['trang thai']) ?? '').trim();
    const f1Seq = pickCol(map, row, ['cap phe duyet']);
    const f1Reason = String(pickCol(map, row, ['ly do tra ve / tu choi', 'ly do tu choi', 'ly do tra ve', 'ly do huy']) || '').trim();
    const f1L1 = pickCol(map, row, ['so lan tra ve cap 1', 'tra ve cap 1']);
    const f1L2 = pickCol(map, row, ['so lan tra ve cap 2', 'tra ve cap 2', 'so lan tu choi cap 2']);
    const f1RetStat = evaluateClaimReturnStatus(row, f1RawSt, f1Seq, f1Reason, f1L1, f1L2);
    rec.isReturnLevel1 = f1RetStat.isReturnLevel1;
    rec.isReturnLevel2 = f1RetStat.isReturnLevel2;
    rec.isReturned = f1RetStat.isReturned;
    rec.returnLevelLabel = f1RetStat.returnLevelLabel;
    rec.rejectReason = f1Reason;'''

if old_f1_rec in content:
    content = content.replace(old_f1_rec, new_f1_rec, 1)
    print("Updated parseFile1Sheet with customer and return status.")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Part 1 patch completed successfully.")
