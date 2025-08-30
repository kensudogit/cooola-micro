package com.cooola.micro.services.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * 在庫エンティティ
 */
@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "商品IDは必須です")
    @Column(name = "product_id", nullable = false)
    private Long productId;
    
    @NotNull(message = "倉庫IDは必須です")
    @Column(name = "warehouse_id", nullable = false)
    private Long warehouseId;
    
    @Min(value = 0, message = "数量は0以上である必要があります")
    @Column(nullable = false)
    private Integer quantity = 0;
    
    @Min(value = 0, message = "予約数量は0以上である必要があります")
    @Column(name = "reserved_quantity", nullable = false)
    private Integer reservedQuantity = 0;
    
    @Column(name = "available_quantity", nullable = false)
    private Integer availableQuantity = 0;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @PrePersist
    protected void onCreate() {
        lastUpdated = LocalDateTime.now();
        updateAvailableQuantity();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
        updateAvailableQuantity();
    }
    
    private void updateAvailableQuantity() {
        this.availableQuantity = this.quantity - this.reservedQuantity;
    }
    
    /**
     * 在庫を増加
     */
    public void addQuantity(int amount) {
        if (amount > 0) {
            this.quantity += amount;
            updateAvailableQuantity();
        }
    }
    
    /**
     * 在庫を減少
     */
    public boolean reduceQuantity(int amount) {
        if (amount > 0 && this.availableQuantity >= amount) {
            this.quantity -= amount;
            updateAvailableQuantity();
            return true;
        }
        return false;
    }
    
    /**
     * 在庫を予約
     */
    public boolean reserveQuantity(int amount) {
        if (amount > 0 && this.availableQuantity >= amount) {
            this.reservedQuantity += amount;
            updateAvailableQuantity();
            return true;
        }
        return false;
    }
    
    /**
     * 予約を解除
     */
    public boolean releaseReservedQuantity(int amount) {
        if (amount > 0 && this.reservedQuantity >= amount) {
            this.reservedQuantity -= amount;
            updateAvailableQuantity();
            return true;
        }
        return false;
    }
    
    /**
     * 在庫不足かどうかチェック
     */
    public boolean isLowStock(int threshold) {
        return this.availableQuantity <= threshold;
    }
    
    /**
     * 在庫切れかどうかチェック
     */
    public boolean isOutOfStock() {
        return this.availableQuantity <= 0;
    }
} 