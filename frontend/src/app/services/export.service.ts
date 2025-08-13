import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  reportType: string;
  startDate?: Date;
  endDate?: Date;
  warehouseId?: number;
  filename?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  /**
   * CSVファイルとしてダウンロード
   */
  downloadCsv(data: any[], options: ExportOptions): void {
    const csvContent = this.convertToCsv(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = options.filename || `${options.reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, filename);
  }

  /**
   * データをCSV形式に変換
   */
  private convertToCsv(data: any[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    // ヘッダー行を取得
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // ヘッダー行を追加
    csvRows.push(headers.join(','));

    // データ行を追加
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // カンマや改行が含まれる場合はダブルクォートで囲む
        if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  /**
   * HTML要素を印刷
   */
  printElement(element: HTMLElement, options?: { title?: string }): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('印刷ウィンドウを開けませんでした');
      return;
    }

    // 印刷用のHTMLを作成
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${options?.title || '印刷レポート'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 30px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${options?.title || '在庫レポート'}</h1>
            <p>生成日時: ${new Date().toLocaleString('ja-JP')}</p>
          </div>
          
          ${element.outerHTML}
          
          <div class="footer">
            <p>COOOLa Micro 倉庫管理システム</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // 印刷ダイアログを表示
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }

  /**
   * HTML要素をPDFとしてダウンロード
   */
  async downloadPdf(element: HTMLElement, options: ExportOptions): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4幅
      const pageHeight = 295; // A4高さ
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // 最初のページを追加
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 複数ページが必要な場合
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = options.filename || `${options.reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('PDF生成エラー:', error);
      alert('PDFの生成に失敗しました');
    }
  }

  /**
   * 在庫データの印刷用テーブルを生成
   */
  generateInventoryPrintTable(data: any[]): string {
    if (!data || data.length === 0) {
      return '<p>印刷するデータがありません</p>';
    }

    let tableHtml = '<table>';
    
    // ヘッダー行
    tableHtml += '<thead><tr>';
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
      tableHtml += `<th>${this.formatHeader(header)}</th>`;
    });
    tableHtml += '</tr></thead>';
    
    // データ行
    tableHtml += '<tbody>';
    data.forEach(row => {
      tableHtml += '<tr>';
      headers.forEach(header => {
        tableHtml += `<td>${row[header] || ''}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody>';
    
    tableHtml += '</table>';
    
    return tableHtml;
  }

  /**
   * ヘッダー名を日本語に変換
   */
  private formatHeader(header: string): string {
    const headerMap: { [key: string]: string } = {
      'id': 'ID',
      'productName': '商品名',
      'category': 'カテゴリ',
      'quantity': '在庫数',
      'unitPrice': '単価',
      'warehouse': '倉庫',
      'lastUpdated': '最終更新日',
      'transactionId': '取引ID',
      'type': '取引タイプ',
      'date': '取引日',
      'currentStock': '現在在庫数',
      'minStock': '最小在庫数',
      'status': 'ステータス'
    };
    
    return headerMap[header] || header;
  }
}
