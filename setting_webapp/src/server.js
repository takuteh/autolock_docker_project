const express = require("express");
const app = express();

const webappRoutes = require("./autolock_web_app.js");
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

// public フォルダを静的公開
app.use("/webapp", express.static("/app/autolock_setting_webapp"));
app.use("/webapp_end", webappRoutes);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
