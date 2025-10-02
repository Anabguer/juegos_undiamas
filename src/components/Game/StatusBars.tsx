'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export const StatusBars: React.FC = () => {
  const { hunger, thirst, health, isInfected, isCold, isShaking } = useGameStore();

  const getBarColor = (value: number, type: string) => {
    if (value > 70) return 'bg-green-500';
    if (value > 40) return 'bg-orange-500';
    if (value > 20) return 'bg-red-500';
    return 'bg-red-600';
  };

  const getBarWidth = (value: number) => {
    return `${Math.max(0, Math.min(100, value))}%`;
  };

  const getStatusIcon = (type: string, value: number) => {
    if (type === 'hunger') {
      return '/images/hambre.png';
    }
    if (type === 'thirst') {
      return '/images/sed.png';
    }
    if (type === 'health') {
      return '/images/salud.png';
    }
    return '/images/salud.png';
  };

  const shouldShake = (value: number) => {
    return value < 30;
  };

  const getShakeAnimation = () => ({
    x: [0, -2, 2, -2, 2, 0],
    y: [0, -1, 1, -1, 1, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 1,
      ease: "easeInOut"
    }
  });

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-2 sm:p-4 mb-4 sm:mb-6 relative">
      <div className="flex flex-row gap-2 sm:gap-4">
        {/* Barra de Hambre */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-1">
          <motion.img 
            src={getStatusIcon('hunger', hunger)} 
            alt="Hambre" 
            className="w-8 h-8 sm:w-10 sm:h-10"
            animate={shouldShake(hunger) ? getShakeAnimation() : {}}
          />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-white mb-1">
              <span className="hidden sm:block">Hambre</span>
              <span>{Math.round(hunger)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getBarColor(hunger, 'hunger')}`}
                style={{ width: getBarWidth(hunger) }}
              />
            </div>
          </div>
        </div>

        {/* Barra de Sed */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-1">
          <motion.img 
            src={getStatusIcon('thirst', thirst)} 
            alt="Sed" 
            className="w-6 h-6 sm:w-8 sm:h-8"
            animate={shouldShake(thirst) ? getShakeAnimation() : {}}
          />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-white mb-1">
              <span className="hidden sm:block">Sed</span>
              <span>{Math.round(thirst)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getBarColor(thirst, 'thirst')}`}
                style={{ width: getBarWidth(thirst) }}
              />
            </div>
          </div>
        </div>

        {/* Barra de Salud */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-1 relative">
          <motion.img 
            src={getStatusIcon('health', health)} 
            alt="Salud" 
            className="w-8 h-8 sm:w-10 sm:h-10"
            animate={shouldShake(health) ? getShakeAnimation() : {}}
          />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-white mb-1">
              <span className="hidden sm:block">Salud</span>
              <span>{Math.round(health)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 relative">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getBarColor(health, 'health')}`}
                style={{ width: getBarWidth(health) }}
              />
              {/* Gota roja cayendo cuando pierdes salud */}
              {isShaking && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <div className="w-2 h-3 bg-red-600 rounded-full opacity-80"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
