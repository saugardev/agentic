import { Game, PlayerStatus } from '@/types';
import { handleResumeGame } from '@/lib/game/actions';

export default function GamesTable({ games }: { games: Game[] }) {
  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2 text-left">Game ID</th>
          <th className="border p-2 text-left">Level</th>
          <th className="border p-2 text-left">Status</th>
          <th className="border p-2 text-left">Started</th>
          <th className="border p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr key={game.id} className="hover:bg-gray-50">
            <td className="border p-2">{game.id}</td>
            <td className="border p-2">{game.currentLevel}</td>
            <td className="border p-2">{getGameStatusString(game.status)}</td>
            <td className="border p-2">
              {new Date(game.startedAt).toLocaleString()}
            </td>
            <td className="border p-2">
              {game.status === 'alive' && (
                <form action={async () => {
                  'use server'
                  await handleResumeGame(game.id);
                }}>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    Resume
                  </button>
                </form>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function getGameStatusString(status: PlayerStatus) {
  switch (status) {
    case 'alive': return 'Alive 🤞';
    case 'dead': return 'Dead 💀';
    case 'completed': return 'Winner 🏆';
  }
}