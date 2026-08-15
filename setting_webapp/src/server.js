const express = require("express");
const app = express();

const webappRoutes = require("./autolock_web_app.js");

const config = require("./config");
config.setConfigFile("../etc/autolock_setting.json");

app.use(express.json());

// public フォルダを静的公開
app.use("/webapp", express.static("/app/autolock_setting_webapp"));
app.use("/webapp_end", webappRoutes);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
