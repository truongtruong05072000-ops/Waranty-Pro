import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inside renderCheckXe, update filtering logic
old_filter_scope = r'''  // 1. Lọc Hạng mục
  if(state.checkXe.filterCategory !== 'all'){'''

new_filter_additions = r'''  // Lọc Chưa làm Đề xuất bảo hành (Cảnh báo lệnh có Phân loại TT là bảo hành nhưng chưa có mã WC)
  if(state.checkXe.filterUnsubmitted === 'yes'){
    filtered = filtered.filter(o => o.isUnsubmittedWarranty);
  }

  // Lọc theo Nhóm khách hàng (GSM, Bship, Khách lẻ, Doanh nghiệp)
  if(state.checkXe.filterCustGroup && state.checkXe.filterCustGroup !== 'all'){
    filtered = filtered.filter(o => o.customerGroup && o.customerGroup.id === state.checkXe.filterCustGroup);
  }

  // 1. Lọc Hạng mục
  if(state.checkXe.filterCategory !== 'all'){'''

if old_filter_scope in content:
    content = content.replace(old_filter_scope, new_filter_additions, 1)
    print("Updated renderCheckXe filter conditions.")

# 2. Update isFiltering check
old_is_filtering = r'''  const isFiltering = state.checkXe.filterCategory !== 'all' || 
                      state.checkXe.filterStatus !== 'all' || 
                      state.checkXe.filterDate !== 'all' || '''

new_is_filtering = r'''  const isFiltering = state.checkXe.filterCategory !== 'all' || 
                      state.checkXe.filterStatus !== 'all' || 
                      state.checkXe.filterDate !== 'all' || 
                      Boolean(state.checkXe.filterCustGroup && state.checkXe.filterCustGroup !== 'all') ||
                      Boolean(state.checkXe.filterUnsubmitted === 'yes') || '''

if old_is_filtering in content:
    content = content.replace(old_is_filtering, new_is_filtering, 1)
    print("Updated isFiltering variable.")

# 3. Update resetCheckXeFilters
old_reset = r'''window.resetCheckXeFilters = function(){
  state.checkXe.filterCategory = 'all';
  state.checkXe.filterStatus = 'all';
  state.checkXe.filterDate = 'all';'''

new_reset = r'''window.resetCheckXeFilters = function(){
  state.checkXe.filterCategory = 'all';
  state.checkXe.filterStatus = 'all';
  state.checkXe.filterDate = 'all';
  state.checkXe.filterCustGroup = '';
  state.checkXe.filterUnsubmitted = 'all';'''

if old_reset in content:
    content = content.replace(old_reset, new_reset, 1)
    print("Updated resetCheckXeFilters.")

# 4. In carInfoCellHtml, add Customer Group tag and Unsubmitted Warning
old_car_info_cell = r'''    // Cell thông tin xe kết hợp (Biển số + Dòng xe + WO + VIN) cực gọn gàng và sang trọng
    const carInfoCellHtml = `
      <div class="car-info-cell">
        <div class="car-info-row1">
          <span class="car-plate">${esc(o.plate || '—')}</span>
          ${o.vehicle && o.vehicle !== '—' ? `<span class="car-vehicle-pill">${esc(o.vehicle)}</span>` : ''}
        </div>
        <div class="car-info-row2">
          <span class="car-wo" title="Mã phiếu sửa chữa WO">${esc(o.wo || '—')}</span>
          ${o.vin ? `<span class="car-vin" title="Số khung VIN">VIN: ...${esc(String(o.vin).slice(-6))}</span>` : ''}
        </div>
      </div>
    `;'''

new_car_info_cell = r'''    // Cell thông tin xe kết hợp (Biển số + Dòng xe + WO + VIN + Nhóm Khách hàng)
    const custGrp = o.customerGroup || getCustomerGroup(o.customer, o.customerCompanyName);
    const carInfoCellHtml = `
      <div class="car-info-cell">
        <div class="car-info-row1">
          <span class="car-plate">${esc(o.plate || '—')}</span>
          ${o.vehicle && o.vehicle !== '—' ? `<span class="car-vehicle-pill">${esc(o.vehicle)}</span>` : ''}
          <span class="cust-tag" style="font-size:10px;padding:1px 6px;border-radius:4px;font-weight:700;background:${custGrp.color}22;color:${custGrp.color};border:1px solid ${custGrp.color}45" title="Khách hàng: ${esc(o.customer)}">${custGrp.tag}</span>
        </div>
        <div class="car-info-row2">
          <span class="car-wo" title="Mã phiếu sửa chữa WO">${esc(o.wo || '—')}</span>
          ${o.vin ? `<span class="car-vin" title="Số khung VIN">VIN: ...${esc(String(o.vin).slice(-6))}</span>` : ''}
          ${o.isUnsubmittedWarranty ? `<span style="font-size:10px;padding:1px 5px;border-radius:3px;font-weight:700;background:rgba(239,68,68,0.22);color:#fca5a5;border:1px solid rgba(239,68,68,0.5)" title="Lệnh có Phân loại TT là Bảo hành nhưng chưa có mã ĐXBH trên Dealer Portal">⚠️ Chưa làm ĐX</span>` : ''}
        </div>
      </div>
    `;'''

if old_car_info_cell in content:
    content = content.replace(old_car_info_cell, new_car_info_cell, 1)
    print("Updated carInfoCellHtml with Customer tag and Unsubmitted Warning.")

# 5. In Smart Filter Bar, add Customer Group dropdown and Unsubmitted quick button
old_smart_filter_bar = r'''        <!-- Lọc Xe -->
        <div class="filter-select-wrapper">
          <span class="filter-label">Xe:</span>'''

new_smart_filter_bar = r'''        <!-- Lọc Nhóm Khách Hàng -->
        <div class="filter-select-wrapper">
          <span class="filter-label">Khách:</span>
          <select class="filter-select" onchange="setCheckXeColFilter('filterCustGroup', this.value)">
            <option value="">-- Mọi nhóm khách --</option>
            <option value="gsm" ${state.checkXe.filterCustGroup === 'gsm' ? 'selected' : ''}>🚕 GSM (Xanh SM)</option>
            <option value="bship" ${state.checkXe.filterCustGroup === 'bship' ? 'selected' : ''}>🛵 Bship</option>
            <option value="retail" ${state.checkXe.filterCustGroup === 'retail' ? 'selected' : ''}>👤 Khách lẻ</option>
            <option value="corp" ${state.checkXe.filterCustGroup === 'corp' ? 'selected' : ''}>🏢 Doanh nghiệp</option>
          </select>
        </div>

        <!-- Lọc Xe -->
        <div class="filter-select-wrapper">
          <span class="filter-label">Xe:</span>'''

if old_smart_filter_bar in content:
    content = content.replace(old_smart_filter_bar, new_smart_filter_bar, 1)
    print("Added Customer Group dropdown to Smart Filter Bar.")

# In Date & Scope filter bar, add Unsubmitted quick button
old_scope_bar = r'''        <button class="scope-toggle-btn ${state.checkXe.filterScope === 'all' ? 'active' : ''}" onclick="setCheckXeScope('all')">
          Tất cả xe trong xưởng (${totalAll})
        </button>'''

new_scope_bar = r'''        <button class="scope-toggle-btn ${state.checkXe.filterScope === 'all' ? 'active' : ''}" onclick="setCheckXeScope('all')">
          Tất cả xe trong xưởng (${totalAll})
        </button>
        ${allOrders.filter(o => o.isUnsubmittedWarranty).length > 0 ? `
          <button class="scope-toggle-btn ${state.checkXe.filterUnsubmitted === 'yes' ? 'active' : ''}" style="border-color:rgba(239,68,68,0.5);color:#fca5a5;background:rgba(239,68,68,0.18);font-weight:700" onclick="setCheckXeColFilter('filterUnsubmitted', state.checkXe.filterUnsubmitted === 'yes' ? 'all' : 'yes')" title="Lọc các lệnh sửa chữa có Phân loại TT là Bảo hành nhưng chưa có mã ĐXBH">
            ⚠️ Chưa làm ĐX (${allOrders.filter(o => o.isUnsubmittedWarranty).length})
          </button>
        ` : ''}'''

if old_scope_bar in content:
    content = content.replace(old_scope_bar, new_scope_bar, 1)
    print("Added Unsubmitted Warranty quick filter button in Scope bar.")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Part 3 patch completed successfully.")
