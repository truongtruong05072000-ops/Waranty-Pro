// backend/config.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Đọc file .env nếu có mà không cần thư viện dotenv ngoài
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  HOST: process.env.HOST || '0.0.0.0',
  DEALER_CODE: process.env.DEALER_CODE || 'N54511',
  BRANCH_ID: parseInt(process.env.BRANCH_ID || '2', 10), // VinFast CarOn Thới An = 2
  WORKSHOP_NAME: 'VinFast CarOn Thới An',

  // ATT-ServiceOS Config
  SERVICEOS: {
    BASE_URL: process.env.SERVICEOS_BASE_URL || 'https://att-serviceos.anthinhtech.vn',
    USERNAME: process.env.SERVICEOS_USERNAME || 'truongtnn',
    PASSWORD: process.env.SERVICEOS_PASSWORD || '',
    POLL_INTERVAL_MS: parseInt(process.env.SERVICEOS_POLL_INTERVAL_MS || '4000', 10), // 3-5 giây
  },

  // VinFast Dealer Portal Config
  DEALER_PORTAL: {
    BASE_URL: process.env.DEALER_PORTAL_BASE_URL || 'https://dealer-portal-api.vinfast.com',
    PORTAL_WEB_URL: 'https://dealer-portal.vinfast.com',
    REFRESH_TOKEN: process.env.DEALER_PORTAL_REFRESH_TOKEN || '',
    ACCESS_TOKEN: process.env.DEALER_PORTAL_ACCESS_TOKEN || '',
    STREAM_A_INTERVAL_MS: parseInt(process.env.DP_STREAM_A_INTERVAL_MS || '35000', 10), // 35 giây quét full lệnh mở
    STREAM_B_INTERVAL_MS: parseInt(process.env.DP_STREAM_B_INTERVAL_MS || '5000', 10),  // 5 giây quét lệnh mới/invoiced
    REFRESH_INTERVAL_MS: 12 * 60 * 1000, // 12 phút tự động refresh token
  },

  PATHS: {
    ROOT: ROOT_DIR,
    AUTH_CACHE: path.join(ROOT_DIR, '.auth-cache.json'),
    DB_CACHE: path.join(ROOT_DIR, '.data-cache.json'),
    FRONTEND_HTML: path.join(ROOT_DIR, 'PhanTichBaoHanh.html'),
  }
};
