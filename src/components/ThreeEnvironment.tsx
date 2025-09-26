'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Room3DProps {
  position: [number, number, number];
  roomData: {
    id: string;
    name: string;
    color: string;
    description: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

// Individual Room Components
const RoomWalls: React.FC<{ 
  roomName: string; 
  position: [number, number, number]; 
  size: [number, number, number];
  color: string;
  doorPosition?: 'front' | 'back' | 'left' | 'right';
}> = ({ roomName, position, size, color, doorPosition = 'front' }) => {
  const [width, height, depth] = size;
  const [x, y, z] = position;

  return (
    <group position={position}>
      {/* Room Walls */}
      {/* Back Wall */}
      <Box args={[width, height, 0.3]} position={[0, 0, -depth/2]}>
        <meshStandardMaterial 
          color={color} 
          roughness={0.6}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Left Wall */}
      <Box args={[0.3, height, depth]} position={[-width/2, 0, 0]}>
        <meshStandardMaterial 
          color={color} 
          roughness={0.6}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Right Wall */}
      <Box args={[0.3, height, depth]} position={[width/2, 0, 0]}>
        <meshStandardMaterial 
          color={color} 
          roughness={0.6}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Front Wall with Door Opening */}
      {doorPosition === 'front' ? (
        <>
          <Box args={[width/3, height, 0.3]} position={[-width/3, 0, depth/2]}>
            <meshStandardMaterial 
              color={color} 
              roughness={0.6}
              metalness={0.3}
              emissive={color}
              emissiveIntensity={0.1}
            />
          </Box>
          <Box args={[width/3, height, 0.3]} position={[width/3, 0, depth/2]}>
            <meshStandardMaterial 
              color={color} 
              roughness={0.6}
              metalness={0.3}
              emissive={color}
              emissiveIntensity={0.1}
            />
          </Box>
          <Box args={[width/3, height/2, 0.3]} position={[0, height/4, depth/2]}>
            <meshStandardMaterial 
              color={color} 
              roughness={0.6}
              metalness={0.3}
              emissive={color}
              emissiveIntensity={0.1}
            />
          </Box>
        </>
      ) : (
        <Box args={[width, height, 0.3]} position={[0, 0, depth/2]}>
          <meshStandardMaterial 
            color={color} 
            roughness={0.6}
            metalness={0.3}
            emissive={color}
            emissiveIntensity={0.1}
          />
        </Box>
      )}

      {/* Room Door */}
      <group position={[0, -height/4, depth/2 + 0.2]}>
        {/* Door Frame */}
        <Box args={[2.5, 3, 0.2]}>
          <meshStandardMaterial 
            color="#607d8b" 
            metalness={0.8}
            roughness={0.3}
          />
        </Box>
        
        {/* Door Panel */}
        <Box args={[2.2, 2.7, 0.15]} position={[0, 0, 0.1]}>
          <meshStandardMaterial 
            color={color}
            metalness={0.6}
            roughness={0.4}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </Box>
        
        {/* Door Handle */}
        <Cylinder args={[0.05, 0.05, 0.3]} position={[0.8, 0, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial 
            color="#ffab00" 
            metalness={0.9}
            roughness={0.1}
          />
        </Cylinder>

        {/* Room Name Sign */}
        <Html
          position={[0, 1.8, 0.3]}
          center
          distanceFactor={6}
        >
          <div className="bg-black/90 backdrop-blur-sm rounded px-4 py-2 border border-cyan-500/50">
            <div className="text-white text-sm font-bold text-center whitespace-nowrap">
              {roomName}
            </div>
          </div>
        </Html>

        {/* Status Light */}
        <Sphere args={[0.1]} position={[0, 1, 0.25]}>
          <meshStandardMaterial 
            color="#4caf50" 
            emissive="#2e7d32"
            emissiveIntensity={0.8}
          />
        </Sphere>
      </group>
    </group>
  );
};

// Warehouse with Individual Rooms
const WarehouseRooms: React.FC<{ rooms: any[] }> = ({ rooms }) => {
  const roomConfigs = [
    { name: "Main Server Core", position: [-12, 2, -12] as [number, number, number], size: [8, 6, 8] as [number, number, number], color: "#1976d2" },
    { name: "Code Laboratory", position: [0, 2, -12] as [number, number, number], size: [8, 6, 8] as [number, number, number], color: "#388e3c" },
    { name: "Database Room", position: [12, 2, -12] as [number, number, number], size: [8, 6, 8] as [number, number, number], color: "#f57c00" },
    { name: "Project Warehouse", position: [-12, 2, 0] as [number, number, number], size: [8, 6, 8] as [number, number, number], color: "#7b1fa2" },
    { name: "Communication Hub", position: [0, 2, 0] as [number, number, number], size: [8, 6, 8] as [number, number, number], color: "#e91e63" },
    { name: "System Status", position: [12, 2, 0] as [number, number, number], size: [8, 6, 8] as [number, number, number], color: "#00acc1" },
  ];

  return (
    <>
      {roomConfigs.map((config, index) => (
        <RoomWalls
          key={index}
          roomName={config.name}
          position={config.position}
          size={config.size}
          color={config.color}
          doorPosition="front"
        />
      ))}

      {/* Outer Warehouse Walls */}
      {/* Back Wall */}
      <Box args={[40, 8, 0.5]} position={[0, 2, -20]}>
        <meshStandardMaterial color="#37474f" roughness={0.8} metalness={0.2} />
      </Box>
      
      {/* Left Wall */}
      <Box args={[0.5, 8, 40]} position={[-20, 2, 0]}>
        <meshStandardMaterial color="#37474f" roughness={0.8} metalness={0.2} />
      </Box>
      
      {/* Right Wall */}
      <Box args={[0.5, 8, 40]} position={[20, 2, 0]}>
        <meshStandardMaterial color="#37474f" roughness={0.8} metalness={0.2} />
      </Box>
      
      {/* Front Wall (main entrance) */}
      <Box args={[15, 8, 0.5]} position={[-12.5, 2, 20]}>
        <meshStandardMaterial color="#37474f" roughness={0.8} metalness={0.2} />
      </Box>
      <Box args={[15, 8, 0.5]} position={[12.5, 2, 20]}>
        <meshStandardMaterial color="#37474f" roughness={0.8} metalness={0.2} />
      </Box>
      <Box args={[10, 3, 0.5]} position={[0, 5.5, 20]}>
        <meshStandardMaterial color="#37474f" roughness={0.8} metalness={0.2} />
      </Box>

      {/* Main Entrance Door */}
      <group position={[0, -1, 19.5]}>
        <Box args={[8, 6, 0.3]}>
          <meshStandardMaterial color="#607d8b" metalness={0.8} roughness={0.3} />
        </Box>
        <Box args={[7.5, 5.5, 0.2]} position={[0, 0, 0.15]}>
          <meshStandardMaterial 
            color="#1976d2" 
            metalness={0.6}
            roughness={0.4}
            emissive="#0d47a1"
            emissiveIntensity={0.2}
          />
        </Box>
        
        {/* Main Entrance Sign */}
        <Html
          position={[0, 3.5, 0.4]}
          center
          distanceFactor={8}
        >
          <div className="bg-black/95 backdrop-blur-sm rounded-lg px-6 py-3 border border-cyan-500/50">
            <div className="text-white text-lg font-bold text-center">
              🏢 PRINCE MASHUMU
            </div>
            <div className="text-cyan-400 text-sm text-center">
              PORTFOLIO DATA CENTER
            </div>
          </div>
        </Html>
      </group>
    </>
  );
};

const WarehouseWindows: React.FC = () => (
  <>
    {/* Windows on outer warehouse walls */}
    {[...Array(3)].map((_, i) => (
      <Box key={`back-window-${i}`} args={[4, 2, 0.1]} position={[-8 + i * 8, 4, -19.8]}>
        <meshStandardMaterial 
          color="#4dd0e1" 
          transparent={true} 
          opacity={0.4}
          emissive="#00bcd4"
          emissiveIntensity={0.1}
        />
      </Box>
    ))}
    
    {/* Side windows */}
    {[...Array(2)].map((_, i) => (
      <group key={`side-windows-${i}`}>
        <Box args={[0.1, 2, 4]} position={[-19.8, 4, -8 + i * 16]}>
          <meshStandardMaterial 
            color="#4dd0e1" 
            transparent={true} 
            opacity={0.4}
            emissive="#00bcd4"
            emissiveIntensity={0.1}
          />
        </Box>
        <Box args={[0.1, 2, 4]} position={[19.8, 4, -8 + i * 16]}>
          <meshStandardMaterial 
            color="#4dd0e1" 
            transparent={true} 
            opacity={0.4}
            emissive="#00bcd4"
            emissiveIntensity={0.1}
          />
        </Box>
      </group>
    ))}

    {/* Room internal windows */}
    {[...Array(6)].map((_, i) => {
      const roomPositions = [
        [-12, 4, -8], [0, 4, -8], [12, 4, -8],
        [-12, 4, 4], [0, 4, 4], [12, 4, 4]
      ];
      return (
        <Box key={`room-window-${i}`} args={[2, 1.5, 0.1]} position={roomPositions[i]}>
          <meshStandardMaterial 
            color="#e3f2fd" 
            transparent={true} 
            opacity={0.6}
            emissive="#2196f3"
            emissiveIntensity={0.1}
          />
        </Box>
      );
    })}
  </>
);

const WarehouseDoor: React.FC = () => (
  <group position={[0, 0, 19.5]}>
    {/* Door Frame */}
    <Box args={[6, 6, 0.3]} position={[0, 1, 0]}>
      <meshStandardMaterial 
        color="#607d8b" 
        metalness={0.8}
        roughness={0.3}
        emissive="#455a64"
        emissiveIntensity={0.1}
      />
    </Box>
    
    {/* Door Panels */}
    <Box args={[2.8, 5.8, 0.2]} position={[-1.5, 1, 0.1]}>
      <meshStandardMaterial 
        color="#8e24aa" 
        metalness={0.6}
        roughness={0.4}
        emissive="#7b1fa2"
        emissiveIntensity={0.2}
      />
    </Box>
    <Box args={[2.8, 5.8, 0.2]} position={[1.5, 1, 0.1]}>
      <meshStandardMaterial 
        color="#1976d2" 
        metalness={0.6}
        roughness={0.4}
        emissive="#0d47a1"
        emissiveIntensity={0.2}
      />
    </Box>
    
    {/* Door Handle */}
    <Cylinder args={[0.1, 0.1, 0.5]} position={[2, 1, 0.3]} rotation={[0, 0, Math.PI / 2]}>
      <meshStandardMaterial 
        color="#ffab00" 
        metalness={0.9}
        roughness={0.1}
        emissive="#ff8f00"
        emissiveIntensity={0.4}
      />
    </Cylinder>
    
    {/* Security Scanner */}
    <Box args={[0.3, 0.3, 0.2]} position={[2.5, 2, 0.4]}>
      <meshStandardMaterial 
        color="#4caf50" 
        emissive="#2e7d32"
        emissiveIntensity={0.6}
      />
    </Box>
    
    {/* Door Window */}
    <Box args={[1, 1, 0.1]} position={[0, 2, 0.2]}>
      <meshStandardMaterial 
        color="#81d4fa" 
        transparent={true} 
        opacity={0.6}
        emissive="#0288d1"
        emissiveIntensity={0.3}
      />
    </Box>
  </group>
);

const ColoredInfrastructure: React.FC = () => (
  <>
    {/* Cooling Pipes */}
    {[...Array(4)].map((_, i) => (
      <Cylinder 
        key={`pipe-${i}`}
        args={[0.2, 0.2, 35]} 
        position={[-15 + i * 10, 6.5, 0]} 
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial 
          color={['#2196f3', '#4caf50', '#ff9800', '#e91e63'][i]}
          metalness={0.8}
          roughness={0.2}
          emissive={['#2196f3', '#4caf50', '#ff9800', '#e91e63'][i]}
          emissiveIntensity={0.1}
        />
      </Cylinder>
    ))}
    
    {/* Power Conduits */}
    {[...Array(6)].map((_, i) => (
      <Box 
        key={`conduit-${i}`}
        args={[0.3, 0.3, 40]} 
        position={[-17.5, 7 - i * 0.5, 0]}
      >
        <meshStandardMaterial 
          color={i % 2 === 0 ? '#ffeb3b' : '#9c27b0'}
          emissive={i % 2 === 0 ? '#ffeb3b' : '#9c27b0'}
          emissiveIntensity={0.2}
        />
      </Box>
    ))}
    
    {/* Ventilation Units */}
    {[...Array(3)].map((_, i) => (
      <group key={`vent-${i}`}>
        <Cylinder 
          args={[1, 1, 0.5]} 
          position={[-10 + i * 10, 7.5, -18]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial 
            color="#607d8b" 
            metalness={0.7}
            roughness={0.3}
          />
        </Cylinder>
        {/* Fan blades */}
        {[...Array(4)].map((_, j) => (
          <Box
            key={`blade-${i}-${j}`}
            args={[0.1, 1.5, 0.05]}
            position={[-10 + i * 10, 7.5, -17.8]}
            rotation={[0, 0, (j * Math.PI) / 2]}
          >
            <meshStandardMaterial color="#90a4ae" />
          </Box>
        ))}
      </group>
    ))}
    
    {/* Emergency Lights */}
    {[...Array(8)].map((_, i) => (
      <group key={`emergency-light-${i}`}>
        <Sphere 
          args={[0.2]} 
          position={[
            -17 + (i % 4) * 11, 
            6, 
            i < 4 ? -15 : 15
          ]}
        >
          <meshStandardMaterial 
            color="#ff5722" 
            emissive="#ff3d00"
            emissiveIntensity={0.6}
          />
        </Sphere>
      </group>
    ))}
  </>
);

const WarehouseFloor: React.FC = () => (
  <>
    {/* Main floor */}
    <Box args={[40, 0.2, 40]} position={[0, -2, 0]}>
      <meshStandardMaterial 
        color="#37474f" 
        roughness={0.7}
        metalness={0.2}
        emissive="#263238"
        emissiveIntensity={0.05}
      />
    </Box>
    
    {/* Floor grid pattern */}
    {[...Array(9)].map((_, i) => (
      <group key={`floor-grid-${i}`}>
        {/* Horizontal lines */}
        <Box args={[40, 0.05, 0.1]} position={[0, -1.8, -20 + i * 5]}>
          <meshStandardMaterial 
            color="#00e5ff" 
            emissive="#00bcd4"
            emissiveIntensity={0.5}
          />
        </Box>
        {/* Vertical lines */}
        <Box args={[0.1, 0.05, 40]} position={[-20 + i * 5, -1.8, 0]}>
          <meshStandardMaterial 
            color="#1de9b6" 
            emissive="#4caf50"
            emissiveIntensity={0.5}
          />
        </Box>
      </group>
    ))}
    
    {/* Loading zones */}
    {[...Array(4)].map((_, i) => (
      <Box 
        key={`loading-zone-${i}`}
        args={[3, 0.1, 3]} 
        position={[-15 + i * 10, -1.9, 17]}
      >
        <meshStandardMaterial 
          color={['#ff6b35', '#4ecdc4', '#45b7d1', '#f9ca24'][i]} 
          emissive={['#ff6b35', '#4ecdc4', '#45b7d1', '#f9ca24'][i]}
          emissiveIntensity={0.3}
        />
      </Box>
    ))}
    
    {/* Decorative floor panels */}
    {[...Array(6)].map((_, i) => (
      <Box 
        key={`floor-panel-${i}`}
        args={[2, 0.05, 2]} 
        position={[
          -10 + (i % 3) * 10, 
          -1.9, 
          -5 + Math.floor(i / 3) * 10
        ]}
      >
        <meshStandardMaterial 
          color={['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'][i]}
          emissive={['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'][i]}
          emissiveIntensity={0.2}
        />
      </Box>
    ))}
  </>
);
const Room3D: React.FC<Room3DProps> = ({ position, roomData, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Simple floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      if (isSelected) {
        meshRef.current.rotation.y += 0.02;
      }
    }
  });

  return (
    <group position={position}>
      {/* Simple Server Rack */}
      <Box 
        ref={meshRef}
        args={[2, 4, 1]} 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <meshStandardMaterial 
          color={isSelected ? roomData.color : "#546e7a"}
          metalness={0.8}
          roughness={0.2}
          emissive={isSelected ? roomData.color : '#37474f'}
          emissiveIntensity={isSelected ? 0.4 : 0.1}
        />
      </Box>

      {/* Simple Status Lights */}
      {[...Array(3)].map((_, i) => (
        <Sphere
          key={i}
          args={[0.05]}
          position={[0, 1.5 - i * 0.3, 0.6]}
        >
          <meshStandardMaterial 
            color={['#00ff00', '#ffff00', '#ff0000'][i]}
            emissive={['#00ff00', '#ffff00', '#ff0000'][i]}
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}

      {/* Room Label */}
      {isSelected && (
        <Html
          position={[0, 3, 0]}
          center
          distanceFactor={8}
        >
          <div className="bg-black/90 backdrop-blur-sm rounded px-3 py-2 border border-cyan-500/50 text-white text-center">
            <h3 className="text-sm font-bold text-cyan-400">{roomData.name}</h3>
            <p className="text-xs text-gray-300">{roomData.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

// Simple 3D Robot Component
const Robot3D: React.FC<{ position: [number, number, number]; isMoving: boolean }> = ({ 
  position, 
  isMoving 
}) => {
  const robotRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (robotRef.current) {
      // Simple idle floating
      if (!isMoving) {
        robotRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
      }
    }
  });

  return (
    <group ref={robotRef} position={position}>
      {/* Robot Body */}
      <Cylinder args={[0.3, 0.4, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#e91e63"
          metalness={0.8}
          roughness={0.2}
          emissive="#ad1457"
          emissiveIntensity={0.3}
        />
      </Cylinder>

      {/* Robot Head */}
      <Sphere args={[0.25]} position={[0, 0.6, 0]}>
        <meshStandardMaterial 
          color="#00acc1"
          metalness={0.9}
          roughness={0.1}
          emissive="#0097a7"
          emissiveIntensity={0.4}
        />
      </Sphere>

      {/* Robot Eyes */}
      <Sphere args={[0.05]} position={[-0.1, 0.65, 0.2]}>
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
        />
      </Sphere>
      <Sphere args={[0.05]} position={[0.1, 0.65, 0.2]}>
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
        />
      </Sphere>
    </group>
  );
};

// Main 3D Environment Component
interface ThreeEnvironmentProps {
  rooms: Array<{
    id: string;
    name: string;
    color: string;
    description: string;
    position: { x: number; y: number };
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
  // Convert 2D positions to 3D positions
  const convert2Dto3D = (pos2d: { x: number; y: number }): [number, number, number] => {
    return [
      (pos2d.x - 50) * 0.1, // Convert percentage to 3D space
      0,
      (pos2d.y - 50) * 0.1
    ];
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-b from-slate-900 to-black overflow-hidden">
      <Canvas 
        camera={{ position: [12, 8, 15], fov: 60 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={
          <Html center>
            <div className="text-white text-xl">Loading 3D Environment...</div>
          </Html>
        }>
          {/* Camera Controls */}
          <OrbitControls 
            enableZoom={true} 
            enablePan={true} 
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={5}
            maxDistance={25}
          />

          {/* Enhanced Warehouse Environment with Individual Rooms */}
          <WarehouseFloor />
          <WarehouseRooms rooms={rooms} />
          <WarehouseWindows />
          <ColoredInfrastructure />

          {/* Enhanced Lighting */}
          <ambientLight intensity={0.4} color="#ffffff" />
          <pointLight position={[0, 8, 0]} intensity={1.2} color="#ffffff" />
          <pointLight position={[15, 5, 15]} intensity={0.8} color="#00e5ff" />
          <pointLight position={[-15, 5, -15]} intensity={0.8} color="#ff6b35" />
          <pointLight position={[0, 3, -18]} intensity={0.6} color="#4caf50" />
          <pointLight position={[15, 3, -5]} intensity={0.5} color="#e91e63" />
          <pointLight position={[-15, 3, 5]} intensity={0.5} color="#9c27b0" />
          
          {/* Directional lighting for realism */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.7}
            color="#fafafa"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Render Server Racks Inside Each Room */}
          {rooms.map((room, index) => {
            // Position server racks inside each room
            const roomPositions = [
              [-12, 0, -12], // Main Server Core
              [0, 0, -12],   // Code Laboratory  
              [12, 0, -12],  // Database Room
              [-12, 0, 0],   // Project Warehouse
              [0, 0, 0],     // Communication Hub
              [12, 0, 0],    // System Status
            ];

            const position: [number, number, number] = roomPositions[index] || [0, 0, 0];

            return (
              <Room3D
                key={room.id}
                position={position}
                roomData={room}
                isSelected={selectedRoom === room.id}
                onClick={() => onRoomClick(room.id)}
              />
            );
          })}

          {/* 3D Robot */}
          <Robot3D
            position={convert2Dto3D(robotPosition)}
            isMoving={isRobotMoving}
          />
        </Suspense>
      </Canvas>

      {/* Warehouse Control Panel */}
      <div className="absolute top-4 left-4 text-white z-10">
        <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 border border-cyan-400/50 shadow-2xl">
          <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
            🏢 PORTFOLIO DATA CENTER
          </h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Individual Rooms:</span>
              <span className="text-green-400 font-mono">{rooms.length}/6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Active Room:</span>
              <span className="text-orange-400">{selectedRoom ? rooms.find(r => r.id === selectedRoom)?.name : 'Main Lobby'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Access Level:</span>
              <span className="text-green-400">� AUTHORIZED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Room Status:</span>
              <span className="text-blue-400">🏠 READY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Climate:</span>
              <span className="text-green-400">🌡️ OPTIMAL</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-600">
            🖱️ Click + Drag to explore • 🔍 Scroll to zoom<br/>
            🖱️ Click server racks inside rooms to access
          </div>
        </div>
      </div>

      {/* Room Directory */}
      <div className="absolute top-4 right-4 text-white z-10">
        <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 border border-purple-400/50 shadow-2xl">
          <h3 className="text-lg font-bold text-purple-400 mb-3">📍 ROOM DIRECTORY</h3>
          <div className="text-sm space-y-1">
            {rooms.map((room, index) => (
              <div key={room.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: room.color, opacity: selectedRoom === room.id ? 1 : 0.6 }}
                ></div>
                <span className={`text-xs ${selectedRoom === room.id ? 'text-white font-bold' : 'text-gray-300'}`}>
                  ROOM {String(index + 1).padStart(2, '0')}: {room.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 text-white z-10">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30">
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-6">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Systems Online
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                Cooling Active
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                Robot Guide Ready
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Prince Mashumu Portfolio v3.0 | 3D Warehouse
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeEnvironment;
