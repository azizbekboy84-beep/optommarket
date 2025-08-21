import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { initializeMarketingTracking, cleanupMarketingData } from '@/utils/marketing';

export function MarketingTracker() {
  const [location] = useLocation();

  // Initialize marketing tracking on component mount
  useEffect(() => {
    initializeMarketingTracking();
    
    // Clean up old marketing data
    cleanupMarketingData();
  }, []);

  // Track page changes
  useEffect(() => {
    // Track page view with current location
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: location,
        page_location: window.location.href,
        page_title: document.title
      });
    }
  }, [location]);

  return null; // This component doesn't render anything
}