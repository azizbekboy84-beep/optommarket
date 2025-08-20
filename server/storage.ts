import { type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type Order, type InsertOrder, type OrderItem, type InsertOrderItem, type CartItem, type InsertCartItem } from "@shared/schema";
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

  // Products
  getProducts(categoryId?: string, featured?: boolean): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Orders
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categories = [
      {
        id: "cat-1",
        nameUz: "Polietilen paketlar",
        nameRu: "Полиэтиленовые пакеты",
        descriptionUz: "Har xil o'lcham va qalinlikdagi polietilen paketlar",
        descriptionRu: "Полиэтиленовые пакеты различных размеров и толщин",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200",
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
        slug: "kiyim-kechak",
        parentId: null,
        isActive: true,
      },
    ];

    categories.forEach(category => this.categories.set(category.id, category));

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
        images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"],
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
        images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"],
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
        stockQuantity: 500,
        unit: "dona",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"],
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
        stockQuantity: 200,
        unit: "dona",
        images: ["https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"],
        slug: "erkaklar-t-shirtkasi",
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
      },
    ];

    products.forEach(product => this.products.set(product.id, product));
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
      descriptionUz: insertCategory.descriptionUz || null,
      descriptionRu: insertCategory.descriptionRu || null,
      parentId: insertCategory.parentId || null,
      isActive: insertCategory.isActive ?? true
    };
    this.categories.set(id, category);
    return category;
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
      stockQuantity: insertProduct.stockQuantity ?? 0,
      images: insertProduct.images || null,
      isActive: insertProduct.isActive ?? true,
      isFeatured: insertProduct.isFeatured ?? false,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
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

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      status: insertOrder.status || "pending",
      customerEmail: insertOrder.customerEmail || null,
      notes: insertOrder.notes || null,
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
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
}

export const storage = new MemStorage();
