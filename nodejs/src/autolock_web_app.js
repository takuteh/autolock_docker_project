const fs = require("fs");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const mqtt_client = require("./mqtt_client");
const config_class = require("./config");
const pool = require("./db");

const config = config_class.getConfig();

router.post("/post", (req, res) => {
  let currentData = {};
  const newData = req.body;
  console.log(newData);
  mqtt_client.publish(
    config.mqtt.subscribe.change_config.topic,
    JSON.stringify(newData)
  );
  res.send(config.mqtt.subscribe.change_config.topic);
  //res.sendStatus(200);
});

router.get("/get", (req, res) => {
  fs.readFile("/app/etc/clone_autolock_setting.json", "utf8", (err, data) => {
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

router.get("/users/get", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error", detail: err.message });
  }
});

router.post("/users/post", async (req, res) => {
  const payload = Array.isArray(req.body) ? req.body : [req.body];

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    for (const user of payload) {
      // 🔒 user_name が未定義 or 空文字ならスキップ
      if (!user.user_name || user.user_name.trim() === "") {
        console.warn("スキップ: user_name が未定義または空です");
        continue;
      }
      // 削除対象かチェック
      console.log(user.is_deleted);
      if (user.is_deleted === true) {
        await conn.query("DELETE FROM users WHERE id = ?", [user.id]);
        console.log(`削除: ${user.user_name}`);
        continue;
      }
      // ① 名前が存在するかチェック
      const [rows] = await conn.query(
        "SELECT id FROM users WHERE id = ? LIMIT 1",
        [user.id]
      );

      const startDate = toMySQLDatetime(user.start_date);
      const endDate = toMySQLDatetime(user.end_date);

      if (rows.length) {
        // ② 存在 → UPDATE
        await conn.query(
          `UPDATE users
             SET user_name   =?,
                 line_id    = ?,
                 slack_id   = ?,
                 start_date = ?,
                 end_date   = ?
           WHERE id  = ?`,
          [
            user.user_name,
            user.line_id,
            user.slack_id,
            startDate,
            endDate,
            user.id,
          ]
        );
      } else {
        // ③ 無い → INSERT
        await conn.query(
          `INSERT INTO users (user_name, line_id, slack_id, start_date, end_date)
           VALUES (?, ?, ?, ?, ?)`,
          [user.user_name, user.line_id, user.slack_id, startDate, endDate]
        );
      }
    }

    await conn.commit();
    res.status(200).json({ message: "upsert 完了" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "DB error", detail: err.message });
  } finally {
    conn.release();
  }
});

function toMySQLDatetime(dateString) {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19).replace("T", " ");
}

module.exports = router;
