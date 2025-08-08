// db.js
const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: "autolock_auth_db",
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
});
module.exports = pool;
