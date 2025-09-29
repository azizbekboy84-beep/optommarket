# 🚀 OptomMarket.uz - Render.com ga Deploy Qilish Qo'llanmasi

## ✅ Pre-Deploy Checklist

### 1. **Lokal Test**
```bash
# Build test
powershell -ExecutionPolicy Bypass -File build-windows.ps1

# Server test
npm run dev
```

### 2. **Environment Variables Tayyorlash**

Deploy qilishdan oldin quyidagi ma'lumotlarni tayyorlab oling:

#### 🔑 Majburiy:
- `DATABASE_URL` - Render PostgreSQL dan avtomatik olinadi
- `SESSION_SECRET` - Render avtomatik yaratadi

#### 🤖 Marketing va AI (ixtiyoriy, lekin tavsiya etiladi):
- `GOOGLE_AI_API_KEY` - [Google AI Studio](https://makersuite.google.com/app/apikey) dan oling
- `TELEGRAM_BOT_TOKEN` - [@BotFather](https://t.me/BotFather) dan bot yarating
- `TELEGRAM_CHANNEL_ID` - Telegram kanalingiz ID si

#### 🔔 Push Notifications:
```bash
# VAPID kalitlarini yaratish
node generate-vapid-keys.js
```

---

## 📝 Render.com ga Deploy Qilish (Qadam-baqadam)

### **1. Render.com ga Kirish**
1. [Render.com](https://render.com) ga kiring
2. GitHub hisob bilan bog'lang
3. Dashboard ga o'ting

### **2. Database Yaratish**
1. Dashboard da **"New +"** > **"PostgreSQL"** ni tanlang
2. Quyidagi ma'lumotlarni kiriting:
   - **Name**: `optombazar-db`
   - **Database**: `optombazar`
   - **User**: `optombazar_user`
   - **Region**: Frankfurt yoki yaqin region
   - **Plan**: Free (yoki Starter)
3. **"Create Database"** tugmasini bosing
4. Database tayyor bo'lguncha kuting (~2 daqiqa)
5. **Internal Database URL** ni nusxalab oling

### **3. Web Service Yaratish**
1. Dashboard da **"New +"** > **"Web Service"** ni tanlang
2. GitHub repository'ni tanlang: `OptomMarket.uz`
3. Quyidagi sozlamalarni kiriting:

#### **Basic Settings:**
   - **Name**: `optommarket-uz`
   - **Region**: Frankfurt (database bilan bir xil)
   - **Branch**: `main`
   - **Root Directory**: (bo'sh qoldiring)

#### **Build & Deploy:**
   - **Runtime**: Node
   - **Build Command**: `bash render-build.sh`
   - **Start Command**: `npm start`

#### **Plan:**
   - Free yoki Starter (tavsiya: Starter)

### **4. Environment Variables Sozlash**

**Environment** bo'limida quyidagi o'zgaruvchilarni qo'shing:

#### 🔴 Majburiy:
```
DATABASE_URL = [2-qadamda nusxalangan Internal Database URL]
NODE_ENV = production
SESSION_SECRET = [tasodifiy uzun string, masalan: my-super-secret-key-2024-xyz]
PORT = 10000
```

#### 🟡 Marketing funksiyalari uchun (ixtiyoriy):
```
GOOGLE_AI_API_KEY = [Google AI Studio dan]
TELEGRAM_BOT_TOKEN = [BotFather dan]
TELEGRAM_CHANNEL_ID = [@userinfobot dan kanal ID]
```

#### 🟢 Push Notifications uchun:
```
VAPID_PUBLIC_KEY = [generate-vapid-keys.js dan]
VAPID_PRIVATE_KEY = [generate-vapid-keys.js dan]
```

### **5. Deploy Qilish**
1. **"Create Web Service"** tugmasini bosing
2. Render avtomatik build va deploy qilishni boshlaydi
3. Build jarayonini **"Events"** tabida kuzating
4. Deploy tugagach (5-10 daqiqa), saytingiz tayyor bo'ladi!

---

## 🔍 Deploy Holati Tekshirish

### Build Logs Tekshirish:
```
✅ Installing dependencies...
✅ Building frontend...
✅ Building backend (Vite-free)...
✅ Vite-free build completed for Render!
```

### Live URL:
Deploy tugagach, Render sizga URL beradi:
```
https://optommarket-uz.onrender.com
```

---

## 🐛 Muammolarni Hal Qilish

### **Build Failed:**
- **Xato**: `npm ci` failed
  - **Yechim**: `package-lock.json` ni commit qiling

- **Xato**: Database connection failed
  - **Yechim**: DATABASE_URL to'g'ri kiritilganini tekshiring

### **Runtime Errors:**

#### 1. **Telegram Bot 409 Conflict**
```
Error: 409 Conflict: terminated by other getUpdates request
```
**Yechim**: 
- Faqat bitta Render instance ishlatilganini tekshiring
- Eski bot processlarni to'xtating: https://api.telegram.org/bot[YOUR_TOKEN]/deleteWebhook

#### 2. **AI Content Failed**
```
Error: Google AI API Key invalid
```
**Yechim**:
- GOOGLE_AI_API_KEY to'g'ri kiritilganini tekshiring
- [Google AI Studio](https://makersuite.google.com/app/apikey) da API key faol ekanini tasdiqlang

#### 3. **Database Connection Error**
```
Error: connect ETIMEDOUT
```
**Yechim**:
- Database va Web Service bir xil regionda ekanini tekshiring
- DATABASE_URL ichki (Internal) URL ekanini tasdiqlang

---

## 📊 Marketing Funksiyalar

Deploy qilganingizdan keyin, quyidagi avtomatik marketing funksiyalari ishga tushadi:

### **Blog Scheduler:**
- ⏰ Har 2 soatda AI blog post yaratish (08:00-20:00)
- 📝 O'zbek va rus tillarida content
- 🔗 SEO-optimallashgan ichki linklar

### **Telegram Marketing:**
- 🌅 Har kuni 09:00 - Yangi mahsulotlar e'loni
- 🌆 Har kuni 18:00 - Kechki reklama
- 📢 Dushanba va Juma 14:00 - Marketing kampaniyasi
- 📊 Yakshanba 20:00 - Haftalik hisobot
- 🎉 Har oy 1-sanasida - Maxsus aksiya

---

## 🔄 Yangilanishlarni Deploy Qilish

### Git orqali:
```bash
git add .
git commit -m "Yangi funksiya qo'shildi"
git push origin main
```

Render avtomatik deploy qiladi (Auto-Deploy yoqilgan bo'lsa).

### Manual Deploy:
Render Dashboard > **"Manual Deploy"** > **"Deploy latest commit"**

---

## 📞 Yordam

**Issues:**
- [GitHub Issues](https://github.com/yourusername/OptomMarket.uz/issues)

**Render Docs:**
- [Render Node.js Docs](https://render.com/docs/deploy-node-express-app)

**Telegram Bot:**
- [BotFather](https://t.me/BotFather)

---

## 🎯 Post-Deploy Checklist

- [ ] Sayt ochiladi va ishlayapti
- [ ] Database connection ishlayapti
- [ ] Mahsulotlar katalogi ko'rinadi
- [ ] Blog sahifasi ishlayapti
- [ ] PWA install qilish mumkin
- [ ] Telegram bot javob beradi (agar token o'rnatilgan bo'lsa)
- [ ] Blog scheduler ishlayapti (logs da tekshiring)

---

## 🎉 Tayyor!

Saytingiz endi ishlayapti va avtomatik marketing funksiyalari faol!

**Live URL**: `https://optommarket-uz.onrender.com`

**Monitoring**: Render Dashboard > Logs va Metrics

**Telegram Bot**: Kanalga marketing xabarlar avtomatik yuboriladi

---

**Muvaffaqiyatli deploy!** 🚀
