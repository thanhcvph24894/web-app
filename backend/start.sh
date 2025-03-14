#!/bin/bash

# Set working directory
WORKING_DIR="/home/vxpeevb/web-nodejs.hhuong.site/backend"
cd $WORKING_DIR

# Export environment variables
export NODE_ENV=production
export PORT=5001

# Kill any existing process on port 5001
fuser -k 5001/tcp

# Kill any existing node process
pkill node

# Wait a moment for processes to stop
sleep 2

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    npm install
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Backup existing log file
if [ -f "logs/output.log" ]; then
    mv logs/output.log "logs/output.log.$(date +%Y%m%d_%H%M%S)"
fi

# Start the application
echo "Starting application..."
node app.js > logs/output.log 2>&1 &

# Save PID
echo $! > app.pid

echo "Application started with PID $(cat app.pid). Check logs/output.log for details" 