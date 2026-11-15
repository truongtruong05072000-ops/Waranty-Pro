# Test creating the new scrollcraft stylesheet and function replacements
import re, os, subprocess

SCROLLCRAFT_CSS = """
/* =====================================================================
   NT BẢO HÀNH PRO — SCROLL-CRAFT EXECUTIVE TELEMETRY SYSTEM (2026)
   Built on Scroll-Craft Taste Floor: Obsidian Cyber-Luxury Cockpit
   ===================================================================== */
:root {
  /* Scroll-Craft Palette */
  --sc-canvas: #080c15;
  --sc-surface: rgba(15, 23, 42, 0.75);
  --sc-surface-elevated: rgba(22, 33, 56, 0.85);
  --sc-surface-card: rgba(13, 20, 36, 0.72);
  
  --header-bg: rgba(9, 14, 26, 0.88);
  --header-border: rgba(56, 189, 248, 0.18);
  --tabbar-bg: rgba(11, 18, 33, 0.85);
  --tabbar-border: rgba(56, 189, 248, 0.12);
  
  --primary: #0284c7;
  --primary-glow: #38bdf8;
  --primary-light: rgba(56, 189, 248, 0.15);
  
  --sc-ink: #f8fafc;
  --sc-ink-soft: #94a3b8;
  --sc-ink-muted: #64748b;
  --text-main: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  
  --emerald: #10b981;
  --emerald-glow: #34d399;
  --emerald-soft: rgba(16, 185, 129, 0.12);
  --emerald-border: rgba(16, 185, 129, 0.32);
  
  --amber: #f59e0b;
  --amber-glow: #fbbf24;
  --amber-soft: rgba(245, 158, 11, 0.12);
  --amber-border: rgba(245, 158, 11, 0.32);
  
  --rose: #ef4444;
  --rose-glow: #f87171;
  --rose-soft: rgba(239, 68, 68, 0.12);
  --rose-border: rgba(239, 68, 68, 0.32);
  
  --border: rgba(56, 189, 248, 0.14);
  --border-light: rgba(255, 255, 255, 0.06);
  --border-subtle: rgba(255, 255, 255, 0.08);
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  --sc-edge: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  --shadow-card: 0 8px 32px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  --shadow-hover: 0 14px 40px -4px rgba(0, 0, 0, 0.65), 0 0 20px rgba(56, 189, 248, 0.15);
  --shadow-glow-cyan: 0 0 25px rgba(56, 189, 248, 0.4);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif;
  background-color: var(--sc-canvas);
  background-image: 
    radial-gradient(circle at 90% 0%, rgba(14, 165, 233, 0.15) 0%, transparent 45%),
    radial-gradient(circle at 10% 35%, rgba(59, 130, 246, 0.1) 0%, transparent 45%),
    radial-gradient(circle at 50% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 40%);
  background-attachment: fixed;
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

/* Scrollbar Sleek Styling */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: rgba(9, 14, 26, 0.6); }
::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.25); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.5); }

/* ================= HEADER TỐI CAO CẤP ================= */
.app-header {
  background: var(--header-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--header-border);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.45);
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
  gap: 16px;
}
.brand-emblem-wrap {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 50%;
  border: 2px solid #38bdf8;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.45), inset 0 0 10px rgba(0, 0, 0, 0.8);
  background: #000000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
}
.brand-emblem-wrap::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow: inset 0 0 12px rgba(56, 189, 248, 0.3);
  pointer-events: none;
}
.brand-emblem-wrap:hover {
  transform: scale(1.08) rotate(3deg);
  box-shadow: 0 0 28px rgba(56, 189, 248, 0.7);
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
  gap: 10px;
}
.brand-title-main {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 40%, #bae6fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}
.brand-badge-pro {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px rgba(56, 189, 248, 0.4);
}
.brand-subtitle-line {
  font-size: 11.5px;
  font-weight: 600;
  color: #7dd3fc;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-top: 2px;
}

/* Nút Header Bên Phải */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.vat-toggle-group {
  display: flex;
  background: rgba(17, 27, 49, 0.8);
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: var(--radius-full);
  padding: 3px;
}
.vat-toggle-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.2s;
}
.vat-toggle-btn.active {
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(2, 132, 199, 0.5);
}
.header-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(17, 27, 49, 0.85);
  border: 1px solid rgba(56, 189, 248, 0.22);
  color: #e2e8f0;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.header-btn:hover {
  background: rgba(30, 48, 86, 0.95);
  border-color: #38bdf8;
  color: #ffffff;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
}
.header-btn.excel-btn {
  background: linear-gradient(135deg, #059669, #10b981);
  border-color: #34d399;
  color: #ffffff;
  box-shadow: 0 2px 12px rgba(16, 185, 129, 0.35);
}
.header-btn.excel-btn:hover {
  background: linear-gradient(135deg, #047857, #059669);
  box-shadow: 0 4px 18px rgba(16, 185, 129, 0.5);
  transform: translateY(-1px);
}

/* ================= THANH MENU TAB (STICKY) ================= */
.nav-tabbar {
  background: var(--tabbar-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--tabbar-border);
  position: sticky;
  top: 0;
  z-index: 40;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
.nav-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
}
.nav-tab {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 13px 18px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  transition: all 0.2s;
  white-space: nowrap;
  letter-spacing: 0.01em;
}
.nav-tab:hover {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.05);
}
.nav-tab.active {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
  text-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
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
  box-shadow: 0 0 12px #38bdf8;
}
.tab-badge {
  background: rgba(239, 68, 68, 0.25);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.45);
  font-size: 10.5px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: var(--radius-full);
}

/* ================= THANH THÔNG SỐ CONTEXT ================= */
.context-strip {
  background: rgba(13, 20, 36, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.context-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 9px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.context-chips {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.context-chips .chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(17, 27, 49, 0.7);
  border: 1px solid rgba(56, 189, 248, 0.16);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  color: #94a3b8;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
.context-chips .chip b {
  color: #f8fafc;
  font-weight: 700;
}
.context-chips .chip.target-chip {
  border-color: rgba(56, 189, 248, 0.4);
  background: rgba(14, 165, 233, 0.12);
}
.context-chips .chip.target-chip b {
  color: #38bdf8;
}

/* ================= KHỐI NỘI DUNG CHÍNH ================= */
main {
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
  background: var(--sc-surface-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  margin-bottom: 22px;
  overflow: hidden;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.card:hover {
  box-shadow: var(--shadow-hover);
}
.card-header {
  padding: 16px 22px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: rgba(16, 26, 48, 0.85);
}
.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;
}
.card-subtitle {
  font-size: 12.5px;
  color: #94a3b8;
  margin-top: 2px;
}
.card-body {
  padding: 22px;
}

/* ================= KPI GRID (THẺ CHỈ SỐ) ================= */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}
.kpi-card {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px 22px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
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
  height: 3px;
  background: var(--primary);
}
.kpi-card.blue::before { background: #38bdf8; box-shadow: 0 0 10px #38bdf8; }
.kpi-card.emerald::before { background: #10b981; box-shadow: 0 0 10px #10b981; }
.kpi-card.amber::before { background: #f59e0b; box-shadow: 0 0 10px #f59e0b; }
.kpi-card.indigo::before { background: #6366f1; box-shadow: 0 0 10px #6366f1; }
.kpi-card.rose::before { background: #ef4444; box-shadow: 0 0 10px #ef4444; }

.kpi-title, .kpi-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.kpi-val {
  font-size: 30px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.03em;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}
.kpi-sub {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
  line-height: 1.4;
}
.kpi-sub b {
  color: #e2e8f0;
}

/* Verdict Banner */
.verdict-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  margin-bottom: 22px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
}
.verdict-banner.success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.8));
  border-color: rgba(16, 185, 129, 0.35);
}
.verdict-banner.warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(15, 23, 42, 0.8));
  border-color: rgba(245, 158, 11, 0.35);
}
.verdict-banner.danger {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(15, 23, 42, 0.8));
  border-color: rgba(239, 68, 68, 0.35);
}
.verdict-icon { font-size: 28px; }
.verdict-content h4 { font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 2px; }
.verdict-content p { font-size: 12.5px; color: #94a3b8; line-height: 1.4; }

/* ================= BẢNG BIỂU (TABLES) ================= */
.table-wrap, .table-container {
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
  background: rgba(17, 27, 49, 0.95);
  color: #94a3b8;
  font-weight: 700;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.16);
  white-space: nowrap;
}
td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-light);
  color: #e2e8f0;
  transition: background 0.15s;
}
tr:hover td {
  background: rgba(56, 189, 248, 0.04);
}
td.num, th.num { text-align: center; }
td.r, th.r { text-align: right; }
td.l, th.l { text-align: left; }

/* Status Pills */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
}
.status-pill.unchecked {
  background: rgba(239, 68, 68, 0.16);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.4);
}
.status-pill.recheck {
  background: rgba(245, 158, 11, 0.16);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.4);
}
.status-pill.checked {
  background: rgba(16, 185, 129, 0.16);
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

/* Row highlights */
.row-unchecked td { background: rgba(239, 68, 68, 0.02); }
.row-recheck td { background: rgba(245, 158, 11, 0.02); }
.row-checked td { background: rgba(16, 185, 129, 0.02); }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  color: #ffffff;
  border: 1px solid #38bdf8;
  padding: 7px 15px;
  border-radius: var(--radius-md);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(2, 132, 199, 0.35);
}
.btn:hover {
  background: linear-gradient(135deg, #0369a1, #0284c7);
  box-shadow: 0 4px 16px rgba(56, 189, 248, 0.45);
  transform: translateY(-1px);
}
.btn.primary {
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  border-color: #38bdf8;
}
.btn.secondary {
  background: rgba(20, 32, 58, 0.8);
  color: #cbd5e1;
  border: 1px solid rgba(56, 189, 248, 0.22);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
}
.btn.secondary:hover {
  background: rgba(30, 48, 86, 0.95);
  border-color: #38bdf8;
  color: #ffffff;
}

/* Forms & Inputs */
.field-input, input[type="text"], input[type="number"], input[type="month"], select, textarea {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: var(--radius-md);
  color: #f8fafc;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
}
.field-input:focus, input:focus, select:focus, textarea:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.3);
}
.field-group {
  margin-bottom: 14px;
}
.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Dropzones */
.dropzone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 14px;
}
.dropzone {
  border: 2px dashed rgba(56, 189, 248, 0.3);
  background: rgba(15, 23, 42, 0.6);
  border-radius: var(--radius-lg);
  padding: 28px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.dropzone:hover, .dropzone.over {
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
}
.dropzone-icon { font-size: 32px; margin-bottom: 8px; }
.dropzone-title { font-size: 14.5px; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
.dropzone-desc { font-size: 12px; color: #94a3b8; line-height: 1.5; }

/* Empty state */
.empty-state {
  padding: 48px 24px;
  text-align: center;
}
.empty-state-icon { font-size: 42px; margin-bottom: 12px; }

/* Tags */
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}
.tag.warn { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
.tag.ok { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(4, 7, 14, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal-overlay[hidden] { display: none !important; }
.modal-box {
  background: #0d1527;
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.15);
  width: 100%;
  max-width: 620px;
  position: relative;
  animation: modalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  color: #f8fafc;
}
@keyframes modalEnter {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.modal-close {
  position: absolute;
  top: 16px; right: 16px;
  background: transparent;
  border: none;
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.15s;
}
.modal-close:hover { color: #ffffff; }
.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 24px;
  font-size: 12px;
  color: #64748b;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 24px;
}
"""

print('Scrollcraft CSS defined, length:', len(SCROLLCRAFT_CSS))
