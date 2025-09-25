'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { FolderOpen, ExternalLink, Github, Star } from 'lucide-react';

const ProjectWarehouse: React.FC = () => {
  const roomRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate warehouse room
            anime({
              targets: roomRef.current,
              rotateZ: [-5, 0],
              opacity: [0, 1],
              duration: 1200,
              easing: 'easeOutQuart',
            });

            // Animate project containers
            anime({
              targets: projectsRef.current,
              translateX: [-40, 0],
              rotateY: [45, 0],
              opacity: [0, 1],
              duration: 800,
              delay: anime.stagger(200, { start: 500 }),
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

  const addProjectRef = (el: HTMLDivElement | null) => {
    if (el && !projectsRef.current.includes(el)) {
      projectsRef.current.push(el);
    }
  };

  const projects = [
    {
      name: 'Hotel Booking Web Application',
      description: 'Full-stack hotel booking system with CMS, authentication, and room management',
      tech: ['React', 'Redux', 'Firebase', 'Material-UI'],
      status: 'Production',
      color: 'emerald',
    },
    {
      name: 'Weather App',
      description: 'Real-time weather updates with location-based forecasts and customizable settings',
      tech: ['React', 'Material-UI', 'OpenWeatherMap API'],
      status: 'Production',
      color: 'blue',
    },
    {
      name: 'MPE Dining Table App',
      description: 'Restaurant discovery & booking app with secure payments and authentication',
      tech: ['React Native', 'Expo Go', 'Payment Integration'],
      status: 'Production',
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'border-emerald-500/30 hover:border-emerald-500/60',
      blue: 'border-blue-500/30 hover:border-blue-500/60',
      purple: 'border-purple-500/30 hover:border-purple-500/60',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Production: 'bg-green-500',
      Development: 'bg-yellow-500',
      Beta: 'bg-blue-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <section id="projects" className="relative">
      <div
        ref={roomRef}
        className="bg-gradient-to-br from-orange-900 to-slate-900 rounded-2xl p-6 border border-orange-500/30 shadow-2xl shadow-orange-500/10 h-full"
      >
        {/* Room Header */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
            <FolderOpen size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Project Warehouse
            </h3>
            <p className="text-gray-400">Featured Projects</p>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-4 mb-6">
          {projects.map((project, index) => (
            <div
              key={project.name}
              ref={addProjectRef}
              className={`bg-slate-800/50 rounded-lg p-4 border ${getColorClasses(project.color)} hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group`}
            >
              {/* Project Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <h4 className="text-white font-semibold">{project.name}</h4>
                  <div className={`w-2 h-2 rounded-full ml-2 ${getStatusColor(project.status)}`}></div>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Github size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>

              {/* Project Description */}
              <p className="text-gray-300 text-sm mb-3">{project.description}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded border border-orange-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Project Status */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Status: {project.status}</span>
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  <span>Featured</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warehouse Actions */}
        <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/20">
          <div className="flex items-center justify-between">
            <p className="text-gray-300 text-sm">
              View all projects on GitHub
            </p>
            <a 
              href="https://github.com/princemashumu"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors duration-200 flex items-center"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </div>
        </div>

        {/* Warehouse Status */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>Warehouse: Organized</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-2"></div>
            <span>Projects: {projects.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectWarehouse;
