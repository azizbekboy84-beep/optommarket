// Marketing utility functions

// UTM parameter tracking
export const getUtmParameters = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content'),
  };
};

// Save UTM parameters to localStorage for session tracking
export const saveUtmParameters = () => {
  const utmParams = getUtmParameters();
  const hasUtmParams = Object.values(utmParams).some(param => param !== null);
  
  if (hasUtmParams) {
    localStorage.setItem('utm_params', JSON.stringify({
      ...utmParams,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      referrer: document.referrer
    }));
  }
};

// Get saved UTM parameters
export const getSavedUtmParameters = () => {
  const saved = localStorage.getItem('utm_params');
  return saved ? JSON.parse(saved) : null;
};

// Track UTM parameters to backend
export const trackUtmParameters = async () => {
  const utmParams = getUtmParameters();
  const hasUtmParams = Object.values(utmParams).some(param => param !== null);
  
  if (hasUtmParams) {
    try {
      await fetch('/api/marketing/track-utm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...utmParams,
          page_url: window.location.href,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('UTM tracking error:', error);
    }
  }
};

// Ad platform detection
export const detectAdPlatform = () => {
  const referrer = document.referrer;
  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get('utm_source');
  
  if (utm_source) {
    return utm_source.toLowerCase();
  }
  
  if (referrer.includes('google.com') || referrer.includes('googleadservices.com')) {
    return 'google';
  }
  
  if (referrer.includes('facebook.com') || referrer.includes('fb.com')) {
    return 'facebook';
  }
  
  if (referrer.includes('instagram.com')) {
    return 'instagram';
  }
  
  if (referrer.includes('t.co') || referrer.includes('twitter.com')) {
    return 'twitter';
  }
  
  return 'direct';
};

// Generate unique session ID for marketing tracking
export const generateSessionId = () => {
  let sessionId = localStorage.getItem('marketing_session_id');
  
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('marketing_session_id', sessionId);
  }
  
  return sessionId;
};

// Track marketing conversion
export const trackMarketingConversion = async (
  conversionType: string, 
  value?: number, 
  orderId?: string
) => {
  const utmParams = getSavedUtmParameters();
  const sessionId = generateSessionId();
  
  try {
    await fetch('/api/marketing/track-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'conversion',
        eventData: {
          conversionType,
          value,
          orderId,
          utm_params: utmParams,
          ad_platform: detectAdPlatform(),
          page_url: window.location.href
        },
        sessionId,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Conversion tracking error:', error);
  }
};

// Landing page performance tracking
export const trackLandingPage = async () => {
  const utmParams = getUtmParameters();
  const hasUtmParams = Object.values(utmParams).some(param => param !== null);
  
  if (hasUtmParams) {
    const sessionId = generateSessionId();
    
    try {
      await fetch('/api/marketing/track-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'landing_page_view',
          eventData: {
            utm_params: utmParams,
            ad_platform: detectAdPlatform(),
            page_url: window.location.href,
            referrer: document.referrer,
            load_time: performance.now()
          },
          sessionId,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Landing page tracking error:', error);
    }
  }
};

// Initialize marketing tracking on page load
export const initializeMarketingTracking = () => {
  // Save UTM parameters
  saveUtmParameters();
  
  // Track UTM parameters
  trackUtmParameters();
  
  // Track landing page if from ad
  trackLandingPage();
};

// Clean up old marketing data (call periodically)
export const cleanupMarketingData = () => {
  const saved = localStorage.getItem('utm_params');
  if (saved) {
    const data = JSON.parse(saved);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    if (new Date(data.timestamp) < sevenDaysAgo) {
      localStorage.removeItem('utm_params');
    }
  }
};

// A/B testing utilities
export const getABTestVariant = (testName: string, variants: string[]) => {
  const userId = localStorage.getItem('user_id') || generateSessionId();
  const hash = simpleHash(testName + userId);
  const variantIndex = hash % variants.length;
  
  // Save variant for consistency
  localStorage.setItem(`ab_test_${testName}`, variants[variantIndex]);
  
  return variants[variantIndex];
};

// Simple hash function for A/B testing
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Track A/B test conversion
export const trackABTestConversion = async (testName: string, conversionEvent: string) => {
  const variant = localStorage.getItem(`ab_test_${testName}`);
  const userId = localStorage.getItem('user_id') || generateSessionId();
  
  if (variant) {
    try {
      await fetch('/api/marketing/track-ab-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testName,
          variant,
          userId,
          conversionEvent,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('A/B test tracking error:', error);
    }
  }
};