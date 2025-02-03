import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  currentLevel: integer('current_level').notNull().default(0),
  status: text('status').notNull().default('alive')
});

export const interactions = pgTable('interactions', {
  id: serial('id').primaryKey(),
  playerId: integer('player_id').references(() => players.id).notNull(),
  levelNumber: integer('level_number').notNull(),
  playerAnswer: text('player_answer'),
  result: text('result')
});