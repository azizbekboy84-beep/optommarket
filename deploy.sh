#!/bin/bash
# Deployment script for Render.com - VITE-FREE VERSION

echo "🚀 Starting Vite-free deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application using Vite-free build process
echo "🔨 Building application (Vite-free)..."
# Frontend build
echo "Building frontend..."
npx vite build

# Backend build using production-specific entry point (NO VITE IMPORTS)
echo "Building backend..."
npx esbuild server/index.production.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outfile=dist/index.js

# Database setup
echo "🗄️ Setting up database..."
if [ "$NODE_ENV" = "production" ]; then
    echo "Running database migrations..."
    npm run db:push
fi

echo "✅ Vite-free deployment completed successfully!"
echo "🌐 Application will be available at your Render URL"
echo "ℹ️  This build is completely free of Vite dependencies in production"