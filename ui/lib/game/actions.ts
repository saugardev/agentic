'use server'

import { Game } from "@/lib/game";
import { redirect } from 'next/navigation';

export async function handleCreateGame(playerId: string): Promise<Game> {
  const res: Game = await Game.create(playerId);
  console.log('Game created:', res.getGameId());
  redirect(`/game/${res.getGameId()}`);
}

export async function handleResumeGame(gameId: string) {
  redirect(`/game/${gameId}`);
}

export async function returnHome() {
  redirect("/");
}