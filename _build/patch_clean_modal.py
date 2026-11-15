# -*- coding: utf-8 -*-
import io, os, sys, re

BASE = os.path.dirname(os.path.abspath(__file__))
TPL_FILE = os.path.join(BASE, 'app_template2.html')

with io.open(TPL_FILE, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the modal
modal_start = text.find('<!-- Modal Bookmarklet Hướng Dẫn & Đồng Bộ ServiceOS -->')
if modal_start == -1:
    modal_start = text.find('<!-- Modal Bookmarklet Hướng Dẫn -->')
modal_end = text.find('<!-- Modal Chỉnh sửa Ghi chú KTV -->')
assert modal_start != -1 and modal_end != -1, "Modal markers not found"

new_sync_modal = r'''<!-- Modal Hướng Dẫn Đồng Bộ ServiceOS -->
<div id="modalBookmarklet" class="modal-overlay" hidden>
  <div class="modal-box" style="max-width:650px">
    <button class="modal-close" onclick="closeBookmarkletModal()">✕</button>
    <div class="modal-title" style="display:flex;align-items:center;gap:8px">
      <span>⚡</span> Đọc dữ liệu xe trực tiếp từ ServiceOS Dashboard
    </div>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:14px;line-height:1.5">
      Hệ thống tự động đọc và phân loại theo 4 quy tắc: <b>Hạng mục lỗi</b>, <b>Ghi chú KTV</b> và <b>Bảng cập nhật linh kiện (PIN/Động cơ)</b>.
    </p>

    <!-- Tab chuyển đổi phương thức -->
    <div style="display:flex;gap:6px;margin-bottom:14px;border-bottom:1px solid var(--border);padding-bottom:8px">
      <button class="btn" id="tabBtnExtension" onclick="switchSyncTab('extension')" style="font-size:12px;padding:6px 12px">🧩 Tiện ích Chrome (Khuyên dùng)</button>
      <button class="btn secondary" id="tabBtnConsole" onclick="switchSyncTab('console')" style="font-size:12px;padding:6px 12px">⚡ Lệnh F12 (Chạy ngay)</button>
      <button class="btn secondary" id="tabBtnExcel" onclick="switchSyncTab('excel')" style="font-size:12px;padding:6px 12px">📁 File Excel</button>
      <button class="btn secondary" id="tabBtnPaste" onclick="switchSyncTab('paste')" style="font-size:12px;padding:6px 12px">📋 Dán Ctrl+V</button>
    </div>

    <!-- TAB 1: TIỆN ÍCH CHROME EXTENSION HOẶC TAMPERMONKEY -->
    <div id="syncTabExtension" style="display:block">
      <div style="background:#f0fdf4;border:1.5px solid #16a34a;border-radius:var(--radius-md);padding:14px;margin-bottom:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:13.5px;font-weight:700;color:#15803d">🧩 Cài tiện ích 1 lần: Tự động có nút bấm trên ServiceOS</span>
          <span style="font-size:11px;background:#16a34a;color:#fff;padding:2px 8px;border-radius:10px;font-weight:600">Khuyên dùng</span>
        </div>
        <p style="font-size:12.5px;color:var(--text-main);margin-bottom:10px;line-height:1.5">
          Tôi đã tạo sẵn thư mục tiện ích <b>TienIch_Chrome_ServiceOS</b> trong máy bạn. Sau khi cài, mỗi khi bạn mở <b>att-serviceos.anthinhtech.vn/#/dashboard</b>, sẽ có sẵn nút màu xanh <b>"⚡ Gửi xe sang Bảo Hành PRO"</b> ngay góc màn hình, bấm 1 cái là tự đồng bộ ngay lập tức!
        </p>

        <div style="background:#ffffff;border:1px dashed #86efac;border-radius:6px;padding:10px 12px;margin-bottom:10px;font-size:12px;line-height:1.6">
          <b>Cách cài đặt siêu nhanh (chỉ mất 15 giây):</b><br>
          1. Mở tab mới trên Chrome / Edge, gõ: <code style="background:#f1f5f9;padding:1px 5px;border-radius:3px;color:#2563eb">chrome://extensions</code><br>
          2. Bật công tắc <b>"Chế độ dành cho nhà phát triển" (Developer mode)</b> ở góc trên bên phải.<br>
          3. Bấm nút <b>"Tải tiện ích đã giải nén" (Load unpacked)</b> ở góc trên bên trái.<br>
          4. Chọn đúng thư mục: <code style="background:#f1f5f9;padding:1px 5px;border-radius:3px;color:#0f172a">TienIch_Chrome_ServiceOS</code> trong thư mục dự án này.<br>
          👉 <i>Xong! Vào lại ServiceOS là thấy ngay nút bấm!</i>
        </div>

        <div style="display:flex;gap:8px">
          <button class="btn secondary" style="font-size:12px;padding:6px 12px" onclick="copyExtensionPath()">📁 Sao chép đường dẫn thư mục tiện ích</button>
          <button class="btn secondary" style="font-size:12px;padding:6px 12px" onclick="copyUserscriptCode()">📋 Hoặc dùng qua Tampermonkey</button>
        </div>
      </div>
    </div>

    <!-- TAB 2: LỆNH F12 CONSOLE -->
    <div id="syncTabConsole" style="display:none">
      <div style="background:#eff6ff;border:1.5px solid #2563eb;border-radius:var(--radius-md);padding:14px;margin-bottom:12px">
        <div style="font-size:13.5px;font-weight:700;color:#1e40af;margin-bottom:4px">
          ⚡ Chạy lệnh Console trên ServiceOS (Không cần cài bất kỳ tiện ích nào)
        </div>
        <p style="font-size:12.5px;color:var(--text-main);margin-bottom:10px;line-height:1.5">
          Bấm nút bên dưới để vừa tự động copy mã lệnh vừa mở trang ServiceOS Dashboard ở tab mới:
        </p>
        <button class="btn primary" style="width:100%;font-size:13.5px;padding:10px;font-weight:700" onclick="runOneClickSyncFlow()">
          🚀 Mở ServiceOS & Tự động sao chép mã đồng bộ
        </button>
        <div style="font-size:12px;color:var(--text-main);margin-top:10px;line-height:1.6;background:#ffffff;padding:8px 12px;border-radius:6px;border:1px solid #bfdbfe">
          👉 <b>Thao tác sau khi tab ServiceOS mở ra:</b><br>
          1. Nhấn phím <b>F12</b> (hoặc chuột phải chọn Kiểm tra / Inspect).<br>
          2. Chọn tab <b>Console</b>.<br>
          3. Nhấn <b>Ctrl + V</b> rồi gõ <b>Enter</b>.<br>
          ⚡ Toàn bộ xe trong xưởng sẽ tự động nạp sang Bảo Hành PRO!
        </div>
        <details style="margin-top:8px">
          <summary style="font-size:11.5px;color:#2563eb;cursor:pointer">Xem mã lệnh Console</summary>
          <textarea id="bmConsoleCodeBox" readonly style="width:100%;height:65px;font-family:monospace;font-size:11px;margin-top:4px;padding:4px"></textarea>
        </details>
      </div>
    </div>

    <!-- TAB 3: FILE EXCEL -->
    <div id="syncTabExcel" style="display:none">
      <div style="background:#ffffff;border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:12px">
        <div style="font-size:13px;font-weight:700;color:var(--text-main);margin-bottom:4px">
          📁 Nhập file Excel từ ServiceOS (Đã sửa lỗi hiển thị 0 xe)
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px;line-height:1.5">
          Hệ thống đã nhận diện đầy đủ: Hạng mục lỗi, Ghi chú KTV, Serial PIN, Số máy động cơ, Ngày tháo. Bấm Xuất Excel trên ServiceOS rồi chọn file tại đây:
        </p>
        <button class="btn secondary" style="width:100%;font-size:12.5px;padding:9px" onclick="$('#serviceOsFileInput').click();closeBookmarkletModal();">
          📁 Chọn tệp Excel tải từ ServiceOS
        </button>
      </div>
    </div>

    <!-- TAB 4: DÁN TRỰC TIẾP CTRL+V -->
    <div id="syncTabPaste" style="display:none">
      <div style="background:#ffffff;border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:12px">
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
    </div>

    <div style="margin-top:12px;text-align:right">
      <button class="btn secondary" onclick="closeBookmarkletModal()">Đóng</button>
    </div>
  </div>
</div>
'''

text = text[:modal_start] + new_sync_modal + text[modal_end:]

# Update switchSyncTab
text = text.replace(
r'''window.switchSyncTab = function(tab){
  const tabs = ['login', 'tamper', 'console', 'excel'];
  tabs.forEach(t => {
    const el = $('#syncTab' + t.charAt(0).toUpperCase() + t.slice(1));
    const btn = $('#tabBtn' + (t === 'login' ? 'DirectLogin' : t === 'tamper' ? 'Tampermonkey' : t === 'console' ? 'Console' : 'Excel'));
    if(el) el.style.display = (t === tab) ? 'block' : 'none';
    if(btn) {
      if(t === tab) { btn.classList.remove('secondary'); }
      else { btn.classList.add('secondary'); }
    }
  });
};''',
r'''window.switchSyncTab = function(tab){
  const tabs = ['extension', 'console', 'excel', 'paste'];
  tabs.forEach(t => {
    const el = $('#syncTab' + t.charAt(0).toUpperCase() + t.slice(1));
    const btn = $('#tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    if(el) el.style.display = (t === tab) ? 'block' : 'none';
    if(btn) {
      if(t === tab) { btn.classList.remove('secondary'); }
      else { btn.classList.add('secondary'); }
    }
  });
};

window.copyExtensionPath = function(){
  const path = 'C:\\Users\\nhu truong\\OneDrive\\Tài liệu\\bảo hành\\TienIch_Chrome_ServiceOS';
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(path).then(() => {
      alert('📋 Đã sao chép đường dẫn thư mục tiện ích vào bộ nhớ tạm:\n' + path + '\n\nHãy vào chrome://extensions -> Tải tiện ích đã giải nén -> Dán đường dẫn này vào!');
    });
  } else {
    prompt('Đường dẫn thư mục tiện ích:', path);
  }
};''')

with io.open(TPL_FILE, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Updated app_template2.html! Total length: {len(text)}")
