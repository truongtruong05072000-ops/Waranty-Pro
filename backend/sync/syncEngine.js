// backend/sync/syncEngine.js
import { EventEmitter } from 'events';
import { serviceosSync } from './serviceosSync.js';
import { dealerPortalSync } from './dealerPortalSync.js';
import { smartMerger } from './smartMerger.js';
import { storage } from '../storage.js';

export class SyncEngine extends EventEmitter {
  constructor() {
    super();
    this.isStarted = false;
    this.persistTimer = null;
    this.status = {
      isSyncing: false,
      lastSyncTime: null,
      serviceosConnected: false,
      dealerPortalConnected: false,
      totalVehicles: 0
    };

    // Forward events from sub-syncers
    serviceosSync.on('delta_updated', (deltaList) => {
      this.status.serviceosConnected = true;
      this.status.totalVehicles = smartMerger.getAllRecords().length;
      this.status.lastSyncTime = new Date().toISOString();
      this.emit('delta_updated', { source: 'serviceos', items: deltaList });
      this.schedulePersist();
    });

    serviceosSync.on('full_sync_completed', (summary) => {
      this.status.serviceosConnected = true;
      this.status.totalVehicles = summary.totalInWorkshop;
      this.status.lastSyncTime = new Date().toISOString();
      this.emit('full_sync_completed', summary);
      this.schedulePersist();
    });

    dealerPortalSync.on('delta_updated', (deltaList) => {
      this.status.dealerPortalConnected = true;
      this.status.lastSyncTime = new Date().toISOString();
      this.emit('delta_updated', { source: 'dealer_portal', items: deltaList });
      this.schedulePersist();
    });
  }

  async start() {
    if (this.isStarted) return;
    this.isStarted = true;
    console.log('[SyncEngine] Initializing background sync loops...');

    // Load any existing cached orders into smartMerger
    const cachedData = storage.getDataCache();
    if (cachedData.orders && cachedData.orders.length > 0) {
      console.log(`[SyncEngine] Loaded ${cachedData.orders.length} cached records from disk.`);
      for (const order of cachedData.orders) {
        const key = order.vin ? order.vin.toUpperCase() : (order.id || order.code);
        if (key) storage.mergedOrders.set(key, order);
      }
    }

    // Start both background loops
    serviceosSync.start();
    dealerPortalSync.start();

    // Auto-save cache every 30 seconds
    this.persistTimer = setInterval(() => {
      this.persistToDisk();
    }, 30000);
  }

  stop() {
    this.isStarted = false;
    serviceosSync.stop();
    dealerPortalSync.stop();
    if (this.persistTimer) clearInterval(this.persistTimer);
    this.persistToDisk();
    console.log('[SyncEngine] Stopped.');
  }

  schedulePersist() {
    // Debounced persist
    if (this._debouncePersistTimer) clearTimeout(this._debouncePersistTimer);
    this._debouncePersistTimer = setTimeout(() => {
      this.persistToDisk();
    }, 5000);
  }

  persistToDisk() {
    try {
      const allOrders = smartMerger.getAllRecords();
      storage.saveDataCache({
        orders: allOrders,
        lastSync: new Date().toISOString(),
        total: allOrders.length
      });
    } catch (err) {
      console.error(`[SyncEngine] Persist error: ${err.message}`);
    }
  }

  async triggerManualSync() {
    console.log('[SyncEngine] Manual sync triggered.');
    this.status.isSyncing = true;
    this.emit('sync_status', { isSyncing: true });
    
    await Promise.allSettled([
      serviceosSync.poll(),
      dealerPortalSync.runStreamB(),
      dealerPortalSync.runStreamA()
    ]);

    this.status.isSyncing = false;
    this.status.lastSyncTime = new Date().toISOString();
    this.status.totalVehicles = smartMerger.getAllRecords().length;
    this.emit('sync_status', { isSyncing: false, lastSyncTime: this.status.lastSyncTime });
    this.persistToDisk();
    return this.getSummary();
  }

  getSummary() {
    const orders = smartMerger.getAllRecords();
    return {
      status: this.status,
      totalVehicles: orders.length,
      serviceosStats: serviceosSync.getStats(),
      dealerPortalStats: dealerPortalSync.getStats()
    };
  }
}

export const syncEngine = new SyncEngine();
