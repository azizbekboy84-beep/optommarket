#!/bin/bash
set -e

echo "🚀 Starting Render deployment with Vite-free build..."

# Install all dependencies (including devDependencies for build)
echo "📦 Installing dependencies..."
NODE_ENV=development npm install --legacy-peer-deps

# Build frontend
echo "🎨 Building frontend..."
npx vite build

# Build backend using production entry point with alias support
echo "⚙️  Building backend (Vite-free)..."
node build-server.js

echo "✅ Vite-free build completed for Render!"
echo "📁 Files ready in dist/ directory"

# List what was built
ls -la dist/
echo "📊 Backend bundle size:"
du -h dist/index.js