'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { Box, Sphere, Cylinder } from '@react-three/drei';

// Fallback models that mimic Blender model structure but use procedural geometry
export const BlenderFallbackCharacter: React.FC<{
  characterType: 'warrior' | 'mage' | 'archer' | 'rogue';
  position: [number, number, number];
  name?: string;
  level?: number;
  animationState?: string;
  onClick?: () => void;
}> = ({ characterType, position, name, level, animationState, onClick }) => {
  const getCharacterColors = () => {
    switch (characterType) {
      case 'warrior': return { body: '#8B4513', armor: '#C0C0C0', accent: '#FF4500' };
      case 'mage': return { body: '#4B0082', armor: '#9400D3', accent: '#00FFFF' };
      case 'archer': return { body: '#228B22', armor: '#8B4513', accent: '#FFFF00' };
      case 'rogue': return { body: '#2F4F4F', armor: '#000000', accent: '#FF1493' };
    }
  };

  const colors = getCharacterColors();

  return (
    <group position={position} onClick={onClick}>
      {/* Enhanced procedural character with Blender-like detail */}
      
      {/* Body */}
      <Cylinder args={[0.4, 0.5, 1.8]} position={[0, 0.9, 0]}>
        <meshStandardMaterial 
          color={colors.body}
          metalness={0.1}
          roughness={0.8}
        />
      </Cylinder>

      {/* Head */}
      <Sphere args={[0.3]} position={[0, 2, 0]}>
        <meshStandardMaterial 
          color="#FDBCB4"
          metalness={0.1}
          roughness={0.9}
        />
      </Sphere>

      {/* Helmet/Hat */}
      <Cylinder args={[0.35, 0.3, 0.25]} position={[0, 2.2, 0]}>
        <meshStandardMaterial 
          color={colors.armor}
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>

      {/* Arms */}
      <Cylinder args={[0.12, 0.12, 1.2]} position={[-0.6, 1.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color={colors.body} />
      </Cylinder>
      <Cylinder args={[0.12, 0.12, 1.2]} position={[0.6, 1.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <meshStandardMaterial color={colors.body} />
      </Cylinder>

      {/* Legs */}
      <Cylinder args={[0.15, 0.15, 1.2]} position={[-0.25, -0.1, 0]}>
        <meshStandardMaterial color={colors.armor} />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 1.2]} position={[0.25, -0.1, 0]}>
        <meshStandardMaterial color={colors.armor} />
      </Cylinder>

      {/* Class-specific equipment */}
      {characterType === 'warrior' && (
        <>
          {/* Sword */}
          <Box args={[0.15, 2, 0.05]} position={[-1, 1.5, 0]}>
            <meshStandardMaterial 
              color="#C0C0C0"
              metalness={0.9}
              roughness={0.1}
            />
          </Box>
          {/* Shield */}
          <Cylinder args={[0.4, 0.4, 0.1]} position={[1, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial 
              color="#8B4513"
              metalness={0.3}
              roughness={0.7}
            />
          </Cylinder>
        </>
      )}
      
      {characterType === 'mage' && (
        <>
          {/* Staff */}
          <Cylinder args={[0.05, 0.05, 1.8]} position={[1, 1.5, 0]}>
            <meshStandardMaterial 
              color="#8B4513"
              metalness={0.1}
              roughness={0.8}
            />
          </Cylinder>
          {/* Crystal orb */}
          <Sphere args={[0.15]} position={[1, 2.4, 0]}>
            <meshStandardMaterial 
              color="#00FFFF"
              emissive="#00FFFF"
              emissiveIntensity={0.5}
              transparent={true}
              opacity={0.8}
            />
          </Sphere>
        </>
      )}

      {characterType === 'archer' && (
        <>
          {/* Bow */}
          <Box args={[0.05, 1.5, 0.1]} position={[1, 1.3, 0]}>
            <meshStandardMaterial 
              color="#8B4513"
              metalness={0.1}
              roughness={0.8}
            />
          </Box>
          {/* Quiver */}
          <Cylinder args={[0.15, 0.15, 0.8]} position={[-0.3, 1.8, -0.3]}>
            <meshStandardMaterial 
              color="#654321"
              metalness={0.2}
              roughness={0.9}
            />
          </Cylinder>
        </>
      )}

      {characterType === 'rogue' && (
        <>
          {/* Daggers */}
          <Box args={[0.05, 0.8, 0.05]} position={[-0.5, 0.8, 0.3]} rotation={[0, Math.PI / 4, Math.PI / 6]}>
            <meshStandardMaterial 
              color="#C0C0C0"
              metalness={0.9}
              roughness={0.1}
            />
          </Box>
          <Box args={[0.05, 0.8, 0.05]} position={[0.5, 0.8, 0.3]} rotation={[0, -Math.PI / 4, -Math.PI / 6]}>
            <meshStandardMaterial 
              color="#C0C0C0"
              metalness={0.9}
              roughness={0.1}
            />
          </Box>
        </>
      )}

      {/* Character aura */}
      <Sphere args={[1]} position={[0, 1, 0]}>
        <meshStandardMaterial 
          color={colors.accent}
          transparent={true}
          opacity={0.1}
          emissive={colors.accent}
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Name tag */}
      <Html position={[0, 3, 0]} center distanceFactor={6}>
        <div className="bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-cyan-400/50 text-center">
          <div className="text-white text-sm font-bold capitalize">
            {name || characterType}
          </div>
          {level && (
            <div className="text-yellow-400 text-xs">
              Level {level}
            </div>
          )}
          <div className="text-xs text-gray-300 mt-1">
            {animationState || 'idle'} • Procedural Model
          </div>
          <div className="text-xs text-blue-400 mt-1">
            🎨 Waiting for Blender asset
          </div>
        </div>
      </Html>
    </group>
  );
};

export const BlenderFallbackEnvironment: React.FC<{
  environmentType: 'fantasy_castle' | 'magic_tower' | 'treasure_vault';
  position: [number, number, number];
  scale?: number;
  onClick?: () => void;
}> = ({ environmentType, position, scale = 1, onClick }) => {
  const getEnvironmentColor = () => {
    switch (environmentType) {
      case 'fantasy_castle': return '#8B7355';
      case 'magic_tower': return '#4A4A4A';
      case 'treasure_vault': return '#2F4F4F';
    }
  };

  return (
    <group position={position} scale={[scale, scale, scale]} onClick={onClick}>
      {environmentType === 'fantasy_castle' && (
        <>
          {/* Enhanced castle structure */}
          <Box args={[3, 5, 3]} position={[0, 2.5, 0]}>
            <meshStandardMaterial 
              color={getEnvironmentColor()}
              metalness={0.2}
              roughness={0.8}
            />
          </Box>
          {/* Castle Towers with more detail */}
          {[[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]].map((pos, i) => (
            <Cylinder key={i} args={[0.6, 0.6, 6]} position={[pos[0], 3, pos[1]]}>
              <meshStandardMaterial color={getEnvironmentColor()} />
            </Cylinder>
          ))}
          {/* Flags */}
          {[[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]].map((pos, i) => (
            <Box key={`flag-${i}`} args={[0.5, 0.3, 0.05]} position={[pos[0], 6.2, pos[1]]}>
              <meshStandardMaterial color="#FF0000" />
            </Box>
          ))}
        </>
      )}

      {environmentType === 'magic_tower' && (
        <>
          {/* Tower with more magical elements */}
          <Cylinder args={[1.2, 1, 8]} position={[0, 4, 0]}>
            <meshStandardMaterial 
              color={getEnvironmentColor()}
              metalness={0.6}
              roughness={0.4}
            />
          </Cylinder>
          {/* Magical crystals around tower */}
          {[0, 1, 2, 3].map((i) => {
            const angle = (i / 4) * Math.PI * 2;
            const x = Math.cos(angle) * 2;
            const z = Math.sin(angle) * 2;
            return (
              <Cylinder 
                key={i}
                args={[0.1, 0.05, 1]} 
                position={[x, 8.5 + i * 0.5, z]}
                rotation={[0, angle, 0.2]}
              >
                <meshStandardMaterial 
                  color="#00FFFF"
                  emissive="#00FFFF"
                  emissiveIntensity={0.8}
                />
              </Cylinder>
            );
          })}
        </>
      )}

      {environmentType === 'treasure_vault' && (
        <>
          {/* Vault structure */}
          <Box args={[3, 4, 3]} position={[0, 2, 0]}>
            <meshStandardMaterial 
              color={getEnvironmentColor()}
              metalness={0.8}
              roughness={0.2}
            />
          </Box>
          {/* Golden dome */}
          <Cylinder args={[2, 2, 1]} position={[0, 4.5, 0]}>
            <meshStandardMaterial 
              color="#FFD700"
              metalness={0.9}
              roughness={0.1}
            />
          </Cylinder>
          {/* Treasure piles */}
          {[-1, 0, 1].map((x, i) => (
            <Cylinder key={i} args={[0.3, 0.3, 0.5]} position={[x, 0.25, 1.5]}>
              <meshStandardMaterial 
                color="#FFD700"
                metalness={0.9}
                roughness={0.1}
              />
            </Cylinder>
          ))}
        </>
      )}

      {/* Procedural model indicator */}
      <Html position={[0, 6 * scale, 0]} center distanceFactor={8}>
        <div className="bg-purple-900/90 backdrop-blur-sm rounded px-2 py-1 border border-cyan-400/50">
          <div className="text-cyan-300 text-xs font-bold text-center">
            {environmentType.replace('_', ' ').toUpperCase()}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            🎨 Procedural • Awaiting Blender
          </div>
        </div>
      </Html>
    </group>
  );
};

export default { BlenderFallbackCharacter, BlenderFallbackEnvironment };
