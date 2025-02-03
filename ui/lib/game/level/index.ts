import { db } from '@/lib/db';
import { players, levels, interactions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { Level as LevelType, GameResponse } from '@/types';
import { createLevel, getLevel, getCurrentLevel } from './queries';
import { validateDescription, validateAnswer } from './validations';
import { getPlayer } from '../player/queries';

export class Level {
  /**
   * Creates a new level with the given description
   * Validates the description format before creation
   */
  async create(description: string): Promise<LevelType> {
    validateDescription(description);
    return await createLevel(description);
  }

  /**
   * Retrieves a specific level by its number
   * Throws if level doesn't exist
   */
  async get(number: number): Promise<LevelType> {
    const level = await getLevel(number);
    if (!level) {
      throw new Error(`Level ${number} not found`);
    }
    return level;
  }

  /**
   * Gets the current level for a given player
   * Throws if either player or their current level doesn't exist
   */
  async getCurrent(playerId: number): Promise<LevelType> {
    return await getCurrentLevel(playerId);
  }

  /**
   * Processes a player's answer submission for their current level
   * - Validates player exists and isn't dead
   * - Checks if answer meets level requirements
   * - Records the interaction attempt
   * - Updates player status (dead if failed, completed if passed final level)
   * - Advances player to next level if passed
   * 
   * @returns GameResponse with pass/fail status and reason
   */
  async submitAnswer(playerId: number, answer: string): Promise<GameResponse> {
    const player = await getPlayer(playerId);

    if (!player) {
      throw new Error('Player not found');
    }

    if (player.status === 'dead') {
      return {
        passed: false,
        reason: 'Player is already dead. Cannot continue.'
      };
    }

    const level = await this.get(player.currentLevel);
    const passed = await validateAnswer(level, answer);

    // Record interaction
    await db.insert(interactions).values({
      playerId,
      levelNumber: player.currentLevel,
      playerAnswer: answer,
      result: passed ? 'passed' : 'failed'
    });

    // Update player status
    const newStatus = passed ? 
      (player.currentLevel + 1 >= await this.getMaxLevel() ? 'completed' : 'alive') : 
      'dead';

    await db.update(players)
      .set({ 
        status: newStatus,
        currentLevel: passed ? player.currentLevel + 1 : player.currentLevel 
      })
      .where(eq(players.id, playerId));

    return {
      passed,
      reason: passed ? 'Level completed successfully' : 'Failed level requirements'
    };
  }

  /**
   * Gets the highest level number available in the game
   * Returns 0 if no levels exist
   */
  private async getMaxLevel(): Promise<number> {
    const [result] = await db
      .select({ max: levels.number })
      .from(levels)
      .orderBy(levels.number)
      .limit(1);
    
    return result?.max ?? 0;
  }
}