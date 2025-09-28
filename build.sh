#!/bin/bash
# Render.com build script

# Install dependencies
echo "  Dependencielarni o'rnatish..."
npm ci

# Client qismini build qilish
echo "   Client qismini build qilish..."
cd client
npm run build
cd ..

# Server qismini build qilish
echo "   Server qismini build qilish..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Public papkasini nusxalash
echo "   Public fayllarini tayyorlash..."
cp -r client/dist/* dist/public/

# .env faylini nusxalash
if [ -f .env ]; then
  echo "   .env faylini nusxalash..."
  cp .env dist/
fi

echo "  Build muvaffaqiyatli yakunlandi!"