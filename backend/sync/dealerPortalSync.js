// backend/sync/dealerPortalSync.js
import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import { CONFIG } from '../config.js';
import { dealerPortalAuth } from '../auth/dealerPortalAuth.js';
import { smartMerger } from './smartMerger.js';

export class DealerPortalSync extends EventEmitter {
  constructor() {
    super();
    this.streamATimer = null;
    this.streamBTimer = null;
    this.isRunning = false;
    this.cachedClaims = [];
    
    // RAM cache of tracked orders: id -> updatedAt
    this.trackedOrders = new Map();
    // Cache for detail fetching to avoid redundant calls: id -> updatedAt
    this.fetchedDetails = new Map();

    // Nạp sẵn toàn bộ danh sách đề xuất bảo hành từ .claims-cache.json nếu có
    try {
      const cachePath = path.join(CONFIG.PATHS.ROOT, '.claims-cache.json');
      if (fs.existsSync(cachePath)) {
        const raw = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
        this.cachedClaims = Object.values(raw);
        console.log(`[DealerPortalSync] ⚡ Đã nạp sẵn ${this.cachedClaims.length} đề xuất bảo hành chi tiết từ .claims-cache.json vào bộ nhớ.`);
      }
    } catch (e) {
      console.warn('[DealerPortalSync] Lỗi đọc .claims-cache.json:', e.message);
    }

    this.stats = {
      streamALastRun: null,
      streamBLastRun: null,
      streamATotalOpen: 0,
      streamBLastFetched: 0,
      errorCount: 0,
      lastError: null
    };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[DealerPortalSync] Starting Stream A (open orders) and Stream B (recent delta)...');

    // Run Stream B immediately, then every STREAM_B_INTERVAL_MS
    this.runStreamB();
    this.streamBTimer = setInterval(() => this.runStreamB(), CONFIG.DEALER_PORTAL.STREAM_B_INTERVAL_MS);

    // Run Stream A immediately after short offset, then every STREAM_A_INTERVAL_MS
    setTimeout(() => {
      this.runStreamA();
      this.streamATimer = setInterval(() => this.runStreamA(), CONFIG.DEALER_PORTAL.STREAM_A_INTERVAL_MS);
    }, 2000);
  }

  stop() {
    this.isRunning = false;
    if (this.streamATimer) clearInterval(this.streamATimer);
    if (this.streamBTimer) clearInterval(this.streamBTimer);
    console.log('[DealerPortalSync] Stopped.');
  }

  /**
   * Fetch single work order detail from Dealer Portal
   * To check labors/parts payment classification if needed
   */
  async fetchOrderDetail(orderId) {
    try {
      const url = `${CONFIG.DEALER_PORTAL.BASE_URL}/api/escooter-work-orders/${orderId}`;
      const res = await dealerPortalAuth.fetchWithAuth(url);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || json;
    } catch (err) {
      console.warn(`[DealerPortalSync] Failed to fetch detail for ${orderId}: ${err.message}`);
      return null;
    }
  }

  /**
   * Process a list of Dealer Portal work order items
   */
  async processOrderList(orders) {
    const updatedRecords = [];

    for (const dpOrder of orders) {
      if (!dpOrder || !dpOrder.id) continue;

      const prevUpdated = this.trackedOrders.get(dpOrder.id);
      const isNewOrChanged = !prevUpdated || prevUpdated !== dpOrder.updatedAt;

      if (isNewOrChanged) {
        this.trackedOrders.set(dpOrder.id, dpOrder.updatedAt);

        // Đã có sẵn warrantyPaymentAmount, customerPaymentAmount, customerRequest trong dpOrder
        let details = null;
        const mergedRecord = smartMerger.mergeDealerPortalOrder(dpOrder, details);
        if (mergedRecord) {
          updatedRecords.push(mergedRecord);
        }
      }
    }

    if (updatedRecords.length > 0) {
      this.emit('delta_updated', updatedRecords);
    }

    return updatedRecords.length;
  }

  /**
   * Stream B: Fast scan of most recent 50 orders (every ~5s)
   * Catches newly created orders or newly INVOICED orders immediately
   */
  async runStreamB() {
    if (!this.isRunning) return;
    try {
      const url = `${CONFIG.DEALER_PORTAL.BASE_URL}/api/escooter-work-orders?page=1&limit=50`;
      const res = await dealerPortalAuth.fetchWithAuth(url);
      if (!res.ok) {
        throw new Error(`DealerPortal Stream B HTTP ${res.status}`);
      }

      const json = await res.json();
      const orders = json.data || json.rows || [];
      this.stats.streamBLastRun = new Date().toISOString();
      this.stats.streamBLastFetched = orders.length;

      const changedCount = await this.processOrderList(orders);
      if (changedCount > 0) {
        console.log(`[DealerPortalSync][Stream B] Processed ${changedCount} changed/new orders.`);
      }
    } catch (err) {
      this.stats.errorCount++;
      this.stats.lastError = err.message;
      console.error(`[DealerPortalSync][Stream B] Error: ${err.message}`);
    }
  }

  /**
   * Stream A: Complete scan of all open orders across pages (every ~35s)
   * Statuses: QUOTATION, RELEASED, READY_FOR_INVOICING
   */
  async runStreamA() {
    if (!this.isRunning) return;
    try {
      const pageSize = 100;
      const statusParams = 'statusesIn=QUOTATION&statusesIn=RELEASED&statusesIn=READY_FOR_INVOICING';
      const firstUrl = `${CONFIG.DEALER_PORTAL.BASE_URL}/api/escooter-work-orders?page=1&limit=${pageSize}&exactTotal=true&${statusParams}`;
      
      const firstRes = await dealerPortalAuth.fetchWithAuth(firstUrl);
      if (!firstRes.ok) {
        throw new Error(`DealerPortal Stream A HTTP ${firstRes.status}`);
      }

      const firstJson = await firstRes.json();
      const firstOrders = firstJson.data || [];
      const total = firstJson.total || firstOrders.length;
      this.stats.streamATotalOpen = total;

      let allOrders = [...firstOrders];
      const totalPages = Math.ceil(total / pageSize);

      if (totalPages > 1) {
        const pagePromises = [];
        for (let p = 2; p <= totalPages; p++) {
          const pageUrl = `${CONFIG.DEALER_PORTAL.BASE_URL}/api/escooter-work-orders?page=${p}&limit=${pageSize}&exactTotal=true&${statusParams}`;
          pagePromises.push(
            dealerPortalAuth.fetchWithAuth(pageUrl)
              .then(r => r.ok ? r.json() : { data: [] })
              .then(j => j.data || [])
              .catch(err => {
                console.warn(`[DealerPortalSync][Stream A] Error fetching page ${p}: ${err.message}`);
                return [];
              })
          );
        }
        const remainingPages = await Promise.all(pagePromises);
        for (const pageItems of remainingPages) {
          allOrders = allOrders.concat(pageItems);
        }
      }

      this.stats.streamALastRun = new Date().toISOString();
      const changedCount = await this.processOrderList(allOrders);
      console.log(`[DealerPortalSync][Stream A] Completed full scan: ${allOrders.length}/${total} open orders (${changedCount} changed).`);
    } catch (err) {
      this.stats.errorCount++;
      this.stats.lastError = err.message;
      console.error(`[DealerPortalSync][Stream A] Error: ${err.message}`);
    }
  }

  async fetchAllClaims() {
    try {
      const pageSize = 100;
      let allClaims = [];
      let page = 1;

      while (page <= 5) {
        const url = `${CONFIG.DEALER_PORTAL.BASE_URL}/api/warranty/claims?page=${page}&limit=${pageSize}`;
        const res = await dealerPortalAuth.fetchWithAuth(url);
        if (!res.ok) break;

        const json = await res.json();
        const claims = json.data || json.rows || [];
        if (!claims.length) break;

        allClaims.push(...claims);
        const total = json.total || allClaims.length;
        if (allClaims.length >= total || claims.length < pageSize) break;
        page++;
      }

      // Làm giàu chi tiết phụ tùng, tiền công và lịch sử duyệt cho các đề xuất
      const enrichedClaims = await this.enrichClaimsDetails(allClaims);
      this.cachedClaims = enrichedClaims;
      console.log(`[DealerPortalSync] Đã nạp & làm giàu chi tiết ${enrichedClaims.length} đề xuất bảo hành (WC-...) từ Dealer Portal.`);
      return enrichedClaims;
    } catch (err) {
      console.error('[DealerPortalSync] Error fetching claims:', err.message);
      return this.cachedClaims || [];
    }
  }

  async enrichClaimsDetails(claims) {
    if (!Array.isArray(claims) || !claims.length) return claims;

    const cachePath = path.join(CONFIG.PATHS.ROOT, '.claims-cache.json');
    let detailCache = {};
    try {
      if (fs.existsSync(cachePath)) {
        detailCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      }
    } catch (e) {}

    let needSave = false;
    const missing = claims.filter(c => c.id && (!detailCache[c.id] || !detailCache[c.id].partLineItems || (c.status !== 'APPROVED' && c.status !== 'CANCELLED')));

    const BATCH_SIZE = 25;
    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      const batch = missing.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (c) => {
        try {
          const res = await dealerPortalAuth.fetchWithAuth(`${CONFIG.DEALER_PORTAL.BASE_URL}/api/warranty/claims/${c.id}`);
          if (res.ok) {
            const dt = await res.json();
            detailCache[c.id] = dt;
            needSave = true;
          }
        } catch (err) {}
      }));
    }

    if (needSave) {
      try {
        fs.writeFileSync(cachePath, JSON.stringify(detailCache), 'utf-8');
      } catch (e) {}
    }

    return claims.map(c => {
      const dt = detailCache[c.id] || {};
      const hist = dt.approvalHistory || c.approvalHistory || [];
      const l1Ret = hist.filter(h => String(h.action || '').includes('L1_RETURN') || String(h.action || '').includes('L1_REJECT')).length;
      const l2Ret = hist.filter(h => String(h.action || '').includes('L2_RETURN') || String(h.action || '').includes('L2_REJECT')).length;
      const isRet = (l1Ret > 0 || l2Ret > 0) && c.status !== 'CANCELLED';

      return {
        ...c,
        ...dt,
        partLineItems: dt.partLineItems || c.partLineItems || [],
        workOrderLineItems: dt.workOrderLineItems || c.workOrderLineItems || [],
        requestedPartsAmountInclTax: dt.requestedPartsAmountInclTax != null ? dt.requestedPartsAmountInclTax : c.requestedPartsAmountInclTax,
        requestedPartsAmountExclTax: dt.requestedPartsAmountExclTax != null ? dt.requestedPartsAmountExclTax : c.requestedPartsAmountExclTax,
        requestedLaborAmountInclTax: dt.requestedLaborAmountInclTax != null ? dt.requestedLaborAmountInclTax : c.requestedLaborAmountInclTax,
        requestedLaborAmountExclTax: dt.requestedLaborAmountExclTax != null ? dt.requestedLaborAmountExclTax : c.requestedLaborAmountExclTax,
        totalRequestedAmountInclTax: dt.totalRequestedAmountInclTax || c.totalRequestedAmountInclTax,
        totalRequestedAmountExclTax: dt.totalRequestedAmountExclTax || c.totalRequestedAmountExclTax,
        approvalHistory: hist,
        returnLevel1Count: l1Ret,
        returnLevel2Count: l2Ret,
        isReturned: isRet,
        isCancelled: c.status === 'CANCELLED'
      };
    });
  }

  async fetchAllWorkOrders() {
    try {
      const pageSize = 100;
      let allOrders = [];
      let page = 1;

      while (page <= 5) {
        const url = `${CONFIG.DEALER_PORTAL.BASE_URL}/api/escooter-work-orders?page=${page}&limit=${pageSize}`;
        const res = await dealerPortalAuth.fetchWithAuth(url);
        if (!res.ok) break;

        const json = await res.json();
        const orders = json.data || json.rows || [];
        if (!orders.length) break;

        allOrders.push(...orders);
        const total = json.total || allOrders.length;
        if (allOrders.length >= total || orders.length < pageSize) break;
        page++;
      }

      await this.processOrderList(allOrders);
      console.log(`[DealerPortalSync] Đã nạp ${allOrders.length} lệnh sửa chữa từ Dealer Portal.`);
      return allOrders;
    } catch (err) {
      console.error('[DealerPortalSync] Error fetching all work orders:', err.message);
      return [];
    }
  }

  getAllClaims() {
    return this.cachedClaims || [];
  }

  getStats() {
    return {
      ...this.stats,
      trackedOrderCount: this.trackedOrders.size
    };
  }
}

export const dealerPortalSync = new DealerPortalSync();
