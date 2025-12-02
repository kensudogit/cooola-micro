package com.cooola.micro.services.inventory.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * 在庫DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDto {
    
    private Long id;
    private Long productId;
    private Long warehouseId;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private LocalDateTime lastUpdated;
}
