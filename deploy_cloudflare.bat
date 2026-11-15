@echo off
chcp 65001 >nul
title TRIEN KHAI CONG CU PHAN TICH BAO HANH (PAGES)
echo ========================================================
echo   TRIEN KHAI CONG CU PHAN TICH BAO HANH LEN CLOUDFLARE
echo ========================================================
echo.
echo Thu muc deploy: _deploy (chua index.html & functions/api)
echo.
echo Dang kiem tra dang nhap Cloudflare...
call npx.cmd -y wrangler whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo Ban chua dang nhap Cloudflare. Trinh duyet se mo de dang nhap...
    call npx.cmd -y wrangler login
)

echo.
echo Dang tai web len Cloudflare Pages...
call npx.cmd -y wrangler pages deploy _deploy --project-name=phan-tich-bao-hanh --branch=main

echo.
echo ========================================================
echo   HOAN TAT! Hay copy link .pages.dev o tren de su dung.
echo ========================================================
pause
