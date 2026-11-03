@echo off
echo Starting Qx_Billing Stack...

echo Starting Backend on port 3000...
start "Qx_Billing Backend" cmd /k "cd backend && npm start"

echo Starting Frontend...
start "Qx_Billing Frontend" cmd /k "cd frontend && npm run dev"

echo Done! Backend and Frontend are launching in separate windows.
pause
