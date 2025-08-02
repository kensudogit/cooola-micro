package com.cooola.micro.core.api;

import java.util.Map;

/**
 * COOOLa プラグインの基本インターフェース
 * すべてのプラグインはこのインターフェースを実装する必要があります
 */
public interface CooolaPlugin {
    
    /**
     * プラグイン名を取得
     * @return プラグイン名
     */
    String getName();
    
    /**
     * プラグインバージョンを取得
     * @return バージョン文字列
     */
    String getVersion();
    
    /**
     * プラグインの初期化
     * @param context プラグインコンテキスト
     */
    void initialize(PluginContext context);
    
    /**
     * プラグインの開始
     */
    void start();
    
    /**
     * プラグインの停止
     */
    void stop();
    
    /**
     * プラグインのメタデータを取得
     * @return プラグインメタデータ
     */
    PluginMetadata getMetadata();
    
    /**
     * プラグインの状態を取得
     * @return プラグイン状態
     */
    PluginStatus getStatus();
    
    /**
     * プラグインの設定を取得
     * @return 設定マップ
     */
    Map<String, Object> getConfiguration();
} 