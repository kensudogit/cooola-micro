import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transactions-container">
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h3 mb-0">
            <i class="fas fa-exchange-alt me-2"></i>入出庫管理
          </h1>
          <p class="text-muted">入庫・出庫の履歴を確認します</p>
        </div>
      </div>

      <div class="card shadow">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">取引履歴</h6>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>取引ID</th>
                  <th>商品名</th>
                  <th>タイプ</th>
                  <th>数量</th>
                  <th>日時</th>
                  <th>担当者</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let transaction of transactions">
                  <td>{{ transaction.id }}</td>
                  <td>{{ transaction.productName }}</td>
                  <td>
                    <span [class]="'badge ' + getTypeClass(transaction.type)">
                      {{ transaction.type }}
                    </span>
                  </td>
                  <td>{{ transaction.quantity }}</td>
                  <td>{{ transaction.date | date:'short' }}</td>
                  <td>{{ transaction.user }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: 20px;
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];

  ngOnInit() {
    this.loadTransactions();
  }

  private loadTransactions() {
    this.transactions = [
      { id: 'T001', productName: 'ノートPC', type: '入庫', quantity: 50, date: new Date(), user: '田中' },
      { id: 'T002', productName: 'スマートフォン', type: '出庫', quantity: 20, date: new Date(Date.now() - 3600000), user: '佐藤' },
      { id: 'T003', productName: 'タブレット', type: '入庫', quantity: 30, date: new Date(Date.now() - 7200000), user: '鈴木' }
    ];
  }

  getTypeClass(type: string): string {
    return type === '入庫' ? 'badge-success' : 'badge-warning';
  }
} 