with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace emojis in Overview KPI cards
text = text.replace(
    '<div class="kpi-title">Mục tiêu ${monthLong(tYm)} <span>🎯</span></div>',
    '<div class="kpi-title">Mục tiêu ${monthLong(tYm)} <span>${window.ICONS.target}</span></div>'
)
text = text.replace(
    '<div class="kpi-title">Dự kiến kết kỳ ${monthLabel(tYm)} <span>${isReached ? \'🎉\' : \'⏳\'}</span></div>',
    '<div class="kpi-title">Dự kiến kết kỳ ${monthLabel(tYm)} <span>${isReached ? window.ICONS.checkCircle : window.ICONS.calendar}</span></div>'
)
text = text.replace(
    '<div class="kpi-title">Nhịp 1 ngày kỳ này <span>⚡</span></div>',
    '<div class="kpi-title">Nhịp 1 ngày kỳ này <span>${window.ICONS.zap}</span></div>'
)
text = text.replace(
    '<div class="kpi-title">Số ĐX còn phải làm <span>📋</span></div>',
    '<div class="kpi-title">Số ĐX còn phải làm <span>${window.ICONS.clipboard}</span></div>'
)

# Overview card titles
text = text.replace(
    '<div class="card-title">📊 Doanh thu theo tháng (Chốt ngày ${cutTxt})</div>',
    '<div class="card-title">${window.ICONS.chart} Doanh thu theo tháng (Chốt ngày ${cutTxt})</div>'
)
text = text.replace(
    '<div class="card-title">📈 Biểu đồ xu hướng doanh thu</div>',
    '<div class="card-title">${window.ICONS.trending} Biểu đồ xu hướng doanh thu</div>'
)

# Check Xe KPI cards
text = text.replace(
    '<div class="kpi-label" style="color:#fca5a5">🔴 Chưa check (Cần xử lý)</div>',
    '<div class="kpi-label" style="color:var(--rose-glow)">${window.ICONS.alertCircle} Chưa check (Cần xử lý)</div>'
)
text = text.replace(
    '<div class="kpi-label" style="color:#fcd34d">⚠️ Cần check lại</div>',
    '<div class="kpi-label" style="color:var(--amber-glow)">${window.ICONS.alertTriangle} Cần check lại</div>'
)
text = text.replace(
    '<div class="kpi-label" style="color:#6ee7b7">✅ Đã check xong</div>',
    '<div class="kpi-label" style="color:var(--emerald-glow)">${window.ICONS.checkCircle} Đã check xong</div>'
)
text = text.replace(
    '<div class="kpi-label" style="color:#7dd3fc">📋 Tổng trong xưởng</div>',
    '<div class="kpi-label" style="color:var(--primary-glow)">${window.ICONS.carCheck} Tổng trong xưởng</div>'
)

# Check Xe header
text = text.replace(
    '<div class="card-title">🔍 Check lỗi xe hàng ngày — Dữ liệu ServiceOS</div>',
    '<div class="card-title">${window.ICONS.carCheck} Check lỗi xe hàng ngày — Dữ liệu ServiceOS</div>'
)

with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Replaced remaining emojis in KPI cards with modern SVG icons.')
