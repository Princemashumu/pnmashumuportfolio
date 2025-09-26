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
  const roboticElementsRef = useRef<HTMLDivElement[]>([]);
  const hologramRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Robotic System Boot Sequence
    const bootSequence = async () => {
      // 1. Initial system startup
      await anime({
        targets: houseRef.current,
        opacity: [0, 1],
        scale: [0.8, 1],
        rotate: [5, 0],
        duration: 1500,
        easing: 'easeOutElastic(1, .8)',
      }).finished;

      // 2. Robotic framework assembly
      anime({
        targets: '.robotic-frame',
        scaleY: [0, 1],
        opacity: [0, 0.8],
        duration: 1000,
        delay: anime.stagger(200),
        easing: 'easeOutQuart',
      });

      // 3. Power up server rooms with mechanical precision
      anime({
        targets: roomsRef.current,
        translateY: [100, 0],
        rotateX: [90, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: anime.stagger(300),
        easing: 'easeOutCubic',
      });

      // 4. Activate holographic displays
      setTimeout(() => {
        anime({
          targets: '.hologram-display',
          scale: [0, 1],
          rotateY: [180, 0],
          opacity: [0, 0.9],
          duration: 800,
          delay: anime.stagger(150),
          easing: 'easeOutBack',
        });
      }, 1000);

      // 5. Initialize robotic elements
      setTimeout(() => {
        anime({
          targets: '.robotic-element',
          translateX: [-50, 0],
          rotateZ: [45, 0],
          opacity: [0, 1],
          duration: 600,
          delay: anime.stagger(100),
          easing: 'easeOutQuart',
        });
      }, 1500);
    };

    bootSequence();

    // Continuous robotic animations
    const startRoboticAnimations = () => {
      // Mechanical breathing effect
      anime({
        targets: '.server-pulse',
        scale: [1, 1.08, 1],
        opacity: [0.7, 1, 0.7],
        duration: 3000,
        loop: true,
        easing: 'easeInOutSine',
      });

      // Robotic scanner lines
      anime({
        targets: '.scanner-line',
        translateX: ['-100%', '200%'],
        opacity: [0, 1, 0],
        duration: 4000,
        loop: true,
        delay: anime.stagger(800),
        easing: 'linear',
      });

      // Holographic flicker
      anime({
        targets: '.hologram-flicker',
        opacity: [0.3, 1, 0.3],
        duration: 200,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutQuart',
      });

      // Robotic arm movements
      anime({
        targets: '.robotic-arm',
        rotate: [-15, 15],
        duration: 6000,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine',
      });

      // Data stream animation
      anime({
        targets: '.data-stream',
        translateY: ['-100%', '100vh'],
        opacity: [0, 1, 0],
        duration: 3000,
        loop: true,
        delay: anime.stagger(600),
        easing: 'linear',
      });

      // Power indicators
      anime({
        targets: '.power-indicator',
        scale: [1, 1.3, 1],
        rotate: [0, 360],
        duration: 2000,
        loop: true,
        delay: anime.stagger(400),
        easing: 'easeInOutSine',
      });

      // Mechanical joints movement
      anime({
        targets: '.mechanical-joint',
        rotateZ: [0, 360],
        duration: 8000,
        loop: true,
        easing: 'linear',
      });
    };

    // Start continuous animations after boot sequence
    setTimeout(startRoboticAnimations, 3000);

  }, []);

  const addRoomRef = (el: HTMLDivElement | null) => {
    if (el && !roomsRef.current.includes(el)) {
      roomsRef.current.push(el);
    }
  };

  return (
    <div ref={houseRef} className="relative min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Robotic Environment Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Robotic Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>

        {/* Data Streams */}
        <div className="absolute left-10 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent data-stream"></div>
        <div className="absolute left-32 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent data-stream"></div>
        <div className="absolute right-10 top-0 w-px h-full bg-gradient-to-b from-transparent via-green-400 to-transparent data-stream"></div>
        <div className="absolute right-32 top-0 w-px h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent data-stream"></div>

        {/* Holographic Overlays */}
        <div className="absolute top-20 left-20 w-32 h-32 hologram-display hologram-flicker">
          <div className="w-full h-full border border-cyan-400/50 bg-cyan-400/10 rounded-lg backdrop-blur-sm">
            <div className="p-4 text-xs text-cyan-300">
              <div>SYSTEM STATUS</div>
              <div className="mt-2 text-green-400">● ONLINE</div>
            </div>
          </div>
        </div>

        <div className="absolute top-40 right-20 w-28 h-20 hologram-display hologram-flicker">
          <div className="w-full h-full border border-purple-400/50 bg-purple-400/10 rounded-lg backdrop-blur-sm">
            <div className="p-3 text-xs text-purple-300">
              <div>ROOMS ACTIVE</div>
              <div className="mt-1 text-yellow-400">6/6</div>
            </div>
          </div>
        </div>
      </div>

      {/* Server House Container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Robotic Control Panel */}
        <div className="text-center mb-12 robotic-element">
          <div className="inline-block bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-xl p-6 border border-cyan-500/30">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2 hologram-flicker">
              ROBOTIC SERVER HOUSE
            </h1>
            <div className="text-cyan-300 text-sm">Prince Mashumu's Digital Portfolio System</div>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="power-indicator w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="power-indicator w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="power-indicator w-3 h-3 bg-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* House Structure */}
        <div className="relative">
          {/* Server House Grid - Like floors of a robotic building */}
          <div className="grid gap-8 max-w-7xl mx-auto">
            
            {/* Ground Floor - Main Server Room (Hero) */}
            <div ref={addRoomRef} className="relative robotic-element">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-lg server-pulse"></div>
              <div className="relative">
                <ServerRoom />
                {/* Robotic Scanner */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scanner-line"></div>
              </div>
            </div>

            {/* Robotic Divider */}
            <div className="flex justify-center">
              <div className="mechanical-joint w-8 h-8 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Second Floor - Database & Code Lab */}
            <div className="grid md:grid-cols-2 gap-8">
              <div ref={addRoomRef} className="relative robotic-element">
                <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-xl blur-lg server-pulse"></div>
                <div className="relative">
                  <DatabaseRoom />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent scanner-line"></div>
                </div>
              </div>
              <div ref={addRoomRef} className="relative robotic-element">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg server-pulse"></div>
                <div className="relative">
                  <CodeLaboratory />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent scanner-line"></div>
                </div>
              </div>
            </div>

            {/* Robotic Arm Connector */}
            <div className="flex justify-center">
              <div className="robotic-arm w-16 h-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full mechanical-joint"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full mechanical-joint"></div>
              </div>
            </div>

            {/* Third Floor - Projects & Communication */}
            <div className="grid md:grid-cols-2 gap-8">
              <div ref={addRoomRef} className="relative robotic-element">
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-lg server-pulse"></div>
                <div className="relative">
                  <ProjectWarehouse />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent scanner-line"></div>
                </div>
              </div>
              <div ref={addRoomRef} className="relative robotic-element">
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-xl blur-lg server-pulse"></div>
                <div className="relative">
                  <CommunicationHub />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent scanner-line"></div>
                </div>
              </div>
            </div>

            {/* Robotic Joint */}
            <div className="flex justify-center">
              <div className="mechanical-joint w-12 h-12 border-4 border-green-400 rounded-full bg-slate-800 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-400 rounded-full power-indicator"></div>
              </div>
            </div>

            {/* Fourth Floor - System Status */}
            <div ref={addRoomRef} className="relative robotic-element">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-lg server-pulse"></div>
              <div className="relative">
                <SystemStatus />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent scanner-line"></div>
              </div>
            </div>
          </div>

          {/* Robotic Framework Structure */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Main Robotic Frame */}
            <div className="robotic-frame absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-cyan-500 via-purple-500 to-cyan-500 opacity-60"></div>
            <div className="robotic-frame absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500 opacity-60"></div>
            
            {/* Horizontal Connection Lines */}
            <div className="robotic-frame absolute top-1/6 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>
            <div className="robotic-frame absolute top-2/6 left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60"></div>
            <div className="robotic-frame absolute top-3/6 left-4 right-4 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60"></div>
            <div className="robotic-frame absolute top-4/6 left-4 right-4 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
            <div className="robotic-frame absolute top-5/6 left-4 right-4 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60"></div>
          </div>

          {/* Robotic Indicators */}
          <div className="absolute -left-12 top-1/6 power-indicator">
            <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-green-300"></div>
          </div>
          <div className="absolute -right-12 top-2/6 power-indicator">
            <div className="w-4 h-4 bg-blue-400 rounded-full border-2 border-blue-300"></div>
          </div>
          <div className="absolute -left-12 top-3/6 power-indicator">
            <div className="w-4 h-4 bg-purple-400 rounded-full border-2 border-purple-300"></div>
          </div>
          <div className="absolute -right-12 top-4/6 power-indicator">
            <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-300"></div>
          </div>
          <div className="absolute -left-12 top-5/6 power-indicator">
            <div className="w-4 h-4 bg-pink-400 rounded-full border-2 border-pink-300"></div>
          </div>
        </div>
      </div>

      {/* Robotic Status Bar */}
      <div className="fixed bottom-4 left-4 right-4 robotic-element">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-lg p-3 border border-cyan-500/30">
          <div className="flex justify-between items-center text-xs">
            <div className="text-cyan-300">SYSTEM: OPERATIONAL</div>
            <div className="flex space-x-4">
              <div className="text-green-400">CPU: 98%</div>
              <div className="text-blue-400">MEMORY: 76%</div>
              <div className="text-purple-400">NETWORK: STABLE</div>
            </div>
            <div className="text-yellow-400">ROOMS: 6 ACTIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerHouse;
