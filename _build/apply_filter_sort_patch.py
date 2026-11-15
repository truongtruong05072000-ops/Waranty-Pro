# -*- coding: utf-8 -*-
import json
import re

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update window.setCheckXeColFilter and helper functions
filter_helpers = '''
window.setCheckXeViewMode = function(mode){
  state.checkXe.viewMode = mode;
  renderCheckXe();
};

window.setCheckXeSort = function(col){
  if(state.checkXe.sortBy === col){
    state.checkXe.sortDir = state.checkXe.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    state.checkXe.sortBy = col;
    state.checkXe.sortDir = 'asc';
  }
  renderCheckXe();
};
'''

if 'window.setCheckXeViewMode' not in content:
    idx = content.find('function setCheckXeColFilter(key, val){')
    if idx != -1:
        content = content[:idx] + filter_helpers + content[idx:]
        print("Injected setCheckXeViewMode and setCheckXeSort!")

# 2. Update resetCheckXeFilters
old_reset = '''window.resetCheckXeFilters = function(){
  state.checkXe.filterCategory = 'all';
  state.checkXe.filterStatus = 'all';
  state.checkXe.filterDate = 'all';
  state.checkXe.filterTech = '';
  state.checkXe.filterVehicle = '';
  state.checkXe.filterHasTable = 'all';
  state.checkXe.filterHasNote = 'all';
  state.checkXe.searchPlate = '';
  state.checkXe.searchQuery = '';
  state.checkXe.sortBy = 'stt';
  state.checkXe.sortDir = 'asc';
  renderCheckXe();
};'''

new_reset = '''window.resetCheckXeFilters = function(){
  state.checkXe.filterCategory = 'all';
  state.checkXe.filterStatus = 'all';
  state.checkXe.filterDate = 'all';
  state.checkXe.filterTech = '';
  state.checkXe.filterVehicle = '';
  state.checkXe.filterHasTable = 'all';
  state.checkXe.filterHasNote = 'all';
  state.checkXe.filterPartStatus = 'all';
  state.checkXe.searchPartSerial = '';
  state.checkXe.searchBhCode = '';
  state.checkXe.filterRemovedDate = 'all';
  state.checkXe.searchPlate = '';
  state.checkXe.searchQuery = '';
  state.checkXe.sortBy = 'stt';
  state.checkXe.sortDir = 'asc';
  renderCheckXe();
};'''

content = content.replace(old_reset, new_reset)
print("Updated resetCheckXeFilters!")

# 3. Update filtering in renderCheckXe
old_filter_block = '''  // 6. Lọc Bảng cập nhật phía dưới
  if(state.checkXe.filterHasTable === 'yes'){
    filtered = filtered.filter(o => o.hasBangCapNhat);
  } else if(state.checkXe.filterHasTable === 'no'){
    filtered = filtered.filter(o => !o.hasBangCapNhat);
  }'''

new_filter_block = '''  // 6. Lọc Bảng cập nhật phía dưới
  if(state.checkXe.filterHasTable === 'yes'){
    filtered = filtered.filter(o => o.hasBangCapNhat);
  } else if(state.checkXe.filterHasTable === 'no'){
    filtered = filtered.filter(o => !o.hasBangCapNhat);
  }
  // 6b. Lọc theo Trạng thái linh kiện
  if(state.checkXe.filterPartStatus && state.checkXe.filterPartStatus !== 'all'){
    if(state.checkXe.filterPartStatus === 'has_part'){
      filtered = filtered.filter(o => o.hasBangCapNhat);
    } else if(state.checkXe.filterPartStatus === 'none'){
      filtered = filtered.filter(o => !o.hasBangCapNhat);
    } else {
      const qps = state.checkXe.filterPartStatus.toLowerCase();
      filtered = filtered.filter(o => {
        const rawS = String(o.warrantyStatus || o.bhOrderStatus || '').toLowerCase();
        const dispS = String(o.partStatusText || '').toLowerCase();
        return rawS.includes(qps) || dispS.includes(qps);
      });
    }
  }
  // 6c. Tìm kiếm Số máy / Serial PIN
  if(state.checkXe.searchPartSerial){
    const qSer = norm(state.checkXe.searchPartSerial);
    filtered = filtered.filter(o => norm(o.partSerialText || '').includes(qSer) || norm(o.motorSerial || '').includes(qSer) || norm(o.pinSerial || '').includes(qSer));
  }
  // 6d. Tìm kiếm Lệnh BH / ĐXBH
  if(state.checkXe.searchBhCode){
    const qBh = norm(state.checkXe.searchBhCode);
    filtered = filtered.filter(o => norm(o.bhCodeText || '').includes(qBh) || norm(o.claimCodeText || '').includes(qBh) || norm(o.bhCode || '').includes(qBh) || norm(o.claimCode || '').includes(qBh));
  }
  // 6e. Lọc Ngày tháo linh kiện
  if(state.checkXe.filterRemovedDate && state.checkXe.filterRemovedDate !== 'all'){
    if(state.checkXe.filterRemovedDate === 'has_date'){
      filtered = filtered.filter(o => o.partRemovedDateText && o.partRemovedDateText !== '—');
    } else if(state.checkXe.filterRemovedDate === 'no_date'){
      filtered = filtered.filter(o => !o.partRemovedDateText || o.partRemovedDateText === '—');
    }
  }'''

content = content.replace(old_filter_block, new_filter_block)
print("Updated filter block in renderCheckXe!")

# 4. Update Sorting in renderCheckXe
old_sort_block = '''      else if(sortBy === 'bang') {
        vA = a.hasBangCapNhat ? 1 : 0;
        vB = b.hasBangCapNhat ? 1 : 0;
        return sortDir === 'desc' ? vB - vA : vA - vB;
      }'''

new_sort_block = '''      else if(sortBy === 'bang') {
        vA = a.hasBangCapNhat ? 1 : 0;
        vB = b.hasBangCapNhat ? 1 : 0;
        return sortDir === 'desc' ? vB - vA : vA - vB;
      }
      else if(sortBy === 'part_status') { vA = a.partStatusText; vB = b.partStatusText; }
      else if(sortBy === 'part_serial') { vA = a.partSerialText; vB = b.partSerialText; }
      else if(sortBy === 'part_removed') { vA = a.partRemovedDateText; vB = b.partRemovedDateText; }
      else if(sortBy === 'bh_code') { vA = a.bhCodeText; vB = b.bhCodeText; }'''

content = content.replace(old_sort_block, new_sort_block)
print("Updated sort block in renderCheckXe!")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Saved filter and sort changes to app_template2.html!")
