import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Build configuration
const BUILD_ENV = process.env.NODE_ENV || 'development';
const isProduction = BUILD_ENV === 'production';

// Directory configuration
const BASE_DIR = __dirname;
const DIST_DIR = resolve(BASE_DIR, 'dist');
const INPUT_CSS = resolve(BASE_DIR, 'src/styles/tailwind.css');
const OUTPUT_CSS = resolve(DIST_DIR, 'tailwind.css');

// Environment-specific configurations
const envConfig = {
    development: {
        minify: false
    },
    production: {
        minify: true
    }
}[BUILD_ENV];

// Logging utilities
const log = {
    info: (msg, ...args) => console.log(`ℹ️  ${msg}`, ...args),
    success: (msg, ...args) => console.log(`✨ ${msg}`, ...args),
    warn: (msg, ...args) => console.warn(`⚠️  ${msg}`, ...args),
    error: (msg, ...args) => console.error(`🚨 ${msg}`, ...args),
    build: (msg, ...args) => console.log(`🔧 ${msg}`, ...args),
    debug: (msg, ...args) => !isProduction && console.log(`🔍 ${msg}`, ...args),
};

// Print build information
log.build(`Building CSS for ${BUILD_ENV} environment`);
log.debug('Build configuration:', {
    environment: BUILD_ENV,
    minify: envConfig.minify,
    inputFile: INPUT_CSS,
    outputFile: OUTPUT_CSS
});

async function processCss() {
    try {
        // Ensure dist directory exists
        if (!existsSync(DIST_DIR)) {
            log.debug(`Creating directory: ${DIST_DIR}`);
            mkdirSync(DIST_DIR, { recursive: true });
        }

        log.info('Reading input CSS file...');
        const css = readFileSync(INPUT_CSS, 'utf8');

        log.info('Processing with Tailwind CSS...');
        const startTime = Date.now();
        
        const processor = postcss([
            tailwindcss({
                base: BASE_DIR,
                content: ['./src/**/*.rs', './index.html'],
                ...(isProduction && {
                    optimize: {
                        minify: true,
                        removeComments: true
                    }
                })
            })
        ]);

        const result = await processor.process(css, {
            from: INPUT_CSS,
            to: OUTPUT_CSS
        });

        // Write output file
        log.info('Writing output file...');
        writeFileSync(OUTPUT_CSS, result.css);
        
        const buildTime = Date.now() - startTime;
        log.success(`CSS built successfully for ${BUILD_ENV} in ${buildTime}ms`);

        // Warning handling
        const warnings = result.warnings();
        if (warnings.length > 0) {
            log.warn(`Build completed with ${warnings.length} warning(s):`);
            warnings.forEach((warning, index) => {
                log.warn(`[${index + 1}/${warnings.length}] ${warning.text}`);
                if (warning.node) {
                    log.debug(`  at ${warning.node.source.start.line}:${warning.node.source.start.column}`);
                }
            });
        }
    } catch (error) {
        log.error('Build failed:');
        if (error.name === 'CssSyntaxError') {
            log.error(`CSS Syntax Error: ${error.message}`);
            log.debug(`  at ${error.file}:${error.line}:${error.column}`);
        } else {
            log.error(error);
        }
        process.exit(1);
    }
}

// Run the build
processCss(); 