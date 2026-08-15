const mqtt = require("mqtt");
const config = require("./config");

const initialConfig = config.getConfig();

let broker = initialConfig.mqtt.broker_address;

if (!broker.startsWith("mqtt://")) {
  broker = "mqtt://" + broker;
}

const mqttClient = mqtt.connect(broker);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
});

mqttClient.on("error", (err) => {
  console.error("MQTT error:", err);
});

function publish(topic, message) {
  if (mqttClient.connected) {
    mqttClient.publish(topic, message);
    console.log("Publish");
  } else {
    console.error("MQTT client not connected. Cannot publish.");
  }
}

module.exports = { publish };