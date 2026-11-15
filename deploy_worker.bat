@echo off
chcp 65001 >nul
title TRIEN KHAI CLOUDFLARE WORKER (CACH 2 API)
echo ========================================================
echo   TRIEN KHAI CLOUDFLARE WORKER: fragrant-heart-e2d4
echo   (TÍCH HỢP TỰ ĐỘNG KÉO API SERVICEOS)
echo ========================================================
echo.
echo Đang kiểm tra đăng nhập Cloudflare...
call npx.cmd -y wrangler whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo Bạn chưa đăng nhập Cloudflare qua dòng lệnh.
    echo Trình duyệt sẽ mở ra, bạn chỉ cần bấm "Allow" để cấp quyền...
    echo.
    call npx.cmd -y wrangler login
)

echo.
echo Đang tải Worker lên Cloudflare (tên: fragrant-heart-e2d4)...
call npx.cmd -y wrangler deploy worker.js --name fragrant-heart-e2d4 --compatibility-date 2024-11-01

echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo   THÀNH CÔNG! Worker của bạn đã được cập nhật:
    echo   https://fragrant-heart-e2d4.truongtruong-05072000.workers.dev/
    echo ========================================================
) else (
    echo.
    echo [LƯU Ý] Nếu gặp lỗi wrangler, bạn có thể copy nội dung file worker.js
    echo và dán vào ô "Quick Edit" trên trang Cloudflare Dashboard:
    echo https://dash.cloudflare.com/ -> Workers -> fragrant-heart-e2d4
)

echo.
pause
