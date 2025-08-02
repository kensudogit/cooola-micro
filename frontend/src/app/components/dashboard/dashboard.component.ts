import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <!-- ヘッダー -->
      <div class="row mb-4">
        <div class="col-12">
          <h2><i class="fas fa-tachometer-alt me-2"></i>ダッシュボード</h2>
          <p class="text-muted">システムの概要と重要な指標を確認できます</p>
        </div>
      </div>

      <!-- 統計カード -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title">{{ totalProducts }}</h4>
                  <p class="card-text">総商品数</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-box fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title">{{ totalInventory }}</h4>
                  <p class="card-text">総在庫数</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-warehouse fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title">{{ lowStockItems }}</h4>
                  <p class="card-text">在庫不足商品</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-exclamation-triangle fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title">{{ todayTransactions }}</h4>
                  <p class="card-text">今日の取引</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-exchange-alt fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- チャートとテーブル -->
      <div class="row">
        <!-- 在庫推移チャート -->
        <div class="col-md-8 mb-4">
          <div class="card">
            <div class="card-header">
              <h5><i class="fas fa-chart-line me-2"></i>在庫推移</h5>
            </div>
            <div class="card-body">
              <canvas #inventoryChart width="400" height="200"></canvas>
            </div>
          </div>
        </div>

        <!-- 最近の通知 -->
        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-header">
              <h5><i class="fas fa-bell me-2"></i>最近の通知</h5>
            </div>
            <div class="card-body">
              <div class="notification-list">
                <div *ngFor="let notification of recentNotifications" 
                     class="notification-item p-2 border-bottom">
                  <div class="d-flex justify-content-between">
                    <strong>{{ notification.title }}</strong>
                    <small class="text-muted">{{ notification.createdAt | date:'short' }}</small>
                  </div>
                  <p class="mb-1">{{ notification.message }}</p>
                  <span [class]="'badge ' + getPriorityClass(notification.priority)">
                    {{ notification.priority }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 在庫不足商品テーブル -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5><i class="fas fa-exclamation-triangle me-2"></i>在庫不足商品</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>商品コード</th>
                      <th>商品名</th>
                      <th>カテゴリ</th>
                      <th>現在在庫</th>
                      <th>最小在庫</th>
                      <th>ステータス</th>
                      <th>アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of lowStockItemsList">
                      <td>{{ item.code }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.category }}</td>
                      <td>
                        <span [class]="'badge ' + getStockLevelClass(item.currentStock)">
                          {{ item.currentStock }}
                        </span>
                      </td>
                      <td>{{ item.minStock }}</td>
                      <td>
                        <span [class]="'badge ' + getStatusClass(item.status)">
                          {{ item.status }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-primary me-1">
                          <i class="fas fa-plus"></i> 入庫
                        </button>
                        <button class="btn btn-sm btn-info">
                          <i class="fas fa-eye"></i> 詳細
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .notification-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .notification-item {
      transition: background-color 0.2s;
    }
    
    .notification-item:hover {
      background-color: #f8f9fa;
    }
    
    .badge-urgent {
      background-color: #dc3545;
    }
    
    .badge-high {
      background-color: #fd7e14;
    }
    
    .badge-normal {
      background-color: #28a745;
    }
    
    .badge-low {
      background-color: #6c757d;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalInventory = 0;
  lowStockItems = 0;
  todayTransactions = 0;
  
  recentNotifications: any[] = [];
  lowStockItemsList: any[] = [];
  
  private inventoryChart: any;

  ngOnInit() {
    this.loadDashboardData();
    this.initializeChart();
  }

  private loadDashboardData() {
    // 実際のAPIからデータを取得
    this.loadStatistics();
    this.loadNotifications();
    this.loadLowStockItems();
  }

  private loadStatistics() {
    // 統計データの取得
    this.totalProducts = 1250;
    this.totalInventory = 45678;
    this.lowStockItems = 23;
    this.todayTransactions = 156;
  }

  private loadNotifications() {
    // 通知データの取得
    this.recentNotifications = [
      {
        title: '在庫不足アラート',
        message: '商品「ノートPC」の在庫が最小在庫レベルを下回りました',
        priority: 'HIGH',
        createdAt: new Date()
      },
      {
        title: 'システムメンテナンス',
        message: '定期メンテナンスが完了しました',
        priority: 'NORMAL',
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        title: '入庫完了',
        message: '商品「スマートフォン」の入庫が完了しました',
        priority: 'LOW',
        createdAt: new Date(Date.now() - 7200000)
      }
    ];
  }

  private loadLowStockItems() {
    // 在庫不足商品の取得
    this.lowStockItemsList = [
      {
        code: 'PC001',
        name: 'ノートPC',
        category: '電子機器',
        currentStock: 5,
        minStock: 10,
        status: 'CRITICAL'
      },
      {
        code: 'PH001',
        name: 'スマートフォン',
        category: '電子機器',
        currentStock: 8,
        minStock: 15,
        status: 'LOW'
      },
      {
        code: 'TB001',
        name: 'タブレット',
        category: '電子機器',
        currentStock: 3,
        minStock: 5,
        status: 'CRITICAL'
      }
    ];
  }

  private initializeChart() {
    const ctx = document.getElementById('inventoryChart') as HTMLCanvasElement;
    if (ctx) {
      this.inventoryChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
          datasets: [{
            label: '総在庫数',
            data: [42000, 43500, 44500, 45200, 45800, 45678],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'URGENT': return 'badge-urgent';
      case 'HIGH': return 'badge-high';
      case 'NORMAL': return 'badge-normal';
      case 'LOW': return 'badge-low';
      default: return 'badge-secondary';
    }
  }

  getStockLevelClass(stock: number): string {
    if (stock <= 5) return 'bg-danger';
    if (stock <= 10) return 'bg-warning';
    return 'bg-success';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CRITICAL': return 'bg-danger';
      case 'LOW': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }
} 