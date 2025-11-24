@echo off
echo ========================================
echo Efootball Showdown 2025 - Local Setup
echo ========================================
echo.

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Creating .env.local file...
if not exist .env.local (
    echo JWT_SECRET=dev-secret-key-change-in-production-12345 > .env.local
    echo DATABASE_PATH=./database/tournament.db >> .env.local
    echo NODE_ENV=development >> .env.local
    echo Created .env.local file
) else (
    echo .env.local already exists
)

echo.
echo [3/4] Initializing database...
call npm run db:init
if errorlevel 1 (
    echo ERROR: Database initialization failed!
    pause
    exit /b 1
)

echo.
echo [4/4] Starting development server...
echo.
echo ========================================
echo Server starting on http://localhost:3000
echo ========================================
echo.
echo Default Admin Login:
echo   Email: admin@efootballshowdown.com
echo   Password: Admin123!
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

