// Service Worker - Push notification qabul qilish uchun

// Service Worker o'rnatilayotganda
self.addEventListener('install', (event) => {
  console.log('Service Worker o\'rnatildi');
  self.skipWaiting(); // Yangi service worker'ni darhol faollashtirish
});

// Service Worker faollashganda  
self.addEventListener('activate', (event) => {
  console.log('Service Worker faollashtirildi');
  event.waitUntil(
    self.clients.claim() // Barcha ochiq tab'larni boshqarish
  );
});

// Push notification kelganda
self.addEventListener('push', (event) => {
  console.log('Push notification keldi:', event);
  
  if (!event.data) {
    console.log('Push event ma\'lumotlari yo\'q');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Push ma\'lumotlari:', data);
    
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.tag || 'optombazar-notification',
      data: {
        url: data.url || '/',
        timestamp: data.data?.timestamp || Date.now(),
      },
      actions: [
        {
          action: 'open',
          title: 'Ko\'rish'
        },
        {
          action: 'close',
          title: 'Yopish'
        }
      ],
      requireInteraction: false, // Avtomatik ko'rsatish
      vibrate: [200, 100, 200], // Vibratsiya naqshi
      silent: false,
      renotify: true,
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Push notification ko\'rsatishda xatolik:', error);
    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('OptomBazar.uz', {
        body: 'Yangilik mavjud!',
        icon: '/icon-192x192.png',
      })
    );
  }
});

// Notification bosilganda
self.addEventListener('notificationclick', (event) => {
  console.log('Notification bosildi:', event);
  
  const notification = event.notification;
  const action = event.action;
  
  if (action === 'close') {
    notification.close();
    return;
  }
  
  // Notification yopish
  notification.close();
  
  // Sahifani ochish yoki fokuslash
  const urlToOpen = notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Agar sahifa allaqachon ochiq bo'lsa, uni fokuslash
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Agar sahifa ochiq bo'lmasa, yangi tab ochish
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync uchun (offline holat)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event);
  
  if (event.tag === 'push-subscription-sync') {
    event.waitUntil(syncPushSubscription());
  }
});

// Push subscription'ni sync qilish funksiyasi
async function syncPushSubscription() {
  try {
    const registration = await self.registration;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      console.log('Push subscription syncing...');
      // Bu yerda server bilan sync qilish logic'i bo'lishi mumkin
    }
  } catch (error) {
    console.error('Push subscription sync xatoligi:', error);
  }
}