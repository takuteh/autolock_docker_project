FROM debian:bookworm

WORKDIR /home/app

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && \
    apt install -y \
        supervisor \
        git \
        g++ \
        cmake \
        make \
        mosquitto-clients \
        libmosquitto-dev \
        libcurl4-openssl-dev \
        libmysqlcppconn-dev && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/joan2937/pigpio.git /tmp/pigpio && \
    cd /tmp/pigpio && \
    make && \
    install -m 0644 libpigpiod_if2.so.1 /usr/local/lib/ && \
    ln -sf /usr/local/lib/libpigpiod_if2.so.1 /usr/local/lib/libpigpiod_if2.so && \
    install -m 0644 pigpiod_if2.h /usr/local/include/ && \
    install -m 0644 pigpio.h /usr/local/include/ && \
    rm -rf /tmp/pigpio && \
    ldconfig

COPY ./supervisor/supervisor.conf /etc/supervisor/supervisord.conf
COPY ./supervisor/conf.d/* /etc/supervisor/conf.d/
COPY ./src/entry.sh /entry.sh

RUN chmod +x /entry.sh

RUN git clone https://github.com/takuteh/autolock.git && \
    cd autolock/gear_version && \
    mkdir build && \
    cd build && \
    cmake .. && \
    make

ENTRYPOINT ["/entry.sh"]
