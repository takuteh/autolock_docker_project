const _ = require("lodash");
const express = require("express");
const router = express.Router();
const config_class = require("./config");
const pool = require("./db");

//webappからPOSTされた設定内容をautolock_setting.jsonにmerge
router.post("/post", (req, res) => {
  try {
    const newData = req.body;
    convertStringBools(newData);
    const currentData = config_class.getConfig();
    const mergedData = _.merge({}, currentData, newData);
    config_class.setConfig(mergedData);
    res.status(200).json(mergedData);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "設定ファイルの更新に失敗しました", detail: err.message });
  }
}); 

//autolock_setting.jsonの内容をすべて返す
router.get("/get", (req, res) => {
  try {
    const config = config_class.getConfig();
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "設定ファイルの取得に失敗しました",
      detail: err.message,
    });
  }
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
      //user_name が未定義 or 空文字ならスキップ
      if (!user.user_name || user.user_name.trim() === "") {
        console.warn("スキップ: user_name が未定義または空です");
        continue;
      }

      if (user.is_deleted === true) {
        await conn.query("DELETE FROM users WHERE id = ?", [user.id]);
        console.log(`削除: ${user.user_name}`);
        continue;
      }
      // ① 名前が存在するかチェック
      const [rows] = await conn.query(
        "SELECT id FROM users WHERE id = ? LIMIT 1",
        [user.id],
      );

      const startDate = toMySQLDatetime(user.start_date);
      const endDate = toMySQLDatetime(user.end_date);

      if (rows.length) {
        // ② 存在 → UPDATE
        console.log("ユーザーが更新されました");
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
          ],
        );
      } else {
        // ③ 無い → INSERT
        console.log("ユーザーが追加されました");
        await conn.query(
          `INSERT INTO users (user_name, line_id, slack_id, start_date, end_date)
           VALUES (?, ?, ?, ?, ?)`,
          [user.user_name, user.line_id, user.slack_id, startDate, endDate],
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

//bool値にもダブルクォートがついてるので外す
function convertStringBools(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      convertStringBools(obj[key]); // 再帰的に
    } else if (obj[key] === "true") {
      obj[key] = true;
    } else if (obj[key] === "false") {
      obj[key] = false;
    }
  }
}

module.exports = router;
