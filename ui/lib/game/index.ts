import { Player } from '@/lib/player';
import { Level, LEVELS } from '@/lib/level';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { games, levels } from '@/lib/db/schema';
import type { Game as GameType } from '@/types';

/**
 * Main game controller
 * Manages player and level interactions
 */
export class Game {
  private player: Player;
  private levels: Level[];
  private gameData: GameType;

  private constructor(player: Player, levels: Level[], gameData: GameType) {
    this.player = player;
    this.levels = levels;
    this.gameData = gameData;
  }

  static async create(playerId: string, gameId?: string): Promise<Game> {
    const player = await Player.get(playerId);
    const gameData = gameId 
      ? await Game.resumeGame(playerId, gameId)
      : await Game.createGame(playerId);

    const levels = await Game.getLevelsForGame(gameData.id);
    
    if (!gameId && levels.length === 0) {
      const firstLevel = await Level.create(gameData.id, LEVELS[0]);
      levels.push(firstLevel);
    }

    return new Game(player, levels, gameData);
  }

  private static async resumeGame(playerId: string, gameId: string): Promise<GameType> {
    const game = await db.query.games.findFirst({
      where: eq(games.id, gameId)
    });

    if (!game) {
      throw new Error('Game not found');
    }

    if (game.playerId !== playerId) {
      throw new Error('Game does not belong to player');
    }

    return game;
  }

  private static async createGame(playerId: string): Promise<GameType> {
    const newGame = await db.insert(games).values({
      playerId,
      currentLevel: 1,
      status: 'alive' as const,
      startedAt: new Date(),
      endedAt: null
    }).returning();

    return newGame[0];
  }

  private static async getLevelsForGame(gameId: string): Promise<Level[]> {
    const gameLevels = await db.query.levels.findMany({
      where: eq(levels.gameId, gameId),
      orderBy: levels.number
    });
    return gameLevels.map(level => new Level(level));
  }

  public getPlayerId() {
    return this.player.getId();
  }

  public getGameStatus() {
    return this.gameData.status;
  }

  public getCurrentLevel() {
    return this.levels[this.gameData.currentLevel - 1];
  }

  public getCurrentLevelId() {
    return this.gameData.currentLevel;
  }

  public getGameId() {
    return this.gameData.id;
  }
}