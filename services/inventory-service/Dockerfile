# マルチステージビルド: ビルドステージ
FROM openjdk:17-jdk-slim AS builder

WORKDIR /app

# Gradle Wrapperとビルド設定をコピー
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 実行権限を付与
RUN chmod +x gradlew

# 依存関係をダウンロード（キャッシュレイヤー）
RUN ./gradlew dependencies --no-daemon

# ソースコードをコピー
COPY src src

# アプリケーションをビルド
RUN ./gradlew build -x test --no-daemon

# 実行ステージ
FROM openjdk:17-jre-slim

WORKDIR /app

# ビルドされたJARファイルをコピー
COPY --from=builder /app/build/libs/inventory-service-1.0.0.jar app.jar

# ヘルスチェック用のポートを公開
EXPOSE 8080

# アプリケーション起動
CMD ["java", "-jar", "app.jar"]
