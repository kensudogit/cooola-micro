package com.cooola.micro.services.inventory.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * データベース設定
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.cooola.micro.services.inventory.repository")
@EnableTransactionManagement
public class DatabaseConfig {
    // デフォルトの設定を使用
}
