'use client';

import React, { useRef, useEffect } from 'react';
import anime from 'animejs';

interface Environment3DProps {
  children: React.ReactNode;
  isRoomOpen: boolean;
  selectedRoom?: string;
}

const Environment3D: React.FC<Environment3DProps> = ({ children, isRoomOpen, selectedRoom }) => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sceneRef.current) {
      if (isRoomOpen) {
        // Zoom and tilt when room opens
        anime({
          targets: sceneRef.current,
          rotateX: -10,
          rotateY: 5,
          scale: 1.1,
          duration: 1000,
          easing: 'easeOutCubic'
        });
      } else {
        // Reset to normal view
        anime({
          targets: sceneRef.current,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 800,
          easing: 'easeOutCubic'
        });
      }
    }
  }, [isRoomOpen]);

  return (
    <div className="relative w-full h-full overflow-hidden perspective-1000">
      <div
        ref={sceneRef}
        className="w-full h-full preserve-3d transition-transform duration-1000"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* 3D Floor Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Data Streams */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-20 bg-gradient-to-t from-transparent via-cyan-400 to-transparent animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              transform: `translateZ(${Math.random() * 50}px) rotateX(${Math.random() * 360}deg)`
            }}
          />
        ))}

        {/* Holographic Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              transform: `translateZ(${Math.random() * 100}px)`
            }}
          />
        ))}

        {children}
      </div>
    </div>
  );
};

export default Environment3D;
