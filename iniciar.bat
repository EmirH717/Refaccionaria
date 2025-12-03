@echo off
REM Script para iniciar el servidor Refaccionaria y Taller Guerrero
REM Usa este script en Windows (CMD o PowerShell)

cd /d "%~dp0"

echo.
echo ========================================
echo Refaccionaria y Taller Guerrero
echo ========================================
echo.
echo Iniciando servidor en http://localhost:3000
echo.
echo Sitio publico: http://localhost:3000/public/index.html
echo Panel admin: http://localhost:3000/public/admin.html
echo Contrasena admin: artemio123
echo.
echo Presiona Ctrl+C para detener el servidor.
echo ========================================
echo.

node server.js

pause
