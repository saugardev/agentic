'use client';

import { useRef, useState, useEffect } from 'react';
import { LevelConfig } from '@/config/levels';
import LevelOverlay from './level-overlay';

interface ParallaxLevelProps {
  config: LevelConfig;
  overlay: boolean;
}

export default function ParallaxLevel({ config, overlay }: ParallaxLevelProps) {
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
        {overlay && (
          <div className="absolute bottom-0 left-0 right-0 z-10 h-44">
            <LevelOverlay />
          </div>
        )}
      </div>
    </div>
  );
}
