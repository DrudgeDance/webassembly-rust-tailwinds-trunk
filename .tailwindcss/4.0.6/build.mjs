import { readFileSync, writeFileSync, watch, mkdirSync, copyFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import tailwindConfig from './tailwind.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isWatchMode = process.argv.includes('--watch');
const isProduction = process.env.NODE_ENV === 'production';
const isTrunk = process.env.TRUNK === 'true';
const buildType = process.env.BUILD_TYPE || 'dev'; // dev, release, desktop, test

// Common paths
const DIST_DIR = resolve(__dirname, 'dist');
const TRUNK_DIR = resolve(DIST_DIR, 'trunk');
const YARN_DIR = resolve(DIST_DIR, 'yarn');
const RELEASE_DIR = resolve(DIST_DIR, 'release');
const TEST_DIR = resolve(DIST_DIR, 'test');
const INPUT_CSS = resolve(__dirname, 'src/styles/tailwind.css');
const INDEX_HTML = resolve(__dirname, 'index.html');

// Get output paths based on build type
const getOutputPaths = () => {
  let baseDir;
  
  switch(buildType) {
    case 'release':
      baseDir = resolve(RELEASE_DIR, 'web');
      break;
    case 'desktop':
      baseDir = resolve(RELEASE_DIR, 'desktop');
      break;
    case 'test':
      baseDir = TEST_DIR;
      break;
    default:
      baseDir = isTrunk ? TRUNK_DIR : YARN_DIR;
  }

  return {
    css: resolve(DIST_DIR, 'tailwind.css'),
    html: resolve(baseDir, 'index.html'),
    pkg: resolve(baseDir, 'pkg')
  };
};

// Ensure directories exist
function ensureDirectories() {
  const paths = getOutputPaths();

  [
    DIST_DIR,
    dirname(paths.css),
    dirname(paths.html),
    paths.pkg
  ].forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });
}

async function buildCSS() {
  const paths = getOutputPaths();
  
  try {
    console.log('📁 Input path:', INPUT_CSS);
    console.log('📁 Output path:', paths.css);
    console.log(`🔧 Building CSS in ${isProduction ? 'production' : 'development'} mode...`);
    console.log(`🎯 Build type: ${buildType}`);

    const css = readFileSync(INPUT_CSS, 'utf8');
    console.log('📖 Read input CSS file');
    
    console.log('⚙️ Processing with PostCSS and Tailwind...');
    const result = await postcss([
      tailwindcss({
        config: tailwindConfig,
        content: ['./src/**/*.rs', './index.html'],
      }),
      autoprefixer()
    ]).process(css, {
      from: INPUT_CSS,
      to: paths.css,
      map: isProduction ? false : { inline: true }
    });

    console.log('💾 Writing output CSS file...');
    writeFileSync(paths.css, result.css);
    console.log('✨ CSS built successfully');
    
    if (result.warnings().length > 0) {
      console.warn('⚠️ Build warnings:', result.warnings());
    }
  } catch (error) {
    console.error('🚨 Error building CSS:');
    console.error(error);
    if (!isWatchMode) process.exit(1);
  }
}

function copyFiles() {
  // Only copy files if not running under Trunk (Trunk handles its own copying)
  if (!isTrunk) {
    const paths = getOutputPaths();
    try {
      console.log('📋 Copying index.html...');
      copyFileSync(INDEX_HTML, paths.html);
      console.log('✨ Files copied successfully');
    } catch (error) {
      console.error('🚨 Error copying files:');
      console.error(error);
      if (!isWatchMode) process.exit(1);
    }
  }
}

// Main build process
async function build() {
  ensureDirectories();
  await buildCSS();
  copyFiles();
}

// Initial build
build();

// Watch mode (only for yarn dev)
if (isWatchMode && !isTrunk) {
  console.log('👀 Watching for changes...');
  watch(resolve(__dirname, 'src'), { recursive: true }, (_, filename) => {
    if (filename?.endsWith('.css') || filename?.endsWith('.rs')) {
      console.log(`🔄 Rebuilding due to changes in ${filename}...`);
      build();
    }
  });
} 