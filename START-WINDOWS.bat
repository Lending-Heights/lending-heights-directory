@echo off
echo ================================================================
echo   LENDING HEIGHTS TEAM DIRECTORY - Quick Start
echo ================================================================
echo.
echo Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org
    echo 2. Download the LTS version
    echo 3. Install it
    echo 4. Restart this script
    echo.
    pause
    exit /b 1
)

echo Node.js found!
echo.
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Installation failed!
    pause
    exit /b 1
)

echo.
echo ================================================================
echo   Installation complete!
echo ================================================================
echo.
echo Starting development server...
echo.
echo The Team Directory will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.
echo ================================================================
echo.

call npm run dev
