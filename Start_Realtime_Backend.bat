@echo off
setlocal
cd /d "%~dp0"
title VinFast CarOn Thoi An - Realtime 24/7 Backend Server (N54511)
color 0B

echo =====================================================================
echo    VINFAST CARON THOI AN - 24/7 REALTIME SYNC BACKEND ENGINE
echo    Ma Dai Ly: N54511  -  Chi Nhanh: 2 (CarOn Thoi An)
echo =====================================================================
echo.
echo [*] Kiem tra Node.js tren he thong...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [LOI] Khong tim thay Node.js tren may tinh!
    echo Vui long cai dat Node.js tu: https://nodejs.org
    echo Sau khi cai dat xong, hay mo lai file nay.
    echo.
    pause
    exit /b 1
)

echo [*] Node.js phien ban:
node -v
echo.
echo [*] Dang khoi dong Realtime Backend Server tren cong 8787...
echo [*] Duong dan Web: http://localhost:8787
echo [*] Nhan Ctrl+C de dung server neu can.
echo.

:: Tu dong mo trinh duyet sau 2 giay
start "" http://localhost:8787

:: Chay server node
node backend/server.js

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [THONG BAO] Server da dung hoac gap su co.
)
pause
