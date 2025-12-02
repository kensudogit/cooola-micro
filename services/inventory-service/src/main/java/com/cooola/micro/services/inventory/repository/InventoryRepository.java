package com.cooola.micro.services.inventory.repository;

import com.cooola.micro.services.inventory.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 在庫リポジトリ
 */
@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    /**
     * 商品IDと倉庫IDで在庫を検索
     */
    Optional<Inventory> findByProductIdAndWarehouseId(Long productId, Long warehouseId);
    
    /**
     * 商品IDで在庫リストを検索
     */
    List<Inventory> findByProductId(Long productId);
    
    /**
     * 倉庫IDで在庫リストを検索
     */
    List<Inventory> findByWarehouseId(Long warehouseId);
    
    /**
     * 在庫不足の商品を検索
     */
    @Query("SELECT i FROM Inventory i WHERE i.availableQuantity <= :threshold")
    List<Inventory> findLowStockItems(@Param("threshold") Integer threshold);
    
    /**
     * 在庫切れの商品を検索
     */
    @Query("SELECT i FROM Inventory i WHERE i.availableQuantity <= 0")
    List<Inventory> findOutOfStockItems();
    
    /**
     * 指定された数量以上の在庫がある商品を検索
     */
    @Query("SELECT i FROM Inventory i WHERE i.availableQuantity >= :quantity")
    List<Inventory> findByAvailableQuantityGreaterThanEqual(@Param("quantity") Integer quantity);
    
    /**
     * 商品IDと倉庫IDの組み合わせが存在するかチェック
     */
    boolean existsByProductIdAndWarehouseId(Long productId, Long warehouseId);
}
