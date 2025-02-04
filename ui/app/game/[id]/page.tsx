import { Game } from "@/lib/game";
import { Player } from "@/lib/player";
import { notFound } from "next/navigation";

interface GamePageProps {
  params: {
    id: string;
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const player = await Player.create('saugardev');
  const playerId = player.getId();

  let game;
  try {
    game = await Game.create(playerId, params.id);
  } catch (error) {
    console.error('Error creating game:', error);
    notFound();
  }

  const currentLevel = game.getCurrentLevel();

  console.log(currentLevel);
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Game #{game.getGameId()}</h1>
        <p className="text-gray-600">Status: {game.getGameStatus()}</p>
      </div>

      <div className="bg-gray-100 rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Level {game.getCurrentLevelId()}</h2>
          <p className="mt-2">{currentLevel.getDescription()}</p>
        </div>

        {game.getGameStatus() === 'alive' && (
          <form className="space-y-4">
            <textarea 
              className="w-full p-2 border rounded-md"
              rows={4}
              placeholder="Enter your answer..."
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit Answer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}