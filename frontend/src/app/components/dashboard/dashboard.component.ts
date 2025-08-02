import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- ヘッダー -->
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h3 mb-0">
            <i class="fas fa-tachometer-alt me-2"></i>ダッシュボード
          </h1>
          <p class="text-muted">システムの概要と重要な指標を確認できます</p>
        </div>
      </div>

      <!-- 統計カード -->
      <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    総商品数
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ totalProducts }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-box fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                    在庫総数
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ totalInventory }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-warehouse fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-info shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                    今日の取引
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ todayTransactions }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-exchange-alt fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    低在庫アラート
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ lowStockAlerts }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- チャートとテーブル -->
      <div class="row">
        <div class="col-xl-8 col-lg-7">
          <div class="card shadow mb-4">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 class="m-0 font-weight-bold text-primary">在庫推移</h6>
            </div>
            <div class="card-body">
              <div class="chart-area">
                <canvas #inventoryChart></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-4 col-lg-5">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">最近の取引</h6>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div *ngFor="let transaction of recentTransactions" class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{{ transaction.productName }}</strong>
                    <br>
                    <small class="text-muted">{{ transaction.type }} - {{ transaction.quantity }}個</small>
                  </div>
                  <span class="badge bg-primary rounded-pill">{{ transaction.date | date:'short' }}</span>
                </div>
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
    
    .border-left-primary {
      border-left: 0.25rem solid #4e73df !important;
    }
    
    .border-left-success {
      border-left: 0.25rem solid #1cc88a !important;
    }
    
    .border-left-info {
      border-left: 0.25rem solid #36b9cc !important;
    }
    
    .border-left-warning {
      border-left: 0.25rem solid #f6c23e !important;
    }
    
    .text-gray-800 {
      color: #5a5c69 !important;
    }
    
    .text-gray-300 {
      color: #dddfeb !important;
    }
    
    .chart-area {
      height: 300px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalInventory = 0;
  todayTransactions = 0;
  lowStockAlerts = 0;
  recentTransactions: any[] = [];

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // モックデータ
    this.totalProducts = 1250;
    this.totalInventory = 15420;
    this.todayTransactions = 45;
    this.lowStockAlerts = 8;
    
    this.recentTransactions = [
      { productName: '商品A', type: '入庫', quantity: 100, date: new Date() },
      { productName: '商品B', type: '出庫', quantity: 50, date: new Date(Date.now() - 3600000) },
      { productName: '商品C', type: '入庫', quantity: 200, date: new Date(Date.now() - 7200000) },
      { productName: '商品D', type: '出庫', quantity: 75, date: new Date(Date.now() - 10800000) }
    ];
  }
} 