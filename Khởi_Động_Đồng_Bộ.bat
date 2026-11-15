@echo off
chcp 65001 >nul
title MÁY CHỦ ĐỒNG BỘ SERVICEOS (API PROXY)
echo ========================================================
echo   MÁY CHỦ ĐỒNG BỘ SERVICEOS TỰ ĐỘNG (PORT 8787)
echo ========================================================
echo.
echo Đang chạy máy chủ API trung gian trên http://127.0.0.1:8787 ...
echo (Vui lòng không tắt cửa sổ này khi đang dùng ứng dụng Bảo Hành PRO)
echo.
python _build\local_proxy.py
pause
