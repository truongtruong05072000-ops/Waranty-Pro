# -*- coding: utf-8 -*-
import re, os, subprocess

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('Original length:', len(text))

# ==============================================================================
# 1. ICON SVG DEFINITIONS (Modern Lucide / Feather Vector Icons)
# ==============================================================================
ICON_DEFS_JS = '''
/* =====================================================================
   MODERN LUCIDE VECTOR SVG ICONS
   Ultra-crisp, lightweight, pixel-perfect modern SVG icons
   ===================================================================== */
window.ICONS = {
  chart: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  target: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
  package: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  claims: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  carCheck: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>`,
  settings: `<svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  download: `<svg class="sc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  sun: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  moon: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  zap: `<svg class="sc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  clipboard: `<svg class="sc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
  calendar: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  search: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  checkCircle: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  alertTriangle: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  alertCircle: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  edit: `<svg class="sc-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  trash: `<svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  refresh: `<svg class="sc-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  folder: `<svg class="sc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
  trending: `<svg class="sc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`
};

/* =====================================================================
   THEME MANAGER (DARK / LIGHT TOGGLE)
   Persisted in localStorage with instant responsive switching
   ===================================================================== */
window.initTheme = function() {
  const saved = localStorage.getItem('bh_theme') || 'dark';
  window.setTheme(saved, false);
};

window.setTheme = function(mode, save = true) {
  document.documentElement.setAttribute('data-theme', mode);
  if (save) {
    try { localStorage.setItem('bh_theme', mode); } catch(e){}
  }
  const btnDark = $('#btnThemeDark');
  const btnLight = $('#btnThemeLight');
  if (btnDark) btnDark.classList.toggle('active', mode === 'dark');
  if (btnLight) btnLight.classList.toggle('active', mode === 'light');

  // Trigger re-render of components that use theme-aware SVGs
  if (window.renderAll && typeof state !== 'undefined' && state && state.sources) {
    try { renderAll(); } catch(e){}
  }
};

window.toggleTheme = function() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  window.setTheme(cur === 'dark' ? 'light' : 'dark');
};
'''

# Check where to insert ICON_DEFS_JS
# Insert right after "'use strict';" in script 2
use_strict_marker = "'use strict';"
idx_strict = text.find(use_strict_marker)
if idx_strict != -1:
    text = text[:idx_strict + len(use_strict_marker)] + '\n' + ICON_DEFS_JS + '\n' + text[idx_strict + len(use_strict_marker):]
    print('Inserted ICON_DEFS_JS successfully.')
else:
    print('Could not find use strict!')

# ==============================================================================
# 2. UPDATE CSS WITH FULL LIGHT/DARK THEME SYSTEM & TARGET ROW CONTRAST FIX
# ==============================================================================
COMPLETE_CSS = '''
/* =====================================================================
   NT BẢO HÀNH PRO — SCROLL-CRAFT EXECUTIVE TELEMETRY SYSTEM
   Dual Theme Architecture: Obsidian Cyber (Dark) & Clean Executive (Light)
   ===================================================================== */
:root, [data-theme="dark"] {
  /* Dark Theme Palette (Default) */
  --sc-canvas: #080c15;
  --sc-surface: rgba(15, 23, 42, 0.75);
  --sc-surface-elevated: rgba(22, 33, 56, 0.85);
  --sc-surface-card: rgba(13, 20, 36, 0.72);
  
  --header-bg: rgba(9, 14, 26, 0.92);
  --header-border: rgba(56, 189, 248, 0.18);
  --tabbar-bg: rgba(11, 18, 33, 0.88);
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
  --emerald-text: #34d399;
  
  --amber: #f59e0b;
  --amber-glow: #fbbf24;
  --amber-soft: rgba(245, 158, 11, 0.12);
  --amber-border: rgba(245, 158, 11, 0.32);
  --amber-text: #fbbf24;
  
  --rose: #ef4444;
  --rose-glow: #f87171;
  --rose-soft: rgba(239, 68, 68, 0.12);
  --rose-border: rgba(239, 68, 68, 0.32);
  --rose-text: #f87171;
  
  --border: rgba(56, 189, 248, 0.14);
  --border-light: rgba(255, 255, 255, 0.06);
  --border-subtle: rgba(255, 255, 255, 0.08);
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  --shadow-card: 0 8px 32px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  --shadow-hover: 0 14px 40px -4px rgba(0, 0, 0, 0.65), 0 0 20px rgba(56, 189, 248, 0.15);
  
  --input-bg: rgba(15, 23, 42, 0.85);
  --input-border: rgba(56, 189, 248, 0.22);
  --input-color: #f8fafc;
  
  --th-bg: rgba(17, 27, 49, 0.95);
  --th-color: #94a3b8;
  --tr-hover: rgba(56, 189, 248, 0.04);
}

/* ================= LIGHT THEME (EXECUTIVE LIGHT) ================= */
[data-theme="light"] {
  --sc-canvas: #f1f5f9;
  --sc-surface: #ffffff;
  --sc-surface-elevated: #f8fafc;
  --sc-surface-card: #ffffff;
  
  --header-bg: #0b1324; /* Keep executive dark header so NT chrome logo stays spectacular */
  --header-border: rgba(56, 189, 248, 0.22);
  --tabbar-bg: #ffffff;
  --tabbar-border: #e2e8f0;
  
  --primary: #0284c7;
  --primary-glow: #0284c7;
  --primary-light: #e0f2fe;
  
  --sc-ink: #0f172a;
  --sc-ink-soft: #475569;
  --sc-ink-muted: #64748b;
  --text-main: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
  
  --emerald: #10b981;
  --emerald-glow: #059669;
  --emerald-soft: #ecfdf5;
  --emerald-border: #a7f3d0;
  --emerald-text: #059669;
  
  --amber: #f59e0b;
  --amber-glow: #d97706;
  --amber-soft: #fffbeb;
  --amber-border: #fde68a;
  --amber-text: #b45309;
  
  --rose: #ef4444;
  --rose-glow: #dc2626;
  --rose-soft: #fef2f2;
  --rose-border: #fecaca;
  --rose-text: #dc2626;
  
  --border: #e2e8f0;
  --border-light: #f1f5f9;
  --border-subtle: #e2e8f0;
  
  --shadow-card: 0 4px 18px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04);
  --shadow-hover: 0 10px 25px -4px rgba(15, 23, 42, 0.1), 0 4px 10px -2px rgba(15, 23, 42, 0.04);
  
  --input-bg: #ffffff;
  --input-border: #cbd5e1;
  --input-color: #0f172a;
  
  --th-bg: #f8fafc;
  --th-color: #475569;
  --tr-hover: #f8fafc;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif;
  background-color: var(--sc-canvas);
  background-image: 
    radial-gradient(circle at 90% 0%, rgba(14, 165, 233, 0.12) 0%, transparent 45%),
    radial-gradient(circle at 10% 35%, rgba(59, 130, 246, 0.08) 0%, transparent 45%);
  background-attachment: fixed;
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  transition: background-color 0.25s ease, color 0.25s ease;
}

[data-theme="light"] body {
  background-image: 
    radial-gradient(circle at 90% 0%, rgba(2, 132, 199, 0.07) 0%, transparent 40%),
    radial-gradient(circle at 10% 40%, rgba(59, 130, 246, 0.04) 0%, transparent 40%);
}

/* SC-ICON STYLE */
.sc-icon {
  display: inline-block;
  vertical-align: -2.5px;
  flex-shrink: 0;
  stroke-width: 2;
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: rgba(9, 14, 26, 0.6); }
::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.25); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.5); }
[data-theme="light"] ::-webkit-scrollbar-track { background: #f1f5f9; }
[data-theme="light"] ::-webkit-scrollbar-thumb { background: #cbd5e1; }
[data-theme="light"] ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

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
  gap: 10px;
}

/* Theme Toggle Button Group */
.theme-toggle-group {
  display: flex;
  background: rgba(17, 27, 49, 0.85);
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: var(--radius-full);
  padding: 3px;
  gap: 2px;
}
.theme-toggle-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.theme-toggle-btn:hover {
  color: #ffffff;
}
.theme-toggle-btn.active {
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.45);
}

.vat-toggle-group {
  display: flex;
  background: rgba(17, 27, 49, 0.85);
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: var(--radius-full);
  padding: 3px;
}
.vat-toggle-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 5px 13px;
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: background-color 0.25s ease, border-color 0.25s ease;
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
  color: var(--text-muted);
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
}
.nav-tab:hover {
  color: var(--text-main);
  background: rgba(125, 211, 252, 0.06);
}
.nav-tab.active {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
}
[data-theme="light"] .nav-tab.active {
  color: #0284c7;
  background: #f0f9ff;
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
[data-theme="light"] .nav-tab.active::after {
  background: #0284c7;
  box-shadow: 0 0 8px rgba(2, 132, 199, 0.4);
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
[data-theme="light"] .tab-badge {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* ================= THANH THÔNG SỐ CONTEXT ================= */
.context-strip {
  background: var(--sc-surface-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: background-color 0.25s ease;
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
  background: var(--sc-surface-elevated);
  border: 1px solid var(--border);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  color: var(--text-muted);
}
.context-chips .chip b {
  color: var(--text-main);
  font-weight: 700;
}
.context-chips .chip.target-chip {
  border-color: rgba(56, 189, 248, 0.4);
  background: rgba(14, 165, 233, 0.12);
}
.context-chips .chip.target-chip b {
  color: var(--primary-glow);
}
[data-theme="light"] .context-chips .chip.target-chip {
  background: #eff6ff;
  border-color: #bfdbfe;
}
[data-theme="light"] .context-chips .chip.target-chip b {
  color: #0284c7;
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
  transition: box-shadow 0.25s ease, transform 0.25s ease, background-color 0.25s ease;
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
  background: var(--sc-surface-elevated);
}
.card-title {
  font-size: 16px;
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
  background: var(--sc-surface-card);
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
  top: 0; left: 0; right: 0;
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
  color: var(--text-muted);
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
  color: var(--text-main);
  letter-spacing: -0.03em;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}
.kpi-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 6px;
  line-height: 1.4;
}
.kpi-sub b {
  color: var(--text-secondary);
}

/* Verdict Banner */
.verdict-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  margin-bottom: 22px;
  background: var(--sc-surface-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
}
.verdict-banner.success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), var(--sc-surface-card));
  border-color: var(--emerald-border);
}
.verdict-banner.warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), var(--sc-surface-card));
  border-color: var(--amber-border);
}
.verdict-banner.danger {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), var(--sc-surface-card));
  border-color: var(--rose-border);
}
.verdict-icon { font-size: 28px; }
.verdict-content h4 { font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 2px; }
.verdict-content p { font-size: 12.5px; color: var(--text-muted); line-height: 1.4; }

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
  background: var(--th-bg);
  color: var(--th-color);
  font-weight: 700;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-main);
  transition: background 0.15s;
}
tr:hover td {
  background: var(--tr-hover);
}
td.num, th.num { text-align: center; }
td.r, th.r { text-align: right; }
td.l, th.l { text-align: left; }

/* ================= SỬA LỖI VÙNG KHOANH ĐỎ (TARGET MONTH ROW) ================= */
tr.row-target-highlight {
  background: rgba(14, 165, 233, 0.14) !important;
  border-left: 3px solid #38bdf8 !important;
}
tr.row-target-highlight td {
  color: #f8fafc !important;
}
tr.row-target-highlight b {
  color: #ffffff !important;
}
[data-theme="light"] tr.row-target-highlight {
  background: #e0f2fe !important;
  border-left: 3px solid #0284c7 !important;
}
[data-theme="light"] tr.row-target-highlight td {
  color: #0f172a !important;
}
[data-theme="light"] tr.row-target-highlight b {
  color: #0369a1 !important;
}

.target-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.4);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
}
[data-theme="light"] .target-pill {
  background: #0284c7;
  color: #ffffff;
  border: none;
}

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
[data-theme="light"] .status-pill.unchecked {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
[data-theme="light"] .status-pill.recheck {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}
[data-theme="light"] .status-pill.checked {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

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
  background: var(--sc-surface-elevated);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}
.btn.secondary:hover {
  background: rgba(56, 189, 248, 0.12);
  border-color: #38bdf8;
  color: var(--text-main);
}
[data-theme="light"] .btn.secondary {
  background: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
}
[data-theme="light"] .btn.secondary:hover {
  background: #f8fafc;
  border-color: #0284c7;
  color: #0284c7;
}

/* Forms & Inputs */
.field-input, input[type="text"], input[type="number"], input[type="month"], select, textarea {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-md);
  color: var(--input-color);
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
  color: var(--text-muted);
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
  border: 2px dashed var(--border);
  background: var(--sc-surface-elevated);
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
.dropzone-title { font-size: 14.5px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
.dropzone-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

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
.tag.warn { background: var(--amber-soft); color: var(--amber-text); border: 1px solid var(--amber-border); }
.tag.ok { background: var(--emerald-soft); color: var(--emerald-text); border: 1px solid var(--emerald-border); }

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
  background: var(--sc-surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
  width: 100%;
  max-width: 620px;
  position: relative;
  animation: modalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  color: var(--text-main);
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
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.15s;
}
.modal-close:hover { color: var(--text-main); }
.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 24px;
  font-size: 12px;
  color: var(--text-muted);
  border-top: 1px solid var(--border-light);
  margin-top: 24px;
}

/* Theme support for Check Lỗi Xe styles */
[data-theme="light"] .custom-cat-container {
  background: #ffffff !important;
  border-color: #e2e8f0 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}
[data-theme="light"] .custom-cat-header {
  color: #0369a1 !important;
}
[data-theme="light"] .custom-cat-pill {
  background: #ffffff !important;
  border-color: #cbd5e1 !important;
  color: #334155 !important;
}
[data-theme="light"] .custom-cat-pill:hover {
  background: #f8fafc !important;
  border-color: #0284c7 !important;
  color: #0284c7 !important;
}
[data-theme="light"] .custom-cat-pill.active {
  background: #0284c7 !important;
  border-color: #0284c7 !important;
  color: #ffffff !important;
}
[data-theme="light"] .custom-cat-pill .pill-badge {
  background: #e2e8f0 !important;
  color: #475569 !important;
}
[data-theme="light"] .custom-cat-pill.active .pill-badge {
  background: rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
}
[data-theme="light"] .date-filter-bar {
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
}
[data-theme="light"] .date-chip {
  background: #ffffff !important;
  border-color: #cbd5e1 !important;
  color: #334155 !important;
}
[data-theme="light"] .date-chip:hover {
  background: #f1f5f9 !important;
  border-color: #0284c7 !important;
  color: #0284c7 !important;
}
[data-theme="light"] .date-chip.active {
  background: #0284c7 !important;
  border-color: #0284c7 !important;
  color: #ffffff !important;
}
[data-theme="light"] .scope-toggle-btn {
  background: #ffffff !important;
  border-color: #cbd5e1 !important;
  color: #475569 !important;
}
[data-theme="light"] .scope-toggle-btn.active {
  background: #1e293b !important;
  border-color: #0f172a !important;
  color: #ffffff !important;
}
[data-theme="light"] .filter-header-row th {
  background: #f1f5f9 !important;
  border-bottom: 2px solid #cbd5e1 !important;
}
[data-theme="light"] .col-filter-input, 
[data-theme="light"] .col-filter-select {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #0f172a !important;
}
'''

style_start = text.find('<style>')
style_end = text.find('</style>') + 8
if style_start != -1 and style_end != -1:
    text = text[:style_start] + '<style>' + COMPLETE_CSS + '\n</style>' + text[style_end:]
    print('Updated <style> with Dual Theme CSS successfully.')
else:
    print('Could not find style tag!')

# ==============================================================================
# 3. UPDATE HEADER ACTIONS WITH THEME TOGGLER
# ==============================================================================
OLD_HEADER_ACTIONS = '''<div class="header-actions">
      <!-- Quick VAT Switcher Pill -->
      <div class="vat-toggle-group" id="topVatGroup">
        <button type="button" class="vat-toggle-btn active" id="btnVatInc" onclick="setVatMode('inc')">Sau VAT</button>
        <button type="button" class="vat-toggle-btn" id="btnVatEx" onclick="setVatMode('ex')">Trước VAT</button>
      </div>
      
      <button class="header-btn excel-btn" onclick="exportExcel()">
        <span>⬇</span> Xuất Excel
      </button>
      
      
    </div>'''

NEW_HEADER_ACTIONS = '''<div class="header-actions">
      <!-- Theme Switcher Pill -->
      <div class="theme-toggle-group" id="topThemeGroup">
        <button type="button" class="theme-toggle-btn active" id="btnThemeDark" onclick="setTheme('dark')" title="Giao diện Tối (Obsidian Cyber)">
          <svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          <span>Tối</span>
        </button>
        <button type="button" class="theme-toggle-btn" id="btnThemeLight" onclick="setTheme('light')" title="Giao diện Sáng (Clean Executive)">
          <svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          <span>Sáng</span>
        </button>
      </div>

      <!-- Quick VAT Switcher Pill -->
      <div class="vat-toggle-group" id="topVatGroup">
        <button type="button" class="vat-toggle-btn active" id="btnVatInc" onclick="setVatMode('inc')">Sau VAT</button>
        <button type="button" class="vat-toggle-btn" id="btnVatEx" onclick="setVatMode('ex')">Trước VAT</button>
      </div>
      
      <button class="header-btn excel-btn" onclick="exportExcel()">
        <svg class="sc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        <span>Xuất Excel</span>
      </button>
    </div>'''

if OLD_HEADER_ACTIONS in text:
    text = text.replace(OLD_HEADER_ACTIONS, NEW_HEADER_ACTIONS)
    print('Updated Header Actions with Theme Toggle.')
else:
    # Try finding header-actions with regex
    m_ha = re.search(r'<div class="header-actions">[\s\S]*?</div>\s*</div>\s*</header>', text)
    if m_ha:
        text = text[:m_ha.start()] + NEW_HEADER_ACTIONS + '\n  </div>\n</header>' + text[m_ha.end():]
        print('Updated Header Actions via regex.')

# ==============================================================================
# 4. UPDATE NAVIGATION TABS WITH MODERN SVG ICONS
# ==============================================================================
OLD_NAV = '''<!-- Segmented Navigation Tab Bar (Sticky) -->
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
</nav>'''

NEW_NAV = '''<!-- Segmented Navigation Tab Bar (Sticky) -->
<nav class="nav-tabbar">
  <div class="nav-container">
    <button class="nav-tab active" data-tab="overview" onclick="switchTab('overview')">
      <svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
      <span>Tổng quan doanh thu</span>
    </button>
    <button class="nav-tab" data-tab="plan" onclick="switchTab('plan')">
      <svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
      <span>Kế hoạch &amp; Tồn kho</span>
    </button>
    <button class="nav-tab" data-tab="parts" onclick="switchTab('parts')">
      <svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
      <span>Phụ tùng 3 tháng</span>
      <span class="tab-badge" id="badgePartsCount">0</span>
    </button>
    <button class="nav-tab" data-tab="claims" onclick="switchTab('claims')">
      <svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      <span>Tra cứu đề xuất</span>
      <span class="tab-badge" id="badgeClaimsCount">0</span>
    </button>
    <button class="nav-tab" data-tab="checkxe" onclick="switchTab('checkxe')">
      <svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>
      <span>Check lỗi xe hàng ngày</span>
      <span class="tab-badge" id="badgeUncheckedCount">0</span>
    </button>
    <button class="nav-tab" data-tab="settings" onclick="switchTab('settings')">
      <svg class="sc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      <span>Tệp &amp; Cài đặt</span>
      <span class="tab-badge" id="badgeFilesCount">0</span>
    </button>
  </div>
</nav>'''

if OLD_NAV in text:
    text = text.replace(OLD_NAV, NEW_NAV)
    print('Updated Nav Bar with SVG icons.')
else:
    print('Could not find OLD_NAV exactly, checking...')

# ==============================================================================
# 5. UPDATE CONTEXT STRIP WITH MODERN SVG ICONS
# ==============================================================================
OLD_CONTEXT = '''<div class="context-strip">
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
</div>'''

NEW_CONTEXT = '''<div class="context-strip">
  <div class="context-container">
    <div class="context-chips" id="contextChips">
      <span class="chip target-chip"><svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Kỳ: <b id="ctxTargetMonth">—</b></span>
      <span class="chip"><svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> Mục tiêu: <b id="ctxTargetVal">—</b></span>
      <span class="chip"><svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> Dự kiến: <b id="ctxExpectedVal">—</b></span>
      <span class="chip"><svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> Nguồn: <b id="ctxSourcesVal">—</b></span>
      <span class="chip" id="ctxCheckXeChip" style="display:none"><svg class="sc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg> Xe cần check: <b id="ctxUncheckedVal" style="color:var(--rose-glow)">0</b></span>
    </div>
    <div>
      <span id="ctxVatNote" style="font-size:11.5px;color:var(--text-muted)"></span>
    </div>
  </div>
</div>'''

if OLD_CONTEXT in text:
    text = text.replace(OLD_CONTEXT, NEW_CONTEXT)
    print('Updated Context Strip with SVG icons.')

# ==============================================================================
# 6. SỬA LỖI VÙNG KHOANH ĐỎ TRONG RENDERALL
# ==============================================================================
# In renderAll, find row mapping:
# <tr style="${isT ? 'background:#fffbeb;font-weight:700' : ''}">
old_row_target = '<tr style="${isT ? \'background:#fffbeb;font-weight:700\' : \'\'}">'
new_row_target = '<tr class="${isT ? \'row-target-highlight\' : \'\'}">'
if old_row_target in text:
    text = text.replace(old_row_target, new_row_target)
    print('Fixed target month row background in renderAll.')

# Also replace <span class="tag warn">Mục tiêu 🎯</span> with <span class="tag target-pill">Mục tiêu</span>
old_target_badge = '<span class="tag warn">Mục tiêu 🎯</span>'
new_target_badge = '<span class="tag target-pill">' + '<svg class="sc-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> Mục tiêu</span>'
if old_target_badge in text:
    text = text.replace(old_target_badge, new_target_badge)
    print('Replaced target badge with modern SVG target pill.')

# ==============================================================================
# 7. UPDATE SVGCHART FOR RESPONSIVE LIGHT/DARK THEME
# ==============================================================================
svg_chart_pattern = r'function svgChart\(data, target\)\{[\s\S]*?return s \+ \x27<\/svg>\x27;\s*\}'
new_svg_chart = '''function svgChart(data, target){
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const W = 760, H = 220, padL = 60, padB = 40, padT = 24, barW = Math.min(54, (W - padL - 20) / data.length * 0.55);
  const maxV = Math.max(target, ...data.map(d => d.conf + d.pipe)) * 1.15 || 1;
  const y = v => padT + (H - padT - padB) * (1 - v / maxV);
  
  const gridStroke = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)';
  const axisText = isLight ? '#64748b' : '#94a3b8';
  const valText = isLight ? '#0f172a' : '#f8fafc';
  const barConfColor = isLight ? '#0284c7' : '#0ea5e9';
  const barPipeColor = '#f59e0b';
  const targetLineColor = isLight ? '#e11d48' : '#f43f5e';
  
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  for(let i = 0; i <= 4; i++){
    const vv = maxV * i / 4, yy = y(vv);
    s += `<line x1="${padL}" y1="${yy}" x2="${W - 10}" y2="${yy}" stroke="${gridStroke}" stroke-dasharray="2 2"/>
          <text x="${padL - 8}" y="${yy + 4}" font-size="10.5" fill="${axisText}" text-anchor="end">${fmtT(vv)}tr</text>`;
  }
  s += `<line x1="${padL}" y1="${y(target)}" x2="${W - 10}" y2="${y(target)}" stroke="${targetLineColor}" stroke-dasharray="5 4" stroke-width="1.8"/>
        <text x="${W - 12}" y="${y(target) - 5}" font-size="11" font-weight="700" fill="${targetLineColor}" text-anchor="end">Mục tiêu ${fmtT(target)}tr</text>`;
  data.forEach((d, i) => {
    const cx = padL + (i + 0.5) * ((W - padL - 20) / data.length);
    const hConf = (H - padT - padB) * (d.conf / maxV), hPipe = (H - padT - padB) * (d.pipe / maxV);
    s += `<rect x="${cx - barW / 2}" y="${y(d.conf)}" width="${barW}" height="${hConf}" fill="${barConfColor}" rx="4"><title>Chốt: ${fmtVND(d.conf)}</title></rect>`;
    if(d.pipe > 0){
      s += `<rect x="${cx - barW / 2}" y="${y(d.conf + d.pipe)}" width="${barW}" height="${hPipe}" fill="${barPipeColor}" rx="4" opacity=".85"><title>Dự trù: ${fmtVND(d.pipe)}</title></rect>`;
    }
    s += `<text x="${cx}" y="${H - padB + 16}" font-size="11.5" fill="${axisText}" text-anchor="middle" font-weight="600">${monthLabel(d.m)}</text>`;
    s += `<text x="${cx}" y="${y(d.conf + d.pipe) - 6}" font-size="11" fill="${valText}" text-anchor="middle" font-weight="700">${fmtT(d.conf + d.pipe)}tr</text>`;
  });
  s += `<rect x="${padL}" y="${H - 12}" width="10" height="10" fill="${barConfColor}" rx="2"/><text x="${padL + 15}" y="${H - 3}" font-size="11" fill="${axisText}">Doanh thu chốt</text>`;
  s += `<rect x="${padL + 210}" y="${H - 12}" width="10" height="10" fill="${barPipeColor}" rx="2"/><text x="${padL + 225}" y="${H - 3}" font-size="11" fill="${axisText}">Dự trù</text>`;
  return s + '</svg>';
}'''

if re.search(svg_chart_pattern, text):
    text = re.sub(svg_chart_pattern, new_svg_chart, text, count=1)
    print('Updated svgChart to be dynamic light/dark aware.')

# ==============================================================================
# 8. UPDATE CHECK XE STATUS PILLS AND BUTTONS WITH MODERN ICONS
# ==============================================================================
# In renderCheckXe, replace emojis with SVG icons
text = text.replace(
    '`<span class="status-pill checked" title="${esc(o.checkStatus.desc)}">✅ ĐÃ CHECK</span>`',
    '`<span class="status-pill checked" title="${esc(o.checkStatus.desc)}">${window.ICONS.checkCircle} ĐÃ CHECK</span>`'
)
text = text.replace(
    '`<span class="status-pill recheck" style="background:#ffedd5;color:#c2410c;border:1px solid #fed7aa;font-weight:700" title="${esc(o.checkStatus.desc)}">⚠️ CẦN CHECK LẠI</span>`',
    '`<span class="status-pill recheck" title="${esc(o.checkStatus.desc)}">${window.ICONS.alertTriangle} CẦN CHECK LẠI</span>`'
)
text = text.replace(
    '`<span class="status-pill unchecked" title="${esc(o.checkStatus.desc)}">🔴 CHƯA CHECK</span>`',
    '`<span class="status-pill unchecked" title="${esc(o.checkStatus.desc)}">${window.ICONS.alertCircle} CHƯA CHECK</span>`'
)
text = text.replace(
    '✏️ Xem/Sửa',
    '${window.ICONS.edit} Xem/Sửa'
)
text = text.replace(
    '⚡ Đọc trực tiếp ServiceOS',
    '${window.ICONS.zap} Đọc trực tiếp ServiceOS'
)
text = text.replace(
    '📋 Dán (Ctrl+V)',
    '${window.ICONS.clipboard} Dán (Ctrl+V)'
)
text = text.replace(
    '📁 Nhập Excel',
    '${window.ICONS.folder} Nhập Excel'
)
text = text.replace(
    '📥 Xuất Excel danh sách',
    '${window.ICONS.download} Xuất Excel'
)
text = text.replace(
    '📥 Xuất file Excel (${filtered.length} xe)',
    '${window.ICONS.download} Xuất file Excel (${filtered.length} xe)'
)
text = text.replace(
    '🗑️',
    '${window.ICONS.trash}'
)
text = text.replace(
    '📅 Lọc theo ngày:',
    '${window.ICONS.calendar} Lọc theo ngày:'
)

# Call initTheme() on startup
init_theme_call = 'initTheme();\nloadPrepared();'
if 'initTheme();' not in text:
    text = text.replace('loadPrepared();', init_theme_call, 1)
    print('Added initTheme() call on startup.')

# Write updated file
with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated PhanTichBaoHanh.html and _deploy/index.html successfully.')
