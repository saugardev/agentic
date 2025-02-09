import { db } from "@/lib/db";
import { interactions, levels } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

async function printAllInteractions() {
    try {
        console.log("Fetching all interactions...\n");

        const allInteractions = await db
            .select({
                id: interactions.id,
                levelId: interactions.levelId,
                playerAnswer: interactions.playerAnswer,
                result: interactions.result,
                reason: interactions.reason,
                createdAt: interactions.createdAt,
                gameId: levels.gameId,
            })
            .from(interactions)
            .leftJoin(levels, eq(interactions.levelId, levels.id))
            .orderBy(desc(interactions.createdAt));

        if (allInteractions.length === 0) {
            console.log("No interactions found in the database.");
            return;
        }

        console.log(`Found ${allInteractions.length} interactions:\n`);

        allInteractions.forEach((interaction, index) => {
            console.log(`Interaction ${index + 1}:`);
            console.log(`ID: ${interaction.id}`);
            console.log(`Level ID: ${interaction.levelId}`);
            console.log(`Game ID: ${interaction.gameId}`);
            console.log(`Player Answer: ${interaction.playerAnswer}`);
            console.log(`Result: ${interaction.result}`);
            console.log(`Reason: ${interaction.reason}`);
            console.log(`Created At: ${interaction.createdAt}`);
            console.log("----------------------------------------\n");
        });
    } catch (error) {
        console.error("Error fetching interactions:", error);
    } finally {
        process.exit(0);
    }
}

// Run the script
printAllInteractions();
