@echo off
echo Starting Campus Anonymous Reporting Platform...
echo.

echo Installing backend dependencies...
npm install

echo.
echo Installing frontend dependencies...
cd client
npm install
cd ..

echo.
echo Starting backend server...
start "Backend Server" cmd /k "npm run dev"

echo.
echo Starting frontend server...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Default admin credentials:
echo Username: admin
echo Password: admin123
echo.
pause 