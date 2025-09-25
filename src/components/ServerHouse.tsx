'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import ServerRoom from './rooms/ServerRoom';
import DatabaseRoom from './rooms/DatabaseRoom';
import CodeLaboratory from './rooms/CodeLaboratory';
import ProjectWarehouse from './rooms/ProjectWarehouse';
import CommunicationHub from './rooms/CommunicationHub';
import SystemStatus from './rooms/SystemStatus';

const ServerHouse: React.FC = () => {
  const houseRef = useRef<HTMLDivElement>(null);
  const roomsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Initial house animation
    anime({
      targets: houseRef.current,
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1000,
      easing: 'easeOutQuart',
    });

    // Stagger room animations
    anime({
      targets: roomsRef.current,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: anime.stagger(200, { start: 500 }),
      easing: 'easeOutQuart',
    });

    // Continuous server pulse animation
    anime({
      targets: '.server-pulse',
      scale: [1, 1.05, 1],
      duration: 2000,
      loop: true,
      easing: 'easeInOutSine',
    });

    // Floating animation for server indicators
    anime({
      targets: '.float-indicator',
      translateY: [0, -10, 0],
      duration: 3000,
      loop: true,
      delay: anime.stagger(500),
      easing: 'easeInOutSine',
    });
  }, []);

  const addRoomRef = (el: HTMLDivElement | null) => {
    if (el && !roomsRef.current.includes(el)) {
      roomsRef.current.push(el);
    }
  };

  return (
    <div ref={houseRef} className="relative min-h-screen pt-20">
      {/* Server House Container */}
      <div className="container mx-auto px-4">
        {/* House Structure */}
        <div className="relative">
          {/* Server House Grid - Like floors of a building */}
          <div className="grid gap-8 max-w-7xl mx-auto">
            
            {/* Ground Floor - Main Server Room (Hero) */}
            <div ref={addRoomRef} className="relative">
              <ServerRoom />
            </div>

            {/* Second Floor - Database & Code Lab */}
            <div className="grid md:grid-cols-2 gap-8">
              <div ref={addRoomRef} className="relative">
                <DatabaseRoom />
              </div>
              <div ref={addRoomRef} className="relative">
                <CodeLaboratory />
              </div>
            </div>

            {/* Third Floor - Projects & Communication */}
            <div className="grid md:grid-cols-2 gap-8">
              <div ref={addRoomRef} className="relative">
                <ProjectWarehouse />
              </div>
              <div ref={addRoomRef} className="relative">
                <CommunicationHub />
              </div>
            </div>

            {/* Fourth Floor - System Status */}
            <div ref={addRoomRef} className="relative">
              <SystemStatus />
            </div>
          </div>

          {/* Server House Framework - Visual structure */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Server Rack Lines */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-purple-500 opacity-30 server-pulse"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-cyan-500 opacity-30 server-pulse"></div>
            
            {/* Network Connection Lines */}
            <div className="absolute top-1/4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
            <div className="absolute top-2/4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50"></div>
            <div className="absolute top-3/4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
          </div>

          {/* Floating Server Indicators */}
          <div className="absolute -left-8 top-1/4 float-indicator">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute -right-8 top-1/2 float-indicator">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute -left-8 top-3/4 float-indicator">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerHouse;
