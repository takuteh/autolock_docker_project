# ベースイメージを指定
FROM takuteh/raspberrypi-os:2023-05-03_bullseye

WORKDIR /home/pi

# 非対話モードでの設定
ENV DEBIAN_FRONTEND=noninteractive

# rootを追加
USER root    

# ユーザーを作成し、必要な設定を行う
RUN echo "pi:raspberry" | chpasswd && \
    echo "pi ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

RUN chown -R pi:pi /home/pi

# パッケージの更新と必要な依存関係のインストール
RUN apt update && \
    #apt upgrade -y && \
    apt install -y \
    supervisor \
    mosquitto \
    mosquitto-clients 

#mosquitto関連の設定
COPY ./mqtt_broker/mosquitto_setting.sh /home/pi
RUN chmod +x /home/pi/mosquitto_setting.sh
RUN sh mosquitto_setting.sh
RUN mkdir /run/mosquitto && \
    chown mosquitto:mosquitto /run/mosquitto

COPY ./mqtt_broker/supervisor/supervisor.conf /etc/supervisor/supervisord.conf
COPY ./mqtt_broker/supervisor/conf.d/* /etc/supervisor/conf.d/
COPY ./mqtt_broker/entry.sh /entry.sh
RUN chmod +x /entry.sh
# 必要に応じて他の設定やコマンドを追加
CMD ["supervisord","-c", "/etc/supervisor/supervisord.conf"]
