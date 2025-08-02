-- COOOLa Micro Database Schema
-- マイクロカーネル型倉庫管理システム用データベーススキーマ

-- データベース作成
CREATE DATABASE IF NOT EXISTS cooola_micro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cooola_micro;

-- 商品カテゴリテーブル
CREATE TABLE product_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

-- 商品テーブル
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id BIGINT,
    unit_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    barcode VARCHAR(100),
    qr_code VARCHAR(100),
    weight DECIMAL(8,3),
    dimensions VARCHAR(50),
    min_stock_level INT DEFAULT 0,
    max_stock_level INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

-- 倉庫テーブル
CREATE TABLE warehouses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 在庫テーブル
CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    reserved_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_warehouse (product_id, warehouse_id)
);

-- 入出庫タイプテーブル
CREATE TABLE transaction_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    is_inbound BOOLEAN NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 入出庫トランザクションテーブル
CREATE TABLE inventory_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    transaction_type_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(12,2),
    reference_number VARCHAR(100),
    notes TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_type_id) REFERENCES transaction_types(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

-- 在庫移動テーブル
CREATE TABLE inventory_movements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movement_number VARCHAR(50) UNIQUE NOT NULL,
    from_warehouse_id BIGINT NOT NULL,
    to_warehouse_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (to_warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 棚卸しテーブル
CREATE TABLE stocktakes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stocktake_number VARCHAR(50) UNIQUE NOT NULL,
    warehouse_id BIGINT NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    status ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNED',
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

-- 棚卸し詳細テーブル
CREATE TABLE stocktake_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stocktake_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    expected_quantity INT NOT NULL,
    actual_quantity INT,
    variance INT GENERATED ALWAYS AS (actual_quantity - expected_quantity) STORED,
    notes TEXT,
    FOREIGN KEY (stocktake_id) REFERENCES stocktakes(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_stocktake_product (stocktake_id, product_id)
);

-- 通知テーブル
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    recipient VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- システム設定テーブル
CREATE TABLE system_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 初期データ挿入

-- 商品カテゴリ
INSERT INTO product_categories (name, description) VALUES
('電子機器', 'コンピュータ、スマートフォン、タブレットなど'),
('衣類', '衣服、靴、アクセサリーなど'),
('食品', '生鮮食品、加工食品、飲料など'),
('書籍', '書籍、雑誌、電子書籍など'),
('家具', 'テーブル、椅子、ベッドなど');

-- 入出庫タイプ
INSERT INTO transaction_types (name, code, description, is_inbound) VALUES
('入庫', 'IN', '商品の入庫処理', TRUE),
('出庫', 'OUT', '商品の出庫処理', FALSE),
('返品入庫', 'RETURN_IN', '返品による入庫', TRUE),
('返品出庫', 'RETURN_OUT', '返品による出庫', FALSE),
('棚卸し調整', 'ADJUSTMENT', '棚卸しによる在庫調整', TRUE),
('移動入庫', 'MOVE_IN', '倉庫間移動による入庫', TRUE),
('移動出庫', 'MOVE_OUT', '倉庫間移動による出庫', FALSE);

-- 倉庫
INSERT INTO warehouses (name, code, address, contact_person, contact_phone) VALUES
('本社倉庫', 'HQ', '東京都渋谷区1-1-1', '田中太郎', '03-1234-5678'),
('関西倉庫', 'KANSAI', '大阪府大阪市2-2-2', '佐藤花子', '06-2345-6789'),
('九州倉庫', 'KYUSHU', '福岡県福岡市3-3-3', '鈴木一郎', '092-3456-7890');

-- システム設定
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('system.name', 'COOOLa Micro', 'システム名'),
('system.version', '1.0.0', 'システムバージョン'),
('inventory.low_stock_threshold', '10', '在庫不足アラートの閾値'),
('inventory.critical_stock_threshold', '5', '在庫危機アラートの閾値'),
('notification.email.enabled', 'true', 'メール通知の有効/無効'),
('notification.sms.enabled', 'false', 'SMS通知の有効/無効');

-- インデックス作成
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX idx_transactions_date ON inventory_transactions(transaction_date);
CREATE INDEX idx_transactions_product ON inventory_transactions(product_id);
CREATE INDEX idx_transactions_warehouse ON inventory_transactions(warehouse_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient);
CREATE INDEX idx_notifications_read ON notifications(is_read); 