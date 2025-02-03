import { pgTable, serial, text, integer, pgEnum } from 'drizzle-orm/pg-core';

export const playerStatusEnum = pgEnum('player_status', ['alive', 'dead', 'completed']);

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  currentLevel: integer('current_level').notNull().default(0),
  status: playerStatusEnum('status').notNull().default('alive')
});

export const levels = pgTable('levels', {
  number: integer('number').primaryKey(),
  description: text('description').notNull(),
  minimumWordCount: integer('minimum_word_count'),
  requiredElements: text('required_elements').array()
});

export const interactions = pgTable('interactions', {
  id: serial('id').primaryKey(),
  playerId: integer('player_id').references(() => players.id).notNull(),
  levelNumber: integer('level_number').notNull(),
  playerAnswer: text('player_answer').notNull(),
  result: text('result').notNull()
});