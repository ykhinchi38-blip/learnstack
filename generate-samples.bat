@echo off
cd /d "%~dp0"
echo Running LearnStack sample PDF sync...
echo This will generate and upload free preview samples only.
npm run samples:sync
echo.
echo Done. Check the output above before deploying.
pause
