package com.cooola.micro.core.plugin;

import com.cooola.micro.core.api.*;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

/**
 * プラグインコンテキストのデフォルト実装
 */
@Slf4j
public class DefaultPluginContext implements PluginContext {
    
    private final PluginManager pluginManager;
    private final String pluginName;
    private final Map<String, String> configuration = new HashMap<>();
    
    public DefaultPluginContext(PluginManager pluginManager, String pluginName) {
        this.pluginManager = pluginManager;
        this.pluginName = pluginName;
    }
    
    @Override
    public String getConfiguration(String key) {
        String value = configuration.get(key);
        if (value == null) {
            value = pluginManager.getConfiguration(key);
        }
        return value;
    }
    
    @Override
    public String getConfiguration(String key, String defaultValue) {
        String value = getConfiguration(key);
        return value != null ? value : defaultValue;
    }
    
    @Override
    public void setConfiguration(String key, String value) {
        configuration.put(key, value);
        pluginManager.setConfiguration(key, value);
    }
    
    @Override
    public Map<String, String> getAllConfiguration() {
        return new HashMap<>(configuration);
    }
    
    @Override
    public void publishEvent(String eventType, Object data) {
        pluginManager.publishEvent(eventType, data);
    }
    
    @Override
    public void addEventListener(String eventType, EventListener listener) {
        pluginManager.addEventListener(eventType, listener);
    }
    
    @Override
    public void removeEventListener(String eventType, EventListener listener) {
        pluginManager.removeEventListener(eventType, listener);
    }
    
    @Override
    public void log(String level, String message) {
        switch (level.toLowerCase()) {
            case "debug":
                log.debug("[{}] {}", pluginName, message);
                break;
            case "info":
                log.info("[{}] {}", pluginName, message);
                break;
            case "warn":
                log.warn("[{}] {}", pluginName, message);
                break;
            case "error":
                log.error("[{}] {}", pluginName, message);
                break;
            default:
                log.info("[{}] {}", pluginName, message);
        }
    }
    
    @Override
    public CooolaPlugin resolveDependency(String pluginName) {
        return pluginManager.resolveDependency(pluginName);
    }
}

