'use client';

import React, { useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ZombieField: React.FC = () => {
  const { zombies, zombieDeathEffect } = useGameStore();
  const prevZombieCount = useRef(0);
  
  // Debug: mostrar posiciones de zombies
  if (zombies.length > 0) {
    // Solo mostrar cuando hay cambios en el número de zombies
    if (zombies.length !== prevZombieCount.current) {
      console.log(`ZOMBIE FIELD - Zombies: ${zombies.length}`);
      prevZombieCount.current = zombies.length;
    }
  }
  
  // Debug: mostrar efecto de muerte de zombie
  if (zombieDeathEffect) {
    console.log(`ZOMBIE FIELD - Efecto de muerte activo:`, zombieDeathEffect);
  }

  const getZombieImage = (zombie: any) => {
    const images = ['/images/zombie1.png', '/images/zombie2.png', '/images/zombie3.png', '/images/zombie4.png'];
    // Usar el ID del zombie para obtener un índice consistente
    const hash = zombie.id.split('_')[1] || '0'; // Obtener la parte numérica del ID
    const index = parseInt(hash) % images.length;
    return images[index];
  };

  const getZombieColor = (type: string) => {
    switch (type) {
      case 'slow':
        return 'text-blue-400';
      case 'normal':
        return 'text-green-400';
      case 'fast':
        return 'text-red-400';
      case 'resistant':
        return 'text-purple-400';
      default:
        return 'text-green-400';
    }
  };

  // Los zombies ya no se pueden hacer clic directamente
  // Ahora se matan usando el bate desde el inventario

  return (
    <div className="mb-4 sm:mb-8 relative">
      <h3 className="text-white text-center text-lg sm:text-xl font-bold mb-2 sm:mb-4">Campo de Batalla</h3>
      
      {/* Campo de 6 casillas (0-5) */}
      <div className="grid grid-cols-6 gap-1 sm:gap-2 max-w-2xl mx-auto relative px-2">
        {Array.from({ length: 6 }, (_, index) => {
          // Buscar zombie en esta casilla (redondeando la posición)
          const zombie = zombies.find(z => Math.round(z.position) === index);
          const isDeathCell = zombieDeathEffect && zombieDeathEffect.position === index && zombieDeathEffect.isActive;
          
          return (
            <div
              key={index}
              className="h-14 sm:h-16 md:h-20 bg-gray-800 bg-opacity-50 rounded-lg border-2 border-gray-600 flex items-center justify-center relative touch-manipulation overflow-visible"
              style={{ minHeight: '44px' }}
            >
              {zombie ? (
                <motion.div
                  className="relative flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  title={`Zombi ${zombie.type} - Usa el bate del inventario para matarlo`}
                >
                  <img 
                    src={getZombieImage(zombie)} 
                    alt="Zombi"
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain"
                  />
                </motion.div>
              ) : isDeathCell ? (
                // Efecto cuando el zombie muere en esta casilla - ESTILO COMIC SUCIO
                <div className="absolute inset-0 overflow-visible pointer-events-none">
                  {/* Zombie girando y volando hacia arriba-IZQUIERDA (hacia el contador de zombies) */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]"
                    initial={{ x: 0, y: 0, scale: 1.2, rotate: 0, opacity: 1 }}
                    animate={{ 
                      x: [0, -100, -250, -450, -600], // Invertido para ir a la IZQUIERDA
                      y: [0, -80, -200, -350, -500],
                      scale: [1.2, 1.3, 1, 0.5, 0],
                      rotate: [0, 360, 720, 1080, 1440], // 4 vueltas completas
                      opacity: [1, 1, 1, 0.7, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      ease: "easeOut",
                      times: [0, 0.2, 0.4, 0.7, 1]
                    }}
                  >
                    <img 
                      src={getZombieImage({ id: zombieDeathEffect.zombieId })} 
                      alt="Zombi muerto"
                      className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.8))'
                      }}
                    />
                  </motion.div>

                  {/* Polvo/Humo de impacto - ESTILO COMIC SUCIO */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[90]"
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ 
                      scale: [0, 1.5, 2.5],
                      opacity: [0.8, 0.4, 0]
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <div className="w-20 h-20 rounded-full bg-gray-600 blur-md" />
                  </motion.div>

                  {/* Bate golpeando desde la derecha */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[95]"
                    initial={{ x: 40, y: -20, rotate: -45, opacity: 1, scale: 1 }}
                    animate={{ 
                      x: [40, -10, -30],
                      y: [-20, 0, 10],
                      rotate: [-45, -90, -120],
                      opacity: [1, 1, 0],
                      scale: [1, 1.1, 0.8]
                    }}
                    transition={{ 
                      duration: 0.5, 
                      ease: "easeIn",
                      times: [0, 0.5, 1]
                    }}
                  >
                    <img 
                      src="/images/bat.png" 
                      alt="Bate"
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                      style={{
                        filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))'
                      }}
                    />
                  </motion.div>
                </div>
              ) : (
                <div className="text-gray-500 text-xs sm:text-sm">
                  {index === 0 ? (
                    <img 
                      src="/images/casillacucho.png" 
                      alt="Cucho" 
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    />
                  ) : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
