import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'gradient';
  animated?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'gradient', 
  animated = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1
      }
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  };

  const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.3,
        duration: 0.5
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'light':
        return 'text-white';
      case 'dark':
        return 'text-gray-800';
      case 'gradient':
      default:
        return 'text-blue-600 font-bold';
    }
  };

  const getIconFill = () => {
    switch (variant) {
      case 'light':
        return '#ffffff';
      case 'dark':
        return '#3b82f6';
      case 'gradient':
      default:
        return 'url(#logoGradient)';
    }
  };

  return (
    <motion.div 
      className={`flex items-center space-x-3 ${className}`}
      initial={animated ? "initial" : "animate"}
      animate="animate"
      whileHover="hover"
    >
      {/* Logo Icon */}
      <motion.div
        variants={animated ? iconVariants : {}}
        className={`relative ${sizeClasses[size]} flex-shrink-0`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Medical Cross Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getIconFill()}
            strokeWidth="3"
            opacity="0.2"
          />
          
          {/* DNA Helix / Data Strand */}
          <path
            d="M20 30 Q35 25 50 30 Q65 35 80 30 M20 40 Q35 35 50 40 Q65 45 80 40 M20 50 Q35 45 50 50 Q65 55 80 50 M20 60 Q35 55 50 60 Q65 65 80 60 M20 70 Q35 65 50 70 Q65 75 80 70"
            stroke={getIconFill()}
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          
          {/* Medical Cross */}
          <rect
            x="45"
            y="25"
            width="10"
            height="50"
            rx="5"
            fill={getIconFill()}
            filter="url(#glow)"
          />
          <rect
            x="30"
            y="40"
            width="40"
            height="10"
            rx="5"
            fill={getIconFill()}
            filter="url(#glow)"
          />
          
          {/* Data Points / Molecules */}
          <circle cx="30" cy="30" r="3" fill={getIconFill()} opacity="0.8" />
          <circle cx="70" cy="35" r="2" fill={getIconFill()} opacity="0.6" />
          <circle cx="25" cy="65" r="2.5" fill={getIconFill()} opacity="0.7" />
          <circle cx="75" cy="70" r="2" fill={getIconFill()} opacity="0.9" />
          
          {/* Heartbeat Line */}
          <path
            d="M15 85 L25 85 L30 75 L35 95 L40 70 L45 90 L50 85 L85 85"
            stroke={getIconFill()}
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
        </svg>
        
        {/* Pulse Animation Ring */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-30"
            variants={pulseVariants}
            animate="animate"
          />
        )}
      </motion.div>

      {/* Logo Text */}
      <motion.div 
        variants={animated ? textVariants : {}}
        className="flex flex-col"
      >
        <span 
          className={`font-bold ${textSizes[size]} ${getIconColor()} leading-tight`}
        >
          CodeNomads
        </span>
        <span 
          className={`text-gray-600 ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'} font-medium -mt-1`}
        >
          Prediction Platform
        </span>
      </motion.div>
    </motion.div>
  );
};

// Icon-only version for compact spaces
export const LogoIcon: React.FC<Omit<LogoProps, 'size'> & { size?: number }> = ({ 
  size = 40, 
  variant = 'gradient', 
  animated = true,
  className = '' 
}) => {
  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  };

  const getIconFill = () => {
    switch (variant) {
      case 'light':
        return '#ffffff';
      case 'dark':
        return '#1f2937';
      case 'gradient':
      default:
        return 'url(#logoGradient)';
    }
  };

  return (
    <motion.div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      initial={animated ? "initial" : "animate"}
      animate="animate"
      whileHover="hover"
      variants={animated ? iconVariants : {}}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getIconFill()}
          strokeWidth="3"
          opacity="0.2"
        />
        
        <path
          d="M20 30 Q35 25 50 30 Q65 35 80 30 M20 40 Q35 35 50 40 Q65 45 80 40 M20 50 Q35 45 50 50 Q65 55 80 50 M20 60 Q35 55 50 60 Q65 65 80 60 M20 70 Q35 65 50 70 Q65 75 80 70"
          stroke={getIconFill()}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        
        <rect
          x="45"
          y="25"
          width="10"
          height="50"
          rx="5"
          fill={getIconFill()}
          filter="url(#glow)"
        />
        <rect
          x="30"
          y="40"
          width="40"
          height="10"
          rx="5"
          fill={getIconFill()}
          filter="url(#glow)"
        />
        
        <circle cx="30" cy="30" r="3" fill={getIconFill()} opacity="0.8" />
        <circle cx="70" cy="35" r="2" fill={getIconFill()} opacity="0.6" />
        <circle cx="25" cy="65" r="2.5" fill={getIconFill()} opacity="0.7" />
        <circle cx="75" cy="70" r="2" fill={getIconFill()} opacity="0.9" />
        
        <path
          d="M15 85 L25 85 L30 75 L35 95 L40 70 L45 90 L50 85 L85 85"
          stroke={getIconFill()}
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />
      </svg>
    </motion.div>
  );
};

export default Logo;
