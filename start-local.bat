@echo off
echo 🚀 Loyihani lokal kompyuterda ishga tushirish...

REM Environment variables
set NODE_ENV=development
set PORT=3000

REM Dependencies o'rnatish
echo 📦 Dependencies o'rnatilmoqda...
npm install

REM Database migration
echo 🗄️ Database migration...
npm run db:push

REM Server ishga tushirish
echo 🌐 Server localhost:3000 da ishga tushirilmoqda...
npm run dev

echo ✅ Server tayyor! Brauzeringizda http://localhost:3000 ni oching
pause