package com.cooola.micro.product.repository;

import com.cooola.micro.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findByCode(String code);
    
    List<Product> findByCategory(String category);
    
    List<Product> findByStatus(Product.ProductStatus status);
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.minStockLevel")
    List<Product> findLowStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.code LIKE %:keyword%")
    List<Product> searchProducts(@Param("keyword") String keyword);
    
    boolean existsByCode(String code);
} 