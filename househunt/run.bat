@echo off
title HouseHunt Launcher
echo ==================================================
echo         HOUSEHUNT MERN PROJECT LAUNCHER           
echo ==================================================
echo.
echo This script will set up and launch HouseHunt on your machine.
echo Requirements: Make sure MongoDB is running on your system!
echo.
pause

echo.
echo [1/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install backend dependencies. Check internet connection.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Seeding the MongoDB database...
call node seed.js
if %errorlevel% neq 0 (
    echo.
    echo [WARNING] Database seeding failed.
    echo Ensure MongoDB is running locally on port 27017, or verify your .env file.
    echo Proceeding to frontend installation anyway...
)

echo.
echo [3/4] Installing frontend dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install frontend dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo [4/4] Launching the MERN Application...
echo.
echo Starting Express API Server in a separate window...
start "HouseHunt Backend API Server" cmd /k "cd ../backend && npm run dev"

echo Starting Vite React Dev Server...
echo The app will open in your browser automatically.
echo.
echo ==================================================
echo  HouseHunt is launching:
echo  - Frontend Web UI: http://localhost:3000
echo  - Backend API:     http://localhost:5000
echo ==================================================
echo.
call npm run dev
pause
