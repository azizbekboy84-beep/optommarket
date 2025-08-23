#!/bin/bash
set -e

echo "🚀 Starting Render deployment with Vite-free build..."

# Install all dependencies
echo "📦 Installing dependencies..."
npm ci

# Build frontend
echo "🎨 Building frontend..."
npx vite build

# Build backend using production entry point (NO VITE DEPENDENCIES)
echo "⚙️  Building backend (Vite-free)..."
npx esbuild server/index.production.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outfile=dist/index.js

echo "✅ Vite-free build completed for Render!"
echo "📁 Files ready in dist/ directory"

# List what was built
ls -la dist/
echo "📊 Backend bundle size:"
du -h dist/index.js