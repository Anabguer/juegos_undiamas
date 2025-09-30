'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { CHARACTERS } from '@/config/characters';

export const GameHUD: React.FC = () => {
  const { day, hour, minute, stats, skipTutorial, setSkipTutorial, showRandomBearQuote } = useGameStore();

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
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Barra negra horizontal completa */}
      <div className="bg-black bg-opacity-90 w-full px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Lado izquierdo: Día y Zombis */}
          <div className="flex items-center space-x-4 sm:space-x-6">
                   {/* Día/Hora */}
                   <div className="flex items-center space-x-2">
                     <div className="text-xl sm:text-2xl">
                       {hour >= 6 && hour < 20 ? '☀️' : '🌙'}
                     </div>
                     <div className="text-center">
                       <div className="text-sm sm:text-base font-bold text-yellow-400">
                         {formatTime(hour, minute)}
                       </div>
                       <div className="text-xs text-gray-300">
                         Día {day} - {CHARACTERS.PROTAGONIST.name}
                       </div>
                     </div>
                   </div>
            
            {/* Zombis */}
            <div className="flex items-center space-x-2">
              <img 
                src="/images/zombies.png" 
                alt="Zombies" 
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
              <div className="text-center">
                <div className="text-base sm:text-xl font-bold text-red-400">
                  {stats.zombiesKilled}
                </div>
                <div className="text-xs text-gray-300">Zombis</div>
              </div>
            </div>
          </div>
          
                 {/* Lado derecho: Controles */}
                 <div className="flex items-center space-x-2">
                   {/* Botón de pausa */}
                   <button
                     onClick={() => {
                       const { isPaused, pauseGame, resumeGame } = useGameStore.getState();
                       if (isPaused) {
                         resumeGame();
                       } else {
                         pauseGame();
                       }
                     }}
                     className="bg-black bg-opacity-60 border-2 border-yellow-400 w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-opacity-80 transition-colors touch-manipulation flex items-center justify-center"
                     title={useGameStore.getState().isPaused ? "Continuar" : "Pausar"}
                   >
                     {useGameStore.getState().isPaused ? (
                       <div className="w-2 h-4 bg-yellow-400 rounded-sm"></div>
                     ) : (
                       <div className="flex items-center justify-center space-x-0.5">
                         <div className="w-1 h-3 bg-yellow-400 rounded-sm"></div>
                         <div className="w-1 h-3 bg-yellow-400 rounded-sm"></div>
                       </div>
                     )}
                   </button>
                   
                   {/* Botón de ayuda */}
                   <button
                     onClick={() => {
                       const { pauseGame, setShowHelp } = useGameStore.getState();
                       pauseGame();
                       setShowHelp(true);
                     }}
                     className="bg-black bg-opacity-60 border-2 border-yellow-400 w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-opacity-80 transition-colors touch-manipulation flex items-center justify-center"
                     title="Ayuda"
                   >
                     <div className="text-yellow-400 font-black text-sm sm:text-base">?</div>
                   </button>
                   
                   
                 </div>
        </div>
      </div>
    </div>
  );
};
