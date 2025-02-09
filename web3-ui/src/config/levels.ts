export interface LevelAsset {
  src: string;
  speed: number;  // Speed multiplier (1 is normal, <1 is slower, >1 is faster)
  zIndex: number; // Layer order
  initialPosition: {
    x: number;    // Initial X position in pixels
    y: number;    // Initial Y position in pixels
  };
}

export interface LevelConfig {
  id: string;
  name: string;
  backgroundColor: string;
  assets: LevelAsset[];
}

export const levels: LevelConfig[] = [
  {
    id: 'city-1',
    name: 'City',
    backgroundColor: '#87CEEB',
    assets: [
      {
        src: '/levels/City1/Bright/Sky.png',
        speed: 0.3,
        zIndex: 1,
        initialPosition: { x: 0, y: 0 }
      },
      {
        src: '/levels/City1/Bright/buildings.png',
        speed: 0.1,
        zIndex: 2,
        initialPosition: { x: 0, y: 0 }
      },
      {
        src: '/levels/City1/Bright/wall1.png',
        speed: 0.4,
        zIndex: 4,
        initialPosition: { x: 0, y: 0 }
      },
      {
        src: '/levels/City1/Bright/wall2.png',
        speed: 0.3,
        zIndex: 3,
        initialPosition: { x: 0, y: 0 }
      },
      {
        src: '/levels/City1/Bright/road&border.png',
        speed: 0.4,
        zIndex: 5,
        initialPosition: { x: 0, y: 0 }
      },
      {
        src: '/levels/City1/Bright/boxes&container.png',
        speed: 0.5,
        zIndex: 6,
        initialPosition: { x: 0, y: 0 }
      },
      {
        src: '/levels/City1/Bright/wheels&hydrant.png',
        speed: 0.4,
        zIndex: 7,
        initialPosition: { x: 0, y: 0 }
      }
    ]
  }
  // Add more levels as needed
];
