import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Transaction {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  type: 'in' | 'out';
  quantity: number;
  unit: string;
  location: string;
  reason: string;
  operator: string;
  transactionDate: Date;
  notes: string;
}

interface Product {
  id: number;
  name: string;
  code: string;
  unit: string;
  currentStock: number;
}

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  title = '入出庫管理';
  transactions: Transaction[] = [];
  transactionForm: FormGroup;
  products: Product[] = [];
  searchTerm = '';
  selectedType = '';
  selectedProduct = '';
  selectedDateRange = '';
  showForm = false;

  transactionTypes = [
    { value: 'in', label: '入庫', class: 'success' },
    { value: 'out', label: '出庫', class: 'danger' }
  ];

  reasons = [
    '通常入庫',
    '返品入庫',
    '通常出庫',
    '破損出庫',
    '在庫調整',
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

  operators = [
    '田中太郎',
    '佐藤花子',
    '鈴木一郎',
    '高橋美咲',
    '伊藤健太'
  ];

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      productId: ['', Validators.required],
      type: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      reason: ['', Validators.required],
      operator: ['', Validators.required],
      transactionDate: [new Date(), Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData() {
    // 商品データ
    this.products = [
      { id: 1, name: 'ノートPC ThinkPad X1', code: 'PC001', unit: '台', currentStock: 25 },
      { id: 2, name: 'ワイヤレスマウス', code: 'MS002', unit: '個', currentStock: 8 },
      { id: 3, name: 'オフィスチェア', code: 'CH003', unit: '脚', currentStock: 0 },
      { id: 4, name: 'USBメモリ 32GB', code: 'US004', unit: '個', currentStock: 150 },
      { id: 5, name: 'コピー用紙 A4', code: 'PP005', unit: '箱', currentStock: 45 }
    ];

    // 取引履歴データ
    this.transactions = [
      {
        id: 1,
        productId: 1,
        productName: 'ノートPC ThinkPad X1',
        productCode: 'PC001',
        type: 'in',
        quantity: 10,
        unit: '台',
        location: '倉庫A-1F',
        reason: '通常入庫',
        operator: '田中太郎',
        transactionDate: new Date('2024-08-13 09:00'),
        notes: '新規仕入れ分'
      },
      {
        id: 2,
        productId: 2,
        productName: 'ワイヤレスマウス',
        productCode: 'MS002',
        type: 'out',
        quantity: 5,
        unit: '個',
        location: '倉庫A-1F',
        reason: '通常出庫',
        operator: '佐藤花子',
        transactionDate: new Date('2024-08-13 14:30'),
        notes: '営業部からの要求'
      },
      {
        id: 3,
        productId: 3,
        productName: 'オフィスチェア',
        productCode: 'CH003',
        type: 'in',
        quantity: 2,
        unit: '脚',
        location: '倉庫B-1F',
        reason: '通常入庫',
        operator: '鈴木一郎',
        transactionDate: new Date('2024-08-12 16:00'),
        notes: '補充分'
      },
      {
        id: 4,
        productId: 4,
        productName: 'USBメモリ 32GB',
        productCode: 'US004',
        type: 'out',
        quantity: 20,
        unit: '個',
        location: '倉庫A-2F',
        reason: '通常出庫',
        operator: '高橋美咲',
        transactionDate: new Date('2024-08-12 11:15'),
        notes: 'IT部門からの要求'
      },
      {
        id: 5,
        productId: 5,
        productName: 'コピー用紙 A4',
        productCode: 'PP005',
        type: 'in',
        quantity: 50,
        unit: '箱',
        location: '倉庫B-2F',
        reason: '通常入庫',
        operator: '伊藤健太',
        transactionDate: new Date('2024-08-11 10:00'),
        notes: '定期補充'
      }
    ];
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const selectedProduct = this.products.find(p => p.id === formValue.productId);
      
      if (selectedProduct) {
        const newTransaction: Transaction = {
          id: this.transactions.length > 0 ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1,
          productId: formValue.productId,
          productName: selectedProduct.name,
          productCode: selectedProduct.code,
          type: formValue.type,
          quantity: formValue.quantity,
          unit: selectedProduct.unit,
          location: formValue.location,
          reason: formValue.reason,
          operator: formValue.operator,
          transactionDate: formValue.transactionDate,
          notes: formValue.notes
        };

        this.transactions.unshift(newTransaction);
        this.resetForm();
        this.showForm = false;
      }
    }
  }

  resetForm() {
    this.transactionForm.reset({
      quantity: 0,
      transactionDate: new Date()
    });
  }

  getTypeClass(type: string): string {
    return type === 'in' ? 'success' : 'danger';
  }

  getTypeText(type: string): string {
    return type === 'in' ? '入庫' : '出庫';
  }

  get filteredTransactions(): Transaction[] {
    let filtered = this.transactions;
    
    if (this.searchTerm) {
      filtered = filtered.filter(t => 
        t.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.productCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.operator.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    if (this.selectedType) {
      filtered = filtered.filter(t => t.type === this.selectedType);
    }
    
    if (this.selectedProduct) {
      filtered = filtered.filter(t => t.productId === parseInt(this.selectedProduct));
    }
    
    if (this.selectedDateRange) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      
      switch (this.selectedDateRange) {
        case 'today':
          filtered = filtered.filter(t => 
            t.transactionDate.toDateString() === today.toDateString()
          );
          break;
        case 'yesterday':
          filtered = filtered.filter(t => 
            t.transactionDate.toDateString() === yesterday.toDateString()
          );
          break;
        case 'week':
          filtered = filtered.filter(t => t.transactionDate >= weekAgo);
          break;
        case 'month':
          filtered = filtered.filter(t => t.transactionDate >= monthAgo);
          break;
      }
    }
    
    return filtered;
  }

  get totalInQuantity(): number {
    return this.transactions
      .filter(t => t.type === 'in')
      .reduce((sum, t) => sum + t.quantity, 0);
  }

  get totalOutQuantity(): number {
    return this.transactions
      .filter(t => t.type === 'out')
      .reduce((sum, t) => sum + t.quantity, 0);
  }

  get todayTransactions(): number {
    const today = new Date();
    return this.transactions.filter(t => 
      t.transactionDate.toDateString() === today.toDateString()
    ).length;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedProduct = '';
    this.selectedDateRange = '';
  }

  exportTransactions() {
    alert('取引履歴のエクスポート機能は開発中です');
  }

  printTransactions() {
    alert('取引履歴の印刷機能は開発中です');
  }
}
