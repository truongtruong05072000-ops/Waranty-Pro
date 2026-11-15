# -*- coding: utf-8 -*-
import io, re, sys

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Thêm hàm isSettledOrHigher
is_settled_code = '''
// Kiểm tra lệnh sửa chữa đang ở mức quyết toán trở lên
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
}
window.isSettledOrHigher = isSettledOrHigher;
'''

if 'function isSettledOrHigher' not in content:
    content = content.replace('function evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat){', is_settled_code + '\nfunction evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat){')

# 2. Cập nhật normalizeOrder: tính isUnsubmittedWarranty theo đúng chuẩn
old_unsub_pattern = "const isUnsubmittedWarranty = isWarrantyPayment && (!claimCode || claimCode === '—' || !claimCode.startsWith('WC-'));"
new_unsub_code = """const isSettled = isSettledOrHigher(status, d);
  // Lệnh chưa làm ĐXBH: Phân loại TT là bảo hành VÀ lệnh ở mức quyết toán trở lên VÀ chưa có mã ĐX (WC-...)
  const isUnsubmittedWarranty = isWarrantyPayment && isSettled && (!claimCode || claimCode === '—' || !claimCode.startsWith('WC-'));"""

if old_unsub_pattern in content:
    content = content.replace(old_unsub_pattern, new_unsub_code)

# Thêm isSettled vào object order nếu chưa có
if 'isSettled: isSettled,' not in content:
    content = content.replace('isWarrantyPayment: isWarrantyPayment,', 'isWarrantyPayment: isWarrantyPayment,\n    isSettled: isSettled,')

# 3. Cập nhật compute(): Customer Breakdown thuần Dealer Portal 100%
old_cust_compute = """  // THỐNG KÊ PHÂN LOẠI NHÓM KHÁCH HÀNG (GSM, BSHIP, KHÁCH LẺ, DOANH NGHIỆP)
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
  const unsubmittedWarrantyOrders = allCheckOrders.filter(o => o.isUnsubmittedWarranty);"""

new_cust_compute = """  // THỐNG KÊ PHÂN LOẠI NHÓM KHÁCH HÀNG (GSM, BSHIP, KHÁCH LẺ, DOANH NGHIỆP)
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
  };

  // CẢNH BÁO LỆNH SỬA CHỮA BẢO HÀNH CHƯA LÀM ĐỀ XUẤT (ở mức quyết toán trở lên)
  const allCheckOrders = (state.checkXe && state.checkXe.orders) || [];
  const unsubmittedWarrantyOrders = allCheckOrders.filter(o => o.isUnsubmittedWarranty);"""

if old_cust_compute in content:
    content = content.replace(old_cust_compute, new_cust_compute)
else:
    print('Warning: old_cust_compute exact match not found, checking alternatives...')

# 4. Cập nhật renderCustomerBreakdownHtml và các hàm tương tác modal
new_cust_render_and_modals = '''// Render cơ cấu nhóm khách hàng thuần Dealer Portal (GSM, Bship, Khách lẻ)
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
      </div>

      <!-- Thanh tỷ trọng phân bổ Stacked Bar -->
      <div style="height:14px;border-radius:7px;background:rgba(15,23,42,0.8);overflow:hidden;display:flex;margin-bottom:14px;border:1px solid rgba(255,255,255,0.1)">
        ${groups.map(g => `
          <div style="width:${g.pct}%;background:${g.color};height:100%;cursor:pointer;transition:opacity 0.15s" 
               title="${g.name}: ${fmtT(g.rev)} tr (${g.pct}%) · Bấm để xem ${g.cnt} lệnh"
               onmouseover="this.style.opacity='0.8'"
               onmouseout="this.style.opacity='1'"
               onclick="openCustomerGroupClaimsModal('${g.id}')"></div>
        `).join('')}
      </div>

      <!-- 4 Thẻ nhóm khách hàng tương tác -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:12px">
        ${groups.map(g => `
          <div class="cust-group-card" 
               style="background:rgba(15,23,42,0.65);border:1.5px solid ${g.color}45;border-radius:12px;padding:12px 14px;cursor:pointer;transition:all 0.2s cubic-bezier(0.16,1,0.3,1);box-shadow:0 4px 14px rgba(0,0,0,0.25)"
               onmouseover="this.style.borderColor='${g.color}';this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 22px ${g.color}35'"
               onmouseout="this.style.borderColor='${g.color}45';this.style.transform='none';this.style.boxShadow='0 4px 14px rgba(0,0,0,0.25)'"
               onclick="openCustomerGroupClaimsModal('${g.id}')">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:12.5px;font-weight:800;color:${g.color};display:flex;align-items:center;gap:5px">
                <span style="width:7px;height:7px;border-radius:50%;background:${g.color}"></span>
                ${g.tag}
              </span>
              <span style="font-size:11.5px;font-weight:700;color:#cbd5e1;background:rgba(255,255,255,0.06);padding:1px 6px;border-radius:4px">${g.pct}%</span>
            </div>
            <div style="font-size:18px;font-weight:800;color:#f8fafc;margin-bottom:3px">
              ${fmtT(g.rev)} <span style="font-size:12px;color:#94a3b8;font-weight:600">tr</span>
            </div>
            <div style="font-size:11.5px;color:#94a3b8;margin-bottom:8px">
              <b style="color:#e2e8f0">${g.cnt}</b> ĐX Dealer Portal
            </div>
            <button class="btn secondary" style="width:100%;font-size:11px;padding:4px 6px;border-color:${g.color}60;color:${g.color};background:${g.color}15;border-radius:6px;display:flex;align-items:center;justify-content:center;gap:4px"
                    onclick="event.stopPropagation();openCustomerGroupClaimsModal('${g.id}')">
              📋 Xem ${g.cnt} lệnh
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
window.renderCustomerBreakdownHtml = renderCustomerBreakdownHtml;

// Helper sao chép chuỗi vào Clipboard với thông báo mượt mà
function copyTextToClipboard(text, el){
  if(!text) return;
  navigator.clipboard.writeText(text).then(() => {
    if(el){
      const origText = el.innerHTML;
      el.innerHTML = '✓ Đã chép!';
      el.style.color = '#34d399';
      setTimeout(() => { el.innerHTML = origText; el.style.color = ''; }, 1200);
    }
  }).catch(()=>{});
}
window.copyTextToClipboard = copyTextToClipboard;

// 1. MODAL XEM CHI TIẾT DANH SÁCH LỆNH CỦA TỪNG NHÓM KHÁCH HÀNG
let currentCustGroupModalId = '';
window.openCustomerGroupClaimsModal = function(groupId, filterStatus = 'all'){
  currentCustGroupModalId = groupId;
  const C = state.computed;
  if(!C || !C.customerBreakdown) return;
  const group = C.customerBreakdown.groups.find(g => g.id === groupId);
  if(!group) return;

  const modal = $('#modalCustomerGroupClaims');
  if(!modal) return;
  
  $('#custGroupModalTitle').innerHTML = `👥 Danh sách Đề xuất &amp; Lệnh Bảo Hành — Nhóm: <span style="color:${group.color}">${esc(group.name)}</span>`;
  $('#custGroupModalSubtitle').innerHTML = `Nguồn dữ liệu: <b>https://dealer-portal.vinfast.com/</b> · Tổng doanh thu: <b>${fmtVND(group.rev)}</b> (${group.cnt} đề xuất)`;
  
  // Set badge stats
  $('#custGroupStats').innerHTML = `
    <span class="tag" style="background:rgba(255,255,255,0.06);color:#cbd5e1;padding:4px 10px;font-size:12px">Tổng số: <b>${group.cnt} ĐX</b></span>
    <span class="tag" style="background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);padding:4px 10px;font-size:12px">Đã duyệt: <b>${group.approvedCnt} ĐX</b> (${fmtT(group.approvedRev)} tr)</span>
    <span class="tag" style="background:rgba(217,119,6,0.15);color:#fbbf24;border:1px solid rgba(217,119,6,0.3);padding:4px 10px;font-size:12px">Chờ duyệt: <b>${group.pendingCnt} ĐX</b> (${fmtT(group.pendingRev)} tr)</span>
    ${group.rejectedCnt > 0 ? `<span class="tag" style="background:rgba(239,68,68,0.15);color:#fca5a5;border:1px solid rgba(239,68,68,0.3);padding:4px 10px;font-size:12px">Bị trả về / Từ chối: <b>${group.rejectedCnt} ĐX</b></span>` : ''}
  `;

  renderCustGroupClaimsTable(group, '', filterStatus);
  modal.hidden = false;
};

function renderCustGroupClaimsTable(group, searchKeyword = '', filterStatus = 'all'){
  const tbody = $('#custGroupClaimsTbody');
  if(!tbody) return;

  let claims = group.claims || [];
  if(filterStatus === 'approved') {
    claims = claims.filter(r => r.status === 'Đã phê duyệt' || r.status === 'APPROVED');
  } else if(filterStatus === 'pending') {
    claims = claims.filter(r => r.status !== 'Đã phê duyệt' && r.status !== 'APPROVED' && !r.isReturned);
  } else if(filterStatus === 'returned') {
    claims = claims.filter(r => r.isReturned || r.status === 'Từ chối / Hủy');
  }

  if(searchKeyword){
    const q = norm(searchKeyword);
    claims = claims.filter(r => 
      norm(r.id).includes(q) || 
      norm(r.wo).includes(q) || 
      norm(r.vin).includes(q) || 
      norm(r.customerName).includes(q) ||
      norm(r.customerCompanyName).includes(q)
    );
  }

  $('#custGroupResultCount').textContent = `${claims.length} đề xuất / lệnh`;

  if(!claims.length){
    tbody.innerHTML = '<tr><td colspan="9" class="empty-state" style="text-align:center;padding:24px;color:var(--text-muted)">Không tìm thấy đề xuất / lệnh nào khớp điều kiện tìm kiếm.</td></tr>';
    return;
  }

  tbody.innerHTML = claims.map((r, idx) => {
    const isApp = r.status === 'Đã phê duyệt' || r.status === 'APPROVED';
    const stBadge = isApp 
      ? '<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(16,185,129,0.18);color:#34d399;border:1px solid rgba(16,185,129,0.4)">Đã phê duyệt</span>'
      : (r.isReturned 
         ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.4)">${esc(r.returnLevelLabel || 'Bị trả về')}</span>`
         : `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(217,119,6,0.18);color:#fbbf24;border:1px solid rgba(217,119,6,0.4)">${esc(r.status || 'Chờ duyệt')}</span>`);

    return `
      <tr>
        <td style="text-align:center;color:#94a3b8;font-size:12px">${idx + 1}</td>
        <td>
          <div style="font-weight:700;color:#f8fafc;display:flex;align-items:center;gap:6px">
            <span>${esc(r.id)}</span>
            <button class="btn secondary" style="padding:1px 5px;font-size:10px" title="Sao chép mã ĐX" onclick="copyTextToClipboard('${r.id}', this)">📋</button>
          </div>
        </td>
        <td>
          <div style="font-family:monospace;font-size:12px;color:#cbd5e1;display:flex;align-items:center;gap:6px">
            <span>${esc(r.wo) || '—'}</span>
            ${r.wo && r.wo !== '—' ? `<button class="btn secondary" style="padding:1px 5px;font-size:10px" title="Sao chép mã WO" onclick="copyTextToClipboard('${r.wo}', this)">📋</button>` : ''}
          </div>
        </td>
        <td style="font-family:monospace;font-size:11.5px;color:#94a3b8">${esc(r.vin) || '—'}</td>
        <td style="font-size:12px;font-weight:600;color:#f1f5f9">${esc(r.customerName || r.customerCompanyName || '—')}</td>
        <td style="text-align:right;font-weight:700;color:var(--primary);font-size:13px">${fmtVND(r.total)}</td>
        <td style="text-align:center;font-size:12px;color:#cbd5e1">${fmtDate(r.date) || '—'}</td>
        <td style="text-align:center">${stBadge}</td>
        <td style="font-size:11.5px;color:#94a3b8;max-width:180px;white-space:normal">${esc(r.rejectReason || '—')}</td>
      </tr>
    `;
  }).join('');
}

window.filterCustGroupModal = function(){
  const C = state.computed;
  if(!C || !C.customerBreakdown || !currentCustGroupModalId) return;
  const group = C.customerBreakdown.groups.find(g => g.id === currentCustGroupModalId);
  if(!group) return;
  const q = ($('#custGroupSearchInput')?.value || '').trim();
  const st = $('#custGroupStatusFilter')?.value || 'all';
  renderCustGroupClaimsTable(group, q, st);
};

window.exportCustGroupClaimsExcel = function(){
  const C = state.computed;
  if(!C || !C.customerBreakdown || !currentCustGroupModalId) return;
  const group = C.customerBreakdown.groups.find(g => g.id === currentCustGroupModalId);
  if(!group || !group.claims || !group.claims.length) {
    alert('Không có dữ liệu để xuất Excel!');
    return;
  }
  const rows = group.claims.map((r, i) => ({
    'STT': i + 1,
    'Mã Đề Xuất (WC)': r.id,
    'Lệnh Sửa Chữa (WO)': r.wo || '',
    'Số Khung (VIN)': r.vin || '',
    'Khách Hàng': r.customerName || '',
    'Công Ty': r.customerCompanyName || '',
    'Nhóm Khách': group.name,
    'Số Tiền (VND)': r.total || 0,
    'Ngày Duyệt / Gửi': fmtDate(r.date) || '',
    'Kỳ Doanh Thu': r.cm ? monthLabel(r.cm) : '',
    'Trạng Thái': r.status || '',
    'Lý Do Trả Về / Từ Chối': r.rejectReason || ''
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, group.tag);
  XLSX.writeFile(wb, `DealerPortal_${group.tag}_${settings.targetMonth}.xlsx`);
};

window.closeCustomerGroupClaimsModal = function(){
  const m = $('#modalCustomerGroupClaims');
  if(m) m.hidden = true;
};

// 2. MODAL XEM DANH SÁCH LỆNH BẢO HÀNH CHƯA LÀM ĐỀ XUẤT (ở mức quyết toán trở lên)
window.showUnsubmittedWarrantyOrders = function(){
  const C = state.computed;
  const orders = (C && C.unsubmittedWarrantyOrders) || [];
  renderUnsubmittedOrdersModal(orders);
  const modal = $('#modalUnsubmittedOrders');
  if(modal) modal.hidden = false;
};

function renderUnsubmittedOrdersModal(orders, keyword = ''){
  const tbody = $('#unsubmittedOrdersTbody');
  if(!tbody) return;

  let list = orders || [];
  if(keyword){
    const q = norm(keyword);
    list = list.filter(o => 
      norm(o.wo).includes(q) || 
      norm(o.plate).includes(q) || 
      norm(o.vin).includes(q) || 
      norm(o.customer).includes(q) ||
      norm(o.vehicle).includes(q)
    );
  }

  $('#unsubmittedResultCount').textContent = `${list.length} lệnh sửa chữa`;

  // Quick groups count
  const gsmCount = list.filter(o => o.customerGroup?.id === 'gsm').length;
  const bshipCount = list.filter(o => o.customerGroup?.id === 'bship').length;
  const retailCount = list.filter(o => o.customerGroup?.id === 'retail').length;

  $('#unsubmittedGroupStats').innerHTML = `
    <span class="tag" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.4);font-size:12px;padding:3px 10px">Tổng chưa làm ĐX: <b>${list.length} lệnh</b></span>
    <span class="tag" style="background:rgba(6,182,212,0.15);color:#22d3ee;font-size:12px;padding:3px 10px">GSM: <b>${gsmCount} lệnh</b></span>
    <span class="tag" style="background:rgba(16,185,129,0.15);color:#34d399;font-size:12px;padding:3px 10px">BSHIP: <b>${bshipCount} lệnh</b></span>
    <span class="tag" style="background:rgba(56,189,248,0.15);color:#38bdf8;font-size:12px;padding:3px 10px">Khách lẻ: <b>${retailCount} lệnh</b></span>
  `;

  if(!list.length){
    tbody.innerHTML = '<tr><td colspan="9" class="empty-state" style="text-align:center;padding:24px;color:var(--text-muted)">Không có lệnh sửa chữa bảo hành nào chưa làm đề xuất.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((o, idx) => {
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
        <td style="font-size:11.5px;color:#94a3b8;max-width:200px;white-space:normal">
          ${esc(o.faultStr || o.issue || o.note || 'Lỗi linh kiện bảo hành')}
        </td>
      </tr>
    `;
  }).join('');
}

window.filterUnsubmittedModal = function(){
  const C = state.computed;
  const list = (C && C.unsubmittedWarrantyOrders) || [];
  const q = ($('#unsubmittedSearchInput')?.value || '').trim();
  renderUnsubmittedOrdersModal(list, q);
};

window.copyAllUnsubmittedWo = function(btn){
  const C = state.computed;
  const list = (C && C.unsubmittedWarrantyOrders) || [];
  const wos = list.map(o => o.wo).filter(w => w && w !== '—');
  if(!wos.length){ alert('Không có mã lệnh sửa chữa nào để sao chép!'); return; }
  const text = wos.join('\\n');
  copyTextToClipboard(text, btn);
};

window.exportUnsubmittedWarrantyExcel = function(){
  const C = state.computed;
  const list = (C && C.unsubmittedWarrantyOrders) || [];
  if(!list.length){ alert('Không có dữ liệu để xuất Excel!'); return; }
  const rows = list.map((o, idx) => ({
    'STT': idx + 1,
    'Mã LSC (WO)': o.wo,
    'Biển Số': o.plate,
    'Số Khung (VIN)': o.vin,
    'Dòng Xe': o.vehicle,
    'Khách Hàng': o.customer,
    'Nhóm Khách': o.customerGroup?.name || 'Khách lẻ',
    'Phân Loại TT': o.phanLoaiTt,
    'Trạng Thái LSC': o.status,
    'Ngày Nhận / Quyết Toán': o.dateStr,
    'Hạng Mục Lỗi / Phụ Tùng': o.faultStr || o.issue || o.note || ''
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ChuaLamDXBH');
  XLSX.writeFile(wb, `LenhChuaLamDXBH_${new Date().toISOString().slice(0,10)}.xlsx`);
};

window.closeUnsubmittedWarrantyModal = function(){
  const m = $('#modalUnsubmittedOrders');
  if(m) m.hidden = true;
};

window.viewReturnedClaims = function(){
  if (typeof window.switchTab === 'function') window.switchTab('claims');
  if (state.filters) {
    state.filters.returnStatus = 'all_returned';
    if (typeof renderAll === 'function') renderAll();
  }
};
'''

# Thay thế khối renderCustomerBreakdownHtml cũ
content = re.sub(r'// Render cơ cấu nhóm khách hàng[\s\S]*?window\.viewReturnedClaims = function\(\)\{[\s\S]*?\};', new_cust_render_and_modals, content, count=1)

# 5. Cập nhật thẻ Cảnh báo trong Overview Tab
old_alert_btn = '🔍 Xem ngay ${C.unsubmittedWarrantyOrders.length} xe cần tạo ĐX'
new_alert_btn = '📋 Xem danh sách ${C.unsubmittedWarrantyOrders.length} lệnh chưa làm ĐX'
if old_alert_btn in content:
    content = content.replace(old_alert_btn, new_alert_btn)

# 6. Thêm HTML cho 2 Modal mới trước </body>
modals_html = '''
<!-- Modal Xem Chi Tiết Danh Sách Lệnh Theo Nhóm Khách Hàng (Dealer Portal) -->
<div id="modalCustomerGroupClaims" class="modal-overlay" hidden>
  <div class="modal-box" style="max-width:1050px;width:95vw;max-height:92vh;display:flex;flex-direction:column;padding:22px;background:#0d1527;border:1.5px solid rgba(56,189,248,0.3)">
    <button class="modal-close" onclick="closeCustomerGroupClaimsModal()">✕</button>
    <div class="modal-title" id="custGroupModalTitle" style="font-size:18px;margin-bottom:4px"></div>
    <div id="custGroupModalSubtitle" style="font-size:12.5px;color:#94a3b8;margin-bottom:12px"></div>

    <div id="custGroupStats" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>

    <!-- Toolbar tìm kiếm & lọc -->
    <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;align-items:center;justify-content:space-between">
      <div style="display:flex;gap:8px;flex:1;min-width:280px">
        <input type="text" id="custGroupSearchInput" class="search-input" style="flex:1" placeholder="🔍 Tìm mã ĐX, mã WO, Biển số, VIN, Khách hàng..." oninput="filterCustGroupModal()">
        <select id="custGroupStatusFilter" class="select-input" onchange="filterCustGroupModal()">
          <option value="all">Tất cả trạng thái</option>
          <option value="approved">Đã phê duyệt</option>
          <option value="pending">Chờ phê duyệt</option>
          <option value="returned">Bị trả về / Từ chối</option>
        </select>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span id="custGroupResultCount" style="font-size:12px;color:#94a3b8;font-weight:600"></span>
        <button class="btn secondary" style="font-size:12px;padding:6px 12px;background:#0369a1;border-color:#38bdf8;color:#fff" onclick="exportCustGroupClaimsExcel()">
          📥 Xuất Excel nhóm này
        </button>
      </div>
    </div>

    <!-- Bảng danh sách đề xuất -->
    <div class="table-container scrollable" style="flex:1;max-height:55vh;overflow-y:auto;border:1px solid rgba(255,255,255,0.08);border-radius:8px">
      <table>
        <thead style="position:sticky;top:0;background:#1e293b;z-index:2">
          <tr>
            <th style="width:40px;text-align:center">STT</th>
            <th>MÃ ĐỀ XUẤT (WC)</th>
            <th>LỆNH SỬA CHỮA (WO)</th>
            <th>SỐ KHUNG (VIN)</th>
            <th>TÊN KHÁCH HÀNG</th>
            <th style="text-align:right">SỐ TIỀN (VND)</th>
            <th style="text-align:center">NGÀY DUYỆT / GỬI</th>
            <th style="text-align:center">TRẠNG THÁI</th>
            <th>GHI CHÚ / LÝ DO</th>
          </tr>
        </thead>
        <tbody id="custGroupClaimsTbody"></tbody>
      </table>
    </div>

    <div style="margin-top:14px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:11.5px;color:#64748b">Dữ liệu nguồn trích xuất 100% từ VinFast Dealer Portal (https://dealer-portal.vinfast.com/)</span>
      <button class="btn secondary" onclick="closeCustomerGroupClaimsModal()">Đóng</button>
    </div>
  </div>
</div>

<!-- Modal Xem Chi Tiết Lệnh Sửa Chữa Chưa Có ĐXBH (ở mức quyết toán trở lên) -->
<div id="modalUnsubmittedOrders" class="modal-overlay" hidden>
  <div class="modal-box" style="max-width:1100px;width:95vw;max-height:92vh;display:flex;flex-direction:column;padding:22px;background:#0d1527;border:1.5px solid rgba(239,68,68,0.4)">
    <button class="modal-close" onclick="closeUnsubmittedWarrantyModal()">✕</button>
    <div class="modal-title" style="font-size:18px;color:#fca5a5;display:flex;align-items:center;gap:8px">
      <span>🚨</span> Danh sách Lệnh Sửa Chữa Bảo Hành Đã Quyết Toán CHƯA LÀM ĐỀ XUẤT (ĐXBH)
    </div>
    <div style="font-size:12.5px;color:#cbd5e1;margin-bottom:12px;line-height:1.5">
      Các lệnh sửa chữa dưới đây có <b>Phân loại TT là Bảo hành</b> và đang ở mức <b>Đã quyết toán / Hoàn thành</b> trở lên nhưng <b>chưa được tạo đề xuất (chưa có mã WC-...)</b> trên Dealer Portal. Cần khẩn trương nộp hồ sơ để ghi nhận doanh thu!
    </div>

    <div id="unsubmittedGroupStats" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"></div>

    <!-- Toolbar tìm kiếm & chức năng -->
    <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;align-items:center;justify-content:space-between">
      <div style="display:flex;gap:8px;flex:1;min-width:280px">
        <input type="text" id="unsubmittedSearchInput" class="search-input" style="flex:1" placeholder="🔍 Tìm mã WO, Biển số, VIN, Khách hàng, Dòng xe..." oninput="filterUnsubmittedModal()">
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span id="unsubmittedResultCount" style="font-size:12px;color:#94a3b8;font-weight:600"></span>
        <button class="btn secondary" style="font-size:12px;padding:6px 12px;background:#b91c1c;border-color:#ef4444;color:#fff" onclick="copyAllUnsubmittedWo(this)">
          📋 Copy tất cả mã WO
        </button>
        <button class="btn secondary" style="font-size:12px;padding:6px 12px;background:#0369a1;border-color:#38bdf8;color:#fff" onclick="exportUnsubmittedWarrantyExcel()">
          📥 Xuất Excel danh sách
        </button>
        <a href="https://dealer-portal.vinfast.com/dealer/aftersales/escooter/warranty-claim#wcDatePreset=ALL&wcLimit=20&wcPage=1&wcPendingPayment=ALL" target="_blank" class="btn" style="font-size:12px;padding:6px 12px;text-decoration:none;display:inline-flex;align-items:center;gap:4px">
          🌐 Mở Dealer Portal ĐXBH
        </a>
      </div>
    </div>

    <!-- Bảng danh sách lệnh chưa làm ĐX -->
    <div class="table-container scrollable" style="flex:1;max-height:55vh;overflow-y:auto;border:1px solid rgba(255,255,255,0.08);border-radius:8px">
      <table>
        <thead style="position:sticky;top:0;background:#1e293b;z-index:2">
          <tr>
            <th style="width:40px;text-align:center">STT</th>
            <th>MÃ LỆNH SỬA CHỮA (WO)</th>
            <th>BIỂN SỐ XE</th>
            <th>SỐ KHUNG (VIN)</th>
            <th>DÒNG XE</th>
            <th>KHÁCH HÀNG</th>
            <th style="text-align:center">PHÂN LOẠI TT</th>
            <th style="text-align:center">TRẠNG THÁI LSC</th>
            <th>HẠNG MỤC LỖI / BẢO HÀNH</th>
          </tr>
        </thead>
        <tbody id="unsubmittedOrdersTbody"></tbody>
      </table>
    </div>

    <div style="margin-top:14px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:11.5px;color:#64748b">Tiêu chuẩn nghiệm thu: Phân loại TT là Bảo hành &amp; Trạng thái LSC từ Quyết toán trở lên &amp; Chưa có mã WC</span>
      <button class="btn secondary" onclick="closeUnsubmittedWarrantyModal()">Đóng</button>
    </div>
  </div>
</div>
'''

if 'id="modalCustomerGroupClaims"' not in content:
    content = content.replace('</body>', modals_html + '\n</body>')

with io.open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully applied customer breakdown and unsubmitted warranty enhancements to app_template2.html!')
