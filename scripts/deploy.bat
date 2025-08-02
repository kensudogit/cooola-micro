@echo off
echo ========================================
echo COOOLa Micro - デプロイメントスクリプト
echo ========================================
echo.

echo デプロイメント環境を選択してください:
echo.
echo 1. 開発環境 (Development)
echo 2. ステージング環境 (Staging)
echo 3. 本番環境 (Production)
echo.

set /p environment="環境を選択してください (1-3): "

if "%environment%"=="1" (
    set ENV=development
    set COMPOSE_FILE=docker-compose.dev.yml
) else if "%environment%"=="2" (
    set ENV=staging
    set COMPOSE_FILE=docker-compose.staging.yml
) else if "%environment%"=="3" (
    set ENV=production
    set COMPOSE_FILE=docker-compose.prod.yml
) else (
    echo 無効な選択です。
    pause
    exit /b 1
)

echo.
echo %ENV%環境にデプロイします...
echo.

REM 既存のコンテナを停止
echo 1. 既存のコンテナを停止中...
docker-compose down

REM イメージをビルド
echo 2. イメージをビルド中...
docker-compose -f %COMPOSE_FILE% build --no-cache

REM システムを起動
echo 3. システムを起動中...
docker-compose -f %COMPOSE_FILE% up -d

REM ヘルスチェック
echo 4. ヘルスチェック中...
timeout /t 30 /nobreak >nul

REM 各サービスの状態確認
echo 5. サービス状態を確認中...
docker-compose -f %COMPOSE_FILE% ps

echo.
echo ========================================
echo デプロイメント完了！
echo ========================================
echo.
echo 環境: %ENV%
echo 設定ファイル: %COMPOSE_FILE%
echo.
echo アクセスURL:
if "%ENV%"=="development" (
    echo - フロントエンド: http://localhost:3000
    echo - API ゲートウェイ: http://localhost:8081
    echo - Eureka Dashboard: http://localhost:8761
    echo - Grafana: http://localhost:3001 (admin/admin)
    echo - Kibana: http://localhost:5601
    echo - Jaeger: http://localhost:16686
) else if "%ENV%"=="staging" (
    echo - フロントエンド: http://staging.cooola-micro.local
    echo - API ゲートウェイ: http://api-staging.cooola-micro.local
    echo - Grafana: http://monitoring-staging.cooola-micro.local
) else (
    echo - フロントエンド: https://app.cooola-micro.com
    echo - API ゲートウェイ: https://api.cooola-micro.com
    echo - Grafana: https://monitoring.cooola-micro.com
)
echo.
echo ログを確認するには: scripts\logs.bat
echo システムを停止するには: scripts\stop.bat
echo.
pause 