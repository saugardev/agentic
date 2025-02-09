import { CONTRACT_ADDRESS } from "@/config";
import { useReadContract } from "wagmi";

const abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_player",
                type: "address",
            },
        ],
        name: "getPlayerGames",
        outputs: [
            {
                internalType: "uint256[]",
                name: "gameIds",
                type: "uint256[]",
            },
            {
                internalType: "bool[]",
                name: "isActive",
                type: "bool[]",
            },
            {
                internalType: "uint256[]",
                name: "levelsAssigned",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

export function useGames(address: `0x${string}`) {
    return useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "getPlayerGames",
        args: [address],
        query: {
            enabled: !!address,
        },
    });
}
