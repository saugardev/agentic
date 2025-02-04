import type { Player as PlayerType } from '@/types';
import { createPlayer, getPlayer } from './queries';
import { validateName } from './validations';
import { getPlayerGamesWithPagination } from '../game/queries';

/**
 * Manages player operations including creation and retrieval
 */
export class Player {
  private playerData: PlayerType;

  constructor(playerData: PlayerType) {
    this.playerData = playerData;
  }

  /**
   * Creates a new player with the given name
   * @param name - The player's name
   * @returns Promise resolving to the created player
   * @throws {Error} If name validation fails
   * @throws {Error} If player creation fails
   */
  static async create(name: string): Promise<Player> {
    validateName(name);
    const playerData = await createPlayer(name);
    return new Player(playerData);
  }

  /**
   * Retrieves a player by their UUID
   * @param id - The player's UUID
   * @returns Promise resolving to the player
   * @throws {Error} If player with given ID doesn't exist
   */
  static async get(id: string): Promise<Player> {
    const playerData = await getPlayer(id);
    if (!playerData) {
      throw new Error(`Player with id ${id} not found`);
    }
    return new Player(playerData);
  }

  public getId() {  
    return this.playerData.id;
  }

  public getName() {
    return this.playerData.name;
  }

  public getGames(limit: number = 10, offset: number = 0) {
    return getPlayerGamesWithPagination(this.getId(), limit, offset);
  }
}