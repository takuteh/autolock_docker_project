#!/bin/bash

# 既存の pigpiod を停止
echo "Stopping existing pigpiod..."

sudo killall pigpiod || true

# /dev/pigpio が存在する場合は削除
if [ -e /dev/pigpio ]; then
    echo "Removing stale /dev/pigpio..."
    sudo rm -f /dev/pigpio
fi

sudo -E /usr/bin/supervisord -c /etc/supervisor/supervisord.conf