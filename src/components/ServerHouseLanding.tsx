'use client';

import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { Server, Database, Code, FolderOpen, MessageSquare, Activity, Zap, Cpu, HardDrive } from 'lucide-react';
import RobotGuide from './RobotGuide';
import ParticleSystem from './ParticleSystem';

interface Room {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  position: { x: number; y: number };
  description: string;
  color: string;
}

const ServerHouseLanding: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [robotPosition, setRobotPosition] = useState({ x: 50, y: 50 });
  const [showRoomContent, setShowRoomContent] = useState(false);
  const [isRobotMoving, setIsRobotMoving] = useState(false);
  const landingRef = useRef<HTMLDivElement>(null);
  const roomsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rooms: Room[] = [
    {
      id: 'main-server',
      name: 'Server Room 01',
      icon: Server,
      position: { x: 20, y: 30 },
      description: 'Main Server Core - About & Skills',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'database',
      name: 'Server Room 02',
      icon: Database,
      position: { x: 70, y: 20 },
      description: 'Database Server - Experience & Education',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'code-lab',
      name: 'Server Room 03',
      icon: Code,
      position: { x: 30, y: 70 },
      description: 'Development Server - Technical Skills',
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'projects',
      name: 'Server Room 04',
      icon: FolderOpen,
      position: { x: 80, y: 65 },
      description: 'Project Server - Portfolio Showcase',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'communication',
      name: 'Server Room 05',
      icon: MessageSquare,
      position: { x: 60, y: 80 },
      description: 'Communication Server - Contact Hub',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'status',
      name: 'Server Room 06',
      icon: Activity,
      position: { x: 15, y: 80 },
      description: 'Monitoring Server - System Status',
      color: 'from-yellow-500 to-amber-600'
    }
  ];

  useEffect(() => {
    // Initial animation for the landing page
    if (isMounted && landingRef.current) {
      // Create robotic startup sequence
      const startupTimeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 750
      });

      // Power-on sequence
      startupTimeline
        .add({
          targets: '.power-indicator',
          scale: [0, 1.2, 1],
          opacity: [0, 1],
          rotate: [0, 180],
          duration: 1000,
          delay: anime.stagger(100)
        })
        .add({
          targets: '.server-room',
          translateY: [100, 0],
          opacity: [0, 1],
          scale: [0.8, 1],
          rotate: [5, 0],
          duration: 800,
          delay: anime.stagger(150, {start: 300})
        })
        .add({
          targets: '.floating-room',
          translateY: [50, 0],
          opacity: [0, 1],
          scale: [0.9, 1],
          rotateZ: [10, 0],
          duration: 1200,
          delay: anime.stagger(100, {from: 'center'})
        }, '-=400')
        .add({
          targets: '.central-core',
          scale: [0, 1],
          rotate: [0, 360],
          opacity: [0, 1],
          duration: 1500,
          easing: 'easeOutElastic(1, .8)'
        }, '-=800');

      // Continuous robotic animations
      anime({
        targets: '.orbital-element',
        rotate: 360,
        duration: 8000,
        loop: true,
        easing: 'linear'
      });

      anime({
        targets: '.data-stream',
        translateX: ['100%', '-100%'],
        duration: 3000,
        loop: true,
        delay: anime.stagger(500),
        easing: 'linear'
      });

      anime({
        targets: '.hologram-effect',
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.05, 1],
        duration: 2000,
        loop: true,
        delay: anime.stagger(200),
        easing: 'easeInOutSine'
      });
    }
  }, [isMounted]);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room.id);
    setIsRobotMoving(true);
    
    // Create robotic movement sequence
    const robotMoveTimeline = anime.timeline({
      easing: 'easeInOutCubic'
    });

    // Robot activation sequence
    robotMoveTimeline
      .add({
        targets: '.robot-guide',
        scale: [1, 1.1, 1],
        rotateZ: [0, 10, -10, 0],
        duration: 500
      })
      .add({
        targets: '.robot-guide',
        translateX: `${room.position.x - robotPosition.x}%`,
        translateY: `${room.position.y - robotPosition.y}%`,
        duration: 2000,
        complete: () => {
          setRobotPosition({ x: room.position.x, y: room.position.y });
          setIsRobotMoving(false);
          
          // Robotic room unlock sequence
          setTimeout(() => {
            setShowRoomContent(true);
            anime({
              targets: `.room-${room.id}`,
              scale: [1, 1.2, 1],
              rotateZ: [0, 5, -5, 0],
              duration: 1000,
              easing: 'easeOutElastic(1, .8)',
            });
          }, 500);
        }
      }, '-=200');
  };

  const closeRoom = () => {
    setShowRoomContent(false);
    setSelectedRoom(null);
    setIsRobotMoving(true);
    
    // Robotic return sequence
    const returnTimeline = anime.timeline({
      easing: 'easeInOutCubic'
    });

    returnTimeline
      .add({
        targets: '.robot-guide',
        scale: [1, 0.9, 1.1, 1],
        rotateZ: [0, -15, 15, 0],
        duration: 600
      })
      .add({
        targets: '.robot-guide',
        translateX: '0%',
        translateY: '0%',
        duration: 1500,
        complete: () => {
          setIsRobotMoving(false);
        }
      }, '-=300');
    
    setRobotPosition({ x: 50, y: 50 });
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Server House...</div>
      </div>
    );
  }

  return (
    <div ref={landingRef} className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Particle System Background */}
      <ParticleSystem />
      
      {/* Main Server House Interface */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header with Robotic Elements */}
        <div className="text-center pt-20 pb-10 relative">
          {/* Power Indicators */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <div className="power-indicator w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <div className="power-indicator w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
            <div className="power-indicator w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
          </div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 server-room relative">
            ◉ ROBOTIC SERVER HOUSE ◉
            {/* Data Streams */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="data-stream absolute top-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"></div>
              <div className="data-stream absolute top-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30" style={{animationDelay: '1s'}}></div>
            </div>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 server-room hologram-effect">
            🤖 Navigate through my autonomous digital infrastructure
          </p>
          
          <div className="flex justify-center space-x-6 text-sm text-cyan-400 server-room">
            <div className="flex items-center space-x-2 bg-black/30 px-3 py-2 rounded-lg border border-cyan-500/30 hologram-effect">
              <Zap size={16} className="animate-pulse" />
              <span className="font-mono">SYSTEMS ONLINE</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/30 px-3 py-2 rounded-lg border border-purple-500/30 hologram-effect">
              <Cpu size={16} className="animate-pulse" />
              <span className="font-mono">6 NODES ACTIVE</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/30 px-3 py-2 rounded-lg border border-pink-500/30 hologram-effect">
              <HardDrive size={16} className="animate-pulse" />
              <span className="font-mono">READY FOR ACCESS</span>
            </div>
          </div>

          {/* Robotic Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="grid grid-cols-12 grid-rows-8 h-full w-full gap-1">
              {[...Array(96)].map((_, i) => (
                <div key={i} className="border border-cyan-400/20"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Room Layout */}
        <div ref={roomsRef} className="flex-1 relative">
          {/* Robot Guide */}
          <RobotGuide 
            position={robotPosition}
            isMoving={isRobotMoving}
            onReturnHome={closeRoom}
          />

          {/* Server Racks */}
          {rooms.map((room, index) => {
            const IconComponent = room.icon;
            return (
              <div
                key={room.id}
                className={`floating-room room-${room.id} absolute cursor-pointer transform hover:scale-105 transition-all duration-300 group`}
                style={{
                  left: `${room.position.x}%`,
                  top: `${room.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleRoomClick(room)}
              >
                {/* Server Rack Container */}
                <div className="relative">
                  {/* Server Rack Base */}
                  <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-gray-600 shadow-2xl overflow-hidden">
                    {/* Server Rack Header */}
                    <div className={`bg-gradient-to-r ${room.color} px-4 py-2 flex items-center justify-between`}>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-bold text-sm">ROOM {String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <IconComponent size={16} className="text-white" />
                    </div>

                    {/* Server Slots */}
                    <div className="p-3 space-y-1">
                      {[...Array(4)].map((_, slotIndex) => (
                        <div key={slotIndex} className="flex items-center space-x-2 bg-black/30 rounded px-2 py-1">
                          {/* LED Indicators */}
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{animationDelay: `${slotIndex * 200}ms`}}></div>
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: `${slotIndex * 300}ms`}}></div>
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: `${slotIndex * 400}ms`}}></div>
                          </div>
                          {/* Server Slot Lines */}
                          <div className="flex-1 h-0.5 bg-gray-600 rounded"></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-sm animate-pulse"></div>
                        </div>
                      ))}
                    </div>

                    {/* Server Info Panel */}
                    <div className="px-3 pb-3">
                      <div className="bg-black/40 rounded px-2 py-1 text-center">
                        <div className="text-cyan-400 font-mono text-xs font-bold">{room.name}</div>
                        <div className="text-gray-400 text-xs mt-1 leading-tight">{room.description}</div>
                      </div>
                    </div>
                  </div>

                  {/* Server Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${room.color} rounded-lg blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10`}></div>
                  
                  {/* Connection Cables */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-4 bg-cyan-500 rounded-b-sm opacity-70"></div>
                      <div className="w-2 h-4 bg-green-500 rounded-b-sm opacity-70"></div>
                      <div className="w-2 h-4 bg-yellow-500 rounded-b-sm opacity-70"></div>
                    </div>
                  </div>

                  {/* Room Number Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-lg">
                    {index + 1}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Central Robotic Server Core */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 server-room central-core">
            <div className="relative">
              {/* Main Core Hub */}
              <div className="w-28 h-28 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl relative overflow-hidden">
                {/* Robotic Eye */}
                <div className="relative">
                  <Server size={44} className="text-white animate-pulse z-10" />
                  {/* Scanning Line */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent h-0.5 top-1/2 animate-ping"></div>
                </div>
                
                {/* Core Data Streams */}
                <div className="absolute inset-2 rounded-full border border-cyan-400/50 animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border border-purple-400/50 animate-spin-slow" style={{animationDirection: 'reverse'}}></div>
              </div>
              
              {/* Orbital Defense Satellites */}
              <div className="orbital-element absolute inset-0">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50 border-2 border-white/30">
                  <div className="absolute inset-1 bg-cyan-300 rounded-full animate-ping"></div>
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50 border-2 border-white/30">
                  <div className="absolute inset-1 bg-purple-300 rounded-full animate-ping"></div>
                </div>
                <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-6 h-6 bg-pink-400 rounded-full animate-pulse shadow-lg shadow-pink-400/50 border-2 border-white/30">
                  <div className="absolute inset-1 bg-pink-300 rounded-full animate-ping"></div>
                </div>
                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50 border-2 border-white/30">
                  <div className="absolute inset-1 bg-yellow-300 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Energy Field */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-600/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
              
              {/* Connection Matrix */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 border border-cyan-400/20 rounded-full animate-spin-slow"></div>
                <div className="absolute w-32 h-32 border border-purple-400/20 rounded-full animate-spin-slow" style={{animationDirection: 'reverse', animationDuration: '15s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Robotic Instructions Panel */}
        <div className="text-center pb-10 relative">
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl px-6 py-4 mx-auto max-w-2xl server-room hologram-effect">
            <p className="text-cyan-400 text-sm font-mono mb-2">
              🤖 ROBOTIC NAVIGATION PROTOCOL ACTIVE
            </p>
            <p className="text-gray-400 text-sm font-mono">
              › Click on any server node to deploy robot • Watch autonomous navigation sequence
            </p>
            <div className="mt-3 flex justify-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-mono">SYSTEMS READY</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-cyan-400">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="font-mono">AI GUIDE ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Terminal-style border */}
          <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-xl pointer-events-none animate-pulse"></div>
        </div>
      </div>

      {/* Room Content Modal */}
      {showRoomContent && selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 max-w-2xl w-full mx-4 border border-cyan-500/20">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">
                {rooms.find(r => r.id === selectedRoom)?.name}
              </h2>
              <button
                onClick={closeRoom}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="text-gray-300">
              <p>Room content will be loaded here...</p>
              <p className="mt-4 text-sm text-cyan-400">
                This is where the specific room content will be displayed with animations and interactive elements.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerHouseLanding;
