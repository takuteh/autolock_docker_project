// db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
});

console.log(pool);
module.exports = pool;
