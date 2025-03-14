#!/bin/bash
cd /home/vxpeevb/web-nodejs.hhuong.site/backend

if [ -f "app.pid" ]; then
    pid=$(cat app.pid)
    if ps -p $pid > /dev/null; then
        kill $pid
        echo "Process $pid killed"
    else
        echo "Process $pid not found"
    fi
    rm app.pid
else
    # Try to find and kill node process if PID file not found
    pkill node
    echo "Killed all node processes"
fi

echo "Application stopped" 