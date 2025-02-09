import { db } from "@/lib/db";
import { games, players, levels } from "@/lib/db/schema";
import { desc, eq, count } from "drizzle-orm";

async function printAllGames() {
    try {
        console.log("Fetching all games...\n");

        const allGames = await db
            .select({
                id: games.id,
                playerId: games.playerId,
                currentLevel: games.currentLevel,
                status: games.status,
                startedAt: games.startedAt,
                endedAt: games.endedAt,
                playerName: players.name,
            })
            .from(games)
            .leftJoin(players, eq(games.playerId, players.id))
            .orderBy(desc(games.startedAt));

        if (allGames.length === 0) {
            console.log("No games found in the database.");
            return;
        }

        console.log(`Found ${allGames.length} games:\n`);

        for (const game of allGames) {
            // Get the number of levels in this game
            const [levelCount] = await db.select({ count: count() }).from(levels).where(eq(levels.gameId, game.id));

            console.log(`Game ID: ${game.id}`);
            console.log(`Player: ${game.playerName} (${game.playerId})`);
            console.log(`Status: ${game.status}`);
            console.log(`Current Level: ${game.currentLevel} of ${levelCount.count}`);
            console.log(`Started At: ${game.startedAt}`);
            if (game.endedAt) {
                console.log(`Ended At: ${game.endedAt}`);
                const duration = (new Date(game.endedAt).getTime() - new Date(game.startedAt).getTime()) / 1000;
                console.log(`Duration: ${Math.round(duration)} seconds`);
            }
            console.log("----------------------------------------\n");
        }
    } catch (error) {
        console.error("Error fetching games:", error);
    } finally {
        process.exit(0);
    }
}

// Run the script
printAllGames();
