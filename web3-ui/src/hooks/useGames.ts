import { useReadContract } from 'wagmi'

const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getPlayerGames",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currentLevel",
            "type": "uint256"
          },
          {
            "internalType": "enum GameStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct Game[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export function useGames(address: `0x${string}`) {
  return useReadContract({
    address: '0x36BF36ccA843bEC4FA0cB0411F92bEe74a9350FC',
    abi,
    functionName: 'getPlayerGames',
    args: [address],
    query: {
      enabled: !!address
    }
  })
} 