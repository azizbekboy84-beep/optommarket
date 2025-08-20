import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("customer"), // customer, seller, admin
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameUz: text("name_uz").notNull(),
  nameRu: text("name_ru").notNull(),
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  image: text("image"),
  slug: text("slug").notNull().unique(),
  parentId: varchar("parent_id"),
  isActive: boolean("is_active").default(true),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameUz: text("name_uz").notNull(),
  nameRu: text("name_ru").notNull(),
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  categoryId: varchar("category_id").notNull(),
  sellerId: varchar("seller_id").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  wholesalePrice: decimal("wholesale_price", { precision: 10, scale: 2 }).notNull(),
  minQuantity: integer("min_quantity").default(1),
  stockQuantity: integer("stock_quantity").default(0),
  unit: text("unit").notNull(), // kg, piece, box, etc.
  specifications: json("specifications").$type<Record<string, string>>(),
  images: text("images").array(),
  videoUrl: text("video_url"),
  slug: text("slug").notNull().unique(),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  discountId: varchar("discount_id"), // chegirma ID'si (ixtiyoriy)
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }), // chegirma miqdori
  status: text("status").notNull().default("pending"), // pending, confirmed, shipped, delivered, cancelled
  deliveryMethod: text("delivery_method").notNull().default("olib_ketish"), // olib_ketish, kuryer
  paymentMethod: text("payment_method").notNull().default("naqd"), // naqd, karta, qr_kod
  paymentStatus: text("payment_status").notNull().default("kutmoqda"), // kutmoqda, to'langan, bekor_qilingan
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  shippingAddress: text("shipping_address").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

// Chegirmalar tizimi uchun jadval
export const discounts = pgTable("discounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(), // chegirma kodi masalan "YANGI10"
  type: text("type").notNull(), // "percentage" yoki "fixed"
  value: integer("value").notNull(), // foiz yoki so'm miqdori
  isActive: boolean("is_active").default(true), // chegirma faolmi
  validFrom: timestamp("valid_from").notNull(), // chegirma qachondan boshlab amal qiladi
  validUntil: timestamp("valid_until").notNull(), // chegirma qachon tugaydi
  maxUses: integer("max_uses").default(0), // maksimal foydalanish soni, 0 = cheksiz
  usedCount: integer("used_count").default(0), // hozirgacha foydalanilgan soni
  targetType: text("target_type").notNull().default("all_products"), // "all_products", "specific_products", "specific_categories"
  targetIds: jsonb("target_ids").$type<string[]>(), // maxsus mahsulotlar/kategoriyalar uchun ID'lar
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sevimlilar tizimi uchun jadval
export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(), // foydalanuvchi ID'si
  productId: varchar("product_id").notNull(), // mahsulot ID'si
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertDiscountSchema = createInsertSchema(discounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  usedCount: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Discount = typeof discounts.$inferSelect;
export type InsertDiscount = z.infer<typeof insertDiscountSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"), // Qisqacha mazmun
  imageUrl: text("image_url"),
  slug: text("slug").notNull().unique(),
  tags: text("tags").array(), // Kalit so'zlar va teglar
  language: text("language").notNull().default("uz"), // uz, ru
  isPublished: boolean("is_published").default(true),
  isAutoGenerated: boolean("is_auto_generated").default(false), // AI tomonidan yaratilganmi
  source: text("source").default("admin"), // admin, AI-Generator, manual
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Marketing Messages jadvalini qo'shamiz
export const marketingMessages = pgTable("marketing_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  targetAudience: text("target_audience"), // all, customers, sellers
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMarketingMessageSchema = createInsertSchema(marketingMessages).omit({
  id: true,
  createdAt: true,
  sentAt: true,
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type MarketingMessage = typeof marketingMessages.$inferSelect;
export type InsertMarketingMessage = z.infer<typeof insertMarketingMessageSchema>;

// Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  userId: varchar("user_id"), // Optional - for logged-in users
  message: text("message").notNull(), // User message
  response: text("response"), // AI response
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// User Activities for Analytics
export const userActivities = pgTable("user_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"), // Optional - null for guests
  sessionId: text("session_id").notNull(), // Always track session
  activityType: text("activity_type").notNull(), // product_view, add_to_cart, remove_from_cart, checkout_start, order_placed, search, login, register, page_view
  targetId: varchar("target_id"), // Related object ID (product_id, category_id, etc.)
  targetType: text("target_type"), // product, category, order, page, etc.
  metadata: json("metadata").$type<Record<string, any>>(), // Additional data like search query, quantity, etc.
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserActivitySchema = createInsertSchema(userActivities).omit({
  id: true,
  timestamp: true,
});

export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
