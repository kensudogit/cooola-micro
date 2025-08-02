package com.cooola.micro.core.api;

/**
 * イベントリスナーインターフェース
 */
@FunctionalInterface
public interface EventListener {
    
    /**
     * イベントが発生した時の処理
     * @param eventType イベントタイプ
     * @param data イベントデータ
     */
    void onEvent(String eventType, Object data);
} 