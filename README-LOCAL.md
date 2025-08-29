# OptomBazar.uz - Lokal Kompyuterda Ishlatish

## Talablar
- Node.js (18+ versiya)
- npm yoki yarn
- Git

## O'rnatish

### 1. Loyihani yuklab olish
```bash
git clone https://github.com/your-username/optombazar-uz
cd optombazar-uz
```

### 2. Dependencies o'rnatish
```bash
npm install
```

### 3. Environment variables sozlash
`.env` fayl yarating va quyidagi ma'lumotlarni kiriting:

```bash
# Database
DATABASE_URL="your_postgresql_connection_string"

# Optional: AI va Telegram (ixtiyoriy)
GOOGLE_AI_API_KEY="your_google_ai_api_key"
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"

# Session secret
SESSION_SECRET="your_secret_key"
```

### 4. Database migration
```bash
npm run db:push
```

## Ishga tushirish

### Windows uchun:
```bash
start-local.bat
```

### MacOS/Linux uchun:
```bash
./start-local.sh
```

### Yoki qo'lda:
```bash
export NODE_ENV=development
export PORT=3000
npm run dev
```

## Brauzerda ochish

Server ishga tushgandan keyin, quyidagi manzilni oching:
- **Lokal:** http://localhost:3000
- **Tarmoqda:** http://your-ip:3000

## Muammolarni hal qilish

### Server ko'rinmayapti
1. Port 3000 band bo'lmagan ekanligini tekshiring
2. Firewall sozlamalarini tekshiring
3. NODE_ENV=development o'rnatilganligini tekshiring

### Database xatoligi
1. PostgreSQL o'rnatilganligini tekshiring
2. DATABASE_URL to'g'ri ekanligini tekshiring
3. `npm run db:push` buyrug'ini qaytadan ishga tushiring

### Packages xatoligi
```bash
rm -rf node_modules package-lock.json
npm install
```

## Production uchun build
```bash
npm run build
npm start
```

## Qo'shimcha ma'lumot
- Development rejimi: Hot reload bilan ishlaydi
- Production rejimi: Static fayllar bilan ishlaydi
- PWA: Brauzerda "Ilovani o'rnatish" taklifi chiqadi . 