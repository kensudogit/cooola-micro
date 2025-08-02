import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

      <div class="card shadow">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">在庫一覧</h6>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered">
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
    </div>
  `,
  styles: [`
    .inventory-container {
      padding: 20px;
    }
  `]
})
export class InventoryComponent implements OnInit {
  inventoryItems: any[] = [];

  ngOnInit() {
    this.loadInventory();
  }

  private loadInventory() {
    this.inventoryItems = [
      { code: 'PC001', name: 'ノートPC', currentStock: 25, minStock: 10, maxStock: 100 },
      { code: 'PH001', name: 'スマートフォン', currentStock: 15, minStock: 20, maxStock: 50 },
      { code: 'TB001', name: 'タブレット', currentStock: 8, minStock: 5, maxStock: 30 }
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
} 