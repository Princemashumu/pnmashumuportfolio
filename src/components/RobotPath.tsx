'use client';

import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

interface RobotPathProps {
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  isAnimating: boolean;
  onPathComplete: () => void;
}

const RobotPath: React.FC<RobotPathProps> = ({ 
  startPosition, 
  endPosition, 
  isAnimating, 
  onPathComplete 
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  // Calculate path data for a curved route
  const getPathData = () => {
    const startX = (startPosition.x / 100) * window.innerWidth;
    const startY = (startPosition.y / 100) * window.innerHeight;
    const endX = (endPosition.x / 100) * window.innerWidth;
    const endY = (endPosition.y / 100) * window.innerHeight;

    // Create a curved path with control points
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - 100; // Curve upward

    return `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`;
  };

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [startPosition, endPosition]);

  useEffect(() => {
    if (isAnimating && pathRef.current && pathLength > 0) {
      // Animate path drawing
      anime({
        targets: pathRef.current,
        strokeDashoffset: [pathLength, 0],
        duration: 1500,
        easing: 'easeInOutCubic',
        complete: () => {
          // Fade out the path after a delay
          setTimeout(() => {
            if (pathRef.current) {
              anime({
                targets: pathRef.current,
                opacity: [1, 0],
                duration: 500,
                complete: onPathComplete
              });
            }
          }, 500);
        }
      });
    }
  }, [isAnimating, pathLength, onPathComplete]);

  if (!isAnimating) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ zIndex: 15 }}
    >
      {/* Glow effect */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#ff00ff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ffff00', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <path
        ref={pathRef}
        d={getPathData()}
        stroke="url(#pathGradient)"
        strokeWidth="4"
        fill="none"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength}
        filter="url(#glow)"
        className="animate-pulse"
      />

      {/* Path particles */}
      {[...Array(10)].map((_, i) => (
        <circle
          key={i}
          r="2"
          fill="#00ffff"
          className="animate-ping"
          style={{
            animationDelay: `${i * 100}ms`,
          }}
        >
          <animateMotion
            dur="1.5s"
            begin={`${i * 150}ms`}
            fill="freeze"
          >
            <mpath href={`#path-${startPosition.x}-${startPosition.y}`} />
          </animateMotion>
        </circle>
      ))}
    </svg>
  );
};

export default RobotPath;
