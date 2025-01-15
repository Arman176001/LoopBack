import React from 'react';
import { IconTriangle, IconCircle, IconSquare, IconBarbell, IconMilkshake, IconHexagon,IconX  } from '@tabler/icons-react';
import { JSX } from 'react/jsx-runtime';

const icons = [
  IconTriangle, IconCircle, IconSquare, IconBarbell, IconMilkshake, IconHexagon,IconX 
];

const randomInRange = (min: number, max: number): number => 
  Math.random() * (max - min) + min;

const generateRandomIcons = (count: number): JSX.Element[] => {
  const iconElements: JSX.Element[] = [];
  
  // Divide icons among the four edges
  const iconsPerEdge = Math.floor(count / 4);
  const edges = ['top', 'right', 'bottom', 'left'];
  edges.forEach((edge, edgeIndex) => {
    const edgeCount = edgeIndex === edges.length - 1 
      ? count - (iconsPerEdge * (edges.length - 1)) 
      : iconsPerEdge;

    for (let i = 0; i < edgeCount; i++) {
      const IconComponent = icons[Math.floor(Math.random() * icons.length)];
      const size = randomInRange(15, 45);
      const baseRotation = randomInRange(0, 360);
      const rotationDirection = Math.random() < 0.5 ? -1 : 1;
      const rotation = baseRotation * rotationDirection; // Apply rotation direction
      let left: number, top: number;
      const spacing = 100 / edgeCount;
      const basePosition = i * spacing;
      const jitter = randomInRange(-spacing/4, spacing/4);
      
      switch(edge) {
        case 'top':
          left = basePosition + jitter;
          top = randomInRange(0, 25);
          break;
        case 'right':
          left = randomInRange(85, 100);
          top = basePosition + jitter;
          break;
        case 'bottom':
          left = basePosition + jitter;
          top = randomInRange(70, 100);
          break;
        case 'left':
          left = randomInRange(0, 15);
          top = basePosition + jitter;
          break;
        default:
          left = 0;
          top = 0;
      }

      iconElements.push(
        <div
          key={`${edge}-${i}`}
          style={{
            position: 'absolute',
            left: `${Math.max(0, Math.min(100, left))}%`,
            top: `${Math.max(0, Math.min(100, top))}%`,
            transform: `rotate(${rotation}deg)`,
            animation: `float ${randomInRange(4, 8)}s ease-in-out infinite`,
          }}
        >
          <IconComponent
            stroke={2}
            color="black"
            size={size}
            style={{ opacity: 0.8 }}
          />
        </div>
      );
    }
  });

  return iconElements;
};

const Background: React.FC = () => {
  return (
    <div
      className="absolute -z-10 w-full h-full"
      style={{
        background: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {generateRandomIcons(80)}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) rotate(10deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Background;