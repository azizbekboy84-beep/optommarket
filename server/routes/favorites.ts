import { Router } from "express";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../db.js";
import { favorites, insertFavoriteSchema, products } from "../../shared/schema.js";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Foydalanuvchining barcha sevimli mahsulotlarini olish
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    
    // Sevimli mahsulotlarni mahsulot ma'lumotlari bilan birga olish
    const userFavorites = await db
      .select({
        id: favorites.id,
        productId: favorites.productId,
        createdAt: favorites.createdAt,
        product: {
          id: products.id,
          nameUz: products.nameUz,
          nameRu: products.nameRu,
          descriptionUz: products.descriptionUz,
          descriptionRu: products.descriptionRu,
          price: products.price,
          wholesalePrice: products.wholesalePrice,
          images: products.images,
          slug: products.slug,
          categoryId: products.categoryId,
          unit: products.unit,
          stockQuantity: products.stockQuantity,
          isActive: products.isActive,
          isFeatured: products.isFeatured,
        }
      })
      .from(favorites)
      .innerJoin(products, eq(favorites.productId, products.id))
      .where(eq(favorites.userId, userId))
      .orderBy(favorites.createdAt);

    res.json(userFavorites);
  } catch (error) {
    console.error("Sevimli mahsulotlarni olishda xatolik:", error);
    res.status(500).json({ message: "Server xatoligi" });
  }
});

// Mahsulotni sevimlilar ro'yxatiga qo'shish
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { productId } = z.object({ productId: z.string() }).parse(req.body);
    
    // Mahsulot mavjudligini tekshirish
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length === 0) {
      return res.status(404).json({ message: "Mahsulot topilmadi" });
    }

    // Allaqachon sevimlilar ro'yxatida emasligini tekshirish
    const existingFavorite = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.productId, productId)
        )
      )
      .limit(1);

    if (existingFavorite.length > 0) {
      return res.status(409).json({ 
        message: "Mahsulot allaqachon sevimlilar ro'yxatida" 
      });
    }

    // Sevimlilar ro'yxatiga qo'shish
    const newFavorite = await db
      .insert(favorites)
      .values({ userId, productId })
      .returning();

    res.status(201).json({
      ...newFavorite[0],
      message: "Mahsulot sevimlilar ro'yxatiga qo'shildi"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Noto'g'ri ma'lumotlar", 
        errors: error.errors 
      });
    }
    console.error("Sevimlilar ro'yxatiga qo'shishda xatolik:", error);
    res.status(500).json({ message: "Server xatoligi" });
  }
});

// Mahsulotni sevimlilar ro'yxatidan o'chirish
router.delete("/:productId", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { productId } = req.params;
    
    const deletedFavorite = await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.productId, productId)
        )
      )
      .returning();

    if (deletedFavorite.length === 0) {
      return res.status(404).json({ 
        message: "Sevimlilar ro'yxatida bunday mahsulot topilmadi" 
      });
    }

    res.json({ message: "Mahsulot sevimlilar ro'yxatidan o'chirildi" });
  } catch (error) {
    console.error("Sevimlilar ro'yxatidan o'chirishda xatolik:", error);
    res.status(500).json({ message: "Server xatoligi" });
  }
});

// Mahsulot sevimlilar ro'yxatida borligini tekshirish
router.get("/check/:productId", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { productId } = req.params;
    
    const favorite = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.productId, productId)
        )
      )
      .limit(1);

    res.json({ 
      isFavorite: favorite.length > 0,
      favoriteId: favorite.length > 0 ? favorite[0].id : null
    });
  } catch (error) {
    console.error("Sevimlilar holatini tekshirishda xatolik:", error);
    res.status(500).json({ message: "Server xatoligi" });
  }
});

export default router;