'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Activity, TrendingUp, Calendar, Award } from 'lucide-react';

const SystemStatus: React.FC = () => {
  const roomRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate system status room
            anime({
              targets: roomRef.current,
              rotateX: [10, 0],
              opacity: [0, 1],
              duration: 1200,
              easing: 'easeOutQuart',
            });

            // Animate metrics
            anime({
              targets: metricsRef.current,
              translateY: [25, 0],
              opacity: [0, 1],
              duration: 700,
              delay: anime.stagger(120, { start: 400 }),
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

  const addMetricRef = (el: HTMLDivElement | null) => {
    if (el && !metricsRef.current.includes(el)) {
      metricsRef.current.push(el);
    }
  };

  const experiences = [
    {
      title: 'Senior Full-Stack Developer(Remote)',
      company: 'Tobun Tobun Professionals',
      period: '2025(April) - Present',
      type: 'Current',
    },
    {
      title: 'Digital Solutions Developer',
      company: 'CodeTribe Academy',
      period: '2024 - 2025(April)',
      type: 'previous',
    },
    {
      title: 'IT Student & Certification',
      company: 'Tshwane University of Technology',
      period: '2018 - 2024',
      type: 'Previous',
    },
  ];

  const metrics = [
    {
      label: 'Active Projects',
      value: '12+',
      icon: TrendingUp,
      color: 'green',
      trend: 'Growing',
    },
    {
      label: 'Technologies',
      value: '25+',
      icon: Calendar,
      color: 'blue',
      trend: 'Expanding',
    },
    {
      label: 'Certifications',
      value: 'Azure & React',
      icon: Award,
      color: 'purple',
      trend: 'Active',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'text-green-400 bg-green-500/20 border-green-500/30',
      blue: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      purple: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="status" className="relative">
      <div
        ref={roomRef}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10"
      >
        {/* Room Header */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
            <Activity size={28} className="text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              System Status
            </h3>
            <p className="text-gray-400 text-lg">Experience & Metrics</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={metric.label}
                ref={addMetricRef}
                className={`${getColorClasses(metric.color)} rounded-lg p-6 border hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <IconComponent size={24} />
                  <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                    {metric.trend}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-300">
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Experience Timeline */}
        <div className="bg-slate-800/50 rounded-lg p-6 border border-cyan-500/20">
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
            Experience Timeline
          </h4>
          
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div
                key={exp.title}
                ref={addMetricRef}
                className="flex items-center p-4 bg-slate-700/30 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className={`w-3 h-3 rounded-full mr-4 ${
                  exp.type === 'Current' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`}></div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-white font-semibold">{exp.title}</h5>
                    <span className="text-cyan-400 text-sm">{exp.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{exp.company}</p>
                </div>
                
                {exp.type === 'Current' && (
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Active
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-green-400 font-semibold">Career Health</span>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-300 text-sm mt-2">All systems operational</p>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-semibold">Learning Status</span>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-300 text-sm mt-2">Continuous improvement</p>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="mt-6 bg-slate-800/50 rounded-lg p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Overall Status: Excellent</span>
            <span>Last Updated: {new Date().toLocaleDateString()}</span>
            <span>Availability: 100%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemStatus;
