@echo off
:: Development Server using npm http-server
:: Serves from current directory

setlocal

set PORT=8080

echo ================================================
echo  Starting NPM Development Server
echo ================================================
echo.

:: Change to script directory
echo [1/3] Setting web root to: %~dp0
cd /d %~dp0

:: Check if http-server is installed
echo.
echo [2/3] Checking http-server installation...
call npm list -g http-server >nul 2>&1
if %errorlevel% neq 0 (
    echo       http-server not found, installing globally...
    call npm install -g http-server
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Failed to install http-server
        echo Please run: npm install -g http-server
        pause
        exit /b 1
    )
) else (
    echo       http-server is installed
)

:: Start server and open browser
echo.
echo [3/3] Starting server on port %PORT%...
echo.
echo ================================================
echo  Server Started Successfully!
echo ================================================
echo.
echo  Web Root    : %CD%
echo  Server URL  : http://localhost:%PORT%
echo  Game URL    : http://localhost:%PORT%/template/index.html
echo.
echo  Press Ctrl+C to stop the server
echo ================================================
echo.

:: Open browser after 2 seconds (background task)
start /b cmd /c "timeout /t 2 /nobreak >nul && start msedge -inprivate http://localhost:%PORT%/template/index.html"

:: Start http-server
:: -p PORT : port number
:: -c-1    : disable caching (important for development)
:: -o      : open browser (we do it manually above for better control)
call npx http-server -p %PORT% -c-1

endlocal
