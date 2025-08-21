#!/bin/bash
# Deployment script for Render.com

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Database setup
echo "🗄️ Setting up database..."
if [ "$NODE_ENV" = "production" ]; then
    echo "Running database migrations..."
    npm run db:push
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Application will be available at your Render URL"