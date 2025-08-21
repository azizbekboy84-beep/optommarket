# Optombazar.uz - Render.com ga joylashtirish yo'riqnomasi

## 1-qadam: Loyihani tayyorlash

### GitHub/GitLab repositoriyasini yaratish
1. GitHub yoki GitLab da yangi repository yarating
2. Loyiha fayllarini repository ga yuklang:
```bash
git init
git add .
git commit -m "Initial commit - Optombazar.uz e-commerce platform"
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

### Environment Variables tayyorlash
Quyidagi environment variable larni tayyorlab qo'ying:
- `DATABASE_URL` - PostgreSQL ma'lumotlar bazasi URL'i (Render avtomatik beradi)
- `GOOGLE_AI_API_KEY` - Google Gemini AI uchun API kalit (ixtiyoriy)
- `TELEGRAM_BOT_TOKEN` - Telegram bot tokeni (ixtiyoriy)
- `NODE_ENV=production`
- `PORT=10000`

## 2-qadam: Render.com da hisob yaratish

1. [render.com](https://render.com) saytiga o'ting
2. "Get Started" tugmasini bosing
3. GitHub yoki GitLab orqali ro'yxatdan o'ting
4. Repository larni Render bilan bog'lang

## 3-qadam: PostgreSQL ma'lumotlar bazasini yaratish

1. Render dashboard da "New +" tugmasini bosing
2. "PostgreSQL" ni tanlang
3. Quyidagi sozlamalarni kiriting:
   - **Name**: `optombazar-db`
   - **Database**: `optombazar`
   - **User**: `optombazar_user`
   - **Region**: Frankfurt (Evropaga yaqin)
   - **Plan**: Free yoki Starter ($7/oy)
4. "Create Database" tugmasini bosing
5. Database yaratilganidan keyin CONNECTION STRING ni copy qiling

## 4-qadam: Web Service yaratish

1. Dashboard da "New +" > "Web Service" ni tanlang
2. Repository ni tanlang
3. Quyidagi sozlamalarni kiriting:

### Asosiy sozlamalar:
- **Name**: `optombazar-uz`
- **Region**: Frankfurt
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`

### Environment Variables:
```
NODE_ENV=production
PORT=10000
DATABASE_URL=[yuqorida yaratgan PostgreSQL CONNECTION STRING]
GOOGLE_AI_API_KEY=[Google AI Console dan olingan API key - ixtiyoriy]
TELEGRAM_BOT_TOKEN=[Telegram BotFather dan olingan token - ixtiyoriy]
```

### Plan:
- **Free Plan**: Cheklangan resurslar, 750 soat/oy
- **Starter Plan**: $7/oy, yanada barqaror

## 5-qadam: Ma'lumotlar bazasini sozlash

Service deploy qilingandan keyin:

1. Render dashboard da "optombazar-uz" service ni oching
2. "Shell" tab ga o'ting yoki SSH orqali ulanib quyidagi buyruqni ishga tushiring:
```bash
npm run db:push
```

Bu buyruq ma'lumotlar bazasi schema sini yaratadi va boshlang'ich ma'lumotlarni yuklaydi.

## 6-qadam: DNS va domen sozlash

### Render subdomenidan foydalanish:
Sizning saytingiz avtomatik ravishda quyidagi URL da mavjud bo'ladi:
`https://optombazar-uz.onrender.com`

### Custom domen qo'shish:
1. Render service sozlamalarida "Custom Domains" bo'limiga o'ting
2. "Add Custom Domain" tugmasini bosing
3. Domain nomingizni kiriting (masalan: `optombazar.uz`)
4. DNS provideringizda CNAME record qo'shing:
   - **Type**: CNAME
   - **Name**: www (yoki @)
   - **Value**: `optombazar-uz.onrender.com`

## 7-qadam: SSL sertifikat

Render avtomatik ravishda Let's Encrypt SSL sertifikatini beradi. Custom domen qo'shganingizdan keyin 5-10 daqiqa kutib HTTPS ishlayotganini tekshiring.

## 8-qadam: Monitor va Analytics

### Render Monitoring:
- Dashboard da service loglarini kuzatishingiz mumkin
- CPU, Memory, va Network usage ni ko'rishingiz mumkin
- Alert lar sozlashingiz mumkin

### Google Analytics:
Loyihada Google Analytics 4 integration mavjud. Google Analytics console da yangi property yarating va measurement ID ni kiriting.

## 9-qadam: Performans optimizatsiyasi

### Database optimizatsiyasi:
1. PostgreSQL connection pooling sozlang
2. Index lar qo'shing (agar kerak bo'lsa)
3. Query optimization qiling

### CDN sozlash:
Static fayllar uchun Render CDN avtomatik ishlab turadi, lekin rasmlar uchun CloudFlare yoki AWS CloudFront qo'shish tavsiya etiladi.

## 10-qadam: Backup strategiyasi

### Database backup:
Render PostgreSQL automatic backup beradi, lekin qo'shimcha manual backup uchun:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Code backup:
GitHub/GitLab repository sizning code backup hisoblanadi.

## Troubleshooting (Muammolarni hal qilish)

### Umumiy muammolar:

1. **Build muvaffaqiyatsiz tugadi**:
   - `package.json` da barcha dependencies mavjudligini tekshiring
   - Build logs ni ko'ring va xatolarni tuzating

2. **Database ulanmayapti**:
   - `DATABASE_URL` environment variable to'g'ri sozlanganligini tekshiring
   - Database service ishlab turganligini tekshiring

3. **500 Server Error**:
   - Service logs ni ko'ring
   - Environment variables to'g'ri sozlanganligini tekshiring

4. **Slow performance**:
   - Plan ni upgrade qiling (Starter yoki Professional)
   - Database queries ni optimize qiling

### Render CLI orqali debug:
```bash
# Render CLI o'rnatish
npm install -g @render-com/cli

# Service logs ni ko'rish
render logs -s optombazar-uz

# SSH orqali ulanish
render shell optombazar-uz
```

## Narxlar (2024)

### Free Plan:
- Web Service: 750 soat/oy (cheklangan)
- PostgreSQL: 90 kun bepul, keyin $7/oy

### Starter Plan:
- Web Service: $7/oy
- PostgreSQL: $7/oy
- **Jami**: ~$14/oy

### Professional Plan:
- Web Service: $25/oy
- PostgreSQL: $20/oy
- **Jami**: ~$45/oy

## Qo'shimcha maslahatlar

1. **Environment variables ni xavfsiz saqlang** - hech qachon code ga commit qilmang
2. **Regular backup qiling** - ma'lumotlar va code backup
3. **Monitoring sozlang** - uptime monitoring uchun UptimeRobot yoki shunga o'xshash service
4. **CDN qo'shing** - static fayllar uchun performans oshirish
5. **Domain expiry** - domen muddatini kuzatib turing

## Support

Agar muammoga duch kelsangiz:
1. Render Documentation: https://render.com/docs
2. Render Community Forum: https://community.render.com
3. Support ticket: Render dashboard orqali

## To'liq deploy ketma-ketligi:

```bash
# 1. Repository tayyorlash
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Render da database yaratish
# (Web interface orqali)

# 3. Web service yaratish
# (Web interface orqali)

# 4. Environment variables sozlash
# (Web interface orqali)

# 5. Database schema deploy qilish
npm run db:push

# 6. Saytni tekshirish
curl https://your-app.onrender.com/api/health
```

**Tabriklaymiz!** Sizning Optombazar.uz platformangiz endi internet da ishlaydi! 🎉