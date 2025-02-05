import { handleCreateGame } from '@/lib/game/actions';

interface CreateGameFormProps {
  playerId: string;
}

export default function CreateGameForm({ playerId }: CreateGameFormProps) {
  return (
    <form action={async () => {
      'use server';
      await handleCreateGame(playerId);
    }}>
      <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
        Create New Game
      </button>
    </form>
  );
}