# -*- coding: utf-8 -*-
import re, os, subprocess

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('Initial length:', len(text))

# 1. Update svgChart with Baoyu Dataviz standards (gradients, rounded bars, glow target line)
old_svg_chart_pattern = r'function svgChart\(data, target\)\{[\s\S]*?return s \+ \x27<\/svg>\x27;\s*\}'
baoyu_svg_chart = '''function svgChart(data, target){
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const W = 760, H = 230, padL = 64, padB = 44, padT = 26, barW = Math.min(52, (W - padL - 20) / data.length * 0.52);
  const maxV = Math.max(target, ...data.map(d => d.conf + d.pipe)) * 1.16 || 1;
  const y = v => padT + (H - padT - padB) * (1 - v / maxV);
  
  const gridStroke = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)';
  const axisText = isLight ? '#64748b' : '#94a3b8';
  const valText = isLight ? '#0f172a' : '#f8fafc';
  const targetLineColor = isLight ? '#e11d48' : '#f43f5e';
  
  const gradConfId = isLight ? 'gradConfLight' : 'gradConfDark';
  const gradPipeId = isLight ? 'gradPipeLight' : 'gradPipeDark';
  
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;overflow:visible">
    <defs>
      <linearGradient id="gradConfDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="gradConfLight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0ea5e9"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="gradPipeDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <linearGradient id="gradPipeLight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
    </defs>`;
    
  for(let i = 0; i <= 4; i++){
    const vv = maxV * i / 4, yy = y(vv);
    s += `<line x1="${padL}" y1="${yy}" x2="${W - 12}" y2="${yy}" stroke="${gridStroke}" stroke-dasharray="3 3"/>
          <text x="${padL - 10}" y="${yy + 4}" font-size="11" font-weight="500" fill="${axisText}" text-anchor="end" font-family="system-ui">${fmtT(vv)}tr</text>`;
  }
  
  const targetY = y(target);
  s += `<line x1="${padL}" y1="${targetY}" x2="${W - 12}" y2="${targetY}" stroke="${targetLineColor}" stroke-dasharray="6 4" stroke-width="2"/>
        <text x="${W - 14}" y="${targetY - 6}" font-size="11.5" font-weight="700" fill="${targetLineColor}" text-anchor="end" font-family="system-ui">Mục tiêu: ${fmtT(target)}tr</text>`;
        
  data.forEach((d, i) => {
    const cx = padL + (i + 0.5) * ((W - padL - 20) / data.length);
    const hConf = Math.max(2, (H - padT - padB) * (d.conf / maxV));
    const hPipe = Math.max(0, (H - padT - padB) * (d.pipe / maxV));
    
    // Confirmed revenue bar
    s += `<rect x="${cx - barW / 2}" y="${y(d.conf)}" width="${barW}" height="${hConf}" fill="url(#${gradConfId})" rx="5" style="transition:all 0.3s ease;cursor:pointer"><title>Kỳ ${monthLabel(d.m)}\\nDoanh thu chốt: ${fmtVND(d.conf)}</title></rect>`;
    
    // Contingency/pipeline bar
    if(d.pipe > 0){
      s += `<rect x="${cx - barW / 2}" y="${y(d.conf + d.pipe)}" width="${barW}" height="${hPipe}" fill="url(#${gradPipeId})" rx="5" opacity="0.9" style="transition:all 0.3s ease;cursor:pointer"><title>Kỳ ${monthLabel(d.m)}\\nDự trù: ${fmtVND(d.pipe)}</title></rect>`;
    }
    
    // Month label
    s += `<text x="${cx}" y="${H - padB + 18}" font-size="12" fill="${axisText}" text-anchor="middle" font-weight="600" font-family="system-ui">${monthLabel(d.m)}</text>`;
    // Total value label
    s += `<text x="${cx}" y="${y(d.conf + d.pipe) - 8}" font-size="11.5" fill="${valText}" text-anchor="middle" font-weight="800" font-family="system-ui">${fmtT(d.conf + d.pipe)}tr</text>`;
  });
  
  // Legend
  s += `<rect x="${padL}" y="${H - 12}" width="12" height="12" fill="url(#${gradConfId})" rx="3"/><text x="${padL + 18}" y="${H - 2}" font-size="11.5" font-weight="600" fill="${axisText}" font-family="system-ui">Doanh thu chốt</text>`;
  s += `<rect x="${padL + 180}" y="${H - 12}" width="12" height="12" fill="url(#${gradPipeId})" rx="3"/><text x="${padL + 198}" y="${H - 2}" font-size="11.5" font-weight="600" fill="${axisText}" font-family="system-ui">Dự trù</text>`;
  return s + '</svg>';
}'''

if re.search(old_svg_chart_pattern, text):
    text = re.sub(old_svg_chart_pattern, baoyu_svg_chart, text, count=1)
    print('Updated svgChart with Baoyu Dataviz standards.')
else:
    print('Could not find svgChart via regex!')

# 2. Add mini progress bars to Overview Hero KPI cards
old_hero_kpi = '''  const heroKpiHtml = `
    <div class="kpi-grid">
      <div class="kpi-card blue">
        <div class="kpi-title">Mục tiêu ${monthLong(tYm)} <span>${window.ICONS.target}</span></div>
        <div class="kpi-val">${fmtT(settings.target)} <span style="font-size:16px">tr</span></div>
        <div class="kpi-sub">Bao gồm công + phụ tùng · ${settings.vatMode === 'ex' ? 'Trước VAT' : 'Sau VAT'}</div>
      </div>
      
      <div class="kpi-card ${isReached ? 'emerald' : 'amber'}">
        <div class="kpi-title">Dự kiến kết kỳ ${monthLabel(tYm)} <span>${isReached ? window.ICONS.checkCircle : window.ICONS.calendar}</span></div>
        <div class="kpi-val">${fmtT(C.expectedPlan)} <span style="font-size:16px">tr</span></div>
        <div class="kpi-sub">
          Chốt <b>${fmtT(C.target.conf)}</b> + Dự trù <b>${fmtT(C.target.pipe)}</b>${C.coveredParts ? ` + Chuẩn bị <b>${fmtT(C.coveredParts)}</b>` : ''}
        </div>
      </div>

      <div class="kpi-card ${C.ratio >= 1 ? 'emerald' : C.ratio >= 0.85 ? 'amber' : 'indigo'}">
        <div class="kpi-title">Nhịp 1 ngày kỳ này <span>${window.ICONS.zap}</span></div>
        <div class="kpi-val">${fmtT(C.curDaily)} <span style="font-size:16px">tr/ngày</span></div>
        <div class="kpi-sub">
          ${C.elapsedDays ? `Đạt <b>${fmtN(C.ratio * 100, 0)}%</b> so TB 3 tháng (${fmtT(C.histDaily)} tr/ngày)` : 'Chưa trong kỳ'}
        </div>
      </div>

      <div class="kpi-card ${isReached ? 'emerald' : 'indigo'}">
        <div class="kpi-title">Số ĐX còn phải làm <span>${window.ICONS.clipboard}</span></div>
        <div class="kpi-val">${isReached ? '0' : C.propsNeed} <span style="font-size:16px">đề xuất</span></div>
        <div class="kpi-sub">
          ${isReached ? `Đã có <b>${C.target.cnt}</b> ĐX chốt + <b>${C.target.pCnt}</b> dự trù (Vượt +${fmtT(C.expectedPlan - settings.target)} tr)` : `Kế hoạch ${C.propsNeedBase} − Đã làm ${C.doneCnt} ĐX`}
        </div>
      </div>
    </div>`;'''

new_hero_kpi = '''  const targetPct = Math.min(100, Math.round((C.expectedPlan / (settings.target || 1)) * 100));
  const dailyPct = Math.min(100, Math.round(C.ratio * 100));
  const propsPct = C.propsNeedBase > 0 ? Math.min(100, Math.round((C.doneCnt / C.propsNeedBase) * 100)) : 100;

  const heroKpiHtml = `
    <div class="kpi-grid">
      <div class="kpi-card blue">
        <div class="kpi-title">Mục tiêu ${monthLong(tYm)} <span>${window.ICONS.target}</span></div>
        <div class="kpi-val">${fmtT(settings.target)} <span style="font-size:16px">tr</span></div>
        <div class="kpi-sub">Bao gồm công + phụ tùng · ${settings.vatMode === 'ex' ? 'Trước VAT' : 'Sau VAT'}</div>
        <div class="kpi-progress-track">
          <div class="kpi-progress-fill" style="width:100%;background:linear-gradient(90deg, #0284c7, #38bdf8)"></div>
        </div>
      </div>
      
      <div class="kpi-card ${isReached ? 'emerald' : 'amber'}">
        <div class="kpi-title">
          <span>Dự kiến kết kỳ ${monthLabel(tYm)}</span>
          <span style="display:inline-flex;align-items:center;gap:4px">
            <span class="micro-badge ${isReached ? 'ok' : 'warn'}">${targetPct}%</span>
            ${isReached ? window.ICONS.checkCircle : window.ICONS.calendar}
          </span>
        </div>
        <div class="kpi-val">${fmtT(C.expectedPlan)} <span style="font-size:16px">tr</span></div>
        <div class="kpi-sub">
          Chốt <b>${fmtT(C.target.conf)}</b> + Dự trù <b>${fmtT(C.target.pipe)}</b>${C.coveredParts ? ` + Chuẩn bị <b>${fmtT(C.coveredParts)}</b>` : ''}
        </div>
        <div class="kpi-progress-track">
          <div class="kpi-progress-fill" style="width:${targetPct}%;background:${isReached ? 'linear-gradient(90deg, #059669, #10b981)' : 'linear-gradient(90deg, #d97706, #f59e0b)'}"></div>
        </div>
      </div>

      <div class="kpi-card ${C.ratio >= 1 ? 'emerald' : C.ratio >= 0.85 ? 'amber' : 'indigo'}">
        <div class="kpi-title">
          <span>Nhịp 1 ngày kỳ này</span>
          <span style="display:inline-flex;align-items:center;gap:4px">
            <span class="micro-badge ${C.ratio >= 1 ? 'ok' : 'warn'}">${C.elapsedDays ? fmtN(C.ratio * 100, 0) + '%' : '—'}</span>
            ${window.ICONS.zap}
          </span>
        </div>
        <div class="kpi-val">${fmtT(C.curDaily)} <span style="font-size:16px">tr/ngày</span></div>
        <div class="kpi-sub">
          ${C.elapsedDays ? `Đạt <b>${fmtN(C.ratio * 100, 0)}%</b> so TB 3 tháng (${fmtT(C.histDaily)} tr/ngày)` : 'Chưa trong kỳ'}
        </div>
        <div class="kpi-progress-track">
          <div class="kpi-progress-fill" style="width:${dailyPct}%;background:${C.ratio >= 1 ? 'linear-gradient(90deg, #059669, #10b981)' : 'linear-gradient(90deg, #6366f1, #818cf8)'}"></div>
        </div>
      </div>

      <div class="kpi-card ${isReached ? 'emerald' : 'indigo'}">
        <div class="kpi-title">
          <span>Số ĐX còn phải làm</span>
          <span style="display:inline-flex;align-items:center;gap:4px">
            <span class="micro-badge ${isReached ? 'ok' : 'info'}">${propsPct}%</span>
            ${window.ICONS.clipboard}
          </span>
        </div>
        <div class="kpi-val">${isReached ? '0' : C.propsNeed} <span style="font-size:16px">đề xuất</span></div>
        <div class="kpi-sub">
          ${isReached ? `Đã có <b>${C.target.cnt}</b> ĐX chốt + <b>${C.target.pCnt}</b> dự trù (Vượt +${fmtT(C.expectedPlan - settings.target)} tr)` : `Kế hoạch ${C.propsNeedBase} − Đã làm ${C.doneCnt} ĐX`}
        </div>
        <div class="kpi-progress-track">
          <div class="kpi-progress-fill" style="width:${propsPct}%;background:${isReached ? 'linear-gradient(90deg, #059669, #10b981)' : 'linear-gradient(90deg, #4f46e5, #6366f1)'}"></div>
        </div>
      </div>
    </div>`;'''

if old_hero_kpi in text:
    text = text.replace(old_hero_kpi, new_hero_kpi)
    print('Updated Hero KPI cards with progress tracks and micro-badges.')
else:
    print('Could not find old_hero_kpi exactly!')

# 3. Add CSS for micro-badges and progress tracks
extra_css = '''
/* Baoyu Design KPI Progress Track & Micro Badges */
.kpi-progress-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  margin-top: 12px;
  overflow: hidden;
}
[data-theme="light"] .kpi-progress-track {
  background: #e2e8f0;
}
.kpi-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.micro-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}
.micro-badge.ok {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}
.micro-badge.warn {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}
.micro-badge.info {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.4);
}
[data-theme="light"] .micro-badge.ok {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}
[data-theme="light"] .micro-badge.warn {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}
[data-theme="light"] .micro-badge.info {
  background: #eff6ff;
  color: #0284c7;
  border: 1px solid #bfdbfe;
}
'''

# Insert extra_css into <style> before </style>
idx_style_close = text.find('</style>')
if idx_style_close != -1:
    text = text[:idx_style_close] + '\n' + extra_css + '\n' + text[idx_style_close:]
    print('Added Baoyu KPI styles to <style> tag.')

# Write updated files
with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated PhanTichBaoHanh.html and _deploy/index.html successfully.')
