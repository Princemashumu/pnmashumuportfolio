'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Html, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface BlenderModelProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  animationName?: string;
  autoPlay?: boolean;
  onClick?: () => void;
  hoverColor?: string;
  emissiveIntensity?: number;
}

// Enhanced Blender Model Component with Animation Support
export const BlenderModel: React.FC<BlenderModelProps> = ({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  animationName,
  autoPlay = true,
  onClick,
  hoverColor,
  emissiveIntensity = 0.2
}) => {
  const modelRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelExists, setModelExists] = useState(false);

  // Check if model exists before trying to load
  useEffect(() => {
    const checkModel = async () => {
      try {
        const response = await fetch(modelPath, { method: 'HEAD' });
        if (response.ok) {
          setModelExists(true);
        } else {
          setModelExists(false);
          setError('Model file not found');
        }
      } catch {
        setModelExists(false);
        setError('Failed to check model');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkModel();
  }, [modelPath]);

  // Only try to load GLTF if model exists
  let scene, animations, actions;
  
  if (modelExists) {
    try {
      const gltfResult = useGLTF(modelPath, true, true, (loader) => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        loader.setDRACOLoader(dracoLoader);
      });
      
      scene = gltfResult.scene;
      animations = gltfResult.animations;
      
      const animationResult = useAnimations(animations, modelRef);
      actions = animationResult.actions;
    } catch (err) {
      console.warn(`Failed to load Blender model: ${modelPath}`, err);
      setError('Failed to load model');
    }
  }

  useEffect(() => {
    if (scene && actions) {
      // Play animation if specified
      if (animationName && actions[animationName] && autoPlay) {
        actions[animationName].play();
      }

      // Apply hover effects to all meshes
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Store original material for hover effects
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material.clone();
          }
        }
      });
    }
  }, [scene, animations, actions, animationName, autoPlay]);

  // Handle hover effects
  useEffect(() => {
    if (scene && hoverColor) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (hovered) {
            child.material.emissive.setHex(hoverColor);
            child.material.emissiveIntensity = emissiveIntensity;
          } else if (child.userData.originalMaterial) {
            child.material.emissive.copy(child.userData.originalMaterial.emissive || new THREE.Color(0x000000));
            child.material.emissiveIntensity = child.userData.originalMaterial.emissiveIntensity || 0;
          }
        }
      });
    }
  }, [hovered, hoverColor, emissiveIntensity, scene]);

  // Animation frame updates
  useFrame((state) => {
    if (modelRef.current && !hovered) {
      // Subtle idle animation
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      modelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  if (error || !modelExists) {
    return (
      <Html position={position} center>
        <div className="bg-yellow-500/80 backdrop-blur-sm rounded px-3 py-2 text-white text-xs">
          Blender model not available - using fallback
        </div>
      </Html>
    );
  }

  return (
    <group
      ref={modelRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = onClick ? 'pointer' : 'default';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {scene && modelExists && <primitive object={scene} />}
      
      {isLoading && (
        <Html center>
          <div className="bg-blue-500/80 backdrop-blur-sm rounded px-3 py-2 text-white text-xs">
            Loading Blender Model...
          </div>
        </Html>
      )}
    </group>
  );
};

// Preload models for better performance
export const preloadBlenderModels = (modelPaths: string[]) => {
  modelPaths.forEach(path => useGLTF.preload(path));
};

// Blender Scene Manager for complex scenes
export const BlenderSceneManager: React.FC<{
  scenePath: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  children?: React.ReactNode;
}> = ({ scenePath, position = [0, 0, 0], scale = [1, 1, 1], children }) => {
  const [sceneExists, setSceneExists] = useState(false);
  
  // Check if scene file exists before trying to load
  useEffect(() => {
    const checkScene = async () => {
      try {
        const response = await fetch(scenePath, { method: 'HEAD' });
        setSceneExists(response.ok);
      } catch {
        setSceneExists(false);
      }
    };
    
    // For now, scenes don't exist, so always return false
    setSceneExists(false);
    // Uncomment when you have actual scene files:
    // checkScene();
  }, [scenePath]);

  // If scene doesn't exist, just render children without the scene
  if (!sceneExists) {
    return (
      <group position={position} scale={scale}>
        {children}
      </group>
    );
  }

  const { scene } = useGLTF(scenePath);

  useEffect(() => {
    if (scene) {
      // Optimize the scene
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Optimize materials
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 0.5;
          }
        }
      });
    }
  }, [scene]);

  return (
    <group position={position} scale={scale}>
      {scene && <primitive object={scene} />}
      {children}
    </group>
  );
};

// Advanced Animation Controller
export const BlenderAnimationController: React.FC<{
  model: THREE.Group | null;
  animations: THREE.AnimationClip[];
  currentAnimation: string;
  onAnimationComplete?: () => void;
}> = ({ model, animations, currentAnimation, onAnimationComplete }) => {
  const { actions } = useAnimations(animations, model);
  const [prevAnimation, setPrevAnimation] = useState<string>('');

  useEffect(() => {
    if (actions[currentAnimation]) {
      // Stop previous animation
      if (prevAnimation && actions[prevAnimation]) {
        actions[prevAnimation].fadeOut(0.3);
      }

      // Play current animation
      actions[currentAnimation].reset().fadeIn(0.3).play();
      setPrevAnimation(currentAnimation);

      // Handle animation completion
      if (onAnimationComplete) {
        const mixer = actions[currentAnimation].getMixer();
        const onFinished = () => {
          onAnimationComplete();
          mixer.removeEventListener('finished', onFinished);
        };
        mixer.addEventListener('finished', onFinished);
      }
    }
  }, [currentAnimation, actions, prevAnimation, onAnimationComplete]);

  return null;
};

export default BlenderModel;
