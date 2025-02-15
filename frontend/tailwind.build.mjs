import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import chokidar from 'chokidar';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, 'dist');
const INPUT_CSS = resolve(__dirname, 'src/styles/tailwind.css');
const OUTPUT_CSS = resolve(DIST_DIR, 'tailwind.css');

async function processCss() {
    try {
        // Ensure dist directory exists
        if (!existsSync(DIST_DIR)) {
            mkdirSync(DIST_DIR, { recursive: true });
        }

        const css = readFileSync(INPUT_CSS, 'utf8');
        const processor = postcss([
            tailwindcss({
                base: __dirname,
                content: ['./src/**/*.rs', './index.html']
            })
        ]);

        const result = await processor.process(css, {
            from: INPUT_CSS,
            to: OUTPUT_CSS
        });

        writeFileSync(OUTPUT_CSS, result.css);
        console.log('✨ CSS built successfully');
    } catch (error) {
        console.error('🚨 Error building CSS:', error);
        if (!isWatching) process.exit(1);
    }
}

let isWatching = false;

async function watch() {
    isWatching = true;
    console.log('👀 Watching for CSS changes...');
    
    // Initial build
    await processCss();

    // Watch for changes
    const watcher = chokidar.watch([
        './src/**/*.rs',
        './src/**/*.css',
        './index.html'
    ], {
        ignoreInitial: true,
        awaitWriteFinish: {
            stabilityThreshold: 100,
            pollInterval: 100
        }
    });

    watcher.on('all', async (event, path) => {
        console.log(`🔄 Rebuilding CSS due to ${event} in ${path}`);
        await processCss();
    });
}

// Parse command line arguments
const args = process.argv.slice(2);
const shouldWatch = args.includes('--watch');

// Run in appropriate mode
if (shouldWatch) {
    watch();
} else {
    processCss();
} 