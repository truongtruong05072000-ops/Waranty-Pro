# -*- coding: utf-8 -*-
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add IDs to KPI values in renderCheckXe
old_kpi = """      <!-- 5 Thẻ KPI Chuẩn theo Nghiệp Vụ -->
      <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;padding:0 20px 20px">
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(16,185,129,0.14), rgba(15,23,42,0.7));border:1px solid rgba(16,185,129,0.38);box-shadow:0 0 15px rgba(16,185,129,0.15)" onclick="setCheckXeColFilter('filterStatus', 'no_fault')" title="Bấm để lọc danh sách xe không lỗi">
          <div class="kpi-label" style="color:#34d399">${window.ICONS.checkCircle} Xe không lỗi</div>
          <div class="kpi-val" style="color:#34d399;text-shadow:0 0 12px rgba(16,185,129,0.4)">${noFaultList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Bình thường · Không có lỗi</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,23,42,0.7));border:1px solid rgba(239,68,68,0.35);box-shadow:0 0 15px rgba(239,68,68,0.15)" onclick="setCheckXeColFilter('filterStatus', 'unchecked')" title="Bấm để lọc xe chưa check">
          <div class="kpi-label" style="color:var(--rose-glow)">${window.ICONS.alertCircle} Chưa check (Cần xử lý)</div>
          <div class="kpi-val" style="color:#f87171;text-shadow:0 0 12px rgba(239,68,68,0.4)">${uncheckedList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Có lỗi · Chưa ghi chú/bảng</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(56,189,248,0.12), rgba(15,23,42,0.7));border:1px solid rgba(56,189,248,0.35);box-shadow:0 0 15px rgba(56,189,248,0.15)" onclick="setCheckXeColFilter('filterStatus', 'checked')" title="Bấm để lọc xe đã check">
          <div class="kpi-label" style="color:#38bdf8">${window.ICONS.checkCircle} Đã check xong</div>
          <div class="kpi-val" style="color:#38bdf8;text-shadow:0 0 12px rgba(56,189,248,0.4)">${checkedList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Đã có bảng linh kiện / ghi chú</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(245,158,11,0.12), rgba(15,23,42,0.7));border:1px solid rgba(245,158,11,0.35);box-shadow:0 0 15px rgba(245,158,11,0.15)" onclick="setCheckXeColFilter('filterStatus', 'recheck')" title="Bấm để lọc xe cần check lại">
          <div class="kpi-label" style="color:var(--amber-glow)">${window.ICONS.alertTriangle} Cần check lại</div>
          <div class="kpi-val" style="color:#fbbf24;text-shadow:0 0 12px rgba(245,158,11,0.4)">${recheckList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Có ghi chú nhưng chưa có bảng</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(148,163,184,0.12), rgba(15,23,42,0.7));border:1px solid rgba(148,163,184,0.35);box-shadow:0 0 15px rgba(148,163,184,0.15)" onclick="setCheckXeColFilter('filterStatus', 'all')" title="Bấm để xem tất cả xe">
          <div class="kpi-label" style="color:#e2e8f0">${window.ICONS.carCheck} Tổng trong xưởng</div>
          <div class="kpi-val" style="color:#f8fafc;text-shadow:0 0 12px rgba(255,255,255,0.4)">${totalAll}</div>
          <div class="kpi-sub" style="color:#94a3b8">Toàn bộ xe đang theo dõi</div>
        </div>
      </div>"""

new_kpi = """      <!-- 5 Thẻ KPI Chuẩn theo Nghiệp Vụ -->
      <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;padding:0 20px 20px">
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(16,185,129,0.14), rgba(15,23,42,0.7));border:1px solid rgba(16,185,129,0.38);box-shadow:0 0 15px rgba(16,185,129,0.15)" onclick="setCheckXeColFilter('filterStatus', 'no_fault')" title="Bấm để lọc danh sách xe không lỗi">
          <div class="kpi-label" style="color:#34d399">${window.ICONS.checkCircle} Xe không lỗi</div>
          <div class="kpi-val" id="kpiNoFaultVal" style="color:#34d399;text-shadow:0 0 12px rgba(16,185,129,0.4)">${noFaultList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Bình thường · Không có lỗi</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,23,42,0.7));border:1px solid rgba(239,68,68,0.35);box-shadow:0 0 15px rgba(239,68,68,0.15)" onclick="setCheckXeColFilter('filterStatus', 'unchecked')" title="Bấm để lọc xe chưa check">
          <div class="kpi-label" style="color:var(--rose-glow)">${window.ICONS.alertCircle} Chưa check (Cần xử lý)</div>
          <div class="kpi-val" id="kpiUncheckedVal" style="color:#f87171;text-shadow:0 0 12px rgba(239,68,68,0.4)">${uncheckedList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Có lỗi · Chưa ghi chú/bảng</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(56,189,248,0.12), rgba(15,23,42,0.7));border:1px solid rgba(56,189,248,0.35);box-shadow:0 0 15px rgba(56,189,248,0.15)" onclick="setCheckXeColFilter('filterStatus', 'checked')" title="Bấm để lọc xe đã check">
          <div class="kpi-label" style="color:#38bdf8">${window.ICONS.checkCircle} Đã check xong</div>
          <div class="kpi-val" id="kpiCheckedVal" style="color:#38bdf8;text-shadow:0 0 12px rgba(56,189,248,0.4)">${checkedList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Đã có bảng linh kiện / ghi chú</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(245,158,11,0.12), rgba(15,23,42,0.7));border:1px solid rgba(245,158,11,0.35);box-shadow:0 0 15px rgba(245,158,11,0.15)" onclick="setCheckXeColFilter('filterStatus', 'recheck')" title="Bấm để lọc xe cần check lại">
          <div class="kpi-label" style="color:var(--amber-glow)">${window.ICONS.alertTriangle} Cần check lại</div>
          <div class="kpi-val" id="kpiRecheckVal" style="color:#fbbf24;text-shadow:0 0 12px rgba(245,158,11,0.4)">${recheckList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Có ghi chú nhưng chưa có bảng</div>
        </div>
        <div class="kpi-card" style="cursor:pointer;background:linear-gradient(135deg, rgba(148,163,184,0.12), rgba(15,23,42,0.7));border:1px solid rgba(148,163,184,0.35);box-shadow:0 0 15px rgba(148,163,184,0.15)" onclick="setCheckXeColFilter('filterStatus', 'all')" title="Bấm để xem tất cả xe">
          <div class="kpi-label" style="color:#e2e8f0">${window.ICONS.carCheck} Tổng trong xưởng</div>
          <div class="kpi-val" id="kpiTotalVal" style="color:#f8fafc;text-shadow:0 0 12px rgba(255,255,255,0.4)">${totalAll}</div>
          <div class="kpi-sub" style="color:#94a3b8">Toàn bộ xe đang theo dõi</div>
        </div>
      </div>"""

if old_kpi in c:
    c = c.replace(old_kpi, new_kpi)
    print("Added IDs to KPI values")
else:
    print("old_kpi not found")

# 2. Add IDs to table and tbody
old_tbody = """          <tbody>
            ${rowsHtml || `<tr><td colspan="${state.checkXe.viewMode === 'card' ? 10 : 13}" style="text-align:center;padding:36px;color:var(--text-muted);font-size:13px">Không tìm thấy xe nào phù hợp với bộ lọc hiện tại.<br><button class="btn secondary" style="margin-top:10px;font-size:12px" onclick="resetCheckXeFilters()">🔄 Xóa các bộ lọc để xem lại danh sách</button></td></tr>`}
          </tbody>"""

new_tbody = """          <tbody id="checkXeTbody">
            ${rowsHtml || `<tr><td colspan="${state.checkXe.viewMode === 'card' ? 10 : 13}" style="text-align:center;padding:36px;color:var(--text-muted);font-size:13px">Không tìm thấy xe nào phù hợp với bộ lọc hiện tại.<br><button class="btn secondary" style="margin-top:10px;font-size:12px" onclick="resetCheckXeFilters()">🔄 Xóa các bộ lọc để xem lại danh sách</button></td></tr>`}
          </tbody>"""

if old_tbody in c:
    c = c.replace(old_tbody, new_tbody)
    print("Added id checkXeTbody")
else:
    print("old_tbody not found")

# 3. Add id to checkXeTable
old_tbl = """        <table class="table-checkxe">"""
new_tbl = """        <table class="table-checkxe" id="checkXeTable">"""
if old_tbl in c:
    c = c.replace(old_tbl, new_tbl, 1)
    print("Added id checkXeTable")
else:
    print("old_tbl not found")

# 4. Add id to filter counter
old_cnt_disp = """Hiển thị ${filtered.length} / ${totalAll} xe"""
new_cnt_disp = """<span id="checkXeFilterCountDisplay">Hiển thị ${filtered.length} / ${totalAll} xe</span>"""
if old_cnt_disp in c:
    c = c.replace(old_cnt_disp, new_cnt_disp, 1)
    print("Added id checkXeFilterCountDisplay")

# 5. Add inPlace update logic at the end of renderCheckXe
old_render_end = """  // Bảng các dòng xe
  const rowsHtml = filtered.map((o, idx) => {"""

render_check_xe_signature = "function renderCheckXe(options = {}){"
c = c.replace("function renderCheckXe(){", render_check_xe_signature)

in_place_check = """  // Cập nhật đè giao diện tại chỗ (Seamless in-place update) nếu bảng đã tồn tại
  if(options && options.inPlace && document.getElementById('checkXeTbody')){
    const tb = document.getElementById('checkXeTbody');
    const nf = document.getElementById('kpiNoFaultVal');
    const uc = document.getElementById('kpiUncheckedVal');
    const ck = document.getElementById('kpiCheckedVal');
    const rc = document.getElementById('kpiRecheckVal');
    const tt = document.getElementById('kpiTotalVal');
    const cd = document.getElementById('checkXeFilterCountDisplay');
    if(nf) nf.textContent = noFaultList.length;
    if(uc) uc.textContent = uncheckedList.length;
    if(ck) ck.textContent = checkedList.length;
    if(rc) rc.textContent = recheckList.length;
    if(tt) tt.textContent = totalAll;
    if(cd) cd.textContent = `Hiển thị ${filtered.length} / ${totalAll} xe`;
    if(tb) tb.innerHTML = rowsHtml || `<tr><td colspan="${state.checkXe.viewMode === 'card' ? 10 : 13}" style="text-align:center;padding:36px;color:var(--text-muted);font-size:13px">Không tìm thấy xe nào phù hợp với bộ lọc hiện tại.</td></tr>`;
    return;
  }
"""

target_before_el = "  const el = $('#checkXeContent');\n  if(!el) return;"
replacement_before_el = target_before_el

# Put in_place_check right after rowsHtml calculation
target_after_rows = "  el.innerHTML = `"
if target_after_rows in c:
    c = c.replace(target_after_rows, in_place_check + "\n  el.innerHTML = `")
    print("Added inPlace DOM update to renderCheckXe")
else:
    print("target_after_rows not found")

# 6. Upsert functions for ServiceOS and Dealer Portal
upsert_code = """
// Hàm Cập nhật đè dữ liệu xe ServiceOS (Upsert - Không xóa dữ liệu cũ)
function upsertServiceOsOrders(newRawOrders) {
  if (!Array.isArray(newRawOrders) || newRawOrders.length === 0) return { addedCount: 0, updatedCount: 0, total: (state.checkXe.orders ? state.checkXe.orders.length : 0) };
  
  if (!state.checkXe.orders) state.checkXe.orders = [];

  // Tạo Map tra cứu xe hiện tại theo ID, Code, VIN
  const orderMap = new Map();
  state.checkXe.orders.forEach((o, idx) => {
    if (o.id) orderMap.set('id:' + o.id, idx);
    if (o.code) orderMap.set('code:' + String(o.code).trim().toUpperCase(), idx);
    if (o.vin) orderMap.set('vin:' + String(o.vin).trim().toUpperCase(), idx);
  });

  let addedCount = 0;
  let updatedCount = 0;
  const newItems = [];

  newRawOrders.forEach(raw => {
    if (!raw) return;
    const rawId = raw.id ? 'id:' + raw.id : null;
    const rawCode = raw.code ? 'code:' + String(raw.code).trim().toUpperCase() : null;
    const rawVin = raw.vin ? 'vin:' + String(raw.vin).trim().toUpperCase() : null;

    let existingIdx = -1;
    if (rawId && orderMap.has(rawId)) existingIdx = orderMap.get(rawId);
    else if (rawCode && orderMap.has(rawCode)) existingIdx = orderMap.get(rawCode);
    else if (rawVin && orderMap.has(rawVin)) existingIdx = orderMap.get(rawVin);

    const norm = normalizeOrder(raw);

    if (existingIdx !== -1) {
      // CẬP NHẬT ĐÈ LÊN XE ĐÃ CÓ: Giữ nguyên ghi chú người dùng đã sửa nếu có
      const existing = state.checkXe.orders[existingIdx];
      const userNote = existing.userNote || existing._userEditedNote;
      Object.assign(existing, norm);
      if (userNote) existing.note = userNote;
      updatedCount++;
    } else {
      // XE MỚI: Thêm vào danh sách (đưa lên đầu)
      newItems.push(norm);
      addedCount++;
    }
  });

  if (newItems.length > 0) {
    state.checkXe.orders = [...newItems, ...state.checkXe.orders];
  }

  // Đánh lại số thứ tự
  state.checkXe.orders.forEach((o, i) => { o._idx = i + 1; });

  // Lưu lại vào localStorage cache
  saveCheckXeOrders();

  return { addedCount, updatedCount, total: state.checkXe.orders.length };
}

// Hàm Cập nhật đè đề xuất Dealer Portal lên hệ thống
function upsertDealerPortalClaims(claims) {
  if (!claims) return 0;
  const list = Array.isArray(claims) ? claims : (claims.data || claims.rows || claims.items || []);
  if (!Array.isArray(list) || list.length === 0) return 0;

  // Cập nhật DEALER_CLAIMS_MAP đè lên
  if (!window.DEALER_CLAIMS_MAP) window.DEALER_CLAIMS_MAP = new Map();
  list.forEach(c => {
    if (!c) return;
    if (c.vin) {
      const v = String(c.vin).trim().toUpperCase();
      window.DEALER_CLAIMS_MAP.set(v, c);
      if (v.length >= 6) window.DEALER_CLAIMS_MAP.set(v.slice(-6), c);
    }
    if (c.workOrderNumber) {
      window.DEALER_CLAIMS_MAP.set(String(c.workOrderNumber).trim().toUpperCase(), c);
    }
    if (c.warrantyClaimNumber) {
      window.DEALER_CLAIMS_MAP.set(String(c.warrantyClaimNumber).trim().toUpperCase(), c);
    }
  });

  // Hợp nhất vào nguồn Doanh thu (state.sources)
  window.parseDealerPortalJson(list, 'VinFast Dealer Portal (Real-time)', false);

  // Cập nhật đè Lệnh BH / ĐXBH lên các xe hiện tại mà không xóa danh sách xe
  if (state.checkXe && state.checkXe.orders) {
    state.checkXe.orders.forEach((o, i) => {
      const reNorm = normalizeOrder(o._raw || o, i);
      if (reNorm.bhCode && reNorm.bhCode !== '—') o.bhCode = reNorm.bhCode;
      if (reNorm.claimCode && reNorm.claimCode !== '—') o.claimCode = reNorm.claimCode;
      if (reNorm.claimAmount) o.claimAmount = reNorm.claimAmount;
      if (reNorm.claimStatus) o.claimStatus = reNorm.claimStatus;
      if (reNorm.checkStatus) o.checkStatus = reNorm.checkStatus;
      if (reNorm.hasBangCapNhat !== undefined) o.hasBangCapNhat = reNorm.hasBangCapNhat;
      o.bhCodeText = reNorm.bhCodeText;
      o.claimCodeText = reNorm.claimCodeText;
    });
    saveCheckXeOrders();
  }

  return list.length;
}
"""

# Replace handleServiceOsRealtimeOrders and handleDealerPortalRealtimeClaims to use upsert
old_handlers = """function handleServiceOsRealtimeOrders(orders, isSilent = true) {
  if (!Array.isArray(orders) || orders.length === 0) return;
  lastServiceOsSyncTime = Date.now();
  const prevCount = state.checkXe.orders ? state.checkXe.orders.length : 0;
  const normalized = orders.map((d, i) => normalizeOrder(d, i));
  state.checkXe.orders = normalized;
  saveCheckXeOrders();
  if (typeof renderCheckXe === 'function') renderCheckXe();
  
  const diff = normalized.length - prevCount;
  const diffTxt = diff > 0 ? ` (+${diff} xe mới)` : '';
  showRealtimeToast(`Đã tự động cập nhật ${normalized.length} xe từ ServiceOS!${diffTxt}`, '🚗');
  updateRealtimeStatusChip();
}

function handleDealerPortalRealtimeClaims(claims) {
  if (!claims) return;
  const list = Array.isArray(claims) ? claims : (claims.data || claims.rows || claims.items || []);
  if (!Array.isArray(list) || list.length === 0) return;
  
  lastDealerPortalSyncTime = Date.now();
  const count = window.parseDealerPortalJson(list, 'VinFast Dealer Portal (Real-time)', false);
  rebuildCheckXeOrders();
  renderAll();
  showRealtimeToast(`Đã tự động cập nhật ${count} đề xuất bảo hành từ Dealer Portal!`, '💼');
  updateRealtimeStatusChip();
}"""

new_handlers = upsert_code + """
function handleServiceOsRealtimeOrders(orders, isSilent = true) {
  if (!Array.isArray(orders) || orders.length === 0) return;
  lastServiceOsSyncTime = Date.now();
  
  // CẬP NHẬT ĐÈ LÊN XE ĐÃ CÓ - KHÔNG XÓA DỮ LIỆU CŨ
  const res = upsertServiceOsOrders(orders);
  
  // Cập nhật giao diện mượt mà tại chỗ (không xóa trắng hay nháy màn hình)
  if (typeof renderCheckXe === 'function') {
    renderCheckXe({ inPlace: true });
  }

  const changeTxt = res.addedCount > 0 ? ` (+${res.addedCount} xe mới)` : (res.updatedCount > 0 ? ` (cập nhật ${res.updatedCount} xe)` : '');
  showRealtimeToast(`Đã đồng bộ ${res.total} xe ServiceOS!${changeTxt}`, '🚗');
  updateRealtimeStatusChip();
}

function handleDealerPortalRealtimeClaims(claims) {
  if (!claims) return;
  lastDealerPortalSyncTime = Date.now();
  
  // CẬP NHẬT ĐÈ ĐỀ XUẤT DEALER PORTAL - KHÔNG XÓA DỮ LIỆU CŨ
  const count = upsertDealerPortalClaims(claims);
  
  renderAll();
  if (typeof renderCheckXe === 'function') {
    renderCheckXe({ inPlace: true });
  }
  showRealtimeToast(`Đã cập nhật ${count} đề xuất bảo hành từ Dealer Portal!`, '💼');
  updateRealtimeStatusChip();
}"""

if old_handlers in c:
    c = c.replace(old_handlers, new_handlers)
    print("Updated handlers with smooth in-place upsert logic!")
else:
    print("old_handlers not found")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("Done patching template2.html!")
