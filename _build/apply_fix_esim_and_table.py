# -*- coding: utf-8 -*-
import sys, os, subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('Initial length:', len(text))

# ==============================================================================
# 1. ENHANCED CATEGORIZE ISSUE & NORMALIZE ORDER & FORMAT BANG CAP NHAT
# ==============================================================================

old_cat_and_norm_fn = text[text.find('function categorizeIssue('):text.find('function loadCheckXeOrders(){')]

new_cat_and_norm_fn = '''function categorizeIssue(issueText, partsList, updateInfo, extraKw){
  const txt = (
    String(issueText || '') + ' ' + 
    (Array.isArray(partsList) ? partsList.join(' ') : '') + ' ' + 
    String(updateInfo || '') + ' ' +
    String(extraKw || '')
  ).toLowerCase();

  for(let i = 1; i < ISSUE_CATEGORIES.length - 1; i++){
    const cat = ISSUE_CATEGORIES[i];
    if(cat.keywords && cat.keywords.some(kw => txt.includes(kw))){
      return cat;
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

  const isEsim = o.hasEsim || (o.category && o.category.id === 'esim') || (o.issue && o.issue.toLowerCase().includes('esim'));
  const isPin = o.hasPin || Boolean(o.pinSerial) || (o.category && o.category.id === 'pin') || (o.issue && o.issue.toLowerCase().includes('pin'));
  const isMotor = o.hasMotor || Boolean(o.motorSerial) || (o.category && o.category.id === 'motor') || (o.issue && o.issue.toLowerCase().includes('động cơ'));
  const isCharger = o.hasCharger || Boolean(o.chargerSerial) || (o.category && o.category.id === 'charger');

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

  if (isMotor && !isPin) {
    cards.push(renderCard('Động Cơ', '⚡', {
      cardClass: 'card-motor',
      cardStyle: 'background:linear-gradient(135deg, rgba(168,85,247,0.14), rgba(15,23,42,0.85));border:1px solid rgba(192,132,252,0.4);box-shadow:0 2px 10px rgba(168,85,247,0.18)',
      tagStyle: 'background:rgba(168,85,247,0.25);color:#c084fc;border:1px solid rgba(192,132,252,0.5)',
      statusStyle: 'background:rgba(168,85,247,0.22);color:#e9d5ff;border:1px solid rgba(168,85,247,0.4)'
    }, {
      bhCode: (!isEsim ? o.bhCode : ''),
      claimCode: o.claimCode,
      serial: o.motorSerial,
      status: o.warrantyStatus || o.bhOrderStatus || 'waiting_motor',
      date: o.removedAt ? `Tháo: ${formatDisplayDate(o.removedAt)}` : o.dateStr
    }));
  }

  if (isCharger && !isPin && !isMotor) {
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

// Chuẩn hóa một bản ghi xe với chuẩn 4 quy tắc
function normalizeOrder(d, i){
  const wo = String(d.wo || d.code || d.dms_ro_code || '—').trim();
  const plate = String(d.plate || '—').trim();
  const vin = String(d.vin || '—').trim();
  const vehicle = String(d.vehicle || d.model || '—').trim();
  const customer = String(d.customer || d.customer_name || '—').trim();
  const tech = String(d.tech || d.technician_name || 'Chưa phân công').trim();
  const status = String(d.status || d.status_label || 'Trong xưởng').trim();
  const warrantyStatus = String(d.warrantyStatus || d.warranty_status || d.dms_warranty_status || '').trim();

  // 1. HẠNG MỤC LỖI (Ưu tiên faults chuẩn từ ServiceOS)
  let faultStr = '';
  if (Array.isArray(d.faults) && d.faults.length > 0) {
    faultStr = d.faults.filter(Boolean).join(', ').trim();
  } else if (typeof d.faults === 'string' && d.faults.trim()) {
    faultStr = d.faults.trim();
  }

  const diagStr = String(d.inspect_summary || d.diagnosis || d.content || d.diag || d.symptoms || '').trim();

  let issue = '';
  if (faultStr && diagStr && diagStr.toLowerCase() !== faultStr.toLowerCase()) {
    issue = `${faultStr} (${diagStr})`;
  } else {
    issue = faultStr || diagStr || String(d.issue || '').trim();
  }
  if (!issue && d.customer_name && d.source === 'retail') {
    issue = d.customer_name;
  }
  const hasLoi = Boolean(faultStr || (hasTextContent(issue) && (issue.toLowerCase().includes('lỗi') || issue.toLowerCase().includes('loi'))));

  // 2. GHI CHÚ KTV
  const note = String(d.note || d.foreman_note || d.advisor_note || '').trim();
  const hasKtvNote = hasTextContent(note);

  // 3. BẢNG CẬP NHẬT PHÍA DƯỚI (PIN, Động cơ, Esim, Bộ sạc, Lệnh BH, ĐXBH, Serial, Ngày tháo)
  const pinSerial = String(d.pinSerial || d.battery_serial_old || d.battery_serial_new || '').trim();
  const motorSerial = String(d.motorSerial || d.motor_serial_old || d.motor_serial_new || '').trim();
  const chargerSerial = String(d.chargerSerial || d.charger_serial || '').trim();
  const removedAt = String(d.removedAt || d.parts_removed_at || d.motor_removed_at || '').trim();
  const bhCode = String(d.bhCode || d.dms_warranty_code || d.bh_order_code || '').trim();
  const claimCode = String(d.claimCode || d.dms_claim_code || '').trim();
  const bhOrderStatus = String(d.bhOrderStatus || d.dms_warranty_status || '').trim();
  const pinType = String(d.pinType || d.battery_repair_type || '').trim();
  const motorType = String(d.motorType || d.motor_repair_type || '').trim();

  // Nhận diện loại linh kiện
  const kinds = Array.isArray(d.warranty_kinds) ? d.warranty_kinds.filter(Boolean) : [];
  const extra = (d.warranty_extra && typeof d.warranty_extra === 'object') ? d.warranty_extra : {};
  const hasEsim = kinds.includes('esim') || Boolean(extra.esim) || faultStr.toLowerCase().includes('esim') || diagStr.toLowerCase().includes('esim');
  const hasPin = kinds.includes('pin') || Boolean(pinSerial) || Boolean(pinType) || faultStr.toLowerCase().includes('pin');
  const hasMotor = kinds.includes('motor') || Boolean(motorSerial) || Boolean(motorType) || faultStr.toLowerCase().includes('động cơ') || faultStr.toLowerCase().includes('motor');
  const hasCharger = kinds.includes('charger') || Boolean(chargerSerial) || faultStr.toLowerCase().includes('sạc');

  // Chuỗi tóm tắt cho xuất Excel & tìm kiếm
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

  // Điều kiện có bảng cập nhật phía dưới:
  // - Có Lệnh BH (dms_warranty_code)
  // - Hoặc có ĐXBH (dms_claim_code)
  // - Hoặc có Serial PIN / Động cơ / Sạc
  // - Hoặc có Ngày tháo linh kiện
  // - Hoặc có warranty_kinds / warranty_extra
  // - Hoặc có Trạng thái BH khác rỗng/none
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
    issue: issue || (hasBangCapNhat ? 'Bảo hành linh kiện' : 'Kiểm tra định kỳ'),
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
    dateStr: dispDate,
    isoDate: isoDate,
    isChecked: checkStatus.code === 'checked'
  };

  order.category = categorizeIssue(order.issue, d.parts || [], updateTableText, faultStr + ' ' + (kinds.join(' ')));
  return order;
}

'''

text = text.replace(old_cat_and_norm_fn, new_cat_and_norm_fn, 1)
print('Replaced categorizeIssue, formatBangCapNhatHtml, normalizeOrder!')

# ==============================================================================
# 2. UPDATE TABLE CELL IN renderCheckXe
# ==============================================================================

old_table_cell = '''        <td class="l part-name-cell">
          ${o.hasBangCapNhat ? 
            `<div style="font-size:11.5px;color:#6ee7b7;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.32);padding:5px 9px;border-radius:6px;line-height:1.4">
               📦 <b>Đã cập nhật:</b> ${esc(o.updateTableText)}
             </div>` : 
            `<span style="color:#94a3b8;font-size:12px;font-style:italic">— Chưa có bảng cập nhật</span>`
          }
        </td>'''

new_table_cell = '''        <td class="l part-name-cell" style="vertical-align:middle;min-width:205px">
          ${formatBangCapNhatHtml(o)}
        </td>'''

if old_table_cell in text:
    text = text.replace(old_table_cell, new_table_cell, 1)
    print('Updated Bảng cập nhật column in table with formatBangCapNhatHtml!')
else:
    print('Warning: old_table_cell not found directly, checking variations...')

# ==============================================================================
# 3. ADD CSS FOR UPDATE CARDS
# ==============================================================================

update_card_css = '''
      /* High-Tech Glassmorphic Cards for Bảng cập nhật */
      .update-card {
        border-radius: 8px;
        padding: 7px 10px;
        margin-bottom: 4px;
        font-size: 11.5px;
        line-height: 1.4;
        transition: transform 0.15s, box-shadow 0.15s;
      }
      .update-card:hover {
        transform: translateY(-1px);
        filter: brightness(1.08);
      }
      .update-card:last-child {
        margin-bottom: 0;
      }
      .update-card-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 7px;
        border-radius: 5px;
        font-weight: 700;
        font-size: 10.5px;
        letter-spacing: 0.3px;
        text-transform: uppercase;
      }
      .update-status-pill {
        font-size: 10px;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 10px;
        white-space: nowrap;
      }
      .update-code-row, .update-serial-row {
        display: flex;
        align-items: baseline;
        gap: 5px;
        margin-top: 3px;
      }
      .update-label {
        font-size: 10px;
        font-weight: 600;
        opacity: 0.75;
        color: var(--text-muted);
        text-transform: uppercase;
      }
      .update-mono-code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 700;
        font-size: 11.5px;
        color: #fde047;
        letter-spacing: 0.4px;
      }
      .update-mono-claim {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 600;
        font-size: 11px;
        color: #93c5fd;
      }
      .update-mono-serial {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 11px;
        color: #67e8f9;
        word-break: break-all;
        letter-spacing: 0.2px;
      }
      .update-date-row {
        font-size: 10.5px;
        color: #94a3b8;
        margin-top: 3px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .no-update-badge {
        color: #64748b;
        font-style: italic;
        font-size: 11.5px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 8px;
        border-radius: 6px;
        background: rgba(15, 23, 42, 0.45);
        border: 1px dashed rgba(100, 116, 139, 0.3);
      }
'''

if '.update-card {' not in text:
    css_insert_point = text.find('</style>\n\n    <!-- Header Thông tin và Thao tác -->')
    if css_insert_point != -1:
        text = text[:css_insert_point] + update_card_css + text[css_insert_point:]
        print('Injected update_card_css into <style>!')

# Save updated files
with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_build/PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated PhanTichBaoHanh.html and _deploy/index.html successfully!')
