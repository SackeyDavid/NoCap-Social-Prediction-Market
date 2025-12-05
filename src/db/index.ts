import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, Client } from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is not defined. Using fallback or mock.');
}

// For Supabase, use individual Client connections instead of Pool
// This is more stable for serverless/edge environments
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

// Create pool only if not already created (prevent hot reload issues)
const pool = globalForDb.pool ?? new Pool({
  connectionString: connectionString || 'postgres://postgres:postgres@localhost:5432/nocap',
  ssl: connectionString?.includes('supabase') || connectionString?.includes('neon')
    ? { rejectUnauthorized: false }
    : undefined,
  max: 1, // Single connection for stability
  min: 0,
  idleTimeoutMillis: 0, // Don't keep idle connections
  connectionTimeoutMillis: 60000, // 60 second timeout
});

pool.on('error', (err) => {
  console.error('Pool error - will retry on next request:', err.message);
});

pool.on('connect', () => {
  console.log('DB pool connected');
});

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

export const db = drizzle(pool, { schema });
