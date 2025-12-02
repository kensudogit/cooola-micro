# COOOLa Micro Frontend - Vercel デプロイガイド

## 概要
このドキュメントは、COOOLa MicroフロントエンドをVercelにデプロイするための手順を説明します。

## 前提条件
- Node.js 18以上がインストールされている
- npmまたはyarnがインストールされている
- Vercelアカウントがある

## デプロイ手順

### 1. 依存関係のインストール
```bash
cd frontend
npm install
```

### 2. 本番ビルドのテスト
```bash
npm run build:vercel
```

### 3. Vercel CLIのインストール（初回のみ）
```bash
npm install -g vercel
```

### 4. Vercelにログイン
```bash
vercel login
```

### 5. プロジェクトのデプロイ
```bash
vercel
```

### 6. 本番環境へのデプロイ
```bash
vercel --prod
```

## 環境設定

### 環境変数
本番環境では以下の環境変数を設定してください：

- `NODE_ENV`: production
- `API_URL`: バックエンドAPIのURL

### カスタムドメイン
Vercelダッシュボードでカスタムドメインを設定できます。

## ビルド設定

### ビルドコマンド
```bash
npm run vercel-build
```

### 出力ディレクトリ
```
dist/cooola-micro-frontend/
```

## トラブルシューティング

### ビルドエラー
1. Node.jsのバージョンを確認（18以上が必要）
2. 依存関係を再インストール
3. キャッシュをクリア

### デプロイエラー
1. Vercel CLIのバージョンを確認
2. プロジェクトの設定を確認
3. ログを確認

## サポート
問題が発生した場合は、Vercelのドキュメントまたはサポートチームにお問い合わせください。
