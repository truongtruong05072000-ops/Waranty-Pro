# -*- coding: utf-8 -*-
import json
import re

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update evaluateCheckStatus
old_eval_block = '''function evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat){
  // Quy tắc 4: Có lỗi + có ghi chú KTV nhưng chưa có bảng cập nhật phía dưới -> Cần check lại
  if(hasLoi && hasKtvNote && !hasBangCapNhat){
    return { code: 'recheck', label: '⏳ Cần check lại', badgeClass: 'recheck', desc: 'Có ghi chú KTV nhưng chưa cập nhật bảng linh kiện/PIN' };
  }

  // Quy tắc 1: Có lỗi nhưng không có ghi chú KTV hay bảng cập nhật -> Mặc định chưa check
  if(hasLoi && !hasKtvNote && !hasBangCapNhat){
    return { code: 'unchecked', label: '🔴 Chưa check', badgeClass: 'unchecked', desc: 'Chưa có ghi chú KTV & chưa cập nhật bảng' };
  }

  // Quy tắc 2: Không có lỗi + không có ghi chú KTV mà có bảng cập nhật -> Đã check
  if(!hasLoi && !hasKtvNote && hasBangCapNhat){
    return { code: 'checked', label: '✅ Đã check', badgeClass: 'checked', desc: 'Đã cập nhật bảng linh kiện/PIN' };
  }

  // Quy tắc 3: Có lỗi + có ghi chú KTV + có bảng cập nhật -> Đã check
  if(hasLoi && hasKtvNote && hasBangCapNhat){
    return { code: 'checked', label: '✅ Đã check', badgeClass: 'checked', desc: 'Đã có ghi chú KTV và cập nhật bảng hoàn tất' };
  }

  // Trường hợp có lỗi + có bảng cập nhật (kể cả chưa có ghi chú) -> Đã check
  if(hasLoi && hasBangCapNhat){
    return { code: 'checked', label: '✅ Đã check', badgeClass: 'checked', desc: 'Đã cập nhật bảng linh kiện' };
  }

  // Trường hợp xe có ghi chú KTV -> Đã check
  if(hasKtvNote){
    return { code: 'checked', label: '✅ Đã check', badgeClass: 'checked', desc: 'Đã có ghi chú KTV' };
  }

  // Xe bảo dưỡng/sửa chữa bình thường không có lỗi hay thông tin bảo hành
  return { code: 'normal', label: '⚪ Xe bình thường', badgeClass: 'normal', desc: 'Sửa chữa/bảo dưỡng thông thường' };
}'''

new_eval_block = '''function evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat){
  // QUY TẮC MỚI THEO YÊU CẦU NGƯỜI DÙNG:
  // "xe không lỗi thì tính là trạng thái check là xe không lỗi"
  if(!hasLoi){
    return { 
      code: 'no_fault', 
      label: '✅ Xe không lỗi', 
      badgeClass: 'no_fault', 
      desc: 'Xe bình thường, không có hạng mục lỗi' 
    };
  }

  // Nếu CÓ LỖI:
  // 1. Có lỗi + có bảng cập nhật phía dưới (hoặc đã có ghi chú KTV hoàn tất) -> Đã check
  if(hasBangCapNhat || hasKtvNote){
    return { 
      code: 'checked', 
      label: '✅ Đã check', 
      badgeClass: 'checked', 
      desc: hasBangCapNhat ? 'Đã cập nhật bảng linh kiện/PIN/Động cơ' : 'Đã có ghi chú kiểm tra KTV' 
    };
  }

  // 2. Có lỗi nhưng CHƯA có ghi chú KTV VÀ CHƯA có bảng cập nhật -> Mặc định Chưa check
  return { 
    code: 'unchecked', 
    label: '🔴 Chưa check', 
    badgeClass: 'unchecked', 
    desc: 'Có lỗi nhưng chưa kiểm tra & chưa cập nhật bảng linh kiện' 
  };
}

function formatPartStatusText(st, kind){
  if(!st || st === '—' || st === '-') return '—';
  const s = String(st).toLowerCase().replace(/\\s+/g, '_');
  if(s.includes('cho_lap_dong_co') || s.includes('cho_lap_dc')) return 'Chờ lắp động cơ';
  if(s === 'waiting_motor' || s.includes('cho_dong_co')) return 'Chờ Động cơ';
  if(s === 'waiting_battery' || s.includes('cho_pin')) return 'Chờ PIN';
  if(s === 'checking' || s.includes('cho_kiem_tra')) return 'Chờ kiểm tra';
  if(s.includes('rejected') || s.includes('tu_choi')) return 'Từ chối';
  if(s.includes('completed') || s.includes('done') || s.includes('hoan_thanh')) return 'Hoàn thành';
  if(s.includes('approved') || s.includes('paid') || s.includes('da_duyet') || s.includes('phe_duyet')) return 'Đã phê duyệt';
  if(s.includes('waiting_approval') || s.includes('cho_duyet')) return 'Chờ duyệt';
  return String(st);
}'''

if old_eval_block in html:
    html = html.replace(old_eval_block, new_eval_block, 1)
    print("Replaced evaluateCheckStatus!")
else:
    print("Could not find exact old_eval_block, trying regex...")
    m = re.search(r'function evaluateCheckStatus\(hasLoi,[\s\S]*?\n\}', html)
    if m:
        html = html[:m.start()] + new_eval_block + html[m.end():]
        print("Replaced evaluateCheckStatus via regex!")

# 2. Update state.checkXe properties
old_state_block = '''  filterVehicle: '',       // Lọc theo Dòng xe
  filterHasTable: 'all',   // 'all', 'yes', 'no'
  filterHasNote: 'all',    // 'all', 'yes', 'no'
  searchPlate: '',         // Tìm kiếm theo Biển số / Mã WO riêng
  searchQuery: '',
  sortBy: 'stt',
  sortDir: 'asc'
};'''

new_state_block = '''  filterVehicle: '',       // Lọc theo Dòng xe
  filterPartStatus: 'all',    // Lọc theo Trạng thái linh kiện (Chờ Động cơ, Chờ PIN, Chờ kiểm tra...)
  searchPartSerial: '',       // Tìm kiếm Số máy / Serial PIN
  searchBhCode: '',           // Tìm kiếm Mã Lệnh BH / ĐXBH
  filterRemovedDate: 'all',   // Lọc theo Ngày tháo LK
  viewMode: 'table',          // 'table' (Các cột chi tiết) hoặc 'card' (Thẻ ServiceOS)
  filterHasTable: 'all',   // 'all', 'yes', 'no'
  filterHasNote: 'all',    // 'all', 'yes', 'no'
  searchPlate: '',         // Tìm kiếm theo Biển số / Mã WO riêng
  searchQuery: '',
  sortBy: 'stt',
  sortDir: 'asc'
};'''

if old_state_block in html:
    html = html.replace(old_state_block, new_state_block, 1)
    print("Replaced state.checkXe properties!")
else:
    print("Could not find old_state_block, searching...")
    idx = html.find("filterVehicle: '',")
    if idx != -1:
        end_idx = html.find("sortDir: 'asc'\n};", idx)
        if end_idx != -1:
            html = html[:idx] + new_state_block + html[end_idx + len("sortDir: 'asc'\n};"):]
            print("Replaced state.checkXe properties via index slice!")

# 3. Add part fields in normalizeOrder return object
target_str = "claimApprovedAt: d.claim_approved_at || '',"
new_fields = '''claimApprovedAt: d.claim_approved_at || '',
    partStatusText: formatPartStatusText(bhOrderStatus || warrantyStatus, (kinds && kinds[0]) || ''),
    partSerialText: motorSerial || pinSerial || chargerSerial || '—',
    partRemovedDateText: motorRemovedAt ? formatDisplayDate(motorRemovedAt) : (partsRemovedAt ? formatDisplayDate(partsRemovedAt) : (removedAt ? formatDisplayDate(removedAt) : '—')),
    bhCodeText: bhCode || '—',
    claimCodeText: claimCode || '—','''

if target_str in html:
    html = html.replace(target_str, new_fields, 1)
    print("Added part fields in normalizeOrder!")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated _build/app_template2.html successfully!")
