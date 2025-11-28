import { Pool, QueryResult } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

/**
 * IMPORTANT: This module implements lazy database initialization.
 * 
 * The database pool and Drizzle instance are NOT created at module import time.
 * They are only created the first time they are accessed (lazy initialization).
 * 
 * WHY: Netlify build-time does not expose DATABASE_URL environment variable.
 * If we initialized the pool at import time, the build would fail with:
 * "DATABASE_URL environment variable is not set"
 * 
 * By using lazy initialization (singleton pattern), the database is only
 * initialized when a runtime request actually needs it, not during build.
 */

// Reuse connection pool across serverless invocations
let pool: Pool | null = null;
let drizzleDb: ReturnType<typeof drizzle> | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString,
      // Serverless-friendly pool settings
      min: 0,
      max: 1, // Netlify limits to 1 concurrent connection per function
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
      application_name: 'efootball-showdown',
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

// Lazy Drizzle instance - NEVER call this at module import time
function getDb() {
  if (!drizzleDb) {
    drizzleDb = drizzle(getPool(), { schema });
  }
  return drizzleDb;
}

// Query helper (returns QueryResult)
export async function query(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<QueryResult> {
  const pool = getPool();
  return pool.query(text, params);
}

// Get single row (returns first row or undefined)
export async function get<T>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<T | undefined> {
  const result = await query(text, params);
  return (result.rows[0] || undefined) as T | undefined;
}

// Run query (for inserts/updates/deletes, returns QueryResult)
export async function run(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<QueryResult> {
  return query(text, params);
}

// Export function to get Drizzle instance (lazy-initialized)
// NEVER import as: const db = db from '@/lib/db' at module level
// ALWAYS call as: const db = getDrizzleDb() inside handler functions
export function getDrizzleDb() {
  return getDb();
}

// Graceful shutdown helper (use in API route handlers if needed)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
  drizzleDb = null;
}
