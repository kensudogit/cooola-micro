package com.cooola.micro.core.api;

/**
 * プラグインの状態を表す列挙型
 */
public enum PluginStatus {
    /**
     * 未初期化
     */
    UNINITIALIZED,
    
    /**
     * 初期化済み
     */
    INITIALIZED,
    
    /**
     * 開始中
     */
    STARTING,
    
    /**
     * 実行中
     */
    RUNNING,
    
    /**
     * 停止中
     */
    STOPPING,
    
    /**
     * 停止済み
     */
    STOPPED,
    
    /**
     * エラー状態
     */
    ERROR,
    
    /**
     * 無効化
     */
    DISABLED
} 