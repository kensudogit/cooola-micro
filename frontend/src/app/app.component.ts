import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <!-- Navigation -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <i class="fas fa-warehouse me-2"></i>
            COOOLa Micro
          </a>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                  <i class="fas fa-tachometer-alt me-1"></i>ダッシュボード
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/products" routerLinkActive="active">
                  <i class="fas fa-box me-1"></i>商品管理
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/inventory" routerLinkActive="active">
                  <i class="fas fa-warehouse me-1"></i>在庫管理
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/transactions" routerLinkActive="active">
                  <i class="fas fa-exchange-alt me-1"></i>入出庫管理
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/reports" routerLinkActive="active">
                  <i class="fas fa-chart-bar me-1"></i>レポート
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/settings" routerLinkActive="active">
                  <i class="fas fa-cog me-1"></i>設定
                </a>
              </li>
            </ul>
            
            <ul class="navbar-nav">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i class="fas fa-user me-1"></i>ユーザー
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#"><i class="fas fa-user-circle me-1"></i>プロフィール</a></li>
                  <li><a class="dropdown-item" href="#"><i class="fas fa-cog me-1"></i>設定</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#"><i class="fas fa-sign-out-alt me-1"></i>ログアウト</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <div class="container-fluid">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer bg-light">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-6">
              <p class="mb-0">&copy; 2024 COOOLa Micro. All rights reserved.</p>
            </div>
            <div class="col-md-6 text-end">
              <p class="mb-0">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .main-content {
      flex: 1;
      padding: 20px 0;
    }
    
    .footer {
      padding: 15px 0;
      border-top: 1px solid #dee2e6;
    }
    
    .navbar-brand {
      font-weight: bold;
      font-size: 1.5rem;
    }
    
    .nav-link {
      font-weight: 500;
    }
    
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'COOOLa Micro';
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // アプリケーション初期化処理
    this.initializeApp();
  }
  
  private initializeApp() {
    // システム状態の確認
    this.checkSystemStatus();
    
    // ユーザー認証の確認
    this.checkAuthentication();
    
    // 通知の初期化
    this.initializeNotifications();
  }
  
  private checkSystemStatus() {
    // システムの健康状態を確認
    console.log('Checking system status...');
  }
  
  private checkAuthentication() {
    // ユーザー認証状態を確認
    console.log('Checking authentication...');
  }
  
  private initializeNotifications() {
    // 通知システムの初期化
    console.log('Initializing notifications...');
  }
} 