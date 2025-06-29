# ベースイメージを指定
FROM takuteh/raspberrypi-os:2023-05-03_bullseye

WORKDIR /home/pi

# 非対話モードでの設定
ENV DEBIAN_FRONTEND=noninteractive

# rootを追加
USER root    

# redユーザーを作成し、必要な設定を行う
RUN useradd -m -G video,i2c,sudo -s /bin/bash red && \
    echo "pi:raspberry" | chpasswd && \
    echo "pi ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

RUN chown -R pi:pi /home/pi

# パッケージの更新と必要な依存関係のインストール
RUN apt update && \
    apt upgrade -y && \
    apt install -y \
    supervisor \
    git \
    cmake \
    pigpio \
    mosquitto \
    libmosquitto-dev \
    libcurl4-openssl-dev

COPY ./supervisor/supervisor.conf /etc/supervisor/supervisord.conf
COPY ./supervisor/conf.d/* /etc/supervisor/conf.d/
COPY ./src/entry.sh /entry.sh
RUN chmod +x /entry.sh
# 必要に応じて他の設定やコマンドを追加
ENTRYPOINT ["/entry.sh"]

USER pi
RUN git clone https://github.com/takuteh/autolock.git &&\
cd autolock
RUN cd autolock/gear_version && \
mkdir build && \
cd build && \
cmake .. && \
make
