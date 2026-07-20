import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function TiltCard({ children, className = '', disabled = false }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth mouse transform tracking via Framer Motion useSpring
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { damping: 25, stiffness: 180, mass: 0.5 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { damping: 25, stiffness: 180, mass: 0.5 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    x.set(mouseX / width);
    y.set(mouseY / height);

    // Spotlight glow coordinates on card borders
    setGlowPos({
      x: mouseX,
      y: mouseY,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1200,
      }}
      className={`relative transition-all duration-300 ${
        isHovered && !disabled ? 'shadow-2xl translate-y-[-6px]' : ''
      } ${className}`}
    >
      {/* 3D Depth Inner Layer Container */}
      <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }} className="h-full w-full">
        {children}
      </div>

      {/* Futuristic Hover Glowing Ambient Ring */}
      {!disabled && (
        <div 
          className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-500 -z-10"
          style={{
            background: `radial-gradient(450px circle at ${glowPos.x}px ${glowPos.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
          }}
        />
      )}

      {/* Cybernetic active card outline highlights */}
      {!disabled && isHovered && (
        <div 
          className="absolute inset-0 rounded-[inherit] border border-indigo-500/20 pointer-events-none z-10 animate-pulse duration-1000"
          style={{
            background: `radial-gradient(120px circle at ${glowPos.x}px ${glowPos.y}px, rgba(99, 102, 241, 0.25), transparent 75%)`
          }}
        />
      )}
    </motion.div>
  );
}
