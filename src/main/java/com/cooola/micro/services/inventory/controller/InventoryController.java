package com.cooola.micro.services.inventory.controller;

import com.cooola.micro.services.inventory.dto.*;
import com.cooola.micro.services.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * 在庫コントローラー
 */
@RestController
@RequestMapping("/api/v1/inventories")
@RequiredArgsConstructor
@Slf4j
public class InventoryController {
    
    private final InventoryService inventoryService;
    
    /**
     * 在庫を作成
     */
    @PostMapping
    public ResponseEntity<InventoryDto> createInventory(@Valid @RequestBody CreateInventoryRequest request) {
        log.info("在庫作成API呼び出し: {}", request);
        
        try {
            InventoryDto createdInventory = inventoryService.createInventory(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdInventory);
        } catch (IllegalArgumentException e) {
            log.error("在庫作成エラー: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("在庫作成中に予期しないエラーが発生: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 指定IDの在庫を取得
     */
    @GetMapping("/{id}")
    public ResponseEntity<InventoryDto> getInventory(@PathVariable Long id) {
        log.info("在庫取得API呼び出し: ID={}", id);
        
        Optional<InventoryDto> inventory = inventoryService.getInventory(id);
        return inventory.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * 商品IDと倉庫IDで在庫を取得
     */
    @GetMapping("/search")
    public ResponseEntity<InventoryDto> getInventoryByProductAndWarehouse(
            @RequestParam Long productId,
            @RequestParam Long warehouseId) {
        log.info("在庫検索API呼び出し: 商品ID={}, 倉庫ID={}", productId, warehouseId);
        
        Optional<InventoryDto> inventory = inventoryService.getInventoryByProductAndWarehouse(productId, warehouseId);
        return inventory.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * 全在庫を取得
     */
    @GetMapping
    public ResponseEntity<List<InventoryDto>> getAllInventories() {
        log.info("全在庫取得API呼び出し");
        
        List<InventoryDto> inventories = inventoryService.getAllInventories();
        return ResponseEntity.ok(inventories);
    }
    
    /**
     * 商品IDで在庫リストを取得
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<InventoryDto>> getInventoriesByProduct(@PathVariable Long productId) {
        log.info("商品ID別在庫取得API呼び出し: 商品ID={}", productId);
        
        List<InventoryDto> inventories = inventoryService.getInventoriesByProduct(productId);
        return ResponseEntity.ok(inventories);
    }
    
    /**
     * 倉庫IDで在庫リストを取得
     */
    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<InventoryDto>> getInventoriesByWarehouse(@PathVariable Long warehouseId) {
        log.info("倉庫ID別在庫取得API呼び出し: 倉庫ID={}", warehouseId);
        
        List<InventoryDto> inventories = inventoryService.getInventoriesByWarehouse(warehouseId);
        return ResponseEntity.ok(inventories);
    }
    
    /**
     * 在庫を更新
     */
    @PutMapping("/{id}")
    public ResponseEntity<InventoryDto> updateInventory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInventoryRequest request) {
        log.info("在庫更新API呼び出し: ID={}, リクエスト={}", id, request);
        
        Optional<InventoryDto> updatedInventory = inventoryService.updateInventory(id, request);
        return updatedInventory.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * 在庫を削除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        log.info("在庫削除API呼び出し: ID={}", id);
        
        boolean deleted = inventoryService.deleteInventory(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    /**
     * 在庫を調整（増加・減少）
     */
    @PatchMapping("/{id}/adjust")
    public ResponseEntity<InventoryDto> adjustInventory(
            @PathVariable Long id,
            @Valid @RequestBody InventoryAdjustmentRequest request) {
        log.info("在庫調整API呼び出し: ID={}, 調整数量={}", id, request.getAdjustmentQuantity());
        
        try {
            Optional<InventoryDto> adjustedInventory = inventoryService.adjustInventory(id, request);
            return adjustedInventory.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            log.error("在庫調整エラー: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("在庫調整中に予期しないエラーが発生: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 在庫を予約
     */
    @PostMapping("/{id}/reserve")
    public ResponseEntity<InventoryDto> reserveInventory(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        log.info("在庫予約API呼び出し: ID={}, 予約数量={}", id, quantity);
        
        try {
            Optional<InventoryDto> reservedInventory = inventoryService.reserveInventory(id, quantity);
            return reservedInventory.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            log.error("在庫予約エラー: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("在庫予約中に予期しないエラーが発生: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 予約を解除
     */
    @PostMapping("/{id}/release")
    public ResponseEntity<InventoryDto> releaseReservedInventory(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        log.info("予約解除API呼び出し: ID={}, 解除数量={}", id, quantity);
        
        try {
            Optional<InventoryDto> releasedInventory = inventoryService.releaseReservedInventory(id, quantity);
            return releasedInventory.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            log.error("予約解除エラー: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("予約解除中に予期しないエラーが発生: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 在庫不足の商品を取得
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryDto>> getLowStockItems(@RequestParam(defaultValue = "10") Integer threshold) {
        log.info("在庫不足商品取得API呼び出し: 閾値={}", threshold);
        
        List<InventoryDto> lowStockItems = inventoryService.getLowStockItems(threshold);
        return ResponseEntity.ok(lowStockItems);
    }
    
    /**
     * 在庫切れの商品を取得
     */
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<InventoryDto>> getOutOfStockItems() {
        log.info("在庫切れ商品取得API呼び出し");
        
        List<InventoryDto> outOfStockItems = inventoryService.getOutOfStockItems();
        return ResponseEntity.ok(outOfStockItems);
    }
    
    /**
     * 指定数量以上の在庫がある商品を取得
     */
    @GetMapping("/sufficient-stock")
    public ResponseEntity<List<InventoryDto>> getInventoriesWithSufficientStock(@RequestParam Integer quantity) {
        log.info("十分な在庫がある商品取得API呼び出し: 必要数量={}", quantity);
        
        List<InventoryDto> sufficientStockItems = inventoryService.getInventoriesWithSufficientStock(quantity);
        return ResponseEntity.ok(sufficientStockItems);
    }
    
    /**
     * ヘルスチェック
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Inventory Service is running");
    }
}
