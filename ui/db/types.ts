import { players, levels, interactions } from './schema';

export type Player = typeof players.$inferSelect;
export type Level = typeof levels.$inferSelect;
export type Interaction = typeof interactions.$inferSelect;

export type PlayerStatus = 'alive' | 'dead' | 'completed';

export interface GameResponse {
  passed: boolean;
  reason: string;
}

export interface LevelResponse {
  levelNumber: number;
  description: string;
  status: PlayerStatus;
  message: string;
}