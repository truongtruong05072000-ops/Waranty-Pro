# -*- coding: utf-8 -*-
import sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace categorizeIssue and normalizeOrder and formatBangCapNhatHtml
s1 = text.find('function categorizeIssue(')
s2 = text.find('function loadCheckXeOrders(){')
assert s1 != -1 and s2 != -1, 'functions not found'

new_code = '''function matchCategoryFromFaults(faults, fallbackTxt){
  const faultList = Array.isArray(faults) ? faults.filter(Boolean) : (typeof faults === 'string' && faults.trim() ? [faults.trim()] : []);

  // 1. Ưu tiên TUYỆT ĐỐI theo Hạng mục lỗi (faults) được chọn trên ServiceOS
  if (faultList.length > 0) {
    const fCombined = faultList.join(' ').toLowerCase();
    for (let i = 1; i < ISSUE_CATEGORIES.length - 1; i++) {
      const cat = ISSUE_CATEGORIES[i];
      if ((cat.keywords && cat.keywords.some(kw => fCombined.includes(kw))) || 
          cat.name.toLowerCase() === fCombined || 
          fCombined.includes(cat.name.toLowerCase()) ||
          cat.name.toLowerCase().includes(fCombined)) {
        return cat;
      }
    }
    // Nếu có fault từ ServiceOS nhưng chưa có trong danh mục cố định, tạo danh mục chuẩn theo tên fault đó
    const cleanName = faultList[0].trim();
    return { 
      id: 'custom_' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_'), 
      name: cleanName, 
      icon: '🛠️' 
    };
  }

  // 2. Chỉ khi hoàn toàn không có Hạng mục lỗi trên ServiceOS mới xét nội dung chẩn đoán
  const cleanFallback = String(fallbackTxt || '').toLowerCase();
  if (cleanFallback && !cleanFallback.startsWith('biển số:')) {
    for (let i = 1; i < ISSUE_CATEGORIES.length - 1; i++) {
      const cat = ISSUE_CATEGORIES[i];
      if (cat.keywords && cat.keywords.some(kw => cleanFallback.includes(kw))) {
        return cat;
      }
    }
  }

  return ISSUE_CATEGORIES[ISSUE_CATEGORIES.length - 1]; // Lỗi khác
}

function formatBangCapNhatHtml(o){
  if (!o.hasBangCapNhat) {
    return `<span class="no-update-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.6"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg> Chưa có bảng cập nhật</span>`;
  }

  const fmtStatus = (st) => {
    if (!st) return '';
    const s = String(st).toLowerCase().replace(/\\s+/g, '_');
    if (s === 'checking' || s.includes('cho_kiem_tra')) return '⏳ Chờ kiểm tra';
    if (s === 'waiting_battery' || s.includes('cho_pin')) return '🔋 Chờ PIN';
    if (s === 'waiting_motor' || s.includes('cho_dong_co')) return '⚙️ Chờ Động cơ';
    if (s.includes('rejected') || s.includes('tu_choi')) return '❌ Từ chối';
    if (s === 'completed' || s === 'done' || s.includes('hoan_thanh')) return '✅ Hoàn thành';
    if (s === 'approved' || s === 'paid' || s.includes('da_duyet')) return '✅ Đã duyệt';
    if (s.includes('cap_2') || s.includes('l2')) return '⏳ Chờ cấp 2';
    if (s.includes('cap_1') || s.includes('l1')) return '⏳ Chờ cấp 1';
    if (s.includes('waiting_approval')) return '⏳ Chờ duyệt';
    return st;
  };

  const cards = [];

  const renderCard = (title, iconSvg, colors, d) => {
    return `
      <div class="update-card ${colors.cardClass}" style="${colors.cardStyle}">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:4px">
          <span class="update-card-tag" style="${colors.tagStyle}">
            ${iconSvg} ${esc(title)}
          </span>
          ${d.status ? `<span class="update-status-pill" style="${colors.statusStyle}">${esc(fmtStatus(d.status))}</span>` : ''}
        </div>
        ${d.bhCode ? `
          <div class="update-code-row">
            <span class="update-label">Lệnh BH:</span>
            <span class="update-mono-code">${esc(d.bhCode)}</span>
          </div>` : ''}
        ${d.claimCode ? `
          <div class="update-code-row">
            <span class="update-label">Số ĐXBH:</span>
            <span class="update-mono-claim">${esc(d.claimCode)}</span>
          </div>` : ''}
        ${d.serial ? `
          <div class="update-serial-row">
            <span class="update-label">SN:</span>
            <span class="update-mono-serial" title="${esc(d.serial)}">${esc(d.serial)}</span>
          </div>` : ''}
        ${d.date ? `
          <div class="update-date-row">
            <span style="opacity:0.7">📅</span> ${esc(d.date)}
          </div>` : ''}
      </div>
    `;
  };

  const catId = o.category ? o.category.id : '';
  const faultLower = (o.faultList || []).join(' ').toLowerCase();

  // 1. Esim
  const isEsim = catId === 'esim' || o.hasEsim || faultLower.includes('esim');
  if (isEsim) {
    cards.push(renderCard('Esim', '📶', {
      cardClass: 'card-esim',
      cardStyle: 'background:linear-gradient(135deg, rgba(14,165,233,0.14), rgba(15,23,42,0.85));border:1px solid rgba(56,189,248,0.4);box-shadow:0 2px 10px rgba(14,165,233,0.18)',
      tagStyle: 'background:rgba(14,165,233,0.25);color:#38bdf8;border:1px solid rgba(56,189,248,0.5)',
      statusStyle: 'background:rgba(245,158,11,0.22);color:#fde047;border:1px solid rgba(245,158,11,0.4)'
    }, {
      bhCode: o.bhCode,
      claimCode: o.claimCode,
      serial: o.esimSerial,
      status: o.bhOrderStatus || o.warrantyStatus || 'Chờ kiểm tra',
      date: o.dateStr
    }));
  }

  // 2. PIN (Chỉ render nếu thực sự có serial PIN, tháo PIN hoặc category là PIN)
  const isPin = Boolean(o.pinSerial) || Boolean(o.pinType) || (catId === 'pin' && !isEsim && (o.removedAt || o.bhCode || o.warrantyStatus));
  if (isPin) {
    cards.push(renderCard('PIN Cao Áp', '🔋', {
      cardClass: 'card-pin',
      cardStyle: 'background:linear-gradient(135deg, rgba(16,185,129,0.14), rgba(15,23,42,0.85));border:1px solid rgba(52,211,153,0.4);box-shadow:0 2px 10px rgba(16,185,129,0.18)',
      tagStyle: 'background:rgba(16,185,129,0.25);color:#34d399;border:1px solid rgba(52,211,153,0.5)',
      statusStyle: 'background:rgba(16,185,129,0.22);color:#6ee7b7;border:1px solid rgba(16,185,129,0.4)'
    }, {
      bhCode: (!isEsim ? o.bhCode : ''),
      claimCode: o.claimCode,
      serial: o.pinSerial,
      status: o.warrantyStatus || o.bhOrderStatus || 'waiting_battery',
      date: o.removedAt ? `Tháo: ${formatDisplayDate(o.removedAt)}` : o.dateStr
    }));
  }

  // 3. Động cơ (Chỉ render nếu thực sự có serial động cơ hoặc category là Động cơ)
  const isMotor = Boolean(o.motorSerial) || Boolean(o.motorType) || (catId === 'motor' && !isEsim && !isPin);
  if (isMotor) {
    cards.push(renderCard('Động Cơ', '⚡', {
      cardClass: 'card-motor',
      cardStyle: 'background:linear-gradient(135deg, rgba(168,85,247,0.14), rgba(15,23,42,0.85));border:1px solid rgba(192,132,252,0.4);box-shadow:0 2px 10px rgba(168,85,247,0.18)',
      tagStyle: 'background:rgba(168,85,247,0.25);color:#c084fc;border:1px solid rgba(192,132,252,0.5)',
      statusStyle: 'background:rgba(168,85,247,0.22);color:#e9d5ff;border:1px solid rgba(168,85,247,0.4)'
    }, {
      bhCode: (!isEsim && !isPin ? o.bhCode : ''),
      claimCode: o.claimCode,
      serial: o.motorSerial,
      status: o.warrantyStatus || o.bhOrderStatus || 'waiting_motor',
      date: o.removedAt ? `Tháo: ${formatDisplayDate(o.removedAt)}` : o.dateStr
    }));
  }

  // 4. Bộ sạc
  const isCharger = Boolean(o.chargerSerial) || (catId === 'charger' && !isEsim && !isPin && !isMotor);
  if (isCharger) {
    cards.push(renderCard('Bộ Sạc', '🔌', {
      cardClass: 'card-charger',
      cardStyle: 'background:linear-gradient(135deg, rgba(245,158,11,0.14), rgba(15,23,42,0.85));border:1px solid rgba(251,191,36,0.4);box-shadow:0 2px 10px rgba(245,158,11,0.18)',
      tagStyle: 'background:rgba(245,158,11,0.25);color:#fbbf24;border:1px solid rgba(251,191,36,0.5)',
      statusStyle: 'background:rgba(245,158,11,0.22);color:#fde047;border:1px solid rgba(245,158,11,0.4)'
    }, {
      bhCode: o.bhCode,
      claimCode: o.claimCode,
      serial: o.chargerSerial,
      status: o.warrantyStatus || o.bhOrderStatus || 'Chờ kiểm tra',
      date: o.dateStr
    }));
  }

  // 5. Nếu không khớp 4 loại trên nhưng có Lệnh BH
  if (cards.length === 0) {
    const tagName = (o.category && o.category.id !== 'other') ? o.category.name.replace(/^Lỗi\\s+/i, '') : 'Bảo hành';
    cards.push(renderCard(tagName, '📦', {
      cardClass: 'card-generic',
      cardStyle: 'background:linear-gradient(135deg, rgba(2,132,199,0.14), rgba(15,23,42,0.85));border:1px solid rgba(56,189,248,0.4);box-shadow:0 2px 10px rgba(2,132,199,0.18)',
      tagStyle: 'background:rgba(2,132,199,0.25);color:#38bdf8;border:1px solid rgba(56,189,248,0.5)',
      statusStyle: 'background:rgba(245,158,11,0.22);color:#fde047;border:1px solid rgba(245,158,11,0.4)'
    }, {
      bhCode: o.bhCode,
      claimCode: o.claimCode,
      serial: o.pinSerial || o.motorSerial || o.chargerSerial,
      status: o.bhOrderStatus || o.warrantyStatus || 'Chờ kiểm tra',
      date: o.removedAt ? `Tháo: ${formatDisplayDate(o.removedAt)}` : o.dateStr
    }));
  }

  return cards.join('');
}

// Chuẩn hóa một bản ghi xe theo đúng chuẩn ServiceOS
function normalizeOrder(d, i){
  const wo = String(d.wo || d.code || d.dms_ro_code || '—').trim();
  const plate = String(d.plate || '—').trim();
  const vin = String(d.vin || '—').trim();
  const vehicle = String(d.vehicle || d.model || '—').trim();
  const customer = String(d.customer || d.customer_name || '—').trim();
  const tech = String(d.tech || d.technician_name || 'Chưa phân công').trim();
  const status = String(d.status || d.status_label || 'Trong xưởng').trim();
  const warrantyStatus = String(d.warrantyStatus || d.warranty_status || d.dms_warranty_status || '').trim();

  // 1. HẠNG MỤC LỖI (Lấy trực tiếp từ faults trên ServiceOS)
  const faultList = Array.isArray(d.faults) ? d.faults.filter(Boolean) : (typeof d.faults === 'string' && d.faults.trim() ? [d.faults.trim()] : []);
  const faultStr = faultList.join(', ');

  // Nội dung kiểm tra tự do (lọc bỏ chuỗi checklist dài nếu có)
  const rawDiag = String(d.diagnosis || d.symptoms || d.content || d.diag || '').trim();
  const cleanDiag = rawDiag.startsWith('Biển số:') ? '' : rawDiag;

  // Mô tả ngắn gọn: nếu có nội dung chẩn đoán riêng (vd: LỖI ĐV) thì hiển thị, ngược lại hiển thị faultStr
  let issue = faultStr || cleanDiag || String(d.issue || '').trim() || 'Kiểm tra';
  let issueDesc = cleanDiag && cleanDiag.toLowerCase() !== faultStr.toLowerCase() ? cleanDiag : (faultStr || issue);

  if (!issueDesc && d.customer_name && d.source === 'retail') {
    issueDesc = d.customer_name;
  }
  const hasLoi = Boolean(faultList.length > 0 || (hasTextContent(issueDesc) && (issueDesc.toLowerCase().includes('lỗi') || issueDesc.toLowerCase().includes('loi'))));

  // Phân loại danh mục: ƯU TIÊN 100% THEO HẠNG MỤC LỖI (faults)
  const category = matchCategoryFromFaults(faultList, cleanDiag);

  // 2. GHI CHÚ KTV
  const note = String(d.note || d.foreman_note || d.advisor_note || '').trim();
  const hasKtvNote = hasTextContent(note);

  // 3. BẢNG CẬP NHẬT PHÍA DƯỚI (Lệnh BH, ĐXBH, PIN, Động cơ, Esim, Sạc...)
  const pinSerial = String(d.pinSerial || d.battery_serial_old || d.battery_serial_new || '').trim();
  const motorSerial = String(d.motorSerial || d.motor_serial_old || d.motor_serial_new || '').trim();
  const chargerSerial = String(d.chargerSerial || d.charger_serial || '').trim();
  const removedAt = String(d.removedAt || d.parts_removed_at || d.motor_removed_at || '').trim();
  const bhCode = String(d.bhCode || d.dms_warranty_code || d.bh_order_code || '').trim();
  const claimCode = String(d.claimCode || d.dms_claim_code || '').trim();
  const bhOrderStatus = String(d.bhOrderStatus || d.dms_warranty_status || '').trim();
  const pinType = String(d.pinType || d.battery_repair_type || '').trim();
  const motorType = String(d.motorType || d.motor_repair_type || '').trim();

  const kinds = Array.isArray(d.warranty_kinds) ? d.warranty_kinds.filter(Boolean) : [];
  const extra = (d.warranty_extra && typeof d.warranty_extra === 'object') ? d.warranty_extra : {};

  const hasEsim = category.id === 'esim' || kinds.includes('esim') || Boolean(extra.esim) || faultStr.toLowerCase().includes('esim');
  const hasPin = Boolean(pinSerial) || Boolean(pinType) || kinds.includes('pin');
  const hasMotor = Boolean(motorSerial) || Boolean(motorType) || kinds.includes('motor');
  const hasCharger = Boolean(chargerSerial) || kinds.includes('charger');

  const updateParts = [];
  if (hasEsim) updateParts.push(`Esim${bhCode ? ': ' + bhCode : ''}`);
  if (pinSerial) updateParts.push(`PIN: ${pinSerial}`);
  if (motorSerial) updateParts.push(`ĐC: ${motorSerial}`);
  if (chargerSerial) updateParts.push(`Sạc: ${chargerSerial}`);
  if (removedAt) updateParts.push(`Tháo: ${formatDisplayDate(removedAt)}`);
  if (bhCode && !hasEsim) updateParts.push(`Lệnh BH: ${bhCode}`);
  if (claimCode) updateParts.push(`ĐXBH: ${claimCode}`);
  if (pinType) updateParts.push(`Loại PIN: ${pinType}`);
  if (warrantyStatus && warrantyStatus.toLowerCase() !== 'checking' && warrantyStatus.toLowerCase() !== 'none') {
    updateParts.push(`BH: ${warrantyStatus}`);
  }

  const updateTableText = updateParts.join(' · ');

  const hasBangCapNhat = Boolean(
    bhCode || 
    claimCode || 
    pinSerial || 
    motorSerial || 
    chargerSerial || 
    removedAt || 
    hasEsim ||
    updateParts.length > 0 ||
    kinds.length > 0 || 
    Object.keys(extra).length > 0 ||
    (warrantyStatus && warrantyStatus.toLowerCase() !== 'none' && warrantyStatus.toLowerCase() !== '')
  );

  // Tính trạng thái Check theo 4 quy tắc
  const checkStatus = evaluateCheckStatus(hasLoi, hasKtvNote, hasBangCapNhat);

  // Chuẩn hóa ngày nhận xe
  const rawDate = d.dateStr || d.received_at || d.created_at || new Date().toISOString().slice(0, 10);
  const isoDate = formatIsoDate(rawDate) || new Date().toISOString().slice(0, 10);
  const dispDate = formatDisplayDate(isoDate);

  const order = {
    id: (d && d.id) || ('ord_' + (wo || plate || i).replace(/[^a-zA-Z0-9]/g, '') + '_' + i),
    wo: wo,
    plate: plate,
    vin: vin,
    vehicle: vehicle,
    customer: customer,
    tech: tech,
    issue: issue,
    issueDesc: issueDesc,
    faultList: faultList,
    faultStr: faultStr,
    note: note,
    status: status,
    warrantyStatus: warrantyStatus,
    pinSerial: pinSerial,
    motorSerial: motorSerial,
    chargerSerial: chargerSerial,
    removedAt: removedAt,
    bhCode: bhCode,
    claimCode: claimCode,
    bhOrderStatus: bhOrderStatus,
    hasEsim: hasEsim,
    hasPin: hasPin,
    hasMotor: hasMotor,
    hasCharger: hasCharger,
    updateTableText: updateTableText,
    hasLoi: hasLoi,
    hasKtvNote: hasKtvNote,
    hasBangCapNhat: hasBangCapNhat,
    checkStatus: checkStatus,
    category: category,
    dateStr: dispDate,
    isoDate: isoDate,
    isChecked: checkStatus.code === 'checked'
  };

  return order;
}

'''

text = text[:s1] + new_code + text[s2:]

# Also update the render cell in renderCheckXe so it renders o.issueDesc cleanly
old_issue_cell = '''        <td class="l part-name-cell">
          <div class="custom-cat-badge">${esc(o.category.name)}</div>
          <div style="font-weight:600;line-height:1.4;margin-top:3px;color:#f8fafc">${esc(o.issue)}</div>
        </td>'''

new_issue_cell = '''        <td class="l part-name-cell">
          <div class="custom-cat-badge">${esc(o.category.name)}</div>
          <div style="font-weight:600;line-height:1.4;margin-top:4px;color:#f8fafc;font-size:12.5px">${esc(o.issueDesc || o.issue)}</div>
        </td>'''

if old_issue_cell in text:
    text = text.replace(old_issue_cell, new_issue_cell, 1)
    print('Updated issue cell in table to use issueDesc!')

with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_build/PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated PhanTichBaoHanh.html, _deploy/index.html!')
