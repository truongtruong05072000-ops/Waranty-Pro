# -*- coding: utf-8 -*-
import sys, re

with open('_build/logo_base64.txt', 'r', encoding='utf-8') as f:
    logo_base64 = f.read().strip()

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Clean up any leaked text at the bottom before </body>
leak_idx = html.find('// =====================================================================')
if leak_idx != -1:
    body_idx = html.find('</body>', leak_idx)
    if body_idx != -1:
        html = html[:leak_idx] + html[body_idx:]
        print("Cleaned leak_idx text at bottom!")

# Also clean any loose text before </body>
pos_last_script = html.rfind('</script>')
if pos_last_script != -1:
    pos_body = html.find('</body>', pos_last_script)
    if pos_body != -1 and pos_body > pos_last_script + 9:
        between = html[pos_last_script+9:pos_body].strip()
        if between and not between.startswith('<'):
            print("Found and cleaned raw text between </script> and </body>:", between[:60])
            html = html[:pos_last_script+9] + '\n' + html[pos_body:]

# 2. Perfect Brand Header HTML
# Perfectly aligned flex container: 46px circular logo + Title + Subtitle
perfect_brand_html = f'''    <div class="brand-group">
      <div class="brand-emblem-wrap" title="NT - VinFast After-Sales Pro">
        <img class="brand-logo-img" src="{logo_base64}" alt="NT Logo">
      </div>
      <div class="brand-text-block">
        <div class="brand-title-line">
          <span class="brand-title-main">NT BẢO HÀNH PRO</span>
          <span class="brand-badge-pro">PRO v3.0</span>
        </div>
        <div class="brand-subtitle-line">Hệ thống Phân tích Bảo hành &amp; Quản trị Xưởng Xe điện</div>
      </div>
    </div>'''

# Replace current brand-group
brand_start = html.find('<div class="brand-group">')
if brand_start != -1:
    # find where header-actions starts
    ha_start = html.find('<div class="header-actions">', brand_start)
    if ha_start != -1:
        # brand-group ends right before header-actions
        brand_end = html.rfind('</div>', brand_start, ha_start)
        # find the outer closing div of brand-group
        # let's be precise:
        html = html[:brand_start] + perfect_brand_html + '\n    \n    ' + html[ha_start:]
        print("Updated brand group to perfect_brand_html!")

# 3. Clean and Unified Masterclass Executive CSS (Block 1)
masterclass_css = """
/* =====================================================================
   NT BẢO HÀNH PRO — MASTERCLASS EXECUTIVE DESIGN SYSTEM (2026 EDITION)
   Thiết kế cao cấp, chuẩn mực, đồng bộ, tinh tế và cực kỳ dịu mắt
   ===================================================================== */
:root {
  /* Color Palette */
  --bg-app: #f1f5f9;
  --bg-card: #ffffff;
  --bg-surface-elevated: #f8fafc;
  
  --header-bg: #0b1324;
  --header-border: rgba(56, 189, 248, 0.22);
  --tabbar-bg: #0f1a30;
  --tabbar-border: #1e2c47;
  
  --primary: #0284c7;
  --primary-glow: #38bdf8;
  --primary-light: #e0f2fe;
  
  --text-main: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --text-light: #94a3b8;
  
  --emerald: #10b981;
  --emerald-dark: #059669;
  --emerald-soft: #ecfdf5;
  --emerald-border: #a7f3d0;
  
  --amber: #f59e0b;
  --amber-dark: #d97706;
  --amber-soft: #fffbeb;
  --amber-border: #fde68a;
  
  --rose: #ef4444;
  --rose-dark: #dc2626;
  --rose-soft: #fef2f2;
  --rose-border: #fecaca;
  
  --border: #e2e8f0;
  --border-light: #f1f5f9;
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 9999px;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-card: 0 4px 18px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04);
  --shadow-hover: 0 10px 25px -4px rgba(15, 23, 42, 0.1), 0 4px 10px -2px rgba(15, 23, 42, 0.04);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--bg-app);
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

/* ================= HEADER TỐI CAO CẤP ================= */
.app-header {
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 50;
}
.header-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Khối Logo NT và Tiêu đề */
.brand-group {
  display: flex;
  align-items: center;
  gap: 14px;
}
.brand-emblem-wrap {
  width: 46px;
  height: 46px;
  min-width: 46px;
  border-radius: 50%;
  border: 2px solid #38bdf8;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.45), inset 0 0 8px rgba(0, 0, 0, 0.6);
  background: #000000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  cursor: pointer;
}
.brand-emblem-wrap:hover {
  transform: scale(1.08) rotate(3deg);
  box-shadow: 0 0 22px rgba(56, 189, 248, 0.7);
}
.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.brand-text-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.brand-title-line {
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand-title-main {
  font-size: 17.5px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
.brand-badge-pro {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.35);
}
.brand-subtitle-line {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  margin-top: 1px;
}

/* Nút Header Bên Phải */
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.vat-toggle-group {
  display: flex;
  background: #17243c;
  border: 1px solid #293d61;
  border-radius: var(--radius-full);
  padding: 3px;
}
.vat-toggle-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.2s;
}
.vat-toggle-btn.active {
  background: #0284c7;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(2, 132, 199, 0.4);
}
.header-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #17243c;
  border: 1px solid #293d61;
  color: #e2e8f0;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.header-btn:hover {
  background: #233555;
  border-color: #3b527d;
  color: #ffffff;
}
.header-btn.excel-btn {
  background: linear-gradient(135deg, #059669, #10b981);
  border-color: #10b981;
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
}
.header-btn.excel-btn:hover {
  background: linear-gradient(135deg, #047857, #059669);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.45);
}

/* ================= THANH MENU TAB (STICKY) ================= */
.nav-tabbar {
  background: var(--tabbar-bg);
  border-bottom: 1px solid var(--tabbar-border);
  position: sticky;
  top: 0;
  z-index: 40;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.nav-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 6px;
  overflow-x: auto;
}
.nav-tab {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 12px 16px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  transition: all 0.2s;
  white-space: nowrap;
}
.nav-tab:hover {
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.04);
}
.nav-tab.active {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
}
.nav-tab.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 12px;
  right: 12px;
  height: 3px;
  background: #38bdf8;
  border-radius: 3px 3px 0 0;
  box-shadow: 0 0 10px #38bdf8;
}
.tab-badge {
  background: #ef4444;
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

/* ================= THANH THÔNG SỐ CONTEXT ================= */
.context-strip {
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}
.context-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.context-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.context-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid var(--border);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  color: var(--text-secondary);
}
.context-chip b {
  color: var(--text-main);
}
.context-chip.alert-chip {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
  font-weight: 700;
}
.context-chip.alert-chip b {
  color: #dc2626;
}

/* ================= KHỐI NỘI DUNG CHÍNH ================= */
.main-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}
.tab-pane {
  display: none;
}
.tab-pane.active {
  display: block;
}

/* ================= THẺ CARD CHUYÊN NGHIỆP ================= */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  margin-bottom: 20px;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}
.card:hover {
  box-shadow: var(--shadow-hover);
}
.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: #ffffff;
}
.card-title {
  font-size: 15.5px;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-subtitle {
  font-size: 12.5px;
  color: var(--text-muted);
  margin-top: 2px;
}
.card-body {
  padding: 20px;
}

/* ================= KPI GRID (THẺ CHỈ SỐ) ================= */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.kpi-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
.kpi-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary);
}
.kpi-card.target::before { background: #0284c7; }
.kpi-card.projected::before { background: #6366f1; }
.kpi-card.daily::before { background: #f59e0b; }
.kpi-card.remaining::before { background: #ef4444; }

.kpi-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.kpi-val {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.kpi-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 6px;
}

/* ================= BẢNG BIỂU (TABLES) ================= */
.table-wrap {
  width: 100%;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: left;
}
th {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 12px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-main);
}
tr:hover td {
  background: #f8fafc;
}
td.num, th.num { text-align: center; }
td.r, th.r { text-align: right; }

/* Status Pills */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
}
.status-pill.unchecked {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.status-pill.recheck {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}
.status-pill.checked {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

/* Row highlights */
.row-unchecked td { background: #fffbfb; }
.row-recheck td { background: #fffdfa; }
.row-checked td { background: #fbfdfb; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0284c7;
  color: #ffffff;
  border: 1px solid #0284c7;
  padding: 7px 14px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(2, 132, 199, 0.2);
}
.btn:hover {
  background: #0369a1;
  border-color: #0369a1;
  box-shadow: 0 3px 8px rgba(2, 132, 199, 0.35);
}
.btn.secondary {
  background: #ffffff;
  color: var(--text-main);
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.btn.secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal-overlay[hidden] { display: none !important; }
.modal-box {
  background: #ffffff;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 620px;
  position: relative;
  animation: modalEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalEnter {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 18px;
  color: var(--text-muted);
  cursor: pointer;
}
.modal-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}

/* Gate Lock Screen */
.gate-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0b1324;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gate-modal {
  background: #111c33;
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: var(--radius-lg);
  padding: 32px;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}
.gate-modal h2 {
  color: #ffffff;
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 4px;
}
.gate-modal p {
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 20px;
}
.gate-modal input {
  width: 100%;
  padding: 11px 14px;
  background: #0b1324;
  border: 1px solid #243552;
  border-radius: var(--radius-md);
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  margin-bottom: 12px;
  outline: none;
}
.gate-modal input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
}
.gate-remember {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
"""

# Replace Block 1 CSS entirely with masterclass_css
s1 = html.find('<style>')
e1 = html.find('</style>', s1)
if s1 != -1 and e1 != -1:
    html = html[:s1+7] + masterclass_css + html[e1:]
    print("Replaced Block 1 CSS with masterclass_css successfully!")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated app_template2.html successfully!")
