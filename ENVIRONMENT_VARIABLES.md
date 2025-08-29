# Environment Variables - OptomBazar.uz Deploy qilish

## Majburiy o'zgaruvchilar (Required)

### 1. DATABASE_URL
```
postgres://username:password@host:port/database
```
**Izoh:** PostgreSQL database connection string. Render.com avtomatik yaratadi.

### 2. NODE_ENV
```
production
```
**Izoh:** Production muhitini belgilash

### 3. SESSION_SECRET
```
strong-random-secret-key-here
```
**Izoh:** Session xavfsizligi uchun. Render.com avtomatik yaratishi mumkin.

### 4. PORT
```
10000
```
**Izoh:** Render.com standart porti

## Ixtiyoriy o'zgaruvchilar (Optional)

### AI Chat Functionality
```
GOOGLE_AI_API_KEY=your_google_gemini_api_key
```
**Funktsiya:** AI chat yordamchisi ishlashi uchun

### Telegram Bot Integration
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```
**Funktsiya:** Yangi xabarlar haqida Telegram orqali xabar olish

### Push Notifications
```
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```
**Funktsiya:** Web push xabarlari yuborish

### Analytics va Marketing
```
GOOGLE_ANALYTICS_ID=GA4-MEASUREMENT-ID
FACEBOOK_PIXEL_ID=your_facebook_pixel_id
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
```
**Funktsiya:** Statistika va marketing tracking

## Render.com da qo'yish tartibi

1. **Dashboard** -> **Environment** bo'limiga kirina
2. **Key** va **Value** maydonlarini to'ldirina
3. **Add** tugmasini bosina
4. Service ni qayta deploy qilina

## Xavfsizlik eslatmalari

- Hech qachon API kalitlarni kod ichida yozmang
- Barcha muhim ma'lumotlarni environment variables orqali saqlang
- Production da faqat kerakli API kalitlarni qo'shing

## Test qilish

Environment variables to'g'ri o'rnatilganligini tekshirish uchun:
```bash
curl https://your-render-url.com/health
```

Javob:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```