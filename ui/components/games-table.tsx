import { Game, PlayerStatus } from '@/types';
import { handleResumeGame } from '@/lib/game/actions';
import CreateGameForm from './create-game';
import MenuButton from './menu-button';

export default function GamesTable({ games, playerId }: { games: Game[], playerId: string }) {
  return (
    <div className="overflow-x-auto">
      <div className="mx-10 bg-[#151414] border-4 border-[#594C29]">
        <table className="w-full divide-y divide-gray-200/30">
          <thead>
            <tr>
              <th className="w-1/3 px-6 py-4 text-center text-xl font-medium text-white uppercase tracking-wider">Level</th>
              <th className="w-1/3 px-6 py-4 text-center text-xl font-medium text-white uppercase tracking-wider">Status</th>
              <th className="w-1/3 px-6 py-4 text-center text-xl font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/30">
            {games.map((game) => (
              <tr key={game.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-lg text-white text-center">{game.currentLevel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-center">
                  <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-lg font-medium
                    ${game.status === 'alive' ? 'bg-green-700 text-green-200' : ''}
                    ${game.status === 'dead' ? 'bg-red-700 text-red-200' : ''}
                    ${game.status === 'completed' ? 'bg-blue-700 text-blue-200' : ''}`
                  }>
                    {getGameStatusString(game.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-center">
                  {game.status === 'alive' && (
                    <form action={async () => {
                      'use server'
                      await handleResumeGame(game.id);
                    }}>
                      <MenuButton>
                        <button>Resume</button>
                      </MenuButton>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 px-5 w-full flex justify-end">
        <CreateGameForm playerId={playerId} />
      </div>
    </div>
  );
}

function getGameStatusString(status: PlayerStatus) {
  switch (status) {
    case 'alive': return 'Alive 🤞';
    case 'dead': return 'Dead 💀';
    case 'completed': return 'Winner 🏆';
  }
}