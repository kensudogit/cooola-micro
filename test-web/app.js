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

// 移動履歴データ
let movements = [
    { id: 'MOV-2024-001', productId: 1, productName: 'ノートPC', type: 'IN', quantity: 50, fromLocation: '外部', toLocation: '倉庫A-01', reason: '初期入庫', referenceNumber: 'PO-2024-001', date: '2024-01-15 10:00', user: 'system' },
    { id: 'MOV-2024-002', productId: 1, productName: 'ノートPC', type: 'OUT', quantity: 25, fromLocation: '倉庫A-01', toLocation: '外部', reason: '販売出庫', referenceNumber: 'SO-2024-001', date: '2024-01-15 09:30', user: '田中' },
    { id: 'MOV-2024-003', productId: 1, productName: 'ノートPC', type: 'TRANSFER', quantity: 10, fromLocation: '倉庫A-01', toLocation: '倉庫B-01', reason: '倉庫間移動', referenceNumber: 'TR-2024-001', date: '2024-01-15 09:00', user: '佐藤' },
    { id: 'MOV-2024-004', productId: 2, productName: 'スマートフォン', type: 'IN', quantity: 30, fromLocation: '外部', toLocation: '倉庫A-02', reason: '初期入庫', referenceNumber: 'PO-2024-002', date: '2024-01-15 08:30', user: 'system' },
    { id: 'MOV-2024-005', productId: 2, productName: 'スマートフォン', type: 'OUT', quantity: 15, fromLocation: '倉庫A-02', toLocation: '外部', reason: '販売出庫', referenceNumber: 'SO-2024-002', date: '2024-01-15 08:00', user: '鈴木' },
    { id: 'MOV-2024-006', productId: 3, productName: 'タブレット', type: 'IN', quantity: 20, fromLocation: '外部', toLocation: '倉庫A-03', reason: '初期入庫', referenceNumber: 'PO-2024-003', date: '2024-01-15 07:30', user: 'system' },
    { id: 'MOV-2024-007', productId: 3, productName: 'タブレット', type: 'ADJUSTMENT', quantity: 2, fromLocation: '倉庫A-03', toLocation: '倉庫A-03', reason: '破損調整', referenceNumber: 'ADJ-2024-001', date: '2024-01-15 07:00', user: '高橋' },
    { id: 'MOV-2024-008', productId: 4, productName: 'キーボード', type: 'IN', quantity: 100, fromLocation: '外部', toLocation: '倉庫B-01', reason: '初期入庫', referenceNumber: 'PO-2024-004', date: '2024-01-15 06:30', user: 'system' },
    { id: 'MOV-2024-009', productId: 5, productName: 'マウス', type: 'IN', quantity: 200, fromLocation: '外部', toLocation: '倉庫B-02', reason: '初期入庫', referenceNumber: 'PO-2024-005', date: '2024-01-15 06:00', user: 'system' },
    { id: 'MOV-2024-010', productId: 1, productName: 'ノートPC', type: 'RETURN', quantity: 5, fromLocation: '外部', toLocation: '倉庫A-01', reason: '返品処理', referenceNumber: 'RT-2024-001', date: '2024-01-15 05:30', user: '田中' }
];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadProducts();
    loadInventory();
    loadTransactions();
    loadMovements();
    initializeChart();
    setupMovementFilters();
    setupBarcodeEvents();
    checkLowStockAlerts();
    setupAutoRefresh();
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

// 商品検索機能
function searchProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    
    if (!searchTerm) {
        loadProducts(); // 検索語が空の場合は全商品を表示
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.code.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    loadProducts(filteredProducts);
}

// 商品一覧の読み込み（フィルタリング対応）
function loadProducts(filteredProducts = products) {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.code}</td>
            <td>
                <div class="d-flex align-items-center">
                    <canvas class="barcode-small" data-code="${product.code}"></canvas>
                    <button class="btn btn-sm btn-outline-secondary ms-2" onclick="showBarcodeModal('${product.code}', '${product.name}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>¥${product.price.toLocaleString()}</td>
            <td>
                <span class="badge ${getStockLevelClass(product.stockQuantity)}">
                    ${product.stockQuantity}
                </span>
            </td>
            <td>
                <span class="badge ${getStatusClass(product.status)}">
                    ${product.status}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="addStock(${product.id})">
                        <i class="fas fa-plus"></i> 入庫
                    </button>
                    <button class="btn btn-outline-warning" onclick="removeStock(${product.id})">
                        <i class="fas fa-minus"></i> 出庫
                    </button>
                    <button class="btn btn-outline-info" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // バーコードを生成
    setTimeout(() => {
        document.querySelectorAll('.barcode-small').forEach(canvas => {
            const code = canvas.getAttribute('data-code');
            try {
                JsBarcode(canvas, code, {
                    format: "CODE128",
                    width: 1,
                    height: 30,
                    displayValue: false,
                    margin: 2
                });
            } catch (error) {
                console.error('バーコード生成エラー:', error);
            }
        });
    }, 100);
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

// 移動履歴の読み込み
function loadMovements() {
    const tbody = document.getElementById('movementsTableBody');
    tbody.innerHTML = '';

    movements.forEach(movement => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movement.id}</td>
            <td>${movement.productName}</td>
            <td><span class="badge ${getMovementTypeClass(movement.type)}">${movement.type}</span></td>
            <td>${movement.quantity}</td>
            <td>${movement.fromLocation}</td>
            <td>${movement.toLocation}</td>
            <td>${movement.reason}</td>
            <td>${movement.referenceNumber}</td>
            <td>${movement.date}</td>
            <td>${movement.user}</td>
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

// 移動履歴フィルターのセットアップ
function setupMovementFilters() {
    const searchInput = document.getElementById('movementSearch');
    const typeFilter = document.getElementById('movementTypeFilter');

    searchInput.addEventListener('input', filterMovements);
    typeFilter.addEventListener('change', filterMovements);
}

// 移動履歴のフィルタリング
function filterMovements() {
    const searchTerm = document.getElementById('movementSearch').value.toLowerCase();
    const typeFilter = document.getElementById('movementTypeFilter').value;

    const filteredMovements = movements.filter(movement => {
        const matchesSearch = movement.productName.toLowerCase().includes(searchTerm) ||
                             movement.id.toLowerCase().includes(searchTerm) ||
                             movement.referenceNumber.toLowerCase().includes(searchTerm);
        const matchesType = typeFilter === '' || movement.type === typeFilter;

        return matchesSearch && matchesType;
    });

    loadMovements(filteredMovements);
}

// フィルターのクリア
function clearMovementFilters() {
    document.getElementById('movementSearch').value = '';
    document.getElementById('movementTypeFilter').value = '';
    loadMovements();
}

// バーコード関連のイベント設定
function setupBarcodeEvents() {
    const productCodeInput = document.getElementById('productCode');
    const productSearchInput = document.getElementById('productSearch');
    const manualBarcodeInput = document.getElementById('manualBarcodeInput');
    
    if (productCodeInput) {
        productCodeInput.addEventListener('input', updateBarcode);
        productCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('productName').focus();
            }
        });
    }
    
    if (productSearchInput) {
        productSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchProducts();
            }
        });
    }
    
    if (manualBarcodeInput) {
        manualBarcodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                processManualBarcode();
            }
        });
    }
}

// バーコードスキャン機能
function scanBarcode() {
    // バーコード読み取りモーダルを表示
    const modal = new bootstrap.Modal(document.getElementById('barcodeScannerModal'));
    modal.show();
    
    // モーダルが表示されたらカメラを自動開始
    document.getElementById('barcodeScannerModal').addEventListener('shown.bs.modal', function () {
        startCamera();
    });
}

// カメラ開始
function startCamera() {
    const video = document.getElementById('scannerVideo');
    const status = document.getElementById('scannerStatus');
    const startBtn = document.getElementById('startCameraBtn');
    const stopBtn = document.getElementById('stopCameraBtn');
    
    status.innerHTML = '<small class="text-info">カメラを起動中...</small>';
    
    // Quagga.jsを使用してバーコード読み取りを開始
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: video,
            constraints: {
                width: { min: 640 },
                height: { min: 480 },
                facingMode: "environment" // 背面カメラを使用
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
            readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "upc_reader",
                "upc_e_reader"
            ]
        },
        locate: true
    }, function(err) {
        if (err) {
            console.error('Quagga初期化エラー:', err);
            status.innerHTML = '<small class="text-danger">カメラの起動に失敗しました</small>';
            return;
        }
        
        status.innerHTML = '<small class="text-success">カメラが起動しました。バーコードをカメラに向けてください</small>';
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
        
        // バーコード検出時の処理
        Quagga.onDetected(function(result) {
            const code = result.codeResult.code;
            processScannedBarcode(code);
        });
    });
    
    Quagga.start();
}

// カメラ停止
function stopCamera() {
    Quagga.stop();
    
    const status = document.getElementById('scannerStatus');
    const startBtn = document.getElementById('startCameraBtn');
    const stopBtn = document.getElementById('stopCameraBtn');
    
    status.innerHTML = '<small class="text-muted">カメラが停止しました</small>';
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
}

// スキャンされたバーコードを処理
function processScannedBarcode(code) {
    const scanResult = document.getElementById('scanResult');
    const useBtn = document.getElementById('useBarcodeBtn');
    
    if (!code) {
        scanResult.innerHTML = '<small class="text-danger">バーコードが読み取れませんでした</small>';
        return;
    }
    
    // 商品を検索
    const product = products.find(p => p.code === code);
    
    if (product) {
        scanResult.innerHTML = `
            <div class="text-success">
                <strong>商品が見つかりました</strong><br>
                <small>商品名: ${product.name}</small><br>
                <small>カテゴリ: ${product.category}</small><br>
                <small>価格: ¥${product.price.toLocaleString()}</small><br>
                <small>在庫: ${product.stockQuantity}個</small>
            </div>
        `;
    } else {
        scanResult.innerHTML = `
            <div class="text-warning">
                <strong>商品が見つかりません</strong><br>
                <small>コード: ${code}</small><br>
                <small>新規商品として登録できます</small>
            </div>
        `;
    }
    
    // 読み取ったコードを保存
    scanResult.setAttribute('data-scanned-code', code);
    useBtn.style.display = 'inline-block';
    
    // カメラを停止
    stopCamera();
}

// 手動入力バーコードを処理
function processManualBarcode() {
    const input = document.getElementById('manualBarcodeInput');
    const code = input.value.trim();
    
    if (code) {
        processScannedBarcode(code);
        input.value = ''; // 入力フィールドをクリア
    } else {
        alert('バーコードを入力してください。');
    }
}

// スキャンされたバーコードを使用
function useScannedBarcode() {
    const scanResult = document.getElementById('scanResult');
    const code = scanResult.getAttribute('data-scanned-code');
    
    if (code) {
        // 商品登録フォームにコードを設定
        document.getElementById('productCode').value = code;
        updateBarcode();
        
        // モーダルを閉じる
        const modal = bootstrap.Modal.getInstance(document.getElementById('barcodeScannerModal'));
        modal.hide();
        
        // 商品登録モーダルを開く
        showAddProductModal();
    }
}

// 在庫アラートチェック
function checkLowStockAlerts() {
    const lowStockProducts = products.filter(product => 
        product.stockQuantity <= product.minStockLevel
    );
    
    const alertBadge = document.getElementById('alertBadge');
    if (lowStockProducts.length > 0) {
        alertBadge.textContent = lowStockProducts.length;
        alertBadge.style.display = 'inline-block';
        
        // アラートを表示
        showAlert(`在庫不足商品が${lowStockProducts.length}件あります`, 'warning');
    } else {
        alertBadge.style.display = 'none';
    }
}

// アラート表示
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();
    
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" id="${alertId}" role="alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'danger' ? 'times-circle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    
    // 5秒後に自動削除
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// 自動更新設定
function setupAutoRefresh() {
    // 30秒ごとに在庫アラートをチェック
    setInterval(checkLowStockAlerts, 30000);
    
    // 1分ごとにダッシュボードを更新
    setInterval(() => {
        initializeDashboard();
        loadProducts();
    }, 60000);
}

// 一括入庫モーダル表示
function showBulkStockModal() {
    const select = document.getElementById('bulkProductSelect');
    select.innerHTML = '<option value="">商品を選択してください</option>';
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.code} - ${product.name} (現在: ${product.stockQuantity}個)`;
        select.appendChild(option);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('bulkStockModal'));
    modal.show();
}

// 一括出庫モーダル表示
function showBulkOutModal() {
    const select = document.getElementById('bulkOutProductSelect');
    select.innerHTML = '<option value="">商品を選択してください</option>';
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.code} - ${product.name} (現在: ${product.stockQuantity}個)`;
        select.appendChild(option);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('bulkOutModal'));
    modal.show();
}

// 一括入庫実行
function executeBulkStock() {
    const productId = parseInt(document.getElementById('bulkProductSelect').value);
    const quantity = parseInt(document.getElementById('bulkQuantity').value);
    const reason = document.getElementById('bulkReason').value;
    const notes = document.getElementById('bulkNotes').value;
    
    if (!productId || !quantity) {
        showAlert('商品と数量を選択してください', 'danger');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product) {
        product.stockQuantity += quantity;
        
        // 移動履歴を追加
        const movement = {
            id: `MOV-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            type: 'IN',
            quantity: quantity,
            fromLocation: '外部',
            toLocation: '倉庫A-01',
            reason: reason,
            referenceNumber: `BULK-IN-${Date.now()}`,
            date: new Date().toLocaleString('ja-JP'),
            user: 'ユーザー',
            notes: notes
        };
        movements.unshift(movement);
        
        // 画面を更新
        loadProducts();
        loadInventory();
        loadMovements();
        initializeDashboard();
        checkLowStockAlerts();
        
        // モーダルを閉じる
        const modal = bootstrap.Modal.getInstance(document.getElementById('bulkStockModal'));
        modal.hide();
        
        showAlert(`${product.name}に${quantity}個入庫しました`, 'success');
    }
}

// 一括出庫実行
function executeBulkOut() {
    const productId = parseInt(document.getElementById('bulkOutProductSelect').value);
    const quantity = parseInt(document.getElementById('bulkOutQuantity').value);
    const reason = document.getElementById('bulkOutReason').value;
    const notes = document.getElementById('bulkOutNotes').value;
    
    if (!productId || !quantity) {
        showAlert('商品と数量を選択してください', 'danger');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product) {
        if (quantity > product.stockQuantity) {
            showAlert('在庫数を超える出庫はできません', 'danger');
            return;
        }
        
        product.stockQuantity -= quantity;
        
        // 移動履歴を追加
        const movement = {
            id: `MOV-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            type: 'OUT',
            quantity: quantity,
            fromLocation: '倉庫A-01',
            toLocation: '外部',
            reason: reason,
            referenceNumber: `BULK-OUT-${Date.now()}`,
            date: new Date().toLocaleString('ja-JP'),
            user: 'ユーザー',
            notes: notes
        };
        movements.unshift(movement);
        
        // 画面を更新
        loadProducts();
        loadInventory();
        loadMovements();
        initializeDashboard();
        checkLowStockAlerts();
        
        // モーダルを閉じる
        const modal = bootstrap.Modal.getInstance(document.getElementById('bulkOutModal'));
        modal.hide();
        
        showAlert(`${product.name}から${quantity}個出庫しました`, 'success');
    }
}

// 在庫レポート表示
function showInventoryReport() {
    const lowStockProducts = products.filter(p => p.stockQuantity <= p.minStockLevel);
    const outOfStockProducts = products.filter(p => p.stockQuantity === 0);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);
    
    const reportHtml = `
        <div class="modal fade" id="inventoryReportModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">在庫レポート</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <h3 class="text-primary">${products.length}</h3>
                                        <p>総商品数</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <h3 class="text-warning">${lowStockProducts.length}</h3>
                                        <p>在庫不足</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <h3 class="text-danger">${outOfStockProducts.length}</h3>
                                        <p>在庫切れ</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h6>総在庫価値: ¥${totalValue.toLocaleString()}</h6>
                        </div>
                        ${lowStockProducts.length > 0 ? `
                        <div class="mt-3">
                            <h6>在庫不足商品</h6>
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>商品コード</th>
                                            <th>商品名</th>
                                            <th>現在在庫</th>
                                            <th>最小在庫</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${lowStockProducts.map(p => `
                                            <tr class="stock-warning">
                                                <td>${p.code}</td>
                                                <td>${p.name}</td>
                                                <td>${p.stockQuantity}</td>
                                                <td>${p.minStockLevel}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
                        <button type="button" class="btn btn-primary" onclick="printInventoryReport()">
                            <i class="fas fa-print me-1"></i>印刷
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('inventoryReportModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 新しいモーダルを追加
    document.body.insertAdjacentHTML('beforeend', reportHtml);
    
    const modal = new bootstrap.Modal(document.getElementById('inventoryReportModal'));
    modal.show();
}

// 在庫レポート印刷
function printInventoryReport() {
    const printWindow = window.open('', '_blank');
    const lowStockProducts = products.filter(p => p.stockQuantity <= p.minStockLevel);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>在庫レポート</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .warning { background-color: #fff3cd; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h2>在庫レポート</h2>
            <p>作成日時: ${new Date().toLocaleString('ja-JP')}</p>
            
            <h3>概要</h3>
            <ul>
                <li>総商品数: ${products.length}</li>
                <li>在庫不足商品: ${lowStockProducts.length}</li>
                <li>総在庫価値: ¥${totalValue.toLocaleString()}</li>
            </ul>
            
            ${lowStockProducts.length > 0 ? `
            <h3>在庫不足商品一覧</h3>
            <table>
                <thead>
                    <tr>
                        <th>商品コード</th>
                        <th>商品名</th>
                        <th>現在在庫</th>
                        <th>最小在庫</th>
                    </tr>
                </thead>
                <tbody>
                    ${lowStockProducts.map(p => `
                        <tr class="warning">
                            <td>${p.code}</td>
                            <td>${p.name}</td>
                            <td>${p.stockQuantity}</td>
                            <td>${p.minStockLevel}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : ''}
            
            <div class="no-print" style="margin-top: 20px;">
                <button onclick="window.print()">印刷</button>
                <button onclick="window.close()">閉じる</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// 在庫アラート表示
function showLowStockAlert() {
    const lowStockProducts = products.filter(p => p.stockQuantity <= p.minStockLevel);
    
    if (lowStockProducts.length === 0) {
        showAlert('在庫不足の商品はありません', 'info');
        return;
    }
    
    const alertHtml = `
        <div class="modal fade" id="lowStockAlertModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">在庫不足アラート</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            在庫不足の商品が${lowStockProducts.length}件あります
                        </div>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>商品コード</th>
                                        <th>商品名</th>
                                        <th>現在在庫</th>
                                        <th>最小在庫</th>
                                        <th>ステータス</th>
                                        <th>アクション</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${lowStockProducts.map(p => `
                                        <tr class="${p.stockQuantity === 0 ? 'stock-danger' : 'stock-warning'}">
                                            <td>${p.code}</td>
                                            <td>${p.name}</td>
                                            <td>${p.stockQuantity}</td>
                                            <td>${p.minStockLevel}</td>
                                            <td>
                                                <span class="badge ${p.stockQuantity === 0 ? 'bg-danger' : 'bg-warning'}">
                                                    ${p.stockQuantity === 0 ? '在庫切れ' : '在庫不足'}
                                                </span>
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-success" onclick="quickStockIn(${p.id})">
                                                    <i class="fas fa-plus"></i> 入庫
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
                        <button type="button" class="btn btn-primary" onclick="showBulkStockModal()">
                            <i class="fas fa-boxes me-1"></i>一括入庫
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('lowStockAlertModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 新しいモーダルを追加
    document.body.insertAdjacentHTML('beforeend', alertHtml);
    
    const modal = new bootstrap.Modal(document.getElementById('lowStockAlertModal'));
    modal.show();
}

// クイック入庫
function quickStockIn(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const quantity = prompt(`${product.name}の入庫数量を入力してください:`, '10');
        if (quantity && !isNaN(quantity)) {
            const qty = parseInt(quantity);
            product.stockQuantity += qty;
            
            // 移動履歴を追加
            const movement = {
                id: `MOV-${Date.now()}`,
                productId: product.id,
                productName: product.name,
                type: 'IN',
                quantity: qty,
                fromLocation: '外部',
                toLocation: '倉庫A-01',
                reason: '在庫補充',
                referenceNumber: `QUICK-IN-${Date.now()}`,
                date: new Date().toLocaleString('ja-JP'),
                user: 'ユーザー'
            };
            movements.unshift(movement);
            
            // 画面を更新
            loadProducts();
            loadInventory();
            loadMovements();
            initializeDashboard();
            checkLowStockAlerts();
            
            showAlert(`${product.name}に${qty}個入庫しました`, 'success');
        }
    }
}

// バーコード自動生成
function generateBarcode() {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const generatedCode = `PC${timestamp.slice(-6)}${randomNum}`;
    
    document.getElementById('productCode').value = generatedCode;
    updateBarcode();
}

// バーコード更新
function updateBarcode() {
    const productCode = document.getElementById('productCode').value;
    const barcodeContainer = document.getElementById('barcodeContainer');
    const barcodeDisplay = document.getElementById('barcodeDisplay');
    const printBtn = document.getElementById('printBarcodeBtn');
    
    if (productCode) {
        // 既存のバーコードをクリア
        barcodeContainer.innerHTML = '';
        
        // 新しいバーコードを生成
        const canvas = document.createElement('canvas');
        barcodeContainer.appendChild(canvas);
        
        try {
            JsBarcode(canvas, productCode, {
                format: "CODE128",
                width: 2,
                height: 50,
                displayValue: true,
                fontSize: 12,
                margin: 5
            });
            
            barcodeDisplay.innerHTML = `<strong>${productCode}</strong>`;
            printBtn.style.display = 'inline-block';
        } catch (error) {
            barcodeContainer.innerHTML = '<small class="text-danger">バーコード生成エラー</small>';
            printBtn.style.display = 'none';
        }
    } else {
        barcodeContainer.innerHTML = '';
        barcodeDisplay.innerHTML = '<small class="text-muted">商品コードを入力するとバーコードが表示されます</small>';
        printBtn.style.display = 'none';
    }
}

// バーコード印刷
function printBarcode() {
    const productCode = document.getElementById('productCode').value;
    const productName = document.getElementById('productName').value || '商品名未設定';
    
    if (!productCode) {
        alert('商品コードが入力されていません。');
        return;
    }
    
    // 印刷用ウィンドウを作成
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>バーコード印刷 - ${productCode}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .barcode-container { text-align: center; margin: 20px 0; }
                .product-info { margin: 10px 0; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        </head>
        <body>
            <div class="barcode-container">
                <div class="product-info">
                    <h3>${productName}</h3>
                    <p>商品コード: ${productCode}</p>
                </div>
                <canvas id="barcode"></canvas>
            </div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()">印刷</button>
                <button onclick="window.close()">閉じる</button>
            </div>
            <script>
                JsBarcode("#barcode", "${productCode}", {
                    format: "CODE128",
                    width: 3,
                    height: 80,
                    displayValue: true,
                    fontSize: 16,
                    margin: 10
                });
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// バーコード詳細モーダル表示
function showBarcodeModal(productCode, productName) {
    document.getElementById('barcodeProductName').textContent = productName;
    document.getElementById('barcodeProductCode').textContent = `商品コード: ${productCode}`;
    
    // バーコードを生成
    const canvas = document.getElementById('barcodeDetailCanvas');
    canvas.innerHTML = '';
    
    try {
        JsBarcode(canvas, productCode, {
            format: "CODE128",
            width: 3,
            height: 100,
            displayValue: true,
            fontSize: 18,
            margin: 15
        });
        
        const modal = new bootstrap.Modal(document.getElementById('barcodeDetailModal'));
        modal.show();
    } catch (error) {
        alert('バーコード生成エラー: ' + error.message);
    }
}

// バーコード詳細印刷
function printBarcodeDetail() {
    const productCode = document.getElementById('barcodeProductCode').textContent.split(': ')[1];
    const productName = document.getElementById('barcodeProductName').textContent;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>バーコード印刷 - ${productCode}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .barcode-container { text-align: center; margin: 20px 0; }
                .product-info { margin: 10px 0; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        </head>
        <body>
            <div class="barcode-container">
                <div class="product-info">
                    <h3>${productName}</h3>
                    <p>商品コード: ${productCode}</p>
                </div>
                <canvas id="barcode"></canvas>
            </div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()">印刷</button>
                <button onclick="window.close()">閉じる</button>
            </div>
            <script>
                JsBarcode("#barcode", "${productCode}", {
                    format: "CODE128",
                    width: 3,
                    height: 80,
                    displayValue: true,
                    fontSize: 16,
                    margin: 10
                });
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// バーコードダウンロード
function downloadBarcode() {
    const canvas = document.getElementById('barcodeDetailCanvas');
    const productCode = document.getElementById('barcodeProductCode').textContent.split(': ')[1];
    
    // キャンバスを画像としてダウンロード
    const link = document.createElement('a');
    link.download = `barcode_${productCode}.png`;
    link.href = canvas.toDataURL();
    link.click();
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

            // 移動履歴を追加
            const movement = {
                id: `MOV-${Date.now()}`,
                productId: product.id,
                productName: product.name,
                type: 'IN',
                quantity: qty,
                fromLocation: '外部',
                toLocation: '倉庫A-01',
                reason: '入庫処理',
                referenceNumber: `IN-${Date.now()}`,
                date: new Date().toLocaleString('ja-JP'),
                user: 'ユーザー'
            };
            movements.unshift(movement);

            loadProducts();
            loadInventory();
            loadTransactions();
            loadMovements();
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

            // 移動履歴を追加
            const movement = {
                id: `MOV-${Date.now()}`,
                productId: product.id,
                productName: product.name,
                type: 'OUT',
                quantity: qty,
                fromLocation: '倉庫A-01',
                toLocation: '外部',
                reason: '出庫処理',
                referenceNumber: `OUT-${Date.now()}`,
                date: new Date().toLocaleString('ja-JP'),
                user: 'ユーザー'
            };
            movements.unshift(movement);

            loadProducts();
            loadInventory();
            loadTransactions();
            loadMovements();
            initializeDashboard();
            alert('出庫が完了しました。');
        }
    }
}

// 移動履歴の読み込み (フィルタリングされたデータを渡す)
function loadMovements(filteredMovements = movements) {
    const tbody = document.getElementById('movementsTableBody');
    tbody.innerHTML = '';

    filteredMovements.forEach(movement => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.onclick = () => showMovementDetail(movement);
        row.innerHTML = `
            <td>${movement.id}</td>
            <td>${movement.productName}</td>
            <td><span class="badge ${getMovementTypeClass(movement.type)}">${getMovementTypeText(movement.type)}</span></td>
            <td>${movement.quantity}</td>
            <td>${movement.fromLocation}</td>
            <td>${movement.toLocation}</td>
            <td>${movement.reason}</td>
            <td>${movement.referenceNumber}</td>
            <td>${movement.date}</td>
            <td>${movement.user}</td>
        `;
        tbody.appendChild(row);
    });
}

// 移動履歴詳細の表示
function showMovementDetail(movement) {
    document.getElementById('detailMovementId').textContent = movement.id;
    document.getElementById('detailProductName').textContent = movement.productName;
    document.getElementById('detailMovementType').innerHTML = `<span class="badge ${getMovementTypeClass(movement.type)}">${getMovementTypeText(movement.type)}</span>`;
    document.getElementById('detailQuantity').textContent = movement.quantity;
    document.getElementById('detailFromLocation').textContent = movement.fromLocation;
    document.getElementById('detailToLocation').textContent = movement.toLocation;
    document.getElementById('detailReason').textContent = movement.reason;
    document.getElementById('detailReferenceNumber').textContent = movement.referenceNumber;
    document.getElementById('detailDate').textContent = movement.date;
    document.getElementById('detailUser').textContent = movement.user;
    document.getElementById('detailNotes').textContent = movement.notes || 'なし';

    // 移動経路の表示
    const pathElement = document.getElementById('movementPath');
    pathElement.innerHTML = `
        <div class="d-flex align-items-center justify-content-between">
            <div class="text-center">
                <i class="fas fa-warehouse fa-2x text-primary"></i>
                <div class="mt-1">${movement.fromLocation}</div>
            </div>
            <div class="flex-grow-1 text-center">
                <i class="fas fa-arrow-right fa-2x text-success"></i>
                <div class="mt-1">${movement.quantity}個</div>
            </div>
            <div class="text-center">
                <i class="fas fa-warehouse fa-2x text-success"></i>
                <div class="mt-1">${movement.toLocation}</div>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('movementDetailModal'));
    modal.show();
}

// 移動履歴タイプのクラス取得
function getMovementTypeClass(type) {
    switch (type) {
        case 'IN': return 'bg-success';
        case 'OUT': return 'bg-warning';
        case 'TRANSFER': return 'bg-info';
        case 'ADJUSTMENT': return 'bg-secondary';
        case 'RETURN': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

// 移動履歴タイプのテキスト取得
function getMovementTypeText(type) {
    switch (type) {
        case 'IN': return '入庫';
        case 'OUT': return '出庫';
        case 'TRANSFER': return '移動';
        case 'ADJUSTMENT': return '調整';
        case 'RETURN': return '返品';
        default: return type;
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