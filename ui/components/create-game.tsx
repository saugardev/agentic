import { handleCreateGame } from '@/lib/game/actions';
import MenuButton from './menu-button';

interface CreateGameFormProps {
  playerId: string;
}

export default function CreateGameForm({ playerId }: CreateGameFormProps) {
  return (
    <form action={async () => {
      'use server';
      await handleCreateGame(playerId);
    }}>
      <button type="submit">
        <MenuButton>
          New Game
        </MenuButton>
      </button>
    </form>
  );
}