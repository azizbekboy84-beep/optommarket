import type { Express } from "express";
import { generateBlogPost, testAIContentGenerator } from "../services/ai-content-generator";
import { sendBlogPostToChannel, sendTestMessage, getBotInfo } from "../services/telegram-bot";
import { createTestBlogPost } from "../cron/blog-scheduler";

export function registerAITestRoutes(app: Express, storage: any) {

// Test AI Content Generator
app.post("/api/ai/test-ai", async (req, res) => {
  try {
    console.log('AI content generator test ishga tushirilmoqda...');
    
    const { language = 'uz' } = req.body;
    
    if (!['uz', 'ru'].includes(language)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language uz yoki ru bo\'lishi kerak' 
      });
    }

    const blogContent = await generateBlogPost(language);
    
    res.json({
      success: true,
      message: `${language.toUpperCase()} tilida blog post muvaffaqiyatli yaratildi`,
      data: blogContent
    });
  } catch (error) {
    console.error('AI test xatoligi:', error);
    res.status(500).json({
      success: false,
      message: 'AI test qilishda xatolik yuz berdi',
      error: error instanceof Error ? error.message : 'Noma\'lum xatolik'
    });
  }
});

// Test Telegram Bot
app.post("/api/ai/test-telegram", async (req, res) => {
  try {
    console.log('Telegram bot test qilinmoqda...');
    
    // Bot ma'lumotlarini olish
    const botInfo = await getBotInfo();
    
    // Test xabari yuborish
    const messageResult = await sendTestMessage();
    
    res.json({
      success: true,
      message: 'Telegram bot test muvaffaqiyatli o\'tdi',
      data: {
        bot: botInfo,
        messageSent: messageResult
      }
    });
  } catch (error) {
    console.error('Telegram test xatoligi:', error);
    res.status(500).json({
      success: false,
      message: 'Telegram bot test qilishda xatolik yuz berdi',
      error: error instanceof Error ? error.message : 'Noma\'lum xatolik'
    });
  }
});

// AI blog post yaratish va Telegram'ga yuborish
app.post("/api/ai/create-blog", async (req, res) => {
  try {
    console.log('AI blog post yaratish va Telegram\'ga yuborish...');
    
    const { language = 'uz' } = req.body;
    
    if (!['uz', 'ru'].includes(language)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language uz yoki ru bo\'lishi kerak' 
      });
    }

    await createTestBlogPost(storage, language);
    
    res.json({
      success: true,
      message: `${language.toUpperCase()} tilida blog post yaratildi va Telegram kanaliga yuborildi`
    });
  } catch (error) {
    console.error('Blog yaratish xatoligi:', error);
    res.status(500).json({
      success: false,
      message: 'Blog post yaratishda xatolik yuz berdi',
      error: error instanceof Error ? error.message : 'Noma\'lum xatolik'
    });
  }
});

// Barcha testlarni bir vaqtda o'tkazish
app.post("/api/ai/test-all", async (req, res) => {
  try {
    console.log('Barcha AI va Telegram testlari ishga tushirilmoqda...');
    
    const results = {
      aiTest: { success: false, data: null, error: null },
      telegramTest: { success: false, data: null, error: null },
      blogCreation: { success: false, data: null, error: null }
    };

    // AI Content Generator test
    try {
      const aiResult = await testAIContentGenerator();
      results.aiTest.success = true;
      results.aiTest.data = aiResult;
    } catch (error) {
      results.aiTest.error = error instanceof Error ? error.message : 'Noma\'lum xatolik';
    }

    // Telegram Bot test
    try {
      const botInfo = await getBotInfo();
      const messageResult = await sendTestMessage();
      results.telegramTest.success = true;
      results.telegramTest.data = { bot: botInfo, messageSent: messageResult };
    } catch (error) {
      results.telegramTest.error = error instanceof Error ? error.message : 'Noma\'lum xatolik';
    }

    // Blog yaratish test
    try {
      await createTestBlogPost(storage, 'uz');
      results.blogCreation.success = true;
      results.blogCreation.data = 'Blog post yaratildi va yuborildi';
    } catch (error) {
      results.blogCreation.error = error instanceof Error ? error.message : 'Noma\'lum xatolik';
    }

    const successCount = Object.values(results).filter(r => r.success).length;
    
    res.json({
      success: successCount > 0,
      message: `${successCount}/3 test muvaffaqiyatli o'tdi`,
      results: results
    });
  } catch (error) {
    console.error('Umumiy test xatoligi:', error);
    res.status(500).json({
      success: false,
      message: 'Testlarni o\'tkazishda xatolik yuz berdi',
      error: error instanceof Error ? error.message : 'Noma\'lum xatolik'
    });
  }
});

// AI servislar statusini tekshirish
app.get("/api/ai/status", async (req, res) => {
  const status = {
    googleAI: !!process.env.GOOGLE_AI_API_KEY,
    telegramBot: !!process.env.TELEGRAM_BOT_TOKEN,
    envVars: {
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY ? 'SET' : 'NOT_SET',
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? 'SET' : 'NOT_SET',
      TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID || '@optombazaruzb'
    }
  };

  res.json({
    success: true,
    message: 'AI servislari status ma\'lumotlari',
    data: status
  });
});

}