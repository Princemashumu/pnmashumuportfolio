'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Brain, Database, Terminal, Rocket, Wifi, Shield, Cpu, Zap, Activity, Monitor } from 'lucide-react';
import anime from 'animejs';

// Room Components
import ServerRoom from './rooms/ServerRoom';
import DatabaseRoom from './rooms/DatabaseRoom';
import CodeLaboratory from './rooms/CodeLaboratory';
import MainServerCore from './rooms/MainServerCore';
import ProjectWarehouse from './rooms/ProjectWarehouse';
import CommunicationHub from './rooms/CommunicationHub';
import SystemStatus from './rooms/SystemStatus';
import ThreeEnvironment from './ThreeEnvironment';
import RobotGuide from './RobotGuide';

const ServerHouse: React.FC = () => {
  const robotRef = useRef<HTMLDivElement>(null);
  const hologramRef = useRef<HTMLDivElement>(null);

  // Advanced State Management
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [robotMode, setRobotMode] = useState<'idle' | 'scanning' | 'processing' | 'presenting'>('idle');
  const [systemStatus, setSystemStatus] = useState('BOOTING');
  const [aiVoiceActive, setAiVoiceActive] = useState(false);

  // Server House Layout
  const servers = [
    { 
      id: 'neural', 
      name: 'NEURAL CORE', 
      component: ServerRoom, 
      color: 'cyan', 
      position: { x: 0, y: 0, z: 200 },
      icon: Brain,
      description: 'AI-Powered About System',
      difficulty: 'LEGENDARY'
    },
    { 
      id: 'quantum', 
      name: 'QUANTUM DB', 
      component: DatabaseRoom, 
      color: 'green', 
      position: { x: -400, y: 100, z: 0 },
      icon: Database,
      description: 'Advanced Data Architecture',
      difficulty: 'EXPERT'
    },
    { 
      id: 'matrix', 
      name: 'CODE MATRIX', 
      component: CodeLaboratory, 
      color: 'purple', 
      position: { x: 400, y: 100, z: 0 },
      icon: Terminal,
      description: 'Development Nexus',
      difficulty: 'MASTER'
    },
    { 
      id: 'fusion', 
      name: 'PROJECT FUSION', 
      component: ProjectWarehouse, 
      color: 'yellow', 
      position: { x: -300, y: -100, z: -300 },
      icon: Rocket,
      description: 'Innovation Showcase',
      difficulty: 'PRO'
    },
    { 
      id: 'nexus', 
      name: 'COMM NEXUS', 
      component: CommunicationHub, 
      color: 'pink', 
      position: { x: 300, y: -100, z: -300 },
      icon: Wifi,
      description: 'Communication Hub',
      difficulty: 'ADVANCED'
    },
    { 
      id: 'sentinel', 
      name: 'SYSTEM SENTINEL', 
      component: SystemStatus, 
      color: 'blue', 
      position: { x: 0, y: -200, z: -500 },
      icon: Shield,
      description: 'Monitoring Console',
      difficulty: 'ELITE'
    }
  ];

  // Competitive AI Module Handler
  const handleModuleAccess = useCallback((moduleId: string) => {
    setRobotMode('scanning');
    
    // AI Voice Activation
    setAiVoiceActive(true);
    setTimeout(() => setAiVoiceActive(false), 3000);

    if (selectedModule === moduleId) {
      // Close module
      setSelectedModule(null);
      setIsModuleOpen(false);
      setRobotMode('idle');
      
      // Advanced closing animation
      anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
      })
      .add({
        targets: `.robot-module-${moduleId}`,
        scale: [1.5, 1],
        rotateY: [45, 0],
        translateY: [0, 0]
      })
      .add({
        targets: `.module-hologram-${moduleId}`,
        opacity: [1, 0],
        scale: [1, 0],
        rotateZ: [0, 360]
      }, '-=500');
      
    } else {
      // Open new module
      setSelectedModule(moduleId);
      setIsModuleOpen(true);
      setRobotMode('presenting');
      
      // Revolutionary opening animation
      anime.timeline({
        easing: 'easeOutElastic(1, .8)',
        duration: 1200
      })
      .add({
        targets: `.robot-module-${moduleId}`,
        scale: [1, 1.5],
        rotateY: [0, 45],
        translateY: [0, -50],
        boxShadow: [`0 0 20px rgba(0,255,255,0.3)`, `0 0 50px rgba(0,255,255,0.8)`]
      })
      .add({
        targets: `.module-hologram-${moduleId}`,
        opacity: [0, 1],
        scale: [0, 1],
        rotateY: [180, 0]
      }, '-=600');

      // Close other modules
      servers.forEach(server => {
        if (server.id !== moduleId) {
          anime({
            targets: `.robot-module-${server.id}`,
            scale: [1.5, 1],
            rotateY: [45, 0],
            translateY: [-50, 0],
            duration: 800,
            easing: 'easeOutCubic'
          });
        }
      });
    }
  }, [selectedModule, servers]);

  // Server Click Handler (passed to ThreeEnvironment)
  const handleServerClick = useCallback((serverId: string) => {
    if (selectedServer === serverId) {
      // Close server
      setSelectedServer(null);
      setRobotMode('idle');
      
      anime({
        targets: '.server-content',
        opacity: [1, 0],
        translateY: [0, 50],
        duration: 500,
        easing: 'easeInQuart'
      });
      
    } else {
      // Open new server
      setSelectedServer(serverId);
      setRobotMode('processing');
      
      anime({
        targets: '.server-content',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        easing: 'easeOutQuart'
      });
    }
  }, [selectedServer]);

  // Get selected server component
  const selectedServerData = servers.find(s => s.id === selectedServer);
  const SelectedServerComponent = selectedServerData?.component;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js 3D Environment */}
      <ThreeEnvironment 
        servers={servers}
        selectedServer={selectedServer}
        onServerClick={handleServerClick}
      />
      
      {/* Advanced UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top HUD */}
        <div className="absolute top-4 left-4 right-4 z-50 pointer-events-auto">
          <div className="flex justify-between items-center">
            {/* Left Control Panel */}
            <div className="bg-black/80 border border-cyan-500/50 rounded-lg p-4 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span className="text-cyan-300 text-sm font-mono">NEURAL-OS v3.0</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 text-sm font-mono">ACTIVE</span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-blue-400" />
                <div className="text-cyan-300 text-sm">
                  {selectedServer ? `🎯 ${servers.find(m => m.id === selectedServer)?.name}` : '🤖 AI READY'}
                </div>
              </div>
            </div>

            {/* Right Status Panel */}
            <div className="bg-black/80 border border-cyan-500/50 rounded-lg p-4 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-300 text-sm font-mono">THREE.JS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${robotMode === 'idle' ? 'bg-green-400' : 'bg-cyan-400 animate-pulse'}`} />
                  <span className="text-cyan-300 text-sm font-mono">{robotMode.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Server Content Panel */}
        {selectedServer && SelectedServerComponent && (
          <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-auto">
            <div className="server-content bg-black/90 border-2 border-cyan-500/50 rounded-2xl p-8 max-w-4xl max-h-[80vh] overflow-auto backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {selectedServerData.icon && (
                    <selectedServerData.icon className="w-8 h-8 text-cyan-400" />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-cyan-300">{selectedServerData.name}</h2>
                    <p className="text-cyan-500">{selectedServerData.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleServerClick(selectedServer)}
                  className="px-4 py-2 bg-red-600/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-600/30 transition-all"
                >
                  CLOSE
                </button>
              </div>
              <SelectedServerComponent />
            </div>
          </div>
        )}

        {/* Robot Guide */}
        <div className="absolute bottom-4 right-4 z-50">
          <RobotGuide 
            position={{ x: 0, y: 0 }}
            isMoving={robotMode !== 'idle'}
            onReturnHome={() => {
              setSelectedServer(null);
              setRobotMode('idle');
            }}
          />
        </div>
      </div>

      {/* Holographic UI Effects */}
      <div 
        ref={hologramRef}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Scanning lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ServerHouse;
