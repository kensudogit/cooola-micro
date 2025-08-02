package com.cooola.micro.product.controller;

import com.cooola.micro.product.entity.Product;
import com.cooola.micro.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        log.info("全商品取得APIが呼び出されました");
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        log.info("商品取得APIが呼び出されました - ID: {}", id);
        return productService.getProductById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<Product> getProductByCode(@PathVariable String code) {
        log.info("商品取得APIが呼び出されました - コード: {}", code);
        return productService.getProductByCode(code)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        log.info("カテゴリ別商品取得APIが呼び出されました - カテゴリ: {}", category);
        List<Product> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        log.info("商品検索APIが呼び出されました - キーワード: {}", keyword);
        List<Product> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        log.info("在庫不足商品取得APIが呼び出されました");
        List<Product> products = productService.getLowStockProducts();
        return ResponseEntity.ok(products);
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        log.info("商品作成APIが呼び出されました");
        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.ok(createdProduct);
        } catch (RuntimeException e) {
            log.error("商品作成エラー: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        log.info("商品更新APIが呼び出されました - ID: {}", id);
        try {
            Product updatedProduct = productService.updateProduct(id, productDetails);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            log.error("商品更新エラー: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        log.info("商品削除APIが呼び出されました - ID: {}", id);
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.error("商品削除エラー: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Product> updateStockQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        log.info("在庫数更新APIが呼び出されました - ID: {}, 数量: {}", id, quantity);
        try {
            Product updatedProduct = productService.updateStockQuantity(id, quantity);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            log.error("在庫数更新エラー: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        log.info("ヘルスチェックAPIが呼び出されました");
        return ResponseEntity.ok("Product Service is running");
    }
} 