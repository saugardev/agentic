import Link from "next/link";
import Auth from "./auth";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-foreground/10 fixed z-50 bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          App
        </Link>
        
        <div className="flex items-center gap-4">
          <Auth />
        </div>
      </div>
    </nav>
  );
}
