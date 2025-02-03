import { Player } from '@/lib/player';
import CreateGame from '@/components/create-game';

export default async function Home() {
  const player = await Player.create('saugardev');
  const playerId = player.getId();

  return (
    <div>
      {player.getName()}
      <CreateGame playerId={playerId} />
    </div>
  );
}