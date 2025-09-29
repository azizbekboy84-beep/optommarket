// Performance monitoring utilities

interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

// Report performance metrics
export function reportWebVitals(metric: PerformanceMetrics) {
  // In production, send to analytics service (Google Analytics, etc.)
  if (import.meta.env.PROD) {
    // Example: Send to your analytics endpoint
    console.log('Performance Metric:', metric);
    
    // You can send to Google Analytics, Sentry, or custom endpoint:
    // fetch('/api/analytics/performance', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    //   headers: { 'Content-Type': 'application/json' }
    // });
  } else {
    // Log in development
    console.log('📊 Performance Metric:', metric);
  }
}

// Measure page load time
export function measurePageLoad() {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (perfData) {
      const metrics = {
        TTFB: perfData.responseStart - perfData.requestStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        totalTime: perfData.loadEventEnd - perfData.fetchStart,
      };
      
      reportWebVitals({ TTFB: metrics.TTFB });
      console.log('📈 Page Load Metrics:', metrics);
    }
  });
}

// Measure Core Web Vitals
export function measureWebVitals() {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        reportWebVitals({ LCP: lastEntry.renderTime || lastEntry.loadTime });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // LCP not supported
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          reportWebVitals({ FID: entry.processingStart - entry.startTime });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // FID not supported
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsScore = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
            reportWebVitals({ CLS: clsScore });
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // CLS not supported
    }
  }
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  measurePageLoad();
  measureWebVitals();
}

// Track component render time
export function trackRenderTime(componentName: string) {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // Slower than 60fps
      console.warn(`⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  };
}
