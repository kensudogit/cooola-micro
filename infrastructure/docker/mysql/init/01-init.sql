-- COOOLa Micro データベース初期化スクリプト

-- データベースの作成
CREATE DATABASE IF NOT EXISTS cooola_micro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cooola_micro;

-- 商品テーブル
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    min_stock_level INT DEFAULT 0,
    max_stock_level INT DEFAULT 1000,
    status ENUM('ACTIVE', 'INACTIVE', 'DISCONTINUED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_category (category),
    INDEX idx_status (status)
);

-- 在庫テーブル
CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    location VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    reserved_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_location (product_id, location)
);

-- 取引テーブル
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL UNIQUE,
    product_id BIGINT NOT NULL,
    transaction_type ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    reference_number VARCHAR(100),
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_product_date (product_id, created_at),
    INDEX idx_type_date (transaction_type, created_at)
);

-- サンプルデータの挿入
INSERT INTO products (code, name, description, price, category, stock_quantity, min_stock_level, max_stock_level) VALUES
('PC001', 'ノートPC', '高性能ノートパソコン', 80000.00, '電子機器', 25, 10, 100),
('PH001', 'スマートフォン', '最新スマートフォン', 50000.00, '電子機器', 15, 20, 50),
('TB001', 'タブレット', '軽量タブレット', 30000.00, '電子機器', 8, 5, 30),
('KB001', 'キーボード', 'ワイヤレスキーボード', 5000.00, 'アクセサリ', 50, 10, 200),
('MS001', 'マウス', '光学式マウス', 3000.00, 'アクセサリ', 100, 20, 500)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    category = VALUES(category),
    stock_quantity = VALUES(stock_quantity),
    min_stock_level = VALUES(min_stock_level),
    max_stock_level = VALUES(max_stock_level);

-- 在庫データの挿入
INSERT INTO inventory (product_id, location, quantity) VALUES
(1, '倉庫A-01', 25),
(2, '倉庫A-02', 15),
(3, '倉庫A-03', 8),
(4, '倉庫B-01', 50),
(5, '倉庫B-02', 100)
ON DUPLICATE KEY UPDATE
    quantity = VALUES(quantity);

-- 取引履歴の挿入
INSERT INTO transactions (transaction_id, product_id, transaction_type, quantity, unit_price, total_amount, reference_number, notes, created_by) VALUES
('TXN-2024-001', 1, 'IN', 50, 80000.00, 4000000.00, 'PO-2024-001', '初期入庫', 'system'),
('TXN-2024-002', 2, 'IN', 30, 50000.00, 1500000.00, 'PO-2024-002', '初期入庫', 'system'),
('TXN-2024-003', 3, 'IN', 20, 30000.00, 600000.00, 'PO-2024-003', '初期入庫', 'system'),
('TXN-2024-004', 1, 'OUT', 25, 80000.00, 2000000.00, 'SO-2024-001', '販売出庫', 'system'),
('TXN-2024-005', 2, 'OUT', 15, 50000.00, 750000.00, 'SO-2024-002', '販売出庫', 'system'); 