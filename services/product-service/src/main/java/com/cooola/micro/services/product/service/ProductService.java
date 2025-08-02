package com.cooola.micro.services.product.service;

import com.cooola.micro.services.product.model.Product;
import com.cooola.micro.services.product.model.ProductCategory;
import com.cooola.micro.services.product.repository.ProductRepository;
import com.cooola.micro.services.product.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 商品サービス実装
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    
    /**
     * 全商品を取得
     */
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        log.info("Getting all products");
        return productRepository.findAll();
    }
    
    /**
     * IDで商品を取得
     */
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        log.info("Getting product with id: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    /**
     * 商品コードで商品を取得
     */
    @Transactional(readOnly = true)
    public Optional<Product> getProductByCode(String code) {
        log.info("Getting product with code: {}", code);
        return productRepository.findByCode(code);
    }
    
    /**
     * 商品を登録
     */
    public Product createProduct(Product product) {
        log.info("Creating new product: {}", product.getName());
        
        // 商品コードの重複チェック
        if (productRepository.findByCode(product.getCode()).isPresent()) {
            throw new RuntimeException("Product code already exists: " + product.getCode());
        }
        
        // カテゴリの存在チェック
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            ProductCategory category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + product.getCategory().getId()));
            product.setCategory(category);
        }
        
        return productRepository.save(product);
    }
    
    /**
     * 商品を更新
     */
    public Product updateProduct(Long id, Product productDetails) {
        log.info("Updating product with id: {}", id);
        
        Product product = getProductById(id);
        
        // 商品コードの重複チェック（自分以外）
        if (productDetails.getCode() != null && !productDetails.getCode().equals(product.getCode())) {
            if (productRepository.findByCode(productDetails.getCode()).isPresent()) {
                throw new RuntimeException("Product code already exists: " + productDetails.getCode());
            }
        }
        
        // カテゴリの存在チェック
        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            ProductCategory category = categoryRepository.findById(productDetails.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDetails.getCategory().getId()));
            product.setCategory(category);
        }
        
        // フィールドを更新
        if (productDetails.getCode() != null) {
            product.setCode(productDetails.getCode());
        }
        if (productDetails.getName() != null) {
            product.setName(productDetails.getName());
        }
        if (productDetails.getDescription() != null) {
            product.setDescription(productDetails.getDescription());
        }
        if (productDetails.getUnitPrice() != null) {
            product.setUnitPrice(productDetails.getUnitPrice());
        }
        if (productDetails.getCostPrice() != null) {
            product.setCostPrice(productDetails.getCostPrice());
        }
        if (productDetails.getBarcode() != null) {
            product.setBarcode(productDetails.getBarcode());
        }
        if (productDetails.getQrCode() != null) {
            product.setQrCode(productDetails.getQrCode());
        }
        if (productDetails.getWeight() != null) {
            product.setWeight(productDetails.getWeight());
        }
        if (productDetails.getDimensions() != null) {
            product.setDimensions(productDetails.getDimensions());
        }
        if (productDetails.getMinStockLevel() != null) {
            product.setMinStockLevel(productDetails.getMinStockLevel());
        }
        if (productDetails.getMaxStockLevel() != null) {
            product.setMaxStockLevel(productDetails.getMaxStockLevel());
        }
        if (productDetails.getIsActive() != null) {
            product.setIsActive(productDetails.getIsActive());
        }
        
        return productRepository.save(product);
    }
    
    /**
     * 商品を削除
     */
    public void deleteProduct(Long id) {
        log.info("Deleting product with id: {}", id);
        Product product = getProductById(id);
        productRepository.delete(product);
    }
    
    /**
     * 商品を検索
     */
    @Transactional(readOnly = true)
    public List<Product> searchProducts(String query) {
        log.info("Searching products with query: {}", query);
        return productRepository.findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(query, query);
    }
    
    /**
     * カテゴリ別商品一覧を取得
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(Long categoryId) {
        log.info("Getting products for category: {}", categoryId);
        return productRepository.findByCategoryId(categoryId);
    }
    
    /**
     * アクティブな商品一覧を取得
     */
    @Transactional(readOnly = true)
    public List<Product> getActiveProducts() {
        log.info("Getting active products");
        return productRepository.findByIsActiveTrue();
    }
    
    /**
     * 在庫不足の商品一覧を取得
     */
    @Transactional(readOnly = true)
    public List<Product> getLowStockProducts() {
        log.info("Getting low stock products");
        return productRepository.findLowStockProducts();
    }
    
    /**
     * 全カテゴリを取得
     */
    @Transactional(readOnly = true)
    public List<ProductCategory> getAllCategories() {
        log.info("Getting all categories");
        return categoryRepository.findAll();
    }
    
    /**
     * カテゴリを登録
     */
    public ProductCategory createCategory(ProductCategory category) {
        log.info("Creating new category: {}", category.getName());
        
        // 親カテゴリの存在チェック
        if (category.getParent() != null && category.getParent().getId() != null) {
            ProductCategory parent = categoryRepository.findById(category.getParent().getId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found with id: " + category.getParent().getId()));
            category.setParent(parent);
        }
        
        return categoryRepository.save(category);
    }
} 