import { type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type Order, type InsertOrder, type OrderItem, type InsertOrderItem, type CartItem, type InsertCartItem, type BlogPost, type InsertBlogPost, type ChatMessage, type InsertChatMessage, type UserActivity, type InsertUserActivity, type Favorite, type InsertFavorite } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Products
  getProducts(categoryId?: string, featured?: boolean): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Orders
  getOrders(userId?: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Search
  searchAll(query: string): Promise<{ products: Product[]; blogPosts: BlogPost[]; }>;
  
  // Chat Messages
  getChatHistory(sessionId: string): Promise<ChatMessage[]>;
  saveChatMessage(chatMessage: InsertChatMessage): Promise<ChatMessage>;
  updateChatResponse(messageId: string, response: string): Promise<ChatMessage | undefined>;
  
  // User Activities (Analytics)
  logUserActivity?(activity: InsertUserActivity): Promise<UserActivity | undefined>;
  getUserActivities?(filters?: {
    userId?: string;
    sessionId?: string;
    activityType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }): Promise<UserActivity[]>;

  // Favorites
  getFavorites(userId: string): Promise<Favorite[]>;
  addToFavorites(favorite: InsertFavorite): Promise<Favorite>;
  removeFromFavorites(userId: string, productId: string): Promise<boolean>;
  isFavorite(userId: string, productId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private blogPosts: Map<string, BlogPost>;
  private chatMessages: Map<string, ChatMessage>;
  private userActivities: Map<string, UserActivity>;
  private favorites: Map<string, Favorite>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.blogPosts = new Map();
    this.chatMessages = new Map();
    this.userActivities = new Map();
    this.favorites = new Map();
    this.seedData().catch(console.error);
  }

  private async seedData() {
    // Seed admin user for testing
    const adminUser: User = {
      id: "admin-user-1",
      username: "admin",
      password: "$2b$10$Dpxm6uzB8t.peuLzoCfLOu.xMQ8GxThZswOmqgu9g.kdhFty5sNdy", // "Gisobot201415*" hashed
      email: "akramjon001@gmail.com",
      phone: "+998996448444",
      role: "admin",
      createdAt: new Date()
    };
    this.users.set("admin-user-1", adminUser);
    
    // Import real categories from seed data
    const { realCategories, realProducts, realBlogPosts } = await this.loadSeedData();
    
    // Seed categories from real Optombazar.uz data
    realCategories.forEach((category: any) => {
      const categoryWithDefaults: Category = {
        ...category,
        isActive: category.isActive ?? true,
        createdAt: new Date()
      };
      this.categories.set(category.id, categoryWithDefaults);
    });

    // Seed products from real Optombazar.uz data
    realProducts.forEach((product: any) => {
      const productWithDefaults: Product = {
        ...product,
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        createdAt: new Date()
      };
      this.products.set(product.id, productWithDefaults);
    });

    // Seed blog posts from real Optombazar.uz data
    realBlogPosts.forEach((blogPost: any) => {
      const postWithDefaults: BlogPost = {
        ...blogPost,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.blogPosts.set(blogPost.id, postWithDefaults);
    });
  }

  private async loadSeedData() {
    // Import real data using dynamic import for ESM compatibility
    try {
      const { realCategories, realProducts, realBlogPosts } = await import('./realData.js');
      return {
        realCategories: realCategories || this.getFallbackCategories(),
        realProducts: realProducts || [],
        realBlogPosts: realBlogPosts || []
      };
    } catch (error) {
      console.warn('Real seed data not available, using fallback:', error);
      return {
        realCategories: this.getFallbackCategories(),
        realProducts: [],
        realBlogPosts: []
      };
    }
  }

  private getFallbackCategories() {
    return [
      {
        id: "cat-1",
        nameUz: "Polietilen paketlar",
        nameRu: "Полиэтиленовые пакеты",
        descriptionUz: "Har xil o'lcham va qalinlikdagi polietilen paketlar",
        descriptionRu: "Полиэтиленовые пакеты различных размеров и толщин",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
        icon: "Package",
        slug: "polietilen-paketlar",
        parentId: null,
        isActive: true,
      },
      {
        id: "cat-2",
        nameUz: "Bir martalik idishlar",
        nameRu: "Одноразовая посуда",
        descriptionUz: "Plastik va qog'oz bir martalik idish-tovoqlar",
        descriptionRu: "Пластиковая и бумажная одноразовая посуда",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
        icon: "Utensils",
        slug: "bir-martalik-idishlar",
        parentId: null,
        isActive: true,
      },
      {
        id: "cat-3",
        nameUz: "Elektronika",
        nameRu: "Электроника",
        descriptionUz: "Telefon aksessuarlari, gadjetlar va elektronika",
        descriptionRu: "Аксессуары для телефонов, гаджеты и электроника",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
        icon: "Smartphone",
        slug: "elektronika",
        parentId: null,
        isActive: true,
      },
      {
        id: "cat-4",
        nameUz: "Kiyim-kechak",
        nameRu: "Одежда",
        descriptionUz: "Optom kiyim, maishiy tekstil mahsulotlari",
        descriptionRu: "Оптовая одежда, текстильные изделия",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
        icon: "Shirt",
        slug: "kiyim-kechak",
        parentId: null,
        isActive: true,
      },
    ];

    // Seed products
    const products = [
      {
        id: "prod-1",
        nameUz: "Sifatli plastik paketlar",
        nameRu: "Качественные пластиковые пакеты",
        descriptionUz: "Yuqori sifatli polietilen paketlar - 30x40sm",
        descriptionRu: "Высококачественные полиэтиленовые пакеты - 30x40см",
        categoryId: "cat-1",
        sellerId: "seller-1",
        price: "150.00",
        wholesalePrice: "120.00",
        minQuantity: 100,
        stockQuantity: 5000,
        unit: "dona",
        specifications: {"Material": "LDPE", "Qalinligi": "50 mikron", "Ranglar": "Turli ranglar"} as Record<string, string>,
        images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"],
        videoUrl: null,
        slug: "sifatli-plastik-paketlar",
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
      },
      {
        id: "prod-2",
        nameUz: "Bir martalik stakanlar",
        nameRu: "Одноразовые стаканчики",
        descriptionUz: "Plastik bir martalik stakanlar - 200ml",
        descriptionRu: "Пластиковые одноразовые стаканчики - 200мл",
        categoryId: "cat-2",
        sellerId: "seller-1",
        price: "170.00",
        wholesalePrice: "170.00",
        minQuantity: 50,
        stockQuantity: 3000,
        unit: "dona",
        specifications: {"Material": "Plastik", "Hajmi": "200ml", "Turi": "Bir martalik"} as Record<string, string>,
        images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"],
        videoUrl: null,
        slug: "bir-martalik-stakanlar",
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
      },
      {
        id: "prod-3",
        nameUz: "Telefon aksessuarlari",
        nameRu: "Аксессуары для телефонов",
        descriptionUz: "Universal telefon qopqoqlari to'plami",
        descriptionRu: "Универсальные чехлы для телефонов",
        categoryId: "cat-3",
        sellerId: "seller-1",
        price: "4500.00",
        wholesalePrice: "4500.00",
        minQuantity: 10,
        wholesaleMinQuantity: 50,
        stockQuantity: 500,
        unit: "dona",
        specifications: {"Material": "Silikon", "Moslik": "Universal", "Ranglar": "Ko'p rangli"} as Record<string, string>,
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"],
        videoUrl: null,
        slug: "telefon-aksessuarlari",
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
      },
      {
        id: "prod-4",
        nameUz: "Erkaklar t-shirtkasi",
        nameRu: "Мужская футболка",
        descriptionUz: "100% paxta erkaklar klassik t-shirtkalari",
        descriptionRu: "100% хлопок мужские классические футболки",
        categoryId: "cat-4",
        sellerId: "seller-1",
        price: "25000.00",
        wholesalePrice: "25000.00",
        minQuantity: 1,
        wholesaleMinQuantity: 10,
        stockQuantity: 200,
        unit: "dona",
        specifications: {"Material": "100% Paxta", "Rang": "Oq, Qora", "O'lcham": "S-XXL"} as Record<string, string>,
        images: ["https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"],
        videoUrl: null,
        slug: "erkaklar-t-shirtkasi",
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
      },
    ];

    products.forEach(product => {
      this.products.set(product.id, product);
    });

    // Seed blog posts
    const blogPosts = [
      {
        id: "blog-1",
        title: "Optom savdo biznesida muvaffaqiyat sirlari",
        content: "Optom savdo sohasi o'zining imkoniyatlari va qiyinchiliklari bilan ajralib turadi. Ushbu maqolada sizga optom savdo biznesida muvaffaqiyat qozonish uchun zarur bo'lgan asosiy strategiyalar va maslahatlarni taqdim etamiz.\n\nBirinchi navbatda, ishonchli ta'minotchi topish muhim. Sifatli mahsulotlarni arzon narxlarda taklif qiladigan ta'minotchilar bilan uzoq muddatli hamkorlik o'rnatish biznesingizning barqarorligi uchun zarur.\n\nIkkinchidan, bozorni chuqur o'rganish kerak. Qaysi mahsulotlar eng ko'p sotiladi, qaysi mavsumda talab ortadi - bularni bilish sizga to'g'ri qarorlar qabul qilishga yordam beradi.",
        excerpt: "Optom savdo biznesida muvaffaqiyatga erishish uchun asosiy strategiyalar va praktik maslahatlar. Ishonchli ta'minotchi topish va bozorni o'rganish haqida.",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "optom-savdo-muvaffaqiyat",
        tags: ["optom savdo", "biznes", "strategiya"],
        language: "uz",
        isPublished: true,
        isAutoGenerated: false,
        source: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "blog-2", 
        title: "2024-yilda eng istiqbolli mahsulot turlari",
        content: "Yangi yil bilan birga yangi imkoniyatlar ham keladi. 2024-yilda qaysi mahsulot turlari eng yuqori foyda keltirishi mumkin?\n\nEkologik toza mahsulotlar: Atrof-muhitga zarar yetkazmaydigan mahsulotlarga talab kundan-kunga ortib bormoqda. Qayta ishlanadigan materiallardan tayyorlangan paketlar, bio-parchalanuvchi mahsulotlar kabi tovarlarga investitsiya qilish mantiqan to'g'ri qaror.\n\nRaqamli texnologiyalar: Telefon aksessuarlari, portativ zaryadlovchi qurilmalar va boshqa IT mahsulotlari hamon yuqori talabda.",
        excerpt: "2024-yil uchun eng istiqbolli mahsulot turlari: ekologik toza mahsulotlar va raqamli texnologiyalar. Qaysi sohalarga investitsiya qilish kerak.",
        imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        slug: "2024-istiqbolli-mahsulotlar",
        tags: ["2024", "mahsulotlar", "trend"],
        language: "uz",
        isPublished: true,
        isAutoGenerated: false,
        source: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    blogPosts.forEach(post => this.blogPosts.set(post.id, post));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      phone: insertUser.phone || null,
      role: insertUser.role || "customer",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(cat => cat.isActive);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { 
      ...insertCategory, 
      id,
      image: insertCategory.image || null,
      icon: insertCategory.icon || null,
      descriptionUz: insertCategory.descriptionUz || null,
      descriptionRu: insertCategory.descriptionRu || null,
      parentId: insertCategory.parentId || null,
      isActive: insertCategory.isActive ?? true
    };
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = {
      ...category,
      ...updates,
      id: category.id // Preserve original ID
    };
    
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Products
  async getProducts(categoryId?: string, featured?: boolean): Promise<Product[]> {
    let products = Array.from(this.products.values()).filter(product => product.isActive);
    
    if (categoryId) {
      products = products.filter(product => product.categoryId === categoryId);
    }
    
    if (featured !== undefined) {
      products = products.filter(product => product.isFeatured === featured);
    }
    
    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.slug === slug);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      descriptionUz: insertProduct.descriptionUz || null,
      descriptionRu: insertProduct.descriptionRu || null,
      minQuantity: insertProduct.minQuantity ?? 1,
      wholesaleMinQuantity: (insertProduct as any).wholesaleMinQuantity ?? 1,
      stockQuantity: insertProduct.stockQuantity ?? 0,
      specifications: insertProduct.specifications || null,
      images: insertProduct.images || null,
      videoUrl: insertProduct.videoUrl || null,
      isActive: insertProduct.isActive ?? true,
      isFeatured: insertProduct.isFeatured ?? false,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = {
      ...product,
      ...updates,
      id: product.id, // Preserve original ID
      createdAt: product.createdAt // Preserve creation date
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product => 
      product.isActive && (
        product.nameUz.toLowerCase().includes(lowerQuery) ||
        product.nameRu.toLowerCase().includes(lowerQuery) ||
        product.descriptionUz?.toLowerCase().includes(lowerQuery) ||
        product.descriptionRu?.toLowerCase().includes(lowerQuery)
      )
    );
  }

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    let orders = Array.from(this.orders.values());
    if (userId) {
      orders = orders.filter(order => order.userId === userId);
    }
    return orders;
  }
  
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      discountId: insertOrder.discountId || null,
      discountAmount: insertOrder.discountAmount || null,
      status: insertOrder.status || "pending",
      deliveryMethod: insertOrder.deliveryMethod || "olib_ketish",
      paymentMethod: insertOrder.paymentMethod || "naqd",
      paymentStatus: insertOrder.paymentStatus || "kutmoqda",
      customerEmail: insertOrder.customerEmail || null,
      notes: insertOrder.notes || null,
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = {
      ...order,
      ...updates,
      id: order.id, // Preserve original ID
      createdAt: order.createdAt // Preserve creation date
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItems = Array.from(this.cartItems.values());
    const existingItem = existingItems.find(
      item => item.sessionId === insertCartItem.sessionId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += insertCartItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Add new item
      const id = randomUUID();
      const cartItem: CartItem = { 
        ...insertCartItem, 
        id,
        createdAt: new Date()
      };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);
    
    itemsToDelete.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  // Blog Posts methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(post => post.isPublished);
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      imageUrl: insertPost.imageUrl || null,
      isPublished: insertPost.isPublished ?? true,
      language: insertPost.language || 'uz',
      source: insertPost.source || 'admin',
      excerpt: insertPost.excerpt || null,
      tags: insertPost.tags || null,
      isAutoGenerated: insertPost.isAutoGenerated ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;

    const updatedPost = {
      ...post,
      ...updates,
      id: post.id, // Preserve original ID
      createdAt: post.createdAt, // Preserve creation date
      updatedAt: new Date(), // Update modification date
    };

    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Search implementation
  async searchAll(query: string): Promise<{ products: Product[]; blogPosts: BlogPost[] }> {
    const searchQuery = query.toLowerCase().trim();
    
    if (!searchQuery) {
      return { products: [], blogPosts: [] };
    }

    console.log('🔍 Qidiruv:', { searchQuery, totalProducts: this.products.size });
    
    // Debug: List all products first
    console.log('📋 Barcha mahsulotlar:');
    Array.from(this.products.values()).forEach(product => {
      console.log('- ', { id: product.id, nameUz: product.nameUz, isActive: product.isActive });
    });

    // Search products
    const products = Array.from(this.products.values()).filter(product => {
      const nameUzMatch = product.nameUz.toLowerCase().includes(searchQuery);
      const nameRuMatch = product.nameRu.toLowerCase().includes(searchQuery);
      const descUzMatch = product.descriptionUz && product.descriptionUz.toLowerCase().includes(searchQuery);
      const descRuMatch = product.descriptionRu && product.descriptionRu.toLowerCase().includes(searchQuery);
      
      const matches = nameUzMatch || nameRuMatch || descUzMatch || descRuMatch;
      
      console.log('🔍 Tekshiruv:', { 
        id: product.id, 
        nameUz: product.nameUz, 
        searchQuery,
        nameUzLower: product.nameUz.toLowerCase(),
        nameUzMatch,
        matches,
        isActive: product.isActive
      });
      
      if (matches) {
        console.log('✅ Topildi:', { 
          id: product.id, 
          nameUz: product.nameUz, 
          isActive: product.isActive,
          nameUzMatch,
          nameRuMatch 
        });
      }
      
      return product.isActive && matches;
    });

    // Search blog posts
    const blogPosts = Array.from(this.blogPosts.values()).filter(post => {
      return post.isPublished && (
        post.title.toLowerCase().includes(searchQuery) ||
        post.content.toLowerCase().includes(searchQuery)
      );
    });

    return { products, blogPosts };
  }

  // Chat Messages implementation
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
  }

  async saveChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      userId: insertMessage.userId || null,
      userName: insertMessage.userName || null,
      userPhone: insertMessage.userPhone || null,
      response: insertMessage.response || null,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async updateChatResponse(messageId: string, response: string): Promise<ChatMessage | undefined> {
    const message = this.chatMessages.get(messageId);
    if (!message) return undefined;

    const updatedMessage = {
      ...message,
      response,
    };

    this.chatMessages.set(messageId, updatedMessage);
    return updatedMessage;
  }

  // User Activities implementation
  async logUserActivity(insertActivity: InsertUserActivity): Promise<UserActivity | undefined> {
    const id = randomUUID();
    const activity: UserActivity = {
      ...insertActivity,
      id,
      userId: insertActivity.userId || null,
      targetId: insertActivity.targetId || null,
      targetType: insertActivity.targetType || null,
      metadata: insertActivity.metadata || null,
      ipAddress: insertActivity.ipAddress || null,
      userAgent: insertActivity.userAgent || null,
      timestamp: new Date(),
    };
    this.userActivities.set(id, activity);
    return activity;
  }

  async getUserActivities(filters?: {
    userId?: string;
    sessionId?: string;
    activityType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }): Promise<UserActivity[]> {
    let activities = Array.from(this.userActivities.values());

    if (filters) {
      if (filters.userId) {
        activities = activities.filter(activity => activity.userId === filters.userId);
      }
      if (filters.sessionId) {
        activities = activities.filter(activity => activity.sessionId === filters.sessionId);
      }
      if (filters.activityType) {
        activities = activities.filter(activity => activity.activityType === filters.activityType);
      }
      if (filters.dateFrom) {
        activities = activities.filter(activity => 
          new Date(activity.timestamp || '') >= filters.dateFrom!
        );
      }
      if (filters.dateTo) {
        activities = activities.filter(activity => 
          new Date(activity.timestamp || '') <= filters.dateTo!
        );
      }
    }

    // Sort by timestamp descending (most recent first)
    activities.sort((a, b) => 
      new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime()
    );

    // Apply limit if specified
    if (filters?.limit) {
      activities = activities.slice(0, filters.limit);
    }

    return activities;
  }

  // Favorites methods
  async getFavorites(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(fav => fav.userId === userId);
  }

  async addToFavorites(insertFavorite: InsertFavorite): Promise<Favorite> {
    // Check if already exists
    const existingFavorite = Array.from(this.favorites.values()).find(
      fav => fav.userId === insertFavorite.userId && fav.productId === insertFavorite.productId
    );
    
    if (existingFavorite) {
      return existingFavorite;
    }

    const id = randomUUID();
    const favorite: Favorite = {
      ...insertFavorite,
      id,
      createdAt: new Date(),
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFromFavorites(userId: string, productId: string): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      fav => fav.userId === userId && fav.productId === productId
    );
    
    if (favorite) {
      return this.favorites.delete(favorite.id);
    }
    return false;
  }

  async isFavorite(userId: string, productId: string): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      fav => fav.userId === userId && fav.productId === productId
    );
    return !!favorite;
  }
}

export const storage = new MemStorage();
