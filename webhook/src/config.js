const fs = require("fs");
const path = require("path");

let sharedContent = null;
let config_file = path.resolve(__dirname, "../etc/clone_autolock_setting.json");

function setConfigFile(filename) {
  config_file = path.resolve(__dirname, filename);
}

function setConfig(cfg) {
  sharedContent = cfg;
  fs.writeFileSync(config_file, JSON.stringify(cfg, null, 2), "utf8");
}

function getConfig() {
  if (sharedContent) {
    return sharedContent;
  }
  if (!fs.existsSync(config_file)) {
    sharedContent = {}; // ファイル無ければ空オブジェクト
    console.log("file not exist!");
    return sharedContent;
  }
  const data = fs.readFileSync(config_file, "utf8");
  sharedContent = JSON.parse(data);
  console.log(sharedContent);
  return sharedContent;
}

module.exports = { setConfig, getConfig, setConfigFile };
