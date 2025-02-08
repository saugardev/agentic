import { Player } from '@/lib/player';
import GamesTable from '@/components/games-table';
import ParallaxLevel from '@/components/paralax-level';
import { levels } from '@/config/levels';
import { getUserAddress } from '@/lib/auth/actions';

export default async function Home() {
  const address = await getUserAddress();
  
  if (!address) {
    return (
      <div>
        <ParallaxLevel config={levels[0]} overlay={false}/>
        <div className="overflow-x-auto w-full z-50">
          <div className="absolute top-1/3 left-0 right-0 -translate-y-1/2 z-20 w-1/2 mx-auto bg-[#151414] p-4 text-white border-4 border-[#594C29] mx-10">
            <h1 className="text-center text-2xl">Please login to continue</h1>
          </div>
        </div>
      </div>
    );
  }

  const player = await Player.create(address);
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