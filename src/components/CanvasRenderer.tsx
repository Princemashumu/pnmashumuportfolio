'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas2DRenderer } from '@/utils/canvas2d';
import { WebGL2Renderer } from '@/utils/webgl2';

interface CanvasRendererProps {
  roomType: number;
  isActive: boolean;
  className?: string;
  use3D?: boolean;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  roomType,
  isActive,
  className = '',
  use3D = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Canvas2DRenderer | WebGL2Renderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Initialize renderer based on use3D flag
      if (use3D) {
        rendererRef.current = new WebGL2Renderer(canvas);
      } else {
        rendererRef.current = new Canvas2DRenderer(canvas);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to initialize renderer:', error);
      // Fallback to Canvas 2D if WebGL2 fails
      if (use3D) {
        try {
          rendererRef.current = new Canvas2DRenderer(canvas);
          setIsLoaded(true);
        } catch (fallbackError) {
          console.error('Failed to initialize fallback renderer:', fallbackError);
        }
      }
    }

    return () => {
      if (rendererRef.current) {
        rendererRef.current.destroy();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [use3D]);

  useEffect(() => {
    if (!isLoaded || !rendererRef.current) return;

    let startTime = Date.now();
    const animate = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      const renderer = rendererRef.current;

      if (!renderer) return;

      if (renderer instanceof WebGL2Renderer) {
        // WebGL2 rendering
        renderer.clear();
        renderer.renderServerRoom(roomType, isActive ? 1.0 : 0.3, currentTime);
      } else if (renderer instanceof Canvas2DRenderer) {
        // Canvas 2D rendering
        renderer.clear();
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        // Draw background circuit board
        renderer.drawCircuitBoard(0, 0, width, height, 0.2);

        // Draw server racks based on room type
        switch (roomType) {
          case 0: // Server Room
            for (let i = 0; i < 4; i++) {
              renderer.drawServerRack(
                20 + i * 120,
                50,
                100,
                height - 100,
                isActive
              );
            }
            break;

          case 1: // Database Room
            renderer.drawServerRack(width / 2 - 75, 30, 150, height - 60, isActive);
            // Draw data flow lines
            const dbPoints = [
              { x: width / 4, y: height / 2 },
              { x: width / 2, y: height / 2 },
              { x: 3 * width / 4, y: height / 2 }
            ];
            renderer.drawDataFlow(dbPoints, (currentTime % 3) / 3, '#3b82f6');
            break;

          case 2: // Code Laboratory
            // Multiple smaller server units
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 2; j++) {
                renderer.drawServerRack(
                  20 + i * 150,
                  30 + j * 200,
                  120,
                  150,
                  isActive
                );
              }
            }
            break;

          case 3: // Project Warehouse
            // Storage-like layout
            renderer.drawServerRack(50, 50, width - 100, 80, isActive);
            renderer.drawServerRack(50, 150, width - 100, 80, isActive);
            renderer.drawServerRack(50, 250, width - 100, 80, isActive);
            break;

          case 4: // Communication Hub
            // Central hub design
            const centerX = width / 2;
            const centerY = height / 2;
            renderer.drawServerRack(centerX - 60, centerY - 100, 120, 200, isActive);
            
            // Surrounding communication nodes
            for (let i = 0; i < 6; i++) {
              const angle = (i / 6) * Math.PI * 2;
              const x = centerX + Math.cos(angle) * 150 - 30;
              const y = centerY + Math.sin(angle) * 100 - 40;
              renderer.drawServerRack(x, y, 60, 80, isActive);
              
              // Draw connection lines
              if (isActive) {
                const connectionPoints = [
                  { x: centerX, y: centerY },
                  { x: x + 30, y: y + 40 }
                ];
                renderer.drawDataFlow(
                  connectionPoints,
                  (currentTime * 2 + i) % 1,
                  '#10b981'
                );
              }
            }
            break;

          case 5: // System Status
            // Monitoring dashboard layout
            renderer.drawServerRack(20, 20, width - 40, 60, isActive);
            for (let i = 0; i < 3; i++) {
              renderer.drawServerRack(
                20 + i * ((width - 80) / 3),
                100,
                (width - 80) / 3 - 10,
                height - 140,
                isActive
              );
            }
            break;
        }

        // Add particle effects if active
        if (isActive) {
          // This would typically maintain a particle system
          // For simplicity, we'll skip the full implementation here
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoaded, roomType, isActive]);

  const handleResize = () => {
    if (rendererRef.current) {
      rendererRef.current.resize();
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{
        background: 'transparent',
        filter: isActive ? 'brightness(1.1) saturate(1.2)' : 'brightness(0.7) saturate(0.8)'
      }}
    />
  );
};

export default CanvasRenderer;
