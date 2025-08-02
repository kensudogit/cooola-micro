# COOOLa Micro - クイックスタートガイド

## 概要
このガイドでは、COOOLa Microシステムを素早く起動し、基本的な機能を試す方法を説明します。

## 前提条件
- Docker Desktop がインストールされていること
- 最低8GBのRAM
- 10GB以上の空きディスク容量

## 1. システム起動

### 方法1: スクリプトを使用（推奨）
```bash
# Windows
scripts\start.bat

# Linux/Mac
./scripts/start.sh
```

### 方法2: Docker Compose を直接使用
```bash
# システムを起動
docker-compose up -d

# ログを確認
docker-compose logs -f
```

## 2. システムの確認

### サービス状態の確認
```bash
docker-compose ps
```

### 各サービスのアクセスURL
- **フロントエンド**: http://localhost:3000
- **API ゲートウェイ**: http://localhost:8081
- **Eureka Dashboard**: http://localhost:8761
- **Grafana**: http://localhost:3001 (admin/admin)
- **Kibana**: http://localhost:5601
- **Jaeger**: http://localhost:16686
- **RabbitMQ Management**: http://localhost:15672 (cooola_user/cooola_password)

## 3. 基本的な操作

### 3.1 商品管理
1. フロントエンドにアクセス: http://localhost:3000
2. 商品管理メニューを選択
3. 新しい商品を登録
4. 商品一覧を確認

### 3.2 在庫管理
1. 在庫管理メニューを選択
2. 在庫数量を確認
3. 在庫アラートを設定

### 3.3 入出庫処理
1. 入出庫管理メニューを選択
2. 入庫処理を実行
3. 出庫処理を実行
4. 履歴を確認

## 4. API テスト

### 商品API のテスト
```bash
# 商品一覧取得
curl http://localhost:8081/api/products

# 商品登録
curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "テスト商品",
    "description": "テスト用の商品です",
    "price": 1000,
    "categoryId": 1
  }'

# 商品詳細取得
curl http://localhost:8081/api/products/1
```

### 在庫API のテスト
```bash
# 在庫一覧取得
curl http://localhost:8081/api/inventory

# 在庫更新
curl -X PUT http://localhost:8081/api/inventory/1 \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 50
  }'
```

## 5. 監視・ログ

### 5.1 Grafana ダッシュボード
1. http://localhost:3001 にアクセス
2. ユーザー名: admin, パスワード: admin
3. システムメトリクスを確認

### 5.2 Kibana ログ分析
1. http://localhost:5601 にアクセス
2. アプリケーションログを検索・分析

### 5.3 Jaeger 分散トレーシング
1. http://localhost:16686 にアクセス
2. サービス間の呼び出しを追跡

## 6. プラグイン開発

### 6.1 新しいプラグインの作成
```java
@Component
public class CustomPlugin implements CooolaPlugin {
    @Override
    public String getName() {
        return "custom-plugin";
    }
    
    @Override
    public void initialize(PluginContext context) {
        // プラグイン初期化処理
    }
    
    // その他のメソッド実装
}
```

### 6.2 プラグインの登録
```java
@Autowired
private PluginManager pluginManager;

public void registerCustomPlugin() {
    CustomPlugin plugin = new CustomPlugin();
    pluginManager.registerPlugin(plugin);
    pluginManager.initializePlugin("custom-plugin");
    pluginManager.startPlugin("custom-plugin");
}
```

## 7. マイクロサービス開発

### 7.1 新しいサービスの作成
```java
@SpringBootApplication
@EnableDiscoveryClient
public class CustomServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CustomServiceApplication.class, args);
    }
}
```

### 7.2 サービス間通信
```java
@FeignClient(name = "product-service")
public interface ProductServiceClient {
    @GetMapping("/api/products/{id}")
    Product getProduct(@PathVariable Long id);
}
```

## 8. トラブルシューティング

### 8.1 よくある問題

#### ポート競合エラー
```bash
# 既存のコンテナを停止
docker-compose down

# ポートを変更して再起動
docker-compose up -d
```

#### メモリ不足エラー
```bash
# Docker Desktop のメモリ設定を増加
# 推奨: 8GB以上
```

#### データベース接続エラー
```bash
# MySQLコンテナの状態を確認
docker-compose logs mysql

# データベースの初期化を待機（約30秒）
```

### 8.2 ログの確認
```bash
# 全サービスのログ
docker-compose logs

# 特定サービスのログ
docker-compose logs product-service

# リアルタイムログ
docker-compose logs -f
```

## 9. システム停止

### 9.1 完全停止
```bash
# Windows
scripts\stop.bat

# Linux/Mac
./scripts/stop.sh
```

### 9.2 データ削除
```bash
# コンテナとデータを完全削除
docker-compose down -v
```

## 10. 次のステップ

### 10.1 カスタマイズ
- プラグインの追加・修正
- マイクロサービスの追加
- フロントエンドのカスタマイズ

### 10.2 本番環境デプロイ
- Kubernetes へのデプロイ
- Helm チャートの作成
- CI/CD パイプラインの構築

### 10.3 監視・アラート
- Prometheus アラートルールの設定
- Grafana ダッシュボードのカスタマイズ
- ログアラートの設定

## サポート
問題が発生した場合は、以下の方法でサポートを受けることができます：

1. ログファイルの確認
2. トラブルシューティングガイドの参照
3. GitHub イシューの作成
4. 開発チームへの問い合わせ

## ライセンス
MIT License 