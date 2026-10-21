@echo off
cd /d "%~dp0"
if not exist frontend\node_modules (cd frontend && call npm install && cd ..)
start "SL Perfumaria - Backend" cmd /k "cd backend && mvn spring-boot:run"
start "SL Perfumaria - Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 15 /nobreak >nul
start http://localhost:5173
