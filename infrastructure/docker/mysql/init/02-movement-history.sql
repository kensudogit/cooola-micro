-- COOOLa Micro 商品移動履歴テーブル

USE cooola_micro;

-- 商品移動履歴テーブル
CREATE TABLE IF NOT EXISTS product_movements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movement_id VARCHAR(50) NOT NULL UNIQUE,
    product_id BIGINT NOT NULL,
    movement_type ENUM('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT', 'RETURN') NOT NULL,
    quantity INT NOT NULL,
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    reason VARCHAR(255),
    reference_number VARCHAR(100),
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_movement_id (movement_id),
    INDEX idx_product_date (product_id, created_at),
    INDEX idx_type_date (movement_type, created_at),
    INDEX idx_location (from_location, to_location)
);

-- 商品ロケーション履歴テーブル
CREATE TABLE IF NOT EXISTS product_location_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    location VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    movement_type ENUM('IN', 'OUT', 'TRANSFER') NOT NULL,
    previous_quantity INT DEFAULT 0,
    movement_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_location (product_id, location),
    INDEX idx_movement_date (movement_type, created_at)
);

-- サンプル移動履歴データの挿入
INSERT INTO product_movements (movement_id, product_id, movement_type, quantity, from_location, to_location, reason, reference_number, notes, created_by) VALUES
('MOV-2024-001', 1, 'IN', 50, '外部', '倉庫A-01', '初期入庫', 'PO-2024-001', '新商品の初期入庫', 'system'),
('MOV-2024-002', 1, 'OUT', 25, '倉庫A-01', '外部', '販売出庫', 'SO-2024-001', '顧客への販売', '田中'),
('MOV-2024-003', 1, 'TRANSFER', 10, '倉庫A-01', '倉庫B-01', '倉庫間移動', 'TR-2024-001', '在庫最適化のため', '佐藤'),
('MOV-2024-004', 2, 'IN', 30, '外部', '倉庫A-02', '初期入庫', 'PO-2024-002', '新商品の初期入庫', 'system'),
('MOV-2024-005', 2, 'OUT', 15, '倉庫A-02', '外部', '販売出庫', 'SO-2024-002', '顧客への販売', '鈴木'),
('MOV-2024-006', 3, 'IN', 20, '外部', '倉庫A-03', '初期入庫', 'PO-2024-003', '新商品の初期入庫', 'system'),
('MOV-2024-007', 3, 'ADJUSTMENT', 2, '倉庫A-03', '倉庫A-03', '破損調整', 'ADJ-2024-001', '輸送中の破損', '高橋'),
('MOV-2024-008', 4, 'IN', 100, '外部', '倉庫B-01', '初期入庫', 'PO-2024-004', '新商品の初期入庫', 'system'),
('MOV-2024-009', 5, 'IN', 200, '外部', '倉庫B-02', '初期入庫', 'PO-2024-005', '新商品の初期入庫', 'system'),
('MOV-2024-010', 1, 'RETURN', 5, '外部', '倉庫A-01', '返品処理', 'RT-2024-001', '顧客からの返品', '田中')
ON DUPLICATE KEY UPDATE
    movement_type = VALUES(movement_type),
    quantity = VALUES(quantity),
    from_location = VALUES(from_location),
    to_location = VALUES(to_location),
    reason = VALUES(reason),
    reference_number = VALUES(reference_number),
    notes = VALUES(notes);

-- ロケーション履歴データの挿入
INSERT INTO product_location_history (product_id, location, quantity, movement_type, previous_quantity, movement_id) VALUES
(1, '倉庫A-01', 50, 'IN', 0, 'MOV-2024-001'),
(1, '倉庫A-01', 25, 'OUT', 50, 'MOV-2024-002'),
(1, '倉庫A-01', 15, 'TRANSFER', 25, 'MOV-2024-003'),
(1, '倉庫B-01', 10, 'TRANSFER', 0, 'MOV-2024-003'),
(2, '倉庫A-02', 30, 'IN', 0, 'MOV-2024-004'),
(2, '倉庫A-02', 15, 'OUT', 30, 'MOV-2024-005'),
(3, '倉庫A-03', 20, 'IN', 0, 'MOV-2024-006'),
(3, '倉庫A-03', 18, 'ADJUSTMENT', 20, 'MOV-2024-007'),
(4, '倉庫B-01', 100, 'IN', 0, 'MOV-2024-008'),
(5, '倉庫B-02', 200, 'IN', 0, 'MOV-2024-009'),
(1, '倉庫A-01', 20, 'RETURN', 15, 'MOV-2024-010')
ON DUPLICATE KEY UPDATE
    quantity = VALUES(quantity),
    movement_type = VALUES(movement_type),
    previous_quantity = VALUES(previous_quantity); 