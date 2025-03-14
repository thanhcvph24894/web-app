#!/bin/bash

# Set working directory
WORKING_DIR="/home/vxpeevb/web-nodejs.hhuong.site/backend"
cd $WORKING_DIR

echo "Stopping application..."

# Kill process by port first
fuser -k 5001/tcp

# Then try to kill by PID file
if [ -f "app.pid" ]; then
    pid=$(cat app.pid)
    if ps -p $pid > /dev/null; then
        kill -9 $pid
        echo "Process $pid killed"
    else
        echo "Process $pid not found"
    fi
    rm app.pid
fi

# Finally, make sure no node process is running
pkill -9 node

echo "Application stopped successfully" 