// backend/server.js
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './config.js';
import { handleApiRoute } from './routes/apiRoutes.js';
import { wsServer } from './realtime/wsServer.js';
import { sseServer } from './realtime/sseServer.js';
import { syncEngine } from './sync/syncEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({ raw: body });
      }
    });
    req.on('error', () => resolve({}));
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // 1. SSE Realtime Endpoint
  if (pathname === '/api/realtime/sse') {
    return sseServer.handleRequest(req, res);
  }

  // 2. API Routes
  if (pathname.startsWith('/api/') || pathname === '/health') {
    try {
      const body = (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')
        ? await parseBody(req)
        : null;
      const handled = await handleApiRoute(req, res, pathname, parsedUrl.searchParams, body);
      if (handled) return;

      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, message: 'API route not found' }));
      return;
    } catch (apiErr) {
      console.error('[Server API Error]', apiErr);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, success: false, error: apiErr.message }));
      }
      return;
    }
  }

  // 3. Static File Serving
  let filePath = path.join(ROOT_DIR, pathname === '/' ? 'PhanTichBaoHanh.html' : pathname);

  // If path doesn't exist, check index.html or fallback
  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(path.join(ROOT_DIR, 'PhanTichBaoHanh.html'))) {
      filePath = path.join(ROOT_DIR, 'PhanTichBaoHanh.html');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
  }

  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'PhanTichBaoHanh.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = fs.readFileSync(filePath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': content.length,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    res.end(content);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Internal Server Error: ${err.message}`);
  }
});

// Attach WebSocket Server
wsServer.init(server);

// Start HTTP Server
server.listen(CONFIG.PORT, () => {
  console.log('=====================================================');
  console.log(`🚀 VinFast CarOn Thới An Realtime Backend is RUNNING!`);
  console.log(`📡 Local URL:      http://localhost:${CONFIG.PORT}`);
  console.log(`🔌 WebSocket:      ws://localhost:${CONFIG.PORT}/ws`);
  console.log(`🌊 SSE Stream:     http://localhost:${CONFIG.PORT}/api/realtime/sse`);
  console.log(`📦 Workshop:       Mã đại lý: ${CONFIG.DEALER_CODE} | Branch: ${CONFIG.BRANCH_ID}`);
  console.log('=====================================================');

  // Start background sync loops
  syncEngine.start().catch((err) => {
    console.error('[Server] Failed to start sync engine:', err);
  });
});

process.on('SIGINT', () => {
  console.log('\n[Server] Graceful shutdown initiated...');
  syncEngine.stop();
  server.close(() => {
    console.log('[Server] Closed.');
    process.exit(0);
  });
});
