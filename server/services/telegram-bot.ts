import TelegramBot from 'node-telegram-bot-api';
import { storage } from '../storage.js';

let bot: TelegramBot | null = null;

// Telegram bot'ni ishga tushirish
export function initializeTelegramBot(): boolean {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    console.log('TELEGRAM_BOT_TOKEN topilmadi. Telegram bot funksiyalari o\'chirilgan.');
    return false;
  }

  try {
    bot = new TelegramBot(token, { polling: true });
    
    // Start komandasi
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const welcomeMessage = `
🎉 *Xush kelibsiz OptomMarket.uz ga!*

Biz O'zbekistondagi eng yirik optom savdo platformasimiz. Bizning bot orqali siz:

✅ Yangi mahsulotlar haqida bilib olishingiz mumkin
✅ Maxsus takliflar va chegirmalardan foydalanishingiz mumkin  
✅ Buyurtma berish va kuzatish imkoniyati
✅ 24/7 mijozlar xizmati

🌐 Saytimiz: https://optommarket.uz
📱 Mobil ilova: App Store va Google Play'da tez orada!

Savol yoki takliflaringiz bo'lsa, bizga yozing! 💬
      `;
      
      bot?.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
    });

    // Help komandasi
    bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const helpMessage = `
📋 *Mavjud komandalar:*

/start - Botni ishga tushirish
/help - Yordam
/products - Yangi mahsulotlar
/contact - Bog'lanish ma'lumotlari
/about - Biz haqimizda

💬 Shuningdek, menga istalgan savolingizni yozishingiz mumkin!
      `;
      
      bot?.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    });

    // Products komandasi
    bot.onText(/\/products/, async (msg) => {
      const chatId = msg.chat.id;
      
      try {
        const products = await storage.getProducts(undefined, true);
        const featuredProducts = products.slice(0, 5);
        
        if (featuredProducts.length === 0) {
          bot?.sendMessage(chatId, '🔍 Hozircha tavsiya etilgan mahsulotlar yo\'q.');
          return;
        }

        let message = '🔥 *Tavsiya etilgan mahsulotlar:*\n\n';
        
        featuredProducts.forEach((product: any, index: number) => {
          message += `${index + 1}. *${product.nameUz}*\n`;
          message += `💰 Narx: ${Number(product.wholesalePrice).toLocaleString()} so'm\n`;
          if (product.descriptionUz) {
            message += `📝 ${product.descriptionUz.substring(0, 100)}...\n`;
          }
          message += `🔗 https://optommarket.uz/products/${product.slug}\n\n`;
        });
        
        message += '🌐 Barcha mahsulotlar: https://optommarket.uz/catalog';
        
        bot?.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      } catch (error) {
        console.error('Telegram bot products error:', error);
        bot?.sendMessage(chatId, '❌ Mahsulotlarni yuklashda xatolik yuz berdi.');
      }
    });

    // Contact komandasi
    bot.onText(/\/contact/, (msg) => {
      const chatId = msg.chat.id;
      const contactMessage = `
📞 *Bog'lanish ma'lumotlari:*

🌐 Sayt: https://optommarket.uz
📧 Email: info@optommarket.uz
📱 Telefon: +998 90 123 45 67

📍 Manzil: Toshkent, O'zbekiston

🕒 Ish vaqti: 
Dushanba - Juma: 9:00 - 18:00
Shanba: 9:00 - 14:00
Yakshanba: Dam olish kuni

💬 Telegram orqali ham murojaat qilishingiz mumkin!
      `;
      
      bot?.sendMessage(chatId, contactMessage, { parse_mode: 'Markdown' });
    });

    // About komandasi
    bot.onText(/\/about/, (msg) => {
      const chatId = msg.chat.id;
      const aboutMessage = `
🏢 *OptomMarket.uz haqida:*

Biz O'zbekistondagi eng yirik optom savdo platformasimiz. 2024-yildan beri faoliyat yuritamiz va minglab mijozlarga xizmat ko'rsatamiz.

🎯 *Bizning maqsadimiz:*
• Sifatli mahsulotlarni eng qulay narxlarda taklif qilish
• Tez va ishonchli yetkazib berish xizmati
• 24/7 mijozlar bilan ishlash

📦 *Mahsulot turlari:*
• Polietilen paketlar
• Bir martalik idishlar  
• Elektronika
• Kiyim-kechak
• Va boshqa ko'plab kategoriyalar

🚀 Bizning saytimizga tashrif buyuring: https://optommarket.uz
      `;
      
      bot?.sendMessage(chatId, aboutMessage, { parse_mode: 'Markdown' });
    });

    // Boshqa xabarlar uchun javob
    bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      
      // Komandalar emas, oddiy xabar bo'lsa
      if (text && !text.startsWith('/')) {
        const responseMessage = `
Rahmat xabaringiz uchun! 😊

Sizning so'rovingiz bo'yicha tez orada javob beramiz. 

Tezroq javob olish uchun:
🌐 Saytimizga tashrif buyuring: https://optommarket.uz
📞 Telefon: +998 90 123 45 67
📧 Email: info@optommarket.uz

Yoki quyidagi komandalardan foydalaning:
/help - Yordam
/products - Mahsulotlar
/contact - Bog'lanish
        `;
        
        bot?.sendMessage(chatId, responseMessage);
      }
    });

    console.log('Telegram bot muvaffaqiyatli ishga tushdi!');
    return true;
  } catch (error) {
    console.error('Telegram bot xatoligi:', error);
    return false;
  }
}

// Yangi mahsulot e'lon qilish
export async function announceNewProduct(product: any): Promise<boolean> {
  if (!bot) {
    console.log('Telegram bot ishlamayapti');
    return false;
  }

  try {
    const message = `🆕 *YANGI MAHSULOT!*

📦 *${product.nameUz}*

💰 Narx: ${Number(product.wholesalePrice).toLocaleString()} so'm
📏 Birlik: ${product.unit}
📦 Minimal miqdor: ${product.minQuantity} ${product.unit}

${product.descriptionUz ? `📝 ${product.descriptionUz.substring(0, 200)}...` : ''}

🔗 Batafsil: https://optommarket.uz/products/${product.slug}
🛒 Buyurtma berish: https://optommarket.uz

#yangi_mahsulot #optom #OptomMarket`;

    // Bu yerda barcha obunachilarga yuborish kerak
    // Hozircha faqat console'ga chiqaramiz
    console.log('Yangi mahsulot e\'loni:', message);
    return true;
  } catch (error) {
    console.error('Yangi mahsulot e\'lon qilishda xatolik:', error);
    return false;
  }
}

// Haftalik hisobot yuborish
export async function sendWeeklyReport(): Promise<boolean> {
  if (!bot) {
    console.log('Telegram bot ishlamayapti');
    return false;
  }

  try {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Ma'lumotlarni olish
    const allProducts = await storage.getProducts();
    const newProductsThisWeek = allProducts.filter((p: any) => 
      new Date(p.createdAt || p.updatedAt) >= weekAgo
    );

    const message = `📊 *HAFTALIK HISOBOT*

📅 Muddat: ${weekAgo.toLocaleDateString('uz-UZ')} - ${today.toLocaleDateString('uz-UZ')}

📈 *Statistika:*
🆕 Yangi mahsulotlar: ${newProductsThisWeek.length} ta
📦 Jami mahsulotlar: ${allProducts.length} ta

💰 *Eng ommabop mahsulotlar:*
${allProducts.filter((p: any) => p.isFeatured).slice(0, 3).map((p: any, i: number) => 
  `${i + 1}. ${p.nameUz} - ${Number(p.wholesalePrice).toLocaleString()} so'm`
).join('\n')}

🌐 Sayt: https://optommarket.uz
📱 Telegram: @optommarketuz

#hisobot #statistika #OptomMarket`;

    console.log('Haftalik hisobot:', message);
    return true;
  } catch (error) {
    console.error('Haftalik hisobot yuborishda xatolik:', error);
    return false;
  }
}

// Maxsus aksiya e'lon qilish
export async function announceSpecialOffer(offerData: {
  title: string;
  description: string;
  discount: number;
  validUntil: Date;
  minOrder?: number;
}): Promise<boolean> {
  if (!bot) {
    console.log('Telegram bot ishlamayapti');
    return false;
  }

  try {
    const message = `🎉 *MAXSUS AKSIYA!*

🔥 *${offerData.title}*

📝 ${offerData.description}

💥 Chegirma: ${offerData.discount}%
⏰ Amal qilish muddati: ${offerData.validUntil.toLocaleDateString('uz-UZ')}
${offerData.minOrder ? `💰 Minimal buyurtma: ${offerData.minOrder.toLocaleString()} so'm` : ''}

🚀 Chegirmadan foydalanish uchun tezroq buyurtma bering!

🛒 Buyurtma: https://optommarket.uz
📞 Telefon: +998 90 123 45 67

#aksiya #chegirma #OptomMarket`;

    console.log('Maxsus aksiya e\'loni:', message);
    return true;
  } catch (error) {
    console.error('Maxsus aksiya e\'lon qilishda xatolik:', error);
    return false;
  }
}

// Blog postni kanalga yuborish
export async function sendBlogPostToChannel(blogPost: {
  title: string;
  content: string;
  imageUrl?: string;
  url: string;
}): Promise<boolean> {
  if (!bot) {
    console.log('Telegram bot ishlamayapti');
    return false;
  }

  try {
    const message = `📢 *${blogPost.title}*\n\n${blogPost.content.substring(0, 300)}...\n\n🔗 Batafsil: ${blogPost.url}`;
    
    // Bu yerda kanal ID sini o'zgartiring
    const channelId = process.env.TELEGRAM_CHANNEL_ID || '';
    
    if (blogPost.imageUrl) {
      await bot.sendPhoto(channelId, blogPost.imageUrl, {
        caption: message,
        parse_mode: 'Markdown'
      });
    } else {
      await bot.sendMessage(channelId, message, { parse_mode: 'Markdown' });
    }
    
    return true;
  } catch (error) {
    console.error('Blog post yuborishda xatolik:', error);
    return false;
  }
}

// Test xabari yuborish
export async function sendTestMessage(chatId: string): Promise<boolean> {
  if (!bot) {
    console.log('Telegram bot ishlamayapti');
    return false;
  }

  try {
    await bot.sendMessage(chatId, '✅ Test xabari muvaffaqiyatli yuborildi!');
    return true;
  } catch (error) {
    console.error('Test xabari yuborishda xatolik:', error);
    return false;
  }
}

// Bot haqida ma'lumot olish
export async function getBotInfo(): Promise<{
  id: number;
  username: string;
  firstName: string;
  isActive: boolean;
} | null> {
  if (!bot) {
    console.log('Telegram bot ishlamayapti');
    return null;
  }

  try {
    const me = await bot.getMe();
    return {
      id: me.id,
      username: me.username || '',
      firstName: me.first_name,
      isActive: true
    };
  } catch (error) {
    console.error('Bot ma\'lumotlarini olishda xatolik:', error);
    return null;
  }
}

// Mahsulotni kanalga yuborish
export async function sendProductToChannel(product: any): Promise<boolean> {
  if (!bot) {
    console.log('Telegram bot ishlamayapti');
    return false;
  }

  try {
    const message = `🆕 *YANGI MAHSULOT!*

📦 *${product.nameUz}*

💰 Narx: ${Number(product.wholesalePrice).toLocaleString()} so'm
📏 Birlik: ${product.unit}
📦 Minimal miqdor: ${product.minQuantity} ${product.unit}

${product.descriptionUz ? `📝 ${product.descriptionUz.substring(0, 200)}...` : ''}

🔗 Batafsil: https://optommarket.uz/products/${product.slug}
🛒 Buyurtma berish: https://optommarket.uz

#yangi_mahsulot #optom #OptomMarket`;

    const channelId = process.env.TELEGRAM_CHANNEL_ID || '';
    
    if (channelId) {
      await bot.sendMessage(channelId, message, { parse_mode: 'Markdown' });
      return true;
    } else {
      console.log('TELEGRAM_CHANNEL_ID o\'rnatilmagan');
      return false;
    }
  } catch (error) {
    console.error('Mahsulotni kanalga yuborishda xatolik:', error);
    return false;
  }
}

// Marketing xabari yuborish
export async function sendMarketingMessage(message: string): Promise<boolean> {
  if (!bot) {
    console.log('Telegram bot ishlamayapti');
    return false;
  }

  try {
    const channelId = process.env.TELEGRAM_CHANNEL_ID || '';
    
    if (channelId) {
      await bot.sendMessage(channelId, message, { parse_mode: 'Markdown' });
      return true;
    } else {
      console.log('TELEGRAM_CHANNEL_ID o\'rnatilmagan');
      return false;
    }
  } catch (error) {
    console.error('Marketing xabari yuborishda xatolik:', error);
    return false;
  }
}
