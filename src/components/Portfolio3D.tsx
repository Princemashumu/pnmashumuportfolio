'use client';

import React, { useState } from 'react';
import ThreeEnvironment from '@/components/ThreeEnvironment';
import MainServerCore from '@/components/rooms/MainServerCore';
import CodeLaboratory from '@/components/rooms/CodeLaboratory';
import DatabaseRoom from '@/components/rooms/DatabaseRoom';
import ProjectWarehouse from '@/components/rooms/ProjectWarehouse';
import CommunicationHub from '@/components/rooms/CommunicationHub';
import SystemStatus from '@/components/rooms/SystemStatus';

const Portfolio3D: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [robotPosition, setRobotPosition] = useState({ x: 50, y: 50 });
  const [isRobotMoving, setIsRobotMoving] = useState(false);
  const [showRoomContent, setShowRoomContent] = useState(false);

  const rooms = [
    {
      id: 'main-server-core',
      name: 'Main Server Core',
      icon: 'Server',
      position: { x: 50, y: 20 },
      description: 'About Prince - Professional profile and skills',
      color: '#4f46e5'
    },
    {
      id: 'code-laboratory',
      name: 'Code Laboratory',
      icon: 'Code',
      position: { x: 80, y: 35 },
      description: 'Development environment and coding projects',
      color: '#059669'
    },
    {
      id: 'database-room',
      name: 'Database Room',
      icon: 'Database',
      position: { x: 80, y: 65 },
      description: 'Data management and storage solutions',
      color: '#dc2626'
    },
    {
      id: 'project-warehouse',
      name: 'Project Warehouse',
      icon: 'FolderOpen',
      position: { x: 50, y: 80 },
      description: 'Showcase of completed projects and applications',
      color: '#7c3aed'
    },
    {
      id: 'communication-hub',
      name: 'Communication Hub',
      icon: 'MessageSquare',
      position: { x: 20, y: 65 },
      description: 'Contact information and social connections',
      color: '#0891b2'
    },
    {
      id: 'system-status',
      name: 'System Status',
      icon: 'Activity',
      position: { x: 20, y: 35 },
      description: 'System monitoring and performance metrics',
      color: '#ea580c'
    }
  ];

  const handleRoomClick = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    setIsRobotMoving(true);
    setSelectedRoom(roomId);
    
    // Move robot to room
    setTimeout(() => {
      setRobotPosition(room.position);
      setIsRobotMoving(false);
      setShowRoomContent(true);
    }, 1000);
  };

  const handleReturnHome = () => {
    setIsRobotMoving(true);
    setShowRoomContent(false);
    setSelectedRoom(null);
    
    setTimeout(() => {
      setRobotPosition({ x: 50, y: 50 });
      setIsRobotMoving(false);
    }, 1000);
  };

  const renderRoomContent = () => {
    if (!selectedRoom) return null;

    const handleNavigateToRoom = (roomId: string) => {
      handleRoomClick(roomId);
    };

    switch (selectedRoom) {
      case 'main-server-core':
        return <MainServerCore onNavigateToRoom={handleNavigateToRoom} />;
      case 'code-laboratory':
        return <CodeLaboratory />;
      case 'database-room':
        return <DatabaseRoom />;
      case 'project-warehouse':
        return <ProjectWarehouse />;
      case 'communication-hub':
        return <CommunicationHub />;
      case 'system-status':
        return <SystemStatus />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* 3D Environment */}
      <ThreeEnvironment
        rooms={rooms}
        selectedRoom={selectedRoom}
        robotPosition={robotPosition}
        isRobotMoving={isRobotMoving}
        onRoomClick={handleRoomClick}
      />

      {/* Room Content Modal */}
      {showRoomContent && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl max-w-7xl min-h-[95vh] max-h-[95vh] overflow-y-auto w-full">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/30 p-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-cyan-400">
                {rooms.find(r => r.id === selectedRoom)?.name}
              </h2>
              <button
                onClick={handleReturnHome}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-lg transition-colors duration-200 text-lg"
              >
                Close Room
              </button>
            </div>
            <div className="p-8 min-h-[80vh]">
              {renderRoomContent()}
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {isRobotMoving && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Accessing Server Room...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio3D;
