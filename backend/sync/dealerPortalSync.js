// backend/sync/dealerPortalSync.js
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
    
    // RAM cache of tracked orders: id -> updatedAt
    this.trackedOrders = new Map();
    // Cache for detail fetching to avoid redundant calls: id -> updatedAt
    this.fetchedDetails = new Map();

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

        // Check if we need details (e.g. to inspect payment classification in labors/parts)
        let details = null;
        const lastDetailUpdated = this.fetchedDetails.get(dpOrder.id);
        if (lastDetailUpdated !== dpOrder.updatedAt) {
          details = await this.fetchOrderDetail(dpOrder.id);
          if (details) {
            this.fetchedDetails.set(dpOrder.id, dpOrder.updatedAt);
          }
        }

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

  getStats() {
    return {
      ...this.stats,
      trackedOrderCount: this.trackedOrders.size
    };
  }
}

export const dealerPortalSync = new DealerPortalSync();
