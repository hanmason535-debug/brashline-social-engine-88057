/**
 * Database configuration for Neon PostgreSQL
 * Uses @neondatabase/serverless for optimal serverless performance
 */
import { neon, Pool, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePool } from "drizzle-orm/neon-serverless";
import * as schema from "../models/schema.js";

// Get database URL from environment
const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  return url;
};

// Lazy-initialized SQL client
let _sql: NeonQueryFunction<false, false> | null = null;
let _db: NeonHttpDatabase<typeof schema> | null = null;

export const getSql = (): NeonQueryFunction<false, false> => {
  if (!_sql) {
    _sql = neon(getDatabaseUrl());
  }
  return _sql;
};

export const getDb = (): NeonHttpDatabase<typeof schema> => {
  if (!_db) {
    _db = drizzleNeon(getSql(), { schema });
  }
  return _db;
};

// Alias for convenience - use as sql`query`
export const sql = getSql;

// Pool-based connection (best for long-running processes)
let pool: Pool | null = null;

export const getPool = (): Pool => {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 10, // Maximum connections in pool
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 10000, // Timeout after 10s when connecting
    });
  }
  return pool;
};

export const dbPool = () => drizzlePool(getPool(), { schema });

// Health check function
export const checkConnection = async (): Promise<boolean> => {
  try {
    const sqlClient = getSql();
    const result = await sqlClient`SELECT 1 as health`;
    return result.length > 0 && result[0].health === 1;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
};

// Close pool connection (for graceful shutdown)
export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

// Export types
export type Database = ReturnType<typeof getDb>;
export type DatabasePool = ReturnType<typeof dbPool>;
