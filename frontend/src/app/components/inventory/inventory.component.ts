import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService, ExportOptions } from '../../services/export.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inventory-container">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h3 mb-0">
            <i class="fas fa-warehouse me-2"></i>在庫管理
          </h1>
          <p class="text-muted">在庫の確認と管理を行います</p>
        </div>
      </div>

      <!-- アクションボタン -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-0">在庫データの操作</h6>
                  <small class="text-muted">CSVエクスポート、印刷、その他の操作が可能です</small>
                </div>
                <div class="btn-group" role="group">
                  <button class="btn btn-outline-primary" (click)="exportToCsv()">
                    <i class="fas fa-download me-2"></i>CSVエクスポート
                  </button>
                  <button class="btn btn-outline-success" (click)="printInventory()">
                    <i class="fas fa-print me-2"></i>印刷
                  </button>
                  <button class="btn btn-outline-info" (click)="exportToPdf()">
                    <i class="fas fa-file-pdf me-2"></i>PDF出力
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 class="m-0 font-weight-bold text-primary">在庫一覧</h6>
          <div class="d-flex align-items-center">
            <span class="badge bg-success me-2">{{ getNormalStockCount() }} 正常</span>
            <span class="badge bg-warning me-2">{{ getLowStockCount() }} 低在庫</span>
            <span class="badge bg-danger">{{ getHighStockCount() }} 高在庫</span>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered" #inventoryTable>
              <thead>
                <tr>
                  <th>商品コード</th>
                  <th>商品名</th>
                  <th>現在在庫</th>
                  <th>最小在庫</th>
                  <th>最大在庫</th>
                  <th>ステータス</th>
                  <th>アクション</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of inventoryItems">
                  <td>{{ item.code }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.currentStock }}</td>
                  <td>{{ item.minStock }}</td>
                  <td>{{ item.maxStock }}</td>
                  <td>
                    <span [class]="'badge ' + getStockStatusClass(item)">
                      {{ getStockStatusText(item) }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-success me-1">入庫</button>
                    <button class="btn btn-sm btn-warning">出庫</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 在庫サマリー -->
      <div class="row mt-4">
        <div class="col-md-3">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    総商品数
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ inventoryItems.length }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-boxes fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                    総在庫数
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ getTotalStock() }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-warehouse fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    低在庫商品
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ getLowStockCount() }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card border-left-info shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                    平均在庫
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ getAverageStock() }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-chart-line fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inventory-container {
      padding: 20px;
    }
    
    .border-left-primary {
      border-left: 0.25rem solid #4e73df !important;
    }
    
    .border-left-success {
      border-left: 0.25rem solid #1cc88a !important;
    }
    
    .border-left-warning {
      border-left: 0.25rem solid #f6c23e !important;
    }
    
    .border-left-info {
      border-left: 0.25rem solid #36b9cc !important;
    }
    
    .text-xs {
      font-size: 0.7rem;
    }
    
    .text-gray-300 {
      color: #dddfeb !important;
    }
    
    .text-gray-800 {
      color: #5a5c69 !important;
    }
  `]
})
export class InventoryComponent implements OnInit {
  @ViewChild('inventoryTable', { static: false }) inventoryTable!: ElementRef;
  
  inventoryItems: any[] = [];

  constructor(private exportService: ExportService) {}

  ngOnInit() {
    this.loadInventory();
  }

  private loadInventory() {
    this.inventoryItems = [
      { code: 'PC001', name: 'ノートPC', currentStock: 25, minStock: 10, maxStock: 100 },
      { code: 'PH001', name: 'スマートフォン', currentStock: 15, minStock: 20, maxStock: 50 },
      { code: 'TB001', name: 'タブレット', currentStock: 8, minStock: 5, maxStock: 30 },
      { code: 'KB001', name: 'キーボード', currentStock: 45, minStock: 15, maxStock: 80 },
      { code: 'MS001', name: 'マウス', currentStock: 32, minStock: 20, maxStock: 60 },
      { code: 'MN001', name: 'モニター', currentStock: 12, minStock: 8, maxStock: 25 },
      { code: 'HD001', name: '外付けHDD', currentStock: 18, minStock: 10, maxStock: 40 },
      { code: 'CA001', name: 'ケーブル類', currentStock: 85, minStock: 30, maxStock: 100 }
    ];
  }

  getStockStatusClass(item: any): string {
    if (item.currentStock <= item.minStock) return 'badge-danger';
    if (item.currentStock >= item.maxStock * 0.8) return 'badge-warning';
    return 'badge-success';
  }

  getStockStatusText(item: any): string {
    if (item.currentStock <= item.minStock) return '低在庫';
    if (item.currentStock >= item.maxStock * 0.8) return '高在庫';
    return '正常';
  }

  // 統計メソッド
  getTotalStock(): number {
    return this.inventoryItems.reduce((total, item) => total + item.currentStock, 0);
  }

  getAverageStock(): number {
    return Math.round(this.getTotalStock() / this.inventoryItems.length);
  }

  getNormalStockCount(): number {
    return this.inventoryItems.filter(item => 
      item.currentStock > item.minStock && item.currentStock < item.maxStock * 0.8
    ).length;
  }

  getLowStockCount(): number {
    return this.inventoryItems.filter(item => item.currentStock <= item.minStock).length;
  }

  getHighStockCount(): number {
    return this.inventoryItems.filter(item => item.currentStock >= item.maxStock * 0.8).length;
  }

  // CSVエクスポート
  exportToCsv(): void {
    const options: ExportOptions = {
      reportType: 'inventory',
      filename: `inventory_${new Date().toISOString().split('T')[0]}.csv`
    };
    
    this.exportService.downloadCsv(this.inventoryItems, options);
  }

  // 印刷
  printInventory(): void {
    if (this.inventoryTable) {
      this.exportService.printElement(this.inventoryTable.nativeElement, {
        title: '在庫一覧レポート'
      });
    }
  }

  // PDF出力
  async exportToPdf(): Promise<void> {
    if (this.inventoryTable) {
      const options: ExportOptions = {
        reportType: 'inventory',
        filename: `inventory_${new Date().toISOString().split('T')[0]}.pdf`
      };
      
      await this.exportService.downloadPdf(this.inventoryTable.nativeElement, options);
    }
  }
} 