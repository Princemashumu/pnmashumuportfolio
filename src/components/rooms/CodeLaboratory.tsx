'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Code, Zap, Layers, GitBranch } from 'lucide-react';

const CodeLaboratory: React.FC = () => {
  const roomRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate laboratory room
            anime({
              targets: roomRef.current,
              rotateX: [-15, 0],
              opacity: [0, 1],
              duration: 1200,
              easing: 'easeOutQuart',
            });

            // Animate skill containers
            anime({
              targets: skillsRef.current,
              scale: [0.8, 1],
              opacity: [0, 1],
              duration: 800,
              delay: anime.stagger(150, { start: 400 }),
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

  const addSkillRef = (el: HTMLDivElement | null) => {
    if (el && !skillsRef.current.includes(el)) {
      skillsRef.current.push(el);
    }
  };

  const skills = [
    { 
      name: 'Frontend', 
      technologies: ['React', 'React Native', 'HTML5', 'CSS3', 'TailwindCSS', 'Material UI'], 
      color: 'blue' 
    },
    { 
      name: 'Backend & APIs', 
      technologies: ['Node.js', 'Express.js', 'RESTful APIs', 'Firebase Functions'], 
      color: 'purple' 
    },
    { 
      name: 'Languages', 
      technologies: ['JavaScript', 'TypeScript', 'C++', 'C#'], 
      color: 'orange' 
    },
    { 
      name: 'Database & Cloud', 
      technologies: ['Firebase', 'MongoDB', 'MySQL', 'PostgreSQL', 'Azure'], 
      color: 'green' 
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-500 border-blue-500/30',
      purple: 'from-purple-500 to-pink-500 border-purple-500/30',
      orange: 'from-orange-500 to-red-500 border-orange-500/30',
      green: 'from-green-500 to-emerald-500 border-green-500/30',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="code-lab" className="relative">
      <div
        ref={roomRef}
        className="bg-gradient-to-br from-violet-900 to-slate-900 rounded-2xl p-6 border border-violet-500/30 shadow-2xl shadow-violet-500/10 h-full"
      >
        {/* Room Header */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            <Code size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Code Laboratory
            </h3>
            <p className="text-gray-400">Tech Stack & Skills</p>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              ref={addSkillRef}
              className={`bg-gradient-to-br ${getColorClasses(skill.color)} bg-slate-800/50 rounded-lg p-4 border hover:scale-105 transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-3">
                {index === 0 && <Layers className="text-blue-400" size={20} />}
                {index === 1 && <Zap className="text-purple-400" size={20} />}
                {index === 2 && <GitBranch className="text-orange-400" size={20} />}
                {index === 3 && <Code className="text-green-400" size={20} />}
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              
              <h4 className="text-white font-semibold mb-2">{skill.name}</h4>
              
              <div className="flex flex-wrap gap-1">
                {skill.technologies.slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-white/10 text-white px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
                {skill.technologies.length > 2 && (
                  <span className="text-xs text-gray-400">
                    +{skill.technologies.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Code Environment */}
        <div className="bg-slate-900/80 rounded-lg p-4 border border-violet-500/20">
          <div className="flex items-center mb-3">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400 text-sm font-mono">code.lab.terminal</span>
          </div>
          
          <div className="font-mono text-sm text-gray-300 space-y-1">
            <div>
              <span className="text-green-400">$</span> npm run build
            </div>
            <div className="text-blue-400">✓ Built successfully</div>
            <div>
              <span className="text-green-400">$</span> Ready to deploy
            </div>
            <div className="animate-pulse">
              <span className="text-green-400">$</span> <span className="bg-gray-600 w-2 h-4 inline-block"></span>
            </div>
          </div>
        </div>

        {/* Lab Status */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>Lab Status: Active</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse mr-2"></div>
            <span>Experiments: Running</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeLaboratory;
