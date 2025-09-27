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
  return (
    <group>
      {/* Ground plane */}
      <Box args={[50, 0.2, 50]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#2E7D32" />
      </Box>
      
      {/* Village houses */}
      {rooms.slice(0, 5).map((room, index) => {
        const angle = (index / 5) * Math.PI * 2;
        const radius = 15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={room.id} position={[x, 2, z]}>
            <Box args={[3, 4, 3]}>
              <meshStandardMaterial color={room.color} />
            </Box>
            {/* House roof */}
            <Box args={[3.5, 1, 3.5]} position={[0, 2.5, 0]}>
              <meshStandardMaterial color="#8D4E85" />
            </Box>
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
  
  // Tour Guide System
  const [tourActive, setTourActive] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [tourProgress, setTourProgress] = useState(0);
  
  // Tour waypoints - starting from palace, then each house
  const tourWaypoints = [
    { position: [0, 12, 15], target: [0, 3, 0], room: 'main-server-core', name: '4D Hypercube Palace', description: 'Welcome to Prince Mashumu\'s interdimensional 4D Hypercube Palace - a tesseract projection that exists across multiple dimensions!' },
    { position: [18, 8, 12], target: [14, 2, 0], room: 'code-laboratory', name: 'Code Laboratory', description: 'The Code House - where magical programming spells are crafted!' },
    { position: [-18, 8, 8], target: [-14, 2, 0], room: 'database-room', name: 'Data Vault', description: 'The Data House - repository of all knowledge and information!' },
    { position: [8, 8, -18], target: [0, 2, -14], room: 'project-warehouse', name: 'Project Forge', description: 'The Project House - where great ideas are built and forged!' },
    { position: [-8, 8, -18], target: [0, 2, -14], room: 'communication-hub', name: 'Communication Tower', description: 'The Comm House - connecting the kingdom to the outside world!' },
    { position: [12, 10, 18], target: [14, 2, 14], room: 'system-status', name: 'System Shrine', description: 'The System House - monitoring the health of the entire realm!' },
    { position: [20, 15, 20], target: [0, 0, 0], room: null, name: 'Kingdom Overview', description: 'Behold the complete Portfolio Kingdom! Click any house to explore further.' }
  ];

  // Tour functions
  const startTour = () => {
    setTourActive(true);
    setCurrentTourStep(0);
    setTourProgress(0);
  };

  const nextTourStep = () => {
    if (currentTourStep < tourWaypoints.length - 1) {
      setCurrentTourStep(prev => prev + 1);
      setTourProgress(0);
    } else {
      setTourActive(false);
      setCurrentTourStep(0);
    }
  };

  const endTour = () => {
    setTourActive(false);
    setCurrentTourStep(0);
  };

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
          
          {/* 4D Hypercube Palace */}
          <HypercubePalace position={[0, 5, 0]} scale={2} />
          
          {/* Village Environment */}
          <VillageEnvironment rooms={rooms} />
          
          {/* Camera Controls */}
          <OrbitControls 
            enablePan={!tourActive}
            enableRotate={!tourActive}
            enableZoom={!tourActive}
            maxDistance={50}
            minDistance={5}
          />
        </Suspense>
      </Canvas>

      {/* UI Elements */}
      {/* START TOUR Button */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white z-20">
        {!tourActive ? (
          <div className="bg-gradient-to-br from-yellow-600/95 via-orange-600/95 to-red-600/95 backdrop-blur-lg border-2 border-yellow-400/50 rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[350px]">
            <button
              onClick={startTour}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-green-500/30 transition-all duration-300 transform hover:scale-105 text-xl"
            >
              🚀 START TOUR
            </button>
            <p className="text-center mt-3 text-sm text-gray-200">
              Explore the interdimensional 4D Portfolio Kingdom
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-lg border-2 border-cyan-400/50 rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[400px]">
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-cyan-300">{tourWaypoints[currentTourStep]?.name}</h4>
              <p className="text-sm text-gray-300 mt-2">{tourWaypoints[currentTourStep]?.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={endTour}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                End Tour
              </button>
              <div className="text-sm text-gray-300">
                Step {currentTourStep + 1} of {tourWaypoints.length}
              </div>
              <button
                onClick={nextTourStep}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Game HUD - Top Left */}
      {!tourActive && (
        <div className="absolute top-4 left-4 text-white z-10">
          <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-700/95 backdrop-blur-lg border-2 border-green-500/50 rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[280px]">
            <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
              🏰 ROYAL VILLAGE
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Houses:</span>
                <span className="text-green-400 font-mono">{rooms.length}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Palace Status:</span>
                <span className="text-yellow-400">👑 4D Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Current Location:</span>
                <span className="text-orange-400">{selectedRoom ? rooms.find(r => r.id === selectedRoom)?.name : 'Village Center'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quest Log - Top Right */}
      {!tourActive && (
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
      )}

      {/* Status Bar - Bottom */}
      {!tourActive && (
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
      )}
    </div>
  );
};

export default ThreeEnvironment;
