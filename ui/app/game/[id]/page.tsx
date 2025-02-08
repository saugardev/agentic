import { Game } from "@/lib/game";
import { Player } from "@/lib/player";
import { notFound, redirect } from "next/navigation";
import { handleSubmitLevel } from "@/lib/level/actions";
import { getUserAddress } from "@/lib/auth/actions";
import ParallaxLevel from "@/components/paralax-level";
import { levels } from "@/config/levels";
import MenuButton from "@/components/menu-button";
import { returnHome } from "@/lib/game/actions";
interface GamePageProps {
    params: {
        id: string;
    };
}

export default async function GamePage({ params }: GamePageProps) {
    const { id } = await params;
    
    const address = await getUserAddress();

    if (!address) {
      redirect("/");
    }

    const player = await Player.create(address);
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

    return (
      <div>
        <ParallaxLevel config={levels[0]} />
        
        {levelData.status === "alive" && (
          <div className="absolute top-1/3 left-0 right-0 z-20">
            <div className="w-1/2 mx-auto bg-[#151414] p-4 text-white border-4 border-[#594C29]">
              <p className="text-2xl mb-4">{levelData.description}</p>
              <form
                action={async (formData: FormData) => {
                  "use server";
                  await handleSubmitLevel(formData);
                }}
                className="space-y-4"
              >
                <input type="hidden" name="gameId" value={levelData.id} />
                <textarea 
                  name="answer" 
                  className="w-full p-2 bg-[#151414] border-2 border-[#594C29] text-white text-lg focus:outline-none focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] transition-colors resize-none" 
                  rows={4} 
                  placeholder="What do you do?" 
                    required 
                />
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="w-64 h-12 bg-contain bg-center bg-no-repeat hover:scale-105 transition-transform cursor-pointer flex items-center justify-center"
                    style={{ backgroundImage: "url('/menus/main/button-background.png')" }}
                  >
                    <span className="text-white text-2xl font-bold">Submit</span>
                  </button>
                </div>
              </form>
          </div>
        </div>
      )}

      {levelData.status === "dead" && (
          <div className="absolute top-1/3 left-0 right-0 -translate-y-1/2 z-20">
            <div className="w-1/2 mx-auto bg-[#151414] p-4 text-white border-4 border-[#594C29]">
              <h3 className="text-2xl font-bold text-center mb-4">Game Over</h3>
              <p className="text-lg text-center">{lastInteraction?.reason}</p>
              <form className="flex justify-center" action={async () => {
                "use server";
                await returnHome();
              }}>
                <button>
                  <MenuButton>
                    <span>Return Home</span>
                  </MenuButton>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
}
