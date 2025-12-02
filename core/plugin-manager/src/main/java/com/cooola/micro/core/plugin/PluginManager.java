package com.cooola.micro.core.plugin;

import com.cooola.micro.core.api.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * プラグイン管理クラス
 * プラグインの登録、読み込み、管理を担当
 */
@Slf4j
@Component
public class PluginManager {
    
    private final Map<String, CooolaPlugin> plugins = new ConcurrentHashMap<>();
    private final Map<String, PluginStatus> pluginStatuses = new ConcurrentHashMap<>();
    private final Map<String, List<com.cooola.micro.core.api.EventListener>> eventListeners = new ConcurrentHashMap<>();
    private final Map<String, String> configuration = new ConcurrentHashMap<>();
    
    /**
     * プラグインを登録
     * @param plugin プラグインインスタンス
     */
    public void registerPlugin(CooolaPlugin plugin) {
        String name = plugin.getName();
        plugins.put(name, plugin);
        pluginStatuses.put(name, PluginStatus.UNINITIALIZED);
        log.info("Plugin registered: {}", name);
    }
    
    /**
     * プラグインを初期化
     * @param pluginName プラグイン名
     */
    public void initializePlugin(String pluginName) {
        CooolaPlugin plugin = plugins.get(pluginName);
        if (plugin == null) {
            throw new IllegalArgumentException("Plugin not found: " + pluginName);
        }
        
        try {
            PluginContext context = new DefaultPluginContext(this, pluginName);
            plugin.initialize(context);
            pluginStatuses.put(pluginName, PluginStatus.INITIALIZED);
            log.info("Plugin initialized: {}", pluginName);
        } catch (Exception e) {
            pluginStatuses.put(pluginName, PluginStatus.ERROR);
            log.error("Failed to initialize plugin: {}", pluginName, e);
            throw new RuntimeException("Plugin initialization failed", e);
        }
    }
    
    /**
     * プラグインを開始
     * @param pluginName プラグイン名
     */
    public void startPlugin(String pluginName) {
        CooolaPlugin plugin = plugins.get(pluginName);
        if (plugin == null) {
            throw new IllegalArgumentException("Plugin not found: " + pluginName);
        }
        
        PluginStatus status = pluginStatuses.get(pluginName);
        if (status != PluginStatus.INITIALIZED && status != PluginStatus.STOPPED) {
            throw new IllegalStateException("Plugin is not in correct state: " + status);
        }
        
        try {
            pluginStatuses.put(pluginName, PluginStatus.STARTING);
            plugin.start();
            pluginStatuses.put(pluginName, PluginStatus.RUNNING);
            log.info("Plugin started: {}", pluginName);
        } catch (Exception e) {
            pluginStatuses.put(pluginName, PluginStatus.ERROR);
            log.error("Failed to start plugin: {}", pluginName, e);
            throw new RuntimeException("Plugin start failed", e);
        }
    }
    
    /**
     * プラグインを停止
     * @param pluginName プラグイン名
     */
    public void stopPlugin(String pluginName) {
        CooolaPlugin plugin = plugins.get(pluginName);
        if (plugin == null) {
            throw new IllegalArgumentException("Plugin not found: " + pluginName);
        }
        
        try {
            pluginStatuses.put(pluginName, PluginStatus.STOPPING);
            plugin.stop();
            pluginStatuses.put(pluginName, PluginStatus.STOPPED);
            log.info("Plugin stopped: {}", pluginName);
        } catch (Exception e) {
            pluginStatuses.put(pluginName, PluginStatus.ERROR);
            log.error("Failed to stop plugin: {}", pluginName, e);
            throw new RuntimeException("Plugin stop failed", e);
        }
    }
    
    /**
     * プラグインを削除
     * @param pluginName プラグイン名
     */
    public void unregisterPlugin(String pluginName) {
        CooolaPlugin plugin = plugins.remove(pluginName);
        if (plugin != null) {
            pluginStatuses.remove(pluginName);
            log.info("Plugin unregistered: {}", pluginName);
        }
    }
    
    /**
     * プラグイン一覧を取得
     * @return プラグイン一覧
     */
    public List<CooolaPlugin> getAllPlugins() {
        return new ArrayList<>(plugins.values());
    }
    
    /**
     * プラグインの状態を取得
     * @param pluginName プラグイン名
     * @return プラグイン状態
     */
    public PluginStatus getPluginStatus(String pluginName) {
        return pluginStatuses.getOrDefault(pluginName, PluginStatus.UNINITIALIZED);
    }
    
    /**
     * 実行中のプラグイン一覧を取得
     * @return 実行中プラグイン一覧
     */
    public List<CooolaPlugin> getRunningPlugins() {
        return plugins.values().stream()
                .filter(plugin -> PluginStatus.RUNNING.equals(pluginStatuses.get(plugin.getName())))
                .toList();
    }
    
    /**
     * イベントを発行
     * @param eventType イベントタイプ
     * @param data イベントデータ
     */
    public void publishEvent(String eventType, Object data) {
        List<com.cooola.micro.core.api.EventListener> listeners = eventListeners.get(eventType);
        if (listeners != null) {
            listeners.forEach(listener -> {
                try {
                    listener.onEvent(eventType, data);
                } catch (Exception e) {
                    log.error("Error in event listener for event: {}", eventType, e);
                }
            });
        }
    }
    
    /**
     * イベントリスナーを追加
     * @param eventType イベントタイプ
     * @param listener イベントリスナー
     */
    public void addEventListener(String eventType, com.cooola.micro.core.api.EventListener listener) {
        eventListeners.computeIfAbsent(eventType, k -> new ArrayList<>()).add(listener);
    }
    
    /**
     * イベントリスナーを削除
     * @param eventType イベントタイプ
     * @param listener イベントリスナー
     */
    public void removeEventListener(String eventType, com.cooola.micro.core.api.EventListener listener) {
        List<com.cooola.micro.core.api.EventListener> listeners = eventListeners.get(eventType);
        if (listeners != null) {
            listeners.remove(listener);
        }
    }
    
    /**
     * 設定値を取得
     * @param key 設定キー
     * @return 設定値
     */
    public String getConfiguration(String key) {
        return configuration.get(key);
    }
    
    /**
     * 設定値を設定
     * @param key 設定キー
     * @param value 設定値
     */
    public void setConfiguration(String key, String value) {
        configuration.put(key, value);
    }
    
    /**
     * プラグインの依存関係を解決
     * @param pluginName プラグイン名
     * @return プラグインインスタンス
     */
    public CooolaPlugin resolveDependency(String pluginName) {
        return plugins.get(pluginName);
    }
} 