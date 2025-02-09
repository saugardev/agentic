import { useWriteContract } from 'wagmi';
import MenuButton from './menu-button';

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

export default function CreateGameForm() {
  const { writeContract } = useWriteContract();

  const handleCreateGame = () => {
    writeContract({
      address: '0x36BF36ccA843bEC4FA0cB0411F92bEe74a9350FC',
      abi: FantasyGameMasterABI,
      functionName: 'createGame',
    });
  };

  return (
    <div onClick={handleCreateGame}>
      <MenuButton>
        New Game
      </MenuButton>
    </div>
  );
}