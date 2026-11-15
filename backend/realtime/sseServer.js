// backend/realtime/sseServer.js
import { syncEngine } from '../sync/syncEngine.js';
import { smartMerger } from '../sync/smartMerger.js';
import { storage } from '../storage.js';

export class SseServer {
  constructor() {
    this.clients = new Set();

    // Listen to syncEngine events and broadcast via SSE
    syncEngine.on('delta_updated', (deltaData) => {
      this.broadcast('ORDER_DELTA', {
        source: deltaData.source,
        timestamp: new Date().toISOString(),
        items: deltaData.items
      });
    });

    syncEngine.on('full_sync_completed', (summary) => {
      this.broadcast('SYNC_SUMMARY', {
        summary,
        timestamp: new Date().toISOString()
      });
    });

    syncEngine.on('sync_status', (status) => {
      this.broadcast('SYNC_STATUS', {
        status,
        timestamp: new Date().toISOString()
      });
    });
  }

  handleRequest(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('\n');

    this.clients.add(res);
    console.log(`[SSE] Client connected. Total SSE clients: ${this.clients.size}`);

    // Send initial snapshot event
    const allOrders = smartMerger.getAllRecords();
    const snapshot = {
      type: 'INIT_SNAPSHOT',
      timestamp: new Date().toISOString(),
      total: allOrders.length,
      orders: allOrders,
      userEdits: storage.getAllUserEdits(),
      summary: syncEngine.getSummary()
    };
    res.write(`event: INIT_SNAPSHOT\ndata: ${JSON.stringify(snapshot)}\n\n`);

    // Keep connection alive with heartbeat comment every 25s
    const keepAliveTimer = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 25000);

    req.on('close', () => {
      clearInterval(keepAliveTimer);
      this.clients.delete(res);
      console.log(`[SSE] Client disconnected. Total SSE clients: ${this.clients.size}`);
    });
  }

  broadcast(eventName, data) {
    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of this.clients) {
      try {
        res.write(payload);
      } catch (err) {
        this.clients.delete(res);
      }
    }
  }
}

export const sseServer = new SseServer();
