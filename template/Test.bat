@echo off
:: The name of your Spark executable file
set SPARK_EXE=spark.exe

:: The port to be used. 8080 is a common default.
set PORT=8080

echo Checking for existing Spark server...
taskkill /f /im spark.exe >nul 2>&1

echo Starting Spark server on port %PORT%...

:: 1. Start Spark in the background
:: Use 'start' so Spark runs in its own process
:: and doesn’t lock this command prompt window.
:: NOTE: The flag for port is '-port'
start "Spark Server" %SPARK_EXE% -port %PORT%

echo Waiting for server to be ready (2-second delay)...

:: 2. Short delay (2 seconds)
:: Gives spark.exe time to start up
:: before the browser tries to connect.
timeout /t 2 /nobreak > nul

echo Opening default browser...

:: 3. Open browser
:: Using 'start' with a URL opens the default browser
:: to that address. The server will automatically serve 'index.html'.
start msedge -inprivate http://localhost:%PORT%/index.html

echo Server is now running at http://localhost:%PORT%
