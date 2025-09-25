'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { MessageSquare, Mail, Phone, Linkedin, Twitter, Send } from 'lucide-react';

const CommunicationHub: React.FC = () => {
  const roomRef = useRef<HTMLDivElement>(null);
  const channelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate communication hub
            anime({
              targets: roomRef.current,
              scale: [0.95, 1],
              opacity: [0, 1],
              duration: 1000,
              easing: 'easeOutQuart',
            });

            // Animate communication channels
            anime({
              targets: channelsRef.current,
              translateY: [20, 0],
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

  const addChannelRef = (el: HTMLAnchorElement | null) => {
    if (el && !channelsRef.current.includes(el as any)) {
      channelsRef.current.push(el as any);
    }
  };

  const communicationChannels = [
    {
      name: 'Email',
      handle: 'princengwakomashumu@gmail.com',
      icon: Mail,
      status: 'Always Available',
      color: 'blue',
      primary: true,
      link: 'mailto:princengwakomashumu@gmail.com',
    },
    {
      name: 'GitHub',
      handle: '/princemashumu',
      icon: Linkedin,
      status: 'Open Source',
      color: 'blue',
      primary: false,
      link: 'https://github.com/princemashumu',
    },
    {
      name: 'Phone',
      handle: '+27 68 260 6328',
      icon: Phone,
      status: 'Business Hours',
      color: 'green',
      primary: false,
      link: 'tel:+27682606328',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-400 border-blue-500/30 hover:border-blue-500/60 bg-blue-500/10',
      sky: 'text-sky-400 border-sky-500/30 hover:border-sky-500/60 bg-sky-500/10',
      green: 'text-green-400 border-green-500/30 hover:border-green-500/60 bg-green-500/10',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="contact" className="relative">
      <div
        ref={roomRef}
        className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 h-full"
      >
        {/* Room Header */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            <MessageSquare size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Communication Hub
            </h3>
            <p className="text-gray-400">Let's Connect</p>
          </div>
        </div>

        {/* Communication Channels */}
        <div className="space-y-3 mb-6">
          {communicationChannels.map((channel) => {
            const IconComponent = channel.icon;
            return (
              <a
                key={channel.name}
                href={channel.link}
                target={channel.name === 'Email' || channel.name === 'Phone' ? '_self' : '_blank'}
                rel={channel.name === 'Email' || channel.name === 'Phone' ? '' : 'noopener noreferrer'}
                ref={addChannelRef}
                className={`block ${getColorClasses(channel.color)} rounded-lg p-4 border cursor-pointer hover:scale-105 transition-all duration-300 group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconComponent size={20} className="mr-3" />
                    <div>
                      <h4 className="text-white font-semibold">{channel.name}</h4>
                      <p className="text-gray-300 text-sm">{channel.handle}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {channel.primary && (
                      <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded mr-2">
                        Primary
                      </span>
                    )}
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Status: {channel.status}
                </div>
              </a>
            );
          })}
        </div>

        {/* Quick Contact Form */}
        <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-500/20">
          <h4 className="text-white font-semibold mb-4 flex items-center">
            <Send className="w-4 h-4 mr-2 text-indigo-400" />
            Quick Message
          </h4>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-slate-800/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/60"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-slate-800/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/60"
            />
            <textarea
              rows={3}
              placeholder="Your Message"
              className="w-full bg-slate-800/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/60 resize-none"
            ></textarea>
            <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </button>
          </div>
        </div>

        {/* Hub Status */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>Hub Status: Online</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse mr-2"></div>
            <span>Response Time: &lt;24h</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunicationHub;
