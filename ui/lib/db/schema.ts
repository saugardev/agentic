import { pgTable, uuid, text, integer, pgEnum, timestamp } from 'drizzle-orm/pg-core';

export const playerStatusEnum = pgEnum('player_status', ['alive', 'dead', 'completed']);

export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id').references(() => players.id).notNull(),
  currentLevel: integer('current_level').notNull().default(1),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  endedAt: timestamp('ended_at'),
  status: playerStatusEnum('status').notNull().default('alive')
});

export const levels = pgTable('levels', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id').references(() => games.id).notNull(),
  number: integer('number').notNull(),
  description: text('description').notNull(),
  requiredElements: text('required_elements').array(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const interactions = pgTable('interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  levelId: uuid('level_id').references(() => levels.id).notNull(),
  playerAnswer: text('player_answer').notNull(),
  result: text('result').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});