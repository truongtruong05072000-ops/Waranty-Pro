import sys, re

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update normalizeOrder payment classification
old_pl_block = '''  // Phân loại thanh toán (Phân loại TT)
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
  const isSettled = isSettledOrHigher(status, d);
  // Lệnh chưa làm ĐXBH: Phân loại TT là bảo hành VÀ lệnh ở mức quyết toán trở lên VÀ chưa có mã ĐX (WC-...)
  const isUnsubmittedWarranty = isWarrantyPayment && isSettled && (!claimCode || claimCode === '—' || !claimCode.startsWith('WC-'));'''

new_pl_block = '''  // ĐÁNH GIÁ CHÍNH XÁC PHÂN LOẠI THANH TOÁN (Từ Mục Công việc, Mục Vật tư/Phụ tùng hoặc dữ liệu Lệnh)
  // 1. Kiểm tra từng mục trong Mục Công việc (line_items) và Mục Vật tư/Phụ tùng (part_line_items / parts)
  const lineItems = Array.isArray(d.line_items) ? d.line_items : (Array.isArray(d.lineItems) ? d.lineItems : (Array.isArray(d.jobs) ? d.jobs : []));
  const partItems = Array.isArray(d.part_line_items) ? d.part_line_items : (Array.isArray(d.partLineItems) ? d.partLineItems : (Array.isArray(d.parts) ? d.parts : []));
  
  let hasWarrantyLineItem = false;
  let hasCustomerLineItem = false;
  const allSubItems = [...lineItems, ...partItems];
  
  allSubItems.forEach(item => {
    if (!item) return;
    const pt = norm(String(item.paymentType || item.payment_type || item.settlementType || item.classification || item.type || ''));
    if (pt.includes('bao hanh') || pt === 'bh' || pt.includes('warranty') || pt.includes('vinfast') || pt.includes('factory')) {
      hasWarrantyLineItem = true;
    } else if (pt.includes('khach') || pt.includes('customer') || pt.includes('retail') || pt.includes('paid')) {
      hasCustomerLineItem = true;
    }
  });

  // 2. Kiểm tra phân loại rõ ràng ở cấp phiếu / LSC nếu có
  const phanLoaiTtRaw = String(
    d.phanLoaiTt || d.phan_loai_tt || d.paymentType || d.payment_type || d.billing_type || d.order_type || d.loai_sua_chua || ''
  ).trim();
  const normPlRaw = norm(phanLoaiTtRaw);

  let isWarrantyPayment = false;
  let phanLoaiTt = 'Khách hàng';

  if (hasWarrantyLineItem) {
    isWarrantyPayment = true;
    phanLoaiTt = 'Bảo hành';
  } else if (hasCustomerLineItem && !hasWarrantyLineItem) {
    isWarrantyPayment = false;
    phanLoaiTt = 'Khách hàng';
  } else if (normPlRaw.includes('bao hanh') || normPlRaw === 'bh' || normPlRaw.includes('warranty')) {
    isWarrantyPayment = true;
    phanLoaiTt = 'Bảo hành';
  } else if (normPlRaw.includes('khach') || normPlRaw.includes('customer') || normPlRaw.includes('thanh ly') || normPlRaw.includes('liquidation')) {
    isWarrantyPayment = false;
    phanLoaiTt = 'Khách hàng';
  } else {
    // 3. Nghiệp vụ ServiceOS / Dealer Portal:
    const sType = norm(String(d.service_type || ''));
    const isLiquidationOrMaint = sType.includes('liquidation') || sType.includes('thanh ly') || sType.includes('maintenance') || sType.includes('bao duong');
    const hasExplicitWarrantyDoc = Boolean((bhCode && bhCode !== '—') || (d.dms_warranty_code) || (d.dms_claim_code));

    if (sType === 'warranty' || sType.includes('bao hanh') || hasExplicitWarrantyDoc) {
      isWarrantyPayment = true;
      phanLoaiTt = 'Bảo hành';
    } else {
      isWarrantyPayment = false;
      phanLoaiTt = 'Khách hàng';
    }
  }

  const isSettled = isSettledOrHigher(status, d);
  // Lệnh chưa làm ĐXBH: Phân loại TT là bảo hành VÀ lệnh ở mức quyết toán trở lên VÀ chưa có mã ĐX (WC-...)
  const isUnsubmittedWarranty = isWarrantyPayment && isSettled && (!claimCode || claimCode === '—' || !claimCode.startsWith('WC-'));'''

if old_pl_block in content:
    content = content.replace(old_pl_block, new_pl_block)
    print('Updated normalizeOrder payment classification')
else:
    print('Could not find old_pl_block in app_template2.html')

# 2. Update dynamic badge in unsubmittedRowsHtml
old_badge1 = '''        <td style="text-align:center">
          <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(239,68,68,0.18);color:#fca5a5;border:1px solid rgba(239,68,68,0.4)">Bảo hành</span>
        </td>'''

new_badge1 = '''        <td style="text-align:center">
          ${o.isWarrantyPayment 
            ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(239,68,68,0.18);color:#fca5a5;border:1px solid rgba(239,68,68,0.4)">Bảo hành</span>`
            : `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(59,130,246,0.18);color:#93c5fd;border:1px solid rgba(59,130,246,0.4)">Khách hàng</span>`}
        </td>'''

if old_badge1 in content:
    content = content.replace(old_badge1, new_badge1)
    print('Updated dynamic badge in unsubmittedRowsHtml and modal')

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Saved _build/app_template2.html')
