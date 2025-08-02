@echo off
echo ========================================
echo COOOLa Micro - 簡易版起動スクリプト
echo ========================================
echo.

echo 簡易版システムを起動しています...
echo.

REM 既存のコンテナを停止
echo 1. 既存のコンテナを停止中...
docker-compose -f docker-compose.simple.yml down

REM システムを起動
echo 2. システムを起動中...
docker-compose -f docker-compose.simple.yml up -d

REM 起動待機
echo 3. システム起動を待機中...
timeout /t 30 /nobreak >nul

REM 状態確認
echo 4. システム状態を確認中...
docker-compose -f docker-compose.simple.yml ps

echo.
echo ========================================
echo 簡易版システム起動完了！
echo ========================================
echo.
echo アクセスURL:
echo - テストページ: http://localhost:3000
echo - Grafana: http://localhost:3001 (admin/admin)
echo - Prometheus: http://localhost:9090
echo - RabbitMQ管理: http://localhost:15672 (cooola_user/cooola_password)
echo.
echo データベース接続情報:
echo - ホスト: localhost
echo - ポート: 3306
echo - データベース: cooola_micro
echo - ユーザー: cooola_user
echo - パスワード: cooola_password
echo.
echo システムを停止するには: scripts\stop-simple.bat
echo.
pause 