import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

export async function adminAuth(req: Request, res: Response, next: NextFunction) {
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

    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Ruxsat yo'q. Administrator huquqlari talab qilinadi." });
    }

    // Add user to request for further use
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server xatoligi" });
  }
}