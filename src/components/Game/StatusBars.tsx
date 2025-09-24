'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';

export const StatusBars: React.FC = () => {
  const { hunger, thirst, health, isInfected, isCold } = useGameStore();

  const getBarColor = (value: number, type: string) => {
    if (value > 70) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    if (value > 20) return 'bg-orange-500';
    return 'bg-red-500';
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

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-2 sm:p-4 mb-4 sm:mb-6">
      <div className="flex flex-row gap-1 sm:gap-4">
        {/* Barra de Hambre */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-1">
          <img 
            src={getStatusIcon('hunger', hunger)} 
            alt="Hambre" 
            className="w-4 h-4 sm:w-6 sm:h-6"
          />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-white mb-1">
              <span className="hidden sm:block">Hambre</span>
              <span>{hunger}%</span>
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
          <img 
            src={getStatusIcon('thirst', thirst)} 
            alt="Sed" 
            className="w-4 h-4 sm:w-6 sm:h-6"
          />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-white mb-1">
              <span className="hidden sm:block">Sed</span>
              <span>{thirst}%</span>
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
        <div className="flex items-center space-x-1 sm:space-x-2 flex-1">
          <img 
            src={getStatusIcon('health', health)} 
            alt="Salud" 
            className="w-4 h-4 sm:w-6 sm:h-6"
          />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-white mb-1">
              <span className="hidden sm:block">Salud</span>
              <span>{health}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getBarColor(health, 'health')}`}
                style={{ width: getBarWidth(health) }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Estados especiales */}
      <div className="mt-2 sm:mt-4 flex justify-center space-x-2 sm:space-x-4">
        {isInfected && (
          <div className="flex items-center space-x-1 sm:space-x-2 text-green-400">
            <span className="text-lg sm:text-xl">🦠</span>
            <span className="text-xs sm:text-sm font-semibold">Contagiado</span>
          </div>
        )}
        {isCold && (
          <div className="flex items-center space-x-1 sm:space-x-2 text-blue-400">
            <span className="text-lg sm:text-xl">❄️</span>
            <span className="text-xs sm:text-sm font-semibold">Frío</span>
          </div>
        )}
      </div>
    </div>
  );
};
