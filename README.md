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
- **MySQL 8.0**
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
| id | BIGINT | 主キー（自動採番） |
| product_id | BIGINT | 商品ID |
| warehouse_id | BIGINT | 倉庫ID |
| quantity | INT | 在庫数量 |
| reserved_quantity | INT | 予約数量 |
| available_quantity | INT | 利用可能数量 |
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

## 設定

### データベース接続

`application.yml` で以下の設定を行います：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cooola_inventory
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### ポート設定

デフォルトポート: `8081`

## 起動方法

1. MySQLデータベースを起動
2. データベース `cooola_inventory` を作成
3. アプリケーションを起動

```bash
./gradlew bootRun
```

## テスト

```bash
./gradlew test
```

## ログ

以下のログレベルで詳細な情報を確認できます：

- `DEBUG`: アプリケーションロジック
- `INFO`: 一般的な操作ログ
- `WARN`: 警告
- `ERROR`: エラー

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

