'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Menu, X, Server, Database, Code, FolderOpen, MessageSquare, Activity } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navRef = useRef<HTMLNavElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate navigation on load
    anime.timeline({
      easing: 'easeOutQuart',
    })
    .add({
      targets: navRef.current,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 800,
    })
    .add({
      targets: logoRef.current,
      rotateY: [180, 0],
      duration: 600,
    }, '-=400');
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const menuItems = [
    { id: 'server-room', label: 'Main Server', icon: Server },
    { id: 'database-room', label: 'Database', icon: Database },
    { id: 'code-lab', label: 'Code Lab', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'contact', label: 'Contact', icon: MessageSquare },
    { id: 'status', label: 'Status', icon: Activity },
  ];

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div ref={logoRef} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Server size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ServerHouse
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 group"
                >
                  <IconComponent size={16} className="group-hover:scale-110 transition-transform duration-200" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-cyan-400 transition-colors duration-200"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-black/90 rounded-lg mt-2 p-4 border border-cyan-500/20">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-200"
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
