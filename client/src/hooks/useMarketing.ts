import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useMarketing() {
  const [location] = useLocation();
  // DataLayer ni initialize qilish
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
    }
  }, []);

  // GTM orqali event yuborish
  const pushToDataLayer = (eventData: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(eventData);
    }
  };

  // Facebook Pixel orqali event yuborish
  const trackFacebookEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters);
    }
  };

  // Google Ads Conversion tracking
  const trackConversion = (conversionId: string, conversionLabel: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': `${conversionId}/${conversionLabel}`,
        'value': value,
        'currency': 'UZS'
      });
    }
  };

  // Enhanced E-commerce tracking (GTM/GA4)
  const trackPageView = (pagePath: string, pageTitle?: string) => {
    pushToDataLayer({
      event: 'page_view',
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href
    });

    // Facebook pixel page view
    trackFacebookEvent('PageView');
  };

  const trackProductView = (productId: string, productName: string, category: string, price: number) => {
    // Google Analytics 4 / GTM
    pushToDataLayer({
      event: 'view_item',
      currency: 'UZS',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        category: category,
        price: price,
        quantity: 1
      }]
    });

    // Facebook Pixel
    trackFacebookEvent('ViewContent', {
      content_ids: [productId],
      content_name: productName,
      content_category: category,
      content_type: 'product',
      value: price,
      currency: 'UZS'
    });
  };

  const trackAddToCart = (productId: string, productName: string, category: string, price: number, quantity: number = 1) => {
    const value = price * quantity;

    // Google Analytics 4 / GTM
    pushToDataLayer({
      event: 'add_to_cart',
      currency: 'UZS',
      value: value,
      items: [{
        item_id: productId,
        item_name: productName,
        category: category,
        price: price,
        quantity: quantity
      }]
    });

    // Facebook Pixel
    trackFacebookEvent('AddToCart', {
      content_ids: [productId],
      content_name: productName,
      content_category: category,
      content_type: 'product',
      value: value,
      currency: 'UZS'
    });
  };

  const trackRemoveFromCart = (productId: string, productName: string, price: number, quantity: number = 1) => {
    const value = price * quantity;

    // Google Analytics 4 / GTM
    pushToDataLayer({
      event: 'remove_from_cart',
      currency: 'UZS',
      value: value,
      items: [{
        item_id: productId,
        item_name: productName,
        price: price,
        quantity: quantity
      }]
    });
  };

  const trackBeginCheckout = (cartValue: number, items: any[]) => {
    // Google Analytics 4 / GTM
    pushToDataLayer({
      event: 'begin_checkout',
      currency: 'UZS',
      value: cartValue,
      items: items
    });

    // Facebook Pixel
    trackFacebookEvent('InitiateCheckout', {
      value: cartValue,
      currency: 'UZS',
      num_items: items.length,
      content_ids: items.map(item => item.item_id)
    });
  };

  const trackPurchase = (orderId: string, orderValue: number, items: any[], customerData?: any) => {
    // Google Analytics 4 / GTM
    pushToDataLayer({
      event: 'purchase',
      transaction_id: orderId,
      currency: 'UZS',
      value: orderValue,
      items: items,
      customer_data: customerData
    });

    // Facebook Pixel
    trackFacebookEvent('Purchase', {
      value: orderValue,
      currency: 'UZS',
      content_ids: items.map(item => item.item_id),
      content_type: 'product',
      num_items: items.length
    });

    // Google Ads Conversion (bu yerda real conversion ID va label kerak)
    trackConversion('AW-CONVERSION_ID', 'PURCHASE_LABEL', orderValue);
  };

  const trackSearch = (searchTerm: string, resultsCount: number) => {
    // Google Analytics 4 / GTM
    pushToDataLayer({
      event: 'search',
      search_term: searchTerm,
      results_count: resultsCount
    });

    // Facebook Pixel
    trackFacebookEvent('Search', {
      search_string: searchTerm
    });
  };

  const trackSignUp = (method: string = 'email') => {
    // Google Analytics 4 / GTM
    pushToDataLayer({
      event: 'sign_up',
      method: method
    });

    // Facebook Pixel
    trackFacebookEvent('CompleteRegistration', {
      status: 'completed'
    });
  };

  const trackLogin = (method: string = 'email') => {
    // Google Analytics 4 / GTM
    pushToDataLayer({
      event: 'login',
      method: method
    });
  };

  // Ad click tracking (reklama bosishlarini kuzatish)
  const trackAdClick = (source: string, medium: string, campaign: string) => {
    pushToDataLayer({
      event: 'ad_click',
      traffic_source: source,
      traffic_medium: medium,
      campaign_name: campaign,
      click_timestamp: new Date().toISOString()
    });
  };

  // Landing page tracking (reklama sahifalariga tushish)
  const trackLandingPage = (source: string, medium: string, campaign: string) => {
    pushToDataLayer({
      event: 'landing_page_view',
      traffic_source: source,
      traffic_medium: medium,
      campaign_name: campaign,
      landing_page: location
    });
  };

  return {
    pushToDataLayer,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
    trackPurchase,
    trackSearch,
    trackSignUp,
    trackLogin,
    trackAdClick,
    trackLandingPage,
    trackConversion,
    trackFacebookEvent
  };
}