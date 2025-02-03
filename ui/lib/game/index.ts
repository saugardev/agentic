import { Player } from './player';
import { Level } from './level';
import type { GameResponse, Player as PlayerType, Level as LevelType } from '@/types';

/**
 * Main game controller
 * Manages player and level interactions
 */
export class Game {
  private static instance: Game;
  private player: Player;
  private level: Level;

  /**
   * Private constructor to enforce singleton pattern
   * Initializes player and level managers
   */
  private constructor() {
    this.player = new Player();
    this.level = new Level();
  }

  /**
   * Gets the singleton instance of the Game class
   * @returns The singleton Game instance
   */
  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  /**
   * Creates a new player
   * @param name - The player's name
   * @returns Promise resolving to the created player
   * @throws {Error} If name validation fails
   * @throws {Error} If player creation fails
   */
  async createPlayer(name: string): Promise<PlayerType> {
    return await this.player.create(name);
  }

  /**
   * Retrieves a player by their ID
   * @param id - The player's ID
   * @returns Promise resolving to the player
   * @throws {Error} If player not found
   */
  async getPlayer(id: number): Promise<PlayerType> {
    return await this.player.get(id);
  }

  /**
   * Gets the current level for a player
   * @param playerId - The player's ID
   * @returns Promise resolving to the player's current level
   * @throws {Error} If player not found
   * @throws {Error} If level not found
   */
  async getCurrentLevel(playerId: number): Promise<LevelType> {
    return await this.level.getCurrent(playerId);
  }

  /**
   * Submits a player's answer for their current level
   * @param playerId - The player's ID
   * @param answer - The player's submitted answer
   * @returns Promise resolving to game response with pass/fail status
   * @throws {Error} If player not found
   * @throws {Error} If answer validation fails
   */
  async submitAnswer(playerId: number, answer: string): Promise<GameResponse> {
    return await this.level.submitAnswer(playerId, answer);
  }
}