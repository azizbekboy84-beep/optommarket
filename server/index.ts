import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { registerRoutes } from "./routes";
import { DatabaseStorage } from "./database-storage";
import { startBlogScheduler } from "./cron/blog-scheduler";
import { initializeTelegramBot } from "./services/telegram-bot";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Redis client yaratish
let redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis xatosi:', err));

// Redis'ga ulanish
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis-ga muvaffaqiyatli ulanildi');
  } catch (err) {
    console.error('Redis-ga ulanishda xatolik:', err);
    process.exit(1);
  }
};

// Session configuration
const sessionConfig = {
  store: new RedisStore({
    client: redisClient,
    prefix: 'session:',
  }),
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-for-development',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS bo'lsa true qo'ying
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
};

app.use(session(sessionConfig));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any;

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
  // Redis'ga ulanishni boshlash
  await connectRedis();
  
  // Database Storage yaratish (PostgreSQL blog posts uchun)
  const storage = new DatabaseStorage();
  
  const server = await registerRoutes(app, storage);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    // Serve static files in production
    const { serveStatic } = await import("./static");
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = process.env.NODE_ENV === 'development' ? '127.0.0.1' : '0.0.0.0';
  
  server.listen(port, host, async () => {
    console.log(`serving on ${host}:${port}`);
    
    // AI va Telegram servislarini ishga tushirish
    if (process.env.GOOGLE_AI_API_KEY && process.env.TELEGRAM_BOT_TOKEN) {
      try {
        // Telegram bot ma'lumotlarini tekshirish
        console.log('Telegram bot ma\'lumotlari tekshirilmoqda...');
        initializeTelegramBot();
        
        // Blog scheduler'ni ishga tushirish
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
