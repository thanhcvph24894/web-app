#!/bin/bash
cd ~/backend
export NODE_ENV=production
export PORT=5000

if [ -f "output.log" ]; then
    mv output.log output.log.old
fi

nohup node app.js > output.log 2>&1 &
echo $! > app.pid 