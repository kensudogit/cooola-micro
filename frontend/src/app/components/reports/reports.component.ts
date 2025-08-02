import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-container">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h3 mb-0">
            <i class="fas fa-chart-bar me-2"></i>レポート
          </h1>
          <p class="text-muted">各種レポートを生成・確認します</p>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card shadow">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">在庫レポート</h6>
            </div>
            <div class="card-body">
              <p>現在の在庫状況をレポート化します</p>
              <button class="btn btn-primary">生成</button>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card shadow">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">取引レポート</h6>
            </div>
            <div class="card-body">
              <p>入出庫の取引履歴をレポート化します</p>
              <button class="btn btn-primary">生成</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 20px;
    }
  `]
})
export class ReportsComponent implements OnInit {
  ngOnInit() {
    // レポート機能の初期化
  }
} 