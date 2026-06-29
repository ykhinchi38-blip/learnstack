@echo off
cd /d "%~dp0"
echo Validating LearnStack sample matching...
npm run validate:samples
echo.
echo Validation complete.
pause
