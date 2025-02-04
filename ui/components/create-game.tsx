import { handleCreateGame } from '@/lib/game/actions';
import { revalidatePath } from 'next/cache';

interface CreateGameFormProps {
  playerId: string;
}

export default function CreateGameForm({ playerId }: CreateGameFormProps) {
  return (
    <form action={async () => {
      'use server';
      await handleCreateGame(playerId);
      revalidatePath('/');
    }}>
      <button type="submit">Create New Game</button>
    </form>
  );
}