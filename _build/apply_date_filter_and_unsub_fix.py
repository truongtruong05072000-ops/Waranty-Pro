import sys, re

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update isUnsubmittedWarranty and normalizeOrder in app_template2.html
# Search for normalizeOrder payment classification
old_logic = '''  const isSettled = isSettledOrHigher(status, d);
  // Lệnh chưa làm ĐXBH: Phân loại TT là bảo hành VÀ lệnh ở mức quyết toán trở lên VÀ chưa có mã ĐX (WC-...)
  const isUnsubmittedWarranty = isWarrantyPayment && isSettled && (!claimCode || claimCode === '—' || !claimCode.startsWith('WC-'));'''

new_logic = '''  // ĐIỀU KIỆN CHÍNH XÁC: Xe PHẢI có lỗi hoặc linh kiện tháo thay bảo hành thực tế
  // Tuyệt đối KHÔNG tính các xe "Không lỗi" (chỉ trả cọc, thanh lý, kiểm tra định kỳ)
  const hasActualWarrantyWork = Boolean(
    (hasLoi && faultList.length > 0) || 
    hasBangCapNhat || 
    Boolean(bhCode && bhCode !== '—') ||
    kindsRaw.length > 0
  );

  // Nếu xe "Không lỗi" và không có linh kiện bảo hành -> 100% không phát sinh đề xuất BH
  if (!hasActualWarrantyWork) {
    isWarrantyPayment = false;
    phanLoaiTt = 'Không phát sinh BH';
  }

  const isSettled = isSettledOrHigher(status, d);
  // Lệnh chưa làm ĐXBH: Phải có lỗi/hạng mục BH VÀ Phân loại TT là bảo hành VÀ từ Quyết toán trở lên VÀ chưa có mã ĐX (WC-...)
  const isUnsubmittedWarranty = isWarrantyPayment && hasActualWarrantyWork && isSettled && (!claimCode || claimCode === '—' || !claimCode.startsWith('WC-'));'''

if old_logic in content:
    content = content.replace(old_logic, new_logic)
    print("1. Updated isUnsubmittedWarranty to strictly require hasActualWarrantyWork and exclude 'Không lỗi'")
else:
    print("Error: Could not find old_logic for isUnsubmittedWarranty")

# 2. Update computeAll for Customer Breakdown Date Filter
old_cust_block = '''  // THỐNG KÊ PHÂN LOẠI NHÓM KHÁCH HÀNG (GSM, BSHIP, KHÁCH LẺ, DOANH NGHIỆP)
  // LẤY 100% TỪ DEALER PORTAL (https://dealer-portal.vinfast.com/)
  const custMap = {
    gsm: { id: 'gsm', name: 'GSM (Xanh SM)', tag: 'GSM', badgeClass: 'cust-gsm', color: '#06b6d4', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] },
    bship: { id: 'bship', name: 'Bship', tag: 'BSHIP', badgeClass: 'cust-bship', color: '#10b981', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] },
    retail: { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] },
    corp: { id: 'corp', name: 'Doanh nghiệp khác', tag: 'Doanh nghiệp', badgeClass: 'cust-corp', color: '#a855f7', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] }
  };
  for(const r of targetRecs){
    const gid = (r.customerGroup && r.customerGroup.id) || 'retail';
    if(custMap[gid]){
      custMap[gid].rev += r.total;
      custMap[gid].cnt++;
      custMap[gid].claims.push(r);
      const isApproved = (r.status === 'Đã phê duyệt' || r.status === 'APPROVED' || norm(r.status).includes('da phe duyet'));
      if(isApproved){
        custMap[gid].approvedRev += r.total;
        custMap[gid].approvedCnt++;
      } else if(r.isReturned || r.status === 'Từ chối / Hủy' || r.status === 'CANCELLED' || r.status === 'REJECTED') {
        custMap[gid].rejectedCnt++;
      } else {
        custMap[gid].pendingRev += r.total;
        custMap[gid].pendingCnt++;
      }
    }
  }
  const totalCustRev = Object.values(custMap).reduce((s, g) => s + g.rev, 0) || 1;
  Object.values(custMap).forEach(g => {
    g.pct = Math.round((g.rev / totalCustRev) * 100);
  });
  const customerBreakdown = {
    groups: Object.values(custMap),
    totalRev: totalCustRev,
    totalClaims: totalClaimsCount
  };'''

new_cust_block = '''  // THỐNG KÊ PHÂN LOẠI NHÓM KHÁCH HÀNG (GSM, BSHIP, KHÁCH LẺ, DOANH NGHIỆP)
  // LẤY 100% TỪ DEALER PORTAL (https://dealer-portal.vinfast.com/) + BỘ LỌC TỪ NGÀY ĐẾN NGÀY
  const custFilter = (state.customerDateFilter) || { from: '', to: '', preset: 'all' };
  state.customerDateFilter = custFilter;

  // Thu thập toàn bộ bản ghi Dealer Portal (Format 2)
  const allDealerRecs = recs.filter(r => r.format === 2 || (r.srcName && r.srcName.includes('Dealer Portal')));
  const baseCustRecs = allDealerRecs.length > 0 ? allDealerRecs : targetRecs;

  // Lọc theo khoảng ngày người dùng chọn
  const filteredCustRecs = baseCustRecs.filter(r => {
    let dStr = r.dateStr || '';
    if (!dStr && r.date) {
      if (r.date instanceof Date) dStr = r.date.toISOString().slice(0, 10);
      else if (typeof r.date === 'string') dStr = r.date.slice(0, 10);
    }
    if (custFilter.from && dStr && dStr < custFilter.from) return false;
    if (custFilter.to && dStr && dStr > custFilter.to) return false;
    return true;
  });

  const custMap = {
    gsm: { id: 'gsm', name: 'GSM (Xanh SM)', tag: 'GSM', badgeClass: 'cust-gsm', color: '#06b6d4', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] },
    bship: { id: 'bship', name: 'Bship', tag: 'BSHIP', badgeClass: 'cust-bship', color: '#10b981', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] },
    retail: { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] },
    corp: { id: 'corp', name: 'Doanh nghiệp khác', tag: 'Doanh nghiệp', badgeClass: 'cust-corp', color: '#a855f7', rev: 0, cnt: 0, pct: 0, approvedRev: 0, approvedCnt: 0, pendingRev: 0, pendingCnt: 0, rejectedCnt: 0, claims: [] }
  };

  for(const r of filteredCustRecs){
    const gid = (r.customerGroup && r.customerGroup.id) || 'retail';
    if(custMap[gid]){
      custMap[gid].rev += r.total;
      custMap[gid].cnt++;
      custMap[gid].claims.push(r);
      const isApproved = (r.status === 'Đã phê duyệt' || r.status === 'APPROVED' || norm(r.status).includes('da phe duyet'));
      if(isApproved){
        custMap[gid].approvedRev += r.total;
        custMap[gid].approvedCnt++;
      } else if(r.isReturned || r.status === 'Từ chối / Hủy' || r.status === 'CANCELLED' || r.status === 'REJECTED') {
        custMap[gid].rejectedCnt++;
      } else {
        custMap[gid].pendingRev += r.total;
        custMap[gid].pendingCnt++;
      }
    }
  }
  const totalCustRev = Object.values(custMap).reduce((s, g) => s + g.rev, 0) || 1;
  Object.values(custMap).forEach(g => {
    g.pct = Math.round((g.rev / totalCustRev) * 100);
  });
  const customerBreakdown = {
    groups: Object.values(custMap),
    totalRev: totalCustRev,
    totalClaims: filteredCustRecs.length,
    activeFilter: custFilter
  };'''

if old_cust_block in content:
    content = content.replace(old_cust_block, new_cust_block)
    print("2. Updated computeAll customerBreakdown calculation with date range filter")
else:
    print("Error: Could not find old_cust_block in app_template2.html")

# 3. Add date filter UI and helper functions to renderCustomerBreakdownHtml
old_render_cust = '''// Render cơ cấu nhóm khách hàng thuần Dealer Portal (GSM, Bship, Khách lẻ)
function renderCustomerBreakdownHtml(cb) {
  if (!cb || !cb.groups) return '';
  const totalRev = cb.totalRev || 1;
  const groups = cb.groups;

  return `
    <div>
      <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
        <span style="display:flex;align-items:center;gap:5px">
          <span style="color:#10b981">●</span> Dữ liệu trích xuất từ <b>Dealer Portal VinFast</b>
        </span>
        <span style="font-size:11.5px;color:#38bdf8;font-weight:600">💡 Bấm vào từng nhóm để xem danh sách toàn bộ lệnh</span>
      </div>'''

new_render_cust = '''// Điều khiển bộ lọc ngày Cơ cấu nhóm khách hàng
window.setCustomerDatePreset = function(preset){
  if(!state.customerDateFilter) state.customerDateFilter = { from: '', to: '', preset: 'all' };
  const now = new Date();
  state.customerDateFilter.preset = preset;
  
  if(preset === 'all'){
    state.customerDateFilter.from = '';
    state.customerDateFilter.to = '';
  } else if(preset === 'this_month'){
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    state.customerDateFilter.from = `${y}-${m}-01`;
    const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
    state.customerDateFilter.to = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
  } else if(preset === 'last_month'){
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const y = prev.getFullYear();
    const m = String(prev.getMonth() + 1).padStart(2, '0');
    state.customerDateFilter.from = `${y}-${m}-01`;
    const lastDay = new Date(y, prev.getMonth() + 1, 0).getDate();
    state.customerDateFilter.to = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
  } else if(preset === '30days'){
    const d30 = new Date(now.getTime() - 30 * 86400000);
    state.customerDateFilter.from = d30.toISOString().slice(0, 10);
    state.customerDateFilter.to = now.toISOString().slice(0, 10);
  } else if(preset === '7days'){
    const d7 = new Date(now.getTime() - 7 * 86400000);
    state.customerDateFilter.from = d7.toISOString().slice(0, 10);
    state.customerDateFilter.to = now.toISOString().slice(0, 10);
  }
  computeAll();
  renderAll();
};

window.setCustomerCustomDate = function(from, to){
  if(!state.customerDateFilter) state.customerDateFilter = { from: '', to: '', preset: 'custom' };
  state.customerDateFilter.from = from || '';
  state.customerDateFilter.to = to || '';
  state.customerDateFilter.preset = (from || to) ? 'custom' : 'all';
  computeAll();
  renderAll();
};

// Render cơ cấu nhóm khách hàng thuần Dealer Portal (GSM, Bship, Khách lẻ)
function renderCustomerBreakdownHtml(cb) {
  if (!cb || !cb.groups) return '';
  const totalRev = cb.totalRev || 1;
  const groups = cb.groups;
  const filter = cb.activeFilter || (state.customerDateFilter) || { from: '', to: '', preset: 'all' };

  return `
    <div>
      <!-- Thanh bộ lọc Từ ngày đến ngày & Phím chọn nhanh -->
      <div style="background:rgba(15,23,42,0.7);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:8px 12px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-size:12px;font-weight:700;color:#94a3b8;display:flex;align-items:center;gap:4px">
            📅 Thời gian:
          </span>
          <button class="btn secondary ${filter.preset === 'all' ? 'active' : ''}" style="padding:2px 8px;font-size:11px;${filter.preset === 'all' ? 'background:#0284c7;color:#fff;border-color:#38bdf8' : ''}" onclick="setCustomerDatePreset('all')">Toàn bộ</button>
          <button class="btn secondary ${filter.preset === 'this_month' ? 'active' : ''}" style="padding:2px 8px;font-size:11px;${filter.preset === 'this_month' ? 'background:#0284c7;color:#fff;border-color:#38bdf8' : ''}" onclick="setCustomerDatePreset('this_month')">Tháng này</button>
          <button class="btn secondary ${filter.preset === 'last_month' ? 'active' : ''}" style="padding:2px 8px;font-size:11px;${filter.preset === 'last_month' ? 'background:#0284c7;color:#fff;border-color:#38bdf8' : ''}" onclick="setCustomerDatePreset('last_month')">Tháng trước</button>
          <button class="btn secondary ${filter.preset === '30days' ? 'active' : ''}" style="padding:2px 8px;font-size:11px;${filter.preset === '30days' ? 'background:#0284c7;color:#fff;border-color:#38bdf8' : ''}" onclick="setCustomerDatePreset('30days')">30 ngày</button>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-size:11.5px;color:#94a3b8">Từ:</span>
          <input type="date" id="custDateFrom" value="${filter.from || ''}" style="padding:3px 8px;font-size:11.5px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:#0f172a;color:#f8fafc" onchange="setCustomerCustomDate(this.value, document.getElementById('custDateTo')?.value)">
          <span style="font-size:11.5px;color:#94a3b8">Đến:</span>
          <input type="date" id="custDateTo" value="${filter.to || ''}" style="padding:3px 8px;font-size:11.5px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:#0f172a;color:#f8fafc" onchange="setCustomerCustomDate(document.getElementById('custDateFrom')?.value, this.value)">
          ${(filter.from || filter.to || filter.preset !== 'all') ? `<button class="btn secondary" style="padding:3px 8px;font-size:11px;color:#f87171;border-color:rgba(239,68,68,0.3)" onclick="setCustomerDatePreset('all')" title="Đặt lại bộ lọc ngày">✕ Đặt lại</button>` : ''}
        </div>
      </div>

      <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
        <span style="display:flex;align-items:center;gap:5px">
          <span style="color:#10b981">●</span> Dữ liệu trích xuất từ <b>Dealer Portal VinFast</b> (${cb.totalClaims || 0} đề xuất)
        </span>
        <span style="font-size:11.5px;color:#38bdf8;font-weight:600">💡 Bấm vào từng nhóm để xem danh sách toàn bộ lệnh</span>
      </div>'''

if old_render_cust in content:
    content = content.replace(old_render_cust, new_render_cust)
    print("3. Added Date Filter UI and helper functions to renderCustomerBreakdownHtml")
else:
    print("Error: Could not find old_render_cust in app_template2.html")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Saved _build/app_template2.html")
