@echo off
echo ========================================
echo COOOLa Micro - システムクリーンアップ
echo ========================================
echo.

echo 警告: この操作により、すべてのデータが削除されます。
echo 続行しますか？ (y/N)
set /p confirm=

if /i not "%confirm%"=="y" (
    echo 操作をキャンセルしました。
    pause
    exit /b 0
)

echo.
echo システムをクリーンアップしています...
echo.

REM すべてのコンテナを停止・削除
echo 1. コンテナを停止・削除中...
docker-compose down -v --remove-orphans

REM イメージを削除
echo 2. イメージを削除中...
docker rmi $(docker images -q cooola-micro_*) 2>nul || echo "削除するイメージがありません"

REM ボリュームを削除
echo 3. ボリュームを削除中...
docker volume rm cooola-micro_mysql_data 2>nul || echo "MySQLボリュームが存在しません"
docker volume rm cooola-micro_redis_data 2>nul || echo "Redisボリュームが存在しません"
docker volume rm cooola-micro_rabbitmq_data 2>nul || echo "RabbitMQボリュームが存在しません"
docker volume rm cooola-micro_prometheus_data 2>nul || echo "Prometheusボリュームが存在しません"
docker volume rm cooola-micro_grafana_data 2>nul || echo "Grafanaボリュームが存在しません"
docker volume rm cooola-micro_elasticsearch_data 2>nul || echo "Elasticsearchボリュームが存在しません"

REM ネットワークを削除
echo 4. ネットワークを削除中...
docker network rm cooola-micro_cooola-micro-network 2>nul || echo "ネットワークが存在しません"

REM 未使用のリソースをクリーンアップ
echo 5. 未使用リソースをクリーンアップ中...
docker system prune -f

echo.
echo ========================================
echo クリーンアップ完了！
echo ========================================
echo.
echo すべてのデータとコンテナが削除されました。
echo システムを再起動するには: scripts\start.bat
echo.
pause 