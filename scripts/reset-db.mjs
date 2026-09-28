// DESTRUCTIVE: drops every AmoreMio table (and Drizzle's migration log) so the
// next `npm run db:migrate` or deploy recreates them from ./drizzle.
// Needs TURSO_DATABASE_URL + TURSO_AUTH_TOKEN and an explicit --yes flag.
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL || process.env.STORAGE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN || process.env.STORAGE_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN first.');
  process.exit(1);
}
if (!process.argv.includes('--yes')) {
  console.error(`This deletes ALL data in ${url}. Re-run with --yes to confirm.`);
  process.exit(1);
}

const client = createClient({ url, authToken });
await client.batch(
  ['answers', 'questions', 'pokes', 'games', 'couple_settings', '__drizzle_migrations'].map(
    (table) => `DROP TABLE IF EXISTS ${table}`
  ),
  'write'
);
console.log('All tables dropped. Run `npm run db:migrate` (or deploy) to recreate them.');
client.close();
