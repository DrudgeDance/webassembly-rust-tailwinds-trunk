import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, 'dist');
const INPUT_CSS = resolve(__dirname, 'src/styles/tailwind.css');
const OUTPUT_CSS = resolve(DIST_DIR, 'tailwind.css');

async function build() {
    try {
        // Ensure dist directory exists
        if (!existsSync(DIST_DIR)) {
            mkdirSync(DIST_DIR, { recursive: true });
        }

        const css = readFileSync(INPUT_CSS, 'utf8');
        const result = await postcss([
            tailwindcss({
                content: ['./src/**/*.rs', './index.html']
            }),
            autoprefixer
        ]).process(css, {
            from: INPUT_CSS,
            to: OUTPUT_CSS
        });

        writeFileSync(OUTPUT_CSS, result.css);
        console.log('✨ CSS built successfully');
    } catch (error) {
        console.error('🚨 Error building CSS:', error);
        process.exit(1);
    }
}

// Run build
build(); 