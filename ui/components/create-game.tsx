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
      <button type="submit">Create New Game</button>
    </form>
  );
}