import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="settings-container">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h3 mb-0">
            <i class="fas fa-cog me-2"></i>設定
          </h1>
          <p class="text-muted">システム設定を管理します</p>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card shadow">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">システム設定</h6>
            </div>
            <div class="card-body">
              <p>システムの基本設定を行います</p>
              <button class="btn btn-primary">設定</button>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card shadow">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">ユーザー管理</h6>
            </div>
            <div class="card-body">
              <p>ユーザーアカウントを管理します</p>
              <button class="btn btn-primary">管理</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 20px;
    }
  `]
})
export class SettingsComponent implements OnInit {
  ngOnInit() {
    // 設定機能の初期化
  }
} 