package com.cooola.micro.services.inventory.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.Min;

/**
 * 在庫更新リクエストDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateInventoryRequest {
    
    @Min(value = 0, message = "数量は0以上である必要があります")
    private Integer quantity;
    
    @Min(value = 0, message = "予約数量は0以上である必要があります")
    private Integer reservedQuantity;
}
