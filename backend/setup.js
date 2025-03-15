const fs = require('fs');
const path = require('path');

// Directories to create
const dirs = [
    'logs',
    'tmp',
    'public/uploads',
    'public/uploads/products',
    'public/uploads/categories',
    'public/uploads/avatars'
];

// Create directories
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
});

// Create empty log file if it doesn't exist
const logFile = path.join(__dirname, 'logs/output.log');
if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
    console.log(`Created log file: ${logFile}`);
}

// Create restart.txt in tmp directory
const restartFile = path.join(__dirname, 'tmp/restart.txt');
fs.writeFileSync(restartFile, '');
console.log(`Created restart file: ${restartFile}`);

// Set proper permissions
const dirs_to_chmod = ['logs', 'tmp', 'public/uploads'];
dirs_to_chmod.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    fs.chmodSync(dirPath, 0o755);
    console.log(`Set permissions for: ${dirPath}`);
});

console.log('Setup completed successfully!'); 