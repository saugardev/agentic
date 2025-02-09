"use client";

import ParallaxLevel from "@/components/paralax-level";
import { levels } from "@/config/levels";
import GamesTable from "@/components/games-table";

export default function Home() {
    return (
        <div className="relative h-screen bg-gray-100">
            <ParallaxLevel config={levels[0]} />
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-1/2 mx-auto">
                    <GamesTable />
                </div>
            </div>
        </div>
    );
}
