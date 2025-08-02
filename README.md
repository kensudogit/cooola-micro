# COOOLa Micro - マイクロカーネル型倉庫管理システム

## 概要
COOOLa Microは、マイクロカーネルアーキテクチャを採用したクラウドベースの倉庫管理システムです。コアシステムがプラグインインターフェースを提供し、各機能が独立したマイクロサービスとして実装されています。

## アーキテクチャ

### マイクロカーネル設計
- **コアシステム**: 基本的なプラグイン管理、認証、設定管理
- **プラグインシステム**: 動的ロード可能な機能モジュール
- **マイクロサービス**: 独立してデプロイ・スケール可能なサービス

### 主要コンポーネント

#### コアシステム (Core)
- プラグイン管理・ローダー
- 認証・認可サービス
- 設定管理
- イベントバス
- API ゲートウェイ

#### プラグイン (Plugins)
- **商品管理プラグイン**: 商品のCRUD操作
- **在庫管理プラグイン**: 在庫追跡・アラート
- **入出庫プラグイン**: 入出庫処理・履歴
- **レポートプラグイン**: 各種レポート生成
- **バーコードプラグイン**: バーコード・QRコード生成

#### マイクロサービス (Microservices)
- **商品サービス**: 商品情報管理
- **在庫サービス**: 在庫状態管理
- **入出庫サービス**: 入出庫処理
- **レポートサービス**: レポート生成
- **通知サービス**: アラート・通知

## 技術スタック

### コアシステム
- **Spring Boot 3.x** - メインフレームワーク
- **Java 17** - プログラミング言語
- **Spring Cloud** - マイクロサービスフレームワーク
- **Netflix Eureka** - サービスディスカバリ
- **Spring Cloud Gateway** - API ゲートウェイ

### プラグインシステム
- **OSGi** - プラグイン管理
- **Spring Boot Actuator** - ヘルスチェック・監視
- **Spring Cloud Config** - 設定管理

### マイクロサービス
- **Spring Boot** - 各サービス
- **Spring Data JPA** - データアクセス
- **MySQL 8.0** - メインデータベース
- **Redis** - キャッシュ・セッション
- **RabbitMQ** - メッセージキュー

### フロントエンド
- **Angular 17** - モダンなフロントエンドフレームワーク
- **TypeScript** - 型安全なJavaScript
- **Bootstrap 5** - UIフレームワーク
- **RxJS** - リアクティブプログラミング

### インフラストラクチャ
- **Docker** - コンテナ化
- **Docker Compose** - ローカル開発環境
- **Kubernetes** - 本番環境オーケストレーション
- **Helm** - Kubernetes パッケージ管理

### 監視・ログ
- **Prometheus** - メトリクス収集
- **Grafana** - 可視化
- **Elasticsearch** - ログ管理
- **Kibana** - ログ可視化
- **Jaeger** - 分散トレーシング

## プロジェクト構造

```
cooola-micro/
├── core/                          # コアシステム
│   ├── core-api/                  # コアAPI定義
│   ├── core-impl/                 # コア実装
│   ├── plugin-manager/            # プラグイン管理
│   └── api-gateway/               # API ゲートウェイ
├── plugins/                       # プラグイン
│   ├── product-plugin/            # 商品管理プラグイン
│   ├── inventory-plugin/          # 在庫管理プラグイン
│   ├── transaction-plugin/        # 入出庫プラグイン
│   ├── report-plugin/             # レポートプラグイン
│   └── barcode-plugin/            # バーコードプラグイン
├── services/                      # マイクロサービス
│   ├── product-service/           # 商品サービス
│   ├── inventory-service/         # 在庫サービス
│   ├── transaction-service/       # 入出庫サービス
│   ├── report-service/            # レポートサービス
│   └── notification-service/      # 通知サービス
├── frontend/                      # フロントエンド
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/              # コア機能
│   │   │   ├── plugins/           # プラグインUI
│   │   │   └── services/          # サービス連携
│   │   └── assets/
│   └── package.json
├── infrastructure/                # インフラ設定
│   ├── docker/                    # Docker設定
│   ├── kubernetes/                # K8s設定
│   └── helm/                      # Helm設定
├── monitoring/                    # 監視設定
│   ├── prometheus/
│   ├── grafana/
│   └── jaeger/
└── scripts/                       # 管理スクリプト
    ├── start.bat
    ├── stop.bat
    └── deploy.bat
```

## 開発環境セットアップ

### 前提条件
- Docker Desktop
- Java 17
- Node.js 18
- Git

### 起動方法

#### 1. 全サービス起動
```bash
scripts/start.bat
```

#### 2. 個別サービス起動
```bash
# コアシステムのみ
docker-compose up core

# 特定のプラグイン
docker-compose up product-plugin

# 特定のマイクロサービス
docker-compose up product-service
```

### アクセスURL
- **フロントエンド**: http://localhost:3000
- **API ゲートウェイ**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Grafana**: http://localhost:3001 (admin/admin)
- **Kibana**: http://localhost:5601
- **Jaeger**: http://localhost:16686

## プラグイン開発

### プラグインインターフェース
```java
public interface CooolaPlugin {
    String getName();
    String getVersion();
    void initialize(PluginContext context);
    void start();
    void stop();
    PluginMetadata getMetadata();
}
```

### プラグイン実装例
```java
@Component
public class ProductPlugin implements CooolaPlugin {
    @Override
    public String getName() {
        return "product-management";
    }
    
    @Override
    public void initialize(PluginContext context) {
        // プラグイン初期化処理
    }
    
    // プラグイン固有の機能実装
}
```

## マイクロサービス開発

### サービス間通信
- **REST API**: 同期通信
- **RabbitMQ**: 非同期通信
- **gRPC**: 高性能通信

### サービスディスカバリ
- **Eureka**: サービス登録・発見
- **Spring Cloud LoadBalancer**: ロードバランシング

## デプロイメント

### ローカル開発
```bash
docker-compose up -d
```

### 本番環境
```bash
# Kubernetes デプロイ
kubectl apply -f infrastructure/kubernetes/

# Helm デプロイ
helm install cooola-micro infrastructure/helm/
```

## 監視・ログ

### メトリクス
- **Prometheus**: システムメトリクス収集
- **Grafana**: ダッシュボード表示
- **Micrometer**: アプリケーションメトリクス

### ログ
- **ELK Stack**: ログ収集・分析
- **Jaeger**: 分散トレーシング

## トラブルシューティング

### よくある問題

#### 1. プラグイン読み込みエラー
**問題**: プラグインが正常に読み込まれない

**解決方法**:
- プラグインの依存関係を確認
- プラグインのバージョン互換性を確認
- ログで詳細なエラーを確認

#### 2. サービス間通信エラー
**問題**: マイクロサービス間で通信できない

**解決方法**:
- Eurekaの状態を確認
- ネットワーク設定を確認
- サービスヘルスチェックを確認

### ログの確認方法
```bash
# 全サービスのログ
docker-compose logs

# 特定サービスのログ
docker-compose logs core
docker-compose logs product-service

# リアルタイムログ
docker-compose logs -f
```

## ライセンス
MIT License

## 貢献
プルリクエストやイシューの報告を歓迎します。 "# cooola-micro" 
