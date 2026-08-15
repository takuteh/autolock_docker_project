const express = require("express");
const app = express();


const config = require("./config");
config.setConfigFile("../etc/autolock_setting.json");

const webhookRoutes = require("./webhook");
app.use(express.json());

app.use("/webhook", webhookRoutes);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
