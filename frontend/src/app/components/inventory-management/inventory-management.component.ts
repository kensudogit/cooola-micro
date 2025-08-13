import { Component, OnInit } from '@angular/core';

interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  location: string;
  lastUpdated: Date;
  status: 'normal' | 'low' | 'overstock' | 'out';
}

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {
  title = '在庫管理';
  inventoryItems: InventoryItem[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  selectedLocation = '';

  categories = [
    '電子機器',
    '衣類',
    '食品',
    '書籍',
    '家具',
    'スポーツ用品',
    'その他'
  ];

  locations = [
    '倉庫A-1F',
    '倉庫A-2F',
    '倉庫B-1F',
    '倉庫B-2F',
    '冷蔵庫',
    '冷凍庫'
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData() {
    this.inventoryItems = [
      {
        id: 1,
        productId: 1,
        productName: 'ノートPC ThinkPad X1',
        productCode: 'PC001',
        category: '電子機器',
        currentStock: 25,
        minStock: 5,
        maxStock: 50,
        unit: '台',
        location: '倉庫A-1F',
        lastUpdated: new Date('2024-08-13'),
        status: 'normal'
      },
      {
        id: 2,
        productId: 2,
        productName: 'ワイヤレスマウス',
        productCode: 'MS002',
        category: '電子機器',
        currentStock: 8,
        minStock: 10,
        maxStock: 100,
        unit: '個',
        location: '倉庫A-1F',
        lastUpdated: new Date('2024-08-13'),
        status: 'low'
      },
      {
        id: 3,
        productId: 3,
        productName: 'オフィスチェア',
        productCode: 'CH003',
        category: '家具',
        currentStock: 0,
        minStock: 2,
        maxStock: 20,
        unit: '脚',
        location: '倉庫B-1F',
        lastUpdated: new Date('2024-08-13'),
        status: 'out'
      },
      {
        id: 4,
        productId: 4,
        productName: 'USBメモリ 32GB',
        productCode: 'US004',
        category: '電子機器',
        currentStock: 150,
        minStock: 20,
        maxStock: 100,
        unit: '個',
        location: '倉庫A-2F',
        lastUpdated: new Date('2024-08-13'),
        status: 'overstock'
      },
      {
        id: 5,
        productId: 5,
        productName: 'コピー用紙 A4',
        productCode: 'PP005',
        category: 'その他',
        currentStock: 45,
        minStock: 10,
        maxStock: 200,
        unit: '箱',
        location: '倉庫B-2F',
        lastUpdated: new Date('2024-08-13'),
        status: 'normal'
      }
    ];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'normal': return 'success';
      case 'low': return 'warning';
      case 'overstock': return 'info';
      case 'out': return 'danger';
      default: return 'secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'normal': return '正常';
      case 'low': return '低在庫';
      case 'overstock': return '過剰在庫';
      case 'out': return '在庫切れ';
      default: return '不明';
    }
  }

  get filteredInventory(): InventoryItem[] {
    let filtered = this.inventoryItems;
    
    if (this.searchTerm) {
      filtered = filtered.filter(item => 
        item.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.productCode.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    if (this.selectedCategory) {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }
    
    if (this.selectedStatus) {
      filtered = filtered.filter(item => item.status === this.selectedStatus);
    }
    
    if (this.selectedLocation) {
      filtered = filtered.filter(item => item.location === this.selectedLocation);
    }
    
    return filtered;
  }

  get totalItems(): number {
    return this.inventoryItems.length;
  }

  get lowStockItems(): number {
    return this.inventoryItems.filter(item => item.status === 'low').length;
  }

  get outOfStockItems(): number {
    return this.inventoryItems.filter(item => item.status === 'out').length;
  }

  get overstockItems(): number {
    return this.inventoryItems.filter(item => item.status === 'overstock').length;
  }

  get normalStockItems(): number {
    return this.inventoryItems.filter(item => item.status === 'normal').length;
  }

  get totalValue(): number {
    // 仮の価格データ（実際の実装では商品マスタから取得）
    const prices: { [key: string]: number } = {
      'PC001': 150000,
      'MS002': 3500,
      'CH003': 25000,
      'US004': 2000,
      'PP005': 1500
    };
    
    return this.inventoryItems.reduce((sum, item) => {
      return sum + (prices[item.productCode] || 0) * item.currentStock;
    }, 0);
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.selectedLocation = '';
  }

  exportInventory() {
    // CSVエクスポート機能（実装予定）
    alert('在庫データのエクスポート機能は開発中です');
  }

  printInventory() {
    // 印刷機能（実装予定）
    alert('在庫データの印刷機能は開発中です');
  }
}
