'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Server, Cpu, HardDrive, Activity } from 'lucide-react';
import CanvasRenderer from '@/components/CanvasRenderer';

const ServerRoom: React.FC = () => {
  const roomRef = useRef<HTMLDivElement>(null);
  const serversRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate room entrance
            anime({
              targets: roomRef.current,
              opacity: [0, 1],
              scale: [0.9, 1],
              duration: 1000,
              easing: 'easeOutQuart',
            });

            // Animate server racks
            anime({
              targets: serversRef.current,
              translateX: [-50, 0],
              opacity: [0, 1],
              duration: 800,
              delay: anime.stagger(200),
              easing: 'easeOutQuart',
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (roomRef.current) {
      observer.observe(roomRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const addServerRef = (el: HTMLDivElement | null) => {
    if (el && !serversRef.current.includes(el)) {
      serversRef.current.push(el);
    }
  };

  return (
    <section id="server-room" className="relative">
      <div
        ref={roomRef}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10"
      >
        {/* Room Header */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
            <Server size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Main Server Room
            </h1>
            <p className="text-gray-400 text-lg">Central Processing Hub</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-white leading-tight">
              Welcome to My
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Digital Server House
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              I'm a Full-Stack Developer passionate about building scalable solutions 
              and architecting robust systems. Explore my digital server house where 
              each room represents a different aspect of my expertise.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
                Explore Rooms
              </button>
              <button className="border border-cyan-500 text-cyan-400 px-8 py-3 rounded-lg font-semibold hover:bg-cyan-500/10 transition-all duration-300">
                Download Resume
              </button>
            </div>
          </div>

          {/* Server Visualization */}
          <div className="relative">
            {/* Canvas Background */}
            <div className="absolute inset-0 rounded-lg overflow-hidden opacity-30">
              <CanvasRenderer 
                roomType={0} 
                isActive={true} 
                use3D={true}
                className="w-full h-full"
              />
            </div>
            
            {/* Server Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div ref={addServerRef} className="bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <Cpu className="text-cyan-400" size={24} />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-semibold text-white mb-1">CPU Core</h3>
                <p className="text-sm text-gray-400">Processing Logic</p>
              </div>

              <div ref={addServerRef} className="bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <HardDrive className="text-purple-400" size={24} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-semibold text-white mb-1">Storage</h3>
                <p className="text-sm text-gray-400">Data Management</p>
              </div>

              <div ref={addServerRef} className="bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <Activity className="text-green-400" size={24} />
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-semibold text-white mb-1">Network</h3>
                <p className="text-sm text-gray-400">Connectivity</p>
              </div>

              <div ref={addServerRef} className="bg-slate-700/50 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <Server className="text-yellow-400" size={24} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-semibold text-white mb-1">Services</h3>
                <p className="text-sm text-gray-400">Applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="mt-8 bg-slate-800/50 rounded-lg p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>System Status: Online</span>
            <span>Uptime: 24/7</span>
            <span>Response Time: &lt;100ms</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServerRoom;
