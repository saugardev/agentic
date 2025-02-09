'use client';

import { useAccount, useWriteContract } from "wagmi";
import { useGames } from "@/hooks/useGames";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Address } from "viem";
import ParallaxLevel from "@/components/paralax-level";
import { levels } from "@/config/levels";
import { CONTRACT_ADDRESS } from "@/config";

const FantasyGameMasterABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gameId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_action",
        type: "string",
      },
    ],
    name: "createInteraction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export default function GameComponent({params}: {params: {id: string}}) {
  const router = useRouter();
  const account = useAccount();
  const gameId = Number(params.id);
  const { data: gamesData, isLoading } = useGames(account.address as Address);
  const [description, setDescription] = useState<string>("");
  const { writeContract } = useWriteContract();

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await fetch(`http://localhost:3001/game/${params.id}/current-level`);
        const data = await response.json();
        setDescription(data);
      } catch (error) {
        console.error('Failed to fetch game description:', error);
      }
    };

    if (gameId) {
      fetchDescription();
    }
  }, [gameId, params.id]);

  useEffect(() => {
    if (!account.address) {
      router.push('/');
      return;
    }

    if (gamesData) {
      const gameExists = gamesData[0].some(id => Number(id) === gameId);
      if (!gameExists) {
        router.push('/');
      }
    }
  }, [gamesData, gameId, router, account.address]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const answer = (form.elements.namedItem('answer') as HTMLTextAreaElement).value;

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: FantasyGameMasterABI,
        functionName: 'createInteraction',
        args: [BigInt(gameId), answer],
      });
      form.reset();
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!gamesData) return null;

  return (
    <div>
      <ParallaxLevel config={levels[0]} />
      <div className="absolute top-1/3 left-0 right-0 z-20">
        <div className="w-1/2 mx-auto bg-[#151414] p-4 text-white border-4 border-[#594C29]">
          <p className="text-2xl mb-4">Game {gameId}</p>
          <p className="text-lg mb-4">Description: {description}</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <textarea 
              name="answer" 
              className="w-full p-2 bg-[#151414] border-2 border-[#594C29] text-white text-lg focus:outline-none focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] transition-colors resize-none" 
              rows={4} 
              placeholder="What do you do?" 
              required 
            />
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="w-64 h-12 bg-contain bg-center bg-no-repeat hover:scale-105 transition-transform cursor-pointer flex items-center justify-center"
                style={{ backgroundImage: "url('/button-background.png')" }}
              >
                <span className="text-white text-2xl font-bold">Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}