FROM node:20.11.1
WORKDIR /app

# 必要なファイルを先にコピー
COPY . .

# npm 依存関係をインストール
RUN npm install

# エントリポイントを指定
CMD ["npm", "start"]
