import { Router } from "express";
import { z } from "zod";
import { eq, and, lte, gte, isNull, or } from "drizzle-orm";
import { db } from "../db.js";
import { discounts, insertDiscountSchema, orders } from "../../shared/schema.js";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Barcha faol chegirmalarni olish (faqat admin uchun)
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const allDiscounts = await db
      .select()
      .from(discounts)
      .orderBy(discounts.createdAt);

    res.json(allDiscounts);
  } catch (error) {
    console.error("Chegirmalarni olishda xatolik:", error);
    res.status(500).json({ message: "Server xatoligi" });
  }
});

// Yangi chegirma yaratish (faqat admin uchun)
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const validatedData = insertDiscountSchema.parse(req.body);
    
    const newDiscount = await db
      .insert(discounts)
      .values([validatedData])
      .returning();

    res.status(201).json(newDiscount[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Noto'g'ri ma'lumotlar", 
        errors: error.errors 
      });
    }
    console.error("Chegirma yaratishda xatolik:", error);
    res.status(500).json({ message: "Server xatoligi" });
  }
});

// Chegirmani tahrirlash (faqat admin uchun)
router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertDiscountSchema.partial().parse(req.body);
    
    const updatedDiscount = await db
      .update(discounts)
      .set(validatedData)
      .where(eq(discounts.id, id))
      .returning();

    if (updatedDiscount.length === 0) {
      return res.status(404).json({ message: "Chegirma topilmadi" });
    }

    res.json(updatedDiscount[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Noto'g'ri ma'lumotlar", 
        errors: error.errors 
      });
    }
    console.error("Chegirmani tahrirlashda xatolik:", error);
    res.status(500).json({ message: "Server xatoligi" });
  }
});

// Chegirmani o'chirish (faqat admin uchun)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedDiscount = await db
      .delete(discounts)
      .where(eq(discounts.id, id))
      .returning();

    if (deletedDiscount.length === 0) {
      return res.status(404).json({ message: "Chegirma topilmadi" });
    }

    res.json({ message: "Chegirma muvaffaqiyatli o'chirildi" });
  } catch (error) {
    console.error("Chegirmani o'chirishda xatolik:", error);
    res.status(500).json({ message: "Server xatoligi" });
  }
});

// Chegirma kodini tekshirish va qo'llash
router.post("/apply", async (req, res) => {
  try {
    const { code } = z.object({ code: z.string() }).parse(req.body);
    
    const now = new Date();
    
    // Chegirma kodini topish va tekshirish
    const discount = await db
      .select()
      .from(discounts)
      .where(
        and(
          eq(discounts.code, code.toUpperCase()),
          eq(discounts.isActive, true),
          lte(discounts.validFrom, now),
          gte(discounts.validUntil, now),
          or(
            eq(discounts.maxUses, 0), // cheksiz foydalanish
            gte(discounts.maxUses, discounts.usedCount)
          )
        )
      )
      .limit(1);

    if (discount.length === 0) {
      return res.status(404).json({ 
        message: "Chegirma kodi noto'g'ri yoki muddati tugagan" 
      });
    }

    const foundDiscount = discount[0];

    // Chegirma ma'lumotlarini qaytarish
    res.json({
      id: foundDiscount.id,
      code: foundDiscount.code,
      type: foundDiscount.type,
      value: foundDiscount.value,
      targetType: foundDiscount.targetType,
      targetIds: foundDiscount.targetIds,
      message: "Chegirma muvaffaqiyatli qo'llandi"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Chegirma kodi kiritilmagan" 
      });
    }
    console.error("Chegirma kodini tekshirishda xatolik:", error);
    res.status(500).json({ message: "Server xatoligi" });
  }
});

export default router;