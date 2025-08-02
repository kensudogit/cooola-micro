package com.cooola.micro.core.api;

import java.util.Map;

/**
 * プラグインコンテキスト
 * プラグインがコアシステムとやり取りするためのインターフェース
 */
public interface PluginContext {
    
    /**
     * 設定値を取得
     * @param key 設定キー
     * @return 設定値
     */
    String getConfiguration(String key);
    
    /**
     * 設定値を取得（デフォルト値付き）
     * @param key 設定キー
     * @param defaultValue デフォルト値
     * @return 設定値
     */
    String getConfiguration(String key, String defaultValue);
    
    /**
     * 設定値を設定
     * @param key 設定キー
     * @param value 設定値
     */
    void setConfiguration(String key, String value);
    
    /**
     * 全設定を取得
     * @return 設定マップ
     */
    Map<String, String> getAllConfiguration();
    
    /**
     * イベントを発行
     * @param eventType イベントタイプ
     * @param data イベントデータ
     */
    void publishEvent(String eventType, Object data);
    
    /**
     * イベントリスナーを登録
     * @param eventType イベントタイプ
     * @param listener イベントリスナー
     */
    void addEventListener(String eventType, EventListener listener);
    
    /**
     * イベントリスナーを削除
     * @param eventType イベントタイプ
     * @param listener イベントリスナー
     */
    void removeEventListener(String eventType, EventListener listener);
    
    /**
     * ログを出力
     * @param level ログレベル
     * @param message ログメッセージ
     */
    void log(String level, String message);
    
    /**
     * プラグインの依存関係を解決
     * @param pluginName プラグイン名
     * @return プラグインインスタンス
     */
    CooolaPlugin resolveDependency(String pluginName);
} 