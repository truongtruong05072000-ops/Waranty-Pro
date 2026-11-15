@echo off
chcp 65001 >nul
title COPY MA NGUON WORKER.JS VAO CLIPBOARD
echo ========================================================
echo   SAO CHÉP MÃ NGUỒN WORKER.JS ĐỂ DÁN VÀO CLOUDFLARE
echo ========================================================
echo.
powershell -Command "Get-Content -Raw -Encoding utf8 worker.js | Set-Clipboard"
echo.
echo Đã sao chép toàn bộ mã nguồn worker.js vào bộ nhớ tạm (Clipboard)!
echo Bây giờ bạn chỉ cần mở tab Cloudflare Dashboard (fragrant-heart-e2d4):
echo 1. Nhấn Ctrl + A (chọn tất cả mã cũ)
echo 2. Nhấn Ctrl + V (dán mã mới)
echo 3. Nhấn nút "Save and Deploy" (Lưu và triển khai)
echo.
pause
