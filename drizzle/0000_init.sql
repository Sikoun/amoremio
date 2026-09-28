CREATE TABLE `answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_date` text NOT NULL,
	`partner_id` text NOT NULL,
	`answer_text` text NOT NULL,
	`answered_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `answers_date_partner_unique` ON `answers` (`question_date`,`partner_id`);--> statement-breakpoint
CREATE TABLE `couple_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`anniversary_date` text DEFAULT '2023-01-01' NOT NULL,
	`partner1_name` text DEFAULT 'Gaspar' NOT NULL,
	`partner1_nickname` text DEFAULT 'My Sea Lion' NOT NULL,
	`partner1_avatar_emoji` text DEFAULT '🦭' NOT NULL,
	`partner1_pet` text DEFAULT 'sealion' NOT NULL,
	`partner1_custom_pet` text,
	`partner1_mood` text DEFAULT 'Thinking of you' NOT NULL,
	`partner1_mood_emoji` text DEFAULT '🥰' NOT NULL,
	`partner1_last_active` text,
	`partner1_push_token` text,
	`partner2_name` text DEFAULT 'Mi Amor' NOT NULL,
	`partner2_nickname` text DEFAULT 'My Lion' NOT NULL,
	`partner2_avatar_emoji` text DEFAULT '🦁' NOT NULL,
	`partner2_pet` text DEFAULT 'lion' NOT NULL,
	`partner2_custom_pet` text,
	`partner2_mood` text DEFAULT 'Missing you' NOT NULL,
	`partner2_mood_emoji` text DEFAULT '🥺' NOT NULL,
	`partner2_last_active` text,
	`partner2_push_token` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`game_type` text NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`current_turn` text NOT NULL,
	`game_state` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `pokes` (
	`id` text PRIMARY KEY NOT NULL,
	`from_partner` text NOT NULL,
	`emoji` text NOT NULL,
	`message` text NOT NULL,
	`timestamp` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`text` text NOT NULL,
	`category` text NOT NULL,
	`source` text DEFAULT 'bank' NOT NULL,
	`created_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `questions_date_unique` ON `questions` (`date`);