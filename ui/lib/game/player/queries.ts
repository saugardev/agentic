import { db } from '@/lib/db';
import { players } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { Player } from '@/types';

/**
 * Creates a new player in the database
 * @param name - The player's name
 * @returns Promise resolving to the created player
 * @throws {Error} If database insert fails
 */
export async function createPlayer(name: string): Promise<Player> {
  const [player] = await db.insert(players)
    .values({ name, currentLevel: 0, status: 'alive' })
    .returning();
  
  if (!player) {
    throw new Error('Failed to create player');
  }
  return player;
}

/**
 * Retrieves a player by their ID
 * @param id - The player's ID
 * @returns Promise resolving to the player
 * @throws {Error} If player not found
 */
export async function getPlayer(id: number): Promise<Player> {
  const player = await db.query.players.findFirst({
    where: eq(players.id, id)
  });

  if (!player) {
    throw new Error('Player not found');
  }

  return player;
}
