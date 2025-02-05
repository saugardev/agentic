import { Game } from "../game";
import { Player } from "../player";
import { revalidatePath } from "next/cache";

export async function handleSubmitLevel(formData: FormData) {
    const gameId = formData.get("gameId") as string;
    const answer = formData.get("answer") as string;
    if (!answer || !gameId) return;

    try {
        const player = await Player.create("saugardev");
        const game = await Game.create(player.getId(), gameId);
        const currentLevel = game.getCurrentLevel();

        await currentLevel.submitAnswer(gameId, answer);
        revalidatePath(`/game/${gameId}`);
    } catch (error) {
        console.error("Error submitting answer:", error);
        revalidatePath(`/game/${gameId}`);
    }
}
