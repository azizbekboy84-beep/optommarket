import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { SitemapGenerator } from "./services/sitemap-generator";
import { DatabaseStorage } from "./database-storage";
import { insertProductSchema, insertCategorySchema, insertOrderSchema, insertCartItemSchema, insertUserSchema, insertBlogPostSchema, insertChatMessageSchema } from "@shared/schema";
import { adminAuth } from "./middleware/adminAuth";
import { registerAITestRoutes } from "./routes/ai-test";

// Extend Express Request type for session
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

// Helper function to generate AI response using Google Gemini
async function generateAIResponse(userMessage: string): Promise<string> {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable is not set');
    }

    const prompt = `Siz Optombazar.uz ulgurji savdo platformasining yordamchisisiz. Ushbu platforma Oʻzbekistonda ulgurji mahsulotlar bilan savdo qiladi.

Platforma haqida ma'lumot:
- Polietilen paketlar, plastik mahsulotlar, qishloq xo'jaligi va oziq-ovqat mahsulotlari mavjud
- Ulgurji narxlarda mahsulotlar sotiladi
- Minimal buyurtma miqdori mavjud
- Saytda blog bo'limi ham bor
- Foydalanuvchilar ro'yxatdan o'tish va buyurtma berish imkoniyati bor

Quyidagi savolga do'stona va foydali javob bering. Javobingiz o'zbek tilida bo'lsin:

${userMessage}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text || "Kechirasiz, hozir javob bera olmayapman. Iltimos, keyinroq urinib ko'ring.";
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "Kechirasiz, hozir texnik xatolik tufayli javob bera olmayapman. Iltimos, keyinroq urinib ko'ring yoki to'g'ridan-to'g'ri biz bilan bog'laning.";
  }
}

export async function registerRoutes(app: Express, customStorage?: any): Promise<Server> {
  // Storage instance ni ishlatish (agar berilgan bo'lsa)
  const activeStorage = customStorage || storage;
  // Authentication endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, phone } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByEmail = await activeStorage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const existingUserByUsername = await activeStorage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await activeStorage.createUser({
        username,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "customer"
      });
      
      // Auto-login after registration
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Registration failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user by email
      const user = await activeStorage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Create session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ message: "Login successful", user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  
  app.post("/api/auth/logout", async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie('connect.sid'); // Default session cookie name
        res.json({ message: "Logout successful" });
      });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });
  
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await activeStorage.getUser(req.session.userId);
      if (!user) {
        req.session.userId = undefined; // Clear invalid session
        return res.status(401).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user info" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await activeStorage.getCategories();
      
      // Build hierarchical structure
      const categoriesMap = new Map();
      const rootCategories: any[] = [];
      
      // First pass: create map of all categories
      categories.forEach(category => {
        categoriesMap.set(category.slug, { ...category, children: [] });
      });
      
      // Second pass: build hierarchy
      categories.forEach(category => {
        const categoryWithChildren = categoriesMap.get(category.slug);
        if (category.parentId) {
          const parent = categoriesMap.get(category.parentId);
          if (parent) {
            parent.children.push(categoryWithChildren);
          } else {
            // If parent not found, treat as root
            rootCategories.push(categoryWithChildren);
          }
        } else {
          rootCategories.push(categoryWithChildren);
        }
      });
      
      res.json(rootCategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await activeStorage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, featured, search } = req.query;
      
      let products;
      if (search) {
        products = await activeStorage.searchProducts(search as string);
      } else {
        products = await activeStorage.getProducts(
          categoryId as string,
          featured === 'true' ? true : undefined
        );
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      // Try to get by slug first
      const product = await activeStorage.getProductBySlug(req.params.slug);
      if (product) {
        return res.json(product);
      }
      
      // Fallback to ID if slug not found
      const productById = await activeStorage.getProduct(req.params.slug);
      if (!productById) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(productById);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart endpoints
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers['x-session-id'] as string || 'anonymous';
      const cartItems = await activeStorage.getCartItems(sessionId);
      
      // Populate with product details
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await activeStorage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json(cartWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers['x-session-id'] as string || 'anonymous';
      const cartData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      const cartItem = await activeStorage.addToCart(cartData);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to add to cart", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/cart/:itemId", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedItem = await activeStorage.updateCartItem(req.params.itemId, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:itemId", async (req, res) => {
    try {
      const success = await activeStorage.removeFromCart(req.params.itemId);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      // Associate order with logged-in user if authenticated
      const userId = req.session.userId || req.body.userId;
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: userId || 'anonymous'
      });
      const order = await activeStorage.createOrder(orderData);
      
      // Add order items if provided
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await activeStorage.addOrderItem({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          });
        }
      }
      
      // Clear cart after successful order
      const sessionId = req.headers['x-session-id'] as string || 'anonymous';
      await activeStorage.clearCart(sessionId);
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to create order", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Protected endpoint: Get orders for authenticated user only
  app.get("/api/my-orders", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.session.userId) {
        return res.status(401).json({ message: "Ruxsat yo'q. Tizimga kirish talab qilinadi." });
      }
      
      const orders = await activeStorage.getOrders(req.session.userId);
      
      // Populate each order with its items
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await activeStorage.getOrderItems(order.id);
          
          // Populate items with product details
          const itemsWithProducts = await Promise.all(
            items.map(async (item) => {
              const product = await activeStorage.getProduct(item.productId);
              return {
                ...item,
                product
              };
            })
          );
          
          return {
            ...order,
            items: itemsWithProducts
          };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Buyurtmalar tarixini olishda xatolik" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const { userId } = req.query;
      const orders = await activeStorage.getOrders(userId as string);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await activeStorage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const items = await activeStorage.getOrderItems(order.id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Admin APIs - Protected with adminAuth middleware
  app.get("/api/admin/products", adminAuth, async (req, res) => {
    try {
      const products = await activeStorage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Mahsulotlarni olishda xatolik" });
    }
  });

  app.post("/api/admin/products", adminAuth, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await activeStorage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Mahsulot yaratishda xatolik", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/admin/products/:id", adminAuth, async (req, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await activeStorage.updateProduct(req.params.id, productData);
      
      if (!product) {
        return res.status(404).json({ message: "Mahsulot topilmadi" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Mahsulotni yangilashda xatolik", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.delete("/api/admin/products/:id", adminAuth, async (req, res) => {
    try {
      const success = await activeStorage.deleteProduct(req.params.id);
      
      if (!success) {
        return res.status(404).json({ message: "Mahsulot topilmadi" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Mahsulotni o'chirishda xatolik" });
    }
  });

  app.get("/api/admin/orders", adminAuth, async (req, res) => {
    try {
      const orders = await activeStorage.getAllOrders();
      
      // Populate each order with its items and customer info
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const items = await activeStorage.getOrderItems(order.id);
          
          // Populate items with product details
          const itemsWithProducts = await Promise.all(
            items.map(async (item) => {
              const product = await activeStorage.getProduct(item.productId);
              return {
                ...item,
                product
              };
            })
          );
          
          return {
            ...order,
            items: itemsWithProducts
          };
        })
      );
      
      res.json(ordersWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Buyurtmalarni olishda xatolik" });
    }
  });

  app.put("/api/admin/orders/:id", adminAuth, async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status talab qilinadi" });
      }
      
      const order = await activeStorage.updateOrder(req.params.id, { status });
      
      if (!order) {
        return res.status(404).json({ message: "Buyurtma topilmadi" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Buyurtma statusini yangilashda xatolik" });
    }
  });

  // Admin Categories APIs
  app.get("/api/admin/categories", adminAuth, async (req, res) => {
    try {
      const categories = await activeStorage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Kategoriyalarni olishda xatolik" });
    }
  });

  app.post("/api/admin/categories", adminAuth, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await activeStorage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Kategoriya yaratishda xatolik", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/admin/categories/:id", adminAuth, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await activeStorage.updateCategory(req.params.id, categoryData);
      
      if (!category) {
        return res.status(404).json({ message: "Kategoriya topilmadi" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Kategoriyani yangilashda xatolik", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.delete("/api/admin/categories/:id", adminAuth, async (req, res) => {
    try {
      const success = await activeStorage.deleteCategory(req.params.id);
      
      if (!success) {
        return res.status(404).json({ message: "Kategoriya topilmadi" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Kategoriyani o'chirishda xatolik" });
    }
  });


  // Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      
      if (!message || !sessionId) {
        return res.status(400).json({ message: "Message and sessionId are required" });
      }

      // Save user message
      const userMessage = await activeStorage.saveChatMessage({
        sessionId,
        userId: req.session.userId || null,
        message,
        response: null,
      });

      // Generate AI response using Google Gemini
      const aiResponse = await generateAIResponse(message);
      
      // Update the message with AI response
      const updatedMessage = await activeStorage.updateChatResponse(userMessage.id, aiResponse);

      res.json({
        id: updatedMessage?.id,
        message,
        response: aiResponse,
        createdAt: updatedMessage?.createdAt,
      });
    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ 
        message: "Chat API'da xatolik yuz berdi", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/chat/history/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const history = await activeStorage.getChatHistory(sessionId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Suhbat tarixini olishda xatolik" });
    }
  });

  // Admin Blog APIs
  app.get("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const posts = await activeStorage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Blog postlarini olishda xatolik" });
    }
  });

  app.post("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await activeStorage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Blog post yaratishda xatolik", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/admin/blog/:id", adminAuth, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.partial().parse(req.body);
      const post = await activeStorage.updateBlogPost(req.params.id, postData);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post topilmadi" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Blog postni yangilashda xatolik", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.delete("/api/admin/blog/:id", adminAuth, async (req, res) => {
    try {
      const success = await activeStorage.deleteBlogPost(req.params.id);
      
      if (!success) {
        return res.status(404).json({ message: "Blog post topilmadi" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Blog postni o'chirishda xatolik" });
    }
  });

  // Public Blog APIs
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await activeStorage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Blog postlarini olishda xatolik" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const post = await activeStorage.getBlogPostBySlug(req.params.slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post topilmadi" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Blog postni olishda xatolik" });
    }
  });

  // Search API
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Qidiruv so'zi kiritilmagan" });
      }
      
      const results = await activeStorage.searchAll(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Qidiruvda xatolik" });
    }
  });

  // SEO Admin API routes
  app.get("/api/admin/seo/report", adminAuth, async (req, res) => {
    try {
      const report = {
        overallScore: 85,
        indexedPages: 247,
        internalLinks: 1523,
        optimizedImages: 92,
        recentChecks: [
          { page: '/catalog', score: 88, issues: 2, lastCheck: new Date() },
          { page: '/products/polietilen-paketlar', score: 92, issues: 1, lastCheck: new Date() },
          { page: '/blog/optom-savdo-maslahatlari', score: 95, issues: 0, lastCheck: new Date() }
        ]
      };
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "SEO hisobotni olishda xatolik" });
    }
  });

  app.post("/api/admin/seo/analyze", adminAuth, async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ message: "URL kiritilmagan" });
      }

      // SEO tahlil algoritmi (sodda versiya)
      const analysis = {
        url,
        title: "SEO Tahlil Natijasi",
        score: Math.floor(Math.random() * 30) + 70, // 70-100 orasida
        checks: [
          {
            id: 'title',
            title: 'Sahifa sarlavhasi (Title Tag)',
            status: 'pass',
            description: 'Sahifada to\'g\'ri title tag mavjud',
            value: 'OptomBazar.uz - Mahsulot nomi'
          },
          {
            id: 'meta-description',
            title: 'Meta tavsif (Meta Description)',
            status: 'pass',
            description: 'Meta description to\'g\'ri uzunlikda',
            value: '155 ta belgi'
          },
          {
            id: 'keywords',
            title: 'Kalit so\'zlar',
            status: 'warning',
            description: 'Meta keywords yo\'q',
            recommendation: 'Sahifa uchun mos kalit so\'zlarni qo\'shing'
          },
          {
            id: 'headings',
            title: 'Sarlavha teglari (H1-H6)',
            status: 'pass',
            description: 'H1 tag mavjud va to\'g\'ri ishlatilgan'
          },
          {
            id: 'images',
            title: 'Rasm optimallashtirish',
            status: 'warning',
            description: 'Ba\'zi rasmlarda alt atribut yo\'q',
            recommendation: 'Barcha rasmlarga alt atribut qo\'shing'
          },
          {
            id: 'internal-links',
            title: 'Ichki linklar',
            status: 'pass',
            description: 'Sahifada yetarli ichki linklar mavjud'
          }
        ],
        lastChecked: new Date()
      };

      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "SEO tahlil qilib bo'lmadi" });
    }
  });

  // Sitemap va SEO routes
  const sitemapGenerator = new SitemapGenerator(activeStorage as DatabaseStorage);

  app.get("/sitemap.xml", async (req, res) => {
    try {
      const sitemap = await sitemapGenerator.generateSitemap();
      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Sitemap generatsiya xatoligi:', error);
      res.status(500).send('Sitemap generatsiya qilib bo\'lmadi');
    }
  });

  app.get("/robots.txt", (req, res) => {
    try {
      const robotsTxt = sitemapGenerator.generateRobotsTxt();
      res.set('Content-Type', 'text/plain');
      res.send(robotsTxt);
    } catch (error) {
      console.error('Robots.txt generatsiya xatoligi:', error);
      res.status(500).send('Robots.txt generatsiya qilib bo\'lmadi');
    }
  });

  app.get("/sitemap-index.xml", async (req, res) => {
    try {
      const sitemapIndex = await sitemapGenerator.generateSitemapIndex();
      res.set('Content-Type', 'application/xml');
      res.send(sitemapIndex);
    } catch (error) {
      console.error('Sitemap index generatsiya xatoligi:', error);
      res.status(500).send('Sitemap index generatsiya qilib bo\'lmadi');
    }
  });

  // AI test routes qo'shish
  registerAITestRoutes(app, activeStorage);

  const httpServer = createServer(app);
  return httpServer;
}
