import { type Express, type Request, type Response } from "express";
import { IStorage } from "../../storage";
import { adminAuth } from "../../middleware/adminAuth";

export interface ReportsSummary {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  popularProducts: Array<{
    id: string;
    name: string;
    views: number;
    orders: number;
    revenue: number;
  }>;
  recentActivity: number;
}

export interface UserActivityReport {
  dailyVisits: Array<{ date: string; visits: number; uniqueUsers: number }>;
  weeklyStats: Array<{ week: string; visits: number; registrations: number }>;
  monthlyStats: Array<{ month: string; visits: number; registrations: number }>;
}

export interface SalesReport {
  dailySales: Array<{ date: string; orders: number; revenue: number }>;
  topProducts: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
    category: string;
  }>;
  topCategories: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
}

export interface PopularProductsReport {
  mostViewed: Array<{
    id: string;
    name: string;
    views: number;
    category: string;
  }>;
  mostAddedToCart: Array<{
    id: string;
    name: string;
    cartAdds: number;
    category: string;
  }>;
  mostOrdered: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
    category: string;
  }>;
}

export interface SearchTermsReport {
  topSearches: Array<{
    term: string;
    count: number;
    resultsAvg: number;
  }>;
  noResultSearches: Array<{
    term: string;
    count: number;
  }>;
  recentSearches: Array<{
    term: string;
    timestamp: string;
    results: number;
  }>;
}

export function registerReportsRoutes(app: Express, storage: IStorage) {
  // General reports summary
  app.get("/api/admin/reports/summary", adminAuth, async (req: Request, res: Response) => {
    try {
      const users: any[] = []; // Note: getUsers method needs to be implemented in IStorage
      const orders = await storage.getAllOrders();
      const products = await storage.getProducts();
      
      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => 
        sum + parseFloat(order.totalAmount.toString()), 0
      );

      // Get user activities for recent activity count
      const activities = storage.getUserActivities ? 
        await storage.getUserActivities({
          dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          limit: 1000
        }) : [];

      // Get popular products based on activities
      const productViews = new Map<string, number>();
      const productOrders = new Map<string, number>();
      const productRevenue = new Map<string, number>();

      activities.forEach(activity => {
        if (activity.activityType === 'product_view' && activity.targetId) {
          productViews.set(activity.targetId, (productViews.get(activity.targetId) || 0) + 1);
        }
      });

      // Get order statistics per product
      for (const order of orders) {
        const orderItems = await storage.getOrderItems(order.id);
        for (const item of orderItems) {
          productOrders.set(item.productId, (productOrders.get(item.productId) || 0) + item.quantity);
          productRevenue.set(item.productId, 
            (productRevenue.get(item.productId) || 0) + parseFloat(item.totalPrice.toString())
          );
        }
      }

      // Create popular products list
      const popularProducts = products
        .map(product => ({
          id: product.id,
          name: product.nameUz,
          views: productViews.get(product.id) || 0,
          orders: productOrders.get(product.id) || 0,
          revenue: productRevenue.get(product.id) || 0
        }))
        .sort((a, b) => (b.views + b.orders) - (a.views + a.orders))
        .slice(0, 5);

      const summary: ReportsSummary = {
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue,
        popularProducts,
        recentActivity: activities.length
      };

      res.json(summary);
    } catch (error) {
      console.error("Error generating reports summary:", error);
      res.status(500).json({ message: "Failed to generate reports summary" });
    }
  });

  // User activity report
  app.get("/api/admin/reports/user-activity", adminAuth, async (req: Request, res: Response) => {
    try {
      const activities = storage.getUserActivities ? 
        await storage.getUserActivities({
          dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          limit: 10000
        }) : [];

      // Group activities by date
      const dailyStats = new Map<string, { visits: number; users: Set<string> }>();
      const weeklyStats = new Map<string, { visits: number; registrations: number }>();
      const monthlyStats = new Map<string, { visits: number; registrations: number }>();

      activities.forEach(activity => {
        const date = new Date(activity.timestamp || '').toISOString().split('T')[0];
        const week = getWeekString(new Date(activity.timestamp || ''));
        const month = getMonthString(new Date(activity.timestamp || ''));

        // Daily stats
        if (!dailyStats.has(date)) {
          dailyStats.set(date, { visits: 0, users: new Set() });
        }
        const dayData = dailyStats.get(date)!;
        dayData.visits++;
        if (activity.userId) dayData.users.add(activity.userId);

        // Weekly stats
        if (!weeklyStats.has(week)) {
          weeklyStats.set(week, { visits: 0, registrations: 0 });
        }
        weeklyStats.get(week)!.visits++;
        if (activity.activityType === 'register') {
          weeklyStats.get(week)!.registrations++;
        }

        // Monthly stats
        if (!monthlyStats.has(month)) {
          monthlyStats.set(month, { visits: 0, registrations: 0 });
        }
        monthlyStats.get(month)!.visits++;
        if (activity.activityType === 'register') {
          monthlyStats.get(month)!.registrations++;
        }
      });

      const report: UserActivityReport = {
        dailyVisits: Array.from(dailyStats.entries())
          .map(([date, data]) => ({
            date,
            visits: data.visits,
            uniqueUsers: data.users.size
          }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        weeklyStats: Array.from(weeklyStats.entries())
          .map(([week, data]) => ({
            week,
            visits: data.visits,
            registrations: data.registrations
          }))
          .sort((a, b) => a.week.localeCompare(b.week)),
        monthlyStats: Array.from(monthlyStats.entries())
          .map(([month, data]) => ({
            month,
            visits: data.visits,
            registrations: data.registrations
          }))
          .sort((a, b) => a.month.localeCompare(b.month))
      };

      res.json(report);
    } catch (error) {
      console.error("Error generating user activity report:", error);
      res.status(500).json({ message: "Failed to generate user activity report" });
    }
  });

  // Sales report
  app.get("/api/admin/reports/sales", adminAuth, async (req: Request, res: Response) => {
    try {
      const orders = await storage.getAllOrders();
      const products = await storage.getProducts();
      const categories = await storage.getCategories();

      // Group sales by date
      const dailySales = new Map<string, { orders: number; revenue: number }>();
      const productSales = new Map<string, { orders: number; revenue: number }>();
      const categorySales = new Map<string, { orders: number; revenue: number }>();

      for (const order of orders) {
        const date = new Date(order.createdAt || '').toISOString().split('T')[0];
        
        if (!dailySales.has(date)) {
          dailySales.set(date, { orders: 0, revenue: 0 });
        }
        const dayData = dailySales.get(date)!;
        dayData.orders++;
        dayData.revenue += parseFloat(order.totalAmount.toString());

        // Get order items for product/category breakdown
        const orderItems = await storage.getOrderItems(order.id);
        for (const item of orderItems) {
          // Product sales
          if (!productSales.has(item.productId)) {
            productSales.set(item.productId, { orders: 0, revenue: 0 });
          }
          const productData = productSales.get(item.productId)!;
          productData.orders += item.quantity;
          productData.revenue += parseFloat(item.totalPrice.toString());

          // Category sales
          const product = products.find(p => p.id === item.productId);
          if (product) {
            if (!categorySales.has(product.categoryId)) {
              categorySales.set(product.categoryId, { orders: 0, revenue: 0 });
            }
            const categoryData = categorySales.get(product.categoryId)!;
            categoryData.orders += item.quantity;
            categoryData.revenue += parseFloat(item.totalPrice.toString());
          }
        }
      }

      // Top products
      const topProducts = Array.from(productSales.entries())
        .map(([productId, data]) => {
          const product = products.find(p => p.id === productId);
          const category = categories.find(c => c.id === product?.categoryId);
          return {
            id: productId,
            name: product?.nameUz || 'Unknown Product',
            orders: data.orders,
            revenue: data.revenue,
            category: category?.nameUz || 'Unknown Category'
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Top categories
      const topCategories = Array.from(categorySales.entries())
        .map(([categoryId, data]) => {
          const category = categories.find(c => c.id === categoryId);
          return {
            id: categoryId,
            name: category?.nameUz || 'Unknown Category',
            orders: data.orders,
            revenue: data.revenue
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const report: SalesReport = {
        dailySales: Array.from(dailySales.entries())
          .map(([date, data]) => ({
            date,
            orders: data.orders,
            revenue: data.revenue
          }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        topProducts,
        topCategories
      };

      res.json(report);
    } catch (error) {
      console.error("Error generating sales report:", error);
      res.status(500).json({ message: "Failed to generate sales report" });
    }
  });

  // Popular products report
  app.get("/api/admin/reports/popular-products", adminAuth, async (req: Request, res: Response) => {
    try {
      const activities = storage.getUserActivities ? 
        await storage.getUserActivities({
          dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          limit: 10000
        }) : [];
      const products = await storage.getProducts();
      const categories = await storage.getCategories();

      const productViews = new Map<string, number>();
      const productCartAdds = new Map<string, number>();

      activities.forEach(activity => {
        if (activity.targetId) {
          if (activity.activityType === 'product_view') {
            productViews.set(activity.targetId, (productViews.get(activity.targetId) || 0) + 1);
          } else if (activity.activityType === 'add_to_cart') {
            productCartAdds.set(activity.targetId, (productCartAdds.get(activity.targetId) || 0) + 1);
          }
        }
      });

      // Get order data
      const orders = await storage.getAllOrders();
      const productOrders = new Map<string, { count: number; revenue: number }>();

      for (const order of orders) {
        const orderItems = await storage.getOrderItems(order.id);
        for (const item of orderItems) {
          if (!productOrders.has(item.productId)) {
            productOrders.set(item.productId, { count: 0, revenue: 0 });
          }
          const data = productOrders.get(item.productId)!;
          data.count += item.quantity;
          data.revenue += parseFloat(item.totalPrice.toString());
        }
      }

      const getProductWithCategory = (productId: string) => {
        const product = products.find(p => p.id === productId);
        const category = categories.find(c => c.id === product?.categoryId);
        return { product, category };
      };

      const report: PopularProductsReport = {
        mostViewed: Array.from(productViews.entries())
          .map(([productId, views]) => {
            const { product, category } = getProductWithCategory(productId);
            return {
              id: productId,
              name: product?.nameUz || 'Unknown Product',
              views,
              category: category?.nameUz || 'Unknown Category'
            };
          })
          .sort((a, b) => b.views - a.views)
          .slice(0, 10),
        
        mostAddedToCart: Array.from(productCartAdds.entries())
          .map(([productId, cartAdds]) => {
            const { product, category } = getProductWithCategory(productId);
            return {
              id: productId,
              name: product?.nameUz || 'Unknown Product',
              cartAdds,
              category: category?.nameUz || 'Unknown Category'
            };
          })
          .sort((a, b) => b.cartAdds - a.cartAdds)
          .slice(0, 10),
        
        mostOrdered: Array.from(productOrders.entries())
          .map(([productId, data]) => {
            const { product, category } = getProductWithCategory(productId);
            return {
              id: productId,
              name: product?.nameUz || 'Unknown Product',
              orders: data.count,
              revenue: data.revenue,
              category: category?.nameUz || 'Unknown Category'
            };
          })
          .sort((a, b) => b.orders - a.orders)
          .slice(0, 10)
      };

      res.json(report);
    } catch (error) {
      console.error("Error generating popular products report:", error);
      res.status(500).json({ message: "Failed to generate popular products report" });
    }
  });

  // Search terms report
  app.get("/api/admin/reports/search-terms", adminAuth, async (req: Request, res: Response) => {
    try {
      const activities = storage.getUserActivities ? 
        await storage.getUserActivities({
          activityType: 'search',
          dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          limit: 10000
        }) : [];

      const searchCounts = new Map<string, { count: number; totalResults: number }>();
      const recentSearches: Array<{ term: string; timestamp: string; results: number }> = [];

      activities.forEach(activity => {
        if (activity.metadata?.query) {
          const term = activity.metadata.query.toLowerCase();
          const results = activity.metadata.resultsCount || 0;

          if (!searchCounts.has(term)) {
            searchCounts.set(term, { count: 0, totalResults: 0 });
          }
          const data = searchCounts.get(term)!;
          data.count++;
          data.totalResults += results;

          // Add to recent searches (limit to last 50)
          if (recentSearches.length < 50) {
            recentSearches.push({
              term,
              timestamp: activity.timestamp?.toISOString() || '',
              results
            });
          }
        }
      });

      const topSearches = Array.from(searchCounts.entries())
        .map(([term, data]) => ({
          term,
          count: data.count,
          resultsAvg: Math.round(data.totalResults / data.count)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

      const noResultSearches = topSearches
        .filter(search => search.resultsAvg === 0)
        .map(({ term, count }) => ({ term, count }))
        .slice(0, 10);

      const report: SearchTermsReport = {
        topSearches,
        noResultSearches,
        recentSearches: recentSearches
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 20)
      };

      res.json(report);
    } catch (error) {
      console.error("Error generating search terms report:", error);
      res.status(500).json({ message: "Failed to generate search terms report" });
    }
  });
}

// Helper functions
function getWeekString(date: Date): string {
  const year = date.getFullYear();
  const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function getMonthString(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}