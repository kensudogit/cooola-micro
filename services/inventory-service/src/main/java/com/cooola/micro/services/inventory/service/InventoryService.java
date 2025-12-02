package com.cooola.micro.services.inventory.service;

import com.cooola.micro.services.inventory.dto.CreateInventoryRequest;
import com.cooola.micro.services.inventory.dto.UpdateInventoryRequest;
import com.cooola.micro.services.inventory.dto.InventoryAdjustmentRequest;
import com.cooola.micro.services.inventory.dto.InventoryDto;
import com.cooola.micro.services.inventory.model.Inventory;
import com.cooola.micro.services.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 在庫サービス
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InventoryService {
    
    private final InventoryRepository inventoryRepository;
    
    /**
     * 在庫を作成
     */
    public InventoryDto createInventory(CreateInventoryRequest request) {
        log.info("在庫作成リクエスト: {}", request);
        
        // 既存の在庫チェック
        if (inventoryRepository.existsByProductIdAndWarehouseId(request.getProductId(), request.getWarehouseId())) {
            throw new IllegalArgumentException("指定された商品IDと倉庫IDの組み合わせは既に存在します");
        }
        
        Inventory inventory = new Inventory();
        inventory.setProductId(request.getProductId());
        inventory.setWarehouseId(request.getWarehouseId());
        inventory.setQuantity(request.getQuantity());
        inventory.setReservedQuantity(request.getReservedQuantity());
        
        Inventory savedInventory = inventoryRepository.save(inventory);
        log.info("在庫作成完了: ID={}", savedInventory.getId());
        
        return convertToDto(savedInventory);
    }
    
    /**
     * 在庫を取得
     */
    @Transactional(readOnly = true)
    public Optional<InventoryDto> getInventory(Long id) {
        log.info("在庫取得リクエスト: ID={}", id);
        return inventoryRepository.findById(id).map(this::convertToDto);
    }
    
    /**
     * 商品IDと倉庫IDで在庫を取得
     */
    @Transactional(readOnly = true)
    public Optional<InventoryDto> getInventoryByProductAndWarehouse(Long productId, Long warehouseId) {
        log.info("在庫取得リクエスト: 商品ID={}, 倉庫ID={}", productId, warehouseId);
        return inventoryRepository.findByProductIdAndWarehouseId(productId, warehouseId).map(this::convertToDto);
    }
    
    /**
     * 全在庫を取得
     */
    @Transactional(readOnly = true)
    public List<InventoryDto> getAllInventories() {
        log.info("全在庫取得リクエスト");
        return inventoryRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * 商品IDで在庫リストを取得
     */
    @Transactional(readOnly = true)
    public List<InventoryDto> getInventoriesByProduct(Long productId) {
        log.info("商品ID別在庫取得リクエスト: 商品ID={}", productId);
        return inventoryRepository.findByProductId(productId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * 倉庫IDで在庫リストを取得
     */
    @Transactional(readOnly = true)
    public List<InventoryDto> getInventoriesByWarehouse(Long warehouseId) {
        log.info("倉庫ID別在庫取得リクエスト: 倉庫ID={}", warehouseId);
        return inventoryRepository.findByWarehouseId(warehouseId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * 在庫を更新
     */
    public Optional<InventoryDto> updateInventory(Long id, UpdateInventoryRequest request) {
        log.info("在庫更新リクエスト: ID={}, リクエスト={}", id, request);
        
        return inventoryRepository.findById(id).map(inventory -> {
            if (request.getQuantity() != null) {
                inventory.setQuantity(request.getQuantity());
            }
            if (request.getReservedQuantity() != null) {
                inventory.setReservedQuantity(request.getReservedQuantity());
            }
            
            Inventory updatedInventory = inventoryRepository.save(inventory);
            log.info("在庫更新完了: ID={}", updatedInventory.getId());
            
            return convertToDto(updatedInventory);
        });
    }
    
    /**
     * 在庫を削除
     */
    public boolean deleteInventory(Long id) {
        log.info("在庫削除リクエスト: ID={}", id);
        
        if (inventoryRepository.existsById(id)) {
            inventoryRepository.deleteById(id);
            log.info("在庫削除完了: ID={}", id);
            return true;
        }
        
        log.warn("削除対象の在庫が見つかりません: ID={}", id);
        return false;
    }
    
    /**
     * 在庫を調整（増加・減少）
     */
    public Optional<InventoryDto> adjustInventory(Long id, InventoryAdjustmentRequest request) {
        log.info("在庫調整リクエスト: ID={}, 調整数量={}", id, request.getAdjustmentQuantity());
        
        return inventoryRepository.findById(id).map(inventory -> {
            int adjustmentQuantity = request.getAdjustmentQuantity();
            
            if (adjustmentQuantity > 0) {
                // 在庫増加
                inventory.addQuantity(adjustmentQuantity);
                log.info("在庫増加: ID={}, 増加数量={}", id, adjustmentQuantity);
            } else if (adjustmentQuantity < 0) {
                // 在庫減少
                int absQuantity = Math.abs(adjustmentQuantity);
                if (!inventory.reduceQuantity(absQuantity)) {
                    throw new IllegalArgumentException("在庫不足のため調整できません");
                }
                log.info("在庫減少: ID={}, 減少数量={}", id, absQuantity);
            }
            
            Inventory updatedInventory = inventoryRepository.save(inventory);
            return convertToDto(updatedInventory);
        });
    }
    
    /**
     * 在庫を予約
     */
    public Optional<InventoryDto> reserveInventory(Long id, Integer quantity) {
        log.info("在庫予約リクエスト: ID={}, 予約数量={}", id, quantity);
        
        return inventoryRepository.findById(id).map(inventory -> {
            if (!inventory.reserveQuantity(quantity)) {
                throw new IllegalArgumentException("在庫不足のため予約できません");
            }
            
            Inventory updatedInventory = inventoryRepository.save(inventory);
            log.info("在庫予約完了: ID={}, 予約数量={}", id, quantity);
            
            return convertToDto(updatedInventory);
        });
    }
    
    /**
     * 予約を解除
     */
    public Optional<InventoryDto> releaseReservedInventory(Long id, Integer quantity) {
        log.info("予約解除リクエスト: ID={}, 解除数量={}", id, quantity);
        
        return inventoryRepository.findById(id).map(inventory -> {
            if (!inventory.releaseReservedQuantity(quantity)) {
                throw new IllegalArgumentException("予約数量不足のため解除できません");
            }
            
            Inventory updatedInventory = inventoryRepository.save(inventory);
            log.info("予約解除完了: ID={}, 解除数量={}", id, quantity);
            
            return convertToDto(updatedInventory);
        });
    }
    
    /**
     * 在庫不足の商品を取得
     */
    @Transactional(readOnly = true)
    public List<InventoryDto> getLowStockItems(Integer threshold) {
        log.info("在庫不足商品取得リクエスト: 閾値={}", threshold);
        return inventoryRepository.findLowStockItems(threshold).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * 在庫切れの商品を取得
     */
    @Transactional(readOnly = true)
    public List<InventoryDto> getOutOfStockItems() {
        log.info("在庫切れ商品取得リクエスト");
        return inventoryRepository.findOutOfStockItems().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * 指定数量以上の在庫がある商品を取得
     */
    @Transactional(readOnly = true)
    public List<InventoryDto> getInventoriesWithSufficientStock(Integer quantity) {
        log.info("十分な在庫がある商品取得リクエスト: 必要数量={}", quantity);
        return inventoryRepository.findByAvailableQuantityGreaterThanEqual(quantity).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * エンティティをDTOに変換
     */
    private InventoryDto convertToDto(Inventory inventory) {
        return new InventoryDto(
                inventory.getId(),
                inventory.getProductId(),
                inventory.getWarehouseId(),
                inventory.getQuantity(),
                inventory.getReservedQuantity(),
                inventory.getAvailableQuantity(),
                inventory.getLastUpdated()
        );
    }
}
