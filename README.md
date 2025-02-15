# Leptos Full-Stack Application

A modern, high-performance full-stack Rust web application built with WebAssembly, Rust, and Tailwind CSS v4.0.6. This project uses Trunk as the build tool and development server (instead of cargo-leptos) for an optimized WebAssembly development experience, combining Leptos for the frontend and Axum for the backend.

## Tech Stack

- **WebAssembly (Wasm)** - Compile Rust to WebAssembly for near-native performance in the browser
- **Rust** - Full-stack type-safe development with memory safety guarantees
- **Tailwind CSS v4.0.6** - Latest utility-first CSS framework for modern, responsive design
- **Trunk** - Modern build tool and development server optimized for Rust/Wasm applications
- **Leptos** - Reactive web framework for building web applications in Rust
- **Axum** - Ergonomic and modular web framework for backend development

## Key Features

- **Full-Stack Rust Development**
  - Type-safe end-to-end Rust development
  - Shared types between frontend and backend
  - High performance and memory safety guarantees

- **Frontend (Leptos)**
  - Client-side rendering (CSR) with hydration support
  - Component-based architecture
  - Built-in routing with `leptos_router`
  - Modern styling with Tailwind CSS v4.0.6
  - WASM-powered for near-native performance
  - Hot Module Reloading (HMR) for rapid development

- **Backend (Axum)**
  - High-performance async web server
  - Built on top of `tokio` runtime
  - Middleware support with `tower`
  - Structured logging with `tracing`
  - RESTful API endpoints
  - Type-safe request/response handling

- **Development Experience**
  - Fast development cycle with hot reloading
  - Trunk for WASM bundling and serving
  - Comprehensive build optimization options
  - Development and production configurations
  - Structured logging and error handling

- **Production Ready**
  - Optimized WASM builds with `wasm-opt`
  - CPU-specific backend optimizations
  - Configurable deployment options
  - Production build optimizations
  - Asset optimization and caching strategies

## Prerequisites

- Rust (latest stable version)
- `wasm32-unknown-unknown` target: `rustup target add wasm32-unknown-unknown`
- Trunk: `cargo install trunk` (Note: This project uses Trunk instead of cargo-leptos for better WebAssembly optimization and development experience)
- Node.js and npm/yarn (for Tailwind CSS processing)

## Project Structure

- `/frontend` - Leptos frontend application
  - `/src` - Frontend source code
  - `/assets` - Static assets
  - `/style` - CSS and Tailwind configurations
  - `/scripts` - Build and utility scripts

- `/backend` - Axum backend server
  - `/src` - Backend source code and API endpoints

## Development

### Running the Backend

```bash
cargo run --bin backend
```

The backend server will start at `http://127.0.0.1:8080`

### Running the Frontend

First, clean any previous builds (recommended when switching branches or after major changes):
```bash
cd frontend
trunk clean
```

Start the development server:
```bash
trunk serve --port 3000
```

If you encounter any issues, you can try a full rebuild:
```bash
trunk clean
trunk build
trunk serve --port 3000
```

The frontend development server will start at `http://127.0.0.1:3000`

### Development Workflow

1. Start the backend server in one terminal
2. Start the frontend development server in another terminal
3. Visit `http://127.0.0.1:3000` in your browser

The frontend server supports hot reloading, so any changes to the frontend code will automatically trigger a rebuild and refresh in the browser.

## Building for Production

### Backend

```bash
cargo build --release --bin backend
```

For maximum optimization:
```bash
RUSTFLAGS="-C target-cpu=native -C opt-level=3" cargo build --release --bin backend
```

Note about CPU optimizations:
- `-C target-cpu=native` enables CPU-specific optimizations for your current processor
- You must rebuild the application for each different CPU architecture you deploy to
- For portable builds that work across similar CPUs, use specific features instead:
  ```bash
  # For modern x86_64 processors but portable
  RUSTFLAGS="-C target-cpu=x86-64-v3 -C opt-level=3" cargo build --release --bin backend
  
  # For specific CPU features
  RUSTFLAGS="-C target-feature=+avx2,+sse4.2,+fma -C opt-level=3" cargo build --release --bin backend
  ```

### Frontend

Basic release build:
```bash
cd frontend
trunk build --release
```

Optimized release build:
```bash
# Clean previous builds
trunk clean

# Build with maximum optimization
# Note: For WASM, CPU-specific optimizations are more limited
RUSTFLAGS="-C target-cpu=native -C opt-level=3" trunk build --release --public-url "/" --filehash false

# Install wasm-opt if you haven't already
# Option 1: Using cargo
cargo install wasm-opt
# Option 2: Using npm (usually faster)
npm install -g wasm-opt
# Option 3: On macOS with Homebrew
brew install binaryen

# Optimize the WASM binary
# -O4 is the highest optimization level (options are -O0 through -O4)
# --enable-simd enables SIMD optimizations if available
# --enable-bulk-memory enables bulk memory operations
wasm-opt -O4 --enable-simd --enable-bulk-memory \
         -o dist/frontend_bg.wasm.optimized \
         dist/frontend_bg.wasm

# Verify the size reduction
ls -lh dist/frontend_bg.wasm dist/frontend_bg.wasm.optimized

# If the optimization was successful, replace the original
mv dist/frontend_bg.wasm.optimized dist/frontend_bg.wasm
```

Note: The `wasm-opt` optimization levels:
- `-O1`: Basic optimizations
- `-O2`: Intermediate optimizations
- `-O3`: Most optimizations
- `-O4`: All optimizations (including potentially slower optimizations)
- `--enable-simd`: Enables WebAssembly SIMD optimizations
- `--enable-bulk-memory`: Enables bulk memory operations
- Add `--debug` flag to see optimization details

You can also target specific optimization goals:
```bash
# Optimize for size
wasm-opt -Oz -o dist/frontend_bg.wasm.optimized dist/frontend_bg.wasm

# Optimize for speed
wasm-opt -O3 --enable-simd --enable-bulk-memory \
         --no-validation \
         -o dist/frontend_bg.wasm.optimized dist/frontend_bg.wasm
```

CPU Optimization Notes:
- Backend: Requires recompilation for different CPU architectures
  - `native`: Optimizes for the current CPU only
  - `x86-64-v3`: Works on most modern x86_64 CPUs (since ~2015)
  - Use `rustc --print target-cpus` to see all supported CPU targets
- Frontend: WASM is more portable
  - CPU-specific optimizations are less critical for WASM
  - Most optimizations focus on size and general performance
  - `wasm-opt` applies WebAssembly-specific optimizations

Note: To use `wasm-opt`, install it with:
```bash
cargo install wasm-opt
```

The built frontend files will be in the `frontend/dist` directory. The optimized build:
- Uses native CPU features
- Applies maximum Rust compiler optimizations
- Post-processes the WASM binary for size and performance
- Removes file hashes for better caching
- Sets the public URL for production deployment

## Features

- Full-stack Rust development
- Server-side rendering with hydration
- Modern styling with Tailwind CSS v4.0.6
- Type-safe API communication
- Hot Module Reloading (HMR)

## Troubleshooting

If the frontend development server isn't responding:
1. Stop the server
2. Run `trunk clean`
3. Delete the `dist` directory: `rm -rf dist`
4. Rebuild and start: `trunk build && trunk serve --port 3000`

If you see WASM-related errors:
1. Ensure you have the correct target: `rustup target add wasm32-unknown-unknown`
2. Clean and rebuild: `trunk clean && trunk build`
