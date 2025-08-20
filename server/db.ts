import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For development, use a default connection string if DATABASE_URL is not set
const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/optombazar_dev";

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "development") {
  throw new Error(
    "DATABASE_URL must be set in production. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });