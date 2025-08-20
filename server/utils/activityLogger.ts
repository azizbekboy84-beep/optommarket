import { Request } from "express";
import { IStorage } from "../storage";
import { InsertUserActivity } from "@shared/schema";

export interface ActivityLogParams {
  activityType: 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'checkout_start' | 
                'order_placed' | 'search' | 'login' | 'register' | 'page_view' | 
                'category_view' | 'blog_view' | 'contact_form';
  targetId?: string;
  targetType?: 'product' | 'category' | 'order' | 'page' | 'blog' | 'form';
  metadata?: Record<string, any>;
}

export class ActivityLogger {
  constructor(private storage: IStorage) {}

  async logActivity(
    req: Request, 
    params: ActivityLogParams
  ): Promise<void> {
    try {
      // Get user ID from session if authenticated
      const userId = (req as any).user?.id || null;
      
      // Get or create session ID
      const sessionId = req.sessionID || `guest_${Date.now()}_${Math.random()}`;
      
      // Get IP address (handle proxies)
      const ipAddress = req.ip || 
                       req.connection.remoteAddress || 
                       (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
                       'unknown';
      
      // Get user agent
      const userAgent = req.headers['user-agent'] || 'unknown';

      const activityData: InsertUserActivity = {
        userId,
        sessionId,
        activityType: params.activityType,
        targetId: params.targetId || null,
        targetType: params.targetType || null,
        metadata: params.metadata || null,
        ipAddress,
        userAgent
      };

      // Only log if we have a storage implementation that supports it
      if (this.storage.logUserActivity) {
        await this.storage.logUserActivity(activityData);
      }
    } catch (error) {
      console.error('Failed to log user activity:', error);
      // Don't throw error to avoid disrupting main application flow
    }
  }

  // Convenience methods for common activities
  async logProductView(req: Request, productId: string, productSlug?: string): Promise<void> {
    await this.logActivity(req, {
      activityType: 'product_view',
      targetId: productId,
      targetType: 'product',
      metadata: productSlug ? { slug: productSlug } : undefined
    });
  }

  async logCategoryView(req: Request, categoryId: string, categorySlug?: string): Promise<void> {
    await this.logActivity(req, {
      activityType: 'category_view',
      targetId: categoryId,
      targetType: 'category',
      metadata: categorySlug ? { slug: categorySlug } : undefined
    });
  }

  async logSearch(req: Request, query: string, resultsCount?: number): Promise<void> {
    await this.logActivity(req, {
      activityType: 'search',
      metadata: { 
        query: query.toLowerCase(),
        resultsCount: resultsCount || 0
      }
    });
  }

  async logCartAction(
    req: Request, 
    action: 'add_to_cart' | 'remove_from_cart', 
    productId: string, 
    quantity?: number
  ): Promise<void> {
    await this.logActivity(req, {
      activityType: action,
      targetId: productId,
      targetType: 'product',
      metadata: quantity ? { quantity } : undefined
    });
  }

  async logOrderPlaced(req: Request, orderId: string, totalAmount?: string): Promise<void> {
    await this.logActivity(req, {
      activityType: 'order_placed',
      targetId: orderId,
      targetType: 'order',
      metadata: totalAmount ? { totalAmount } : undefined
    });
  }

  async logUserAuth(req: Request, action: 'login' | 'register', userId?: string): Promise<void> {
    await this.logActivity(req, {
      activityType: action,
      targetId: userId,
      targetType: 'page'
    });
  }

  async logPageView(req: Request, page: string): Promise<void> {
    await this.logActivity(req, {
      activityType: 'page_view',
      targetType: 'page',
      metadata: { page }
    });
  }
}

// Middleware factory for automatic page view tracking
export function createPageViewMiddleware(activityLogger: ActivityLogger) {
  return (req: Request, res: any, next: any) => {
    // Only log page views for main pages, not API calls
    if (!req.path.startsWith('/api')) {
      // Extract page name from path
      const page = req.path === '/' ? 'home' : req.path.slice(1).split('/')[0];
      activityLogger.logPageView(req, page).catch(console.error);
    }
    next();
  };
}