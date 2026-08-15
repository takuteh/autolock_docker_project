// db.js
const mysql = require("mysql2/promise");
const config_class = require("./config");
config_class.setConfigFile("../etc/authorize_db_setting.json");

const db_config = config_class.getConfig();

const pool = mysql.createPool({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
});

module.exports = pool;
