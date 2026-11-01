@echo off
cd /d "%~dp0"
echo PyQuest is starting at http://localhost:8765
echo Keep this window open while playing. Close it to stop.
where py >nul 2>nul && (set PY=py) || (set PY=python)
start "" http://localhost:8765
%PY% -m http.server 8765
pause
