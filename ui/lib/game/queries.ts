import { db } from '@/lib/db';
import { games } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { Game } from '@/types';

export async function getPlayerGames(playerId: string): Promise<Game[]> {
  return db.query.games.findMany({
    where: eq(games.playerId, playerId),
    orderBy: games.startedAt
  });
} 
