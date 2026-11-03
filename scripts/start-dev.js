/**
 * Unified Development Environment Launcher
 * Concurrently launches:
 * 1. Ladha Storefront Python Server (Port 3001)
 * 2. Qx Billing Commerce Backend (Port 5000)
 * 3. Qx Billing Vue Dashboard (Port 5173)
 */

const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const services = [
    {
        name: 'STOREFRONT',
        cmd: 'python',
        args: [path.join(rootDir, 'storefront', 'server.py'), '3001'],
        cwd: path.join(rootDir, 'storefront'),
        color: '\x1b[36m' // Cyan
    },
    {
        name: 'BILLING_ENGINE',
        cmd: 'node',
        args: [path.join(rootDir, 'billing', 'backend', 'server.js')],
        cwd: path.join(rootDir, 'billing', 'backend'),
        color: '\x1b[32m' // Green
    }
];

console.log('\x1b[1m\x1b[35m=== LAUNCHING UNIFIED STOREFRONT & BILLING ECOSYSTEM ===\x1b[0m\n');
console.log('• Storefront:       http://localhost:3001');
console.log('• Billing Backend:  http://localhost:5000');
console.log('• Commerce API:     http://localhost:5000/api/stores/ladha-nairobi/checkout\n');

const runningProcesses = [];

services.forEach(svc => {
    const proc = spawn(svc.cmd, svc.args, {
        cwd: svc.cwd,
        shell: true,
        env: { ...process.env, PORT: svc.name === 'BILLING_ENGINE' ? '5000' : undefined }
    });

    proc.stdout.on('data', data => {
        process.stdout.write(`${svc.color}[${svc.name}]\x1b[0m ${data}`);
    });

    proc.stderr.on('data', data => {
        process.stderr.write(`${svc.color}[${svc.name} ERR]\x1b[0m ${data}`);
    });

    proc.on('close', code => {
        console.log(`${svc.color}[${svc.name}]\x1b[0m process exited with code ${code}`);
    });

    runningProcesses.push(proc);
});

process.on('SIGINT', () => {
    console.log('\nGracefully terminating services...');
    runningProcesses.forEach(p => p.kill());
    process.exit(0);
});
