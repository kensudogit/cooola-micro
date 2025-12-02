import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  code: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  status: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-container">
      <!-- ヘッダー -->
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="h3 mb-0">
            <i class="fas fa-box me-2"></i>商品管理
          </h1>
          <p class="text-muted">商品の登録、編集、削除を行います</p>
        </div>
      </div>

      <!-- 検索とフィルター -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="商品名で検索..." [(ngModel)]="searchTerm">
            <button class="btn btn-outline-secondary" type="button">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div class="col-md-6 text-end">
          <button class="btn btn-primary" (click)="openAddModal()">
            <i class="fas fa-plus me-1"></i>新規商品登録
          </button>
        </div>
      </div>

      <!-- 商品テーブル -->
      <div class="card shadow">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">商品一覧</h6>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered" width="100%" cellspacing="0">
              <thead>
                <tr>
                  <th>商品コード</th>
                  <th>商品名</th>
                  <th>カテゴリ</th>
                  <th>価格</th>
                  <th>在庫数</th>
                  <th>ステータス</th>
                  <th>アクション</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let product of filteredProducts">
                  <td>{{ product.code }}</td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.category }}</td>
                  <td>¥{{ product.price | number }}</td>
                  <td>
                    <span [class]="'badge ' + getStockLevelClass(product.stockQuantity)">
                      {{ product.stockQuantity }}
                    </span>
                  </td>
                  <td>
                    <span [class]="'badge ' + getStatusClass(product.status || '')">
                      {{ getStatusText(product.status || '') }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-info me-1" (click)="editProduct(product)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="deleteProduct(product)">
                      <i class="fas fa-trash"></i>
                    </button>
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
    .products-container {
      padding: 20px;
    }
    
    .table th {
      background-color: #f8f9fc;
      border-color: #e3e6f0;
    }
    
    .badge-success {
      background-color: #1cc88a;
    }
    
    .badge-warning {
      background-color: #f6c23e;
    }
    
    .badge-danger {
      background-color: #e74a3b;
    }
    
    .badge-secondary {
      background-color: #858796;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  searchTerm = '';

  constructor() {}

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    // サンプルデータ
    this.products = [
      { code: 'PC001', name: 'ノートPC', category: '電子機器', price: 80000, stockQuantity: 25, status: 'ACTIVE' },
      { code: 'PH001', name: 'スマートフォン', category: '電子機器', price: 50000, stockQuantity: 15, status: 'ACTIVE' },
      { code: 'TB001', name: 'タブレット', category: '電子機器', price: 30000, stockQuantity: 8, status: 'ACTIVE' },
      { code: 'KB001', name: 'キーボード', category: 'アクセサリ', price: 5000, stockQuantity: 50, status: 'ACTIVE' },
      { code: 'MS001', name: 'マウス', category: 'アクセサリ', price: 3000, stockQuantity: 100, status: 'ACTIVE' }
    ];
  }

  get filteredProducts(): Product[] {
    if (!this.searchTerm) {
      return this.products;
    }
    return this.products.filter(product => 
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getStockLevelClass(stockQuantity: number): string {
    if (stockQuantity <= 10) return 'badge-danger';
    if (stockQuantity <= 20) return 'badge-warning';
    return 'badge-success';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge-success';
      case 'INACTIVE': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ACTIVE': return '有効';
      case 'INACTIVE': return '無効';
      default: return '不明';
    }
  }

  openAddModal() {
    // 新規商品登録モーダルを開く
    console.log('新規商品登録モーダルを開く');
  }

  editProduct(product: Product) {
    // 商品編集モーダルを開く
    console.log('商品編集:', product);
  }

  deleteProduct(product: Product) {
    // 商品削除確認
    if (confirm(`商品「${product.name}」を削除しますか？`)) {
      console.log('商品削除:', product);
    }
  }
} 