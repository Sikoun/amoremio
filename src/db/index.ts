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

export const db = client ? drizzle(client, { schema }) : null;

// Ensure tables exist on boot
let isInitialized = false;
export async function ensureDbTables(): Promise<void> {
  if (!client || isInitialized) return;

  try {
    await client.batch(
      [
        `CREATE TABLE IF NOT EXISTS couple_settings (
          id TEXT PRIMARY KEY,
          anniversary_date TEXT NOT NULL DEFAULT '2023-01-01',
          partner1_name TEXT NOT NULL DEFAULT 'Gaspar',
          partner1_nickname TEXT NOT NULL DEFAULT 'My Sea Lion',
          partner1_avatar_emoji TEXT NOT NULL DEFAULT '🦭',
          partner1_pet TEXT NOT NULL DEFAULT 'sealion',
          partner1_custom_pet TEXT,
          partner1_mood TEXT NOT NULL DEFAULT 'Thinking of you',
          partner1_mood_emoji TEXT NOT NULL DEFAULT '🥰',
          partner1_last_active TEXT,
          partner1_push_token TEXT,
          partner2_name TEXT NOT NULL DEFAULT 'Mi Amor',
          partner2_nickname TEXT NOT NULL DEFAULT 'My Lion',
          partner2_avatar_emoji TEXT NOT NULL DEFAULT '🦁',
          partner2_pet TEXT NOT NULL DEFAULT 'lion',
          partner2_custom_pet TEXT,
          partner2_mood TEXT NOT NULL DEFAULT 'Missing you',
          partner2_mood_emoji TEXT NOT NULL DEFAULT '🥺',
          partner2_last_active TEXT,
          partner2_push_token TEXT,
          updated_at TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS questions (
          id TEXT PRIMARY KEY,
          date TEXT NOT NULL UNIQUE,
          text TEXT NOT NULL,
          category TEXT NOT NULL,
          source TEXT NOT NULL DEFAULT 'bank',
          created_at TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS answers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          question_date TEXT NOT NULL,
          partner_id TEXT NOT NULL,
          answer_text TEXT NOT NULL,
          answered_at TEXT NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS pokes (
          id TEXT PRIMARY KEY,
          from_partner TEXT NOT NULL,
          emoji TEXT NOT NULL,
          message TEXT NOT NULL,
          timestamp TEXT NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS games (
          id TEXT PRIMARY KEY,
          game_type TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'in_progress',
          current_turn TEXT NOT NULL,
          game_state TEXT,
          updated_at TEXT
        );`,
      ],
      'write'
    );
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Turso database tables:', error);
  }
}
