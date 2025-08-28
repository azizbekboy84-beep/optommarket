import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// WebSocket konfiguratsiyasi sertifikat xatolarini hal qilish uchun
neonConfig.webSocketConstructor = class extends ws {
  constructor(url: string, protocols?: string | string[], options?: ws.ClientOptions) {
    super(url, protocols, {
      ...options,
      rejectUnauthorized: false
    });
  }
};

// For development in Replit, provide fallback when DATABASE_URL is not accessible
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("DATABASE_URL not found, application will use in-memory storage");
  // Create a dummy connection that won't be used since we'll use MemStorage
  process.env.DATABASE_URL = "postgresql://localhost:5432/dummy";
}

export const pool = new Pool({ connectionString: databaseUrl || process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });