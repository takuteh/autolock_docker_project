FROM node:20.11.1
WORKDIR /app

# 必要なファイルを先にコピー
COPY . .

# 必要なツールをインストール
RUN apt update && apt install -y git

# スクリプトに実行権限をつける
RUN chmod +x entrypoint.sh

# Webアプリをクローン
RUN git clone https://github.com/takuteh/autolock_setting_webapp.git

# npm 依存関係をインストール
RUN npm install
RUN npm install mysql2

# エントリポイントを指定
CMD ["/bin/sh", "/app/entrypoint.sh"]
