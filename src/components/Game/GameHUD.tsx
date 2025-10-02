'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { CHARACTERS } from '@/config/characters';

export const GameHUD: React.FC = () => {

  // Usar selectores específicos para asegurar que el componente se re-renderice
  // cuando cambien los valores específicos que necesitamos
  const day = useGameStore(state => state.day);
  const hour = useGameStore(state => state.hour);
  const minute = useGameStore(state => state.minute);
  const zombiesKilled = useGameStore(state => state.stats.zombiesKilled);
  const skipTutorial = useGameStore(state => state.skipTutorial);
  const setSkipTutorial = useGameStore(state => state.setSkipTutorial);
  const showRandomBearQuote = useGameStore(state => state.showRandomBearQuote);


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
      {/* Margen superior negro para móviles */}
      <div className="bg-black bg-opacity-90 w-full" style={{ paddingTop: 'env(safe-area-inset-top)', height: 'env(safe-area-inset-top)' }}></div>
      {/* Barra negra horizontal completa */}
      <div className="bg-black bg-opacity-90 w-full px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Lado izquierdo: Día/Hora + Zombis */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
            {/* Día/Hora */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="text-xl sm:text-2xl">
                {hour >= 6 && hour < 20 ? '☀️' : '🌙'}
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-base font-bold text-yellow-400 w-12 text-center">
                  {formatTime(hour, minute)}
                </div>
                <div className="text-sm sm:text-base text-gray-300 font-bold hidden sm:block">
                  Día {day} - {CHARACTERS.PROTAGONIST.name}
                </div>
                <div className="text-sm text-gray-300 font-bold sm:hidden">
                  Día {day}
                </div>
              </div>
            </div>
            
            {/* Separador */}
            <div className="w-px h-8 bg-gray-400 mx-4 sm:mx-8"></div>
            
              {/* Zombis */}
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <img 
                  src="/images/zombies.png" 
                  alt="Zombies" 
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  style={{ maxWidth: 'none' }}
                />
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-red-400">
                    {zombiesKilled}
                  </div>
                  <div className="text-xs text-gray-300 hidden sm:block">Zombis</div>
                </div>
              </div>
          </div>
          
          {/* Centro vacío para balance */}
          <div className="flex-1"></div>
          
          {/* Lado derecho: Controles */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
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
              className="bg-black bg-opacity-60 border-2 border-yellow-400 w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-opacity-80 transition-colors touch-manipulation flex items-center justify-center"
              title={useGameStore.getState().isPaused ? "Continuar" : "Pausar"}
            >
              {useGameStore.getState().isPaused ? (
                <div className="w-2 h-3.5 sm:w-2 sm:h-4 bg-yellow-400 rounded-sm"></div>
              ) : (
                <div className="flex items-center justify-center space-x-0.5">
                  <div className="w-1 h-3 sm:w-1 sm:h-3 bg-yellow-400 rounded-sm"></div>
                  <div className="w-1 h-3 sm:w-1 sm:h-3 bg-yellow-400 rounded-sm"></div>
                </div>
              )}
            </button>
            
            {/* Botón de ranking */}
            <button
              onClick={() => {
                const { pauseGame, setShowRanking } = useGameStore.getState();
                pauseGame();
                setShowRanking(true);
              }}
              className="bg-black bg-opacity-60 border-2 border-yellow-400 w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-opacity-80 transition-colors touch-manipulation flex items-center justify-center"
              title="Ranking"
            >
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <div className="w-3 h-0.5 bg-yellow-400 rounded-sm"></div>
                <div className="w-2 h-0.5 bg-yellow-400 rounded-sm"></div>
                <div className="w-1 h-0.5 bg-yellow-400 rounded-sm"></div>
              </div>
            </button>
            
            {/* Botón de configuración */}
            <button
              onClick={() => {
                const { pauseGame, setShowSettings } = useGameStore.getState();
                pauseGame();
                setShowSettings(true);
              }}
              className="bg-black bg-opacity-60 border-2 border-yellow-400 w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-opacity-80 transition-colors touch-manipulation flex items-center justify-center"
              title="Configuración"
            >
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <div className="w-2 h-2 border border-yellow-400 rounded-full"></div>
                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
              </div>
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};
