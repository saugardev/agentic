import { db } from '@/lib/db';
import { levels } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { Level as LevelType } from '@/types';
import { games } from '@/lib/db/schema';

/**
 * Creates a new level in the database
 * @param gameId - The game's ID
 * @param description - The level's description text
 * @returns Promise resolving to the created level
 * @throws {Error} If database insert fails
 */
export async function createLevel(gameId: string, description: string): Promise<LevelType> {
  const [lastLevel] = await db
    .select({ number: levels.number })
    .from(levels)
    .orderBy(levels.number)
    .limit(1);

  const number = (lastLevel?.number ?? -1) + 1;

  const [level] = await db
    .insert(levels)
    .values({
      gameId,
      number,
      description,
    })
    .returning();

  return level;
}

/**
 * Retrieves a level by its number
 * @param number - The level number to retrieve
 * @returns Promise resolving to the level if found, undefined otherwise
 */
export async function getLevel(number: number): Promise<LevelType | undefined> {
  const [level] = await db
    .select()
    .from(levels)
    .where(eq(levels.number, number))
    .limit(1);

  return level;
}

export async function getCurrentLevel(gameId: string): Promise<LevelType> {
  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId)
  });

  if (!game) {
    throw new Error('Game not found');
  }

  const level = await getLevel(game.currentLevel);
  
  if (!level) {
    throw new Error(`Level ${game.currentLevel} not found`);
  }

  return level;
}