"use client";

import MenuButton from "./menu-button";
import { useAccount } from "wagmi";
import { useGames } from "@/hooks/useGames";
import CreateGameForm from "./create-game";
import { useState, useEffect } from "react";
import { Address } from "viem";

export default function GamesTable() {
    const account = useAccount();
    const { data: gamesData, isLoading, refetch } = useGames(account.address as Address);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

    // Add a refetch after game creation
    useEffect(() => {
        if (gamesData) {
            const timer = setTimeout(() => {
                refetch();
            }, 5000); // Refetch after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [gamesData, refetch]);

    if (isLoading) return <div>Loading...</div>;
    if (!gamesData) return null;

    // Transform the gamesData into an array of game objects
    const games = gamesData[0].map((id, index) => ({
        id: Number(id),
        currentLevel: Number(gamesData[2][index]), // Assuming levelsAssigned is at index 2
    }));

    // Calculate the current records to display
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = games.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(games.length / recordsPerPage);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col overflow-x-auto mx-10 bg-[#151414] border-4 border-[#594C29] p-4">
                <div className="h-[400px] overflow-y-auto">
                    <table className="w-full divide-y divide-gray-200/30">
                        <thead>
                            <tr>
                                <th className="w-1/3 px-6 py-4 text-center text-xl font-medium text-white uppercase tracking-wider">ID</th>
                                <th className="w-1/3 px-6 py-4 text-center text-xl font-medium text-white uppercase tracking-wider">Level</th>
                                <th className="w-1/3 px-6 py-4 text-center text-xl font-medium text-white uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/30">
                            {currentRecords.length > 0 ? (
                                currentRecords.map((game) => (
                                    <tr key={game.id} className="hover:bg-white/5 transition-colors h-16">
                                        <td className="px-2 py-2 whitespace-nowrap text-lg text-white text-center">{Number(game.id)}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-lg text-white text-center">{Number(game.currentLevel)}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-lg text-center">
                                            <div className="flex items-center justify-center">
                                                <MenuButton>Resume</MenuButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="h-[400px]">
                                    <td colSpan={3} className="px-6 py-4 text-lg text-white text-center">
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between mt-4 items-center">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || games.length === 0}
                        className="w-32 h-16 bg-contain bg-center bg-no-repeat hover:scale-105 transition-transform cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{ backgroundImage: "url('/button-background.png')" }}
                    >
                        <span className="text-white text-md font-bold">Previous</span>
                    </button>
                    <span className="text-white text-md">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || games.length === 0}
                        className="w-32 h-16 bg-contain bg-center bg-no-repeat hover:scale-105 transition-transform cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{ backgroundImage: "url('/button-background.png')" }}
                    >
                        <span className="text-white text-md font-bold">Next</span>
                    </button>
                </div>
                <div className="flex justify-end mt-4 gap-4">
                    <button
                        onClick={() => refetch()}
                        className="w-32 h-16 bg-contain bg-center bg-no-repeat hover:scale-105 transition-transform cursor-pointer flex items-center justify-center"
                        style={{ backgroundImage: "url('/button-background.png')" }}
                    >
                        <span className="text-white text-md font-bold">Refresh</span>
                    </button>
                    <CreateGameForm onSuccess={refetch} />
                </div>
            </div>
        </div>
    );
}
