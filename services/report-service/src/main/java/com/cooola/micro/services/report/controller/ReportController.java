package com.cooola.micro.services.report.controller;

import com.cooola.micro.services.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

/**
 * レポート管理 REST API コントローラー
 */
@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    
    private final ReportService reportService;
    
    /**
     * 在庫サマリーレポート
     */
    @GetMapping("/inventory/summary")
    public ResponseEntity<Map<String, Object>> getInventorySummary() {
        log.info("Getting inventory summary report");
        return ResponseEntity.ok(reportService.generateInventorySummary());
    }
    
    /**
     * 在庫詳細レポート
     */
    @GetMapping("/inventory/detail")
    public ResponseEntity<Map<String, Object>> getInventoryDetail(
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) Long categoryId) {
        log.info("Getting inventory detail report - warehouseId: {}, categoryId: {}", warehouseId, categoryId);
        return ResponseEntity.ok(reportService.generateInventoryDetail(warehouseId, categoryId));
    }
    
    /**
     * 入出庫レポート
     */
    @GetMapping("/transactions")
    public ResponseEntity<Map<String, Object>> getTransactionReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) String transactionType) {
        log.info("Getting transaction report - startDate: {}, endDate: {}, warehouseId: {}, type: {}", 
                startDate, endDate, warehouseId, transactionType);
        return ResponseEntity.ok(reportService.generateTransactionReport(startDate, endDate, warehouseId, transactionType));
    }
    
    /**
     * 在庫移動レポート
     */
    @GetMapping("/movements")
    public ResponseEntity<Map<String, Object>> getMovementReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Getting movement report - startDate: {}, endDate: {}", startDate, endDate);
        return ResponseEntity.ok(reportService.generateMovementReport(startDate, endDate));
    }
    
    /**
     * 棚卸しレポート
     */
    @GetMapping("/stocktakes")
    public ResponseEntity<Map<String, Object>> getStocktakeReport(
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) String status) {
        log.info("Getting stocktake report - warehouseId: {}, status: {}", warehouseId, status);
        return ResponseEntity.ok(reportService.generateStocktakeReport(warehouseId, status));
    }
    
    /**
     * 在庫不足アラートレポート
     */
    @GetMapping("/alerts/low-stock")
    public ResponseEntity<Map<String, Object>> getLowStockAlertReport() {
        log.info("Getting low stock alert report");
        return ResponseEntity.ok(reportService.generateLowStockAlertReport());
    }
    
    /**
     * 在庫過多レポート
     */
    @GetMapping("/alerts/overstock")
    public ResponseEntity<Map<String, Object>> getOverstockReport() {
        log.info("Getting overstock report");
        return ResponseEntity.ok(reportService.generateOverstockReport());
    }
    
    /**
     * 商品パフォーマンスレポート
     */
    @GetMapping("/products/performance")
    public ResponseEntity<Map<String, Object>> getProductPerformanceReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Getting product performance report - startDate: {}, endDate: {}", startDate, endDate);
        return ResponseEntity.ok(reportService.generateProductPerformanceReport(startDate, endDate));
    }
    
    /**
     * 倉庫パフォーマンスレポート
     */
    @GetMapping("/warehouses/performance")
    public ResponseEntity<Map<String, Object>> getWarehousePerformanceReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Getting warehouse performance report - startDate: {}, endDate: {}", startDate, endDate);
        return ResponseEntity.ok(reportService.generateWarehousePerformanceReport(startDate, endDate));
    }
    
    /**
     * CSVレポートダウンロード
     */
    @GetMapping("/download/{reportType}/csv")
    public ResponseEntity<byte[]> downloadCsvReport(
            @PathVariable String reportType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long warehouseId) {
        log.info("Downloading CSV report - type: {}, startDate: {}, endDate: {}, warehouseId: {}", 
                reportType, startDate, endDate, warehouseId);
        
        try {
            byte[] reportData = reportService.generateCsvReport(reportType, startDate, endDate, warehouseId);
            String filename = String.format("%s_report_%s.csv", reportType, LocalDate.now());
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + filename)
                    .header("Content-Type", "text/csv; charset=UTF-8")
                    .body(reportData);
        } catch (Exception e) {
            log.error("Failed to generate CSV report", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * レポートをExcel形式でダウンロード
     */
    @GetMapping("/download/{reportType}")
    public ResponseEntity<byte[]> downloadReport(
            @PathVariable String reportType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long warehouseId) {
        log.info("Downloading report - type: {}, startDate: {}, endDate: {}, warehouseId: {}", 
                reportType, startDate, endDate, warehouseId);
        
        byte[] reportData = reportService.generateExcelReport(reportType, startDate, endDate, warehouseId);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + reportType + "_report.xlsx")
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .body(reportData);
    }
    
    /**
     * レポートをPDF形式でダウンロード
     */
    @GetMapping("/download/{reportType}/pdf")
    public ResponseEntity<byte[]> downloadPdfReport(
            @PathVariable String reportType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long warehouseId) {
        log.info("Downloading PDF report - type: {}, startDate: {}, endDate: {}, warehouseId: {}", 
                reportType, startDate, endDate, warehouseId);
        
        byte[] reportData = reportService.generatePdfReport(reportType, startDate, endDate, warehouseId);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + reportType + "_report.pdf")
                .header("Content-Type", "application/pdf")
                .body(reportData);
    }
} 