// db.js
const mysql = require("mysql2/promise");
const config_class = require("./config");

const AUTHDB_CONFIG_FILE = "../etc/authorize_db_setting.json";
const db_config = config_class.getConfig(AUTHDB_CONFIG_FILE);


const pool = mysql.createPool({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
});

console.log(pool);
module.exports = pool;
