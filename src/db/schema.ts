import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import type { PetCustomization } from '@/lib/types';

// 1. Core Settings & Couple State (persistent settings, pets, moods, push tokens)
export const coupleSettings = sqliteTable('couple_settings', {
  id: text('id').primaryKey(), // 'main'
  anniversaryDate: text('anniversary_date').notNull().default('2023-01-01'),
  
  // Partner 1 (Gaspar / Sea Lion)
  partner1Name: text('partner1_name').notNull().default('Gaspar'),
  partner1Nickname: text('partner1_nickname').notNull().default('My Sea Lion'),
  partner1AvatarEmoji: text('partner1_avatar_emoji').notNull().default('🦭'),
  partner1Pet: text('partner1_pet').notNull().default('sealion'),
  partner1CustomPet: text('partner1_custom_pet', { mode: 'json' }).$type<PetCustomization>(),
  partner1Mood: text('partner1_mood').notNull().default('Thinking of you'),
  partner1MoodEmoji: text('partner1_mood_emoji').notNull().default('🥰'),
  partner1LastActive: text('partner1_last_active'),
  partner1PushToken: text('partner1_push_token', { mode: 'json' }), // For web push notifications

  // Partner 2 (Mi Amor / Lion)
  partner2Name: text('partner2_name').notNull().default('Mi Amor'),
  partner2Nickname: text('partner2_nickname').notNull().default('My Lion'),
  partner2AvatarEmoji: text('partner2_avatar_emoji').notNull().default('🦁'),
  partner2Pet: text('partner2_pet').notNull().default('lion'),
  partner2CustomPet: text('partner2_custom_pet', { mode: 'json' }).$type<PetCustomization>(),
  partner2Mood: text('partner2_mood').notNull().default('Missing you'),
  partner2MoodEmoji: text('partner2_mood_emoji').notNull().default('🥺'),
  partner2LastActive: text('partner2_last_active'),
  partner2PushToken: text('partner2_push_token', { mode: 'json' }), // For web push notifications

  updatedAt: text('updated_at'),
});

// 2. Questions Catalog (Daily assigned questions + future question banks / APIs)
export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  date: text('date').notNull().unique(), // YYYY-MM-DD
  text: text('text').notNull(),
  category: text('category').notNull(),
  source: text('source').notNull().default('bank'), // 'bank' | 'api' | 'custom'
  createdAt: text('created_at'),
});

// 3. Normalized Answers (Enables rich stats, history, sentiment, streaks)
export const answers = sqliteTable('answers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  questionDate: text('question_date').notNull(),
  partnerId: text('partner_id').notNull(), // 'partner1' | 'partner2'
  answerText: text('answer_text').notNull(),
  answeredAt: text('answered_at').notNull(),
});

// 4. Pokes / Love Ping History
export const pokes = sqliteTable('pokes', {
  id: text('id').primaryKey(),
  fromPartner: text('from_partner').notNull(),
  emoji: text('emoji').notNull(),
  message: text('message').notNull(),
  timestamp: text('timestamp').notNull(),
});

// 5. Future Mini-Games Table (Trivia, Turn-based games, Moves)
export const games = sqliteTable('games', {
  id: text('id').primaryKey(),
  gameType: text('game_type').notNull(), // e.g. 'trivia', 'drawing', 'wordle'
  status: text('status').notNull().default('in_progress'), // 'in_progress' | 'completed'
  currentTurn: text('current_turn').notNull(),
  gameState: text('game_state', { mode: 'json' }),
  updatedAt: text('updated_at'),
});
