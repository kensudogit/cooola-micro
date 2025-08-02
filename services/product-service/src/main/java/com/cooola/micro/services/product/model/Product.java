package com.cooola.micro.services.product.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商品エンティティ
 */
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "商品コードは必須です")
    @Column(unique = true, nullable = false, length = 50)
    private String code;
    
    @NotBlank(message = "商品名は必須です")
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ProductCategory category;
    
    @NotNull(message = "単価は必須です")
    @Positive(message = "単価は正の数である必要があります")
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Positive(message = "原価は正の数である必要があります")
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;
    
    @Column(length = 100)
    private String barcode;
    
    @Column(name = "qr_code", length = 100)
    private String qrCode;
    
    @Column(precision = 8, scale = 3)
    private BigDecimal weight;
    
    @Column(length = 50)
    private String dimensions;
    
    @Column(name = "min_stock_level")
    private Integer minStockLevel = 0;
    
    @Column(name = "max_stock_level")
    private Integer maxStockLevel;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 