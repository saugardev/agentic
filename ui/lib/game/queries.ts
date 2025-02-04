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

export async function getPlayerGamesWithPagination(
  playerId: string,
  limit: number = 10,
  offset: number = 0
): Promise<Game[]> {
  return db.query.games.findMany({
    where: eq(games.playerId, playerId),
    orderBy: games.startedAt,
    limit,
    offset
  });
}
