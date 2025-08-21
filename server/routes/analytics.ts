import express from 'express';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Mock analytics data for development
const mockAnalyticsData = {
  users: 1234,
  pageViews: 5678,
  conversionRate: 2.3,
  averageSessionDuration: '3:45',
  topTrafficSources: [
    { source: 'Google', percentage: 65 },
    { source: 'Direct', percentage: 20 },
    { source: 'Social Media', percentage: 10 },
    { source: 'Referral', percentage: 5 },
  ],
  deviceBreakdown: {
    mobile: 60,
    desktop: 30,
    tablet: 10,
  },
  countryBreakdown: [
    { country: 'Uzbekistan', percentage: 85 },
    { country: 'Kazakhstan', percentage: 8 },
    { country: 'Russia', percentage: 4 },
    { country: 'Other', percentage: 3 },
  ],
};

const mockSeoMetrics = {
  coreWebVitals: {
    LCP: '2.1s',
    FID: '95ms',
    CLS: '0.05',
  },
  mobileScore: 92,
  desktopScore: 98,
  totalPages: 156,
  indexedPages: 142,
};

const mockSearchConsoleData = {
  impressions: 23456,
  clicks: 1234,
  clickThroughRate: 5.3,
  averagePosition: 12.4,
  topQueries: [
    {
      query: 'optom mahsulotlar',
      clicks: 234,
      impressions: 4567,
      position: 3.2,
    },
    {
      query: 'ulgurji savdo',
      clicks: 189,
      impressions: 3456,
      position: 4.1,
    },
    {
      query: 'wholesale products uzbekistan',
      clicks: 145,
      impressions: 2890,
      position: 2.8,
    },
    {
      query: 'optombazar',
      clicks: 312,
      impressions: 1456,
      position: 1.2,
    },
  ],
};

// Get Google Analytics data
router.get('/google-analytics', adminAuth, (req, res) => {
  try {
    // In a real implementation, this would fetch from Google Analytics API
    res.json(mockAnalyticsData);
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Get SEO metrics
router.get('/seo-metrics', adminAuth, (req, res) => {
  try {
    // In a real implementation, this would fetch from PageSpeed Insights API
    res.json(mockSeoMetrics);
  } catch (error) {
    console.error('Error fetching SEO metrics:', error);
    res.status(500).json({ error: 'Failed to fetch SEO metrics' });
  }
});

// Get Search Console data
router.get('/search-console', adminAuth, (req, res) => {
  try {
    // In a real implementation, this would fetch from Google Search Console API
    res.json(mockSearchConsoleData);
  } catch (error) {
    console.error('Error fetching Search Console data:', error);
    res.status(500).json({ error: 'Failed to fetch Search Console data' });
  }
});

// Get performance metrics
router.get('/performance', adminAuth, (req, res) => {
  try {
    const performanceData = {
      serverResponse: '250ms',
      firstContentfulPaint: '1.2s',
      largestContentfulPaint: '2.1s',
      cumulativeLayoutShift: '0.05',
      totalBlockingTime: '150ms',
    };
    
    res.json(performanceData);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

export default router;