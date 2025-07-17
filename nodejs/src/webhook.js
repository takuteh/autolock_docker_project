const express = require("express");
const router = express.Router();
const mqtt_client = require("./mqtt_client");
const config_class = require("./config");

const config = config_class.getConfig();

router.post("/line", (req, res) => {
  const events = req.body?.events;

  if (!Array.isArray(events)) {
    console.log("Invalid format, ignoring.");
    return res.status(400).json({ error: "Invalid LINE webhook format" });
  }

  if (
    req.body.events?.[0]?.type === "message" &&
    req.body.events?.[0]?.message?.type === "text"
  ) {
    const line_user_id = req.body.events[0]?.source?.userId;
    const line_message = check_operation(req.body.events[0].message?.text);

    //送信用のjsonに整形
    const send_message = JSON.stringify({
      app: "line",
      line_id: line_user_id,
      message: line_message.operation_mes,
    });
    mqtt_client.publish(line_message.topic, send_message);
  }
  res.sendStatus(200);
});

function check_operation(message) {
  let result = {
    topic: "",
    operation_mes: "",
  };
  console.log(message);
  if (message === "open") {
    result.topic = config.mqtt.subscribe.open.topic;
    result.operation_mes = config.mqtt.subscribe.open.message;
  } else if (message === "close") {
    result.topic = config.mqtt.subscribe.close.topic;
    result.operation_mes = config.mqtt.subscribe.close.message;
  } else if (message === "relay_on") {
    result.topic = config.mqtt.subscribe.relay_on.topic;
    result.operation_mes = config.mqtt.subscribe.relay_on.message;
  } else if (message === "relay_off") {
    result.topic = config.mqtt.subscribe.relay_off.topic;
    result.operation_mes = config.mqtt.subscribe.relay_off.message;
  }
  return result;
}

module.exports = router;
