'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Database, User, MapPin, Calendar, Coffee } from 'lucide-react';
import CanvasRenderer from '@/components/CanvasRenderer';

const DatabaseRoom: React.FC = () => {
  const roomRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate database room
            anime({
              targets: roomRef.current,
              rotateY: [15, 0],
              opacity: [0, 1],
              duration: 1200,
              easing: 'easeOutQuart',
            });

            // Animate data records
            anime({
              targets: dataRef.current,
              translateY: [30, 0],
              opacity: [0, 1],
              duration: 600,
              delay: anime.stagger(100, { start: 300 }),
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

  const addDataRef = (el: HTMLDivElement | null) => {
    if (el && !dataRef.current.includes(el)) {
      dataRef.current.push(el);
    }
  };

  return (
    <section id="database-room" className="relative">
      <div
        ref={roomRef}
        className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-2xl p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 h-full"
      >
        {/* Room Header */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
            <Database size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Database Room
            </h3>
            <p className="text-gray-400">About Me Records</p>
          </div>
        </div>

        {/* Database Records */}
        <div className="space-y-4">
          <div ref={addDataRef} className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-emerald-500">
            <div className="flex items-center mb-2">
              <User className="text-emerald-400 mr-2" size={18} />
              <span className="text-emerald-400 font-mono text-sm">user.name</span>
            </div>
            <p className="text-white font-semibold">Prince Ngwako Mashumu</p>
          </div>

          <div ref={addDataRef} className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-green-500">
            <div className="flex items-center mb-2">
              <Coffee className="text-green-400 mr-2" size={18} />
              <span className="text-green-400 font-mono text-sm">user.role</span>
            </div>
            <p className="text-white font-semibold">Digital Solutions Developer</p>
          </div>

          <div ref={addDataRef} className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-emerald-500">
            <div className="flex items-center mb-2">
              <MapPin className="text-emerald-400 mr-2" size={18} />
              <span className="text-emerald-400 font-mono text-sm">user.location</span>
            </div>
            <p className="text-white font-semibold">Johannesburg, South Africa</p>
          </div>

          <div ref={addDataRef} className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-green-500">
            <div className="flex items-center mb-2">
              <Calendar className="text-green-400 mr-2" size={18} />
              <span className="text-green-400 font-mono text-sm">user.education</span>
            </div>
            <p className="text-white font-semibold">TUT - IT Diploma, Azure Certified</p>
          </div>
        </div>

        {/* Database Description */}
        <div className="mt-6 p-4 bg-emerald-900/30 rounded-lg border border-emerald-500/20">
          <p className="text-gray-300 text-sm leading-relaxed">
            Full stack developer- with expertise in React, Next.js,Python, JavaScript
           & Mobile Development. Microsoft Azure certified professional specializing 
            in SCRUM methodology and full-stack applications.
          </p>
        </div>

        {/* Connection Status */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>Connection: Active</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span>Records: 4</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatabaseRoom;
