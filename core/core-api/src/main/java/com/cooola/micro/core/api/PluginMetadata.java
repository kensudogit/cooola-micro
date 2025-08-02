package com.cooola.micro.core.api;

import java.util.List;
import java.util.Map;

/**
 * プラグインのメタデータ
 */
public class PluginMetadata {
    private String name;
    private String version;
    private String description;
    private String author;
    private String vendor;
    private List<String> dependencies;
    private Map<String, String> properties;
    
    public PluginMetadata() {}
    
    public PluginMetadata(String name, String version, String description) {
        this.name = name;
        this.version = version;
        this.description = description;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public String getVendor() { return vendor; }
    public void setVendor(String vendor) { this.vendor = vendor; }
    
    public List<String> getDependencies() { return dependencies; }
    public void setDependencies(List<String> dependencies) { this.dependencies = dependencies; }
    
    public Map<String, String> getProperties() { return properties; }
    public void setProperties(Map<String, String> properties) { this.properties = properties; }
} 