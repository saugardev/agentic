import { Player } from '@/lib/player';
import CreateGame from '@/components/create-game';
import GamesTable from '@/components/games-table';

export default async function Home() {
  const player = await Player.create('saugardev');
  const playerId = player.getId();
  const games = await player.getGames();

  return (
    <div className="p-4">
      <div className="mb-4">{player.getName()}</div>
      <GamesTable games={games} />
      <div className="mt-4">
        <CreateGame playerId={playerId} />
      </div>
    </div>
  );
}