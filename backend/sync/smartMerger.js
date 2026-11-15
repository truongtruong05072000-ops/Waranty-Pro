// backend/sync/smartMerger.js
import { storage } from '../storage.js';

export function normalizePlate(plate) {
  if (!plate || typeof plate !== 'string') return '';
  return plate.replace(/[\s\-\.]+/g, '').toUpperCase();
}

export function normalizeVin(vin) {
  if (!vin || typeof vin !== 'string') return '';
  return vin.trim().toUpperCase();
}

export function normalizeWoCode(wo) {
  if (!wo || typeof wo !== 'string') return '';
  return wo.trim().toUpperCase();
}

/**
 * Thuật toán gộp thông minh đa nguồn (ServiceOS + Dealer Portal)
 * Khóa gộp chính: VIN. Khóa gộp phụ: RO/WO Code hoặc Biển số.
 */
export class SmartMerger {
  /**
   * Chuẩn hóa và gộp dữ liệu xe từ ServiceOS
   */
  static mergeServiceOsOrder(rawOrder, detail = null) {
    if (!rawOrder) return null;
    const vin = normalizeVin(rawOrder.vin);
    const key = vin || rawOrder.id || rawOrder.code;

    const existing = storage.mergedOrders.get(key) || {};
    const userEdit = storage.getUserEdit(key) || storage.getUserEdit(rawOrder.id) || {};

    // Số lần quay lại xưởng từ mảng history trong detail
    let revisitCount = existing.revisitCount || 0;
    if (detail && Array.isArray(detail.history)) {
      revisitCount = detail.history.length;
    }

    // Gộp dữ liệu ServiceOS
    const merged = {
      ...existing,
      id: rawOrder.id,
      code: rawOrder.code,
      serviceOsCode: rawOrder.code,
      status: rawOrder.status || existing.status || 'Trong xưởng',
      source: rawOrder.source || existing.source || 'gsm',
      fleet: rawOrder.fleet || existing.fleet || rawOrder.source || 'gsm',
      priority: rawOrder.priority || existing.priority || 'normal',
      service_type: rawOrder.service_type || existing.service_type || 'warranty',
      received_at: rawOrder.received_at || existing.received_at,
      promised_at: rawOrder.promised_at || existing.promised_at,
      completed_at: rawOrder.completed_at || existing.completed_at,
      delivered_at: rawOrder.delivered_at || existing.delivered_at,
      technician_id: rawOrder.technician_id || existing.technician_id,
      technician_name: rawOrder.technician_name || existing.technician_name || 'Chưa phân công',
      advisor_name: rawOrder.advisor_name || existing.advisor_name,
      advisor_note: rawOrder.advisor_note || existing.advisor_note || '',
      foreman_note: rawOrder.foreman_note || existing.foreman_note || '',
      plate: rawOrder.plate || existing.plate || '—',
      normPlate: normalizePlate(rawOrder.plate || existing.plate),
      vin: vin || existing.vin || '—',
      model: rawOrder.model || existing.model || '—',
      customer_name: rawOrder.customer_name || existing.customer_name || '—',
      customer_phone: rawOrder.customer_phone || existing.customer_phone || '',
      symptoms: rawOrder.symptoms || existing.symptoms || '',
      diagnosis: rawOrder.diagnosis || existing.diagnosis || '',
      faults: Array.isArray(rawOrder.faults) ? rawOrder.faults : (existing.faults || []),
      quote_amount: rawOrder.quote_amount != null ? rawOrder.quote_amount : existing.quote_amount,
      dms_ro_code: rawOrder.dms_ro_code || existing.dms_ro_code || '',
      dms_warranty_code: rawOrder.dms_warranty_code || existing.dms_warranty_code || '',
      dms_claim_code: rawOrder.dms_claim_code || existing.dms_claim_code || '',
      dms_warranty_status: rawOrder.dms_warranty_status || existing.dms_warranty_status || '',
      warranty_status: rawOrder.warranty_status || existing.warranty_status || '',
      warranty_kinds: rawOrder.warranty_kinds || existing.warranty_kinds || [],
      warranty_extra: rawOrder.warranty_extra || existing.warranty_extra || {},
      parts_status: rawOrder.parts_status || existing.parts_status || '',
      battery_serial_old: rawOrder.battery_serial_old || existing.battery_serial_old || '',
      battery_serial_new: rawOrder.battery_serial_new || existing.battery_serial_new || '',
      motor_serial_old: rawOrder.motor_serial_old || existing.motor_serial_old || '',
      motor_serial_new: rawOrder.motor_serial_new || existing.motor_serial_new || '',
      battery_repair_type: rawOrder.battery_repair_type || existing.battery_repair_type || '',
      motor_repair_type: rawOrder.motor_repair_type || existing.motor_repair_type || '',
      coc_status: rawOrder.coc_status || existing.coc_status || '',
      parts_removed_at: rawOrder.parts_removed_at || existing.parts_removed_at || '',
      motor_removed_at: rawOrder.motor_removed_at || existing.motor_removed_at || '',
      sent_factory_at: rawOrder.sent_factory_at || existing.sent_factory_at || '',
      days_in_shop: rawOrder.days_in_shop != null ? rawOrder.days_in_shop : existing.days_in_shop,
      revisitCount: revisitCount,
      updated_at: rawOrder.updated_at || new Date().toISOString(),
      lastServiceOsSync: Date.now()
    };

    // Chi tiết từ API detail nếu có
    if (detail) {
      if (detail.logs) merged.logs = detail.logs;
      if (detail.items) merged.items = detail.items;
      if (detail.attachments) merged.attachments = detail.attachments;
      if (detail.inspection_notes) merged.inspection_notes = detail.inspection_notes;
      if (detail.history) merged.history = detail.history;
      if (detail.reception_check) merged.reception_check = detail.reception_check;
      if (detail.warranty_extra) merged.warranty_extra = { ...(merged.warranty_extra || {}), ...detail.warranty_extra };
    }

    // Bảo tồn 100% dữ liệu tùy chỉnh nội bộ của người dùng trên Web
    if (userEdit.userNote !== undefined) merged.userNote = userEdit.userNote;
    if (userEdit.internalDispatch !== undefined) merged.internalDispatch = userEdit.internalDispatch;
    if (userEdit.customTimer !== undefined) merged.customTimer = userEdit.customTimer;

    storage.mergedOrders.set(key, merged);
    return merged;
  }

  /**
   * Gộp dữ liệu từ VinFast Dealer Portal vào bản ghi xe
   * Hỗ trợ xử lý trường hợp 1 xe có 2 lệnh song song (Lệnh SC GSM + Lệnh BH VinFast)
   */
  static mergeDealerPortalOrder(dpOrder) {
    if (!dpOrder) return null;
    const vin = normalizeVin(dpOrder.vin);
    const woNum = normalizeWoCode(dpOrder.workOrderNumber);
    const plateNorm = normalizePlate(dpOrder.licensePlate);

    // Tìm kiếm xe trong bộ nhớ đã lưu (Ưu tiên 1: VIN, Ưu tiên 2: RO code, Ưu tiên 3: Biển số)
    let matchedKey = null;
    let target = null;

    if (vin && storage.mergedOrders.has(vin)) {
      matchedKey = vin;
      target = storage.mergedOrders.get(vin);
    } else {
      // Tìm duyệt qua các xe
      for (const [k, ord] of storage.mergedOrders.entries()) {
        const ordVin = normalizeVin(ord.vin);
        const ordRo = normalizeWoCode(ord.dms_ro_code || ord.code);
        const ordWc = normalizeWoCode(ord.dms_warranty_code);
        const ordPlate = normalizePlate(ord.plate);

        if (vin && ordVin && ordVin === vin) {
          matchedKey = k;
          target = ord;
          break;
        }
        if (woNum && (ordRo === woNum || ordWc === woNum)) {
          matchedKey = k;
          target = ord;
          break;
        }
        if (plateNorm && ordPlate && ordPlate === plateNorm) {
          matchedKey = k;
          target = ord;
          break;
        }
      }
    }

    // Nếu xe chưa có trong ServiceOS (không nằm trong 636 xe đang có trong xưởng), 
    // TUYỆT ĐỐI KHÔNG TẠO MỚI xe phantom để giữ đúng số lượng xe thực tế của xưởng!
    if (!target) {
      return null;
    }

    // PHÂN LOẠI 2 LỆNH SONG SONG CHO CÙNG 1 SỐ VIN:
    const custPayAmount = parseFloat(dpOrder.customerPaymentAmount || '0') || 0;
    const warrantyPayAmount = parseFloat(dpOrder.warrantyPaymentAmount || '0') || 0;
    const custReqLower = String(dpOrder.customerRequest || '').toLowerCase();
    const isWarrantyClaimOrder = warrantyPayAmount > 0 || 
                                 custReqLower.includes('bảo hành') || 
                                 custReqLower.includes('bao hanh') || 
                                 custReqLower.includes('vf');

    // Lưu mảng các lệnh Dealer Portal đính kèm trên cùng chiếc xe này
    if (!Array.isArray(target.dealerPortalWorkOrders)) {
      target.dealerPortalWorkOrders = [];
    }
    const existingDpIdx = target.dealerPortalWorkOrders.findIndex(w => w.workOrderNumber === dpOrder.workOrderNumber);
    if (existingDpIdx !== -1) {
      target.dealerPortalWorkOrders[existingDpIdx] = dpOrder;
    } else {
      target.dealerPortalWorkOrders.push(dpOrder);
    }

    // 1. Nếu là lệnh Bảo hành VinFast:
    if (isWarrantyClaimOrder) {
      target.dms_warranty_code = dpOrder.workOrderNumber;
      target.dms_warranty_status = dpOrder.status;
      target.warrantyPaymentAmount = dpOrder.warrantyPaymentAmount;
      target.warehouseStatus = dpOrder.warehouseStatus;
    } else {
      // 2. Nếu là lệnh Sửa chữa / Báo giá GSM:
      target.dms_ro_code = dpOrder.workOrderNumber;
      target.dpQuotationNumber = dpOrder.quotationNumber;
      target.dpStatus = dpOrder.status;
      target.totalLaborAmount = dpOrder.totalLaborAmount;
      target.totalPartsAmount = dpOrder.totalPartsAmount;
      target.customerPaymentAmount = dpOrder.customerPaymentAmount;
      target.quote_amount = dpOrder.totalAmountInclVat || dpOrder.finalPaymentAmount;
    }

    // 3. Đắp các trường dữ liệu giá trị cao từ Dealer Portal sang xe:
    if (dpOrder.engineNumber && !target.motor_serial_old) {
      target.motor_serial_old = dpOrder.engineNumber; // Điền số máy nếu ServiceOS bị trống
    }
    target.engineNumber = dpOrder.engineNumber || target.engineNumber;
    target.warrantyStartDate = dpOrder.warrantyStartDate || target.warrantyStartDate;
    target.warrantyEndDate = dpOrder.warrantyEndDate || target.warrantyEndDate;
    target.warehouseStatus = dpOrder.warehouseStatus || target.warehouseStatus;
    target.partsOrderFlag = dpOrder.partsOrderFlag || target.partsOrderFlag;
    target.chassisDeformation = dpOrder.chassisDeformation || target.chassisDeformation;
    target.standardRepairTime = dpOrder.standardRepairTime || target.standardRepairTime;
    target.repairCommittedEndTime = dpOrder.repairCommittedEndTime || target.repairCommittedEndTime;
    target.invoicedDate = dpOrder.invoicedDate || target.invoicedDate;
    target.dealerPortalUpdated = dpOrder.updatedAt || new Date().toISOString();
    target.lastDealerPortalSync = Date.now();

    // Giữ nguyên dữ liệu tùy chỉnh nội bộ
    const userEdit = storage.getUserEdit(matchedKey) || {};
    if (userEdit.userNote !== undefined) target.userNote = userEdit.userNote;
    if (userEdit.internalDispatch !== undefined) target.internalDispatch = userEdit.internalDispatch;
    if (userEdit.customTimer !== undefined) target.customTimer = userEdit.customTimer;

    storage.mergedOrders.set(matchedKey, target);
    return target;
  }

  getAllRecords() {
    return Array.from(storage.mergedOrders.values());
  }

  getRecordById(idOrVin) {
    if (!idOrVin) return null;
    const clean = String(idOrVin).trim().toUpperCase();
    if (storage.mergedOrders.has(clean)) return storage.mergedOrders.get(clean);
    for (const ord of storage.mergedOrders.values()) {
      if (String(ord.id) === String(idOrVin) || ord.code === idOrVin || ord.plate === idOrVin || ord.dms_ro_code === idOrVin || ord.dms_warranty_code === idOrVin) {
        return ord;
      }
    }
    return null;
  }

  mergeDealerPortalOrder(dpOrder, details = null) {
    return SmartMerger.mergeDealerPortalOrder(dpOrder, details);
  }

  mergeServiceOsOrder(rawOrder, detail = null) {
    return SmartMerger.mergeServiceOsOrder(rawOrder, detail);
  }
}

export const smartMerger = new SmartMerger();

