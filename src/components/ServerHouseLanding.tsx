'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate, stagger, createTimeline } from 'animejs';
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
  const landingRef = useRef<HTMLDivElement>(null);
  const roomsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rooms: Room[] = [
    {
      id: 'main-server',
      name: 'Main Server Core',
      icon: Server,
      position: { x: 20, y: 30 },
      description: 'Central processing hub - About & Skills',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'database',
      name: 'Data Storage',
      icon: Database,
      position: { x: 70, y: 20 },
      description: 'Information repository - Experience & Education',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'code-lab',
      name: 'Development Lab',
      icon: Code,
      position: { x: 30, y: 70 },
      description: 'Innovation center - Technical Skills',
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'projects',
      name: 'Project Warehouse',
      icon: FolderOpen,
      position: { x: 80, y: 65 },
      description: 'Portfolio showcase - My Work',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'communication',
      name: 'Communication Hub',
      icon: MessageSquare,
      position: { x: 60, y: 80 },
      description: 'Contact center - Get in Touch',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'status',
      name: 'System Monitor',
      icon: Activity,
      position: { x: 15, y: 80 },
      description: 'Performance metrics - Current Status',
      color: 'from-yellow-500 to-amber-600'
    }
  ];

  useEffect(() => {
    // Initial animation for the landing page
    if (isMounted && landingRef.current) {
      // Animate server room elements first
      animate({
        targets: '.server-room',
        scale: [0, 1],
        opacity: [0, 1],
        duration: 800,
        delay: stagger(200),
        easing: 'easeOutQuart',
      });

      // Then animate floating rooms
      setTimeout(() => {
        animate({
          targets: '.floating-room',
          translateY: [50, 0],
          opacity: [0, 1],
          duration: 1000,
          delay: stagger(150),
          easing: 'easeOutQuart',
        });
      }, 200);
    }
  }, [isMounted]);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room.id);
    
    // Animate robot moving to the room
    const targetX = room.position.x;
    const targetY = room.position.y;
    
    animate({
      targets: '.robot-guide',
      translateX: `${targetX - robotPosition.x}%`,
      translateY: `${targetY - robotPosition.y}%`,
      duration: 1500,
      easing: 'easeInOutCubic',
      complete: () => {
        setRobotPosition({ x: targetX, y: targetY });
        // Robot opens the room
        setTimeout(() => {
          setShowRoomContent(true);
          // Animate room opening
          animate({
            targets: `.room-${room.id}`,
            scale: [1, 1.2, 1],
            rotateZ: [0, 360],
            duration: 1000,
            easing: 'easeOutElastic(1, .8)',
          });
        }, 500);
      }
    });
  };

  const closeRoom = () => {
    setShowRoomContent(false);
    setSelectedRoom(null);
    
    // Return robot to center
    animate({
      targets: '.robot-guide',
      translateX: '0%',
      translateY: '0%',
      duration: 1000,
      easing: 'easeInOutCubic',
    });
    
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
        {/* Header */}
        <div className="text-center pt-20 pb-10">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 server-room">
            SERVER HOUSE
          </h1>
          <p className="text-xl text-gray-300 mb-8 server-room">
            Navigate through my digital infrastructure
          </p>
          <div className="flex justify-center space-x-4 text-sm text-cyan-400 server-room">
            <div className="flex items-center space-x-2">
              <Zap size={16} className="animate-pulse" />
              <span>System Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu size={16} className="animate-pulse" />
              <span>6 Rooms Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <HardDrive size={16} className="animate-pulse" />
              <span>Ready for Exploration</span>
            </div>
          </div>
        </div>

        {/* Interactive Room Layout */}
        <div ref={roomsRef} className="flex-1 relative">
          {/* Robot Guide */}
          <RobotGuide 
            position={robotPosition}
            isMoving={selectedRoom !== null}
            onReturnHome={closeRoom}
          />

          {/* Floating Room Icons */}
          {rooms.map((room) => {
            const IconComponent = room.icon;
            return (
              <div
                key={room.id}
                className={`floating-room room-${room.id} absolute cursor-pointer transform hover:scale-110 transition-all duration-300`}
                style={{
                  left: `${room.position.x}%`,
                  top: `${room.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleRoomClick(room)}
              >
                {/* Room Container */}
                <div className={`relative group`}>
                  {/* Glowing Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${room.color} rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
                  
                  {/* Room Icon */}
                  <div className="relative bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/20 group-hover:border-white/40 transition-all duration-300">
                    <IconComponent size={32} className="text-white mb-3" />
                    <h3 className="text-white font-semibold text-sm whitespace-nowrap">{room.name}</h3>
                    <p className="text-gray-400 text-xs mt-1 max-w-24 leading-tight">{room.description}</p>
                  </div>

                  {/* Hover Effects */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>

                {/* Connection Lines (Optional) */}
                <div className="absolute top-1/2 left-1/2 w-px h-20 bg-gradient-to-b from-cyan-500/50 to-transparent transform -translate-x-1/2 -translate-y-full opacity-30" />
              </div>
            );
          })}

          {/* Central Server Core */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 server-room">
            <div className="relative">
              {/* Central Hub */}
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
                <Server size={40} className="text-white animate-pulse" />
              </div>
              
              {/* Orbiting Elements */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
                <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-pink-400 rounded-full animate-pulse" />
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center pb-10">
          <p className="text-gray-400 text-sm server-room">
            Click on any room to explore • Watch the robot guide you through the server house
          </p>
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
