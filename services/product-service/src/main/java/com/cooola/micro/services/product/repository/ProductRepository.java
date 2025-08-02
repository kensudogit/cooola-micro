package com.cooola.micro.services.product.repository;

import com.cooola.micro.services.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 商品リポジトリ
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * 商品コードで商品を検索
     */
    Optional<Product> findByCode(String code);
    
    /**
     * 商品名またはコードで商品を検索（大文字小文字を区別しない）
     */
    List<Product> findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(String name, String code);
    
    /**
     * カテゴリIDで商品を検索
     */
    List<Product> findByCategoryId(Long categoryId);
    
    /**
     * アクティブな商品を検索
     */
    List<Product> findByIsActiveTrue();
    
    /**
     * バーコードで商品を検索
     */
    Optional<Product> findByBarcode(String barcode);
    
    /**
     * QRコードで商品を検索
     */
    Optional<Product> findByQrCode(String qrCode);
    
    /**
     * 在庫不足の商品を検索
     */
    @Query("SELECT p FROM Product p WHERE p.minStockLevel > 0 AND p.id IN " +
           "(SELECT i.productId FROM Inventory i WHERE i.quantity <= p.minStockLevel)")
    List<Product> findLowStockProducts();
    
    /**
     * 価格範囲で商品を検索
     */
    @Query("SELECT p FROM Product p WHERE p.unitPrice BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    /**
     * 重み範囲で商品を検索
     */
    @Query("SELECT p FROM Product p WHERE p.weight BETWEEN :minWeight AND :maxWeight")
    List<Product> findByWeightRange(@Param("minWeight") Double minWeight, @Param("maxWeight") Double maxWeight);
    
    /**
     * 商品コードの存在チェック
     */
    boolean existsByCode(String code);
    
    /**
     * バーコードの存在チェック
     */
    boolean existsByBarcode(String barcode);
    
    /**
     * QRコードの存在チェック
     */
    boolean existsByQrCode(String qrCode);
} 