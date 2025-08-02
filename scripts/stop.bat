@echo off
echo ========================================
echo COOOLa Micro - システム停止
echo ========================================
echo.

echo システムを停止しています...

REM すべてのコンテナを停止
docker-compose down

echo.
echo ========================================
echo システム停止完了！
echo ========================================
echo.
echo データは保持されています。
echo 完全に削除するには: scripts/clean.bat
echo.
pause 