const fs = require('fs');
const path = require('path');

try {
    // Create tmp directory if it doesn't exist
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
        console.log('Created tmp directory');
    }

    // Create logs directory if it doesn't exist
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
        console.log('Created logs directory');
    }

    // Ensure output.log exists
    const logFile = path.join(logsDir, 'output.log');
    if (!fs.existsSync(logFile)) {
        fs.writeFileSync(logFile, '');
        console.log('Created output.log file');
    }

    // Touch restart.txt to trigger Passenger restart
    const restartFile = path.join(tmpDir, 'restart.txt');
    fs.writeFileSync(restartFile, new Date().toISOString());
    console.log('Restart signal sent to Passenger');

    // Set proper permissions
    fs.chmodSync(tmpDir, 0o755);
    fs.chmodSync(logsDir, 0o755);
    fs.chmodSync(logFile, 0o644);
    fs.chmodSync(restartFile, 0o644);
    
    console.log('Restart process completed successfully');
} catch (error) {
    console.error('Error during restart:', error);
    process.exit(1);
} 