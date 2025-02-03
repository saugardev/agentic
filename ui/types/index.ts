import { players, levels, interactions, games } from '@/lib/db/schema';

export type Player = typeof players.$inferSelect;
export type Level = typeof levels.$inferSelect;
export type Interaction = typeof interactions.$inferSelect;
export type Game = typeof games.$inferSelect; 

export type PlayerStatus = 'alive' | 'dead' | 'completed';

export interface GameResponse {
  passed: boolean;
  reason: string;
}
