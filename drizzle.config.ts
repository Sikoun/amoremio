import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || process.env.TURSO_URL || process.env.STORAGE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN || process.env.STORAGE_AUTH_TOKEN || '',
  },
});
