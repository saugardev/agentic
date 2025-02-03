import { Game } from "@/lib/game";

export async function handleCreateGame(playerId: string) {
  'use server';
  const game = await Game.create(playerId);
  console.log(game);
}