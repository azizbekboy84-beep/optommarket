#!/bin/bash
# Production start script

echo " Optombazar.uz production server ishga tushmoqda..."

# Kerakli environment variable'lar tekshiriladi
if [ -z "$DATABASE_URL" ]; then
    echo " XATOLIK: DATABASE_URL muhit o'zgaruvchisi kiritilmagan"
    exit 1
fi

# Portni sozlash
export PORT=${PORT:-10000}

# Joriy muhit haqida ma'lumot
echo " Server $PORT portida ishga tushmoqda"
echo " Muhit: $NODE_ENV"

# Dasturni ishga tushirish
echo " Dastur ishga tushirilmoqda..."
node dist/index.js