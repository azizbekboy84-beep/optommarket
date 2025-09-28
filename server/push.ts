import { Router } from 'express';
import webpush from 'web-push';

const router = Router();

// In-memory storage for push subscriptions (development only)
const subscriptionsStore = new Map<string, any>();

// VAPID kalitlarini sozlash
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(
      'mailto:support@optommarket.uz',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    console.log('VAPID kalitlari muvaffaqiyatli sozlandi.');
  } catch (error) {
    console.warn('VAPID kalitlari noto\'g\'ri. Push notification ishlamaydi:', error);
  }
} else {
  console.warn('VAPID kalitlari topilmadi. Push notification ishlamaydi.');
}

// VAPID public key'ni frontend'ga qaytarish
router.get('/vapid-public-key', (req, res) => {
  if (!process.env.VAPID_PUBLIC_KEY) {
    return res.status(500).json({ message: 'VAPID public key topilmadi' });
  }
  
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Yangi obuna qo'shish
router.post('/subscribe', async (req, res) => {
  try {
    const { subscription, userAgent } = req.body;
    const userId = (req.session as any)?.user?.id || null;
    
    if (!subscription) {
      return res.status(400).json({ message: 'Subscription obyekti majburiy' });
    }

    // In-memory storage'da saqlash
    const subscriptionKey = subscription.endpoint;
    const subscriptionData = {
      id: Date.now().toString(),
      userId,
      subscription,
      userAgent: userAgent || req.get('user-agent'),
      isActive: true,
      createdAt: new Date()
    };
    
    subscriptionsStore.set(subscriptionKey, subscriptionData);

    res.status(201).json({ 
      message: 'Push notification obunasi muvaffaqiyatli yaratildi',
      subscription: subscriptionData 
    });
  } catch (error) {
    console.error('Push subscription xatoligi:', error);
    res.status(500).json({ message: 'Obuna yaratishda xatolik yuz berdi' });
  }
});

// Obunani o'chirish
router.post('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({ message: 'Endpoint majburiy' });
    }

    // In-memory storage'dan o'chirish
    const subscription = subscriptionsStore.get(endpoint);
    if (subscription) {
      subscription.isActive = false;
      subscriptionsStore.set(endpoint, subscription);
    }

    res.json({ message: 'Obuna muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    console.error('Push unsubscribe xatoligi:', error);
    res.status(500).json({ message: 'Obunani o\'chirishda xatolik yuz berdi' });
  }
});

// Admin: barcha obunachilarga xabar yuborish
export async function sendNotificationToAll(payload: {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  tag?: string;
}) {
  try {
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      console.warn('VAPID kalitlari yo\'q, push notification yuborilmaydi');
      return;
    }

    // Barcha faol obunalarni olamiz
    const subscriptions = Array.from(subscriptionsStore.values()).filter(sub => sub.isActive);

    if (subscriptions.length === 0) {
      console.log('Faol obunachalar topilmadi');
      return;
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/favicon.ico',
      url: payload.url || '/',
      tag: payload.tag || 'optombazar-notification',
      data: {
        url: payload.url || '/',
        timestamp: Date.now(),
      }
    });

    // Har bir obunachiga push notification yuboramiz
    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, notificationPayload);
        console.log(`Push notification yuborildi: ${sub.id}`);
      } catch (error: any) {
        console.error(`Push notification yuborishda xatolik (${sub.id}):`, error);
        
        // Agar endpoint mavjud bo'lmasa yoki muddati o'tgan bo'lsa, obunani o'chiramiz
        if (error.statusCode === 410 || error.statusCode === 404) {
          sub.isActive = false;
          subscriptionsStore.set(sub.subscription.endpoint, sub);
          console.log(`Yaroqsiz obuna o'chirildi: ${sub.id}`);
        }
      }
    });

    await Promise.all(sendPromises);
    console.log(`${subscriptions.length} obunachiga push notification yuborildi`);
  } catch (error) {
    console.error('Push notification yuborishda umumiy xatolik:', error);
  }
}

// Test notification yuborish
router.post('/send', async (req, res) => {
  try {
    const { title, body, url, icon, tag } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: 'Title va body majburiy' });
    }

    // Barcha faol obunachilarga yuborish
    await sendNotificationToAll({
      title,
      body,
      icon: icon || '/icon-192x192.png',
      url: url || '/',
      tag: tag || 'optombazar-notification',
    });

    // Obunchilar sonini qaytarish
    const subscriptions = Array.from(subscriptionsStore.values()).filter(sub => sub.isActive);

    res.json({ 
      message: 'Bildirishnoma barcha obunachilarga yuborildi',
      successCount: subscriptions.length 
    });
  } catch (error) {
    console.error('Push notification yuborishda xatolik:', error);
    res.status(500).json({ message: 'Bildirishnoma yuborishda xatolik yuz berdi' });
  }
});

// Subscribers count endpoint
router.get('/subscribers-count', async (req, res) => {
  try {
    const subscriptions = Array.from(subscriptionsStore.values()).filter(sub => sub.isActive);
    res.json({ count: subscriptions.length });
  } catch (error) {
    console.error('Subscribers count olishda xatolik:', error);
    res.status(500).json({ message: 'Subscribers count olishda xatolik' });
  }
});

export default router;
