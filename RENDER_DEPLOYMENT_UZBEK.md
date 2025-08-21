# 🚀 Optombazar.uz ni Render.com ga joylashtirish - To'liq yo'riqnoma

## 📋 Tayyorgarlik ro'yxati

✅ **Tayyorlangan fayllar:**
- `render.yaml` - Render konfiguratsiya fayli
- `build.sh` - Qurilish skripti
- `deploy.sh` - Joylashtirish skripti
- `start.sh` - Ishga tushirish skripti
- `Dockerfile` - Docker konteyner konfiguratsiyasi
- `DEPLOYMENT_GUIDE.md` - Batafsil ingliz tilidagi yo'riqnoma

✅ **Loyiha holati:**
- ✓ PostgreSQL baza sxemasi tayyor
- ✓ Production build konfiguratsiyasi sozlangan
- ✓ Health check endpoint qo'shilgan (/health, /api/health)
- ✓ Environment variables tayyor
- ✓ Real ma'lumotlar integratsiyasi

## 🏁 Qisqa yo'riqnoma (5 qadam)

### 1-qadam: Repository tayyorlang
```bash
git init
git add .
git commit -m "Production ready - Optombazar.uz"
git remote add origin https://github.com/YOUR_USERNAME/optombazar-uz.git
git push -u origin main
```

### 2-qadam: Render.com da ro'yxatdan o'ting
1. [render.com](https://render.com) saytiga o'ting
2. GitHub orqali ro'yxatdan o'ting
3. Repository ni bog'lang

### 3-qadam: PostgreSQL bazasini yarating
1. Render dashboard: "New +" → "PostgreSQL"
2. Sozlamalar:
   - **Name**: `optombazar-db`
   - **Database**: `optombazar`
   - **User**: `optombazar_user`
   - **Region**: Frankfurt
   - **Plan**: Starter ($7/oy)

### 4-qadam: Web Service yarating
1. Dashboard: "New +" → "Web Service"
2. Sozlamalar:
   - **Name**: `optombazar-uz`
   - **Build Command**: `./build.sh`
   - **Start Command**: `./start.sh`

### 5-qadam: Environment Variables qo'shing
```
NODE_ENV=production
PORT=10000
DATABASE_URL=[PostgreSQL connection string]
GOOGLE_AI_API_KEY=[ixtiyoriy - AI chat uchun]
TELEGRAM_BOT_TOKEN=[ixtiyoriy - Telegram bot uchun]
```

## 💰 Narxlar (oylik)

| Plan | Web Service | PostgreSQL | Jami |
|------|-------------|------------|------|
| **Free** | $0 (750 soat) | $0 (90 kun) | **Bepul** |
| **Starter** | $7 | $7 | **$14** |
| **Professional** | $25 | $20 | **$45** |

## 🔗 Foydali linklar

- **Saytingiz URL'i**: `https://optombazar-uz.onrender.com`
- **Health check**: `https://optombazar-uz.onrender.com/health`
- **API health**: `https://optombazar-uz.onrender.com/api/health`

## 🛠️ Deploy qilish buyruqlari

Render avtomatik deploy qiladi, lekin manual ishga tushirish uchun:

```bash
# Local test
npm ci
npm run build
npm start

# Production deploy (Render avtomatik)
git push origin main
```

## 📞 Support

**Muammo bo'lsa:**
1. Render logs ni tekshiring: Dashboard → Your Service → Logs
2. Environment variables to'g'ri ekanligini tekshiring
3. Database connection ishlayotganini tekshiring

**Telefon support**: +998 99 644 84 44 (Optombazar admin)

## ✅ Deploy muvaffaqiyatli bo'lgandan keyin

1. **Saytni tekshiring**: `https://optombazar-uz.onrender.com`
2. **Admin panel**: `/admin` yo'li orqali (admin@example.com / admin123)
3. **API test**: `/api/health` endpoint orqali
4. **Ma'lumotlar**: Kategoriyalar va mahsulotlar ko'rinishi kerak

## 🔒 Xavfsizlik maslahalari

- API kalitlarni hech qachon code ga commit qilmang
- Environment variables ni faqat Render dashboard orqali qo'shing
- Database backup ni muntazam oling
- SSL sertifikat avtomatik ishlaydi (Let's Encrypt)

## 🚨 Tez-tez uchraydigan muammolar

### Build muvaffaqiyatsiz
**Sabab**: Dependencies yetishmayapti
**Yechim**: `package.json` ni tekshiring

### Database ulanmayapti
**Sabab**: `DATABASE_URL` noto'g'ri
**Yechim**: PostgreSQL connection string ni qayta copy qiling

### 500 Server Error
**Sabab**: Environment variables noto'g'ri
**Yechim**: Render logs ni ko'ring va variables ni tekshiring

---

**🎉 Tabriklaymiz! Optombazar.uz platformangiz endi internetda!**

Deploy qilish jarayonida savollar bo'lsa, DEPLOYMENT_GUIDE.md faylida batafsil ma'lumot mavjud.