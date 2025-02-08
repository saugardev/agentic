import { redirect } from "next/navigation";
import { Game } from "../game";
import { Player } from "../player";
import { revalidatePath } from "next/cache";
import { getUserAddress } from "../auth/actions";
export async function handleSubmitLevel(formData: FormData) {

    const address = await getUserAddress();

    if (!address) {
        redirect("/");
    }

    const gameId = formData.get("gameId") as string;
    const answer = formData.get("answer") as string;
    if (!answer || !gameId) return;

    try {
        const player = await Player.create(address);
        const game = await Game.create(player.getId(), gameId);
        const currentLevel = game.getCurrentLevel();

        await currentLevel.submitAnswer(answer);
        revalidatePath(`/game/${gameId}`);
    } catch (error) {
        console.error("Error submitting answer:", error);
        revalidatePath(`/game/${gameId}`);
    }
}
