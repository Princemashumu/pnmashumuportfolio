'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import anime from 'animejs';

interface Environment3DProps {
  onServerClick?: (serverId: string) => void;
  selectedServer?: string | null;
  servers: Array<{
    id: string;
    name: string;
    color: string;
    position: { x: number; y: number; z: number };
  }>;
}

const Environment3D: React.FC<Environment3DProps> = ({ 
  onServerClick, 
  selectedServer, 
  servers 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const serverMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const raycasterRef = useRef<THREE.Raycaster>();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Three.js scene
  const initThreeJS = useCallback(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 50, 2000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 200, 800);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Raycaster for mouse interactions
    raycasterRef.current = new THREE.Raycaster();

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    setupLighting(scene);
    
    // Create environment
    createEnvironment(scene);
    
    // Create server towers
    createServerTowers(scene);

    // Start render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    setIsInitialized(true);
  }, []);

  // Setup advanced lighting
  const setupLighting = (scene: THREE.Scene) => {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0x00ffff, 1.5);
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    scene.add(directionalLight);

    // Accent lights for atmosphere
    const accentLight1 = new THREE.PointLight(0xff00ff, 0.8, 300);
    accentLight1.position.set(-200, 150, 200);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0x00ff00, 0.6, 300);
    accentLight2.position.set(200, 150, -200);
    scene.add(accentLight2);

    // Animated rim light
    const rimLight = new THREE.PointLight(0xffffff, 1, 400);
    rimLight.position.set(0, 300, 0);
    scene.add(rimLight);

    // Animate rim light
    const animateRimLight = () => {
      const time = Date.now() * 0.001;
      rimLight.position.x = Math.sin(time * 0.5) * 200;
      rimLight.position.z = Math.cos(time * 0.5) * 200;
      rimLight.intensity = 0.8 + Math.sin(time * 2) * 0.3;
    };

    const animate = () => {
      animateRimLight();
      requestAnimationFrame(animate);
    };
    animate();
  };

  // Create quantum environment
  const createEnvironment = (scene: THREE.Scene) => {
    // Holographic floor
    const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    const floorMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x00ffff) },
        color2: { value: new THREE.Color(0xff00ff) }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Create wave effect
          float wave = sin(pos.x * 0.02 + time) * sin(pos.y * 0.02 + time * 1.5) * 10.0;
          pos.z += wave;
          vWave = wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          vec2 grid = fract(vUv * 50.0) - 0.5;
          float gridLine = smoothstep(0.0, 0.1, abs(grid.x)) * smoothstep(0.0, 0.1, abs(grid.y));
          
          vec3 color = mix(color1, color2, sin(time + vWave * 0.1) * 0.5 + 0.5);
          float alpha = (1.0 - gridLine) * 0.3 + abs(vWave) * 0.02;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -200;
    scene.add(floor);

    // Animate floor
    const animateFloor = () => {
      floorMaterial.uniforms.time.value = Date.now() * 0.001;
      requestAnimationFrame(animateFloor);
    };
    animateFloor();

    // Quantum particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2000;
      positions[i + 1] = Math.random() * 800;
      positions[i + 2] = (Math.random() - 0.5) * 2000;

      const colorIndex = i / 3;
      colors[colorIndex * 3] = Math.random();
      colors[colorIndex * 3 + 1] = Math.random() * 0.5 + 0.5;
      colors[colorIndex * 3 + 2] = 1;

      sizes[colorIndex] = Math.random() * 5 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x * 0.01) * 0.3);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          if (distanceToCenter > 0.5) discard;
          
          float alpha = 1.0 - distanceToCenter * 2.0;
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animate particles
    const animateParticles = () => {
      particleMaterial.uniforms.time.value = Date.now() * 0.001;
      particles.rotation.y += 0.001;
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  };

  // Create 3D server towers
  const createServerTowers = (scene: THREE.Scene) => {
    servers.forEach((server, index) => {
      const serverGroup = new THREE.Group();
      
      // Main server body
      const bodyGeometry = new THREE.BoxGeometry(80, 120, 40);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: getServerColor(server.color),
        transparent: true,
        opacity: 0.9,
        emissive: new THREE.Color(getServerColor(server.color)).multiplyScalar(0.1)
      });
      
      const serverBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
      serverBody.castShadow = true;
      serverBody.receiveShadow = true;
      serverGroup.add(serverBody);

      // Server lights/indicators
      for (let i = 0; i < 8; i++) {
        const lightGeometry = new THREE.SphereGeometry(2, 8, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({
          color: getServerColor(server.color),
          emissive: new THREE.Color(getServerColor(server.color)).multiplyScalar(0.5)
        });
        
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(-35, 45 - i * 12, 25);
        serverGroup.add(light);

        // Animate lights
        anime({
          targets: light.material,
          opacity: [1, 0.3, 1],
          duration: 2000 + Math.random() * 1000,
          delay: Math.random() * 1000,
          loop: true,
          easing: 'easeInOutSine'
        });
      }

      // Holographic display
      const displayGeometry = new THREE.PlaneGeometry(60, 80);
      const displayMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(getServerColor(server.color)) }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          varying vec2 vUv;
          
          void main() {
            vec2 uv = vUv;
            float scanline = sin(uv.y * 100.0 + time * 10.0) * 0.1 + 0.9;
            float flicker = sin(time * 30.0) * 0.05 + 0.95;
            
            vec3 finalColor = color * scanline * flicker;
            float alpha = 0.7 * (0.8 + sin(time * 5.0) * 0.2);
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide
      });

      const display = new THREE.Mesh(displayGeometry, displayMaterial);
      display.position.set(0, 10, 25);
      serverGroup.add(display);

      // Animate display
      const animateDisplay = () => {
        displayMaterial.uniforms.time.value = Date.now() * 0.001;
        requestAnimationFrame(animateDisplay);
      };
      animateDisplay();

      // Position server
      serverGroup.position.set(
        server.position.x,
        server.position.y,
        server.position.z
      );

      // Add hover animation
      serverGroup.userData = { serverId: server.id, originalPosition: { ...server.position } };
      
      scene.add(serverGroup);
      serverMeshesRef.current.set(server.id, serverGroup);
    });
  };

  // Get Three.js color from string
  const getServerColor = (color: string): number => {
    const colorMap: { [key: string]: number } = {
      cyan: 0x00ffff,
      green: 0x00ff00,
      purple: 0x9333ea,
      yellow: 0xffff00,
      pink: 0xff1493,
      blue: 0x0080ff
    };
    return colorMap[color] || 0x00ffff;
  };

  // Handle mouse interactions
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    if (mouseRef.current.isDown) {
      // Camera rotation
      const deltaX = event.clientX - mouseRef.current.x;
      const deltaY = event.clientY - mouseRef.current.y;
      
      if (cameraRef.current) {
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(cameraRef.current.position);
        spherical.theta -= deltaX * 0.005;
        spherical.phi += deltaY * 0.005;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
        
        cameraRef.current.position.setFromSpherical(spherical);
        cameraRef.current.lookAt(0, 0, 0);
      }
    } else {
      // Hover detection
      if (raycasterRef.current && cameraRef.current) {
        raycasterRef.current.setFromCamera(mouse, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);
        
        // Reset all servers
        serverMeshesRef.current.forEach((group) => {
          anime({
            targets: group.scale,
            x: 1,
            y: 1,
            z: 1,
            duration: 300,
            easing: 'easeOutCubic'
          });
        });

        // Highlight hovered server
        if (intersects.length > 0) {
          let parent = intersects[0].object.parent;
          while (parent && !parent.userData.serverId) {
            parent = parent.parent;
          }
          
          if (parent && parent.userData.serverId) {
            anime({
              targets: parent.scale,
              x: 1.1,
              y: 1.1,
              z: 1.1,
              duration: 300,
              easing: 'easeOutCubic'
            });
            
            rendererRef.current.domElement.style.cursor = 'pointer';
          } else {
            rendererRef.current.domElement.style.cursor = 'default';
          }
        }
      }
    }

    mouseRef.current.x = event.clientX;
    mouseRef.current.y = event.clientY;
  }, []);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.x = event.clientX;
    mouseRef.current.y = event.clientY;
  }, []);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (!mouseRef.current.isDown) return;
    
    mouseRef.current.isDown = false;
    
    // Check for server clicks
    if (!raycasterRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = rendererRef.current!.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycasterRef.current.setFromCamera(mouse, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      let parent = intersects[0].object.parent;
      while (parent && !parent.userData.serverId) {
        parent = parent.parent;
      }
      
      if (parent && parent.userData.serverId && onServerClick) {
        onServerClick(parent.userData.serverId);
      }
    }
  }, [onServerClick]);

  const handleWheel = useCallback((event: WheelEvent) => {
    if (!cameraRef.current) return;
    
    event.preventDefault();
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(cameraRef.current.position);
    spherical.radius = Math.max(200, Math.min(1500, spherical.radius + event.deltaY * 2));
    
    cameraRef.current.position.setFromSpherical(spherical);
    cameraRef.current.lookAt(0, 0, 0);
  }, []);

  // Handle window resize
  const handleResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current) return;

    cameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
  }, []);

  // Animate selected server
  useEffect(() => {
    serverMeshesRef.current.forEach((group, serverId) => {
      if (serverId === selectedServer) {
        anime({
          targets: group.position,
          y: group.userData.originalPosition.y + 50,
          duration: 800,
          easing: 'easeOutElastic(1, .8)'
        });
        
        anime({
          targets: group.rotation,
          y: Math.PI * 2,
          duration: 2000,
          easing: 'easeOutCubic'
        });
      } else {
        anime({
          targets: group.position,
          y: group.userData.originalPosition.y,
          duration: 600,
          easing: 'easeOutCubic'
        });
        
        anime({
          targets: group.rotation,
          y: 0,
          duration: 1000,
          easing: 'easeOutCubic'
        });
      }
    });
  }, [selectedServer]);

  // Initialize and cleanup
  useEffect(() => {
    initThreeJS();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('wheel', handleWheel);
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [initThreeJS, handleResize, handleMouseMove, handleMouseDown, handleMouseUp, handleWheel]);

  return (
    <div 
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};

export default Environment3D;}
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
export default Environment3D;
