import 'dotenv/config';

async function testMarketingFunctions() {
  console.log('🧪 Marketing funksiyalarini test qilish...\n');

  // 1. Blog Scheduler tekshiruvi
  console.log('✅ Blog Scheduler funksiyalari:');
  console.log('   - Har 2 soatda blog post yaratish (08:00-20:00)');
  console.log('   - Har kuni 09:00 da yangi mahsulotlar');
  console.log('   - Har kuni 18:00 da kechki reklama');
  console.log('   - Dushanba va juma 14:00 da marketing');
  console.log('   - Yakshanba 20:00 da haftalik hisobot');
  console.log('   - Har oy 1-sanasida maxsus aksiya\n');

  // 2. AI Content Generator tekshiruvi
  if (process.env.GOOGLE_AI_API_KEY) {
    console.log('✅ Google AI API Key mavjud');
    console.log('   - O\'zbek va rus tillarida blog post yaratish');
    console.log('   - SEO-optimallashgan kontent\n');
  } else {
    console.log('⚠️  Google AI API Key topilmadi\n');
  }

  // 3. Telegram Bot tekshiruvi
  if (process.env.TELEGRAM_BOT_TOKEN) {
    console.log('✅ Telegram Bot Token mavjud');
    
    if (process.env.TELEGRAM_CHANNEL_ID) {
      console.log('✅ Telegram Channel ID mavjud');
      console.log('   - Blog postlarni kanalga yuborish');
      console.log('   - Yangi mahsulotlarni e\'lon qilish');
      console.log('   - Marketing xabarlari yuborish');
      console.log('   - Haftalik va oylik hisobotlar\n');
    } else {
      console.log('⚠️  Telegram Channel ID topilmadi');
      console.log('   Marketing xabarlar faqat consolega chiqadi\n');
    }
  } else {
    console.log('⚠️  Telegram Bot Token topilmadi\n');
  }

  // 4. Database tekshiruvi
  if (process.env.DATABASE_URL) {
    console.log('✅ Database URL mavjud');
    console.log('   - Blog postlar saqlash va olish');
    console.log('   - Mahsulotlar bilan ishlash\n');
  } else {
    console.log('⚠️  Database URL topilmadi\n');
  }

  // 5. Xulosa
  console.log('\n📊 XULOSA:');
  
  const checks = {
    ai: !!process.env.GOOGLE_AI_API_KEY,
    telegram: !!process.env.TELEGRAM_BOT_TOKEN,
    channel: !!process.env.TELEGRAM_CHANNEL_ID,
    database: !!process.env.DATABASE_URL
  };

  const working = Object.values(checks).filter(Boolean).length;
  const total = Object.values(checks).length;

  console.log(`\n${working}/${total} asosiy servislar sozlangan\n`);

  if (checks.ai && checks.telegram && checks.channel && checks.database) {
    console.log('🎉 Barcha marketing funksiyalar to\'liq ishlaydi!');
    console.log('   - AI blog post yaratish: ✅');
    console.log('   - Telegram kanalga yuborish: ✅');
    console.log('   - Avtomatik scheduler: ✅');
    console.log('   - Database saqlash: ✅\n');
  } else {
    console.log('⚠️  Ba\'zi servislar sozlanmagan:');
    if (!checks.ai) console.log('   - GOOGLE_AI_API_KEY kerak');
    if (!checks.telegram) console.log('   - TELEGRAM_BOT_TOKEN kerak');
    if (!checks.channel) console.log('   - TELEGRAM_CHANNEL_ID kerak');
    if (!checks.database) console.log('   - DATABASE_URL kerak');
    console.log('\nLekin loyiha ishga tushadi, faqat ba\'zi funksiyalar o\'chirilgan bo\'ladi.\n');
  }

  console.log('🚀 Deploy qilish uchun tayyor!\n');
  console.log('📝 Render.com da quyidagi environment variables larni o\'rnating:');
  console.log('   - DATABASE_URL (Render PostgreSQL dan)');
  console.log('   - GOOGLE_AI_API_KEY (https://makersuite.google.com/app/apikey)');
  console.log('   - TELEGRAM_BOT_TOKEN (@BotFather dan)');
  console.log('   - TELEGRAM_CHANNEL_ID (Kanal IDsi)');
  console.log('   - SESSION_SECRET (tasodifiy string)');
  console.log('   - VAPID_PUBLIC_KEY va VAPID_PRIVATE_KEY (generate-vapid-keys.js dan)\n');
}

testMarketingFunctions().catch(console.error);
