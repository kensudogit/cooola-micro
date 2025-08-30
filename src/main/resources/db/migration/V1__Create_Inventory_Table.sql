-- 在庫テーブルの作成
CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    reserved_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- インデックスの作成
    INDEX idx_product_id (product_id),
    INDEX idx_warehouse_id (warehouse_id),
    INDEX idx_product_warehouse (product_id, warehouse_id),
    INDEX idx_available_quantity (available_quantity),
    INDEX idx_last_updated (last_updated),
    
    -- 制約
    CONSTRAINT chk_quantity_non_negative CHECK (quantity >= 0),
    CONSTRAINT chk_reserved_quantity_non_negative CHECK (reserved_quantity >= 0),
    CONSTRAINT chk_available_quantity_non_negative CHECK (available_quantity >= 0),
    CONSTRAINT uk_product_warehouse UNIQUE (product_id, warehouse_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- サンプルデータの挿入
INSERT INTO inventory (product_id, warehouse_id, quantity, reserved_quantity, available_quantity) VALUES
(1, 1, 100, 10, 90),
(1, 2, 50, 5, 45),
(2, 1, 200, 20, 180),
(2, 2, 75, 0, 75),
(3, 1, 0, 0, 0),
(3, 2, 25, 25, 0)
ON DUPLICATE KEY UPDATE
    quantity = VALUES(quantity),
    reserved_quantity = VALUES(reserved_quantity),
    available_quantity = VALUES(available_quantity);
