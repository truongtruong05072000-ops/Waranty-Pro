# -*- coding: utf-8 -*-
import re, os, subprocess

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update <style> tag
from test_scrollcraft_css import SCROLLCRAFT_CSS

style_start = text.find('<style>')
style_end = text.find('</style>') + 8
if style_start != -1 and style_end != -1:
    text = text[:style_start] + '<style>' + SCROLLCRAFT_CSS + '\n</style>' + text[style_end:]
    print('Updated <style> tag successfully.')
else:
    print('Could not find <style> tag!')

# 2. Update svgChart to support dark theme
svg_chart_pattern = r'function svgChart\(data, target\)\{[\s\S]*?return s \+ \x27<\/svg>\x27;\s*\}'
svg_chart_replacement = '''function svgChart(data, target){
  const W = 760, H = 220, padL = 60, padB = 40, padT = 24, barW = Math.min(54, (W - padL - 20) / data.length * 0.55);
  const maxV = Math.max(target, ...data.map(d => d.conf + d.pipe)) * 1.15 || 1;
  const y = v => padT + (H - padT - padB) * (1 - v / maxV);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  for(let i = 0; i <= 4; i++){
    const vv = maxV * i / 4, yy = y(vv);
    s += `<line x1="${padL}" y1="${yy}" x2="${W - 10}" y2="${yy}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="2 2"/>
          <text x="${padL - 8}" y="${yy + 4}" font-size="10.5" fill="#94a3b8" text-anchor="end">${fmtT(vv)}tr</text>`;
  }
  s += `<line x1="${padL}" y1="${y(target)}" x2="${W - 10}" y2="${y(target)}" stroke="#f43f5e" stroke-dasharray="5 4" stroke-width="1.8"/>
        <text x="${W - 12}" y="${y(target) - 5}" font-size="11" font-weight="700" fill="#f87171" text-anchor="end">Mục tiêu ${fmtT(target)}tr</text>`;
  data.forEach((d, i) => {
    const cx = padL + (i + 0.5) * ((W - padL - 20) / data.length);
    const hConf = (H - padT - padB) * (d.conf / maxV), hPipe = (H - padT - padB) * (d.pipe / maxV);
    s += `<rect x="${cx - barW / 2}" y="${y(d.conf)}" width="${barW}" height="${hConf}" fill="#0ea5e9" rx="4"><title>Chốt: ${fmtVND(d.conf)}</title></rect>`;
    if(d.pipe > 0){
      s += `<rect x="${cx - barW / 2}" y="${y(d.conf + d.pipe)}" width="${barW}" height="${hPipe}" fill="#f59e0b" rx="4" opacity=".85"><title>Dự trù: ${fmtVND(d.pipe)}</title></rect>`;
    }
    s += `<text x="${cx}" y="${H - padB + 16}" font-size="11.5" fill="#94a3b8" text-anchor="middle" font-weight="600">${monthLabel(d.m)}</text>`;
    s += `<text x="${cx}" y="${y(d.conf + d.pipe) - 6}" font-size="11" fill="#f8fafc" text-anchor="middle" font-weight="700">${fmtT(d.conf + d.pipe)}tr</text>`;
  });
  s += `<rect x="${padL}" y="${H - 12}" width="10" height="10" fill="#0ea5e9" rx="2"/><text x="${padL + 15}" y="${H - 3}" font-size="11" fill="#94a3b8">Doanh thu chốt</text>`;
  s += `<rect x="${padL + 210}" y="${H - 12}" width="10" height="10" fill="#f59e0b" rx="2"/><text x="${padL + 225}" y="${H - 3}" font-size="11" fill="#94a3b8">Dự trù</text>`;
  return s + '</svg>';
}'''

if re.search(svg_chart_pattern, text):
    text = re.sub(svg_chart_pattern, svg_chart_replacement, text, count=1)
    print('Updated svgChart successfully.')
else:
    print('Could not find svgChart via regex!')

# 3. Update renderCheckXe styles and elements
# Replace inline style block in renderCheckXe
old_style_marker = '.custom-cat-container {'
if old_style_marker in text:
    # Let's find the <style> in renderCheckXe
    idx_rc = text.find('function renderCheckXe()')
    idx_st = text.find('<style>', idx_rc)
    idx_st_end = text.find('</style>', idx_st) + 8
    
    new_rc_style = '''<style>
      .custom-cat-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: rgba(13, 20, 36, 0.72);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(56, 189, 248, 0.16);
        border-radius: 14px;
        padding: 16px 18px;
        margin-bottom: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      }
      .custom-cat-header {
        font-size: 12px;
        font-weight: 700;
        color: #7dd3fc;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .custom-cat-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .custom-cat-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(17, 27, 49, 0.65);
        color: #cbd5e1;
        font-size: 12.5px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .custom-cat-pill:hover {
        border-color: #38bdf8;
        background: rgba(56, 189, 248, 0.12);
        color: #ffffff;
        transform: translateY(-1px);
        box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
      }
      .custom-cat-pill.active {
        border-color: #38bdf8;
        background: linear-gradient(135deg, #0284c7, #0ea5e9);
        color: #ffffff;
        font-weight: 700;
        box-shadow: 0 0 16px rgba(56, 189, 248, 0.5);
      }
      .custom-cat-pill .pill-badge {
        font-size: 11px;
        font-weight: 700;
        background: rgba(0, 0, 0, 0.35);
        color: #94a3b8;
        padding: 1px 7px;
        border-radius: 10px;
      }
      .custom-cat-pill.active .pill-badge {
        background: rgba(255, 255, 255, 0.25);
        color: #ffffff;
      }
      .custom-cat-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.35);
      }
      .date-filter-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        background: rgba(13, 20, 36, 0.72);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(56, 189, 248, 0.16);
        border-radius: 12px;
        padding: 10px 16px;
        margin-bottom: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      }
      .date-chip {
        padding: 5px 12px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(17, 27, 49, 0.7);
        color: #cbd5e1;
        font-size: 12px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      }
      .date-chip:hover {
        background: rgba(56, 189, 248, 0.12);
        border-color: #38bdf8;
        color: #ffffff;
      }
      .date-chip.active {
        background: linear-gradient(135deg, #0284c7, #0ea5e9);
        color: #ffffff;
        border-color: #38bdf8;
        font-weight: 700;
        box-shadow: 0 0 12px rgba(56, 189, 248, 0.45);
      }
      .scope-toggle-btn {
        padding: 5px 12px;
        border-radius: 8px;
        font-size: 12px;
        cursor: pointer;
        border: 1px solid rgba(56, 189, 248, 0.22);
        background: rgba(17, 27, 49, 0.7);
        color: #94a3b8;
        font-weight: 600;
        transition: all 0.2s;
      }
      .scope-toggle-btn.active {
        background: linear-gradient(135deg, #1e293b, #0f172a);
        color: #38bdf8;
        border-color: #38bdf8;
        box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
      }
      .filter-header-row th {
        background: rgba(11, 18, 33, 0.98) !important;
        padding: 8px 6px !important;
        border-bottom: 2px solid rgba(56, 189, 248, 0.22) !important;
      }
      .col-filter-input, .col-filter-select {
        width: 100%;
        box-sizing: border-box;
        font-size: 11.5px;
        padding: 5px 8px;
        border: 1px solid rgba(56, 189, 248, 0.22);
        border-radius: 6px;
        background: rgba(15, 23, 42, 0.9);
        color: #f8fafc;
        outline: none;
        transition: all 0.2s;
      }
      .col-filter-input:focus, .col-filter-select:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
      }
      .sortable-th {
        cursor: pointer;
        user-select: none;
        transition: background 0.15s, color 0.15s;
      }
      .sortable-th:hover {
        background: rgba(56, 189, 248, 0.12) !important;
        color: #ffffff !important;
      }
    </style>'''
    text = text[:idx_st] + new_rc_style + text[idx_st_end:]
    print('Updated inline style in renderCheckXe.')

# Update the 4 KPI cards in renderCheckXe
old_kpi_marker = '<!-- 4 Thẻ KPI Chuẩn theo 4 Quy Tắc Nghiệp Vụ -->'
if old_kpi_marker in text:
    idx_kpi = text.find(old_kpi_marker)
    idx_kpi_end = text.find('</div>\n    </div>\n\n    <!-- Hạng mục lỗi', idx_kpi) + 11
    
    new_kpis = '''<!-- 4 Thẻ KPI Chuẩn theo 4 Quy Tắc Nghiệp Vụ -->
      <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;padding:0 20px 20px">
        <div class="kpi-card" style="background:linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,23,42,0.7));border:1px solid rgba(239,68,68,0.35);box-shadow:0 0 15px rgba(239,68,68,0.15)">
          <div class="kpi-label" style="color:#fca5a5">🔴 Chưa check (Cần xử lý)</div>
          <div class="kpi-val" style="color:#f87171;text-shadow:0 0 12px rgba(239,68,68,0.4)">${uncheckedList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Có lỗi · Chưa ghi chú · Chưa bảng</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg, rgba(245,158,11,0.12), rgba(15,23,42,0.7));border:1px solid rgba(245,158,11,0.35);box-shadow:0 0 15px rgba(245,158,11,0.15)">
          <div class="kpi-label" style="color:#fcd34d">⚠️ Cần check lại</div>
          <div class="kpi-val" style="color:#fbbf24;text-shadow:0 0 12px rgba(245,158,11,0.4)">${recheckList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Có lỗi + Có ghi chú · Chưa bảng</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg, rgba(16,185,129,0.12), rgba(15,23,42,0.7));border:1px solid rgba(16,185,129,0.35);box-shadow:0 0 15px rgba(16,185,129,0.15)">
          <div class="kpi-label" style="color:#6ee7b7">✅ Đã check xong</div>
          <div class="kpi-val" style="color:#34d399;text-shadow:0 0 12px rgba(16,185,129,0.4)">${checkedList.length}</div>
          <div class="kpi-sub" style="color:#94a3b8">Đã có bảng cập nhật linh kiện/PIN</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg, rgba(56,189,248,0.12), rgba(15,23,42,0.7));border:1px solid rgba(56,189,248,0.35);box-shadow:0 0 15px rgba(56,189,248,0.15)">
          <div class="kpi-label" style="color:#7dd3fc">📋 Tổng trong xưởng</div>
          <div class="kpi-val" style="color:#38bdf8;text-shadow:0 0 12px rgba(56,189,248,0.4)">${totalAll}</div>
          <div class="kpi-sub" style="color:#94a3b8">Theo dõi: <b style="color:#f8fafc">${totalIssue}</b> xe phát sinh</div>
        </div>
      </div>
    </div>'''
    text = text[:idx_kpi] + new_kpis + text[idx_kpi_end:]
    print('Updated 4 KPI cards in renderCheckXe.')

# Update table row cell styling in renderCheckXe
# Bang cap nhat cell
text = text.replace(
    '''<div style="font-size:11.5px;color:#15803d;background:#f0fdf4;border:1px solid #bbf7d0;padding:4px 8px;border-radius:6px;line-height:1.4">''',
    '''<div style="font-size:11.5px;color:#6ee7b7;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.32);padding:5px 9px;border-radius:6px;line-height:1.4">'''
)
# Tech cell
text = text.replace(
    '''<span style="font-weight:600;color:#334155">${esc(o.tech)}</span>''',
    '''<span style="font-weight:600;color:#e2e8f0">${esc(o.tech)}</span>'''
)
# Issue title
text = text.replace(
    '''<div style="font-weight:600;line-height:1.4;margin-top:3px;color:#0f172a">${esc(o.issue)}</div>''',
    '''<div style="font-weight:600;line-height:1.4;margin-top:3px;color:#f8fafc">${esc(o.issue)}</div>'''
)
# Ktv note cell
text = text.replace(
    '''<div style="font-weight:600;color:#0f172a;font-size:12.5px">${esc(o.note)}</div>''',
    '''<div style="font-weight:600;color:#f8fafc;font-size:12.5px">${esc(o.note)}</div>'''
)

# Table card header in renderCheckXe
text = text.replace(
    '''<div class="card-header" style="padding:12px 16px;background:#f8fafc;border-bottom:1px solid var(--border)">''',
    '''<div class="card-header" style="padding:14px 20px;background:rgba(16, 26, 48, 0.85);border-bottom:1px solid var(--border-light)">'''
)

# Modal Bookmarklet styling (internal blocks)
text = text.replace(
    '''<div style="background:#ffffff;border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:12px">''',
    '''<div style="background:rgba(17, 27, 49, 0.8);border:1px solid rgba(56, 189, 248, 0.2);border-radius:var(--radius-md);padding:16px;margin-bottom:14px">'''
)
text = text.replace(
    '''<div style="font-size:12px;color:var(--text-main);margin-top:10px;line-height:1.6;background:#ffffff;padding:8px 12px;border-radius:6px;border:1px solid #bfdbfe">''',
    '''<div style="font-size:12px;color:#e2e8f0;margin-top:10px;line-height:1.6;background:rgba(15, 23, 42, 0.85);padding:10px 14px;border-radius:8px;border:1px solid rgba(56, 189, 248, 0.25)">'''
)

# Write to PhanTichBaoHanh.html and _deploy/index.html
with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated PhanTichBaoHanh.html and _deploy/index.html successfully.')
