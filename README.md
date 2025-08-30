# 在庫サービス (Inventory Service)

在庫管理を行うマイクロサービスのCRUD操作を実装したサービスです。

## 概要

このサービスは、商品の在庫情報を管理し、以下の機能を提供します：

- 在庫の作成・読み取り・更新・削除（CRUD）
- 在庫の調整（増加・減少）
- 在庫の予約・解除
- 在庫状況の検索・分析

## 技術スタック

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL** (本番環境)
- **MySQL** (開発環境)
- **Spring Cloud**
- **Lombok**

## プロジェクト構造

```
src/main/java/com/cooola/micro/services/inventory/
├── InventoryServiceApplication.java    # メインアプリケーションクラス
├── config/                            # 設定クラス
│   └── DatabaseConfig.java
├── controller/                         # REST API コントローラー
│   └── InventoryController.java
├── dto/                               # データ転送オブジェクト
│   ├── InventoryDto.java
│   ├── CreateInventoryRequest.java
│   ├── UpdateInventoryRequest.java
│   └── InventoryAdjustmentRequest.java
├── exception/                          # 例外処理
│   └── GlobalExceptionHandler.java
├── model/                              # エンティティ
│   └── Inventory.java
├── repository/                         # データアクセス層
│   └── InventoryRepository.java
└── service/                            # ビジネスロジック層
    └── InventoryService.java
```

## データベース設計

### 在庫テーブル (inventory)

| カラム名 | 型 | 説明 |
|---------|----|------|
| id | BIGSERIAL | 主キー（自動採番） |
| product_id | BIGINT | 商品ID |
| warehouse_id | BIGINT | 倉庫ID |
| quantity | INTEGER | 在庫数量 |
| reserved_quantity | INTEGER | 予約数量 |
| available_quantity | INTEGER | 利用可能数量 |
| last_updated | TIMESTAMP | 最終更新日時 |

### 制約

- `product_id` と `warehouse_id` の組み合わせは一意
- 数量は0以上
- 利用可能数量 = 在庫数量 - 予約数量

## API仕様

### 基本エンドポイント

- **ベースURL**: `/api/v1/inventories`

### 主要なAPI

#### 1. 在庫作成
```
POST /api/v1/inventories
Content-Type: application/json

{
  "productId": 1,
  "warehouseId": 1,
  "quantity": 100,
  "reservedQuantity": 0
}
```

#### 2. 在庫取得
```
GET /api/v1/inventories/{id}
```

#### 3. 在庫更新
```
PUT /api/v1/inventories/{id}
Content-Type: application/json

{
  "quantity": 150,
  "reservedQuantity": 10
}
```

#### 4. 在庫削除
```
DELETE /api/v1/inventories/{id}
```

#### 5. 在庫調整
```
PATCH /api/v1/inventories/{id}/adjust
Content-Type: application/json

{
  "adjustmentQuantity": 50,
  "reason": "入荷",
  "notes": "新商品入荷"
}
```

#### 6. 在庫予約
```
POST /api/v1/inventories/{id}/reserve?quantity=10
```

#### 7. 予約解除
```
POST /api/v1/inventories/{id}/release?quantity=5
```

#### 8. 検索・分析API

- 商品ID別在庫取得: `GET /api/v1/inventories/product/{productId}`
- 倉庫ID別在庫取得: `GET /api/v1/inventories/warehouse/{warehouseId}`
- 在庫不足商品: `GET /api/v1/inventories/low-stock?threshold=10`
- 在庫切れ商品: `GET /api/v1/inventories/out-of-stock`
- 十分な在庫がある商品: `GET /api/v1/inventories/sufficient-stock?quantity=50`

## デプロイ

### Renderでのデプロイ

#### 1. Renderアカウントの作成
- [Render.com](https://render.com) にアクセス
- GitHubアカウントでサインアップ

#### 2. 新しいWebサービスを作成
1. **"New +"** ボタンをクリック
2. **"Web Service"** を選択
3. **"Connect a repository"** でGitHubリポジトリを接続
4. リポジトリ `kensudogit/cooola-micro` を選択

#### 3. デプロイ設定
- **Name**: `inventory-service-crud`
- **Branch**: `feature/inventory-service`
- **Root Directory**: `services/inventory-service`
- **Runtime**: `Docker`
- **Build Command**: 自動検出（Dockerfile使用）
- **Start Command**: 自動検出（Dockerfile使用）

#### 4. 環境変数の設定
以下の環境変数を設定：
- `PORT`: `8080`
- `SPRING_PROFILES_ACTIVE`: `render`

#### 5. PostgreSQLデータベースの追加
1. **"New +"** ボタンをクリック
2. **"PostgreSQL"** を選択
3. データベース名: `inventory-db`
4. ユーザー名: `inventory_user`
5. 作成後、接続情報をコピー

#### 6. データベース接続の設定
PostgreSQL作成後、以下の環境変数をWebサービスに追加：
- `DATABASE_URL`: PostgreSQL接続URL
- `DB_USERNAME`: データベースユーザー名
- `DB_PASSWORD`: データベースパスワード

#### 7. デプロイの開始
- 設定完了後、**"Create Web Service"** をクリック
- 自動的にビルドとデプロイが開始されます

### ローカル開発環境

#### 1. データベース準備
```bash
# MySQLの場合
mysql -u root -p
CREATE DATABASE cooola_inventory;
USE cooola_inventory;
source src/main/resources/db/migration/V1__Create_Inventory_Table.sql;

# PostgreSQLの場合
psql -U postgres
CREATE DATABASE cooola_inventory;
\c cooola_inventory
\i src/main/resources/db/init/init-db.sql
```

#### 2. アプリケーション起動
```bash
# 開発環境
./gradlew bootRun

# 本番環境
./gradlew build
java -jar build/libs/inventory-service-1.0.0.jar
```

## 設定

### 環境別設定ファイル

- **`application.yml`**: デフォルト設定
- **`application-heroku.yml`**: Heroku環境用
- **`application-railway.yml`**: Railway環境用
- **`application-render.yml`**: Render環境用

### データベース接続

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
```

### ポート設定

デフォルトポート: `8080` (環境変数 `PORT` で変更可能)

## テスト

```bash
# 全テスト実行
./gradlew test

# テストをスキップしてビルド
./gradlew build -x test
```

## ログ

以下のログレベルで詳細な情報を確認できます：

- `DEBUG`: アプリケーションロジック
- `INFO`: 一般的な操作ログ
- `WARN`: 警告
- `ERROR`: エラー

## 監視・ヘルスチェック

- **ヘルスチェック**: `/api/v1/inventories/health`
- **メトリクス**: `/actuator/metrics`
- **情報**: `/actuator/info`

## 例外処理

- バリデーションエラー: `400 Bad Request`
- 不正なリクエスト: `400 Bad Request`
- リソース未発見: `404 Not Found`
- 内部サーバーエラー: `500 Internal Server Error`

## 今後の拡張予定

- 在庫履歴の管理
- 在庫アラート機能
- バッチ処理による在庫同期
- メトリクス・モニタリング強化
- 分散トレーシング対応

## トラブルシューティング

### よくある問題

#### 1. データベース接続エラー
- 環境変数の設定を確認
- データベースの起動状態を確認
- 接続文字列の形式を確認

#### 2. ビルドエラー
- Java 17がインストールされているか確認
- Gradle Wrapperの権限を確認
- 依存関係の競合を確認

#### 3. デプロイエラー
- Dockerfileの構文を確認
- 環境変数の設定を確認
- ログで詳細なエラーを確認

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

