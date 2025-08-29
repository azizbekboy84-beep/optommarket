#!/bin/bash

# Lokal kompyuter uchun server ishga tushirish
echo "🚀 Loyihani lokal kompyuterda ishga tushirish..."

# Environment variables
export NODE_ENV=development
export PORT=3000

# Dependencies o'rnatish
echo "📦 Dependencies o'rnatilmoqda..."
npm install

# Database migration
echo "🗄️ Database migration..."
npm run db:push

# Server ishga tushirish
echo "🌐 Server localhost:3000 da ishga tushirilmoqda..."
npm run dev

echo "✅ Server tayyor! Brauzeringizda http://localhost:3000 ni oching"