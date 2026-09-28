// Applies pending Drizzle migrations (./drizzle) to Turso. Runs before `next build`,
// so every Vercel deploy brings the database schema up to date first.
// Skips quietly when no Turso credentials are set (local dev uses ./data/store.json).
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.TURSO_URL ||
  process.env.TURSO_CONNECTION_URL ||
  process.env.STORAGE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN || process.env.STORAGE_AUTH_TOKEN;

if (!url || !authToken) {
  console.log('[migrate] No Turso credentials found, skipping migrations.');
  process.exit(0);
}

const client = createClient({ url, authToken });
await migrate(drizzle(client), { migrationsFolder: './drizzle' });
console.log('[migrate] Database schema is up to date.');
client.close();
