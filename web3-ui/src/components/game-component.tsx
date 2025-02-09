"use client";

import { useAccount, useWriteContract, usePublicClient } from "wagmi";
import { useGames } from "@/hooks/useGames";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Address } from "viem";
import ParallaxLevel from "@/components/paralax-level";
import { levels } from "@/config/levels";
import { CONTRACT_ADDRESS } from "@/config";
import { parseAbiItem } from "viem";

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
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "games",
        outputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "bool",
                name: "isActive",
                type: "bool",
            },
            {
                internalType: "uint256",
                name: "levelsAssigned",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

export default function GameComponent({ params }: { params: { id: string } }) {
    const router = useRouter();
    const account = useAccount();
    const gameId = Number(params.id);
    const { data: gamesData, isLoading } = useGames(account.address as Address);
    const [description, setDescription] = useState<string>("");
    const { writeContract } = useWriteContract();
    const publicClient = usePublicClient();
    const [showResult, setShowResult] = useState(false);
    const [interactionResult, setInteractionResult] = useState<{ passed: boolean; message: string } | null>(null);
    const [playerWon, setPlayerWon] = useState(false);

    useEffect(() => {
        const fetchDescription = async () => {
            try {
                const response = await fetch(`http://localhost:3001/game/${params.id}/current-level`);
                const data = await response.json();
                setDescription(data);
            } catch (error) {
                console.error("Failed to fetch game description:", error);
            }
        };

        if (gameId) {
            fetchDescription();
        }
    }, [gameId, params.id]);

    useEffect(() => {
        if (!account.address) {
            router.push("/");
            return;
        }

        if (gamesData) {
            const gameExists = gamesData[0].some((id) => Number(id) === gameId);
            if (!gameExists) {
                router.push("/");
            }
        }
    }, [gamesData, gameId, router, account.address]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const answer = (form.elements.namedItem("answer") as HTMLTextAreaElement).value;

        try {
            await writeContract({
                address: CONTRACT_ADDRESS,
                abi: FantasyGameMasterABI,
                functionName: "createInteraction",
                args: [BigInt(gameId), answer],
            });

            if (!publicClient) {
                console.error("Public client is not available");
                return;
            }

            // Start listening for the event
            const unwatch = publicClient.watchEvent({
                address: CONTRACT_ADDRESS,
                event: parseAbiItem("event InteractionUpdated(uint256 indexed gameId, uint256 interactionId, bool levelPassed, string result)"),
                args: {
                    gameId: BigInt(gameId),
                },
                onLogs: async (logs) => {
                    if (logs.length > 0) {
                        const log = logs[0];
                        const result = {
                            passed: log.args.levelPassed || false,
                            message: log.args.result || "",
                        };

                        // Check if the player has won
                        if (result.passed) {
                            const gameData = (await publicClient.readContract({
                                address: CONTRACT_ADDRESS,
                                abi: FantasyGameMasterABI,
                                functionName: "games",
                                args: [BigInt(gameId)],
                            })) as unknown as { owner: Address; isActive: boolean; levelsAssigned: bigint };

                            if (Number(gameData.levelsAssigned) === 10 && !gameData.isActive) {
                                setPlayerWon(true);
                                result.message = "Congratulations! You've completed all levels and won the game! 🎉";
                            }
                        }

                        setInteractionResult(result);
                        setShowResult(true);
                    }
                },
            });

            form.reset();
        } catch (error) {
            console.error("Failed to submit answer:", error);
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

            {showResult && interactionResult && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs">
                    <div className="bg-[#1a1a1a] p-8 border-2 border-[#8B7355] rounded-lg max-w-lg w-[90%] mx-4 shadow-lg">
                        <h2 className={`text-3xl mb-6 font-bold text-center ${interactionResult.passed ? "text-green-400" : "text-red-400"}`}>
                            {playerWon ? "You Won! 🏆" : interactionResult.passed ? "Success! 🎉" : "Try Again 💪"}
                        </h2>
                        <p className="text-lg mb-8 text-gray-200 text-center leading-relaxed">{interactionResult.message}</p>
                        <div className="flex justify-center">
                            <button
                                onClick={async () => {
                                    setShowResult(false);
                                    if (playerWon) {
                                        router.push("/");
                                    } else if (interactionResult.passed) {
                                        try {
                                            const response = await fetch(`http://localhost:3001/game/${params.id}/current-level`);
                                            const data = await response.json();
                                            setDescription(data);
                                        } catch (error) {
                                            console.error("Failed to fetch updated level description:", error);
                                        }
                                    }
                                }}
                                className="w-48 h-14 bg-gradient-to-r from-[#8B7355] to-[#594C29] hover:from-[#9c8465] hover:to-[#6a5c39] rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-50"
                            >
                                <span className="text-white text-xl font-semibold">{playerWon ? "Back to Home" : "Continue"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
