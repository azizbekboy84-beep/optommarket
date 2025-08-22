import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage.js";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Foydalanuvchining barcha sevimli mahsulotlarini olish
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;
    
    // Sevimli mahsulotlarni storage orqali olish
    const userFavorites = await storage.getFavorites(userId);
    
    // Har bir sevimli mahsulot uchun mahsulot ma'lumotlarini olish
    const favoritesWithProducts = await Promise.all(
      userFavorites.map(async (favorite) => {
        const product = await storage.getProduct(favorite.productId);
        return {
          ...favorite,
          product
        };
      })
    );

    res.json(favoritesWithProducts);
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
    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({ message: "Mahsulot topilmadi" });
    }

    // Allaqachon sevimlilar ro'yxatida emasligini tekshirish
    const isAlreadyFavorite = await storage.isFavorite(userId, productId);
    if (isAlreadyFavorite) {
      return res.status(409).json({ 
        message: "Mahsulot allaqachon sevimlilar ro'yxatida" 
      });
    }

    // Sevimlilar ro'yxatiga qo'shish
    const newFavorite = await storage.addToFavorites({ userId, productId });

    res.status(201).json({
      ...newFavorite,
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
    
    const isRemoved = await storage.removeFromFavorites(userId, productId);

    if (!isRemoved) {
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
    
    const isFavorite = await storage.isFavorite(userId, productId);
    const userFavorites = await storage.getFavorites(userId);
    const favorite = userFavorites.find(f => f.productId === productId);

    res.json({ 
      isFavorite,
      favoriteId: favorite ? favorite.id : null
    });
  } catch (error) {
    console.error("Sevimlilar holatini tekshirishda xatolik:", error);
    res.status(500).json({ message: "Server xatoligi" });
  }
});

export default router;