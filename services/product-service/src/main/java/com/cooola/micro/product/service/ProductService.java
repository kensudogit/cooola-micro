package com.cooola.micro.product.service;

import com.cooola.micro.product.entity.Product;
import com.cooola.micro.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        log.info("全商品を取得します");
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(Long id) {
        log.info("商品ID: {} の商品を取得します", id);
        return productRepository.findById(id);
    }
    
    public Optional<Product> getProductByCode(String code) {
        log.info("商品コード: {} の商品を取得します", code);
        return productRepository.findByCode(code);
    }
    
    public List<Product> getProductsByCategory(String category) {
        log.info("カテゴリ: {} の商品を取得します", category);
        return productRepository.findByCategory(category);
    }
    
    public List<Product> searchProducts(String keyword) {
        log.info("キーワード: {} で商品を検索します", keyword);
        return productRepository.searchProducts(keyword);
    }
    
    public List<Product> getLowStockProducts() {
        log.info("在庫不足商品を取得します");
        return productRepository.findLowStockProducts();
    }
    
    public Product createProduct(Product product) {
        log.info("新規商品を作成します: {}", product.getCode());
        
        if (productRepository.existsByCode(product.getCode())) {
            throw new RuntimeException("商品コードが既に存在します: " + product.getCode());
        }
        
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long id, Product productDetails) {
        log.info("商品ID: {} の商品を更新します", id);
        
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("商品が見つかりません: " + id));
        
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setCategory(productDetails.getCategory());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setMinStockLevel(productDetails.getMinStockLevel());
        product.setMaxStockLevel(productDetails.getMaxStockLevel());
        product.setStatus(productDetails.getStatus());
        
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        log.info("商品ID: {} の商品を削除します", id);
        
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("商品が見つかりません: " + id);
        }
        
        productRepository.deleteById(id);
    }
    
    public Product updateStockQuantity(Long id, Integer newQuantity) {
        log.info("商品ID: {} の在庫数を {} に更新します", id, newQuantity);
        
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("商品が見つかりません: " + id));
        
        product.setStockQuantity(newQuantity);
        return productRepository.save(product);
    }
} 