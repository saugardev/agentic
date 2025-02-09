import GameComponent from "@/components/game-component";

interface GamePageProps {
  params: {
    id: string;
  };
}

export default async function GamePage({ 
  params,
}: GamePageProps) {
    const param = await params;

    return (
        <div>
            <GameComponent params={param} />
        </div>
    )
}
