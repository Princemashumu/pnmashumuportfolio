'use client';

import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { Server, Cpu, HardDrive, Activity, User, MapPin, Calendar, Coffee, Code, Database, MessageSquare, FolderOpen } from 'lucide-react';

interface MainServerCoreProps {
  onNavigateToRoom?: (roomId: string) => void;
}

const MainServerCore: React.FC<MainServerCoreProps> = ({ onNavigateToRoom }) => {
  const [isMounted, setIsMounted] = useState(false);
  const roomRef = useRef<HTMLDivElement>(null);
  const serverRacksRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleRoomNavigation = (roomId: string) => {
    if (onNavigateToRoom) {
      onNavigateToRoom(roomId);
    } else {
      // Fallback: emit a custom event that the parent can listen to
      window.dispatchEvent(new CustomEvent('navigateToRoom', { detail: { roomId } }));
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && roomRef.current) {
      // Animate room entrance
      anime({
        targets: '.room-element',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeOutQuart',
      });

      // Animate server racks
      anime({
        targets: '.server-rack',
        scaleY: [0, 1],
        duration: 1000,
        delay: anime.stagger(200),
        easing: 'easeOutElastic(1, .8)',
      });

      // Animate profile cards
      setTimeout(() => {
        anime({
          targets: '.profile-card',
          rotateY: [90, 0],
          opacity: [0, 1],
          duration: 600,
          delay: anime.stagger(150),
          easing: 'easeOutQuart',
        });
      }, 800);
    }
  }, [isMounted]);

  const serverStats = [
    { label: 'Experience Level', value: '1+ Years', icon: Activity, color: 'text-green-400' },
    { label: 'Active Projects', value: '12+', icon: Cpu, color: 'text-cyan-400' },
    { label: 'Technologies', value: '25+', icon: HardDrive, color: 'text-purple-400' },
    { label: 'Certifications', value: '3+', icon: Server, color: 'text-yellow-400' },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <div ref={roomRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8">
      {/* Room Header */}
      <div className="room-element text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
            <Server size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            MAIN SERVER CORE
          </h1>
        </div>
        <p className="text-gray-300 text-lg">Central Processing Hub • System Administrator Profile</p>
      </div>

      {/* Server Room Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Server Rack */}
        <div ref={serverRacksRef} className="space-y-4">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4 room-element">System Status</h3>
          {serverStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="server-rack bg-black/40 backdrop-blur-md rounded-lg p-4 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent size={20} className={stat.color} />
                    <span className="text-gray-300">{stat.label}</span>
                  </div>
                  <span className={`font-mono font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                {/* Animated progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-1 mt-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color.includes('green') ? 'from-green-400 to-green-600' : 
                      stat.color.includes('cyan') ? 'from-cyan-400 to-cyan-600' :
                      stat.color.includes('purple') ? 'from-purple-400 to-purple-600' :
                      'from-yellow-400 to-yellow-600'} animate-pulse`}
                    style={{ width: index === 0 ? '85%' : index === 1 ? '90%' : index === 2 ? '95%' : '100%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Profile */}
        <div ref={profileRef} className="flex flex-col items-center">
          <div className="profile-card bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-xl p-8 border border-cyan-500/20 text-center">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <User size={64} className="text-white" />
            </div>
            
            {/* Profile Info */}
            <h2 className="text-2xl font-bold mb-2">Prince Ngwako Mashumu</h2>
            <p className="text-cyan-400 text-lg mb-4">Full Stack Developer & Azure Developer Associate</p>
            
            {/* Quick Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <MapPin size={16} className="text-cyan-400" />
                <span>Protea Glen, Johannesburg</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Calendar size={16} className="text-cyan-400" />
                <span>T&T Professionals(Remote)</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Coffee size={16} className="text-cyan-400" />
                <span>Innovation enthusiast</span>
              </div>
            </div>

            {/* Contact Links */}
            <div className="mt-6 space-y-2">
              <a 
                href="mailto:princengwakomashumu@gmail.com"
                className="block text-xs text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer hover:scale-105 transform duration-200"
              >
                📧 princengwakomashumu@gmail.com
              </a>

              <a 
                href="https://github.com/princemashumu"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-green-300 hover:text-green-200 transition-colors cursor-pointer hover:scale-105 transform duration-200"
              >
                💻 github.com/princemashumu
              </a>
            </div>
          </div>
        </div>

        {/* Right Navigation Panel */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4 room-element">Quick Navigation</h3>
          
          <div 
            onClick={() => handleRoomNavigation('database')}
            className="server-rack bg-black/40 backdrop-blur-md rounded-lg p-4 border border-green-500/20 cursor-pointer hover:border-green-500/40 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <Database size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-gray-300 group-hover:text-white transition-colors">Database Room</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">Experience & Education</div>
          </div>

          <div 
            onClick={() => handleRoomNavigation('code-lab')}
            className="server-rack bg-black/40 backdrop-blur-md rounded-lg p-4 border border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <Code size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-gray-300 group-hover:text-white transition-colors">Code Laboratory</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">Technical Skills & Tools</div>
          </div>

          <div 
            onClick={() => handleRoomNavigation('projects')}
            className="server-rack bg-black/40 backdrop-blur-md rounded-lg p-4 border border-orange-500/20 cursor-pointer hover:border-orange-500/40 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <FolderOpen size={20} className="text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-gray-300 group-hover:text-white transition-colors">Project Warehouse</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">Portfolio & Projects</div>
          </div>

          <div 
            onClick={() => handleRoomNavigation('communication')}
            className="server-rack bg-black/40 backdrop-blur-md rounded-lg p-4 border border-pink-500/20 cursor-pointer hover:border-pink-500/40 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <MessageSquare size={20} className="text-pink-400 group-hover:scale-110 transition-transform" />
              <span className="text-gray-300 group-hover:text-white transition-colors">Communication Hub</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">Contact & Social Links</div>
          </div>

          <div 
            onClick={() => handleRoomNavigation('status')}
            className="server-rack bg-black/40 backdrop-blur-md rounded-lg p-4 border border-yellow-500/20 cursor-pointer hover:border-yellow-500/40 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <Activity size={20} className="text-yellow-400 group-hover:scale-110 transition-transform" />
              <span className="text-gray-300 group-hover:text-white transition-colors">System Monitor</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">Performance & Stats</div>
          </div>
        </div>
      </div>

      {/* Education & Certifications Section */}
      <div className="room-element mb-12">
        <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Education & Certifications
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <div className="profile-card bg-black/40 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300">
            <div className="w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-4" />
            <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
              <Calendar size={20} className="mr-2 text-green-400" />
              Education
            </h4>
            <div className="space-y-3">
              <div className="border-l-2 border-green-400/30 pl-4">
                <div className="text-green-400 font-semibold">CodeTribe Academy</div>
                <div className="text-gray-300 text-sm">Digital Solutions Developer Intern</div>
                <div className="text-gray-500 text-xs">2024-2025</div>
              </div>
              <div className="border-l-2 border-cyan-400/30 pl-4">
                <div className="text-cyan-400 font-semibold">Tshwane University of Technology</div>
                <div className="text-gray-300 text-sm">National Diploma: Information Technology</div>
                <div className="text-gray-500 text-xs">Completed</div>
              </div>
              <div className="border-l-2 border-purple-400/30 pl-4">
                <div className="text-purple-400 font-semibold">Protea Glen Secondary</div>
                <div className="text-gray-300 text-sm">National Certificate</div>
                <div className="text-gray-500 text-xs">2018</div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="profile-card bg-black/40 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-4" />
            <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
              <Server size={20} className="mr-2 text-blue-400" />
              Certifications
            </h4>
            <div className="space-y-3">
              <div className="border-l-2 border-blue-400/30 pl-4">
                <div className="text-blue-400 font-semibold">Microsoft Azure</div>
                <div className="text-gray-300 text-sm">Azure Developer Associate</div>
                <div className="text-gray-500 text-xs">2024 • Current</div>
              </div>
              <div className="border-l-2 border-yellow-400/30 pl-4">
                <div className="text-yellow-400 font-semibold">Dynamic DNA</div>
                <div className="text-gray-300 text-sm">Microsoft Azure Certification</div>
                <div className="text-gray-500 text-xs">2024</div>
              </div>
              <div className="border-l-2 border-pink-400/30 pl-4">
                <div className="text-pink-400 font-semibold">CodeTribe Academy</div>
                <div className="text-gray-300 text-sm">React Course Completion</div>
                <div className="text-gray-500 text-xs">June 2024 - April 2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Server Room Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Data flowing lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-20"
            style={{
              left: `${10 + i * 15}%`,
              height: '100%',
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MainServerCore;
