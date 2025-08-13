import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  price: number;
  description: string;
  unit: string;
  minStock: number;
  maxStock: number;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  title = '商品管理';
  products: Product[] = [];
  productForm: FormGroup;
  isEditing = false;
  editingProductId: number | null = null;
  searchTerm = '';
  selectedCategory = '';

  categories = [
    '電子機器',
    '衣類',
    '食品',
    '書籍',
    '家具',
    'スポーツ用品',
    'その他'
  ];

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{3,10}$')]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.maxLength(500)],
      unit: ['個', Validators.required],
      minStock: [0, [Validators.required, Validators.min(0)]],
      maxStock: [1000, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData() {
    this.products = [
      {
        id: 1,
        name: 'ノートPC ThinkPad X1',
        code: 'PC001',
        category: '電子機器',
        price: 150000,
        description: 'ビジネス向け高性能ノートPC',
        unit: '台',
        minStock: 5,
        maxStock: 50,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-08-13')
      },
      {
        id: 2,
        name: 'ワイヤレスマウス',
        code: 'MS002',
        category: '電子機器',
        price: 3500,
        description: 'Bluetooth接続の光学マウス',
        unit: '個',
        minStock: 10,
        maxStock: 100,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-08-13')
      },
      {
        id: 3,
        name: 'オフィスチェア',
        code: 'CH003',
        category: '家具',
        price: 25000,
        description: 'エルゴノミクス設計のオフィスチェア',
        unit: '脚',
        minStock: 2,
        maxStock: 20,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-08-13')
      }
    ];
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.isEditing && this.editingProductId) {
        this.updateProduct();
      } else {
        this.addProduct();
      }
    }
  }

  addProduct() {
    const newProduct: Product = {
      id: this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1,
      ...this.productForm.value,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.push(newProduct);
    this.resetForm();
  }

  updateProduct() {
    const index = this.products.findIndex(p => p.id === this.editingProductId);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...this.productForm.value,
        updatedAt: new Date()
      };
    }
    this.resetForm();
  }

  editProduct(product: Product) {
    this.isEditing = true;
    this.editingProductId = product.id;
    this.productForm.patchValue(product);
  }

  deleteProduct(id: number) {
    if (confirm('この商品を削除しますか？')) {
      this.products = this.products.filter(p => p.id !== id);
    }
  }

  resetForm() {
    this.productForm.reset({
      unit: '個',
      minStock: 0,
      maxStock: 1000
    });
    this.isEditing = false;
    this.editingProductId = null;
  }

  get filteredProducts(): Product[] {
    let filtered = this.products;
    
    if (this.searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    
    return filtered;
  }

  get totalProducts(): number {
    return this.products.length;
  }

  get totalValue(): number {
    return this.products.reduce((sum, p) => sum + p.price, 0);
  }
}
