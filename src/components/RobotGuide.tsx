'use client';

import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';

interface RobotGuideProps {
  position: { x: number; y: number };
  isMoving: boolean;
  onReturnHome: () => void;
}

const RobotGuide: React.FC<RobotGuideProps> = ({ position, isMoving, onReturnHome }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const robotRef = useRef<SVGSVGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);

  // Array of introduction messages
  const messages = [
    "Hi! I'm Prince Ngwako Mashumu ",
    "Full-Stack Developer",
    "Welcome to my interactive server house portfolio!",
    "Click any room to explore my projects and skills",
    "Ready to dive into the code matrix? Let's go!"
  ];

  // Context-aware messages for different positions
  const getContextualMessage = () => {
    if (isMoving) {
      return "Accessing server room... Please wait! 🔓";
    }
    
    if (position.x === 50 && position.y === 50) {
      return messages[currentMessageIndex];
    }
    
    // Messages when robot is at different room positions
    return "Exploring this room... Click 'Return Home' to go back! 🏠";
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Message cycling effect
  useEffect(() => {
    if (isMounted && !isMoving && position.x === 50 && position.y === 50) {
      // Start showing messages after a short delay
      const startDelay = setTimeout(() => {
        setShowMessage(true);
      }, 2000);

      return () => clearTimeout(startDelay);
    } else if (isMounted && !isMoving && (position.x !== 50 || position.y !== 50)) {
      // Show contextual message when in other rooms
      setShowMessage(true);
    } else {
      setShowMessage(false);
    }
  }, [isMounted, isMoving, position.x, position.y]);

  // Cycle through messages (only at home position)
  useEffect(() => {
    if (showMessage && position.x === 50 && position.y === 50) {
      const messageInterval = setInterval(() => {
        setIsTyping(true);
        setTimeout(() => {
          setCurrentMessageIndex((prevIndex) => 
            prevIndex === messages.length - 1 ? 0 : prevIndex + 1
          );
          setIsTyping(false);
        }, 300);
      }, 4500); // Change message every 4.5 seconds

      return () => clearInterval(messageInterval);
    }
  }, [showMessage, messages.length, position.x, position.y]);

  const handleMessageClick = () => {
    if (showMessage && !isTyping && position.x === 50 && position.y === 50) {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => 
          prevIndex === messages.length - 1 ? 0 : prevIndex + 1
        );
        setIsTyping(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (isMounted && !isMoving && robotRef.current) {
      // Floating animation
      anime({
        targets: robotRef.current,
        translateY: [0, -10, 0],
        duration: 2000,
        loop: true,
        easing: 'easeInOutSine',
      });

      // Eyes blinking
      if (eyesRef.current?.children) {
        anime({
          targets: Array.from(eyesRef.current.children),
          scaleY: [1, 0.1, 1],
          duration: 150,
          delay: anime.stagger(50),
          loop: true,
          loopDelay: 3000,
        });
      }

      // Body gentle rotation
      if (bodyRef.current) {
        anime({
          targets: bodyRef.current,
          rotate: [-2, 2, -2],
          duration: 3000,
          loop: true,
          easing: 'easeInOutSine',
        });
      }
    }
  }, [isMounted, isMoving]);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div 
      className="robot-guide absolute z-20 transition-all duration-1500 ease-in-out"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Robot SVG */}
      <svg
        ref={robotRef}
        width="60"
        height="80"
        viewBox="0 0 60 80"
        className="drop-shadow-2xl"
      >
        {/* Robot Shadow */}
        <ellipse
          cx="30"
          cy="75"
          rx="20"
          ry="3"
          fill="rgba(0,0,0,0.3)"
          className="animate-pulse"
        />

        {/* Robot Body */}
        <g ref={bodyRef}>
          {/* Main Body */}
          <rect
            x="15"
            y="25"
            width="30"
            height="35"
            rx="8"
            fill="url(#robotGradient)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />

          {/* Head */}
          <rect
            x="20"
            y="10"
            width="20"
            height="20"
            rx="10"
            fill="url(#headGradient)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />

          {/* Arms */}
          <rect
            x="8"
            y="30"
            width="6"
            height="20"
            rx="3"
            fill="url(#robotGradient)"
          />
          <rect
            x="46"
            y="30"
            width="6"
            height="20"
            rx="3"
            fill="url(#robotGradient)"
          />

          {/* Legs */}
          <rect
            x="20"
            y="58"
            width="6"
            height="15"
            rx="3"
            fill="url(#robotGradient)"
          />
          <rect
            x="34"
            y="58"
            width="6"
            height="15"
            rx="3"
            fill="url(#robotGradient)"
          />

          {/* Chest Panel */}
          <rect
            x="20"
            y="35"
            width="20"
            height="15"
            rx="2"
            fill="rgba(0,255,255,0.1)"
            stroke="rgba(0,255,255,0.5)"
            strokeWidth="1"
          />

          {/* Chest Lights */}
          <circle cx="25" cy="42" r="2" fill="#00ffff" className="animate-pulse" />
          <circle cx="35" cy="42" r="2" fill="#ff00ff" className="animate-pulse" />
        </g>

        {/* Eyes */}
        <g ref={eyesRef}>
          <circle cx="25" cy="18" r="2" fill="#00ffff" className="animate-ping" />
          <circle cx="35" cy="18" r="2" fill="#00ffff" className="animate-ping" />
        </g>

        {/* Antenna */}
        <line
          x1="30"
          y1="10"
          x2="30"
          y2="5"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1"
        />
        <circle cx="30" cy="5" r="2" fill="#ffff00" className="animate-ping" />

        {/* Gradients */}
        <defs>
          <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Introduction Messages */}
      {showMessage && !isMoving && (
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-30">
          <div 
            onClick={handleMessageClick}
            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white px-5 py-3 rounded-2xl text-sm shadow-2xl border border-cyan-300/30 backdrop-blur-sm cursor-pointer hover:scale-105 transition-all duration-300 relative group"
            style={{ minWidth: '280px', textAlign: 'center' }}
          >
            <div className={`transition-opacity duration-300 ${isTyping ? 'opacity-50' : 'opacity-100 animate-fade-in-up'}`}>
              {getContextualMessage()}
            </div>
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}

            {/* Speech bubble tail */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-cyan-500" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300 -z-10"></div>
            
            {/* Message counter dots - only show at home */}
            {position.x === 50 && position.y === 50 && (
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {messages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isTyping) {
                        setIsTyping(true);
                        setTimeout(() => {
                          setCurrentMessageIndex(index);
                          setIsTyping(false);
                        }, 300);
                      }
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                      index === currentMessageIndex
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-125'
                        : 'bg-gray-400 hover:bg-gray-300 scale-75'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Click hint - only show at home */}
            {position.x === 50 && position.y === 50 && (
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Click to change message
              </div>
            )}
          </div>
        </div>
      )}

      {/* Speech Bubble */}
      {isMoving && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-black px-3 py-1 rounded-lg text-xs whitespace-nowrap animate-bounce">
          Opening server room...
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
        </div>
      )}

      {/* Click to return home */}
      {!isMoving && position.x !== 50 && position.y !== 50 && (
        <button
          onClick={onReturnHome}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-cyan-500 hover:bg-cyan-400 text-white text-xs px-2 py-1 rounded transition-colors duration-200"
        >
          Return Home
        </button>
      )}
    </div>
  );
};

export default RobotGuide;
