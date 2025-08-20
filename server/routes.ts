import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { insertProductSchema, insertCategorySchema, insertOrderSchema, insertCartItemSchema, insertUserSchema, insertBlogPostSchema, insertChatMessageSchema } from "@shared/schema";
import { adminAuth } from "./middleware/adminAuth";

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, phone } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
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
      const user = await storage.getUserByEmail(email);
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
      
      const user = await storage.getUser(req.session.userId);
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
      const categories = await storage.getCategories();
      
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
      const category = await storage.getCategory(req.params.id);
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
        products = await storage.searchProducts(search as string);
      } else {
        products = await storage.getProducts(
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
      const product = await storage.getProductBySlug(req.params.slug);
      if (product) {
        return res.json(product);
      }
      
      // Fallback to ID if slug not found
      const productById = await storage.getProduct(req.params.slug);
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
      const cartItems = await storage.getCartItems(sessionId);
      
      // Populate with product details
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
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
      
      const cartItem = await storage.addToCart(cartData);
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
      
      const updatedItem = await storage.updateCartItem(req.params.itemId, quantity);
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
      const success = await storage.removeFromCart(req.params.itemId);
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
      const order = await storage.createOrder(orderData);
      
      // Add order items if provided
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.addOrderItem({
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
      await storage.clearCart(sessionId);
      
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
      
      const orders = await storage.getOrders(req.session.userId);
      
      // Populate each order with its items
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          
          // Populate items with product details
          const itemsWithProducts = await Promise.all(
            items.map(async (item) => {
              const product = await storage.getProduct(item.productId);
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
      const orders = await storage.getOrders(userId as string);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const items = await storage.getOrderItems(order.id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Admin APIs - Protected with adminAuth middleware
  app.get("/api/admin/products", adminAuth, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Mahsulotlarni olishda xatolik" });
    }
  });

  app.post("/api/admin/products", adminAuth, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Mahsulot yaratishda xatolik", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/admin/products/:id", adminAuth, async (req, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      
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
      const success = await storage.deleteProduct(req.params.id);
      
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
      const orders = await storage.getAllOrders();
      
      // Populate each order with its items and customer info
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          
          // Populate items with product details
          const itemsWithProducts = await Promise.all(
            items.map(async (item) => {
              const product = await storage.getProduct(item.productId);
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
      
      const order = await storage.updateOrder(req.params.id, { status });
      
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
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Kategoriyalarni olishda xatolik" });
    }
  });

  app.post("/api/admin/categories", adminAuth, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Kategoriya yaratishda xatolik", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/admin/categories/:id", adminAuth, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, categoryData);
      
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
      const success = await storage.deleteCategory(req.params.id);
      
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
      const userMessage = await storage.saveChatMessage({
        sessionId,
        userId: req.session.userId || null,
        message,
        response: null,
      });

      // Generate AI response using Google Gemini
      const aiResponse = await generateAIResponse(message);
      
      // Update the message with AI response
      const updatedMessage = await storage.updateChatResponse(userMessage.id, aiResponse);

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
      const history = await storage.getChatHistory(sessionId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Suhbat tarixini olishda xatolik" });
    }
  });

  // Admin Blog APIs
  app.get("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Blog postlarini olishda xatolik" });
    }
  });

  app.post("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Blog post yaratishda xatolik", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/admin/blog/:id", adminAuth, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, postData);
      
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
      const success = await storage.deleteBlogPost(req.params.id);
      
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
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Blog postlarini olishda xatolik" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      
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
      
      const results = await storage.searchAll(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Qidiruvda xatolik" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
