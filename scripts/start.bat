@echo off
echo ========================================
echo COOOLa Micro - マイクロカーネル型倉庫管理システム
echo ========================================
echo.

echo システムを起動しています...

REM 既存のコンテナを停止
echo 既存のコンテナを停止中...
docker-compose down

REM イメージをビルド
echo イメージをビルド中...
docker-compose build --no-cache

REM システムを起動
echo システムを起動中...
docker-compose up -d

echo.
echo ========================================
echo システム起動完了！
echo ========================================
echo.
echo アクセスURL:
echo - フロントエンド: http://localhost:3000
echo - API ゲートウェイ: http://localhost:8081
echo - Eureka Dashboard: http://localhost:8761
echo - Grafana: http://localhost:3001 (admin/admin)
echo - Kibana: http://localhost:5601
echo - Jaeger: http://localhost:16686
echo - RabbitMQ Management: http://localhost:15672 (cooola_user/cooola_password)
echo.
echo ログを確認するには: scripts/logs.bat
echo システムを停止するには: scripts/stop.bat
echo.
pause 