'use client';

import { useRef, useState } from 'react';
import { LevelConfig } from '@/config/levels';
import LevelOverlay from './level-overlay';

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
        className="relative h-screen w-full overflow-hidden"
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
        <div className="absolute bottom-0 left-0 right-0 z-50 h-44">
          <LevelOverlay />
        </div>
        <div className="absolute bottom-4 left-0 right-0 z-[60] flex justify-center">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-1/2"
          />
        </div>
      </div>
    </div>
  );
}
