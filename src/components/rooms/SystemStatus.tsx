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
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-10 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/10 max-w-3xl mx-auto"
      >
        {/* Room Header */}
        <div className="flex items-center mb-10 gap-6">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Activity size={36} className="text-white" />
          </div>
          <div>
            <h3 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
              System Status
            </h3>
            <p className="text-gray-400 text-lg font-medium">Experience & Metrics</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={metric.label}
                ref={addMetricRef}
                className={`flex flex-col items-center justify-center ${getColorClasses(metric.color)} rounded-xl p-7 border-2 font-semibold hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg shadow-cyan-500/10`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <IconComponent size={28} />
                  <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">
                    {metric.trend}
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-base text-gray-200">
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Experience Timeline */}
        <div className="bg-slate-800/70 rounded-xl p-8 border-2 border-cyan-500/30 mb-8">
          <h4 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            Experience Timeline
          </h4>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div
                key={exp.title}
                ref={addMetricRef}
                className="flex items-center p-5 bg-slate-700/40 rounded-xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 gap-6"
              >
                <div className={`w-4 h-4 rounded-full ${
                  exp.type === 'Current' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-lg text-white font-bold">{exp.title}</h5>
                    <span className="text-cyan-400 text-sm font-semibold">{exp.period}</span>
                  </div>
                  <p className="text-gray-300 text-base">{exp.company}</p>
                </div>
                {exp.type === 'Current' && (
                  <div className="bg-green-500 text-white text-xs px-3 py-1 rounded font-bold">
                    Active
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-green-500/20 border-2 border-green-500/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 font-bold text-lg">Career Health</span>
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-200 text-base mt-1">All systems operational</p>
          </div>
          <div className="bg-blue-500/20 border-2 border-blue-500/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 font-bold text-lg">Learning Status</span>
              <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-200 text-base mt-1">Continuous improvement</p>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="mt-8 bg-slate-800/70 rounded-xl p-6 border-2 border-cyan-500/30">
          <div className="flex items-center justify-between text-base text-gray-300 font-semibold">
            <span>Overall Status: <span className="text-green-400">Excellent</span></span>
            <span>Last Updated: {new Date().toLocaleDateString()}</span>
            <span>Availability: <span className="text-blue-400">100%</span></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemStatus;
