# -*- coding: utf-8 -*-
import io, re

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Cập nhật hàm isSettledOrHigher bao quát toàn bộ trạng thái quyết toán / nghiệm thu / hoàn thành
old_settled = '''// Kiểm tra lệnh sửa chữa đang ở mức quyết toán trở lên
function isSettledOrHigher(st, raw) {
  if (raw && (raw.settlement_date || raw.settled_at || raw.completed_at || raw.ngay_quyet_toan || raw.ngay_hoan_thanh || raw.completedDate)) {
    return true;
  }
  if (!st) return false;
  const s = norm(String(st));
  return s.includes('quyet toan') || 
         s.includes('hoan thanh') || 
         s.includes('giao xe') ||
         s.includes('thanh toan') || 
         s.includes('settled') || 
         s.includes('settlement') || 
         s.includes('completed') || 
         s.includes('closed') || 
         s.includes('paid') ||
         s.includes('waiting_payment');
}'''

new_settled = '''// Kiểm tra lệnh sửa chữa đang ở mức quyết toán trở lên
function isSettledOrHigher(st, raw) {
  if (raw && typeof raw === 'object') {
    if (raw.completed_at || raw.settlement_date || raw.settled_at || raw.repair_done_at || raw.delivered_at || raw.ngay_quyet_toan || raw.ngay_hoan_thanh || raw.completedDate) {
      return true;
    }
  }
  if (!st) return false;
  const s = norm(String(st));
  return s.includes('quyet toan') || 
         s.includes('hoan thanh') || 
         s.includes('giao xe') || 
         s.includes('thanh toan') || 
         s.includes('nghiem thu') || 
         s.includes('waiting_approval') || 
         s.includes('settled') || 
         s.includes('settlement') || 
         s.includes('completed') || 
         s.includes('closed') || 
         s.includes('paid') || 
         s.includes('waiting_payment') || 
         s.includes('delivered') ||
         s.includes('repair_done');
}'''

if old_settled in content:
    content = content.replace(old_settled, new_settled)

# 2. Cập nhật evaluateClaimReturnStatus:
# "Lệnh ĐXBH trả về nhưng hiện tại đang ở trạng thái hủy thì không tính vào tỷ lệ trả về"
old_eval_ret = '''function evaluateClaimReturnStatus(c, rawStatus, seq, reason, retL1, retL2) {
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
}'''

new_eval_ret = '''function evaluateClaimReturnStatus(c, rawStatus, seq, reason, retL1, retL2) {
  const normSt = norm(String(rawStatus || (c && c.status) || ''));
  const rawStUpper = String(rawStatus || (c && c.status) || '').toUpperCase();

  // QUY TẮC NGHIỆP VỤ QUAN TRỌNG:
  // Lệnh ĐXBH trả về nhưng hiện tại đang ở trạng thái hủy thì KHÔNG tính vào tỷ lệ trả về!
  const isCancelled = normSt.includes('cancel') || 
                      normSt.includes('da huy') || 
                      normSt === 'huy' || 
                      rawStUpper === 'CANCELLED' ||
                      rawStUpper.includes('CANCEL');

  if (isCancelled) {
    return {
      isReturnLevel1: false,
      isReturnLevel2: false,
      isReturned: false,
      returnLevelLabel: 'Đã hủy',
      isCancelled: true,
      l1Count: 0,
      l2Count: 0
    };
  }

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
  if (normSt.includes('tu choi') || normSt.includes('tra ve') || normSt.includes('reject') || normSt.includes('returned')) {
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
  return { isReturnLevel1, isReturnLevel2, isReturned, returnLevelLabel, l1Count, l2Count, isCancelled: false };
}'''

if old_eval_ret in content:
    content = content.replace(old_eval_ret, new_eval_ret)
else:
    print('Warning: old_eval_ret exact match not found, checking alternatives...')

# 3. Cập nhật computeAll(): r.isCancelled bảo đảm không bao giờ lọt vào returnMetrics
old_return_calc = '''  // THỐNG KÊ TỶ LỆ TRẢ VỀ (CẤP 1 & CẤP 2 TRẢ VỀ)
  const monthRecs = recs.filter(r => r.cm === tYm || (!tYm && r.cm));
  const targetRecs = monthRecs.length > 0 ? monthRecs : recs;
  const totalClaimsCount = targetRecs.length;
  const returnL1List = targetRecs.filter(r => r.isReturnLevel1);
  const returnL2List = targetRecs.filter(r => r.isReturnLevel2);
  const totalReturnedList = targetRecs.filter(r => r.isReturned);
  const returnRate = totalClaimsCount > 0 ? (totalReturnedList.length / totalClaimsCount * 100) : 0;
  const isReturnRateOk = returnRate <= 1.0;'''

new_return_calc = '''  // THỐNG KÊ TỶ LỆ TRẢ VỀ (CẤP 1 & CẤP 2 TRẢ VỀ)
  // Lệnh ĐXBH trả về nhưng hiện tại đang ở trạng thái hủy thì KHÔNG tính vào tỷ lệ trả về
  const monthRecs = recs.filter(r => r.cm === tYm || (!tYm && r.cm));
  const targetRecs = monthRecs.length > 0 ? monthRecs : recs;
  const totalClaimsCount = targetRecs.length;
  const returnL1List = targetRecs.filter(r => r.isReturnLevel1 && !r.isCancelled);
  const returnL2List = targetRecs.filter(r => r.isReturnLevel2 && !r.isCancelled);
  const totalReturnedList = targetRecs.filter(r => r.isReturned && !r.isCancelled);
  const returnRate = totalClaimsCount > 0 ? (totalReturnedList.length / totalClaimsCount * 100) : 0;
  const isReturnRateOk = returnRate <= 1.0;'''

if old_return_calc in content:
    content = content.replace(old_return_calc, new_return_calc)

# 4. Hiển thị BẢNG DANH SÁCH LỆNH CHƯA LÀM ĐXBH TRỰC TIẾP TRÊN TAB OVERVIEW
old_overview_render = '''  $('#overviewContent').innerHTML = `
    ${heroKpiHtml}
    ${verdictBannerHtml}
    ${unsubmittedAlertHtml}
    ${qualityAndCustomerCardsHtml}'''

new_overview_render = '''  // Render trực tiếp Bảng Danh sách Lệnh sửa chữa Bảo hành chưa làm ĐXBH
  const unsubmittedList = C.unsubmittedWarrantyOrders || [];
  const gsmUnsub = unsubmittedList.filter(o => o.customerGroup?.id === 'gsm').length;
  const bshipUnsub = unsubmittedList.filter(o => o.customerGroup?.id === 'bship').length;
  const retailUnsub = unsubmittedList.filter(o => o.customerGroup?.id === 'retail').length;

  const unsubmittedRowsHtml = unsubmittedList.length ? unsubmittedList.map((o, idx) => {
    const custTag = o.customerGroup 
      ? `<span style="font-size:10px;padding:1px 6px;border-radius:4px;font-weight:700;margin-left:4px;background:${o.customerGroup.color}22;color:${o.customerGroup.color};border:1px solid ${o.customerGroup.color}50">${o.customerGroup.tag}</span>` 
      : '';
    return `
      <tr>
        <td style="text-align:center;color:#94a3b8;font-size:12px">${idx + 1}</td>
        <td>
          <div style="font-weight:800;color:#f8fafc;font-family:monospace;font-size:13px;display:flex;align-items:center;gap:6px">
            <span>${esc(o.wo)}</span>
            <button class="btn secondary" style="padding:1px 5px;font-size:10px" title="Sao chép mã LSC" onclick="copyTextToClipboard('${o.wo}', this)">📋</button>
          </div>
        </td>
        <td style="font-weight:700;color:#38bdf8;font-size:12.5px">${esc(o.plate) || '—'}</td>
        <td style="font-family:monospace;font-size:11.5px;color:#94a3b8">${esc(o.vin) || '—'}</td>
        <td style="font-size:12px;color:#cbd5e1">${esc(o.vehicle) || '—'}</td>
        <td>
          <div style="font-size:12px;font-weight:600;color:#f1f5f9">
            ${esc(o.customer || '—')} ${custTag}
          </div>
        </td>
        <td style="text-align:center">
          <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(239,68,68,0.18);color:#fca5a5;border:1px solid rgba(239,68,68,0.4)">Bảo hành</span>
        </td>
        <td style="text-align:center">
          <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(16,185,129,0.18);color:#34d399;border:1px solid rgba(16,185,129,0.4)">${esc(o.status || 'Đã quyết toán')}</span>
        </td>
        <td style="font-size:11.5px;color:#94a3b8;max-width:220px;white-space:normal">
          ${esc(o.faultStr || o.issue || o.note || 'Lỗi linh kiện bảo hành')}
        </td>
      </tr>
    `;
  }).join('') : `<tr><td colspan="9" style="text-align:center;padding:20px;color:#34d399;font-weight:600">✅ Tuyệt vời: Toàn bộ lệnh sửa chữa bảo hành đã quyết toán đều đã được tạo Đề xuất (WC-...) thành công!</td></tr>`;

  const unsubmittedWarrantyCardHtml = `
    <div class="card" style="margin-bottom:18px;border:1.5px solid ${unsubmittedList.length ? '#ef4444' : 'rgba(16,185,129,0.3)'};box-shadow:0 4px 18px rgba(0,0,0,0.3)">
      <div class="card-header" style="flex-wrap:wrap;gap:12px">
        <div>
          <div class="card-title" style="display:flex;align-items:center;gap:8px">
            <span style="font-size:18px">🚨</span>
            <span style="color:${unsubmittedList.length ? '#fca5a5' : '#34d399'}">Danh sách Lệnh sửa chữa Bảo hành đã Quyết toán CHƯA LÀM ĐỀ XUẤT</span>
            <span class="tag" style="background:${unsubmittedList.length ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'};color:${unsubmittedList.length ? '#fca5a5' : '#34d399'};border:1px solid ${unsubmittedList.length ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'};font-size:11.5px;padding:2px 8px">
              ${unsubmittedList.length} lệnh
            </span>
          </div>
          <div class="card-subtitle">
            Quy chuẩn: Lệnh có <b>Phân loại TT là Bảo hành</b> và trạng thái <b>từ Quyết toán trở lên</b> nhưng <b>chưa có mã ĐX (WC-...)</b> trên Dealer Portal
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${unsubmittedList.length ? `
            <button class="btn secondary" style="font-size:11.5px;padding:5px 10px;background:#b91c1c;border-color:#ef4444;color:#fff" onclick="copyAllUnsubmittedWo(this)">
              📋 Copy tất cả mã WO
            </button>
            <button class="btn secondary" style="font-size:11.5px;padding:5px 10px;background:#0369a1;border-color:#38bdf8;color:#fff" onclick="exportUnsubmittedWarrantyExcel()">
              📥 Xuất Excel (${unsubmittedList.length} lệnh)
            </button>
          ` : ''}
          <a href="https://dealer-portal.vinfast.com/dealer/aftersales/escooter/warranty-claim#wcDatePreset=ALL&wcLimit=20&wcPage=1&wcPendingPayment=ALL" target="_blank" class="btn" style="font-size:11.5px;padding:5px 10px;text-decoration:none;display:inline-flex;align-items:center;gap:4px">
            🌐 Dealer Portal ĐXBH
          </a>
        </div>
      </div>
      <div style="padding:14px 18px">
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          <span class="tag" style="background:rgba(239,68,68,0.15);color:#fca5a5;font-size:12px;padding:3px 10px">Tổng số: <b>${unsubmittedList.length} lệnh</b></span>
          <span class="tag" style="background:rgba(6,182,212,0.12);color:#22d3ee;font-size:12px;padding:3px 10px">GSM: <b>${gsmUnsub} lệnh</b></span>
          <span class="tag" style="background:rgba(16,185,129,0.12);color:#34d399;font-size:12px;padding:3px 10px">BSHIP: <b>${bshipUnsub} lệnh</b></span>
          <span class="tag" style="background:rgba(56,189,248,0.12);color:#38bdf8;font-size:12px;padding:3px 10px">Khách lẻ: <b>${retailUnsub} lệnh</b></span>
        </div>
        <div class="table-container scrollable" style="max-height:360px;overflow-y:auto;border:1px solid rgba(255,255,255,0.08);border-radius:8px">
          <table>
            <thead style="position:sticky;top:0;background:#1e293b;z-index:2">
              <tr>
                <th style="width:40px;text-align:center">STT</th>
                <th>MÃ LSC (WO)</th>
                <th>BIỂN SỐ XE</th>
                <th>SỐ KHUNG (VIN)</th>
                <th>DÒNG XE</th>
                <th>KHÁCH HÀNG</th>
                <th style="text-align:center">PHÂN LOẠI TT</th>
                <th style="text-align:center">TRẠNG THÁI LSC</th>
                <th>HẠNG MỤC LỖI / BẢO HÀNH</th>
              </tr>
            </thead>
            <tbody>
              ${unsubmittedRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  $('#overviewContent').innerHTML = `
    ${heroKpiHtml}
    ${verdictBannerHtml}
    ${unsubmittedAlertHtml}
    ${qualityAndCustomerCardsHtml}
    ${unsubmittedWarrantyCardHtml}'''

if old_overview_render in content:
    content = content.replace(old_overview_render, new_overview_render)

with io.open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated app_template2.html successfully with cancelled claims exclusion and direct unsubmitted warranty table!')
