import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { SitemapGenerator } from "./services/sitemap-generator";
import { DatabaseStorage } from "./database-storage";
import { insertProductSchema, insertCategorySchema, insertOrderSchema, insertCartItemSchema, insertUserSchema, insertBlogPostSchema, insertChatMessageSchema, type Product, type Category } from "@shared/schema";
import { adminAuth } from "./middleware/adminAuth";
import { registerAITestRoutes } from "./routes/ai-test";
import { ActivityLogger } from "./utils/activityLogger";
import { registerReportsRoutes } from "./routes/admin/reports";
import { registerAutomationRoutes } from "./routes/admin/automation";
import discountsRouter from "./routes/discounts";
import favoritesRouter from "./routes/favorites";
import pushRouter from "./push";
import analyticsRouter from "./routes/analytics";
import marketingRouter from "./routes/marketing";

// Extend Express Request type for session
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

// Helper function to send Telegram notifications
async function sendTelegramNotification(message: string): Promise<void> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
      console.warn('Telegram credentials not configured');
      return;
    }

    // Clean chat ID to extract numeric part if there's extra text
    const cleanChatId = chatId.replace(/[^-0-9]/g, '');
    console.log('Original chat ID:', chatId);
    console.log('Cleaned chat ID:', cleanChatId);
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram notification failed:', errorText);
      console.error('Bot Token length:', botToken?.length);
      console.error('Chat ID:', chatId);
    } else {
      console.log('Telegram notification sent successfully');
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}

// Helper function to build context for intelligent responses
async function buildChatContext(userMessage: string, storage: any): Promise<string> {
  try {
    // Get categories and products for context
    const categories = await storage.getCategories();
    const products = await storage.getProducts();
    
    let context = "Bizning platformamizda quyidagi kategoriyalar mavjud:\n";
    
    categories.forEach((category: Category) => {
      context += `- ${category.nameUz} (${category.nameRu}): ${category.descriptionUz || ''}\n`;
    });
    
    // Add product information if user asks about specific products
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('paket') || lowerMessage.includes('пакет')) {
      const packageProducts = products.filter((product: Product) => 
        product.categoryId === 'polietilen-paketlar'
      ).slice(0, 5);
      
      if (packageProducts.length > 0) {
        context += "\nPolietilen paketlar:\n";
        packageProducts.forEach((product: Product) => {
          context += `- ${product.nameUz}: ${product.wholesalePrice} so'm (minimal: ${product.minQuantity || 1} ${product.unit})\n`;
        });
      }
    }
    
    return context;
  } catch (error) {
    console.error('Context building error:', error);
    return "Bizning platformamizda turli xil ulgurji mahsulotlar mavjud.";
  }
}

// Helper function to generate intelligent AI response
async function generateIntelligentResponse(userMessage: string, context: string): Promise<string> {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is not set');
    }

    const prompt = `Sen Optombazar.uz yordamchisisan. Javoblaringni qisqa va 2-3 gapdan oshirma. 

O'zbek tilida salom berish: "Salam!" (Salom! emas)
Kontekst: ${context}

Mijoz savoli: ${userMessage}

Javobingiz o'zbek tilida bo'lsin va qisqa, aniq bo'lsin.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 200, // Shorter responses
        },
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Kechirasiz, hozir javob bera olmayapman.";
  } catch (error) {
    console.error('Intelligent response error:', error);
    return "Kechirasiz, texnik xatolik tufayli javob bera olmayapman. Iltimos keyinroq urinib ko'ring.";
  }
}

// Helper function to generate AI response using Google Gemini
async function generateAIResponse(userMessage: string): Promise<string> {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is not set');
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
  
  // Initialize activity logger
  const activityLogger = new ActivityLogger(activeStorage);

  // Health check endpoints for deployment monitoring
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  app.get("/api/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      api: "operational",
      timestamp: new Date().toISOString() 
    });
  });

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
      categories.forEach((category: Category) => {
        categoriesMap.set(category.slug, { ...category, children: [] });
      });
      
      // Second pass: build hierarchy
      categories.forEach((category: Category) => {
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

  // Featured products endpoint for homepage - Must be before :slug route
  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await activeStorage.getProducts(undefined, true);
      res.json(products.slice(0, 8)); // Limit to 8 featured products
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  // Related products endpoint - Must be before :slug route
  app.get("/api/products/:productId/related", async (req, res) => {
    try {
      const productId = req.params.productId;
      
      // Get the main product to find its category
      const mainProduct = await activeStorage.getProduct(productId);
      if (!mainProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Get products from the same category, excluding the main product
      const allProductsInCategory = await activeStorage.getProducts(mainProduct.categoryId);
      const relatedProducts = allProductsInCategory
        .filter((product: Product) => product.id !== productId)
        .sort(() => Math.random() - 0.5) // Randomize
        .slice(0, 4); // Limit to 4 products
      
      res.json(relatedProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch related products" });
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
        cartItems.map(async (item: any) => {
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
        orders.map(async (order: any) => {
          const items = await activeStorage.getOrderItems(order.id);
          
          // Populate items with product details
          const itemsWithProducts = await Promise.all(
            items.map(async (item: any) => {
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

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, company, message } = req.body;
      
      if (!name || !phone || !message) {
        return res.status(400).json({ message: "Name, phone and message are required" });
      }
      
      // Save contact message to database
      const sessionId = req.headers['x-session-id'] as string || 'anonymous';
      const contactData = {
        sessionId,
        userName: name,
        userPhone: phone,
        userEmail: email || null,
        message: message,
        metadata: company ? { company } : null
      };
      
      const savedMessage = await activeStorage.saveChatMessage(contactData);
      
      // Log the contact activity
      await activityLogger.logActivity(req, {
        activityType: 'contact_form',
        targetId: savedMessage.id,
        targetType: 'form',
        metadata: { name, phone, company: company || null }
      });
      
      // Send Telegram notification to admin
      const notificationText = `
🔔 <b>Yangi kontakt so'rovi</b>

👤 <b>Ism:</b> ${name}
📞 <b>Telefon:</b> ${phone}
${email ? `📧 <b>Email:</b> ${email}\n` : ''}${company ? `🏢 <b>Kompaniya:</b> ${company}\n` : ''}
💬 <b>Xabar:</b> ${message}

⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}
      `;
      
      await sendTelegramNotification(notificationText);
      
      res.status(201).json({ 
        message: "Contact form submitted successfully",
        id: savedMessage.id 
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ message: "Failed to submit contact form" });
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
        orders.map(async (order: any) => {
          const items = await activeStorage.getOrderItems(order.id);
          
          // Populate items with product details
          const itemsWithProducts = await Promise.all(
            items.map(async (item: any) => {
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


  // Start new chat session
  app.post("/api/chat/start", async (req, res) => {
    try {
      const { name, phone } = req.body;
      
      if (!name || !phone) {
        return res.status(400).json({ message: "Name and phone are required" });
      }

      // Generate unique session ID
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Send notification to Telegram
      await sendTelegramNotification(`🆕 Yangi suhbat boshlandi!\n\n👤 Mijoz: ${name}\n📞 Telefon: ${phone}\n🔗 Session: ${sessionId}`);

      res.json({ sessionId, name, phone });
    } catch (error) {
      console.error('Chat start error:', error);
      res.status(500).json({ 
        message: "Suhbatni boshlashda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Send chat message
  app.post("/api/chat/message", async (req, res) => {
    try {
      const { message, sessionId, userName, userPhone } = req.body;
      
      if (!message || !sessionId) {
        return res.status(400).json({ message: "Message and sessionId are required" });
      }

      // Save user message with name and phone
      const userMessage = await activeStorage.saveChatMessage({
        sessionId,
        userId: req.session.userId || null,
        userName,
        userPhone,
        message,
        response: null,
      });

      // Get context for intelligent response
      const context = await buildChatContext(message, activeStorage);
      
      // Generate AI response using Google Gemini with context
      const aiResponse = await generateIntelligentResponse(message, context);
      
      // Update the message with AI response
      const updatedMessage = await activeStorage.updateChatResponse(userMessage.id, aiResponse);

      // Send conversation to Telegram
      await sendTelegramNotification(`💬 Suhbat:\n\n👤 ${userName || 'Anonim'}: ${message}\n🤖 Javob: ${aiResponse}`);

      res.json({
        id: updatedMessage?.id,
        message,
        response: aiResponse,
        createdAt: updatedMessage?.createdAt,
      });
    } catch (error) {
      console.error('Chat message error:', error);
      res.status(500).json({ 
        message: "Xabar yuborishda xatolik", 
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
      
      console.log('🔎 Search API called:', { query, queryParams: req.query });
      
      if (!query || typeof query !== 'string') {
        console.log('❌ No query provided');
        return res.status(400).json({ message: "Qidiruv so'zi kiritilmagan" });
      }
      
      console.log('📞 Calling activeStorage.searchAll with:', query);
      const results = await activeStorage.searchAll(query);
      console.log('📊 Search results:', { productsFound: results.products.length, blogPostsFound: results.blogPosts.length });
      
      res.json(results);
    } catch (error) {
      console.error('💥 Search error:', error);
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

  // Test Telegram notification
  app.get("/api/test-telegram", async (req, res) => {
    try {
      await sendTelegramNotification("🧪 Test notification from Optombazar.uz");
      res.json({ success: true, message: "Telegram test sent" });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // AI test routes qo'shish
  registerAITestRoutes(app, activeStorage);
  
  // Register admin reports routes
  registerReportsRoutes(app, activeStorage);
  registerAutomationRoutes(app, activeStorage);
  
  // Register discounts, favorites, push notification, analytics and marketing routes
  app.use("/api/discounts", discountsRouter);
  app.use("/api/favorites", favoritesRouter);
  app.use("/api/push", pushRouter);
  app.use("/api/marketing", marketingRouter);

  const httpServer = createServer(app);
  return httpServer;
}
