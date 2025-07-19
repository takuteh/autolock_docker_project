# autolock_docker_project
autolockの環境をdockerに移植するプロジェクト
## システム構成
<img width="986" height="535" alt="スクリーンショット 2025-07-19 23 07 36" src="https://github.com/user-attachments/assets/3a0c5ce6-b46a-487b-bcca-cc97a81e76b2" />

※コンテナ間で連携するため、コンテナは全て共通のブリッジネットワークに属する
### Node.Js+Expressコンテナ  
- オートロックの操作をLINEやSlack等のアプリで行うためwebhookを受信する部分や設定変更を行うwebアプリの配信を担当する  
- Expressでサーバーを起動し、3000番ポートで待ち受けている  
- 3000番ポートはホストの3000番ポートにマッピングしている  
### MQTT Brokerコンテナ  
- 内部のAPIはMQTTで実装しているため、NginxとAutolockのデータ送受信、ローカルでのMQTT送受信の中継をしている  
- 1883番ポートはホストの1883番ポートにマッピングしている  
### Autolockコンテナ  
- オートロックのメイン処理を担当している  
- 設定を保存するため永続化ボリュームを作成する
- GPIO制御のため、特権モードで起動する   
### 認証DBコンテナ  
- ユーザー認証を担当している  
- ユーザー情報は永続化ボリュームで保持する
