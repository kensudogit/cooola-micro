FROM openjdk:17-jdk-slim

WORKDIR /app

# Gradle Wrapperとソースコードをコピー
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY src src

# 実行権限を付与
RUN chmod +x gradlew

# 依存関係をダウンロード
RUN ./gradlew dependencies --no-daemon

# アプリケーションをビルド
RUN ./gradlew build -x test --no-daemon

# JARファイルを実行
EXPOSE 8080
CMD ["java", "-jar", "build/libs/inventory-service-1.0.0.jar"]
