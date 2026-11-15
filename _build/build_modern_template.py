# -*- coding: utf-8 -*-
import io, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(BASE, 'app_template2.html')

template_content = r'''<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BẢO HÀNH PRO — Phân tích Bảo hành &amp; Lập Kế hoạch Doanh thu</title>
<style>
/* ================= Modern SaaS Design System ================= */
:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-alt: #f1f5f9;
  --border: #e2e8f0;
  --border-light: #edf2f7;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --text-light: #94a3b8;
  
  --brand-navy: #091322;
  --brand-navy-light: #132238;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-soft: #eff6ff;
  
  --emerald: #059669;
  --emerald-soft: #ecfdf5;
  --emerald-border: #a7f3d0;
  
  --amber: #d97706;
  --amber-soft: #fffbeb;
  --amber-border: #fde68a;
  
  --rose: #e11d48;
  --rose-soft: #fff1f2;
  --rose-border: #fecdd3;
  
  --indigo: #4f46e5;
  --indigo-soft: #eef2ff;
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 9999px;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: var(--bg);
  color: var(--text-main);
  font-size: 13.5px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* ================= Header ================= */
.app-header {
  background: var(--brand-navy);
  color: #fff;
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(59,130,246,0.35);
}
.brand-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
}
.brand-badge {
  font-size: 10.5px;
  font-weight: 600;
  background: rgba(255,255,255,0.15);
  color: #93c5fd;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  letter-spacing: 0.3px;
}
.brand-subtitle {
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: -1px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* Top VAT Toggle Pill */
.vat-toggle-group {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  padding: 2px;
}
.vat-toggle-btn {
  padding: 4px 11px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 600;
  color: #cbd5e1;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}
.vat-toggle-btn.active {
  background: #3b82f6;
  color: #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.25);
}
.vat-toggle-btn:hover:not(.active) {
  color: #ffffff;
  background: rgba(255,255,255,0.06);
}

.header-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  color: #f1f5f9;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}
.header-btn:hover {
  background: rgba(255,255,255,0.18);
  color: #ffffff;
}
.header-btn.excel-btn {
  background: #059669;
  border-color: #047857;
  color: #ffffff;
}
.header-btn.excel-btn:hover {
  background: #047857;
}

/* ================= Tab Navigation ================= */
.nav-tabbar {
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 57px;
  z-index: 90;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}
.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}
.nav-container::-webkit-scrollbar { display: none; }
.nav-tab {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.15s ease;
}
.nav-tab:hover {
  color: var(--primary);
  background: #f8fafc;
}
.nav-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  font-weight: 700;
}
.nav-tab .tab-badge {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  background: #e2e8f0;
  color: var(--text-muted);
}
.nav-tab.active .tab-badge {
  background: var(--primary-soft);
  color: var(--primary);
}

/* ================= Quick Context Bar ================= */
.context-strip {
  background: #ffffff;
  border-bottom: 1px solid var(--border-light);
  padding: 8px 20px;
  font-size: 12px;
  color: var(--text-muted);
}
.context-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.context-chips {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-weight: 500;
  color: var(--text-main);
}
.chip b { font-weight: 700; color: #0f172a; }
.chip.target-chip {
  background: #fef3c7;
  border-color: #fde68a;
  color: #92400e;
}
.chip.target-chip b { color: #78350f; }

/* ================= Layout & Cards ================= */
main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 20px 80px;
}
.tab-pane {
  display: none;
  animation: fadeIn 0.15s ease;
}
.tab-pane.active {
  display: block;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-light);
}
.card-title {
  font-size: 15px;
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

/* ================= Hero KPI Cards ================= */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.kpi-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.kpi-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #cbd5e1;
}
.kpi-card.blue::before { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.kpi-card.emerald::before { background: linear-gradient(90deg, #059669, #34d399); }
.kpi-card.amber::before { background: linear-gradient(90deg, #d97706, #fbbf24); }
.kpi-card.indigo::before { background: linear-gradient(90deg, #4f46e5, #818cf8); }

.kpi-title {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kpi-val {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.5px;
  margin: 6px 0 4px;
  font-variant-numeric: tabular-nums;
}
.kpi-sub {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 5px;
}

/* ================= Check Xe Hàng Ngày ================= */
.category-chip-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: 14px;
  scrollbar-width: thin;
}
.cat-chip {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 12.5px;
  font-weight: 600;
  border: 1px solid var(--border);
  background: #ffffff;
  color: var(--text-main);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.15s ease;
}
.cat-chip:hover {
  background: var(--surface-alt);
  border-color: #cbd5e1;
}
.cat-chip.active {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
  box-shadow: 0 2px 5px rgba(15,23,42,0.25);
}
.cat-chip .chip-count {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  background: #f1f5f9;
  color: var(--text-muted);
}
.cat-chip.active .chip-count {
  background: rgba(255,255,255,0.2);
  color: #ffffff;
}

.status-pill.unchecked {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  font-weight: 700;
  padding: 3px 10px;
}
.status-pill.checked {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
  font-weight: 700;
  padding: 3px 10px;
}

tr.row-unchecked td {
  background: #fffdfd;
}
tr.row-unchecked:hover td {
  background: #fff5f5;
}
tr.row-unchecked td:first-child {
  border-left: 4px solid #ef4444;
}
tr.row-checked td:first-child {
  border-left: 4px solid #22c55e;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(2px);
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
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  position: relative;
}
.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-muted);
  cursor: pointer;
}
.modal-close:hover { color: var(--text-main); }
.bookmarklet-btn {
  display: inline-block;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: #ffffff !important;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  text-decoration: none;
  cursor: grab;
  box-shadow: 0 4px 12px rgba(37,99,235,0.3);
  margin: 12px 0;
}
.bookmarklet-btn:active { cursor: grabbing; }

/* ================= Verdict Banner ================= */
.verdict-banner {
  border-radius: var(--radius-md);
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  box-shadow: var(--shadow-sm);
}
.verdict-banner.ok {
  background: #f0fdf4;
  border: 1px solid var(--emerald-border);
  color: #14532d;
}
.verdict-banner.warn {
  background: #fffbeb;
  border: 1px solid var(--amber-border);
  color: #78350f;
}
.verdict-banner.risk {
  background: #fff1f2;
  border: 1px solid var(--rose-border);
  color: #881337;
}
.verdict-icon {
  font-size: 24px;
  line-height: 1;
}
.verdict-content h4 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}
.verdict-content p {
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.95;
}

/* ================= Tables ================= */
.table-container {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: #ffffff;
}
.table-container.scrollable {
  max-height: 520px;
  overflow-y: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: right;
  white-space: nowrap;
}
th, td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-light);
}
th {
  background: #f8fafc;
  font-size: 11.5px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 1px solid var(--border);
}
th.l, td.l { text-align: left; }
th:first-child, td:first-child { text-align: left; }
tbody tr:hover td {
  background: #f8fafc;
}
tbody tr.total-row td {
  background: #f1f5f9;
  font-weight: 700;
  color: var(--text-main);
  border-top: 2px solid #cbd5e1;
}
.num { font-variant-numeric: tabular-nums; }
.part-name-cell {
  white-space: normal !important;
  min-width: 220px;
  max-width: 320px;
  color: var(--text-main);
}

/* Status Badges & Pills */
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.b-ok, .status-pill.confirmed {
  background: var(--emerald-soft);
  color: var(--emerald);
  border: 1px solid var(--emerald-border);
}
.b-pipe, .status-pill.pipeline {
  background: var(--amber-soft);
  color: var(--amber);
  border: 1px solid var(--amber-border);
}
.b-ex, .status-pill.excluded {
  background: var(--rose-soft);
  color: var(--rose);
  border: 1px solid var(--rose-border);
}

.tag {
  display: inline-block;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
}
.tag.f1 { background: #e2e8f0; color: #475569; }
.tag.f2 { background: #e0f2fe; color: #0284c7; }
.tag.ok { background: var(--emerald-soft); color: var(--emerald); }
.tag.warn { background: var(--amber-soft); color: var(--amber); }
.tag.err { background: var(--rose-soft); color: var(--rose); }

/* ================= Dropzones ================= */
.dropzone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.dropzone {
  border: 2px dashed #cbd5e1;
  border-radius: var(--radius-lg);
  padding: 24px 20px;
  text-align: center;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dropzone:hover, .dropzone.over {
  border-color: var(--primary);
  background: var(--primary-soft);
}
.dropzone-icon {
  font-size: 32px;
  margin-bottom: 8px;
}
.dropzone-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}
.dropzone-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
  max-width: 380px;
}
input[type=file] { display: none; }

/* File Source List */
.source-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}
.source-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
}
.source-info {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}
.source-icon { font-size: 20px; flex: none; }
.source-details { min-width: 0; }
.source-name {
  font-weight: 600;
  color: var(--text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.source-meta {
  font-size: 11.5px;
  color: var(--text-muted);
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.source-del {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
}
.source-del:hover {
  color: var(--rose);
  background: var(--rose-soft);
}

/* ================= Toolbar & Forms ================= */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}
.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.search-input {
  padding: 7px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 13px;
  background: #ffffff;
  min-width: 240px;
  outline: none;
  transition: border-color 0.15s;
}
.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
}
.select-input {
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 13px;
  background: #ffffff;
  color: var(--text-main);
  outline: none;
}
.select-input:focus {
  border-color: var(--primary);
}

/* Buttons */
.btn {
  background: var(--primary);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-md);
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}
.btn:hover { background: var(--primary-hover); }
.btn.secondary {
  background: #ffffff;
  color: var(--text-main);
  border: 1px solid var(--border);
}
.btn.secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Action Items (Recommendations) */
.reco-card {
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  margin-bottom: 16px;
}
.reco-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  font-size: 13px;
  line-height: 1.5;
  border-bottom: 1px dashed var(--border);
}
.reco-item:last-child { border-bottom: none; }
.reco-icon {
  font-size: 15px;
  flex: none;
  margin-top: 1px;
}

/* Settings Form Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}
.field-input {
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 13px;
  background: #ffffff;
}
.field-input:focus {
  border-color: var(--primary);
  outline: none;
}

/* SVG Chart */
.chart-container {
  display: flex;
  justify-content: center;
  padding: 14px 0 6px;
}
.chart {
  width: 100%;
  max-width: 820px;
}

/* ================= Gate Modal ================= */
#appShell { display: block; }
body.locked { overflow: hidden; }
.gate-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #091322 0%, #172554 50%, #042f2e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.gate-overlay[hidden] { display: none !important; }
.gate-modal {
  background: #ffffff;
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  width: min(390px, 94vw);
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4);
}
.gate-modal .gate-logo {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: #fff;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 14px;
  box-shadow: 0 4px 12px rgba(37,99,235,0.3);
}
.gate-modal h2 { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
.gate-modal p { font-size: 13px; color: #64748b; margin-bottom: 18px; }
.gate-modal input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 16px;
  text-align: center;
  letter-spacing: 2px;
  outline: none;
  font-weight: 600;
}
.gate-modal input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
.gate-modal .btn { width: 100%; margin-top: 12px; padding: 11px; font-size: 14px; justify-content: center; }
.gate-err { color: var(--rose); font-size: 12px; font-weight: 600; margin-top: 8px; }
.gate-remember { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; color: #64748b; margin-top: 12px; }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--text-muted);
}
.empty-state-icon { font-size: 40px; margin-bottom: 10px; }

/* Footer */
.app-footer {
  text-align: center;
  font-size: 12px;
  color: var(--text-light);
  padding: 24px 0 0;
  border-top: 1px solid var(--border-light);
  margin-top: 30px;
}
@media print {
  .app-header, .nav-tabbar, .context-strip, .toolbar, .dropzone-grid, .btn { display: none !important; }
  .table-container { max-height: none !important; overflow: visible !important; }
  .tab-pane { display: block !important; }
}
</style>
</head>
<body>
<div id="appShell">

<!-- Top App Bar -->
<header class="app-header">
  <div class="header-container">
    <div class="brand-group">
      <div class="brand-icon">⚡</div>
      <div>
        <div class="brand-title">
          BẢO HÀNH PRO
          <span class="brand-badge">v2.0 Modern</span>
        </div>
        <div class="brand-subtitle">Phân tích Bảo hành &amp; Lập Kế hoạch Doanh thu</div>
      </div>
    </div>
    
    <div class="header-actions">
      <!-- Quick VAT Switcher Pill -->
      <div class="vat-toggle-group" id="topVatGroup">
        <button type="button" class="vat-toggle-btn active" id="btnVatInc" onclick="setVatMode('inc')">Sau VAT</button>
        <button type="button" class="vat-toggle-btn" id="btnVatEx" onclick="setVatMode('ex')">Trước VAT</button>
      </div>
      
      <button class="header-btn excel-btn" onclick="exportExcel()">
        <span>⬇</span> Xuất Excel
      </button>
      
      <button class="header-btn" onclick="gateOut()" title="Khoá phiên làm việc">
        <span>🔒</span> Thoát
      </button>
    </div>
  </div>
</header>

<!-- Segmented Navigation Tab Bar (Sticky) -->
<nav class="nav-tabbar">
  <div class="nav-container">
    <button class="nav-tab active" data-tab="overview" onclick="switchTab('overview')">
      <span>📊</span> Tổng quan doanh thu
    </button>
    <button class="nav-tab" data-tab="plan" onclick="switchTab('plan')">
      <span>🎯</span> Kế hoạch &amp; Tồn kho
    </button>
    <button class="nav-tab" data-tab="parts" onclick="switchTab('parts')">
      <span>📦</span> Phụ tùng 3 tháng
      <span class="tab-badge" id="badgePartsCount">0</span>
    </button>
    <button class="nav-tab" data-tab="claims" onclick="switchTab('claims')">
      <span>📋</span> Tra cứu đề xuất
      <span class="tab-badge" id="badgeClaimsCount">0</span>
    </button>
    <button class="nav-tab" data-tab="checkxe" onclick="switchTab('checkxe')">
      <span>🔍</span> Check lỗi xe hàng ngày
      <span class="tab-badge" id="badgeUncheckedCount" style="background:#fee2e2;color:#dc2626;font-weight:700">0</span>
    </button>
    <button class="nav-tab" data-tab="settings" onclick="switchTab('settings')">
      <span>⚙️</span> Tệp &amp; Cài đặt
      <span class="tab-badge" id="badgeFilesCount">0</span>
    </button>
  </div>
</nav>

<!-- Context / Summary Bar -->
<div class="context-strip">
  <div class="context-container">
    <div class="context-chips" id="contextChips">
      <span class="chip target-chip">🎯 Kỳ: <b id="ctxTargetMonth">—</b></span>
      <span class="chip">💰 Mục tiêu: <b id="ctxTargetVal">—</b></span>
      <span class="chip">📈 Dự kiến: <b id="ctxExpectedVal">—</b></span>
      <span class="chip">📁 Nguồn: <b id="ctxSourcesVal">—</b></span>
      <span class="chip" id="ctxCheckXeChip" style="display:none">🔍 Xe cần check: <b id="ctxUncheckedVal" style="color:#dc2626">0</b></span>
    </div>
    <div>
      <span id="ctxVatNote" style="font-size:11.5px;color:var(--text-muted)"></span>
    </div>
  </div>
</div>

<main>
  <!-- TAB 1: TỔNG QUAN -->
  <div class="tab-pane active" id="pane_overview">
    <div id="overviewContent"></div>
  </div>

  <!-- TAB 2: KẾ HOẠCH & TỒN KHO -->
  <div class="tab-pane" id="pane_plan">
    <div id="planContent"></div>
  </div>

  <!-- TAB 3: PHỤ TÙNG 3 THÁNG -->
  <div class="tab-pane" id="pane_parts">
    <div id="partsContent"></div>
  </div>

  <!-- TAB 4: TRA CỨU ĐỀ XUẤT -->
  <div class="tab-pane" id="pane_claims">
    <div id="claimsContent"></div>
  </div>

  <!-- TAB 5: CHECK LỖI XE HÀNG NGÀY (SERVICEOS) -->
  <div class="tab-pane" id="pane_checkxe">
    <div id="checkXeContent"></div>
  </div>

  <!-- TAB 6: TỆP & CÀI ĐẶT -->
  <div class="tab-pane" id="pane_settings">
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">📁 Nhập dữ liệu file Excel</div>
          <div class="card-subtitle">Kéo thả file vào khu vực bên dưới hoặc bấm để chọn file từ máy tính</div>
        </div>
      </div>
      
      <div class="dropzone-grid">
        <div>
          <div class="dropzone" id="dropZone">
            <div class="dropzone-icon">📋</div>
            <div class="dropzone-title">File Dữ Liệu BẢO HÀNH</div>
            <div class="dropzone-desc">File Active warranty claim, DeXuatBaoHanh_PhuTung, hoặc file Portal (warranty-claims). Hỗ trợ chọn nhiều file.</div>
          </div>
          <input type="file" id="fileInput" multiple accept=".xlsx,.xls">
          <div class="source-list" id="srcList"></div>
          <div id="parseWarn" style="margin-top:10px"></div>
        </div>
        
        <div>
          <div class="dropzone" id="invDropZone">
            <div class="dropzone-icon">📦</div>
            <div class="dropzone-title">File TỒN KHO PHỤ TÙNG (Tùy chọn)</div>
            <div class="dropzone-desc">File Excel chứa cột "Mã" / "Code" và cột "Tồn" / "Số lượng" để so sánh trực tiếp với kế hoạch.</div>
          </div>
          <input type="file" id="invFileInput" accept=".xlsx,.xls">
          <div class="source-list" id="invSrcList"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">⚙️ Thiết lập mục tiêu &amp; Quy tắc tính</div>
          <div class="card-subtitle">Tùy chỉnh tháng kế hoạch, doanh thu mục tiêu và ngày chốt sổ</div>
        </div>
      </div>
      
      <div class="settings-grid">
        <div class="field-group">
          <label class="field-label">Tháng lập kế hoạch (Tháng mục tiêu)</label>
          <input type="month" id="targetMonth" class="field-input">
        </div>
        <div class="field-group">
          <label class="field-label">Mục tiêu doanh thu (VND / tháng)</label>
          <input type="number" id="targetValue" class="field-input" step="1000000" min="0">
        </div>
        <div class="field-group">
          <label class="field-label">Ngày chốt doanh thu trong tháng</label>
          <input type="number" id="cutDay" class="field-input" min="1" max="28" value="22">
        </div>
        <div class="field-group">
          <label class="field-label">Chế độ thuế doanh thu</label>
          <select id="vatMode" class="field-input" style="font-weight:600">
            <option value="inc">Sau VAT (Gồm thuế) — Mặc định</option>
            <option value="ex">Trước VAT (Chưa thuế) — Khớp cột trước VAT</option>
          </select>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-top:16px;padding-top:14px;border-top:1px dashed var(--border)">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:500">
          <input type="checkbox" id="cycleToggle" checked>
          <span><b>Kỳ doanh thu chốt ngày 22</b> (23 tháng trước → 22 tháng này)</span>
        </label>
        
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:12px;color:var(--text-muted)">Nguồn file đang bật:</span>
          <div id="srcToggle" style="display:flex;gap:12px;font-size:12px"></div>
        </div>
      </div>

      <div id="ruleBox" style="margin-top:16px"></div>
    </div>

    <!-- Help Accordion -->
    <details class="card" style="cursor:pointer">
      <summary style="font-weight:700;color:var(--primary);font-size:14px">📖 Hướng dẫn sử dụng &amp; Nguyên tắc tính toán chi tiết</summary>
      <div style="margin-top:12px;line-height:1.6;color:var(--text-main);font-size:13px">
        <h4 style="margin:8px 0 4px">Cách dùng nhanh:</h4>
        <ul style="padding-left:20px;margin-bottom:12px">
          <li>1. Kéo thả file Excel dữ liệu bảo hành vào Tab "Tệp &amp; Cài đặt" — có thể kéo nhiều file cùng lúc.</li>
          <li>2. Chỉnh tháng kế hoạch và mục tiêu doanh thu nếu cần (mặc định 400.000.000 đ chốt ngày 22).</li>
          <li>3. Xem kết quả ở các Tab: <b>Tổng quan doanh thu</b>, <b>Kế hoạch &amp; Tồn kho</b>, <b>Phụ tùng 3 tháng</b>, và <b>Tra cứu đề xuất</b>. Bấm <b>Xuất Excel</b> để tải toàn bộ bảng tính.</li>
        </ul>
        <h4 style="margin:8px 0 4px">Quy ước tính toán:</h4>
        <ul style="padding-left:20px">
          <li><b>Đơn vị tính:</b> Mỗi đề xuất bảo hành (1 lệnh sửa chữa) là 1 đơn vị. Dù có nhiều phụ tùng khác nhau, tiền lấy theo tổng tiền đề xuất.</li>
          <li><b>Doanh thu chốt:</b> Các đề xuất ở trạng thái <b>Hoàn thành</b> và <b>Đã phê duyệt</b> được tính là doanh thu chốt. <b>Chờ phê duyệt cấp 1 / 2, Mở</b> được tính là dự trù. <b>Huỷ / Từ chối</b> bị loại bỏ.</li>
          <li><b>Tự động khấu trừ:</b> Số lượng và số tiền đã làm trong kỳ kế hoạch được tự động trừ ra khỏi kế hoạch phụ tùng còn lại.</li>
          <li><b>Tính bảo mật:</b> Ứng dụng chạy 100% trong trình duyệt máy bạn, không gửi dữ liệu ra ngoài Internet.</li>
        </ul>
      </div>
    </details>
  </div>

  <div class="app-footer">
    Hệ thống Phân tích Bảo hành &amp; Lập Kế hoạch Doanh thu · Phiên bản 2.0 Modern · Dữ liệu bảo mật cục bộ
  </div>
</main>
</div>

<!-- Password Gate Modal -->
<div id="gateLock" class="gate-overlay" hidden>
  <div class="gate-modal">
    <div class="gate-logo">🔒</div>
    <h2>BẢO HÀNH PRO</h2>
    <p>Nhập mã truy cập để mở công cụ phân tích</p>
    <input type="password" id="gatePass" placeholder="Mã truy cập" autocomplete="off">
    <button class="btn" id="gateBtn">Mở công cụ</button>
    <div id="gateErr" class="gate-err" hidden>❌ Mã truy cập không chính xác</div>
    <label class="gate-remember">
      <input type="checkbox" id="gateRemember"> Ghi nhớ trên máy tính này
    </label>
  </div>
</div>

<script>
(function(){
  var ok = false;
  try {
    ok = sessionStorage.getItem('bh_gate') === '1' || localStorage.getItem('bh_gate_r') === '1';
  } catch(e){}
  if(!ok){
    document.getElementById('appShell').style.display = 'none';
    document.getElementById('gateLock').hidden = false;
    document.body.classList.add('locked');
  }
})();
</script>

<!--SHEETJS-->

<script>
'use strict';
/* ============================ Helpers ============================ */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const norm = s => (s == null ? '' : String(s)).replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_\s]+/g, ' ').trim();
const ceilInt = x => Math.ceil(Math.round((+x || 0) * 1e6) / 1e6);
const fmtVND = n => Math.round(+n || 0).toLocaleString('vi-VN');
const fmtT = n => ((+n || 0) / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 });
const fmtN = (n, d = 2) => (+n || 0).toLocaleString('vi-VN', { maximumFractionDigits: d });
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const monthLabel = ym => { if (!ym) return '—'; const [y, m] = ym.split('-'); return `T${+m}/${y}`; };
const monthLong = ym => { if (!ym) return '—'; const [y, m] = ym.split('-'); return `tháng ${+m}/${y}`; };
const DAY = 86400000;

function parseNum(v){
  if(v == null || v === '') return 0;
  if(typeof v === 'number') return v;
  let s = String(v).trim().replace(/\s|₫|VND|vnd/g, '');
  if(!s) return 0;
  const neg = /^\(.*\)$/.test(s); s = s.replace(/[()]/g, '');
  s = s.replace(/[^\d.,\-]/g, '');
  if(s.includes(',') && s.includes('.')){
    if(s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if(s.includes(',')){
    const p = s.split(',');
    if(p.length === 2 && p[1].length !== 3) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if(s.includes('.')){
    const p = s.split('.');
    if(p.length > 2 || (p.length === 2 && p[1].length === 3 && p[0] !== '0')) s = s.replace(/\./g, '');
  }
  const n = parseFloat(s);
  return neg ? -n : (isNaN(n) ? 0 : n);
}

function parseDateVal(v){
  if(v == null || v === '') return null;
  if(v instanceof Date) return isNaN(v) ? null : v;
  if(typeof v === 'number'){
    const d = new Date(Math.round((v - 25569) * 86400000));
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes());
  }
  const s = String(v).trim();
  let m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})(?:[ T,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if(m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?[,\s]+(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
  if(m) return new Date(+m[6], +m[5] - 1, +m[4], +m[1], +m[2], +(m[3] || 0));
  m = s.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})(?:[ T,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if(m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

function fmtDate(d){
  if(!d) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/* ============================ Phân loại trạng thái ============================ */
const KIND_META = {
  confirmed: { k: 'confirmed', badge: 'b-ok', name: 'Chốt — Doanh thu' },
  pipeline:  { k: 'pipeline',  badge: 'b-pipe', name: 'Dự trù (Chờ duyệt / Mở)' },
  excluded:  { k: 'excluded',  badge: 'b-ex', name: 'Loại (Huỷ / Từ chối)' }
};
let statusRules = {};
try { statusRules = JSON.parse(localStorage.getItem('bh_statusrules') || '{}') || {}; } catch(e){ statusRules = {}; }

window.setRule = (ns, k) => {
  if(!KIND_META[k]) return;
  statusRules[ns] = k;
  try { localStorage.setItem('bh_statusrules', JSON.stringify(statusRules)); } catch(e){}
  renderAll();
};
window.resetRules = () => {
  statusRules = {};
  try { localStorage.removeItem('bh_statusrules'); } catch(e){}
  renderAll();
};

function statusKind(st){
  const s = norm(st);
  const label = String(st || '').trim() || '(Trống)';
  if(statusRules[s] && KIND_META[statusRules[s]]) return { ...KIND_META[statusRules[s]], label };
  if(!s) return { k: 'excluded', label, badge: 'b-ex' };
  if(s.includes('hoan thanh') || s.includes('da phe duyet') || s === 'phe duyet' || s === 'approved' || s === 'completed') return { k: 'confirmed', label, badge: 'b-ok' };
  if(s.includes('tu choi') || s.includes('reject')) return { k: 'excluded', label, badge: 'b-ex' };
  if(s.includes('huy') || s.includes('cancel')) return { k: 'excluded', label, badge: 'b-ex' };
  if(s.includes('cho phe duyet') || s.includes('pending') || s.includes('waiting') || s === 'mo' || s.startsWith('mo ') || s === 'open' || s === 'draft' || s === 'new' || s.includes('san sang gui') || s.includes('ready') || s === 'da in' || s === 'printed' || s.includes('tra ve') || s.includes('return') || s === 'submitted') return { k: 'pipeline', label, badge: 'b-pipe' };
  return { k: 'unknown', label, badge: 'b-ex' };
}

function cycleMonth(d, cut, shift){
  if(!d) return null;
  let y = d.getFullYear(), m = d.getMonth() + 1;
  if(shift && d.getDate() > cut){ m++; if(m > 12){ m = 1; y++; } }
  return `${y}-${String(m).padStart(2, '0')}`;
}
function prevMonths(ym, n){
  if(!ym) return [];
  let [y, m] = ym.split('-').map(Number); const out = [];
  for(let i = 0; i < n; i++){ m--; if(m === 0){ m = 12; y--; } out.unshift(`${y}-${String(m).padStart(2, '0')}`); }
  return out;
}
function cycleRangeText(ym, cut){
  const [y, m] = ym.split('-').map(Number);
  const py = m === 1 ? y - 1 : y, pm = m === 1 ? 12 : m - 1;
  return cut >= 28 ? `01/${String(m).padStart(2, '0')}–end/${String(m).padStart(2, '0')}/${y}` : `23/${String(pm).padStart(2, '0')}–${String(cut).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}
function cycleDaysOf(ym, cut){
  const [y, m] = ym.split('-').map(Number);
  return Math.max(1, Math.round((new Date(y, m - 1, cut) - new Date(y, m - 2, 23)) / DAY));
}

/* ============================ Parsing ============================ */
const KNOWN_PART_NAME_MAP = {
  'battery charger 1000w': 'DRT00011190AA',
  'top case comp': 'BDP12006000AC',
  'giam xoc sau': 'SUS00008613',
  'giam soc sau': 'SUS00007999',
  'motor in wheel 72v 1500w 12xmt2.15': 'DRT00009706BAR',
  'motor in wheel 72v 1800w 35hx14xmt3.5 bl': 'DRT00008966BAR',
  'bearing 6205 25x52x15': 'DRT00006059',
  'bearing 6204 20x47x14': 'DRT00006395',
  'dc-dc 1 dau ra 60v-12v/10a': 'DRT00007831',
  'bo dieu khien dong co 72v max 40a vanh 1': 'DRT00009394',
  'dong ho dien tu': 'CNI00009359',
  'bo chuyen doi dien ap 1 chieu': 'DRT00001717',
  'bo chuyen doi dien dcdc': 'DRT00011185AA',
  'wheel mt3.5x14': 'DRT00006046BAR',
  '96eel 260 50h mt12x2.15': 'DRT00007658BAR',
  'cover glue 1 bottle 600ml': 'SVC00009780AA',
  'van sau': 'RWH00002941',
  'giam xoc truoc phai': 'SUS00009587',
  'giam xoc truoc trai': 'SUS00009589',
  'battery pack lfp assy': 'BAT12006000',
  'den truoc, led': 'LID00005092',
  'brake side cover combination 260': 'DRT00006048BAR',
  'brake side cover combination': 'DRT00006577BAR',
  'seal 25x40x7 hmsa10': 'DRT00006397',
  'cong tac den': 'ELE00000022',
  'hex socket head cap screws m5x14 with lo': 'DRT00006061'
};

function inferPartCode(name, snNew, snOld, pMoney){
  const nn = norm(name).replace(/\.+$/, '').trim();
  const s1 = String(snNew || '').trim().toUpperCase();
  const s2 = String(snOld || '').trim().toUpperCase();
  if(nn.startsWith('battery charger 1000w')) return 'DRT00011190AA';
  if(nn === 'cum mo-dun ket noi thong minh 4g mini'){
    if(s1.startsWith('CNI00008608') || s2.startsWith('CNI00008608')) return 'CNI00008608';
    return 'CNI00009360';
  }
  if(nn === 'stator assy'){
    if(s1.startsWith('DRT00009040BAR') || s2.startsWith('DRT00009040BAR') || pMoney >= 5000000) return 'DRT00008967BAR';
    return 'DRT00009725';
  }
  if(nn === 'bo dieu khien dong co 72v/50a 14c'){
    return (pMoney > 0 && pMoney < 1400000) ? 'DRT00010066' : 'DRT00009885';
  }
  if(KNOWN_PART_NAME_MAP[nn]) return KNOWN_PART_NAME_MAP[nn];
  for(const s of [s1, s2]){
    const m = s.match(/^([A-Z]{3}\d{8}(?:AA|AC|AB|BAR)?)/);
    if(m) return m[1];
  }
  return '';
}

function sheetRows(ws){ try { return XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null }); } catch(e){ return []; } }
function findHeaderRow(rows){
  for(let i = 0; i < Math.min(rows.length, 10); i++){
    const r = rows[i] || [];
    if(r.filter(c => c != null && String(c).trim() !== '').length >= 4) return i;
  }
  return -1;
}
function buildColMap(header){
  const map = {};
  header.forEach((h, i) => { const n = norm(h); if(n && map[n] == null) map[n] = i; });
  return map;
}
function pickCol(map, row, cands){
  for(const c of cands){ if(map[c] != null && row[map[c]] != null && String(row[map[c]]).trim() !== '') return row[map[c]]; }
  for(const c of cands){
    for(const n in map){
      if(n !== c && n.includes(c) && map[n] != null && row[map[n]] != null && String(row[map[n]]).trim() !== '') return row[map[n]];
    }
  }
  return null;
}
function newRecord(){
  return { id: '', status: '', date: null, wo: '', vin: '', vehicle: '', total: 0, totalInc: 0, totalEx: 0, labor: 0, laborInc: 0, laborEx: 0, outsource: 0, parts: [], srcId: null, srcName: '', format: 0 };
}

function parseFile1Sheet(rows, src){
  const hi = findHeaderRow(rows);
  if(hi < 0) return [];
  const H = rows[hi], map = buildColMap(H);
  const idCol = map['so yeu cau bao hanh'] ?? map['so de xuat bao hanh'];
  if(idCol == null) return null;
  const isPortal = map['so de xuat bao hanh'] != null && map['so yeu cau bao hanh'] == null;
  const recs = [];
  for(let r = hi + 1; r < rows.length; r++){
    const row = rows[r]; if(!row || row.length === 0) continue;
    const idRaw = row[idCol];
    if(idRaw == null || String(idRaw).trim() === '') continue;
    const rec = newRecord();
    rec.id = String(idRaw).trim(); rec.format = isPortal ? 2 : 1; rec.srcId = src.id; rec.srcName = src.name;
    rec.status = String(pickCol(map, row, ['trang thai']) ?? '').trim();
    rec.date = parseDateVal(pickCol(map, row, ['ngay phe duyet 2', 'ngay phe duyet cap 2', 'ngay phe duyet cap 1', 'ngay phe duyet']))
      || parseDateVal(pickCol(map, row, ['ngay gui de xuat bao hanh', 'ngay gui']))
      || parseDateVal(pickCol(map, row, ['ngay tao']))
      || parseDateVal(pickCol(map, row, ['ngay chinh sua', 'ngay dxbh']))
      || parseDateVal(pickCol(map, row, ['ngay mo lsc', 'ngay mo lenh sua chua', 'ngay tao lenh sua chua']));
    rec.wo = String(pickCol(map, row, ['lenh sua chua']) ?? '').trim();
    rec.vin = String(pickCol(map, row, ['so khung', 'vin']) ?? '').trim();
    rec.vehicle = String(pickCol(map, row, ['ten xe', 'model xe']) ?? '').trim();
    const outsource = parseNum(pickCol(map, row, ['total outsource amount']));
    rec.outsource = outsource;
    const pMoneyInc = parseNum(pickCol(map, row, ['so tien bao hanh phu tung', 'tien vat tu yeu cau (sau vat)']));
    const pMoneyEx = parseNum(pickCol(map, row, ['tien vat tu yeu cau (truoc vat)'])) || pMoneyInc;
    const laborInc = parseNum(pickCol(map, row, ['tien cong yeu cau (sau vat)', 'tien cong yeu cau']));
    const laborEx = parseNum(pickCol(map, row, ['tien cong yeu cau (truoc vat)'])) || laborInc;
    const totalInc = parseNum(pickCol(map, row, ['tong tien yeu cau bao hanh', 'tong tien yeu cau (sau vat)'])) || (pMoneyInc + laborInc + outsource);
    const totalEx = parseNum(pickCol(map, row, ['tong tien yeu cau (truoc vat)'])) || (pMoneyEx + laborEx + outsource);

    rec.pMoneyInc = pMoneyInc; rec.pMoneyEx = pMoneyEx;
    rec.laborInc = laborInc; rec.laborEx = laborEx;
    rec.totalInc = totalInc; rec.totalEx = totalEx;
    rec.labor = (settings.vatMode === 'ex') ? laborEx : laborInc;
    rec.total = (settings.vatMode === 'ex') ? totalEx : totalInc;

    const rawCode = String(pickCol(map, row, ['ma phu tung chinh', 'phu tung chinh', 'ma phu tung', 'ma vat tu chinh']) ?? '').trim();
    const pName = String(pickCol(map, row, ['ten phu tung chinh', 'ten vat tu chinh']) ?? '').trim();
    const snNew = pickCol(map, row, ['so serial vat tu moi', 'serial phu tung moi']);
    const snOld = pickCol(map, row, ['so serial vat tu cu', 'serial phu tung cu']);
    const pMoneyVal = (settings.vatMode === 'ex') ? pMoneyEx : pMoneyInc;
    const code = rawCode || inferPartCode(pName, snNew, snOld, pMoneyVal);
    if(code || pName || pMoneyVal) rec.parts = [{ code: code || pName || '(KHÔNG MÃ)', name: pName, qty: 1, moneyInc: pMoneyInc, moneyEx: pMoneyEx, money: pMoneyVal, inferred: !rawCode }];
    recs.push(rec);
  }
  return recs;
}

function parseFile2Workbook(wb, src){
  const nameOf = wb.SheetNames.map(n => norm(n));
  const idx = pred => wb.SheetNames[nameOf.findIndex(n => pred(n))];
  const dxName = idx(n => n.startsWith('de xuat bao hanh'));
  if(!dxName) return null;
  const ptName = idx(n => n.startsWith('phu tung theo dxbh'));
  const ncName = idx(n => n.startsWith('nhan cong theo dxbh'));
  const ctName = idx(n => n.startsWith('chi tiet dxbh'));
  const proposals = new Map();
  const dxRows = sheetRows(wb.Sheets[dxName]);
  const hi = findHeaderRow(dxRows), map = buildColMap(dxRows[hi] || []);
  for(let r = hi + 1; r < dxRows.length; r++){
    const row = dxRows[r]; if(!row) continue;
    const idRaw = pickCol(map, row, ['de xuat bao hanh']);
    if(idRaw == null || String(idRaw).trim() === '') continue;
    const rec = newRecord();
    rec.id = String(idRaw).trim(); rec.format = 2; rec.srcId = src.id; rec.srcName = src.name;
    rec.status = String(pickCol(map, row, ['trang thai']) ?? '').trim();
    rec.date = parseDateVal(pickCol(map, row, ['ngay phe duyet'])) || parseDateVal(pickCol(map, row, ['ngay tao'])) || parseDateVal(pickCol(map, row, ['ngay chinh sua']));
    rec.wo = String(pickCol(map, row, ['ma lsc']) ?? '').trim();
    rec.vin = String(pickCol(map, row, ['vin']) ?? '').trim();
    rec.total = parseNum(pickCol(map, row, ['so tien phe duyet', 'tong tien phe duyet']));
    proposals.set(rec.id, rec);
  }
  if(ctName){
    const ctRows = sheetRows(wb.Sheets[ctName]), hi2 = findHeaderRow(ctRows), m2 = buildColMap(ctRows[hi2] || []);
    for(let r = hi2 + 1; r < ctRows.length; r++){
      const row = ctRows[r]; if(!row) continue;
      const id = String(pickCol(m2, row, ['de xuat bao hanh']) ?? '').trim();
      const rec = proposals.get(id);
      if(rec && !rec.total) rec.total = parseNum(pickCol(m2, row, ['tong (gom thue)', 'tong gom thue']));
    }
  }
  if(ptName){
    const ptRows = sheetRows(wb.Sheets[ptName]), hi2 = findHeaderRow(ptRows), m2 = buildColMap(ptRows[hi2] || []);
    for(let r = hi2 + 1; r < ptRows.length; r++){
      const row = ptRows[r]; if(!row) continue;
      const id = String(pickCol(m2, row, ['de xuat bao hanh']) ?? '').trim();
      const rec = proposals.get(id); if(!rec) continue;
      const code = String(pickCol(m2, row, ['ma phu tung']) ?? '').trim();
      const money = parseNum(pickCol(m2, row, ['tien gom thue'])) || parseNum(pickCol(m2, row, ['thanh tien sau km']));
      if(!code && !money) continue;
      rec.parts.push({ code: code || '(KHÔNG MÃ)', name: String(pickCol(m2, row, ['ten phu tung']) ?? '').trim(), qty: parseNum(pickCol(m2, row, ['so luong'])), money });
    }
  }
  if(ncName){
    const ncRows = sheetRows(wb.Sheets[ncName]), hi2 = findHeaderRow(ncRows), m2 = buildColMap(ncRows[hi2] || []);
    for(let r = hi2 + 1; r < ncRows.length; r++){
      const row = ncRows[r]; if(!row) continue;
      const id = String(pickCol(m2, row, ['de xuat bao hanh']) ?? '').trim();
      const rec = proposals.get(id); if(!rec) continue;
      rec.labor += parseNum(pickCol(m2, row, ['tien gom thue'])) || parseNum(pickCol(m2, row, ['thanh tien sau km']));
    }
  }
  for(const rec of proposals.values()){
    if(!rec.total) rec.total = rec.parts.reduce((s, p) => s + p.money, 0) + rec.labor + rec.outsource;
    rec.totalInc = rec.total; rec.totalEx = rec.total;
    rec.laborInc = rec.labor; rec.laborEx = rec.labor;
    for(const p of rec.parts){ p.moneyInc = p.money; p.moneyEx = p.money; }
  }
  return [...proposals.values()];
}

/* ============================ State ============================ */
const state = {
  activeTab: 'overview',
  sources: [],
  computed: null,
  filters: { cm: '', kind: '', q: '' },
  inventory: new Map(),
  invFileName: ''
};

function defaultTargetMonth(){
  const now = new Date();
  let y = now.getFullYear(), m = now.getMonth() + 1;
  if(now.getDate() > 22){ m++; if(m > 12){ m = 1; y++; } }
  return `${y}-${String(m).padStart(2, '0')}`;
}

const settings = {
  targetMonth: defaultTargetMonth(),
  target: 400000000,
  cut: 22,
  cycle22: true,
  vatMode: 'inc',
  disabledSrc: new Set()
};
try {
  const vm = localStorage.getItem('bh_vatmode');
  if(vm === 'ex' || vm === 'inc') settings.vatMode = vm;
} catch(e){}

/* ---- Phụ tùng dự tính ---- */
state.prepared = [{ code: '', qty: '' }];
const preparedKey = () => 'bh_prepared_' + settings.targetMonth;
function loadPrepared(){
  let l = null;
  try { l = JSON.parse(localStorage.getItem(preparedKey()) || 'null'); } catch(e){}
  state.prepared = Array.isArray(l) ? l.filter(r => r && typeof r === 'object') : [];
  if(!state.prepared.length) state.prepared = [{ code: '', qty: '' }];
}
function savePrepared(){
  try { localStorage.setItem(preparedKey(), JSON.stringify(state.prepared.filter(r => (r.code || '').trim() || (+r.qty || 0) > 0))); } catch(e){}
}
let prepTimer = null;
window.prepSet = (i, k, v) => {
  const row = state.prepared[i]; if(!row) return;
  if(k === 'qty'){ const n = Math.floor(+String(v).replace(/[^\d]/g, '') || 0); row.qty = n > 0 ? n : ''; }
  else row.code = String(v).trim().toUpperCase();
  savePrepared();
  const pid = (k === 'qty' ? 'pqty' : 'pcode') + i;
  clearTimeout(prepTimer);
  prepTimer = setTimeout(() => {
    renderAll();
    const el = document.querySelector('[data-pid="' + pid + '"]');
    if(el){ el.focus(); try { el.setSelectionRange(el.value.length, el.value.length); } catch(e){} }
  }, 350);
};
window.prepAdd = () => {
  state.prepared.push({ code: '', qty: '' });
  savePrepared();
  renderAll();
  setTimeout(() => { const els = document.querySelectorAll('[data-pid^="pcode"]'); if(els.length) els[els.length - 1].focus(); }, 60);
};
window.prepDel = i => {
  state.prepared.splice(i, 1);
  if(!state.prepared.length) state.prepared = [{ code: '', qty: '' }];
  savePrepared();
  renderAll();
};


/* ============================ Check Xe Hàng Ngày (ServiceOS) ============================ */
state.checkXe = {
  orders: [],
  filterCategory: 'all',
  filterStatus: 'all', // 'all', 'unchecked', 'checked'
  filterTech: '',
  searchQuery: ''
};

function loadCheckXeOrders(){
  try {
    const raw = localStorage.getItem('bh_checkxe_orders');
    if(raw) {
      const data = JSON.parse(raw);
      if(Array.isArray(data)) state.checkXe.orders = data;
    }
  } catch(e){}
}
function saveCheckXeOrders(){
  try {
    localStorage.setItem('bh_checkxe_orders', JSON.stringify(state.checkXe.orders));
  } catch(e){}
}

function isOrderChecked(note){
  const s = String(note ?? '').trim();
  return Boolean(s && s.toLowerCase() !== 'none' && s !== '-' && s !== 'null' && s !== 'undefined');
}

function categorizeIssue(issue, parts){
  const txt = (String(issue || '') + ' ' + (Array.isArray(parts) ? parts.join(' ') : '')).toLowerCase();
  if (txt.includes('pin') || txt.includes('battery') || txt.includes('bms') || txt.includes('sụt nguồn') || txt.includes('mất nguồn')) {
    return { id: 'pin', name: 'Pin & Nguồn', icon: '🔋', color: '#059669', badgeBg: '#ecfdf5', badgeText: '#047857' };
  }
  if (txt.includes('động cơ') || txt.includes('dong co') || txt.includes('motor') || txt.includes('stator') || txt.includes('kẹt bánh') || txt.includes('vành') || txt.includes('hall') || txt.includes('bạc đạn') || txt.includes('bearing') || txt.includes('seal')) {
    return { id: 'motor', name: 'Động cơ & Vành', icon: '⚡', color: '#2563eb', badgeBg: '#eff6ff', badgeText: '#1d4ed8' };
  }
  if (txt.includes('sạc') || txt.includes('sac') || txt.includes('charger') || txt.includes('dcdc') || txt.includes('dc-dc')) {
    return { id: 'charger', name: 'Bộ sạc & DCDC', icon: '🔌', color: '#d97706', badgeBg: '#fffbeb', badgeText: '#b45309' };
  }
  if (txt.includes('giảm xóc') || txt.includes('giam xoc') || txt.includes('giảm sóc') || txt.includes('chảng ba') || txt.includes('phuộc') || txt.includes('cụp') || txt.includes('xì dầu')) {
    return { id: 'suspension', name: 'Giảm xóc & Phuộc', icon: '🛞', color: '#7c3aed', badgeBg: '#f5f3ff', badgeText: '#6d28d9' };
  }
  if (txt.includes('phanh') || txt.includes('thắng') || txt.includes('heo dầu') || txt.includes('bố') || txt.includes('đĩa')) {
    return { id: 'brake', name: 'Hệ thống Phanh', icon: '🛑', color: '#dc2626', badgeBg: '#fef2f2', badgeText: '#b91c1c' };
  }
  if (txt.includes('điện') || txt.includes('đồng hồ') || txt.includes('mcu') || txt.includes('còi') || txt.includes('đèn') || txt.includes('xi nhan') || txt.includes('4g') || txt.includes('khoá') || txt.includes('smartkey')) {
    return { id: 'electrical', name: 'Điện, Đèn & Đồng hồ', icon: '💡', color: '#0891b2', badgeBg: '#ecfeff', badgeText: '#0e7490' };
  }
  if (txt.includes('vỏ') || txt.includes('nhựa') || txt.includes('gương') || txt.includes('tay nắm') || txt.includes('ốp') || txt.includes('tem') || txt.includes('chân chống')) {
    return { id: 'body', name: 'Thân vỏ & Gương', icon: '🛵', color: '#475569', badgeBg: '#f1f5f9', badgeText: '#334155' };
  }
  return { id: 'other', name: 'Sửa chữa chung / Khác', icon: '🛠️', color: '#64748b', badgeBg: '#f8fafc', badgeText: '#475569' };
}

function parseServiceOsWorkbook(wb){
  let targetWs = null;
  for(const sn of wb.SheetNames){
    const normSn = norm(sn);
    if(normSn.includes('lenh sua chua') || normSn.includes('phieu sua chua') || normSn.includes('work order')){
      targetWs = wb.Sheets[sn];
      break;
    }
  }
  if(!targetWs) targetWs = wb.Sheets[wb.SheetNames[0]];
  const rows = sheetRows(targetWs);
  const hi = findHeaderRow(rows);
  if(hi < 0) return [];
  const H = rows[hi], map = buildColMap(H);
  
  const partsByWo = new Map();
  for(const sn of wb.SheetNames){
    if(norm(sn).includes('phu tung theo lenh')){
      const pRows = sheetRows(wb.Sheets[sn]);
      const phi = findHeaderRow(pRows);
      if(phi >= 0){
        const pMap = buildColMap(pRows[phi]);
        for(let r = phi + 1; r < pRows.length; r++){
          const pr = pRows[r]; if(!pr) continue;
          const wo = String(pickCol(pMap, pr, ['ma lenh sua chua', 'lenh sua chua', 'wo']) || '').trim();
          const pName = String(pickCol(pMap, pr, ['ten phu tung', 'phu tung', 'ten vat tu']) || '').trim();
          const pQty = parseNum(pickCol(pMap, pr, ['so luong', 'qty'])) || 1;
          if(wo && pName){
            if(!partsByWo.has(wo)) partsByWo.set(wo, []);
            partsByWo.get(wo).push(`${pQty}× ${pName}`);
          }
        }
      }
    }
  }

  const orders = [];
  for(let r = hi + 1; r < rows.length; r++){
    const row = rows[r]; if(!row || row.length === 0) continue;
    const plate = String(pickCol(map, row, ['bien so', 'bien so xe', 'bsx', 'bien']) || '').trim();
    const wo = String(pickCol(map, row, ['ma lenh sua chua', 'lenh sua chua', 'ma phieu', 'wo']) || '').trim();
    if(!plate && !wo) continue;
    
    const vin = String(pickCol(map, row, ['vin', 'so khung']) || '').trim();
    const vehicle = String(pickCol(map, row, ['dong xe', 'loai xe', 'model']) || '').trim();
    const customer = String(pickCol(map, row, ['khach hang', 'khach']) || '').trim();
    const tech = String(pickCol(map, row, ['ky thuat vien', 'ktv sua chua, bao hanh', 'ktv', 'tho']) || '').trim();
    const issue = String(pickCol(map, row, ['yeu cau khach hang', 'hang muc', 'noi dung sua chua', 'ly do vao xuong', 'trang thai bao hanh', 'mo ta']) || '').trim();
    const note = String(pickCol(map, row, ['ghi chu', 'ghi chu ktv', 'chan doan']) || '').trim();
    const status = String(pickCol(map, row, ['trang thai', 'tinh trang']) || 'Đang xử lý').trim();
    const dateVal = parseDateVal(pickCol(map, row, ['ngay tao', 'ngay nhan xe', 'ngay sua chua/bao hanh', 'ngay'])) || new Date();
    
    const parts = partsByWo.get(wo) || [];
    const cat = categorizeIssue(issue, parts);
    const checked = isOrderChecked(note);
    
    orders.push({
      id: 'ord_' + (wo || plate).replace(/[^a-zA-Z0-9]/g, '') + '_' + r,
      wo: wo || '—',
      plate: plate || '—',
      vin: vin || '—',
      vehicle: vehicle || '—',
      customer: customer || '—',
      tech: tech || 'Chưa phân công',
      issue: issue || 'Kiểm tra & sửa chữa theo yêu cầu',
      parts: parts,
      note: note,
      status: status,
      dateStr: fmtDate(dateVal),
      category: cat,
      isChecked: checked
    });
  }
  return orders;
}

window.openBookmarkletModal = () => { $('#modalBookmarklet').hidden = false; };
window.closeBookmarkletModal = () => { $('#modalBookmarklet').hidden = true; };

let editingOrderIndex = -1;
window.openEditNoteModal = idx => {
  editingOrderIndex = idx;
  const ord = state.checkXe.orders[idx];
  if(!ord) return;
  $('#editNoteInfo').innerHTML = `Xe: <b>${esc(ord.plate)}</b> (${esc(ord.vehicle)}) · KTV: <b>${esc(ord.tech)}</b><br>Lỗi/Yêu cầu: <i>${esc(ord.issue)}</i>`;
  $('#editNoteInput').value = ord.note || '';
  $('#modalEditNote').hidden = false;
  setTimeout(() => $('#editNoteInput').focus(), 50);
};
window.closeEditNoteModal = () => { $('#modalEditNote').hidden = true; editingOrderIndex = -1; };
window.setQuickNote = txt => { $('#editNoteInput').value = txt; };
window.saveEditedNote = () => {
  if(editingOrderIndex < 0 || editingOrderIndex >= state.checkXe.orders.length) return;
  const val = $('#editNoteInput').value.trim();
  const ord = state.checkXe.orders[editingOrderIndex];
  ord.note = val;
  ord.isChecked = isOrderChecked(val);
  saveCheckXeOrders();
  closeEditNoteModal();
  renderCheckXe();
};

window.importServiceOsClipboard = async function(){
  try {
    let text = '';
    if(navigator.clipboard && navigator.clipboard.readText){
      try { text = await navigator.clipboard.readText(); } catch(err){}
    }
    if(!text || !text.trim().startsWith('[')){
      text = prompt('Dán (Ctrl+V) dữ liệu xe đã lấy từ ServiceOS vào ô bên dưới:');
    }
    if(!text) return;
    const data = JSON.parse(text);
    if(!Array.isArray(data)){
      alert('Dữ liệu không đúng định dạng danh sách xe!');
      return;
    }
    
    const orders = data.map((d, i) => {
      const issue = d.issue || 'Kiểm tra sửa chữa';
      const parts = d.parts || [];
      const note = d.note || '';
      return {
        id: d.id || ('ord_' + Date.now() + '_' + i),
        wo: d.wo || '—',
        plate: d.plate || '—',
        vin: d.vin || '—',
        vehicle: d.vehicle || '—',
        customer: d.customer || '—',
        tech: d.tech || 'Chưa phân công',
        issue: issue,
        parts: parts,
        note: note,
        status: d.status || 'Đang xử lý',
        dateStr: d.dateStr || (new Date().toLocaleDateString('vi-VN')),
        category: categorizeIssue(issue, parts),
        isChecked: isOrderChecked(note)
      };
    });
    
    state.checkXe.orders = orders;
    saveCheckXeOrders();
    renderCheckXe();
    alert(`✅ Đã nhập thành công ${orders.length} xe từ ServiceOS!`);
  } catch(e) {
    alert('Lỗi đọc dữ liệu: ' + e.message);
  }
};

window.clearCheckXe = function(){
  if(!confirm('Bạn có chắc chắn muốn xoá danh sách xe kiểm tra hiện tại?')) return;
  state.checkXe.orders = [];
  saveCheckXeOrders();
  renderCheckXe();
};

window.exportCheckXeExcel = function(){
  if(!state.checkXe.orders.length){
    alert('Chưa có danh sách xe để xuất file!');
    return;
  }
  const wb = XLSX.utils.book_new();
  const rows = [
    ['DANH SÁCH KIỂM TRA LỖI XE HÀNG NGÀY (SERVICEOS)'],
    ['Xuất lúc: ' + new Date().toLocaleString('vi-VN')],
    [],
    ['STT', 'Biển số', 'Mã lệnh sửa chữa', 'VIN', 'Dòng xe', 'Kỹ thuật viên', 'Hạng mục lỗi', 'Trạng thái Check', 'Ghi chú KTV', 'Trạng thái lệnh', 'Ngày nhận']
  ];
  state.checkXe.orders.forEach((o, i) => {
    rows.push([
      i + 1,
      o.plate,
      o.wo,
      o.vin,
      o.vehicle,
      o.tech,
      o.category.name + ' - ' + o.issue,
      o.isChecked ? 'ĐÃ CHECK' : 'CHƯA CHECK',
      o.note || '',
      o.status,
      o.dateStr
    ]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), 'Check Loi Xe');
  XLSX.writeFile(wb, `CheckLoiXe_ServiceOS_${new Date().toISOString().slice(0,10)}.xlsx`);
};

window.setCheckXeCat = catId => {
  state.checkXe.filterCategory = catId;
  renderCheckXe();
};
window.setCheckXeStatus = st => {
  state.checkXe.filterStatus = st;
  renderCheckXe();
};
window.setCheckXeTech = tech => {
  state.checkXe.filterTech = tech;
  renderCheckXe();
};
window.setCheckXeSearch = q => {
  state.checkXe.searchQuery = q;
  renderCheckXe();
  const el = $('#checkXeSearch');
  if(el){ el.focus(); el.setSelectionRange(q.length, q.length); }
};

function renderCheckXe(){
  const allOrders = state.checkXe.orders || [];
  const total = allOrders.length;
  const unchecked = allOrders.filter(o => !o.isChecked).length;
  const checked = total - unchecked;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  // Update Badges
  const bEl = $('#badgeUncheckedCount');
  if(bEl){
    bEl.textContent = unchecked;
    bEl.style.display = unchecked > 0 ? 'inline-block' : 'none';
  }
  const ctxChip = $('#ctxCheckXeChip');
  const ctxVal = $('#ctxUncheckedVal');
  if(ctxChip && ctxVal){
    if(total > 0){
      ctxChip.style.display = 'inline-flex';
      ctxVal.textContent = unchecked + ' / ' + total;
    } else {
      ctxChip.style.display = 'none';
    }
  }

  const el = $('#checkXeContent');
  if(!el) return;

  if(!total){
    el.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🔍 Check lỗi xe hàng ngày — Dữ liệu ServiceOS</div>
            <div class="card-subtitle">Lọc xe theo hạng mục lỗi hàng ngày · Kiểm tra trạng thái đã check / chưa check theo Ghi chú KTV</div>
          </div>
          <div class="toolbar-right">
            <button class="btn" onclick="openBookmarkletModal()">⚡ Dấu trang 1-Click ServiceOS</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán từ ServiceOS</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Nhập file Excel</button>
            <input type="file" id="serviceOsFileInput" style="display:none" accept=".xlsx,.xls" onchange="handleServiceOsFileSelect(this.files)">
          </div>
        </div>

        <div class="empty-state">
          <div class="empty-state-icon">🛵</div>
          <h3 style="font-size:16px;color:var(--text-main);margin-bottom:6px">Chưa có dữ liệu xe từ ServiceOS</h3>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:18px;max-width:540px;margin-left:auto;margin-right:auto">
            Bạn có thể lấy dữ liệu trực tiếp từ <b>att-serviceos.anthinhtech.vn/#/work-orders</b> chỉ bằng 1 cú click (dùng Dấu trang Bookmarklet), hoặc kéo thả file Excel Lệnh sửa chữa vào đây.
          </p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn" onclick="openBookmarkletModal()">⚡ Cài đặt Dấu trang 1-Click</button>
            <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán dữ liệu đã copy</button>
            <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Chọn file Excel Lệnh Sửa Chữa</button>
          </div>
        </div>
      </div>`;
    return;
  }

  // Categories count
  const catCounts = { all: total };
  allOrders.forEach(o => {
    const cid = o.category.id;
    catCounts[cid] = (catCounts[cid] || 0) + 1;
  });

  const CATEGORIES = [
    { id: 'all', name: 'Tất cả hạng mục', icon: '📋' },
    { id: 'pin', name: 'Pin & Nguồn', icon: '🔋' },
    { id: 'motor', name: 'Động cơ & Vành', icon: '⚡' },
    { id: 'charger', name: 'Bộ sạc & DCDC', icon: '🔌' },
    { id: 'suspension', name: 'Giảm xóc & Phuộc', icon: '🛞' },
    { id: 'brake', name: 'Hệ thống Phanh', icon: '🛑' },
    { id: 'electrical', name: 'Điện, Đèn & Đồng hồ', icon: '💡' },
    { id: 'body', name: 'Thân vỏ & Gương', icon: '🛵' },
    { id: 'other', name: 'Sửa chữa khác', icon: '🛠️' }
  ];

  const catChipsHtml = CATEGORIES.map(c => {
    const cnt = catCounts[c.id] || 0;
    if(c.id !== 'all' && cnt === 0) return '';
    const isActive = state.checkXe.filterCategory === c.id;
    return `
      <button class="cat-chip ${isActive ? 'active' : ''}" onclick="setCheckXeCat('${c.id}')">
        <span>${c.icon}</span> ${c.name}
        <span class="chip-count">${cnt}</span>
      </button>`;
  }).join('');

  // Filtering
  let filtered = allOrders;
  if(state.checkXe.filterCategory !== 'all'){
    filtered = filtered.filter(o => o.category.id === state.checkXe.filterCategory);
  }
  if(state.checkXe.filterStatus === 'unchecked'){
    filtered = filtered.filter(o => !o.isChecked);
  } else if(state.checkXe.filterStatus === 'checked'){
    filtered = filtered.filter(o => o.isChecked);
  }
  if(state.checkXe.filterTech){
    filtered = filtered.filter(o => o.tech === state.checkXe.filterTech);
  }
  if(state.checkXe.searchQuery){
    const q = norm(state.checkXe.searchQuery);
    filtered = filtered.filter(o => norm(o.plate + ' ' + o.wo + ' ' + o.vin + ' ' + o.tech + ' ' + o.issue + ' ' + o.note).includes(q));
  }

  // Tech list for dropdown
  const techs = [...new Set(allOrders.map(o => o.tech).filter(Boolean))].sort();

  const rowsHtml = filtered.map((o, idx) => {
    const pTxt = o.parts && o.parts.length ? `<div style="font-size:11.5px;color:var(--text-muted);margin-top:2px">Phụ tùng: ${esc(o.parts.slice(0, 3).join(', '))}${o.parts.length > 3 ? ` (+${o.parts.length - 3})` : ''}</div>` : '';
    const originalIndex = allOrders.indexOf(o);
    return `
      <tr class="${o.isChecked ? 'row-checked' : 'row-unchecked'}">
        <td class="num">${idx + 1}</td>
        <td class="l">
          <b style="font-size:14px;color:var(--text-main);letter-spacing:0.5px">${esc(o.plate)}</b>
          <div style="font-size:11px;color:var(--text-muted)">${esc(o.wo)}</div>
        </td>
        <td class="l">
          <b>${esc(o.vehicle)}</b>
          <div style="font-size:11.5px;font-family:monospace;color:var(--text-muted)">VIN: ...${esc(String(o.vin).slice(-6))}</div>
        </td>
        <td class="l">
          <span style="font-weight:600;color:#334155">${esc(o.tech)}</span>
        </td>
        <td class="l part-name-cell">
          <span class="tag" style="background:${o.category.badgeBg};color:${o.category.badgeText};margin-bottom:3px">
            ${o.category.icon} ${o.category.name}
          </span>
          <div style="font-weight:500;line-height:1.4">${esc(o.issue)}</div>
          ${pTxt}
        </td>
        <td class="l">
          ${o.isChecked ? 
            `<span class="status-pill checked">✅ Đã check</span>` : 
            `<span class="status-pill unchecked">🔴 Chưa check lỗi</span>`
          }
        </td>
        <td class="l part-name-cell">
          ${o.isChecked ? 
            `<div style="font-weight:600;color:#15803d">${esc(o.note)}</div>` : 
            `<span style="color:#94a3b8;font-style:italic">Chưa có ghi chú kiểm tra</span>`
          }
        </td>
        <td class="l">
          <span class="tag f1">${esc(o.status)}</span>
          <div style="font-size:11px;color:var(--text-muted)">${esc(o.dateStr)}</div>
        </td>
        <td class="l">
          <button class="btn secondary" style="padding:4px 8px;font-size:11.5px" onclick="openEditNoteModal(${originalIndex})" title="Cập nhật ghi chú kiểm tra">
            ✏️ Ghi chú
          </button>
        </td>
      </tr>`;
  }).join('');

  el.innerHTML = `
    <!-- Top KPI Bar -->
    <div class="kpi-grid">
      <div class="kpi-card indigo">
        <div class="kpi-title">Tổng xe đang kiểm tra <span>🚗</span></div>
        <div class="kpi-val">${total} <span style="font-size:16px">xe</span></div>
        <div class="kpi-sub">Dữ liệu từ ServiceOS</div>
      </div>
      
      <div class="kpi-card ${unchecked > 0 ? 'rose' : 'emerald'}">
        <div class="kpi-title" style="${unchecked > 0 ? 'color:#dc2626' : ''}">CẦN CHECK LỖI (Chưa check) <span>${unchecked > 0 ? '🔴' : '✅'}</span></div>
        <div class="kpi-val" style="${unchecked > 0 ? 'color:#dc2626' : 'color:#16a34a'}">${unchecked} <span style="font-size:16px">xe</span></div>
        <div class="kpi-sub">${unchecked > 0 ? 'Ghi chú KTV còn trống — Cần kiểm tra' : 'Tất cả xe đã được kiểm tra!'}</div>
      </div>

      <div class="kpi-card emerald">
        <div class="kpi-title">Đã hoàn thành check <span>✅</span></div>
        <div class="kpi-val" style="color:#16a34a">${checked} <span style="font-size:16px">xe</span></div>
        <div class="kpi-sub">Đã có ghi chú KTV chẩn đoán lỗi</div>
      </div>

      <div class="kpi-card blue">
        <div class="kpi-title">Tiến độ kiểm tra <span>📊</span></div>
        <div class="kpi-val">${pct} <span style="font-size:16px">%</span></div>
        <div class="kpi-sub">${checked} / ${total} xe đã hoàn tất check</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">🔍 Danh sách xe cần check lỗi hàng ngày</div>
          <div class="card-subtitle">Lọc theo hạng mục lỗi (Pin, Động cơ, Sạc, Giảm xóc, Phanh...) để phân công KTV kiểm tra</div>
        </div>
        <div class="toolbar-right">
          <button class="btn" onclick="openBookmarkletModal()">⚡ Dấu trang ServiceOS</button>
          <button class="btn secondary" onclick="importServiceOsClipboard()">📋 Dán từ ServiceOS</button>
          <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">📁 Nhập Excel</button>
          <button class="btn secondary" onclick="exportCheckXeExcel()">⬇ Xuất Excel</button>
          <button class="source-del" onclick="clearCheckXe()" title="Xoá danh sách hiện tại">✕</button>
          <input type="file" id="serviceOsFileInput" style="display:none" accept=".xlsx,.xls" onchange="handleServiceOsFileSelect(this.files)">
        </div>
      </div>

      <!-- Category Filter Chips -->
      <div class="category-chip-bar">
        ${catChipsHtml}
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="toolbar">
        <div class="toolbar-left">
          <select class="select-input" onchange="setCheckXeStatus(this.value)">
            <option value="all" ${state.checkXe.filterStatus === 'all' ? 'selected' : ''}>— Mọi trạng thái check (${total}) —</option>
            <option value="unchecked" ${state.checkXe.filterStatus === 'unchecked' ? 'selected' : ''}>🔴 CHƯA CHECK LỖI (${unchecked} xe)</option>
            <option value="checked" ${state.checkXe.filterStatus === 'checked' ? 'selected' : ''}>✅ ĐÃ CHECK (${checked} xe)</option>
          </select>

          <select class="select-input" onchange="setCheckXeTech(this.value)">
            <option value="">— Mọi Kỹ thuật viên (${techs.length} KTV) —</option>
            ${techs.map(t => `<option value="${esc(t)}" ${state.checkXe.filterTech === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}
          </select>

          <input class="search-input" id="checkXeSearch" placeholder="🔍 Tìm biển số xe, VIN, lỗi, tên KTV…" oninput="setCheckXeSearch(this.value)" value="${esc(state.checkXe.searchQuery)}">
        </div>
        <div class="toolbar-right">
          <span style="font-size:12.5px;color:var(--text-muted);font-weight:600">Đang hiển thị ${filtered.length} / ${total} xe</span>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-container scrollable">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th class="l">Biển số &amp; Mã lệnh</th>
              <th class="l">Dòng xe &amp; VIN</th>
              <th class="l">Kỹ thuật viên</th>
              <th class="l">Hạng mục lỗi / Yêu cầu</th>
              <th class="l">Trạng thái Check</th>
              <th class="l">Ghi chú KTV</th>
              <th class="l">Tình trạng lệnh</th>
              <th class="l">Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="9" class="empty-state">Không có xe nào khớp bộ lọc</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>`;
}

async function handleServiceOsFileSelect(fileList){
  const file = fileList[0];
  if(!file) return;
  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array', cellDates: true });
    const orders = parseServiceOsWorkbook(wb);
    if(!orders.length){
      alert('Không nhận diện được danh sách lệnh sửa chữa từ file này! Hãy chắc chắn file có cột Biển số, Kỹ thuật viên, Ghi chú...');
      return;
    }
    state.checkXe.orders = orders;
    saveCheckXeOrders();
    renderCheckXe();
    alert(`✅ Đã nhập thành công ${orders.length} xe từ file ${file.name}!`);
  } catch(e){
    alert('Lỗi đọc file: ' + e.message);
  }
}

window.handleServiceOsFileSelect = handleServiceOsFileSelect;
window.parseServiceOsWorkbook = parseServiceOsWorkbook;

// Auto-import when pasting on Check Xe tab
window.addEventListener('paste', function(e){
  if(state.activeTab !== 'checkxe') return;
  const clipText = e.clipboardData ? e.clipboardData.getData('text') : '';
  if(clipText && clipText.trim().startsWith('[')){
    try {
      const data = JSON.parse(clipText);
      if(Array.isArray(data) && data.length > 0 && (data[0].plate || data[0].wo)){
        e.preventDefault();
        const orders = data.map((d, i) => {
          const issue = d.issue || 'Kiểm tra sửa chữa';
          const parts = d.parts || [];
          const note = d.note || '';
          return {
            id: d.id || ('ord_' + Date.now() + '_' + i),
            wo: d.wo || '—',
            plate: d.plate || '—',
            vin: d.vin || '—',
            vehicle: d.vehicle || '—',
            customer: d.customer || '—',
            tech: d.tech || 'Chưa phân công',
            issue: issue,
            parts: parts,
            note: note,
            status: d.status || 'Đang xử lý',
            dateStr: d.dateStr || (new Date().toLocaleDateString('vi-VN')),
            category: categorizeIssue(issue, parts),
            isChecked: isOrderChecked(note)
          };
        });
        state.checkXe.orders = orders;
        saveCheckXeOrders();
        renderCheckXe();
        alert('⚡ Đã tự động nhận diện và nạp thành công ' + orders.length + ' xe từ ServiceOS!');
      }
    } catch(err){}
  }
});

// URL Hash Auto-Import when opened from ServiceOS bookmarklet
function checkUrlImport(){
  const hash = window.location.hash;
  if(hash && hash.includes('serviceos=')){
    try {
      const idx = hash.indexOf('serviceos=');
      const raw = hash.slice(idx + 10);
      const jsonStr = decodeURIComponent(raw);
      const data = JSON.parse(jsonStr);
      if(Array.isArray(data) && data.length > 0){
        const orders = data.map((d, i) => {
          const issue = d.issue || 'Kiểm tra sửa chữa';
          const parts = d.parts || [];
          const note = (d.note || '').trim();
          return {
            id: d.id || ('ord_' + Date.now() + '_' + i),
            wo: d.wo || '—',
            plate: d.plate || '—',
            vin: d.vin || '—',
            vehicle: d.vehicle || '—',
            customer: d.customer || '—',
            tech: d.tech || 'Chưa phân công',
            issue: issue,
            parts: parts,
            note: note,
            status: d.status || 'Trong xưởng',
            dateStr: d.dateStr || (new Date().toLocaleDateString('vi-VN')),
            category: categorizeIssue(issue, parts),
            isChecked: isOrderChecked(note)
          };
        });
        state.checkXe.orders = orders;
        saveCheckXeOrders();
        switchTab('checkxe');
        try { history.replaceState(null, '', location.pathname); } catch(e){}
        setTimeout(() => {
          alert(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ${orders.length} XE ĐANG TRONG XƯỞNG TỪ SERVICEOS!`);
        }, 100);
      }
    } catch(err){
      console.error('Error importing serviceos from URL hash:', err);
    }
  }
}

// Generate Bookmarklet link href
function getBookmarkletCode(targetUrl){
  const cleanTarget = (targetUrl || window.location.href).split('#')[0];
  return `javascript:(async function(){try{let orders=[];if(typeof window.api==='function'&&window.S&&window.S.branch){try{const res=await window.api('GET','/api/work-orders?status=active&branch_id='+window.S.branch+'&page=1&page_size=200');const items=res&&(res.items||res.rows||res.work_orders||(Array.isArray(res)?res:[]));if(items&&items.length>0){orders=items.map((w,idx)=>({id:'ord_'+(w.code||w.id||idx),wo:w.code||w.ro||'—',plate:w.plate||'—',vin:w.vin||'—',vehicle:w.model||'—',customer:w.customer_name||'—',tech:w.technician_name||'Chưa phân công',issue:w.content||w.diag||'Kiểm tra theo yêu cầu',note:(w.foreman_note||'').trim(),status:w.status_label||w.status||'Trong xưởng',dateStr:w.received_at?w.received_at.slice(0,10):(w.created_at?w.created_at.slice(0,10):(new Date().toLocaleDateString('vi-VN'))),isChecked:Boolean((w.foreman_note||'').trim()&&(w.foreman_note||'').trim().toLowerCase()!=='none'&&(w.foreman_note||'').trim()!=='-')}));}}catch(apiErr){console.warn('API fallback to DOM:',apiErr);}}if(!orders.length){const rows=document.querySelectorAll('table tbody tr');if(rows&&rows.length>0){rows.forEach((tr,rIdx)=>{const getCol=(colName)=>{const td=tr.querySelector('td[data-col=\"'+colName+'\"]');if(!td)return '';const inp=td.querySelector('input, textarea');return (inp?inp.value:td.innerText).trim();};const plate=getCol('plate');const code=getCol('code');if(!plate&&!code)return;const foremanNote=getCol('foreman_note');const content=getCol('content')||getCol('diag');const tech=getCol('tech');const model=getCol('model');const vin=getCol('vin');const status=getCol('status');const received=getCol('received')||getCol('repair_at');orders.push({id:'ord_'+(code||plate||rIdx),wo:code||'—',plate:plate||'—',vin:vin||'—',vehicle:model||'—',tech:tech||'Chưa phân công',issue:content||'Kiểm tra sửa chữa',note:foremanNote,status:status||'Trong xưởng',dateStr:received||(new Date().toLocaleDateString('vi-VN')),isChecked:Boolean(foremanNote&&foremanNote!=='—'&&foremanNote.toLowerCase()!=='none')});});}}if(!orders.length){alert('⚠️ Không tìm thấy xe nào trong mục \"Xe đang trong xưởng\".\\nHãy chắc chắn bạn đang ở tab \"Trong xưởng\" trên ServiceOS!');return;}const targetBase='${cleanTarget}';const jsonStr=JSON.stringify(orders);if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(jsonStr).catch(()=>{});}const targetUrl=targetBase+'#serviceos='+encodeURIComponent(jsonStr);const newWin=window.open(targetUrl,'_blank');let toast=document.getElementById('att-sync-toast');if(!toast){toast=document.createElement('div');toast.id='att-sync-toast';toast.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:#059669;color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:bold;box-shadow:0 8px 24px rgba(0,0,0,0.25);font-family:sans-serif;';document.body.appendChild(toast);}toast.innerHTML='✅ Đã lấy thành công <b>'+orders.length+' xe trong xưởng</b>! Đang mở tab Bảo Hành PRO...';setTimeout(()=>{if(toast)toast.remove();},3500);if(!newWin){alert('⚡ Đã lấy '+orders.length+' xe! Trình duyệt đã chặn popup tab mới. Vui lòng mở trang Bảo Hành PRO và bấm \"📋 Dán từ ServiceOS\".');}}catch(e){alert('Lỗi: '+e.message);}})();void 0;`;
}

function updateBookmarkletHref(){
  const inp = $('#bmTargetUrlInput');
  const targetUrl = inp ? inp.value.trim() : window.location.href;
  const code = getBookmarkletCode(targetUrl);
  const btn = $('#bookmarkletLink');
  if(btn) btn.href = code;
}

window.copyBookmarkletCode = function(){
  const inp = $('#bmTargetUrlInput');
  const targetUrl = inp ? inp.value.trim() : window.location.href;
  const code = getBookmarkletCode(targetUrl);
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(() => {
      alert('📋 Đã sao chép mã Dấu trang vào bộ nhớ tạm!\n\nCách dán vào trình duyệt:\n1. Chuột phải lên thanh Dấu trang -> Chọn \"Thêm trang\" (Add Page)\n2. Tên: ⚡ Lấy xe ServiceOS\n3. URL: Dán (Ctrl+V) mã vừa copy vào.');
    });
  } else {
    prompt('Copy mã Dấu trang bên dưới:', code);
  }
};

function initBookmarkletCode(){
  const inp = $('#bmTargetUrlInput');
  if(inp && !inp.value){
    inp.value = window.location.href.split('#')[0];
  }
  updateBookmarkletHref();
}
