import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReportDownloadOptions {
  reportType: string;
  startDate?: Date;
  endDate?: Date;
  warehouseId?: number;
  format?: 'csv' | 'excel' | 'pdf';
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * レポートデータ取得
   */
  getInventorySummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reports/inventory/summary`);
  }

  getInventoryDetail(warehouseId?: number, categoryId?: number): Observable<any> {
    let params = new HttpParams();
    if (warehouseId) params = params.set('warehouseId', warehouseId.toString());
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    
    return this.http.get(`${this.baseUrl}/reports/inventory/detail`, { params });
  }

  getTransactionReport(startDate: Date, endDate: Date, warehouseId?: number, transactionType?: string): Observable<any> {
    let params = new HttpParams()
      .set('startDate', startDate.toISOString().split('T')[0])
      .set('endDate', endDate.toISOString().split('T')[0]);
    
    if (warehouseId) params = params.set('warehouseId', warehouseId.toString());
    if (transactionType) params = params.set('transactionType', transactionType);
    
    return this.http.get(`${this.baseUrl}/reports/transactions`, { params });
  }

  getLowStockAlertReport(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reports/alerts/low-stock`);
  }

  /**
   * CSVレポートダウンロード
   */
  downloadCsvReport(options: ReportDownloadOptions): Observable<Blob> {
    let params = new HttpParams();
    
    if (options.startDate) {
      params = params.set('startDate', options.startDate.toISOString().split('T')[0]);
    }
    if (options.endDate) {
      params = params.set('endDate', options.endDate.toISOString().split('T')[0]);
    }
    if (options.warehouseId) {
      params = params.set('warehouseId', options.warehouseId.toString());
    }

    return this.http.get(`${this.baseUrl}/reports/download/${options.reportType}/csv`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Excelレポートダウンロード
   */
  downloadExcelReport(options: ReportDownloadOptions): Observable<Blob> {
    let params = new HttpParams();
    
    if (options.startDate) {
      params = params.set('startDate', options.startDate.toISOString().split('T')[0]);
    }
    if (options.endDate) {
      params = params.set('endDate', options.endDate.toISOString().split('T')[0]);
    }
    if (options.warehouseId) {
      params = params.set('warehouseId', options.warehouseId.toString());
    }

    return this.http.get(`${this.baseUrl}/reports/download/${options.reportType}`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * PDFレポートダウンロード
   */
  downloadPdfReport(options: ReportDownloadOptions): Observable<Blob> {
    let params = new HttpParams();
    
    if (options.startDate) {
      params = params.set('startDate', options.startDate.toISOString().split('T')[0]);
    }
    if (options.endDate) {
      params = params.set('endDate', options.endDate.toISOString().split('T')[0]);
    }
    if (options.warehouseId) {
      params = params.set('warehouseId', options.warehouseId.toString());
    }

    return this.http.get(`${this.baseUrl}/reports/download/${options.reportType}/pdf`, {
      params,
      responseType: 'blob'
    });
  }
}
