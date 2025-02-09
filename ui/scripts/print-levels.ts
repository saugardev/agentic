import { db } from "@/lib/db";
import { levels, interactions } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import type { Level } from "@/types";

async function printLevels(gameId: string) {
    try {
        console.log(`Fetching levels for game ${gameId}...\n`);

        const gameLevels = await db.query.levels.findMany({
            where: eq(levels.gameId, gameId),
            orderBy: levels.number,
        });

        if (gameLevels.length === 0) {
            console.log("No levels found for this game.");
            return;
        }

        console.log(`Found ${gameLevels.length} levels:\n`);

        for (const level of gameLevels) {
            // Get interaction count for this level
            const [interactionCount] = await db.select({ count: count() }).from(interactions).where(eq(interactions.levelId, level.id));

            console.log(`Level ${level.number}:`);
            console.log(`ID: ${level.id}`);
            console.log(`Description: ${level.description}`);
            console.log(`Created At: ${level.createdAt}`);
            console.log(`Completed At: ${level.completedAt || "Not completed"}`);
            if (level.requiredElements?.length) {
                console.log(`Required Elements: ${level.requiredElements.join(", ")}`);
            }
            console.log(`Number of Interactions: ${interactionCount.count}`);
            console.log("----------------------------------------\n");
        }
    } catch (error) {
        console.error("Error fetching levels:", error);
    } finally {
        process.exit(0);
    }
}

// Check if game ID is provided as command line argument
const gameId = process.argv[2];
if (!gameId) {
    console.error("Please provide a game ID as an argument.");
    console.log("Usage: bun run scripts/print-levels.ts <gameId>");
    process.exit(1);
}

// Run the script
printLevels(gameId);
