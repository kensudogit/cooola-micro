// COOOLa Micro 倉庫管理システム - JavaScript

// サンプルデータ
let products = [
    { id: 1, code: 'PC001', name: 'ノートPC', category: '電子機器', price: 80000, stockQuantity: 25, status: 'ACTIVE', minStockLevel: 10, maxStockLevel: 100 },
    { id: 2, code: 'PH001', name: 'スマートフォン', category: '電子機器', price: 50000, stockQuantity: 15, status: 'ACTIVE', minStockLevel: 20, maxStockLevel: 50 },
    { id: 3, code: 'TB001', name: 'タブレット', category: '電子機器', price: 30000, stockQuantity: 8, status: 'ACTIVE', minStockLevel: 5, maxStockLevel: 30 },
    { id: 4, code: 'KB001', name: 'キーボード', category: 'アクセサリ', price: 5000, stockQuantity: 50, status: 'ACTIVE', minStockLevel: 10, maxStockLevel: 200 },
    { id: 5, code: 'MS001', name: 'マウス', category: 'アクセサリ', price: 3000, stockQuantity: 100, status: 'ACTIVE', minStockLevel: 20, maxStockLevel: 500 }
];

let transactions = [
    { id: 'TXN-2024-001', productName: 'ノートPC', type: '入庫', quantity: 50, date: '2024-01-15 10:00', user: '田中' },
    { id: 'TXN-2024-002', productName: 'スマートフォン', type: '出庫', quantity: 20, date: '2024-01-15 09:30', user: '佐藤' },
    { id: 'TXN-2024-003', productName: 'タブレット', type: '入庫', quantity: 30, date: '2024-01-15 09:00', user: '鈴木' },
    { id: 'TXN-2024-004', productName: 'ノートPC', type: '出庫', quantity: 25, date: '2024-01-15 08:30', user: '田中' },
    { id: 'TXN-2024-005', productName: 'キーボード', type: '入庫', quantity: 100, date: '2024-01-15 08:00', user: '高橋' }
];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadProducts();
    loadInventory();
    loadTransactions();
    initializeChart();
});

// ダッシュボードの初期化
function initializeDashboard() {
    const totalProducts = products.length;
    const totalInventory = products.reduce((sum, product) => sum + product.stockQuantity, 0);
    const todayTransactions = transactions.length;
    const lowStockAlerts = products.filter(product => product.stockQuantity <= product.minStockLevel).length;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalInventory').textContent = totalInventory;
    document.getElementById('todayTransactions').textContent = todayTransactions;
    document.getElementById('lowStockAlerts').textContent = lowStockAlerts;
}

// 商品一覧の読み込み
function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>¥${product.price.toLocaleString()}</td>
            <td><span class="badge ${getStockLevelClass(product.stockQuantity)}">${product.stockQuantity}</span></td>
            <td><span class="badge ${getStatusClass(product.status)}">${product.status}</span></td>
            <td>
                <button class="btn btn-sm btn-info btn-action" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 在庫一覧の読み込み
function loadInventory() {
    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${product.stockQuantity}</td>
            <td>${product.minStockLevel}</td>
            <td>${product.maxStockLevel}</td>
            <td><span class="badge ${getInventoryStatusClass(product)}">${getInventoryStatusText(product)}</span></td>
            <td>
                <button class="btn btn-sm btn-success btn-action" onclick="addStock(${product.id})">入庫</button>
                <button class="btn btn-sm btn-warning btn-action" onclick="removeStock(${product.id})">出庫</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 取引履歴の読み込み
function loadTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.productName}</td>
            <td><span class="badge ${getTransactionTypeClass(transaction.type)}">${transaction.type}</span></td>
            <td>${transaction.quantity}</td>
            <td>${transaction.date}</td>
            <td>${transaction.user}</td>
        `;
        tbody.appendChild(row);
    });
}

// チャートの初期化
function initializeChart() {
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [{
                label: '総在庫数',
                data: [150, 180, 200, 220, 210, 198],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 新規商品登録モーダルの表示
function showAddProductModal() {
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

// 新規商品の登録
function addProduct() {
    const code = document.getElementById('productCode').value;
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);

    if (!code || !name || !category || !price || !stock) {
        alert('すべての項目を入力してください。');
        return;
    }

    // 商品コードの重複チェック
    if (products.some(p => p.code === code)) {
        alert('商品コードが既に存在します。');
        return;
    }

    const newProduct = {
        id: products.length + 1,
        code: code,
        name: name,
        category: category,
        price: price,
        stockQuantity: stock,
        status: 'ACTIVE',
        minStockLevel: Math.floor(stock * 0.2),
        maxStockLevel: stock * 2
    };

    products.push(newProduct);
    
    // 入庫取引を追加
    const transaction = {
        id: `TXN-${Date.now()}`,
        productName: name,
        type: '入庫',
        quantity: stock,
        date: new Date().toLocaleString('ja-JP'),
        user: 'システム'
    };
    transactions.unshift(transaction);

    // 画面を更新
    loadProducts();
    loadInventory();
    loadTransactions();
    initializeDashboard();

    // モーダルを閉じる
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();

    // フォームをリセット
    document.getElementById('addProductForm').reset();

    alert('商品が正常に登録されました。');
}

// 商品の編集
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        alert(`商品「${product.name}」の編集機能は開発中です。`);
    }
}

// 商品の削除
function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        if (confirm(`商品「${product.name}」を削除しますか？`)) {
            products = products.filter(p => p.id !== id);
            loadProducts();
            loadInventory();
            initializeDashboard();
            alert('商品が削除されました。');
        }
    }
}

// 在庫の追加
function addStock(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        const quantity = prompt(`${product.name}の入庫数量を入力してください:`, '10');
        if (quantity && !isNaN(quantity)) {
            const qty = parseInt(quantity);
            product.stockQuantity += qty;
            
            // 取引履歴を追加
            const transaction = {
                id: `TXN-${Date.now()}`,
                productName: product.name,
                type: '入庫',
                quantity: qty,
                date: new Date().toLocaleString('ja-JP'),
                user: 'ユーザー'
            };
            transactions.unshift(transaction);

            loadProducts();
            loadInventory();
            loadTransactions();
            initializeDashboard();
            alert('入庫が完了しました。');
        }
    }
}

// 在庫の削減
function removeStock(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        const quantity = prompt(`${product.name}の出庫数量を入力してください:`, '5');
        if (quantity && !isNaN(quantity)) {
            const qty = parseInt(quantity);
            if (qty > product.stockQuantity) {
                alert('在庫数量を超える出庫はできません。');
                return;
            }
            
            product.stockQuantity -= qty;
            
            // 取引履歴を追加
            const transaction = {
                id: `TXN-${Date.now()}`,
                productName: product.name,
                type: '出庫',
                quantity: qty,
                date: new Date().toLocaleString('ja-JP'),
                user: 'ユーザー'
            };
            transactions.unshift(transaction);

            loadProducts();
            loadInventory();
            loadTransactions();
            initializeDashboard();
            alert('出庫が完了しました。');
        }
    }
}

// 在庫レベルのクラス取得
function getStockLevelClass(stockQuantity) {
    if (stockQuantity <= 10) return 'bg-danger';
    if (stockQuantity <= 20) return 'bg-warning';
    return 'bg-success';
}

// ステータスのクラス取得
function getStatusClass(status) {
    switch (status) {
        case 'ACTIVE': return 'bg-success';
        case 'INACTIVE': return 'bg-secondary';
        default: return 'bg-secondary';
    }
}

// 在庫ステータスのクラス取得
function getInventoryStatusClass(product) {
    if (product.stockQuantity <= product.minStockLevel) return 'bg-danger';
    if (product.stockQuantity >= product.maxStockLevel * 0.8) return 'bg-warning';
    return 'bg-success';
}

// 在庫ステータスのテキスト取得
function getInventoryStatusText(product) {
    if (product.stockQuantity <= product.minStockLevel) return '低在庫';
    if (product.stockQuantity >= product.maxStockLevel * 0.8) return '高在庫';
    return '正常';
}

// 取引タイプのクラス取得
function getTransactionTypeClass(type) {
    return type === '入庫' ? 'bg-success' : 'bg-warning';
} 