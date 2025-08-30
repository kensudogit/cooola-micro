package com.cooola.micro.services.inventory.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * 在庫作成リクエストDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInventoryRequest {
    
    @NotNull(message = "商品IDは必須です")
    private Long productId;
    
    @NotNull(message = "倉庫IDは必須です")
    private Long warehouseId;
    
    @Min(value = 0, message = "数量は0以上である必要があります")
    private Integer quantity = 0;
    
    @Min(value = 0, message = "予約数量は0以上である必要があります")
    private Integer reservedQuantity = 0;
}
