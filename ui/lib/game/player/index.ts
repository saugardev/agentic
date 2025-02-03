import type { Player as PlayerType } from '@/types';
import { createPlayer, getPlayer } from './queries';
import { validateName } from './validations';

/**
 * Manages player operations including creation and retrieval
 */
export class Player {
  /**
   * Creates a new player with the given name
   * @param name - The player's name
   * @returns Promise resolving to the created player
   * @throws {Error} If name validation fails
   * @throws {Error} If player creation fails
   */
  async create(name: string): Promise<PlayerType> {
    validateName(name);
    return await createPlayer(name);
  }

  /**
   * Retrieves a player by their UUID
   * @param id - The player's UUID
   * @returns Promise resolving to the player
   * @throws {Error} If player with given ID doesn't exist
   */
  async get(id: string): Promise<PlayerType> {
    const player = await getPlayer(id);
    if (!player) {
      throw new Error(`Player with id ${id} not found`);
    }
    return player;
  }
}