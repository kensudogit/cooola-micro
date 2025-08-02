@echo off
echo ========================================
echo COOOLa Micro - システム状態確認
echo ========================================
echo.

echo システムの状態を確認しています...
echo.

REM Docker Compose の状態確認
echo [Docker Compose 状態]
docker-compose ps
echo.

REM 各サービスの健康状態確認
echo [サービス健康状態]
echo.

REM コアシステム
echo コアシステム:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:8080/actuator/health || echo "サービスが起動していません"
echo.

REM API ゲートウェイ
echo API ゲートウェイ:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:8081/actuator/health || echo "サービスが起動していません"
echo.

REM 商品サービス
echo 商品サービス:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:8082/actuator/health || echo "サービスが起動していません"
echo.

REM 在庫サービス
echo 在庫サービス:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:8083/actuator/health || echo "サービスが起動していません"
echo.

REM 入出庫サービス
echo 入出庫サービス:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:8084/actuator/health || echo "サービスが起動していません"
echo.

REM レポートサービス
echo レポートサービス:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:8085/actuator/health || echo "サービスが起動していません"
echo.

REM 通知サービス
echo 通知サービス:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:8086/actuator/health || echo "サービスが起動していません"
echo.

REM Eureka サービスディスカバリ
echo Eureka サービスディスカバリ:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:8761 || echo "サービスが起動していません"
echo.

REM フロントエンド
echo フロントエンド:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:3000 || echo "サービスが起動していません"
echo.

REM データベース
echo データベース:
docker exec cooola-micro-mysql mysqladmin ping -h localhost -u cooola_user -pcooola_password 2>nul && echo "接続OK" || echo "接続エラー"
echo.

REM Redis
echo Redis:
docker exec cooola-micro-redis redis-cli ping 2>nul && echo "接続OK" || echo "接続エラー"
echo.

REM RabbitMQ
echo RabbitMQ:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:15672/api/overview || echo "サービスが起動していません"
echo.

REM Prometheus
echo Prometheus:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:9090/-/healthy || echo "サービスが起動していません"
echo.

REM Grafana
echo Grafana:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:3001/api/health || echo "サービスが起動していません"
echo.

REM Elasticsearch
echo Elasticsearch:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:9200/_cluster/health || echo "サービスが起動していません"
echo.

REM Kibana
echo Kibana:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:5601/api/status || echo "サービスが起動していません"
echo.

REM Jaeger
echo Jaeger:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:16686 || echo "サービスが起動していません"
echo.

echo.
echo ========================================
echo システム状態確認完了
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
pause 