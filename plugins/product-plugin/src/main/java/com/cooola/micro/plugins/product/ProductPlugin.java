package com.cooola.micro.plugins.product;

import com.cooola.micro.core.api.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * 商品管理プラグイン
 * 商品のCRUD操作を提供するプラグイン
 */
@Slf4j
@Component
public class ProductPlugin implements CooolaPlugin {
    
    private PluginContext context;
    private PluginStatus status = PluginStatus.UNINITIALIZED;
    private final Map<String, Object> configuration = new HashMap<>();
    
    @Autowired
    private ProductService productService;
    
    @Override
    public String getName() {
        return "product-management";
    }
    
    @Override
    public String getVersion() {
        return "1.0.0";
    }
    
    @Override
    public void initialize(PluginContext context) {
        this.context = context;
        log.info("Product plugin initializing...");
        
        // プラグイン固有の設定を読み込み
        configuration.put("maxProducts", context.getConfiguration("product.max.count", "1000"));
        configuration.put("enableBarcode", context.getConfiguration("product.barcode.enabled", "true"));
        
        // イベントリスナーを登録
        context.addEventListener("product.created", this::onProductCreated);
        context.addEventListener("product.updated", this::onProductUpdated);
        context.addEventListener("product.deleted", this::onProductDeleted);
        
        status = PluginStatus.INITIALIZED;
        log.info("Product plugin initialized successfully");
    }
    
    @Override
    public void start() {
        log.info("Product plugin starting...");
        status = PluginStatus.STARTING;
        
        try {
            // 商品サービスの初期化
            productService.initialize();
            
            status = PluginStatus.RUNNING;
            log.info("Product plugin started successfully");
            
            // プラグイン開始イベントを発行
            context.publishEvent("plugin.started", Map.of("plugin", getName()));
            
        } catch (Exception e) {
            status = PluginStatus.ERROR;
            log.error("Failed to start product plugin", e);
            throw new RuntimeException("Product plugin start failed", e);
        }
    }
    
    @Override
    public void stop() {
        log.info("Product plugin stopping...");
        status = PluginStatus.STOPPING;
        
        try {
            // 商品サービスのクリーンアップ
            productService.cleanup();
            
            status = PluginStatus.STOPPED;
            log.info("Product plugin stopped successfully");
            
            // プラグイン停止イベントを発行
            context.publishEvent("plugin.stopped", Map.of("plugin", getName()));
            
        } catch (Exception e) {
            status = PluginStatus.ERROR;
            log.error("Failed to stop product plugin", e);
            throw new RuntimeException("Product plugin stop failed", e);
        }
    }
    
    @Override
    public PluginMetadata getMetadata() {
        PluginMetadata metadata = new PluginMetadata();
        metadata.setName(getName());
        metadata.setVersion(getVersion());
        metadata.setDescription("商品管理機能を提供するプラグイン");
        metadata.setAuthor("COOOLa Team");
        metadata.setVendor("COOOLa");
        return metadata;
    }
    
    @Override
    public PluginStatus getStatus() {
        return status;
    }
    
    @Override
    public Map<String, Object> getConfiguration() {
        return new HashMap<>(configuration);
    }
    
    /**
     * 商品作成イベントハンドラー
     */
    private void onProductCreated(String eventType, Object data) {
        log.info("Product created event received: {}", data);
        // 商品作成時の処理（例：在庫管理プラグインへの通知など）
    }
    
    /**
     * 商品更新イベントハンドラー
     */
    private void onProductUpdated(String eventType, Object data) {
        log.info("Product updated event received: {}", data);
        // 商品更新時の処理
    }
    
    /**
     * 商品削除イベントハンドラー
     */
    private void onProductDeleted(String eventType, Object data) {
        log.info("Product deleted event received: {}", data);
        // 商品削除時の処理
    }
    
    /**
     * 商品サービスを取得
     */
    public ProductService getProductService() {
        return productService;
    }
} 