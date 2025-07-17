const fs = require("fs");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const mqtt_client = require("./mqtt_client");

router.post("/post", (req, res) => {
  let currentData = {};
  const newData = req.body;
  console.log(newData);
  mqtt_client.publish("test", JSON.stringify(newData));
  res.sendStatus(200);
});

router.get("/get", (req, res) => {
  fs.readFile("./autolock_setting.json", "utf8", (err, data) => {
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

module.exports = router;
