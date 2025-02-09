import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";

export default function Navbar() {

  return (
    <nav className="w-full fixed z-50 backdrop-blur-sm">
      <div className="mx-auto h-16 p-5 flex items-center justify-between">
        <Link href="/" className="font-bold text-4xl">
          App
        </Link>
        
        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
