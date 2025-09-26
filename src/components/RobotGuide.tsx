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
  const robotRef = useRef<HTMLDivElement>(null);

  // Array of introduction messages
  const messages = [
    "Hi! I'm Prince Ngwako Mashumu ",
    "Full-Stack Developer",
    "Click on any room to explore!"
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
      // Floating animation when idle
      anime({
        targets: robotRef.current,
        translateY: [0, -8, 0],
        duration: 2000,
        loop: true,
        easing: 'easeInOutSine',
      });

      // Gentle rotation when idle
      anime({
        targets: robotRef.current,
        rotate: [-2, 2, -2],
        duration: 3000,
        loop: true,
        easing: 'easeInOutSine',
      });
    }
  }, [isMounted, isMoving]);

  // Enhanced movement animation
  useEffect(() => {
    if (isMoving && robotRef.current) {
      // Bouncing movement animation
      anime({
        targets: robotRef.current,
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        duration: 600,
        loop: true,
        easing: 'easeInOutQuad',
      });
    } else if (!isMoving && robotRef.current) {
      // Return to normal state
      anime({
        targets: robotRef.current,
        scale: 1,
        rotate: 0,
        duration: 500,
        easing: 'easeOutElastic',
      });
    }
  }, [isMoving]);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div 
      className={`robot-guide absolute z-20 transition-all duration-1500 ease-in-out ${isMoving ? 'robot-walking' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Custom Designed Robot */}
      <div 
        ref={robotRef}
        className="robot-container relative drop-shadow-2xl"
        style={{
          width: '80px',
          height: '100px',
        }}
      >
        {/* Robot Body */}
        <div className="robot-body relative">
          {/* Head */}
          <div className="robot-head w-12 h-12 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full relative mx-auto border-2 border-white/20 shadow-lg">
            {/* Antenna */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-yellow-400 rounded-full">
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            
            {/* Eyes */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <div className="w-3 h-3 bg-white rounded-full relative">
                <div className={`absolute top-0.5 left-0.5 w-2 h-2 bg-blue-500 rounded-full transition-all duration-200 ${isMoving ? 'animate-pulse' : ''}`}></div>
              </div>
              <div className="w-3 h-3 bg-white rounded-full relative">
                <div className={`absolute top-0.5 left-0.5 w-2 h-2 bg-blue-500 rounded-full transition-all duration-200 ${isMoving ? 'animate-pulse' : ''}`}></div>
              </div>
            </div>
            
            {/* Mouth */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1.5 bg-gray-800 rounded-full flex items-center justify-center">
              <div className="w-3 h-0.5 bg-green-400 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Body/Chest */}
          <div className="robot-chest w-16 h-20 bg-gradient-to-b from-slate-600 to-slate-800 rounded-lg relative mx-auto mt-1 border-2 border-white/10 shadow-lg">
            {/* Chest Panel */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
            </div>
            
            {/* Screen Display */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-black rounded border border-cyan-400/50 flex items-center justify-center">
              {isMoving ? (
                <div className="flex space-x-0.5">
                  <div className="w-1 h-3 bg-cyan-400 animate-pulse" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1 h-4 bg-cyan-400 animate-pulse" style={{animationDelay: '100ms'}}></div>
                  <div className="w-1 h-2 bg-cyan-400 animate-pulse" style={{animationDelay: '200ms'}}></div>
                  <div className="w-1 h-4 bg-cyan-400 animate-pulse" style={{animationDelay: '300ms'}}></div>
                </div>
              ) : (
                <div className="text-green-400 text-xs animate-pulse">●</div>
              )}
            </div>
          </div>

          {/* Arms */}
          <div className="robot-arms absolute top-12 left-0 right-0">
            <div className={`absolute -left-2 top-0 w-3 h-8 bg-gradient-to-b from-slate-500 to-slate-700 rounded-full border border-white/10 ${isMoving ? 'animate-swing-left' : ''}`}>
              <div className="absolute bottom-0 w-2 h-2 bg-cyan-400 rounded-full left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className={`absolute -right-2 top-0 w-3 h-8 bg-gradient-to-b from-slate-500 to-slate-700 rounded-full border border-white/10 ${isMoving ? 'animate-swing-right' : ''}`}>
              <div className="absolute bottom-0 w-2 h-2 bg-cyan-400 rounded-full left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>

          {/* Legs */}
          <div className="robot-legs absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className={`w-3 h-8 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full border border-white/10 ${isMoving ? 'animate-walk-left' : ''}`}>
              <div className="absolute bottom-0 w-4 h-2 bg-slate-700 rounded-full -left-0.5 border border-white/10"></div>
            </div>
            <div className={`w-3 h-8 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full border border-white/10 ${isMoving ? 'animate-walk-right' : ''}`}>
              <div className="absolute bottom-0 w-4 h-2 bg-slate-700 rounded-full -left-0.5 border border-white/10"></div>
            </div>
          </div>
        </div>

        {/* Robot Shadow */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-black/30 rounded-full animate-pulse"></div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-md animate-pulse -z-10" />
        
        {/* Status Indicator */}
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-ping border border-white"></div>
      </div>

      {/* Introduction Messages */}
      {showMessage && !isMoving && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30">
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
