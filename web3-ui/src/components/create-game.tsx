"use client";

import { useWriteContract } from "wagmi";
import MenuButton from "./menu-button";
import { CONTRACT_ADDRESS } from "@/config";
import { useEffect } from "react";

const FantasyGameMasterABI = [
    {
        inputs: [],
        name: "createGame",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

export default function CreateGameForm({ onSuccess }: { onSuccess?: () => void }) {
    const { writeContract, isPending, isSuccess, reset } = useWriteContract();

    const handleCreateGame = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: FantasyGameMasterABI,
            functionName: "createGame",
        });
    };

    useEffect(() => {
        if (isSuccess && onSuccess) {
            onSuccess();
            reset();
        }
    }, [isSuccess, onSuccess, reset]);

    return (
        <div style={{ overflow: "hidden" }}>
            <div onClick={!isPending ? handleCreateGame : undefined} className={isPending ? "opacity-50 cursor-not-allowed" : ""}>
                <MenuButton>{isPending ? "Creating..." : "New Game"}</MenuButton>
            </div>
        </div>
    );
}
