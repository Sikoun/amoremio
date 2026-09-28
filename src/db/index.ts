import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.TURSO_URL ||
  process.env.TURSO_CONNECTION_URL ||
  process.env.STORAGE_URL ||
  '';

const authToken =
  process.env.TURSO_AUTH_TOKEN ||
  process.env.STORAGE_AUTH_TOKEN ||
  '';

export const isTursoConfigured = Boolean(url && authToken);

export const client = isTursoConfigured
  ? createClient({
      url,
      authToken,
    })
  : null;

// Schema is managed by Drizzle migrations in ./drizzle, applied by scripts/migrate.mjs on build.
export const db = client ? drizzle(client, { schema }) : null;
