'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';

export const GameHUD: React.FC = () => {
  const { day, hour, minute, stats } = useGameStore();

  const formatTime = (hour: number, minute: number) => {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const getTimeOfDay = (hour: number) => {
    if (hour >= 6 && hour < 12) return '🌅 Mañana';
    if (hour >= 12 && hour < 18) return '☀️ Día';
    if (hour >= 18 && hour < 22) return '🌆 Tarde';
    return '🌙 Noche';
  };

  return (
    <div className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50">
      <div className="bg-black bg-opacity-70 rounded-lg p-2 sm:p-4 text-white">
        <div className="flex items-center space-x-2">
          <img 
            src="/images/zombies.png" 
            alt="Zombies" 
            className="w-6 h-6 sm:w-8 sm:h-8"
          />
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-red-400">
              {stats.zombiesKilled}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Zombis</div>
          </div>
        </div>
      </div>
    </div>
  );
};
