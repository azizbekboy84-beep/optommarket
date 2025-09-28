import 'dotenv/config';
import express, { type Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { registerRoutes } from './routes';
import { DatabaseStorage } from './database-storage';
import { startBlogScheduler } from './cron/blog-scheduler';
import { initializeTelegramBot } from './services/telegram-bot';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple session (no Redis) to unblock deploy
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // keep false; Render terminates TLS at proxy
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  })
);

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  } as any;

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try { logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`; } catch {}
      }
      if (logLine.length > 120) logLine = logLine.slice(0, 119) + '…';
      console.log(logLine);
    }
  });

  next();
});

(async () => {
  // Storage (DB-backed implementation)
  const storage = new DatabaseStorage();

  const server = await registerRoutes(app, storage);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
    throw err;
  });

  if (process.env.NODE_ENV === 'development') {
    const { setupVite } = await import('./vite');
    await setupVite(app, server);
  } else {
    const { serveStatic } = await import('./static');
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  const host = process.env.NODE_ENV === 'development' ? '127.0.0.1' : '0.0.0.0';

  server.listen(port, host, async () => {
    console.log(`serving on ${host}:${port}`);

    if (process.env.GOOGLE_AI_API_KEY && process.env.TELEGRAM_BOT_TOKEN) {
      try {
        console.log("Telegram bot ma'lumotlari tekshirilmoqda...");
        initializeTelegramBot();
        console.log('Blog scheduler ishga tushirilmoqda...');
        startBlogScheduler(storage);
      } catch (error) {
        console.error('Servislarni ishga tushirishda xatolik:', error);
      }
    } else {
      console.warn("GOOGLE_AI_API_KEY yoki TELEGRAM_BOT_TOKEN mavjud emas. AI va Telegram funksiyalari o'chirilgan.");
    }
  });
})();
