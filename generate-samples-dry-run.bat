@echo off
cd /d "%~dp0"
echo Running LearnStack sample PDF dry run...
echo No files will be uploaded. Manifest will not be changed.
npm run samples:sync -- --dry-run
echo.
echo Dry run complete. Review output before running full sync.
pause
