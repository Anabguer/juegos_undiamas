'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface RankingEntry {
  position: number;
  name: string;
  score: number;
  days: number;
  zombies: number;
  isCurrentUser: boolean;
}

export const RankingModal: React.FC = () => {
  const { showRanking, setShowRanking, resumeGame, day, stats } = useGameStore();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [currentUserPosition, setCurrentUserPosition] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular datos de ranking (en un juego real vendrían de una API)
  useEffect(() => {
    if (showRanking) {
      setIsLoading(true);
      
      // Simular carga de datos
      setTimeout(() => {
        const mockRanking: RankingEntry[] = [
          { position: 1, name: 'ZombieKiller99', score: 15420, days: 12, zombies: 89, isCurrentUser: false },
          { position: 2, name: 'SurvivorPro', score: 12850, days: 10, zombies: 76, isCurrentUser: false },
          { position: 3, name: 'ApocalypseMaster', score: 11200, days: 9, zombies: 65, isCurrentUser: false },
          { position: 4, name: 'NightWalker', score: 9850, days: 8, zombies: 58, isCurrentUser: false },
          { position: 5, name: 'ZombieHunter', score: 9200, days: 7, zombies: 52, isCurrentUser: false },
          { position: 6, name: 'SurvivalExpert', score: 8750, days: 7, zombies: 48, isCurrentUser: false },
          { position: 7, name: 'EndGame', score: 8200, days: 6, zombies: 45, isCurrentUser: false },
          { position: 8, name: 'LastStand', score: 7800, days: 6, zombies: 42, isCurrentUser: false },
          { position: 9, name: 'ZombieSlayer', score: 7200, days: 5, zombies: 38, isCurrentUser: false },
          { position: 10, name: 'Survivor', score: 6800, days: 5, zombies: 35, isCurrentUser: false },
          // Usuario actual (simulado)
          { position: 15, name: 'Tú (Anónimo)', score: stats.zombiesKilled * 100 + day * 50, days: day, zombies: stats.zombiesKilled, isCurrentUser: true },
        ];
        
        setRanking(mockRanking);
        setCurrentUserPosition(15);
        setIsLoading(false);
      }, 1000);
    }
  }, [showRanking, stats.zombiesKilled, day]);

  if (!showRanking) return null;

  const handleClose = () => {
    setShowRanking(false);
    resumeGame();
  };

  const scrollToCurrentUser = () => {
    if (currentUserPosition) {
      const element = document.getElementById(`ranking-${currentUserPosition}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full h-full sm:max-w-lg sm:h-[500px] sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fondo de ranking */}
        <div
          className="absolute inset-0 bg-cover bg-center sm:rounded-lg"
          style={{
            backgroundImage: 'url(/images/bg_ranking.png)',
            backgroundSize: '120%',
            backgroundPosition: 'center',
            filter: 'blur(2px)'
          }}
        />
        <div className="absolute inset-0 sm:rounded-lg">
          {/* Contenido del modal */}
          <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col" style={{ marginTop: '15%' }}>
            {/* Título */}
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-black text-yellow-400 flex items-center justify-center space-x-3" style={{ 
                fontFamily: 'Comic Sans MS, cursive',
                textShadow: '4px 4px 0px #000, -3px -3px 0px #000, 3px -3px 0px #000, -3px 3px 0px #000'
              }}>
                <img src="/images/ranking.png" alt="Ranking" className="w-8 h-8" />
                <span>RANKING</span>
              </h2>
            </div>


            {/* Lista de ranking */}
            <div className="flex-1 bg-black bg-opacity-50 rounded-lg p-3 overflow-y-auto border-2 border-amber-600" style={{ 
              maxHeight: '450px',
              marginTop: '1rem',
              boxShadow: 'inset 0 0 10px rgba(180, 83, 9, 0.3), 0 0 15px rgba(180, 83, 9, 0.2)'
            }}>
              {isLoading ? (
                <div className="text-center text-white py-8">
                  <div className="text-2xl mb-4">⏳</div>
                  <div style={{ fontFamily: 'Comic Sans MS, cursive' }}>Cargando ranking...</div>
                </div>
              ) : (
                <div className="space-y-1">
                  {ranking.map((entry) => (
                    <div
                      key={entry.position}
                      id={`ranking-${entry.position}`}
                      className={`flex items-center p-1 rounded-lg text-xs ${
                        entry.isCurrentUser 
                          ? 'bg-yellow-400 bg-opacity-30 border-2 border-yellow-400' 
                          : 'bg-gray-800 bg-opacity-50'
                      }`}
                    >
                      {/* Posición */}
                      <div className="w-5 text-center">
                        <span className={`text-xs font-bold ${
                          entry.position <= 3 ? 'text-yellow-400' : 'text-white'
                        }`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                          {entry.position <= 3 ? ['🥇', '🥈', '🥉'][entry.position - 1] : entry.position}
                        </span>
                      </div>
                      
                      {/* Nombre */}
                      <div className="flex-1 ml-1 min-w-0">
                        <span className="text-white font-bold text-xs" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                          {entry.name}
                        </span>
                      </div>

                      {/* Estadísticas compactas */}
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="text-center w-12">
                          <div className="text-green-400 font-bold text-xs" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                            {entry.days}
                          </div>
                          <div className="text-gray-300 text-xs" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                            días
                          </div>
                        </div>
                        <div className="text-center w-12">
                          <div className="text-red-400 font-bold text-xs" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                            {entry.zombies}
                          </div>
                          <div className="text-gray-300 text-xs" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                            zombis
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botón de cerrar */}
            <div className="text-center" style={{ marginTop: '3rem' }}>
              <button
                onClick={handleClose}
                className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm font-black hover:bg-yellow-300 transition-colors touch-manipulation shadow-2xl border-4 border-black transform hover:scale-105 relative"
                style={{ 
                  minHeight: '40px',
                  fontFamily: 'Comic Sans MS, cursive',
                  textShadow: '2px 2px 0px #000',
                  boxShadow: '4px 4px 0px #000, 0 0 20px rgba(255, 255, 0, 0.6), 0 0 40px rgba(255, 255, 0, 0.3)',
                  border: '4px solid #000, 2px solid rgba(255, 255, 0, 0.8)'
                }}
              >
                {/* Efecto de resplandor sucio */}
                <div 
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(45deg, rgba(255, 255, 0, 0.3) 0%, rgba(255, 255, 0, 0.1) 50%, rgba(255, 255, 0, 0.3) 100%)',
                    filter: 'blur(1px)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                CERRAR
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
