#!/bin/bash
# Production start script

echo "🚀 Starting Optombazar.uz production server..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is required"
    exit 1
fi

# Set default port if not specified
export PORT=${PORT:-10000}

echo "🌐 Server will start on port $PORT"
echo "📊 Environment: $NODE_ENV"

# Start the application
node dist/index.js