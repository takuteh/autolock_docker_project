const express = require("express");
const app = express();

const webhookRoutes = require("./webhook");
const config = require("./config");
const mqttClient = require("./mqtt_client");
// 最初にクローンファイルを読み込んで設定取得
config.setConfigFile("../etc/clone_autolock_setting.json");

mqttClient
  .init()
  .then(() => {
    console.log("MQTT client initialized and ready to publish.");
    // 必要があればここで初回の publish など
  })
  .catch((err) => {
    console.error("Failed to initialize MQTT client:", err);
  });

app.use(express.json());

app.use("/webhook", webhookRoutes);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
