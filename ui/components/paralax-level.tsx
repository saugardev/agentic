'use client';

import { useRef, useState } from 'react';
import { LevelConfig } from '@/config/levels';

interface ParallaxLevelProps {
  config: LevelConfig;
}

export default function ParallaxLevel({ config }: ParallaxLevelProps) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div 
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden rounded-lg"
        style={{ backgroundColor: config.backgroundColor }}
      >
        {config.assets.map((asset, index) => (
          <div
            key={index}
            className="absolute w-[200%] h-full"
            style={{
              zIndex: asset.zIndex,
              transform: `translateX(${-progress * asset.speed}%)`,
              transition: 'transform 0.3s ease-out',
              backgroundImage: `url(${asset.src})`,
              backgroundSize: 'contain',
              backgroundPosition: 'left center',
              backgroundRepeat: 'repeat-x',
              top: asset.initialPosition.y,
              left: 0,
            }}
          />
        ))}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-50 bg-background">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
