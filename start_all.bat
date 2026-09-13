@echo off
title LandSure AI - Launcher
echo =========================================================================
echo   LandSure AI - Intelligent Land Record Digitization & Validation System
echo =========================================================================
echo.
echo [1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000 ...
set PYTHONPATH=%~dp0backend
start "LandSure AI - Backend" cmd /k "cd /d %~dp0backend && python -u run.py"

echo [2/2] Starting Frontend on http://localhost:5173 ...
set PATH=C:\Users\pavan\.gemini\antigravity\scratch\bin\node-v20.18.0-win-x64;%PATH%
start "LandSure AI - Frontend" cmd /k "cd /d %~dp0frontend && npm run preview -- --port 5173 --host"

echo.
echo =========================================================================
echo   Services Launched!
echo   - Frontend: http://localhost:5173
echo   - Backend API & Swagger Docs: http://127.0.0.1:8000/docs
echo =========================================================================
