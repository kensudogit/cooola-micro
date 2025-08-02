package com.cooola.micro.services.notification.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * 通知エンティティ
 */
@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "通知タイプは必須です")
    @Column(nullable = false, length = 50)
    private String type;
    
    @NotBlank(message = "タイトルは必須です")
    @Column(nullable = false, length = 200)
    private String title;
    
    @NotBlank(message = "メッセージは必須です")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Column(length = 100)
    private String recipient;
    
    @Column(name = "is_read")
    private Boolean isRead = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    @Column(length = 50)
    private String priority = "NORMAL"; // LOW, NORMAL, HIGH, URGENT
    
    @Column(length = 100)
    private String category; // INVENTORY, TRANSACTION, SYSTEM, ALERT
    
    @Column(columnDefinition = "TEXT")
    private String metadata; // JSON形式の追加データ
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    /**
     * 通知を既読にする
     */
    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }
    
    /**
     * 通知を未読にする
     */
    public void markAsUnread() {
        this.isRead = false;
        this.readAt = null;
    }
    
    /**
     * 緊急度を設定
     */
    public void setPriority(String priority) {
        if (priority != null && (priority.equals("LOW") || priority.equals("NORMAL") || 
                                priority.equals("HIGH") || priority.equals("URGENT"))) {
            this.priority = priority;
        }
    }
    
    /**
     * 緊急度が高いかどうかチェック
     */
    public boolean isHighPriority() {
        return "HIGH".equals(this.priority) || "URGENT".equals(this.priority);
    }
    
    /**
     * 緊急度が緊急かどうかチェック
     */
    public boolean isUrgent() {
        return "URGENT".equals(this.priority);
    }
} 