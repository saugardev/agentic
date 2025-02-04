'use server'

import { Game } from "@/lib/game";

export async function handleCreateGame(playerId: string) {
  const res: Game = await Game.create(playerId);
  console.log('Game created:', res.getGameId());
}