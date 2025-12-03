#!/usr/bin/env powershell
# Script para iniciar el servidor Refaccionaria y Taller Guerrero (PowerShell)

Write-Host ""
Write-Host "========================================"
Write-Host "Refaccionaria y Taller Guerrero" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "Iniciando servidor en http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Sitio publico: http://localhost:3000/public/index.html" -ForegroundColor Cyan
Write-Host "Panel admin: http://localhost:3000/public/admin.html" -ForegroundColor Cyan
Write-Host "Contrasena admin: artemio123" -ForegroundColor Yellow
Write-Host ""
Write-Host "Correo de notificaciones: refacctaller23@gmail.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

# Cambiar al directorio del script
Set-Location -Path $PSScriptRoot

# Verificar que Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    Read-Host "Presiona Enter para cerrar"
    exit 1
}

# Iniciar el servidor
node server.js

Read-Host "Presiona Enter para cerrar"
