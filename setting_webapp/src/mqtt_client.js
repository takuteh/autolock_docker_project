const mqtt = require("mqtt");
const config = require("./config");

let mqttClient = null;

async function init() {
  const initialConfig = config.getConfig();
  let broker = initialConfig.mqtt.broker_address;

  // mqtt:// が先頭についていなければ追加
  if (!broker.startsWith("mqtt://")) {
    broker = "mqtt://" + broker;
  }
  console.log(broker);
  mqttClient = mqtt.connect(broker);

  const sub_topic = initialConfig.mqtt.publish.boot.topic;

  return new Promise((resolve, reject) => {
    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");

      mqttClient.subscribe(sub_topic, (err) => {
        if (err) {
          console.error("Subscribe error:", err);
          reject(err);
        } else {
          console.log(`Subscribed to topic: ${sub_topic}`);
          resolve(); // 初期化完了
        }
      });
    });

    mqttClient.on("message", async (topic, message) => {
      console.log(`Message received on ${topic}: ${message.toString("utf8")}`);
      try {
        const data = JSON.parse(message.toString("utf8"));
        await config.setConfig(data);
        console.log("Parsed and saved JSON:", data);
      } catch (e) {
        console.error("Invalid JSON:", e.message);
      }
    });
  });
}

function publish(topic, message) {
  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(topic, message);
    console.log("Publish");
  } else {
    console.error("MQTT client not connected. Cannot publish.");
  }
}

module.exports = { init, publish };
