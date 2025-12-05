import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Add support for "transaction" mode or "session" mode if needed, 
// but standard pool is fine for general usage.

const connectionString = process.env.DATABASE_URL;

// Use a mock or empty pool if no connection string (e.g. during build)
// This prevents "getaddrinfo ENOTFOUND" if the default string is invalid/unreachable
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

if (!connectionString) {
  console.warn('DATABASE_URL is not defined. Using fallback or mock.');
}

// Ensure we use a robust connection configuration for Supabase
// Supabase transaction pooler (port 6543) doesn't support some statement types, 
// but for simple queries it is fine. The session pooler (port 5432) is safer for ORMs.

// Prevent multiple connections in development
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const pool = globalForDb.conn ?? new Pool({
  connectionString: connectionString || 'postgres://postgres:postgres@localhost:5432/nocap',
  ssl: connectionString?.includes('supabase') || connectionString?.includes('neon') ? { rejectUnauthorized: false } : undefined,
  max: 20, // Increase pool size slightly
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased to 10s
});

if (process.env.NODE_ENV !== 'production') globalForDb.conn = pool;

export const db = drizzle(pool, { schema });
