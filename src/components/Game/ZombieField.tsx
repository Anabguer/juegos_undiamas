'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export const ZombieField: React.FC = () => {
  const { zombies, zombieDeathEffect } = useGameStore();
  
  // Debug: mostrar posiciones de zombies
  if (zombies.length > 0) {
    console.log(`ZOMBIE FIELD - Zombies en pantalla: ${zombies.length}, Posiciones: ${zombies.map(z => z.position.toFixed(1)).join(', ')}`);
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
    <div className="mb-4 sm:mb-8">
      <h3 className="text-white text-center text-lg sm:text-xl font-bold mb-2 sm:mb-4">Campo de Batalla</h3>
      
      {/* Campo de 6 casillas (0-5) */}
      <div className="grid grid-cols-6 gap-1 sm:gap-2 max-w-2xl mx-auto">
        {Array.from({ length: 6 }, (_, index) => {
          // Buscar zombie en esta casilla (redondeando la posición)
          const zombie = zombies.find(z => Math.round(z.position) === index);
          
          return (
            <div
              key={index}
              className="h-16 sm:h-20 bg-gray-800 bg-opacity-50 rounded-lg border-2 border-gray-600 flex items-center justify-center relative touch-manipulation"
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
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                  />
                </motion.div>
              ) : zombieDeathEffect && zombieDeathEffect.position === index && zombieDeathEffect.isActive ? (
                <div className="relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 1, rotate: 0 }}
                    animate={{ 
                      scale: [1, 1.5, 0],
                      rotate: [0, 360, 720],
                      x: [0, 50, 100],
                      y: [0, -25, -50],
                      opacity: [1, 0.5, 0]
                    }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  >
                    <img 
                      src={getZombieImage({ id: zombieDeathEffect.zombieId })} 
                      alt="Zombi muerto"
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    />
                    {/* Efecto de bate volando hacia el zombie */}
                    <motion.img
                      src="/images/bat.png"
                      alt="Bate"
                      className="absolute w-8 h-8 sm:w-10 sm:h-10 object-contain"
                      initial={{ x: -50, y: 0, scale: 0 }}
                      animate={{ 
                        x: [0, 25, 50],
                        y: [0, -12, -25],
                        scale: [0, 1, 0.5],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
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
