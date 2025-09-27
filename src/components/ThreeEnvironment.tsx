'use client';

import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Html, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { BlenderGameWorld, BlenderRPGCharacter, BlenderEnvironmentProps, BlenderParticleEffect } from './blender/BlenderRPGComponents';
import { preloadBlenderModels } from './blender/BlenderModelLoader';

// 4D Hypercube (Tesseract) Component
const HypercubePalace: React.FC<{ position: [number, number, number], scale?: number }> = ({ 
  position, 
  scale = 1 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);
  
  // Define the 16 vertices of a tesseract in 4D space
  const tesseractVertices = useMemo(() => [
    // Inner cube vertices (w = -1)
    [-1, -1, -1, -1], [1, -1, -1, -1], [1, 1, -1, -1], [-1, 1, -1, -1],
    [-1, -1, 1, -1], [1, -1, 1, -1], [1, 1, 1, -1], [-1, 1, 1, -1],
    // Outer cube vertices (w = 1)
    [-1, -1, -1, 1], [1, -1, -1, 1], [1, 1, -1, 1], [-1, 1, -1, 1],
    [-1, -1, 1, 1], [1, -1, 1, 1], [1, 1, 1, 1], [-1, 1, 1, 1],
  ], []);

  // Project 4D vertices to 3D space with rotation
  const project4DTo3D = (vertex4D: number[], w4D: number) => {
    const [x, y, z, w] = vertex4D;
    // Apply 4D rotation in XW and YZ planes
    const rotatedW = w * Math.cos(w4D) - x * Math.sin(w4D);
    const rotatedX = w * Math.sin(w4D) + x * Math.cos(w4D);
    const rotatedY = y * Math.cos(time * 0.3) - z * Math.sin(time * 0.3);
    const rotatedZ = y * Math.sin(time * 0.3) + z * Math.cos(time * 0.3);
    
    // Perspective projection from 4D to 3D
    const distance = 4; // Distance from 4D viewpoint
    const scale3D = distance / (distance - rotatedW);
    
    return [
      rotatedX * scale3D * scale,
      rotatedY * scale3D * scale,
      rotatedZ * scale3D * scale
    ];
  };

  const projectedVertices = useMemo(() => 
    tesseractVertices.map(vertex => project4DTo3D(vertex, time * 0.5)),
    [tesseractVertices, time, scale]
  );

  // Define the 32 edges of a tesseract
  const tesseractEdges = useMemo(() => [
    // Inner cube edges
    [0, 1], [1, 2], [2, 3], [3, 0], // bottom face
    [4, 5], [5, 6], [6, 7], [7, 4], // top face  
    [0, 4], [1, 5], [2, 6], [3, 7], // vertical edges
    // Outer cube edges
    [8, 9], [9, 10], [10, 11], [11, 8], // bottom face
    [12, 13], [13, 14], [14, 15], [15, 12], // top face
    [8, 12], [9, 13], [10, 14], [11, 15], // vertical edges
    // Connecting inner to outer cube
    [0, 8], [1, 9], [2, 10], [3, 11],
    [4, 12], [5, 13], [6, 14], [7, 15]
  ], []);

  useFrame((state, delta) => {
    setTime(prev => prev + delta);
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Render tesseract edges */}
      {tesseractEdges.map(([startIdx, endIdx], index) => {
        const startPos = projectedVertices[startIdx];
        const endPos = projectedVertices[endIdx];
        
        return (
          <line key={`edge-${index}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([...startPos, ...endPos]), 3]}
                count={2}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color={`hsl(${(index * 11 + time * 50) % 360}, 70%, 60%)`}
              transparent
              opacity={0.8}
            />
          </line>
        );
      })}
      
      {/* Render tesseract vertices */}
      {projectedVertices.map((vertex, i) => (
        <Sphere key={`vertex-${i}`} args={[0.1]} position={vertex as [number, number, number]}>
          <meshStandardMaterial 
            color={`hsl(${i * 23}, 80%, 70%)`}
            emissive={`hsl(${i * 23}, 60%, 30%)`}
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}
      
      {/* Central hypercube core */}
      <Box args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#4ECDC4" 
          transparent 
          opacity={0.3}
          emissive="#4ECDC4"
          emissiveIntensity={0.2}
        />
      </Box>
    </group>
  );
};

// 4D Temporal Trees Component  
const Tree4D: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const treeRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);
  
  useFrame((state, delta) => {
    setTime(prev => prev + delta * 0.5);
    if (treeRef.current) {
      // Temporal evolution - tree phases through seasons
      const season = (Math.sin(time * 0.3) + 1) * 0.5;
      treeRef.current.scale.setScalar(0.8 + season * 0.4);
    }
  });

  const leafColors = useMemo(() => {
    const colors = [];
    const seasons = ['#4A5D2A', '#7CB342', '#FFA726', '#D32F2F']; // Spring, Summer, Fall, Winter
    for (let i = 0; i < 100; i++) {
      const seasonIndex = Math.floor((Math.sin(time + i * 0.1) + 1) * 2) % 4;
      colors.push(seasons[seasonIndex]);
    }
    return colors;
  }, [time]);

  return (
    <group ref={treeRef} position={position}>
      {/* Tree trunk */}
      <Cylinder args={[0.3, 0.5, 3]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#8D6E63" />
      </Cylinder>
      
      {/* Tree canopy with temporal leaves */}
      <Sphere args={[2]} position={[0, 4, 0]}>
        <meshStandardMaterial color="#4CAF50" transparent opacity={0.6} />
      </Sphere>
      
      {/* 4D temporal leaves */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 1.5 + Math.sin(time + i) * 0.5;
        const height = 3 + Math.cos(time * 0.5 + i) * 1;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <Box key={i} args={[0.1, 0.1, 0.02]} position={[x, height, z]}>
            <meshStandardMaterial 
              color={leafColors[i % leafColors.length]}
              transparent 
              opacity={0.8}
            />
          </Box>
        );
      })}
    </group>
  );
};

// 4D Knight Characters Component
const Knight4D: React.FC<{ position: [number, number, number], id: number }> = ({ position, id }) => {
  const knightRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(Math.random() * Math.PI * 2);
  
  const colors = useMemo(() => ({
    armor: `hsl(${id * 60}, 70%, 50%)`,
    energy: `hsl(${id * 60 + 30}, 80%, 60%)`,
    weapon: `hsl(${id * 60 + 180}, 90%, 70%)`
  }), [id]);

  useFrame((state, delta) => {
    setTime(prev => prev + delta);
    if (knightRef.current) {
      // 4D morphing animation
      const morph = Math.sin(time) * 0.5 + 0.5;
      knightRef.current.rotation.y = time * 0.3;
      knightRef.current.position.y = position[1] + Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <group ref={knightRef} position={position}>
      {/* Knight body */}
      <Box args={[0.6, 1.2, 0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={colors.armor}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
      
      {/* Knight head */}
      <Sphere args={[0.3]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={colors.armor} />
      </Sphere>
      
      {/* 4D Energy aura */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 1 + Math.sin(time * 3 + i) * 0.3;
        const px = Math.cos(angle + time) * radius;
        const py = Math.sin(time * 2 + i * 0.5) * 0.5;
        const pz = Math.sin(angle + time) * radius;
        
        return (
          <Sphere 
            key={`particle-${i}`}
            args={[0.05]}
            position={[px, py, pz]}
          >
            <meshStandardMaterial 
              color={colors.energy}
              emissive={colors.energy}
              emissiveIntensity={1.0}
              transparent
              opacity={0.8}
            />
          </Sphere>
        );
      })}
      
      {/* Knight weapon */}
      <Box args={[0.1, 2, 0.1]} position={[0.5, 0.5, 0]}>
        <meshStandardMaterial 
          color={colors.weapon}
          emissive={colors.weapon}
          emissiveIntensity={0.3}
        />
      </Box>
    </group>
  );
};

// Village Environment Component
const VillageEnvironment: React.FC<{ rooms: any[] }> = ({ rooms }) => {
  // Define the tech-themed house names
  const houseNames = [
    'Main Server Core',
    'Code Laboratory',
    'Database Room',
    'Project Warehouse',
    'Communication Hub',
    'System Status'
  ];
  
  // Water animation state
  const fountainRef = useRef<THREE.Group>(null);
  const [fountainTime, setFountainTime] = useState(0);
  useFrame((_, delta) => {
    setFountainTime(t => t + delta);
  });

  return (
    <group>
      {/* Ground plane with grass texture */}
      <Box args={[50, 0.2, 50]} position={[0, -0.1, 0]}>
        <meshStandardMaterial 
          color="#2E7D32" 
          roughness={0.8}
          metalness={0.1}
        />
      </Box>
      
      {/* Village houses with realistic architecture */}
      {rooms.slice(0, 5).map((room, index) => {
        const angle = (index / 5) * Math.PI * 2;
        const radius = 15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Different house styles based on index
        const houseStyles = [
          { width: 4, height: 5, depth: 4.5, roofHeight: 1.5, roofColor: "#8B4513" }, // Brown roof
          { width: 3.5, height: 4.5, depth: 3.5, roofHeight: 1.2, roofColor: "#DC143C" }, // Red roof
          { width: 4.5, height: 6, depth: 4, roofHeight: 1.8, roofColor: "#2F4F4F" }, // Dark slate roof
          { width: 3.8, height: 4.8, depth: 3.8, roofHeight: 1.4, roofColor: "#8B4513" }, // Brown roof
          { width: 4.2, height: 5.5, depth: 4.2, roofHeight: 1.6, roofColor: "#556B2F" }, // Olive roof
        ];
        
        const style = houseStyles[index % houseStyles.length];
        
        return (
          <group key={room.id} position={[x, style.height / 2, z]}>
            {/* Main house structure */}
            <Box args={[style.width, style.height, style.depth]}>
              <meshStandardMaterial 
                color={room.color} 
                roughness={0.7}
                metalness={0.1}
              />
            </Box>
            
            {/* Triangular roof using geometry */}
            <mesh position={[0, style.height / 2 + style.roofHeight / 2, 0]}>
              <coneGeometry args={[style.width * 0.8, style.roofHeight, 4]} />
              <meshStandardMaterial 
                color={style.roofColor}
                roughness={0.9}
                metalness={0.0}
              />
            </mesh>
            
            {/* Front door */}
            <Box 
              args={[0.8, 2, 0.1]} 
              position={[0, -style.height / 2 + 1, style.depth / 2 + 0.05]}
            >
              <meshStandardMaterial 
                color="#654321" 
                roughness={0.8}
                metalness={0.2}
              />
            </Box>
            
            {/* Door handle */}
            <Sphere 
              args={[0.05]} 
              position={[0.3, -style.height / 2 + 1, style.depth / 2 + 0.15]}
            >
              <meshStandardMaterial 
                color="#FFD700" 
                metalness={0.9}
                roughness={0.1}
              />
            </Sphere>
            
            {/* Windows */}
            {/* Front windows */}
            <Box 
              args={[0.8, 0.8, 0.05]} 
              position={[-1.2, -style.height / 2 + 2.5, style.depth / 2 + 0.02]}
            >
              <meshStandardMaterial 
                color="#87CEEB" 
                transparent
                opacity={0.7}
                metalness={0.1}
                roughness={0.1}
              />
            </Box>
            <Box 
              args={[0.8, 0.8, 0.05]} 
              position={[1.2, -style.height / 2 + 2.5, style.depth / 2 + 0.02]}
            >
              <meshStandardMaterial 
                color="#87CEEB" 
                transparent
                opacity={0.7}
                metalness={0.1}
                roughness={0.1}
              />
            </Box>
            
            {/* Window frames */}
            <Box 
              args={[0.9, 0.9, 0.08]} 
              position={[-1.2, -style.height / 2 + 2.5, style.depth / 2 + 0.01]}
            >
              <meshStandardMaterial color="#FFFFFF" />
            </Box>
            <Box 
              args={[0.9, 0.9, 0.08]} 
              position={[1.2, -style.height / 2 + 2.5, style.depth / 2 + 0.01]}
            >
              <meshStandardMaterial color="#FFFFFF" />
            </Box>
            
            {/* Side windows */}
            <Box 
              args={[0.05, 0.6, 0.6]} 
              position={[style.width / 2 + 0.02, -style.height / 2 + 2, 0]}
            >
              <meshStandardMaterial 
                color="#87CEEB" 
                transparent
                opacity={0.7}
              />
            </Box>
            
            {/* Chimney */}
            <Box 
              args={[0.4, 1.5, 0.4]} 
              position={[style.width / 3, style.height / 2 + style.roofHeight + 0.5, -style.depth / 4]}
            >
              <meshStandardMaterial 
                color="#8B4513" 
                roughness={0.9}
              />
            </Box>
            
            {/* Foundation/Base */}
            <Box 
              args={[style.width + 0.2, 0.3, style.depth + 0.2]} 
              position={[0, -style.height / 2 - 0.15, 0]}
            >
              <meshStandardMaterial 
                color="#696969" 
                roughness={0.9}
                metalness={0.0}
              />
            </Box>
            
            {/* Porch steps */}
            <Box 
              args={[1.5, 0.2, 0.8]} 
              position={[0, -style.height / 2 - 0.4, style.depth / 2 + 0.4]}
            >
              <meshStandardMaterial color="#A0A0A0" />
            </Box>
            <Box 
              args={[1.8, 0.15, 1.0]} 
              position={[0, -style.height / 2 - 0.55, style.depth / 2 + 0.5]}
            >
              <meshStandardMaterial color="#909090" />
            </Box>
            
            {/* Garden/Yard elements */}
            {/* Small fence around house */}
            {Array.from({ length: 8 }).map((_, fenceIndex) => {
              const fenceAngle = (fenceIndex / 8) * Math.PI * 2;
              const fenceRadius = style.width * 0.8;
              const fx = Math.cos(fenceAngle) * fenceRadius;
              const fz = Math.sin(fenceAngle) * fenceRadius;
              
              return (
                <Box 
                  key={`fence-${fenceIndex}`}
                  args={[0.1, 1, 0.1]} 
                  position={[fx, -style.height / 2 + 0.5, fz]}
                >
                  <meshStandardMaterial color="#8B4513" />
                </Box>
              );
            })}
            
            {/* Small garden flowers */}
            {Array.from({ length: 3 }).map((_, flowerIndex) => {
              const flowerAngle = (flowerIndex / 3) * Math.PI * 2 + Math.PI / 6;
              const flowerRadius = style.width * 0.6;
              const fx = Math.cos(flowerAngle) * flowerRadius;
              const fz = Math.sin(flowerAngle) * flowerRadius;
              
              return (
                <group key={`flower-${flowerIndex}`}>
                  <Cylinder 
                    args={[0.02, 0.02, 0.3]} 
                    position={[fx, -style.height / 2 + 0.15, fz]}
                  >
                    <meshStandardMaterial color="#228B22" />
                  </Cylinder>
                  <Sphere 
                    args={[0.08]} 
                    position={[fx, -style.height / 2 + 0.35, fz]}
                  >
                    <meshStandardMaterial 
                      color={['#FF69B4', '#FFD700', '#FF6347'][flowerIndex % 3]}
                      emissive={['#FF69B4', '#FFD700', '#FF6347'][flowerIndex % 3]}
                      emissiveIntensity={0.2}
                    />
                  </Sphere>
                </group>
              );
            })}
            
            {/* Roof details - tiles/shingles */}
            {Array.from({ length: 12 }).map((_, tileIndex) => {
              const tileAngle = (tileIndex / 12) * Math.PI * 2;
              const tileRadius = style.width * 0.7;
              const tx = Math.cos(tileAngle) * tileRadius;
              const tz = Math.sin(tileAngle) * tileRadius;
              
              return (
                <Box 
                  key={`tile-${tileIndex}`}
                  args={[0.2, 0.05, 0.3]} 
                  position={[tx, style.height / 2 + style.roofHeight * 0.3, tz]}
                >
                  <meshStandardMaterial 
                    color={style.roofColor}
                    roughness={0.9}
                  />
                </Box>
              );
            })}
            
            {/* Gutters */}
            <Cylinder 
              args={[0.03, 0.03, style.width * 1.5]} 
              position={[0, style.height / 2 - 0.1, style.depth / 2 + 0.1]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <meshStandardMaterial color="#708090" metalness={0.8} />
            </Cylinder>
            
            {/* Shutters for windows */}
            <Box 
              args={[0.3, 0.8, 0.03]} 
              position={[-1.6, -style.height / 2 + 2.5, style.depth / 2 + 0.01]}
            >
              <meshStandardMaterial color="#2F4F4F" />
            </Box>
            <Box 
              args={[0.3, 0.8, 0.03]} 
              position={[-0.8, -style.height / 2 + 2.5, style.depth / 2 + 0.01]}
            >
              <meshStandardMaterial color="#2F4F4F" />
            </Box>
            <Box 
              args={[0.3, 0.8, 0.03]} 
              position={[0.8, -style.height / 2 + 2.5, style.depth / 2 + 0.01]}
            >
              <meshStandardMaterial color="#2F4F4F" />
            </Box>
            <Box 
              args={[0.3, 0.8, 0.03]} 
              position={[1.6, -style.height / 2 + 2.5, style.depth / 2 + 0.01]}
            >
              <meshStandardMaterial color="#2F4F4F" />
            </Box>
            
            {/* Porch pillars */}
            <Cylinder 
              args={[0.08, 0.08, 2]} 
              position={[-0.6, -style.height / 2 + 0.6, style.depth / 2 + 0.6]}
            >
              <meshStandardMaterial color="#FFFFFF" />
            </Cylinder>
            <Cylinder 
              args={[0.08, 0.08, 2]} 
              position={[0.6, -style.height / 2 + 0.6, style.depth / 2 + 0.6]}
            >
              <meshStandardMaterial color="#FFFFFF" />
            </Cylinder>
            
            {/* Porch roof */}
            <Box 
              args={[2, 0.1, 1.2]} 
              position={[0, -style.height / 2 + 1.8, style.depth / 2 + 0.6]}
            >
              <meshStandardMaterial color="#8B4513" />
            </Box>
            
            {/* Wall texturing - bricks/siding */}
            {Array.from({ length: 15 }).map((_, brickIndex) => {
              const row = Math.floor(brickIndex / 5);
              const col = brickIndex % 5;
              const bx = (col - 2) * 0.7;
              const by = -style.height / 2 + 1 + row * 0.3;
              
              return (
                <Box 
                  key={`brick-${brickIndex}`}
                  args={[0.6, 0.25, 0.02]} 
                  position={[bx, by, -style.depth / 2 - 0.01]}
                >
                  <meshStandardMaterial 
                    color={room.color}
                    roughness={0.9}
                  />
                </Box>
              );
            })}
            
            {/* Mailbox */}
            <group position={[style.width / 2 + 1, -style.height / 2 + 0.8, style.depth / 2 + 2]}>
              <Cylinder args={[0.05, 0.05, 1.2]} position={[0, 0.6, 0]}>
                <meshStandardMaterial color="#8B4513" />
              </Cylinder>
              <Box args={[0.3, 0.2, 0.6]} position={[0, 1.3, 0]}>
                <meshStandardMaterial color="#FF0000" />
              </Box>
              <Box args={[0.02, 0.05, 0.1]} position={[0.15, 1.35, 0.3]}>
                <meshStandardMaterial color="#FFD700" />
              </Box>
            </group>
            
            {/* Street lamp near house */}
            <group position={[-style.width / 2 - 1.5, -style.height / 2 + 1.5, style.depth / 2 + 1.5]}>
              <Cylinder args={[0.05, 0.05, 3]} position={[0, 1.5, 0]}>
                <meshStandardMaterial color="#2F4F4F" />
              </Cylinder>
              <Sphere args={[0.15]} position={[0, 3.2, 0]}>
                <meshStandardMaterial 
                  color="#FFFACD" 
                  emissive="#FFFACD"
                  emissiveIntensity={0.3}
                />
              </Sphere>
            </group>
            
            {/* Garden path stones */}
            {Array.from({ length: 8 }).map((_, stoneIndex) => {
              const pathProgress = stoneIndex / 7;
              const px = 0;
              const pz = style.depth / 2 + 0.8 + pathProgress * 2;
              
              return (
                <Cylinder 
                  key={`stone-${stoneIndex}`}
                  args={[0.2, 0.2, 0.05]} 
                  position={[px + (Math.random() - 0.5) * 0.3, -style.height / 2 - 0.05, pz]}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <meshStandardMaterial color="#A9A9A9" />
                </Cylinder>
              );
            })}
            
            {/* Weather vane on roof */}
            <group position={[0, style.height / 2 + style.roofHeight + 0.3, 0]}>
              <Cylinder args={[0.02, 0.02, 0.5]} position={[0, 0.25, 0]}>
                <meshStandardMaterial color="#FFD700" metalness={0.9} />
              </Cylinder>
              <Box args={[0.4, 0.1, 0.02]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color="#FFD700" metalness={0.9} />
              </Box>
              <Box args={[0.15, 0.15, 0.02]} position={[0.2, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
                <meshStandardMaterial color="#FFD700" metalness={0.9} />
              </Box>
            </group>
            
            {/* House number sign */}
            <Box 
              args={[0.3, 0.2, 0.05]} 
              position={[-0.5, -style.height / 2 + 1.8, style.depth / 2 + 0.06]}
            >
              <meshStandardMaterial color="#FFFFFF" />
            </Box>
            <Box 
              args={[0.25, 0.15, 0.06]} 
              position={[-0.5, -style.height / 2 + 1.8, style.depth / 2 + 0.07]}
            >
              <meshStandardMaterial color="#000000" />
            </Box>
            
            {/* House name label above door */}
            <Box 
              args={[2, 0.4, 0.08]} 
              position={[0, -style.height / 2 + 2.8, style.depth / 2 + 0.06]}
            >
              <meshStandardMaterial color="#F5F5DC" />
            </Box>
            <Box 
              args={[1.8, 0.3, 0.09]} 
              position={[0, -style.height / 2 + 2.8, style.depth / 2 + 0.07]}
            >
              <meshStandardMaterial color="#8B4513" />
            </Box>
            
            {/* House name text on front wall */}
            <Html 
              position={[0, -style.height / 2 + 2.8, style.depth / 2 + 0.1]} 
              center 
              transform 
              occlude
              style={{ pointerEvents: 'none' }}
            >
              <div className="text-white font-bold text-sm bg-transparent select-none">
                {houseNames[index] || room.name}
              </div>
            </Html>
          </group>
        );
      })}
      
      {/* 4D Trees around the village */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const radius = 25;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <Tree4D key={`tree-${i}`} position={[x, 0, z]} />
        );
      })}
      
      {/* Village roads/pathways */}
      {Array.from({ length: 5 }).map((_, roadIndex) => {
        const angle = (roadIndex / 5) * Math.PI * 2;
        const roadLength = 12;
        const roadWidth = 1.5;
        
        return (
          <Box 
            key={`road-${roadIndex}`}
            args={[roadWidth, 0.05, roadLength]} 
            position={[
              Math.cos(angle) * (roadLength / 2 + 3),
              -0.02,
              Math.sin(angle) * (roadLength / 2 + 3)
            ]}
            rotation={[0, angle, 0]}
          >
            <meshStandardMaterial 
              color="#696969" 
              roughness={0.9}
            />
          </Box>
        );
      })}
      
      {/* Stone pathways connecting market stalls */}
      {Array.from({ length: 3 }).map((_, pathIndex) => {
        const stallAngle = (pathIndex / 3) * Math.PI * 2 + Math.PI / 3;
        const stallRadius = 8;
        const sx = Math.cos(stallAngle) * stallRadius;
        const sz = Math.sin(stallAngle) * stallRadius;
        
        // Path from center to stall
        const pathLength = Math.sqrt(sx * sx + sz * sz);
        const pathAngle = Math.atan2(sz, sx);
        
        return (
          <Box 
            key={`stall-path-${pathIndex}`}
            args={[pathLength - 2, 0.03, 0.8]} 
            position={[sx / 2, -0.01, sz / 2]}
            rotation={[0, pathAngle, 0]}
          >
            <meshStandardMaterial 
              color="#8C7853" 
              roughness={0.8}
            />
          </Box>
        );
      })}
      
      {/* Pathway to sign post */}
      <Box 
        args={[8, 0.03, 1]} 
        position={[3, -0.01, 4]}
        rotation={[0, Math.PI / 6, 0]}
      >
        <meshStandardMaterial 
          color="#8C7853" 
          roughness={0.8}
        />
      </Box>
      
      {/* Central plaza paving around fountain */}
      <Cylinder 
        args={[4.5, 4.5, 0.04]} 
        position={[0, -0.005, 0]}
      >
        <meshStandardMaterial 
          color="#B8B8B8" 
          roughness={0.7}
        />
      </Cylinder>
      
      {/* Decorative stone circles in plaza */}
      {Array.from({ length: 8 }).map((_, circleIndex) => {
        const circleAngle = (circleIndex / 8) * Math.PI * 2;
        const circleRadius = 3.5;
        const cx = Math.cos(circleAngle) * circleRadius;
        const cz = Math.sin(circleAngle) * circleRadius;
        
        return (
          <Cylinder 
            key={`plaza-circle-${circleIndex}`}
            args={[0.3, 0.3, 0.02]} 
            position={[cx, 0.01, cz]}
          >
            <meshStandardMaterial 
              color="#A0A0A0" 
              roughness={0.8}
            />
          </Cylinder>
        );
      })}
      
      {/* Village fountain in center with visually prominent water */}
      <group ref={fountainRef} position={[0, 1, 0]}>
        <Cylinder args={[2, 2, 0.5]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color="#B0C4DE" />
        </Cylinder>
        <Cylinder args={[1.5, 1.5, 1]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#F5F5DC" />
        </Cylinder>
        <Cylinder args={[0.5, 0.5, 2]} position={[0, 2.5, 0]}>
          <meshStandardMaterial color="#F5F5DC" />
        </Cylinder>
        {/* Visually prominent water surface - animated wavy disc */}
        <mesh position={[0, 1.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.35, 1.35, 0.12, 64]} />
          <meshStandardMaterial 
            color="#00BFFF" 
            transparent 
            opacity={0.85}
            metalness={0.95}
            roughness={0.05}
            emissive="#00BFFF"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Animated wavy effect using spheres on the water surface */}
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const radius = 1.2 + Math.sin(fountainTime * 2 + i) * 0.08;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = 1.62 + Math.sin(fountainTime * 2 + i * 0.5) * 0.04;
          return (
            <Sphere key={`surface-wave-${i}`} args={[0.07]} position={[x, y, z]}>
              <meshStandardMaterial 
                color="#00BFFF" 
                transparent 
                opacity={0.7}
                emissive="#00BFFF"
                emissiveIntensity={0.2}
              />
            </Sphere>
          );
        })}
        {/* Water droplets - animated */}
        {Array.from({ length: 10 }).map((_, dropIndex) => {
          const dropAngle = (dropIndex / 10) * Math.PI * 2;
          const dropRadius = 0.3 + Math.sin(dropIndex) * 0.2;
          const dx = Math.cos(dropAngle) * dropRadius;
          const dz = Math.sin(dropAngle) * dropRadius;
          // Animate height and oscillation
          const dy = 3.5 + Math.sin(dropIndex * 2 + fountainTime * 2) * 0.5;
          return (
            <Sphere 
              key={`drop-${dropIndex}`}
              args={[0.02]} 
              position={[dx, dy, dz]}
            >
              <meshStandardMaterial 
                color="#87CEEB" 
                transparent 
                opacity={0.8}
              />
            </Sphere>
          );
        })}
        {/* Enhanced water splash effects - animated */}
        {Array.from({ length: 30 }).map((_, splashIndex) => {
          const splashAngle = (splashIndex / 30) * Math.PI * 2;
          const splashRadius = 0.8 + Math.sin(splashIndex * 0.5) * 0.4;
          const sx = Math.cos(splashAngle) * splashRadius;
          const sz = Math.sin(splashAngle) * splashRadius;
          // Animate splash height and spread
          const splashHeight = 3.2 + Math.cos(splashIndex * 0.8 + fountainTime * 1.5) * 0.8;
          const splashSize = 0.015 + Math.abs(Math.sin(splashIndex + fountainTime * 2)) * 0.01;
          return (
            <Sphere 
              key={`splash-${splashIndex}`}
              args={[splashSize]} 
              position={[sx, splashHeight, sz]}
            >
              <meshStandardMaterial 
                color="#B0E0E6" 
                transparent 
                opacity={0.6}
                emissive="#B0E0E6"
                emissiveIntensity={0.2}
              />
            </Sphere>
          );
        })}
        {/* Water streams from fountain spout - animated */}
        {Array.from({ length: 8 }).map((_, streamIndex) => {
          const streamAngle = (streamIndex / 8) * Math.PI * 2;
          const streamRadius = 0.1 + streamIndex * 0.02;
          const streamX = Math.cos(streamAngle) * streamRadius;
          const streamZ = Math.sin(streamAngle) * streamRadius;
          return (
            <group key={`stream-${streamIndex}`}> 
              {Array.from({ length: 15 }).map((_, particleIndex) => {
                // Animate stream arc and oscillation
                const particleHeight = 3.5 - particleIndex * 0.2 + Math.sin(fountainTime * 2 + streamIndex) * 0.05;
                const particleRadius = streamRadius + particleIndex * 0.03;
                const px = Math.cos(streamAngle) * particleRadius;
                const pz = Math.sin(streamAngle) * particleRadius;
                return (
                  <Sphere 
                    key={`particle-${particleIndex}`}
                    args={[0.008]} 
                    position={[px, particleHeight, pz]}
                  >
                    <meshStandardMaterial 
                      color="#87CEEB" 
                      transparent 
                      opacity={0.7 - particleIndex * 0.03}
                    />
                  </Sphere>
                );
              })}
            </group>
          );
        })}
        {/* Ripple effects in the water basin - animated */}
        {Array.from({ length: 5 }).map((_, rippleIndex) => {
          // Animate ripple scale and fade
          const rippleRadius = 0.5 + rippleIndex * 0.3 + Math.sin(fountainTime * 1.2 + rippleIndex) * 0.05;
          return (
            <Torus 
              key={`ripple-${rippleIndex}`}
              args={[rippleRadius, 0.01, 8, 16]} 
              position={[0, 1.52, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial 
                color="#87CEEB" 
                transparent 
                opacity={0.3 - rippleIndex * 0.05}
                emissive="#87CEEB"
                emissiveIntensity={0.1}
              />
            </Torus>
          );
        })}
      </group>
      
      {/* Village benches around fountain */}
      {Array.from({ length: 4 }).map((_, benchIndex) => {
        const benchAngle = (benchIndex / 4) * Math.PI * 2 + Math.PI / 8;
        const bx = Math.cos(benchAngle) * 4;
        const bz = Math.sin(benchAngle) * 4;
        
        return (
          <group key={`bench-${benchIndex}`} position={[bx, 0.3, bz]} rotation={[0, benchAngle + Math.PI / 2, 0]}>
            <Box args={[1.5, 0.1, 0.4]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#8B4513" />
            </Box>
            <Box args={[1.5, 0.6, 0.1]} position={[0, 0.35, -0.15]}>
              <meshStandardMaterial color="#8B4513" />
            </Box>
            <Cylinder args={[0.05, 0.05, 0.6]} position={[-0.6, -0.3, 0]}>
              <meshStandardMaterial color="#654321" />
            </Cylinder>
            <Cylinder args={[0.05, 0.05, 0.6]} position={[0.6, -0.3, 0]}>
              <meshStandardMaterial color="#654321" />
            </Cylinder>
          </group>
        );
      })}
      
      {/* Village market stalls */}
      {Array.from({ length: 3 }).map((_, stallIndex) => {
        const stallAngle = (stallIndex / 3) * Math.PI * 2 + Math.PI / 3;
        const stallRadius = 8;
        const sx = Math.cos(stallAngle) * stallRadius;
        const sz = Math.sin(stallAngle) * stallRadius;
        
        return (
          <group key={`stall-${stallIndex}`} position={[sx, 0, sz]}>
            {/* Stall structure */}
            <Box args={[2, 0.1, 1.5]} position={[0, 0.05, 0]}>
              <meshStandardMaterial color="#8B4513" />
            </Box>
            {/* Canopy */}
            <Box args={[2.5, 0.05, 2]} position={[0, 1.6, 0]}>
              <meshStandardMaterial color="#DC143C" />
            </Box>
            {/* Support poles */}
            <Cylinder args={[0.05, 0.05, 1.6]} position={[-0.9, 0.8, -0.6]}>
              <meshStandardMaterial color="#654321" />
            </Cylinder>
            <Cylinder args={[0.05, 0.05, 1.6]} position={[0.9, 0.8, -0.6]}>
              <meshStandardMaterial color="#654321" />
            </Cylinder>
            <Cylinder args={[0.05, 0.05, 1.6]} position={[-0.9, 0.8, 0.6]}>
              <meshStandardMaterial color="#654321" />
            </Cylinder>
            <Cylinder args={[0.05, 0.05, 1.6]} position={[0.9, 0.8, 0.6]}>
              <meshStandardMaterial color="#654321" />
            </Cylinder>
            {/* Market goods */}
            <Box args={[0.3, 0.2, 0.3]} position={[-0.4, 0.15, 0.2]}>
              <meshStandardMaterial color="#FFA500" />
            </Box>
            <Box args={[0.25, 0.15, 0.25]} position={[0.3, 0.13, -0.3]}>
              <meshStandardMaterial color="#FF6347" />
            </Box>
            <Sphere args={[0.1]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color="#32CD32" />
            </Sphere>
            
            {/* Laptop on table */}
            <group position={[0.2, 0.15, 0.1]}>
              {/* Laptop base */}
              <Box args={[0.4, 0.02, 0.3]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#2F2F2F" metalness={0.8} roughness={0.2} />
              </Box>
              {/* Laptop screen */}
              <Box args={[0.4, 0.25, 0.02]} position={[0, 0.125, -0.14]} rotation={[-0.2, 0, 0]}>
                <meshStandardMaterial color="#000000" />
              </Box>
              {/* Screen display */}
              <Box args={[0.35, 0.2, 0.001]} position={[0, 0.125, -0.13]} rotation={[-0.2, 0, 0]}>
                <meshStandardMaterial 
                  color="#0066CC" 
                  emissive="#0066CC"
                  emissiveIntensity={0.3}
                />
              </Box>
              {/* Keyboard */}
              <Box args={[0.35, 0.01, 0.25]} position={[0, 0.01, 0.02]}>
                <meshStandardMaterial color="#1A1A1A" />
              </Box>
              {/* Trackpad */}
              <Box args={[0.1, 0.005, 0.08]} position={[0, 0.015, 0.08]}>
                <meshStandardMaterial color="#333333" />
              </Box>
            </group>
            

          </group>
        );
      })}
      
      {/* Scattered rocks and natural elements */}
      {Array.from({ length: 20 }).map((_, rockIndex) => {
        const rockAngle = Math.random() * Math.PI * 2;
        const rockRadius = 12 + Math.random() * 20;
        const rx = Math.cos(rockAngle) * rockRadius;
        const rz = Math.sin(rockAngle) * rockRadius;
        const rockSize = 0.1 + Math.random() * 0.3;
        
        return (
          <Box 
            key={`rock-${rockIndex}`}
            args={[rockSize, rockSize * 0.8, rockSize]} 
            position={[rx, rockSize * 0.4, rz]}
            rotation={[
              Math.random() * 0.5,
              Math.random() * Math.PI * 2,
              Math.random() * 0.5
            ]}
          >
            <meshStandardMaterial 
              color="#708090" 
              roughness={0.9}
            />
          </Box>
        );
      })}
      
      {/* Village sign post with directional arrows */}
      <group position={[6, 0, 8]}>
        <Cylinder args={[0.1, 0.1, 3]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#8B4513" />
        </Cylinder>
        
        {/* Main village sign */}
        <Box args={[2, 0.4, 0.1]} position={[0, 2.2, 0]}>
          <meshStandardMaterial color="#F5F5DC" />
        </Box>
        <Box args={[1.8, 0.3, 0.12]} position={[0, 2.2, 0.01]}>
          <meshStandardMaterial color="#8B4513" />
        </Box>
        

        
        {/* Directional signs for each house */}
        {rooms.slice(0, 5).map((room, index) => {
          const angle = (index / 5) * Math.PI * 2;
          const signHeight = 1.6 - index * 0.25;
          
          // Calculate direction from sign post to house
          const houseRadius = 15;
          const houseX = Math.cos(angle) * houseRadius;
          const houseZ = Math.sin(angle) * houseRadius;
          const signX = 6; // sign post x position
          const signZ = 8; // sign post z position
          
          // Direction vector from sign to house
          const dirX = houseX - signX;
          const dirZ = houseZ - signZ;
          const dirAngle = Math.atan2(dirZ, dirX);
          
          return (
            <group key={`sign-${room.id}`} position={[0, signHeight, 0]} rotation={[0, dirAngle, 0]}>
              {/* Arrow sign board */}
              <Box args={[1.5, 0.2, 0.05]} position={[0.75, 0, 0]}>
                <meshStandardMaterial color="#F5F5DC" />
              </Box>
              {/* Arrow text background */}
              <Box args={[1.4, 0.15, 0.06]} position={[0.75, 0, 0.01]}>
                <meshStandardMaterial color={room.color} />
              </Box>
              
              {/* Arrow head pointing towards house */}
              <Box args={[0.15, 0.08, 0.03]} position={[1.4, 0.04, 0.03]} rotation={[0, 0, -Math.PI / 4]}>
                <meshStandardMaterial color="#000000" />
              </Box>
              <Box args={[0.15, 0.08, 0.03]} position={[1.4, -0.04, 0.03]} rotation={[0, 0, Math.PI / 4]}>
                <meshStandardMaterial color="#000000" />
              </Box>
              
              {/* Distance marker */}
              <Box args={[0.3, 0.1, 0.04]} position={[0.2, 0, 0.02]}>
                <meshStandardMaterial color="#FFD700" />
              </Box>
              <Box args={[0.25, 0.08, 0.05]} position={[0.2, 0, 0.03]}>
                <meshStandardMaterial color="#000080" />
              </Box>
              
              {/* House name text directly on sign board */}
              <Html 
                position={[0.75, 0, 0.07]} 
                center 
                transform 
                occlude
                style={{ pointerEvents: 'none' }}
              >
                <div className="text-white font-bold text-xs bg-transparent select-none">
                  {houseNames[index] || room.name}
                </div>
              </Html>
            </group>
          );
        })}
        
        {/* Central fountain indicator */}
        <group position={[0, 0.8, 0]}>
          <Box args={[1.2, 0.15, 0.05]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#87CEEB" />
          </Box>
          <Box args={[1.1, 0.12, 0.06]} position={[0, 0, 0.01]}>
            <meshStandardMaterial color="#000080" />
          </Box>
          
          {/* Down arrow pointing to fountain */}
          <Box args={[0.1, 0.05, 0.03]} position={[0, -0.08, 0.03]} rotation={[0, 0, Math.PI / 4]}>
            <meshStandardMaterial color="#FFD700" />
          </Box>
          <Box args={[0.1, 0.05, 0.03]} position={[0, -0.08, 0.03]} rotation={[0, 0, -Math.PI / 4]}>
            <meshStandardMaterial color="#FFD700" />
          </Box>
          

        </group>
      </group>
      
      {/* 4D Knights patrolling */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <Knight4D key={`knight-${i}`} position={[x, 2, z]} id={i} />
        );
      })}
    </group>
  );
};

// Main ThreeEnvironment Component Types
interface ThreeEnvironmentProps {
  rooms: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  selectedRoom: string | null;
  robotPosition: { x: number; y: number };
  isRobotMoving: boolean;
  onRoomClick: (roomId: string) => void;
}

const ThreeEnvironment: React.FC<ThreeEnvironmentProps> = ({
  rooms,
  selectedRoom,
  robotPosition,
  isRobotMoving,
  onRoomClick
}) => {
  const [blenderEnabled, setBlenderEnabled] = useState(false);
  const [selectedBlenderCharacter, setSelectedBlenderCharacter] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-900 overflow-hidden">
      <Canvas 
        camera={{ position: [12, 8, 15], fov: 60 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={
          <Html center>
            <div className="text-white text-xl">Loading 4D Environment...</div>
          </Html>
        }>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[0, 10, 0]} intensity={0.8} color="#FFD700" />
          
          {/* Village Environment */}
          <VillageEnvironment rooms={rooms} />
          
          {/* Camera Controls */}
          <OrbitControls 
            enablePan={true}
            enableRotate={true}
            enableZoom={true}
            maxDistance={50}
            minDistance={5}
          />
        </Suspense>
      </Canvas>

      {/* Game HUD - Top Left */}
      <div className="absolute top-4 left-4 text-white z-10">
        <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-700/95 backdrop-blur-lg border-2 border-green-500/50 rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[280px]">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
            🏰 PRINCE VILLAGE
          </h3>
        
        </div>
      </div>

      {/* Quest Log - Top Right */}
      <div className="absolute top-4 right-4 text-white z-10">
        <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-700/95 backdrop-blur-lg border-2 border-green-500/50 rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[280px]">
          <h3 className="text-lg font-bold text-purple-400 mb-3">🏘️ VILLAGE HOUSES</h3>
          <div className="text-sm space-y-2">
            {rooms.map((room, index) => (
              <div key={room.id} className="flex items-center gap-2 py-1">
                <div 
                  className="w-3 h-3 rounded-full animate-pulse" 
                  style={{ backgroundColor: room.color }}
                />
                <span className="text-gray-300">{room.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar - Bottom */}
      <div className="absolute bottom-4 left-4 right-4 text-white z-10">
        <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-green-500/30 rounded-xl px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-red-400">❤️ HP</span>
                <div className="w-24 h-2 bg-red-600 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full transition-all duration-300" style={{ width: '85%' }}></div>
                </div>
                <span className="text-xs">85/100</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-400">🔮 MP</span>
                <div className="w-24 h-2 bg-blue-600 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full transition-all duration-300" style={{ width: '60%' }}></div>
                </div>
                <span className="text-xs">60/100</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Prince Mashumu's 4D Portfolio Kingdom v1.0 | 🎮 Adventure Mode
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeEnvironment;
