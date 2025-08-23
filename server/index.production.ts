import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { MemStorage } from "./storage";
import { db } from "./db";
import { startBlogScheduler } from "./cron/blog-scheduler";
import { getBotInfo } from "./services/telegram-bot";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-for-development',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

(async () => {
  // Database Storage yaratish (PostgreSQL blog posts uchun)
  const { DatabaseStorage } = await import("./database-storage");
  const storage = new DatabaseStorage();
  
  const server = await registerRoutes(app, storage);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Production da faqat static files serve qilish
  const { serveStatic } = await import("./static");
  serveStatic(app);

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    console.log(`serving on port ${port}`);
    
    // AI va Telegram servislarini ishga tushirish
    if (process.env.GOOGLE_AI_API_KEY && process.env.TELEGRAM_BOT_TOKEN) {
      try {
        console.log('Telegram bot ma\'lumotlari tekshirilmoqda...');
        await getBotInfo();
        
        console.log('Blog scheduler ishga tushirilmoqda...');
        startBlogScheduler(storage);
        
      } catch (error) {
        console.error('Servislarni ishga tushirishda xatolik:', error);
      }
    } else {
      console.warn('GOOGLE_AI_API_KEY yoki TELEGRAM_BOT_TOKEN mavjud emas. AI va Telegram funksiyalari o\'chirilgan.');
    }
  });
})();