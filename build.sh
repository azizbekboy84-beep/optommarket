#!/bin/bash
# Render.com build script

# Install dependencies
npm ci

# Push database schema
npm run db:push

# Build the application
npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Make sure build directory exists
mkdir -p dist