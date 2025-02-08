import { Player } from '@/lib/player';
import GamesTable from '@/components/games-table';
import ParallaxLevel from '@/components/paralax-level';
import { levels } from '@/config/levels';

export default async function Home() {
  const player = await Player.create('saugardev');
  const playerId = player.getId();
  const games = await player.getGames();

  return (
    <div>
      <ParallaxLevel config={levels[0]} overlay={false}/>
      <div className="absolute top-1/3 left-0 right-0 -translate-y-1/2 z-20 w-1/2 mx-auto">
        <GamesTable games={games} playerId={playerId} />
      </div>
    </div>
  );
}