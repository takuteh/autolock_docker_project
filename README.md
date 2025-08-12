# autolock_docker_project

## システム構成
<img width="791" height="573" alt="スクリーンショット 2025-08-09 10 10 54" src="https://github.com/user-attachments/assets/f023740d-2a84-4ce0-963a-b57c1e3a6f9e" />

※コンテナ間で連携するため、コンテナは全て共通のブリッジネットワークに属する
### Node.Js+Express(webhook処理)コンテナ   
- オートロックの操作をLINEやSlack等のアプリで行うためwebhookを受信する部分を担当する  
- Expressでサーバーを起動し、3000番ポートで待ち受けている  
- 3000番ポートはホストの3000番ポートにマッピングしている  
### Node.Js+Express(設定用webアプリ配信)コンテナ 
- オートロックの設定を行うwebアプリの配信を担当する  
- Expressでサーバーを起動し、3000番ポートで待ち受けている  
- 3000番ポートはホストの8080番ポートにマッピングしている
- 重要なアプリのため、ローカルのみの配信としている
### MQTT Brokerコンテナ  
- 内部のAPIはMQTTで実装しているため、NginxとAutolockのデータ送受信、ローカルでのMQTT送受信の中継をしている  
- 1883番ポートはホストの1883番ポートにマッピングしている    
### 認証DBコンテナ  
- ユーザー認証を担当している  
- ユーザー情報は永続化ボリュームで保持する
### Autolockコンテナ  
- オートロックのメイン処理を担当している  
- 設定を保存するため永続化ボリュームを作成する
- GPIO制御のため、特権モードで起動する

## 注意点
- Autolockコンテナでautolockリポジトリのcloneを行うが、設定ファイル(autolock_setting.json)のmqtt_brokerの値がデフォルト値ではlocalhostになっているため、`autolock_mqtt_broker`に修正してから起動し直す必要がある
- GPIOをAutolockコンテナが占有するため、ホストOSや他のコンテナでGPIOの使用ができない、またホストでpigpio等のGPIOを操作するライブラリ等が起動していると、うまくコンテナが動作しない可能性があるため、停止する必要がある
- ビルド前に`env_template`を`.env`にコピーし`BASE_URL`のyour_domain.comの部分をホストのipに書き換える必要がある
