@echo off
echo ========================================
echo COOOLa Micro - ログ表示
echo ========================================
echo.

echo ログを表示するサービスを選択してください:
echo.
echo 1. 全サービスのログ
echo 2. コアシステム
echo 3. API ゲートウェイ
echo 4. 商品サービス
echo 5. 在庫サービス
echo 6. 入出庫サービス
echo 7. レポートサービス
echo 8. 通知サービス
echo 9. フロントエンド
echo 10. データベース
echo 11. メッセージキュー
echo 12. 監視システム
echo.

set /p choice="選択してください (1-12): "

if "%choice%"=="1" (
    echo 全サービスのログを表示中...
    docker-compose logs -f
) else if "%choice%"=="2" (
    echo コアシステムのログを表示中...
    docker-compose logs -f core-system
) else if "%choice%"=="3" (
    echo API ゲートウェイのログを表示中...
    docker-compose logs -f api-gateway
) else if "%choice%"=="4" (
    echo 商品サービスのログを表示中...
    docker-compose logs -f product-service
) else if "%choice%"=="5" (
    echo 在庫サービスのログを表示中...
    docker-compose logs -f inventory-service
) else if "%choice%"=="6" (
    echo 入出庫サービスのログを表示中...
    docker-compose logs -f transaction-service
) else if "%choice%"=="7" (
    echo レポートサービスのログを表示中...
    docker-compose logs -f report-service
) else if "%choice%"=="8" (
    echo 通知サービスのログを表示中...
    docker-compose logs -f notification-service
) else if "%choice%"=="9" (
    echo フロントエンドのログを表示中...
    docker-compose logs -f frontend
) else if "%choice%"=="10" (
    echo データベースのログを表示中...
    docker-compose logs -f mysql
) else if "%choice%"=="11" (
    echo メッセージキューのログを表示中...
    docker-compose logs -f rabbitmq
) else if "%choice%"=="12" (
    echo 監視システムのログを表示中...
    docker-compose logs -f prometheus grafana elasticsearch kibana jaeger
) else (
    echo 無効な選択です。
    pause
    exit /b 1
)

echo.
echo ログ表示を終了するには Ctrl+C を押してください。
pause 