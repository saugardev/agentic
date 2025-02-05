import { Game } from "@/lib/game";
import { Player } from "@/lib/player";
import { notFound, redirect } from "next/navigation";
import { GameResponse } from "@/types";
import { Level, LEVELS } from "@/lib/level";
import { handleSubmitLevel } from "@/lib/level/actions";

interface GamePageProps {
    params: {
        id: string;
    };
}

export default async function GamePage({ params }: GamePageProps) {
    const { id } = await params;

    const player = await Player.create("saugardev");
    const playerId = player.getId();

    let game: Game;
    try {
        game = await Game.create(playerId, id);
    } catch (error) {
        console.error("Error creating game:", error);
        notFound();
    }

    const currentLevel = game.getCurrentLevel();
    const levelData = {
        description: currentLevel.getDescription(),
        id: game.getGameId(),
        status: game.getGameStatus(),
        currentLevelId: game.getCurrentLevelId(),
    };

    const lastInteraction = await currentLevel.getLastInteraction();

    const result = lastInteraction?.result;

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Game #{levelData.id}</h1>
                <p className="text-gray-600">Status: {levelData.status}</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Level {levelData.currentLevelId}</h2>
                    <p className="mt-2">{levelData.description}</p>
                </div>

                {levelData.status === "alive" && (
                    <form
                        action={async (formData: FormData) => {
                            "use server";

                            await handleSubmitLevel(formData);
                        }}
                        className="space-y-4"
                    >
                        <input type="hidden" name="gameId" value={levelData.id} />
                        <textarea name="answer" className="w-full p-2 border rounded-md" rows={4} placeholder="Enter your answer..." required />
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Submit Answer
                        </button>
                    </form>
                )}

                {levelData.status === "dead" && (
                    <div className="mt-4 p-4 bg-red-100 rounded-lg">
                        <h3 className="text-lg font-semibold text-red-700">Game Over</h3>
                        <p className="text-red-600 mt-2">{lastInteraction?.reason}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
