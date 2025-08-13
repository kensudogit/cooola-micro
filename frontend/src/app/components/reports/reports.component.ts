import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService, ReportDownloadOptions } from '../../services/api.service';
import { ExportService, ExportOptions } from '../../services/export.service';

interface ReportData {
  id: number;
  name: string;
  description: string;
  type: 'inventory' | 'transaction' | 'financial' | 'analytics';
  lastGenerated: Date;
  status: 'ready' | 'generating' | 'error';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  @ViewChild('reportContent', { static: false }) reportContent!: ElementRef;
  
  title = 'レポート';
  reports: ReportData[] = [];
  selectedReport: ReportData | null = null;
  showReportViewer = false;
  currentChartData: ChartData | null = null;
  currentReportData: any = null;
  isLoading = false;

  reportTypes = [
    { value: 'inventory_summary', label: '在庫サマリー', icon: 'fas fa-warehouse', color: 'primary' },
    { value: 'inventory_detail', label: '在庫詳細', icon: 'fas fa-list', color: 'success' },
    { value: 'transaction_report', label: '取引レポート', icon: 'fas fa-exchange-alt', color: 'info' },
    { value: 'low_stock_alert', label: '低在庫アラート', icon: 'fas fa-exclamation-triangle', color: 'warning' }
  ];

  exportFormats = [
    { value: 'csv', label: 'CSV', icon: 'fas fa-file-csv' },
    { value: 'excel', label: 'Excel', icon: 'fas fa-file-excel' },
    { value: 'pdf', label: 'PDF', icon: 'fas fa-file-pdf' }
  ];

  selectedFormat = 'csv';
  showExportOptions = false;

  constructor(
    private apiService: ApiService,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData() {
    this.reports = [
      {
        id: 1,
        name: '在庫状況サマリー',
        description: '現在の在庫状況を包括的に表示するレポート',
        type: 'inventory',
        lastGenerated: new Date('2024-08-13 09:00'),
        status: 'ready'
      },
      {
        id: 2,
        name: '入出庫履歴レポート',
        description: '指定期間の入出庫履歴を詳細に表示するレポート',
        type: 'transaction',
        lastGenerated: new Date('2024-08-13 08:30'),
        status: 'ready'
      },
      {
        id: 3,
        name: '在庫価値レポート',
        description: '在庫の総価値とカテゴリ別の価値分布を表示するレポート',
        type: 'financial',
        lastGenerated: new Date('2024-08-12 17:00'),
        status: 'ready'
      },
      {
        id: 4,
        name: '在庫回転率分析',
        description: '商品別の在庫回転率とABC分析を表示するレポート',
        type: 'analytics',
        lastGenerated: new Date('2024-08-12 16:00'),
        status: 'ready'
      },
      {
        id: 5,
        name: '低在庫アラートレポート',
        description: '低在庫・在庫切れ商品の一覧と対応状況を表示するレポート',
        type: 'inventory',
        lastGenerated: new Date('2024-08-13 07:00'),
        status: 'ready'
      },
      {
        id: 6,
        name: '月次取引サマリー',
        description: '月次の入出庫取引の統計と傾向を表示するレポート',
        type: 'transaction',
        lastGenerated: new Date('2024-08-01 00:00'),
        status: 'ready'
      }
    ];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ready': return 'success';
      case 'generating': return 'warning';
      case 'error': return 'danger';
      default: return 'secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ready': return '準備完了';
      case 'generating': return '生成中';
      case 'error': return 'エラー';
      default: return '不明';
    }
  }

  getTypeIcon(type: string | undefined): string {
    if (!type) return 'fas fa-file-alt';
    const reportType = this.reportTypes.find(rt => rt.value === type);
    return reportType ? reportType.icon : 'fas fa-file-alt';
  }

  getTypeColor(type: string | undefined): string {
    if (!type) return 'secondary';
    const reportType = this.reportTypes.find(rt => rt.value === type);
    return reportType ? reportType.color : 'secondary';
  }

  generateReport(report: ReportData) {
    report.status = 'generating';
    
    // シミュレーション：レポート生成に時間がかかる
    setTimeout(() => {
      report.status = 'ready';
      report.lastGenerated = new Date();
      this.viewReport(report);
    }, 2000);
  }

  viewReport(report: ReportData) {
    this.selectedReport = report;
    this.showReportViewer = true;
    this.generateChartData(report);
    this.loadReportData(report);
  }

  loadReportData(report: ReportData) {
    this.isLoading = true;
    
    switch (report.type) {
      case 'inventory':
        if (report.name.includes('サマリー')) {
          this.apiService.getInventorySummary().subscribe({
            next: (data) => {
              this.currentReportData = data;
              this.isLoading = false;
            },
            error: (error) => {
              console.error('レポートデータ取得エラー:', error);
              this.isLoading = false;
            }
          });
        } else if (report.name.includes('アラート')) {
          this.apiService.getLowStockAlertReport().subscribe({
            next: (data) => {
              this.currentReportData = data;
              this.isLoading = false;
            },
            error: (error) => {
              console.error('レポートデータ取得エラー:', error);
              this.isLoading = false;
            }
          });
        }
        break;
      case 'transaction':
        // 取引レポート用のサンプルデータ
        this.currentReportData = {
          reportType: 'transaction_report',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          transactions: [
            { transactionId: 'IN001', type: '入庫', productName: '商品A', quantity: 50, date: '2024-01-15' },
            { transactionId: 'OUT001', type: '出庫', productName: '商品B', quantity: 25, date: '2024-01-16' },
            { transactionId: 'IN002', type: '入庫', productName: '商品C', quantity: 100, date: '2024-01-17' }
          ]
        };
        this.isLoading = false;
        break;
      default:
        this.currentReportData = null;
        this.isLoading = false;
    }
  }

  generateChartData(report: ReportData) {
    switch (report.type) {
      case 'inventory':
        this.currentChartData = {
          labels: ['電子機器', '衣類', '食品', '書籍', '家具', 'スポーツ用品', 'その他'],
          datasets: [{
            label: '在庫数',
            data: [45, 23, 67, 34, 12, 18, 29],
            backgroundColor: [
              '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'
            ],
            borderColor: [
              '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'
            ],
            borderWidth: 1
          }]
        };
        break;
      case 'transaction':
        this.currentChartData = {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
          datasets: [{
            label: '入庫数',
            data: [120, 135, 98, 156, 142, 167, 189, 145],
            backgroundColor: ['rgba(28, 200, 138, 0.2)'],
            borderColor: ['#1cc88a'],
            borderWidth: 2
          }, {
            label: '出庫数',
            data: [98, 112, 87, 134, 128, 145, 167, 123],
            backgroundColor: ['rgba(231, 74, 59, 0.2)'],
            borderColor: ['#e74a3b'],
            borderWidth: 2
          }]
        };
        break;
      case 'financial':
        this.currentChartData = {
          labels: ['電子機器', '衣類', '食品', '書籍', '家具', 'スポーツ用品', 'その他'],
          datasets: [{
            label: '在庫価値 (万円)',
            data: [675, 115, 100, 51, 30, 27, 43],
            backgroundColor: [
              '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'
            ],
            borderColor: [
              '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'
            ],
            borderWidth: 1
          }]
        };
        break;
      case 'analytics':
        this.currentChartData = {
          labels: ['Aクラス (高回転)', 'Bクラス (中回転)', 'Cクラス (低回転)'],
          datasets: [{
            label: '商品数',
            data: [15, 28, 42],
            backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b'],
            borderColor: ['#1cc88a', '#f6c23e', '#e74a3b'],
            borderWidth: 1
          }]
        };
        break;
    }
  }

  closeReportViewer() {
    this.showReportViewer = false;
    this.selectedReport = null;
    this.currentChartData = null;
    this.currentReportData = null;
    this.showExportOptions = false;
  }

  exportReport(report: ReportData) {
    this.showExportOptions = true;
  }

  downloadReport(format: string) {
    if (!this.selectedReport || !this.currentReportData) {
      alert('レポートデータがありません');
      return;
    }

    const options: ExportOptions = {
      reportType: this.selectedReport.name,
      filename: `${this.selectedReport.name}_${new Date().toISOString().split('T')[0]}.${format}`
    };

    try {
      switch (format) {
        case 'csv':
          this.downloadCsvReport(options);
          break;
        case 'excel':
          this.downloadExcelReport(options);
          break;
        case 'pdf':
          this.downloadPdfReport(options);
          break;
        default:
          alert('サポートされていない形式です');
      }
    } catch (error) {
      console.error('エクスポートエラー:', error);
      alert('エクスポートに失敗しました');
    }
  }

  private downloadCsvReport(options: ExportOptions) {
    if (this.currentReportData.items) {
      this.exportService.downloadCsv(this.currentReportData.items, options);
    } else if (this.currentReportData.transactions) {
      this.exportService.downloadCsv(this.currentReportData.transactions, options);
    } else if (this.currentReportData.alerts) {
      this.exportService.downloadCsv(this.currentReportData.alerts, options);
    } else {
      // 単一データの場合
      this.exportService.downloadCsv([this.currentReportData], options);
    }
  }

  private downloadExcelReport(options: ExportOptions) {
    // Excel形式でのダウンロード（現在はCSVとして処理）
    this.downloadCsvReport(options);
  }

  private downloadPdfReport(options: ExportOptions) {
    if (this.reportContent) {
      this.exportService.downloadPdf(this.reportContent.nativeElement, options);
    }
  }

  printReport(report: ReportData) {
    if (!this.currentReportData) {
      alert('印刷するデータがありません');
      return;
    }

    // 印刷用のHTML要素を作成
    const printElement = document.createElement('div');
    printElement.innerHTML = this.exportService.generateInventoryPrintTable(
      this.currentReportData.items || 
      this.currentReportData.transactions || 
      this.currentReportData.alerts || 
      [this.currentReportData]
    );

    this.exportService.printElement(printElement, {
      title: report.name
    });
  }

  scheduleReport(report: ReportData) {
    alert(`${report.name}の定期生成設定機能は開発中です`);
  }

  get filteredReports(): ReportData[] {
    return this.reports;
  }

  get totalReports(): number {
    return this.reports.length;
  }

  get readyReports(): number {
    return this.reports.filter(r => r.status === 'ready').length;
  }

  get generatingReports(): number {
    return this.reports.filter(r => r.status === 'generating').length;
  }
} 