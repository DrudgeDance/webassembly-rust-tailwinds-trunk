#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');

// Utility to run commands
function runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: 'inherit',
            shell: true,
            ...options
        });

        child.on('exit', code => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with exit code ${code}`));
        });
    });
}

// Clean build artifacts
async function clean() {
    console.log('🧹 Cleaning build artifacts...');
    try {
        await runCommand('trunk', ['clean']);
        console.log('✨ Clean completed');
    } catch (error) {
        console.error('❌ Clean failed:', error);
        process.exit(1);
    }
}

// Build CSS
async function buildCss(watch = false) {
    console.log(`🎨 ${watch ? 'Watching' : 'Building'} CSS...`);
    try {
        const script = watch ? 'watch:css' : 'build:css';
        await runCommand('yarn', [script]);
        if (!watch) console.log('✨ CSS build completed');
    } catch (error) {
        console.error('❌ CSS build failed:', error);
        process.exit(1);
    }
}

// Development build with HMR
async function dev() {
    try {
        await clean();
        
        // Start CSS watcher (no need for initial build as the watcher will do it)
        const cssWatcher = spawn('yarn', ['watch:css'], {
            stdio: 'inherit',
            shell: true,
            cwd: ROOT_DIR
        });

        // Start Trunk server with HMR
        const trunkServer = spawn('trunk', ['serve'], {
            stdio: 'inherit',
            shell: true,
            cwd: ROOT_DIR
        });

        // Handle process termination
        const cleanup = () => {
            cssWatcher.kill();
            trunkServer.kill();
            process.exit(0);
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

        // Handle child process errors
        cssWatcher.on('error', (error) => {
            console.error('❌ CSS watcher error:', error);
            cleanup();
        });

        trunkServer.on('error', (error) => {
            console.error('❌ Trunk server error:', error);
            cleanup();
        });

    } catch (error) {
        console.error('❌ Development server failed:', error);
        process.exit(1);
    }
}

// Production build
async function build() {
    try {
        await clean();
        await buildCss();
        
        console.log('🏗️ Building for production...');
        await runCommand('trunk', ['build', '--release']);
        console.log('✨ Production build completed');
    } catch (error) {
        console.error('❌ Production build failed:', error);
        process.exit(1);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'dev';

// Make the script executable
fs.chmodSync(fileURLToPath(import.meta.url), '755');

// Run appropriate command
switch (command) {
    case 'dev':
        dev();
        break;
    case 'build':
        build();
        break;
    case 'clean':
        clean();
        break;
    default:
        console.error('Unknown command:', command);
        console.log('Available commands: dev, build, clean');
        process.exit(1);
} 