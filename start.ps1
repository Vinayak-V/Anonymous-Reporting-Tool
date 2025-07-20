Write-Host "Starting Campus Anonymous Reporting Platform..." -ForegroundColor Green
Write-Host ""

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
cd client
npm install
cd ..

Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "Starting frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm start"

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Default admin credentials:" -ForegroundColor Yellow
Write-Host "Username: admin" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue" 