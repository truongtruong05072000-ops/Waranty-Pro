with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update toolbar
old_tb = """        <div class="toolbar-right" style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn primary" onclick="openBookmarkletModal('api')">${window.ICONS.zap} Đồng bộ API ServiceOS</button>
          <button class="btn secondary" onclick="importServiceOsClipboard()">${window.ICONS.clipboard} Dán (Ctrl+V)</button>
          <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">${window.ICONS.folder} Nhập Excel</button>"""

new_tb = """        <div class="toolbar-right" style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn primary" onclick="openBookmarkletModal('api')">${window.ICONS.zap} Đồng bộ API ServiceOS</button>
          <button class="btn secondary" onclick="importServiceOsClipboard()">${window.ICONS.clipboard} Dán xe ServiceOS (Ctrl+V)</button>
          <button class="btn secondary" onclick="importDealerPortalClipboard()">💼 Dán ĐX Dealer Portal (Ctrl+V)</button>
          <button class="btn secondary" onclick="$('#serviceOsFileInput').click()">${window.ICONS.folder} Nhập Excel xe</button>"""

if old_tb in c:
    c = c.replace(old_tb, new_tb)
    print('Updated toolbar')
else:
    print('old_tb not found')

# 2. Update syncTabPaste
old_paste = """    <!-- TAB 4: DÁN TRỰC TIẾP CTRL+V -->
    <div id="syncTabPaste" style="display:none">
      <div style="background:rgba(17, 27, 49, 0.8);border:1px solid rgba(56, 189, 248, 0.2);border-radius:var(--radius-md);padding:16px;margin-bottom:14px">
        <div style="font-size:13px;font-weight:700;color:var(--text-main);margin-bottom:4px">
          📋 Dán trực tiếp từ bộ nhớ tạm (Ctrl + V)
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">
          Nếu bạn đã copy bảng từ ServiceOS hoặc có mã dữ liệu, bấm nút bên dưới:
        </p>
        <button class="btn secondary" style="width:100%;font-size:12.5px;padding:9px" onclick="importServiceOsClipboard()">
          📋 Dán dữ liệu xe từ bộ nhớ tạm
        </button>
      </div>
    </div>"""

new_paste = """    <!-- TAB 4: DÁN TRỰC TIẾP CTRL+V -->
    <div id="syncTabPaste" style="display:none">
      <div style="background:rgba(17, 27, 49, 0.8);border:1px solid rgba(56, 189, 248, 0.2);border-radius:var(--radius-md);padding:16px;margin-bottom:14px">
        <div style="font-size:13px;font-weight:700;color:var(--text-main);margin-bottom:4px">
          🚗 1. Dán Dữ liệu Xe từ ServiceOS
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">
          Copy bảng từ web ServiceOS hoặc copy cURL / response JSON trong F12 Network, rồi bấm nút dưới:
        </p>
        <button class="btn secondary" style="width:100%;font-size:12.5px;padding:9px;margin-bottom:14px" onclick="importServiceOsClipboard()">
          📋 Dán dữ liệu xe ServiceOS (Ctrl+V)
        </button>

        <div style="font-size:13px;font-weight:700;color:#38bdf8;margin-bottom:4px;border-top:1px dashed rgba(56,189,248,0.2);padding-top:12px">
          💼 2. Dán Đề xuất Bảo hành từ VinFast Dealer Portal
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">
          F12 Network trên trang Dealer Portal -> Copy response đề xuất bảo hành (JSON) -> Bấm nút dưới:
        </p>
        <button class="btn primary" style="width:100%;font-size:12.5px;padding:9px" onclick="importDealerPortalClipboard()">
          💼 Nạp đề xuất Dealer Portal vào Doanh thu & Tra cứu (Ctrl+V)
        </button>
      </div>
    </div>"""

if old_paste in c:
    c = c.replace(old_paste, new_paste)
    print('Updated syncTabPaste')
else:
    print('old_paste not found')

# 3. Update dropzone in Tab 6
old_dz = """          <input type="file" id="fileInput" multiple accept=".xlsx,.xls">
          <div class="source-list" id="srcList"></div>"""

new_dz = """          <input type="file" id="fileInput" multiple accept=".xlsx,.xls">
          <div style="margin-top:8px;display:flex;gap:8px">
            <button class="btn secondary" style="flex:1;font-size:12px;padding:7px 10px" onclick="importDealerPortalClipboard()">📋 Dán JSON Dealer Portal (Ctrl+V)</button>
            <button class="btn secondary" style="flex:1;font-size:12px;padding:7px 10px" onclick="$('#fileInput').click()">📁 Chọn tệp Excel (.xlsx)</button>
          </div>
          <div class="source-list" id="srcList"></div>"""

if old_dz in c:
    c = c.replace(old_dz, new_dz)
    print('Updated dropzone in Tab 6')
else:
    print('old_dz not found')

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(c)
