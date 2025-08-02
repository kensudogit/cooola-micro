package com.cooola.micro.services.product.repository;

import com.cooola.micro.services.product.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 商品カテゴリリポジトリ
 */
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    
    /**
     * カテゴリ名で検索
     */
    Optional<ProductCategory> findByName(String name);
    
    /**
     * 親カテゴリがnullのカテゴリ（トップレベルカテゴリ）を取得
     */
    List<ProductCategory> findByParentIsNull();
    
    /**
     * 親カテゴリIDで子カテゴリを取得
     */
    List<ProductCategory> findByParentId(Long parentId);
    
    /**
     * アクティブなカテゴリを取得
     */
    List<ProductCategory> findByIsActiveTrue();
    
    /**
     * カテゴリ名の存在チェック
     */
    boolean existsByName(String name);
} 