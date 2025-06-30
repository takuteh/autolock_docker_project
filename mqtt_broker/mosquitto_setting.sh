#!/bin/sh

#mqtt設定
MQTT_CONFIG="/etc/mosquitto/mosquitto.conf"
if ! grep -q "listener" "$MQTT_CONFIG"; then
    echo "listener 1883" >> "$MQTT_CONFIG"
    MQTT_PORT=1883
else
#既にmqttのポートが設定されている場合そのポートを代入
    MQTT_PORT=$(grep "listener" "$MQTT_CONFIG"|awk '{print $2}')
fi

#外部からのアクセスを許可
if ! grep -q "allow_anonymous true" "$MQTT_CONFIG"; then
    echo "allow_anonymous true" >> "$MQTT_CONFIG"
fi