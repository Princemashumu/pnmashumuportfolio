'use client';

import React, { useState, useEffect } from 'react';
import { BlenderModel, BlenderSceneManager } from './BlenderModelLoader';
import { BlenderFallbackCharacter, BlenderFallbackEnvironment } from './BlenderFallbacks';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// RPG Character Models from Blender
export const BlenderRPGCharacter: React.FC<{
  characterType: 'warrior' | 'mage' | 'archer' | 'rogue' | 'custom';
  position: [number, number, number];
  modelPath?: string;
  scale?: number;
  animationState?: 'idle' | 'walk' | 'attack' | 'spell' | 'death';
  onClick?: () => void;
  name?: string;
  level?: number;
}> = ({ 
  characterType, 
  position, 
  modelPath,
  scale = 1,
  animationState = 'idle',
  onClick,
  name,
  level
}) => {
  const [modelExists, setModelExists] = useState(false);
  
  // Default model paths (you'll replace these with actual Blender exports)
  const defaultModelPaths = {
    warrior: '/models/characters/warrior.glb',
    mage: '/models/characters/mage.glb',
    archer: '/models/characters/archer.glb',
    rogue: '/models/characters/rogue.glb',
    custom: modelPath || '/models/characters/default.glb'
  };

  // Check if model file exists
  useEffect(() => {
    const checkModelExists = async () => {
      try {
        const response = await fetch(defaultModelPaths[characterType], { method: 'HEAD' });
        setModelExists(response.ok);
      } catch {
        setModelExists(false);
      }
    };
    
    // For now, always use fallbacks since we don't have actual Blender models yet
    setModelExists(false);
    // Uncomment when you have actual models:
    // checkModelExists();
  }, [characterType, defaultModelPaths]);

  const getCharacterColor = () => {
    switch (characterType) {
      case 'warrior': return '#FF4500';
      case 'mage': return '#8A2BE2';
      case 'archer': return '#32CD32';
      case 'rogue': return '#DC143C';
      default: return '#FFD700';
    }
  };

  // Use Blender model if available, otherwise use procedural fallback
  if (modelExists) {
    return (
      <group>
        <BlenderModel
          modelPath={defaultModelPaths[characterType]}
          position={position}
          scale={[scale, scale, scale]}
          animationName={animationState}
          onClick={onClick}
          hoverColor={getCharacterColor()}
          emissiveIntensity={0.3}
        />
        
        {/* Character Info UI */}
        <Html position={[position[0], position[1] + 2.5, position[2]]} center distanceFactor={6}>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-cyan-400/50 text-center">
            <div className="text-white text-sm font-bold capitalize">
              {name || characterType}
            </div>
            {level && (
              <div className="text-yellow-400 text-xs">
                Level {level}
              </div>
            )}
            <div className="text-xs text-gray-300 mt-1">
              {animationState} • Blender Model
            </div>
          </div>
        </Html>
      </group>
    );
  } else {
    // Use enhanced procedural fallback
    return (
      <BlenderFallbackCharacter
        characterType={characterType}
        position={position}
        name={name}
        level={level}
        animationState={animationState}
        onClick={onClick}
      />
    );
  }
};

// Blender Environment Props
export const BlenderEnvironmentProps: React.FC<{
  environmentType: 'fantasy_castle' | 'magic_tower' | 'treasure_vault' | 'custom';
  position: [number, number, number];
  modelPath?: string;
  scale?: number;
  interactive?: boolean;
  onClick?: () => void;
}> = ({ environmentType, position, modelPath, scale = 1, interactive = false, onClick }) => {
  const [modelExists, setModelExists] = useState(false);
  
  const defaultEnvironmentPaths = {
    fantasy_castle: '/models/environments/castle.glb',
    magic_tower: '/models/environments/tower.glb', 
    treasure_vault: '/models/environments/vault.glb',
    custom: modelPath || '/models/environments/default.glb'
  };

  // Check if model file exists
  useEffect(() => {
    const checkModelExists = async () => {
      try {
        const response = await fetch(defaultEnvironmentPaths[environmentType], { method: 'HEAD' });
        setModelExists(response.ok);
      } catch {
        setModelExists(false);
      }
    };
    
    checkModelExists();
  }, [environmentType, defaultEnvironmentPaths]);

  if (modelExists) {
    return (
      <BlenderModel
        modelPath={defaultEnvironmentPaths[environmentType]}
        position={position}
        scale={[scale, scale, scale]}
        onClick={interactive ? onClick : undefined}
        hoverColor={interactive ? '#FFD700' : undefined}
        emissiveIntensity={0.2}
      />
    );
  } else {
    return (
      <BlenderFallbackEnvironment
        environmentType={environmentType}
        position={position}
        scale={scale}
        onClick={interactive ? onClick : undefined}
      />
    );
  }
};

// Blender Particle Effects
export const BlenderParticleEffect: React.FC<{
  effectType: 'magic_sparkles' | 'fire' | 'lightning' | 'healing' | 'custom';
  position: [number, number, number];
  modelPath?: string;
  autoPlay?: boolean;
  intensity?: number;
}> = ({ effectType, position, modelPath, autoPlay = true, intensity = 1 }) => {
  // For now, we'll create procedural particle effects instead of loading models
  // since we don't have actual Blender particle models yet
  const createProceduralEffect = () => {
    switch (effectType) {
      case 'magic_sparkles':
        return (
          <group position={position}>
            {/* Create sparkle effect with multiple small spheres */}
            {[...Array(20)].map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const radius = Math.sin(Date.now() * 0.001 + i) * 2;
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              const y = Math.sin(Date.now() * 0.003 + i) * 1;
              
              return (
                <mesh key={i} position={[x, y, z]}>
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <meshStandardMaterial 
                    color="#FFD700"
                    emissive="#FFD700"
                    emissiveIntensity={intensity * 0.8}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              );
            })}
          </group>
        );
        
      case 'fire':
        return (
          <group position={position}>
            {/* Create fire effect with animated orange/red particles */}
            {[...Array(15)].map((_, i) => {
              const x = (Math.random() - 0.5) * 1;
              const z = (Math.random() - 0.5) * 1;
              const y = Math.random() * 2;
              const color = i % 2 === 0 ? '#FF4500' : '#FF8C00';
              
              return (
                <mesh key={i} position={[x, y, z]}>
                  <sphereGeometry args={[0.1, 6, 6]} />
                  <meshStandardMaterial 
                    color={color}
                    emissive={color}
                    emissiveIntensity={intensity}
                    transparent
                    opacity={0.7}
                  />
                </mesh>
              );
            })}
          </group>
        );
        
      default:
        return (
          <group position={position}>
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial 
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={intensity * 0.5}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        );
    }
  };

  return createProceduralEffect();
};

// Complete Blender Scene Integration
export const BlenderGameWorld: React.FC<{
  scenePath?: string;
  includeCharacters?: boolean;
  includeEnvironments?: boolean;
  includeEffects?: boolean;
}> = ({ 
  scenePath = '/models/scenes/rpg_world.glb',
  includeCharacters = true,
  includeEnvironments = true,
  includeEffects = true
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  return (
    <>
      {/* Main Blender Scene */}
      <BlenderSceneManager
        scenePath={scenePath}
        position={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        {/* Blender Characters */}
        {includeCharacters && (
          <>
            <BlenderRPGCharacter
              characterType="warrior"
              position={[5, 0, 3]}
              name="Sir Codealot"
              level={25}
              animationState={selectedCharacter === 'warrior' ? 'attack' : 'idle'}
              onClick={() => setSelectedCharacter('warrior')}
            />
            
            <BlenderRPGCharacter
              characterType="mage"
              position={[-7, 0, -4]}
              name="Wizarda Scriptura"
              level={30}
              animationState={selectedCharacter === 'mage' ? 'spell' : 'idle'}
              onClick={() => setSelectedCharacter('mage')}
            />
            
            <BlenderRPGCharacter
              characterType="archer"
              position={[8, 0, -6]}
              name="Arrow Pointer"
              level={22}
              animationState={selectedCharacter === 'archer' ? 'attack' : 'idle'}
              onClick={() => setSelectedCharacter('archer')}
            />
            
            <BlenderRPGCharacter
              characterType="rogue"
              position={[-5, 0, 8]}
              name="Sneaky McFunction"
              level={28}
              animationState={selectedCharacter === 'rogue' ? 'walk' : 'idle'}
              onClick={() => setSelectedCharacter('rogue')}
            />
          </>
        )}

        {/* Blender Environment Props */}
        {includeEnvironments && (
          <>
            <BlenderEnvironmentProps
              environmentType="fantasy_castle"
              position={[0, 0, 0]}
              scale={2}
              interactive={true}
              onClick={() => console.log('Entered main castle')}
            />
            
            <BlenderEnvironmentProps
              environmentType="magic_tower"
              position={[15, 0, 15]}
              scale={1.5}
              interactive={true}
              onClick={() => console.log('Climbed magic tower')}
            />
            
            <BlenderEnvironmentProps
              environmentType="treasure_vault"
              position={[-15, 0, -15]}
              scale={1.2}
              interactive={true}
              onClick={() => console.log('Opened treasure vault')}
            />
          </>
        )}

        {/* Blender Particle Effects */}
        {includeEffects && (
          <>
            <BlenderParticleEffect
              effectType="magic_sparkles"
              position={[0, 5, 0]}
              intensity={1.5}
            />
            
            <BlenderParticleEffect
              effectType="fire"
              position={[10, 1, 10]}
              intensity={0.8}
            />
            
            <BlenderParticleEffect
              effectType="healing"
              position={[-10, 2, -10]}
              intensity={1.2}
            />
          </>
        )}
      </BlenderSceneManager>

      {/* Character Selection UI */}
      {selectedCharacter && (
        <Html position={[0, 8, 0]} center>
          <div className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-lg border-2 border-yellow-400/50 rounded-xl p-4 text-center">
            <h3 className="text-yellow-300 text-lg font-bold mb-2">
              Selected: {selectedCharacter.toUpperCase()}
            </h3>
            <p className="text-white text-sm mb-3">
              Blender-powered 3D character with advanced animations
            </p>
            <button 
              onClick={() => setSelectedCharacter(null)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              Deselect
            </button>
          </div>
        </Html>
      )}
    </>
  );
};

export default BlenderGameWorld;
