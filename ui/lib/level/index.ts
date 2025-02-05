import { db } from "@/lib/db";
import { levels, interactions, games, players } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Level as LevelType, GameResponse, Interaction } from "@/types";
import { createLevel, getLevel, getCurrentLevel } from "./queries";
import { validateDescription } from "./validations";
import { evaluateAnswer } from "@/lib/agent/agent";

export const LEVELS = [
    "Level 1: You face an ogre on a rope bridge.",
    "Level 2: A dark hallway with hidden traps.",
    "Level 3: A cursed chest whispering promises.",
    "Level 4: A ravenous beast guarding the exit.",
    "Level 5: A riddle about day and night cycles.",
    "Level 6: A raging river you must cross.",
    "Level 7: A room of statues that come alive if you move.",
    "Level 8: A door with a secret mechanism.",
    "Level 9: A magical labyrinth that shifts walls.",
    "Level 10: The final boss who rules the dungeon.",
];

export class Level {
    private levelData: LevelType;

    constructor(levelData: LevelType) {
        this.levelData = levelData;
    }

    /**
     * Creates a new level with the given description
     * Validates the description format before creation
     */
    static async create(gameId: string, description: string): Promise<Level> {
        validateDescription(description);
        const levelData = await createLevel(gameId, description);
        return new Level(levelData);
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
     * Gets the current level for a given game
     * Throws if either player or their current level doesn't exist
     */
    async getCurrent(gameId: string): Promise<LevelType> {
        return await getCurrentLevel(gameId);
    }

    /**
     * Gets the description for the current level
     */
    getDescription(): string {
        return this.levelData.description;
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
    async submitAnswer(answer: string): Promise<GameResponse> {
        const game = await db.query.games.findFirst({
            where: eq(games.id, this.levelData.gameId),
        });

        if (!game) {
            throw new Error("Game not found");
        }

        if (game.status === "dead") {
            return {
                passed: false,
                reason: "Player is already dead. Cannot continue.",
            };
        }

        const level = await this.get(game.currentLevel);
        const evaluation = await evaluateAnswer(game.currentLevel, level.description, answer);

        // Record interaction
        await db.insert(interactions).values({
            levelId: level.id,
            playerAnswer: answer,
            result: evaluation.passed ? "passed" : "failed",
            reason: evaluation.reason,
        });

        // Update game status
        const newStatus = evaluation.passed ? (game.currentLevel + 1 >= (await this.getMaxLevel()) ? "completed" : "alive") : "dead";

        await db
            .update(games)
            .set({
                status: newStatus,
                currentLevel: evaluation.passed ? game.currentLevel + 1 : game.currentLevel,
                endedAt: newStatus !== "alive" ? new Date() : undefined,
            })
            .where(eq(games.id, this.levelData.gameId));

        if (evaluation.passed) {
            // Create next level if available
            const nextLevelNumber = game.currentLevel + 1;
            if (nextLevelNumber <= LEVELS.length) {
                await Level.create(this.levelData.gameId, LEVELS[nextLevelNumber - 1]);
            }
        }
        return evaluation;
    }

    /**
     * Gets the highest level number available in the game
     * Returns the total number of predefined levels
     */
    private async getMaxLevel(): Promise<number> {
        return LEVELS.length;
    }

    /**
     * Gets all interactions for this level
     * Returns array of interactions ordered by creation date
     */
    public async getInteractions(): Promise<Interaction[]> {
        const levelInteractions = await db.query.interactions.findMany({
            where: eq(interactions.levelId, this.levelData.id),
            orderBy: interactions.createdAt,
        });
        return levelInteractions;
    }

    /**
     * Gets the most recent interaction for this level
     * Returns undefined if no interactions exist
     */
    public async getLastInteraction(): Promise<Interaction | undefined> {
        const [lastInteraction] = await db.query.interactions.findMany({
            where: eq(interactions.levelId, this.levelData.id),
            orderBy: interactions.createdAt,
            limit: 1,
        });
        return lastInteraction;
    }
}
