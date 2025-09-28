#!/bin/bash
# Render.com build script

# Install dependencies
echo "🚀 Dependencielarni o'rnatish..."
npm ci

# Client qismini build qilish
echo "🛠️ Client qismini build qilish..."
npm run build:client

# Server qismini build qilish
echo "🖥️ Server qismini build qilish..."
npm run build:server

# Public papkasini yaratish va nusxalash
echo "📂 Public fayllarini tayyorlash..."
mkdir -p dist/public
if [ -d "client/dist" ]; then
  cp -r client/dist/* dist/public/
fi

# .env faylini nusxalash
if [ -f .env ]; then
  echo "⚙️ .env faylini nusxalash..."
  cp .env dist/
fi

echo "✅ Build muvaffaqiyatli yakunlandi!"