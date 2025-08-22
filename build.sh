#!/bin/bash
# Render.com build script

# Install dependencies
npm ci

# Push database schema
npm run db:push

# Build the application
npm run build

# Make sure build directory exists
mkdir -p dist