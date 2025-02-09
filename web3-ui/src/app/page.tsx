'use client'

import ParallaxLevel from "@/components/paralax-level";
import { levels } from "@/config/levels";
import GamesTable from "@/components/games-table";

export default function Home() {
  return (
    <div>
      <ParallaxLevel config={levels[0]} />
      <div className="absolute top-1/3 left-0 right-0 -translate-y-1/2 z-20 w-1/2 mx-auto">
        <GamesTable />
      </div>
    </div>
  );
}