'use client';

import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { Server, Database, Code, FolderOpen, MessageSquare, Activity, Zap, Cpu, HardDrive } from 'lucide-react';
import RobotGuide from './RobotGuide';
import ParticleSystem from './ParticleSystem';
import RobotPath from './RobotPath';
import Environment3D from './Environment3D';
import MainServerCore from './rooms/MainServerCore';
import CodeLaboratory from './rooms/CodeLaboratory';
import DatabaseRoom from './rooms/DatabaseRoom';
import ProjectWarehouse from './rooms/ProjectWarehouse';
import CommunicationHub from './rooms/CommunicationHub';
import SystemStatus from './rooms/SystemStatus';

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
  const [showPath, setShowPath] = useState(false);
  const [pathStart, setPathStart] = useState({ x: 50, y: 50 });
  const [pathEnd, setPathEnd] = useState({ x: 50, y: 50 });
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
      anime({
        targets: '.server-room',
        scale: [0, 1],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(200),
        easing: 'easeOutQuart',
      });

      // Then animate floating rooms
      setTimeout(() => {
        anime({
          targets: '.floating-room',
          translateY: [50, 0],
          opacity: [0, 1],
          duration: 1000,
          delay: anime.stagger(150),
          easing: 'easeOutQuart',
        });
      }, 200);
    }
  }, [isMounted]);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room.id);
    setIsRobotMoving(true);
    
    // Set path coordinates
    const startPos = { x: robotPosition.x, y: robotPosition.y };
    const targetPos = { x: room.position.x, y: room.position.y };
    setPathStart(startPos);
    setPathEnd(targetPos);
    setShowPath(true);
    
    // Animate robot moving to the room
    anime({
      targets: '.robot-guide',
      translateX: `${targetPos.x - robotPosition.x}%`,
      translateY: `${targetPos.y - robotPosition.y}%`,
      duration: 1500,
      easing: 'easeInOutCubic',
      complete: () => {
        setRobotPosition({ x: targetPos.x, y: targetPos.y });
        setIsRobotMoving(false);
        // Robot opens the room
        setTimeout(() => {
          setShowRoomContent(true);
          // Animate room opening with 3D effect
          anime({
            targets: `.room-${room.id}`,
            scale: [1, 1.2, 1],
            rotateY: [0, 360],
            translateZ: [0, 50, 0],
            duration: 1000,
            easing: 'easeOutElastic',
          });
        }, 500);
      }
    });
  };

  const handlePathComplete = () => {
    setShowPath(false);
  };

  const closeRoom = () => {
    setShowRoomContent(false);
    setSelectedRoom(null);
    setShowPath(false);
    
    // Set return path
    setPathStart({ x: robotPosition.x, y: robotPosition.y });
    setPathEnd({ x: 50, y: 50 });
    setShowPath(true);
    setIsRobotMoving(true);
    
    // Return robot to center
    anime({
      targets: '.robot-guide',
      translateX: '0%',
      translateY: '0%',
      duration: 1000,
      easing: 'easeInOutCubic',
      complete: () => {
        setIsRobotMoving(false);
        setShowPath(false);
      }
    });
    
    setRobotPosition({ x: 50, y: 50 });
  };

  // Handle navigation between rooms
  const handleRoomNavigation = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(roomId);
      setRobotPosition({ x: room.position.x, y: room.position.y });
      setShowRoomContent(true);
    }
  };

  // Render room content based on selected room
  const renderRoomContent = () => {
    switch (selectedRoom) {
      case 'main-server':
        return <MainServerCore onNavigateToRoom={handleRoomNavigation} />;
      case 'database':
        return <DatabaseRoom />;
      case 'code-lab':
        return <CodeLaboratory />;
      case 'projects':
        return <ProjectWarehouse />;
      case 'communication':
        return <CommunicationHub />;
      case 'status':
        return <SystemStatus />;
      default:
        return (
          <div className="text-gray-300 p-8">
            <p>Room content will be loaded here...</p>
            <p className="mt-4 text-sm text-cyan-400">
              This is where the specific room content will be displayed with animations and interactive elements.
            </p>
          </div>
        );
    }
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
    <Environment3D isRoomOpen={showRoomContent} selectedRoom={selectedRoom || undefined}>
      <div ref={landingRef} className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Particle System Background */}
        <ParticleSystem />
        
        {/* Robot Path Animation */}
        {showPath && (
          <RobotPath
            startPosition={pathStart}
            endPosition={pathEnd}
            isAnimating={showPath}
            onPathComplete={handlePathComplete}
          />
        )}
        
        {/* Main Server House Interface */}
        <div className="relative z-10 h-screen flex flex-col transform-3d">
          {/* Header */}
         

          {/* Interactive Room Layout */}
          <div ref={roomsRef} className="flex-1 relative perspective-1000">
            {/* Robot Guide */}
            <RobotGuide 
              position={robotPosition}
              isMoving={isRobotMoving}
            onReturnHome={closeRoom}
          />

          {/* Floating Room Icons */}
          {rooms.map((room) => {
            const IconComponent = room.icon;
            return (
              <div
                key={room.id}
                className={`floating-room room-${room.id} absolute cursor-pointer transform hover:scale-110 transition-all duration-300 room-3d float-3d`}
                style={{
                  left: `${room.position.x}%`,
                  top: `${room.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${Math.random() * 2}s`
                }}
                onClick={() => handleRoomClick(room)}
              >
                {/* Room Container */}
                <div className={`relative group hologram-effect`}>
                  {/* Glowing Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${room.color} rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300 path-glow`} />
                  
                  {/* Room Icon */}
                  <div className="relative bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/20 group-hover:border-white/40 transition-all duration-300 transform-3d">
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center py-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-7xl w-full mx-4 border border-cyan-500/20 relative">
              {/* Close button */}
              <button
                onClick={closeRoom}
                className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white transition-colors text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ✕
              </button>
              
              {/* Room content */}
              <div className="w-full">
                {renderRoomContent()}
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
    </Environment3D>
  );
};

export default ServerHouseLanding;
