const mysql = require("mysql2/promise");

async function testDB() {
  const connection = await mysql.createConnection({
    host: "autolock_auth_db", // Dockerなら 'db' などに変える
    user: "pi",
    password: "raspberry",
    database: "autolock_user",
  });

  try {
    const [rows] = await connection.execute("SELECT * FROM users");
    console.log(rows);
  } catch (err) {
    console.error("Query error:", err);
  } finally {
    await connection.end();
  }
}

testDB();
