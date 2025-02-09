'use client'

import MenuButton from './menu-button';
import { useAccount } from 'wagmi'
import { useGames } from '@/hooks/useGames'
import CreateGameForm from './create-game';

export default function GamesTable() {
  const { address } = useAccount()

  const { data: games, isLoading } = useGames(address as any)

  if (isLoading) return <div>Loading...</div>
  if (!games) return null

  return (
    <div className="overflow-x-auto">
      <div className="mx-10 bg-[#151414] border-4 border-[#594C29]">
        <table className="w-full divide-y divide-gray-200/30">
          <thead>
            <tr>
              <th className="w-1/3 px-6 py-4 text-center text-xl font-medium text-white uppercase tracking-wider">ID</th>
              <th className="w-1/3 px-6 py-4 text-center text-xl font-medium text-white uppercase tracking-wider">Level</th>
              <th className="w-1/3 px-6 py-4 text-center text-xl font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/30">
            {games.map((game) => (
              <tr key={game.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-lg text-white text-center h-24">{Number(game.id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-white text-center h-24">{Number(game.currentLevel)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-center h-24 flex justify-center items-center">
                  <MenuButton>
                    Resume
                  </MenuButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 px-5 w-full flex justify-end">
        <CreateGameForm />
      </div>
    </div>
  );
}
