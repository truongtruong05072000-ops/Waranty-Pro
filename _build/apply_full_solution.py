import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update normalizeOrder
old_norm_find = r'''  // Chuẩn hóa ngày nhận xe
  const rawDate = d.dateStr || d.received_at || d.created_at || new Date().toISOString().slice(0, 10);
  const isoDate = formatIsoDate(rawDate) || new Date().toISOString().slice(0, 10);
  const dispDate = formatDisplayDate(isoDate);

  const order = {'''

new_norm_replace = r'''  // Phân loại thanh toán (Phân loại TT)
  const phanLoaiTtRaw = String(
    d.phanLoaiTt || d.phan_loai_tt || d.paymentType || d.payment_type || d.billing_type || d.order_type || d.loai_sua_chua || ''
  ).trim();

  const isWarrantyPayment = Boolean(
    norm(phanLoaiTtRaw).includes('bao hanh') || 
    norm(phanLoaiTtRaw) === 'bh' || 
    norm(phanLoaiTtRaw).includes('warranty') || 
    hasBangCapNhat || 
    Boolean(bhCode && bhCode !== '—') ||
    Boolean(warrantyStatus && warrantyStatus !== '—')
  );
  const phanLoaiTt = phanLoaiTtRaw || (isWarrantyPayment ? 'Bảo hành' : 'Khách trả');
  const isUnsubmittedWarranty = isWarrantyPayment && (!claimCode || claimCode === '—' || !claimCode.startsWith('WC-'));

  // Nhóm khách hàng (GSM, Bship, Khách lẻ, Doanh nghiệp khác)
  const matchedCustName = (matchedClaim && matchedClaim.customer && matchedClaim.customer.customerName) || '';
  const matchedCompName = (matchedClaim && matchedClaim.customer && matchedClaim.customer.customerCompanyName) || '';
  const custGroup = getCustomerGroup(customer || matchedCustName, d.customerCompanyName || matchedCompName);

  // Chuẩn hóa ngày nhận xe
  const rawDate = d.dateStr || d.received_at || d.created_at || new Date().toISOString().slice(0, 10);
  const isoDate = formatIsoDate(rawDate) || new Date().toISOString().slice(0, 10);
  const dispDate = formatDisplayDate(isoDate);

  const order = {
    customerCompanyName: d.customerCompanyName || matchedCompName,
    customerGroup: custGroup,
    phanLoaiTt: phanLoaiTt,
    isWarrantyPayment: isWarrantyPayment,
    isUnsubmittedWarranty: isUnsubmittedWarranty,'''

if old_norm_find in content:
    content = content.replace(old_norm_find, new_norm_replace, 1)
    print("Updated normalizeOrder with phanLoaiTt and customerGroup.")
else:
    print("Warning: old_norm_find not found in content!")

# 2. Add customer breakdown renderer helper function
cust_breakdown_func = r'''
// Render cơ cấu nhóm khách hàng (GSM, Bship, Khách lẻ)
function renderCustomerBreakdownHtml(cb) {
  if (!cb || !cb.groups) return '';
  const totalRev = cb.totalRev || 1;
  const groups = cb.groups;

  return `
    <div>
      <!-- Thanh tỷ trọng phân bổ Stacked Bar -->
      <div style="height:14px;border-radius:7px;background:rgba(15,23,42,0.8);overflow:hidden;display:flex;margin-bottom:14px;border:1px solid rgba(255,255,255,0.1)">
        ${groups.map(g => `
          <div style="width:${g.pct}%;background:${g.color};height:100%" title="${g.name}: ${fmtT(g.rev)} tr (${g.pct}%)"></div>
        `).join('')}
      </div>

      <!-- 4 Thẻ nhóm khách hàng -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:10px">
        ${groups.map(g => `
          <div style="background:rgba(15,23,42,0.6);border:1px solid ${g.color}40;border-radius:10px;padding:10px 12px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:11.5px;font-weight:700;color:${g.color}">${g.tag}</span>
              <span style="font-size:11px;font-weight:700;color:#94a3b8">${g.pct}%</span>
            </div>
            <div style="font-size:15px;font-weight:800;color:#f8fafc;margin-bottom:2px">
              ${fmtT(g.rev)} <span style="font-size:11px;color:#94a3b8">tr</span>
            </div>
            <div style="font-size:11px;color:#94a3b8;display:flex;justify-content:space-between">
              <span>${g.cnt} ĐX</span>
              <span>${g.cars} xe xưởng</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
window.renderCustomerBreakdownHtml = renderCustomerBreakdownHtml;

window.showUnsubmittedWarrantyOrders = function(){
  if (typeof window.switchTab === 'function') window.switchTab('checkxe');
  if (state.checkXe) {
    state.checkXe.filterUnsubmitted = 'yes';
    if (typeof renderCheckXe === 'function') renderCheckXe();
  }
};

window.viewReturnedClaims = function(){
  if (typeof window.switchTab === 'function') window.switchTab('claims');
  if (state.filters) {
    state.filters.returnStatus = 'all_returned';
    if (typeof renderAll === 'function') renderAll();
  }
};
'''

if 'function renderCustomerBreakdownHtml' not in content:
    idx_gauge = content.find('function svgReturnRateGauge')
    content = content[:idx_gauge] + cust_breakdown_func + '\n' + content[idx_gauge:]
    print("Added renderCustomerBreakdownHtml and quick navigation functions.")

# 3. Update computeAll to calculate returnMetrics, customerBreakdown, unsubmittedWarrantyOrders
old_compute_before_ret = r'''    verdict, vClass, vIcon, verdictDetail, bestRev3: rev3.length ? Math.max(...rev3) : 0,
    unknownStatus: [...unknownStatus.entries()], noDate
  };
  return state.computed;'''

new_compute_additions = r'''    // THỐNG KÊ TỶ LỆ TRẢ VỀ (CẤP 1 & CẤP 2 TRẢ VỀ)
  const monthRecs = recs.filter(r => r.cm === tYm || (!tYm && r.cm));
  const targetRecs = monthRecs.length > 0 ? monthRecs : recs;
  const totalClaimsCount = targetRecs.length;
  const returnL1List = targetRecs.filter(r => r.isReturnLevel1);
  const returnL2List = targetRecs.filter(r => r.isReturnLevel2);
  const totalReturnedList = targetRecs.filter(r => r.isReturned);
  const returnRate = totalClaimsCount > 0 ? (totalReturnedList.length / totalClaimsCount * 100) : 0;
  const isReturnRateOk = returnRate <= 1.0;
  const returnMetrics = {
    totalClaimsCount,
    returnL1Count: returnL1List.length,
    returnL2Count: returnL2List.length,
    totalReturnedCount: totalReturnedList.length,
    returnRate,
    isReturnRateOk,
    returnL1List,
    returnL2List,
    totalReturnedList
  };

  // THỐNG KÊ PHÂN LOẠI NHÓM KHÁCH HÀNG (GSM, BSHIP, KHÁCH LẺ, DOANH NGHIỆP)
  const custMap = {
    gsm: { id: 'gsm', name: 'GSM (Xanh SM)', tag: 'GSM', badgeClass: 'cust-gsm', color: '#06b6d4', rev: 0, cnt: 0, cars: 0, pct: 0 },
    bship: { id: 'bship', name: 'Bship', tag: 'BSHIP', badgeClass: 'cust-bship', color: '#10b981', rev: 0, cnt: 0, cars: 0, pct: 0 },
    retail: { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8', rev: 0, cnt: 0, cars: 0, pct: 0 },
    corp: { id: 'corp', name: 'Doanh nghiệp khác', tag: 'Doanh nghiệp', badgeClass: 'cust-corp', color: '#a855f7', rev: 0, cnt: 0, cars: 0, pct: 0 }
  };
  for(const r of targetRecs){
    const gid = (r.customerGroup && r.customerGroup.id) || 'retail';
    if(custMap[gid]){
      custMap[gid].rev += r.total;
      custMap[gid].cnt++;
    }
  }
  const allCheckOrders = (state.checkXe && state.checkXe.orders) || [];
  allCheckOrders.forEach(o => {
    const gid = (o.customerGroup && o.customerGroup.id) || 'retail';
    if(custMap[gid]) custMap[gid].cars++;
  });
  const totalCustRev = Object.values(custMap).reduce((s, g) => s + g.rev, 0) || 1;
  Object.values(custMap).forEach(g => {
    g.pct = Math.round((g.rev / totalCustRev) * 100);
  });
  const customerBreakdown = {
    groups: Object.values(custMap),
    totalRev: totalCustRev,
    totalClaims: totalClaimsCount,
    totalCars: allCheckOrders.length
  };

  // CẢNH BÁO LỆNH SỬA CHỮA BẢO HÀNH CHƯA LÀM ĐỀ XUẤT
  const unsubmittedWarrantyOrders = allCheckOrders.filter(o => o.isUnsubmittedWarranty);

  verdict, vClass, vIcon, verdictDetail, bestRev3: rev3.length ? Math.max(...rev3) : 0,
    returnMetrics, customerBreakdown, unsubmittedWarrantyOrders,
    unknownStatus: [...unknownStatus.entries()], noDate
  };
  return state.computed;'''

if old_compute_before_ret in content:
    content = content.replace(old_compute_before_ret, new_compute_additions, 1)
    print("Updated computeAll with returnMetrics, customerBreakdown, unsubmittedWarrantyOrders.")
else:
    print("Warning: old_compute_before_ret not found in content!")

# 4. Update renderAll Overview pane
old_overview_render = r'''  $('#overviewContent').innerHTML = `
    ${heroKpiHtml}
    ${verdictBannerHtml}
    
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(480px, 1fr));gap:20px;align-items:start">'''

new_overview_render = r'''  const unsubmittedAlertHtml = (C.unsubmittedWarrantyOrders && C.unsubmittedWarrantyOrders.length > 0) ? `
    <div style="background:linear-gradient(135deg, rgba(239,68,68,0.18), rgba(15,23,42,0.9));border:1.5px solid #ef4444;border-radius:12px;padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:16px;box-shadow:0 0 20px rgba(239,68,68,0.25);flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:26px">🚨</div>
        <div>
          <div style="font-size:14.5px;font-weight:800;color:#fca5a5;margin-bottom:3px">
            CẢNH BÁO: Phát hiện ${C.unsubmittedWarrantyOrders.length} Lệnh sửa chữa Bảo hành CHƯA LÀM ĐỀ XUẤT!
          </div>
          <div style="font-size:12px;color:#cbd5e1;line-height:1.4">
            Các xe này có <b>Phân loại TT là Bảo hành</b> hoặc đã thay linh kiện bảo hành nhưng <b>chưa nộp đề xuất (chưa có mã WC)</b> trên Dealer Portal.
          </div>
        </div>
      </div>
      <button class="btn primary" style="background:#dc2626;border-color:#ef4444;color:#fff;font-weight:700;padding:7px 15px;font-size:12px;box-shadow:0 0 12px rgba(239,68,68,0.4)" onclick="showUnsubmittedWarrantyOrders()">
        🔍 Xem ngay ${C.unsubmittedWarrantyOrders.length} xe cần tạo ĐX
      </button>
    </div>` : '';

  const qualityAndCustomerCardsHtml = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(460px, 1fr));gap:18px;margin-bottom:18px">
      <!-- Card Sơ đồ Thước đo Tỷ lệ trả về (Chuẩn <= 1%) -->
      <div class="card" style="margin-bottom:0">
        <div class="card-header">
          <div>
            <div class="card-title">🛡️ Tỷ lệ trả về đề xuất bảo hành (Cấp 1 & Cấp 2)</div>
            <div class="card-subtitle">Quy chuẩn VinFast: Mức trần cho phép <b>≤ 1.0%</b> · Kiểm soát chất lượng hồ sơ</div>
          </div>
          <button class="btn secondary" style="font-size:11.5px;padding:4px 9px" onclick="viewReturnedClaims()">
            📋 Xem ĐX bị trả về
          </button>
        </div>
        <div style="padding:14px 18px">
          ${svgReturnRateGauge(C.returnMetrics.returnRate, C.returnMetrics.isReturnRateOk, C.returnMetrics.returnL1Count, C.returnMetrics.returnL2Count, C.returnMetrics.totalClaimsCount)}
        </div>
      </div>

      <!-- Card Cơ cấu Nhóm Khách Hàng (GSM, Bship, Khách lẻ) -->
      <div class="card" style="margin-bottom:0">
        <div class="card-header">
          <div>
            <div class="card-title">👥 Cơ cấu doanh thu theo Nhóm Khách Hàng</div>
            <div class="card-subtitle">Phân bổ: <b>GSM (Xanh SM)</b> · <b>Bship</b> · <b>Khách lẻ</b> · Doanh nghiệp khác</div>
          </div>
        </div>
        <div style="padding:14px 18px">
          ${renderCustomerBreakdownHtml(C.customerBreakdown)}
        </div>
      </div>
    </div>`;

  $('#overviewContent').innerHTML = `
    ${heroKpiHtml}
    ${verdictBannerHtml}
    ${unsubmittedAlertHtml}
    ${qualityAndCustomerCardsHtml}
    
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(480px, 1fr));gap:20px;align-items:start">'''

if old_overview_render in content:
    content = content.replace(old_overview_render, new_overview_render, 1)
    print("Updated renderAll Overview pane with Quality Gauge and Customer Groups cards.")

# 5. Update Claims Pane with Customer Group & Return Status filters
old_claims_filter = r'''  let propRows = C.recs.filter(r => r.cm || r.kind !== 'confirmed');
  if(f.cm) propRows = propRows.filter(r => r.cm === f.cm);
  if(f.kind) propRows = propRows.filter(r => r.kind === f.kind);
  if(f.q){
    const q = f.q.toLowerCase();
    propRows = propRows.filter(r => (r.id + ' ' + r.vin + ' ' + r.wo + ' ' + r.parts.map(p => p.code + ' ' + p.name).join(' ')).toLowerCase().includes(q));
  }'''

new_claims_filter = r'''  let propRows = C.recs.filter(r => r.cm || r.kind !== 'confirmed');
  if(f.cm) propRows = propRows.filter(r => r.cm === f.cm);
  if(f.kind) propRows = propRows.filter(r => r.kind === f.kind);
  if(f.custGroup) {
    propRows = propRows.filter(r => (r.customerGroup && r.customerGroup.id === f.custGroup));
  }
  if(f.returnStatus) {
    if(f.returnStatus === 'all_returned') propRows = propRows.filter(r => r.isReturned);
    else if(f.returnStatus === 'level_1') propRows = propRows.filter(r => r.isReturnLevel1);
    else if(f.returnStatus === 'level_2') propRows = propRows.filter(r => r.isReturnLevel2);
  }
  if(f.q){
    const q = f.q.toLowerCase();
    propRows = propRows.filter(r => (r.id + ' ' + r.vin + ' ' + r.wo + ' ' + (r.customerName || '') + ' ' + (r.customerCompanyName || '') + ' ' + r.parts.map(p => p.code + ' ' + p.name).join(' ')).toLowerCase().includes(q));
  }'''

if old_claims_filter in content:
    content = content.replace(old_claims_filter, new_claims_filter, 1)
    print("Updated Claims pane filter logic.")

# In Claims Toolbar, add the dropdowns
old_claims_toolbar = r'''          <select class="select-input" id="fKind" onchange="setFilter('kind',this.value)">
            <option value="">— Mọi trạng thái —</option>'''

new_claims_toolbar = r'''          <select class="select-input" id="fCustGroup" onchange="setFilter('custGroup',this.value)">
            <option value="">— Mọi nhóm khách —</option>
            <option value="gsm" ${f.custGroup === 'gsm' ? 'selected' : ''}>🚕 GSM (Xanh SM)</option>
            <option value="bship" ${f.custGroup === 'bship' ? 'selected' : ''}>🛵 Bship</option>
            <option value="retail" ${f.custGroup === 'retail' ? 'selected' : ''}>👤 Khách lẻ</option>
            <option value="corp" ${f.custGroup === 'corp' ? 'selected' : ''}>🏢 Doanh nghiệp</option>
          </select>
          <select class="select-input" id="fReturnStatus" onchange="setFilter('returnStatus',this.value)">
            <option value="">— Trạng thái trả về —</option>
            <option value="all_returned" ${f.returnStatus === 'all_returned' ? 'selected' : ''}>❌ Tất cả ĐX bị trả về</option>
            <option value="level_1" ${f.returnStatus === 'level_1' ? 'selected' : ''}>⚠️ Cấp 1 trả về</option>
            <option value="level_2" ${f.returnStatus === 'level_2' ? 'selected' : ''}>🚫 Cấp 2 trả về</option>
          </select>
          <select class="select-input" id="fKind" onchange="setFilter('kind',this.value)">
            <option value="">— Mọi trạng thái —</option>'''

if old_claims_toolbar in content:
    content = content.replace(old_claims_toolbar, new_claims_toolbar, 1)
    print("Updated Claims toolbar with Customer and Return dropdowns.")

# Update claim row rendering to show customer badge and return tag
old_prop_row = r'''      <tr>
        <td class="l"><b>${esc(r.id)}</b></td>
        <td class="l" style="font-size:11.5px;color:var(--text-muted)">${esc(r.srcName)}</td>
        <td class="l">${esc(r.wo) || '—'}</td>'''

new_prop_row = r'''      <tr>
        <td class="l">
          <b>${esc(r.id)}</b>
          ${r.customerGroup ? `<span style="font-size:10px;padding:1px 6px;border-radius:4px;font-weight:700;margin-left:4px;background:${r.customerGroup.color}22;color:${r.customerGroup.color};border:1px solid ${r.customerGroup.color}50">${r.customerGroup.tag}</span>` : ''}
          ${r.isReturned ? `<span style="font-size:10px;padding:1px 6px;border-radius:4px;font-weight:700;margin-left:4px;background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.4)" title="${esc(r.rejectReason || 'Bị trả về')}">${esc(r.returnLevelLabel || 'Bị trả về')}</span>` : ''}
        </td>
        <td class="l" style="font-size:11.5px;color:var(--text-muted)">${esc(r.srcName)}</td>
        <td class="l">${esc(r.wo) || '—'}</td>'''

if old_prop_row in content:
    content = content.replace(old_prop_row, new_prop_row, 1)
    print("Updated Claims table row with Customer and Return badges.")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Part 2 patch completed successfully.")
