import { Request, Response, NextFunction } from "express";
import { storage } from "../storage.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Check if user is authenticated
    if (!req.session.userId) {
      return res.status(401).json({ message: "Tizimga kirish talab qilinadi" });
    }

    // Get user from storage
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Foydalanuvchi topilmadi" });
    }

    // Add user to request for further use
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server xatoligi" });
  }
}

export function requireRole(role: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Avtorizatsiya talab qilinadi" });
      }

      if (req.user.role !== role) {
        return res.status(403).json({ 
          message: `Ruxsat yo'q. ${role} huquqlari talab qilinadi.` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Server xatoligi" });
    }
  };
}