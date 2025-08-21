import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
}

export function usePushNotification() {
  const { toast } = useToast();
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    isSubscribed: false,
    isLoading: false,
    error: null,
  });

  // Brauzer support va permission holatini tekshirish
  useEffect(() => {
    const checkSupport = () => {
      const isSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      const permission = isSupported ? Notification.permission : 'denied';
      
      setState(prev => ({
        ...prev,
        isSupported,
        permission,
      }));

      if (isSupported) {
        checkSubscriptionStatus();
      }
    };

    checkSupport();
  }, []);

  // Joriy obuna holatini tekshirish
  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      setState(prev => ({
        ...prev,
        isSubscribed: !!subscription,
      }));
    } catch (error) {
      console.error('Subscription holatini tekshirishda xatolik:', error);
    }
  }, []);

  // Service Worker'ni ro'yxatdan o'tkazish
  const registerServiceWorker = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('Service Worker ro\'yxatdan o\'tkazildi:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker ro\'yxatdan o\'tkazishda xatolik:', error);
      throw error;
    }
  }, []);

  // VAPID public key olish
  const getVapidPublicKey = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch('/api/push/vapid-public-key');
      if (!response.ok) {
        throw new Error('VAPID public key olishda xatolik');
      }
      
      const data = await response.json();
      return data.publicKey;
    } catch (error) {
      console.error('VAPID public key olishda xatolik:', error);
      throw error;
    }
  }, []);

  // Push notification'ga obuna bo'lish
  const subscribe = useCallback(async () => {
    if (!state.isSupported) {
      throw new Error('Push notification bu brauzerda qo\'llab-quvvatlanmaydi');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Ruxsat so'rash
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));

      if (permission !== 'granted') {
        throw new Error('Push notification uchun ruxsat berilmadi');
      }

      // Service Worker'ni ro'yxatdan o'tkazish
      const registration = await registerServiceWorker();

      // VAPID public key olish
      const vapidPublicKey = await getVapidPublicKey();

      // Base64 string'ni Uint8Array'ga konvert qilish
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      // Push Manager'dan obuna olish
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // Obunani serverga yuborish
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        throw new Error('Obunani serverga saqlashda xatolik');
      }

      setState(prev => ({
        ...prev,
        isSubscribed: true,
        isLoading: false,
      }));

      toast({
        title: 'Muvaffaqiyat!',
        description: 'Push notification\'larga muvaffaqiyatli obuna bo\'ldingiz',
      });

    } catch (error: any) {
      console.error('Push notification obunasida xatolik:', error);
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));

      toast({
        title: 'Xatolik',
        description: error.message || 'Push notification obunasida xatolik yuz berdi',
        variant: 'destructive',
      });
    }
  }, [state.isSupported, getVapidPublicKey, registerServiceWorker, toast]);

  // Obunadan chiqish
  const unsubscribe = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Brauzerdan obunani o'chirish
        await subscription.unsubscribe();

        // Serverdan ham o'chirish
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        });
      }

      setState(prev => ({
        ...prev,
        isSubscribed: false,
        isLoading: false,
      }));

      toast({
        title: 'Obuna o\'chirildi',
        description: 'Push notification obunangiz o\'chirildi',
      });

    } catch (error: any) {
      console.error('Push notification obunasini o\'chirishda xatolik:', error);
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));

      toast({
        title: 'Xatolik',
        description: 'Obunani o\'chirishda xatolik yuz berdi',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return {
    ...state,
    subscribe,
    unsubscribe,
    checkSubscriptionStatus,
  };
}

// Base64 URL'ni Uint8Array'ga konvert qilish helper funksiyasi
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}