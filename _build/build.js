// _build/build.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PASS = 'n54511';
const sha = crypto.createHash('sha256').update(PASS, 'utf-8').digest('hex');

function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash * 33) + str.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16);
}
const fb = djb2(PASS);

const tplPath = path.join(__dirname, 'app_template2.html');
const libPath = path.join(__dirname, 'xlsx.full.min.js');

const tpl = fs.readFileSync(tplPath, 'utf-8');
const lib = fs.readFileSync(libPath, 'utf-8');

if (!tpl.includes('<!--SHEETJS-->')) {
  console.error('[Build Error] Marker <!--SHEETJS--> missing in app_template2.html');
  process.exit(1);
}

let out = tpl.replace('<!--SHEETJS-->', '<script>\n' + lib + '\n</script>');
out = out.replace(/__PASS_SHA__/g, sha).replace(/__PASS_FB__/g, fb);

// Write root PhanTichBaoHanh.html
const rootHtml = path.join(ROOT_DIR, 'PhanTichBaoHanh.html');
fs.writeFileSync(rootHtml, out, 'utf-8');

// Write _build/PhanTichBaoHanh.html
const buildHtml = path.join(__dirname, 'PhanTichBaoHanh.html');
fs.writeFileSync(buildHtml, out, 'utf-8');

// Write _deploy/index.html
const deployDir = path.join(ROOT_DIR, '_deploy');
if (!fs.existsSync(deployDir)) fs.mkdirSync(deployDir, { recursive: true });
const deployHtml = path.join(deployDir, 'index.html');
fs.writeFileSync(deployHtml, out, 'utf-8');

console.log(`[Build OK] Successfully compiled HTML (${out.length} characters)`);
