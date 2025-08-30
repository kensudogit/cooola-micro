-- PostgreSQL用 在庫テーブルの作成
CREATE TABLE IF NOT EXISTS inventory (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_id ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_product_warehouse ON inventory(product_id, warehouse_id);
CREATE INDEX IF NOT EXISTS idx_available_quantity ON inventory(available_quantity);
CREATE INDEX IF NOT EXISTS idx_last_updated ON inventory(last_updated);

-- 制約
ALTER TABLE inventory ADD CONSTRAINT chk_quantity_non_negative CHECK (quantity >= 0);
ALTER TABLE inventory ADD CONSTRAINT chk_reserved_quantity_non_negative CHECK (reserved_quantity >= 0);
ALTER TABLE inventory ADD CONSTRAINT chk_available_quantity_non_negative CHECK (available_quantity >= 0);
ALTER TABLE inventory ADD CONSTRAINT uk_product_warehouse UNIQUE (product_id, warehouse_id);

-- サンプルデータの挿入
INSERT INTO inventory (product_id, warehouse_id, quantity, reserved_quantity, available_quantity) VALUES
(1, 1, 100, 10, 90),
(1, 2, 50, 5, 45),
(2, 1, 200, 20, 180),
(2, 2, 75, 0, 75),
(3, 1, 0, 0, 0),
(3, 2, 25, 25, 0)
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET
    quantity = EXCLUDED.quantity,
    reserved_quantity = EXCLUDED.reserved_quantity,
    available_quantity = EXCLUDED.available_quantity;
