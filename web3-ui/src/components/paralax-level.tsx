'use client';

import { useRef, useState, useEffect } from 'react';
import { LevelConfig } from '@/config/levels';

interface ParallaxLevelProps {
  config: LevelConfig;
}

export default function ParallaxLevel({ config }: ParallaxLevelProps) {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 3) setDirection(-1);
        if (prev <= 0) setDirection(1);
        return prev + direction * 0.1;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [direction]);

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
      </div>
    </div>
  );
}
