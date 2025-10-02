'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface RatsMinigameProps {
  isVisible: boolean;
  cardId: string;
  onComplete: () => void;
  onTimeout: () => void;
}

interface Rat {
  id: number;
  image: string;
  position: { x: number; y: number };
  clicked: boolean;
}

export const RatsMinigame: React.FC<RatsMinigameProps> = ({ 
  isVisible, 
  cardId, 
  onComplete,
  onTimeout 
}) => {
  const [rats, setRats] = useState<Rat[]>([]);
  const [ratsKilled, setRatsKilled] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const totalRats = 10;

  // Generar posiciones aleatorias para las ratas cuando se abre el minijuego
  useEffect(() => {
    const startTime = performance.now();
    console.log(`RATAS MINIGAME - useEffect triggered - isVisible: ${isVisible}, rats.length: ${rats.length}, timestamp: ${Date.now()}`);
    
    if (isVisible && rats.length === 0) {
      console.log(`RATAS MINIGAME - Iniciando generación de ratas...`);
      
      const ratImages = [
        '/images/rata1.png',
        '/images/rata2.png',
        '/images/rata3.png',
        '/images/rata4.png',
        '/images/rata5.png'
      ];

      const newRats: Rat[] = [];
      
      // Generar exactamente 10 ratas con posiciones aleatorias simples
      for (let i = 0; i < totalRats; i++) {
        const position = {
          x: 10 + Math.random() * 80, // 10-90% (más margen en los lados)
          y: 25 + Math.random() * 60  // 25-85% (más margen arriba y abajo)
        };
        
        newRats.push({
          id: i,
          image: ratImages[i % ratImages.length],
          position: position,
          clicked: false
        });
      }
      
      const generationTime = performance.now() - startTime;
      console.warn(`🐀 RATAS MINIGAME - Generadas ${newRats.length} ratas de ${totalRats} esperadas en ${generationTime.toFixed(2)}ms`);
      console.warn(`🐀 RATAS MINIGAME - Posiciones de ratas:`, newRats.map(r => `(${r.position.x.toFixed(1)}%, ${r.position.y.toFixed(1)}%)`));
      console.warn(`🐀 RATAS MINIGAME - ¡TODO BIEN! Las ratas se generaron correctamente. Si las ves lentas, es tu ordenador.`);
      
      setRats(newRats);
      setTimeLeft(15); // Resetear el tiempo
      console.log(`RATAS MINIGAME - Estado inicializado - tiempo: 15s, ratas: ${newRats.length}`);
    }
  }, [isVisible]);

  // Timer de 15 segundos
  useEffect(() => {
    if (isVisible && timeLeft > 0 && ratsKilled < totalRats) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isVisible && timeLeft === 0 && ratsKilled < totalRats) {
      // Tiempo agotado
      console.log(`RATAS MINIGAME - ¡Tiempo agotado! Solo ${ratsKilled}/${totalRats} ratas`);
      onTimeout();
      // Reset
      setRats([]);
      setRatsKilled(0);
      setTimeLeft(15);
    }
  }, [isVisible, timeLeft, ratsKilled, onTimeout]);

  // Verificar si todas las ratas han sido clickeadas
  useEffect(() => {
    if (ratsKilled === totalRats && ratsKilled > 0) {
      console.log(`RATAS MINIGAME - ¡Todas las ratas eliminadas! (${ratsKilled}/${totalRats})`);
      // Delay más largo para que se vea la última rata antes de cerrar
      setTimeout(() => {
        console.log(`RATAS MINIGAME - Llamando a onComplete()`);
        onComplete();
        // Reset para la próxima vez
        setRats([]);
        setRatsKilled(0);
      }, 800);
    }
  }, [ratsKilled, onComplete]);

  const handleRatClick = (ratId: number) => {
    console.log(`RATAS MINIGAME - Clic en rata ${ratId}`);
    
    // Solo permitir clic si la rata no ha sido clickeada
    const rat = rats.find(r => r.id === ratId);
    if (!rat || rat.clicked) {
      console.log(`RATAS MINIGAME - Rata ${ratId} no encontrada o ya clickeada`);
      return;
    }
    
    console.log(`RATAS MINIGAME - Rata ${ratId} clickeada correctamente`);
    
    // Reproducir sonido de rata
    const { playRat, soundEnabled } = useGameStore.getState();
    if (playRat && soundEnabled) {
      console.log(`RATAS MINIGAME - Reproduciendo sonido de rata`);
      playRat();
    }
    
    setRats(prevRats =>
      prevRats.map(r =>
        r.id === ratId ? { ...r, clicked: true } : r
      )
    );
    setRatsKilled(prev => {
      const newCount = prev + 1;
      console.log(`RATAS MINIGAME - Ratas eliminadas: ${newCount}/${totalRats}`);
      return newCount;
    });
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-95"
      onClick={(e) => {
        // Evitar cerrar al hacer clic en el fondo
        e.stopPropagation();
      }}
    >
      <div className="relative w-full max-w-4xl h-[600px] mx-4 overflow-hidden">
        {/* Fondo de la habitación con borde animado molesto */}
        <div
          className="absolute inset-0 bg-cover bg-center rounded-lg animate-pulse overflow-hidden"
          style={{
            backgroundImage: 'url(/images/Minijuego_ratas.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 0 20px 5px rgba(255, 0, 0, 0.6), inset 0 0 30px rgba(255, 0, 0, 0.3)',
            border: '4px solid rgba(255, 0, 0, 0.8)',
            animation: 'pulse 1s ease-in-out infinite'
          }}
        >
          {/* Título simple */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
            <p className="text-2xl sm:text-3xl font-black text-yellow-400" style={{ 
              fontFamily: 'Comic Sans MS, cursive',
              textShadow: '3px 3px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
            }}>
              ¡ELIMINA LAS RATAS!
            </p>
          </div>

          {/* Ratas */}
          <AnimatePresence>
            {rats.map((rat, index) => {
              // Log solo para la primera rata para confirmar que se renderiza
              if (index === 0) {
                console.warn(`🐀 RATAS MINIGAME - ¡RENDERIZANDO RATAS! Total: ${rats.length}, Primera rata en posición (${rat.position.x.toFixed(1)}%, ${rat.position.y.toFixed(1)}%)`);
              }
              return (
                <motion.div
                  key={rat.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={!rat.clicked ? {
                    scale: 1,
                    opacity: 1,
                    y: [0, -3, 0], // Movimiento más sutil
                  } : {
                    scale: [1, 1.2, 0],
                    opacity: [1, 0.8, 0],
                    rotate: [0, 180, 360],
                    y: [0, -20, -30]
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0
                  }}
                  transition={!rat.clicked ? {
                    // Aparición INMEDIATA y SIMPLE
                    scale: { duration: 0.05, delay: 0 },
                    opacity: { duration: 0.05, delay: 0 },
                    y: {
                      duration: 1.0,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0
                    }
                  } : {
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  className="absolute cursor-pointer hover:scale-110 transition-transform pointer-events-auto"
                  style={{
                    left: `${rat.position.x}%`,
                    top: `${rat.position.y}%`,
                    transform: 'translate(-50%, -50%)', // Centrar la rata en su posición
                    zIndex: 30
                  }}
                  onClick={() => handleRatClick(rat.id)}
                >
                <div className="relative">
                  {/* Fondo circular sutil para mejor visibilidad */}
                  <div 
                    className="absolute inset-0 rounded-full bg-white bg-opacity-20 blur-sm"
                    style={{
                      width: '120%',
                      height: '120%',
                      left: '-10%',
                      top: '-10%'
                    }}
                  />
                  <img
                    src={rat.image}
                    alt="Rata"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain relative z-10"
                    style={{
                      filter: rat.clicked 
                        ? 'drop-shadow(2px 2px 8px rgba(255, 0, 0, 0.8)) brightness(1.5)' 
                        : 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8)) brightness(1.1)'
                    }}
                  />
                </div>
                
                {/* Efecto de golpe al clickear */}
                {rat.clicked && (
                  <>
                    {/* Flash de impacto */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ 
                        scale: [0, 2, 3],
                        opacity: [1, 0.5, 0]
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="w-16 h-16 rounded-full bg-red-500 blur-md" />
                    </motion.div>
                    
                    {/* Texto "SPLAT!" */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      initial={{ scale: 0, opacity: 0, y: 0 }}
                      animate={{ 
                        scale: [0, 1.5, 1],
                        opacity: [0, 1, 0],
                        y: [0, -20, -30]
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="text-red-600 font-black text-xl sm:text-2xl" style={{
                        textShadow: '2px 2px 0 #000, -1px -1px 0 #000',
                        fontFamily: 'Impact, fantasy',
                        WebkitTextStroke: '1px black'
                      }}>
                        SPLAT!
                      </div>
                    </motion.div>
                  </>
                )}
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

