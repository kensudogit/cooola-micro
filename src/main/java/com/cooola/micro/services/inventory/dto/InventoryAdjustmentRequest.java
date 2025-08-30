package com.cooola.micro.services.inventory.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotNull;

/**
 * 在庫調整リクエストDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryAdjustmentRequest {
    
    @NotNull(message = "調整数量は必須です")
    private Integer adjustmentQuantity;
    
    private String reason;
    private String notes;
}
