#!/bin/bash
# Render.com build script

# Install dependencies
npm ci

# Generate database schema push
npm run db:generate

# Build the application
npm run build

# Make sure build directory exists
mkdir -p dist