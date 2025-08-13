package com.cooola.micro.services.report.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * レポート生成サービス
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    /**
     * 在庫サマリーレポート生成
     */
    public Map<String, Object> generateInventorySummary() {
        Map<String, Object> report = new HashMap<>();
        report.put("reportType", "inventory_summary");
        report.put("generatedAt", LocalDate.now().format(DATE_FORMATTER));
        report.put("totalProducts", 150);
        report.put("totalQuantity", 12500);
        report.put("totalValue", 25000000);
        report.put("lowStockItems", 12);
        report.put("outOfStockItems", 3);
        
        return report;
    }
    
    /**
     * 在庫詳細レポート生成
     */
    public Map<String, Object> generateInventoryDetail(Long warehouseId, Long categoryId) {
        Map<String, Object> report = new HashMap<>();
        report.put("reportType", "inventory_detail");
        report.put("generatedAt", LocalDate.now().format(DATE_FORMATTER));
        report.put("warehouseId", warehouseId);
        report.put("categoryId", categoryId);
        
        // サンプルデータ
        List<Map<String, Object>> items = Arrays.asList(
            createInventoryItem("商品A", "CAT001", 100, 15000, "倉庫A"),
            createInventoryItem("商品B", "CAT002", 75, 12000, "倉庫A"),
            createInventoryItem("商品C", "CAT001", 200, 8000, "倉庫B")
        );
        report.put("items", items);
        
        return report;
    }
    
    /**
     * 入出庫レポート生成
     */
    public Map<String, Object> generateTransactionReport(LocalDate startDate, LocalDate endDate, Long warehouseId, String transactionType) {
        Map<String, Object> report = new HashMap<>();
        report.put("reportType", "transaction_report");
        report.put("startDate", startDate.format(DATE_FORMATTER));
        report.put("endDate", endDate.format(DATE_FORMATTER));
        report.put("warehouseId", warehouseId);
        report.put("transactionType", transactionType);
        
        // サンプルデータ
        List<Map<String, Object>> transactions = Arrays.asList(
            createTransaction("IN001", "入庫", "商品A", 50, "2024-01-15"),
            createTransaction("OUT001", "出庫", "商品B", 25, "2024-01-16"),
            createTransaction("IN002", "入庫", "商品C", 100, "2024-01-17")
        );
        report.put("transactions", transactions);
        
        return report;
    }
    
    /**
     * 在庫移動レポート生成
     */
    public Map<String, Object> generateMovementReport(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
        report.put("reportType", "movement_report");
        report.put("startDate", startDate.format(DATE_FORMATTER));
        report.put("endDate", endDate.format(DATE_FORMATTER));
        
        return report;
    }
    
    /**
     * 棚卸しレポート生成
     */
    public Map<String, Object> generateStocktakeReport(Long warehouseId, String status) {
        Map<String, Object> report = new HashMap<>();
        report.put("reportType", "stocktake_report");
        report.put("warehouseId", warehouseId);
        report.put("status", status);
        
        return report;
    }
    
    /**
     * 在庫不足アラートレポート生成
     */
    public Map<String, Object> generateLowStockAlertReport() {
        Map<String, Object> report = new HashMap<>();
        report.put("reportType", "low_stock_alert");
        report.put("generatedAt", LocalDate.now().format(DATE_FORMATTER));
        
        List<Map<String, Object>> alerts = Arrays.asList(
            createAlert("商品A", 10, 50, "低在庫"),
            createAlert("商品B", 5, 30, "在庫切れ"),
            createAlert("商品C", 15, 100, "低在庫")
        );
        report.put("alerts", alerts);
        
        return report;
    }
    
    /**
     * 在庫過多レポート生成
     */
    public Map<String, Object> generateOverstockReport() {
        Map<String, Object> report = new HashMap<>();
        report.put("reportType", "overstock_report");
        report.put("generatedAt", LocalDate.now().format(DATE_FORMATTER));
        
        return report;
    }
    
    /**
     * 商品パフォーマンスレポート生成
     */
    public Map<String, Object> generateProductPerformanceReport(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
        report.put("reportType", "product_performance");
        report.put("startDate", startDate.format(DATE_FORMATTER));
        report.put("endDate", endDate.format(DATE_FORMATTER));
        
        return report;
    }
    
    /**
     * 倉庫パフォーマンスレポート生成
     */
    public Map<String, Object> generateWarehousePerformanceReport(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
        report.put("reportType", "warehouse_performance");
        report.put("startDate", startDate.format(DATE_FORMATTER));
        report.put("endDate", endDate.format(DATE_FORMATTER));
        
        return report;
    }
    
    /**
     * CSVレポート生成
     */
    public byte[] generateCsvReport(String reportType, LocalDate startDate, LocalDate endDate, Long warehouseId) throws IOException {
        Map<String, Object> reportData = getReportData(reportType, startDate, endDate, warehouseId);
        return convertToCsv(reportData);
    }
    
    /**
     * Excelレポート生成
     */
    public byte[] generateExcelReport(String reportType, LocalDate startDate, LocalDate endDate, Long warehouseId) {
        // Excel生成の実装（現在はCSVを返す）
        try {
            return generateCsvReport(reportType, startDate, endDate, warehouseId);
        } catch (IOException e) {
            log.error("Excel report generation failed", e);
            return new byte[0];
        }
    }
    
    /**
     * PDFレポート生成
     */
    public byte[] generatePdfReport(String reportType, LocalDate startDate, LocalDate endDate, Long warehouseId) {
        // PDF生成の実装（現在はCSVを返す）
        try {
            return generateCsvReport(reportType, startDate, endDate, warehouseId);
        } catch (IOException e) {
            log.error("PDF report generation failed", e);
            return new byte[0];
        }
    }
    
    /**
     * レポートデータ取得
     */
    private Map<String, Object> getReportData(String reportType, LocalDate startDate, LocalDate endDate, Long warehouseId) {
        switch (reportType) {
            case "inventory_summary":
                return generateInventorySummary();
            case "inventory_detail":
                return generateInventoryDetail(warehouseId, null);
            case "transaction_report":
                return generateTransactionReport(startDate, endDate, warehouseId, null);
            case "low_stock_alert":
                return generateLowStockAlertReport();
            default:
                return generateInventorySummary();
        }
    }
    
    /**
     * CSV変換
     */
    private byte[] convertToCsv(Map<String, Object> reportData) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
        
        // BOMを追加（Excelで文字化けを防ぐ）
        baos.write(0xEF);
        baos.write(0xBB);
        baos.write(0xBF);
        
        String reportType = (String) reportData.get("reportType");
        
        switch (reportType) {
            case "inventory_summary":
                writeInventorySummaryCsv(writer, reportData);
                break;
            case "inventory_detail":
                writeInventoryDetailCsv(writer, reportData);
                break;
            case "transaction_report":
                writeTransactionReportCsv(writer, reportData);
                break;
            case "low_stock_alert":
                writeLowStockAlertCsv(writer, reportData);
                break;
            default:
                writeInventorySummaryCsv(writer, reportData);
        }
        
        writer.close();
        return baos.toByteArray();
    }
    
    /**
     * 在庫サマリーCSV出力
     */
    private void writeInventorySummaryCsv(OutputStreamWriter writer, Map<String, Object> reportData) throws IOException {
        writer.write("レポートタイプ,生成日,総商品数,総在庫数,総価値,低在庫商品数,在庫切れ商品数\n");
        writer.write(String.format("%s,%s,%s,%s,%s,%s,%s\n",
            reportData.get("reportType"),
            reportData.get("generatedAt"),
            reportData.get("totalProducts"),
            reportData.get("totalQuantity"),
            reportData.get("totalValue"),
            reportData.get("lowStockItems"),
            reportData.get("outOfStockItems")
        ));
    }
    
    /**
     * 在庫詳細CSV出力
     */
    private void writeInventoryDetailCsv(OutputStreamWriter writer, Map<String, Object> reportData) throws IOException {
        writer.write("商品名,カテゴリ,在庫数,単価,倉庫\n");
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) reportData.get("items");
        if (items != null) {
            for (Map<String, Object> item : items) {
                writer.write(String.format("%s,%s,%s,%s,%s\n",
                    item.get("productName"),
                    item.get("category"),
                    item.get("quantity"),
                    item.get("unitPrice"),
                    item.get("warehouse")
                ));
            }
        }
    }
    
    /**
     * 取引レポートCSV出力
     */
    private void writeTransactionReportCsv(OutputStreamWriter writer, Map<String, Object> reportData) throws IOException {
        writer.write("取引ID,取引タイプ,商品名,数量,取引日\n");
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> transactions = (List<Map<String, Object>>) reportData.get("transactions");
        if (transactions != null) {
            for (Map<String, Object> transaction : transactions) {
                writer.write(String.format("%s,%s,%s,%s,%s\n",
                    transaction.get("transactionId"),
                    transaction.get("type"),
                    transaction.get("productName"),
                    transaction.get("quantity"),
                    transaction.get("date")
                ));
            }
        }
    }
    
    /**
     * 低在庫アラートCSV出力
     */
    private void writeLowStockAlertCsv(OutputStreamWriter writer, Map<String, Object> reportData) throws IOException {
        writer.write("商品名,現在在庫数,最小在庫数,ステータス\n");
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> alerts = (List<Map<String, Object>>) reportData.get("alerts");
        if (alerts != null) {
            for (Map<String, Object> alert : alerts) {
                writer.write(String.format("%s,%s,%s,%s\n",
                    alert.get("productName"),
                    alert.get("currentStock"),
                    alert.get("minStock"),
                    alert.get("status")
                ));
            }
        }
    }
    
    // ヘルパーメソッド
    private Map<String, Object> createInventoryItem(String name, String category, int quantity, int unitPrice, String warehouse) {
        Map<String, Object> item = new HashMap<>();
        item.put("productName", name);
        item.put("category", category);
        item.put("quantity", quantity);
        item.put("unitPrice", unitPrice);
        item.put("warehouse", warehouse);
        return item;
    }
    
    private Map<String, Object> createTransaction(String id, String type, String productName, int quantity, String date) {
        Map<String, Object> transaction = new HashMap<>();
        transaction.put("transactionId", id);
        transaction.put("type", type);
        transaction.put("productName", productName);
        transaction.put("quantity", quantity);
        transaction.put("date", date);
        return transaction;
    }
    
    private Map<String, Object> createAlert(String productName, int currentStock, int minStock, String status) {
        Map<String, Object> alert = new HashMap<>();
        alert.put("productName", productName);
        alert.put("currentStock", currentStock);
        alert.put("minStock", minStock);
        alert.put("status", status);
        return alert;
    }
}
