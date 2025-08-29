#!/bin/bash
set -e

echo "Starting production build..."

# Frontend build
echo "Building frontend..."
npx vite build

# Backend build using production-specific entry point
echo "Building backend..."
npx esbuild server/index.production.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outfile=dist/index.js

echo "Production build completed successfully!"