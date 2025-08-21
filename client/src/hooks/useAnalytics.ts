import { useEffect } from 'react';
import { useLocation } from 'wouter';

// Google Analytics tracking functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function useAnalytics() {
  const [location] = useLocation();

  // Page view tracking
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, [location]);

  const trackEvent = (action: string, parameters?: Record<string, any>) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: 'user_interaction',
        event_label: location,
        ...parameters
      });
    }
  };

  // E-commerce tracking functions
  const trackPurchase = (transactionId: string, value: number, currency: string = 'UZS', items: any[]) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items
      });
    }
  };

  const trackAddToCart = (currency: string = 'UZS', value: number, items: any[]) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'add_to_cart', {
        currency: currency,
        value: value,
        items: items
      });
    }
  };

  const trackRemoveFromCart = (currency: string = 'UZS', value: number, items: any[]) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'remove_from_cart', {
        currency: currency,
        value: value,
        items: items
      });
    }
  };

  const trackViewItem = (currency: string = 'UZS', value: number, items: any[]) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'view_item', {
        currency: currency,
        value: value,
        items: items
      });
    }
  };

  const trackBeginCheckout = (currency: string = 'UZS', value: number, items: any[]) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'begin_checkout', {
        currency: currency,
        value: value,
        items: items
      });
    }
  };

  const trackSearch = (searchTerm: string, resultsCount?: number) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'search', {
        search_term: searchTerm,
        results_count: resultsCount,
      });
    }
  };

  const trackSignUp = (method: string = 'email') => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'sign_up', {
        method: method
      });
    }
  };

  const trackLogin = (method: string = 'email') => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'login', {
        method: method
      });
    }
  };

  return {
    trackEvent,
    trackPurchase,
    trackAddToCart,
    trackRemoveFromCart,
    trackViewItem,
    trackBeginCheckout,
    trackSearch,
    trackSignUp,
    trackLogin
  };
}

// SEO va Analytics ma'lumotlarini server'ga yuborish uchun utility
export const sendAnalyticsToServer = async (eventType: string, data: any) => {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        data,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer
      })
    });
  } catch (error) {
    console.error('Analytics event yuborishda xatolik:', error);
  }
};