// backend/realtime/wsServer.js
import { WebSocketServer, WebSocket } from 'ws';
import { syncEngine } from '../sync/syncEngine.js';
import { smartMerger } from '../sync/smartMerger.js';
import { storage } from '../storage.js';

export class WsServer {
  constructor() {
    this.wss = null;
    this.clients = new Set();
  }

  init(server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws, req) => {
      this.clients.add(ws);
      console.log(`[WebSocket] Client connected. Total clients: ${this.clients.size}`);

      // Send initial snapshot immediately
      this.sendSnapshot(ws);

      // Handle incoming messages from client (e.g., user edits, manual sync request)
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleClientMessage(ws, data);
        } catch (err) {
          console.warn('[WebSocket] Malformed message received:', err.message);
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`[WebSocket] Client disconnected. Total clients: ${this.clients.size}`);
      });

      ws.on('error', (err) => {
        console.warn('[WebSocket] Client error:', err.message);
        this.clients.delete(ws);
      });
    });

    // Wire up events from syncEngine
    syncEngine.on('delta_updated', (deltaData) => {
      this.broadcast({
        type: 'ORDER_DELTA',
        source: deltaData.source,
        timestamp: new Date().toISOString(),
        items: deltaData.items
      });
    });

    syncEngine.on('full_sync_completed', (summary) => {
      this.broadcast({
        type: 'SYNC_SUMMARY',
        summary,
        timestamp: new Date().toISOString()
      });
    });

    syncEngine.on('sync_status', (status) => {
      this.broadcast({
        type: 'SYNC_STATUS',
        status,
        timestamp: new Date().toISOString()
      });
    });

    // Heartbeat ping every 30s
    setInterval(() => {
      for (const client of this.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.ping();
        }
      }
    }, 30000);
  }

  sendSnapshot(ws) {
    if (ws.readyState !== WebSocket.OPEN) return;
    const allOrders = smartMerger.getAllRecords();
    const payload = JSON.stringify({
      type: 'INIT_SNAPSHOT',
      timestamp: new Date().toISOString(),
      total: allOrders.length,
      orders: allOrders,
      userEdits: storage.getAllUserEdits(),
      summary: syncEngine.getSummary()
    });
    ws.send(payload);
  }

  broadcast(messageObj) {
    const payload = JSON.stringify(messageObj);
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  handleClientMessage(ws, data) {
    if (!data || !data.type) return;

    if (data.type === 'REQUEST_SNAPSHOT') {
      this.sendSnapshot(ws);
    } else if (data.type === 'TRIGGER_SYNC') {
      syncEngine.triggerManualSync().then((summary) => {
        this.broadcast({
          type: 'SYNC_SUMMARY',
          summary,
          timestamp: new Date().toISOString()
        });
      });
    } else if (data.type === 'SAVE_USER_EDIT') {
      const { orderId, patch } = data;
      if (orderId && patch) {
        storage.recordUserEdit(orderId, patch);
        // Apply patch directly to merged record
        const record = smartMerger.getRecordById(orderId);
        if (record) {
          Object.assign(record, patch);
          this.broadcast({
            type: 'ORDER_DELTA',
            source: 'user_edit',
            timestamp: new Date().toISOString(),
            items: [record]
          });
        }
      }
    }
  }
}

export const wsServer = new WsServer();
