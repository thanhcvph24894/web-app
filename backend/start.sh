#!/bin/bash
cd /home/vxpeevb/web-nodejs.hhuong.site/backend
export NODE_ENV=production
export PORT=5000

# Kill any existing node process
pkill node

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    npm install
fi

# Create logs directory if it doesn't exist
mkdir -p logs

if [ -f "output.log" ]; then
    mv output.log logs/output.log.$(date +%Y%m%d_%H%M%S)
fi

# Start the application
node app.js > logs/output.log 2>&1 &
echo $! > app.pid

echo "Application started. Check logs/output.log for details" 